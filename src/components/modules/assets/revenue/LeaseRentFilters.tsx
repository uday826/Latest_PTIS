'use client';

import { Label, SearchInput, SearchSelect } from '@/components/common';
import { ASSET_SEARCH_REGEX } from '@/lib/utils/validation-rules';
import type { FilterOption } from '../../../../types/asset/revenue.types';
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('revenueManagement');
  const normalizeSelectValue = (value: string) => (value === 'all' ? null : value);
  const handleSearchChange = (nextValue: string) => {
    let sanitized = nextValue.replace(/\s+-/g, '-');
    sanitized = sanitized.replace(/-\s+/g, '-');
    sanitized = sanitized.replace(/-+/g, '-');
    sanitized = sanitized.replace(/\s+/g, ' ');

    const sanitizedValue = sanitized
      .split('')
      .filter((char) => ASSET_SEARCH_REGEX.test(char))
      .join('');
 
     setSearchQuery(sanitizedValue);
   };

  const ALL_CATEGORY_OPTION = { label: t('filters.allCategories'), value: 'all' };
  const ALL_ZONE_OPTION = { label: t('filters.allZones'), value: 'all' };
  const ALL_WARD_OPTION = { label: t('filters.allWards'), value: 'all' };
  const ALL_ASSET_OPTION = { label: t('filters.allAssets'), value: 'all' };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="space-y-1">
          <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t('filters.search')}</Label>
          <SearchInput
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={t('filters.searchPlaceholder')}
            className="mb-0 w-full"
            showClear={false}
          />
        </div>

        <div className="space-y-1">
          <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t('filters.category')}</Label>
          <SearchSelect
            name="category"
            value={category}
            onChange={(_, value) =>
              onCategoryChange ? onCategoryChange(normalizeSelectValue(value)) : setCategory(value)
            }
            options={[ALL_CATEGORY_OPTION, ...categoryOptions]}
            className="w-full"
            placeholder={t('filters.allCategories')}
          />
        </div>

        <div className="space-y-1">
          <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t('filters.zone')}</Label>
          <SearchSelect
            name="zone"
            value={zone}
            onChange={(_, value) => (onZoneChange ? onZoneChange(normalizeSelectValue(value)) : setZone(value))}
            options={[ALL_ZONE_OPTION, ...zoneOptions]}
            className="w-full"
            placeholder={t('filters.allZones')}
          />
        </div>

        <div className="space-y-1">
          <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t('filters.ward')}</Label>
          <SearchSelect
            name="ward"
            value={ward}
            onChange={(_, value) => (onWardChange ? onWardChange(normalizeSelectValue(value)) : setWard(value))}
            options={[ALL_WARD_OPTION, ...wardOptions]}
            className="w-full"
            placeholder={t('filters.allWards')}
          />
        </div>

        <div className="space-y-1">
          <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t('filters.selectAsset')}</Label>
          <SearchSelect
            name="assetSelect"
            value={assetSelect}
            onChange={(_, value) =>
              onAssetChange ? onAssetChange(normalizeSelectValue(value)) : setAssetSelect(value)
            }
            options={[ALL_ASSET_OPTION, ...assetOptions]}
            className="w-full"
            placeholder={t('filters.allAssets')}
          />
        </div>
      </div>
    </div>
  );
}
