'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import ForgotPasswordForm from './ForgotPasswordForm';
import { loginSchema, LoginSchema } from '@/lib/schemas/auth';
import { login } from '@/app/auth/actions';

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginSchema) => {
    setIsLoading(true);

    try {
      const result = await login(data);

      if (result?.error) {
        toast.error('Gagal Masuk', {
          description: result.error,
        });
      } else if (result?.success) {
        toast.success(result.success);
        router.push('/');
      }
    } catch (e) {
      console.log('Login error : ', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ForgotPasswordForm />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 bg-white p-6 rounded-xl shadow w-75 lg:w-82 mx-auto"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="maikel@gmail.com"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="ml-2 text-xs">
                  {/* Use your listed email in the system. */}
                  Gunakan email yang sudah terdaftar di sistem.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kata Sandi</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      className="pr-10"
                      placeholder="••••••••"
                      type={showPassword ? 'text' : 'password'}
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <Eye className="w-5 h-5 text-blue-300" />
                      ) : (
                        <EyeOff className="w-5 h-5 text-blue-200" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormDescription className="ml-2 text-xs">
                  Minimal 6 Karakter.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="text-right -mt-4">
            <p
              onClick={() =>
                document.getElementById('forgot-password-trigger')?.click()
              }
              className="text-red-600 text-xs font-medium hover:underline cursor-pointer"
            >
              Lupa Kata Sandi?
            </p>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-400 hover:opacity-80 hover:bg-blue-400"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-white" />
            ) : (
              ''
            )}
            Masuk
          </Button>
        </form>
      </Form>
    </>
  );
}
