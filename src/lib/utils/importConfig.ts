interface ImportTypeConfig {
  buttonLabel: string;
  title: string;
  description: string;
  url: string;
}

export const importConfigurations: Record<string, ImportTypeConfig> = {
  graduates: {
    buttonLabel: 'Lulusan',
    title: 'Import Data Lulusan',
    description: 'Import file .csv atau .xlsx Kelulusan Mahasiswa.',
    url: 'https://cnyzltjehkkeyzquadmo.supabase.co/functions/v1/import-graduates',
  },
  tracer_studies: {
    buttonLabel: 'PKTS',
    title: 'Import Data PKTS',
    description:
    'Import file .csv atau .xlsx Pemantauan Kinerja Tracer Study (PKTS).',
    url: 'https://cnyzltjehkkeyzquadmo.supabase.co/functions/v1/import-tracer-studies',
  },
  students: {
    buttonLabel: 'Mahasiswa',
    title: 'Import Data Mahasiswa',
    description:
    'Import file .csv atau .xlsx Mahasiswa.',
    url: 'https://cnyzltjehkkeyzquadmo.supabase.co/functions/v1/import-students',
  },
  certificates: {
    buttonLabel: 'Sertifikat Mahasiswa',
    title: 'Import Data Sertifikat Mahasiswa',
    description:
    'Import file .csv atau .xlsx Sertifikat Mahasiswa.',
    url: 'https://cnyzltjehkkeyzquadmo.supabase.co/functions/v1/import-certificates',
  },
  mbkms: {
    buttonLabel: 'MBKM Mahasiswa',
    title: 'Import Data MBKM Mahasiswa',
    description:
    'Import file .csv atau .xlsx MBKM Mahasiswa.',
    url: 'https://cnyzltjehkkeyzquadmo.supabase.co/functions/v1/import-mbkms',
  },
  achievements: {
    buttonLabel: 'Prestasi Mahasiswa',
    title: 'Import Data Prestasi Mahasiswa',
    description:
    'Import file .xlsx Prestasi Mahasiswa.',
    url: 'https://cnyzltjehkkeyzquadmo.supabase.co/functions/v1/import-achievements',
  },
  lecturers: {
    buttonLabel: 'Dosen',
    title: 'Import Data Dosen',
    description:
    'Import file .csv atau .xlsx Dosen.',
    url: 'https://cnyzltjehkkeyzquadmo.supabase.co/functions/v1/import-lecturers',
  },
  cooperations: {
    buttonLabel: 'Kerja Sama',
    title: 'Import Data Kerja Sama',
    description:
    'Import file .csv atau .xlsx Kerja Sama.',
    url: 'https://cnyzltjehkkeyzquadmo.supabase.co/functions/v1/import-cooperations',
  },
  accreditations: {
    buttonLabel: 'Akreditasi',
    title: 'Import Data Akreditasi',
    description:
    'Import file .csv atau .xlsx Akreditasi.',
    url: 'https://cnyzltjehkkeyzquadmo.supabase.co/functions/v1/import-accreditations',
  },
  research_services: {
    buttonLabel: 'Penelitian & Pengabdian',
    title: 'Import Data Penelitian & Pengabdian',
    description:
    'Import file .xlsx Penelitian & Pengabdian.',
    url: 'https://cnyzltjehkkeyzquadmo.supabase.co/functions/v1/import-research-services',
  },
  field_experiences: {
    buttonLabel: 'Pengalaman Praktisi Dosen',
    title: 'Import Data Pengalaman Praktisi Dosen',
    description:
    'Import file .csv atau .xlsx Pengalaman Praktisi Dosen.',
    url: 'https://cnyzltjehkkeyzquadmo.supabase.co/functions/v1/import-field-experiences',
  },
  teach_activities: {
    buttonLabel: 'Aktivitas Mengajar Dosen Di Luar Kampus',
    title: 'Import Data Aktivitas Mengajar Dosen Di Luar Kampus',
    description:
    'Import file .csv atau .xlsx Aktivitas Mengajar Dosen Di Luar Kampus.',
    url: 'https://cnyzltjehkkeyzquadmo.supabase.co/functions/v1/import-teach-activities',
  },
  detasering_activities: {
    buttonLabel: 'Aktivitas Detasering Dosen',
    title: 'Import Data Aktivitas Detasering Dosen',
    description:
    'Import file .csv atau .xlsx Aktivitas Detasering Dosen.',
    url: 'https://cnyzltjehkkeyzquadmo.supabase.co/functions/v1/import-detasering-activities',
  },
  courses: {
    buttonLabel: 'Mata Kuliah',
    title: 'Import Data Mata Kuliah',
    description:
    'Import file .csv atau .xlsx Mata Kuliah.',
    url: 'https://cnyzltjehkkeyzquadmo.supabase.co/functions/v1/import-courses',
  },
  practitioner_teachings: {
    buttonLabel: 'Praktisi Mengajar',
    title: 'Import Data Praktisi Mengajar',
    description:
    'Import file .csv atau .xlsx Praktisi Mengajar.',
    url: 'https://cnyzltjehkkeyzquadmo.supabase.co/functions/v1/import-practitioner-teachings',
  },
  journal_conferences: {
    buttonLabel: 'Jurnal & Seminar',
    title: 'Import Data Jurnal & Seminar',
    description:
    'Import file .xlsx Jurnal & Seminar.',
    url: 'https://cnyzltjehkkeyzquadmo.supabase.co/functions/v1/import-journal-conferences',
  },
};