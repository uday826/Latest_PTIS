import { apiClient } from '@/services/api.service';
import { ApiResponse } from '@/types/common.types';
import type {
  RevenueDashboardOverview,
  RevenueListQuery,
  RevenueListResult,
  RevenueOverviewQuery,
} from '@/types/asset-type/revenue-dashboard.types';
import {
  normalizeOverview,
  normalizeRevenueListResult,
} from './revenue-dashboard-types-guard';

/** Append a numeric query param only when it is a finite, positive value. */
function appendId(params: URLSearchParams, key: string, value?: number): void {
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
    params.append(key, String(value));
  }
}

/**
 * Client for `RevenueDashboardController` (`/api/RevenueDashboard/*`).
 * All requests go through the shared `apiClient`; responses are narrowed and
 * normalized before they cross into the UI.
 */
export const revenueDashboardService = {
  /**
   * GET /RevenueDashboard/overview — KPI summary, category distribution, monthly
   * trend and zone-wise demand/collection for the resolved period.
   */
  getOverview: async (
    query: RevenueOverviewQuery = {}
  ): Promise<ApiResponse<RevenueDashboardOverview>> => {
    const params = new URLSearchParams();
    appendId(params, 'Year', query.year);
    appendId(params, 'Month', query.month);
    appendId(params, 'AssetCategoryId', query.assetCategoryId);
    appendId(params, 'ZoneId', query.zoneId);
    appendId(params, 'WardId', query.wardId);

    const qs = params.toString();
    const response = await apiClient.get<unknown>(
      `/RevenueDashboard/overview${qs ? `?${qs}` : ''}`
    );
    if (response.success) {
      return { ...response, data: normalizeOverview(response.data) };
    }
    return response as ApiResponse<RevenueDashboardOverview>;
  },

  /**
   * GET /RevenueDashboard — paged list of lease/rent records with their asset
   * details, scoped by category / zone / ward / lease type / payment status.
   */
  getRevenueList: async (
    query: RevenueListQuery
  ): Promise<ApiResponse<RevenueListResult>> => {
    const params = new URLSearchParams();
    params.append('PageNumber', String(query.pageNumber));
    params.append('PageSize', String(query.pageSize));
    if (query.searchTerm?.trim()) params.append('SearchTerm', query.searchTerm.trim());
    if (query.sortBy?.trim()) params.append('SortBy', query.sortBy.trim());
    if (query.sortOrder?.trim()) params.append('SortOrder', query.sortOrder.trim());
    appendId(params, 'AssetCategoryId', query.assetCategoryId);
    appendId(params, 'ZoneId', query.zoneId);
    appendId(params, 'WardId', query.wardId);
    if (query.leaseType?.trim()) params.append('LeaseType', query.leaseType.trim());
    if (query.paymentStatus?.trim()) params.append('PaymentStatus', query.paymentStatus.trim());

    const response = await apiClient.get<unknown>(`/RevenueDashboard?${params.toString()}`);
    if (response.success) {
      return { ...response, data: normalizeRevenueListResult(response.data) };
    }
    return response as ApiResponse<RevenueListResult>;
  },
};
