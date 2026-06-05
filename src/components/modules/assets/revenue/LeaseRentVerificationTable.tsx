'use client';

import { useMemo, useState } from 'react';
import { Pencil } from 'lucide-react';
import { MasterTable, type Column } from '@/components/common';

interface VerificationRecord extends Record<string, unknown> {
  id: string;
  grievanceNo: string;
  isNew: boolean;
  assetId: string;
  assetCategory: string;
  assetSubCategory: string;
  tenantName: string;
  correctionBy: string;
  correctionDate: string;
  status: 'Pending';
}

const MOCK_VERIFICATION_RECORDS: VerificationRecord[] = [
  {
    id: '1',
    grievanceNo: '',
    isNew: true,
    assetId: 'MPMS-AS-9',
    assetCategory: 'Shopping Complex',
    assetSubCategory: '(गंगोवाडा मनपा व्यापारी संकुल)',
    tenantName: 'राजेश कुमार शर्मा',
    correctionBy: '',
    correctionDate: '',
    status: 'Pending',
  },
  {
    id: '2',
    grievanceNo: '',
    isNew: true,
    assetId: 'MPMS-AS-12',
    assetCategory: 'Shopping Complex',
    assetSubCategory: '(राजकमल कॉम्प्लेक्स)',
    tenantName: 'सुनिता देशमुख',
    correctionBy: '',
    correctionDate: '',
    status: 'Pending',
  },
  {
    id: '3',
    grievanceNo: '',
    isNew: true,
    assetId: 'MPMS-PL-001',
    assetCategory: 'Plot / Open Land',
    assetSubCategory: 'गांधी मैदान - व्यावसायिक विभाग',
    tenantName: 'महाराष्ट्र स्पोर्टस अकादमी',
    correctionBy: '',
    correctionDate: '',
    status: 'Pending',
  },
  {
    id: '4',
    grievanceNo: '',
    isNew: true,
    assetId: 'MPMS-PL-003',
    assetCategory: 'Plot / Open Land',
    assetSubCategory: 'यशवंत मैदान - कार्यक्रम क्षेत्र',
    tenantName: 'अकोला महोत्सव समिती',
    correctionBy: '',
    correctionDate: '',
    status: 'Pending',
  },
  {
    id: '5',
    grievanceNo: '',
    isNew: true,
    assetId: 'PMC-GRD-001',
    assetCategory: 'Garden',
    assetSubCategory: '',
    tenantName: 'Dream Wedding Planners',
    correctionBy: '',
    correctionDate: '',
    status: 'Pending',
  },
];

interface Props {
  onActionClick?: (record: VerificationRecord) => void;
}

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

const columns: Column<VerificationRecord>[] = [
  { key: 'grievanceNo', label: 'Grievance No', width: '140px' },
  { key: 'assetId', label: 'Asset ID', width: '120px' },
  {
    key: 'assetCategory',
    label: 'Asset Category',
    width: '220px',
    render: (_value, row) => (
      <div className="flex flex-col">
        <span>{row.assetCategory}</span>
        {row.assetSubCategory ? (
          <span className="mt-0.5 text-[10px] font-normal text-red-500/80">{row.assetSubCategory}</span>
        ) : null}
      </div>
    ),
  },
  { key: 'tenantName', label: 'Tenant Name', width: '200px' },
  { key: 'correctionBy', label: 'Correction By', width: '150px' },
  { key: 'correctionDate', label: 'Correction Date', width: '150px' },
  {
    key: 'status',
    label: 'Status',
    width: '110px',
    render: (value) => (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50/50 px-2.5 py-1 text-[10px] font-bold text-orange-600">
        <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
        {String(value)}
      </span>
    ),
  },
];

export function LeaseRentVerificationTable({ onActionClick }: Props = {}) {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const totalCount = MOCK_VERIFICATION_RECORDS.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const paginatedRecords = useMemo(() => {
    const safePage = Math.min(pageNumber, totalPages);
    const start = (safePage - 1) * pageSize;
    return MOCK_VERIFICATION_RECORDS.slice(start, start + pageSize);
  }, [pageNumber, pageSize, totalPages]);

  const safePage = Math.min(pageNumber, totalPages);

  return (
    <MasterTable<VerificationRecord>
      columns={columns}
      data={paginatedRecords}
      loading={false}
      getRowKey={(row) => row.id}
      emptyText="No verification records found."
      headerTitle="Verification Records"
      headerSubtitle="Renter corrections awaiting review"
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
        <button
          type="button"
          onClick={() => onActionClick?.(row)}
          className="rounded-lg p-1.5 text-orange-500 transition-colors hover:bg-orange-50"
          aria-label="Open verification"
        >
          <Pencil className="h-4 w-4" />
        </button>
      )}
    />
  );
}
