'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const registerSchema = z
  .object({
    email: z.string().email({ message: 'Email invalid' }),
    password: z.string().min(6, { message: 'Minimal 6 character' }),
    confirmPassword: z.string().min(6, { message: 'Minimal 6 character' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password didn't match",
    path: ['confirmPassword'],
  });

type RegisterSchema = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    setLoading(false);

    if (error) {
      toast.error('Register failed', {
        description: error.message,
      });
    } else {
      toast.success('Register successful, check your email to confirm');
      form.reset();
      router.refresh();
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
              <FormLabel>Password</FormLabel>
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
                Minimal 6 character.
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
              <FormLabel>Confirm Password</FormLabel>
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
                Minimal 6 character.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-blue-400 hover:opacity-80 hover:bg-blue-400"
          disabled={loading}
        >
          Register
        </Button>
      </form>
    </Form>
  );
}
