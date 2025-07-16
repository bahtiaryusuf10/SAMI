import KerjaSamaGlobalClient from './_components/KerjaSamaGlobalClient';

export const revalidate = 600; // Cache page for 10 minute

export default function KerjaSamaGlobalPage() {
  return <KerjaSamaGlobalClient />;
}
