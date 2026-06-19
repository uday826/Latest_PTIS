/* -------------------------------------------------------------------------- */
/* 1. GET Revenue Dashboard Items                                          */
/* -------------------------------------------------------------------------- */

// Parameter Interface
export interface RevenueDashboardParams {
  assetNo?: string;
  assetName?: string;
  assetCategoryId?: number;
  assetTypeId?: number;
  parentAssetId?: number;
  zoneId?: number;
  wardId?: number;
  assetId?: number;
  leaseType?: string;
  tenantName?: string;
  paymentStatus?: string;
  rentStatus?: string;
  fromDate?: string;
  toDate?: string;
  monthlyRent?: number;
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
}

// Response Interfaces
export interface RevenueDashboardItem {
  id: number;
  assetId: number;
  assetNo: string;
  assetName: string;
  zoneName: string;
  wardName: string;
  leaseType: string;
  tenantName: string;
  paymentStatus: string;
  monthlyRent: number;
}

export interface RevenueDashboardResponse {
  items: RevenueDashboardItem[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}


/* -------------------------------------------------------------------------- */
/* 2. Get Asset Details by ID                                              */
/* -------------------------------------------------------------------------- */

// Response Interfaces
export interface RevenueDashboardAsset {
  authorityId: number;
  organizationId: number;
  departmentId: number;
  assetNo: string;
  assetName: string;
  assetLocalName: string | null;
  assetCategoryId: number;
  assetTypeId: number;
  parentAssetId: number;
  hierarchyLevel: number;
  hierarchyPath: string;
  address: string;
  wardId: number;
  assetWardNo: string | null;
  propertyNo: string | null;
  partitionNo: string | null;
  upicId: string | null;
  zoneId: number;
  subZoneId: number;
  moujaId: number;
  latitude: number | null;
  longitude: number | null;
  csn: string | null;
  typeOfUseId: number | null;
  subTypeOfUseId: number | null;
  builtUpAreaSqMeter: number | null;
  carpetAreaSqMeter: number | null;
  landAreaSqMeter: number | null;
  hasLift: boolean;
  purchaseValue: number | null;
  purchaseDate: string | null;
  marketValue: number | null;
  marketValueDate: string | null;
  capitalValue: number | null;
  lastCVCalculationDate: string | null;
  currentBookValue: number | null;
  depreciationRate: number | null;
  ownershipType: string;
  status: string;
  occupancyStatus: string | null;
  isRevenueGenerating: boolean;
  operationalControl: string | null;
  assetCondition: string | null;
  floorDetailsId: number | null;
  fieldValues: unknown[];
  inChargeName: string | null;
  inChargeDesignation: string | null;
  inChargeMobile: string | null;
  inChargeEmail: string | null;
  locality: string | null;
  pinCode: string | null;
  landRate: number | null;
  developmentCost: number | null;
  marketAppreciation: number | null;
  totalLength: number | null;
  averageWidth: number | null;
  capacityInLiters: number | null;
  yearOfConstruction: number | null;
  constructionCostPerUnit: number | null;
  totalReplacementCost: number | null;
  depreciation: number | null;
  currentAssetValue: number | null;
  annualMaintenanceCost: number | null;
  authorityName: string;
  organizationName: string;
  departmentName: string;
  assetCategoryName: string;
  assetTypeName: string;
  parentAssetName: string;
  zoneName: string;
  wardName: string;
  moujaName: string;
  typeOfUseName: string | null;
  subTypeOfUseName: string | null;
  id: number;
  isActive: boolean;
  createdDate: string;
  updatedDate: string;
}

export interface RevenueDashboardLease {
  [key: string]: unknown;
}

export interface RevenueDashboardSummary {
  totalLeaseCount: number;
  activeLeaseCount: number;
  totalMonthlyRent: number;
  totalAnnualRent: number;
  totalSecurityDeposit: number;
}

export interface RevenueDashboardAssetDetailsResponse {
  asset: RevenueDashboardAsset;
  leases: RevenueDashboardLease[];
  summary: RevenueDashboardSummary;
}


/* -------------------------------------------------------------------------- */
/* 3. Get Revenue Dashboard Overview                                         */
/* -------------------------------------------------------------------------- */

// Parameter Interface
export interface RevenueDashboardOverviewParams {
  year?: number;
  month?: number;
  assetCategoryId?: number;
  zoneId?: number;
  wardId?: number;
}

// Response Interfaces
export interface RevenueDashboardOverviewSummary {
  totalLeasedAssets: number;
  totalDistinctAssets: number;
  paidLeaseCount: number;
  unpaidLeaseCount: number;
  monthlyRentTarget: number;
  totalDemand: number;
  totalCollection: number;
  totalPending: number;
  collectionRatePercent: number;
  totalSecurityDeposit: number;
}

export interface RevenueDashboardCategoryDistribution {
  assetCategoryId: number;
  categoryName: string;
  categoryCode: string;
  valuationType: string;
  assetCount: number;
  leaseCount: number;
  rentCount: number;
  paidCount: number;
  unpaidCount: number;
  demand: number;
  collection: number;
  pending: number;
}

export interface RevenueDashboardMonthlyTrend {
  month: number;
  monthName: string;
  demand: number;
  collected: number;
  pending: number;
}

export interface RevenueDashboardZoneStat {
  zoneId: number;
  zoneName: string;
  zoneNo: string;
  demand: number;
  collection: number;
  pending: number;
  collectionRatePercent: number;
  demandSharePercent: number;
}

export interface RevenueDashboardOverviewResponse {
  year: number;
  month: number | null;
  summary: RevenueDashboardOverviewSummary;
  categoryDistribution: RevenueDashboardCategoryDistribution[];
  monthlyTrend: RevenueDashboardMonthlyTrend[];
  zoneStats: RevenueDashboardZoneStat[];
}


/* -------------------------------------------------------------------------- */
/* 4. Get Revenue Dashboard Summary                                         */
/* -------------------------------------------------------------------------- */

// Parameter Interface
export interface RevenueDashboardSummaryParams {
  year?: number;
  month?: number;
  assetCategoryId?: number;
  zoneId?: number;
  wardId?: number;
}

// Response Interface
export interface RevenueDashboardSummary {
  totalLeasedAssets: number;
  totalDistinctAssets: number;
  paidLeaseCount: number;
  unpaidLeaseCount: number;
  monthlyRentTarget: number;
  totalDemand: number;
  totalCollection: number;
  totalPending: number;
  collectionRatePercent: number;
  totalSecurityDeposit: number;
}


/* -------------------------------------------------------------------------- */
/* 5. Get Revenue Dashboard Category Distribution                       */
/* -------------------------------------------------------------------------- */

// Parameter Interface
export interface RevenueDashboardCategoryDistributionParams {
  year?: number;
  month?: number;
  assetCategoryId?: number;
  zoneId?: number;
  wardId?: number;
}

// Response Interface
export interface RevenueDashboardCategoryDistribution {
  assetCategoryId: number;
  categoryName: string;
  categoryCode: string;
  valuationType: string;
  assetCount: number;
  leaseCount: number;
  rentCount: number;
  paidCount: number;
  unpaidCount: number;
  demand: number;
  collection: number;
  pending: number;
}


/* -------------------------------------------------------------------------- */
/* 6. Get Revenue Dashboard Monthly Trend                               */
/* -------------------------------------------------------------------------- */

// Parameter Interface
export interface RevenueDashboardMonthlyTrendParams {
  year?: number;
  month?: number;
  assetCategoryId?: number;
  zoneId?: number;
  wardId?: number;
}

// Response Interface
export interface RevenueDashboardMonthlyTrend {
  month: number;
  monthName: string;
  demand: number;
  collected: number;
  pending: number;
}


/* -------------------------------------------------------------------------- */
/* 7. Get Revenue Dashboard Monthly Trend                               */
/* -------------------------------------------------------------------------- */

// Parameter Interface
export interface RevenueDashboardZoneWiseParams {
  year?: number;
  month?: number;
  assetCategoryId?: number;
  zoneId?: number;
  wardId?: number;
}

// Response Interface
export interface RevenueDashboardZoneWise {
  zoneId: number;
  zoneName: string;
  zoneNo: string;
  demand: number;
  collection: number;
  pending: number;
  collectionRatePercent: number;
  demandSharePercent: number;
}