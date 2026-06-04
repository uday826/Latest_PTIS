/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports */
"use server";

import { assetMasterService } from "@/lib/api/asset/asset-master.service";
import { apiClient } from "@/services/api.service";
import { assetFieldDefinitionService } from "@/lib/api/asset/asset-field-definition.service";
import { assetFieldValueService } from "@/lib/api/asset/asset-field-value.service";
import { getDocumentFileRaw, getDocumentsByAsset, uploadDocument } from "@/lib/api/asset/asset-document.server.service";
import { AssetFormData, AssetMasterRequest } from "@/types/asset-types/basic-info/asset-wizard.types";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { categoryTypeService } from "@/lib/api/asset/category-type.service";
import { departmentService } from "@/lib/api/asset/department.service";
import { wardService } from "@/lib/api/asset/ward.service";
import { zoneService } from "@/lib/api/asset/zone.service";
import { moujaService } from "@/lib/api/asset/mouja.service";
import { createEmptyMasterData } from "@/config/asset.config";
import type {
  MasterDataConfig,
  MasterDataRecord,
} from "@/types/asset.types";
import type { AssetDocumentListItem } from "@/components/modules/assets/municipal-Asset/detail-tabs/types";
import type {
  AssetChildAssetItem,
  AssetFieldDefinitionItem,
  AssetFloorDetailItem,
  AssetFloorSummary,
} from "@/components/modules/assets/municipal-Asset/detail-tabs/types";

/**
 * Fetch all active asset categories
 */
export async function fetchCategories() {
  const response = await categoryTypeService.getCategories();
  return response;
}

/**
 * Fetch all active asset types
 */
export async function fetchAllTypes() {
  const response = await categoryTypeService.getAllTypes();
  return response;
}


/**
 * Fetch asset types for a specific category
 */
export async function fetchTypesByCategory(categoryId: number) {
  const response = await categoryTypeService.getTypesByCategory(categoryId);
  return response;
}

/**
 * Fetch dashboard summary stats for municipal assets
 * Uses the AssetMaster/dashboard-stats endpoint exclusively
 */
export async function fetchMunicipalAssetDashboardStats() {
  try {
    const response = await assetMasterService.getDashboardStats();
    if (response.success && response.data) {
      return response.data;
    }
  } catch (err) {
    console.error("Failed to fetch dashboard stats from AssetMaster:", err);
  }
  return null;
}

export async function uploadAssetDocumentAction(formData: FormData) {
  try {
    const response = await uploadDocument(formData);
    return response;
  } catch (error) {
    console.error("uploadAssetDocumentAction error:", error);
    throw error;
  }
}

/**
 * Fetch all active Zones
 */
export async function fetchZones() {
  try {
    const response = await zoneService.getZones();
    return response;
  } catch (error) {
    console.error("Error fetching zones:", error);
    return { success: false, error: "Failed to fetch zones", data: [] as any[] };
  }
}

/**
 * Fetch all active Wards (optionally filtered by zone)
 */
export async function fetchWards() {
  try {
    const response = await wardService.getWards();
    return response;
  } catch (error) {
    console.error("Error fetching wards:", error);
    return { success: false, error: "Failed to fetch wards", data: [] as any[] };
  }
}

/**
 * Fetch assets for "Use Existing Asset" flow — filter by zone/ward/search
 * API: GET /AssetMaster?search=...&zoneId=...&wardId=...&pageSize=...
 * Response: { items: [...], totalCount, pageNumber, pageSize, totalPages, hasNext, hasPrevious }
 */
export async function fetchAssetsByFilter(params: { zoneId?: number; wardId?: number; search?: string; pageSize?: number }) {
  try {
    const query = new URLSearchParams();
    if (params.zoneId) query.set("zoneId", String(params.zoneId));
    if (params.wardId) query.set("wardId", String(params.wardId));
    if (params.search) query.set("search", params.search.trim());
    query.set("pageSize", String(params.pageSize ?? 50));
    query.set("pageNumber", "1");

    const response = await apiClient.get<any>(`/AssetMaster?${query.toString()}`);
    if (response.success && response.data) {
      // Handle both direct array and paginated object response
      const isPagedResponse = !Array.isArray(response.data) && response.data.items !== undefined;
      const items: any[] = isPagedResponse
        ? (response.data.items ?? [])
        : (Array.isArray(response.data) ? response.data : (response.data.data ?? []));
      const totalCount: number = isPagedResponse ? (response.data.totalCount ?? items.length) : items.length;
      return { success: true, data: items, totalCount };
    }
    return { success: false, data: [] as any[], totalCount: 0, error: response.error };
  } catch (error) {
    console.error("Error fetching assets by filter:", error);
    return { success: false, data: [] as any[], totalCount: 0, error: "Failed to fetch assets" };
  }
}

/**
 * Fetch a single asset master record by ID
 * Uses the AssetMaster/{id} endpoint
 */
export async function fetchAssetMasterById(assetId: number | string) {
  try {
    const response = await assetMasterService.getAssetById(Number(assetId));
    if (response.success && response.data) {
      return response.data;
    }
  } catch (err) {
    console.error("Failed to fetch asset master by ID:", err);
  }
  return null;
}

function unwrapApiPayload(data: unknown): unknown {
  if (!data || typeof data !== "object") return data;
  const body = data as Record<string, unknown>;
  return body.items ?? body.Items ?? body.data ?? body.Data ?? body.result ?? body.Result ?? data;
}

function unwrapList(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;
  const payload = unwrapApiPayload(data);
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];
  const body = payload as Record<string, unknown>;
  const candidates = [body.items, body.Items, body.data, body.Data, body.results, body.Results];
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }
  return [];
}

function pickFirstNumber(source: Record<string, unknown>, keys: string[]): number | string | null {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
}

function normalizeAssetFieldDefinition(raw: unknown): AssetFieldDefinitionItem | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Record<string, unknown>;
  const id = item.id ?? item.Id;
  const fieldName = pickFirstString(item, ["fieldName", "FieldName", "fieldCode", "FieldCode"]);
  if ((typeof id !== "number" && typeof id !== "string") || !fieldName) return null;

  return {
    id,
    fieldName,
    fieldLabel: pickFirstString(item, ["fieldLabel", "FieldLabel"]),
    fieldType: pickFirstString(item, ["fieldType", "FieldType"]),
    fieldGroup: pickFirstString(item, ["fieldGroup", "FieldGroup"]),
    displayOrder: pickFirstNumber(item, ["displayOrder", "DisplayOrder"]),
  };
}

function normalizeAssetFloorDetail(raw: unknown): AssetFloorDetailItem | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Record<string, unknown>;
  const id = item.id ?? item.Id;
  if (typeof id !== "number" && typeof id !== "string") return null;

  return {
    id,
    assetId: pickFirstNumber(item, ["assetId", "AssetId"]),
    floorId: pickFirstNumber(item, ["floorId", "FloorId"]),
    floorName: pickFirstString(item, ["floorName", "FloorName"]),
    subFloorName: pickFirstString(item, ["subFloorName", "SubFloorName"]),
    constructionYear: pickFirstString(item, ["constructionYear", "ConstructionYear"]),
    assessmentYear: pickFirstString(item, ["assessmentYear", "AssessmentYear"]),
    constructionTypeName: pickFirstString(item, ["constructionTypeName", "ConstructionTypeName"]),
    typeOfUseName: pickFirstString(item, ["typeOfUseName", "TypeOfUseName"]),
    subTypeOfUseName: pickFirstString(item, ["subTypeOfUseName", "SubTypeOfUseName"]),
    carpetAreaSqMeter: pickFirstNumber(item, ["carpetAreaSqMeter", "CarpetAreaSqMeter"]),
    carpetAreaSqFeet: pickFirstNumber(item, ["carpetAreaSqFeet", "CarpetAreaSqFeet"]),
    builtUpAreaSqMeter: pickFirstNumber(item, ["builtUpAreaSqMeter", "BuiltUpAreaSqMeter"]),
    builtUpAreaSqFeet: pickFirstNumber(item, ["builtUpAreaSqFeet", "BuiltUpAreaSqFeet"]),
    noOfRooms: pickFirstNumber(item, ["noOfRooms", "NoOfRooms"]),
    baseValue: pickFirstNumber(item, ["baseValue", "BaseValue"]),
    capitalValue: pickFirstNumber(item, ["capitalValue", "CapitalValue"]),
    marketValue: pickFirstNumber(item, ["marketValue", "MarketValue"]),
  };
}

function normalizeAssetChild(raw: unknown): AssetChildAssetItem | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Record<string, unknown>;
  const id = item.id ?? item.Id;
  if (typeof id !== "number" && typeof id !== "string") return null;

  return {
    id,
    assetNo: pickFirstString(item, ["assetNo", "AssetNo", "assetCode", "AssetCode"]),
    assetName: pickFirstString(item, ["assetName", "AssetName", "name", "Name"]),
    assetTypeName: pickFirstString(item, ["assetTypeName", "AssetTypeName", "typeName", "TypeName"]),
    parentAssetId: pickFirstNumber(item, ["parentAssetId", "ParentAssetId"]),
    hierarchyLevel: pickFirstNumber(item, ["hierarchyLevel", "HierarchyLevel"]),
    wardName: pickFirstString(item, ["wardName", "WardName"]),
    zoneName: pickFirstString(item, ["zoneName", "ZoneName"]),
    builtUpAreaSqMeter: pickFirstNumber(item, ["builtUpAreaSqMeter", "BuiltUpAreaSqMeter"]),
    carpetAreaSqMeter: pickFirstNumber(item, ["carpetAreaSqMeter", "CarpetAreaSqMeter"]),
    status: pickFirstString(item, ["status", "Status"]),
    occupancyStatus: pickFirstString(item, ["occupancyStatus", "OccupancyStatus"]),
    isActive: typeof item.isActive === "boolean" ? item.isActive : typeof item.IsActive === "boolean" ? item.IsActive : null,
  };
}

export async function fetchAssetFieldDefinitionsByCategoryType(
  categoryId?: number | string | null,
  typeId?: number | string | null
): Promise<{ fieldDefinitions: AssetFieldDefinitionItem[]; error: string | null }> {
  if (!categoryId || !typeId) {
    return { fieldDefinitions: [], error: null };
  }

  const response = await apiClient.get<unknown>(`/AssetFieldDefinition?AssetCategoryId=${categoryId}&AssetTypeId=${typeId}&pageSize=1000`);
  if (!response.success) {
    return { fieldDefinitions: [], error: response.error || "Failed to load field definitions." };
  }

  return {
    fieldDefinitions: unwrapList(response.data).map(normalizeAssetFieldDefinition).filter(Boolean) as AssetFieldDefinitionItem[],
    error: null,
  };
}

export async function fetchAssetFloorSummaryByAsset(assetId: number | string): Promise<{
  floorSummary: AssetFloorSummary | null;
  error: string | null;
}> {
  const response = await apiClient.get<unknown>(`/AssetFloorDetails/by-asset/${assetId}`);
  if (!response.success) {
    return { floorSummary: null, error: response.error || "Failed to load floor details." };
  }

  const payload = unwrapApiPayload(response.data) as Record<string, unknown>;
  const floorDetails = unwrapList(payload.floorDetails ?? payload.FloorDetails)
    .map(normalizeAssetFloorDetail)
    .filter(Boolean) as AssetFloorDetailItem[];

  return {
    floorSummary: {
      floorDetails,
      totalBaseValue: pickFirstNumber(payload, ["totalBaseValue", "TotalBaseValue"]),
      totalCapitalValue: pickFirstNumber(payload, ["totalCapitalValue", "TotalCapitalValue"]),
      totalMarketValue: pickFirstNumber(payload, ["totalMarketValue", "TotalMarketValue"]),
      totalFloors: pickFirstNumber(payload, ["totalFloors", "TotalFloors"]),
    },
    error: null,
  };
}

export async function fetchChildAssetsByParent(assetId: number | string): Promise<{
  childAssets: AssetChildAssetItem[];
  error: string | null;
}> {
  const response = await apiClient.get<unknown>(`/AssetMaster?ParentAssetId=${assetId}&pageSize=1000`);
  if (!response.success) {
    return { childAssets: [], error: response.error || "Failed to load sub-units." };
  }

  return {
    childAssets: unwrapList(response.data).map(normalizeAssetChild).filter(Boolean) as AssetChildAssetItem[],
    error: null,
  };
}

function pickFirstString(source: Record<string, unknown>, keys: string[]): string | null {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value);
    }
  }
  return null;
}

function normalizeAssetDocument(raw: unknown): AssetDocumentListItem | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Record<string, unknown>;
  const id = item.assetDocumentId ?? item.AssetDocumentId ?? item.documentId ?? item.DocumentId ?? item.id;
  if (typeof id !== "number" && typeof id !== "string") return null;

  const fileName =
    pickFirstString(item, ["fileName", "FileName", "originalFileName", "OriginalFileName", "documentFileName", "DocumentFileName"]) ||
    `document-${id}`;
  const name =
    pickFirstString(item, ["documentName", "DocumentName", "name", "Name", "title", "Title", "documentTypeName", "DocumentTypeName"]) ||
    fileName;

  return {
    id,
    assetId: (item.assetId ?? item.AssetId) as number | string | null | undefined,
    name,
    fileName,
    contentType: pickFirstString(item, ["contentType", "ContentType", "mimeType", "MimeType"]),
    uploadedDate: pickFirstString(item, ["uploadedDate", "UploadedDate", "createdDate", "CreatedDate", "createdOn", "CreatedOn"]),
    fileSize: (item.fileSize ?? item.FileSize ?? item.size ?? item.Size) as number | string | null | undefined,
    status: pickFirstString(item, ["status", "Status", "documentStatus", "DocumentStatus"]),
  };
}

function unwrapAssetDocumentList(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;
  if (!data || typeof data !== "object") return [];
  const body = data as Record<string, unknown>;
  const candidates = [body.items, body.Items, body.data, body.Data, body.documents, body.Documents, body.result, body.Result];
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }
  return [];
}

export async function fetchAssetDocumentsByAsset(assetId: number | string): Promise<{
  documents: AssetDocumentListItem[];
  error: string | null;
}> {
  const response = await getDocumentsByAsset(assetId);
  if (!response.success) {
    return {
      documents: [],
      error: response.error || "Failed to load asset documents.",
    };
  }

  return {
    documents: unwrapAssetDocumentList(response.data).map(normalizeAssetDocument).filter(Boolean) as AssetDocumentListItem[],
    error: null,
  };
}

/**
 * Server action to fetch a document file's binary content.
 * Returns the file as a base64-encoded string so it can be passed to a client component.
 */
export async function fetchAssetDocumentFile(assetDocumentId: number | string): Promise<{
  base64: string;
  contentType: string;
  contentDisposition: string | null;
  error: string | null;
}> {
  try {
    const backendResponse = await getDocumentFileRaw(assetDocumentId);

    if (!backendResponse.ok) {
      return {
        base64: "",
        contentType: "",
        contentDisposition: null,
        error: backendResponse.statusText || "Failed to load document file.",
      };
    }

    const arrayBuffer = await backendResponse.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    return {
      base64,
      contentType: backendResponse.headers.get("content-type") || "application/octet-stream",
      contentDisposition: backendResponse.headers.get("content-disposition"),
      error: null,
    };
  } catch (err) {
    return {
      base64: "",
      contentType: "",
      contentDisposition: null,
      error: err instanceof Error ? err.message : "Failed to load document file.",
    };
  }
}

/**
 * Server action to submit the consolidated Asset Registration Form
 */
export async function submitAssetForm(formData: AssetFormData) {
  try {
    const normalizedType = formData.assetType?.toLowerCase() || "";
    const typeMapping: Record<string, number> = {
      "municipal office": 7,
      "administrative buildings": 7,
      "health facility": 2,
      "health buildings": 2,
      "educational": 3,
      "education buildings": 3,
      "public service": 4,
      "open plot": 7,
      "open plots": 7,
      "open_space": 7,
      "encroached land": 7,
      "vacant land": 11,
      "park": 6,
      "playground": 7,
      "parking": 8,
      "road": 9,
      "roads": 9,
      "infrastructure": 9,
      "water_tank": 10,
      "water supply": 10,
      "sewerage": 11,
      "lighting": 12,
      "vehicle": 13,
      "vehicles": 13,
      "machinery": 14,
      "it_equip": 15,
      "it assets": 15,
    };

    const departmentMapping: Record<string, number> = {
      "pwd": 1,
      "health": 2,
      "education": 3,
      "water": 4,
      "admin": 5,
      "estate": 6,
    };

    const wardMapping: Record<string, number> = {
      "ward 1": 1, "ward 2": 2, "ward 3": 3, "ward 4": 4, "ward 5": 5,
      "ward 6": 6, "ward 7": 7, "ward 8": 8, "ward 9": 9, "ward 10": 10,
      "ward 11": 11, "ward 12": 12, "ward 13": 13, "ward 14": 14, "ward 15": 15,
      "ward 16": 16, "ward 17": 17, "ward 18": 18, "ward 19": 19, "ward 20": 20
    };

    const zoneMapping: Record<string, number> = {
      "zone 1": 1, "zone 2": 2, "zone 3": 3, "zone 4": 4, "zone 5": 5
    };

    const floorMapping: Record<string, number> = {
      "ground": 1,
      "1st": 2,
      "2nd": 3,
      "3rd": 4,
      "4th": 5,
      "5th": 6,
      "6th": 7
    };

    const conTypeMapping: Record<string, number> = {
      "rcc": 1,
      "load bearing": 2,
      "steel frame": 3,
      "wooden": 4
    };

    const useTypeMapping: Record<string, number> = {
      "residential": 1,
      "commercial": 2,
      "industrial": 3,
      "mixed use": 4
    };

    const subUseTypeMapping: Record<string, number> = {
      "bungalow": 1,
      "duplex": 2,
      "shop": 3,
      "office": 4,
      "storage": 5
    };



    const floors = formData.floors || [];
    const calculatedBuildingValue = floors.reduce((acc: number, f: any) => acc + (f.checked ? Number(f.baseValue || 0) : 0), 0);

    const categoryId = formData.categoryId ? Number(formData.categoryId) : 1;
    const typeId = formData.typeId ? Number(formData.typeId) : (typeMapping[normalizedType] || 1);

    // Fetch definitions to resolve IDs for EAV dynamic fieldValues
    let fieldDefs: any[] = [];
    try {
      const defRes = await assetFieldDefinitionService.getFieldDefinitions(categoryId, typeId);
      if (defRes.success && defRes.data) {
        fieldDefs = Array.isArray(defRes.data) ? defRes.data : ((defRes.data as any).items || (defRes.data as any).data || []);
      }
    } catch (err) {
      console.error("Failed to fetch definitions for ID mapping in submitAssetForm:", err);
    }

    const parseNumericId = (val: any, mapping?: Record<string, number>): number | null => {
      if (val === null || val === undefined || String(val).trim() === "") return null;
      const parsed = Number(val);
      if (!isNaN(parsed) && parsed > 0) {
        return parsed;
      }
      if (mapping) {
        const mapped = mapping[String(val).toLowerCase().trim()];
        if (mapped !== undefined) return mapped;
      }
      return null;
    };

    // Fetch actual active masters from DB to prevent foreign key constraint violations
    let dbDeptIds: number[] = [];
    let dbWardIds: number[] = [];
    let dbZoneIds: number[] = [];
    let dbMoujaIds: number[] = [];

    try {
      const deptRes = await departmentService.getDepartments();
      if (deptRes.success && deptRes.data) {
        dbDeptIds = deptRes.data.map((d) => d.id);
      }
    } catch (err) {
      console.warn("Failed to fetch departments from DB:", err);
    }

    try {
      const wardRes = await wardService.getWards();
      if (wardRes.success && wardRes.data) {
        dbWardIds = wardRes.data.map((w) => w.id);
      }
    } catch (err) {
      console.warn("Failed to fetch wards from DB:", err);
    }

    try {
      const zoneRes = await zoneService.getZones();
      if (zoneRes.success && zoneRes.data) {
        dbZoneIds = zoneRes.data.map((z) => z.id);
      }
    } catch (err) {
      console.warn("Failed to fetch zones from DB:", err);
    }

    try {
      const moujaRes = await moujaService.getMoujas();
      if (moujaRes.success && moujaRes.data) {
        dbMoujaIds = moujaRes.data.map((m) => m.id);
      }
    } catch (err) {
      console.warn("Failed to fetch moujas from DB:", err);
    }

    const getSafeForeignKeyId = (
      parsedId: number | null,
      dbIds: number[],
      isRequiredInUI: boolean
    ): number | null => {
      if (parsedId !== null && dbIds.includes(parsedId)) {
        return parsedId;
      }
      if (dbIds.length > 0 && isRequiredInUI) {
        return dbIds[0];
      }
      return null;
    };

    const firstFloor = floors[0];
    const totalBuiltUpSqM = floors.reduce((acc: number, f: any) => acc + (f.checked ? Number(f.builtUpAreaSqM || 0) : 0), 0);
    const totalCarpetSqM = floors.reduce((acc: number, f: any) => acc + (f.checked ? Number(f.carpetAreaSqM || 0) : 0), 0);

    const cookieStore = await cookies();
    const userIdVal = cookieStore.get("user_id")?.value;
    const userId = userIdVal ? Number(userIdVal) : 1;

    const apiRequest: AssetMasterRequest = {
      authorityId: 1,
      organizationId: 1,
      departmentId: getSafeForeignKeyId(parseNumericId(formData.departmentId || formData.department, departmentMapping), dbDeptIds, true),
      assetNo: formData.assetCode || "",
      assetName: formData.assetName || formData.assetType,
      assetCategoryId: categoryId,
      assetTypeId: typeId,
      parentAssetId: null,
      hierarchyLevel: 0,
      hierarchyPath: "",
      address: formData.fullAddress || "",
      wardId: getSafeForeignKeyId(parseNumericId(formData.wardId || formData.ward, wardMapping), dbWardIds, true),
      zoneId: getSafeForeignKeyId(parseNumericId(formData.zoneId || formData.zone, zoneMapping), dbZoneIds, true),
      subZoneId: (() => {
        const val = parseNumericId(formData.subZoneId || (formData as any).subzone);
        return val !== null && val > 0 ? val : null;
      })(),
      moujaId: (() => {
        const val = parseNumericId((formData as any).moujaId || (formData as any).mouja);
        if (val !== null && val > 0 && dbMoujaIds.includes(val)) {
          return val;
        }
        return null;
      })(),
      latitude: formData.latitude ? Number(formData.latitude) : null,
      longitude: formData.longitude ? Number(formData.longitude) : null,
      csn: formData.surveyNumber || (formData as any).csn || null,
      typeOfUseId: null,
      subTypeOfUseId: null,
      builtUpAreaSqMeter: totalBuiltUpSqM || null,
      carpetAreaSqMeter: totalCarpetSqM || null,
      landAreaSqMeter: (() => {
        const rawArea = Number(formData.landArea || formData.attributes?.landArea || formData.attributes?.LandArea);
        if (isNaN(rawArea) || rawArea <= 0) return null;
        const unit = (formData.attributes?.Unit || formData.attributes?.unit || "sq.m").toLowerCase();
        if (unit.includes("sq.ft") || unit.includes("ft")) {
          return rawArea * 0.092903;
        }
        return rawArea;
      })(),
      hasLift: !!formData.attributes?.hasLift || !!formData.hasLift || false,
      purchaseValue: Number(formData.purchaseValue || calculatedBuildingValue) || null,
      purchaseDate: formData.purchaseDate || formData.attributes?.purchaseDate || null,
      marketValue: Number(formData.marketValue || formData.attributes?.marketValue || calculatedBuildingValue) || null,
      marketValueDate: formData.marketValueDate || formData.attributes?.marketValueDate || null,
      capitalValue: calculatedBuildingValue || null,
      lastCVCalculationDate: null,
      currentBookValue: Number(formData.currentBookValue || formData.attributes?.currentBookValue) || null,
      depreciationRate: Number(formData.depreciationRate || formData.attributes?.depreciationRate) || null,
      ownershipType: formData.ownershipType || "municipal",
      status: formData.status || "Active",
      occupancyStatus: formData.occupancyStatus || formData.attributes?.occupancyStatus || null,
      isRevenueGenerating: formData.isRevenueGenerating !== undefined ? (typeof formData.isRevenueGenerating === "boolean" ? formData.isRevenueGenerating : (String(formData.isRevenueGenerating).toLowerCase() === "yes" || String(formData.isRevenueGenerating).toLowerCase() === "true" || formData.isRevenueGenerating === 1)) : false,
      operationalControl: formData.operationalControl || null,
      assetCondition: formData.condition || (formData as any).assetCondition || null,
      isActive: false,
      createdBy: 1,

      // Related dynamic attribute values (EAV Pattern mapping to AMS.AssetFieldValue)
      fieldValues: Object.entries({
        ...(formData.attributes || {}),
        propertyNumber: formData.propertyNumber,
        plotNumber: formData.plotNumber,
        surveyNumber: formData.surveyNumber,
      })
      .filter(([key, value]) => value !== null && value !== undefined && String(value).trim() !== "")
      .map(([key, value]) => {
        const definition = fieldDefs.find(
          (d: any) =>
            d.fieldName?.toLowerCase() === key.toLowerCase() ||
            d.fieldCode?.toLowerCase() === key.toLowerCase()
        );
        
        if (!definition) return null;

        const fieldDefinitionId = definition.id;

        let textValue: string | null = null;
        let numberValue: number | null = null;
        let dateValue: string | null = null;
        let booleanValue: boolean | null = null;

        const fieldType = definition?.fieldType?.toLowerCase() || definition?.type?.toLowerCase() || "";

        if (fieldType === "boolean" || typeof value === "boolean") {
          booleanValue = typeof value === "boolean" ? value : (value === "true" || value === "1" || value === 1 || String(value).toLowerCase() === "yes");
        } else if (fieldType === "number" || fieldType === "currency" || typeof value === "number") {
          numberValue = Number(value);
          if (isNaN(numberValue)) numberValue = null;
        } else if (fieldType === "date") {
          if (value) {
            try {
              dateValue = new Date(String(value)).toISOString();
            } catch {
              dateValue = null;
            }
          }
        } else {
          textValue = value !== null && value !== undefined ? String(value) : null;
        }

        return {
          fieldDefinitionId,
          fieldName: definition.fieldName || key,
          textValue,
          numberValue,
          dateValue,
          booleanValue
        };
      })
      .filter(Boolean)
    };

    console.log("SUBMITTING ASSET MASTER API REQUEST PAYLOAD:", JSON.stringify(apiRequest, null, 2));

    // 2. Execute POST or PUT request via Service Layer to save/update Asset Master
    // Check both formData.id and formData.assetId for update detection
    const parsedId = Number(formData.id || (formData as any).assetId);
    const isUpdate = !isNaN(parsedId) && parsedId > 0;

    const response = isUpdate
      ? await assetMasterService.updateAsset(parsedId, apiRequest)
      : await assetMasterService.createAsset(apiRequest);

    console.log("ASSET MASTER API RESPONSE STATUS:", response.success);
    if (!response.success) {
      console.error("ASSET MASTER API ERROR DETAILS:", response.error || response);
      let dbCategories: any[] = [];
      let dbTypes: any[] = [];
      let dbConstructionTypes: any[] = [];
      let dbUseTypes: any[] = [];
      let dbSubUseTypes: any[] = [];
      let dbFloors: any[] = [];

      try {
        const catRes = await categoryTypeService.getCategories();
        if (catRes.success && catRes.data) {
          dbCategories = catRes.data;
        }
        const typeRes = await categoryTypeService.getAllTypes();
        if (typeRes.success && typeRes.data) {
          dbTypes = typeRes.data;
        }
        const conRes = await apiClient.get<any[]>('/ConstructionType');
        if (conRes.success && conRes.data) {
          dbConstructionTypes = conRes.data;
        }
        const useRes = await apiClient.get<any[]>('/TypeOfUse');
        if (useRes.success && useRes.data) {
          dbUseTypes = useRes.data;
        }
        const subUseRes = await apiClient.get<any[]>('/SubTypeOfUse');
        if (subUseRes.success && subUseRes.data) {
          dbSubUseTypes = subUseRes.data;
        }
        const floorRes = await apiClient.get<any[]>('/Floor');
        if (floorRes.success && floorRes.data) {
          dbFloors = floorRes.data;
        }
      } catch (catErr) {
        console.warn("Failed to fetch categories/types on failure:", catErr);
      }

      let dbUlb: any = null;
      try {
        const ulbRes = await apiClient.get<any>('/UlbConfig');
        if (ulbRes.success && ulbRes.data) {
          dbUlb = ulbRes.data;
        }
      } catch (ulbErr) {
        console.warn("Failed to fetch UlbConfig on failure:", ulbErr);
      }

      try {
        const logContent = `[${new Date().toISOString()}] SAVE FAILED\n` +
          `Request Payload:\n${JSON.stringify(apiRequest, null, 2)}\n\n` +
          `Active DB Wards: ${JSON.stringify(dbWardIds)}\n` +
          `Active DB Zones: ${JSON.stringify(dbZoneIds)}\n` +
          `Active DB Departments: ${JSON.stringify(dbDeptIds)}\n` +
          `Active DB Moujas: ${JSON.stringify(dbMoujaIds)}\n` +
          `Active DB Categories: ${JSON.stringify(dbCategories)}\n` +
          `Active DB Types: ${JSON.stringify(dbTypes)}\n` +
          `Active DB ConstructionTypes: ${JSON.stringify(dbConstructionTypes)}\n` +
          `Active DB UseTypes: ${JSON.stringify(dbUseTypes)}\n` +
          `Active DB SubUseTypes: ${JSON.stringify(dbSubUseTypes)}\n` +
          `Active DB Floors: ${JSON.stringify(dbFloors)}\n` +
          `Active DB UlbConfig: ${JSON.stringify(dbUlb)}\n\n` +
          `Response Error:\n${JSON.stringify(response.error || response, null, 2)}\n` +
          `============================================================\n\n`;
        console.error(logContent);
        try {
          const fs = require('fs');
          fs.writeFileSync('d:/Asset/PRDashboard/sir/New folder/ntis-ui/asset_save_error.log', logContent);
        } catch (e) {
          console.error("Failed to write log file", e);
        }
      } catch (logErr) {
        console.error("Failed to write to console:", logErr);
      }
    } else {
      console.log("ASSET MASTER API SUCCESS RESPONSE DATA:", JSON.stringify(response.data, null, 2));
    }

    let assetId: number | null = null;

    // 3. Save dynamic EAV field values to /AssetFieldValue if master creation succeeded
    if (response.success && response.data) {
      const resData = response.data as any;

      // Recursive key scanner to dynamically find the created asset's primary key (id / Id / assetId)
      const findAssetId = (obj: any): number | null => {
        if (!obj || typeof obj !== "object") return null;
        const directId = obj.id ?? obj.Id ?? obj.assetId ?? obj.AssetId;
        if (typeof directId === "number" && directId > 0) return directId;
        if (typeof directId === "string" && !isNaN(Number(directId)) && Number(directId) > 0) return Number(directId);

        const subKeys = ["items", "Items", "data", "Data", "record", "Record", "result", "Result"];
        for (const key of subKeys) {
          if (obj[key]) {
            const found = findAssetId(obj[key]);
            if (found) return found;
          }
        }

        if (Array.isArray(obj)) {
          for (const item of obj) {
            const found = findAssetId(item);
            if (found) return found;
          }
        }

        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key) && typeof obj[key] === "object" && obj[key] !== null) {
            const found = findAssetId(obj[key]);
            if (found) return found;
          }
        }
        return null;
      };

      assetId = findAssetId(resData) || (isUpdate ? parsedId : null);

      if (assetId && apiRequest.fieldValues && apiRequest.fieldValues.length > 0) {
        console.log(`Saving ${apiRequest.fieldValues.length} EAV field values for asset ID: ${assetId}`);
        const savePromises = apiRequest.fieldValues.map(async (fv) => {
          try {
            const eavPayload = {
              assetId: Number(assetId),
              fieldDefinitionId: fv.fieldDefinitionId ?? 1,
              fieldName: fv.fieldName,
              textValue: fv.textValue,
              numberValue: fv.numberValue,
              dateValue: fv.dateValue ? fv.dateValue.split("T")[0] : null,
              booleanValue: fv.booleanValue,
              createdBy: 1
            };
            const eavResponse = await assetFieldValueService.saveFieldValue(eavPayload);
            if (!eavResponse.success) {
              console.error(`Failed to save EAV field value ${fv.fieldName}:`, eavResponse.error);
            }
          } catch (err) {
            console.error(`Exception saving EAV field value ${fv.fieldName}:`, err);
          }
        });
        await Promise.all(savePromises);
      } else {
        console.warn("Skipped saving EAV field values: assetId not found or fieldValues empty. Found assetId:", assetId);
      }
    }

    // 4. Cache Invalidation for the Dashboard
    if (response.success) {
      revalidatePath("/[locale]/assets/municipal-Asset", "page");
      const generatedCode = response.data?.assetCode || (response.data as any)?.assetNo || formData.assetCode || "";
      return {
        ...response,
        assetId: assetId || undefined,
        assetCode: generatedCode || undefined
      };
    }

    return response;
  } catch (error) {
    console.error("CRITICAL: Asset Submission Failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Internal Server Error during asset creation."
    };
  }
}

/**
 * Server action to activate an asset and all its child records.
 * Calls PUT /AssetMaster/{id}/activate
 * This should be called only on Final Submit after all steps are complete.
 */
export async function activateAssetAction(assetId: number): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await assetMasterService.activateAsset(assetId);
    if (response.success) {
      revalidatePath("/[locale]/assets/municipal-Asset", "page");
      return { success: true };
    }
    return { success: false, error: response.error || "Activation failed." };
  } catch (error) {
    console.error("CRITICAL: Asset Activation Failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Internal Server Error during asset activation."
    };
  }
}

// ─── Simulated Server Store (for master-data configuration CRUDs) ───
let _serverStore: MasterDataConfig | null = null;

function getServerStore(): MasterDataConfig {
  if (!_serverStore) {
    _serverStore = createEmptyMasterData();
  }
  return _serverStore;
}

function delay(ms = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchMasterData(): Promise<{
  success: boolean;
  data?: MasterDataConfig;
  error?: string;
}> {
  try {
    await delay(400);
    const data = getServerStore();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: 'Failed to load master data from server.' };
  }
}

export async function createMasterRecord(
  key: keyof MasterDataConfig,
  record: Omit<MasterDataRecord, 'id' | 'createdDate'>
): Promise<{ success: boolean; data?: MasterDataRecord; error?: string }> {
  try {
    await delay(500);
    const store = getServerStore();
    const current = store[key] || [];
    const maxId = current.reduce((max, item) => Math.max(max, item.id), 0);
    const code = record.code?.trim() || `${String(key).toUpperCase()}-${maxId + 1}`;
    const name = record.name?.trim() || code;
    const newRecord: MasterDataRecord = {
      isActive: true,
      ...record,
      code,
      name,
      id: maxId + 1,
      createdDate: new Date().toISOString(),
    };
    _serverStore = { ...store, [key]: [...current, newRecord] };
    revalidatePath('/asset');
    return { success: true, data: newRecord };
  } catch (error) {
    return { success: false, error: 'Failed to create record.' };
  }
}

export async function updateMasterRecord(
  key: keyof MasterDataConfig,
  id: number,
  updates: Partial<MasterDataRecord>
): Promise<{ success: boolean; data?: MasterDataRecord; error?: string }> {
  try {
    await delay(500);
    const store = getServerStore();
    const current = store[key] || [];
    let updated: MasterDataRecord | null = null;
    _serverStore = {
      ...store,
      [key]: current.map((item) => {
        if (item.id !== id) return item;
        updated = { ...item, ...updates, modifiedDate: new Date().toISOString() };
        return updated;
      }),
    };
    if (!updated) return { success: false, error: `Record with id=${id} not found.` };
    revalidatePath('/asset');
    return { success: true, data: updated };
  } catch (error) {
    return { success: false, error: 'Failed to update record.' };
  }
}

export async function deleteMasterRecord(
  key: keyof MasterDataConfig,
  id: number
): Promise<{ success: boolean; error?: string }> {
  try {
    await delay(400);
    const store = getServerStore();
    const current = store[key] || [];
    _serverStore = {
      ...store,
      [key]: current.filter((item) => item.id !== id),
    };
    revalidatePath('/asset');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete record.' };
  }
}

export async function toggleMasterRecordStatus(
  key: keyof MasterDataConfig,
  id: number
): Promise<{ success: boolean; error?: string }> {
  try {
    await delay(300);
    const store = getServerStore();
    const current = store[key] || [];
    _serverStore = {
      ...store,
      [key]: current.map((item) =>
        item.id === id
          ? { ...item, isActive: !item.isActive, modifiedDate: new Date().toISOString() }
          : item
      ),
    };
    revalidatePath('/asset');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to toggle status.' };
  }
}

/**
 * Fetch a single asset by its ID
 */
export async function fetchAssetById(id: number) {
  try {
    const response = await assetMasterService.getAssetById(id);
    return response;
  } catch (error) {
    console.error("Error fetching asset by ID:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch asset"
    };
  }
}
