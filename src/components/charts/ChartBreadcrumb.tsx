'use client';

interface Crumb {
  label: string;
  level: number;
}

interface ChartBreadcrumbProps {
  crumbs: Crumb[];
  onCrumbClick: (level: number) => void;
}

export function ChartBreadcrumb({
  crumbs,
  onCrumbClick,
}: ChartBreadcrumbProps) {
  return (
    <div
      className="flex items-center gap-1 text-[12px] text-gray-500 mt-1"
      data-no-drag
    >
      {crumbs.map((crumb, index) => (
        <div key={index} className="flex items-center gap-1">
          {index > 0 && <span className="text-gray-500">/</span>}
          <span
            className={
              index === crumbs.length - 1
                ? 'font-bold text-gray-700'
                : 'text-gray-500 hover:underline cursor-pointer'
            }
            onClick={() => onCrumbClick(crumb.level)}
          >
            {crumb.label}
          </span>
        </div>
      ))}
    </div>
  );
}
