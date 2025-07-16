import { dashboardComponents } from '@/lib/dashboardConfig';
import { notFound } from 'next/navigation';

type DashboardRendererProps = {
  dashboardId: keyof typeof dashboardComponents;
  filter: number | null;
  commonProps: {
    pageKey: string;
    initialActiveYear: number | null;
    isPublicView: boolean;
  };
};

export async function DashboardRenderer({
  dashboardId,
  filter,
  commonProps,
}: DashboardRendererProps) {
  const renderDashboard = async () => {
    switch (dashboardId) {
      case 'lulusan-bekerja': {
        const dashboard = dashboardComponents['lulusan-bekerja'];
        const rawData = await dashboard.fetchData(filter);
        const transformedData = dashboard.transformData(rawData);

        return (
          <dashboard.component
            {...commonProps}
            dashboardData={transformedData}
          />
        );
      }

      case 'pengalaman-mahasiswa': {
        const dashboard = dashboardComponents['pengalaman-mahasiswa'];
        const rawData = await dashboard.fetchData(filter);
        const transformedData = dashboard.transformData(rawData);

        return (
          <dashboard.component
            {...commonProps}
            dashboardData={transformedData}
          />
        );
      }

      case 'standar-internasional': {
        const dashboard = dashboardComponents['standar-internasional'];
        const rawData = await dashboard.fetchData(filter);
        const transformedData = dashboard.transformData(rawData);

        return (
          <dashboard.component
            {...commonProps}
            dashboardData={transformedData}
          />
        );
      }

      default:
        return notFound();
    }
  };

  return (
    <div className="p-4 sm:p-8 bg-blue-400 min-h-screen">
      <div className="max-w-7xl mx-auto">{await renderDashboard()}</div>
    </div>
  );
}
