'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';

const sidebarItems = [
  {
    title: 'MENU',
    items: [
      {
        icon: '/dashboard1.png',
        label: 'Dashboard',
        href: '/',
      },
      {
        icon: '/admin.png',
        label: 'Capaian Lulusan',
        href: '/capaian-lulusan',
      },
      {
        icon: '/admin.png',
        label: 'Aktivitas Mahasiswa',
        href: '/aktivitas-mahasiswa',
      },
      {
        icon: '/admin.png',
        label: 'Aktivitas Dosen',
        href: '/aktivitas-dosen',
      },
      {
        icon: '/admin.png',
        label: 'Kemitraan & Internasionalisasi',
        href: '/kemitraan-dan-internasionalisasi',
      },
    ],
  },
];

export default function Sidebar({
  mobileSidebarOpen,
}: {
  mobileSidebarOpen: boolean;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640 && window.innerWidth < 768) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // sm:	640px
  // md:	768px
  // lg:	1024px
  // xl:	1280px
  // 2xl:	1536px

  return (
    <div
      className={`h-full bg-white shadow-md border-r transition-all duration-300 rounded-lg flex flex-col justify-between ${
        collapsed ? 'w-16 items-center py-4' : 'w-48 lg:w-58 xl:w-68'
      }`}
    >
      <div className="w-full">
        {collapsed ? (
          <div className="flex flex-col justify-center items-center mb-4 gap-3">
            <Image src="/Logo.png" alt="logo" width={33} height={33} />
            {!mobileSidebarOpen && (
              <button
                onClick={() => setCollapsed(false)}
                className="hover:bg-gray-100 p-1 rounded-full"
              >
                <ChevronRight size={20} className="text-blue-400" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex justify-between items-center p-4 border-b">
            <div className="flex items-center gap-2">
              <Image src="/Logo.png" alt="logo" width={33} height={33} />
              <span className="text-xl font-extrabold text-blue-400 whitespace-nowrap">
                SAMI
              </span>
            </div>
            {!mobileSidebarOpen && (
              <button
                onClick={() => setCollapsed(true)}
                className="hover:bg-gray-100 p-1 rounded-full"
              >
                <ChevronLeft
                  size={20}
                  className="text-black hover:text-blue-400"
                />
              </button>
            )}
          </div>
        )}

        <div className="mt-4 text-sm px-2">
          {sidebarItems.map((section) => (
            <div className="flex flex-col gap-2" key={section.title}>
              {!collapsed && (
                <span className="mb-2 mt-4 text-gray-400 text-xs font-semibold">
                  {section.title}
                </span>
              )}
              {section.items.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <Link
                    href={item.href}
                    key={item.label}
                    className={`flex items-center gap-4 py-2 px-2 ml-1 rounded-md transition-all ${
                      collapsed ? 'justify-center' : ''
                    } ${
                      isActive
                        ? collapsed
                          ? 'bg-blue-100'
                          : 'text-blue-400 font-semibold'
                        : 'hover:bg-gray-100 text-gray-500 font-light'
                    }`}
                  >
                    <Image
                      src={item.icon}
                      alt={item.label}
                      width={20}
                      height={20}
                    />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
