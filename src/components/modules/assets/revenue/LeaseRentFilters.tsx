/* eslint-disable i18next/no-literal-string */
'use client';

import { Label, SearchInput, Select } from '@/components/common';

interface FiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  category: string;
  setCategory: (cat: string) => void;
  zone: string;
  setZone: (zone: string) => void;
  ward: string;
  setWard: (ward: string) => void;
  assetSelect: string;
  setAssetSelect: (asset: string) => void;
}

export function LeaseRentFilters({
  searchQuery,
  setSearchQuery,
  category,
  setCategory,
  zone,
  setZone,
  ward,
  setWard,
  assetSelect,
  setAssetSelect,
}: FiltersProps) {
  return (
    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 shadow-inner mb-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Search */}
        <div className="space-y-1">
          <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Search</Label>
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by name, path or ID..."
            className="mb-0 w-full"
            showClear={false}
          />
        </div>

        {/* Category */}
        <div className="space-y-1">
          <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Asset Category</Label>
          <Select
            value={category}
            onChange={(_, value) => setCategory(value)}
            options={[
              { label: 'Shopping Complex', value: 'Shopping Complex' },
              { label: 'Open Land', value: 'Open Land' },
              { label: 'Municipal Garden', value: 'Garden' },
              { label: 'Municipal Quarters', value: 'Quarters' },
            ]}
            selectSize="sm"
            className="w-full"
            placeholder="Asset Category"
          />
        </div>

        {/* Zone */}
        <div className="space-y-1">
          <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Zone</Label>
          <Select
            value={zone}
            onChange={(_, value) => setZone(value)}
            options={[
              { label: 'All Zones', value: 'all' },
              { label: 'East Zone', value: 'East' },
              { label: 'West Zone', value: 'West' },
              { label: 'North Zone', value: 'North' },
              { label: 'South Zone', value: 'South' },
            ]}
            selectSize="sm"
            className="w-full"
            placeholder="All Zones"
          />
        </div>

        {/* Ward */}
        <div className="space-y-1">
          <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Ward</Label>
          <Select
            value={ward}
            onChange={(_, value) => setWard(value)}
            options={[
              { label: 'All Wards', value: 'all' },
              { label: 'Ward 1', value: 'Ward 1' },
              { label: 'Ward 2', value: 'Ward 2' },
              { label: 'Ward 3', value: 'Ward 3' },
            ]}
            selectSize="sm"
            className="w-full"
            placeholder="All Wards"
          />
        </div>

        {/* Select Asset */}
        <div className="space-y-1">
          <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Select Asset</Label>
          <Select
            value={assetSelect}
            onChange={(_, value) => setAssetSelect(value)}
            options={[
              { label: 'All', value: 'all' },
              { label: 'MPMS-AS-9', value: 'MPMS-AS-9' },
              { label: 'MPMS-AS-10', value: 'MPMS-AS-10' },
              { label: 'MPMS-AS-15', value: 'MPMS-AS-15' },
            ]}
            selectSize="sm"
            className="w-full"
            placeholder="Select Asset"
          />
        </div>
      </div>
    </div>
  );
}
