/* eslint-disable i18next/no-literal-string */
'use client';

import { History, Plus } from 'lucide-react';
import { Button, MasterTable, type Column } from '@/components/common';
import type { LeaseRentRecord } from './lease-rent.types';

interface TableProps {
  records: LeaseRentRecord[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onActionClick?: (record: LeaseRentRecord) => void;
  onHistoryClick?: (record: LeaseRentRecord) => void;
}

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];
const iconActionClassName = '!h-7 !w-7 !px-0 !py-0 !gap-0';

const columns: Column<LeaseRentRecord>[] = [
  { key: 'assetId', label: 'Asset No', align: 'center', cellClassName: '!px-2 !py-2 whitespace-nowrap' },
  { key: 'shopNo', label: 'Shop No', align: 'center', cellClassName: '!px-2 !py-2 whitespace-nowrap' },
  { key: 'floor', label: 'Floor', align: 'center', cellClassName: '!px-2 !py-2 whitespace-nowrap' },
  { key: 'shopName', label: 'Shop Name', align: 'center', cellClassName: '!px-2 !py-2 whitespace-nowrap' },
  { key: 'tenantName', label: 'Tenant Name', align: 'center', cellClassName: '!px-2 !py-2 whitespace-nowrap' },
  {
    key: 'leaseType',
    label: 'Lease / Rent Type',
    align: 'center',
    cellClassName: '!px-2 !py-2',
    render: (_value, row) => (
      <div className="space-y-0.5 leading-tight">
        <span className="inline-flex rounded bg-blue-50 px-1.5 py-0.5 text-[9px] font-bold uppercase text-blue-700">
          Rent
        </span>
        <p className="text-[9px] font-medium text-slate-400">{row.leaseType}</p>
      </div>
    ),
  },
  {
    key: 'rentStatus',
    label: 'Rent Status',
    align: 'center',
    cellClassName: '!px-2 !py-2',
    render: (value) => (
      <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-700">
        {String(value)}
      </span>
    ),
  },
  {
    key: 'rentAmount',
    label: 'Rent Amount',
    align: 'center',
    cellClassName: '!px-2 !py-2',
    render: (value) => (
      <span className="font-black text-slate-800">
        Rs. {Number(value).toLocaleString('en-IN')}{' '}
        <span className="text-[9px] font-medium text-slate-400">(Yearly)</span>
      </span>
    ),
  },
];

export function LeaseRentTable({
  records,
  pageNumber,
  pageSize,
  totalCount,
  totalPages,
  onPageChange,
  onPageSizeChange,
  onActionClick,
  onHistoryClick,
}: TableProps) {
  return (
    <MasterTable<LeaseRentRecord>
      columns={columns}
      data={records}
      loading={false}
      emptyText="No renter records matching selected filters."
      getRowKey={(row) => row.id}
      headerTitle="Registration Records"
      headerSubtitle="Current lease and rent entries"
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
            icon={Plus}
            aria-label="Add registration"
            className={iconActionClassName}
          />
          <Button
            type="button"
            onClick={() => onHistoryClick?.(row)}
            variant="secondary"
            size="xs"
            icon={History}
            aria-label="View history"
            className={iconActionClassName}
          />
        </>
      )}
    />
  );
}
