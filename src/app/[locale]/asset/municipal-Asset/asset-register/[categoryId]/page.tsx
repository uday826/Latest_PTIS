import { notFound } from 'next/navigation';
import AssetRegisterPage from '@/components/modules/assets/municipal-Asset/building-assets/private/AssetRegisterPage';
import { categoryTypeService } from '@/lib/api/asset/category-type.service';
import { fetchAssetRegisterPage } from '../actions';

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
  let initialData: { items: any[]; totalCount: number } = { items: [], totalCount: 0 };
  try {
    const response = await categoryTypeService.getCategories();
    if (response.success && response.data) {
      const match = response.data.find((item) => item.id === parsed);
      categoryName = match?.categoryName || '';
    }
    initialData = await fetchAssetRegisterPage(
      parsed,
      Number.isFinite(initialPage) && initialPage > 0 ? initialPage : 1,
      Number.isFinite(initialPageSize) && initialPageSize > 0 ? initialPageSize : 10,
      initialSearch,
      initialAssetTypeId === 'all' ? null : initialAssetTypeId,
      initialZoneId === 'all' ? null : initialZoneId,
      initialWardId === 'all' ? null : initialWardId
    );
  } catch {
    categoryName = '';
  }

  return (
    <div className="p-2 bg-slate-50/50 overflow-y-auto custom-scrollbar">
      <div className="mx-auto w-full max-w-[99%]">
        <AssetRegisterPage
          categoryId={parsed}
          initialCategoryName={categoryName}
          initialPage={Number.isFinite(initialPage) && initialPage > 0 ? initialPage : 1}
          initialPageSize={Number.isFinite(initialPageSize) && initialPageSize > 0 ? initialPageSize : 10}
          initialSearch={initialSearch}
          initialAssetTypeId={initialAssetTypeId}
          initialZoneId={initialZoneId}
          initialWardId={initialWardId}
          initialAssets={initialData.items}
          initialTotalCount={initialData.totalCount}
        />
        </div>
      </div>
  );
}
