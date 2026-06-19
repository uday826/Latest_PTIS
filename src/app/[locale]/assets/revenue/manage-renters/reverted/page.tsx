import { LeaseRentRegistration } from '@/components/modules/assets/revenue/LeaseRentRegistration';
import {
  getManageRentersAssetDetailsAction,
  getManageRentersRevertedPageDataAction,
  getApplicationTypesAction,
  getManageRentersVerificationDetailsAction,
  getLeaseRentDetailsDocumentsAction,
} from './action';
import { fetchAssetPhotosAndPlansByAsset } from '@/app/[locale]/assets/municipal-Asset/asset-detail/actions';
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

interface ManageRentersRevertedPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

import type { LeaseRentRecord } from '@/types/asset/revenue.types';

export default async function ManageRentersRevertedPage({
  params,
  searchParams,
}: ManageRentersRevertedPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const query = await searchParams;
  const data = await getManageRentersRevertedPageDataAction(query);
  const drawerAssetId = normalizeDrawerId(query.drawerAssetId);
  const selectedRegistration = drawerAssetId
    ? data.records.find((record: LeaseRentRecord) => record.assetMasterId === drawerAssetId) ?? null
    : null;

  const drawerRevertId = normalizeDrawerId(query.drawerRevertId);
  const selectedRevert = drawerRevertId
    ? await getManageRentersVerificationDetailsAction(drawerRevertId)
    : null;

  const assetId = drawerAssetId || selectedRevert?.assetId;
  const selectedAsset = assetId ? await getManageRentersAssetDetailsAction(assetId) : null;
  const selectedRegistrationId = Number(selectedRegistration?.id);
  const hasLeaseRentDetailsId = Number.isFinite(selectedRegistrationId) && selectedRegistrationId > 0;

  let assetPhotosAndPlans: AssetDocumentListItem[] = [];
  let leaseRentDocuments: AssetDocumentListItem[] = [];

  if (assetId) {
    const [photosRes, leaseRes] = await Promise.all([
      fetchAssetPhotosAndPlansByAsset(assetId),
      hasLeaseRentDetailsId
        ? getLeaseRentDetailsDocumentsAction(selectedRegistrationId)
        : Promise.resolve({ documents: [] as AssetDocumentListItem[], error: null }),
    ]);

    if (photosRes.error) {
      console.error('Error fetching asset photos/plans:', photosRes.error);
    }
    if (leaseRes.error) {
      console.error('Error fetching lease rent documents:', leaseRes.error);
    }

    assetPhotosAndPlans = photosRes.documents || [];
    leaseRentDocuments = leaseRes.documents || [];
  }

  const applicationTypes = await getApplicationTypesAction();

  return (
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
        drawerRevertId ?? '',
      ].join('|')}
      stage="reverted"
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
      leaseRentDocuments={leaseRentDocuments}
      assetPhotosAndPlans={assetPhotosAndPlans}
      applicationTypes={applicationTypes}
      revertDrawerId={drawerRevertId}
      selectedRevert={selectedRevert}
      initialRecords={data.records}
      categoryOptions={data.categoryOptions}
      assetTypeOptions={data.assetTypeOptions}
      zoneOptions={data.zoneOptions}
      wardOptions={data.wardOptions}
      assetOptions={data.assetOptions}
    />
  );
}
