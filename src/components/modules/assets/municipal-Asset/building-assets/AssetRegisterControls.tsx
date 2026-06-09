import { AssetRegisterFilters } from '@/components/modules/assets/municipal-Asset/building-assets/AssetRegisterFilters';
import { AssetRegisterExportButton } from '@/components/modules/assets/municipal-Asset/building-assets/AssetRegisterExportButton';
import type { AssetRegisterControlsProps } from '@/types/asset-types/asset-register.types';

export function AssetRegisterControls({
  categoryId,
  categoryName,
  search,
  assetTypeId,
  zoneId,
  wardId,
  totalCount,
  pageSize,
  assets,
  assetTypeOptions,
  zoneOptions,
  wardOptions,
}: AssetRegisterControlsProps) {
  return (
    <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
      <AssetRegisterFilters
        search={search}
        assetTypeId={assetTypeId}
        zoneId={zoneId}
        wardId={wardId}
        assetTypeOptions={assetTypeOptions}
        zoneOptions={zoneOptions}
        wardOptions={wardOptions}
      />
      <AssetRegisterExportButton
        categoryId={categoryId}
        categoryName={categoryName}
        search={search}
        assetTypeId={assetTypeId}
        zoneId={zoneId}
        wardId={wardId}
        totalCount={totalCount}
        pageSize={pageSize}
        assets={assets}
      />
    </div>
  );
}
