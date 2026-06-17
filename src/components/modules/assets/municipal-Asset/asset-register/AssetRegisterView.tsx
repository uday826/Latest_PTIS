import { getTranslations } from 'next-intl/server';
import { Card, CardContent } from '@/components/common';
import { mapAssetToRow } from '@/components/modules/assets/municipal-Asset/asset-register/registerMappers';
import type { AssetRegisterViewProps } from '@/types/municipal-asset-register.types';
import type { AssetRegisterApiRecord } from '@/types/municipal-asset-service.types';
import { AssetRegisterBackButton } from './AssetRegisterBackButton';
import { AssetRegisterControls } from './AssetRegisterControls';
import { AssetRegisterHeaderSummary } from './AssetRegisterHeaderSummary';
import { AssetRegisterTable } from './AssetRegisterTable';

export async function AssetRegisterView({
  locale,
  categoryId,
  categoryName,
  safeSearch,
  safeAssetTypeId,
  safeZoneId,
  finalWardId,
  safeOwningDepartmentId,
  safePageSize,
  finalPage,
  totalPages,
  assetsResult,
  typesResult,
  zonesResult,
  wardsResult,
  departmentsResult,
  updatedDate,
}: AssetRegisterViewProps) {
  const t = await getTranslations({ locale, namespace: 'assetRegister' });

  const mappedAssets = assetsResult.items.map((item: AssetRegisterApiRecord) =>
    mapAssetToRow(item, categoryName || 'Asset Register')
  );

  const assetTypeOptions = [
    { label: t('All_Asset_Types') || 'All Asset Types', value: 'all' },
    ...typesResult.map((type) => ({ label: type.label, value: String(type.id) })),
  ];

  const zoneOptions = [
    { label: t('All_Zones') || 'All Zones', value: 'all' },
    ...zonesResult.map((zone) => ({ label: zone.label, value: String(zone.id) })),
  ];

  const wardOptions = [
    { label: t('All_Wards') || 'All Wards', value: 'all' },
    ...wardsResult
      .filter((ward) => safeZoneId === 'all' || ward.zoneId == null || String(ward.zoneId) === safeZoneId)
      .map((ward) => ({ label: ward.label, value: String(ward.id) })),
  ];

  const owningDepartmentOptions = [
    { label: t('All_Departments') || 'All Departments', value: 'all' },
    ...departmentsResult.map((dept) => ({ label: dept.label, value: String(dept.id) })),
  ];

  const resolvedCategoryName = categoryName || (t('Asset_Register') || 'Asset Register');
  const registerSubtitle = categoryName
    ? `${t('Register_of') || 'Register of'} ${resolvedCategoryName}`
    : (t('Private_municipal_asset_register') || 'Private municipal asset register');

  return (
    <div className="min-h-[calc(100vh-120px)] bg-slate-50/80 p-2 font-sans">
      <div className="mx-auto flex w-full max-w-437.5 flex-col gap-2.5">
        <Card variant="elevated" className="overflow-hidden border-0 bg-white shadow-sm">
          <div className="bg-[#0e315d] px-4 py-3 text-white">
            <div className="flex items-center gap-2.5">
              <AssetRegisterBackButton />
              <div>
                <h1 className="text-[20px] font-extrabold leading-none">{resolvedCategoryName}</h1>
              </div>
            </div>
          </div>

          <AssetRegisterHeaderSummary
            registerSubtitle={registerSubtitle}
            updatedDate={updatedDate}
            totalCount={assetsResult.totalCount}
            totalPurchaseValue={assetsResult.totalPurchaseValue ?? 0}
            totalMarketValue={assetsResult.totalMarketValue ?? 0}
            totalDepreciation={assetsResult.totalDepreciation ?? 0}
            netBookValue={assetsResult.netBookValue ?? 0}
            activeAssetsCount={assetsResult.activeAssetsCount ?? 0}
            translate={t}
          />
        </Card>

        <Card
          variant="bordered"
          padding="none"
          className="relative z-30 overflow-visible border-slate-200/80 bg-white shadow-[0_12px_32px_rgba(15,23,42,0.06)]"
        >
          <CardContent className="flex flex-col gap-3 overflow-visible px-4 py-4">
            <AssetRegisterControls
              categoryId={categoryId}
              categoryName={resolvedCategoryName}
              search={safeSearch}
              assetTypeId={safeAssetTypeId}
              zoneId={safeZoneId}
              wardId={finalWardId}
              owningDepartmentId={safeOwningDepartmentId}
              totalCount={assetsResult.totalCount}
              pageSize={safePageSize}
              assets={assetsResult.items}
              assetTypeOptions={assetTypeOptions}
              zoneOptions={zoneOptions}
              wardOptions={wardOptions}
              owningDepartmentOptions={owningDepartmentOptions}
            />
          </CardContent>
        </Card>

        <AssetRegisterTable
          assets={mappedAssets}
          totalCount={assetsResult.totalCount}
          pageNumber={finalPage}
          pageSize={safePageSize}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
