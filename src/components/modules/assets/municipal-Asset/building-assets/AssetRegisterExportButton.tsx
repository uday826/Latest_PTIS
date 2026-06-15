'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { ExportButton, useToast } from '@/components/common';
import { fetchAssetRegisterPage } from '@/app/[locale]/assets/municipal-Asset/asset-register/[categoryId]/actions';
import { exportToExcel } from './registerExport';
import type { AssetRegisterExportButtonProps } from '@/types/asset-types/asset-register.types';

const EXPORT_BATCH_SIZE = 200;

export function AssetRegisterExportButton({
  categoryId,
  categoryName,
  search,
  assetTypeId,
  zoneId,
  wardId,
  totalCount,
  pageSize,
  assets,
}: AssetRegisterExportButtonProps) {
  const t = useTranslations('assetRegister');
  const toast = useToast();

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
        search.trim(),
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
          search.trim(),
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

      await exportToExcel(allItems, categoryId, t);
    } catch (error) {
      console.error('Failed to export asset register Excel:', error);
      toast.error('Failed to export asset register. Please try again.');
    }
  };

  return (
    <ExportButton
      size="sm"
      onClick={() => void handleExportExcel()}
      className="h-9 w-full rounded-md border-slate-200 bg-white px-4 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 sm:w-auto"
    >
      {t('Export')}
    </ExportButton>
  );
}
