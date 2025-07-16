import KelasKolaboratifClient from './_components/KelasKolaboratifClient';

export const revalidate = 600; // Cache page for 10 minute

export default function KelasKolaboratifPage() {
  return <KelasKolaboratifClient />;
}
