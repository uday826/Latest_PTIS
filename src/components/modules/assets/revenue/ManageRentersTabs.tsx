'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CheckCircle, Eye, FileText } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface ManageRentersTabsProps {
  locale: string;
  counts?: {
    registrationCount: number;
    verificationCount: number;
    approvalCount: number;
  };
}

interface ManageRentersTab {
  key: 'registration' | 'verification' | 'approval';
  label: string;
  icon: typeof FileText;
  href: string;
}

const tabs: ManageRentersTab[] = [
  { key: 'registration', label: 'Registration', icon: FileText, href: '' },
  { key: 'verification', label: 'Verification', icon: Eye, href: '/verification' },
  { key: 'approval', label: 'Approval', icon: CheckCircle, href: '/approval' },
];

export function ManageRentersTabs({ locale, counts }: ManageRentersTabsProps) {
  const pathname = usePathname();
  const basePath = `/${locale}/assets/revenue/manage-renters`;
  const activeKey =
    pathname === basePath || pathname === `${basePath}/`
      ? 'registration'
      : pathname.endsWith('/verification')
        ? 'verification'
        : 'approval';

  const tabCounts: Record<ManageRentersTab['key'], number | undefined> = {
    registration: counts?.registrationCount,
    verification: counts?.verificationCount,
    approval: counts?.approvalCount,
  };

  return (
    <div className="flex w-full justify-start md:justify-end">
      <div className="flex w-full flex-wrap items-center gap-1 rounded-xl border border-slate-200/60 bg-slate-50 p-1 shadow-inner md:w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeKey === tab.key;
          const count = tabCounts[tab.key];

          return (
            <Link
              key={tab.key}
              href={`${basePath}${tab.href}`}
              className={cn(
                'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all min-h-[40px]',
                active
                  ? 'border border-slate-200/50 bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:bg-white/70 hover:text-slate-700'
              )}
            >
              <Icon className={cn('h-3.5 w-3.5', active ? 'text-blue-600' : 'text-slate-400')} />
              <span className="flex items-center gap-2">
                {tab.label}
                {typeof count === 'number' ? (
                  <span
                    className={cn(
                      'rounded-full px-1.5 py-0.5 text-[8px] font-black',
                      active ? 'bg-blue-100 text-blue-600' : 'bg-blue-100 text-blue-600'
                    )}
                  >
                    {count}
                  </span>
                ) : null}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default ManageRentersTabs;
