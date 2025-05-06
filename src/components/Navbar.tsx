import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';

export default function Navbar() {
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
      <Link href={'/sign-in'}>
        <Button
          variant="outline"
          // size="icon"
          className="w-7 h-7 rounded-5 bg-red-500 hover:bg-red-400"
        >
          <LogOut className="h-5 w-5 text-white" />
        </Button>
      </Link>
    </div>
  );
}
