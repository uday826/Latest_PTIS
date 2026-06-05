/* eslint-disable i18next/no-literal-string */
'use client';

import { useState } from 'react';
import { Calendar as CalendarIcon, Search } from 'lucide-react';
import { Label, SearchInput, Select } from '@/components/common';
import { LeaseRentApprovalTable } from './LeaseRentApprovalTable';
import { ApprovalLeaseModal } from './ApprovalLeaseModal';
import { RejectRegistrationModal } from './RejectRegistrationDrawer';

type ApprovalDrawerRecord = {
  assetId?: string;
  grievanceNo?: string;
  assetCategory?: string;
};

export function LeaseRentApprovalContent() {
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [approvedRecord, setApprovedRecord] = useState<ApprovalDrawerRecord | null>(null);
  const [rejectedRecord, setRejectedRecord] = useState<ApprovalDrawerRecord | null>(null);

  return (
    <>
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/60 bg-slate-50 p-4 md:flex-row md:items-end mb-4">
        <div className="min-w-[150px] space-y-1.5">
          <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Asset Category</Label>
          <Select
            value={category}
            onChange={(_, value) => setCategory(value)}
            options={[
              { label: 'All Categories', value: 'all' },
              { label: 'Shopping Complex', value: 'Shopping Complex' },
              { label: 'Plot / Land', value: 'Plot / Land' },
            ]}
            selectSize="sm"
            className="w-full"
            placeholder="All Categories"
          />
        </div>

        <div className="flex-1 space-y-1.5">
          <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Smart Search</Label>
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search across all fields..."
            className="mb-0 w-full"
            showClear={false}
          />
        </div>

        <div className="w-[140px] space-y-1.5">
          <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">From Date</Label>
          <div className="relative">
            <input
              type="text"
              placeholder="mm/dd/yyyy"
              className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 pr-8 text-xs font-semibold text-slate-700 outline-none placeholder:font-normal placeholder:text-slate-400 focus:border-blue-500"
            />
            <CalendarIcon className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        <div className="w-[140px] space-y-1.5">
          <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">To Date</Label>
          <div className="relative">
            <input
              type="text"
              placeholder="mm/dd/yyyy"
              className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 pr-8 text-xs font-semibold text-slate-700 outline-none placeholder:font-normal placeholder:text-slate-400 focus:border-blue-500"
            />
            <CalendarIcon className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        <button className="flex h-9 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-blue-600 px-6 text-xs font-bold text-white shadow-sm transition-colors hover:bg-blue-700">
          <Search className="h-3.5 w-3.5" />
          Search
        </button>
      </div>

      <LeaseRentApprovalTable
        onActionClick={(record) => setApprovedRecord(record)}
        onRejectClick={(record) => setRejectedRecord(record)}
      />

      {approvedRecord ? (
        <ApprovalLeaseModal
          record={approvedRecord}
          onClose={() => setApprovedRecord(null)}
        />
      ) : null}

      {rejectedRecord ? (
        <RejectRegistrationModal
          record={rejectedRecord}
          onClose={() => setRejectedRecord(null)}
        />
      ) : null}
    </>
  );
}

export default LeaseRentApprovalContent;
