import { getInventoryBatchesAction } from '@/app/[locale]/assets/municipal-Asset/add-New-Asset/furniture-fixture/actions';
import {
  fetchAssetDocumentsByAsset,
  fetchAssetFieldDefinitionsByCategoryType,
  fetchAssetFloorSummaryByAsset,
  fetchAssetMasterById,
  fetchChildAssetsByParent,
  fetchAssetPhotosAndPlansByAsset,
} from '@/app/[locale]/assets/municipal-Asset/asset-detail/actions';
import { Card, CardContent } from '@/components/common';
import { AssetDetailClientWrapper } from '@/components/modules/assets/municipal-Asset/AssetDetailClientWrapper';
import { AssetDetailView, type AssetDetailRecord } from '@/components/modules/assets/municipal-Asset/AssetDetailView';
import { getAssetDetailTabs } from '@/components/modules/assets/municipal-Asset/detail-tabs/detailTabConfig';

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
  const rawTab = Array.isArray(resolvedSearchParams.tab)
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
  
  // Whitelist and resolve the active tab from detailTabs
  const activeTab = rawTab && detailTabs.some((tab) => tab.key === rawTab)
    ? rawTab
    : (detailTabs[0]?.key ?? 'overview');

  let documentResult: { documents: any[]; error: string | null } = { documents: [], error: null };
  let fieldDefinitionResult: { fieldDefinitions: any[]; error: string | null } = { fieldDefinitions: [], error: null };
  let floorResult: { floorSummary: any | null; error: string | null } = { floorSummary: null, error: null };
  let inventoryResult: { success: boolean; data?: any; error?: string } = { success: true, data: undefined, error: undefined };
  let childAssetResult: { childAssets: AssetDetailRecord['childAssets']; totalSubAssets: number; error: string | null } = {
    childAssets: [],
    totalSubAssets: 0,
    error: null,
  };
  let photosAndPlansResult: { documents: any[]; error: string | null } = { documents: [], error: null };

  if (activeTab === 'overview') {
    const [fieldDefRes, photosPlansRes] = await Promise.all([
      fetchAssetFieldDefinitionsByCategoryType(
        (asset as { assetCategoryId?: number | string; AssetCategoryId?: number | string } | null | undefined)?.assetCategoryId ??
        (asset as { AssetCategoryId?: number | string } | null | undefined)?.AssetCategoryId,
        (asset as { assetTypeId?: number | string; AssetTypeId?: number | string } | null | undefined)?.assetTypeId ??
        (asset as { AssetTypeId?: number | string } | null | undefined)?.AssetTypeId
      ),
      fetchAssetPhotosAndPlansByAsset(id),
    ]);
    fieldDefinitionResult = fieldDefRes;
    photosAndPlansResult = photosPlansRes;
  } else if (activeTab === 'documents') {
    documentResult = await fetchAssetDocumentsByAsset(id);
  } else if (activeTab === 'floor-details') {
    floorResult = await fetchAssetFloorSummaryByAsset(id);
  } else if (activeTab === 'sub-units') {
    childAssetResult = await fetchChildAssetsByParent(id);
  } else if (activeTab === 'furniture-fixtures') {
    inventoryResult = await getInventoryBatchesAction(Number(id));
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
      photosAndPlans: photosAndPlansResult.documents,
      photosAndPlansError: photosAndPlansResult.error,
    } satisfies AssetDetailRecord)
    : null;

  if (!assetDetail) {
    return (
      <AssetDetailClientWrapper>
        <div className="flex h-full items-center justify-center">
            <Card variant="bordered" className="mx-auto w-full max-w-350 border-slate-200 shadow-sm">
              <CardContent className="p-6 text-sm text-slate-600">
                Asset not found.
              </CardContent>
            </Card>
        </div>
      </AssetDetailClientWrapper>
    );
  }

  return (
    <AssetDetailClientWrapper>
      <AssetDetailView
        asset={assetDetail}
        initialDocumentId={initialDocumentId}
        initialTab={activeTab}
        tabs={detailTabs}
      />
    </AssetDetailClientWrapper>
  );
}
