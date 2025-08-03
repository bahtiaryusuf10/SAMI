import { getDefaultFilter } from '@/lib/utils/defaultFilter';
import PengalamanMahasiswaClient from './_components/PengalamanMahasiswaClient';

export const revalidate = 600; // Cache page for 10 minute

export default async function PengalamanMahasiswaPage() {
  const defaultFilter = await getDefaultFilter(
    '/api/public/filters/tahun-laporan-by-tipe?types=mbkms,certificates,achievements'
  );

  return <PengalamanMahasiswaClient filter={defaultFilter} />;
}
