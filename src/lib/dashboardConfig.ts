import { getLulusanBekerjaDashboardData } from '@/lib/data/getLulusanBekerjaDashboardData';
import { LulusanBekerjaUI } from '@/components/dashboards/LulusanBekerjaUI';
import { getPengalamanMahasiswaDashboardData } from '@/lib/data/getPengalamanMahasiswaDashboardData';
import { PengalamanMahasiswaUI } from '@/components/dashboards/PengalamanMahasiswaUI';
import { transformPengalamanMahasiswaData } from '@/lib/transformers/transformPengalamanMahasiswaData';
import { transformLulusanBekerjaData } from '@/lib/transformers/transformLulusanBekerjaData';
import { getStandarInternasionalDashboardData } from '@/lib/data/getStandarInternasionalData';
import { transformStandarInternasionalData } from '@/lib/transformers/transformStandarInternasionalData';
import { StandarInternasionalUI } from '@/components/dashboards/StandarInternasionalUI';


export const dashboardComponents = {
  'lulusan-bekerja': {
    fetchData: getLulusanBekerjaDashboardData,
    transformData: transformLulusanBekerjaData,
    component: LulusanBekerjaUI,
  },
  'pengalaman-mahasiswa': {
    fetchData: getPengalamanMahasiswaDashboardData,
    transformData: transformPengalamanMahasiswaData,
    component: PengalamanMahasiswaUI,
  },
  'standar-internasional': {
    fetchData: getStandarInternasionalDashboardData,
    transformData: transformStandarInternasionalData,
    component: StandarInternasionalUI,
  },
};

export type DashboardId = keyof typeof dashboardComponents;