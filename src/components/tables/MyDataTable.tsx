'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';

export interface ColumnDef<TData> {
  accessorKey: keyof TData;
  header: string;
}

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  itemsPerPage?: number;
}

export function MyDataTable<TData>({
  columns,
  data,
  itemsPerPage = 7,
}: DataTableProps<TData>) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  //   const goToPage = (pageNumber: number) => {
  //     setCurrentPage(Math.max(1, Math.min(pageNumber, totalPages)));
  //   };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="w-full">
      <div className="rounded-md border bg-white text-black">
        <Table className="table-fixed">
          <TableHeader>
            <TableRow className="border-gray-700">
              {columns.map((column) => (
                <TableHead
                  key={String(column.accessorKey)}
                  className="text-black"
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.length > 0 ? (
              currentData.map((row, rowIndex) => (
                <TableRow key={rowIndex} className=" border-gray-700">
                  {columns.map((column) => (
                    <TableCell key={String(column.accessorKey)}>
                      {String(row[column.accessorKey])}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-gray-400"
                >
                  Tidak ada data.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center py-4">
        <div className="flex-shrink-0 text-sm text-gray-400">
          Halaman {currentPage} dari {totalPages}
        </div>

        <div className="flex-grow"></div>

        <Pagination className="justify-end">
          <PaginationContent>
            <PaginationItem>
              <Button
                size="sm"
                onClick={prevPage}
                disabled={currentPage === 1}
                className="bg-blue-300 hover:bg-blue-200 disabled:opacity-50"
              >
                Sebelumnya
              </Button>
            </PaginationItem>

            <PaginationItem>
              <Button
                size="sm"
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="bg-blue-300 hover:bg-blue-200 disabled:opacity-50"
              >
                Berikutnya
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
