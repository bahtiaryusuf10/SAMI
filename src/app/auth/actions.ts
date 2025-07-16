'use server';

import {
  loginSchema,
  type LoginSchema,
  registerSchema,
  type RegisterSchema,
  resetPasswordSchema,
  type ResetPasswordSchema,
  forgotPasswordSchema,
  type ForgotPasswordSchema,
} from '@/lib/schemas/auth';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// Login
export async function login(data: LoginSchema) {
  const validationResult = loginSchema.safeParse(data);
  if (!validationResult.success) {
    return { error: 'Data yang dikirim tidak valid' };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    if (error.message === 'Email not confirmed') {
      return {
        error: 'Email Anda belum diverifikasi',
      };
    }
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  return { success: 'Berhasil masuk!' };
}

// Register
export async function register(data: RegisterSchema) {
  const validationResult = registerSchema.safeParse(data);
  if (!validationResult.success) {
    return { error: 'Data yang dikirim tidak valid' };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo: `${process.env.NEXT_LOCAL_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return {
    success: 'Daftar berhasil, silakan cek email Anda untuk verifikasi',
  };
}

// Forgot Password
export async function sendResetLink(data: ForgotPasswordSchema) {
  const validationResult = forgotPasswordSchema.safeParse(data);
  if (!validationResult.success) {
    return { error: 'Data yang dikirim tidak valid' };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
    redirectTo: `${process.env.NEXT_LOCAL_SITE_URL}/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return {
    success: 'Jika email terdaftar, tautan reset kata sandi telah dikirim',
  };
}

// Reset Password
export async function resetPassword(data: ResetPasswordSchema) {
  const validationResult = resetPasswordSchema.safeParse(data);
  if (!validationResult.success) {
    return { error: 'Data yang dikirim tidak valid' };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({
    password: data.newPassword,
  });

  if (error) {
    if (
      error.message ===
      'New password should be different from the old password.'
    ) {
      return {
        error: 'Kata sandi baru harus berbeda dengan yang lama',
      };
    }
    return { error: error.message };
  }

  return {
    success:
      'Kata sandi berhasil diubah. Anda akan diarahkan ke halaman login.',
  };
}

// Make a session for temp credential
export async function exchangeCodeForSession(authCode: string) {
  const supabase = await createSupabaseServerClient();

  const result = await supabase.auth.exchangeCodeForSession(authCode);

  if (result.error) {
    console.error('Session exchange error:', result.error.message);
    return {
      data: null,
      error: { message: 'Tautan reset tidak valid atau telah kedaluwarsa.' },
    };
  }

  return { data: result.data, error: null };
}
