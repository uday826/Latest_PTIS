"use server";

import { assetMasterService } from "@/lib/api/asset/asset-master.service";
import { apiClient } from "@/services/api.service";
import { getDocumentFileRaw, getDocumentsByAsset } from "@/lib/api/asset/asset-document.server.service";
import type {
  AssetDocumentListItem,
  AssetChildAssetItem,
  AssetFieldDefinitionItem,
  AssetFloorDetailItem,
  AssetFloorSummary,
} from "@/types/municipal-asset/detail-tabs.types";

// Helper functions for parsing API responses
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
  totalSubAssets: number;
  error: string | null;
}> {
  const response = await apiClient.get<unknown>(`/AssetMaster/parent/${assetId}/sub-assets`);
  if (!response.success) {
    return { childAssets: [], totalSubAssets: 0, error: response.error || "Failed to load sub-units." };
  }

  const payload = (response.data ?? {}) as Record<string, unknown>;
  const totalSubAssets =
    typeof payload.totalSubAssets === "number"
      ? payload.totalSubAssets
      : typeof payload.TotalSubAssets === "number"
        ? payload.TotalSubAssets
        : 0;

  const rawSubAssets = unwrapList(payload.subAssets ?? payload.SubAssets ?? payload);

  const mapped = rawSubAssets
    .map((entry) => {
      if (!entry || typeof entry !== "object") return null;
      const item = entry as Record<string, unknown>;
      const id = item.id ?? item.Id;
      if (typeof id !== "number" && typeof id !== "string") return null;

      // Pick first renter detail (if any) for tenant-related fields
      const rentersRaw = item.renterDetails ?? item.RenterDetails;
      const renters = Array.isArray(rentersRaw) ? rentersRaw : [];
      const renter = (renters[0] ?? {}) as Record<string, unknown>;

      return {
        id,
        authorityId: pickFirstNumber(item, ["authorityId", "AuthorityId"]),
        organizationId: pickFirstNumber(item, ["organizationId", "OrganizationId"]),
        departmentId: pickFirstNumber(item, ["departmentId", "DepartmentId"]),
        assetId: null,
        inventoryBatchId: pickFirstNumber(item, ["inventoryBatchId", "InventoryBatchId"]),
        assetNo: pickFirstString(item, ["assetNo", "AssetNo"]),
        assetName: pickFirstString(item, ["assetName", "AssetName"]),
        assetCategoryId: pickFirstNumber(item, ["assetCategoryId", "AssetCategoryId"]),
        assetTypeId: pickFirstNumber(item, ["assetTypeId", "AssetTypeId"]),
        assetTypeName: pickFirstString(item, ["assetTypeName", "AssetTypeName"]),
        assetCategoryName: pickFirstString(item, ["assetCategoryName", "AssetCategoryName"]),
        parentAssetId: pickFirstNumber(item, ["parentAssetId", "ParentAssetId"]),
        parentAssetName: pickFirstString(item, ["parentAssetName", "ParentAssetName"]),
        hierarchyLevel: pickFirstNumber(item, ["hierarchyLevel", "HierarchyLevel"]),
        hierarchyPath: pickFirstString(item, ["hierarchyPath", "HierarchyPath"]),
        address: pickFirstString(item, ["address", "Address"]),
        wardId: pickFirstNumber(item, ["wardId", "WardId"]),
        zoneId: pickFirstNumber(item, ["zoneId", "ZoneId"]),
        subZoneId: pickFirstNumber(item, ["subZoneId", "SubZoneId"]),
        moujaId: pickFirstNumber(item, ["moujaId", "MoujaId"]),
        latitude: pickFirstNumber(item, ["latitude", "Latitude"]),
        longitude: pickFirstNumber(item, ["longitude", "Longitude"]),
        csn: pickFirstString(item, ["csn", "CSN"]),
        typeOfUseId: pickFirstNumber(item, ["typeOfUseId", "TypeOfUseId"]),
        subTypeOfUseId: pickFirstNumber(item, ["subTypeOfUseId", "SubTypeOfUseId"]),
        complexName: null,
        shopUnitName: null,
        unitNo: null,
        totalAreaSqFt: pickFirstNumber(renter, ["totalAreaSqFt", "TotalAreaSqFt"]),
        landAreaSqMeter: pickFirstNumber(item, ["landAreaSqMeter", "LandAreaSqMeter"]),
        calculatedCapitalValue: null,
        purchaseValue: pickFirstNumber(item, ["purchaseValue", "PurchaseValue"]),
        purchaseDate: pickFirstString(item, ["purchaseDate", "PurchaseDate"]),
        marketValue: pickFirstNumber(item, ["marketValue", "MarketValue"]),
        marketValueDate: pickFirstString(item, ["marketValueDate", "MarketValueDate"]),
        capitalValue: pickFirstNumber(item, ["capitalValue", "CapitalValue"]),
        lastCVCalculationDate: pickFirstString(item, ["lastCVCalculationDate", "LastCVCalculationDate"]),
        currentBookValue: pickFirstNumber(item, ["currentBookValue", "CurrentBookValue"]),
        depreciationRate: pickFirstNumber(item, ["depreciationRate", "DepreciationRate"]),
        ownershipType: pickFirstString(item, ["ownershipType", "OwnershipType"]),
        isRevenueGenerating:
          typeof item.isRevenueGenerating === "boolean"
            ? item.isRevenueGenerating
            : typeof item.IsRevenueGenerating === "boolean"
              ? item.IsRevenueGenerating
              : null,
        operationalControl: pickFirstString(item, ["operationalControl", "OperationalControl"]),
        assetCondition: pickFirstString(item, ["assetCondition", "AssetCondition"]),
        createdDate: pickFirstString(item, ["createdDate", "CreatedDate"]),
        floorDetailsId: pickFirstNumber(item, ["floorDetailsId", "FloorDetailsId"]),
        updatedDate: pickFirstString(item, ["updatedDate", "UpdatedDate"]),
        authorityName: pickFirstString(item, ["authorityName", "AuthorityName"]),
        organizationName: pickFirstString(item, ["organizationName", "OrganizationName"]),
        departmentName: pickFirstString(item, ["departmentName", "DepartmentName"]),
        moujaName: pickFirstString(item, ["moujaName", "MoujaName"]),
        typeOfUseName: pickFirstString(item, ["typeOfUseName", "TypeOfUseName"]),
        subTypeOfUseName: pickFirstString(item, ["subTypeOfUseName", "SubTypeOfUseName"]),
        fieldValues: Array.isArray(item.fieldValues) ? item.fieldValues : Array.isArray(item.FieldValues) ? item.FieldValues : null,
        hasLift: typeof item.hasLift === "boolean" ? item.hasLift : typeof item.HasLift === "boolean" ? item.HasLift : null,
        wardName: pickFirstString(item, ["wardName", "WardName"]),
        zoneName: pickFirstString(item, ["zoneName", "ZoneName"]),
        builtUpAreaSqMeter: pickFirstNumber(item, ["builtUpAreaSqMeter", "BuiltUpAreaSqMeter"]),
        carpetAreaSqMeter: pickFirstNumber(item, ["carpetAreaSqMeter", "CarpetAreaSqMeter"]),
        status: pickFirstString(item, ["status", "Status"]),
        occupancyStatus: pickFirstString(item, ["occupancyStatus", "OccupancyStatus"]),
        isActive: typeof item.isActive === "boolean" ? item.isActive : typeof item.IsActive === "boolean" ? item.IsActive : null,
        // Renter / lease fields from first renterDetails entry
        renterName: pickFirstString(renter, ["renterName", "RenterName"]),
        gstNo: pickFirstString(renter, ["gstNo", "GstNo"]),
        aadhaarCardNo: pickFirstString(renter, ["aadhaarCardNo", "AadhaarCardNo"]),
        panCardNo: pickFirstString(renter, ["panCardNo", "PanCardNo"]),
        mobileNo: pickFirstString(renter, ["mobileNo", "MobileNo"]),
        emailId: pickFirstString(renter, ["emailId", "EmailId"]),
        leaseRentType: pickFirstString(renter, ["leaseRentType", "LeaseRentType"]),
        fromDate: pickFirstString(renter, ["fromDate", "FromDate"]),
        toDate: pickFirstString(renter, ["toDate", "ToDate"]),
        duration: pickFirstNumber(renter, ["duration", "Duration"]),
        rentFrequency: pickFirstString(renter, ["rentFrequency", "RentFrequency"]),
        rentAmount: pickFirstNumber(renter, ["rentAmount", "RentAmount"]),
        securityDeposit: pickFirstNumber(renter, ["securityDeposit", "SecurityDeposit"]),
        depositType: pickFirstString(renter, ["depositType", "DepositType"]),
        agreementId: pickFirstString(renter, ["agreementId", "AgreementId"]),
        incrementFrequency: pickFirstString(renter, ["incrementFrequency", "IncrementFrequency"]),
        incrementType: pickFirstString(renter, ["incrementType", "IncrementType"]),
        incrementValue: pickFirstNumber(renter, ["incrementValue", "IncrementValue"]),
        incrementMethod: pickFirstString(renter, ["incrementMethod", "IncrementMethod"]),
        increment: pickFirstNumber(renter, ["increment", "Increment"]),
        incrementStatus:
          typeof renter.incrementStatus === "boolean"
            ? renter.incrementStatus
            : typeof renter.IncrementStatus === "boolean"
              ? renter.IncrementStatus
              : null,
        rentMonthly: pickFirstNumber(renter, ["rentMonthly", "RentMonthly"]),
        // Preserve full nested arrays for the drawer detail view
        renterDetails: Array.isArray(rentersRaw)
          ? (rentersRaw as Record<string, unknown>[]).map((r) => ({
              id: r.id ?? r.Id,
              renterName: pickFirstString(r, ["renterName", "RenterName"]),
              gstNo: pickFirstString(r, ["gstNo", "GstNo"]),
              aadhaarCardNo: pickFirstString(r, ["aadhaarCardNo", "AadhaarCardNo"]),
              panCardNo: pickFirstString(r, ["panCardNo", "PanCardNo"]),
              mobileNo: pickFirstString(r, ["mobileNo", "MobileNo"]),
              emailId: pickFirstString(r, ["emailId", "EmailId"]),
              leaseRentType: pickFirstString(r, ["leaseRentType", "LeaseRentType"]),
              fromDate: pickFirstString(r, ["fromDate", "FromDate"]),
              toDate: pickFirstString(r, ["toDate", "ToDate"]),
              duration: pickFirstNumber(r, ["duration", "Duration"]),
              rentFrequency: pickFirstString(r, ["rentFrequency", "RentFrequency"]),
              rentAmount: pickFirstNumber(r, ["rentAmount", "RentAmount"]),
              securityDeposit: pickFirstNumber(r, ["securityDeposit", "SecurityDeposit"]),
              depositType: pickFirstString(r, ["depositType", "DepositType"]),
              agreementId: pickFirstString(r, ["agreementId", "AgreementId"]),
              totalAreaSqFt: pickFirstNumber(r, ["totalAreaSqFt", "TotalAreaSqFt"]),
              incrementFrequency: pickFirstString(r, ["incrementFrequency", "IncrementFrequency"]),
              incrementType: pickFirstString(r, ["incrementType", "IncrementType"]),
              incrementValue: pickFirstNumber(r, ["incrementValue", "IncrementValue"]),
              incrementMethod: pickFirstString(r, ["incrementMethod", "IncrementMethod"]),
              increment: pickFirstNumber(r, ["increment", "Increment"]),
              incrementStatus: typeof r.incrementStatus === "boolean" ? r.incrementStatus : typeof r.IncrementStatus === "boolean" ? r.IncrementStatus : null,
              rentMonthly: pickFirstNumber(r, ["rentMonthly", "RentMonthly"]),
            }))
          : null,
        roomWiseSubmissions: (() => {
          const raw = item.roomWiseSubmissions ?? item.RoomWiseSubmissions;
          if (!Array.isArray(raw)) return null;
          return (raw as Record<string, unknown>[]).map((r) => ({
            id: r.id ?? r.Id,
            roomNo: pickFirstString(r, ["roomNo", "RoomNo"]),
            roomType: pickFirstString(r, ["roomType", "RoomType"]),
            shape: pickFirstString(r, ["shape", "Shape"]),
            submissionType: pickFirstString(r, ["submissionType", "SubmissionType"]),
            lengthMtr: pickFirstNumber(r, ["lengthMtr", "LengthMtr"]),
            widthMtr: pickFirstNumber(r, ["widthMtr", "WidthMtr"]),
            heightMtr: pickFirstNumber(r, ["heightMtr", "HeightMtr"]),
            noOfRooms: pickFirstNumber(r, ["noOfRooms", "NoOfRooms"]),
            outerYesNo: typeof r.outerYesNo === "boolean" ? r.outerYesNo : typeof r.OuterYesNo === "boolean" ? r.OuterYesNo : null,
            minusYesNo: typeof r.minusYesNo === "boolean" ? r.minusYesNo : typeof r.MinusYesNo === "boolean" ? r.MinusYesNo : null,
          }));
        })(),
        floorDetails: (() => {
          const raw = item.floorDetails ?? item.FloorDetails;
          if (!Array.isArray(raw)) return null;
          return (raw as Record<string, unknown>[]).map((f) => ({
            id: f.id ?? f.Id,
            floorName: pickFirstString(f, ["floorName", "FloorName"]),
            subFloorName: pickFirstString(f, ["subFloorName", "SubFloorName"]),
            constructionYear: pickFirstString(f, ["constructionYear", "ConstructionYear"]),
            constructionTypeName: pickFirstString(f, ["constructionTypeName", "ConstructionTypeName"]),
            typeOfUseName: pickFirstString(f, ["typeOfUseName", "TypeOfUseName"]),
            subTypeOfUseName: pickFirstString(f, ["subTypeOfUseName", "SubTypeOfUseName"]),
            carpetAreaSqMeter: pickFirstNumber(f, ["carpetAreaSqMeter", "CarpetAreaSqMeter"]),
            carpetAreaSqFeet: pickFirstNumber(f, ["carpetAreaSqFeet", "CarpetAreaSqFeet"]),
            builtUpAreaSqMeter: pickFirstNumber(f, ["builtUpAreaSqMeter", "BuiltUpAreaSqMeter"]),
            builtUpAreaSqFeet: pickFirstNumber(f, ["builtUpAreaSqFeet", "BuiltUpAreaSqFeet"]),
            noOfRooms: pickFirstNumber(f, ["noOfRooms", "NoOfRooms"]),
            capitalValue: pickFirstNumber(f, ["capitalValue", "CapitalValue"]),
            marketValue: pickFirstNumber(f, ["marketValue", "MarketValue"]),
          }));
        })(),
      };
    })
    .filter(Boolean) as AssetChildAssetItem[];

  return {
    childAssets: mapped,
    totalSubAssets,
    error: null,
  };
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
