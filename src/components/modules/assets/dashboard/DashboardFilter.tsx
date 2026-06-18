'use client';

import { MapPin } from 'lucide-react';

interface DashboardFiltersProps {
  zonesList: string[];
  wardsList: string[];
  activeZone: string;
  activeWard: string;
  onZoneChange: (value: string) => void;
  onWardChange: (value: string) => void;
  allZonesLabel: string;
  allWardsLabel: string;
  filtersLabel: string;
}

export function DashboardFilters({
  zonesList,
  wardsList,
  activeZone,
  activeWard,
  onZoneChange,
  onWardChange,
  allZonesLabel,
  allWardsLabel,
  filtersLabel,
}: DashboardFiltersProps) {
  const SELECT_CLS =
    'px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold bg-white shadow-sm';

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
        <MapPin className="w-4 h-4 text-blue-600" />
        {filtersLabel}
      </div>

      <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-3">
        <select
          className={SELECT_CLS}
          value={activeZone}
          onChange={(e) => onZoneChange(e.target.value)}
        >
          {zonesList.map((z) => (
            <option key={z} value={z}>
              {z === 'all' ? allZonesLabel : z}
            </option>
          ))}
        </select>

        <select
          className={SELECT_CLS}
          value={activeWard}
          onChange={(e) => onWardChange(e.target.value)}
        >
          {wardsList.map((w) => (
            <option key={w} value={w}>
              {w === 'all' ? allWardsLabel : w}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}