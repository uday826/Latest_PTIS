import { ApiResponse } from "@/types/common.types";
import {
  FloorDetailApiRequest,
  FloorDetailApiResponse,
  SubUnitApiRequest,
  SubUnitApiResponse,
  FloorDropdownOptions,
  BulkGenerateChildAssetsRequest,
  BulkGenerateChildAssetsResponse,
  CreateChildAssetRequest,
  CreateChildAssetResponse,
} from "@/types/asset/floor-details.types";

/**
 * Floor Details API Service
 * Scope: municipal-Asset / add-New-Asset / floor-details screen only.
 * Decoupled and production-ready server-side REST calls.
 */

import { apiClient } from "@/services/api.service";

async function jsonRequest<T>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  endpoint: string,
  body?: unknown,
  extraHeaders?: Record<string, string>
): Promise<ApiResponse<T>> {
  const options = { headers: extraHeaders };
  if (method === "GET") {
    return apiClient.get<T>(endpoint, options);
  } else if (method === "POST") {
    return apiClient.post<T>(endpoint, body, options);
  } else if (method === "PUT") {
    return apiClient.put<T>(endpoint, body, options);
  } else {
    return apiClient.delete<T>(endpoint, options);
  }
}

export const floorDetailsService = {
  /**
   * Get all floor details for a given asset
   */
  getFloorsByAsset: async (
    assetId: number
  ): Promise<ApiResponse<FloorDetailApiResponse[]>> => {
    return jsonRequest<FloorDetailApiResponse[]>("GET", `/AssetFloorDetails/by-asset/${assetId}`);
  },

  /**
   * Get a single floor detail record by ID
   */
  getFloorById: async (
    id: number
  ): Promise<ApiResponse<FloorDetailApiResponse>> => {
    return jsonRequest<FloorDetailApiResponse>("GET", `/AssetFloorDetails/${id}`);
  },

  /**
   * Create a new floor detail record
   */
  createFloor: async (
    data: FloorDetailApiRequest
  ): Promise<ApiResponse<FloorDetailApiResponse>> => {
    return jsonRequest<FloorDetailApiResponse>("POST", "/AssetFloorDetails", data);
  },

  /**
   * Update an existing floor detail record
   */
  updateFloor: async (
    id: number,
    data: Partial<FloorDetailApiRequest>
  ): Promise<ApiResponse<FloorDetailApiResponse>> => {
    return jsonRequest<FloorDetailApiResponse>("PUT", `/AssetFloorDetails/${id}`, data);
  },

  /**
   * Delete a floor detail record
   */
  deleteFloor: async (id: number): Promise<ApiResponse<void>> => {
    return jsonRequest<void>("DELETE", `/AssetFloorDetails/${id}`);
  },

  /**
   * Get all sub-units for a given floor detail
   */
  getSubUnitsByFloor: async (
    floorDetailId: number
  ): Promise<ApiResponse<SubUnitApiResponse[]>> => {
    return jsonRequest<SubUnitApiResponse[]>("GET", `/SubUnits?floorDetailId=${floorDetailId}`);
  },

  /**
   * Create a new sub-unit under a floor
   */
  createSubUnit: async (
    data: SubUnitApiRequest
  ): Promise<ApiResponse<SubUnitApiResponse>> => {
    return jsonRequest<SubUnitApiResponse>("POST", "/SubUnits", data);
  },

  /**
   * Update an existing sub-unit
   */
  updateSubUnit: async (
    id: number,
    data: Partial<SubUnitApiRequest>
  ): Promise<ApiResponse<SubUnitApiResponse>> => {
    return jsonRequest<SubUnitApiResponse>("PUT", `/SubUnits/${id}`, data);
  },

  /**
   * Delete a sub-unit
   */
  deleteSubUnit: async (id: number): Promise<ApiResponse<void>> => {
    return jsonRequest<void>("DELETE", `/SubUnits/${id}`);
  },

  /**
   * Fetch all dropdown options dynamically, fetching dynamic floors from `/Floor`
   */
  getFloorDropdownOptions: async (): Promise<ApiResponse<FloorDropdownOptions>> => {
    // Fetch all options in parallel to maximize loading speed in milliseconds
    const [floorRes, conRes, useRes, subRes] = await Promise.all([
      jsonRequest<any>("GET", "/Floor?pageSize=10000"),
      jsonRequest<any>("GET", "/ConstructionType?pageSize=10000"),
      jsonRequest<any>("GET", "/TypeOfUse?pageSize=10000"),
      jsonRequest<any>("GET", "/SubTypeOfUse?pageSize=10000"),
    ]);

    const extractItems = (res: ApiResponse<any>): any[] => {
      if (!res.success || !res.data) return [];
      let items = [];
      if (Array.isArray(res.data.items)) items = res.data.items;
      else if (Array.isArray(res.data)) items = res.data;
      else return [];

      return items.filter((item: any) => 
        item.isActive !== false && item.isActive !== 0 && 
        item.IsActive !== false && item.IsActive !== 0 && 
        item.status?.toLowerCase() !== 'inactive'
      );
    };

    const floorList = extractItems(floorRes);
    const conList = extractItems(conRes);
    const useList = extractItems(useRes);
    const subUseList = extractItems(subRes);

    const floorLevels = floorList.map((f: any) => {
      const code = f.floorNo ?? f.floorCode ?? f.id;
      const desc = f.description ?? f.floorName ?? "";
      return { label: desc ? `${code} - ${desc}` : String(code), value: String(f.id) };
    });

    const constructionTypes = conList.map((c: any) => {
      const code = c.constructionCode ?? c.code ?? c.id;
      const desc = c.description ?? c.constructionName ?? "";
      return { label: desc ? `${code} - ${desc}` : String(code), value: String(c.id) };
    });

    const useTypes = useList.map((u: any) => {
      const code = u.typeCode ?? u.code ?? u.typeOfUseId ?? u.id;
      const desc = u.description ?? u.typeName ?? "";
      return { label: desc ? `${code} - ${desc}` : String(code), value: String(u.typeOfUseId ?? u.id) };
    });

    const subUseTypes = subUseList.map((s: any) => {
      const code = s.subTypeCode ?? s.code ?? s.subTypeOfUseId ?? s.id;
      const desc = s.description ?? s.subTypeName ?? "";
      return { 
        label: desc ? `${code} - ${desc}` : String(code), 
        value: String(s.subTypeOfUseId ?? s.id),
        typeOfUseId: s.typeOfUseId ? String(s.typeOfUseId) : null
      };
    });

    return {
      success: true,
      data: {
        floorLevels,
        constructionTypes,
        useTypes,
        subUseTypes,
        unitTypes: [
          { label: "Flat", value: "Flat" },
          { label: "Shop", value: "Shop" },
          { label: "Office", value: "Office" },
          { label: "Room", value: "Room" }
        ]
      }
    };
  },

  /**
   * Bulk generate child assets under a parent building
   */
  bulkGenerateSubUnits: async (
    data: BulkGenerateChildAssetsRequest
  ): Promise<ApiResponse<BulkGenerateChildAssetsResponse>> => {
    return jsonRequest<BulkGenerateChildAssetsResponse>("POST", "/ManageSubUnits/bulk-generate", data);
  },

  /**
   * Create a single child asset with rooms and rent information
   */
  createChildAsset: async (
    data: CreateChildAssetRequest
  ): Promise<ApiResponse<CreateChildAssetResponse>> => {
    return jsonRequest<CreateChildAssetResponse>("POST", "/ManageSubUnits/create", data);
  },

  /**
   * Trigger CV (Capital Value) calculation for a specific floor detail record.
   * Updates AssetFloorDetails.CapitalValue and propagates to all sub-units on the floor.
   */
  calculateFloorCV: async (floorDetailId: number): Promise<ApiResponse<any>> => {
    return jsonRequest<any>("POST", `/AssetFloorDetails/${floorDetailId}/calculate-capital-value`);
  }
};
