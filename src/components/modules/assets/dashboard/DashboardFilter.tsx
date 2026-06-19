'use client';

import { MapPin } from 'lucide-react';
import { Select } from '@/components/common/select';

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
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
        <MapPin className="w-4 h-4 text-blue-600" />
        {filtersLabel}
      </div>

      <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-3">
        <Select
          ariaLabel={allZonesLabel}
          placeholder={allZonesLabel}
          options={zonesList.map((z) => ({
            label: z === 'all' ? allZonesLabel : z,
            value: z,
          }))}
          value={activeZone}
          onChange={(e, val) => onZoneChange(val)}
          className="w-[180px]"
        />

        <Select
          ariaLabel={allWardsLabel}
          placeholder={allWardsLabel}
          options={wardsList.map((w) => ({
            label: w === 'all' ? allWardsLabel : w,
            value: w,
          }))}
          value={activeWard}
          onChange={(e, val) => onWardChange(val)}
          className="w-[180px]"
        />
      </div>
    </div>
  );
}