// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeHeaders(rows: Record<string, any>[]): Record<string, any>[] {
  return rows.map(row => 
      Object.fromEntries(
          Object.entries(row).map(([key, value]) => [key.toLowerCase().trim(), value])
      )
  );
}

export function normalizeDate(val) {
  if (!val || val === '' || val === '-' || val === 'N/A') return null;
  
  const stringVal = String(val).trim();
  
  const patterns = [
    { // "2024-06-30 12:00:00"
      regex: /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
      parser: (v)=>new Date(v)
    },
    { // "2024-06-30"
      regex: /^\d{4}-\d{2}-\d{2}$/,
      parser: (v)=>new Date(v)
    },
    { // "30/06/2024"
      regex: /^\d{2}\/\d{2}\/\d{4}$/,
      parser: parseSlashDate
    },
    { // "30/06/2024 14:30:00"
      regex: /^\d{1,2}\/\d{1,2}\/\d{4} \d{1,2}:\d{1,2}:\d{1,2}$/,
      parser: parseSlashDateTime
    },
    { // "30-06-2024"
      regex: /^\d{1,2}-\d{1,2}-\d{4}$/,
      parser: parseDashDate
    },
    { // "29 Agustus 2022"
      regex: /^\d{1,2} [A-Za-z]+ \d{4}$/,
      parser: parseTextDate,  
    },
  ];
  
  for (const pattern of patterns){
    if (pattern.regex.test(stringVal)) {
      try {
        const parsed = pattern.parser(stringVal);
        return isValidDate(parsed) ? parsed : null;
      } catch (error) {
        console.warn(`Date parsing error for "${stringVal}":`, error);
        continue;
      }
    }
  }
  
  try {
    const parsed = new Date(stringVal);
    return isValidDate(parsed) ? parsed : null;
  } catch  {
    return null;
  }
}

function parseSlashDate(dateStr) {
  const [day, month, year] = dateStr.split('/').map(Number);

  return new Date(year, month - 1, day);
}

function parseSlashDateTime(dateStr) {
  const [datePart, timePart] = dateStr.split(' ');
  const [day, month, year] = datePart.split('/').map(Number);
  const [hour, minute, second] = timePart.split(':').map(Number);

  return new Date(year, month - 1, day, hour, minute, second);
}

function parseDashDate(dateStr) {
  const [day, month, year] = dateStr.split('-').map(Number);

  return new Date(year, month - 1, day);
}

function parseTextDate(dateStr) {
  const [day, monthName, year] = dateStr.split(' ');
  
  const months = {
    januari: 1,
    februari: 2,
    maret: 3,
    april: 4,
    mei: 5,
    juni: 6,
    juli: 7,
    agustus: 8,
    september: 9,
    oktober: 10,
    november: 11,
    desember: 12,
  };
  
  const month = months[monthName.toLowerCase()];
  
  if (month === undefined) throw new Error(`Unknown month: ${monthName}`);
  
  return new Date(Number(year), month - 1, Number(day));
}

function isValidDate(date) {
  return date instanceof Date && !isNaN(date.getTime());
}

export function normalizeGpa(val) {
  if (val === null || val === undefined || val === '') return null;
  
  const stringVal = String(val).trim();
  const cleaned = stringVal.replace(/[^\d.,\-]/g, '');
  const normalized = cleaned.replace(',', '.');

  if (normalized === '') return null;
  
  const parsed = parseFloat(normalized);

  if (isNaN(parsed)) {
    return null;
  }

  if (parsed > 4 && normalized.indexOf('.') === -1) {
    return parsed / 100;
  }
  
  return parsed;
}

export function normalizeNumber(val) {
  if (val === null || val === undefined || val === '' || String(val).toLowerCase().includes('kosong'))     
    return null;
  
  const stringVal = String(val).trim();
  const cleaned = stringVal.replace(/[^\d.,\-]/g, '');
  const normalized = cleaned.replace(',', '.');
  const parsed = parseFloat(normalized);

  return isNaN(parsed) ? null : parsed;
}

export function normalizeInt(val) {
  if (!val || val === '' || String(val).toLowerCase().includes('kosong')) 
    return null;

  const stringVal = String(val).trim();
  const cleaned = stringVal.replace(/[^\d\-]/g, '');
  const parsed = parseInt(cleaned, 10);

  return isNaN(parsed) ? null : parsed;
}

export function normalizeCurrency(val) {
  if (val === null || val === undefined || val === '' || val === '-') return null;

  const stringVal = String(val).toLowerCase().trim();

  if (stringVal.includes('kosong') || stringVal === 'n/a') return null;

  let cleaned = stringVal.replace(/[rp\s]/gi, '');

  if (cleaned.includes(',')) {
    cleaned = cleaned.replace(/\./g, '').replace(',', '.');
  } else {
    cleaned = cleaned.replace(/,/g, '');
  }

  const parsed = parseFloat(cleaned);

  return isNaN(parsed) ? null : parsed;
}

export function normalizeEmploymentStatus(val) {
  if (!val) return null;

  const cleaned = String(val).trim().toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, ' ');

  const statusMap = {
  'belum diisi': 'Belum Diisi',
  'belum bekerja sedang mencari': 'Belum Bekerja',
  'belum memungkinkan bekerja': 'Belum Bekerja',
  'bekerja': 'Bekerja',
  'berwiraswasta': 'Berwiraswasta',
  'melanjutkan studi': 'Studi Lanjut',
  'melanjutkan pendidikan': 'Studi Lanjut'
  };

  return statusMap[cleaned] || null;
}

export function normalizeWorkplace(val) {
  if (!val) return null;

  const stringVal = String(val).trim();
  const emptyIndicators = [
      '',
      '-',
      'n/a',
      '#n/a',
      '#N/A',
      'null'
  ];

  if (emptyIndicators.includes(stringVal.toLowerCase())) {
      return null;
  }
  
  return stringVal.length > 0 ? stringVal : null;
}

export function normalizeName(val) {
  if (val === null || val === undefined || val === '') return null;

  return String(val).trim().toUpperCase();
}

export function normalizeTitleCase(val) {
  if (val === null || val === undefined || val === '') return null;

  const cleaned = val.trim().toLowerCase();
  if (cleaned === '') return null;
  
  return cleaned
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function normalizeMinWage(val) {
  const minWage = normalizeCurrency(val);
  
  return minWage !== null ? Math.round((minWage / 1.2) * 1000) / 1000 : null;
}

export function normalizeFilled(val) {
  return String(val).toLowerCase() === 'sudah';
}

export function normalizeChecked(val) {
  return String(val).trim().toUpperCase() === 'V';
}

export function normalizeDurationSemesters(val) {
  const years = normalizeNumber(val); 

  if (years === null) return null;

  return Math.round(years * 2);
}

export function parseCurrency(val): { amount: number | null, currency: string | null } {
  const defaultValue = { amount: null, currency: 'IDR' };
  if (val === null || val === undefined || val === '') return defaultValue;

  const stringVal = String(val).toLowerCase().trim();
  let currency = 'IDR';

  if (stringVal.startsWith('rm')) {
    currency = 'MYR';
  }

  const digitsOnly = stringVal.replace(/[^\d]/g, '');

  if (digitsOnly === '') {
    return { amount: null, currency: currency };
  }
  
  const parsedAmount = parseInt(digitsOnly, 10);
  
  if (isNaN(parsedAmount)) {
    return { amount: null, currency: currency };
  }

  return { amount: parsedAmount, currency: currency };
}