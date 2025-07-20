import { getDefaultFilter } from '@/lib/utils/defaultFilter';
import KelasKolaboratifClient from './_components/KelasKolaboratifClient';

export const revalidate = 600; // Cache page for 10 minute

export default async function KelasKolaboratifPage() {
  const defaultFilter = await getDefaultFilter(
    '/api/public/filters/tahun-laporan-dosen'
  );

  return <KelasKolaboratifClient filter={defaultFilter} />;
}
