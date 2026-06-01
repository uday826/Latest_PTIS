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
  inventoryData?: import('./furniture-fixtures.types').InventoryBatchListResponse | null;
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
  assetNo?: string | null;
  assetName?: string | null;
  assetTypeName?: string | null;
  parentAssetId?: number | string | null;
  hierarchyLevel?: number | string | null;
  wardName?: string | null;
  zoneName?: string | null;
  builtUpAreaSqMeter?: number | string | null;
  carpetAreaSqMeter?: number | string | null;
  status?: string | null;
  occupancyStatus?: string | null;
  isActive?: boolean | null;
};

export type AssetDocumentListItem = {
  id: number | string;
  assetId?: number | string | null;
  name: string;
  fileName: string;
  contentType?: string | null;
  uploadedDate?: string | null;
  fileSize?: number | string | null;
  status?: string | null;
};
