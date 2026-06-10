"use server";

import {
  departmentAllocationService,
  type CreateAllocationPayload,
  type TransferDepartmentPayload,
} from "@/lib/api/asset/department-allocation.service";
import { floorDetailsService } from "@/lib/api/asset/floor-details.service";
import { apiClient } from "@/services/api.service";

export async function getAllocationsAction(assetId: number, statusFilter?: string) {
  return departmentAllocationService.getByBuilding(assetId, statusFilter as "Active" | "Historical" | undefined);
}

export async function getDepartmentsListAction() {
  try {
    const res = await apiClient.get<any>("/DepartmentMaster?pageSize=1000");
    if (res.success && res.data) {
      const items = Array.isArray(res.data) ? res.data : res.data.items ?? res.data.data ?? [];
      return {
        success: true,
        data: items.map((d: any) => ({
          id: d.id,
          departmentName: d.departmentName ?? d.DepartmentName ?? `Dept ${d.id}`,
        })),
      };
    }
    return { success: false, data: [] };
  } catch (e: any) {
    return { success: false, data: [], error: e.message };
  }
}

export async function getFloorsListAction(assetId: number) {
  try {
    const res = await floorDetailsService.getFloorsByAsset(assetId);
    if (res?.success && res.data) {
      const floorList = Array.isArray(res.data) ? res.data : (res.data as any).floorDetails ?? (res.data as any).items ?? [];
      return {
        success: true,
        data: floorList.map((f: any) => ({
          id: f.id,
          floorName: f.floorName ?? f.floorDescription ?? `Floor ${f.floorId ?? f.id}`,
        })),
      };
    }
    return { success: false, data: [] };
  } catch (e: any) {
    return { success: false, data: [], error: e.message };
  }
}

export async function allocateDepartmentAction(payload: CreateAllocationPayload) {
  return departmentAllocationService.allocate(payload);
}

export async function transferDepartmentAction(payload: TransferDepartmentPayload) {
  return departmentAllocationService.transfer(payload);
}

export async function vacateDepartmentAction(ids: number[]) {
  return departmentAllocationService.vacate({
    allocationIds: ids,
    vacateDate: new Date().toISOString().slice(0, 10),
  });
}

export async function getRoomHistoryAction(floorDetailId: number, roomAssetId?: number, roomDescription?: string) {
  return departmentAllocationService.getRoomHistory(floorDetailId, roomAssetId, roomDescription);
}
