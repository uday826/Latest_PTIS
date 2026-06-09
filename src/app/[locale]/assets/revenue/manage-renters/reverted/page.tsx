import { LeaseRentRegistration } from '@/components/modules/assets/revenue/LeaseRentRegistration';
import {
  getManageRentersAssetDetailsAction,
  getManageRentersRevertedPageDataAction,
  getApplicationTypesAction,
  getManageRentersVerificationDetailsAction,
} from './actions';
import { fetchAssetDocumentsByAsset } from '@/app/[locale]/assets/municipal-Asset/asset-detail/actions';

export const dynamic = 'force-dynamic';

interface ManageRentersRevertedPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ManageRentersRevertedPage({
  searchParams,
}: ManageRentersRevertedPageProps) {
  const query = await searchParams;
  const data = await getManageRentersRevertedPageDataAction(query);
  const drawerAssetIdRaw = query.drawerAssetId;
  const drawerAssetId = Array.isArray(drawerAssetIdRaw) ? drawerAssetIdRaw[0] : drawerAssetIdRaw;
  const selectedRegistration = drawerAssetId
    ? data.records.find((record) => record.assetMasterId === Number(drawerAssetId)) ?? null
    : null;
  const selectedAsset = drawerAssetId ? await getManageRentersAssetDetailsAction(drawerAssetId) : null;
  const assetDocuments = drawerAssetId ? (await fetchAssetDocumentsByAsset(drawerAssetId)).documents : [];
  const applicationTypes = await getApplicationTypesAction();

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
      assetCategoryId={data.assetCategoryId}
      zoneId={data.zoneId}
      wardId={data.wardId}
      assetId={data.assetId}
      drawerAssetId={drawerAssetId ? Number(drawerAssetId) : null}
      selectedRegistration={selectedRegistration}
      selectedAsset={selectedAsset}
      assetDocuments={assetDocuments}
      applicationTypes={applicationTypes}
      revertDrawerId={drawerRevertId ? Number(drawerRevertId) : null}
      selectedRevert={selectedRevert}
      initialRecords={data.records}
      categoryOptions={data.categoryOptions}
      zoneOptions={data.zoneOptions}
      wardOptions={data.wardOptions}
      assetOptions={data.assetOptions}
    />
  );
}
