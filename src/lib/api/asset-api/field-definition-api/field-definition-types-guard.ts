import { ApiError } from '@/lib/utils/api';
import type { AssetFieldDefinition } from '@/types/asset-type/screenfieldmaster.types';

export function isFieldDefinitionShape(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  const id = obj.id ?? obj.assetFieldDefinitionId;
  return id !== undefined && id !== null;
}

export function normalizeFieldDefinition(data: Record<string, unknown>): AssetFieldDefinition {
  const id = Number(data.id ?? data.assetFieldDefinitionId);
  if (isNaN(id)) {
    throw new ApiError(500, 'Invalid data received from server', `Invalid field definition id: ${data.id}`);
  }
  return {
    id,
    assetCategoryId: Number(data.assetCategoryId ?? 0),
    assetTypeId: Number(data.assetTypeId ?? 0),
    fieldCode: String(data.fieldCode ?? ''),
    fieldName: String(data.fieldName ?? ''),
    fieldLabel: String(data.fieldLabel ?? ''),
    fieldType: String(data.fieldType ?? 'text'),
    fieldGroup: data.fieldGroup ? String(data.fieldGroup) : null,
    isRequired: Boolean(data.isRequired ?? false),
    displayOrder: Number(data.displayOrder ?? 0),
    validationRules: data.validationRules ? String(data.validationRules) : null,
    defaultValue: data.defaultValue ? String(data.defaultValue) : null,
    minValue: data.minValue !== null && data.minValue !== undefined ? Number(data.minValue) : null,
    maxValue: data.maxValue !== null && data.maxValue !== undefined ? Number(data.maxValue) : null,
    maxLength: data.maxLength !== null && data.maxLength !== undefined ? Number(data.maxLength) : null,
    isActive: Boolean(data.isActive ?? true),
    createdDate: data.createdDate ? String(data.createdDate) : undefined,
    modifiedDate: data.modifiedDate || data.updatedDate ? String(data.modifiedDate || data.updatedDate) : undefined,
    createdBy: data.createdBy !== null && data.createdBy !== undefined ? Number(data.createdBy) : undefined,
    updatedBy: data.updatedBy !== null && data.updatedBy !== undefined ? Number(data.updatedBy) : undefined,
  };
}
