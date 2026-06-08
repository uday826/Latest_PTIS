'use server';

import { createAssetCategory, updateAssetCategory, deleteAssetCategory } from '@/lib/api/asset-api/asset-category-crud.service';
import { AssetCategoryFormModel } from '@/types/asset-type/asset-category.types';
import { MasterDataRecord } from '@/types/asset-type/master-data.types';
import { ActionResult } from '@/types/common.types';
import { executeMasterAction, executeDeleteAction } from '@/lib/utils/asset-utils/asset-master-actions.utils';

const REVALIDATE_PATHS = [
  'assets/configuration/master-data/asset-category',
  'assets/configuration/master-data/asset-type'
];

export async function createAssetCategoryAction(record: MasterDataRecord): Promise<ActionResult<void>> {
  const formModel: AssetCategoryFormModel = {
    categoryCode: record.id,
    categoryName: record.name,
    description: record.description || "",
    isActive: record.status === 'Active'
  };

  return executeMasterAction({
    action: createAssetCategory,
    payload: formModel,
    revalidatePaths: REVALIDATE_PATHS,
    errorMessage: "Failed to create category"
  });
}

export async function updateAssetCategoryAction(recordId: string, record: MasterDataRecord): Promise<ActionResult<void>> {
  const formModel: AssetCategoryFormModel = {
    id: Number(record.backendId || recordId),
    categoryCode: record.id,
    categoryName: record.name,
    description: record.description || "",
    isActive: record.status === 'Active'
  };

  return executeMasterAction({
    action: updateAssetCategory,
    payload: formModel,
    revalidatePaths: REVALIDATE_PATHS,
    errorMessage: "Failed to update category"
  });
}

export async function deleteAssetCategoryAction(recordId: string): Promise<ActionResult<void>> {
  return executeDeleteAction(
    deleteAssetCategory,
    Number(recordId),
    REVALIDATE_PATHS
  );
}
