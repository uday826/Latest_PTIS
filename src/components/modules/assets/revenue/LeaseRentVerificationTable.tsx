'use client';

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

const columns: Column<VerificationRecord>[] = [
  { key: 'assetId', label: 'Asset No', align: 'center', cellClassName: '!px-2 !py-2 whitespace-nowrap' },
  {
    key: 'assetCategory',
    label: 'Asset Category',
    align: 'center',
    cellClassName: '!px-2 !py-2',
    render: (_value, row) => (
      <div className="flex flex-col leading-tight">
        <span>{row.assetCategory}</span>
        {row.assetSubCategory ? (
          <span className="mt-0.5 text-[10px] font-normal text-red-500/80">{row.assetSubCategory}</span>
        ) : null}
      </div>
    ),
  },
  { key: 'tenantName', label: 'Tenant Name', align: 'center', cellClassName: '!px-2 !py-2 whitespace-nowrap' },
  { key: 'applicationType', label: 'Application Type', align: 'center', cellClassName: '!px-2 !py-2 whitespace-nowrap' },
  { key: 'submittedDate', label: 'Submitted Date', align: 'center', cellClassName: '!px-2 !py-2 whitespace-nowrap' },
  {
    key: 'status',
    label: 'Status',
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
];

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
  return (
    <MasterTable<VerificationRecord>
      columns={columns}
      data={records}
      loading={false}
      getRowKey={(row) => row.id}
      emptyText="No verification records found."
      headerTitle="Verification Records"
      headerSubtitle="Renter corrections awaiting review"
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
