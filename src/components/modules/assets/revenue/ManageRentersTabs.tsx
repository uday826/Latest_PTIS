'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { CheckCircle, Eye, FileText, Undo2 } from 'lucide-react';
import { Tabs } from '@/components/common';
import type { ManageRentersTabKey, ManageRentersTabsProps } from '../../../../types/asset/revenue.types';

interface ManageRentersTab {
  key: ManageRentersTabKey;
  label: string;
  icon: typeof FileText;
  countKey: keyof import('../../../../types/asset/revenue.types').ManageRentersTabCounts;
}

const tabs: ManageRentersTab[] = [
  { key: 'registration', label: 'Registration', icon: FileText, countKey: 'registrationCount' },
  { key: 'verification', label: 'Verification', icon: Eye, countKey: 'verificationCount' },
  { key: 'approval', label: 'Approval', icon: CheckCircle, countKey: 'approvalCount' },
  { key: 'reverted', label: 'Reverted', icon: Undo2, countKey: 'revertedCount' },
];

export function ManageRentersTabs({ locale, counts }: ManageRentersTabsProps) {
  const router = useRouter();
  const pathname = usePathname();

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

  const items = tabs.map((tab) => {
    const Icon = tab.icon;
    const count = counts?.[tab.countKey] ?? 0;
    const isActive = activeKey === tab.key;

    return {
      value: tab.key,
      label: (
        <span className="flex items-center gap-2">
          <Icon className="h-3.5 w-3.5 text-slate-400" />
          <span>{tab.label}</span>
          {tab.key !== 'registration' && count > 0 && (
            <span
              className={`inline-flex min-w-[20px] items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none ${
                isActive
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {count}
            </span>
          )}
        </span>
      ),
      content: null,
      className:
        'rounded-lg px-4 py-2 text-xs font-bold min-h-[40px] text-slate-500 hover:bg-white/70 hover:text-slate-700',
    };
  });

  return (
    <div className="flex w-full justify-start md:justify-end">
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
        size="md"
        activeTabClassName="border border-slate-200/50 bg-white text-slate-800 shadow-sm"
        className="w-full md:w-fit"
      >
        <Tabs.TabList className="flex w-full flex-wrap items-center gap-1 rounded-xl border border-slate-200/60 bg-slate-50 p-1 shadow-inner md:w-fit">
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
