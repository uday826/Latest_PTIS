"use server";

import { cookies } from "next/headers";
import { floorDetailsService } from "@/lib/api/asset/floor-details.service";
import { manageSubUnitsService } from "@/lib/api/asset/manage-subunits.service";
import { logger } from "@/lib/utils/logger";
import { ActionResult } from "@/types/common.types";
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

const getArray = (d: unknown): any[] => {
  if (!d) return [];
  if (Array.isArray(d)) return d;
  const obj = d as Record<string, unknown>;
  const itemsObj = obj.items as Record<string, unknown> | undefined;
  const arr = itemsObj?.floorDetails || obj.items || obj.floorDetails || obj.data;
  return Array.isArray(arr) ? arr : [];
};

export async function fetchFloorsByAsset(assetId: number): Promise<ActionResult<FloorDetailApiResponse[]>> {
  try {
    const res = await floorDetailsService.getFloorsByAsset(assetId);
    return { success: true, data: res.success ? getArray(res.data) : [] };
  } catch { return { success: true, data: [] }; }
}

export async function saveFloorDetail(data: FloorDetailApiRequest): Promise<ActionResult<FloorDetailApiResponse>> {
  try {
    const cookieStore = await cookies();
    const userIdStr = cookieStore.get("user_id")?.value;
    const userId = userIdStr ? Number(userIdStr) : undefined;

    const payload = {
      ...data,
      createdBy: userId ?? data.createdBy ?? 1,
    };
    const res = await floorDetailsService.createFloor(payload);
    if (res.success && res.data) {
      const body = res.data as any;
      if (body.success) {
        return { success: true, data: body.items };
      } else {
        return { success: false, error: body.message || "Failed to save floor detail" };
      }
    }
    return { success: false, error: res.error ?? "Failed to save floor detail" };
  } catch (err: any) {
    logger.error("saveFloorDetail Error:", { error: err });
    return { success: false, error: "Network error saving floor detail" };
  }
}

export async function updateFloorDetail(id: number, data: Partial<FloorDetailApiRequest>): Promise<ActionResult<FloorDetailApiResponse>> {
  try {
    const getRes = await floorDetailsService.getFloorById(id);
    if (!getRes.success || !getRes.data) {
      return { success: false, error: getRes.error ?? "Failed to fetch floor detail" };
    }
    const res = await floorDetailsService.updateFloor(id, {
      ...getRes.data,
      ...data
    });
    if (res.success && res.data) {
      const body = res.data as any;
      if (body.success) {
        return { success: true, data: body.items };
      } else {
        return { success: false, error: body.message || "Failed to update floor detail" };
      }
    }
    return { success: false, error: res.error ?? "Failed to update floor detail" };
  } catch (err: any) {
    logger.error("updateFloorDetail Error:", { error: err });
    return { success: false, error: "Network error updating floor detail" };
  }
}

export async function deleteFloorDetail(id: number): Promise<ActionResult<void>> {
  try {
    const getRes = await floorDetailsService.getFloorById(id);
    if (!getRes.success || !getRes.data) {
      return { success: false, error: getRes.error ?? "Failed to fetch floor detail for deletion" };
    }
    
    const res = await floorDetailsService.updateFloor(id, {
      ...getRes.data,
      markedForDeletion: true,
      markedForDeletionDate: new Date().toISOString(),
      isActive: false
    });
    return res.success ? { success: true } : { success: false, error: res.error ?? "Failed to delete floor detail" };
  } catch (err: any) {
    logger.error("deleteFloorDetail Error:", { error: err });
    return { success: false, error: "Network error deleting floor detail" };
  }
}

export async function fetchSubUnitsByFloor(floorDetailId: number): Promise<ActionResult<SubUnitApiResponse[]>> {
  try {
    const res = await floorDetailsService.getSubUnitsByFloor(floorDetailId);
    return { success: true, data: res.success ? getArray(res.data) : [] };
  } catch (err: any) {
    logger.error("fetchSubUnitsByFloor Error:", { error: err });
    return { success: true, data: [] };
  }
}

export async function saveSubUnit(data: SubUnitApiRequest): Promise<ActionResult<SubUnitApiResponse>> {
  try {
    const res = await floorDetailsService.createSubUnit(data);
    return res.success && res.data ? { success: true, data: res.data } : { success: false, error: res.error ?? "Failed to save sub-unit" };
  } catch (err: any) {
    logger.error("saveSubUnit Error:", { error: err });
    return { success: false, error: "Network error saving sub-unit" };
  }
}

export async function deleteSubUnit(id: number): Promise<ActionResult<void>> {
  try {
    const res = await floorDetailsService.deleteSubUnit(id);
    return res.success ? { success: true } : { success: false, error: res.error ?? "Failed to delete sub-unit" };
  } catch (err: any) {
    logger.error("deleteSubUnit Error:", { error: err });
    return { success: false, error: "Network error deleting sub-unit" };
  }
}

export async function updateSubUnitAction(id: number, data: Partial<SubUnitApiRequest>): Promise<ActionResult<SubUnitApiResponse>> {
  try {
    const res = await floorDetailsService.updateSubUnit(id, data);
    if (res.success && res.data) {
      const body = res.data as any;
      if (body.success) {
        return { success: true, data: body.items };
      } else {
        return { success: false, error: body.message || "Failed to update sub-unit" };
      }
    }
    return { success: false, error: res.error ?? "Failed to update sub-unit" };
  } catch (err: any) {
    logger.error("updateSubUnitAction Error:", { error: err });
    return { success: false, error: "Network error updating sub-unit" };
  }
}

export async function fetchFloorDropdownOptions(): Promise<ActionResult<FloorDropdownOptions>> {
  try {
    const res = await floorDetailsService.getFloorDropdownOptions();
    return res.success && res.data ? { success: true, data: res.data } : { success: false, error: res.error ?? "Failed to fetch dropdown options" };
  } catch { return { success: false, error: "Network error fetching dropdown options" }; }
}

export interface FloorStepData {
  dropdownOptions: FloorDropdownOptions;
  floors: FloorDetailApiResponse[];
}

export async function fetchFloorStepData(assetId: number): Promise<ActionResult<FloorStepData>> {
  try {
    const [optRes, flrRes] = await Promise.all([
      floorDetailsService.getFloorDropdownOptions(),
      floorDetailsService.getFloorsByAsset(assetId)
    ]);
    if (!optRes.success || !optRes.data) return { success: false, error: optRes.error || "Failed to load dropdown options" };

    return {
      success: true,
      data: {
        dropdownOptions: optRes.data,
        floors: flrRes.success ? getArray(flrRes.data) : []
      }
    };
  } catch (err: any) {
    logger.error("fetchFloorStepData Error:", { error: err });
    return { success: false, error: "Network error loading step configurations" };
  }
}

/**
 * Server action to bulk generate sub-units / child assets under a parent building
 */
export async function bulkGenerateSubUnitsAction(
  data: BulkGenerateChildAssetsRequest
): Promise<ActionResult<BulkGenerateChildAssetsResponse>> {
  try {
    const cookieStore = await cookies();
    const userIdStr = cookieStore.get("user_id")?.value;
    const userId = userIdStr ? Number(userIdStr) : undefined;

    const payload = {
      ...data,
      createdBy: userId ?? data.createdBy ?? 1,
    };
    const res = await floorDetailsService.bulkGenerateSubUnits(payload);
    if (res.success && res.data) {
      const body = res.data as any;
      if (body.success) {
        return { success: true, data: body.items };
      } else {
        return { success: false, error: body.message || "Failed to bulk generate sub-units" };
      }
    }
    return { success: false, error: res.error ?? "Failed to bulk generate sub-units" };
  } catch (err: any) {
    logger.error("bulkGenerateSubUnitsAction Error:", { error: err });
    return { success: false, error: "Network error bulk generating sub-units" };
  }
}

/**
 * Server action to create a single detailed child asset with room configuration and rent info
 */
export async function createChildAssetAction(
  data: CreateChildAssetRequest
): Promise<ActionResult<CreateChildAssetResponse>> {
  try {
    const cookieStore = await cookies();
    const userIdStr = cookieStore.get("user_id")?.value;
    const userId = userIdStr ? Number(userIdStr) : undefined;

    const payload = {
      ...data,
      createdBy: userId ?? data.createdBy ?? 1,
    };
    const res = await manageSubUnitsService.create(payload as any);
    console.error("[createChildAssetAction] res ->", JSON.stringify(res, null, 2));
    if (res.success && res.data) {
      return {
        success: true,
        data: {
          success: true,
          message: res.message || "Detailed child asset created successfully",
          assetId: res.data.assetId || (res.data as any).id || null,
          assetNo: res.data.unitNo || (res.data as any).assetNo || null,
          roomWiseSubmissionDetailsId: (res.data as any).roomWiseSubmissionDetailsId || null,
          errors: [],
        },
      };
    }
    const errorDetails = res.message + (res.error ? ` (${res.error})` : "") + (res.statusCode ? ` [Status: ${res.statusCode}]` : "");
    return { success: false, error: errorDetails };
  } catch (err: any) {
    logger.error("createChildAssetAction Error:", { error: err });
    return { success: false, error: "Network error creating detailed child asset: " + err.message };
  }
}

/**
 * Server action to retrieve complete details (rooms, renter) of a child asset by ID
 */
export async function getChildAssetByIdAction(assetId: number): Promise<ActionResult<any>> {
  try {
    const res = await manageSubUnitsService.getById(assetId);
    if (res.success && res.data) {
      return { success: true, data: res.data };
    }
    return { success: false, error: res.error || "Failed to fetch child asset details" };
  } catch (err: any) {
    logger.error("getChildAssetByIdAction Error:", { error: err });
    return { success: false, error: "Network error fetching child asset details: " + err.message };
  }
}

/**
 * Server action to retrieve all subunits under a parent building
 */
export async function getSubUnitsByAssetAction(parentAssetId: number): Promise<ActionResult<any[]>> {
  try {
    const res = await manageSubUnitsService.getByAssetId(parentAssetId);
    if (res.success && res.data) {
      return { success: true, data: res.data };
    }
    return { success: false, error: res.error || "Failed to fetch subunits" };
  } catch (err: any) {
    logger.error("getSubUnitsByAssetAction Error:", { error: err });
    return { success: false, error: "Network error fetching subunits: " + err.message };
  }
}


