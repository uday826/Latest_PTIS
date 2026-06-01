import { apiClient } from "@/services/api.service";
import { ApiResponse } from "@/types/common.types";

export interface AssetFieldValueSaveRequest {
  assetId: number;
  fieldDefinitionId: number;
  fieldName: string;
  textValue?: string | null;
  numberValue?: number | null;
  dateValue?: string | null;
  booleanValue?: boolean | null;
  createdBy?: number;
}

/**
 * Service for managing Asset Field Value (EAV) records
 */
export const assetFieldValueService = {
  /**
   * Save a dynamic field value for an asset
   */
  saveFieldValue: async (data: AssetFieldValueSaveRequest): Promise<ApiResponse<any>> => {
    return apiClient.post<any>("/AssetFieldValue", data);
  },
};
