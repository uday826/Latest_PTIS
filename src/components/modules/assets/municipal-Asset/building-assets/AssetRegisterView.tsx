import { getTranslations } from 'next-intl/server';
import { Building2Icon } from 'lucide-react';
import { Card, CardContent, DashboardCard } from '@/components/common';
import { mapAssetToRow } from '@/components/modules/assets/municipal-Asset/building-assets/registerMappers';
import type { AssetRegisterApiRecord } from '@/components/modules/assets/municipal-Asset/building-assets/registerMappers';
import { AssetRegisterBackButton } from '@/components/modules/assets/municipal-Asset/building-assets/AssetRegisterBackButton';
import { AssetRegisterFilters } from '@/components/modules/assets/municipal-Asset/building-assets/AssetRegisterFilters';
import { AssetRegisterTable } from '@/components/modules/assets/municipal-Asset/building-assets/AssetRegisterTable';
import type { AssetRegisterViewProps } from '@/types/asset-types/asset-register.types';

export async function AssetRegisterView({
  categoryId,
  categoryName,
  safeSearch,
  safeAssetTypeId,
  safeZoneId,
  finalWardId,
  safePageSize,
  finalPage,
  totalPages,
  assetsResult,
  typesResult,
  zonesResult,
  wardsResult,
  updatedDate,
}: AssetRegisterViewProps) {
  const t = await getTranslations('assetRegister');

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

  const resolvedCategoryName = categoryName || (t('Asset_Register') || 'Asset Register');
  const registerSubtitle = categoryName
    ? `${t('Register_of') || 'Register of'} ${resolvedCategoryName}`
    : (t('Private_municipal_asset_register') || 'Private municipal asset register');

  return (
    <div className="flex h-[calc(100vh-140px)] overflow-hidden">
      <div className="flex-1 p-2 bg-slate-50/50 overflow-y-auto custom-scrollbar">
        <div className="mx-auto w-full max-w-[99%]">
          <div className="min-h-[calc(100vh-120px)] bg-slate-50/80 p-2 font-sans">
            <div className="mx-auto flex w-full max-w-437.5 flex-col gap-2.5">
              <Card variant="elevated" className="overflow-hidden border-0 bg-white shadow-sm">
                <div className="bg-[#0e315d] text-white px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <AssetRegisterBackButton />
                    <div>
                      <h1 className="text-[20px] font-extrabold leading-none">{resolvedCategoryName}</h1>
                    </div>
                  </div>
                </div>

                <CardContent className="border border-slate-200 p-0">
                  <div className="border-b border-slate-200 px-4 py-3 text-center">
                    <div className="inline-flex items-center gap-2 text-slate-900">
                      <Building2Icon className="h-4 w-4" />
                      <h2 className="text-[15px] font-extrabold uppercase tracking-tight">{t('MUNICIPAL_CORPORATION_ASSET_REGISTER')}</h2>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-600">
                      {registerSubtitle} | {t('Generated_On') || 'Generated On'}: {updatedDate}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-2 px-4 py-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
                    <DashboardCard
                      label={t('Total_Assets') || 'Total Assets'}
                      value={assetsResult.totalCount}
                      className="min-h-19.5"
                    />
                    <DashboardCard
                      label={t('Purchase_Value') || 'Purchase Value'}
                      value={`₹${(assetsResult.totalPurchaseValue ?? 0).toLocaleString('en-IN')}`}
                      className="min-h-19.5"
                    />
                    <DashboardCard
                      label={t('Current_Value') || 'Current Value'}
                      value={`₹${(assetsResult.totalMarketValue ?? 0).toLocaleString('en-IN')}`}
                      className="min-h-19.5"
                    />
                    <DashboardCard
                      label={t('Depreciation') || 'Depreciation'}
                      value={`₹${(assetsResult.totalDepreciation ?? 0).toLocaleString('en-IN')}`}
                      valueColor="text-red-600"
                      className="min-h-19.5"
                    />
                    <DashboardCard
                      label={t('Net_Book_Value') || 'Net Book Value'}
                      value={`₹${(assetsResult.netBookValue ?? 0).toLocaleString('en-IN')}`}
                      valueColor="text-emerald-600"
                      className="min-h-19.5"
                    />
                    <DashboardCard
                      label={t('Active_Assets') || 'Active Assets'}
                      value={assetsResult.activeAssetsCount ?? 0}
                      valueColor="text-blue-600"
                      className="min-h-19.5"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card
                variant="bordered"
                padding="none"
                className="relative z-30 overflow-visible border-slate-200/80 bg-white shadow-[0_12px_32px_rgba(15,23,42,0.06)]"
              >
                <CardContent className="flex flex-col gap-3 overflow-visible px-4 py-4">
                  <AssetRegisterFilters
                    categoryId={categoryId}
                    initialCategoryName={categoryName || ''}
                    search={safeSearch}
                    assetTypeId={safeAssetTypeId}
                    zoneId={safeZoneId}
                    wardId={finalWardId}
                    assetTypeOptions={assetTypeOptions}
                    zoneOptions={zoneOptions}
                    wardOptions={wardOptions}
                    totalCount={assetsResult.totalCount}
                    pageSize={safePageSize}
                    assets={assetsResult.items}
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
        </div>
      </div>
    </div>
  );
}
