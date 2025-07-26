import { getDefaultFilter } from '@/lib/utils/defaultFilter';
import MahasiswaClient from './_components/MahasiswaClient';
import { cookies } from 'next/headers';

export const revalidate = 600; // Cache page for 10 minute

export default async function Mahasiswa() {
  const cookieStore = cookies();

  const defaultFilter = await getDefaultFilter(
    '/api/mahasiswa/filter',
    await cookieStore
  );

  return <MahasiswaClient filter={defaultFilter} />;
}
