'use server';

import { createAssetType, updateAssetType, deleteAssetType } from '@/lib/api/asset-api/asset-type-crud.service';
import { createAssetCategory, updateAssetCategory, deleteAssetCategory } from '@/lib/api/asset-api/asset-category-crud.service';
import { ActionResult } from '@/types/common.types';
import { AssetCategoryFormModel } from '@/types/asset-type/asset-category.types';
import { AssetTypeFormModel } from '@/types/asset-type/asset-type.types';
import { MasterDataRecord, MASTER_IDS } from '@/types/asset-type/master-data.types';
import { executeMasterAction, executeDeleteAction } from '@/lib/utils/asset-utils/asset-master-actions.utils';

const REVALIDATE_PATHS = [
  'assets/configuration/master-data/asset-type',
  'assets/configuration/master-data/asset-category'
];

/**
 * Handles creation of asset master records.
 * Supports both generic MasterDataRecord and specialized FormModels.
 */
export async function createAssetMasterAction(
  record: MasterDataRecord | AssetTypeFormModel | AssetCategoryFormModel, 
  masterId: string = MASTER_IDS.TYPE
): Promise<ActionResult<void>> {
  if (masterId === MASTER_IDS.CATEGORY) {
    let formModel: AssetCategoryFormModel;
    
    if ('categoryCode' in record) {
      formModel = record;
    } else if ('typeCode' in record) {
      // This case should theoretically not happen if masterId is CATEGORY
      formModel = {
        categoryCode: record.typeCode,
        categoryName: record.typeName,
        description: record.description,
        isActive: record.isActive
      };
    } else {
      formModel = {
        categoryCode: record.id,
        categoryName: record.name,
        description: record.description || "",
        isActive: record.status === 'Active'
      };
    }

    return executeMasterAction({
      action: createAssetCategory,
      payload: formModel,
      revalidatePaths: REVALIDATE_PATHS,
      errorMessage: "Failed to create category"
    });
  } else if (masterId === MASTER_IDS.TYPE) {
    let formModel: AssetTypeFormModel;

    if ('typeCode' in record) {
      formModel = record;
    } else if ('categoryCode' in record) {
       // Transformation from category model to type model (unlikely but handled)
       formModel = {
        typeCode: record.categoryCode,
        typeName: record.categoryName,
        categoryId: 0,
        description: record.description,
        isActive: record.isActive
      };
    } else {
      formModel = {
        typeCode: record.id,
        typeName: record.name,
        categoryId: Number(record.group || 0),
        description: record.description || "",
        isActive: record.status === 'Active'
      };
    }

    return executeMasterAction({
      action: createAssetType,
      payload: formModel,
      revalidatePaths: REVALIDATE_PATHS,
      errorMessage: "Failed to create asset type"
    });
  }
  
  return { success: false, error: `Unsupported master ID: ${masterId}` };
}

/**
 * Handles update of asset master records.
 */
export async function updateAssetMasterAction(
  recordId: string, 
  record: MasterDataRecord | AssetTypeFormModel | AssetCategoryFormModel, 
  masterId: string = MASTER_IDS.TYPE
): Promise<ActionResult<void>> {
  const backendId = Number(recordId);

  if (masterId === MASTER_IDS.CATEGORY) {
    let formModel: AssetCategoryFormModel;

    if ('categoryCode' in record) {
      formModel = { ...record, id: record.id ?? backendId };
    } else if ('typeCode' in record) {
      formModel = {
        id: record.id ?? backendId,
        categoryCode: record.typeCode,
        categoryName: record.typeName,
        description: record.description,
        isActive: record.isActive
      };
    } else {
      formModel = {
        id: Number(record.backendId || recordId),
        categoryCode: record.id,
        categoryName: record.name,
        description: record.description || "",
        isActive: record.status === 'Active'
      };
    }

    return executeMasterAction({
      action: updateAssetCategory,
      payload: formModel,
      revalidatePaths: REVALIDATE_PATHS,
      errorMessage: "Failed to update category"
    });
  } else if (masterId === MASTER_IDS.TYPE) {
    let formModel: AssetTypeFormModel;

    if ('typeCode' in record) {
      formModel = { ...record, id: record.id ?? backendId };
    } else if ('categoryCode' in record) {
      formModel = {
        id: record.id ?? backendId,
        typeCode: record.categoryCode,
        typeName: record.categoryName,
        categoryId: 0,
        description: record.description,
        isActive: record.isActive
      };
    } else {
      formModel = {
        id: Number(record.backendId || recordId),
        typeCode: record.id,
        typeName: record.name,
        categoryId: Number(record.group || 0),
        description: record.description || "",
        isActive: record.status === 'Active'
      };
    }

    return executeMasterAction({
      action: updateAssetType,
      payload: formModel,
      revalidatePaths: REVALIDATE_PATHS,
      errorMessage: "Failed to update asset type"
    });
  }

  return { success: false, error: `Unsupported master ID: ${masterId}` };
}

/**
 * Handles deletion of asset master records.
 */
export async function deleteAssetMasterAction(recordId: string, masterId: string = MASTER_IDS.TYPE): Promise<ActionResult<void>> {
  if (masterId === MASTER_IDS.CATEGORY) {
    return executeDeleteAction(deleteAssetCategory, Number(recordId), REVALIDATE_PATHS);
  } else if (masterId === MASTER_IDS.TYPE) {
    return executeDeleteAction(deleteAssetType, Number(recordId), REVALIDATE_PATHS);
  }
  
  return { success: false, error: `Unsupported master ID: ${masterId}` };
}
