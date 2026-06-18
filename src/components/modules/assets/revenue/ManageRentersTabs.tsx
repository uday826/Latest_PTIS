'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { CheckCircle, Eye, FileText, Undo2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Tabs } from '@/components/common';
import type { ManageRentersTabKey, ManageRentersTabsProps } from '../../../../types/asset/revenue.types';

import { useTranslations } from 'next-intl';

interface ManageRentersTab {
  key: ManageRentersTabKey;
  labelKey: string;
  icon: typeof FileText;
  countKey: keyof import('../../../../types/asset/revenue.types').ManageRentersTabCounts;
}

const tabs: ManageRentersTab[] = [
  { key: 'registration', labelKey: 'tabs.registration', icon: FileText, countKey: 'registrationCount' },
  { key: 'verification', labelKey: 'tabs.verification', icon: Eye, countKey: 'verificationCount' },
  { key: 'approval', labelKey: 'tabs.approval', icon: CheckCircle, countKey: 'approvalCount' },
  { key: 'reverted', labelKey: 'tabs.reverted', icon: Undo2, countKey: 'revertedCount' },
];

export function ManageRentersTabs({ locale, counts }: ManageRentersTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('revenueManagement');

  useEffect(() => {
    router.refresh();
  }, [pathname, router]);

  const basePath = `/${locale}/assets/revenue/manage-renters`;
  const activeKey =
    pathname === basePath || pathname === `${basePath}/`
      ? 'registration'
      : pathname.endsWith('/verification')
        ? 'verification'
        : pathname.endsWith('/approval')
          ? 'approval'
          : 'reverted';

  const tabColors: Record<ManageRentersTabKey, { active: string; icon: string; countActive: string; countInactive: string }> = {
    registration: {
      active: '!bg-blue-100/90 !text-blue-700 border !border-blue-200 shadow-sm',
      icon: 'text-blue-600',
      countActive: 'bg-blue-200 text-blue-800',
      countInactive: 'bg-slate-200 text-slate-500',
    },
    verification: {
      active: '!bg-purple-100/90 !text-purple-700 border !border-purple-200 shadow-sm',
      icon: 'text-purple-600',
      countActive: 'bg-purple-200 text-purple-800',
      countInactive: 'bg-slate-200 text-slate-500',
    },
    approval: {
      active: '!bg-emerald-100/90 !text-emerald-700 border !border-emerald-200 shadow-sm',
      icon: 'text-emerald-600',
      countActive: 'bg-emerald-200 text-emerald-800',
      countInactive: 'bg-slate-200 text-slate-500',
    },
    reverted: {
      active: '!bg-amber-100/90 !text-amber-700 border !border-amber-200 shadow-sm',
      icon: 'text-amber-600',
      countActive: 'bg-amber-200 text-amber-800',
      countInactive: 'bg-slate-200 text-slate-500',
    },
  };

  const items = tabs.map((tab) => {
    const Icon = tab.icon;
    const count = counts?.[tab.countKey] ?? 0;
    const isActive = activeKey === tab.key;
    const colors = tabColors[tab.key];

    return {
      value: tab.key,
      label: (
        <span className="flex items-center gap-1.5">
          <Icon className={`h-3.5 w-3.5 ${isActive ? colors.icon : 'text-slate-400'}`} />
          <span>{t(tab.labelKey)}</span>
          {tab.key !== 'registration' && count > 0 && (
            <span
              className={`inline-flex min-w-[16px] items-center justify-center rounded-full px-1 py-0.5 text-[10px] font-semibold leading-none ${
                isActive ? colors.countActive : colors.countInactive
              }`}
            >
              {count}
            </span>
          )}
        </span>
      ),
      content: null,
      className: cn(
        'rounded-lg px-2.5 py-1 text-xs xl:text-sm min-h-[32px] transition-all whitespace-nowrap',
        isActive
          ? colors.active
          : 'text-slate-500 hover:bg-white/70 hover:text-slate-700'
      ),
    };
  });

  return (
    <div className="flex w-fit justify-start">
      <Tabs
        value={activeKey}
        onChange={(value) => {
          const nextPath =
            value === 'registration'
              ? basePath
              : value === 'verification'
                ? `${basePath}/verification`
                : value === 'approval'
                  ? `${basePath}/approval`
                  : `${basePath}/reverted`;
          router.push(nextPath);
        }}
        variant="pills"
        size="sm"
        activeTabClassName="!bg-transparent"
        className="w-full md:w-fit"
      >
        <Tabs.TabList className="flex w-full flex-nowrap items-center gap-1 rounded-xl border border-indigo-100 bg-indigo-50/30 p-1 shadow-inner md:w-fit overflow-x-auto custom-scrollbar">
          {items.map((item) => (
            <Tabs.Tab key={String(item.value)} value={item.value} className={item.className}>
              {item.label}
            </Tabs.Tab>
          ))}
        </Tabs.TabList>
      </Tabs>
    </div>
  );
}

export default ManageRentersTabs;
