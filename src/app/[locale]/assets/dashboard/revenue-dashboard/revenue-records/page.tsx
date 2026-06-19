import RevenueAssetRecordsView from '@/components/modules/assets/dashboard/revenue-dashboard/RevenueAssetRecordsView';
import { getRevenueRecordsAction } from './actions';
import { safeParseInt } from '@/lib/utils/asset-utils/number';
import { sanitizeInput } from '@/lib/utils/security';

export const dynamic = 'force-dynamic';

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;
const LEASE_TYPES = ['Lease', 'Rent'] as const;
const PAYMENT_STATUSES = ['Paid', 'Unpaid'] as const;

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function parseId(value: string | string[] | undefined): number | undefined {
  if (typeof value !== 'string') return undefined;
  const parsed = safeParseInt(value, 0);
  return parsed > 0 ? parsed : undefined;
}

function parseEnum<T extends string>(
  value: string | string[] | undefined,
  allowed: readonly T[]
): T | undefined {
  return typeof value === 'string' && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : undefined;
}

export default async function RevenueAssetRecordsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const pageNumber = Math.max(1, safeParseInt(params.pageNumber as string, 1));
  const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, safeParseInt(params.pageSize as string, DEFAULT_PAGE_SIZE)));
  const searchTerm = typeof params.q === 'string' ? sanitizeInput(params.q).trim() : '';

  const result = await getRevenueRecordsAction({
    pageNumber,
    pageSize,
    searchTerm: searchTerm || undefined,
    categoryId: parseId(params.category),
    zoneId: parseId(params.zoneId),
    wardId: parseId(params.wardId),
    leaseType: parseEnum(params.type, LEASE_TYPES),
    paymentStatus: parseEnum(params.status, PAYMENT_STATUSES),
  });

  return <RevenueAssetRecordsView data={result.success ? result.data : undefined} searchTerm={searchTerm} />;
}
