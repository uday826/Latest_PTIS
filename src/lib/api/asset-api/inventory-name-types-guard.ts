import { InventoryItemNameItem } from '@/types/asset-type/inventory-model.types';
import { MasterDataRecord } from '@/types/asset-type/master-data.types';

export function mapInventoryNameToMasterRecord(nameItem: InventoryItemNameItem): MasterDataRecord {
  return {
    id: nameItem.subTypeCode,
    backendId: nameItem.id,
    name: nameItem.subTypeName,
    description: nameItem.description || '',
    group: nameItem.inventoryItemCategoryId.toString(),
    status: nameItem.isActive ? 'Active' : 'Inactive',
    displayOrder: nameItem.displayOrder,
  };
}
