'use server';

import { cookies } from 'next/headers';
import { typeOfUseMasterService } from '@/lib/api/asset-api/type-of-use-master.service';
import { buildTypeOfUseCreatePayload, buildTypeOfUseUpdatePayload } from '@/lib/api/asset-api/asset-payload-builders';
import type { MasterDataRecord } from '@/types/asset-type/master-data.types';
import type { ActionResult } from '@/types/common.types';
import { handleActionError, revalidateAssetMaster } from '@/lib/utils/asset-utils/actions.utils';
import { getUserIdFromCookies } from '@/lib/utils/cookie';
import { MASTER_IDS } from '@/types/asset-type/master-data.types';

export async function createTypeOfUseAction(
  record: MasterDataRecord
): Promise<ActionResult<void>> {
  try {
    const userId = getUserIdFromCookies(await cookies()) ?? 0;
    await typeOfUseMasterService.create(buildTypeOfUseCreatePayload(record, userId));
    await new Promise(resolve => setTimeout(resolve, 1500));
    revalidateAssetMaster(MASTER_IDS.TYPE_OF_USE);
    return { success: true, data: undefined };
  } catch (error: unknown) {
    return handleActionError(error, '');
  }
}

export async function updateTypeOfUseAction(
  recordId: string,
  record: MasterDataRecord
): Promise<ActionResult<void>> {
  try {
    const userId = getUserIdFromCookies(await cookies()) ?? 0;
    await typeOfUseMasterService.update(recordId, buildTypeOfUseUpdatePayload(record, Number(recordId), userId));
    await new Promise(resolve => setTimeout(resolve, 1500));
    revalidateAssetMaster(MASTER_IDS.TYPE_OF_USE);
    return { success: true, data: undefined };
  } catch (error: unknown) {
    return handleActionError(error, '');
  }
}

export async function deleteTypeOfUseAction(
  recordId: string
): Promise<ActionResult<void>> {
  try {
    const userId = getUserIdFromCookies(await cookies());
    if (userId == null) {
      return { success: false, error: 'Unauthorized' };
    }
    await typeOfUseMasterService.delete(recordId);
    await new Promise(resolve => setTimeout(resolve, 1500));
    revalidateAssetMaster(MASTER_IDS.TYPE_OF_USE);
    return { success: true, data: undefined };
  } catch (error: unknown) {
    return handleActionError(error, '');
  }
}
