'use client';

import { Plus, History } from 'lucide-react';
import { LeaseRentRecord } from './mockData';

interface TableProps {
  records: LeaseRentRecord[];
  onActionClick?: (record: LeaseRentRecord) => void;
  onHistoryClick?: (record: LeaseRentRecord) => void;
}

export function LeaseRentTable({ records, onActionClick, onHistoryClick }: TableProps) {
  return (
    <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200/80 shadow-sm">
      <table className="w-full border-collapse text-left text-xs font-semibold text-slate-700">
        <thead>
          <tr className="bg-slate-800 text-white font-bold text-[10px] uppercase tracking-wider border-b border-slate-700">
            <th className="px-4 py-3.5 text-center">Sr. No</th>
            <th className="px-4 py-3.5">Asset ID</th>
            <th className="px-4 py-3.5">Shop No</th>
            <th className="px-4 py-3.5">Floor</th>
            <th className="px-4 py-3.5">Shop Name</th>
            <th className="px-4 py-3.5">Tenant Name</th>
            <th className="px-4 py-3.5">Lease / Rent Type</th>
            <th className="px-4 py-3.5">Rent Status</th>
            <th className="px-4 py-3.5">Rent Amount</th>
            <th className="px-4 py-3.5 text-center">Action</th>
            <th className="px-4 py-3.5 text-center">History</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {records.length > 0 ? (
            records.map((r, index) => (
              <tr key={r.id} className="hover:bg-slate-50/50 transition-colors text-slate-700">
                <td className="px-4 py-4 text-center font-bold text-slate-400">{index + 1}</td>
                <td className="px-4 py-4 font-bold text-blue-600 hover:underline cursor-pointer">
                  {r.assetId}
                </td>
                <td className="px-4 py-4">{r.shopNo}</td>
                <td className="px-4 py-4 text-slate-500">{r.floor}</td>
                <td className="px-4 py-4 font-bold text-slate-800">{r.shopName}</td>
                <td className="px-4 py-4 font-bold text-slate-600">{r.tenantName}</td>
                <td className="px-4 py-4">
                  <div className="space-y-0.5">
                    <span className="inline-flex px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[9px] font-bold uppercase">
                      Rent
                    </span>
                    <p className="text-[9px] text-slate-400 font-medium">{r.leaseType}</p>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-bold uppercase tracking-wider">
                    {r.rentStatus}
                  </span>
                </td>
                <td className="px-4 py-4 font-black text-slate-800">
                  ₹ {r.rentAmount.toLocaleString('en-IN')} <span className="text-[9px] text-slate-400 font-medium">(Yearly)</span>
                </td>
                <td className="px-4 py-4 text-center">
                  <button
                    onClick={() => onActionClick?.(r)}
                    className="p-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </td>
                <td className="px-4 py-4 text-center">
                  <button
                    onClick={() => onHistoryClick?.(r)}
                    className="p-1 rounded-lg bg-violet-50 hover:bg-violet-100 border border-violet-200 text-violet-600 hover:text-violet-700 transition-colors cursor-pointer"
                  >
                    <History className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={11} className="px-4 py-10 text-center text-slate-400 italic font-medium">
                No renter records matching selected filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
