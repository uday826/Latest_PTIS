import { InventoryCategoryItem } from '@/types/asset-type/inventory-category.types';
import { MasterDataRecord } from '@/types/asset-type/master-data.types';

export function mapInventoryCategoryToMasterRecord(cat: InventoryCategoryItem): MasterDataRecord {
  return {
    id: cat.typeCode,
    backendId: cat.id,
    name: cat.typeName,
    description: cat.description || '',
    status: cat.isActive ? 'Active' : 'Inactive',
    displayOrder: cat.displayOrder,
    depreciationRate: cat.depreciationRate,
  };
}
