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
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-1">
      <div className="mb-6 flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
            <BarChart3 className="w-7 h-7 text-white" />
          </div>

          <DashboardTabs />

          {loading && (
            <div className="flex items-center gap-2 px-3 py-1 bg-white/50 rounded-lg">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-medium text-gray-600">Updating...</span>
            </div>
          )}
        </div>

        {filters}
      </div>

      {children}
    </div>
  );
}