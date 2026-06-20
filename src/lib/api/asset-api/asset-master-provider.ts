import { logger } from '@/lib/utils/logger';
import { ActionResult, PagedResponse } from '@/types/common.types';
import { MasterDataType, MasterDataGroup, MASTER_IDS, MasterDataRecord } from '@/types/asset-type/master-data.types';

import { assetCategoryService } from '@/lib/api/asset-api/asset-category-crud.service';
import { getAssetTypesPaged } from '@/lib/api/asset-api/asset-type-crud.service';
import { inventoryCategoryService } from '@/lib/api/asset-api/inventory-category.service';
import { inventoryModelService } from '@/lib/api/asset-api/inventory-model.service';
import { inventoryConditionService } from '@/lib/api/asset-api/inventory-condition.service';
import { inventoryItemNameService } from '@/lib/api/asset-api/inventory-item-name.service';
import { ownershipTypeService } from '@/lib/api/asset-api/ownership-type.service';
import { owningDepartmentService } from '@/lib/api/asset-api/owning-department.service';
import { gstMasterService } from '@/lib/api/asset-api/gst-master.service';
import { penaltyRuleMasterService } from '@/lib/api/asset-api/penalty-rule-master.service';
import { roomTypeMasterService } from '@/lib/api/asset-api/room-type-master.service';
import { typeOfUseMasterService } from '@/lib/api/asset-api/type-of-use-master.service';
import { subTypeOfUseMasterService } from '@/lib/api/asset-api/sub-type-of-use-master.service';

import { mapTypeToMasterRecord } from '@/lib/api/asset-api/asset-type-types-guard';
import { mapCategoryToMasterRecord } from '@/lib/api/asset-api/asset-category-types-guard';
import { mapInventoryCategoryToMasterRecord } from '@/lib/api/asset-api/inventory-category-types-guard';
import { mapInventoryModelToMasterRecord } from '@/lib/api/asset-api/inventory-model-types-guard';
import { mapInventoryConditionToMasterRecord } from '@/lib/api/asset-api/inventory-condition-types-guard';
import { mapInventoryNameToMasterRecord } from '@/lib/api/asset-api/inventory-name-types-guard';
import { mapOwnershipTypeToMasterRecord } from '@/lib/api/asset-api/ownership-type-types-guard';
import { mapOwningDepartmentToMasterRecord } from '@/lib/api/asset-api/owning-department-types-guard';
import { mapGstToMasterRecord } from '@/lib/api/asset-api/gst-master-types-guard';
import { mapPenaltyToMasterRecord } from '@/lib/api/asset-api/penalty-rule-master-types-guard';
import { mapTypeOfUseToMasterRecord } from '@/lib/api/asset-api/type-of-use-master-types-guard';
import { mapSubTypeOfUseToMasterRecord } from '@/lib/api/asset-api/sub-type-of-use-types-guard';
import { mapRoomTypeToMasterRecord } from '@/lib/api/asset-api/room-type-master-types-guard';

const createFetch = (srv: any, mapFn: any, grpKey?: string, filterActive = false) => async (p: number, s: number, q?: string, g?: string, sb?: string, so?: string) => {
  const params: any = { PageNumber: p, PageSize: s, SearchTerm: q, SortBy: sb, SortOrder: so };
  if (grpKey && g && g !== 'all') params[grpKey] = Number(g);
  const res = await (srv.getAll ? srv.getAll(params) : srv(p, s, q, params[grpKey], sb, so));
  return { ...res, hasPrevious: p > 1, hasNext: p < res.totalPages, items: (filterActive ? res.items.filter((i: any) => i.isActive) : res.items).map(mapFn) };
};

const createGroupFetch = (srv: any, nameKey: string, codeKey?: string, descKey?: string) => async () => {
  const res = await (srv.getAll ? srv.getAll({ PageNumber: 1, PageSize: 100 }) : srv(1, 100));
  return res.items.map((i: any) => ({ id: String(i.id), name: i[nameKey], backendId: i.id, status: i.isActive ? 'Active' : 'Inactive', count: 0, description: descKey ? i[descKey] : undefined, code: codeKey ? i[codeKey] : undefined, isMovable: i.isMovable, hasFloorDetails: i.hasFloorDetails, hasInventory: i.hasInventory, isInventoryMandatory: i.isInventoryMandatory, hasLegalCompliance: i.hasLegalCompliance, valuationType: i.valuationType }));
};

const MASTER_CONFIG: Record<string, { name: string; fetch: any; getGroups?: any }> = {
  [MASTER_IDS.TYPE]: { name: 'Asset Type Master', fetch: createFetch(getAssetTypesPaged, mapTypeToMasterRecord, undefined, true), getGroups: createGroupFetch(assetCategoryService, 'categoryName', 'categoryCode', 'description') },
  [MASTER_IDS.CATEGORY]: { name: 'Asset Category Master', fetch: createFetch(assetCategoryService, mapCategoryToMasterRecord, undefined, true) },
  [MASTER_IDS.INVENTORY_CATEGORY]: { name: 'Inventory Category Master', fetch: createFetch(inventoryCategoryService, mapInventoryCategoryToMasterRecord, undefined, true) },
  [MASTER_IDS.INVENTORY_NAME]: { name: 'Inventory Name Master', fetch: createFetch(inventoryItemNameService, mapInventoryNameToMasterRecord, 'InventoryItemCategoryId', true), getGroups: createGroupFetch(inventoryCategoryService, 'typeName') },
  [MASTER_IDS.INVENTORY_MODEL]: { name: 'Inventory Model Master', fetch: createFetch(inventoryModelService, mapInventoryModelToMasterRecord, 'InventoryItemNameId', true), getGroups: createGroupFetch(inventoryItemNameService, 'subTypeName') },
  [MASTER_IDS.INVENTORY_CONDITION]: { name: 'Inventory Condition Master', fetch: createFetch(inventoryConditionService, mapInventoryConditionToMasterRecord, 'InventoryItemCategoryId', true), getGroups: createGroupFetch(inventoryCategoryService, 'typeName') },
  [MASTER_IDS.OWNERSHIP_TYPE]: { name: 'Ownership Type Master', fetch: createFetch(ownershipTypeService, mapOwnershipTypeToMasterRecord) },
  [MASTER_IDS.OWNING_DEPARTMENT]: { name: 'Owning Department Master', fetch: createFetch(owningDepartmentService, mapOwningDepartmentToMasterRecord) },
  [MASTER_IDS.TAX]: { name: 'GST Master', fetch: createFetch(gstMasterService, mapGstToMasterRecord) },
  [MASTER_IDS.PENALTY]: { name: 'Penalty Rule Master', fetch: createFetch(penaltyRuleMasterService, mapPenaltyToMasterRecord) },
  [MASTER_IDS.ROOM_TYPE]: { name: 'Room Type Master', fetch: createFetch(roomTypeMasterService, mapRoomTypeToMasterRecord, 'AssetTypeId'), getGroups: createGroupFetch(getAssetTypesPaged, 'typeName') },
  [MASTER_IDS.TYPE_OF_USE]: { name: 'Type of Use Master', fetch: createFetch(typeOfUseMasterService, mapTypeOfUseToMasterRecord, 'AssetTypeId'), getGroups: createGroupFetch(getAssetTypesPaged, 'typeName') },
  [MASTER_IDS.SUB_TYPE_OF_USE]: { name: 'Sub Type of Use Master', fetch: createFetch(subTypeOfUseMasterService, mapSubTypeOfUseToMasterRecord, 'TypeOfUseId'), getGroups: createGroupFetch(typeOfUseMasterService, 'typeOfUseCode') }
};

export async function getAssetMasterDataProvider(activeMasterId: string = MASTER_IDS.TYPE, groupId: string = 'all', page: number = 1, pageSize: number = 10, search?: string, sortBy: string = 'typeName', sortOrder: 'asc' | 'desc' = 'asc'): Promise<ActionResult<MasterDataType[]>> {
  try {
    const masterData: MasterDataType[] = [];
    for (const [id, config] of Object.entries(MASTER_CONFIG)) {
      let records: MasterDataRecord[] = [], totalCount = 0, totalPages = 0, groups: MasterDataGroup[] = [];
      if (id === activeMasterId) {
        const res = await config.fetch(page, pageSize, search, groupId, sortBy, sortOrder);
        records = res.items; totalCount = res.totalCount; totalPages = res.totalPages;
        if (config.getGroups) {
          const fetchedGroups = await config.getGroups();
          groups = [{ id: 'all', name: 'allRecords', count: groupId === 'all' ? totalCount : 0 }, ...fetchedGroups.map((g: any) => ({ ...g, count: groupId === String(g.id) ? totalCount : 0 }))];
        }
      }
      masterData.push({ id, name: config.name, groups, records, totalCount, totalPages, pageNumber: page, pageSize });
    }
    return { success: true, data: masterData };
  } catch (error: any) {
    logger.error("Master Data Provider Error:", { error });
    return { success: false, error: error?.message || "Failed to fetch master data", data: [] };
  }
}
