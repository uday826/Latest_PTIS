import { AssetRegisterFilters } from '@/components/modules/assets/municipal-Asset/asset-register/AssetRegisterFilters';
import { AssetRegisterExportButton } from '@/components/modules/assets/municipal-Asset/asset-register/AssetRegisterExportButton';
import type { AssetRegisterControlsProps } from '@/types/municipal-asset-register.types';

export function AssetRegisterControls({
  categoryId,
  search,
  assetTypeId,
  zoneId,
  wardId,
  owningDepartmentId,
  totalCount,
  pageSize,
  assets,
  assetTypeOptions,
  zoneOptions,
  wardOptions,
  owningDepartmentOptions,
  categoryOptions,
}: AssetRegisterControlsProps) {
  return (
    <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between w-full">
      <div className="flex-1 w-full">
        <AssetRegisterFilters
          search={search}
          assetTypeId={assetTypeId}
          zoneId={zoneId}
          wardId={wardId}
          owningDepartmentId={owningDepartmentId}
          assetTypeOptions={assetTypeOptions}
          zoneOptions={zoneOptions}
          wardOptions={wardOptions}
          owningDepartmentOptions={owningDepartmentOptions}
          categoryId={categoryId}
          categoryOptions={categoryOptions}
        />
      </div>
      <div className="flex-shrink-0">
        <AssetRegisterExportButton
          categoryId={categoryId}
          search={search}
          assetTypeId={assetTypeId}
          zoneId={zoneId}
          wardId={wardId}
          totalCount={totalCount}
          pageSize={pageSize}
          assets={assets}
        />
      </div>
    </div>
  );
}
