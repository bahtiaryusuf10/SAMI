import { Column } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SortableHeaderProps<TData, TValue> {
  column: Column<TData, TValue>;
  label: string;
}

export function SortableHeader<TData, TValue>({
  column,
  label,
}: SortableHeaderProps<TData, TValue>) {
  return (
    <Button
      variant="ghost"
      className="w-full min-w-0 justify-between px-2"
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      <span className="min-w-0 flex-1 truncate text-left" title={label}>
        {label}
      </span>
      <ArrowUpDown className="ml-2 h-4 w-4 shrink-0" />
    </Button>
  );
}
