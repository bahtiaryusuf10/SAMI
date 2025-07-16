import { toPng } from 'html-to-image';
import ExcelJS from 'exceljs';
import { toast } from 'sonner';

/**
 * Membuat nama file yang aman dengan tambahan timestamp.
 * Contoh: 'grafik_lokasi_kerja_2025-06-13_15-45-00'
 * @param baseTitle Judul dasar untuk file, misal "Lokasi Bekerja"
 * @returns Nama file yang sudah diformat.
 */
const formatFileName = (baseTitle: string): string => {
  const now = new Date();

  const year = now.getFullYear();
  // getMonth() 0-indexed (Januari=0), jadi kita perlu tambah 1
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  // Gabungkan menjadi format yang kita inginkan (YYYY-MM-DD_HH-MM-SS)
  const localTimestamp = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;

  const safeTitle = baseTitle.toLowerCase().replace(/ /g, '_');

  return `${safeTitle}_${localTimestamp}`;
};

/**
 * Mengekspor elemen HTML sebagai file PNG.
 * @param element Ref ke elemen HTML yang ingin diekspor.
 * @param title Judul dasar untuk nama file.
 */
export const exportAsPng = (element: HTMLElement, title: string) => {
  toPng(element, { cacheBust: true })
    .then((dataUrl) => {
      const link = document.createElement('a');
      link.download = `${formatFileName(title)}.png`;
      link.href = dataUrl;
      link.click();
    })
    .catch((e) => {
      if (e instanceof Error) {
        console.error('Error exporting PNG :', e);
        toast.error('Export failed', {
          description: e.message,
        });
      }
    });
};

/**
 * Mengekspor array data sebagai file XLSX.
 * @param data Array objek yang akan diekspor.
 * @param title Judul dasar untuk nama file.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const exportAsXlsx = async (data: any[], title: string) => {
  if (!data || data.length === 0) {
    console.error('No data to export.');
    toast.error('Export failed', {
      description: 'No data to export.',
    });
    return;
  }

  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data');

    worksheet.columns = Object.keys(data[0]).map((key) => ({
      header: key.charAt(0).toUpperCase() + key.slice(1),
      key: key,
      width: 25,
    }));

    worksheet.addRows(data);

    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${formatFileName(title)}.xlsx`;
    link.click();
  } catch (e) {
    if (e instanceof Error) {
      console.error('Error exporting XLSX :', e);
      toast.error('Export failed', {
        description: e.message,
      });
    }
  }
};
