/* eslint-disable i18next/no-literal-string */
'use client';

import { useMemo, useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { MasterTable, type Column } from '@/components/common';

interface ApprovalRecord {
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

const MOCK_APPROVAL_RECORDS: ApprovalRecord[] = [
  {
    id: '1',
    grievanceNo: '1767421651018',
    assetId: 'MPMS-AS-142',
    assetCategory: 'Shopping Complex',
    tenantName: 'श्रीपती साळुंके',
    leaseType: 'Rent',
    rentAmount: 6437,
    submittedDate: '03/01/2026',
    status: 'Pending',
  },
  {
    id: '2',
    grievanceNo: 'REG-2025-310412343',
    assetId: 'MPMS-AS-142',
    assetCategory: 'Shopping Complex',
    tenantName: 'Paresh Deshmukh',
    leaseType: 'Rent',
    rentAmount: 598,
    submittedDate: '01/01/2026',
    status: 'Pending',
  },
  {
    id: '3',
    grievanceNo: '1767253867447',
    assetId: 'MPMS-AS-149',
    assetCategory: 'Shopping Complex',
    tenantName: 'Karan Patil',
    leaseType: 'Rent',
    rentAmount: 5800,
    submittedDate: '01/01/2026',
    status: 'Pending',
  },
  {
    id: '4',
    grievanceNo: 'REG-2025-PL001123456',
    assetId: 'MPMS-PL-001',
    assetCategory: 'Plot / Land',
    tenantName: 'अशोक जगताप स्पोर्टस ॲन्ड सोसायटी',
    leaseType: 'Lease',
    rentAmount: 85000,
    submittedDate: '15/12/2019',
    status: 'Approved',
  },
  {
    id: '5',
    grievanceNo: 'REG-2025-PL001789012',
    assetId: 'MPMS-PL-001',
    assetCategory: 'Plot / Land',
    tenantName: 'विदर्भ इव्हेंट मॅनेजमेंट',
    leaseType: 'Rent',
    rentAmount: 15000,
    submittedDate: '10/01/2026',
    status: 'Pending',
  },
];

interface Props {
  onActionClick?: (record: ApprovalRecord) => void;
  onRejectClick?: (record: ApprovalRecord) => void;
}

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

const columns: Column<ApprovalRecord>[] = [
  { key: 'grievanceNo', label: 'Grievance No', width: '160px' },
  { key: 'assetId', label: 'Asset ID', width: '120px' },
  { key: 'assetCategory', label: 'Asset Category', width: '180px' },
  { key: 'tenantName', label: 'Tenant Name', width: '220px' },
  {
    key: 'leaseType',
    label: 'Lease/Rent Type',
    width: '150px',
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
    label: 'Rent Amount (₹)',
    width: '160px',
    align: 'right',
    render: (value) => <span className="font-black text-slate-700">₹ {Number(value).toLocaleString('en-IN')}</span>,
  },
  { key: 'submittedDate', label: 'Submitted Date', width: '140px' },
  {
    key: 'status',
    label: 'Status',
    width: '120px',
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

export function LeaseRentApprovalTable({ onActionClick, onRejectClick }: Props = {}) {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const totalCount = MOCK_APPROVAL_RECORDS.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const paginatedRecords = useMemo(() => {
    const safePage = Math.min(pageNumber, totalPages);
    const start = (safePage - 1) * pageSize;
    return MOCK_APPROVAL_RECORDS.slice(start, start + pageSize);
  }, [pageNumber, pageSize, totalPages]);

  const safePage = Math.min(pageNumber, totalPages);

  return (
    <MasterTable<ApprovalRecord>
      columns={columns}
      data={paginatedRecords}
      loading={false}
      getRowKey={(row) => row.id}
      emptyText="No approval records found."
      headerTitle="Approval Records"
      headerSubtitle="Lease and rent entries ready for approval"
      tableClassName="min-w-[1220px]"
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
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => onActionClick?.(row)}
            className="rounded-full border border-emerald-200 p-1 text-emerald-500 transition-colors hover:bg-emerald-50"
            aria-label="Approve"
          >
            <CheckCircle2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onRejectClick?.(row)}
            className="rounded-full border border-red-200 p-1 text-red-500 transition-colors hover:bg-red-50"
            aria-label="Reject"
          >
            <XCircle className="h-4 w-4" />
          </button>
        </div>
      )}
    />
  );
}
