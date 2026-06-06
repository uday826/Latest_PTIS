import { LeaseRentRegistration } from '@/components/modules/assets/revenue/LeaseRentRegistration';
import { getManageRentersApprovalPageDataAction, getManageRentersVerificationDetailsAction } from '../actions';

export const dynamic = 'force-dynamic';

interface ManageRentersApprovalPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ManageRentersApprovalPage({
  searchParams,
}: ManageRentersApprovalPageProps) {
  const query = await searchParams;
  const data = await getManageRentersApprovalPageDataAction(query);

  const drawerApprovalIdRaw = query.drawerApprovalId;
  const drawerApprovalId = Array.isArray(drawerApprovalIdRaw) ? drawerApprovalIdRaw[0] : drawerApprovalIdRaw;
  const selectedApproval = drawerApprovalId
    ? await getManageRentersVerificationDetailsAction(drawerApprovalId)
    : null;

  const drawerRejectIdRaw = query.drawerRejectId;
  const drawerRejectId = Array.isArray(drawerRejectIdRaw) ? drawerRejectIdRaw[0] : drawerRejectIdRaw;
  const selectedRejection = drawerRejectId
    ? await getManageRentersVerificationDetailsAction(drawerRejectId)
    : null;

  return (
    <LeaseRentRegistration
      key={[
        data.pageNumber,
        data.pageSize,
        data.searchTerm,
        data.assetCategoryId ?? '',
        drawerApprovalId ?? '',
        drawerRejectId ?? '',
      ].join('|')}
      stage="approval"
      pageNumber={data.pageNumber}
      pageSize={data.pageSize}
      totalCount={data.totalCount}
      totalPages={data.totalPages}
      searchTerm={data.searchTerm}
      assetCategoryId={data.assetCategoryId}
      approvalRecords={data.records}
      approvalDrawerId={drawerApprovalId ? Number(drawerApprovalId) : null}
      selectedApproval={selectedApproval}
      rejectDrawerId={drawerRejectId ? Number(drawerRejectId) : null}
      selectedRejection={selectedRejection}
      categoryOptions={data.categoryOptions}
    />
  );
}
