'use server';

import { cookies } from 'next/headers';
import { ownershipTypeService } from '@/lib/api/asset-api/ownership-type.service';
import { buildOwnershipTypeCreatePayload, buildOwnershipTypeUpdatePayload } from '@/lib/api/asset-api/asset-payload-builders';
import type { MasterDataRecord } from '@/types/asset-type/asset.types';
import type { ActionResult } from '@/types/common.types';
import { handleActionError, revalidateAssetMaster } from '@/lib/utils/asset-utils/actions.utils';
import { getUserIdFromCookies } from '@/lib/utils/cookie';

export async function createOwnershipTypeAction(
  record: MasterDataRecord
): Promise<ActionResult<void>> {
  try {
    const userId = getUserIdFromCookies(await cookies()) ?? 0;
    await ownershipTypeService.create(buildOwnershipTypeCreatePayload(record, userId));
    revalidateAssetMaster();
    return { success: true, data: undefined };
  } catch (error: unknown) {
    return handleActionError(error, '');
  }
}

export async function updateOwnershipTypeAction(
  recordId: string,
  record: MasterDataRecord
): Promise<ActionResult<void>> {
  try {
    const userId = getUserIdFromCookies(await cookies()) ?? 0;
    await ownershipTypeService.update(recordId, buildOwnershipTypeUpdatePayload(record, Number(recordId), userId));
    revalidateAssetMaster();
    return { success: true, data: undefined };
  } catch (error: unknown) {
    return handleActionError(error, '');
  }
}

export async function deleteOwnershipTypeAction(
  recordId: string
): Promise<ActionResult<void>> {
  try {
    const userId = getUserIdFromCookies(await cookies());
    if (userId == null) {
      return { success: false, error: 'Unauthorized' };
    }
    await ownershipTypeService.delete(recordId);
    revalidateAssetMaster();
    return { success: true, data: undefined };
  } catch (error: unknown) {
    return handleActionError(error, '');
  }
}
