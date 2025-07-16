import { notFound } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { DashboardRenderer } from './DashboardRender';
import { dashboardComponents } from '@/lib/dashboardConfig';

export const revalidate = 600;

export default async function SharedDashboardPage(props: {
  params: Promise<{ shareId: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { shareId } = await props.params;
  const searchParams = (await props.searchParams) ?? {};
  const yearParam = searchParams.year;

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

  const dashboardId =
    shareLink.dashboard_id as keyof typeof dashboardComponents;

  const commonProps = {
    pageKey: `shared-${shareId}`,
    initialActiveYear: filter,
    isPublicView: true,
  };

  return (
    <DashboardRenderer
      dashboardId={dashboardId}
      filter={filter}
      commonProps={commonProps}
    />
  );
}
