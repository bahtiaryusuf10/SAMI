'use client';

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import {
  HelpCircle,
  // Lightbulb,
  Loader2,
  LogOut,
  Menu,
  RefreshCcw,
} from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { useDashboardSettingsStore } from '@/stores/dashboardSettings';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

export default function Navbar({
  onOpenSidebar,
}: {
  onOpenSidebar?: () => void;
}) {
  const supabase = createSupabaseBrowserClient();
  const [isLoading, setIsLoading] = useState(false);
  const { user, can, isLoadingUser } = useUser();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw new Error(error.message);
      }

      toast.success('Berhasil Keluar!');

      sessionStorage.removeItem('chatMessages');

      useDashboardSettingsStore.persist.clearStorage();
      useDashboardSettingsStore.getState().reset();

      window.location.href = '/auth';
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

  const handleRefreshData = async () => {
    setIsLoading(true);
    const url = process.env.NEXT_PUBLIC_REFRESH_DATAMART;

    const promise = (async () => {
      const response = await fetch(url!, {
        method: 'POST',
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json().catch(() => {
        throw new Error('Respons dari server tidak valid.');
      });

      if (!response.ok) {
        throw new Error(result.error || 'Terjadi kegagalan di server.');
      }

      return result.message;
    })().finally(() => {
      setIsLoading(false);
    });

    toast.promise(promise, {
      loading: 'Memperbarui data...',
      success: (message) => `${message}`,
      error: (err) => `Gagal: ${err.message}`,
    });
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={onOpenSidebar}
        className="sm:hidden text-white"
      >
        <Menu className="w-5 h-5" />
      </Button>
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        {can('import:data') && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Popover>
                    {/* <Lightbulb className="w-5 h-5 text-white" /> */}
                    <PopoverTrigger className="mt-0.5 bg-blue-300 rounded-2xl p-1 hover:bg-blue-200 cursor-pointer">
                      <HelpCircle className="w-5 h-5 text-white" />
                    </PopoverTrigger>
                    <PopoverContent
                      align="end"
                      className="w-[calc(100vw-2rem)] xs:w-56 space-y-3"
                    >
                      <div className="space-y-2">
                        <h4 className="leading-none font-semibold">
                          Panduan Import
                        </h4>
                        <ul className="list-decimal list-inside text-sm text-gray-600 leading-relaxed">
                          <li className="text-sm">
                            Import data{' '}
                            <span className="font-medium text-blue-400">
                              Mahasiswa
                            </span>
                          </li>
                          <li className="text-sm">
                            Import data{' '}
                            <span className="font-medium text-blue-400">
                              Mata Kuliah
                            </span>
                          </li>
                          <li className="text-sm">
                            Import data{' '}
                            <span className="font-medium text-blue-400">
                              Dosen
                            </span>
                          </li>
                        </ul>
                        <p className="text-xs text-gray-500 italic mt-3">
                          Pastikan urutan di atas diikuti untuk menghindari data
                          tidak sinkron.
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full bg-blue-300 text-white hover:bg-blue-200 hover:text-white"
                        onClick={handleRefreshData}
                        disabled={isLoading}
                      >
                        <RefreshCcw className="w-4 h-4 mr-2" />
                        Perbarui Data
                      </Button>
                    </PopoverContent>
                  </Popover>
                </div>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Panduan Import</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>MA</AvatarFallback>
        </Avatar>
        <div className="hidden xs:flex flex-col gap-y-1 min-w-0">
          {isLoadingUser ? (
            <div className="flex items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-white" />
            </div>
          ) : (
            <div className="flex flex-col gap-1 min-w-0">
              <span className="text-sm leading-3 font-medium text-white truncate max-w-25 sm:max-w-40">
                {user?.full_name}
              </span>
              <span className="text-[12px] text-gray-300 text-left truncate max-w-25 sm:max-w-40">
                {user?.roles?.description || ''}
              </span>
            </div>
          )}
        </div>
        <Link href={'/auth'}>
          <Button
            variant="outline"
            className="w-7 h-7 rounded-5 bg-red-500 hover:bg-red-400 cursor-pointer"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 text-white" />
          </Button>
        </Link>
      </div>
    </>
  );
}
