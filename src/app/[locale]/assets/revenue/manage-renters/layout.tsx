import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/common';
import { ManageRentersTabs } from '@/components/modules/assets/revenue/ManageRentersTabs';
import { LeaseRentStats } from '@/components/modules/assets/revenue/LeaseRentStats';
import { getManageRentersTabCountsAction } from './registration-actions';
import { getTranslations } from 'next-intl/server';
import { RevenueHeader } from '@/components/modules/assets/revenue/RevenueHeader';

export const dynamic = 'force-dynamic';


interface LayoutProps {
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

export default async function ManageRentersLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  const headerData = await getManageRentersTabCountsAction();
  const t = await getTranslations({ locale, namespace: 'revenueManagement' });

  return (
    <div className="flex h-full min-h-[calc(100vh-120px)] w-full overflow-y-auto bg-slate-50/50 p-4 custom-scrollbar">
      <div className="flex w-full flex-col gap-3">
        <Card variant="bordered" padding="none" className="overflow-hidden border-slate-100 bg-white shadow-sm">
          <CardContent className="space-y-3 p-4">
            <div className="flex flex-col gap-3 border-b border-slate-100 pb-3 2xl:flex-row 2xl:items-center">
              <div className="w-full 2xl:w-[25%] flex-shrink-0">
                <RevenueHeader
                  title={t('layout.title')}
                  subtitle={t('layout.description')}
                />
              </div>

              <div className="flex flex-col gap-3 md:flex-row md:items-center 2xl:justify-evenly w-full 2xl:w-[75%]">
                <ManageRentersTabs locale={locale} counts={headerData.counts} />
                <LeaseRentStats stats={headerData.stats} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="bordered" padding="none" className="overflow-hidden border-slate-100 bg-white shadow-sm">
          <CardContent className="p-3">{children}</CardContent>
        </Card>
      </div>
    </div>
  );
}
