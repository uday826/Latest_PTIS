import { LeaseRentRegistration } from '@/components/modules/assets/revenue/LeaseRentRegistration';
import {
  getManageRentersApprovalPageDataAction,
  getManageRentersVerificationDetailsAction,
  getManageRentersAssetDetailsAction,
} from './actions';
import { fetchAssetPhotosAndPlansByAsset } from '@/app/[locale]/assets/municipal-Asset/asset-detail/actions';
import { getLeaseRentDetailsDocuments } from '@/lib/api/asset/asset-lease-rent-details-document.server.service';

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
  const [assetPhotosAndPlans, leaseRentDocuments] = assetId
    ? await Promise.all([
        fetchAssetPhotosAndPlansByAsset(assetId).then((res) => res.documents).catch(() => []),
        selectedApproval?.id
          ? getLeaseRentDetailsDocuments(Number(selectedApproval.id)).then((res) => res.documents).catch(() => [])
          : Promise.resolve([]),
      ])
    : [[], []];

  return (
    <LeaseRentRegistration
      key={[
        data.pageNumber,
        data.pageSize,
        data.searchTerm,
        data.fromDate,
        data.toDate,
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
      fromDate={data.fromDate}
      toDate={data.toDate}
      assetCategoryId={data.assetCategoryId}
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
    />
  );
}
