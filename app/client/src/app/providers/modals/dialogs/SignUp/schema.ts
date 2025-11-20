import z from "zod";

export const signUpSchema = z
  .object({
    username: z
      .string({ error: "errors.isRequired" })
      .min(1, "errors.isRequired")
      .min(2, "errors.minLength"),
    email: z
      .string({ error: "errors.isRequired" })
      .min(1, "errors.isRequired")
      .email("errors.invalidEmail"),
    password: z
      .string({ error: "errors.isRequired" })
      .min(6, "errors.passwordMin")
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "errors.passwordComplexity"),
    confirmPassword: z
      .string({ error: "errors.isRequired" })
      .min(1, "errors.isRequired"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "errors.passwordMismatch",
    path: ["confirmPassword"],
  });
