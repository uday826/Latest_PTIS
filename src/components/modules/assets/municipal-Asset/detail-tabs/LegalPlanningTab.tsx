'use client';

import React from 'react';
import { FileText, Map, ShieldCheck } from 'lucide-react';
import type { AssetDetailRecord } from '@/types/municipal-asset/detail-tabs.types';
import { getGroupedDisplayFields } from './fieldValueUtils';

function blank(value?: string | number | null) {
  return value === null || value === undefined || value === '' ? '-' : String(value);
}

function Field({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-white p-3">
      <span className="block text-[10px] font-bold text-slate-500">{label}</span>
      <span className="mt-1 block break-words text-sm font-bold text-slate-800">{blank(value)}</span>
    </div>
  );
}

export function LegalPlanningTab({ asset }: { asset: AssetDetailRecord }) {
  const groupedFields = getGroupedDisplayFields(asset);
  const legalGroups = Object.entries(groupedFields).filter(([group]) => {
    const key = group.toLowerCase();
    return key.includes('legal') || key.includes('planning') || key.includes('compliance') || key.includes('land') || key.includes('building');
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="rounded-xl border border-amber-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-amber-100 bg-amber-50/60 px-4 py-3 text-amber-800">
          <ShieldCheck className="h-4 w-4" />
          <h3 className="text-sm font-bold">Legal Identifiers</h3>
        </div>
        <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="CSN / Survey No." value={asset.csn} />
          <Field label="Ownership Type" value={asset.ownershipType} />
          <Field label="Purchase Date" value={asset.purchaseDate} />
          <Field label="Market Value Date" value={asset.marketValueDate} />
          <Field label="Address" value={asset.address} />
          <Field label="Zone" value={asset.zoneName} />
          <Field label="Ward" value={asset.wardName} />
          <Field label="Asset Status" value={asset.status} />
        </div>
      </div>

      <div className="rounded-xl border border-emerald-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-emerald-100 bg-emerald-50/60 px-4 py-3 text-emerald-800">
          <Map className="h-4 w-4" />
          <h3 className="text-sm font-bold">Planning Details</h3>
        </div>
        <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Asset Category" value={asset.assetCategoryName} />
          <Field label="Asset Type" value={asset.assetTypeName} />
          <Field label="Land Area" value={asset.landAreaSqMeter} />
          <Field label="Built-up Area" value={asset.builtUpAreaSqMeter} />
          <Field label="Latitude" value={asset.latitude} />
          <Field label="Longitude" value={asset.longitude} />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/70 px-4 py-3">
          <FileText className="h-4 w-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-800">Compliance Fields</h3>
        </div>
        {legalGroups.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">No legal or planning fields available for this asset.</div>
        ) : (
          <div className="space-y-4 p-4">
            {legalGroups.map(([group, fields]) => (
              <div key={group} className="rounded-lg border border-slate-100 bg-slate-50/40 p-3">
                <h4 className="mb-3 text-xs font-bold text-slate-700">{group}</h4>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {fields.map((field) => (
                    <Field key={field.key} label={field.label} value={field.value} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
