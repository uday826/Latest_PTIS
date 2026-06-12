'use server';

import { cookies } from 'next/headers';
import { getUserIdFromCookies } from '@/lib/utils/cookie';
import { handleActionError, revalidateAssetMaster } from '@/lib/utils/asset-utils/actions.utils';
import type { ActionResult } from '@/types/common.types';
import type { MasterDataRecord } from '@/types/asset-type/asset.types';
import { inventoryConditionService } from '@/lib/api/asset-api/inventory-condition.service';
import { buildConditionCreatePayload, buildConditionUpdatePayload } from '@/lib/api/asset-api/asset-payload-builders';

// ─── Server Actions ──────────────────────────────────────────

/**
 * Creates a new inventory condition record.
 *
 * @param record - Validated form data from the UI
 * @returns ActionResult indicating success or a user-facing error string
 */
export async function createInventoryConditionAction(
  record: MasterDataRecord
): Promise<ActionResult<void>> {
  try {
    const userId = getUserIdFromCookies(await cookies()) ?? 0;
    await inventoryConditionService.create(buildConditionCreatePayload(record, userId));
    revalidateAssetMaster();
    return { success: true, data: undefined };
  } catch (error: unknown) {
    return handleActionError(error, 'messages.createFailed');
  }
}

/**
 * Updates an existing inventory condition record.
 *
 * @param recordId - Backend ID of the record to update
 * @param record - Updated form data from the UI
 * @returns ActionResult indicating success or a user-facing error string
 */
export async function updateInventoryConditionAction(
  recordId: string,
  record: MasterDataRecord
): Promise<ActionResult<void>> {
  try {
    const userId = getUserIdFromCookies(await cookies()) ?? 0;
    await inventoryConditionService.update(recordId, buildConditionUpdatePayload(record, userId));
    revalidateAssetMaster();
    return { success: true, data: undefined };
  } catch (error: unknown) {
    return handleActionError(error, 'messages.updateFailed');
  }
}

/**
 * Soft-deletes an inventory condition record.
 *
 * @param recordId - Backend ID of the record to delete
 * @returns ActionResult indicating success or a user-facing error string
 */
export async function deleteInventoryConditionAction(
  recordId: string
): Promise<ActionResult<void>> {
  try {
    await inventoryConditionService.delete(recordId);
    revalidateAssetMaster();
    return { success: true, data: undefined };
  } catch (error: unknown) {
    return handleActionError(error, 'messages.deleteFailed');
  }
}
