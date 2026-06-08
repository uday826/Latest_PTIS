/* eslint-disable i18next/no-literal-string */
import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/common';
import { ManageRentersTabs } from '@/components/modules/assets/revenue/ManageRentersTabs';
import { getManageRentersTabCountsAction } from './registration-actions';

export const dynamic = 'force-dynamic';


interface LayoutProps {
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

export default async function ManageRentersLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  const tabCounts = await getManageRentersTabCountsAction();

  return (
    <div className="flex h-full min-h-[calc(100vh-120px)] w-full overflow-y-auto bg-slate-50/50 p-6 custom-scrollbar">
      <div className="flex w-full flex-col gap-4">
        <Card variant="bordered" padding="none" className="overflow-hidden border-slate-100 bg-white shadow-sm">
          <CardContent className="space-y-4 p-6">
            <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h1 className="flex items-center gap-2 text-xl font-black tracking-tight text-slate-800">
                  Lease & Rent Registration
                </h1>
                <p className="mt-0.5 text-[10px] font-medium text-slate-500">
                  Manage tenant details, lease agreements & rental properties
                </p>
              </div>

              <ManageRentersTabs locale={locale} counts={tabCounts} />
            </div>
          </CardContent>
        </Card>

        <Card variant="bordered" padding="none" className="overflow-hidden border-slate-100 bg-white shadow-sm">
          <CardContent className="p-4">{children}</CardContent>
        </Card>
      </div>
    </div>
  );
}
