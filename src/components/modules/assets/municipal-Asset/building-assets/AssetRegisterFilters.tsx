'use client';

import { useState, useEffect } from 'react';

import { useTranslations } from 'next-intl';
import {
  SearchInput,
  SearchSelect,
} from '@/components/common';
import { useDebounce } from '@/hooks/useDebounce';
import { useQueryTransition } from '@/hooks/useQueryTransition';
import type { AssetRegisterFiltersProps } from '@/types/asset-types/asset-register.types';

export function AssetRegisterFilters({
  search,
  assetTypeId,
  zoneId,
  wardId,
  assetTypeOptions,
  zoneOptions,
  wardOptions,
}: AssetRegisterFiltersProps) {
  const t = useTranslations('assetRegister');
  const { updateQueries } = useQueryTransition();

  const [searchValue, setSearchValue] = useState(search);
  const debouncedSearch = useDebounce(searchValue, 500);

  useEffect(() => {
    const trimmed = debouncedSearch.trim();
    if (trimmed !== (search || '').trim()) {
      updateQueries({ search: trimmed || null, page: '1' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchValue(search);
  }, [search]);

  const handleSearchChange = (val: string) => {
    setSearchValue(val);
  };

  const handleAssetTypeChange = (newType: string) => {
    updateQueries({ assetTypeId: newType === 'all' ? null : newType, page: '1' });
  };

  const handleZoneChange = (newZone: string) => {
    updateQueries({ zoneId: newZone === 'all' ? null : newZone, wardId: null, page: '1' });
  };

  const handleWardChange = (newWard: string) => {
    updateQueries({ wardId: newWard === 'all' ? null : newWard, page: '1' });
  };

  return (
    <div className="flex w-full flex-col gap-3 overflow-visible xl:flex-row xl:items-center xl:justify-between xl:gap-4">
      <div className="w-full xl:max-w-[320px]">
        <SearchInput
          value={searchValue}
          onChange={handleSearchChange}
          placeholder={t('Search_assets') || 'Search assets ...'}
          className="mb-0 w-full"
          showClear={false}
        />
      </div>

      <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center xl:w-auto xl:flex-nowrap xl:justify-end">
        <div className="w-full sm:w-57.5">
          <SearchSelect
            name="assetType"
            label=""
            options={assetTypeOptions}
            value={assetTypeId}
            onChange={(_, value) => handleAssetTypeChange(value)}
            placeholder={t('All_Asset_Types') || 'All Asset Types'}
            className="w-full"
          />
        </div>

        <div className="w-full sm:w-57.5">
          <SearchSelect
            name="zone"
            label=""
            options={zoneOptions}
            value={zoneId}
            onChange={(_, value) => handleZoneChange(value)}
            placeholder={t('All_Zones') || 'All Zones'}
            className="w-full"
          />
        </div>

        <div className="w-full sm:w-57.5">
          <SearchSelect
            name="ward"
            label=""
            options={wardOptions}
            value={wardId}
            onChange={(_, value) => handleWardChange(value)}
            placeholder={t('All_Wards') || 'All Wards'}
            className="w-full"
          />
        </div>

      </div>
    </div>
  );
}
