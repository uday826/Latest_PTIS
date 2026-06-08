import { notFound } from 'next/navigation';
import AssetRegisterPage from '@/components/modules/assets/municipal-Asset/building-assets/AssetRegisterPage';
import { parsePaginationParams } from '@/lib/utils/pagination';
import {
  fetchAssetRegisterPage,
  fetchAssetTypesByCategory,
  fetchZones,
  fetchWards,
  fetchCategoryNameById,
} from '../actions';

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
    ZoneId?: string;
    WardId?: string;
  }>;
}

// Helper: check if string is a valid numeric ID or 'all'
function isValidFilterValue(value: string): boolean {
  return value === 'all' || (/^\d+$/.test(value) && Number.isFinite(Number(value)));
}

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50] as const;

export default async function Page({ params, searchParams }: PageProps) {
  const { categoryId } = await params;
  const query = await searchParams;
  const parsed = Number(categoryId);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    notFound();
  }

  // ===== SANITIZE ALL QUERY PARAMS (same pattern as property-tax modules) =====
  const { pageNumber: safePage, pageSize: rawPageSize } = parsePaginationParams(
    query.page,
    query.pageSize
  );
  // Clamp pageSize to the allowed options from PAGE_SIZE_OPTIONS
  const safePageSize = (PAGE_SIZE_OPTIONS as readonly number[]).includes(rawPageSize) ? rawPageSize : 10;

  const safeSearch = (query.search || '').trim().slice(0, 200);

  const safeAssetTypeId = isValidFilterValue(query.AssetTypeId ?? 'all')
    ? (query.AssetTypeId ?? 'all') : 'all';
  const safeZoneId = isValidFilterValue(query.ZoneId ?? 'all')
    ? (query.ZoneId ?? 'all') : 'all';
  const safeWardId = isValidFilterValue(query.WardId ?? 'all')
    ? (query.WardId ?? 'all') : 'all';

  const categoryName = await fetchCategoryNameById(parsed);
  const updatedDate = new Date().toLocaleDateString('en-GB');

  const [assetsResult, typesResult, zonesResult, wardsResult] = await Promise.all([
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
    fetchWards().catch((error) => {
      console.error('Failed to fetch wards for asset register:', error);
      return [];
    }),
  ]);

  return (
  
      <div className="flex h-[calc(100vh-140px)] overflow-hidden">
    <div className="flex-1 p-2 bg-slate-50/50 overflow-y-auto custom-scrollbar">
          <div className="mx-auto w-full max-w-[99%]">
            <AssetRegisterPage
              categoryId={parsed}
              initialCategoryName={categoryName}
              page={safePage}
              pageSize={safePageSize}
              search={safeSearch}
              assetTypeId={safeAssetTypeId}
              zoneId={safeZoneId}
              wardId={safeWardId}
              assets={assetsResult.items}
              totalCount={assetsResult.totalCount}
              totalPurchaseValue={assetsResult.totalPurchaseValue}
              totalMarketValue={assetsResult.totalMarketValue}
              totalDepreciation={assetsResult.totalDepreciation}
              netBookValue={assetsResult.netBookValue}
              activeAssetsCount={assetsResult.activeAssetsCount}
              initialAssetTypes={typesResult}
              initialZones={zonesResult}
              initialWards={wardsResult}
              updatedDate={updatedDate}
            />
          </div>
        </div>
      </div>

  );
}
