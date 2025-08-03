import { getDefaultFilter } from '@/lib/utils/defaultFilter';
import LaporanAmiClient from './_components/LaporanAmiClient';
import { cookies } from 'next/headers';

export const revalidate = 600; // Cache page for 10 minute

export default async function LaporanAmi() {
  const cookieStore = cookies();

  const defaultFilter = await getDefaultFilter(
    '/api/public/filters/tahun-laporan-link',
    await cookieStore
  );

  return <LaporanAmiClient filter={defaultFilter} />;
}
