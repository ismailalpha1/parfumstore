"use server";

import { backendClient } from "@/sanity/lib/backendClient";
import { revalidatePath } from "next/cache";

export interface OrderMetadata {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  clerkUserId?: string;
  address: {
    _id?: string;
    name?: string;
    adress?: string;
    city?: string;
    zip?: string;
  };
}

export interface OrderItem {
  product: {
    _id: string;
    name?: string;
    price?: number;
  };
  quantity: number;
}

export async function createOrder(
  items: OrderItem[],
  metadata: OrderMetadata,
) {
  try {
    if (!items || items.length === 0) {
      throw new Error("Your cart is empty.");
    }

    if (!metadata.address) {
      throw new Error("A delivery address is required.");
    }

    if (!metadata.customerEmail) {
      throw new Error("Customer email is required.");
    }

    /*
     * Build Sanity product references
     */
    const products = items.map((item) => {
      if (!item.product?._id) {
        throw new Error("Invalid product in cart.");
      }

      if (!item.quantity || item.quantity <= 0) {
        throw new Error(
          `Invalid quantity for ${item.product.name ?? "product"}`,
        );
      }

      return {
        _key: crypto.randomUUID(),
        product: {
          _type: "reference",
          _ref: item.product._id,
        },
        quantity: item.quantity,
      };
    });

    /*
     * Calculate total on the server.
     *
     * Never trust the total sent by the client.
     */
    let totalPrice = 0;

    for (const item of items) {
      const price = Number(item.product.price);

      if (!Number.isFinite(price) || price < 0) {
        throw new Error(
          `Invalid price for product: ${item.product.name ?? item.product._id}`,
        );
      }

      totalPrice += price * item.quantity;
    }

    /*
     * Check stock before creating the order
     */
    for (const item of items) {
      const product = await backendClient.getDocument(item.product._id);

      if (!product) {
        throw new Error(
          `Product not found: ${item.product.name ?? item.product._id}`,
        );
      }

      if (typeof product.stock !== "number") {
        throw new Error(
          `Stock is not configured for ${item.product.name ?? item.product._id}`,
        );
      }

      if (product.stock < item.quantity) {
        throw new Error(
          `Not enough stock for ${item.product.name ?? "product"}. Available: ${product.stock}`,
        );
      }
    }

    /*
     * Create the order
     */
    const order = await backendClient.create({
      _type: "order",

      orderNumber: metadata.orderNumber,

      customerName: metadata.customerName,
      email: metadata.customerEmail,
      clerkUserId: metadata.clerkUserId,

      products,

      currency: "MAD",
      totalPrice,

      amountDiscount: 0,

      status: "pending",

      paymentMethod: "cash_on_delivery",
      paymentStatus: "unpaid",

      orderDate: new Date().toISOString(),

      address: {
        name: metadata.address.name,
        address: metadata.address.adress,
        city: metadata.address.city,
        zip: metadata.address.zip,
      },
    });

    /*
     * Update stock
     */
    for (const item of items) {
      const product = await backendClient.getDocument(item.product._id);

      if (!product || typeof product.stock !== "number") {
        continue;
      }

      const newStock = Math.max(
        product.stock - item.quantity,
        0,
      );

      await backendClient
        .patch(item.product._id)
        .set({
          stock: newStock,
        })
        .commit();
    }

    /*
     * Revalidate product pages
     */
    revalidatePath("/");

    return {
      success: true,
      orderId: order._id,
      orderNumber: metadata.orderNumber,
      totalPrice,
    };
  } catch (error) {
    console.error("❌ Error creating order:", error);

    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to create order.",
    );
  }
}