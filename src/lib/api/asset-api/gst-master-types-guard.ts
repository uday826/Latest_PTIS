import { GstMasterItem } from '@/types/asset/gst-master.types';
import { MasterDataRecord } from '@/types/asset-type/master-data.types';

export function mapGstToMasterRecord(item: GstMasterItem): MasterDataRecord {
  return {
    id: item.taxCode,
    backendId: item.id,
    name: item.taxName,
    status: item.isActive ? 'Active' : 'Inactive',
    taxPercentage: item.taxPercentage,
    effectiveFromDate: item.effectiveFromDate,
    effectiveToDate: item.effectiveToDate,
  };
}
