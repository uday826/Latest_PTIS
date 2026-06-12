import type { MasterDataRecord } from '@/types/asset-type/asset.types';
import type { OwnershipTypeApiRecord } from '@/types/asset-type/master-data-api.types';

export function mapOwnershipTypeToMasterRecord(type: OwnershipTypeApiRecord): MasterDataRecord {
  return {
    id: String(type.id),
    backendId: type.id,
    name: type.ownershipTypeName,
    description: type.description || '',
    status: type.isActive ? 'Active' : 'Inactive',
    group: 'all',
  };
}

