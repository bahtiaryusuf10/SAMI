import { getDefaultFilter } from '@/lib/utils/defaultFilter';
import StandarInternasionalClient from './_components/StandarInternasionalClient';

export const revalidate = 600; // Cache page for 10 minute

export default async function StandarInternasionalPage() {
  const defaultFilter = await getDefaultFilter(
    '/api/public/filters/tahun-laporan-by-tipe?types=accreditations'
  );

  return <StandarInternasionalClient filter={defaultFilter} />;
}
