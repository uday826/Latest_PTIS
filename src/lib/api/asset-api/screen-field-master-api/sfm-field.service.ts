import type {
  ScreenField,
} from '@/types/asset-type/screenfieldmaster.types';
import { apiClient } from '@/services/api.service';
import { ApiError } from '@/lib/utils/api';
import { buildFieldPayload } from './sfm-payload';
import { isFieldShape, normalizeField } from './sfm-types-guard';
import { createLogger } from '@/lib/utils/server-logger';

const log = createLogger('FieldService');

/** GET /api/ScreenFormFieldMaster?SectionId={sectionId} */
export async function getFieldsBySection(
  sectionId: string | number,
  page: number = 1,
  pageSize: number = 100
): Promise<{ items: ScreenField[]; totalCount: number }> {
  if (!sectionId) return { items: [], totalCount: 0 };

  const response = await apiClient.get<{ items: unknown[]; totalCount?: number }>(
    `/ScreenFormFieldMaster?sectionId=${encodeURIComponent(String(sectionId))}&pageNumber=${page}&pageSize=${pageSize}`
  );

  if (!response.success) {
    throw new ApiError(response.statusCode ?? 500, response.error || 'Failed to fetch fields by section id', 'getFieldsBySection');
  }

  const data = response.data;
  const list = data ? (Array.isArray(data) ? data : (data.items || [])) : [];

  return {
    items: list.filter(isFieldShape).map(normalizeField),
    totalCount: data && !Array.isArray(data) ? (data.totalCount || list.length) : list.length,
  };
}

/** GET /api/ScreenFormFieldMaster?ScreenId={screenId} — Batch fetch all fields for a screen */
export async function getFieldsByScreen(
  screenId: string | number,
  page: number = 1,
  pageSize: number = 1000
): Promise<{ items: ScreenField[]; totalCount: number }> {
  if (!screenId) return { items: [], totalCount: 0 };

  const response = await apiClient.get<{ items: unknown[]; totalCount?: number }>(
    `/ScreenFormFieldMaster?screenId=${encodeURIComponent(String(screenId))}&pageNumber=${page}&pageSize=${pageSize}`
  );

  if (!response.success) {
    throw new ApiError(response.statusCode ?? 500, response.error || 'Failed to fetch fields by screen id', 'getFieldsByScreen');
  }

  const data = response.data;
  const list = data ? (Array.isArray(data) ? data : (data.items || [])) : [];

  return {
    items: list.filter(isFieldShape).map(normalizeField),
    totalCount: data && !Array.isArray(data) ? (data.totalCount || list.length) : list.length,
  };
}

/** POST or PUT /api/ScreenFormFieldMaster */
export async function saveField(field: Record<string, unknown>): Promise<ScreenField> {
  const numericId = Number(field.id);
  const isUpdate = !isNaN(numericId) && numericId > 0;
  const endpoint = isUpdate
    ? `/ScreenFormFieldMaster/${numericId}`
    : `/ScreenFormFieldMaster`;
  const userId = (field.userId !== null && field.userId !== undefined) ? Number(field.userId) : null;
  if (!userId) {
    throw new ApiError(401, 'Unauthorized: User ID is required for saving field', 'saveField');
  }
  const payload = buildFieldPayload(field, isUpdate, userId);

  const response = isUpdate
    ? await apiClient.put<unknown>(endpoint, payload)
    : await apiClient.post<unknown>(endpoint, payload);

  if (response.success) {
    const rawData = response.data;
    // Handle potential wrapping (array, items, or nested data property)
    const actualData = (rawData && typeof rawData === 'object')
      ? (Array.isArray(rawData) ? rawData[0] : ((rawData as { items?: unknown[]; data?: unknown }).items?.[0] ?? (rawData as { items?: unknown[]; data?: unknown }).data ?? rawData))
      : null;

    if (actualData && isFieldShape(actualData)) {
        return normalizeField(actualData as Record<string, unknown>);
    }
    
    // Recovery for 'Ghost Saves': If POST succeeded but returned no data, try to find the field by code
    if (!isUpdate) {
      const searchCode = String(field.fieldCode || '').toLowerCase().trim();
      const sectionId = String(field.sectionId || '');
      if (searchCode && sectionId) {
        const { items } = await getFieldsBySection(sectionId, 1, 100);
        const match = items.find(f => f.fieldCode?.toLowerCase().trim() === searchCode);
        if (match) return match;
      }
    }
    
    // Strict API reliance: if we updated but got no data back, we need the original ID at least
    if (isUpdate && numericId) {
      return normalizeField({ ...field, id: numericId });
    }
    
    throw new ApiError(500, 'API failed to return valid field data after save', 'saveField');
  }

  log.error('saveField failed', { field, statusCode: response.statusCode });
  throw new ApiError(response.statusCode ?? 500, response.error || 'Failed to save field', 'saveField');
}

/** DELETE /api/ScreenFormFieldMaster/{id} */
export async function deleteField(id: string | number): Promise<void> {
  const response = await apiClient.delete<void>(`/ScreenFormFieldMaster/${encodeURIComponent(String(id))}`);
  if (!response.success && response.statusCode !== 204) {
    throw new ApiError(response.statusCode ?? 500, response.error || 'Failed to delete field', 'deleteField');
  }
}

export async function toggleFieldStatus(field: ScreenField): Promise<ScreenField> {
  return saveField({ ...field as unknown as Record<string, unknown>, isActive: !field.isActive });
}

export const FieldService = {
  getFieldsBySection,
  getFieldsByScreen,
  saveField,
  deleteField,
  toggleFieldStatus
};

