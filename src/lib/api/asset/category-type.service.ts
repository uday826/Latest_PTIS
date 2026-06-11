import { apiClient } from "@/services/api.service";
import { ApiResponse } from "@/types/common.types";

export interface AssetCategory {
  id: number;
  categoryName: string;
  categoryCode: string;
  isActive: boolean;
  isMovable: boolean;
  hasFloorDetails: boolean;
  hasInventory: boolean;
  isInventoryMandatory: boolean;
  hasLegalCompliance: boolean;
  // BUILDING | LAND | INFRASTRUCTURE | MOVABLE | GENERIC — drives valuation form
  valuationType: string;
}

export interface AssetType {
  id: number;
  typeName?: string;
  assetTypeName?: string;
  categoryId?: number;
  assetCategoryId?: number;
  isActive: boolean;
}

/**
 * Service for fetching Asset Categories and Types from Master Data
 */
export const categoryTypeService = {
  /**
   * Get all active Asset Categories
   */
  getCategories: async (): Promise<ApiResponse<AssetCategory[]>> => {
    const response = await apiClient.get<any>("/AssetCategory?pageSize=1000", { cacheStrategy: 300 });
    if (response.success && response.data) {
      const items = Array.isArray(response.data) ? response.data : (response.data.items || []);
      return { ...response, data: items };
    }
    return response;
  },

  /**
   * Get all active Asset Types
   */
  getAllTypes: async (): Promise<ApiResponse<AssetType[]>> => {
    const response = await apiClient.get<any>("/AssetType?pageSize=1000", { cacheStrategy: 300 });
    if (response.success && response.data) {
      const items = Array.isArray(response.data) ? response.data : (response.data.items || []);
      return { ...response, data: items };
    }
    return response;
  },

  /**
   * Get Asset Types filtered by Category ID
   */
  getTypesByCategory: async (categoryId: number): Promise<ApiResponse<AssetType[]>> => {
    // 1. Fetch all types (reliable way to ensure we have the data regardless of query param support)
    const response = await categoryTypeService.getAllTypes();
    
    if (response.success && response.data) {
      const targetId = Number(categoryId);
      const items = Array.isArray(response.data) ? response.data : [];
      
      // 2. Filter using every possible ID field name found in the database/API
      const filtered = items.filter((t: any) => {
        const tCategoryId = Number(t.categoryId || t.AssetCategoryId || t.assetCategoryId || t.category || t.AssetCategory);
        return tCategoryId === targetId;
      });
      
      return { ...response, data: filtered };
    }
    return response;
  }
};
