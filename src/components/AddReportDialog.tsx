'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Input } from './ui/input';
import { Loader2 } from 'lucide-react';
import { addReportLink } from '@/app/(dashboard)/laporan-ami/actions';

export default function AddReportDialog() {
  const [year, setYear] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirmAdd = async () => {
    if (!year.trim() || !sourceUrl.trim()) {
      toast.error('Mohon isi tahun data terlebih dahulu.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await addReportLink(year, sourceUrl);

      if (result && result.message) {
        toast.success(result.message);

        setYear('');
        setSourceUrl('');
        setOpen(false);
      } else {
        throw new Error(result.error || 'Respons dari server tidak valid.');
      }
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(`Gagal: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setYear('');
          setSourceUrl('');
        }
        setOpen(isOpen);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-white/20 text-white border-white/30 hover:bg-white/30 hover:text-white"
        >
          Tambah Hasil Laporan
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between mr-5">
            <DialogTitle>Hasil Laporan AMI</DialogTitle>
          </div>
          <DialogDescription>
            Anda dapat menambahkan url hasil laporan AMI untuk aspek IKU di
            sini.
          </DialogDescription>
        </DialogHeader>
        <Input
          type="number"
          placeholder="Masukkan tahun laporan (contoh: 2025)"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          disabled={isLoading}
        />
        <Input
          type="url"
          placeholder="Masukkan URL Hasil Laporan"
          value={sourceUrl}
          onChange={(e) => setSourceUrl(e.target.value)}
          disabled={isLoading}
        />
        <DialogFooter>
          <Button
            type="button"
            onClick={handleConfirmAdd}
            disabled={!sourceUrl || isLoading}
            className="bg-blue-400 hover:bg-blue-300"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Tambah
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
