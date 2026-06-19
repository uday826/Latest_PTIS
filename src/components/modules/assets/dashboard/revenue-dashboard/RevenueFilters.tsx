'use client';

import { MapPin } from 'lucide-react';
import type { RevenueFilterOption } from '@/types/asset-type/revenue-dashboard.types';

interface RevenueFiltersProps {
  zones: RevenueFilterOption[];
  wards: RevenueFilterOption[];
  selectedZoneId: number | null;
  selectedWardId: number | null;
  onZoneChange: (zoneId: number | null) => void;
  onWardChange: (wardId: number | null) => void;
  filtersLabel: string;
  allZonesLabel: string;
  allWardsLabel: string;
}

const SELECT_CLS =
  'px-4 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-slate-800 bg-white shadow-sm focus:border-blue-500 focus:outline-none';

const ALL = 'all';

/**
 * Presentational zone/ward filter group for the revenue dashboard header.
 * Id-based (so selections map to API ids); the owning screen decides how to
 * persist the change (URL navigation).
 */
export function RevenueFilters({
  zones,
  wards,
  selectedZoneId,
  selectedWardId,
  onZoneChange,
  onWardChange,
  filtersLabel,
  allZonesLabel,
  allWardsLabel,
}: RevenueFiltersProps) {
  const toId = (value: string): number | null => (value === ALL ? null : Number(value));

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
        <MapPin className="w-4 h-4 text-blue-600" />
        {filtersLabel}
      </div>

      <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-3">
        <select
          className={SELECT_CLS}
          aria-label={allZonesLabel}
          value={selectedZoneId == null ? ALL : String(selectedZoneId)}
          onChange={(e) => onZoneChange(toId(e.target.value))}
        >
          <option value={ALL}>{allZonesLabel}</option>
          {zones.map((zone) => (
            <option key={zone.id} value={zone.id}>
              {zone.label}
            </option>
          ))}
        </select>

        <select
          className={SELECT_CLS}
          aria-label={allWardsLabel}
          value={selectedWardId == null ? ALL : String(selectedWardId)}
          onChange={(e) => onWardChange(toId(e.target.value))}
        >
          <option value={ALL}>{allWardsLabel}</option>
          {wards.map((ward) => (
            <option key={ward.id} value={ward.id}>
              {ward.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
