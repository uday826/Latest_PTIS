'use server';

import { cookies } from 'next/headers';
import { getUserIdFromCookies } from '@/lib/utils/cookie';
import { handleActionError, revalidateAssetMaster } from '@/lib/utils/asset-utils/actions.utils';
import type { ActionResult } from '@/types/common.types';
import type { MasterDataRecord } from '@/types/asset-type/asset.types';
import { inventoryItemNameService } from '@/lib/api/asset-api/inventory-item-name.service';
import { buildItemNameCreatePayload, buildItemNameUpdatePayload } from '@/lib/api/asset-api/asset-payload-builders';

// ─── Server Actions ──────────────────────────────────────────

/**
 * Creates a new inventory name (item subtype) record.
 *
 * @param record - Validated form data from the UI
 * @returns ActionResult indicating success or a user-facing error string
 */
export async function createInventoryNameAction(
  record: MasterDataRecord
): Promise<ActionResult<void>> {
  try {
    const userId = getUserIdFromCookies(await cookies()) ?? 0;
    await inventoryItemNameService.create(buildItemNameCreatePayload(record, userId));
    revalidateAssetMaster();
    return { success: true, data: undefined };
  } catch (error: unknown) {
    return handleActionError(error, 'messages.createFailed');
  }
}

/**
 * Updates an existing inventory name (item subtype) record.
 *
 * @param recordId - Backend ID of the record to update
 * @param record - Updated form data from the UI
 * @returns ActionResult indicating success or a user-facing error string
 */
export async function updateInventoryNameAction(
  recordId: string,
  record: MasterDataRecord
): Promise<ActionResult<void>> {
  try {
    const userId = getUserIdFromCookies(await cookies()) ?? 0;
    await inventoryItemNameService.update(recordId, buildItemNameUpdatePayload(record, userId));
    revalidateAssetMaster();
    return { success: true, data: undefined };
  } catch (error: unknown) {
    return handleActionError(error, 'messages.updateFailed');
  }
}

/**
 * Soft-deletes an inventory name (item subtype) record.
 *
 * @param recordId - Backend ID of the record to delete
 * @returns ActionResult indicating success or a user-facing error string
 */
export async function deleteInventoryNameAction(
  recordId: string
): Promise<ActionResult<void>> {
  try {
    await inventoryItemNameService.delete(recordId);
    revalidateAssetMaster();
    return { success: true, data: undefined };
  } catch (error: unknown) {
    return handleActionError(error, 'messages.deleteFailed');
  }
}
