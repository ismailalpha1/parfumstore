"use server";

import { backendClient } from "@/sanity/lib/backendClient";

export interface CreateAddressData {
  name: string;
  email: string;
  adress: string;
  city: string;
  zip: string;
  clerkUserId: string;
  isDefault?: boolean;
}

export async function createAddress(data: CreateAddressData) {
  try {
    if (!data.name.trim()) {
      throw new Error("Name is required.");
    }

    if (!data.adress.trim()) {
      throw new Error("Address is required.");
    }

    if (!data.email.trim()) {
      throw new Error("Email is required.");
    }

    if (!data.city.trim()) {
      throw new Error("City is required.");
    }

    if (!data.zip.trim()) {
      throw new Error("ZIP code is required.");
    }

    if (!data.clerkUserId) {
      throw new Error("User authentication is required.");
    }

    /*
     * If this address should be the default address,
     * remove default from the user's previous addresses.
     */
    if (data.isDefault) {
      const existingAddresses = await backendClient.fetch(
        `*[
          _type == "adress" &&
          clerkUserId == $clerkUserId &&
          default == true
        ]`,
        {
          clerkUserId: data.clerkUserId,
        },
      );

      for (const address of existingAddresses) {
        await backendClient
          .patch(address._id)
          .set({
            default: false,
          })
          .commit();
      }
    }

    const address = await backendClient.create({
      _type: "adress",

      name: data.name.trim(),

      email: data.email.trim(),

      adress: data.adress.trim(),

      city: data.city.trim(),

      zip: data.zip.trim(),

      clerkUserId: data.clerkUserId,

      default: data.isDefault ?? false,

      publishedAt: new Date().toISOString(),
    });

    return {
      success: true,
      address,
    };
  } catch (error) {
    console.error("❌ Error creating address:", error);

    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to create address.",
    );
  }
}