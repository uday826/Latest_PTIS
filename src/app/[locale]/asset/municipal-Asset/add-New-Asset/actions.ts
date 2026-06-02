"use server";

import { assetFieldDefinitionService } from "@/lib/api/asset/asset-field-definition.service";
import { AssetFieldDefinition } from "@/lib/api/asset/asset-field-definition.service";
import {
  getDocumentDefinitions,
  getDocumentsByAsset,
  deleteDocument,
  uploadDocument
} from "@/lib/api/asset/asset-document.server.service";
import { ApiResponse } from "@/types/common.types";

import { assetMasterService } from "@/lib/api/asset/asset-master.service";
import { apiClient } from "@/services/api.service";
import { assetFieldValueService } from "@/lib/api/asset/asset-field-value.service";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { categoryTypeService } from "@/lib/api/asset/category-type.service";
import { departmentService } from "@/lib/api/asset/department.service";
import { wardService } from "@/lib/api/asset/ward.service";
import { zoneService } from "@/lib/api/asset/zone.service";
import { moujaService } from "@/lib/api/asset/mouja.service";
import { AssetFormData, AssetMasterRequest } from "@/types/asset-types/basic-info/asset-wizard.types";

/**
 * Fetches field definitions based on selected category and type
 */
export const fetchFieldDefinitions = async (categoryId: number, typeId: number): Promise<AssetFieldDefinition[]> => {
  try {
    const response = await assetFieldDefinitionService.getFieldDefinitions(categoryId, typeId);
    if (response.success && response.data) {
      const data = response.data;
      if (Array.isArray(data)) {
        return data;
      }
      const rawData = data as any;
      if (rawData.items && Array.isArray(rawData.items)) {
        return rawData.items;
      }
      if (rawData.data && Array.isArray(rawData.data)) {
        return rawData.data;
      }
      return [];
    } else {
      console.error("Failed to fetch field definitions", response.error);
      return [];
    }
  } catch (error) {
    console.error("Error fetching field definitions", error);
    return [];
  }
};

/**
 * Fetches document definitions based on selected category and type
 */
export const fetchDocumentDefinitionsAction = async (
  categoryId: number,
  typeId?: number
): Promise<ApiResponse<any>> => {
  try {
    const res = await getDocumentDefinitions(categoryId, typeId);
    if (res.success && res.data) {
      const raw = res.data as any;
      const arrayData = Array.isArray(raw) ? raw : (raw.items || raw.data || []);
      return { ...res, data: arrayData };
    }
    return res;
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to fetch document definitions" };
  }
};

/**
 * Fetches already uploaded documents for a given asset ID
 */
export const fetchUploadedDocumentsAction = async (
  assetId: number
): Promise<ApiResponse<any>> => {
  try {
    const res = await getDocumentsByAsset(assetId);
    if (res.success && res.data) {
      const raw = res.data as any;
      const arrayData = Array.isArray(raw) ? raw : (raw.items || raw.data || []);
      return { ...res, data: arrayData };
    }
    return res;
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to fetch uploaded documents" };
  }
};

/**
 * Deletes a document by ID
 */
export const deleteUploadedDocAction = async (
  docId: number
): Promise<ApiResponse<any>> => {
  try {
    return await deleteDocument(docId);
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete document" };
  }
};

/**
 * Uploads a document via multipart FormData
 */
export const uploadDocumentAction = async (
  formData: FormData
): Promise<ApiResponse<any>> => {
  try {
    return await uploadDocument(formData);
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to upload document" };
  }
};

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

    // Ensure assetCode is truly unique by appending a random suffix if it's a default placeholder
    let finalAssetCode = formData.assetCode;
    if (!finalAssetCode || finalAssetCode.startsWith("AST-") || finalAssetCode === "BLD-2024-MO-001" || finalAssetCode.trim() === "") {
      const entropy = Math.random().toString(36).substring(2, 6).toUpperCase();
      const timestamp = Date.now().toString().slice(-6);
      const isBuilding = formData.category === "Building Assets" || formData.category === "BUILDING" || String(formData.categoryId) === "1";
      if (isBuilding) {
        finalAssetCode = `BLD-2024-MO-${timestamp}-${entropy}`;
      } else {
        finalAssetCode = `LND-${timestamp}-${entropy}`;
      }
    }

    const floors = formData.floors || [];
    const calculatedBuildingValue = floors.reduce((acc: number, f: any) => acc + (f.checked ? Number(f.baseValue || 0) : 0), 0);

    const isBuilding = formData.category === "Building Assets" || formData.category === "BUILDING" || String(formData.categoryId) === "1";
    const categoryId = formData.categoryId ? Number(formData.categoryId) : (isBuilding ? 1 : 2);
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

    const totalBuiltUpSqM = floors.reduce((acc: number, f: any) => acc + (f.checked ? Number(f.builtUpAreaSqM || 0) : 0), 0);
    const totalCarpetSqM = floors.reduce((acc: number, f: any) => acc + (f.checked ? Number(f.carpetAreaSqM || 0) : 0), 0);

    const cookieStore = await cookies();
    const userIdVal = cookieStore.get("user_id")?.value;
    const userId = userIdVal ? Number(userIdVal) : 1;

    const apiRequest: AssetMasterRequest = {
      authorityId: 1,
      organizationId: 1,
      departmentId: getSafeForeignKeyId(parseNumericId(formData.departmentId || formData.department, departmentMapping), dbDeptIds, true),
      assetNo: finalAssetCode,
      assetName: formData.assetName || `${formData.assetType} - ${finalAssetCode}`,
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
      }).map(([key, value]) => {
        const definition = fieldDefs.find(
          (d: any) =>
            d.fieldName?.toLowerCase() === key.toLowerCase() ||
            d.fieldCode?.toLowerCase() === key.toLowerCase()
        );
        const fieldDefinitionId = definition ? definition.id : 1; // Fallback to 1

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
          fieldName: definition?.fieldName || key,
          textValue,
          numberValue,
          dateValue,
          booleanValue
        };
      })
    };

    console.log("SUBMITTING ASSET MASTER API REQUEST PAYLOAD:", JSON.stringify(apiRequest, null, 2));

    // 2. Execute POST or PUT request via Service Layer to save/update Asset Master
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
        const fs = require("fs");
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
        fs.appendFileSync("server-errors.log", logContent);
      } catch (logErr) {
        console.error("Failed to write to server-errors.log:", logErr);
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
      revalidatePath("/[locale]/asset/municipal-Asset", "page");
      const generatedCode = response.data?.assetCode || (response.data as any)?.assetNo || finalAssetCode;
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
      revalidatePath("/[locale]/asset/municipal-Asset", "page");
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
