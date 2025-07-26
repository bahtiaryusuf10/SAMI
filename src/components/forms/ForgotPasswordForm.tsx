'use client';

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
import { forgotPasswordSchema, ForgotPasswordSchema } from '@/lib/schemas/auth';
import { sendResetLink } from '@/app/auth/actions';
import { Loader2 } from 'lucide-react';

export default function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordSchema) => {
    setIsLoading(true);

    try {
      const result = await sendResetLink(data);

      if (result?.error) {
        toast.error('Gagal Mengirim Tautan', {
          description: result.error,
        });
      } else if (result?.success) {
        toast.success(result.success);
        form.reset();
      }
    } catch (e) {
      console.log('Forgot password error : ', e);
    } finally {
      setIsLoading(false);
      setIsDialogOpen(false);
    }
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
            <DialogTitle>Pulihkan Akun Anda</DialogTitle>
            <DialogDescription>
              Masukkan email Anda untuk menerima instruksi mengenai cara
              memulihkan akun.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="maikel@gmail.com"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="ml-2 text-xs">
                      Gunakan email yang valid.
                    </FormDescription>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="submit"
                  className="mt-4 w-full bg-blue-400 hover:opacity-80 hover:bg-blue-400"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin text-white" />
                  ) : (
                    ''
                  )}
                  {isLoading ? 'Mengirim...' : 'Kirim Instruksi'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
