import { getDefaultFilter } from '@/lib/utils/defaultFilter';
import MainDashboardClient from './_components/MainDashboardClient';

export const revalidate = 600; // Cache page for 10 minute

export default async function MainPage() {
  const defaultFilter = await getDefaultFilter(
    '/api/public/filters/tahun-laporan'
  );

  return <MainDashboardClient filter={defaultFilter} />;
}
