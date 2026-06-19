import { RevenueAssetDashboard } from '@/components/modules/assets/dashboard/revenue-dashboard/RevenueDashboard';
import { getRevenueDashboardAction } from './actions';
import { safeParseInt } from '@/lib/utils/asset-utils/number';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/** Resolve a positive integer search param, or undefined when absent/invalid. */
function parseId(value: string | string[] | undefined): number | undefined {
  if (typeof value !== 'string') return undefined;
  const parsed = safeParseInt(value, 0);
  return parsed > 0 ? parsed : undefined;
}

export default async function AssetRevenueDashboardPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const zoneId = parseId(params.zoneId);
  const wardId = parseId(params.wardId);
  const year = parseId(params.year);

  const result = await getRevenueDashboardAction({ year, zoneId, wardId });

  return <RevenueAssetDashboard data={result.success ? result.data : undefined} />;
}
