/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { DashboardProvider } from '@/contexts/DashboardContext';
import { toast } from 'sonner';
import { KeyedMutator } from 'swr';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Checkbox } from '../ui/checkbox';
import { Loader2 } from 'lucide-react';
import { updateRolePermission } from '@/app/(dashboard)/(protected_admin)/kelola-akun/hak-akses/actions';

interface DataState<T> {
  data: T | null;
  isLoading: boolean;
  error: any;
}

interface Role {
  id: string;
  name: string;
  description: string;
}

interface Permission {
  id: string;
  name: string;
  description: string;
}

interface RolePermission {
  role_id: string;
  permission_id: string;
}

interface Data {
  dataRole: DataState<Role[]>;
  dataPermission: DataState<Permission[]>;
  dataRolePermission: DataState<RolePermission[]>;
}

interface HakAksesUIProps {
  data: Data;
  isPublicView?: boolean;
  mutate: KeyedMutator<any>;
}

export function HakAksesUI({
  isPublicView = false,
  data,
  mutate,
}: HakAksesUIProps): JSX.Element {
  const { dataRole, dataPermission, dataRolePermission } = data;

  const isLoading =
    dataRole.isLoading ||
    dataPermission.isLoading ||
    dataRolePermission.isLoading;

  const handlePermissionChange = async (
    roleName: string,
    permissionName: string,
    isChecked: boolean
  ) => {
    const result = await updateRolePermission(
      roleName,
      permissionName,
      isChecked
    );

    if (result.error) {
      toast.error('Gagal', { description: result.error });
    } else {
      toast.success('Hak akses berhasil diperbarui.');
      mutate();
    }
  };

  return (
    <DashboardProvider isPublicView={isPublicView}>
      <>
        <div className="space-y-4">
          <div className="flex w-full items-center justify-between px-2 pt-2 mb-8">
            <div className="flex flex-col">
              <h1 className="text-4xl font-semibold text-white">
                Data Hak Akses
              </h1>
              <div className="flex items-center mt-2 gap-1">
                <p className=" text-white text-sm">
                  Berikut adalah daftar Hak Akses, anda dapat mengelola hak
                  akses untuk setiap peran yang ada di dalam sistem.
                </p>
              </div>
            </div>
          </div>
          <div className="px-2 py-0 flex flex-col gap-4 mb-8">
            <div className="w-full px-1">
              <div className="mt-3 rounded-xl overflow-hidden bg-card">
                {isLoading ? (
                  <div className="flex justify-center items-center h-[50px]">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
                    <span className="ml-2 text-black text-md">
                      Memuat data...
                    </span>
                  </div>
                ) : (
                  <Table>
                    <TableHeader className="bg-gray-100">
                      <TableRow>
                        <TableHead className="w-[350px] font-medium py-3 text-center">
                          Hak Akses
                        </TableHead>
                        {dataRole.data?.map((role: any) => (
                          <TableHead
                            key={role.name}
                            className="text-center font-medium py-3"
                          >
                            {role.description}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dataPermission.data?.map((permission: any) => (
                        <TableRow key={permission.name}>
                          <TableCell className="font-normal py-4">
                            {permission.description}
                          </TableCell>
                          {dataRole.data?.map((role: any) => {
                            const isChecked = dataRolePermission.data?.some(
                              (p: RolePermission) =>
                                p.role_id === role.id &&
                                p.permission_id === permission.id
                            );
                            return (
                              <TableCell
                                key={role.name}
                                className="text-center"
                              >
                                <Checkbox
                                  className="data-[state=checked]:bg-blue-300 data-[state=checked]:border-blue-400 border-blue-400 cursor-pointer"
                                  checked={isChecked}
                                  onCheckedChange={(checked) =>
                                    handlePermissionChange(
                                      role.name,
                                      permission.name,
                                      !!checked
                                    )
                                  }
                                />
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    </DashboardProvider>
  );
}
