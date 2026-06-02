import {
  fetchAssetDocumentsByAsset,
  fetchAssetFieldDefinitionsByCategoryType,
  fetchAssetFloorSummaryByAsset,
  fetchAssetMasterById,
  fetchChildAssetsByParent,
} from '@/app/[locale]/asset/municipal-Asset/asset-detail/actions';
import { getInventoryBatchesAction } from '@/app/[locale]/asset/municipal-Asset/add-New-Asset/furniture&Fixture/actions';
import { AssetDetailView, type AssetDetailRecord } from '@/components/modules/assets/municipal-Asset/AssetDetailView';
import { getAssetDetailTabs } from '@/components/modules/assets/municipal-Asset/detail-tabs/detailTabConfig';
import { Card, CardContent } from '@/components/common';

export default async function AssetDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ doc?: string | string[]; tab?: string | string[] }>;
}) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const initialDocumentId = Array.isArray(resolvedSearchParams.doc)
    ? resolvedSearchParams.doc[0]
    : resolvedSearchParams.doc ?? null;
  const initialTab = Array.isArray(resolvedSearchParams.tab)
    ? resolvedSearchParams.tab[0]
    : resolvedSearchParams.tab ?? null;
  const asset = await fetchAssetMasterById(id);
  const assetMeta = asset
    ? {
      assetCategoryName:
        (asset as { assetCategoryName?: string | null }).assetCategoryName ??
        (asset as { AssetCategoryName?: string | null }).AssetCategoryName ??
        null,
      assetTypeName:
        (asset as { assetTypeName?: string | null }).assetTypeName ??
        (asset as { AssetTypeName?: string | null }).AssetTypeName ??
        null,
      parentAssetId:
        (asset as { parentAssetId?: number | string | null }).parentAssetId ??
        (asset as { ParentAssetId?: number | string | null }).ParentAssetId ??
        null,
    }
    : null;
  const detailTabs = assetMeta ? getAssetDetailTabs(assetMeta) : [];
  const shouldFetchFloors = detailTabs.some((tab) => tab.key === 'floor-details');
  const shouldFetchChildAssets = detailTabs.some((tab) => tab.key === 'sub-units');
  const shouldFetchInventory = detailTabs.some((tab) => tab.key === 'furniture-fixtures');

  const [documentResult, fieldDefinitionResult, floorResult, inventoryResult] = await Promise.all([
    fetchAssetDocumentsByAsset(id),
    fetchAssetFieldDefinitionsByCategoryType(
      (asset as { assetCategoryId?: number | string; AssetCategoryId?: number | string } | null | undefined)?.assetCategoryId ??
      (asset as { AssetCategoryId?: number | string } | null | undefined)?.AssetCategoryId,
      (asset as { assetTypeId?: number | string; AssetTypeId?: number | string } | null | undefined)?.assetTypeId ??
      (asset as { AssetTypeId?: number | string } | null | undefined)?.AssetTypeId
    ),
    shouldFetchFloors ? fetchAssetFloorSummaryByAsset(id) : Promise.resolve({ floorSummary: null, error: null }),
    shouldFetchInventory ? getInventoryBatchesAction(Number(id)) : Promise.resolve({ success: false, data: null, error: null }),
  ]);

  const floorCandidates = Array.from(
    new Set(
      (floorResult.floorSummary?.floorDetails ?? [])
        .flatMap((row) => [row.floorId, row.id])
        .filter((value): value is number | string => value !== null && value !== undefined && value !== '')
    )
  );

  const assetLevelFloorId = (asset as { floorDetailsId?: number | string | null } | null | undefined)?.floorDetailsId ?? null;
  if (assetLevelFloorId !== null && assetLevelFloorId !== undefined && assetLevelFloorId !== '') {
    floorCandidates.push(assetLevelFloorId);
  }

  let childAssetResult: { childAssets: AssetDetailRecord['childAssets']; totalSubAssets: number; error: string | null } = {
    childAssets: [],
    totalSubAssets: 0,
    error: null,
  };

  if (shouldFetchChildAssets) {
    childAssetResult = await fetchChildAssetsByParent(id);
  }
  const assetDetail = asset
    ? ({
      ...(asset as AssetDetailRecord),
      documents: documentResult.documents,
      documentsError: documentResult.error,
      fieldDefinitions: fieldDefinitionResult.fieldDefinitions,
      fieldDefinitionsError: fieldDefinitionResult.error,
      floorSummary: floorResult.floorSummary,
      floorSummaryError: floorResult.error,
      childAssets: childAssetResult.childAssets,
      childAssetsError: childAssetResult.error,
      inventoryData: inventoryResult.success ? inventoryResult.data ?? null : null,
      inventoryError: inventoryResult.success ? null : inventoryResult.error ?? null,
    } satisfies AssetDetailRecord)
    : null;

  if (!assetDetail) {
    return (
    
        <div className="flex h-[calc(100vh-140px)] overflow-hidden">
     
          <div className="flex-1 overflow-y-auto bg-slate-50/50 p-4">
            <Card variant="bordered" className="mx-auto w-full max-w-350 border-slate-200 shadow-sm">
              <CardContent className="p-6 text-sm text-slate-600">
                Asset not found.
              </CardContent>
            </Card>
          </div>
        </div>

    );
  }

  return (

      <div className="flex h-[calc(100vh-140px)] overflow-hidden">
    
        <div className="flex-1 overflow-y-auto bg-slate-50/50 p-2 custom-scrollbar">
          <div className="mx-auto w-full max-w-[99%]">
            <AssetDetailView
              asset={assetDetail}
              initialDocumentId={initialDocumentId}
              initialTab={initialTab}
              tabs={detailTabs}
            />
          </div>
        </div>
      </div>

  );
}
