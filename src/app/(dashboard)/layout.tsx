import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex overflow-hidden">
      <div className="bg-blue-100 p-3 flex-none">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col">
        <div className="bg-blue-400 p-2 flex items-center justify-end shadow-md z-10">
          <Navbar />
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
  );
}
