'use server';

import { cookies } from 'next/headers';
import { getUserIdFromCookies } from '@/lib/utils/cookie';
import { handleActionError, revalidateAssetMaster } from '@/lib/utils/asset-utils/actions.utils';
import type { ActionResult } from '@/types/common.types';
import type { MasterDataRecord } from '@/types/asset-type/asset.types';
import { inventoryModelService } from '@/lib/api/asset-api/inventory-model.service';
import { buildModelCreatePayload, buildModelUpdatePayload } from '@/lib/api/asset-api/asset-payload-builders';

// ─── Server Actions ──────────────────────────────────────────

/**
 * Creates a new inventory model record.
 *
 * @param record - Validated form data from the UI
 * @returns ActionResult indicating success or a user-facing error string
 */
export async function createInventoryModelAction(
  record: MasterDataRecord
): Promise<ActionResult<void>> {
  try {
    const userId = getUserIdFromCookies(await cookies()) ?? 0;
    await inventoryModelService.create(buildModelCreatePayload(record, userId));
    revalidateAssetMaster();
    return { success: true, data: undefined };
  } catch (error: unknown) {
    return handleActionError(error, 'messages.createFailed');
  }
}

/**
 * Updates an existing inventory model record.
 *
 * @param recordId - Backend ID of the record to update
 * @param record - Updated form data from the UI
 * @returns ActionResult indicating success or a user-facing error string
 */
export async function updateInventoryModelAction(
  recordId: string,
  record: MasterDataRecord
): Promise<ActionResult<void>> {
  try {
    const userId = getUserIdFromCookies(await cookies()) ?? 0;
    await inventoryModelService.update(recordId, buildModelUpdatePayload(record, userId));
    revalidateAssetMaster();
    return { success: true, data: undefined };
  } catch (error: unknown) {
    return handleActionError(error, 'messages.updateFailed');
  }
}

/**
 * Soft-deletes an inventory model record.
 *
 * @param recordId - Backend ID of the record to delete
 * @returns ActionResult indicating success or a user-facing error string
 */
export async function deleteInventoryModelAction(
  recordId: string
): Promise<ActionResult<void>> {
  try {
    await inventoryModelService.delete(recordId);
    revalidateAssetMaster();
    return { success: true, data: undefined };
  } catch (error: unknown) {
    return handleActionError(error, 'messages.deleteFailed');
  }
}
