import { getDefaultFilter } from '@/lib/utils/defaultFilter';
import HomePageClient from './_components/HomePageClient';

export const revalidate = 600; // Cache page for 10 minute

export default async function HomePage() {
  const defaultFilter = await getDefaultFilter(
    '/api/public/filters/tahun-laporan'
  );

  return <HomePageClient filter={defaultFilter} />;
}
