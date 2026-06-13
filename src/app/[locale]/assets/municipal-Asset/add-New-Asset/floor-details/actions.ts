"use server";

import 'server-only';
import { floorDetailsService } from "@/lib/api/asset/floor-details.service";
import { manageSubUnitsService } from "@/lib/api/asset/manage-subunits.service";
import { assetRoomWiseMinusDataService } from "@/lib/api/asset/asset-room-wise-minus-data.service";
import { assetMasterService } from "@/lib/api/asset/asset-master.service";
import { apiClient } from "@/services/api.service";
import { logger } from "@/lib/utils/logger";
import {
  BulkGenerateChildAssetsRequest,
  BulkGenerateChildAssetsResponse,
  CreateChildAssetRequest,
  CreateChildAssetResponse,
  FloorDetailApiRequest,
  FloorDetailApiResponse,
  FloorDropdownOptions,
  SubUnitApiRequest,
  SubUnitApiResponse,
} from "@/types/asset/floor-details.types";
import { ActionResult } from "@/types/common.types";
import { cookies } from "next/headers";

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
    console.log("[DEBUG] fetchFloorsByAsset res:", JSON.stringify(res));
    return { success: true, data: res.success ? getArray(res.data) : [] };
  } catch (err) {
    console.error("[DEBUG] fetchFloorsByAsset error:", err);
    return { success: true, data: [] };
  }
}

export async function saveFloorDetail(data: FloorDetailApiRequest): Promise<ActionResult<FloorDetailApiResponse>> {
  try {
    const cookieStore = await cookies();
    const userIdStr = cookieStore.get("user_id")?.value;
    const userId = userIdStr ? Number(userIdStr) : undefined;
    const token = cookieStore.get("auth_token")?.value;

    const payload = {
      ...data,
      createdBy: userId ?? data.createdBy ?? 1,
    };

    const { getAppConfig } = await import("@/config/app.config");
    const config = getAppConfig();
    const url = `${config.api.baseUrl.replace(/\/$/, "")}/AssetFloorDetails`;

    let response: Response;
    const isDev = process.env.NODE_ENV === 'development' && process.env.NTIS_STRICT_LOCAL_TLS !== '1';
    const init = {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Accept": "application/json, text/plain, */*",
        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    };

    const LOCAL_HTTPS_RE = /^https:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//;
    if (isDev && LOCAL_HTTPS_RE.test(url)) {
      const { Agent, fetch: uFetch } = await import('undici');
      const relaxedAgent = new Agent({ connect: { rejectUnauthorized: false } });
      response = await uFetch(url, {
        ...init,
        dispatcher: relaxedAgent,
      } as any) as any;
    } else {
      response = await fetch(url, init);
    }

    const text = await response.text();
    if (!response.ok) {
      return { success: false, error: text || response.statusText || "Failed to save floor detail" };
    }

    const trimmed = text.trim();
    let resData: any = trimmed;
    if (/^\d+$/.test(trimmed)) {
      resData = Number(trimmed);
    } else {
      try {
        resData = JSON.parse(trimmed);
      } catch {}
    }

    return { success: true, data: resData };
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
      if (body.success === false) {
        return { success: false, error: body.message || "Failed to update floor detail" };
      }
      return { success: true, data: body.items || body.data || body };
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

export async function fetchSubUseTypesAction(typeOfUseId: number): Promise<ActionResult<any[]>> {
  try {
    const res = await apiClient.get<any>(`/SubTypeOfUse?typeOfUseId=${typeOfUseId}&pageSize=10000`);
    if (res.success && res.data) {
      const items = res.data.items || res.data;
      if (Array.isArray(items)) {
        const mapped = items
          .filter((s: any) => 
            s.isActive !== false && s.isActive !== 0 && 
            s.IsActive !== false && s.IsActive !== 0 && 
            s.status?.toLowerCase() !== 'inactive'
          )
          .map((s: any) => {
            const code = s.subTypeCode ?? s.code ?? s.id;
            const desc = s.description ?? s.subTypeName ?? "";
            return {
              label: desc ? `${code} - ${desc}` : String(code),
              value: String(s.id),
              typeOfUseId: String(s.typeOfUseId || typeOfUseId),
            };
          });
        return { success: true, data: mapped };
      }
    }
    return { success: true, data: [] };
  } catch (err: any) {
    logger.error("fetchSubUseTypesAction Error:", { error: err });
    return { success: false, error: "Network error fetching sub-use types" };
  }
}

export async function fetchSubFloorAction(floorId: number): Promise<ActionResult<any[]>> {
  try {
    const res = await apiClient.get<any>(`/SubFloor?floorId=${floorId}&pageSize=10000`);
    if (res.success && res.data) {
      const items = res.data.items || res.data;
      if (Array.isArray(items)) {
        const mapped = items.map((s: any) => {
          const desc = s.subFloorDescription ?? s.description ?? s.subFloorName ?? String(s.id);
          return {
            label: desc,
            value: String(s.id),
            floorId: String(s.floorId || floorId),
          };
        });
        return { success: true, data: mapped };
      }
    }
    return { success: true, data: [] };
  } catch (err: any) {
    logger.error("fetchSubFloorAction Error:", { error: err });
    return { success: false, error: "Network error fetching sub floors" };
  }
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

    // Helper to format dates for API compatibility (yyyy-MM-ddTHH:mm:ss)
    const toApiDateString = (val: any): string | null => {
      if (!val) return null;
      const str = String(val).trim();
      if (!str) return null;
      if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
        return `${str}T00:00:00`;
      }
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(str)) {
        return str;
      }
      try {
        const d = new Date(str);
        if (!isNaN(d.getTime())) {
          return d.toISOString().replace(/\.\d{3}Z$/, '');
        }
      } catch {}
      return null;
    };

    const normalizedRentInfo = data.rentInformation ? {
      ...data.rentInformation,
      leaseStart: data.rentInformation.leaseStart ? new Date(data.rentInformation.leaseStart).toISOString() : null,
      leaseEnd: data.rentInformation.leaseEnd ? new Date(data.rentInformation.leaseEnd).toISOString() : null,
    } : null;

    const payload = {
      ...data,
      rentInformation: normalizedRentInfo,
      createdBy: userId ?? data.createdBy ?? 1,
      // Map to correct backend DTO naming/casing
      FloorId: data.floorDetailsId,
      FloorDetailsId: data.floorDetailsId,
      ShopNo: data.unitNo,
      ShopName: data.shopUnitName,
      TotalAreaSqFt: data.totalAreaSqFt,
      SubFloorId: data.subFloorId,
    };

    logger.info("createChildAssetAction: Calling manageSubUnitsService.create with payload", { payload });
    const res = await manageSubUnitsService.create(payload as any);
    logger.info("createChildAssetAction: API response", { response: res });

    if (res.success && res.data) {
      const createdAssetId = res.data.assetId || (res.data as any).id || (res.data as any).AssetId || (res.data as any).assetID;
      const roomWiseSubmissionDetailId = (res.data as any).roomWiseSubmissionDetailId || 
                                         (res.data as any).RoomWiseSubmissionDetailId || 
                                         (res.data as any).roomWiseSubmissionDetailsId || 
                                         (res.data as any).RoomWiseSubmissionDetailsId || 
                                         null;
      if (createdAssetId) {
        // Always fetch parent asset details to get its address, latitude, and longitude
        let resolvedAddress = data.locationAddress;
        let resolvedLat = data.locationLat;
        let resolvedLng = data.locationLng;

        if (data.parentAssetId) {
          try {
            const parentRes = await assetMasterService.getAssetById(data.parentAssetId);
            if (parentRes.success && parentRes.data) {
              const pData = parentRes.data as any;
              resolvedAddress = pData.address || resolvedAddress;
              resolvedLat = pData.latitude ? String(pData.latitude) : resolvedLat;
              resolvedLng = pData.longitude ? String(pData.longitude) : resolvedLng;
            }
          } catch (parentErr) {
            logger.error("Failed to fetch parent asset for location details sync:", { error: parentErr as Error });
          }
        }

        // Since the backend's /ManageSubUnits/create DTO ignores departmentId and location details,
        // we update the child asset's AssetMaster record directly to save them.
        if (data.departmentId || data.shopUnitName || resolvedAddress || resolvedLat || resolvedLng) {
          try {
            const updatePayload: any = {};
            if (data.departmentId) updatePayload.departmentId = Number(data.departmentId);
            if (data.shopUnitName) updatePayload.assetName = data.shopUnitName;
            if (resolvedAddress) updatePayload.address = resolvedAddress;
            if (resolvedLat) {
              updatePayload.latitude = String(resolvedLat);
            }
            if (resolvedLng) {
              updatePayload.longitude = String(resolvedLng);
            }
            logger.info("createChildAssetAction: Updating AssetMaster " + createdAssetId, { updatePayload });
            const masterRes = await apiClient.put(`/AssetMaster/${createdAssetId}`, updatePayload);
            logger.info("createChildAssetAction: AssetMaster update response", { response: masterRes });
          } catch (updateErr: any) {
            logger.error("Failed to update child asset master with department/location:", { error: updateErr });
          }
        }

        // Since /ManageSubUnits/create does not persist the renter details directly,
        // we update the associated AssetLeaseRentDetails record using its ID.
        let renterDetailsId = (res.data as any).renterDetailsId || (res.data as any).renterDetails?.id;
        logger.info("createChildAssetAction: Initial renterDetailsId from create response:", {
          renterDetailsId,
          data: res.data
        });

        if (!renterDetailsId) {
          try {
            const getRes = await manageSubUnitsService.getById(createdAssetId);
            logger.info("createChildAssetAction: Fetching subunit by ID response:", {
              success: getRes.success,
              data: getRes.data
            });
            if (getRes.success && getRes.data) {
              const detail = getRes.data as any;
              renterDetailsId = detail.renterDetailsId || 
                                detail.renterDetails?.id || 
                                (Array.isArray(detail.renterDetails) && detail.renterDetails[0]?.id) ||
                                (detail.renterDetailsList && detail.renterDetailsList[0]?.id);
              logger.info("createChildAssetAction: Resolved renterDetailsId from fetched details:", { renterDetailsId });
            }
          } catch (getErr: any) {
            logger.error("Failed to fetch subunit details to resolve renterDetailsId:", { error: getErr });
          }
        }

        // Fallback: Query /AssetLeaseRentDetails by assetId if renterDetailsId is not found
        if (!renterDetailsId) {
          try {
            logger.info("createChildAssetAction: Querying /AssetLeaseRentDetails for assetId " + createdAssetId);
            const listRes = await apiClient.get<any>(`/AssetLeaseRentDetails?AssetId=${createdAssetId}`);
            if (listRes.success && listRes.data) {
              const items = listRes.data.items || listRes.data.data || (Array.isArray(listRes.data) ? listRes.data : []);
              if (items.length > 0) {
                renterDetailsId = items[0].id;
                logger.info("createChildAssetAction: Resolved renterDetailsId from lease list query:", { renterDetailsId });
              }
            }
          } catch (listErr: any) {
            logger.error("Failed to query /AssetLeaseRentDetails to resolve renterDetailsId:", { error: listErr });
          }
        }

        const rentInfo = data.rentInformation;
        const leaseStartDateStr = toApiDateString(rentInfo?.leaseStart);
        const leaseEndDateStr = toApiDateString(rentInfo?.leaseEnd);

        if (renterDetailsId) {
          try {
            const renterPayload: any = {
              id: Number(renterDetailsId),
              parentAssetId: Number(data.parentAssetId),
              assetId: Number(createdAssetId),
              floorDetailsId: data.floorDetailsId ? Number(data.floorDetailsId) : null,
              floorId: data.floorId ? Number(data.floorId) : null,
              subFloorId: data.subFloorId ? Number(data.subFloorId) : null,
              roomWiseSubmissionDetailsId: roomWiseSubmissionDetailId ? Number(roomWiseSubmissionDetailId) : null,
              shopNo: data.unitNo || null,
              shopName: data.shopUnitName || null,
              tenantName: data.renterName || "N/A",
              renterName: data.renterName || "N/A",
              tenantMobile: data.mobileNo || "9999999999",
              mobileNo: data.mobileNo || "9999999999",
              tenantEmail: data.emailId || null,
              emailId: data.emailId || null,
              tenantAadhaarNo: data.aadhaarCardNo || null,
              aadhaarCardNo: data.aadhaarCardNo || null,
              tenantPanCardNo: data.panCardNo || null,
              panCardNo: data.panCardNo || null,
              gstNo: data.gstNo || null,
              tenantAddress: data.locationAddress || null,
              leaseRentType: rentInfo?.leaseRentType || null,
              leaseStartDate: leaseStartDateStr,
              fromDate: leaseStartDateStr,
              leaseEndDate: leaseEndDateStr,
              toDate: leaseEndDateStr,
              duration: rentInfo?.duration ? Number(rentInfo.duration) : 0,
              paymentFrequency: rentInfo?.rentFrequency || null,
              rentAmount: rentInfo?.rentAmount ? Number(rentInfo.rentAmount) : 0,
              monthlyRent: rentInfo?.rentAmount ? Number(rentInfo.rentAmount) : 0,
              rentMonthly: rentInfo?.rentAmount ? Number(rentInfo.rentAmount) : 0,
              securityDeposit: rentInfo?.securityDeposit ? Number(rentInfo.securityDeposit) : 0,
              depositType: rentInfo?.depositType || null,
              isActive: true,
            };
            
            logger.info("createChildAssetAction: Sending PUT to /AssetLeaseRentDetails/" + renterDetailsId, { renterPayload });
            const putRes = await apiClient.put(`/AssetLeaseRentDetails/${renterDetailsId}`, renterPayload);
            logger.info("createChildAssetAction: PUT response", { response: putRes });
            if (!putRes.success) {
              logger.error("createChildAssetAction: PUT to /AssetLeaseRentDetails failed", { error: new Error(putRes.error || "Unknown error") });
              return { success: false, error: `Failed to save renter details: ${putRes.error}` };
            }
          } catch (renterErr: any) {
            logger.error("Failed to update child asset renter details:", renterErr);
            return { success: false, error: `Failed to save renter details: ${renterErr.message || renterErr}` };
          }
        } else if (data.renterName || rentInfo?.leaseRentType) {
          // If no renterDetailsId is associated yet, create a new registration record
          try {
            const isLease = (rentInfo?.leaseRentType || "").toLowerCase().includes("lease");
            const regPayload: any = {
              isActive: true,
              createdBy: userId ?? 1,
              assetId: Number(createdAssetId),
              applicationTypeId: 1, // APP-NEW
              shopNo: data.unitNo || null,
              shopName: data.shopUnitName || null,
              floorDetailsId: data.floorDetailsId ? Number(data.floorDetailsId) : null,
              floorId: data.floorId ? Number(data.floorId) : null,
              subFloorId: data.subFloorId ? Number(data.subFloorId) : null,
              roomWiseSubmissionDetailsId: roomWiseSubmissionDetailId ? Number(roomWiseSubmissionDetailId) : null,
              tenantName: data.renterName || "N/A",
              renterName: data.renterName || "N/A",
              tenantMobile: data.mobileNo || "9999999999",
              mobileNo: data.mobileNo || "9999999999",
              tenantEmail: data.emailId || null,
              emailId: data.emailId || null,
              tenantType: "Individual",
              tenantAadhaarNo: data.aadhaarCardNo || null,
              aadhaarCardNo: data.aadhaarCardNo || null,
              tenantPanCardNo: data.panCardNo || null,
              panCardNo: data.panCardNo || null,
              tenantAddress: data.locationAddress || null,
              locality: data.locationAddress || null,
              leaseType: isLease ? "Lease" : "Rent",
              leaseStartDate: leaseStartDateStr,
              fromDate: leaseStartDateStr,
              leaseEndDate: leaseEndDateStr,
              toDate: leaseEndDateStr,
              monthlyRent: rentInfo?.rentAmount ? Number(rentInfo.rentAmount) : 0,
              securityDeposit: rentInfo?.securityDeposit ? Number(rentInfo.securityDeposit) : 0,
              paymentFrequency: rentInfo?.rentFrequency || "Monthly",
              reason: data.propertyDescription || null,
            };

            logger.info("createChildAssetAction: Sending POST to /LeaseRentRegistration", { regPayload });
            const postRes = await apiClient.post<any>("/LeaseRentRegistration", regPayload);
            logger.info("createChildAssetAction: POST /LeaseRentRegistration response", { response: postRes });
            if (!postRes.success) {
              logger.error("createChildAssetAction: POST to /LeaseRentRegistration failed", { error: new Error(postRes.error || "Unknown error") });
              return { success: false, error: `Failed to register renter: ${postRes.error}` };
            }
          } catch (regErr: any) {
            logger.error("Failed to create child asset renter details registration:", regErr);
            return { success: false, error: `Failed to register renter: ${regErr.message || regErr}` };
          }
        }

        // Resolve room-wise submission IDs and save offsets
        if (data.rooms && Array.isArray(data.rooms)) {
          try {
            const getRes = await manageSubUnitsService.getById(createdAssetId);
            if (getRes.success && getRes.data) {
              const detail = getRes.data as any;
              const dbRooms = detail.roomWiseDetails || [];
              
              for (const inputRoom of data.rooms) {
                // Find matching room in DB by roomNo
                const dbRoom = dbRooms.find((r: any) => String(r.roomNo) === String(inputRoom.roomNo));
                if (dbRoom && dbRoom.id) {
                  const roomWiseSubmissionId = dbRoom.id;

                  // ── DELETE existing minus-data rows for this room before re-inserting ──
                  // This prevents duplicate accumulation across multiple "Save & Next" calls.
                  try {
                    const existingMinusRes = await assetRoomWiseMinusDataService.getAll(roomWiseSubmissionId);
                    if (existingMinusRes.success && existingMinusRes.data) {
                      // Handle both flat-array and PagedResult shapes
                      let existingItems: any[];
                      if (Array.isArray(existingMinusRes.data)) {
                        existingItems = existingMinusRes.data;
                      } else {
                        const paged = existingMinusRes.data as any;
                        existingItems = Array.isArray(paged.items)
                          ? paged.items
                          : Array.isArray(paged.data)
                            ? paged.data
                            : [];
                      }
                      const filtered = existingItems.filter(
                        (item: any) => Number(item.roomWiseSubmissionId) === Number(roomWiseSubmissionId)
                      );
                      for (const existing of filtered) {
                        if (existing.id) {
                          await assetRoomWiseMinusDataService.delete(Number(existing.id));
                          logger.info(`createChildAssetAction: Deleted existing offset ID ${existing.id} for room ${roomWiseSubmissionId}`);
                        }
                      }
                    }
                  } catch (delErr: any) {
                    logger.warn(`createChildAssetAction: Could not clean existing offsets for room ${roomWiseSubmissionId}:`, { error: delErr });
                  }

                  // ── INSERT new offset rows ──
                  if (inputRoom.offsets && Array.isArray(inputRoom.offsets) && inputRoom.offsets.length > 0) {
                    logger.info(`createChildAssetAction: Saving ${inputRoom.offsets.length} offsets for roomNo ${inputRoom.roomNo} (submissionId ${roomWiseSubmissionId}).`);
                    for (const offset of inputRoom.offsets) {
                      const offsetPayload = {
                        roomWiseSubmissionId: roomWiseSubmissionId,
                        lengthMtr: offset.length || (offset.shape === "Circle" || offset.shape === "Semi Circle" || offset.shape === "Quarter" ? offset.radius : 0),
                        widthMtr: offset.width || 0,
                        areaSqMtr: offset.areaSqM || 0,
                        heightMtr: offset.height || 0,
                        base1Mtr: offset.base1 || 0,
                        base2Mtr: offset.base2 || 0,
                        shape: offset.shape || "Rectangle",
                        isActive: true,
                      };
                      logger.info("createChildAssetAction: Saving offset to /AssetRoomWiseMinusData", { offsetPayload });
                      const offsetRes = await assetRoomWiseMinusDataService.create(offsetPayload);
                      logger.info("createChildAssetAction: Offset save response:", { response: offsetRes });
                    }
                  }
                } else {
                  logger.warn(`createChildAssetAction: Could not find dbRoom for roomNo ${inputRoom.roomNo} to save offsets.`);
                }
              }
            }
          } catch (fetchErr: any) {
            logger.error("createChildAssetAction: Failed to fetch child asset to save room offsets:", { error: fetchErr });
          }
        }
      }
      return {
        success: true,
        data: {
          success: true,
          message: res.message || "Detailed child asset saved successfully",
          assetId: createdAssetId || null,
          assetNo: res.data.unitNo || (res.data as any).assetNo || null,
          roomWiseSubmissionDetailsId: roomWiseSubmissionDetailId,
          errors: [],
        },
      };
    }
    const errorDetails = res.message + (res.error ? ` (${res.error})` : "") + (res.statusCode ? ` [Status: ${res.statusCode}]` : "");
    return { success: false, error: errorDetails };
  } catch (err: any) {
    logger.error("createChildAssetAction Error:", { error: err });
    return { success: false, error: "Network error saving detailed child asset: " + err.message };
  }
}

/**
 * Server action to retrieve complete details (rooms, renter) of a child asset by ID
 */
export async function getChildAssetByIdAction(assetId: number): Promise<ActionResult<any>> {
  try {
    const [subUnitRes, assetMasterRes] = await Promise.all([
      manageSubUnitsService.getById(assetId),
      assetMasterService.getAssetById(assetId)
    ]);

      if (subUnitRes.success && subUnitRes.data) {
      const detail = subUnitRes.data as any;

      // DEBUG: log the top-level keys of the response to diagnose field naming
      logger.info(`[DEBUG] getChildAssetByIdAction assetId=${assetId} detail keys: ${Object.keys(detail || {}).join(', ')}`);
      logger.info(`[DEBUG] getChildAssetByIdAction roomDetails count: ${Array.isArray(detail?.roomDetails) ? detail.roomDetails.length : 'N/A'}, roomWiseDetails count: ${Array.isArray(detail?.roomWiseDetails) ? detail.roomWiseDetails.length : 'N/A'}`);

      // Merge department details from AssetMaster
      if (assetMasterRes.success && assetMasterRes.data) {
        const master = assetMasterRes.data as any;
        detail.departmentId = master.departmentId || null;
        detail.departmentName = master.departmentName || null;
      }

      // Load room-wise offset (minus) data from AssetRoomWiseMinusData
      // Endpoint: GET /AssetRoomWiseMinusData?RoomWiseSubmissionId={room.id}
      // room.id is the roomWiseDetails row id which IS the RoomWiseSubmissionId
      // NOTE: The API may return rooms as 'roomWiseDetails', 'roomDetails', or 'roomWiseSubmissions'
      const roomWiseDetails = Array.isArray(detail.roomWiseDetails)
        ? detail.roomWiseDetails
        : Array.isArray(detail.roomDetails)
          ? detail.roomDetails
          : Array.isArray(detail.roomWiseSubmissions)
            ? detail.roomWiseSubmissions
            : [];

      if (roomWiseDetails.length > 0) {
        // Normalise: always expose as both roomWiseDetails AND roomDetails for UnitPoolPanel
        detail.roomWiseDetails = roomWiseDetails;
        detail.roomDetails = roomWiseDetails;

        for (const room of roomWiseDetails) {
          const roomWiseSubmissionId = room.id;
          if (!roomWiseSubmissionId) continue;

          // If offsets are already embedded in the room data (from ManageSubUnits response),
          // normalise them and skip the separate API call.
          if (Array.isArray(room.offsets) && room.offsets.length > 0) {
            room.offsets = room.offsets.map((off: any) => ({
              id: String(off.id || ""),
              shape: off.shape || "Rectangle",
              // API returns direct field names (length, width, etc.) not lengthMtr/widthMtr
              length: Number(off.length ?? off.lengthMtr ?? 0),
              width: Number(off.width ?? off.widthMtr ?? 0),
              height: Number(off.height ?? off.heightMtr ?? 0),
              base1: Number(off.base1 ?? off.base1Mtr ?? 0),
              base2: Number(off.base2 ?? off.base2Mtr ?? 0),
              radius: Number(off.radius ?? off.length ?? off.lengthMtr ?? 0),
              areaSqM: Number(off.areaSqM ?? off.areaSqMtr ?? 0),
              op: (off.op || "Subtract") as "Add" | "Subtract",
            }));
            continue; // offsets already present — no need to call AssetRoomWiseMinusData
          }

          // Fallback: fetch offsets from AssetRoomWiseMinusData API
          try {
            const minusRes = await assetRoomWiseMinusDataService.getAll(roomWiseSubmissionId);
            if (minusRes.success && minusRes.data) {
              // The service's unwrapResponse already extracts body?.items
              // so minusRes.data may be:
              //   a) AssetRoomWiseMinusDataDto[]  — already the flat array
              //   b) PagedResult object { items: [], totalCount, ... }
              let rawItems: any[];
              if (Array.isArray(minusRes.data)) {
                rawItems = minusRes.data;
              } else {
                const paged = minusRes.data as any;
                rawItems = Array.isArray(paged.items)
                  ? paged.items
                  : Array.isArray(paged.data)
                    ? paged.data
                    : [];
              }
              // Filter to only entries that belong to this specific room
              const filteredItems = rawItems.filter(
                (item: any) => Number(item.roomWiseSubmissionId) === Number(roomWiseSubmissionId)
              );
              room.offsets = filteredItems.map((item: any) => ({
                id: String(item.id),
                shape: item.shape || "Rectangle",
                // AssetRoomWiseMinusData uses direct field names matching the embed format
                length: Number(item.length ?? item.lengthMtr ?? 0),
                width: Number(item.width ?? item.widthMtr ?? 0),
                height: Number(item.height ?? item.heightMtr ?? 0),
                base1: Number(item.base1 ?? item.base1Mtr ?? 0),
                base2: Number(item.base2 ?? item.base2Mtr ?? 0),
                radius: Number(item.radius ?? item.length ?? item.lengthMtr ?? 0),
                areaSqM: Number(item.areaSqM ?? item.areaSqMtr ?? 0),
                op: (item.op || "Subtract") as "Add" | "Subtract",
              }));
            } else {
              room.offsets = [];
            }
          } catch (err: any) {
            logger.error(`Failed to load offsets for room ${roomWiseSubmissionId}:`, { error: err });
            room.offsets = [];
          }
        }
      }

      return { success: true, data: detail };
    }
    return { success: false, error: subUnitRes.error || "Failed to fetch child asset details" };
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
      // In parallel, fetch full child asset details for each sub-unit to get rooms, renter, and department
      const detailedSubUnits = await Promise.all(
        res.data.map(async (subunit) => {
          const subId = subunit.assetId || subunit.id;
          if (!subId) return subunit;
          try {
            const childRes = await getChildAssetByIdAction(subId);
            if (childRes.success && childRes.data) {
              return {
                ...subunit,
                ...childRes.data,
              };
            }
          } catch (err) {
            logger.error(`Failed to fetch full child asset details for sub-unit asset ${subId}:`, { error: err as Error });
          }
          return subunit;
        })
      );
      return { success: true, data: detailedSubUnits };
    }
    return { success: false, error: res.error || "Failed to fetch subunits" };
  } catch (err: any) {
    logger.error("getSubUnitsByAssetAction Error:", { error: err });
    return { success: false, error: "Network error fetching subunits: " + err.message };
  }
}

/**
 * Server action to fetch all departments for dropdown assignment
 */
export async function fetchDepartmentsAction(): Promise<ActionResult<{ label: string; value: string }[]>> {
  try {
    const { departmentService } = await import("@/lib/api/asset/department.service");
    const res = await departmentService.getDepartments();
    if (res.success && res.data) {
      const items = Array.isArray(res.data) ? res.data : [];
      const options = items
        .filter((d: any) => 
          d.isActive !== false && d.isActive !== 0 && 
          d.IsActive !== false && d.IsActive !== 0 && 
          d.status?.toLowerCase() !== 'inactive'
        )
        .map((d: any) => ({
          label: d.departmentName || d.owningDepartmentName || `Dept ${d.id}`,
          value: String(d.id),
        }));
      return { success: true, data: options };
    }
    return { success: false, error: "Failed to fetch departments" };
  } catch (err: any) {
    logger.error("fetchDepartmentsAction Error:", { error: err });
    return { success: true, data: [] }; // graceful fallback
  }
}


/**
 * Trigger CV calculation for a floor detail record.
 * Calculates CapitalValue using SDRR × area × age/floor/nature/use factors
 * and propagates the result to all sub-units on that floor.
 */
export async function calculateFloorCVAction(floorDetailId: number): Promise<ActionResult<any>> {
  try {
    const res = await floorDetailsService.calculateFloorCV(floorDetailId);
    if (res.success) {
      return { success: true, data: res.data };
    }
    return { success: false, error: res.error ?? "CV calculation failed" };
  } catch (err: any) {
    logger.error("calculateFloorCVAction Error:", { error: err });
    return { success: false, error: err.message || "CV calculation failed" };
  }
}

/**
 * Calculate CV for an entire building including all floors + sub-units.
 * Endpoint: POST /api/AssetCapitalValue/building/calculate-cv
 * Updates: AssetFloorDetails.CapitalValue, sub-unit AssetMaster.CapitalValue,
 *          and parent building AssetMaster.CapitalValue (sum of all floors).
 */
export async function calculateBuildingCVAction(
  buildingAssetId: number,
  forceRecalculate: boolean = true
): Promise<ActionResult<any>> {
  try {
    const res = await apiClient.post("/AssetCapitalValue/building/calculate-cv", {
      buildingAssetId,
      forceRecalculate,
      createdBy: 1,
    });
    if (res.success) return { success: true, data: res.data };
    return { success: false, error: res.error ?? "Building CV calculation failed" };
  } catch (err: any) {
    logger.error("calculateBuildingCVAction Error:", { error: err });
    return { success: false, error: err.message || "Building CV calculation failed" };
  }
}

/**
 * Calculate CV for a single movable asset (furniture, vehicle, IT equipment, etc.).
 * Endpoint: POST /api/AssetCapitalValue/movable/calculate-cv
 * Updates: AssetMaster.CapitalValue for the movable asset using depreciated value method.
 */
export async function calculateMovableCVAction(
  assetId: number,
  conditionFactor: number = 1.0
): Promise<ActionResult<any>> {
  try {
    const res = await apiClient.post("/AssetCapitalValue/movable/calculate-cv", {
      assetId,
      valuationMethod: 1, // DepreciatedValue
      conditionFactor,
      createdBy: 1,
    });
    if (res.success) return { success: true, data: res.data };
    return { success: false, error: res.error ?? "Movable CV calculation failed" };
  } catch (err: any) {
    logger.error("calculateMovableCVAction Error:", { error: err });
    return { success: false, error: err.message || "Movable CV calculation failed" };
  }
}

/**
 * Uploads a document via multipart FormData
 */
export async function uploadDocumentAction(
  formData: FormData
): Promise<ActionResult<any>> {
  try {
    const { uploadDocument } = await import("@/lib/api/asset/asset-document.server.service");
    const res = await uploadDocument(formData);
    return res.success ? { success: true, data: res.data } : { success: false, error: res.error || "Failed to upload document" };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to upload document" };
  }
}

/**
 * Uploads bulk documents via multipart FormData
 */
export async function uploadBulkDocumentsAction(
  formData: FormData
): Promise<ActionResult<any>> {
  try {
    const { uploadBulkDocuments } = await import("@/lib/api/asset/asset-document.server.service");
    const res = await uploadBulkDocuments(formData);
    return res.success ? { success: true, data: res.data } : { success: false, error: res.error || "Failed to upload documents" };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to upload documents" };
  }
}

/**
 * Deletes a document by ID
 */
export async function deleteUploadedDocAction(
  docId: number
): Promise<ActionResult<any>> {
  try {
    const { deleteDocument } = await import("@/lib/api/asset/asset-document.server.service");
    const res = await deleteDocument(docId);
    return res.success ? { success: true } : { success: false, error: res.error || "Failed to delete document" };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete document" };
  }
}

/**
 * Fetches already uploaded documents for a given asset ID
 */
export async function fetchUploadedDocumentsAction(
  assetId: number,
  includeAdHoc = true,
  includeDefinitionBased = true
): Promise<ActionResult<any>> {
  try {
    const { getDocumentsByAsset } = await import("@/lib/api/asset/asset-document.server.service");
    const res = await getDocumentsByAsset(assetId, includeAdHoc, includeDefinitionBased);
    if (res.success && res.data) {
      const raw = res.data as any;
      const arrayData = Array.isArray(raw) ? raw : (raw.items || raw.data || []);
      return { success: true, data: arrayData };
    }
    return { success: false, error: res.error || "Failed to fetch uploaded documents" };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to fetch uploaded documents" };
  }
}

