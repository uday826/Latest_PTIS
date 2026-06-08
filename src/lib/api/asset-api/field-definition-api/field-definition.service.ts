import { apiClient } from '@/services/api.service';
import { ApiError } from '@/lib/utils/api';
import type { AssetFieldDefinition } from '@/types/asset-type/screenfieldmaster.types';
import { isFieldDefinitionShape, normalizeFieldDefinition } from './field-definition-types-guard';
import { createLogger } from '@/lib/utils/server-logger';

const log = createLogger('FieldDefinitionService');

export async function getFieldDefinitionsPaged(
  categoryId?: number | null,
  typeId?: number | null,
  page: number = 1,
  pageSize: number = 1000
): Promise<{ items: AssetFieldDefinition[]; totalCount: number }> {
  const params = new URLSearchParams({
    pageNumber: page.toString(),
    pageSize: pageSize.toString(),
  });

  if (categoryId) {
    params.append('AssetCategoryId', categoryId.toString());
  }
  if (typeId) {
    params.append('AssetTypeId', typeId.toString());
  }

  const response = await apiClient.get<{ items: unknown[]; totalCount?: number }>(
    `/AssetFieldDefinition?${params.toString()}`
  );

  if (!response.success) {
    throw new ApiError(
      response.statusCode ?? 500,
      response.error || 'Failed to fetch field definitions',
      'getFieldDefinitionsPaged'
    );
  }

  const data = response.data;
  const list = data ? (Array.isArray(data) ? data : (data.items || [])) : [];

  return {
    items: list.filter(isFieldDefinitionShape).map(normalizeFieldDefinition),
    totalCount: data && !Array.isArray(data) ? (data.totalCount || list.length) : list.length,
  };
}

export async function getFieldDefinitionById(id: number): Promise<AssetFieldDefinition> {
  const response = await apiClient.get<unknown>(`/AssetFieldDefinition/${id}`);
  if (!response.success || !response.data) {
    throw new ApiError(
      response.statusCode ?? 500,
      response.error || `Failed to fetch field definition ${id}`,
      'getFieldDefinitionById'
    );
  }
  if (isFieldDefinitionShape(response.data)) {
    return normalizeFieldDefinition(response.data);
  }
  throw new ApiError(500, 'Invalid data shape returned from server', 'getFieldDefinitionById');
}

export async function saveFieldDefinition(field: Record<string, unknown>): Promise<AssetFieldDefinition> {
  const numericId = Number(field.id);
  const isUpdate = !isNaN(numericId) && numericId > 0;
  const endpoint = isUpdate ? `/AssetFieldDefinition/${numericId}` : `/AssetFieldDefinition`;

  // Build clean payload matching backend DTO
  const payload = {
    id: isUpdate ? numericId : undefined,
    assetCategoryId: Number(field.assetCategoryId),
    assetTypeId: Number(field.assetTypeId),
    fieldCode: String(field.fieldCode || '').trim(),
    fieldName: String(field.fieldName || '').trim(),
    fieldLabel: String(field.fieldLabel || '').trim(),
    fieldType: String(field.fieldType || 'text').trim(),
    fieldGroup: field.fieldGroup ? String(field.fieldGroup).trim() : null,
    isRequired: Boolean(field.isRequired ?? false),
    displayOrder: Number(field.displayOrder ?? 0),
    validationRules: field.validationRules ? String(field.validationRules).trim() : null,
    defaultValue: field.defaultValue ? String(field.defaultValue).trim() : null,
    minValue: field.minValue !== null && field.minValue !== undefined && field.minValue !== '' ? Number(field.minValue) : null,
    maxValue: field.maxValue !== null && field.maxValue !== undefined && field.maxValue !== '' ? Number(field.maxValue) : null,
    maxLength: field.maxLength !== null && field.maxLength !== undefined && field.maxLength !== '' ? Number(field.maxLength) : null,
    isActive: Boolean(field.isActive ?? true),
  };

  const response = isUpdate
    ? await apiClient.put<unknown>(endpoint, payload)
    : await apiClient.post<unknown>(endpoint, payload);

  if (!response.success) {
    log.error('saveFieldDefinition failed', { field, statusCode: response.statusCode });
    throw new ApiError(
      response.statusCode ?? 500,
      response.error || 'Failed to save field definition',
      'saveFieldDefinition'
    );
  }

  const rawData = response.data;
  const actualData = (rawData && typeof rawData === 'object')
    ? (Array.isArray(rawData) ? rawData[0] : ((rawData as { items?: unknown[]; data?: unknown }).items?.[0] ?? (rawData as { items?: unknown[]; data?: unknown }).data ?? rawData))
    : null;

  if (actualData && isFieldDefinitionShape(actualData)) {
    return normalizeFieldDefinition(actualData as Record<string, unknown>);
  }

  if (isUpdate && numericId) {
    return normalizeFieldDefinition({ ...field, id: numericId });
  }

  throw new ApiError(500, 'API failed to return valid field definition data after save', 'saveFieldDefinition');
}

export async function deleteFieldDefinition(id: number): Promise<void> {
  const response = await apiClient.delete<void>(`/AssetFieldDefinition/${id}`);
  if (!response.success && response.statusCode !== 204) {
    throw new ApiError(
      response.statusCode ?? 500,
      response.error || 'Failed to delete field definition',
      'deleteFieldDefinition'
    );
  }
}
