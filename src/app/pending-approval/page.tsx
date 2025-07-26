'use client';

import { Button } from '@/components/ui/button';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { LogOut } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { toast } from 'sonner';

function PendingApprovalContent() {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const status = searchParams.get('status');

    console.log(status);

    if (status === 'confirmed') {
      toast.success('Konfirmasi email berhasil!', {
        description: 'Akun anda sudah aktif.',
      });
    }

    const error = searchParams.get('error');
    if (error) {
      toast.error('Konfirmasi Gagal', {
        description: 'Tautan konfirmasi tidak valid atau telah kedaluwarsa.',
      });
    }
  }, [searchParams]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw new Error(error.message);
      }

      toast.success('Berhasil Keluar!');

      router.push('/auth');
    } catch (e) {
      if (e instanceof Error) {
        console.error('Logout failed:', e.message);

        toast.error('Gagal keluar', {
          description: e.message,
        });
      } else {
        console.error('An unknown error occurred during logout:', e);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-blue-200 gap-6">
      <div className="absolute top-4 right-4">
        <Button
          variant="destructive"
          onClick={handleLogout}
          className="cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          Keluar
        </Button>
      </div>
      <p className="text-center text-2xl text-blue-400 font-bold">
        Akun anda terdaftar pada sistem, tetapi belum memiliki akses. <br />
        Silakan hubungi Administrator👍🏻
      </p>
    </div>
  );
}

export default function PendingApprovalPage() {
  return (
    <Suspense fallback={<div>Memuat Halaman...</div>}>
      <PendingApprovalContent />
    </Suspense>
  );
}
