/* eslint-disable i18next/no-literal-string */
import React from 'react';
import {
  fetchAssetDocumentsByAsset,
  fetchAssetFieldDefinitionsByCategoryType,
  fetchAssetFloorSummaryByAsset,
  fetchAssetMasterById,
  fetchChildAssetsByParent,
} from '@/app/[locale]/asset/actions';
import { getInventoryBatchesAction } from '@/app/[locale]/asset/municipal-Asset/add-New-Asset/furniture&Fixture/actions';
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

  const [documentResult, fieldDefinitionResult, floorResult, childAssetResult, inventoryResult] = await Promise.all([
    fetchAssetDocumentsByAsset(id),
    fetchAssetFieldDefinitionsByCategoryType(
      (asset as { assetCategoryId?: number | string; AssetCategoryId?: number | string } | null | undefined)?.assetCategoryId ??
        (asset as { AssetCategoryId?: number | string } | null | undefined)?.AssetCategoryId,
      (asset as { assetTypeId?: number | string; AssetTypeId?: number | string } | null | undefined)?.assetTypeId ??
        (asset as { AssetTypeId?: number | string } | null | undefined)?.AssetTypeId
    ),
    shouldFetchFloors ? fetchAssetFloorSummaryByAsset(id) : Promise.resolve({ floorSummary: null, error: null }),
    shouldFetchChildAssets ? fetchChildAssetsByParent(id) : Promise.resolve({ childAssets: [], error: null }),
    shouldFetchInventory ? getInventoryBatchesAction(Number(id)) : Promise.resolve({ success: false, data: null, error: null }),
  ]);
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
      <div className="overflow-y-auto bg-slate-50/50 p-4">
        <div className="mx-auto w-full max-w-[1400px] rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          Asset not found.
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto bg-slate-50/50 p-2 custom-scrollbar">
      <div className="mx-auto w-full max-w-[99%]">
        <AssetDetailView
          asset={assetDetail}
          initialDocumentId={initialDocumentId}
          initialTab={initialTab}
          tabs={detailTabs}
        />
      </div>
    </div>
  );
}
