'use server';

import { cookies } from 'next/headers';
import { gstMasterService } from '@/lib/api/asset-api/gst-master.service';
import { buildGstCreatePayload, buildGstUpdatePayload } from '@/lib/api/asset-api/asset-payload-builders';
import type { MasterDataRecord } from '@/types/asset-type/master-data.types';
import type { ActionResult } from '@/types/common.types';
import { handleActionError, revalidateAssetMaster } from '@/lib/utils/asset-utils/actions.utils';
import { getUserIdFromCookies } from '@/lib/utils/cookie';
import { MASTER_IDS } from '@/types/asset-type/master-data.types';

export async function createGstAction(
  record: MasterDataRecord
): Promise<ActionResult<void>> {
  try {
    const userId = getUserIdFromCookies(await cookies()) ?? 0;
    await gstMasterService.create(buildGstCreatePayload(record, userId));
    await new Promise(resolve => setTimeout(resolve, 1500));
    revalidateAssetMaster(MASTER_IDS.TAX);
    return { success: true, data: undefined };
  } catch (error: unknown) {
    return handleActionError(error, 'Failed to create GST record');
  }
}

export async function updateGstAction(
  recordId: string,
  record: MasterDataRecord
): Promise<ActionResult<void>> {
  try {
    const userId = getUserIdFromCookies(await cookies()) ?? 0;
    await gstMasterService.update(recordId, buildGstUpdatePayload(record, Number(recordId), userId));
    await new Promise(resolve => setTimeout(resolve, 1500));
    revalidateAssetMaster(MASTER_IDS.TAX);
    return { success: true, data: undefined };
  } catch (error: unknown) {
    return handleActionError(error, 'Failed to update GST record');
  }
}

export async function deleteGstAction(
  recordId: string
): Promise<ActionResult<void>> {
  try {
    const userId = getUserIdFromCookies(await cookies());
    if (userId == null) {
      return { success: false, error: 'Unauthorized' };
    }
    await gstMasterService.delete(recordId);
    await new Promise(resolve => setTimeout(resolve, 1500));
    revalidateAssetMaster(MASTER_IDS.TAX);
    return { success: true, data: undefined };
  } catch (error: unknown) {
    return handleActionError(error, 'Failed to delete GST record');
  }
}
