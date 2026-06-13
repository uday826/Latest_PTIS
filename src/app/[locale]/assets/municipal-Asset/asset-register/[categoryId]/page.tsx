import { notFound, redirect } from 'next/navigation';
import { parsePaginationParams } from '@/lib/utils/pagination';
import { SEARCH_KEY_REGEX } from '@/lib/utils/validation-rules';
import { AssetRegisterView } from '@/components/modules/assets/municipal-Asset/building-assets/AssetRegisterView';
import {
  fetchAssetRegisterPage,
  fetchAssetTypesByCategory,
  fetchZones,
  fetchWards,
  fetchCategoryNameById,
} from './actions';

interface PageProps {
  params: Promise<{
    locale: string;
    categoryId: string;
  }>;
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    search?: string;
    AssetTypeId?: string;
    assetTypeId?: string;
    ZoneId?: string;
    zoneId?: string;
    WardId?: string;
    wardId?: string;
  }>;
}

function readParam(query: Record<string, string | undefined>, canonical: string, legacy: string) {
  return query[canonical] ?? query[legacy];
}

function isValidFilterValue(value: string): boolean {
  return value === 'all' || /^\d+$/.test(value);
}

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50] as const;

function sanitizeSearch(value: string | undefined): string {
  return (value || '')
    .trim()
    .split('')
    .filter((char) => SEARCH_KEY_REGEX.test(char))
    .join('')
    .slice(0, 200);
}

export default async function Page({ params, searchParams }: PageProps) {
  const { locale, categoryId } = await params;
  const query = await searchParams;
  const parsed = Number(categoryId);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    notFound();
  }

  const { pageNumber: safePage, pageSize: rawPageSize } = parsePaginationParams(
    query.page,
    query.pageSize
  );
  const safePageSize = PAGE_SIZE_OPTIONS.includes(rawPageSize as (typeof PAGE_SIZE_OPTIONS)[number]) ? rawPageSize : 10;
  const safeSearch = sanitizeSearch(query.search);
  const rawAssetTypeId = readParam(query, 'assetTypeId', 'AssetTypeId');
  const rawZoneId = readParam(query, 'zoneId', 'ZoneId');
  const rawWardId = readParam(query, 'wardId', 'WardId');
  const safeAssetTypeId = isValidFilterValue(rawAssetTypeId ?? 'all') ? (rawAssetTypeId ?? 'all') : 'all';
  const safeZoneId = isValidFilterValue(rawZoneId ?? 'all') ? (rawZoneId ?? 'all') : 'all';
  const safeWardId = isValidFilterValue(rawWardId ?? 'all') ? (rawWardId ?? 'all') : 'all';
  const updatedDate = new Date().toLocaleDateString('en-GB');

  const [categoryName, assetsResult, typesResult, zonesResult, wardsResult] = await Promise.all([
    fetchCategoryNameById(parsed),
    fetchAssetRegisterPage(
      parsed,
      safePage,
      safePageSize,
      safeSearch,
      safeAssetTypeId === 'all' ? null : Number(safeAssetTypeId),
      safeZoneId === 'all' ? null : Number(safeZoneId),
      safeWardId === 'all' ? null : Number(safeWardId)
    ),
    fetchAssetTypesByCategory(parsed),
    fetchZones().catch((error) => {
      console.error('Failed to fetch zones for asset register:', error);
      return [];
    }),
    fetchWards(safeZoneId).catch((error) => {
      console.error('Failed to fetch wards for asset register:', error);
      return [];
    }),
  ]);

  if (assetsResult.error) {
    throw new Error(assetsResult.error);
  }

  if (categoryName === null) {
    notFound();
  }

  let finalWardId = safeWardId;
  if (safeZoneId !== 'all' && safeWardId !== 'all') {
    const ward = wardsResult.find((w) => String(w.id) === safeWardId);
    if (!ward || String(ward.zoneId) !== safeZoneId) {
      finalWardId = 'all';
    }
  }

  const totalPages = Math.max(1, Math.ceil(assetsResult.totalCount / safePageSize));
  let finalPage = safePage;
  if (safePage > totalPages) {
    finalPage = totalPages;
  }

  const canonicalQuery = new URLSearchParams();
  if (finalPage > 1) canonicalQuery.set('page', String(finalPage));
  if (safePageSize !== 10) canonicalQuery.set('pageSize', String(safePageSize));
  if (safeSearch) canonicalQuery.set('search', safeSearch);
  if (safeAssetTypeId !== 'all') canonicalQuery.set('assetTypeId', safeAssetTypeId);
  if (safeZoneId !== 'all') canonicalQuery.set('zoneId', safeZoneId);
  if (finalWardId !== 'all') canonicalQuery.set('wardId', finalWardId);

  const isCanonical =
    (query.page || '1') === String(finalPage) &&
    (query.pageSize || '10') === String(safePageSize) &&
    (query.search || '') === safeSearch &&
    (query.assetTypeId === safeAssetTypeId || (query.assetTypeId === undefined && safeAssetTypeId === 'all')) &&
    (query.zoneId === safeZoneId || (query.zoneId === undefined && safeZoneId === 'all')) &&
    (query.wardId === finalWardId || (query.wardId === undefined && finalWardId === 'all')) &&
    query.AssetTypeId === undefined &&
    query.ZoneId === undefined &&
    query.WardId === undefined;
  if (!isCanonical) {
    const qStr = canonicalQuery.toString();
    redirect(`/${locale}/assets/municipal-Asset/asset-register/${categoryId}${qStr ? '?' + qStr : ''}`);
  }

  return (
    <AssetRegisterView
      locale={locale}
      categoryId={parsed}
      categoryName={categoryName}
      safeSearch={safeSearch}
      safeAssetTypeId={safeAssetTypeId}
      safeZoneId={safeZoneId}
      finalWardId={finalWardId}
      safePageSize={safePageSize}
      finalPage={finalPage}
      totalPages={totalPages}
      assetsResult={assetsResult}
      typesResult={typesResult}
      zonesResult={zonesResult}
      wardsResult={wardsResult}
      updatedDate={updatedDate}
    />
  );
}
