import { getDefaultFilter } from '@/lib/utils/defaultFilter';
import MataKuliahClient from './_components/MataKuliahClient';
import { cookies } from 'next/headers';

export const revalidate = 600; // Cache page for 10 minute

export default async function MataKuliah() {
  const cookieStore = cookies();

  const defaultFilter = await getDefaultFilter(
    '/api/mata-kuliah/filter',
    await cookieStore
  );

  return <MataKuliahClient filter={defaultFilter} />;
}
