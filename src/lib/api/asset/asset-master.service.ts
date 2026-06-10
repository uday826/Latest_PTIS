import { apiClient } from "@/services/api.service";
import { AssetMasterRequest, AssetMasterResponse } from "@/types/asset-types/basic-info/asset-wizard.types";
import { ApiResponse } from "@/types/common.types";
import type { 
  AssetDashboardStatsDto, 
  PagedAssetMasterResponse 
} from "@/types/asset-types/asset-register.types";

/**
 * Service for managing Asset Master records
 */

export const assetMasterService = {
  /**
   * Create a new Asset Master record
   */
  createAsset: async (data: AssetMasterRequest): Promise<ApiResponse<AssetMasterResponse>> => {
    return apiClient.post<AssetMasterResponse>("/AssetMaster", data);
  },

  /**
   * Get all Asset Master records (unpaginated)
   */
  getAllAssets: async (): Promise<ApiResponse<AssetMasterResponse[]>> => {
    return apiClient.get<AssetMasterResponse[]>("/AssetMaster");
  },

  /**
   * Get all Asset Master records with pagination and filters
   */
  getAllAssetsPaginated: async (params: {
    pageNumber?: number;
    pageSize?: number;
    assetCategoryId?: number | null;
    assetTypeId?: number | null;
    zoneId?: number | null;
    wardId?: number | null;
    searchTerm?: string;
  } = {}): Promise<ApiResponse<PagedAssetMasterResponse>> => {
    const query = new URLSearchParams();
    query.set("PageNumber", String(params.pageNumber ?? 1));
    query.set("PageSize", String(params.pageSize ?? 10));
    if (params.assetCategoryId) query.set("AssetCategoryId", String(params.assetCategoryId));
    if (params.assetTypeId) query.set("AssetTypeId", String(params.assetTypeId));
    if (params.zoneId) query.set("ZoneId", String(params.zoneId));
    if (params.wardId) query.set("WardId", String(params.wardId));
    if (params.searchTerm?.trim()) query.set("SearchTerm", params.searchTerm.trim());
    return apiClient.get<PagedAssetMasterResponse>(`/AssetMaster?${query.toString()}`);
  },

  /**
   * Get a single Asset Master record by ID
   */
  getAssetById: async (id: number): Promise<ApiResponse<AssetMasterResponse>> => {
    return apiClient.get<AssetMasterResponse>(`/AssetMaster/${id}`);
  },

  /**
   * Get dashboard statistics (category-wise counts, type breakdowns)
   * Endpoint: GET /AssetMaster/dashboard-stats
   */
  getDashboardStats: async (): Promise<ApiResponse<AssetDashboardStatsDto>> => {
    return apiClient.get<AssetDashboardStatsDto>("/AssetMaster/dashboard-stats", { cacheStrategy: 300 });
  },

  /**
   * Update an existing Asset Master record
   */
  updateAsset: async (id: number, data: Partial<AssetMasterRequest>): Promise<ApiResponse<AssetMasterResponse>> => {
    return apiClient.put<AssetMasterResponse>(`/AssetMaster/${id}`, data);
  },

  /**
   * Activate an Asset Master record and all its related child records
   * Endpoint: PUT /AssetMaster/{id}/activate
   */
  activateAsset: async (id: number): Promise<ApiResponse<void>> => {
    return apiClient.put<void>(`/AssetMaster/${id}/activate`, {});
  },

  /**
   * Delete an Asset Master record
   */
  deleteAsset: async (id: number): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/AssetMaster/${id}`);
  },
};
