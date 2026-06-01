import { apiClient } from "@/services/api.service";
import { ApiResponse } from "@/types/common.types";

export interface AssetFieldDefinition {
  id: number;
  fieldName: string;
  fieldType: string;
  isRequired: boolean;
  options?: string[];
  fieldLabel?: string;
  fieldGroup?: string;
  assetCategoryId?: number;
  assetTypeId?: number;
}

/**
 * Service for managing Asset Field Definitions
 */
export const assetFieldDefinitionService = {
  /**
   * Get all Asset Field Definitions for a given category and type
   */
  getFieldDefinitions: async (categoryId: number, typeId: number): Promise<ApiResponse<AssetFieldDefinition[]>> => {
    return apiClient.get<AssetFieldDefinition[]>(`/AssetFieldDefinition?AssetCategoryId=${categoryId}&AssetTypeId=${typeId}&pageSize=1000`);
  },
};