"use server";

/**
 * actions.ts — Building Basic Info dedicated server actions.
 *
 * Scoped to: /asset/municipal-Asset/add-New-Asset/basic-Info
 * Do NOT put generic asset or master-data actions here.
 */

import {
  groupAndMergeFields,
  processFieldDefinitions,
  type MergedFieldSection,
  type ProcessedField,
} from "@/components/modules/assets/municipal-Asset/add-New-Asset/FieldRenderer";
import { assetFieldDefinitionService } from "@/lib/api/asset/asset-field-definition.service";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FetchFieldDefinitionsResult {
  success: true;
  data: ProcessedField[];
  sections: MergedFieldSection[];
}

export interface FetchFieldDefinitionsError {
  success: false;
  error: string;
}

export type FetchFieldDefinitionsResponse =
  | FetchFieldDefinitionsResult
  | FetchFieldDefinitionsError;

// ─── Server Action ────────────────────────────────────────────────────────────

/**
 * Fetches and processes dynamic field definitions for the Building Basic Info
 * step.  Called server-side from the page.tsx so no client-side useEffect fetch
 * is needed.
 *
 * @param categoryId  Numeric asset category ID (Building = resolved from API)
 * @param typeId      Numeric asset type ID
 */
export async function fetchBuildingFieldDefinitions(
  categoryId: number,
  typeId: number
): Promise<FetchFieldDefinitionsResponse> {
  if (!categoryId || !typeId || categoryId <= 0 || typeId <= 0) {
    return { success: false, error: "Invalid categoryId or typeId." };
  }

  try {
    const response = await assetFieldDefinitionService.getFieldDefinitions(
      categoryId,
      typeId
    );

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error ?? "Failed to fetch field definitions.",
      };
    }

    // Normalise: the API may return a wrapper object or a bare array
    const rawData = response.data;
    const fieldsArray: unknown[] = Array.isArray(rawData)
      ? rawData
      : (rawData as { items?: unknown[]; data?: unknown[] }).items ??
        (rawData as { items?: unknown[]; data?: unknown[] }).data ??
        [];

    // Filter to only fields that belong to the requested category + type
    const filtered = fieldsArray.filter((field) => {
      if (typeof field !== "object" || field === null) return false;
      const f = field as Record<string, unknown>;
      const rawCatId =
        f.assetCategoryId ?? f.categoryId ?? f.AssetCategoryId ?? f.CategoryId;
      const rawTypeId =
        f.assetTypeId ?? f.typeId ?? f.AssetTypeId ?? f.TypeId;

      // If the API doesn't return IDs, trust the endpoint filtered correctly
      if (rawCatId === undefined || rawCatId === null) return true;
      return (
        Number(rawCatId) === categoryId && Number(rawTypeId) === typeId
      );
    });

    const processed = processFieldDefinitions({
      success: true,
      data: filtered as Parameters<typeof processFieldDefinitions>[0]["data"],
    });
    const sections = groupAndMergeFields(processed);

    return { success: true, data: processed, sections };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unexpected error fetching fields.";
    return { success: false, error: message };
  }
}

/**
 * Fetches dynamic parent assets from the backend (AssetMaster)
 * to populate the Hierarchy Linkage drop-down options.
 */
export async function fetchParentAssetsAction(): Promise<{
  success: boolean;
  data: Array<{ id: number; assetName: string; assetNo: string }>;
  error?: string;
}> {
  try {
    const { assetMasterService } = await import("@/lib/api/asset/asset-master.service");
    const response = await assetMasterService.getAllAssets();
    if (response.success && response.data) {
      // Map and filter active assets (e.g. only assets that can be parents)
      const list = Array.isArray(response.data) ? response.data : [];
      return {
        success: true,
        data: list.map((item: any) => ({
          id: Number(item.id || item.Id),
          assetName: item.assetName || item.AssetName || `Asset ${item.id}`,
          assetNo: item.assetNo || item.AssetNo || "",
        })),
      };
    }
    return { success: false, data: [], error: response.error || "Failed to fetch assets" };
  } catch (error: any) {
    console.error("Error in fetchParentAssetsAction:", error);
    return { success: false, data: [], error: error?.message || "Failed to fetch parent assets" };
  }
}
