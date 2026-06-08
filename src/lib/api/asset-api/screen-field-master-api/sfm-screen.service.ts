import type {
  ScreenConfig,
  ScreenGroupConfig,
  ScreenSection,
  ScreenField,
} from '@/types/asset-type/screenfieldmaster.types';
import { apiClient } from '@/services/api.service';
import { ApiError } from '@/lib/utils/api';
import { buildScreenPayload, buildGroupPayload } from './sfm-payload';
import { SectionService } from './sfm-section.service';
import { isScreenShape, normalizeScreen, isScreenGroupShape, normalizeScreenGroup } from './sfm-types-guard';
import { createLogger } from '@/lib/utils/server-logger';

const log = createLogger('ScreenService');

/** GET /api/Screen  — paginated list */
export async function getScreens(
  page: number = 1,
  pageSize: number = 10
): Promise<{ items: ScreenConfig[]; totalCount: number }> {
  const response = await apiClient.get<{ items: unknown[]; totalCount?: number }>(`/Screen?pageNumber=${page}&pageSize=${pageSize}`);
  if (!response.success) {
    throw new ApiError(response.statusCode ?? 500, response.error || 'Failed to fetch screens', 'getScreens');
  }
  const data = response.data;
  const list = data ? (Array.isArray(data) ? data : (data.items || [])) : [];
  const normalizedList = list.filter(isScreenShape).map(normalizeScreen);

  return {
    items: normalizedList,
    totalCount: data && !Array.isArray(data) ? (data.totalCount || list.length) : list.length,
  };
}

/** GET /api/Screen/{id} */
export async function getScreenById(id: string | number): Promise<ScreenConfig | null> {
  const response = await apiClient.get<unknown>(`/Screen/${encodeURIComponent(String(id))}`);
  if (!response.success) {
    if (response.statusCode === 404) return null;
    throw new ApiError(response.statusCode ?? 500, response.error || 'Failed to fetch screen by id', 'getScreenById');
  }
  
  if (response.data && isScreenShape(response.data)) {
      return normalizeScreen(response.data);
  }
  return null;
}

/** POST or PUT /api/Screen */
export async function saveScreen(screen: Record<string, unknown>): Promise<ScreenConfig> {
  const numericId = Number(screen.id);
  const isUpdate = !isNaN(numericId) && numericId > 0;
  const endpoint = isUpdate ? `/Screen/${numericId}` : `/Screen`;
  const userId = (screen.userId !== null && screen.userId !== undefined) ? Number(screen.userId) : null;
  if (!userId) {
    throw new ApiError(401, 'Unauthorized: User ID is required for saving screen', 'saveScreen');
  }
  const payload = buildScreenPayload(screen, isUpdate, userId);

  const response = isUpdate 
      ? await apiClient.put<unknown>(endpoint, payload)
      : await apiClient.post<unknown>(endpoint, payload);

  if (response.success) {
    const rawData = response.data;
    // Handle potential wrapping (array, items, or nested data property)
    const actualData = (rawData && typeof rawData === 'object')
      ? (Array.isArray(rawData) ? rawData[0] : ((rawData as { items?: unknown[]; data?: unknown }).items?.[0] ?? (rawData as { items?: unknown[]; data?: unknown }).data ?? rawData))
      : null;

    if (actualData && isScreenShape(actualData)) {
        return normalizeScreen(actualData as Record<string, unknown>);
    }
    
    // Recovery for 'Ghost Saves': If POST succeeded but returned no data, try to find the screen by code
    if (!isUpdate) {
      const searchCode = String(screen.screenCode || '').toLowerCase().trim();
      if (searchCode) {
        const { items } = await getScreens(1, 100);
        const match = items.find(s => s.screenCode?.toLowerCase().trim() === searchCode);
        if (match) return match;
      }
    }
    
    // Strict API reliance: if we updated but got no data back, we need the original ID at least
    if (isUpdate && numericId) {
      return normalizeScreen({ ...screen, id: numericId });
    }
    
    throw new ApiError(500, 'API failed to return valid screen data after save', 'saveScreen');
  }


  log.error('saveScreen failed', { screen, statusCode: response.statusCode });
  throw new ApiError(response.statusCode ?? 500, response.error || 'Failed to save screen', 'saveScreen');
}

/** DELETE /api/Screen/{id} */
export async function deleteScreen(id: string | number): Promise<void> {
  const response = await apiClient.delete<void>(`/Screen/${encodeURIComponent(String(id))}`);
  if (!response.success && response.statusCode !== 204) {
    throw new ApiError(response.statusCode ?? 500, response.error || 'Failed to delete screen', 'deleteScreen');
  }
}

/** Resolve dynamic screen configuration by matching URL slug */
export async function resolveDynamicScreenBySlug(routePath: string): Promise<ScreenConfig | null> {
  const cleanRoute = routePath.toLowerCase().replace('/assets/', '');
  let currentPage = 1;
  const pageSize = 100;
  let hasMore = true;

  while (hasMore) {
    const { items, totalCount } = await getScreens(currentPage, pageSize);
    
    const screen = items.find((s: ScreenConfig) => 
      s.routePath?.toLowerCase() === routePath.toLowerCase() || 
      s.baseRoutePath?.toLowerCase() === routePath.toLowerCase() ||
      s.screenCode?.toLowerCase() === cleanRoute || 
      s.screenName?.toLowerCase() === cleanRoute
    );

    if (screen) {
      return getScreenWithSectionsAndFields(screen.id);
    }

    if (items.length === 0 || currentPage * pageSize >= totalCount) {
      hasMore = false;
    } else {
      currentPage++;
    }
  }
  
  return null;
}

/** Fetch a screen along with its complete hierarchy of sections and fields */
export async function getScreenWithSectionsAndFields(screenId: string | number): Promise<ScreenConfig | null> {
  const screen = await getScreenById(screenId);
  if (!screen) return null;

  // 1. Fetch all sections for the screen (paging through all results)
  let sections: ScreenSection[] = [];
  let currentSectionPage = 1;
  const sectionPageSize = 1000;
  let hasMoreSections = true;

  while (hasMoreSections) {
    const { items, totalCount } = await SectionService.getSectionsByScreen(screenId, currentSectionPage, sectionPageSize);
    sections = [...sections, ...items];
    if (items.length === 0 || currentSectionPage * sectionPageSize >= totalCount) {
      hasMoreSections = false;
    } else {
      currentSectionPage++;
    }
  }
  
  // 2. Optimization: Batch fetch ALL fields for the entire screen in one request (paging through all results)
  // This avoids the N+1 request pattern (one request per section)
  const { getFieldsByScreen } = await import('./sfm-field.service');
  let allFields: ScreenField[] = [];
  let currentFieldPage = 1;
  const fieldPageSize = 1000;
  let hasMoreFields = true;

  while (hasMoreFields) {
    const { items, totalCount } = await getFieldsByScreen(screenId, currentFieldPage, fieldPageSize);
    allFields = [...allFields, ...items];
    if (items.length === 0 || currentFieldPage * fieldPageSize >= totalCount) {
      hasMoreFields = false;
    } else {
      currentFieldPage++;
    }
  }

  // 3. Hydrate sections by grouping fields in-memory
  const hydratedSections = sections.map(section => ({
    ...section,
    fields: allFields.filter(f => String(f.sectionId) === String(section.id))
  }));

  return { ...screen, sections: hydratedSections };
}

/** GET /api/ScreenGroupMaster */
export async function getGroups(): Promise<ScreenGroupConfig[]> {
  const response = await apiClient.get<{ items: unknown[]; totalCount?: number }>(`/ScreenGroupMaster?pageNumber=1&pageSize=100`);
  if (!response.success) {
    throw new ApiError(response.statusCode ?? 500, response.error || 'Failed to fetch screen groups', 'getGroups');
  }

  const data = response.data;
  const list = data ? (Array.isArray(data) ? data : (data.items || [])) : [];
  
  return list.filter(isScreenGroupShape).map(normalizeScreenGroup);
}

/** POST or PUT /api/ScreenGroupMaster */
export async function saveGroup(group: Record<string, unknown>): Promise<ScreenGroupConfig> {
  const numericId = Number(group.id);
  const isUpdate = !isNaN(numericId) && numericId > 0;
  const endpoint = isUpdate
    ? `/ScreenGroupMaster/${numericId}`
    : `/ScreenGroupMaster`;

  const userId = (group.userId !== null && group.userId !== undefined) ? Number(group.userId) : null;
  if (!userId) {
    throw new ApiError(401, 'Unauthorized: User ID is required for saving group', 'saveGroup');
  }
  const payload = buildGroupPayload(group, isUpdate, userId);

  const response = isUpdate
      ? await apiClient.put<unknown>(endpoint, payload)
      : await apiClient.post<unknown>(endpoint, payload);

  if (!response.success) {
    log.error('saveGroup failed', { group, statusCode: response.statusCode });
    throw new ApiError(response.statusCode ?? 500, response.error || 'Failed to save screen group', 'saveGroup');
  }

  const rawData = response.data;
  const actualData = (rawData && typeof rawData === 'object')
    ? (Array.isArray(rawData) ? rawData[0] : ((rawData as { items?: unknown[]; data?: unknown }).items?.[0] ?? (rawData as { items?: unknown[]; data?: unknown }).data ?? rawData))
    : null;

  if (actualData && isScreenGroupShape(actualData)) {
      return normalizeScreenGroup(actualData as Record<string, unknown>);
  }

  if (isUpdate && numericId) {
    return normalizeScreenGroup({ ...group, id: numericId });
  }

  throw new ApiError(500, 'API failed to return valid group data after save', 'saveGroup');
}

/** DELETE /api/ScreenGroupMaster/{id} */
export async function deleteGroup(id: string | number): Promise<void> {
  const response = await apiClient.delete<void>(`/ScreenGroupMaster/${encodeURIComponent(String(id))}`);
  if (!response.success && response.statusCode !== 204) {
    throw new ApiError(response.statusCode ?? 500, response.error || 'Failed to delete screen group', 'deleteGroup');
  }
}

export async function toggleScreenStatus(screen: ScreenConfig): Promise<ScreenConfig> {
  return saveScreen({ ...screen as unknown as Record<string, unknown>, isActive: !screen.isActive });
}

export async function toggleGroupStatus(group: ScreenGroupConfig): Promise<ScreenGroupConfig> {
  return saveGroup({ ...group as unknown as Record<string, unknown>, isActive: !group.isActive });
}

export const ScreenService = {
  getScreens,
  getScreenById,
  saveScreen,
  deleteScreen,
  resolveDynamicScreenBySlug,
  getScreenWithSectionsAndFields,
  getGroups,
  saveGroup,
  deleteGroup,
  toggleScreenStatus,
  toggleGroupStatus
};

