import z from "zod";

export const loginSchema = z.object({
  username: z
    .string({ error: "errors.isRequired" })
    .min(1, "errors.isRequired")
    .min(2, "errors.minLength"),
  password: z
    .string({ error: "errors.isRequired" })
    .min(6, "errors.passwordMin"),
});
