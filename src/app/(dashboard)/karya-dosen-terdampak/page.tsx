import { getDefaultFilter } from '@/lib/utils/defaultFilter';
import KaryaDosenTerdampakClient from './_components/KaryaDosenTerdampakClient';

export const revalidate = 600; // Cache page for 10 minute

export default async function KaryaDosenTerdampakPage() {
  const defaultFilter = await getDefaultFilter(
    '/api/public/filters/tahun-laporan-dosen'
  );

  return <KaryaDosenTerdampakClient filter={defaultFilter} />;
}
