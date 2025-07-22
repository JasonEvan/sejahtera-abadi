import { ZodType } from "zod";

export function validate<T>(data: T, schema: ZodType): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(`Validation failed: ${result.error.message}`);
  }
  return result.data as T;
}
