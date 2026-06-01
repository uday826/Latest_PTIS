'use client';

import React from 'react';
import { AlertCircle, BadgeIndianRupee, Building2, Layers, Ruler } from 'lucide-react';
import type { AssetDetailRecord, AssetFloorDetailItem } from './types';

function blank(value?: string | number | null) {
  return value === null || value === undefined || value === '' ? '-' : String(value);
}

function formatNumber(value?: string | number | null) {
  if (value === null || value === undefined || value === '') return '-';
  const parsed = typeof value === 'number' ? value : Number(value);
  if (Number.isNaN(parsed)) return String(value);
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(parsed);
}

function formatCurrency(value?: string | number | null) {
  if (value === null || value === undefined || value === '') return '-';
  const parsed = typeof value === 'number' ? value : Number(value);
  if (Number.isNaN(parsed)) return String(value);
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(parsed);
}

function areaText(floor: AssetFloorDetailItem) {
  const builtUp = floor.builtUpAreaSqMeter ?? floor.builtUpAreaSqFeet;
  const carpet = floor.carpetAreaSqMeter ?? floor.carpetAreaSqFeet;
  return {
    builtUp: formatNumber(builtUp),
    carpet: formatNumber(carpet),
  };
}

export function FloorDetailsTab({ asset }: { asset: AssetDetailRecord }) {
  const summary = asset.floorSummary;
  const floors = summary?.floorDetails ?? [];

  if (asset.floorSummaryError) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
        <div className="flex items-center gap-2 font-bold">
          <AlertCircle className="h-4 w-4" />
          Floor details could not be loaded
        </div>
        <p className="mt-1 text-xs">{asset.floorSummaryError}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Floors', value: blank(summary?.totalFloors ?? floors.length), icon: Layers },
          { label: 'Total Base Value', value: formatCurrency(summary?.totalBaseValue), icon: BadgeIndianRupee },
          { label: 'Total Capital Value', value: formatCurrency(summary?.totalCapitalValue), icon: BadgeIndianRupee },
          { label: 'Total Market Value', value: formatCurrency(summary?.totalMarketValue), icon: BadgeIndianRupee },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
              <p className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                <Icon className="h-3.5 w-3.5 text-blue-500" />
                {item.label}
              </p>
              <p className="mt-1 text-sm font-bold text-slate-900">{item.value}</p>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <div className="flex items-center gap-2 text-slate-800">
            <Layers className="h-4 w-4 text-blue-600" />
            <h3 className="text-sm font-bold">Floor Details</h3>
          </div>
          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-600">{floors.length} floors</span>
        </div>

        {floors.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">No floor details available for this asset.</div>
        ) : (
          <div className="grid grid-cols-1 gap-3 p-4 lg:grid-cols-2">
            {floors.map((floor) => {
              const area = areaText(floor);
              return (
                <div key={floor.id} className="rounded-lg border border-slate-200 bg-slate-50/40 p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-900">{blank(floor.floorName || `Floor ${floor.floorId || floor.id}`)}</p>
                      <p className="mt-1 text-xs font-medium text-slate-500">{blank(floor.constructionTypeName)}</p>
                    </div>
                    <Building2 className="h-5 w-5 shrink-0 text-blue-500" />
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-[10px] font-bold text-slate-500">Use Type</p>
                      <p className="font-semibold text-slate-800">{blank(floor.typeOfUseName)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-500">Construction Year</p>
                      <p className="font-semibold text-slate-800">{blank(floor.constructionYear)}</p>
                    </div>
                    <div>
                      <p className="flex items-center gap-1 text-[10px] font-bold text-slate-500"><Ruler className="h-3 w-3" /> Built-up</p>
                      <p className="font-semibold text-slate-800">{area.builtUp}</p>
                    </div>
                    <div>
                      <p className="flex items-center gap-1 text-[10px] font-bold text-slate-500"><Ruler className="h-3 w-3" /> Carpet</p>
                      <p className="font-semibold text-slate-800">{area.carpet}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-500">Rooms</p>
                      <p className="font-semibold text-slate-800">{blank(floor.noOfRooms)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-500">Capital Value</p>
                      <p className="font-semibold text-slate-800">{formatCurrency(floor.capitalValue)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
