import { apiClient } from '@/services/api.service';
import type { ApiResponse } from '@/types/common.types';
import type {
  RevenueDashboardAssetDetailsResponse,
  RevenueDashboardCategoryDistribution,
  RevenueDashboardCategoryDistributionParams,
  RevenueDashboardMonthlyTrend,
  RevenueDashboardMonthlyTrendParams,
  RevenueDashboardOverviewParams,
  RevenueDashboardOverviewResponse,
  RevenueDashboardParams,
  RevenueDashboardResponse,
  RevenueDashboardSummary,
  RevenueDashboardSummaryParams,
  RevenueDashboardZoneWise,
  RevenueDashboardZoneWiseParams,
} from '@/types/asset-type/revenue-dashboard.type';


/* -------------------------------------------------------------------------- */
/* 1. GET Revenue Dashboard Items                                          */
/* -------------------------------------------------------------------------- */

export const getRevenueDashboard = async (
  params: RevenueDashboardParams = {}
): Promise<ApiResponse<RevenueDashboardResponse>> => {
  const query = new URLSearchParams();

  /* ------------------------------ Pagination ------------------------------ */

  query.set('PageNumber', String(params.pageNumber ?? 1));
  query.set('PageSize', String(params.pageSize ?? 10));

  /* ------------------------------- Filters -------------------------------- */

  if (params.assetId != null) {
    query.set('AssetId', String(params.assetId));
  }

  if (params.assetNo) {
    query.set('AssetNo', params.assetNo);
  }

  if (params.assetName) {
    query.set('AssetName', params.assetName);
  }

  if (params.assetCategoryId != null) {
    query.set('AssetCategoryId', String(params.assetCategoryId));
  }

  if (params.assetTypeId != null) {
    query.set('AssetTypeId', String(params.assetTypeId));
  }

  if (params.parentAssetId != null) {
    query.set('ParentAssetId', String(params.parentAssetId));
  }

  if (params.zoneId != null) {
    query.set('ZoneId', String(params.zoneId));
  }

  if (params.wardId != null) {
    query.set('WardId', String(params.wardId));
  }

  if (params.leaseType) {
    query.set('LeaseType', params.leaseType);
  }

  if (params.tenantName) {
    query.set('TenantName', params.tenantName);
  }

  if (params.paymentStatus) {
    query.set('PaymentStatus', params.paymentStatus);
  }

  if (params.rentStatus) {
    query.set('RentStatus', params.rentStatus);
  }

  if (params.fromDate) {
    query.set('FromDate', params.fromDate);
  }

  if (params.toDate) {
    query.set('ToDate', params.toDate);
  }

  if (params.monthlyRent != null) {
    query.set('MonthlyRent', String(params.monthlyRent));
  }

  if (params.searchTerm) { query.set('SearchTerm', params.searchTerm); }

  return apiClient.get<RevenueDashboardResponse>(
    `/api/RevenueDashboard?${query.toString()}`
  );
};


/* -------------------------------------------------------------------------- */
/* 2. Get Asset Details by ID                                              */
/* -------------------------------------------------------------------------- */


export const getRevenueDashboardAssetById = async (
  assetId: number
): Promise<ApiResponse<RevenueDashboardAssetDetailsResponse>> => {
  return apiClient.get<RevenueDashboardAssetDetailsResponse>(
    `/api/RevenueDashboard/asset/${assetId}`
  );
};


/* -------------------------------------------------------------------------- */
/* 3. Get Revenue Dashboard Overview                                         */
/* -------------------------------------------------------------------------- */

// Service Function
export const getRevenueDashboardOverview = async (
  params: RevenueDashboardOverviewParams = {}
): Promise<ApiResponse<RevenueDashboardOverviewResponse>> => {
  const query = new URLSearchParams();

  if (params.year != null) {
    query.set('Year', String(params.year));
  }

  if (params.month != null) {
    query.set('Month', String(params.month));
  }

  if (params.assetCategoryId != null) {
    query.set('AssetCategoryId', String(params.assetCategoryId));
  }

  if (params.zoneId != null) {
    query.set('ZoneId', String(params.zoneId));
  }

  if (params.wardId != null) {
    query.set('WardId', String(params.wardId));
  }

  return apiClient.get<RevenueDashboardOverviewResponse>(
    `/api/RevenueDashboard/overview?${query.toString()}`
  );
};


/* -------------------------------------------------------------------------- */
/* 4. Get Revenue Dashboard Summary                                         */
/* -------------------------------------------------------------------------- */


// Service Function
export const getRevenueDashboardSummary = async (
  params: RevenueDashboardSummaryParams = {}
) => {
  const query = new URLSearchParams();

  if (params.year != null) query.set('Year', String(params.year));
  if (params.month != null) query.set('Month', String(params.month));
  if (params.assetCategoryId != null) {
    query.set('AssetCategoryId', String(params.assetCategoryId));
  }
  if (params.zoneId != null) query.set('ZoneId', String(params.zoneId));
  if (params.wardId != null) query.set('WardId', String(params.wardId));

  const endpoint = `/api/RevenueDashboard/summary${
    query.toString() ? `?${query.toString()}` : ''
  }`;

  return apiClient.get<RevenueDashboardSummary>(endpoint);
};


/* -------------------------------------------------------------------------- */
/* 5. Get Revenue Dashboard Category Distribution                       */
/* -------------------------------------------------------------------------- */

// Service Function
export const getRevenueDashboardCategoryDistribution = async (
  params: RevenueDashboardCategoryDistributionParams = {}
) => {
  const query = new URLSearchParams();

  if (params.year != null) query.set('Year', String(params.year));
  if (params.month != null) query.set('Month', String(params.month));
  if (params.assetCategoryId != null) {
    query.set('AssetCategoryId', String(params.assetCategoryId));
  }
  if (params.zoneId != null) query.set('ZoneId', String(params.zoneId));
  if (params.wardId != null) query.set('WardId', String(params.wardId));

  const endpoint = `/api/RevenueDashboard/category-distribution${
    query.toString() ? `?${query.toString()}` : ''
  }`;

  return apiClient.get<RevenueDashboardCategoryDistribution[]>(endpoint);
};


/* -------------------------------------------------------------------------- */
/* 6. Get Revenue Dashboard Monthly Trend                               */
/* -------------------------------------------------------------------------- */

// Service Function
export const getRevenueDashboardMonthlyTrend = async (
  params: RevenueDashboardMonthlyTrendParams = {}
) => {
  const query = new URLSearchParams();

  if (params.year != null) query.set('Year', String(params.year));
  if (params.month != null) query.set('Month', String(params.month));
  if (params.assetCategoryId != null) {
    query.set('AssetCategoryId', String(params.assetCategoryId));
  }
  if (params.zoneId != null) query.set('ZoneId', String(params.zoneId));
  if (params.wardId != null) query.set('WardId', String(params.wardId));

  const endpoint = `/api/RevenueDashboard/monthly-trend${
    query.toString() ? `?${query.toString()}` : ''
  }`;

  return apiClient.get<RevenueDashboardMonthlyTrend[]>(endpoint);
};


/* -------------------------------------------------------------------------- */
/* 7. Get Revenue Dashboard Zone-Wise                                     */
/* -------------------------------------------------------------------------- */


// Service Function
export const getRevenueDashboardZoneWise = async (
  params: RevenueDashboardZoneWiseParams = {}
) => {
  const query = new URLSearchParams();

  if (params.year != null) query.set('Year', String(params.year));
  if (params.month != null) query.set('Month', String(params.month));
  if (params.assetCategoryId != null) {
    query.set('AssetCategoryId', String(params.assetCategoryId));
  }
  if (params.zoneId != null) query.set('ZoneId', String(params.zoneId));
  if (params.wardId != null) query.set('WardId', String(params.wardId));

  const endpoint = `/api/RevenueDashboard/zone-wise${
    query.toString() ? `?${query.toString()}` : ''
  }`;

  return apiClient.get<RevenueDashboardZoneWise[]>(endpoint);
};