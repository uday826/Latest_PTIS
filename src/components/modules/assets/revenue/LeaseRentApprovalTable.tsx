/* eslint-disable i18next/no-literal-string */
'use client';

import { CheckCircle2, XCircle } from 'lucide-react';
import { Button, MasterTable, type Column } from '@/components/common';

export interface ApprovalRecord extends Record<string, unknown> {
  id: string;
  grievanceNo: string;
  assetId: string;
  assetCategory: string;
  tenantName: string;
  leaseType: string;
  rentAmount: number;
  submittedDate: string;
  status: 'Pending' | 'Approved';
}

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

const columns: Column<ApprovalRecord>[] = [
  { key: 'assetId', label: 'Asset No', align: 'center', cellClassName: '!px-2 !py-2 whitespace-nowrap' },
  { key: 'assetCategory', label: 'Asset Category', align: 'center', cellClassName: '!px-2 !py-2 whitespace-nowrap' },
  { key: 'tenantName', label: 'Tenant Name', align: 'center', cellClassName: '!px-2 !py-2 whitespace-nowrap' },
  {
    key: 'leaseType',
    label: 'Lease/Rent Type',
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
  {
    key: 'rentAmount',
    label: 'Rent Amount (Rs.)',
    align: 'center',
    cellClassName: '!px-2 !py-2',
    render: (value) => (
      <span className="font-black text-slate-700">Rs. {Number(value).toLocaleString('en-IN')}</span>
    ),
  },
  { key: 'submittedDate', label: 'Submitted Date', align: 'center', cellClassName: '!px-2 !py-2 whitespace-nowrap' },
  {
    key: 'status',
    label: 'Status',
    align: 'center',
    cellClassName: '!px-2 !py-2',
    render: (value) =>
      String(value) === 'Approved' ? (
        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold text-emerald-600">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Approved
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50/50 px-2.5 py-1 text-[10px] font-bold text-orange-600">
          <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
          Pending
        </span>
      ),
  },
];

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
  return (
    <MasterTable<ApprovalRecord>
      columns={columns}
      data={records}
      loading={false}
      getRowKey={(row) => row.id}
      emptyText="No approval records found."
      headerTitle="Approval Records"
      headerSubtitle="Lease and rent entries ready for approval"
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
            variant="success"
            size="xs"
            icon={CheckCircle2}
            aria-label="Approve"
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
