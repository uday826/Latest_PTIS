import { InventoryModelItem } from '@/types/asset-type/inventory-model.types';
import { MasterDataRecord } from '@/types/asset-type/master-data.types';

export function mapInventoryModelToMasterRecord(model: InventoryModelItem): MasterDataRecord {
  return {
    id: model.id.toString(), // Models usually don't have a distinct code, using ID or string fallback
    backendId: model.id,
    name: model.modelName,
    description: model.description || '',
    group: model.inventoryItemNameId.toString(),
    status: model.isActive ? 'Active' : 'Inactive',
    displayOrder: model.displayOrder,
  };
}
