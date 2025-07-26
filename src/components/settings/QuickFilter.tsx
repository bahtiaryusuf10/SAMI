'use client';
import useSWR from 'swr';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Option = {
  year: number;
};

type QuickFilterProps = {
  label: string;
  apiUrl: string;
  activeValue: number | string | null;
  onValueChange: (newValue: string) => void;
  isLoading?: boolean;
  showAllOption?: boolean;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function QuickFilter({
  label,
  apiUrl,
  activeValue,
  onValueChange,
  isLoading: isParentLoading,
  showAllOption = true,
}: QuickFilterProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, isLoading: isOptionsLoading } = useSWR<any>(apiUrl, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 600000,
  });

  const options: Option[] = Array.isArray(data) ? data : data?.data;
  const isLoading = isParentLoading || isOptionsLoading;

  return (
    <div className="flex items-center">
      <label className="text-[16px] font-medium text-white mr-2">{label}</label>
      <Select
        value={activeValue?.toString() || 'all'}
        onValueChange={onValueChange}
        disabled={isLoading}
      >
        <SelectTrigger className="w-[128px] bg-white">
          <SelectValue placeholder={isLoading ? 'Memuat...' : 'Pilih tahun'} />
        </SelectTrigger>
        <SelectContent>
          {showAllOption && <SelectItem value="all">Semua</SelectItem>}
          {options
            ?.filter((option) => option && option.year != null)
            .map((option) => (
              <SelectItem key={option.year} value={option.year.toString()}>
                {option.year}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
}
