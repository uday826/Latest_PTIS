'use server';

import { cookies } from 'next/headers';
import { assetCategoryService } from '@/lib/api/asset-api/asset-category-crud.service';
import { buildAssetCategoryCreatePayload, buildAssetCategoryUpdatePayload } from '@/lib/api/asset-api/asset-payload-builders';
import type { MasterDataRecord } from '@/types/asset-type/master-data.types';
import type { ActionResult } from '@/types/common.types';
import { handleActionError, revalidateAssetMaster } from '@/lib/utils/asset-utils/actions.utils';
import { getUserIdFromCookies } from '@/lib/utils/cookie';

export async function createAssetCategoryAction(
  record: MasterDataRecord
): Promise<ActionResult<void>> {
  try {
    const userId = getUserIdFromCookies(await cookies()) ?? 0;
    await assetCategoryService.create(buildAssetCategoryCreatePayload(record, userId));
    await new Promise(resolve => setTimeout(resolve, 1500));
    revalidateAssetMaster();
    return { success: true, data: undefined };
  } catch (error: unknown) {
    return handleActionError(error, '');
  }
}

export async function updateAssetCategoryAction(
  recordId: string,
  record: MasterDataRecord
): Promise<ActionResult<void>> {
  try {
    const userId = getUserIdFromCookies(await cookies()) ?? 0;
    await assetCategoryService.update(recordId, buildAssetCategoryUpdatePayload(record, Number(recordId), userId));
    await new Promise(resolve => setTimeout(resolve, 1500));
    revalidateAssetMaster();
    return { success: true, data: undefined };
  } catch (error: unknown) {
    return handleActionError(error, '');
  }
}

export async function deleteAssetCategoryAction(
  recordId: string
): Promise<ActionResult<void>> {
  try {
    const userId = getUserIdFromCookies(await cookies());
    if (userId == null) {
      return { success: false, error: 'Unauthorized' };
    }
    await assetCategoryService.delete(recordId, userId);
    await new Promise(resolve => setTimeout(resolve, 1500));
    revalidateAssetMaster();
    return { success: true, data: undefined };
  } catch (error: unknown) {
    return handleActionError(error, '');
  }
}
