'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { toast } from 'sonner';
import { registerSchema, RegisterSchema } from '@/lib/schemas/auth';
import { register } from '@/app/auth/actions';

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterSchema) => {
    setIsLoading(true);

    try {
      const result = await register(data);

      if (result?.error) {
        toast.error('Daftar Gagal', {
          description: result.error,
        });
      } else if (result?.success) {
        toast.success(result.success);
        form.reset();
      }
    } catch (e) {
      console.log('Register error : ', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
                <Input type="email" placeholder="maikel@gmail.com" {...field} />
              </FormControl>
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

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Konfirmasi Kata Sandi</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    className="pr-10"
                    placeholder="••••••••"
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
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
          Daftar
        </Button>
      </form>
    </Form>
  );
}
