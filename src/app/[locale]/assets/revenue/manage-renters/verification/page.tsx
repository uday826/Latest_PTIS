import { LeaseRentRegistration } from '@/components/modules/assets/revenue/LeaseRentRegistration';
import {
  getManageRentersVerificationPageDataAction,
  getManageRentersVerificationDetailsAction,
  getManageRentersAssetDetailsAction,
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

interface ManageRentersVerificationPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ManageRentersVerificationPage({
  params,
  searchParams,
}: ManageRentersVerificationPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const query = await searchParams;
  const data = await getManageRentersVerificationPageDataAction(query);

  const drawerVerificationId = normalizeDrawerId(query.drawerVerificationId);
  const selectedVerification = drawerVerificationId
    ? await getManageRentersVerificationDetailsAction(drawerVerificationId)
    : null;

  const assetId = selectedVerification?.assetId;
  const selectedAsset = assetId ? await getManageRentersAssetDetailsAction(assetId) : null;

  let assetPhotosAndPlans: AssetDocumentListItem[] = [];
  let leaseRentDocuments: AssetDocumentListItem[] = [];

  if (assetId) {
    const [photosRes, leaseRes] = await Promise.all([
      fetchAssetPhotosAndPlansByAsset(assetId),
      selectedVerification?.id
        ? getLeaseRentDetailsDocumentsAction(Number(selectedVerification.id))
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
        data.assetTypeId ?? '',
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
      assetTypeId={data.assetTypeId}
      verificationRecords={data.records}
      verificationDrawerId={drawerVerificationId}
      selectedVerification={selectedVerification}
      selectedAsset={selectedAsset}
      assetDocuments={leaseRentDocuments}
      assetPhotosAndPlans={assetPhotosAndPlans}
      revertDrawerId={drawerRevertId}
      selectedRevert={selectedRevert}
      categoryOptions={data.categoryOptions}
      assetTypeOptions={data.assetTypeOptions}
    />
  );
}
