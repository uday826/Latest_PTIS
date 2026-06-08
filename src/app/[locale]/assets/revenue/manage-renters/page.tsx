import { LeaseRentRegistration } from '@/components/modules/assets/revenue/LeaseRentRegistration';
import { LeaseRentStats } from '@/components/modules/assets/revenue/LeaseRentStats';
import { getManageRentersAssetDetailsAction, getManageRentersPageDataAction, getApplicationTypesAction } from './actions';
import { fetchAssetDocumentsByAsset } from '@/app/[locale]/assets/municipal-Asset/asset-detail/actions';

export const dynamic = 'force-dynamic';

interface ManageRentersPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Dedicated SSR route for Manage Renters Details.
 * Resolves to /assets/revenue/manage-renters
 */
export default async function ManageRentersPage({ searchParams }: ManageRentersPageProps) {
  const query = await searchParams;
  const data = await getManageRentersPageDataAction(query);
  const drawerAssetIdRaw = query.drawerAssetId;
  const drawerAssetId = Array.isArray(drawerAssetIdRaw) ? drawerAssetIdRaw[0] : drawerAssetIdRaw;
  const selectedAsset = drawerAssetId ? await getManageRentersAssetDetailsAction(drawerAssetId) : null;
  const assetDocuments = drawerAssetId ? (await fetchAssetDocumentsByAsset(drawerAssetId)).documents : [];
  const applicationTypes = await getApplicationTypesAction();

  return (
    <div className="space-y-4">
      <LeaseRentStats stats={data.stats} />
      <LeaseRentRegistration
        key={[
          data.pageNumber,
          data.pageSize,
          data.searchTerm,
          data.assetCategoryId ?? '',
          data.zoneId ?? '',
          data.wardId ?? '',
          data.assetId ?? '',
          drawerAssetId ?? '',
        ].join('|')}
        pageNumber={data.pageNumber}
        pageSize={data.pageSize}
        totalCount={data.totalCount}
        totalPages={data.totalPages}
        searchTerm={data.searchTerm}
        assetCategoryId={data.assetCategoryId}
        zoneId={data.zoneId}
        wardId={data.wardId}
        assetId={data.assetId}
        drawerAssetId={drawerAssetId ? Number(drawerAssetId) : null}
        selectedAsset={selectedAsset as Record<string, unknown> | null}
        assetDocuments={assetDocuments}
        applicationTypes={applicationTypes}
        initialRecords={data.records}
        categoryOptions={data.categoryOptions}
        zoneOptions={data.zoneOptions}
        wardOptions={data.wardOptions}
        assetOptions={data.assetOptions}
      />
    </div>
  );
}
