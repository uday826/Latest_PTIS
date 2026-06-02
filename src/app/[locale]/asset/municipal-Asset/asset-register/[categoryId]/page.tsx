import { notFound } from 'next/navigation';
import AssetRegisterPage from '@/components/modules/assets/municipal-Asset/building-assets/AssetRegisterPage';
import { AssetRegisterApiRecord } from '@/components/modules/assets/municipal-Asset/building-assets/registerHelpers';
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

export default async function Page({ params, searchParams }: PageProps) {
  const { categoryId } = await params;
  const query = await searchParams;
  const parsed = Number(categoryId);
  const initialPage = Number(query.page || 1);
  const initialPageSize = Number(query.pageSize || 10);
  const initialSearch = query.search || '';
  const initialAssetTypeId = query.AssetTypeId || 'all';
  const initialZoneId = query.ZoneId || 'all';
  const initialWardId = query.WardId || 'all';

  if (!Number.isFinite(parsed) || parsed <= 0) {
    notFound();
  }

  let categoryName = '';
  let initialData: { items: AssetRegisterApiRecord[]; totalCount: number } = { items: [], totalCount: 0 };
  let initialAssetTypes: { id: number; label: string }[] = [];
  let initialZones: { id: number; label: string }[] = [];
  let initialWards: { id: number; label: string; zoneId?: number | null }[] = [];

  try {
    categoryName = await fetchCategoryNameById(parsed);
    const [assetsResult, typesResult, zonesResult, wardsResult] = await Promise.all([
      fetchAssetRegisterPage(
        parsed,
        Number.isFinite(initialPage) && initialPage > 0 ? initialPage : 1,
        Number.isFinite(initialPageSize) && initialPageSize > 0 ? initialPageSize : 10,
        initialSearch,
        initialAssetTypeId === 'all' ? null : initialAssetTypeId,
        initialZoneId === 'all' ? null : initialZoneId,
        initialWardId === 'all' ? null : initialWardId
      ),
      fetchAssetTypesByCategory(parsed),
      fetchZones(),
      fetchWards(),
    ]);

    initialData = assetsResult;
    initialAssetTypes = typesResult;
    initialZones = zonesResult;
    initialWards = wardsResult;
  } catch (err) {
    console.error('Failed to pre-fetch SSR data:', err);
    categoryName = '';
  }

  return (
  
      <div className="flex h-[calc(100vh-140px)] overflow-hidden">
    <div className="flex-1 p-2 bg-slate-50/50 overflow-y-auto custom-scrollbar">
          <div className="mx-auto w-full max-w-[99%]">
            <AssetRegisterPage
              categoryId={parsed}
              initialCategoryName={categoryName}
              page={Number.isFinite(initialPage) && initialPage > 0 ? initialPage : 1}
              pageSize={Number.isFinite(initialPageSize) && initialPageSize > 0 ? initialPageSize : 10}
              search={initialSearch}
              assetTypeId={initialAssetTypeId}
              zoneId={initialZoneId}
              wardId={initialWardId}
              assets={initialData.items}
              totalCount={initialData.totalCount}
              initialAssetTypes={initialAssetTypes}
              initialZones={initialZones}
              initialWards={initialWards}
            />
          </div>
        </div>
      </div>

  );
}
