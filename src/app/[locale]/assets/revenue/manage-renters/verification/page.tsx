import { LeaseRentRegistration } from '@/components/modules/assets/revenue/LeaseRentRegistration';
import {
  getManageRentersVerificationPageDataAction,
  getManageRentersVerificationDetailsAction,
  getManageRentersAssetDetailsAction,
} from './actions';
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

interface ManageRentersVerificationPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ManageRentersVerificationPage({
  searchParams,
}: ManageRentersVerificationPageProps) {
  const query = await searchParams;
  const data = await getManageRentersVerificationPageDataAction(query);

  const drawerVerificationId = normalizeDrawerId(query.drawerVerificationId);
  const selectedVerification = drawerVerificationId
    ? await getManageRentersVerificationDetailsAction(drawerVerificationId)
    : null;

  const assetId = selectedVerification?.assetId;
  const selectedAsset = assetId ? await getManageRentersAssetDetailsAction(assetId) : null;
  const [assetDocuments, assetPhotosAndPlans, leaseRentDocuments] = assetId
    ? await Promise.all([
        fetchAssetDocumentsByAsset(assetId).then((res) => res.documents).catch(() => []),
        fetchAssetPhotosAndPlansByAsset(assetId).then((res) => res.documents).catch(() => []),
        selectedVerification?.id
          ? getLeaseRentDetailsDocuments(Number(selectedVerification.id)).then((res) => res.documents).catch(() => [])
          : Promise.resolve([]),
      ])
    : [[], [], []];

  const drawerRevertId = normalizeDrawerId(query.drawerRevertId);
  const selectedRevert = drawerRevertId
    ? await getManageRentersVerificationDetailsAction(drawerRevertId)
    : null;

  return (
    <LeaseRentRegistration
      key={[
        data.pageNumber,
        data.pageSize,
        data.searchTerm,
        data.fromDate,
        data.toDate,
        data.assetCategoryId ?? '',
        drawerVerificationId ?? '',
        drawerRevertId ?? '',
      ].join('|')}
      stage="verification"
      pageNumber={data.pageNumber}
      pageSize={data.pageSize}
      totalCount={data.totalCount}
      totalPages={data.totalPages}
      searchTerm={data.searchTerm}
      fromDate={data.fromDate}
      toDate={data.toDate}
      assetCategoryId={data.assetCategoryId}
      verificationRecords={data.records}
      verificationDrawerId={drawerVerificationId}
      selectedVerification={selectedVerification}
      selectedAsset={selectedAsset}
      assetDocuments={[...assetDocuments, ...leaseRentDocuments]}
      assetPhotosAndPlans={assetPhotosAndPlans}
      revertDrawerId={drawerRevertId}
      selectedRevert={selectedRevert}
      categoryOptions={data.categoryOptions}
    />
  );
}
