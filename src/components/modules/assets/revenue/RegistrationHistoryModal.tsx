'use client';

import React from 'react';
import { Building2, Calendar, FileText, Clock } from 'lucide-react';
import { Drawer } from '@/components/common';

interface ModalProps {
  record: any;
  onClose: () => void;
}

export function RegistrationHistoryModal({ record, onClose }: ModalProps) {
  const drawerTitle = (
    <div className="flex items-center gap-3">
      <div className="p-1.5 border border-purple-200 bg-purple-50 rounded-lg">
        <Clock className="w-5 h-5 text-purple-600" />
      </div>
      <div>
        <h2 className="font-bold text-base text-slate-800 leading-tight">Registration History</h2>
        <p className="text-[10px] text-slate-500 font-medium">View complete history and changes</p>
      </div>
    </div>
  );

  const drawerFooter = (
    <button onClick={onClose} className="px-6 py-2 text-xs font-bold text-white bg-[#8b3dff] rounded hover:bg-purple-700 transition-colors shadow-sm cursor-pointer">
      Close
    </button>
  );

  return (
    <Drawer open={true} onClose={onClose} title={drawerTitle} width="md" footer={drawerFooter}>
      <div className="p-5 bg-slate-100 min-h-full space-y-4">
        {/* Card 1: Asset & Tenant Summary */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-4 mb-5">
            <div className="p-3 bg-purple-50 rounded-xl">
              <Building2 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-800 leading-tight">
                {record.shopName || 'अक्कर बच्चूमहास केंद्र'}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Asset ID: {record.assetId || 'MPMS-AS-9'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Category', value: record.category || 'Shopping Complex' },
              { label: 'Tenant Name', value: record.tenantName || 'कानामा प्रिक शाही' },
              { label: 'Mobile', value: '+91 9822464286' }
            ].map((f, i) => (
              <div key={i} className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500">{f.label}</label>
                <div className="w-full px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg">
                  {f.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Status Timeline */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Calendar className="w-4 h-4 text-purple-600" />
            <h3 className="font-bold text-sm text-slate-800">Status Timeline</h3>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <div className="w-6 h-6 rounded-full bg-amber-50 flex items-center justify-center border border-amber-200">
                <span className="text-amber-500 font-black text-xs">!</span>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Pending</h4>
              <p className="text-xs text-slate-500 font-medium">Awaiting verification</p>
            </div>
          </div>
        </div>

        {/* Card 3: Lease Details */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <FileText className="w-4 h-4 text-purple-600" />
            <h3 className="font-bold text-sm text-slate-800">Lease Details</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {[
              { label: 'Lease Type', value: record.leaseType || 'Rent' },
              { label: 'Rent Amount', value: `₹ ${record.rentAmount?.toLocaleString('en-IN') || '7,986'}` },
              { label: 'Start Date', value: '2025-01-01' },
              { label: 'End Date', value: '2026-12-31' },
              { label: 'Security Deposit', value: '₹ 5,000' },
              { label: 'Payment Frequency', value: 'Yearly' }
            ].map((f, i) => (
              <div key={i} className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500">{f.label}</label>
                <div className="w-full px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg">
                  {f.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Drawer>
  );
}
