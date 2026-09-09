import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

/**
 * Creates Express middleware that validates a specific part of the request
 * against a Zod schema. On failure, returns a 400 response with error details.
 *
 * @param schema - Zod schema to validate against
 * @param source - Which part of the request to validate ("body", "query", or "params")
 */
export function validate(
  schema: ZodSchema,
  source: "body" | "query" | "params" = "body"
) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req[source]);
      // Replace the request property with the parsed (and possibly coerced) value
      (req as any)[source] = parsed;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          error: "Validation failed",
          details: (err.issues || (err as any).errors || []).map((e: any) => ({
            field: e.path.join("."),
            message: e.message,
            code: e.code,
          })),
        });
      }
      next(err);
    }
  };
}
