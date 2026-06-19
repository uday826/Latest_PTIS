import { LeaseRentRegistration } from '@/components/modules/assets/revenue/LeaseRentRegistration';
import {
  getManageRentersAssetDetailsAction,
  getManageRentersPageDataAction,
  getApplicationTypesAction,
  getLeaseRentDetailsDocumentsAction,
} from './action';
import { fetchAssetDocumentsByAsset, fetchAssetPhotosAndPlansByAsset } from '@/app/[locale]/assets/municipal-Asset/asset-detail/actions';
import { setRequestLocale } from 'next-intl/server';
import type { AssetDocumentListItem } from '@/types/municipal-asset/detail-tabs.types';


export const dynamic = 'force-dynamic';

function normalizeDrawerId(value: string | string[] | undefined): number | null {
  const raw = Array.isArray(value) ? value[0] : value;
  const trimmed = raw?.trim();
  if (!trimmed || trimmed === '[]') return null;

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

interface ManageRentersPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Dedicated SSR route for Manage Renters Details.
 * Resolves to /assets/revenue/manage-renters
 */
export default async function ManageRentersPage({ params, searchParams }: ManageRentersPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
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

  let assetDocuments: AssetDocumentListItem[] = [];
  let assetPhotosAndPlans: AssetDocumentListItem[] = [];
  let leaseRentDocuments: AssetDocumentListItem[] = [];

  if (drawerAssetId) {
    const [docsRes, photosRes, leaseRes] = await Promise.all([
      fetchAssetDocumentsByAsset(drawerAssetId),
      fetchAssetPhotosAndPlansByAsset(drawerAssetId),
      hasLeaseRentDetailsId
        ? getLeaseRentDetailsDocumentsAction(selectedRegistrationId)
        : Promise.resolve({ documents: [] as AssetDocumentListItem[], error: null }),
    ]);

    if (docsRes.error) {
      console.error('Error fetching asset documents:', docsRes.error);
    }
    if (photosRes.error) {
      console.error('Error fetching asset photos/plans:', photosRes.error);
    }
    if (leaseRes.error) {
      console.error('Error fetching lease rent documents:', leaseRes.error);
    }

    assetDocuments = docsRes.documents || [];
    assetPhotosAndPlans = photosRes.documents || [];
    leaseRentDocuments = leaseRes.documents || [];
  }
  const applicationTypes = await getApplicationTypesAction();

  return (
    <div className="space-y-4">
      <LeaseRentRegistration
        key={[
          data.pageNumber,
          data.pageSize,
          data.searchTerm,
          data.fromDate,
          data.toDate,
          data.assetCategoryId ?? '',
          data.assetTypeId ?? '',
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
        assetTypeId={data.assetTypeId}
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
        assetTypeOptions={data.assetTypeOptions}
        zoneOptions={data.zoneOptions}
        wardOptions={data.wardOptions}
        assetOptions={data.assetOptions}
      />
    </div>
  );
}
