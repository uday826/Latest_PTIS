import { LeaseRentRegistration } from '@/components/modules/assets/revenue/LeaseRentRegistration';
import {
  getManageRentersApprovalPageDataAction,
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

interface ManageRentersApprovalPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ManageRentersApprovalPage({
  params,
  searchParams,
}: ManageRentersApprovalPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const query = await searchParams;
  const data = await getManageRentersApprovalPageDataAction(query);

  const drawerApprovalId = normalizeDrawerId(query.drawerApprovalId);
  const selectedApproval = drawerApprovalId
    ? await getManageRentersVerificationDetailsAction(drawerApprovalId)
    : null;

  const drawerRejectId = normalizeDrawerId(query.drawerRejectId);
  const selectedRejection = drawerRejectId
    ? await getManageRentersVerificationDetailsAction(drawerRejectId)
    : null;

  const drawerRevertId = normalizeDrawerId(query.drawerRevertId);
  const selectedRevert = drawerRevertId
    ? await getManageRentersVerificationDetailsAction(drawerRevertId)
    : null;

  const assetId = selectedApproval?.assetId || selectedRejection?.assetId || selectedRevert?.assetId;
  const selectedAsset = assetId ? await getManageRentersAssetDetailsAction(assetId) : null;

  let assetPhotosAndPlans: AssetDocumentListItem[] = [];
  let leaseRentDocuments: AssetDocumentListItem[] = [];

  if (assetId) {
    const [photosRes, leaseRes] = await Promise.all([
      fetchAssetPhotosAndPlansByAsset(assetId),
      selectedApproval?.id
        ? getLeaseRentDetailsDocumentsAction(Number(selectedApproval.id))
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
        drawerApprovalId ?? '',
        drawerRejectId ?? '',
        drawerRevertId ?? '',
      ].join('|')}
      stage="approval"
      pageNumber={data.pageNumber}
      pageSize={data.pageSize}
      totalCount={data.totalCount}
      totalPages={data.totalPages}
      searchTerm={data.searchTerm}
      fromDate={data.fromDate}
      toDate={data.toDate}
      assetCategoryId={data.assetCategoryId}
      assetTypeId={data.assetTypeId}
      approvalRecords={data.records}
      approvalDrawerId={drawerApprovalId}
      selectedApproval={selectedApproval}
      selectedAsset={selectedAsset}
      assetDocuments={leaseRentDocuments}
      assetPhotosAndPlans={assetPhotosAndPlans}
      rejectDrawerId={drawerRejectId}
      selectedRejection={selectedRejection}
      revertDrawerId={drawerRevertId}
      selectedRevert={selectedRevert}
      categoryOptions={data.categoryOptions}
      assetTypeOptions={data.assetTypeOptions}
    />
  );
}
