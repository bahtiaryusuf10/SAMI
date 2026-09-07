import { toast } from 'sonner';
import { ColumnDef } from '@tanstack/react-table';

const formatFileName = (baseTitle: string): string => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  const localTimestamp = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;

  const safeTitle = baseTitle.toLowerCase().replace(/ /g, '_');

  return `${safeTitle}_${localTimestamp}`;
};

export const exportAsPng = async (element: HTMLElement, title: string) => {
  try {
    const { toPng } = await import('html-to-image');
    const dataUrl = await toPng(element, { cacheBust: true });

    const link = document.createElement('a');
    link.download = `${formatFileName(title)}.png`;
    link.href = dataUrl;
    link.click();
  } catch (e) {
    if (e instanceof Error) {
      console.error('Error exporting PNG :', e);
      toast.error('Export failed', {
        description: e.message,
      });
    }
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const exportAsXlsx = async (data: any[], title: string, columns?: ColumnDef<any>[]) => {
  if (!data || data.length === 0) {
    console.error('No data to export.');
    toast.error('Export failed', {
      description: 'No data to export.',
    });
    return;
  }

  try {
    const { default: ExcelJS } = await import('exceljs');
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data');

    if (columns && columns.length > 0) {
      worksheet.columns = columns
        .filter(
          (col) =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (col as any).accessorKey && (col as any).meta?.displayName
        )
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((col: any) => ({
          header: col.meta?.displayName || col.header || col.accessorKey,
          key: col.accessorKey,
          width: 30,
        }));
    }
    else {
      worksheet.columns = Object.keys(data[0]).map((key) => ({
        header: key.charAt(0).toUpperCase() + key.slice(1),
        key: key,
        width: 25,
      }));
    }

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
