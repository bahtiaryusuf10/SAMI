/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

// import BarChartSettings from '@/components/chart-settings/BarChartSettings';
// import MyResponsiveBar from '@/components/charts/BarDinamis';
import MyResponsivePie from '@/components/charts/PieDinamis';
import BubbleChat from '@/components/forms/BubbleChat';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbList,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  // DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  // DetailLulusan,
  getJenisPekerjaanByStatus,
  // getKpiLulusanData,
  getStatusLulusanData,
} from '@/data/dataLulusanBekerja';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
// import { extractKeysFromData } from '@/utils/chart';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toPng } from 'html-to-image';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Menu } from 'lucide-react';
import ExcelJS from 'exceljs';

const detailDataSchema = z.object({
  tahun: z.number().int().min(1900).max(2100),
  nama: z.string().min(1),
  jenis_pekerjaan: z.string(),
  sesuai_bidang: z.boolean(),
  waktu_tunggu: z.number().nonnegative(),
  gaji: z.number().int().nonnegative(),
  status_bekerja: z.string().min(1),
});

type DetailDataSchema = z.infer<typeof detailDataSchema>;

export default function LulusanBekerjaPage() {
  // const [kpiLulusan, setKpiLulusan] = useState<any[]>([]);
  const [statusLulusan, setStatusLulusan] = useState<any[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [jenisPekerjaan, setJenisPekerjaan] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // const [keys, setKeys] = useState<string[]>([]);

  // const [layout, setLayout] = useState<'horizontal' | 'vertical'>('vertical');
  // const [groupMode, setGroupMode] = useState<'stacked' | 'grouped'>('stacked');
  // const [colorPalette, setColorPalette] = useState<
  //   'nivo' | 'accent' | 'paired' | 'spectral'
  // >('nivo');
  // const [showLabels, setShowLabels] = useState<true | false>(true);

  // useEffect(() => {
  //   getKpiLulusanData()
  //     .then((rawData) => {
  //       console.log(rawData);
  //       const grouped = rawData.reduce((acc: any[], item: any) => {
  //         const tahun = item.tahun.toString();
  //         const found = acc.find((d) => d.years === tahun);
  //         if (found) {
  //           found[item.indikator] = item.capaian;
  //         } else {
  //           acc.push({
  //             years: tahun,
  //             [item.indikator]: item.capaian,
  //           });
  //         }
  //         return acc;
  //       }, []);

  //       setKpiLulusan(grouped);
  //       const extracted = extractKeysFromData(grouped, 'years');
  //       setKeys(extracted);
  //     })
  //     .catch(console.error);
  // }, []);

  const [isLoadingJenisPekerjaan, setIsLoadingJenisPekerjaan] = useState(false);

  useEffect(() => {
    getStatusLulusanData().then((data) => {
      const transformed = data?.map(
        (item: { status_bekerja: string; jumlah: number }) => ({
          id: item.status_bekerja,
          label: item.status_bekerja,
          value: item.jumlah,
        })
      );
      setStatusLulusan(transformed);
    });
  }, []);

  useEffect(() => {
    if (selectedStatus) {
      fetchDetailDrillDownData(selectedStatus);
    }
  }, [selectedStatus]);

  const fetchDetailDrillDownData = async (status: string) => {
    setIsLoadingJenisPekerjaan(true);
    const jenis = await getJenisPekerjaanByStatus(status);
    setJenisPekerjaan(jenis);
    setIsLoadingJenisPekerjaan(false);
  };

  const supabase = createSupabaseBrowserClient();

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof detailDataSchema>>({
    resolver: zodResolver(detailDataSchema),
    defaultValues: {
      tahun: new Date().getFullYear(),
      nama: '',
      jenis_pekerjaan: '',
      sesuai_bidang: false,
      waktu_tunggu: 0,
      gaji: 0,
      status_bekerja: '',
    },
  });

  const onSubmit = async (data: DetailDataSchema) => {
    console.log(data);
    setLoading(true);

    try {
      const { error } = await supabase.from('detail_lulusan').insert([data]);

      if (error) {
        console.error('Insert error:', error);
      } else {
        console.log('Data berhasil disimpan:', data);
        setIsDialogOpen(false);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }

    setLoading(false);
  };

  useEffect(() => {
    const channel = supabase
      .channel('realtime:detail_lulusan')
      .on(
        'postgres_changes',
        {
          event: '*', // atau 'INSERT', 'UPDATE', 'DELETE'
          schema: 'public',
          table: 'detail_lulusan',
        },
        async (payload) => {
          console.log('Perubahan realtime:', payload);

          // const { eventType, new: newData, old: oldData } = payload;

          // setStatusLulusan((prev) => {
          //   switch (eventType) {
          //     case 'INSERT':
          //       return [...prev, newData as DetailLulusan];
          //     case 'UPDATE':
          //       return prev.map((item) =>
          //         item.uuid === (newData as DetailLulusan).uuid
          //           ? (newData as DetailLulusan)
          //           : item
          //       );
          //     case 'DELETE':
          //       return prev.filter(
          //         (item) => item.uuid !== (oldData as DetailLulusan).uuid
          //       );
          //     default:
          //       return prev;
          //   }
          // });

          const data = await getStatusLulusanData();
          const transformed = data?.map(
            (item: { status_bekerja: string; jumlah: number }) => ({
              id: item.status_bekerja,
              label: item.status_bekerja,
              value: item.jumlah,
            })
          );
          setStatusLulusan(transformed);
        }
      )
      .subscribe((status) => {
        console.log('Subscription:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const chartRef = useRef(null);

  const handleExportPng = () => {
    if (chartRef.current === null) return;
    toPng(chartRef.current)
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'chart.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('Error exporting PNG:', err);
      });
  };

  type Row = {
    [key: string]: string | number | boolean | null;
  };

  const handleExportXls = async (data: Row[], fileName = 'data.xlsx') => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Sheet 1');

      worksheet.columns = Object.keys(data[0]).map((key) => ({
        header: key,
        key,
        width: 20,
      }));

      data.forEach((item) => {
        worksheet.addRow(item);
      });

      const buffer = await workbook.xlsx.writeBuffer();

      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
    } catch (err) {
      console.error('Error exporting XLS:', err);
    }
  };

  // const handleExportCsv = async (data, fileName = 'data.csv') => {
  //   try {
  //     const workbook = new ExcelJS.Workbook();
  //     const worksheet = workbook.addWorksheet('Sheet 1');

  //     worksheet.columns = Object.keys(data[0]).map((key) => ({
  //       header: key,
  //       key,
  //       width: 20,
  //     }));

  //     data.forEach((item) => {
  //       worksheet.addRow(item);
  //     });

  //     const csvString = await worksheet.csv.writeBuffer();

  //     const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  //     const link = document.createElement('a');
  //     link.href = URL.createObjectURL(blob);
  //     link.download = fileName;
  //     link.click();
  //   } catch (err) {
  //     console.error('Error exporting CSV:', err);
  //   }
  // };

  return (
    <>
      <div className="flex flex-col">
        <div className="p-6 flex flex-row gap-5">
          {/* <div className="h-[500px] w-1/2 bg-white shadow rounded-md p-4">
          <h1 className="text-2xl font-bold mb-4">Capaian Lulusan</h1>
          <BarChartSettings
            layout={layout}
            setLayout={setLayout}
            groupMode={groupMode}
            setGroupMode={setGroupMode}
            colorPalette={colorPalette}
            setColorPalette={setColorPalette}
            showLabels={showLabels}
            setShowLabels={setShowLabels}
          />
          <div className="w-full relative h-[370px] lg:h-[375px]">
            {kpiLulusan.length > 0 && keys.length > 0 ? (
              <MyResponsiveBar
                data={kpiLulusan}
                keys={keys}
                indexBy="years"
                layout={layout}
                groupMode={groupMode}
                showLabels={showLabels}
                colorPalette={colorPalette}
                legendBottom="Tahun"
                legendLeft="Capaian (%)"
              />
            ) : (
              <p>Loading chart data...</p>
            )}
          </div>
        </div> */}
          <div
            ref={chartRef}
            id="status-lulusan-chart"
            className="h-[500px] w-1/2 bg-white shadow-[0_0_10px_rgba(0,0,0,0.15)] rounded-md p-4"
          >
            {/* Breadcrumb Section */}
            <div className="flex flex-row justify-between">
              <div className="flex flex-col items-start mb-4 gap-2">
                <h1 className="text-2xl font-bold">Status Lulusan</h1>
                {selectedStatus && (
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem>
                        <BreadcrumbLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedStatus(null); // Reset ke level 1
                          }}
                        >
                          Status Lulusan
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbLink
                          href="#"
                          className="cursor-default"
                          onClick={(e) => e.preventDefault()}
                        >
                          {selectedStatus}
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                )}
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-gray-100 hover:bg-gray-200"
                  >
                    <Menu className="w-6 h-6" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end" data-no-drag>
                  <div className="space-y-0">
                    <div
                      onClick={handleExportPng}
                      className="cursor-pointer px-3 py-2 hover:bg-gray-100 rounded transition"
                    >
                      Export PNG
                    </div>
                    <div
                      onClick={() => {
                        const exportData = selectedStatus
                          ? jenisPekerjaan
                          : statusLulusan;
                        const fileName = selectedStatus
                          ? `status-lulusan-${selectedStatus}.xlsx`
                          : 'status-lulusan.xlsx';
                        handleExportXls(exportData, fileName);
                      }}
                      className="cursor-pointer px-3 py-2 hover:bg-gray-100 rounded transition"
                    >
                      Export Excel
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="w-full relative h-[370px] lg:h-[375px]">
              {statusLulusan.length === 0 ? (
                <p>Loading chart data...</p>
              ) : selectedStatus && isLoadingJenisPekerjaan ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900" />
                </div>
              ) : selectedStatus && jenisPekerjaan.length === 0 ? (
                <p>Data tidak tersedia untuk status ini.</p>
              ) : (
                <MyResponsivePie
                  data={selectedStatus ? jenisPekerjaan : statusLulusan}
                  colorPalette="nivo"
                  onClickSlice={(data) => setSelectedStatus(String(data.id))}
                />
              )}
            </div>
          </div>
          <div className="h-[500px] w-1/2  rounded-md p-4">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger>
                <div className="h-10 bg-amber-200 rounded-2xl p-2 text-md font-semibold">
                  Add Data
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add detail data</DialogTitle>
                  <DialogDescription>Isi detail data lulusan</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="tahun"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tahun</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="2024"
                              {...field}
                              onChange={(event) =>
                                field.onChange(+event.target.value)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="nama"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nama</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Nama lulusan"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="jenis_pekerjaan"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jenis Pekerjaan</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Contoh: Software Engineer"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="status_bekerja"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status Bekerja</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Bekerja">Bekerja</SelectItem>
                              <SelectItem value="Belum Terlacak">
                                Belum Terlacak
                              </SelectItem>
                              <SelectItem value="Studi Lanjut">
                                Studi Lanjut
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sesuai_bidang"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between py-2">
                          <FormLabel className="!m-0">
                            Sesuai Bidang Studi
                          </FormLabel>
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="waktu_tunggu"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Waktu Tunggu (bulan)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Contoh: 2.5"
                              step="0.1"
                              {...field}
                              onChange={(event) =>
                                field.onChange(+event.target.value)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="gaji"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gaji (Rp)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Contoh: 5000000"
                              {...field}
                              onChange={(event) =>
                                field.onChange(+event.target.value)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="pt-4">
                      <Button
                        type="submit"
                        className="w-full bg-amber-300 hover:opacity-80 hover:bg-amber-300 text-black"
                        disabled={loading}
                        onClick={() => console.log('TOMBOL DIKLIK')}
                      >
                        {loading ? 'Sending...' : 'Add data'}
                      </Button>
                    </div>
                    {/* <DialogFooter>
                    <Button
                      type="submit"
                      className="mt-4 w-full bg-blue-400 hover:opacity-80 hover:bg-blue-400"
                      disabled={loading}
                    >
                      {loading ? 'Sending...' : 'Add data'}
                    </Button>
                  </DialogFooter> */}
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      <BubbleChat />
    </>
  );
}
