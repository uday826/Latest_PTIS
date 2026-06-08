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

const MODULE_PATH = '/assets/configuration/screen-fields-master';

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
    logger.error('getAssetCategoriesAction failed', { page, pageSize, error: error as any });
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
    logger.error('getAssetTypesAction failed', { page, pageSize, categoryId, error: error as any });
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
    logger.error('getFieldDefinitionsAction failed', { categoryId, typeId, page, pageSize, error: error as any });
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
    logger.error('saveFieldDefinitionAction failed', { fieldData, error: error as any });
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
    logger.error('deleteFieldDefinitionAction failed', { id, error: error as any });
    return handleServerError(error as Error, 'deleting field definition');
  }
}
