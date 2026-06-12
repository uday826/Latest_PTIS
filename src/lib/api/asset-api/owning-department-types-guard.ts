import type { MasterDataRecord } from '@/types/asset-type/asset.types';
import type { OwningDepartmentApiRecord } from '@/types/asset-type/master-data-api.types';

export function mapOwningDepartmentToMasterRecord(dept: OwningDepartmentApiRecord): MasterDataRecord {
  return {
    id: String(dept.id),
    backendId: dept.id,
    name: dept.owningDepartmentName,
    departmentId: dept.departmentId,
    departmentName: dept.departmentName,
    description: dept.description || '',
    status: dept.isActive ? 'Active' : 'Inactive',
    group: 'all',
  };
}

