import { apiClient } from "@/services/api.service";
import { ApiResponse } from "@/types/common.types";

export interface Zone {
  id: number;
  zoneNo: string;
  ZoneNo?: string;
  zoneName?: string;
  ZoneName?: string;
  description?: string;
  sequenceNo?: number;
  isActive?: boolean;
}

/**
 * Service for fetching Zone master data
 */
export const zoneService = {
  /**
   * Get all active Zones
   */
  getZones: async (): Promise<ApiResponse<Zone[]>> => {
    const response = await apiClient.get<any>("/Zone?pageSize=-1");
    if (response.success && response.data) {
      const items = Array.isArray(response.data)
        ? response.data
        : (response.data.items || response.data.Items || response.data.data || []);
      return { ...response, data: items };
    }
    return response;
  },

  /**
   * Get all SubZones for Capital Value calculation
   */
  getSubZones: async (): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get<any>("/SubZoneDetailsForCV");
    if (response.success && response.data) {
      const items = Array.isArray(response.data)
        ? response.data
        : (response.data.items || response.data.Items || response.data.data || []);
      return { ...response, data: items };
    }
    return response;
  },
};
