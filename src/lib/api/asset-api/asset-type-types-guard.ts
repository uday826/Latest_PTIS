import { AssetType } from "@/types/asset-type/asset-type.types";
import { parseBoolean } from "@/lib/utils/type-guards";

/**
 * Type guard to check if a value is a valid AssetType shape.
 */
export function isAssetTypeShape(value: unknown): value is Record<string, unknown> {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;

  const id = Number(obj.id ?? obj.Id ?? obj.assetTypeId ?? obj.AssetTypeId);
  return Number.isFinite(id) && id > 0;
}

/**
 * Normalizes raw API data into a standardized AssetType model.
 * Applies safe defaults for missing/invalid optional fields.
 */
export function normalizeAssetType(data: Record<string, unknown>): AssetType {
  const id = Number(data.id ?? data.Id ?? data.assetTypeId ?? data.AssetTypeId ?? 0);
  const typeCode = String(data.typeCode ?? data.TypeCode ?? data.code ?? data.Code ?? `TYPE_${id}`).trim() || `TYPE_${id}`;
  const typeName = String(data.typeName ?? data.TypeName ?? data.name ?? data.Name ?? `Unnamed Type ${id}`).trim() || `Unnamed Type ${id}`;

  return {
    id,
    typeCode,
    typeName,
    categoryId: Number(data.categoryId ?? data.CategoryId ?? data.assetCategoryId ?? data.AssetCategoryId ?? 0),
    categoryName: String(data.categoryName ?? data.CategoryName ?? "").trim(),
    description: String(data.description ?? data.Description ?? "").trim(),
    isActive: parseBoolean(data.isActive ?? data.IsActive ?? data.isStatus ?? data.IsStatus),
    allowUnitRegistration: parseBoolean(data.allowUnitRegistration ?? data.AllowUnitRegistration),
    allowRoomRegistration: parseBoolean(data.allowRoomRegistration ?? data.AllowRoomRegistration),
    createdDate: String(data.createdDate ?? data.CreatedDate ?? "").trim(),
    updatedDate: data.updatedDate || data.UpdatedDate ? String(data.updatedDate ?? data.UpdatedDate) : null,
  };
}

import { MasterDataRecord } from "@/types/asset-type/master-data.types";

/**
 * Maps Asset Type to the standardized MasterDataRecord shape
 */
export function mapTypeToMasterRecord(type: AssetType): MasterDataRecord {
  return {
    id: type.typeCode || String(type.id),
    backendId: type.id,
    name: type.typeName,
    description: type.description,
    group: String(type.categoryId),
    status: type.isActive ? 'Active' : 'Inactive',
    allowUnitRegistration: type.allowUnitRegistration,
    allowRoomRegistration: type.allowRoomRegistration
  };
}
