'use client';

import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

interface StatsProps {
  onStatClick?: (status: string) => void;
}

export function LeaseRentStats({ onStatClick }: StatsProps) {
  const stats = [
    { label: 'Total Approved', value: '1', icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600 border-emerald-100', dot: 'bg-emerald-500' },
    { label: 'Total Verified', value: '0', icon: CheckCircle2, color: 'bg-teal-50 text-teal-600 border-teal-100', dot: 'bg-teal-500' },
    { label: 'Verification Pending', value: '10', icon: AlertCircle, color: 'bg-blue-50 text-blue-600 border-blue-100', dot: 'bg-blue-500' },
    { label: 'Approval Pending', value: '4', icon: AlertCircle, color: 'bg-amber-50 text-amber-600 border-amber-100', dot: 'bg-amber-500' },
    { label: 'Total Rejected', value: '0', icon: XCircle, color: 'bg-rose-50 text-rose-600 border-rose-100', dot: 'bg-rose-500' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 w-full">
      {stats.map((s, idx) => {
        const Icon = s.icon;
        return (
          <div
            key={idx}
            onClick={() => onStatClick?.(s.label)}
            className={`flex items-center justify-between p-3.5 rounded-xl border ${s.color} shadow-sm hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer bg-white`}
          >
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <Icon className="w-5 h-5" />
                <span className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ${s.dot} border-2 border-white`} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{s.label}</p>
                <h4 className="text-lg font-black text-slate-800 tracking-tight mt-0.5">{s.value}</h4>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
