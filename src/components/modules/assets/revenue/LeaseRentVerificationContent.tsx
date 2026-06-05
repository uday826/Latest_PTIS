/* eslint-disable i18next/no-literal-string */
'use client';

import { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Label, SearchInput, Select } from '@/components/common';
import { LeaseRentVerificationTable } from './LeaseRentVerificationTable';
import { VerificationLeaseModal } from './VerificationLeaseDrawer';

type VerificationDrawerRecord = {
  assetId?: string;
  grievanceNo?: string;
  assetCategory?: string;
};

export function LeaseRentVerificationContent() {
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<VerificationDrawerRecord | null>(null);

  return (
    <>
      <div className="rounded-2xl border border-slate-200/60 bg-slate-50 p-4 shadow-sm mb-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[200px_minmax(0,1fr)_170px_170px]">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Asset Category
            </Label>
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

          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Smart Search
            </Label>
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search across all fields..."
              className="mb-0 w-full"
              showClear={false}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              From Date
            </Label>
            <div className="relative">
              <input
                type="text"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                placeholder="mm/dd/yyyy"
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 pr-8 text-xs font-semibold text-slate-700 outline-none placeholder:font-normal placeholder:text-slate-400 focus:border-blue-500"
              />
              <CalendarIcon className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              To Date
            </Label>
            <div className="relative">
              <input
                type="text"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                placeholder="mm/dd/yyyy"
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 pr-8 text-xs font-semibold text-slate-700 outline-none placeholder:font-normal placeholder:text-slate-400 focus:border-blue-500"
              />
              <CalendarIcon className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>
      </div>

      <LeaseRentVerificationTable onActionClick={(record) => setSelectedRecord(record)} />

      {selectedRecord ? (
        <VerificationLeaseModal
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
        />
      ) : null}
    </>
  );
}

export default LeaseRentVerificationContent;
