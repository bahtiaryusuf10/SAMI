import AktivitasDosenClient from './_components/AktivitasDosenClient';
import { getDefaultFilter } from '@/lib/utils/defaultFilter';

export const revalidate = 600; // Cache page for 10 minute

export default async function AktivitasDosenPage() {
  const defaultFilter = await getDefaultFilter(
    '/api/public/filters/tahun-laporan'
  );

  return <AktivitasDosenClient filter={defaultFilter} />;
}
