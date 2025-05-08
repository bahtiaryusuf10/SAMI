import { AuthTab } from '@/components/tabs/AuthTab';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4 bg-blue-400">
      {/* Kiri */}
      <div className="w-full lg:w-2/5">
        <div className="flex flex-col justify-center min-h-[35rem] lg:min-h-screen bg-blue-100 rounded-none lg:rounded-tr-4xl lg:rounded-br-4xl">
          <div className="flex flex-col px-20 lg:px-20 xl:px-30 mb-10 sm:mb-8">
            <div className="flex flex-row items-center">
              <h1 className="text-4xl font-semibold text-black py-3">
                Welcome!
              </h1>
              <Image
                className="scale-x-[-1]"
                style={{ transform: 'rotate(5deg)' }}
                src="/hello.png"
                alt="icon"
                width={40}
                height={40}
              ></Image>
            </div>
            <p className="mx-auto max-w-md mt-1">
              Glad to see you here! Let&apos;s make internal audits easier,
              clearer, and a bit more fun to explore.
            </p>
          </div>
          <AuthTab />
        </div>
      </div>

      {/* Kanan */}
      <div className="w-full lg:w-3/5 flex flex-col p-10 mt-4 sm:min-h-[42rem] sm:mt-10">
        <div className="px-8">
          <h1 className="text-5xl font-bold text-white py-3">SAMI</h1>
          <p className="text-white text-lg lg:text-lg ml-5">
            An interactive dashboard to easily manage Audit Mutu Internal (AMI)
            reports and unlock valuable insights for continuous improvement.
          </p>
        </div>
        <div className="flex item-center justify-center py-4">
          <Image
            src="/login.png"
            alt="logo"
            width={811}
            height={68}
            style={{ width: 'auto', height: 'auto' }}
          />
        </div>
      </div>
    </div>
  );
}
