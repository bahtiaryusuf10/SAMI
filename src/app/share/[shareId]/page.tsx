import { notFound } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getLulusanBekerjaDashboardData } from '@/lib/data/getLulusanBekerjaDashboardData';
import { LulusanBekerjaUI } from '@/components/dashboards/LulusanBekerjaUI';
import { getPengalamanMahasiswaDashboardData } from '@/lib/data/getPengalamanMahasiswaDashboardData';
import { PengalamanMahasiswaUI } from '@/components/dashboards/PengalamanMahasiswaUI';
import { transformPengalamanMahasiswaData } from '@/lib/transformers/transformPengalamanMahasiswaData';
import { transformLulusanBekerjaData } from '@/lib/transformers/transformLulusanBekerjaData';
import { getStandarInternasionalDashboardData } from '@/lib/data/getStandarInternasionalData';
import { transformStandarInternasionalData } from '@/lib/transformers/transformStandarInternasionalData';
import { StandarInternasionalUI } from '@/components/dashboards/StandarInternasionalUI';

export const revalidate = 600;

const dashboardComponents = {
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

type DashboardId = keyof typeof dashboardComponents;

type PageProps = {
  params: { shareId: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function SharedDashboardPage({
  params,
  searchParams,
}: PageProps) {
  const { shareId } = params;
  const { year: yearParam } = searchParams;

  const supabase = await createSupabaseServerClient();
  const now = new Date().toISOString();

  const { data: shareLink, error } = await supabase
    .from('shared_dashboards')
    .select('dashboard_id')
    .eq('id', shareId)
    .or(`expires_at.is.null,expires_at.gt.${now}`)
    .single();

  if (error || !shareLink) {
    notFound();
  }

  const filter =
    yearParam && typeof yearParam === 'string' ? parseInt(yearParam, 10) : null;

  if (yearParam && isNaN(filter!)) {
    notFound();
  }

  const dashboardId = shareLink.dashboard_id as DashboardId;

  const commonProps = {
    pageKey: `shared-${shareId}`,
    initialActiveYear: filter,
    isPublicView: true,
  };

  if (dashboardId === 'lulusan-bekerja') {
    const dashboard = dashboardComponents['lulusan-bekerja'];
    const rawData = await dashboard.fetchData(filter);
    const transformedData = dashboard.transformData(rawData);

    return (
      <div className="p-4 sm:p-8 bg-blue-400 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <dashboard.component
            {...commonProps}
            dashboardData={transformedData}
          />
        </div>
      </div>
    );
  }

  if (dashboardId === 'pengalaman-mahasiswa') {
    const dashboard = dashboardComponents['pengalaman-mahasiswa'];
    const rawData = await dashboard.fetchData(filter);
    const transformedData = dashboard.transformData(rawData);

    return (
      <div className="p-4 sm:p-8 bg-blue-400 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <dashboard.component
            {...commonProps}
            dashboardData={transformedData}
          />
        </div>
      </div>
    );
  }

  if (dashboardId === 'standar-internasional') {
    const dashboard = dashboardComponents['standar-internasional'];
    const rawData = await dashboard.fetchData(filter);
    const transformedData = dashboard.transformData(rawData);

    return (
      <div className="p-4 sm:p-8 bg-blue-400 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <dashboard.component
            {...commonProps}
            dashboardData={transformedData}
          />
        </div>
      </div>
    );
  }

  notFound();
}
