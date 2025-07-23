import { getDefaultFilter } from '@/lib/utils/defaultFilter';
import KerjaSamaGlobalClient from './_components/KerjaSamaGlobalClient';

export const revalidate = 600; // Cache page for 10 minute

export default async function KerjaSamaGlobalPage() {
  const defaultFilter = await getDefaultFilter(
    '/api/public/filters/tahun-laporan'
  );

  return <KerjaSamaGlobalClient filter={defaultFilter} />;
}
