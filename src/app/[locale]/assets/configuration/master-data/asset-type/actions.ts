'use server';

import { cookies } from 'next/headers';
import { assetTypeService } from '@/lib/api/asset-api/asset-type-crud.service';
import { buildAssetTypeCreatePayload, buildAssetTypeUpdatePayload } from '@/lib/api/asset-api/asset-payload-builders';
import type { MasterDataRecord } from '@/types/asset-type/master-data.types';
import type { ActionResult } from '@/types/common.types';
import { handleActionError, revalidateAssetMaster } from '@/lib/utils/asset-utils/actions.utils';
import { getUserIdFromCookies } from '@/lib/utils/cookie';

export async function createAssetTypeAction(
  record: MasterDataRecord
): Promise<ActionResult<void>> {
  try {
    const userId = getUserIdFromCookies(await cookies()) ?? 0;
    await assetTypeService.create(buildAssetTypeCreatePayload(record, userId));
    // Wait for the backend DB to sync before revalidating (mitigates read-after-write lag)
    await new Promise(resolve => setTimeout(resolve, 1500));
    revalidateAssetMaster();
    return { success: true, data: undefined };
  } catch (error: unknown) {
    return handleActionError(error, '');
  }
}

export async function updateAssetTypeAction(
  recordId: string,
  record: MasterDataRecord
): Promise<ActionResult<void>> {
  try {
    const userId = getUserIdFromCookies(await cookies()) ?? 0;
    await assetTypeService.update(recordId, buildAssetTypeUpdatePayload(record, Number(recordId), userId));
    await new Promise(resolve => setTimeout(resolve, 1500));
    revalidateAssetMaster();
    return { success: true, data: undefined };
  } catch (error: unknown) {
    return handleActionError(error, '');
  }
}

export async function deleteAssetTypeAction(
  recordId: string
): Promise<ActionResult<void>> {
  try {
    const userId = getUserIdFromCookies(await cookies());
    if (userId == null) {
      return { success: false, error: 'Unauthorized' };
    }
    await assetTypeService.delete(recordId, userId);
    await new Promise(resolve => setTimeout(resolve, 1500));
    revalidateAssetMaster();
    return { success: true, data: undefined };
  } catch (error: unknown) {
    return handleActionError(error, '');
  }
}
