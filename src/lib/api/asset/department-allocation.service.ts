import { apiClient } from "@/services/api.service";
import { ApiResponse } from "@/types/common.types";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DepartmentRoomAllocation {
  id: number;
  buildingAssetId: number;
  buildingAssetName?: string;
  floorDetailId: number;
  floorName?: string;
  roomAssetId?: number;
  roomAssetName?: string;
  roomDescription?: string;
  departmentId?: number;
  departmentName?: string;
  tenantName?: string;
  allocationType: "Department" | "Tenant";
  allocationFrom: string;
  allocationTo?: string;
  status: "Active" | "Transferred" | "Vacated";
  remarks?: string;
  previousAllocationId?: number;
  isCurrentlyActive: boolean;
  createdDate?: string;
  updatedDate?: string;
}

export interface CreateAllocationPayload {
  buildingAssetId: number;
  floorDetailId: number;
  roomAssetId?: number;
  roomDescription?: string;
  departmentId?: number;
  tenantName?: string;
  allocationType: "Department" | "Tenant";
  allocationFrom: string;
  remarks?: string;
}

export interface TransferDepartmentPayload {
  departmentId?: number;
  tenantName?: string;
  newBuildingAssetId: number;
  newFloorDetailId: number;
  newRoomAssetId?: number;
  newRoomDescription?: string;
  transferDate: string;
  remarks?: string;
}

export interface VacateRoomsPayload {
  allocationIds: number[];
  vacateDate: string;
  remarks?: string;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const departmentAllocationService = {
  /** All allocations for a building. statusFilter: "Active" | "Historical" | undefined (all) */
  getByBuilding: async (
    buildingAssetId: number,
    statusFilter?: "Active" | "Historical"
  ): Promise<ApiResponse<DepartmentRoomAllocation[]>> => {
    const qs = statusFilter ? `?statusFilter=${statusFilter}` : "";
    const res = await apiClient.get<any>(
      `/DepartmentRoomAllocation/by-building/${buildingAssetId}${qs}`
    );
    if (res.success && res.data) {
      const items = Array.isArray(res.data)
        ? res.data
        : res.data.items ?? [];
      return { ...res, data: items };
    }
    return { ...res, data: [] };
  },

  /** Full occupancy history for a room */
  getRoomHistory: async (
    floorDetailId: number,
    roomAssetId?: number,
    roomDescription?: string
  ): Promise<ApiResponse<DepartmentRoomAllocation[]>> => {
    const params = new URLSearchParams({ floorDetailId: String(floorDetailId) });
    if (roomAssetId) params.set("roomAssetId", String(roomAssetId));
    if (roomDescription) params.set("roomDescription", roomDescription);
    const res = await apiClient.get<any>(
      `/DepartmentRoomAllocation/room-history?${params}`
    );
    if (res.success && res.data) {
      return { ...res, data: Array.isArray(res.data) ? res.data : res.data.items ?? [] };
    }
    return { ...res, data: [] };
  },

  /** All allocations ever for a department or tenant */
  getDepartmentHistory: async (
    departmentId?: number,
    tenantName?: string
  ): Promise<ApiResponse<DepartmentRoomAllocation[]>> => {
    const params = new URLSearchParams();
    if (departmentId) params.set("departmentId", String(departmentId));
    if (tenantName) params.set("tenantName", tenantName);
    const res = await apiClient.get<any>(
      `/DepartmentRoomAllocation/department-history?${params}`
    );
    if (res.success && res.data) {
      return { ...res, data: Array.isArray(res.data) ? res.data : res.data.items ?? [] };
    }
    return { ...res, data: [] };
  },

  /** Allocate a room to a department/tenant */
  allocate: async (
    payload: CreateAllocationPayload
  ): Promise<ApiResponse<DepartmentRoomAllocation>> => {
    return apiClient.post("/DepartmentRoomAllocation/allocate", payload);
  },

  /** Transfer department/tenant to a new location */
  transfer: async (
    payload: TransferDepartmentPayload
  ): Promise<ApiResponse<DepartmentRoomAllocation>> => {
    return apiClient.post("/DepartmentRoomAllocation/transfer", payload);
  },

  /** Mark allocations as vacated */
  vacate: async (
    payload: VacateRoomsPayload
  ): Promise<ApiResponse<boolean>> => {
    return apiClient.post("/DepartmentRoomAllocation/vacate", payload);
  },
};
