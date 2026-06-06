'use client';
/* eslint-disable i18next/no-literal-string */

import { useState, useMemo } from 'react';
import { User, Phone, CheckCircle, AlertTriangle, Building } from 'lucide-react';
import { Card, Label, SearchInput, Select } from '@/components/common';

interface Renter {
  id: string;
  assetId: string;
  tenantName: string;
  mobile: string;
  category: string;
  monthlyRent: number;
  status: 'Paid' | 'Unpaid' | 'Pending';
  expiryDate: string;
}

const mockRenters: Renter[] = [
  { id: '1', assetId: 'SHOP-5', tenantName: 'Ramesh R. Patil', mobile: '9822464286', category: 'Shopping Complex', monthlyRent: 7986, status: 'Paid', expiryDate: '2026-12-31' },
  { id: '2', assetId: 'SHOP-6', tenantName: 'Sanjay N. Dongre', mobile: '9765478200', category: 'Shopping Complex', monthlyRent: 3200, status: 'Paid', expiryDate: '2026-12-31' },
  { id: '3', assetId: 'PLOT-12', tenantName: 'Kishor A. Deshmukh', mobile: '8805470675', category: 'Plot / Open Land', monthlyRent: 13212, status: 'Unpaid', expiryDate: '2026-06-30' },
  { id: '4', assetId: 'GARDEN-2', tenantName: 'Garden Cafe Services', mobile: '9876543217', category: 'Municipal Garden', monthlyRent: 45000, status: 'Paid', expiryDate: '2027-03-31' },
  { id: '5', assetId: 'QTR-104', tenantName: 'Prashant B. Kadam', mobile: '8087296715', category: 'Municipal Quarters', monthlyRent: 5391, status: 'Pending', expiryDate: '2025-11-30' },
];

export function RenterList() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredRenters = useMemo(() => {
    return mockRenters.filter((renter) => {
      const matchesSearch =
        renter.tenantName.toLowerCase().includes(search.toLowerCase()) ||
        renter.assetId.toLowerCase().includes(search.toLowerCase()) ||
        renter.mobile.includes(search);
      const matchesStatus =
        statusFilter === 'all' || renter.status.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  return (
    <Card variant="bordered" padding="none" className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="w-full sm:w-72">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search tenant name, asset ID..."
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
            options={[
              { label: 'All Tenants', value: 'all' },
              { label: 'Paid', value: 'paid' },
              { label: 'Unpaid', value: 'unpaid' },
              { label: 'Pending clearings', value: 'pending' },
            ]}
            selectSize="sm"
            className="w-full sm:w-40"
            placeholder="All Tenants"
          />
        </div>
      </div>

      {/* Table view */}
      <div className="overflow-x-auto rounded-xl border border-slate-100">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="px-4 py-3">Tenant / Mobile</th>
              <th className="px-4 py-3">Asset Code & Category</th>
              <th className="px-4 py-3">Monthly Rent</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Agreement Expiry</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredRenters.length > 0 ? (
              filteredRenters.map((renter) => (
                <tr key={renter.id} className="hover:bg-slate-50/50 transition-colors text-xs">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                        <User className="w-4 h-4 text-slate-600" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{renter.tenantName}</p>
                        <p className="text-[10px] text-slate-500 flex items-center gap-1 font-medium mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400" /> {renter.mobile}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-bold text-violet-700 flex items-center gap-1">
                        <Building className="w-3 h-3 text-violet-500" /> {renter.assetId}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{renter.category}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-700">
                    ₹{renter.monthlyRent.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wider ${
                        renter.status === 'Paid'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : renter.status === 'Unpaid'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {renter.status === 'Paid' ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <AlertTriangle className="w-3 h-3" />
                      )}
                      {renter.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 font-semibold">{renter.expiryDate}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400 font-medium italic">
                  No active tenant records matching your search queries.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
