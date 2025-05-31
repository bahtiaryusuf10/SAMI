'use client';

import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { DialogTitle } from '@radix-ui/react-dialog';
import { useState } from 'react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <>
      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent side="left" className="p-0 w-48 rounded-lg shadow-md">
          <VisuallyHidden>
            <DialogTitle>Sidebar</DialogTitle>
          </VisuallyHidden>
          <Sidebar mobileSidebarOpen={mobileSidebarOpen} />
        </SheetContent>
      </Sheet>

      <div className="min-h-screen flex overflow-hidden">
        <div className="hidden sm:block bg-blue-200 p-3 flex-none">
          <Sidebar mobileSidebarOpen={mobileSidebarOpen} />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="bg-blue-400 p-2 py-3 flex items-center justify-between sm:justify-end shadow-[0_2px_5px_rgba(0,0,0,0.15)] z-10">
            <Navbar onOpenSidebar={() => setMobileSidebarOpen(true)} />
          </div>
          <main className="flex-1 overflow-y-auto p-4 bg-blue-400">
            {children}
          </main>
          <footer className="bg-blue-400 h-10 flex items-center shadow-[0_-2px_5px_rgba(0,0,0,0.15)]">
            <p className="text-white text-xs ml-4">
              &copy; 2025 SAMI. All Rights Reserved.
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}
