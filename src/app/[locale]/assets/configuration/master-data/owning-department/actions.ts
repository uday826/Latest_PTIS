'use server';

import { cookies } from 'next/headers';
import { owningDepartmentService } from '@/lib/api/asset-api/owning-department.service';
import { buildOwningDepartmentCreatePayload, buildOwningDepartmentUpdatePayload } from '@/lib/api/asset-api/asset-payload-builders';
import type { MasterDataRecord } from '@/types/asset-type/asset.types';
import type { ActionResult } from '@/types/common.types';
import { handleActionError, revalidateAssetMaster } from '@/lib/utils/asset-utils/actions.utils';
import { getUserIdFromCookies } from '@/lib/utils/cookie';

export async function createOwningDepartmentAction(
  record: MasterDataRecord
): Promise<ActionResult<void>> {
  try {
    const userId = getUserIdFromCookies(await cookies()) ?? 0;
    await owningDepartmentService.create(buildOwningDepartmentCreatePayload(record, userId));
    revalidateAssetMaster();
    return { success: true, data: undefined };
  } catch (error: unknown) {
    return handleActionError(error, '');
  }
}

export async function updateOwningDepartmentAction(
  recordId: string,
  record: MasterDataRecord
): Promise<ActionResult<void>> {
  try {
    const userId = getUserIdFromCookies(await cookies()) ?? 0;
    await owningDepartmentService.update(recordId, buildOwningDepartmentUpdatePayload(record, Number(recordId), userId));
    revalidateAssetMaster();
    return { success: true, data: undefined };
  } catch (error: unknown) {
    return handleActionError(error, '');
  }
}

export async function deleteOwningDepartmentAction(
  recordId: string
): Promise<ActionResult<void>> {
  try {
    const userId = getUserIdFromCookies(await cookies());
    if (userId == null) {
      return { success: false, error: 'Unauthorized' };
    }
    await owningDepartmentService.delete(recordId);
    revalidateAssetMaster();
    return { success: true, data: undefined };
  } catch (error: unknown) {
    return handleActionError(error, '');
  }
}
