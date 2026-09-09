import { z } from "zod";

/** Body for POST /api/orders */
export const createOrderSchema = z.object({
  prescriptionId: z.string().optional(),
  customerAddress: z.string().min(1, "Delivery address is required"),
  deliverySpeed: z.enum(["fast_45", "standard"]).default("fast_45"),
  items: z
    .array(
      z.object({
        medicineId: z.string().min(1),
        quantity: z.number().int().min(1),
        isGeneric: z.boolean(),
      })
    )
    .min(1, "At least one item is required"),
});

/** Path parameters for GET/PATCH /api/orders/:id */
export const orderIdSchema = z.object({
  id: z.string().min(1, "Order ID is required"),
});

/** Body for PATCH /api/orders/:id/status */
export const updateOrderStatusSchema = z.object({
  status: z.enum([
    "order_placed",
    "rx_verified",
    "hub_dispensed",
    "rider_picked",
    "in_transit",
    "delivered",
  ]),
});

/** Body for POST /api/pharmacist/query */
export const pharmacistQuerySchema = z.object({
  question: z.string().optional(),
  molecule: z.string().optional(),
  brandName: z.string().optional(),
  patientContext: z
    .object({
      name: z.string().optional(),
      age: z.number().optional(),
      gender: z.string().optional(),
      allergies: z.array(z.string()).optional(),
    })
    .optional(),
});
