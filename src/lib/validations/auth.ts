import { z } from "zod";
import { admin } from "@/content/es/admin";

export const signInSchema = z.object({
  email: z.email({ error: admin.login.errors.invalidEmail }).trim().toLowerCase(),
  password: z.string().min(1, { error: admin.login.errors.passwordRequired }),
  next: z.string().optional(),
});

export type SignInInput = z.infer<typeof signInSchema>;
