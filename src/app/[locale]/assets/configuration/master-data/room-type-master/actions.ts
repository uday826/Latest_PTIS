'use server';

import { cookies } from 'next/headers';
import { roomTypeMasterService } from '@/lib/api/asset-api/room-type-master.service';
import { buildRoomTypeCreatePayload, buildRoomTypeUpdatePayload } from '@/lib/api/asset-api/asset-payload-builders';
import type { MasterDataRecord } from '@/types/asset-type/master-data.types';
import type { ActionResult } from '@/types/common.types';
import { handleActionError, revalidateAssetMaster } from '@/lib/utils/asset-utils/actions.utils';
import { getUserIdFromCookies } from '@/lib/utils/cookie';
import { MASTER_IDS } from '@/types/asset-type/master-data.types';

export async function createRoomTypeAction(
  record: MasterDataRecord
): Promise<ActionResult<void>> {
  try {
    const userId = getUserIdFromCookies(await cookies()) ?? 0;
    await roomTypeMasterService.create(buildRoomTypeCreatePayload(record, userId));
    await new Promise(resolve => setTimeout(resolve, 1500));
    revalidateAssetMaster(MASTER_IDS.ROOM_TYPE);
    return { success: true, data: undefined };
  } catch (error: unknown) {
    return handleActionError(error, 'Failed to create Room Type record');
  }
}

export async function updateRoomTypeAction(
  recordId: string,
  record: MasterDataRecord
): Promise<ActionResult<void>> {
  try {
    const userId = getUserIdFromCookies(await cookies()) ?? 0;
    await roomTypeMasterService.update(recordId, buildRoomTypeUpdatePayload(record, Number(recordId), userId));
    await new Promise(resolve => setTimeout(resolve, 1500));
    revalidateAssetMaster(MASTER_IDS.ROOM_TYPE);
    return { success: true, data: undefined };
  } catch (error: unknown) {
    return handleActionError(error, 'Failed to update Room Type record');
  }
}

export async function deleteRoomTypeAction(
  recordId: string
): Promise<ActionResult<void>> {
  try {
    const userId = getUserIdFromCookies(await cookies());
    if (userId == null) {
      return { success: false, error: 'Unauthorized' };
    }
    await roomTypeMasterService.delete(recordId);
    await new Promise(resolve => setTimeout(resolve, 1500));
    revalidateAssetMaster(MASTER_IDS.ROOM_TYPE);
    return { success: true, data: undefined };
  } catch (error: unknown) {
    return handleActionError(error, 'Failed to delete Room Type record');
  }
}
