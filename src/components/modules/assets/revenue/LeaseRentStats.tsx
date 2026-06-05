'use client';

import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { DashboardCard } from '@/components/common/DashboardCard';

interface StatsProps {
  onStatClick?: (status: string) => void;
}

export function LeaseRentStats({ onStatClick }: StatsProps) {
  const stats = [
    { label: 'Total Approved', value: '1', icon: CheckCircle2, iconBg: 'bg-emerald-100 text-emerald-700', valueColor: 'text-emerald-700' },
    { label: 'Total Verified', value: '0', icon: CheckCircle2, iconBg: 'bg-teal-100 text-teal-700', valueColor: 'text-teal-700' },
    { label: 'Verification Pending', value: '10', icon: AlertCircle, iconBg: 'bg-blue-100 text-blue-700', valueColor: 'text-blue-700' },
    { label: 'Approval Pending', value: '4', icon: AlertCircle, iconBg: 'bg-amber-100 text-amber-700', valueColor: 'text-amber-700' },
    { label: 'Total Rejected', value: '0', icon: XCircle, iconBg: 'bg-rose-100 text-rose-700', valueColor: 'text-rose-700' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 w-full md:grid-cols-5">
      {stats.map((s, idx) => {
        const Icon = s.icon;
        return (
          <div key={idx} onClick={() => onStatClick?.(s.label)} className="cursor-pointer">
            <DashboardCard
              label={s.label}
              value={s.value}
              icon={<Icon className="h-4 w-4" />}
              iconBg={s.iconBg}
              valueColor={s.valueColor}
              className="transition-all hover:-translate-y-0.5 hover:shadow-md"
            />
          </div>
        );
      })}
    </div>
  );
}
