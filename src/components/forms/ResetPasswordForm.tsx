'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import { ResetPasswordSchema, resetPasswordSchema } from '@/lib/schemas/auth';
import { exchangeCodeForSession, resetPassword } from '@/app/auth/actions';
import { CloudAlert, Loader2, CircleAlert } from 'lucide-react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from '@/components/ui/dialog';

export default function ResetPasswordForm({
  authCode,
}: {
  authCode?: string | null;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showAllPassword, setShowAllPassword] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<
    'verifying' | 'error' | 'ready'
  >('verifying');
  const [errorMessage, setErrorMessage] = useState<React.ReactNode>(null);

  const verificationRan = useRef(false);

  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  });

  useEffect(() => {
    if (verificationRan.current) return;

    if (!authCode) {
      setVerificationStatus('error');
      setErrorMessage(
        <>
          Maaf atas ketidaknyamanannya, tautan untuk mengubah kata sandi tidak
          valid atau telah kedaluwarsa.
          <br />
          Anda bisa mencoba membuat kembali tautan ubah kata sandi yang baru.
        </>
      );
      verificationRan.current = true;
      return;
    }

    const verifyCode = async () => {
      verificationRan.current = true;

      const result = await exchangeCodeForSession(authCode);
      if (result.error) {
        setVerificationStatus('error');
        setErrorMessage(result.error.message);
        setTimeout(() => router.push('/auth'), 3000);
      } else {
        setVerificationStatus('ready');
        router.replace('/reset-password', { scroll: false });
      }
    };

    verifyCode();
  }, [authCode, router]);

  const onSubmit = async (data: ResetPasswordSchema) => {
    setIsLoading(true);

    try {
      const result = await resetPassword(data);

      if (result?.error) {
        toast.error('Gagal mengubah kata sandi', {
          description: result.error,
        });
      } else if (result?.success) {
        toast.success(result.success);
        setTimeout(() => {
          router.push('/auth');
        }, 2000);
      }
    } catch (e) {
      console.log('Reset password error : ', e);
    } finally {
      setIsLoading(false);
    }
  };

  if (verificationStatus === 'verifying') {
    return (
      <div className="flex items-center justify-center p-8 text-blue-500">
        <Loader2 className="h-6 w-6 animate-spin" />
        <p className="ml-2">Memverifikasi tautan...</p>
      </div>
    );
  }

  if (verificationStatus === 'error') {
    return (
      <div className="flex flex-col items-center justify-center space-y-20 text-red-400 bg-blue-200">
        <h1 className="text-5xl font-bold">Peringatan!</h1>
        <CloudAlert className="h-50 w-50" />
        <p className="text-center">{errorMessage}</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full max-w-md mx-auto mt-12 bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold text-center mb-8">Ubah Kata Sandi</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kata Sandi Baru</FormLabel>
                  <FormControl>
                    <Input
                      type={showAllPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="ml-2 text-xs">
                    Minimal 6 karakter.
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
                  <FormLabel>Konfirmasi Kata Sandi Baru</FormLabel>
                  <FormControl>
                    <Input
                      type={showAllPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="ml-2 text-xs">
                    Minimal 6 karakter.
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
                Lihat Kata Sandi
              </label>
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
              Ubah
            </Button>
          </form>
        </Form>
      </div>

      <div className="absolute bottom-5 right-10">
        <Dialog>
          <DialogTrigger>
            <CircleAlert className="w-6 h-6 text-white cursor-pointer" />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Halaman Sekali Pakai</DialogTitle>
              <DialogDescription>
                Harap tidak me-refresh halaman ini, karena tautan ubah kata
                sandi hanya valid untuk satu kali penggunaan.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
