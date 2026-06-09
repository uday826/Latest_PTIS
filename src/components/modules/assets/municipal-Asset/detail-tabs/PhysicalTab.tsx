'use client';

import type { AssetDetailRecord } from '@/types/municipal-asset/detail-tabs.types';
import { Map, Ruler } from 'lucide-react';

function blank(value?: string | number | null) {
  return value === null || value === undefined || value === '' ? '' : String(value);
}

export function PhysicalTab({ asset }: { asset: AssetDetailRecord }) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
          <Map className="w-4 h-4 text-slate-500" />
          <h3 className="font-bold text-xs text-slate-800">Physical Details</h3>
        </div>
        <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          {[
            { label: 'Latitude', value: blank(asset.latitude) },
            { label: 'Longitude', value: blank(asset.longitude) },
            { label: 'Plot Area', value: blank(asset.landAreaSqMeter) },
            { label: 'Built-up Area', value: blank(asset.builtUpAreaSqMeter) },
            { label: 'Carpet Area', value: blank(asset.carpetAreaSqMeter) },
            { label: 'Has Lift', value: asset.hasLift === null || asset.hasLift === undefined ? '' : asset.hasLift ? 'Yes' : 'No' },
          ].map((field) => (
            <div key={field.label} className="border border-slate-100 rounded-lg p-3 bg-white">
              <p className="text-[10px] text-slate-500 mb-1">{field.label}</p>
              <p className="text-sm font-bold text-slate-800">{field.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
          <Ruler className="w-4 h-4 text-slate-500" />
          <h3 className="font-bold text-xs text-slate-800">Physical Notes</h3>
        </div>
        <div className="p-6 text-sm text-slate-500 min-h-[120px]">
          No additional physical measurements available.
        </div>
      </div>
    </div>
  );
}
