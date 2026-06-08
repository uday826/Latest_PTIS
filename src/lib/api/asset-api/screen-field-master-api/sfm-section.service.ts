import type {
  ScreenSection,
} from '@/types/asset-type/screenfieldmaster.types';
import { apiClient } from '@/services/api.service';
import { ApiError } from '@/lib/utils/api';
import { buildSectionPayload } from './sfm-payload';
import { isSectionShape, normalizeSection } from './sfm-types-guard';
import { createLogger } from '@/lib/utils/server-logger';

const log = createLogger('SectionService');

/** GET /api/ScreenFormSectionMaster?ScreenId={screenId} */
export async function getSectionsByScreen(
  screenId: string | number,
  page: number = 1,
  pageSize: number = 100
): Promise<{ items: ScreenSection[]; totalCount: number }> {
  if (!screenId) return { items: [], totalCount: 0 };
  
  const response = await apiClient.get<{ items: unknown[]; totalCount?: number }>(
    `/ScreenFormSectionMaster?screenId=${encodeURIComponent(String(screenId))}&pageNumber=${page}&pageSize=${pageSize}`
  );

  if (!response.success) {
    throw new ApiError(response.statusCode ?? 500, response.error || 'Failed to fetch sections by screen id', 'getSectionsByScreen');
  }

  const data = response.data;
  const list = data ? (Array.isArray(data) ? data : (data.items || [])) : [];
  const normalizedList = list.filter(isSectionShape).map(normalizeSection);

  return {
    items: normalizedList,
    totalCount: data && !Array.isArray(data) ? (data.totalCount || list.length) : list.length,
  };
}

/** POST or PUT /api/ScreenFormSectionMaster */
export async function saveSection(section: Record<string, unknown>): Promise<ScreenSection> {
  const numericId = Number(section.id);
  const isUpdate = !isNaN(numericId) && numericId > 0;
  const endpoint = isUpdate
    ? `/ScreenFormSectionMaster/${numericId}`
    : `/ScreenFormSectionMaster`;
  const userId = (section.userId !== null && section.userId !== undefined) ? Number(section.userId) : null;
  if (!userId) {
    throw new ApiError(401, 'Unauthorized: User ID is required for saving section', 'saveSection');
  }
  const payload = buildSectionPayload(section, isUpdate, userId);

  const response = isUpdate
    ? await apiClient.put<unknown>(endpoint, payload)
    : await apiClient.post<unknown>(endpoint, payload);

  if (response.success) {
    const rawData = response.data;
    // Handle potential wrapping (array, items, or nested data property)
    const actualData = (rawData && typeof rawData === 'object')
      ? (Array.isArray(rawData) ? rawData[0] : ((rawData as { items?: unknown[]; data?: unknown }).items?.[0] ?? (rawData as { items?: unknown[]; data?: unknown }).data ?? rawData))
      : null;

    if (actualData && isSectionShape(actualData)) {
        return normalizeSection(actualData as Record<string, unknown>);
    }
    
    // Recovery for 'Ghost Saves': If POST succeeded but returned no data, try to find the section by code
    if (!isUpdate) {
      const searchCode = String(section.sectionCode || '').toLowerCase().trim();
      const screenId = String(section.screenId || '');
      if (searchCode && screenId) {
        // Corrected function name to getSectionsByScreen
        const { items } = await getSectionsByScreen(screenId, 1, 100);
        const match = items.find(s => s.sectionCode?.toLowerCase().trim() === searchCode);
        if (match) return match;
      }
    }
    
    // Strict API reliance: if we updated but got no data back, we need the original ID at least
    if (isUpdate && numericId) {
      return normalizeSection({ ...section, id: numericId });
    }
    
    throw new ApiError(500, 'API failed to return valid section data after save', 'saveSection');
  }

  log.error('saveSection failed', { section, statusCode: response.statusCode });
  throw new ApiError(response.statusCode ?? 500, response.error || 'Failed to save section', 'saveSection');
}

/** DELETE /api/ScreenFormSectionMaster/{id} */
export async function deleteSection(id: string | number): Promise<void> {
  const response = await apiClient.delete<void>(`/ScreenFormSectionMaster/${encodeURIComponent(String(id))}`);
  if (!response.success && response.statusCode !== 204) {
    throw new ApiError(response.statusCode ?? 500, response.error || 'Failed to delete section', 'deleteSection');
  }
}

export async function toggleSectionStatus(section: ScreenSection): Promise<ScreenSection> {
  return saveSection({ ...section as unknown as Record<string, unknown>, isActive: !section.isActive });
}

export const SectionService = {
  getSectionsByScreen,
  saveSection,
  deleteSection,
  toggleSectionStatus
};

