import { apiClient } from "@/services/api.service";
import { ApiResponse } from "@/types/common.types";

export interface Ward {
  id: number;
  wardName: string;
  WardName?: string;
  wardNo?: string;
  WardNo?: string;
  name?: string;
  Name?: string;
  description?: string;
  Description?: string;
  wardCode?: string;
  isActive?: boolean;
  zoneId?: number | string | null;
}

/**
 * Service for fetching Ward master data
 */
export const wardService = {
  /**
   * Get all active Wards
   */
  getWards: async (): Promise<ApiResponse<Ward[]>> => {
    const response = await apiClient.get<any>("/Ward?pageSize=-1");
    if (response.success && response.data) {
      const items = Array.isArray(response.data)
        ? response.data
        : (response.data.items || response.data.Items || response.data.data || []);
      return { ...response, data: items };
    }
    return response;
  },
};
