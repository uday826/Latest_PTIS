import { LeaseRentRegistration } from '@/components/modules/assets/revenue/LeaseRentRegistration';
import { LeaseRentStats } from '@/components/modules/assets/revenue/LeaseRentStats';
import {
  getManageRentersAssetDetailsAction,
  getManageRentersPageDataAction,
  getApplicationTypesAction,
} from './registration-actions';
import { fetchAssetDocumentsByAsset, fetchAssetPhotosAndPlansByAsset } from '@/app/[locale]/assets/municipal-Asset/asset-detail/actions';
import { getLeaseRentDetailsDocuments } from '@/lib/api/asset/asset-lease-rent-details-document.server.service';

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
    ? data.records.find((record) => Number(record.assetMasterId) === drawerAssetId) ?? null
    : null;
  const fetchedAsset = drawerAssetId ? await getManageRentersAssetDetailsAction(drawerAssetId) : null;
  const selectedRegistrationId = Number(selectedRegistration?.id);
  const hasLeaseRentDetailsId = Number.isFinite(selectedRegistrationId) && selectedRegistrationId > 0;
  const selectedAsset = fetchedAsset ?? (selectedRegistration ? {
    id: selectedRegistration.assetMasterId ?? drawerAssetId ?? 0,
    assetId: selectedRegistration.assetMasterId ?? drawerAssetId ?? 0,
    assetNo: selectedRegistration.assetNo ?? selectedRegistration.assetId ?? '',
    assetName: selectedRegistration.shopName ?? selectedRegistration.tenantName ?? selectedRegistration.assetName ?? '',
    assetCategoryName: selectedRegistration.category ?? '',
    zoneName: selectedRegistration.zone ?? '',
    wardName: selectedRegistration.ward ?? '',
  } : null);
  const [assetDocuments, assetPhotosAndPlans, leaseRentDocuments] = drawerAssetId
    ? await Promise.all([
      fetchAssetDocumentsByAsset(drawerAssetId).then((result) => result.documents).catch(() => []),
      fetchAssetPhotosAndPlansByAsset(drawerAssetId).then((result) => result.documents).catch(() => []),
      hasLeaseRentDetailsId
        ? getLeaseRentDetailsDocuments(selectedRegistrationId).then((result) => result.documents)
        : Promise.resolve([]),
    ])
    : [[], [], []];
  const applicationTypes = await getApplicationTypesAction();

  return (
    <div className="space-y-4">
      <LeaseRentStats stats={data.stats} />
      <LeaseRentRegistration
        key={[
          data.pageNumber,
        data.pageSize,
        data.searchTerm,
        data.fromDate,
        data.toDate,
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
        fromDate={data.fromDate}
        toDate={data.toDate}
        assetCategoryId={data.assetCategoryId}
        zoneId={data.zoneId}
        wardId={data.wardId}
        assetId={data.assetId}
        drawerAssetId={drawerAssetId}
        selectedRegistration={selectedRegistration}
        selectedAsset={selectedAsset}
        assetDocuments={assetDocuments}
        leaseRentDocuments={leaseRentDocuments}
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
