/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
"use server";

import { createEmptyMasterData } from "@/config/asset.config";
import { getDocumentFileRaw, getDocumentsByAsset, uploadDocument } from "@/lib/api/asset/asset-document.server.service";
import { uploadLeaseRentDetailsDocument, replaceLeaseRentDetailsDocument } from "@/lib/api/asset/asset-lease-rent-details-document.server.service";
import { categoryTypeService } from "@/lib/api/asset/category-type.service";
import { assetMasterService } from "@/lib/api/asset/asset-master.service";
import { zoneService } from "@/lib/api/asset/zone.service";
import { wardService } from "@/lib/api/asset/ward.service";
import { apiClient } from "@/services/api.service";
import type {
  MasterDataConfig,
  MasterDataRecord,
} from "@/types/asset.types";
import type {
  AssetChildAssetItem,
  AssetDocumentListItem,
  AssetFieldDefinitionItem,
  AssetFloorDetailItem,
  AssetFloorSummary,
} from "@/types/municipal-asset/detail-tabs.types";
import { revalidatePath } from "next/cache";

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

  }
  return null;
}

export async function uploadAssetDocumentAction(formData: FormData) {
  try {
    const response = await uploadDocument(formData);
    return response;
  } catch (error) {

    throw error;
  }
}

export async function uploadAssetLeaseRentDetailsDocumentAction(formData: FormData) {
  try {
    const response = await uploadLeaseRentDetailsDocument(formData);
    return response;
  } catch (error) {
    throw error;
  }
}

export async function replaceLeaseRentDetailsDocumentAction(documentId: number | string, formData: FormData) {
  try {
    const response = await replaceLeaseRentDetailsDocument(documentId, formData);
    return response;
  } catch (error) {
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

import { submitAssetForm as submitAssetFormImpl } from './municipal-Asset/add-New-Asset/actions';

/**
 * Server action to submit the consolidated Asset Registration Form
 * Wrapped export from add-New-Asset module to avoid duplication and keep this file small.
 */
export async function submitAssetForm(formData: any) {
  return await submitAssetFormImpl(formData);
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

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch asset"
    };
  }
}
