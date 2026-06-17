'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Eye, XCircle } from 'lucide-react';
import { Button, MasterTable, type Column } from '@/components/common';
import type { ApprovalRecord } from '../../../../types/asset/revenue.types';

interface Props {
  records: ApprovalRecord[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onActionClick?: (record: ApprovalRecord) => void;
  onRejectClick?: (record: ApprovalRecord) => void;
}

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];
const iconActionClassName = '!h-7 !w-7 !px-0 !py-0 !gap-0';

export function LeaseRentApprovalTable({
  records,
  pageNumber,
  pageSize,
  totalCount,
  totalPages,
  onPageChange,
  onPageSizeChange,
  onActionClick,
  onRejectClick,
}: Props) {
  const t = useTranslations('revenueManagement');

  const columns = useMemo<Column<ApprovalRecord>[]>(() => [
    { key: 'assetId', label: t('tables.cols.assetNo'), align: 'center', cellClassName: '!px-2 !py-2 whitespace-nowrap' },
    { key: 'assetName', label: t('drawers.assetName'), align: 'center', cellClassName: '!px-2 !py-2 whitespace-nowrap' },
    { key: 'assetCategory', label: t('tables.cols.assetCategory'), align: 'center', cellClassName: '!px-2 !py-2 whitespace-nowrap' },
    { key: 'tenantName', label: t('tables.cols.tenantName'), align: 'center', cellClassName: '!px-2 !py-2 whitespace-nowrap' },
    {
      key: 'leaseType',
      label: t('tables.cols.leaseType'),
      align: 'center',
      cellClassName: '!px-2 !py-2',
      render: (value) => (
        <span
          className={`font-bold ${
            String(value) === 'Rent' ? 'text-emerald-600' : 'text-purple-600'
          }`}
        >
          {String(value)}
        </span>
      ),
    },
    { key: 'leaseStartDate', label: t('tables.cols.leaseStartDate'), align: 'center', cellClassName: '!px-2 !py-2 whitespace-nowrap' },
    { key: 'leaseEndDate', label: t('tables.cols.leaseEndDate'), align: 'center', cellClassName: '!px-2 !py-2 whitespace-nowrap' },
    { key: 'paymentFrequency', label: t('tables.cols.paymentFrequency'), align: 'center', cellClassName: '!px-2 !py-2 whitespace-nowrap' },
    { key: 'submittedDate', label: t('tables.cols.submittedDate'), align: 'center', cellClassName: '!px-2 !py-2 whitespace-nowrap' },
    {
      key: 'rentAmount',
      label: t('tables.cols.rentAmount'),
      align: 'center',
      cellClassName: '!px-2 !py-2',
      render: (value) => (
        <span>{Number(value).toLocaleString('en-IN')}</span>
      ),
    },
    {
      key: 'status',
      label: t('tables.cols.status'),
      align: 'center',
      cellClassName: '!px-2 !py-2',
      render: (value) =>
        String(value).toLowerCase().includes('approved') ? (
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold text-emerald-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {String(value)}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50/50 px-2.5 py-1 text-[10px] font-bold text-orange-600">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
            {String(value)}
          </span>
        ),
    },
  ], [t]);

  return (
    <MasterTable<ApprovalRecord>
      columns={columns}
      data={records}
      loading={false}
      getRowKey={(row, idx) => `${row.id}-${idx}`}
      emptyText={t('tables.emptyApproval')}
      headerTitle={t('tables.titleApproval')}
      headerSubtitle={t('tables.subtitleApproval')}
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
        <>
          <Button
            type="button"
            onClick={() => onActionClick?.(row)}
            variant="primary"
            size="xs"
            icon={Eye}
            aria-label="Open approval"
            className={iconActionClassName}
          />
          <Button
            type="button"
            onClick={() => onRejectClick?.(row)}
            variant="delete"
            size="xs"
            icon={XCircle}
            aria-label="Reject"
            className={iconActionClassName}
          />
        </>
      )}
    />
  );
}
