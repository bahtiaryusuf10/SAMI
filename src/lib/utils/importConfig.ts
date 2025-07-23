interface ImportTypeConfig {
  buttonLabel: string;
  title: string;
  description: string;
  url: string;
  urlTemplate: string;
}

export const importConfigurations: Record<string, ImportTypeConfig> = {
  graduates: {
    buttonLabel: 'Lulusan',
    title: 'Lulusan',
    description: 'Import file .csv atau .xlsx data Kelulusan Mahasiswa.',
    url: 'https://cnyzltjehkkeyzquadmo.supabase.co/functions/v1/import-graduates',
    urlTemplate: 'https://docs.google.com/spreadsheets/d/1gBjxO2WZCDJ6Euhbnz_fNvfyWfON74lUOXo3vA0XMgU/edit?gid=0#gid=0',
  },
  tracer_studies: {
    buttonLabel: 'PKTS',
    title: 'PKTS',
    description:
    'Import file .csv atau .xlsx data Pemantauan Kinerja Tracer Study (PKTS).',
    url: 'https://cnyzltjehkkeyzquadmo.supabase.co/functions/v1/import-tracer-studies',
    urlTemplate: 'https://docs.google.com/spreadsheets/d/1jV0zOeSwnEtjeu482R8fatS8x9GXzPsz-jK6X8h3avY/edit?gid=0#gid=0',
  },
  students: {
    buttonLabel: 'Mahasiswa',
    title: 'Mahasiswa',
    description:
    'Import file .csv atau .xlsx data Mahasiswa.',
    url: 'https://cnyzltjehkkeyzquadmo.supabase.co/functions/v1/import-students',
    urlTemplate: 'https://docs.google.com/spreadsheets/d/1SzMAMf_OFH3-FQUqhhnPi3oFzMtNLizaSYP1xdarU_o/edit?gid=0#gid=0',
  },
  certificates: {
    buttonLabel: 'Sertifikat Mahasiswa',
    title: 'Sertifikat Mahasiswa',
    description:
    'Import file .csv atau .xlsx data Sertifikat Mahasiswa.',
    url: 'https://cnyzltjehkkeyzquadmo.supabase.co/functions/v1/import-certificates',
    urlTemplate: 'https://docs.google.com/spreadsheets/d/1t51kRp2z5fZX9VWdjVQReXFVEYtVO12EO28-_lRRTfk/edit?gid=0#gid=0',
  },
  mbkms: {
    buttonLabel: 'MBKM Mahasiswa',
    title: 'MBKM Mahasiswa',
    description:
    'Import file .csv atau .xlsx data MBKM Mahasiswa.',
    url: 'https://cnyzltjehkkeyzquadmo.supabase.co/functions/v1/import-mbkms',
    urlTemplate: 'https://docs.google.com/spreadsheets/d/1my6fvq19zEthursMMAyHhkxKUw5CuBRNcHJzuvKXOSo/edit?gid=0#gid=0',
  },
  achievements: {
    buttonLabel: 'Prestasi Mahasiswa',
    title: 'Prestasi Mahasiswa',
    description:
    'Import file .xlsx data Prestasi Mahasiswa.',
    url: 'https://cnyzltjehkkeyzquadmo.supabase.co/functions/v1/import-achievements',
    urlTemplate: 'https://docs.google.com/spreadsheets/d/1QoosEnAAhLqTy0bJA8tFvkMOIRK_00otibCXJ8_EIwE/edit?gid=0#gid=0',
  },
  lecturers: {
    buttonLabel: 'Dosen',
    title: 'Dosen',
    description:
    'Import file .csv atau .xlsx data Dosen.',
    url: 'https://cnyzltjehkkeyzquadmo.supabase.co/functions/v1/import-lecturers',
    urlTemplate: 'https://docs.google.com/spreadsheets/d/1wljiziCpymzxvRz0w4ba-_q9qroYxeg44ZXwiY_TtC8/edit?gid=0#gid=0',
  },
  cooperations: {
    buttonLabel: 'Kerja Sama',
    title: 'Kerja Sama',
    description:
    'Import file .csv atau .xlsx data Kerja Sama.',
    url: 'https://cnyzltjehkkeyzquadmo.supabase.co/functions/v1/import-cooperations',
    urlTemplate: 'https://docs.google.com/spreadsheets/d/1jLiiLaIyXaW0oPnEhDWTj0JepUMVZRdZ-25eVCivKHE/edit?gid=0#gid=0',
  },
  accreditations: {
    buttonLabel: 'Akreditasi',
    title: 'Akreditasi',
    description:
    'Import file .csv atau .xlsx data Akreditasi.',
    url: 'https://cnyzltjehkkeyzquadmo.supabase.co/functions/v1/import-accreditations',
    urlTemplate: 'https://docs.google.com/spreadsheets/d/1rqjWhqwKjT8nZYrX2xQvmTZ_jMSE10NcijXzn0WGZGI/edit?gid=0#gid=0',
  },
  research_services: {
    buttonLabel: 'Penelitian & Pengabdian',
    title: 'Penelitian & Pengabdian',
    description:
    'Import file .xlsx data Penelitian & Pengabdian.',
    url: 'https://cnyzltjehkkeyzquadmo.supabase.co/functions/v1/import-research-services',
    urlTemplate: 'https://docs.google.com/spreadsheets/d/13QbtcGD1pj8z15ahsZv79pbutep8L4-ZAUfmzvtCb4c/edit?gid=0#gid=0',
  },
  field_experiences: {
    buttonLabel: 'Pengalaman Praktisi Dosen',
    title: 'Pengalaman Praktisi Dosen',
    description:
    'Import file .csv atau .xlsx data Pengalaman Praktisi Dosen.',
    url: 'https://cnyzltjehkkeyzquadmo.supabase.co/functions/v1/import-field-experiences',
    urlTemplate: 'https://docs.google.com/spreadsheets/d/1CGJ4i2zx2SfrgsZyCvjxxmwyoKlrMAZS21d1Ms1Elgc/edit?gid=0#gid=0',
  },
  teach_activities: {
    buttonLabel: 'Aktivitas Mengajar Dosen',
    title: 'Aktivitas Mengajar Dosen',
    description:
    'Import file .csv atau .xlsx data Aktivitas Mengajar Dosen Di Luar Kampus.',
    url: 'https://cnyzltjehkkeyzquadmo.supabase.co/functions/v1/import-teach-activities',
    urlTemplate: 'https://docs.google.com/spreadsheets/d/1AeRh2w7krQqVsI1tQOI-EnSrYW3fInUv3uGnWqWqxws/edit?gid=0#gid=0',
  },
  detasering_activities: {
    buttonLabel: 'Aktivitas Detasering Dosen',
    title: 'Aktivitas Detasering Dosen',
    description:
    'Import file .csv atau .xlsx data Aktivitas Detasering Dosen.',
    url: 'https://cnyzltjehkkeyzquadmo.supabase.co/functions/v1/import-detasering-activities',
    urlTemplate: 'https://docs.google.com/spreadsheets/d/1C1co9H2P11vPSqUrFzuOGjzuWnW5eafrnUZ98q17dtI/edit?gid=0#gid=0',
  },
  courses: {
    buttonLabel: 'Mata Kuliah',
    title: 'Mata Kuliah',
    description:
    'Import file .csv atau .xlsx data Mata Kuliah.',
    url: 'https://cnyzltjehkkeyzquadmo.supabase.co/functions/v1/import-courses',
    urlTemplate: 'https://docs.google.com/spreadsheets/d/1Mh_Pa9OHB8ApIN7irYO4RwalsWuLPvGwUc_CeOWYKFw/edit?gid=0#gid=0',
  },
  practitioner_teachings: {
    buttonLabel: 'Praktisi Mengajar',
    title: 'Praktisi Mengajar',
    description:
    'Import file .csv atau .xlsx data Praktisi Mengajar.',
    url: 'https://cnyzltjehkkeyzquadmo.supabase.co/functions/v1/import-practitioner-teachings',
    urlTemplate: 'https://docs.google.com/spreadsheets/d/1ccWbgUPK2qXBCt9LdJOpe39I77ZIkaBsngUvbAAIXgc/edit?gid=0#gid=0',
  },
  journal_conferences: {
    buttonLabel: 'Jurnal & Seminar',
    title: 'Jurnal & Seminar',
    description:
    'Import file .xlsx data Jurnal & Seminar.',
    url: 'https://cnyzltjehkkeyzquadmo.supabase.co/functions/v1/import-journal-conferences',
    urlTemplate: 'https://docs.google.com/spreadsheets/d/1QH2Xh0qWt5letZpB5bt1tXGEyVnVjZsYKUHE0aXVYJw/edit?gid=0#gid=0',
  },
};