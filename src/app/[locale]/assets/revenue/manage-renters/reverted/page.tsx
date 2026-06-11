import { LeaseRentRegistration } from '@/components/modules/assets/revenue/LeaseRentRegistration';
import {
  getManageRentersAssetDetailsAction,
  getManageRentersRevertedPageDataAction,
  getApplicationTypesAction,
  getManageRentersVerificationDetailsAction,
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

interface ManageRentersRevertedPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ManageRentersRevertedPage({
  searchParams,
}: ManageRentersRevertedPageProps) {
  const query = await searchParams;
  const data = await getManageRentersRevertedPageDataAction(query);
  const drawerAssetId = normalizeDrawerId(query.drawerAssetId);
  const selectedRegistration = drawerAssetId
    ? data.records.find((record) => record.assetMasterId === drawerAssetId) ?? null
    : null;

  const drawerRevertId = normalizeDrawerId(query.drawerRevertId);
  const selectedRevert = drawerRevertId
    ? await getManageRentersVerificationDetailsAction(drawerRevertId)
    : null;

  const assetId = drawerAssetId || selectedRevert?.assetId;
  const selectedAsset = assetId ? await getManageRentersAssetDetailsAction(assetId) : null;
  const [assetDocuments, assetPhotosAndPlans] = assetId
    ? await Promise.all([
        fetchAssetDocumentsByAsset(assetId).then((res) => res.documents).catch(() => []),
        fetchAssetPhotosAndPlansByAsset(assetId).then((res) => res.documents).catch(() => []),
      ])
    : [[], []];

  const applicationTypes = await getApplicationTypesAction();

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
      drawerAssetId={drawerAssetId}
      selectedRegistration={selectedRegistration}
      selectedAsset={selectedAsset}
      assetDocuments={assetDocuments}
      assetPhotosAndPlans={assetPhotosAndPlans}
      applicationTypes={applicationTypes}
      revertDrawerId={drawerRevertId}
      selectedRevert={selectedRevert}
      initialRecords={data.records}
      categoryOptions={data.categoryOptions}
      zoneOptions={data.zoneOptions}
      wardOptions={data.wardOptions}
      assetOptions={data.assetOptions}
    />
  );
}
