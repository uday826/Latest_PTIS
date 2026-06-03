import { PaymentSection } from '@/components/modules/assets/revenue/payment/PaymentSection';
import { getPaymentRecordsPageDataAction } from './actions';
import type { PaymentRecord } from '@/types/asset/payment.types';

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Dedicated Static Route for Payment Management
 * Resolves to /asset/revenue/payment
 */
export default async function PaymentPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const query = await searchParams;

  const pageSize = Number(query.PageSize ?? 10);
  const pageNumber = Number(query.PageNumber ?? 1);
  const zone = typeof query.Zone === 'string' ? query.Zone : 'all';
  const ward = typeof query.Ward === 'string' ? query.Ward : 'all';
  const leaseRentType = typeof query.LeaseRentType === 'string' ? query.LeaseRentType : 'all';
  const status = typeof query.Status === 'string' ? query.Status : 'all';
  const search = typeof query.Search === 'string' ? query.Search : '';
  const allowedSortBy: Array<keyof PaymentRecord> = [
    'srNo',
    'zone',
    'ward',
    'assetId',
    'complexName',
    'shopPlotNo',
    'assetName',
    'tenantName',
    'mobileNo',
    'leaseRentType',
    'rentDueAmount',
    'status',
  ];
  const rawSortBy = typeof query.SortBy === 'string' ? query.SortBy : '';
  const sortBy = allowedSortBy.includes(rawSortBy as keyof PaymentRecord)
    ? (rawSortBy as keyof PaymentRecord)
    : '';
  const sortOrder = query.SortOrder === 'desc' ? 'desc' : 'asc';

  const pageData = await getPaymentRecordsPageDataAction({
    pageSize: Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 10,
    pageNumber: Number.isFinite(pageNumber) && pageNumber > 0 ? pageNumber : 1,
    zone,
    ward,
    leaseRentType,
    status,
    search,
    sortBy,
    sortOrder,
  });

  return (
      <div className="flex h-[calc(100vh-140px)] overflow-hidden">
        <div className="flex-1 p-6 bg-slate-50/50 overflow-y-auto custom-scrollbar">
          <PaymentSection pageData={pageData} />
        </div>
      </div>
  );
}
