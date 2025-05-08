'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
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
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';

const formSchema = z
  .object({
    password: z.string().min(6, { message: 'Minimal 6 character' }),
    confirmPassword: z.string().min(6, { message: 'Minimal 6 character' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password didn't match",
    path: ['confirmPassword'],
  });

export default function ResetPasswordForm() {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();
  const [showAllPassword, setShowAllPassword] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authCode =
      urlParams.get('auth_code') ||
      new URL(window.location.href).hash.split('=')[1];

    if (authCode) {
      supabase.auth.exchangeCodeForSession(authCode).then(({ data, error }) => {
        if (error) {
          toast.error('Session exchange failed', {
            description: error.message,
          });
        } else {
          console.log('Session exchanged:', data);
        }
      });
    } else {
      toast.error('Auth code missing in URL');
    }
  }, [supabase.auth]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const { error } = await supabase.auth.updateUser({
      password: data.password,
    });

    if (error) {
      toast.error('Reset password failed', {
        description: error.message,
      });
    } else {
      toast.success('Password changed. Redirect to login page...');
      setTimeout(() => {
        router.push('/auth');
      }, 2000);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-12 bg-white rounded-xl shadow p-6">
      <h2 className="text-2xl font-bold text-center mb-8">Reset Password</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    type={showAllPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...field}
                  />
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
                <FormLabel>New Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type={showAllPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="ml-2 text-xs">
                  Minimal 6 character.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center space-x-2 pt-1 pb-3">
            <Checkbox
              id="show-password"
              checked={showAllPassword}
              onCheckedChange={(checked) =>
                setShowAllPassword(Boolean(checked))
              }
              className="w-4 h-4 data-[state=checked]:bg-blue-400 data-[state=checked]:border-blue-400"
            />
            <label
              htmlFor="show-password"
              className="text-xs text-muted-foreground"
            >
              Show Password
            </label>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-400 hover:opacity-80 hover:bg-blue-400"
          >
            Reset
          </Button>
        </form>
      </Form>
    </div>
  );
}
