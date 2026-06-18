import type {
  AssetRegisterOption,
  AssetRegisterWardOption,
  AssetRegisterApiRecord,
  AssetRegisterPageResult,
} from "@/types/municipal-asset-service.types";

export type AssetRegisterRow = {
  id: number | null;
  assetId: string;
  authorityName: string;
  organizationName: string;
  departmentName: string;
  assetCode: string;
  assetName: string;
  categoryName: string;
  assetTypeName: string;
  parentAssetName: string;
  address: string;
  wardName: string;
  zoneName: string;
  latitude: string;
  longitude: string;
  csn: string;
  hasLift: string;
  purchaseDate: string;
  marketValueDate: string;
  capitalValue: string;
  lastCVCalculationDate: string;
  currentBookValue: string;
  depreciation: string;
  netBookValue: string;
  lifeYears: string;
  depreciationRate: string;
  isRevenueGenerating: string;
  operationalControl: string;
  fieldValues: string;
  occupancyStatus: string;
  ownershipType: string;
  assetCondition: string;
  status: string;
  purchaseValue: string;
  marketValue: string;
  builtUpAreaSqMeter: string;
  carpetAreaSqMeter: string;
  landAreaSqMeter: string;
  createdDate: string;
  assetCategoryId: number | null;
  assetTypeId: number | null;
};

export interface AssetRegisterViewProps {
  locale: string;
  categoryId: number;
  categoryName: string | null;
  safeSearch: string;
  safeAssetTypeId: string;
  safeZoneId: string;
  finalWardId: string;
  safeOwningDepartmentId: string;
  safePageSize: number;
  finalPage: number;
  totalPages: number;
  assetsResult: AssetRegisterPageResult;
  typesResult: AssetRegisterOption[];
  zonesResult: AssetRegisterOption[];
  wardsResult: AssetRegisterWardOption[];
  departmentsResult: AssetRegisterOption[];
  updatedDate: string;
}

export interface AssetRegisterTableProps {
  assets: AssetRegisterRow[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface AssetRegisterFiltersProps {
  search: string;
  assetTypeId: string;
  zoneId: string;
  wardId: string;
  owningDepartmentId: string;
  assetTypeOptions: { label: string; value: string }[];
  zoneOptions: { label: string; value: string }[];
  wardOptions: { label: string; value: string }[];
  owningDepartmentOptions: { label: string; value: string }[];
}

export interface AssetRegisterExportButtonProps {
  categoryId: number;
  search: string;
  assetTypeId: string;
  zoneId: string;
  wardId: string;
  totalCount: number;
  pageSize: number;
  assets: AssetRegisterApiRecord[];
}

export interface AssetRegisterHeaderSummaryProps {
  registerSubtitle: string;
  updatedDate: string;
  totalCount: number;
  totalPurchaseValue: number;
  totalMarketValue: number;
  totalDepreciation: number;
  netBookValue: number;
  totalCapitalValue: number;
  activeAssetsCount: number;
  translate: (key: string) => string;
}

export interface AssetRegisterControlsProps {
  categoryId: number;
  categoryName: string;
  search: string;
  assetTypeId: string;
  zoneId: string;
  wardId: string;
  owningDepartmentId: string;
  totalCount: number;
  pageSize: number;
  assets: AssetRegisterApiRecord[];
  assetTypeOptions: { label: string; value: string }[];
  zoneOptions: { label: string; value: string }[];
  wardOptions: { label: string; value: string }[];
  owningDepartmentOptions: { label: string; value: string }[];
}
