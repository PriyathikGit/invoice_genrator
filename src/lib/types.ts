// import { z } from "zod";

// export const productSchema = z.object({
//   productName: z.string().min(1, "Product is required"),
//   hsnCode: z.string().min(1, "HSN Code is required"),
//   qty: z.number().min(1, "Quantity must be at least 1"),
//   salePrice: z.number().min(0.01, "Price must be greater than 0"),
//   discount: z.number().min(0).max(100).optional(), // Allow discount to be undefined
// });

// // add the type to the product and also combined the new type
// export type Product = z.infer<typeof productSchema> & {
//   taxableValue: number;
//   gst: number;
//   cgst: number;
//   sgst: number;
//   totalValue: number;
// };

// export const customerSchema = z.object({
//   name: z.string().min(1, "Customer name is required"),
//   address: z.string().min(1, "Customer address is required"),
//   gstin: z.string().optional(),
// });

// export const invoiceSchema = z.object({
//   invoiceNo: z.string().min(1, "Invoice number is required"),
//   invoiceDate: z.string().min(1, "Invoice date is required"),
//   customer: customerSchema,
//   products: z.array(productSchema).min(1, "At least one product is required"),
//   paymentMethod: z.enum(["Cash", "Online Transfer", "On Credit"]),
//   transactionId: z.string().optional(),
//   narration: z.string().optional(),
// });

// export type InvoiceFormValues = z.infer<typeof invoiceSchema> & {
//   products: Product[];
// };

// schemas/invoiceSchema.ts
import * as z from 'zod';

export const productSchema = z.object({
  productName: z.string().min(1, "Select a product"),
  hsnCode: z.string(),
  qty: z.number().min(1, "Must be > 0"),
  salePrice: z.number().min(0.01, "Must be > 0"),
  discount: z.number().min(0).default(0),
});

export const invoiceSchema = z.object({
  invoiceNo: z.string().min(1, "Invoice No is required"),
  invoiceDate: z.string().min(1, "Date is required"),
  customer: z.object({
    name: z.string().min(1, "Customer name required"),
    address: z.string().min(1, "Customer address required"),
    gstin: z
      .string()
      .regex(
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}[Z]{1}[A-Z0-9]{1}$/,
        "Invalid GSTIN format"
      )
      .optional(),
  }),
  products: z.array(productSchema).min(1, "At least one product required"),
  paymentMethod: z.enum(["Cash", "Online Transfer", "On Credit"]),
  transactionId: z.string().optional(),
  narration: z.string().optional(),
});
