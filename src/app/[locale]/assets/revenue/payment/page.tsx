import { Card, CardContent } from '@/components/common';
import { PaymentSection } from '@/components/modules/assets/revenue/payment/PaymentSection';
import { getPaymentFilterOptionsAction, getPaymentRecordsPageDataAction } from './actions';
import type { PaymentRecordRow, PaymentRecordsQuery } from './actions';
import { RevenueHeader } from '@/components/modules/assets/revenue/RevenueHeader';

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Dedicated Static Route for Payment Management
 * Resolves to /assets/revenue/payment
 */
export default async function PaymentPage({ searchParams }: PageProps) {
  const query = await searchParams;

  const pageSize = Number(query.PageSize ?? 10);
  const pageNumber = Number(query.PageNumber ?? 1);
  const zone =
    typeof query.ZoneId === 'string'
      ? query.ZoneId
      : typeof query.Zone === 'string' && /^\d+$/.test(query.Zone)
        ? query.Zone
        : 'all';
  const ward =
    typeof query.WardId === 'string'
      ? query.WardId
      : typeof query.Ward === 'string' && /^\d+$/.test(query.Ward)
        ? query.Ward
        : 'all';
  const assetCategory =
    typeof query.AssetCategoryId === 'string'
      ? query.AssetCategoryId
      : typeof query.AssetCategory === 'string' && /^\d+$/.test(query.AssetCategory)
        ? query.AssetCategory
        : 'all';
  const leaseRentType = typeof query.LeaseRentType === 'string' ? query.LeaseRentType : 'all';
  const status = typeof query.Status === 'string' ? query.Status : 'all';
  const search = typeof query.Search === 'string' ? query.Search : '';
  const allowedSortBy: Array<keyof PaymentRecordRow> = [
    'id',
    'zone',
    'wardNo',
    'assetId',
    'assetNo',
    'shopName',
    'shopNo',
    'assetName',
    'tenantName',
    'tenantMobile',
    'leaseType',
    'rentDue',
    'status',
    'leaseStartDate',
    'leaseEndDate',
  ];
  const rawSortBy = typeof query.SortBy === 'string' ? query.SortBy : '';
  const sortBy = allowedSortBy.includes(rawSortBy as keyof PaymentRecordRow)
    ? (rawSortBy as keyof PaymentRecordRow)
    : '';
  const sortOrder = query.SortOrder === 'desc' ? 'desc' : 'asc';

  const paymentQuery: PaymentRecordsQuery = {
    pageSize: Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 10,
    pageNumber: Number.isFinite(pageNumber) && pageNumber > 0 ? pageNumber : 1,
    zone,
    ward,
    assetCategory,
    leaseRentType,
    status,
    search,
    sortBy,
    sortOrder,
  };

  const [pageData, filterOptions] = await Promise.all([
    getPaymentRecordsPageDataAction(paymentQuery),
    getPaymentFilterOptionsAction(zone),
  ]);

  return (
    <div className="flex h-full min-h-[calc(100vh-120px)] w-full overflow-y-auto bg-slate-50/50 p-4 custom-scrollbar">
      <div className="flex w-full flex-col gap-3">
        <Card variant="bordered" padding="none" className="overflow-hidden border-slate-100 bg-white shadow-sm">
          <CardContent className="space-y-3 p-4">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
              <div className="w-full flex-shrink-0">
                <RevenueHeader
                  title="Lease Rent Payment Details"
                  subtitle="Manage & track lease rent collections, invoices & transaction history"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="bordered" padding="none" className="overflow-hidden border-slate-100 bg-white shadow-sm">
          <CardContent className="p-3">
            <PaymentSection pageData={pageData} filterOptions={filterOptions} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
