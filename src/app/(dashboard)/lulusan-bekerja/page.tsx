import { getDefaultFilter } from '@/lib/utils/defaultFilter';
import LulusanBekerjaClient from './_components/LulusanBekerjaClient';

export const revalidate = 600; // Cache page for 10 minute

export default async function LulusanBekerjaPage() {
  const defaultFilter = await getDefaultFilter(
    '/api/public/filters/tahun-laporan'
  );

  return <LulusanBekerjaClient filter={defaultFilter} />;
}
