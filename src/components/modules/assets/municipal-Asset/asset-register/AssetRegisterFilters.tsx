'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { SEARCH_KEY_REGEX } from '@/lib/utils/validation-rules';
import {
  SearchInput,
  SearchSelect,
} from '@/components/common';
import { useDebounce } from '@/hooks/useDebounce';
import type { AssetRegisterFiltersProps } from '@/types/municipal-asset-register.types';
import { useQueryTransition } from '@/hooks/useQueryTransition';

export function AssetRegisterFilters({
  search,
  assetTypeId,
  zoneId,
  wardId,
  owningDepartmentId,
  assetTypeOptions,
  zoneOptions,
  wardOptions,
  owningDepartmentOptions,
  categoryId,
  categoryOptions = [],
}: AssetRegisterFiltersProps) {
  const t = useTranslations('assetRegister');
  const { updateQueries } = useQueryTransition();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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
    const sanitizedValue = val
      .split('')
      .filter((char) => SEARCH_KEY_REGEX.test(char))
      .join('');

    setSearchValue(sanitizedValue);
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

  const handleOwningDepartmentChange = (newDept: string) => {
    updateQueries({ owningDepartmentId: newDept === 'all' ? null : newDept, page: '1' });
  };

  const handleAssetCategoryChange = (newCategory: string) => {
    const segments = pathname.split('/').filter(Boolean);
    const locale = segments[0] || 'en';
    
    let newPath = `/${locale}/assets/municipal-Asset/asset-register`;
    if (newCategory !== 'all') {
      newPath += `/${newCategory}`;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.delete('assetTypeId');
    params.delete('page');

    const queryString = params.toString();
    const nextUrl = queryString ? `${newPath}?${queryString}` : newPath;

    router.push(nextUrl, { scroll: false });
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
        {categoryOptions.length > 0 && (
          <div className="w-full sm:w-57.5">
            <SearchSelect
              name="assetCategory"
              label=""
              options={categoryOptions}
              value={categoryId ? String(categoryId) : 'all'}
              onChange={(_, value) => handleAssetCategoryChange(value)}
              placeholder={t('All_Asset_Categories') || 'All Asset Categories'}
              className="w-full"
            />
          </div>
        )}

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

        <div className="w-full sm:w-57.5">
          <SearchSelect
            name="owningDepartment"
            label=""
            options={owningDepartmentOptions}
            value={owningDepartmentId}
            onChange={(_, value) => handleOwningDepartmentChange(value)}
            placeholder={t('All_Departments') || 'All Departments'}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
