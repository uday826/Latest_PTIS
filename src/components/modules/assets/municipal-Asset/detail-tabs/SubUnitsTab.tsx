'use client';

import React from 'react';
import { AlertCircle, Building2, DoorOpen, MapPin } from 'lucide-react';
import type { AssetChildAssetItem, AssetDetailRecord } from './types';

function blank(value?: string | number | null) {
  return value === null || value === undefined || value === '' ? '-' : String(value);
}

function formatArea(value?: string | number | null) {
  if (value === null || value === undefined || value === '') return '-';
  const parsed = typeof value === 'number' ? value : Number(value);
  if (Number.isNaN(parsed)) return String(value);
  return `${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(parsed)} sq.m`;
}

function statusText(asset: AssetChildAssetItem) {
  if (asset.isActive === false) return 'Inactive';
  if (asset.isActive === true) return asset.status || 'Active';
  return asset.status || '-';
}

export function SubUnitsTab({ asset }: { asset: AssetDetailRecord }) {
  const children = asset.childAssets ?? [];

  if (asset.childAssetsError) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
        <div className="flex items-center gap-2 font-bold">
          <AlertCircle className="h-4 w-4" />
          Sub-units could not be loaded
        </div>
        <p className="mt-1 text-xs">{asset.childAssetsError}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
          <div className="flex items-center gap-2 text-slate-800">
            <DoorOpen className="h-4 w-4 text-blue-600" />
            <h3 className="text-sm font-bold">Sub-Units</h3>
          </div>
          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-600">{children.length} units</span>
        </div>

        {children.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">No sub-units available for this asset.</div>
        ) : (
          <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">
            {children.map((child) => (
              <div key={child.id} className="rounded-lg border border-slate-200 bg-slate-50/40 p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900">{blank(child.assetName)}</p>
                    <p className="mt-1 text-xs font-semibold text-blue-600">{blank(child.assetNo)}</p>
                  </div>
                  <Building2 className="h-5 w-5 shrink-0 text-blue-500" />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500">Type</p>
                    <p className="font-semibold text-slate-800">{blank(child.assetTypeName)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500">Status</p>
                    <p className="font-semibold text-slate-800">{statusText(child)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500">Built-up Area</p>
                    <p className="font-semibold text-slate-800">{formatArea(child.builtUpAreaSqMeter)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500">Occupancy</p>
                    <p className="font-semibold text-slate-800">{blank(child.occupancyStatus)}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 border-t border-slate-200 pt-3 text-xs font-medium text-slate-500">
                  <MapPin className="h-3.5 w-3.5" />
                  {[child.zoneName, child.wardName].filter(Boolean).join(' - ') || '-'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
