'use client';
/* eslint-disable i18next/no-literal-string */

import { useMemo, useState } from 'react';
import { User, CheckCircle, AlertTriangle, Building } from 'lucide-react';
import { Card, Label, SearchInput, Select } from '@/components/common';
import type { LeaseRentRecord } from './lease-rent.types';

interface RenterListProps {
  records?: LeaseRentRecord[];
  loading?: boolean;
}

export function RenterList({ records = [], loading = false }: RenterListProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const statusOptions = useMemo(() => {
    const uniqueStatuses = Array.from(
      new Set(
        records
          .map((record) => record.rentStatus.trim())
          .filter((status) => status.length > 0)
      )
    );

    return [
      { label: 'All Records', value: 'all' },
      ...uniqueStatuses.map((status) => ({ label: status, value: status.toLowerCase() })),
    ];
  }, [records]);

  const filteredRenters = useMemo(() => {
    return records.filter((renter) => {
      const searchValue = search.trim().toLowerCase();
      const matchesSearch =
        !searchValue ||
        renter.tenantName.toLowerCase().includes(searchValue) ||
        renter.assetId.toLowerCase().includes(searchValue) ||
        (renter.assetNo?.toLowerCase().includes(searchValue) ?? false) ||
        (renter.shopNo?.toLowerCase().includes(searchValue) ?? false);

      const matchesStatus =
        statusFilter === 'all' || renter.rentStatus.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [records, search, statusFilter]);

  return (
    <Card variant="bordered" padding="none" className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="w-full sm:w-72">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by tenant, asset, shop, or code..."
            className="mb-0 w-full"
            showClear={false}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden sm:block">
            Status:
          </Label>
          <Select
            value={statusFilter}
            onChange={(_, value) => setStatusFilter(value)}
            options={statusOptions}
            selectSize="sm"
            className="w-full sm:w-40"
            placeholder="All Records"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-100">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="px-4 py-3">Tenant / Asset</th>
              <th className="px-4 py-3">Asset Code & Category</th>
              <th className="px-4 py-3">Rent Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Submitted Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400 font-medium italic">
                  Loading records...
                </td>
              </tr>
            ) : filteredRenters.length > 0 ? (
              filteredRenters.map((renter) => (
                <tr key={renter.id} className="hover:bg-slate-50/50 transition-colors text-xs">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                        <User className="w-4 h-4 text-slate-600" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{renter.tenantName}</p>
                        <p className="text-[10px] text-slate-500 font-medium mt-0.5">{renter.assetId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-bold text-violet-700 flex items-center gap-1">
                        <Building className="w-3 h-3 text-violet-500" /> {renter.shopName}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5 font-medium">
                        {renter.category ?? '-'}
                        {renter.zone ? ` - ${renter.zone}` : ''}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-700">
                    Rs. {renter.rentAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wider ${
                        renter.rentStatus.toLowerCase() === 'in use'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : renter.rentStatus.toLowerCase() === 'vacant'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {renter.rentStatus.toLowerCase() === 'in use' ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <AlertTriangle className="w-3 h-3" />
                      )}
                      {renter.rentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 font-semibold">{renter.submittedDate ?? '-'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400 font-medium italic">
                  No API records available for the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
