import { logger } from '@/lib/utils/logger';
import { ActionResult, PagedResponse } from '@/types/common.types';
import { MasterDataType, MasterDataGroup, MASTER_IDS, MasterDataRecord } from '@/types/asset-type/master-data.types';
import { assetCategoryService } from '@/lib/api/asset-api/asset-category-crud.service';
import { getAssetTypesPaged } from '@/lib/api/asset-api/asset-type-crud.service';
import { mapTypeToMasterRecord } from '@/lib/api/asset-api/asset-type-types-guard';
import { mapCategoryToMasterRecord } from '@/lib/api/asset-api/asset-category-types-guard';


import { inventoryCategoryService } from '@/lib/api/asset-api/inventory-category.service';
import { inventoryModelService } from '@/lib/api/asset-api/inventory-model.service';
import { inventoryConditionService } from '@/lib/api/asset-api/inventory-condition.service';
import { inventoryItemNameService } from '@/lib/api/asset-api/inventory-item-name.service';

import { mapInventoryCategoryToMasterRecord } from '@/lib/api/asset-api/inventory-category-types-guard';
import { mapInventoryModelToMasterRecord } from '@/lib/api/asset-api/inventory-model-types-guard';
import { mapInventoryConditionToMasterRecord } from '@/lib/api/asset-api/inventory-condition-types-guard';
import { mapInventoryNameToMasterRecord } from '@/lib/api/asset-api/inventory-name-types-guard';

import { ownershipTypeService } from '@/lib/api/asset-api/ownership-type.service';
import { owningDepartmentService } from '@/lib/api/asset-api/owning-department.service';

import { mapOwnershipTypeToMasterRecord } from '@/lib/api/asset-api/ownership-type-types-guard';
import { mapOwningDepartmentToMasterRecord } from '@/lib/api/asset-api/owning-department-types-guard';

/** 
 * Registry for all Master Data configurations.
 * Scaling to 90+ masters is as simple as adding a new entry here.
 */
const MASTER_CONFIG: Record<string, {
  name: string;
  fetch: (page: number, size: number, search?: string, group?: string, sortBy?: string, sortOrder?: 'asc' | 'desc') => Promise<PagedResponse<MasterDataRecord>>;
  getGroups?: () => Promise<MasterDataGroup[]>;
}> = {
  [MASTER_IDS.TYPE]: {
    name: 'Asset Type Master',
    fetch: async (p, s, search, g, sortBy, sortOrder) => {
      const res = await getAssetTypesPaged(p, s, search, g !== 'all' ? Number(g) : undefined, sortBy, sortOrder);
      const activeItems = res.items.filter(i => i.isActive);
      return { ...res, items: activeItems.map(mapTypeToMasterRecord) };
    },
    getGroups: async () => {
      const res = await assetCategoryService.getAll({ PageNumber: 1, PageSize: 100 });
      return res.items.map(cat => ({
        id: String(cat.id),
        name: cat.categoryName,
        backendId: cat.id,
        status: cat.isActive ? 'Active' : 'Inactive',
        count: 0,
        description: cat.description,
        code: cat.categoryCode,
        isMovable: cat.isMovable,
        hasFloorDetails: cat.hasFloorDetails,
        hasInventory: cat.hasInventory,
        isInventoryMandatory: cat.isInventoryMandatory,
        hasLegalCompliance: cat.hasLegalCompliance,
        valuationType: cat.valuationType
      }));
    }
  },
  [MASTER_IDS.CATEGORY]: {
    name: 'Asset Category Master',
    fetch: async (p, s, search, _g, sortBy, sortOrder) => {
      const res = await assetCategoryService.getAll({ PageNumber: p, PageSize: s, SearchTerm: search, SortBy: sortBy, SortOrder: sortOrder });
      const activeItems = res.items.filter(i => i.isActive);
      return { ...res, items: activeItems.map(mapCategoryToMasterRecord) };
    }
  },
  [MASTER_IDS.INVENTORY_CATEGORY]: {
    name: 'Inventory Category Master',
    fetch: async (p, s, search) => {
      const res = await inventoryCategoryService.getAll({ PageNumber: p, PageSize: s, SearchTerm: search });
      const activeItems = res.items.filter(i => i.isActive);
      return { ...res, hasPrevious: p > 1, hasNext: p < res.totalPages, items: activeItems.map(mapInventoryCategoryToMasterRecord) };
    }
  },
  [MASTER_IDS.INVENTORY_NAME]: {
    name: 'Inventory Name Master',
    fetch: async (p, s, search, g) => {
      const res = await inventoryItemNameService.getAll({ PageNumber: p, PageSize: s, SearchTerm: search, InventoryItemCategoryId: g !== 'all' ? Number(g) : undefined });
      const activeItems = res.items.filter(i => i.isActive);
      return { ...res, hasPrevious: p > 1, hasNext: p < res.totalPages, items: activeItems.map(mapInventoryNameToMasterRecord) };
    },
    getGroups: async () => {
      const res = await inventoryCategoryService.getAll({ PageNumber: 1, PageSize: 100 });
      return res.items.map(cat => ({
        id: String(cat.id),
        name: cat.typeName,
        backendId: cat.id,
        status: cat.isActive ? 'Active' : 'Inactive',
        count: 0,
      }));
    },
  },
  [MASTER_IDS.INVENTORY_MODEL]: {
    name: 'Inventory Model Master',
    fetch: async (p, s, search, g) => {
      const res = await inventoryModelService.getAll({ PageNumber: p, PageSize: s, SearchTerm: search, InventoryItemNameId: g !== 'all' ? Number(g) : undefined });
      const activeItems = res.items.filter(i => i.isActive);
      return { ...res, hasPrevious: p > 1, hasNext: p < res.totalPages, items: activeItems.map(mapInventoryModelToMasterRecord) };
    },
    getGroups: async () => {
      const res = await inventoryItemNameService.getAll({ PageNumber: 1, PageSize: 100 });
      return res.items.map(n => ({
        id: String(n.id),
        name: n.subTypeName,
        backendId: n.id,
        status: n.isActive ? 'Active' : 'Inactive',
        count: 0,
      }));
    },
  },
  [MASTER_IDS.INVENTORY_CONDITION]: {
    name: 'Inventory Condition Master',
    fetch: async (p, s, search, g) => {
      const res = await inventoryConditionService.getAll({ PageNumber: p, PageSize: s, SearchTerm: search, InventoryItemCategoryId: g !== 'all' ? Number(g) : undefined });
      const activeItems = res.items.filter(i => i.isActive);
      return { ...res, hasPrevious: p > 1, hasNext: p < res.totalPages, items: activeItems.map(mapInventoryConditionToMasterRecord) };
    },
    getGroups: async () => {
      const res = await inventoryCategoryService.getAll({ PageNumber: 1, PageSize: 100 });
      return res.items.map(cat => ({
        id: String(cat.id),
        name: cat.typeName,
        backendId: cat.id,
        status: cat.isActive ? 'Active' : 'Inactive',
        count: 0,
      }));
    },
  },
  [MASTER_IDS.OWNERSHIP_TYPE]: {
    name: 'Ownership Type Master',
    fetch: async (p, s, search) => {
      const res = await ownershipTypeService.getAll({ PageNumber: p, PageSize: s, SearchTerm: search });
      return { ...res, hasPrevious: p > 1, hasNext: p < res.totalPages, items: res.items.map(mapOwnershipTypeToMasterRecord) };
    }
  },
  [MASTER_IDS.OWNING_DEPARTMENT]: {
    name: 'Owning Department Master',
    fetch: async (p, s, search) => {
      const res = await owningDepartmentService.getAll({ PageNumber: p, PageSize: s, SearchTerm: search });
      return { ...res, hasPrevious: p > 1, hasNext: p < res.totalPages, items: res.items.map(mapOwningDepartmentToMasterRecord) };
    }
  }
};

/**
 * Central provider to fetch and build data for the Configuration Master dashboard.
 * Uses a registry-based dynamic approach to support 90+ masters efficiently.
 */
export async function getAssetMasterDataProvider(
  activeMasterId: string = MASTER_IDS.TYPE,
  groupId: string = 'all',
  page: number = 1,
  pageSize: number = 10,
  search?: string,
  sortBy: string = 'typeName',
  sortOrder: 'asc' | 'desc' = 'asc'
): Promise<ActionResult<MasterDataType[]>> {
  try {
    const masterData: MasterDataType[] = [];

    // Iterate over the registry to build the master list
    for (const [id, config] of Object.entries(MASTER_CONFIG)) {
      const isActive = id === activeMasterId;

      let records: MasterDataRecord[] = [];
      let totalCount = 0;
      let totalPages = 0;
      let groups: MasterDataGroup[] = [];

      // 1. Only fetch data if this is the active master (Performance optimization)
      if (isActive) {
        const res = await config.fetch(page, pageSize, search, groupId, sortBy, sortOrder);
        records = res.items;
        totalCount = res.totalCount;
        totalPages = res.totalPages;

        if (config.getGroups) {
          const fetchedGroups = await config.getGroups();
          // Add "All Records" default group
          groups = [
            { id: 'all', name: 'allRecords', count: groupId === 'all' ? totalCount : 0 },
            ...fetchedGroups.map(g => ({
              ...g,
              count: groupId === String(g.id) ? totalCount : 0
            }))
          ];
        }
      }

      // 2. Build standardized object
      masterData.push({
        id,
        name: config.name,
        groups,
        records,
        totalCount,
        totalPages,
        pageNumber: page,
        pageSize: pageSize
      });
    }

    return { success: true, data: masterData };
  } catch (error: unknown) {
    logger.error("Master Data Provider Error:", { error: error instanceof Error ? error : new Error(String(error)) });
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch master data",
      data: []
    };
  }
}

