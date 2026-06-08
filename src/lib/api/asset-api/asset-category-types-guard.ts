import { AssetCategory } from "@/types/asset-type/asset-category.types";
import { parseBoolean } from "@/lib/utils/type-guards";

/**
 * Type guard to check if a value is a valid AssetCategory shape.
 */
export function isAssetCategoryShape(value: unknown): value is Record<string, unknown> {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;

  // Accept both 'id' and 'categoryId' for flexibility with different API responses
  const id = Number(obj.id ?? obj.Id ?? obj.categoryId ?? obj.CategoryId);
  return Number.isFinite(id) && id >= 0;
}

/**
 * Normalizes raw API data into a standardized AssetCategory model.
 * Throws ApiError if critical fields are missing or invalid.
 */
export function normalizeAssetCategory(data: Record<string, unknown>): AssetCategory {
  const id = Number(data.id ?? data.Id ?? data.categoryId ?? data.CategoryId ?? 0);
  const categoryCode = String(data.categoryCode ?? data.CategoryCode ?? data.code ?? data.Code ?? `CAT_${id}`).trim() || `CAT_${id}`;
  const categoryName = String(data.categoryName ?? data.CategoryName ?? data.name ?? data.Name ?? `Unnamed Category ${id}`).trim() || `Unnamed Category ${id}`;

  return {
    id,
    categoryCode,
    categoryName,
    description: String(data.description ?? data.Description ?? "").trim(),
    isActive: parseBoolean(data.isActive ?? data.IsActive ?? data.isStatus ?? data.IsStatus),
    createdDate: String(data.createdDate ?? data.CreatedDate ?? "").trim(),
    updatedDate: data.updatedDate || data.UpdatedDate ? String(data.updatedDate ?? data.UpdatedDate) : null,
  };
}

import { MasterDataRecord } from "@/types/asset-type/master-data.types";

/**
 * Maps Asset Category to the standardized MasterDataRecord shape
 */
export function mapCategoryToMasterRecord(cat: AssetCategory): MasterDataRecord {
  return {
    id: cat.categoryCode || String(cat.id),
    backendId: cat.id,
    name: cat.categoryName,
    description: cat.description,
    status: cat.isActive ? 'Active' : 'Inactive'
  };
}
