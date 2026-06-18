'use client';

import { BarChart3 } from 'lucide-react';
import { DashboardTabs } from './DashboardTabs';

interface DashboardLayoutProps {
  children: React.ReactNode;
  loading?: boolean;
  filters?: React.ReactNode;
}

export function DashboardLayout({
  children,
  loading,
  filters,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-1">
      <div className="mb-6 flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
            <BarChart3 className="w-7 h-7 text-white" />
          </div>

          <DashboardTabs />

          {loading && (
            <span className="text-xs font-semibold text-blue-600 animate-pulse">
              Syncing...
            </span>
          )}
        </div>

        {filters}
      </div>

      {children}
    </div>
  );
}