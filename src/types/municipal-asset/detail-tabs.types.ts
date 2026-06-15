import type { InventoryBatchListResponse } from './furniture-fixtures.types';

export type AssetDetailRecord = {
  id: number;
  assetNo?: string;
  assetName?: string;
  assetCategoryId?: number | string | null;
  assetTypeId?: number | string | null;
  assetTypeName?: string;
  assetCategoryName?: string;
  parentAssetId?: number | string | null;
  parentAssetName?: string | null;
  hierarchyLevel?: number | string | null;
  zoneName?: string;
  wardName?: string;
  csn?: string;
  purchaseValue?: number | string | null;
  marketValue?: number | string | null;
  address?: string;
  ownershipType?: string;
  status?: string;
  isActive?: boolean | null;
  assetCondition?: string | null;
  occupancyStatus?: string | null;
  operationalControl?: string | null;
  currentBookValue?: number | string | null;
  capitalValue?: number | string | null;
  depreciationRate?: number | string | null;
  purchaseDate?: string | null;
  marketValueDate?: string | null;
  lastCVCalculationDate?: string | null;
  createdDate?: string | null;
  updatedDate?: string | null;
  hasLift?: boolean | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
  authorityId?: number | string | null;
  landAreaSqMeter?: number | string | null;
  builtUpAreaSqMeter?: number | string | null;
  carpetAreaSqMeter?: number | string | null;
  fieldValues?: Array<{
    id?: number | string;
    fieldDefinitionId?: number | string | null;
    fieldName?: string;
    textValue?: string | null;
    numberValue?: number | null;
    dateValue?: string | null;
    booleanValue?: boolean | null;
  }> | null;
  fieldDefinitions?: AssetFieldDefinitionItem[];
  fieldDefinitionsError?: string | null;
  floorSummary?: AssetFloorSummary | null;
  floorSummaryError?: string | null;
  childAssets?: AssetChildAssetItem[];
  childAssetsError?: string | null;
  documents?: AssetDocumentListItem[];
  documentsError?: string | null;
  inventoryData?: InventoryBatchListResponse | null;
  inventoryError?: string | null;
};

export type AssetDetailTabKey =
  | 'overview'
  | 'floor-details'
  | 'legal-planning'
  | 'valuation'
  | 'documents'
  | 'sub-units'
  | 'furniture-fixtures';

export type AssetDetailTabConfig = {
  key: AssetDetailTabKey;
  label: string;
};

export type AssetFieldDefinitionItem = {
  id: number | string;
  fieldName: string;
  fieldLabel?: string | null;
  fieldType?: string | null;
  fieldGroup?: string | null;
  displayOrder?: number | string | null;
};

export type AssetFloorDetailItem = {
  id: number | string;
  assetId?: number | string | null;
  floorId?: number | string | null;
  floorName?: string | null;
  subFloorName?: string | null;
  constructionYear?: string | null;
  assessmentYear?: string | null;
  constructionTypeName?: string | null;
  typeOfUseName?: string | null;
  subTypeOfUseName?: string | null;
  carpetAreaSqMeter?: number | string | null;
  carpetAreaSqFeet?: number | string | null;
  builtUpAreaSqMeter?: number | string | null;
  builtUpAreaSqFeet?: number | string | null;
  noOfRooms?: number | string | null;
  subAssetCount?: number | string | null;
  baseValue?: number | string | null;
  capitalValue?: number | string | null;
  marketValue?: number | string | null;
};

export type AssetFloorSummary = {
  floorDetails: AssetFloorDetailItem[];
  totalBaseValue?: number | string | null;
  totalCapitalValue?: number | string | null;
  totalMarketValue?: number | string | null;
  totalFloors?: number | string | null;
};

export type AssetChildAssetItem = {
  id: number | string;
  authorityId?: number | string | null;
  organizationId?: number | string | null;
  departmentId?: number | string | null;
  assetId?: number | string | null;
  inventoryBatchId?: number | string | null;
  assetNo?: string | null;
  assetName?: string | null;
  assetCategoryId?: number | string | null;
  assetTypeId?: number | string | null;
  assetTypeName?: string | null;
  assetCategoryName?: string | null;
  parentAssetId?: number | string | null;
  parentAssetName?: string | null;
  hierarchyLevel?: number | string | null;
  hierarchyPath?: string | null;
  address?: string | null;
  wardId?: number | string | null;
  zoneId?: number | string | null;
  subZoneId?: number | string | null;
  moujaId?: number | string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
  csn?: string | null;
  typeOfUseId?: number | string | null;
  subTypeOfUseId?: number | string | null;
  complexName?: string | null;
  shopUnitName?: string | null;
  unitNo?: string | null;
  totalAreaSqFt?: number | string | null;
  landAreaSqMeter?: number | string | null;
  calculatedCapitalValue?: number | string | null;
  purchaseValue?: number | string | null;
  purchaseDate?: string | null;
  marketValue?: number | string | null;
  marketValueDate?: string | null;
  capitalValue?: number | string | null;
  lastCVCalculationDate?: string | null;
  currentBookValue?: number | string | null;
  depreciationRate?: number | string | null;
  ownershipType?: string | null;
  isRevenueGenerating?: boolean | null;
  operationalControl?: string | null;
  assetCondition?: string | null;
  createdDate?: string | null;
  floorDetailsId?: number | string | null;
  updatedDate?: string | null;
  authorityName?: string | null;
  organizationName?: string | null;
  departmentName?: string | null;
  moujaName?: string | null;
  typeOfUseName?: string | null;
  subTypeOfUseName?: string | null;
  fieldValues?: unknown[] | null;
  hasLift?: boolean | null;
  wardName?: string | null;
  zoneName?: string | null;
  builtUpAreaSqMeter?: number | string | null;
  carpetAreaSqMeter?: number | string | null;
  status?: string | null;
  occupancyStatus?: string | null;
  isActive?: boolean | null;
  renterName?: string | null;
  gstNo?: string | null;
  aadhaarCardNo?: string | null;
  panCardNo?: string | null;
  mobileNo?: string | null;
  emailId?: string | null;
  leaseRentType?: string | null;
  fromDate?: string | null;
  toDate?: string | null;
  duration?: number | string | null;
  rentFrequency?: string | null;
  rentAmount?: number | string | null;
  securityDeposit?: number | string | null;
  depositType?: string | null;
  agreementId?: string | null;
  incrementFrequency?: string | null;
  incrementType?: string | null;
  incrementValue?: number | string | null;
  incrementMethod?: string | null;
  increment?: number | string | null;
  incrementStatus?: boolean | null;
  rentMonthly?: number | string | null;
  // Nested raw arrays from the sub-assets API response
  renterDetails?: Array<{
    id?: number | string | null;
    renterName?: string | null;
    gstNo?: string | null;
    aadhaarCardNo?: string | null;
    panCardNo?: string | null;
    mobileNo?: string | null;
    emailId?: string | null;
    leaseRentType?: string | null;
    fromDate?: string | null;
    toDate?: string | null;
    duration?: number | string | null;
    rentFrequency?: string | null;
    rentAmount?: number | string | null;
    securityDeposit?: number | string | null;
    depositType?: string | null;
    agreementId?: string | null;
    totalAreaSqFt?: number | string | null;
    incrementFrequency?: string | null;
    incrementType?: string | null;
    incrementValue?: number | string | null;
    incrementMethod?: string | null;
    increment?: number | string | null;
    incrementStatus?: boolean | null;
    rentMonthly?: number | string | null;
  }> | null;
  roomWiseSubmissions?: Array<{
    id?: number | string | null;
    roomNo?: string | null;
    roomType?: string | null;
    shape?: string | null;
    submissionType?: string | null;
    lengthMtr?: number | string | null;
    widthMtr?: number | string | null;
    heightMtr?: number | string | null;
    noOfRooms?: number | string | null;
    outerYesNo?: boolean | null;
    minusYesNo?: boolean | null;
  }> | null;
  floorDetails?: Array<{
    id?: number | string | null;
    floorName?: string | null;
    subFloorName?: string | null;
    constructionYear?: string | null;
    constructionTypeName?: string | null;
    typeOfUseName?: string | null;
    subTypeOfUseName?: string | null;
    carpetAreaSqMeter?: number | string | null;
    carpetAreaSqFeet?: number | string | null;
    builtUpAreaSqMeter?: number | string | null;
    builtUpAreaSqFeet?: number | string | null;
    noOfRooms?: number | string | null;
    capitalValue?: number | string | null;
    marketValue?: number | string | null;
  }> | null;
};

export type AssetDocumentListItem = {
  id: number | string;
  documentId?: number | string | null;
  assetId?: number | string | null;
  name: string;
  fileName: string;
  contentType?: string | null;
  uploadedDate?: string | null;
  fileSize?: number | string | null;
  status?: string | null;
};
