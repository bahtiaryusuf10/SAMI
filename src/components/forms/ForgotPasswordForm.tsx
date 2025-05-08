'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Email invalid' }),
});

type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordForm() {
  const supabase = createSupabaseBrowserClient();
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordSchema) => {
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast.error(error.message || 'Something went wrong');
      } else {
        toast.success(
          "If this email exists, you'll receive an email with instructions."
        );
      }
    } catch (err) {
      toast.error('Unexpected error occurred. Please try again.');
      console.log(err);
    }

    setLoading(false);
    setIsDialogOpen(false);
  };

  return (
    <>
      <button
        id="forgot-password-trigger"
        type="button"
        onClick={() => setIsDialogOpen(true)}
        className="hidden"
      >
        Open Forgot Password
      </button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="space-y-2 bg-white p-6 rounded-xl shadow-md w-[90vw] max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle>Recover Your Account</DialogTitle>
            <DialogDescription>
              Enter your email to receive instructions on recovering your
              account.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="maikel@gmail.com"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="ml-2 text-xs">
                      Use your valid email.
                    </FormDescription>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="submit"
                  className="mt-4 w-full bg-blue-400 hover:opacity-80 hover:bg-blue-400"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Instructions'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
