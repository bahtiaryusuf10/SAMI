import { getDefaultFilter } from '@/lib/utils/defaultFilter';
import { cookies } from 'next/headers';
import DosenClient from './_components/DosenClient';

export default async function Dosen() {
  const cookieStore = cookies();

  const defaultFilter = await getDefaultFilter(
    '/api/dosen/filter',
    await cookieStore
  );

  return <DosenClient filter={defaultFilter} />;
}
