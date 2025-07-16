import * as z from 'zod';

// Forgot Password
export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Email tidak valid' }),
});

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

// Login
export const loginSchema = z.object({
  email: z.string().email({ message: 'Email tidak valid' }),
  password: z.string().min(6, { message: 'Minimal 6 karakter' }),
});

export type LoginSchema = z.infer<typeof loginSchema>;

// Register
export const registerSchema = z
  .object({
    email: z.string().email({ message: 'Email tidak valid' }),
    password: z.string().min(6, { message: 'Minimal 6 karakter' }),
    confirmPassword: z.string().min(6, { message: 'Minimal 6 karakter' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Kata sandi tidak cocok',
    path: ['confirmPassword'],
  });

export type RegisterSchema = z.infer<typeof registerSchema>;

// Reset Password
export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, { message: 'Minimal 6 karakter' }),
    confirmPassword: z.string().min(6, { message: 'Minimal 6 karakter' }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Kata sandi tidak cocok',
    path: ['confirmPassword'],
  });

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
