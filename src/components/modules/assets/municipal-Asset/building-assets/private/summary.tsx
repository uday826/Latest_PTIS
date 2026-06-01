'use client';

import React from 'react';
import { FileSpreadsheet } from 'lucide-react';

import { Card, CardContent, CardHeader } from '@/components/common';

import { MOCK_BUILDING_ASSETS } from './data/mockBuildingAssets';
import { formatINR } from './utils';

type SummaryReportProps = {
  totalAssets: number;
  filteredAssets: number;
};

export function SummaryReport({ totalAssets, filteredAssets }: SummaryReportProps) {
  const currentValue = MOCK_BUILDING_ASSETS.reduce((sum, asset) => sum + asset.currentValue, 0);
  const depreciation = MOCK_BUILDING_ASSETS.reduce((sum, asset) => sum + asset.depreciation, 0);
  const netBookValue = MOCK_BUILDING_ASSETS.reduce((sum, asset) => sum + asset.netBookValue, 0);

  return (
    <Card variant="bordered" padding="none" className="overflow-hidden border-slate-900 bg-white">
      <CardHeader className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-center">
        <div className="flex items-center justify-center gap-2 text-base font-extrabold uppercase tracking-tight text-slate-950">
          <FileSpreadsheet className="h-4 w-4" />
          Municipal Corporation Asset Register
        </div>
        <p className="mt-1 text-xs font-medium text-slate-600">
          Register of building properties | Updated: 21/05/2026
        </p>
      </CardHeader>

      <CardContent className="p-4">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-5">
          {[
            ['Total Assets', String(totalAssets), 'text-slate-900'],
            ['Current Value', formatINR(currentValue), 'text-slate-900'],
            ['Depreciation', formatINR(depreciation), 'text-red-600'],
            ['Net Book Value', formatINR(netBookValue), 'text-emerald-700'],
            ['Active Assets', String(filteredAssets), 'text-blue-700'],
          ].map(([label, value, valueClass]) => (
            <Card key={label} variant="bordered" padding="sm" className="border-blue-100 bg-white shadow-sm">
              <CardContent className="text-center">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">{label}</p>
                <p className={`mt-1 text-sm font-extrabold ${valueClass}`}>{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
