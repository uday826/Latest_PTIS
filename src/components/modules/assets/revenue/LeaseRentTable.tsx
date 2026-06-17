'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { History, Plus, Pencil } from 'lucide-react';
import { Button, MasterTable, type Column } from '@/components/common';
import type { LeaseRentRecord } from '../../../../types/asset/revenue.types';

interface TableProps {
  records: LeaseRentRecord[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  stage?: 'registration' | 'reverted';
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onActionClick?: (record: LeaseRentRecord) => void;
  onHistoryClick?: (record: LeaseRentRecord) => void;
}

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];
const iconActionClassName = '!h-7 !w-7 !px-0 !py-0 !gap-0';

export function LeaseRentTable({
  records,
  pageNumber,
  pageSize,
  totalCount,
  totalPages,
  stage = 'registration',
  onPageChange,
  onPageSizeChange,
  onActionClick,
  onHistoryClick,
}: TableProps) {
  const t = useTranslations('revenueManagement');

  const columns = useMemo<Column<LeaseRentRecord>[]>(() => {
    const baseCols: Column<LeaseRentRecord>[] = [
      { key: 'assetId', label: t('tables.cols.assetNo'), align: 'center', cellClassName: '!px-2 !py-2 whitespace-nowrap' },
      { key: 'shopName', label: t('tables.cols.shopName'), align: 'center', cellClassName: '!px-2 !py-2 whitespace-nowrap' },
      { key: 'tenantName', label: t('tables.cols.tenantName'), align: 'center', cellClassName: '!px-2 !py-2 whitespace-nowrap' },
      {
        key: 'leaseType',
        label: t('tables.cols.leaseType'),
        align: 'center',
        cellClassName: '!px-2 !py-2',
        render: (_value, row) => (
          <div className="space-y-0.5 leading-tight">
            <span className="inline-flex rounded bg-blue-50 px-1.5 py-0.5 text-[9px] font-bold uppercase text-blue-700">
              {row.leaseType}
            </span>
          </div>
        ),
      },
      {
        key: 'workflowStatus',
        label: t('tables.cols.workflowStatus'),
        align: 'center',
        cellClassName: '!px-2 !py-2',
        render: (value) => {
          const displayVal = value ? String(value) : 'Draft';
          const isApproved = displayVal.toLowerCase() === 'approved';
          const isReverted = displayVal.toLowerCase() === 'reverted';
          const isPending = displayVal.toLowerCase() === 'pending';
          const isVerified = displayVal.toLowerCase() === 'verified';

          let badgeClass = 'border-slate-200 bg-slate-50 text-slate-700';
          if (isApproved) badgeClass = 'border-emerald-200 bg-emerald-50 text-emerald-700';
          if (isReverted) badgeClass = 'border-amber-200 bg-amber-50 text-amber-700';
          if (isPending) badgeClass = 'border-blue-200 bg-blue-50 text-blue-700';
          if (isVerified) badgeClass = 'border-teal-200 bg-teal-50 text-teal-700';

          return (
            <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${badgeClass}`}>
              {displayVal}
            </span>
          );
        },
      },
      {
        key: 'rentAmount',
        label: t('tables.cols.rentAmount'),
        align: 'center',
        cellClassName: '!px-2 !py-2',
        render: (_value, row) => (
          <span>{Number(row.rentAmount).toLocaleString('en-IN')}</span>
        ),
      },
      {
        key: 'paymentFrequency',
        label: t('tables.cols.paymentFrequency'),
        align: 'center',
        cellClassName: '!px-2 !py-2 whitespace-nowrap',
      },
    ];

    if (stage === 'reverted') {
      return [
        ...baseCols,
        {
          key: 'remarks',
          label: t('tables.cols.remarks'),
          align: 'center',
          cellClassName: '!px-2 !py-2',
          render: (_value, row) => (
            <span className="text-xs font-medium text-slate-600">
              {row.reason ?? row.rejectionReason ?? '-'}
            </span>
          ),
        },
      ];
    }

    return baseCols;
  }, [stage, t]);

  return (
    <MasterTable<LeaseRentRecord>
      columns={columns}
      data={records}
      loading={false}
      emptyText={t('tables.emptyRegistration')}
      getRowKey={(row, idx) => `${row.id}-${idx}`}
      headerTitle={stage === 'reverted' ? t('tables.titleReverted') : t('tables.titleRegistration')}
      headerSubtitle={t('tables.subtitleRegistration')}
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
      renderActions={(row) => {
        const isReverted = row.workflowStatus?.toLowerCase() === 'reverted';
        const isRegistered = row.workflowStatus?.toLowerCase() === 'registered';
        return (
          <div className="flex w-full items-center justify-center gap-2">
            {isRegistered ? (
              <Button
                type="button"
                onClick={() => onActionClick?.(row)}
                variant="primary"
                size="xs"
                icon={Plus}
                aria-label="Add registration"
                className={iconActionClassName}
              />
            ) : isReverted ? (
              <Button
                type="button"
                onClick={() => onActionClick?.(row)}
                variant="primary"
                size="xs"
                icon={Pencil}
                aria-label="Edit registration"
                className={iconActionClassName}
              />
            ) : null}
            <Button
              type="button"
              onClick={() => onHistoryClick?.(row)}
              variant="secondary"
              size="xs"
              icon={History}
              aria-label="View history"
              className={iconActionClassName}
            />
          </div>
        );
      }}
    />
  );
}
