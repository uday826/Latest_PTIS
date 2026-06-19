import { apiClient } from '@/services/api.service';
import { ApiError } from '@/lib/utils/api';
import type {
  AssetDashboardSummaryDto,
  AssetDashboardCategoryCount,
  AssetDashboardTypeByCategory,
  AssetDashboardAssetByType,
} from '@/types/asset-type/asset-dashboard-api.types';

/**
 * Service for the new AssetDashboard endpoints
 */
export const assetDashboardService = {
  getSummary: async (zoneId?: number | null, wardId?: number | null): Promise<AssetDashboardSummaryDto> => {
    let url = '/AssetDashboard/summary';
    const params = new URLSearchParams();
    if (zoneId) params.append('zoneId', String(zoneId));
    if (wardId) params.append('wardId', String(wardId));
    if (params.toString()) url += `?${params.toString()}`;
    
    const response = await apiClient.get<AssetDashboardSummaryDto>(url, { cacheStrategy: 60 });
    if (!response.success || !response.data) {
      throw new ApiError(response.statusCode ?? 500, response.error || "Failed to fetch summary", "Fetch summary failed");
    }
    return response.data;
  },

  getCategoryCounts: async (zoneId?: number | null, wardId?: number | null): Promise<AssetDashboardCategoryCount[]> => {
    let url = '/AssetDashboard/category-counts';
    const params = new URLSearchParams();
    if (zoneId) params.append('zoneId', String(zoneId));
    if (wardId) params.append('wardId', String(wardId));
    if (params.toString()) url += `?${params.toString()}`;

    const response = await apiClient.get<AssetDashboardCategoryCount[]>(url, { cacheStrategy: 60 });
    if (!response.success || !response.data) {
      throw new ApiError(response.statusCode ?? 500, response.error || "Failed to fetch category counts", "Fetch counts failed");
    }
    return response.data;
  },

  getTypesByCategory: async (
    categoryId?: number | null,
    zoneId?: number | null,
    wardId?: number | null
  ): Promise<AssetDashboardTypeByCategory[]> => {
    let url = `/AssetDashboard/types-by-category`;
    const params = new URLSearchParams();
    if (categoryId) params.append('categoryId', String(categoryId));
    if (zoneId) params.append('zoneId', String(zoneId));
    if (wardId) params.append('wardId', String(wardId));
    if (params.toString()) url += `?${params.toString()}`;
    
    const response = await apiClient.get<AssetDashboardTypeByCategory[]>(url, { cacheStrategy: 60 });
    if (!response.success || !response.data) {
      throw new ApiError(response.statusCode ?? 500, response.error || "Failed to fetch types", "Fetch types failed");
    }
    return response.data;
  },

  getAssetsByType: async (
    assetTypeId: number,
    zoneId?: number | null,
    wardId?: number | null
  ): Promise<AssetDashboardAssetByType[]> => {
    let url = `/AssetDashboard/assets-by-type?assetTypeId=${assetTypeId}`;
    if (zoneId) url += `&zoneId=${zoneId}`;
    if (wardId) url += `&wardId=${wardId}`;
    
    const response = await apiClient.get<AssetDashboardAssetByType[]>(url, { cacheStrategy: 60 });
    if (!response.success || !response.data) {
      throw new ApiError(response.statusCode ?? 500, response.error || "Failed to fetch assets", "Fetch assets failed");
    }
    return response.data;
  },

  getLocations: async (
    zoneId?: number | null,
    wardId?: number | null,
    categoryId?: number | null
  ): Promise<import('@/types/asset-type/asset-dashboard-api.types').AssetDashboardLocation[]> => {
    let url = '/AssetDashboard/locations';
    const params = new URLSearchParams();
    if (zoneId) params.append('zoneId', String(zoneId));
    if (wardId) params.append('wardId', String(wardId));
    if (categoryId) params.append('categoryId', String(categoryId));
    if (params.toString()) url += `?${params.toString()}`;
    
    const response = await apiClient.get<import('@/types/asset-type/asset-dashboard-api.types').AssetDashboardLocation[]>(url, { cacheStrategy: 60 });
    if (!response.success || !response.data) {
      throw new ApiError(response.statusCode ?? 500, response.error || "Failed to fetch locations", "Fetch locations failed");
    }
    return response.data;
  },
};
