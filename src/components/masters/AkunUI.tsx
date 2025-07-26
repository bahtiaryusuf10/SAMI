'use client';

import { DashboardProvider } from '@/contexts/DashboardContext';
import { MyDataTableMaster } from '../tables/MyDataTableMaster';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { toast } from 'sonner';
import { KeyedMutator } from 'swr';
import {
  deleteUser,
  updateUserRole,
} from '@/app/(dashboard)/(protected_admin)/kelola-akun/akun/actions';

interface DataState<T> {
  data: T | null;
  isLoading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
}

interface Role {
  id: string;
  name: string;
  description: string;
}

interface Akun {
  id: string;
  email: string;
  full_name: string;
  roles: Role;
}

interface Data {
  dataAkun: DataState<Akun[]>;
}

interface AkunUIProps {
  data: Data;
  isPublicView?: boolean;
  columns: ColumnDef<Akun>[];
}

export const accountColumns = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resultAkun: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mutate: KeyedMutator<any>,
  allRoles: Role[]
): ColumnDef<Akun>[] => [
  {
    accessorKey: 'full_name',
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Nama
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div
          className="text-left whitespace-normal break-words line-clamp-2"
          title={row.getValue('full_name')}
        >
          {row.getValue('full_name')}
        </div>
      );
    },
    meta: {
      displayName: 'Nama',
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-center whitespace-normal break-words line-clamp-2">
          {row.getValue('email')}
        </div>
      );
    },
    meta: {
      displayName: 'Email',
    },
  },
  {
    accessorKey: 'role',
    header: () => {
      return <div className="text-center">Peran</div>;
    },
    cell: ({ row }) => {
      const user = row.original;

      const handleRoleChange = async (newRoleName: string) => {
        const newRole = allRoles.find((r) => r.name === newRoleName);
        if (!newRole) return;

        const optimisticData = (resultAkun?.data || []).map((u: Akun) =>
          u.id === user.id ? { ...u, roles: newRole } : u
        );
        mutate({ ...resultAkun, data: optimisticData }, false);

        const result = await updateUserRole(user.id, newRole.id);

        if (result.error) {
          toast.error('Gagal', { description: result.error });
          mutate();
        } else {
          toast.success(
            `Peran ${user.full_name} berhasil diubah menjadi ${
              newRole.description || newRole.name
            }`
          );
        }
      };

      return (
        <div className="flex justify-center">
          <Select
            value={user.roles?.name || ''}
            onValueChange={handleRoleChange}
          >
            <SelectTrigger className="w-[70%]">
              <SelectValue placeholder="Pilih Peran" />
            </SelectTrigger>
            <SelectContent>
              {allRoles?.map((role) => (
                <SelectItem key={role.id} value={role.name}>
                  {role.description || role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    },
    meta: {
      displayName: 'Peran',
    },
  },
  {
    id: 'Aksi',
    header: () => {
      return <div className="text-center">Aksi</div>;
    },
    cell: ({ row }) => {
      const user = row.original;

      const handleDelete = async () => {
        const result = await deleteUser(user.id);
        if (result.error) {
          toast.error('Gagal', { description: result.error });
        } else {
          toast.success('Pengguna berhasil dihapus');
          mutate();
        }
      };

      return (
        <div className="text-center">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="icon"
                className="cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Yakin ingin menghapus akun ini?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Tindakan ini tidak dapat dibatalkan. Data akun{' '}
                  <strong>{user.full_name}</strong> akan dihapus secara
                  permanen.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="cursor-pointer">
                  Batal
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="cursor-pointer bg-red-600 hover:bg-red-400"
                >
                  Hapus
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
    meta: {
      displayName: 'Aksi',
    },
  },
];

export function AkunUI({
  isPublicView = false,
  data,
  columns,
}: AkunUIProps): JSX.Element {
  const { dataAkun } = data;

  return (
    <DashboardProvider isPublicView={isPublicView}>
      <>
        <div className="space-y-4">
          <div className="flex w-full items-center justify-between px-2 pt-2 mb-8">
            <div className="flex flex-col">
              <h1 className="text-4xl font-semibold text-white">Data Akun</h1>
              <div className="flex items-center mt-2 gap-1">
                <p className=" text-white text-sm">
                  Berikut adalah daftar akun yang terdaftar dalam sistem.
                </p>
              </div>
            </div>
          </div>
          <div className="px-2 py-0 flex flex-col gap-4 mb-8">
            <div className="w-full">
              <div className="px-1 mb-5">
                <MyDataTableMaster
                  columns={columns}
                  data={dataAkun.data || []}
                  searchPlaceholder="Cari berdasarkan Nama atau Email [ / ]"
                  isLoading={dataAkun.isLoading}
                />
              </div>
            </div>
          </div>
        </div>
      </>
    </DashboardProvider>
  );
}
