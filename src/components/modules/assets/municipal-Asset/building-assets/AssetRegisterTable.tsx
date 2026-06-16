'use client';

import { useMemo, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { MasterTable } from '@/components/common';
import type { AssetRegisterRow } from './registerMappers';
import { getRegisterColumns } from './registerTableColumns';
import { useQueryTransition } from '@/hooks/useQueryTransition';
import type { AssetRegisterTableProps } from '@/types/asset-types/asset-register.types';

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

export function AssetRegisterTable({
  assets,
  totalCount,
  pageNumber,
  pageSize,
  totalPages,
}: AssetRegisterTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('assetRegister');
  const { updateQueries } = useQueryTransition();

  const handlePageChange = useCallback((newPage: number) => {
    updateQueries({ page: String(newPage) });
  }, [updateQueries]);

  const handlePageSizeChange = (newSize: number) => {
    updateQueries({ pageSize: String(newSize), page: '1' });
  };

  const columns = useMemo(() => getRegisterColumns(pathname, router, t), [pathname, router, t]);

  return (
    <MasterTable<AssetRegisterRow>
      columns={columns}
      data={assets}
      loading={false}
      emptyText={t('No_asset_records') || 'No asset records found for this category'}
      pageNumber={pageNumber}
      pageSize={pageSize}
      totalCount={totalCount}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
      pageSizeOptions={PAGE_SIZE_OPTIONS}
      paginationConfig={{ enabled: true, showPageSizeSelector: true }}
      containerClassName="rounded-lg"
      tableClassName="min-w-full table-fixed"
      rowClassName={(_, index) => (index % 2 === 0 ? 'bg-white' : 'bg-slate-50')}
      getRowKey={(row, index) => row.id ?? `${row.assetCode}-${index}`}
    />
  );
}
