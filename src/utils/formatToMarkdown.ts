// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatToMarkdownTable(data: any[]): string {
  if (!Array.isArray(data) || data.length === 0) return 'Tidak ada data.';

  const keys = Object.keys(data[0]).filter(
    (k) => !['id', 'created_at'].includes(k)
  );

  function formatHeader(str: string): string {
    return str
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  const header = `| ${keys.map(formatHeader).join(' | ')} |`;
  const separator = `| ${keys.map(() => '---').join(' | ')} |`;

  const rows = data.slice(0, 15).map((row) => {
    return (
      '| ' +
      keys
        .map((k) => {
          let val = row[k];
          if (val === null || val === undefined || val === '') val = '-';
          else if (typeof val === 'boolean') val = val ? 'Ya' : 'Tidak';
          return val.toString();
        })
        .join(' | ') +
      ' |'
    );
  });

  return [header, separator, ...rows].join('\n');
}
