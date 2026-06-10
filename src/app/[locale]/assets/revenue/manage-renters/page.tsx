import { LeaseRentRegistration } from '@/components/modules/assets/revenue/LeaseRentRegistration';
import { LeaseRentStats } from '@/components/modules/assets/revenue/LeaseRentStats';
import {
  getManageRentersAssetDetailsAction,
  getManageRentersPageDataAction,
  getApplicationTypesAction,
} from './registration-actions';
import { fetchAssetDocumentsByAsset, fetchAssetPhotosAndPlansByAsset } from '@/app/[locale]/assets/municipal-Asset/asset-detail/actions';

export const dynamic = 'force-dynamic';

function normalizeDrawerId(value: string | string[] | undefined): number | null {
  const raw = Array.isArray(value) ? value[0] : value;
  const trimmed = raw?.trim();
  if (!trimmed || trimmed === '[]') return null;

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

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
  const drawerAssetId = normalizeDrawerId(query.drawerAssetId);
  const selectedRegistration = drawerAssetId
    ? data.records.find((record) => record.assetMasterId === drawerAssetId) ?? null
    : null;
  const selectedAsset = drawerAssetId ? await getManageRentersAssetDetailsAction(drawerAssetId) : null;
  const [assetDocuments, assetPhotosAndPlans] = drawerAssetId
    ? await Promise.all([
      fetchAssetDocumentsByAsset(drawerAssetId).then((result) => result.documents),
      fetchAssetPhotosAndPlansByAsset(drawerAssetId).then((result) => result.documents),
    ])
    : [[], []];
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
        drawerAssetId={drawerAssetId}
        selectedRegistration={selectedRegistration}
        selectedAsset={selectedAsset}
        assetDocuments={assetDocuments}
        assetPhotosAndPlans={assetPhotosAndPlans}
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
