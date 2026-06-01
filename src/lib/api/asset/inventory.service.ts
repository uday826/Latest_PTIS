import { apiClient } from "@/services/api.service";
import { ApiResponse } from "@/types/common.types";

export interface InventoryItemCategory {
  id: number;
  typeCode: string;
  typeName: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
  depreciationRate: number;
  createdDate?: string;
  updatedDate?: string | null;
}

export interface InventoryItemCondition {
  id: number;
  inventoryItemCategoryId: number;
  conditionName: string;
  description?: string;
  conditionFactor: number;
  displayOrder: number;
  isActive: boolean;
  createdDate?: string;
  updatedDate?: string | null;
}

export interface InventoryItemName {
  id: number;
  inventoryItemCategoryId: number;
  subTypeCode: string;
  subTypeName: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
  createdDate?: string;
  updatedDate?: string | null;
}

export interface InventoryItemModel {
  id: number;
  inventoryItemNameId: number;
  modelName: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
  createdDate?: string;
  updatedDate?: string | null;
}

/**
 * Service for fetching Inventory Item master data
 * Follows the same pattern as wardService, zoneService etc.
 */
export const inventoryService = {
  /**
   * Get all Inventory Item Categories
   * GET /api/InventoryItemCategory
   */
  getCategories: async (): Promise<ApiResponse<InventoryItemCategory[]>> => {
    const response = await apiClient.get<any>("/InventoryItemCategory?pageSize=1000");
    if (response.success && response.data) {
      const items = Array.isArray(response.data)
        ? response.data
        : (response.data.items || response.data.Items || response.data.data || []);
      return { ...response, data: items };
    }
    return response;
  },

  /**
   * Get all Inventory Item Conditions
   * GET /api/InventoryItemCondition
   */
  getConditions: async (): Promise<ApiResponse<InventoryItemCondition[]>> => {
    const response = await apiClient.get<any>("/InventoryItemCondition?pageSize=1000");
    if (response.success && response.data) {
      const items = Array.isArray(response.data)
        ? response.data
        : (response.data.items || response.data.Items || response.data.data || []);
      return { ...response, data: items };
    }
    return response;
  },

  /**
   * Get all Inventory Item Names
   * GET /api/InventoryItemName
   */
  getItemNames: async (): Promise<ApiResponse<InventoryItemName[]>> => {
    const response = await apiClient.get<any>("/InventoryItemName?pageSize=1000");
    if (response.success && response.data) {
      const items = Array.isArray(response.data)
        ? response.data
        : (response.data.items || response.data.Items || response.data.data || []);
      return { ...response, data: items };
    }
    return response;
  },

  /**
   * Get all Inventory Item Models
   * GET /api/InventoryItemModel
   */
  getItemModels: async (): Promise<ApiResponse<InventoryItemModel[]>> => {
    const response = await apiClient.get<any>("/InventoryItemModel?pageSize=1000");
    if (response.success && response.data) {
      const items = Array.isArray(response.data)
        ? response.data
        : (response.data.items || response.data.Items || response.data.data || []);
      return { ...response, data: items };
    }
    return response;
  },
};
