import type { MasterDataRecord } from '@/types/asset-type/master-data.types';
import type { SubTypeOfUseMasterItem } from '@/types/asset/sub-type-of-use-master.types';

export function mapSubTypeOfUseToMasterRecord(item: SubTypeOfUseMasterItem): MasterDataRecord {
  return {
    id: String(item.id),
    backendId: item.id,
    name: item.description || `Sub Type ${item.id}`,
    description: item.description,
    group: String(item.typeOfUseId),
    displayOrder: item.searchSequence,
    status: item.isActive ? 'Active' : 'Inactive',
  };
}
