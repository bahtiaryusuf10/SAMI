'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Separator } from './ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

const sidebarItems = [
  {
    title: 'MAIN',
    items: [
      {
        iconImage: '/dashboard.png',
        label: 'Dashboard',
        href: '/',
      },
    ],
  },
  {
    title: 'INDIKATOR KINERJA UTAMA',
    items: [
      {
        iconImage: '/lulusan-bekerja.png',
        label: 'Lulusan Bekerja',
        href: '/lulusan-bekerja',
      },
      {
        iconImage: '/pengalaman-mahasiswa.png',
        label: 'Pengalaman Mahasiswa',
        href: '/pengalaman-mahasiswa',
      },
      {
        iconImage: '/aktivitas-dosen.png',
        label: 'Aktivitas Dosen',
        href: '/aktivitas-dosen',
      },
      {
        iconImage: '/praktisi-mengajar.png',
        label: 'Praktisi Mengajar',
        href: '/praktisi-mengajar',
      },
      {
        iconImage: '/karya-dosen-terdampak.png',
        label: 'Karya Dosen Terdampak',
        href: '/karya-dosen-terdampak',
      },
      {
        iconImage: '/kerja-sama-global.png',
        label: 'Kerja Sama Global',
        href: '/kerja-sama-global',
      },
      {
        iconImage: '/kelas-kolaboratif.png',
        label: 'Kelas Kolaboratif',
        href: '/kelas-kolaboratif',
      },
      {
        iconImage: '/standar-internasional.png',
        label: 'Standar Internasional',
        href: '/standar-internasional',
      },
    ],
  },
  {
    title: 'DATA MASTER',
    items: [
      {
        iconImage: '/person.png',
        label: 'Mahasiswa',
        href: '/mahasiswa',
      },
      {
        iconImage: '/person.png',
        label: 'Dosen',
        href: '/dosen',
      },
      {
        iconImage: '/program-studi.png',
        label: 'Mata Kuliah',
        href: '/mata-kuliah',
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
            <Image src="/sami-logo.png" alt="logo" width={42} height={42} />
            {!mobileSidebarOpen && (
              <Button
                variant="outline"
                size="icon"
                className="hover:bg-gray-100 p-1 rounded-full h-8 w-8"
                onClick={() => setCollapsed(false)}
              >
                <ChevronRight
                  className="text-blue-400"
                  style={{ height: '21px', width: '21px' }}
                />
              </Button>
            )}
          </div>
        ) : (
          <div className="flex justify-between items-center py-4 border-b ">
            <div className="flex items-center gap-2 pl-4">
              <Image src="/sami-logo.png" alt="logo" width={45} height={45} />
              <span className="text-3xl font-extrabold text-blue-400 whitespace-nowrap">
                SAMI
              </span>
            </div>
            {!mobileSidebarOpen && (
              <Button
                variant="outline"
                size="icon"
                className="group p-0 hover:bg-gray-100 rounded-bl-[10px] rounded-tl-[10px] rounded-br-[0px] rounded-tr-[0px] h-9 w-7"
                onClick={() => setCollapsed(true)}
              >
                <ChevronLeft
                  className="text-gray-400 group-hover:text-blue-400"
                  style={{ height: '21px', width: '21px' }}
                />
              </Button>
            )}
          </div>
        )}

        <div className={`text-sm ${collapsed ? 'px-3' : 'px-4'}`}>
          {sidebarItems.map((section, index) => (
            <div className="flex flex-col gap-1" key={section.title}>
              {!collapsed && (
                <span className="mb-1 mt-6 text-gray-400 text-xs font-semibold">
                  {section.title}
                </span>
              )}

              {section.items.map((item, itemIndex) => {
                const isActive = pathname === item.href;

                return (
                  <Link
                    href={item.href}
                    key={item.label}
                    className={`flex items-center gap-3 py-2 rounded-md transition-all ${
                      collapsed ? 'justify-center' : 'px-2 ml-1'
                    } ${
                      isActive
                        ? collapsed
                          ? 'bg-gray-100'
                          : 'bg-gray-100 text-blue-400 font-semibold'
                        : 'hover:bg-gray-100 text-gray-500 font-light'
                    }`}
                  >
                    <Tooltip>
                      <TooltipTrigger>
                        <Image
                          src={item.iconImage}
                          alt={item.label}
                          width={20}
                          height={20}
                          className="cursor-pointer"
                        />
                      </TooltipTrigger>
                      <TooltipContent
                        side={collapsed ? 'right' : 'top'}
                        align="center"
                        sideOffset={8}
                      >
                        <p>
                          {section.title === 'INDIKATOR KINERJA UTAMA'
                            ? `IKU ${itemIndex + 1} `
                            : ``}
                          {item.label}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                    {!collapsed && <span>{item.label}</span>}
                    {isActive && !collapsed && (
                      <div className="ml-auto rounded-sm h-5 w-1 bg-blue-400"></div>
                    )}
                  </Link>
                );
              })}

              {collapsed && index < sidebarItems.length - 1 && (
                <div className="my-2 mb-3">
                  <Separator className="w-10 mx-auto bg-gray-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
