'use client';

import type { AssetDetailRecord } from '@/types/municipal-asset/detail-tabs.types';

function blank(value?: string | number | null) {
  return value === null || value === undefined || value === '' ? '' : String(value);
}

function formatCurrency(value?: number | string | null) {
  if (value === null || value === undefined || value === '') return '';
  const parsed = typeof value === 'number' ? value : Number(value);
  if (Number.isNaN(parsed)) return String(value);
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(parsed);
}

export function ValuationTab({ asset }: { asset: AssetDetailRecord }) {
  const floorSummary = asset.floorSummary;

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="border border-blue-200 rounded-xl overflow-hidden bg-white shadow-sm">
        <div className="px-4 py-2 border-b border-blue-100 flex items-center gap-2 bg-slate-50/80">
          <div className="bg-white border border-blue-200 text-blue-600 w-5 h-5 flex items-center justify-center rounded text-[10px] font-black">1</div>
          <h3 className="font-bold text-xs text-blue-800">Valuation Details</h3>
        </div>
        <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          {[
            { label: 'Purchase Value', value: formatCurrency(asset.purchaseValue) },
            { label: 'Market Value', value: formatCurrency(asset.marketValue) },
            { label: 'Capital Value', value: formatCurrency(asset.capitalValue) },
            { label: 'Current Book Value', value: formatCurrency(asset.currentBookValue) },
            { label: 'Depreciation Rate', value: blank(asset.depreciationRate) },
            { label: 'Last CV Date', value: blank(asset.lastCVCalculationDate) },
          ].map((row) => (
            <div key={row.label}>
              <span className="text-slate-500 font-medium block mb-1">{row.label}</span>
              <span className="font-bold text-slate-800">{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {floorSummary && (
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
          <div className="px-4 py-2 border-b border-slate-100 flex items-center gap-2 bg-slate-50/80">
            <div className="bg-white border border-slate-200 text-slate-600 w-5 h-5 flex items-center justify-center rounded text-[10px] font-black">2</div>
            <h3 className="font-bold text-xs text-slate-800">Floor Valuation Summary</h3>
          </div>
          <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            {[
              { label: 'Floors', value: blank(floorSummary.totalFloors ?? floorSummary.floorDetails.length) },
              { label: 'Total Base Value', value: formatCurrency(floorSummary.totalBaseValue) },
              { label: 'Total Capital Value', value: formatCurrency(floorSummary.totalCapitalValue) },
              { label: 'Total Market Value', value: formatCurrency(floorSummary.totalMarketValue) },
            ].map((row) => (
              <div key={row.label}>
                <span className="text-slate-500 font-medium block mb-1">{row.label}</span>
                <span className="font-bold text-slate-800">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
