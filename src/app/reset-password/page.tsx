// import ResetPasswordForm from '@/components/forms/ResetPasswordForm';

// export default async function ResetPasswordPage({
//   searchParams,
// }: {
//   searchParams: { code?: string };
// }) {
//   const { code: authCode } = await searchParams;

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4 bg-blue-200">
//       <ResetPasswordForm authCode={authCode} />
//     </div>
//   );
// }

'use client';

import ResetPasswordForm from '@/components/forms/ResetPasswordForm';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ResetPasswordComponent() {
  const searchParams = useSearchParams();
  const authCode = searchParams.get('code');

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-blue-200">
      <ResetPasswordForm authCode={authCode} />
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordComponent />
    </Suspense>
  );
}
