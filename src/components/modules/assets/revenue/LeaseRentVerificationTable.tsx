'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Eye } from 'lucide-react';
import { Button, MasterTable, type Column } from '@/components/common';
import type { VerificationRecord } from '../../../../types/asset/revenue.types';

interface Props {
  records: VerificationRecord[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onActionClick?: (record: VerificationRecord) => void;
}

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];
const iconActionClassName = '!h-7 !w-7 !px-0 !py-0 !gap-0';

export function LeaseRentVerificationTable({
  records,
  pageNumber,
  pageSize,
  totalCount,
  totalPages,
  onPageChange,
  onPageSizeChange,
  onActionClick,
}: Props) {
  const t = useTranslations('revenueManagement');

  const columns = useMemo<Column<VerificationRecord>[]>(() => [
    { key: 'assetId', label: t('tables.cols.assetNo'), align: 'center', cellClassName: '!px-2 !py-2 whitespace-nowrap' },
    { key: 'assetName', label: t('drawers.assetName'), align: 'center', cellClassName: '!px-2 !py-2 whitespace-nowrap' },
    {
      key: 'assetCategory',
      label: t('tables.cols.assetCategory'),
      align: 'center',
      cellClassName: '!px-2 !py-2',
      render: (_value, row) => <span>{row.assetCategory}</span>,
    },
    { key: 'tenantName', label: t('tables.cols.tenantName'), align: 'center', cellClassName: '!px-2 !py-2 whitespace-nowrap' },
    { key: 'applicationType', label: t('tables.cols.leaseType'), align: 'center', cellClassName: '!px-2 !py-2 whitespace-nowrap' },
    { key: 'leaseStartDate', label: t('tables.cols.leaseStartDate'), align: 'center', cellClassName: '!px-2 !py-2 whitespace-nowrap' },
    { key: 'leaseEndDate', label: t('tables.cols.leaseEndDate'), align: 'center', cellClassName: '!px-2 !py-2 whitespace-nowrap' },
    { key: 'paymentFrequency', label: t('tables.cols.paymentFrequency'), align: 'center', cellClassName: '!px-2 !py-2 whitespace-nowrap' },
    { key: 'submittedDate', label: t('tables.cols.submittedDate'), align: 'center', cellClassName: '!px-2 !py-2 whitespace-nowrap' },
    {
      key: 'status',
      label: t('tables.cols.status'),
      align: 'center',
      cellClassName: '!px-2 !py-2',
      render: (value) => {
        const v = String(value).toLowerCase();
        const isVerified = v === 'verified';
        const isRejected = v === 'rejected';
        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${
              isVerified
                ? 'border-emerald-200 bg-emerald-50/50 text-emerald-600'
                : isRejected
                  ? 'border-red-200 bg-red-50/50 text-red-600'
                  : 'border-orange-200 bg-orange-50/50 text-orange-600'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isVerified ? 'bg-emerald-500' : isRejected ? 'bg-red-500' : 'bg-orange-500'
              }`}
            />
            {String(value)}
          </span>
        );
      },
    },
  ], [t]);

  return (
    <MasterTable<VerificationRecord>
      columns={columns}
      data={records}
      loading={false}
      getRowKey={(row, idx) => `${row.id}-${idx}`}
      emptyText={t('tables.emptyVerification')}
      headerTitle={t('tables.titleVerification')}
      headerSubtitle={t('tables.subtitleVerification')}
      tableClassName="min-w-full table-auto text-[11px]"
      maxBodyHeightClassName="max-h-[calc(100vh-440px)]"
      containerClassName="overflow-hidden"
      theadClassName="[&_th]:!px-2 [&_th]:!py-2 [&_th]:!text-[11px]"
      pageNumber={pageNumber}
      pageSize={pageSize}
      totalCount={totalCount}
      totalPages={totalPages}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      pageSizeOptions={PAGE_SIZE_OPTIONS}
      paginationConfig={{ enabled: true, showPageSizeSelector: true }}
      renderActions={(row) => (
        <Button
          type="button"
          onClick={() => onActionClick?.(row)}
          variant="primary"
          size="xs"
          icon={Eye}
          aria-label="Open verification"
          className={iconActionClassName}
        />
      )}
    />
  );
}
