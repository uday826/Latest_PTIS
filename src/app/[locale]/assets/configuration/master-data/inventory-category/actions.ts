'use server';

import { cookies } from 'next/headers';
import { getUserIdFromCookies } from '@/lib/utils/cookie';
import { handleActionError, revalidateAssetMaster } from '@/lib/utils/asset-utils/actions.utils';
import type { ActionResult } from '@/types/common.types';
import type { MasterDataRecord } from '@/types/asset-type/asset.types';
import { inventoryCategoryService } from '@/lib/api/asset-api/inventory-category.service';
import { buildCategoryCreatePayload, buildCategoryUpdatePayload } from '@/lib/api/asset-api/asset-payload-builders';

// ─── Server Actions ──────────────────────────────────────────

/**
 * Creates a new inventory category record.
 *
 * @param record - Validated form data from the UI
 * @returns ActionResult indicating success or a user-facing error string
 */
export async function createInventoryCategoryAction(
  record: MasterDataRecord
): Promise<ActionResult<void>> {
  try {
    const userId = getUserIdFromCookies(await cookies()) ?? 0;
    await inventoryCategoryService.create(buildCategoryCreatePayload(record, userId));
    revalidateAssetMaster();
    return { success: true, data: undefined };
  } catch (error: unknown) {
    return handleActionError(error, 'messages.createFailed');
  }
}

/**
 * Updates an existing inventory category record.
 *
 * @param recordId - Backend ID of the record to update
 * @param record - Updated form data from the UI
 * @returns ActionResult indicating success or a user-facing error string
 */
export async function updateInventoryCategoryAction(
  recordId: string,
  record: MasterDataRecord
): Promise<ActionResult<void>> {
  try {
    const userId = getUserIdFromCookies(await cookies()) ?? 0;
    await inventoryCategoryService.update(recordId, buildCategoryUpdatePayload(record, userId));
    revalidateAssetMaster();
    return { success: true, data: undefined };
  } catch (error: unknown) {
    return handleActionError(error, 'messages.updateFailed');
  }
}

/**
 * Soft-deletes an inventory category record.
 *
 * @param recordId - Backend ID of the record to delete
 * @returns ActionResult indicating success or a user-facing error string
 */
export async function deleteInventoryCategoryAction(
  recordId: string
): Promise<ActionResult<void>> {
  try {
    await inventoryCategoryService.delete(recordId);
    revalidateAssetMaster();
    return { success: true, data: undefined };
  } catch (error: unknown) {
    return handleActionError(error, 'messages.deleteFailed');
  }
}
