import { getDefaultFilter } from '@/lib/utils/defaultFilter';
import PraktisiMengajarClient from './_components/PraktisiMengajarClient';

export const revalidate = 600; // Cache page for 10 minute

export default async function PraktisiMengajarPage() {
  const defaultFilter = await getDefaultFilter(
    '/api/public/filters/tahun-laporan-dosen'
  );

  return <PraktisiMengajarClient filter={defaultFilter} />;
}
