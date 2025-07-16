'use client';

import { createContext, useContext, ReactNode } from 'react';

interface DashboardContextType {
  isPublicView: boolean;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

export function DashboardProvider({
  children,
  isPublicView,
}: {
  children: ReactNode;
  isPublicView: boolean;
}) {
  const value = { isPublicView };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboardContext() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error(
      'useDashboardContext must be used within a DashboardProvider'
    );
  }
  return context;
}
