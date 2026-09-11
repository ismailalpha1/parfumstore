import { defineField, defineType } from "sanity";

export const orderType = defineType({
  name: "order",
  title: "Order",
  type: "document",

  fields: [
    defineField({
      name: "orderNumber",
      title: "Order Number",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "customerName",
      title: "Customer Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "email",
      title: "Customer Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),

    defineField({
      name: "clerkUserId",
      title: "Clerk User ID",
      type: "string",
    }),

    defineField({
      name: "products",
      title: "Products",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "product",
              title: "Product",
              type: "reference",
              to: [{ type: "product" }],
              validation: (Rule) => Rule.required(),
            }),

            defineField({
              name: "quantity",
              title: "Quantity",
              type: "number",
              validation: (Rule) =>
                Rule.required().integer().positive(),
            }),
          ],

          preview: {
            select: {
              productName: "product.name",
              quantity: "quantity",
            },

            prepare({ productName, quantity }) {
              return {
                title: productName || "Product",
                subtitle: `Quantity: ${quantity}`,
              };
            },
          },
        },
      ],

      validation: (Rule) => Rule.required().min(1),
    }),

    defineField({
      name: "totalPrice",
      title: "Total Price",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),

    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      initialValue: "USD",
    }),

    defineField({
      name: "amountDiscount",
      title: "Discount",
      type: "number",
      initialValue: 0,
    }),

    defineField({
      name: "status",
      title: "Order Status",
      type: "string",

      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Confirmed", value: "confirmed" },
          { title: "Processing", value: "processing" },
          { title: "Shipped", value: "shipped" },
          { title: "Delivered", value: "delivered" },
          { title: "Cancelled", value: "cancelled" },
        ],

        layout: "dropdown",
      },

      initialValue: "pending",
    }),

    defineField({
      name: "paymentMethod",
      title: "Payment Method",
      type: "string",

      options: {
        list: [
          {
            title: "Cash on Delivery",
            value: "cash_on_delivery",
          },
          {
            title: "Card",
            value: "card",
          },
        ],
      },

      initialValue: "cash_on_delivery",
    }),

    defineField({
      name: "paymentStatus",
      title: "Payment Status",
      type: "string",

      options: {
        list: [
          {
            title: "Unpaid",
            value: "unpaid",
          },
          {
            title: "Paid",
            value: "paid",
          },
          {
            title: "Refunded",
            value: "refunded",
          },
        ],
      },

      initialValue: "unpaid",
    }),

    defineField({
      name: "orderDate",
      title: "Order Date",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "address",
      title: "Delivery Address",
      type: "object",

      fields: [
        defineField({
          name: "name",
          title: "Name",
          type: "string",
        }),

        defineField({
          name: "address",
          title: "Address",
          type: "string",
        }),

        defineField({
          name: "city",
          title: "City",
          type: "string",
        }),

        defineField({
          name: "zip",
          title: "ZIP Code",
          type: "string",
        }),
      ],
    }),
  ],

  preview: {
    select: {
      orderNumber: "orderNumber",
      customerName: "customerName",
      totalPrice: "totalPrice",
      status: "status",
    },

    prepare({
      orderNumber,
      customerName,
      totalPrice,
      status,
    }) {
      return {
        title: orderNumber || "Order",
        subtitle: `${customerName || "Unknown"} — $${totalPrice ?? 0} — ${status || "pending"}`,
      };
    },
  },
});