/**
 * Types for the Revenue Management Dashboard.
 *
 * These mirror the API contract exposed by `RevenueDashboardController`
 * (`/api/RevenueDashboard/*`) on the NTIS platform. Money fields are plain rupee
 * decimals; the UI formats them via `revenue-format.ts`.
 */

/** Top KPI cards: leased-asset counts plus demand / collection money for the period. */
export interface RevenueKpiSummary {
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

/** One "Asset Distribution by Category" card. */
export interface RevenueCategoryDistribution {
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

/** One point on the "Monthly Revenue Collection Trend" chart. */
export interface RevenueMonthlyTrend {
  month: number;
  monthName: string;
  demand: number;
  collected: number;
  pending: number;
}

/** One row of the "Zone-wise Demand & Collection" panel. */
export interface RevenueZoneStats {
  zoneId: number;
  zoneName: string;
  zoneNo: string;
  demand: number;
  collection: number;
  pending: number;
  collectionRatePercent: number;
  demandSharePercent: number;
}

/** The complete revenue dashboard in a single payload. */
export interface RevenueDashboardOverview {
  year: number;
  month: number | null;
  summary: RevenueKpiSummary;
  categoryDistribution: RevenueCategoryDistribution[];
  monthlyTrend: RevenueMonthlyTrend[];
  zoneStats: RevenueZoneStats[];
}

/** One row of the revenue records list (a lease/rent record joined to its asset). */
export interface AssetRevenueListItem {
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

/** Paged envelope for the revenue records list. */
export interface RevenueListResult {
  items: AssetRevenueListItem[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

/** Scope parameters for the overview endpoints. */
export interface RevenueOverviewQuery {
  year?: number;
  month?: number;
  assetCategoryId?: number;
  zoneId?: number;
  wardId?: number;
}

/** Filter / search / sort / pagination parameters for the records list. */
export interface RevenueListQuery {
  pageNumber: number;
  pageSize: number;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  assetCategoryId?: number;
  zoneId?: number;
  wardId?: number;
  leaseType?: string;
  paymentStatus?: string;
}

/** A zone / ward option used to populate the dashboard filter dropdowns. */
export interface RevenueFilterOption {
  id: number;
  label: string;
}

/** SSR payload for the Revenue Management Dashboard landing screen. */
export interface RevenueDashboardData {
  overview: RevenueDashboardOverview;
  zones: RevenueFilterOption[];
  wards: RevenueFilterOption[];
  selectedZoneId: number | null;
  selectedWardId: number | null;
}

/** SSR payload for the per-category revenue records screen. */
export interface RevenueRecordsData {
  categories: RevenueCategoryDistribution[];
  summary: RevenueKpiSummary;
  list: RevenueListResult;
  zones: RevenueFilterOption[];
  wards: RevenueFilterOption[];
  selectedCategoryId: number | null;
}
