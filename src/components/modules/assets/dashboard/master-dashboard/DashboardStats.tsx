'use client';

import { Card } from '@/components/common';
import { DashboardStatsProps, FlipStatsCardProps } from '@/types/asset-type/asset-dashboard.types';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useCallback, useState, useSyncExternalStore } from 'react';

const MotionCard = motion.create(Card);
const subscribe = () => () => {};

const getLabelKey = (label: string) => {
  const norm = String(label || '').trim().toLowerCase();
  const mapping: Record<string, string> = {
    'total assets': 'totalAssets', 'total value': 'totalValue', 'encroachments': 'encroachments', 'maintenance due': 'maintenanceDue',
    'active auctions': 'activeAuctions', 'asset acquisition': 'assetAcquisition', 'active cases': 'activeCases', 'resolved': 'resolved',
    'legal action': 'legalAction', 'under review': 'underReview', 'critical': 'critical', 'needs repair': 'needsRepair',
    'scheduled': 'scheduled', 'budget allocated': 'budgetAllocated', 'total bids': 'totalBids', 'avg. bid increase': 'avgBidIncrease',
    'success rate': 'successRate', 'completed transfers': 'completedTransfers', 'pending possession': 'pendingPossession',
    'legal disputes': 'legalDisputes', 'in progress': 'inProgress'
  };
  return mapping[norm] || mapping[norm.replace(/\s+value$/, '')] || '';
};

const GRADIENT_MAP: Record<string, string> = {
  blue: 'from-blue-500 to-indigo-600', emerald: 'from-emerald-500 to-teal-600', teal: 'from-emerald-500 to-teal-600',
  purple: 'from-purple-600 to-violet-700', violet: 'from-purple-600 to-violet-700', red: 'from-red-600 to-rose-800',
  rose: 'from-red-600 to-rose-800', amber: 'from-amber-500 to-orange-600', orange: 'from-amber-500 to-orange-600',
};

/** Stable key used to decide if the back-panel items are clickable (avoids English string comparison) */
const NON_CLICKABLE_TITLE_KEYS = new Set(['totalAssets']);

export function FlipStatsCard({ titleKey, title, value, change, icon: Icon, gradient, backInfo, onCategoryClick }: FlipStatsCardProps & { titleKey: string }) {
  const t = useTranslations('assetmasterdashboard');
  const [isFlipped, setIsFlipped] = useState(false);
  const match = Object.keys(GRADIENT_MAP).find((key) => gradient.includes(key));
  const gradientColor = match ? GRADIENT_MAP[match] : 'from-gray-400 to-gray-600';

  const handleToggle = useCallback(() => setIsFlipped((prev) => !prev), []);
  const handleMouseEnter = useCallback(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches) setIsFlipped(true);
  }, []);
  const handleMouseLeave = useCallback(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches) setIsFlipped(false);
  }, []);
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault(); handleToggle();
    }
  }, [handleToggle]);

  const titleLabelKey = getLabelKey(title), displayTitle = titleLabelKey ? t(titleLabelKey as Parameters<typeof t>[0]) : title;

  return (
    <div
      tabIndex={0} role="button" aria-expanded={isFlipped} aria-label={`${displayTitle} ${t('pressEnterDetails')}`}
      className="perspective-1000 h-40 cursor-pointer rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
      onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleToggle} onKeyDown={handleKeyDown}
    >
      <MotionCard
        variant="default" padding="none" className="preserve-3d relative h-full w-full border-0 bg-transparent shadow-none"
        animate={{ rotateY: isFlipped ? 180 : 0 }} transition={{ duration: 0.6, type: 'spring', stiffness: 60, damping: 20 }} style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="backface-hidden absolute inset-0 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg" style={{ backfaceVisibility: 'hidden' }}>
          <div className={`h-1 bg-gradient-to-r ${gradientColor}`} />
          <div className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-600">{displayTitle}</p>
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${gradientColor} shadow-md`}><Icon className="h-5 w-5 text-white" /></div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-end justify-between gap-2"><h3 className="break-words text-2xl font-bold leading-tight text-gray-900">{value}</h3></div>
              {change && change.trim() !== '' && <p className="text-xs font-semibold text-gray-500">{change}</p>}
            </div>
          </div>
        </div>

        <div className="backface-hidden absolute inset-0 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
          <div className={`h-1 bg-gradient-to-r ${gradientColor}`} />
          <div className="p-2.5">
            <div className="mb-2 flex items-center gap-2">
              <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br ${gradientColor}`}><Icon className="h-3.5 w-3.5 text-white" /></div>
              <p className="text-[10px] font-bold uppercase leading-none tracking-wide text-gray-900">{displayTitle}</p>
            </div>
            <div className="grid grid-cols-2 gap-1.5 max-h-[105px] overflow-y-auto pr-1 scrollbar-thin">
              {backInfo.map((info, idx) => {
                const backLabelKey = getLabelKey(info.label), displayBackLabel = backLabelKey ? t(backLabelKey as Parameters<typeof t>[0]) : info.label;
                const isClickable = !NON_CLICKABLE_TITLE_KEYS.has(titleKey) && !!info.category;
                return (
                  <div
                    key={idx} className={`flex min-h-[48px] flex-col items-center justify-center gap-1 overflow-hidden rounded-md border border-gray-100 bg-gray-50 p-2 text-center ${isClickable ? 'cursor-pointer transition-all hover:border-blue-200 hover:bg-blue-50' : 'cursor-default'}`}
                    onClick={(event) => {
                      if (isClickable && info.category) {
                        event.stopPropagation(); onCategoryClick?.(info.category);
                      }
                    }}
                  >
                    <p className="max-w-full truncate whitespace-nowrap px-1 text-[9px] leading-tight text-gray-500" title={displayBackLabel}>{displayBackLabel}</p>
                    <p className="max-w-full px-0.5 text-[11px] font-extrabold leading-tight text-gray-900 text-center" title={info.value}>{info.value}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </MotionCard>
    </div>
  );
}

export function DashboardStats({ stats, icons, onCategoryClick }: DashboardStatsProps) {
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

  const cards = [
    { titleKey: 'totalAssets',      title: 'Total Assets',      value: stats.totalAssets.value,   change: stats.totalAssets.change,   icon: icons.BarChart3,   gradient: 'bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700',   backInfo: stats.totalAssets.backInfo },
    { titleKey: 'totalValue',       title: 'Total Value',       value: stats.totalValue.value,    change: stats.totalValue.change,    icon: icons.IndianRupee, gradient: 'bg-gradient-to-br from-emerald-500 via-green-600 to-teal-700', backInfo: stats.totalValue.backInfo },
    { titleKey: 'encroachments',    title: 'Encroachments',     value: stats.encroachments.value, change: stats.encroachments.change, icon: icons.ShieldAlert, gradient: 'bg-gradient-to-br from-red-500 via-rose-600 to-red-700',           backInfo: stats.encroachments.backInfo },
    { titleKey: 'maintenanceDue',   title: 'Maintenance Due',   value: stats.maintenance.value,   change: stats.maintenance.change,   icon: icons.Wrench,      gradient: 'bg-gradient-to-br from-purple-500 via-violet-600 to-purple-700', backInfo: stats.maintenance.backInfo },
    { titleKey: 'activeAuctions',   title: 'Active Auctions',   value: stats.auctions.value,      change: stats.auctions.change,      icon: icons.Activity,    gradient: 'bg-gradient-to-br from-amber-500 via-orange-600 to-yellow-700', backInfo: stats.auctions.backInfo },
    { titleKey: 'assetAcquisition', title: 'Asset Acquisition', value: stats.acquisitions.value,  change: stats.acquisitions.change,  icon: icons.MapPin,      gradient: 'bg-gradient-to-br from-teal-500 via-emerald-600 to-green-600',  backInfo: stats.acquisitions.backInfo },
  ];

  return (
    <div className="mb-4 grid grid-cols-1 gap-3 sm:mb-6 sm:grid-cols-2 sm:gap-4 md:gap-6 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card, index) => (
        <MotionCard
          key={card.titleKey} variant="default" padding="none" className="border-0 bg-transparent shadow-none"
          initial={mounted ? { opacity: 0, y: 20 } : undefined}
          animate={mounted ? { opacity: 1, y: 0 } : undefined}
          transition={{ delay: 0.05 * (index + 1) }}
        >
          <FlipStatsCard {...card} onCategoryClick={onCategoryClick} />
        </MotionCard>
      ))}
    </div>
  );
}
