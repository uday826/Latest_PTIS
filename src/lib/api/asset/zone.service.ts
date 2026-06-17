import { apiClient } from "@/services/api.service";
import { ApiResponse } from "@/types/common.types";
import type { Zone } from "@/types/municipal-asset-service.types";

export type { Zone };

/**
 * Service for fetching Zone master data
 */
export const zoneService = {
  /**
   * Get all active Zones
   */
  getZones: async (): Promise<ApiResponse<Zone[]>> => {
    const response = await apiClient.get<{ items?: Zone[] } | Zone[]>("/Zone?pageSize=-1");
    if (response.success && response.data) {
      const data = response.data;
      const items = Array.isArray(data)
        ? data
        : (data.items || []);
      return { ...response, data: items };
    }
    return response as ApiResponse<Zone[]>;
  },

  /**
   * Get all SubZones for Capital Value calculation
   */
  getSubZones: async (): Promise<ApiResponse<unknown[]>> => {
    const response = await apiClient.get<{ items?: unknown[] } | unknown[]>("/SubZoneDetailsForCV", { cacheStrategy: 300 });
    if (response.success && response.data) {
      const data = response.data;
      const items = Array.isArray(data)
        ? data
        : (data.items || []);
      return { ...response, data: items };
    }
    return response as ApiResponse<unknown[]>;
  },
};
