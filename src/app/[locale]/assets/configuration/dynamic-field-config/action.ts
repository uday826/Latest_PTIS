'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { locales } from '@/i18n/config';
import { getUserIdFromCookies } from '@/lib/utils/auth-session';
import { handleServerError } from '@/lib/utils/server-action-error-handler';
import { logger } from '@/lib/utils/logger';
import { getAssetCategoriesPaged } from '@/lib/api/asset-api/asset-category-crud.service';
import { getAssetTypesPaged } from '@/lib/api/asset-api/asset-type-crud.service';
import {
  getFieldDefinitionsPaged,
  saveFieldDefinition,
  deleteFieldDefinition
} from '@/lib/api/asset-api/field-definition-api';

const MODULE_PATH = '/assets/configuration/definitions';

function revalidateModule() {
  for (const locale of locales) {
    revalidatePath(`/${locale}${MODULE_PATH}`, 'page');
  }
}

/**
 * Fetch paginated list of categories
 */
export async function getAssetCategoriesAction(page: number, pageSize: number) {
  try {
    const data = await getAssetCategoriesPaged(page, pageSize);
    return { success: true as const, data, items: data.items || [], totalCount: data.totalCount || 0 };
  } catch (error: unknown) {
    logger.error('getAssetCategoriesAction failed', { page, pageSize, error: error as Error });
    return handleServerError(error as Error, 'fetching asset categories');
  }
}

/**
 * Fetch paginated list of asset types (optionally filtered by CategoryId)
 */
export async function getAssetTypesAction(page: number, pageSize: number, categoryId?: number | null) {
  try {
    const data = await getAssetTypesPaged(page, pageSize, undefined, categoryId || undefined);
    return { success: true as const, data, items: data.items || [], totalCount: data.totalCount || 0 };
  } catch (error: unknown) {
    logger.error('getAssetTypesAction failed', { page, pageSize, categoryId, error: error as Error });
    return handleServerError(error as Error, 'fetching asset types');
  }
}

/**
 * Fetch asset field definitions for a category and type
 */
export async function getFieldDefinitionsAction(
  categoryId?: number | null,
  typeId?: number | null,
  page: number = 1,
  pageSize: number = 1000
) {
  try {
    const data = await getFieldDefinitionsPaged(categoryId, typeId, page, pageSize);
    return { success: true as const, data, items: data.items || [], totalCount: data.totalCount || 0 };
  } catch (error: unknown) {
    logger.error('getFieldDefinitionsAction failed', { categoryId, typeId, page, pageSize, error: error as Error });
    return handleServerError(error as Error, 'fetching field definitions');
  }
}

/**
 * Save or update a field definition
 */
export async function saveFieldDefinitionAction(fieldData: Record<string, unknown>) {
  try {
    const cookieStore = await cookies();
    const userId = getUserIdFromCookies(cookieStore);
    if (!userId) return { success: false as const, error: 'Unauthorized' };

    const data = await saveFieldDefinition({ ...fieldData, userId });
    revalidateModule();
    return { success: true as const, data };
  } catch (error: unknown) {
    logger.error('saveFieldDefinitionAction failed', { fieldData, error: error as Error });
    return handleServerError(error as Error, 'saving field definition');
  }
}

/**
 * Delete a field definition
 */
export async function deleteFieldDefinitionAction(id: number) {
  try {
    const cookieStore = await cookies();
    const userId = getUserIdFromCookies(cookieStore);
    if (!userId) return { success: false as const, error: 'Unauthorized' };

    await deleteFieldDefinition(id);
    revalidateModule();
    return { success: true as const, data: null };
  } catch (error: unknown) {
    logger.error('deleteFieldDefinitionAction failed', { id, error: error as Error });
    return handleServerError(error as Error, 'deleting field definition');
  }
}

// ── Document Definitions Server Actions ────────────────────────────────────

import { apiClient } from '@/services/api.service';
import type { AssetDocumentDefinitionDto, CreateDocumentDefinitionPayload, UpdateDocumentDefinitionPayload } from '@/lib/api/asset/asset-document.service';

interface RawDocDef {
  id?: number | string;
  Id?: number | string;
  assetCategoryId?: number | string;
  AssetCategoryId?: number | string;
  assetTypeId?: number | string | null;
  AssetTypeId?: number | string | null;
  documentCode?: string;
  DocumentCode?: string;
  documentName?: string;
  DocumentName?: string;
  description?: string | null;
  Description?: string | null;
  isRequired?: boolean | number;
  IsRequired?: boolean | number;
  maxFileSizeMB?: number | string;
  MaxFileSizeMB?: number | string;
  allowedExtensions?: string;
  AllowedExtensions?: string;
  displayOrder?: number | string;
  DisplayOrder?: number | string;
}

function normalizeDocDef(item: RawDocDef): AssetDocumentDefinitionDto {
  if (!item) {
    throw new Error('Invalid document definition data received');
  }
  return {
    id: Number(item.id ?? item.Id ?? 0),
    assetCategoryId: Number(item.assetCategoryId ?? item.AssetCategoryId ?? 0),
    assetTypeId: item.assetTypeId !== undefined && item.assetTypeId !== null
      ? Number(item.assetTypeId)
      : (item.AssetTypeId !== undefined && item.AssetTypeId !== null ? Number(item.AssetTypeId) : null),
    documentCode: String(item.documentCode ?? item.DocumentCode ?? '').trim(),
    documentName: String(item.documentName ?? item.DocumentName ?? '').trim(),
    description: item.description !== undefined ? String(item.description || '') : (item.Description !== undefined ? String(item.Description || '') : null),
    isRequired: Boolean(item.isRequired ?? item.IsRequired ?? false),
    maxFileSizeMB: Number(item.maxFileSizeMB ?? item.MaxFileSizeMB ?? 0),
    allowedExtensions: String(item.allowedExtensions ?? item.AllowedExtensions ?? '').trim(),
    displayOrder: Number(item.displayOrder ?? item.DisplayOrder ?? 0)
  };
}

/**
 * Fetch asset document definitions for a category and type
 */
export async function getDocumentDefinitionsAction(assetCategoryId: number, assetTypeId?: number | null) {
  try {
    const params = new URLSearchParams();
    params.append("assetCategoryId", assetCategoryId.toString());
    if (assetTypeId) params.append("assetTypeId", assetTypeId.toString());
    
    const response = await apiClient.get<AssetDocumentDefinitionDto[]>(`/AssetDocument/definitions?${params.toString()}`);
    if (!response.success) throw new Error(response.error || 'Failed to fetch document definitions');
    
    let rawItems: RawDocDef[] = [];
    if (Array.isArray(response.data)) {
      rawItems = response.data as unknown as RawDocDef[];
    } else if (response.data && typeof response.data === 'object') {
      const obj = response.data as Record<string, unknown>;
      if (Array.isArray(obj.items)) {
        rawItems = obj.items as RawDocDef[];
      }
    }
        
    const data = rawItems.map(normalizeDocDef);
    return { success: true as const, data };
  } catch (error: unknown) {
    logger.error('getDocumentDefinitionsAction failed', { assetCategoryId, assetTypeId, error: error as Error });
    return handleServerError(error as Error, 'fetching document definitions');
  }
}

/**
 * Save or update a document definition
 */
export async function saveDocumentDefinitionAction(id: number | null, payload: Record<string, unknown>) {
  try {
    const cookieStore = await cookies();
    const userId = getUserIdFromCookies(cookieStore);
    if (!userId) return { success: false as const, error: 'Unauthorized' };

    let response;
    if (id) {
      // Update
      const updatePayload: UpdateDocumentDefinitionPayload = {
        assetCategoryId: Number(payload.assetCategoryId),
        assetTypeId: payload.assetTypeId ? Number(payload.assetTypeId) : null,
        documentCode: String(payload.documentCode),
        documentName: String(payload.documentName),
        description: payload.description ? String(payload.description) : null,
        isRequired: Boolean(payload.isRequired),
        maxFileSizeMB: Number(payload.maxFileSizeMB),
        allowedExtensions: String(payload.allowedExtensions),
        displayOrder: Number(payload.displayOrder),
        isActive: true,
        updatedBy: String(userId)
      };
      logger.info('saveDocDef PUT URL', { url: `/AssetDocument/definitions/${id}` });
      response = await apiClient.put<AssetDocumentDefinitionDto>(`/AssetDocument/definitions/${id}`, updatePayload);
    } else {
      // Create
      const createPayload: CreateDocumentDefinitionPayload = {
        assetCategoryId: Number(payload.assetCategoryId),
        assetTypeId: payload.assetTypeId ? Number(payload.assetTypeId) : null,
        documentCode: String(payload.documentCode),
        documentName: String(payload.documentName),
        description: payload.description ? String(payload.description) : null,
        isRequired: Boolean(payload.isRequired),
        maxFileSizeMB: Number(payload.maxFileSizeMB),
        allowedExtensions: String(payload.allowedExtensions),
        displayOrder: Number(payload.displayOrder),
        isActive: true,
        createdBy: String(userId)
      };
      logger.info('saveDocDef POST URL', { url: '/AssetDocument/definitions', payload: createPayload });
      response = await apiClient.post<AssetDocumentDefinitionDto>('/AssetDocument/definitions', createPayload);
    }

    if (!response.success) {
      logger.error('saveDocumentDefinitionAction API error', { 
        statusCode: response.statusCode, 
        error: response.error ? new Error(response.error) : undefined 
      });
      throw new Error(response.error || `Failed to save document definition (Status: ${response.statusCode})`);
    }
    
    revalidateModule();
    
    if (!response.data) {
      throw new Error('API returned empty response data');
    }
    const rawData = response.data as unknown as RawDocDef;

    return { success: true as const, data: normalizeDocDef(rawData) };
  } catch (error: unknown) {
    logger.error('saveDocumentDefinitionAction failed exception', { id, payload, error: error as Error });
    return handleServerError(error as Error, 'saving document definition');
  }
}

/**
 * Delete a document definition
 */
export async function deleteDocumentDefinitionAction(id: number) {
  try {
    const cookieStore = await cookies();
    const userId = getUserIdFromCookies(cookieStore);
    if (!userId) return { success: false as const, error: 'Unauthorized' };

    const response = await apiClient.delete<void>(`/AssetDocument/definitions/${id}`);
    if (!response.success && response.statusCode !== 204) throw new Error(response.error || 'Failed to delete document definition');
    
    revalidateModule();
    return { success: true as const, data: null };
  } catch (error: unknown) {
    logger.error('deleteDocumentDefinitionAction failed', { id, error: error as Error });
    return handleServerError(error as Error, 'deleting document definition');
  }
}
