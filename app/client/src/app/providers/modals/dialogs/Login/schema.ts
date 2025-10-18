import z from "zod";

export const loginSchema = z.object({
  email: z
    .string({ error: "errors.isRequired" })
    .min(1, "errors.isRequired")
    .email("errors.invalidEmail"),
  password: z
    .string({ error: "errors.isRequired" })
    .min(6, "errors.passwordMin"),
});
