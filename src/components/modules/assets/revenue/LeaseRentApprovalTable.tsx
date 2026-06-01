'use client';

import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

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
    status: 'Pending'
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
    status: 'Pending'
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
    status: 'Pending'
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
    status: 'Approved'
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
    status: 'Pending'
  }
];

interface Props {
  onActionClick?: (record: any) => void;
  onRejectClick?: (record: any) => void;
}

export function LeaseRentApprovalTable({ onActionClick, onRejectClick }: Props = {}) {
  return (
    <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200/80 shadow-sm mt-4">
      <table className="w-full border-collapse text-left text-xs font-semibold text-slate-700">
        <thead>
          <tr className="bg-[#1f2937] text-white font-bold text-[10px] uppercase tracking-wider border-b border-slate-700">
            <th className="px-4 py-3.5 text-center w-16">Sr. No</th>
            <th className="px-4 py-3.5">Grievance No</th>
            <th className="px-4 py-3.5">Asset ID</th>
            <th className="px-4 py-3.5">Asset Category</th>
            <th className="px-4 py-3.5">Tenant Name</th>
            <th className="px-4 py-3.5">Lease/Rent Type</th>
            <th className="px-4 py-3.5 text-right">Rent Amount (₹)</th>
            <th className="px-4 py-3.5">Submitted Date</th>
            <th className="px-4 py-3.5">Status</th>
            <th className="px-4 py-3.5 text-center w-24">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {MOCK_APPROVAL_RECORDS.map((r, index) => (
            <tr key={r.id} className="hover:bg-slate-50/50 transition-colors text-slate-700">
              <td className="px-4 py-4 text-center font-bold text-slate-400">{index + 1}</td>
              <td className="px-4 py-4 text-blue-600 font-medium">{r.grievanceNo}</td>
              <td className="px-4 py-4 font-bold text-slate-800">{r.assetId}</td>
              <td className="px-4 py-4 text-slate-600">{r.assetCategory}</td>
              <td className="px-4 py-4 text-slate-800">{r.tenantName}</td>
              <td className="px-4 py-4">
                <span className={`font-bold ${r.leaseType === 'Rent' ? 'text-emerald-600' : 'text-purple-600'}`}>
                  {r.leaseType}
                </span>
              </td>
              <td className="px-4 py-4 text-right font-black text-slate-700">
                ₹ {r.rentAmount.toLocaleString('en-IN')}
              </td>
              <td className="px-4 py-4 text-slate-500">{r.submittedDate}</td>
              <td className="px-4 py-4">
                {r.status === 'Pending' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-orange-200 bg-orange-50/50 text-orange-600 text-[10px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                    Pending
                  </span>
                )}
                {r.status === 'Approved' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-emerald-600 text-[10px] font-bold">
                    Approved
                  </span>
                )}
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center justify-center gap-2">
                  <button 
                    onClick={() => onActionClick?.(r)}
                    className="p-1 rounded-full text-emerald-500 hover:bg-emerald-50 border border-emerald-500/20 transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onRejectClick?.(r)}
                    className="p-1 rounded-full text-red-500 hover:bg-red-50 border border-red-500/20 transition-colors cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="flex items-center justify-between p-4 border-t border-slate-100 bg-slate-50/50">
        <span className="text-xs text-slate-500">Showing 1 to 5 of 5 records</span>
        <div className="flex items-center gap-1">
          <button className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1">
            <span className="text-[10px]">❮</span> Previous
          </button>
          <button className="w-7 h-7 flex items-center justify-center rounded bg-blue-600 text-white text-xs font-bold">1</button>
          <button className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1">
            Next <span className="text-[10px]">❯</span>
          </button>
        </div>
      </div>
    </div>
  );
}
