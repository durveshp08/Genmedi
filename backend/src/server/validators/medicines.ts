import { z } from "zod";

/** Query parameters for GET /api/medicines */
export const medicineSearchSchema = z.object({
  q: z.string().optional(),
  therapeuticClass: z.string().optional(),
  inStock: z
    .string()
    .optional()
    .transform((val) => (val === "true" ? true : val === "false" ? false : undefined)),
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
});

/** Path parameters for GET /api/medicines/:id */
export const medicineIdSchema = z.object({
  id: z.string().min(1, "Medicine ID is required"),
});
