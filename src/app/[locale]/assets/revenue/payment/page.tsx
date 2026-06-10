import { PaymentSection } from '@/components/modules/assets/revenue/payment/PaymentSection';
import { getPaymentFilterOptionsAction, getPaymentRecordsPageDataAction } from './actions';
import type { PaymentRecordRow, PaymentRecordsQuery } from './actions';

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
      <div className="flex h-[calc(100vh-140px)] overflow-hidden">
        <div className="flex-1 p-6 bg-slate-50/50 overflow-y-auto custom-scrollbar">
          <PaymentSection pageData={pageData} filterOptions={filterOptions} />
        </div>
      </div>
  );
}
