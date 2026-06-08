import { LeaseRentRegistration } from '@/components/modules/assets/revenue/LeaseRentRegistration';
import {
  getManageRentersVerificationPageDataAction,
  getManageRentersVerificationDetailsAction,
} from './actions';

export const dynamic = 'force-dynamic';

interface ManageRentersVerificationPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ManageRentersVerificationPage({
  searchParams,
}: ManageRentersVerificationPageProps) {
  const query = await searchParams;
  const data = await getManageRentersVerificationPageDataAction(query);
  
  const drawerVerificationIdRaw = query.drawerVerificationId;
  const drawerVerificationId = Array.isArray(drawerVerificationIdRaw) ? drawerVerificationIdRaw[0] : drawerVerificationIdRaw;
  const selectedVerification = drawerVerificationId
    ? await getManageRentersVerificationDetailsAction(drawerVerificationId)
    : null;

  const drawerRevertIdRaw = query.drawerRevertId;
  const drawerRevertId = Array.isArray(drawerRevertIdRaw) ? drawerRevertIdRaw[0] : drawerRevertIdRaw;
  const selectedRevert = drawerRevertId
    ? await getManageRentersVerificationDetailsAction(drawerRevertId)
    : null;

  return (
    <LeaseRentRegistration
      key={[
        data.pageNumber,
        data.pageSize,
        data.searchTerm,
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
      assetCategoryId={data.assetCategoryId}
      verificationRecords={data.records}
      verificationDrawerId={drawerVerificationId ? Number(drawerVerificationId) : null}
      selectedVerification={selectedVerification}
      revertDrawerId={drawerRevertId ? Number(drawerRevertId) : null}
      selectedRevert={selectedRevert}
      categoryOptions={data.categoryOptions}
    />
  );
}
