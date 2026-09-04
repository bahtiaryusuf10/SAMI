import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useApiData<T = any>(url: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error, isLoading, mutate } = useSWR<any>(url, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 900000,
  });

  return {
    data: data?.data as T | undefined,
    isLoading,
    error,
    mutate,
  };
}
