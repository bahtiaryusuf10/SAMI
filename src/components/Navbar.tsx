'use client';

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export default function Navbar() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();

    router.push('/auth');
  };

  return (
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>MA</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-y-1">
        <span className="text-sm leading-3 font-medium text-white">
          Maikel S. Kom.
        </span>
        <span className="text-[12px] text-gray-300 text-left">
          Administrator
        </span>
      </div>
      <Link href={'/auth'}>
        <Button
          variant="outline"
          className="w-7 h-7 rounded-5 bg-red-500 hover:bg-red-400"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 text-white" />
        </Button>
      </Link>
    </div>
  );
}
