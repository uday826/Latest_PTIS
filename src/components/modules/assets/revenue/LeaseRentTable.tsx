/* eslint-disable i18next/no-literal-string */
'use client';

import { useMemo, useState } from 'react';
import { History, Plus } from 'lucide-react';
import { MasterTable, type Column } from '@/components/common';
import { LeaseRentRecord } from './mockData';

interface TableProps {
  records: LeaseRentRecord[];
  onActionClick?: (record: LeaseRentRecord) => void;
  onHistoryClick?: (record: LeaseRentRecord) => void;
}

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

const columns: Column<LeaseRentRecord>[] = [
  { key: 'assetId', label: 'Asset ID', width: '140px' },
  { key: 'shopNo', label: 'Shop No', width: '100px', align: 'center' },
  { key: 'floor', label: 'Floor', width: '150px' },
  { key: 'shopName', label: 'Shop Name', width: '260px' },
  { key: 'tenantName', label: 'Tenant Name', width: '220px' },
  {
    key: 'leaseType',
    label: 'Lease / Rent Type',
    width: '180px',
    render: (_value, row) => (
      <div className="space-y-0.5">
        <span className="inline-flex rounded bg-blue-50 px-2 py-0.5 text-[9px] font-bold uppercase text-blue-700">
          Rent
        </span>
        <p className="text-[9px] font-medium text-slate-400">{row.leaseType}</p>
      </div>
    ),
  },
  {
    key: 'rentStatus',
    label: 'Rent Status',
    width: '140px',
    render: (value) => (
      <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-700">
        {String(value)}
      </span>
    ),
  },
  {
    key: 'rentAmount',
    label: 'Rent Amount',
    width: '170px',
    align: 'right',
    render: (value) => (
      <span className="font-black text-slate-800">
        ₹ {Number(value).toLocaleString('en-IN')} <span className="text-[9px] font-medium text-slate-400">(Yearly)</span>
      </span>
    ),
  },
];

export function LeaseRentTable({ records, onActionClick, onHistoryClick }: TableProps) {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const totalCount = records.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const paginatedRecords = useMemo(() => {
    const safePage = Math.min(pageNumber, totalPages);
    const start = (safePage - 1) * pageSize;
    return records.slice(start, start + pageSize);
  }, [records, pageNumber, pageSize, totalPages]);

  const safePage = Math.min(pageNumber, totalPages);

  return (


    <MasterTable<LeaseRentRecord>
      columns={columns}
      data={paginatedRecords}
      loading={false}
      emptyText="No renter records matching selected filters."
      getRowKey={(row) => row.id}
      headerTitle="Registration Records"
      headerSubtitle="Current lease and rent entries"
      tableClassName="min-w-[1200px]"
      maxBodyHeightClassName="max-h-[calc(100vh-440px)]"
      containerClassName="overflow-hidden"
      pageNumber={safePage}
      pageSize={pageSize}
      totalCount={totalCount}
      totalPages={totalPages}
      onPageChange={setPageNumber}
      onPageSizeChange={(size) => {
        setPageSize(size);
        setPageNumber(1);
      }}
      pageSizeOptions={PAGE_SIZE_OPTIONS}
      paginationConfig={{ enabled: true, showPageSizeSelector: true }}
      renderActions={(row) => (
        <>
          <button
            type="button"
            onClick={() => onActionClick?.(row)}
            className="rounded-lg border border-emerald-200 bg-emerald-50 p-1 text-emerald-600 transition-colors hover:bg-emerald-100"
            aria-label="Add registration"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onHistoryClick?.(row)}
            className="rounded-lg border border-violet-200 bg-violet-50 p-1 text-violet-600 transition-colors hover:bg-violet-100"
            aria-label="View history"
          >
            <History className="h-3.5 w-3.5" />
          </button>
        </>
      )}
      />
  );
}
