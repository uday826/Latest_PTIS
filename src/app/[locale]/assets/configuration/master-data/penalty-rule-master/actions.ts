'use server';

import { cookies } from 'next/headers';
import { penaltyRuleMasterService } from '@/lib/api/asset-api/penalty-rule-master.service';
import { buildPenaltyCreatePayload, buildPenaltyUpdatePayload } from '@/lib/api/asset-api/asset-payload-builders';
import type { MasterDataRecord } from '@/types/asset-type/master-data.types';
import type { ActionResult } from '@/types/common.types';
import { handleActionError, revalidateAssetMaster } from '@/lib/utils/asset-utils/actions.utils';
import { getUserIdFromCookies } from '@/lib/utils/cookie';
import { MASTER_IDS } from '@/types/asset-type/master-data.types';

export async function createPenaltyAction(
  record: MasterDataRecord
): Promise<ActionResult<void>> {
  try {
    const userId = getUserIdFromCookies(await cookies()) ?? 0;
    await penaltyRuleMasterService.create(buildPenaltyCreatePayload(record, userId));
    await new Promise(resolve => setTimeout(resolve, 1500));
    revalidateAssetMaster(MASTER_IDS.PENALTY);
    return { success: true, data: undefined };
  } catch (error: unknown) {
    return handleActionError(error, 'Failed to create penalty rule');
  }
}

export async function updatePenaltyAction(
  recordId: string,
  record: MasterDataRecord
): Promise<ActionResult<void>> {
  try {
    const userId = getUserIdFromCookies(await cookies()) ?? 0;
    await penaltyRuleMasterService.update(recordId, buildPenaltyUpdatePayload(record, Number(recordId), userId));
    await new Promise(resolve => setTimeout(resolve, 1500));
    revalidateAssetMaster(MASTER_IDS.PENALTY);
    return { success: true, data: undefined };
  } catch (error: unknown) {
    return handleActionError(error, 'Failed to update penalty rule');
  }
}

export async function deletePenaltyAction(
  recordId: string
): Promise<ActionResult<void>> {
  try {
    const userId = getUserIdFromCookies(await cookies());
    if (userId == null) {
      return { success: false, error: 'Unauthorized' };
    }
    await penaltyRuleMasterService.delete(recordId);
    await new Promise(resolve => setTimeout(resolve, 1500));
    revalidateAssetMaster(MASTER_IDS.PENALTY);
    return { success: true, data: undefined };
  } catch (error: unknown) {
    return handleActionError(error, 'Failed to delete penalty rule');
  }
}
