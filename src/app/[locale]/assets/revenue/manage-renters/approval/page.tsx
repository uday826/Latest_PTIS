import { LeaseRentRegistration } from '@/components/modules/assets/revenue/LeaseRentRegistration';
import {
  getManageRentersApprovalPageDataAction,
  getManageRentersVerificationDetailsAction,
  getManageRentersAssetDetailsAction,
} from './actions';
import { fetchAssetDocumentsByAsset, fetchAssetPhotosAndPlansByAsset } from '@/app/[locale]/assets/municipal-Asset/asset-detail/actions';

export const dynamic = 'force-dynamic';

function normalizeDrawerId(value: string | string[] | undefined): number | null {
  const raw = Array.isArray(value) ? value[0] : value;
  const trimmed = raw?.trim();
  if (!trimmed || trimmed === '[]') return null;

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

interface ManageRentersApprovalPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ManageRentersApprovalPage({
  searchParams,
}: ManageRentersApprovalPageProps) {
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
  const [assetDocuments, assetPhotosAndPlans] = assetId
    ? await Promise.all([
        fetchAssetDocumentsByAsset(assetId).then((res) => res.documents).catch(() => []),
        fetchAssetPhotosAndPlansByAsset(assetId).then((res) => res.documents).catch(() => []),
      ])
    : [[], []];

  return (
    <LeaseRentRegistration
      key={[
        data.pageNumber,
        data.pageSize,
        data.searchTerm,
        data.assetCategoryId ?? '',
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
      assetCategoryId={data.assetCategoryId}
      approvalRecords={data.records}
      approvalDrawerId={drawerApprovalId}
      selectedApproval={selectedApproval}
      selectedAsset={selectedAsset}
      assetDocuments={assetDocuments}
      assetPhotosAndPlans={assetPhotosAndPlans}
      rejectDrawerId={drawerRejectId}
      selectedRejection={selectedRejection}
      revertDrawerId={drawerRevertId}
      selectedRevert={selectedRevert}
      categoryOptions={data.categoryOptions}
    />
  );
}
