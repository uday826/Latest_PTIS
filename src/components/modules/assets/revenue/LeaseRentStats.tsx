'use client';

import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { DashboardCard } from '@/components/common/DashboardCard';
import { useTranslations } from 'next-intl';
import type { LeaseRentRegistrationStats } from '../../../../types/asset/revenue.types';

interface StatsProps {
  stats: LeaseRentRegistrationStats;
  onStatClick?: (status: string) => void;
}

export function LeaseRentStats({ stats, onStatClick }: StatsProps) {
  const t = useTranslations('revenueManagement');

  const cards = [
    {
      label: t('stats.totalApproved'),
      value: stats.totalApproved,
      icon: CheckCircle2,
      iconBg: 'bg-emerald-100 text-emerald-700',
      valueColor: 'text-emerald-700',
    },
    {
      label: t('stats.verificationPending'),
      value: stats.verificationPending,
      icon: AlertCircle,
      iconBg: 'bg-blue-100 text-blue-700',
      valueColor: 'text-blue-700',
    },
    {
      label: t('stats.approvalPending'),
      value: stats.approvalPending,
      icon: AlertCircle,
      iconBg: 'bg-amber-100 text-amber-700',
      valueColor: 'text-amber-700',
    },
    {
      label: t('stats.totalRejected'),
      value: stats.totalRejected,
      icon: XCircle,
      iconBg: 'bg-rose-100 text-rose-700',
      valueColor: 'text-rose-700',
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3 md:flex-nowrap">
      {cards.map((s, idx) => {
        const Icon = s.icon;
        return (
          <div key={idx} onClick={() => onStatClick?.(s.label)} className="cursor-pointer">
            <DashboardCard
               label={s.label}
               value={s.value}
               icon={<Icon className="h-3.5 w-3.5" />}
               iconBg={s.iconBg}
               valueColor={s.valueColor}
               className="!py-1 !px-2.5 !gap-2 transition-all hover:-translate-y-0.5 hover:shadow-md w-fit [&_p]:!text-[11px] xl:[&_p]:!text-xs [&_p]:!whitespace-nowrap [&_p.text-xl]:!text-sm xl:[&_p.text-xl]:!text-base [&_p.text-xl]:!mt-0.5 [&_div.h-9]:!h-7 [&_div.h-9]:!w-7"
            />
          </div>
        );
      })}
    </div>
  );
}
