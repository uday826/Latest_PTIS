/* eslint-disable i18next/no-literal-string */
'use client';

import { Label, SearchInput, Select } from '@/components/common';
import { SEARCH_KEY_REGEX } from '@/lib/utils/validation-rules';
import type { FilterOption } from '../../../../types/asset/revenue.types';

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
  categoryOptions?: FilterOption[];
  zoneOptions?: FilterOption[];
  wardOptions?: FilterOption[];
  assetOptions?: FilterOption[];
  onCategoryChange?: (value: string | null) => void;
  onZoneChange?: (value: string | null) => void;
  onWardChange?: (value: string | null) => void;
  onAssetChange?: (value: string | null) => void;
}

const ALL_CATEGORY_OPTION = { label: 'All Categories', value: 'all' };
const ALL_ZONE_OPTION = { label: 'All Zones', value: 'all' };
const ALL_WARD_OPTION = { label: 'All Wards', value: 'all' };
const ALL_ASSET_OPTION = { label: 'All Assets', value: 'all' };

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
  categoryOptions = [],
  zoneOptions = [],
  wardOptions = [],
  assetOptions = [],
  onCategoryChange,
  onZoneChange,
  onWardChange,
  onAssetChange,
}: FiltersProps) {
  const normalizeSelectValue = (value: string) => (value === 'all' ? null : value);
  const handleSearchChange = (nextValue: string) => {
    const sanitizedValue = nextValue
      .split('')
      .filter((char) => SEARCH_KEY_REGEX.test(char))
      .join('');

    setSearchQuery(sanitizedValue);
  };

  return (
    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 shadow-inner mb-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="space-y-1">
          <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Search</Label>
          <SearchInput
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by name, path or ID..."
            className="mb-0 w-full"
            showClear={false}
          />
        </div>

        <div className="space-y-1">
          <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Asset Category</Label>
          <Select
            value={category}
            onChange={(_, value) =>
              onCategoryChange ? onCategoryChange(normalizeSelectValue(value)) : setCategory(value)
            }
            options={[ALL_CATEGORY_OPTION, ...categoryOptions]}
            selectSize="sm"
            className="w-full"
            placeholder="All Categories"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Zone</Label>
          <Select
            value={zone}
            onChange={(_, value) => (onZoneChange ? onZoneChange(normalizeSelectValue(value)) : setZone(value))}
            options={[ALL_ZONE_OPTION, ...zoneOptions]}
            selectSize="sm"
            className="w-full"
            placeholder="All Zones"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Ward</Label>
          <Select
            value={ward}
            onChange={(_, value) => (onWardChange ? onWardChange(normalizeSelectValue(value)) : setWard(value))}
            options={[ALL_WARD_OPTION, ...wardOptions]}
            selectSize="sm"
            className="w-full"
            placeholder="All Wards"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Select Asset</Label>
          <Select
            value={assetSelect}
            onChange={(_, value) =>
              onAssetChange ? onAssetChange(normalizeSelectValue(value)) : setAssetSelect(value)
            }
            options={[ALL_ASSET_OPTION, ...assetOptions]}
            selectSize="sm"
            className="w-full"
            placeholder="All Assets"
          />
        </div>
      </div>
    </div>
  );
}
