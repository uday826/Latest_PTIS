import { apiClient } from "@/services/api.service";
import { ApiResponse } from "@/types/common.types";
import type { AssetCategory } from "@/types/asset-type/asset-category.types";
import type { AssetType, ApiCategoryItem, ApiTypeItem } from "@/types/municipal-asset-service.types";

export type { AssetCategory, AssetType };

/**
 * Service for fetching Asset Categories and Types from Master Data
 */
export const categoryTypeService = {
  /**
   * Get all active Asset Categories
   */
  getCategories: async (): Promise<ApiResponse<AssetCategory[]>> => {
    const response = await apiClient.get<{ items?: ApiCategoryItem[] } | ApiCategoryItem[]>("/AssetCategory?pageSize=-1", { cacheStrategy: 300 });
    if (response.success && response.data) {
      const data = response.data;
      let items = Array.isArray(data) ? data : (data.items || []);
      items = items.filter((item) => 
        item.isActive !== false && 
        item.IsActive !== false && 
        item.status?.toLowerCase() !== 'inactive'
      );
      return { ...response, data: items };
    }
    return response as ApiResponse<AssetCategory[]>;
  },

  /**
   * Get all active Asset Types
   */
  getAllTypes: async (): Promise<ApiResponse<AssetType[]>> => {
    const response = await apiClient.get<{ items?: ApiTypeItem[] } | ApiTypeItem[]>("/AssetType?pageSize=-1", { cacheStrategy: 300 });
    if (response.success && response.data) {
      const data = response.data;
      let items = Array.isArray(data) ? data : (data.items || []);
      items = items.filter((item) => 
        item.isActive !== false && 
        item.IsActive !== false && 
        item.status?.toLowerCase() !== 'inactive'
      );
      return { ...response, data: items };
    }
    return response as ApiResponse<AssetType[]>;
  },

  /**
   * Get Asset Types filtered by Category ID
   */
  getTypesByCategory: async (categoryId: number): Promise<ApiResponse<AssetType[]>> => {
    // 1. Fetch all types (reliable way to ensure we have the data regardless of query param support)
    const response = await categoryTypeService.getAllTypes();
    
    if (response.success && response.data) {
      const targetId = Number(categoryId);
      const items = Array.isArray(response.data) ? (response.data as ApiTypeItem[]) : [];
      
      // 2. Filter using every possible ID field name found in the database/API
      const filtered = items.filter((t) => {
        const tCategoryId = Number(t.categoryId || t.assetCategoryId || t.category || t.AssetCategory);
        return tCategoryId === targetId;
      });
      
      return { ...response, data: filtered };
    }
    return response;
  }
};
