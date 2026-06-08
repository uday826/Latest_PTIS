'use client';

import { useState, useEffect, useMemo } from 'react';

import { useTranslations } from 'next-intl';
import {
  SearchInput,
  SearchSelect,
  ExportButton,
  useToast,
} from '@/components/common';
import { useDebounce } from '@/hooks/useDebounce';
import { fetchAssetRegisterPage } from '@/app/[locale]/assets/municipal-Asset/asset-register/[categoryId]/actions';
import { exportToExcel } from './registerExport';
import { useQueryTransition } from '@/hooks/useQueryTransition';
import type { AssetRegisterFiltersProps } from '@/types/asset-types/asset-register.types';

const EXPORT_BATCH_SIZE = 200;

export function AssetRegisterFilters({
  categoryId,
  initialCategoryName,
  search,
  assetTypeId,
  zoneId,
  wardId,
  assetTypeOptions,
  zoneOptions,
  wardOptions,
  totalCount,
  pageSize,
  assets,
}: AssetRegisterFiltersProps) {
  const t = useTranslations('assetRegister');
  const toast = useToast();
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

  const requestParams = useMemo(
    () => ({
      assetTypeId: assetTypeId === 'all' ? null : Number(assetTypeId),
      zoneId: zoneId === 'all' ? null : Number(zoneId),
      wardId: wardId === 'all' ? null : Number(wardId),
    }),
    [assetTypeId, zoneId, wardId]
  );

  const handleExportExcel = async () => {
    try {
      const totalToExport = totalCount || assets.length;
      const firstPageSize = Math.min(EXPORT_BATCH_SIZE, Math.max(totalToExport, pageSize));
      const exportResponse = await fetchAssetRegisterPage(
        categoryId,
        1,
        firstPageSize,
        searchValue.trim(),
        requestParams.assetTypeId,
        requestParams.zoneId,
        requestParams.wardId
      );

      const firstItems = exportResponse.items || [];
      const allItems = [...firstItems];
      const exportTotal = exportResponse.totalCount || totalToExport || allItems.length;
      let currentPage = 2;

      while (allItems.length < exportTotal) {
        const nextResponse = await fetchAssetRegisterPage(
          categoryId,
          currentPage,
          EXPORT_BATCH_SIZE,
          searchValue.trim(),
          requestParams.assetTypeId,
          requestParams.zoneId,
          requestParams.wardId
        );

        const nextItems = nextResponse.items || [];
        if (!nextItems.length) {
          break;
        }

        allItems.push(...nextItems);
        currentPage += 1;
      }

      await exportToExcel(allItems, categoryId, initialCategoryName);
    } catch (error) {
      console.error('Failed to export asset register Excel:', error);
      toast.error('Failed to export asset register. Please try again.');
    }
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

        <div className="w-full sm:w-auto">
          <ExportButton
            size="sm"
            onClick={() => void handleExportExcel()}
            className="h-9 w-full rounded-md border-slate-200 bg-white px-4 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 sm:w-auto"
          >
            {t('Export')}
          </ExportButton>
        </div>
      </div>
    </div>
  );
}
