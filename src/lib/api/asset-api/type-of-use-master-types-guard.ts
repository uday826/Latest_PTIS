import type { MasterDataRecord } from '@/types/asset-type/master-data.types';
import type { TypeOfUseMasterItem } from '@/types/asset/type-of-use-master.types';

export function mapTypeOfUseToMasterRecord(item: TypeOfUseMasterItem): MasterDataRecord {
  return {
    id: item.typeOfUseCode || String(item.id),
    backendId: item.id,
    name: item.typeOfUseCode,
    description: item.description,
    group: String(item.assetTypeId),
    departmentId: item.typeOfUseGroupId, // we use this mapping to store typeOfUseGroupId
    status: item.isActive ? 'Active' : 'Inactive',
  };
}
