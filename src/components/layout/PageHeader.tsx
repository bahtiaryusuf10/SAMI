import { ReactNode } from 'react';

interface PageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex w-full flex-col gap-3 px-2 pt-2 mb-8 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">
          {title}
        </h1>
        {description && (
          <div className="flex items-center mt-2 gap-1">
            <p className="text-white text-sm">{description}</p>
          </div>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      )}
    </div>
  );
}
