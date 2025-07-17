import { getLulusanBekerjaDashboardData } from '@/lib/data/getLulusanBekerjaDashboardData';
import { LulusanBekerjaUI } from '@/components/dashboards/LulusanBekerjaUI';
import { getPengalamanMahasiswaDashboardData } from '@/lib/data/getPengalamanMahasiswaDashboardData';
import { PengalamanMahasiswaUI } from '@/components/dashboards/PengalamanMahasiswaUI';
import { transformPengalamanMahasiswaData } from '@/lib/transformers/transformPengalamanMahasiswaData';
import { transformLulusanBekerjaData } from '@/lib/transformers/transformLulusanBekerjaData';
import { getStandarInternasionalDashboardData } from '@/lib/data/getStandarInternasionalData';
import { transformStandarInternasionalData } from '@/lib/transformers/transformStandarInternasionalData';
import { StandarInternasionalUI } from '@/components/dashboards/StandarInternasionalUI';
// import { KelasKolaboratifUI } from '@/components/dashboards/KelasKolaboratifUI';
// import { KerjaSamaGlobalUI } from '@/components/dashboards/KerjaSamaGlobalUI';
import { AktivitasDosenUI } from '@/components/dashboards/AktivitasDosenUI';
import { KaryaDosenTerdampakUI } from '@/components/dashboards/KaryaDosenTerdampakUI';
import { PraktisiMengajarUI } from '@/components/dashboards/PraktisiMengajarUI';
import { getAktivitasDosenDashboardData } from './data/getAktivitasDosenDashboardData';
import { transformAktivitasDosenData } from './transformers/transformAktivitasDosenData';
import { getPraktisiMengajarDashboardData } from './data/getPraktisiMengajarDashboardData';
import { transformPraktisiMengajarData } from './transformers/transformPraktisiMengajarData';
import { getKaryaDosenTerdampakDashboardData } from './data/getKaryaDosenTerdampakDashboardData';
import { transformKaryaDosenTerdampakData } from './transformers/transformKaryaDosenTerdampakData';


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
  'aktivitas-dosen': {
    fetchData: getAktivitasDosenDashboardData,
    transformData: transformAktivitasDosenData,
    component: AktivitasDosenUI,
  },
  'praktisi-mengajar': {
    fetchData: getPraktisiMengajarDashboardData,
    transformData: transformPraktisiMengajarData,
    component: PraktisiMengajarUI,
  },
  'karya-dosen-terdampak': {
    fetchData: getKaryaDosenTerdampakDashboardData,
    transformData: transformKaryaDosenTerdampakData,
    component: KaryaDosenTerdampakUI,
  },
  // 'kerja-sama-global': {
  //   fetchData: getKerjaSamaGlobalDashboardData,
  //   transformData: transformKerjaSamaGlobalData,
  //   component: KerjaSamaGlobalUI,
  // },
  // 'kelas-kolaboratif': {
  //   fetchData: getKelasKolaboratifDashboardData,
  //   transformData: transformKelasKolaboratifData,
  //   component: KelasKolaboratifUI,
  // },
  'standar-internasional': {
    fetchData: getStandarInternasionalDashboardData,
    transformData: transformStandarInternasionalData,
    component: StandarInternasionalUI,
  },
};

export type DashboardId = keyof typeof dashboardComponents;