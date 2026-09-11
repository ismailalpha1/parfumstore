"use server";

import { Adress } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import { CartItem } from "@/store";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export interface Metadata {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  clerkUserId?: string;
  adress?: Adress | null;
}
export interface GroupedCartItems {
  product: CartItem["product"];
  quantity: number;
}

export async function createCheckoutSession(
  items: GroupedCartItems[],
  metadata: Metadata,
) {
    try{
        if (!items || items.length === 0) {
            throw new Error("Cart is empty");
        }

        if (!process.env.NEXT_PUBLIC_BASE_URL) {
            throw new Error("NEXT_PUBLIC_BASE_URL is not defined");
        }

        const customers = await stripe.customers.list({
            email: metadata.customerEmail,
            limit:1
        });
        const customerId = customers?.data?.length > 0 ? customers.data[0].id : "";

        const lineItems = items.map((item) => {
            const price = Number(item.product.price);

            if (!Number.isFinite(price) || price <= 0) {
                throw new Error(
                `Invalid price for product "${item.product.name}": ${item.product.price}`
                );
            }

            return {
                price_data: {
                currency: "USD",
                unit_amount: Math.round(price * 100),

                product_data: {
                    name: item.product.name || "Unnamed Product",
                    description: item.product.description || undefined,

                    metadata: {
                    id: item.product._id,
                    },

                    images:
                    item.product.images &&
                    item.product.images.length > 0
                        ? [urlFor(item.product.images[0]).url()]
                        : undefined,
                },
                },

                quantity: item.quantity,
            };
        });

        const sessionPayload:Stripe.Checkout.SessionCreateParams={
            metadata:{
                orderNumber:metadata.orderNumber,
                customerName: metadata.customerName,
                customerEmail:metadata.customerEmail,
                clerkUserId: metadata.clerkUserId!,
                address:JSON.stringify(metadata.adress)
            },
            mode:"payment",
            allow_promotion_codes:true,
            payment_method_types:["card"],
            invoice_creation:{
                enabled:true,
            },
            success_url:`${
                process.env.Next_PUBLIC_BASE_URL
            }/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`,
            cancel_url:`${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
            line_items: lineItems,
            // line_items: items.map((item)=>({
            //     price_data:{
            //         currency:"USD",
            //         unit_amount: Math.round(Number(item.product.price)*100),
            //         product_data:{
            //             name: item.product.name || "Unnamed Product",
            //             description: item.product.description,
            //             metadata:{ id: item.product._id},
            //             images:
            //             item.product.images && item.product.images.length > 0
            //             ? [urlFor(item.product.images[0]).url()]
            //             : undefined,
            //         },
            //     },
            //     quantity: item.quantity,
            // }))
        };
        if(customerId){
            sessionPayload.customer = customerId;
        } else {
            sessionPayload.customer_email = metadata.customerEmail;
        }
        console.log("Creating Stripe session...");
        console.log("Line items:", lineItems);
        console.log("Success URL:", sessionPayload.success_url);
        console.log("Cancel URL:", sessionPayload.cancel_url);
        
        const session = await stripe.checkout.sessions.create(sessionPayload);
        return session.url;
    }catch(error){
        // console.error("Error creating Checkout Session", error)
        console.error("❌ Error creating Checkout Session:", error);

        if (error instanceof Error) {
            console.error("Message:", error.message);
            console.error("Stack:", error.stack);
        }
        throw error;
    }
}
