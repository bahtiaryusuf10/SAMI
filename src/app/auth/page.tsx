import { AuthTab } from '@/components/tabs/AuthTab';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4 bg-blue-400 min-h-screen lg:h-screen lg:overflow-hidden">
      {/* Kiri */}
      <div className="w-full lg:w-2/5">
        <div className="flex flex-col items-center justify-center min-h-[45rem] lg:h-full bg-blue-100 rounded-none lg:rounded-tr-4xl lg:rounded-br-4xl">
          <div className="flex flex-col 2xl:ml-3 px-10 xl:px-20 2xl:px-30 mb-10 sm:mb-8">
            <div className="inline-flex gap-2 py-1 items-center justify-center lg:justify-normal">
              {/* <h1 className="text-4xl font-semibold text-black py-3">
                Welcome!
              </h1> */}
              <h1 className="text-4xl font-semibold text-black">
                Selamat Datang!
              </h1>
              <Image
                className="scale-x-[-1]"
                style={{ transform: 'rotate(5deg)' }}
                src="/hello.png"
                alt="icon"
                width={40}
                height={40}
              />
            </div>
            {/* <p className="mx-auto max-w-md mt-1">
              Glad to see you here! Let&apos;s make internal audits easier,
              clearer, and a bit more fun to explore.
            </p> */}
            <p className="mx-auto max-w-md mt-1">
              Senang menemani anda di sini, mari menganalisis data audit secara
              mendalam.
            </p>
          </div>
          <AuthTab />
        </div>
      </div>

      {/* Kanan */}
      <div className="w-full lg:w-3/5 flex flex-col p-10 lg:p-15 mt-4 sm:mt-10 justify-center">
        <div className="px-2 md:px-6 lg:px-8">
          <div className="flex gap-3 items-center py-3 select-none">
            <div className="relative w-13 h-13 rounded-full bg-white p-2">
              <Image
                className="absolute bottom-[9px] left-[10px]"
                src="/sami-logo.png"
                alt="logo"
                width={36}
                height={36}
              />
            </div>
            <h1 className="text-5xl font-bold text-white mb-1">SAMI</h1>
          </div>
          {/* <p className="text-white text-lg lg:text-lg ">
            An interactive dashboard to easily manage Audit Mutu Internal (AMI)
            reports and unlock valuable insights for continuous improvement.
          </p> */}
          <p className="text-white text-lg lg:text-lg ">
            Dashboard interaktif untuk mengelola laporan Audit Mutu Internal
            (AMI) Program Studi dengan mudah dan membuka wawasan guna perbaikan
            yang berkelanjutan.
          </p>
        </div>
        <div className="flex item-center justify-center py-0 select-none">
          <Image
            src="/login.png"
            alt="logo"
            width={811}
            height={68}
            style={{ width: 'auto', height: 'auto' }}
            className="transition-all duration-300 ease-in-out hover:-translate-y-2 hover:drop-shadow-xl"
          />
        </div>
      </div>
    </div>
  );
}
