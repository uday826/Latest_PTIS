import { PenaltyRuleMasterItem } from '@/types/asset/penalty-rule-master.types';
import { MasterDataRecord } from '@/types/asset-type/master-data.types';

export function mapPenaltyToMasterRecord(item: PenaltyRuleMasterItem): MasterDataRecord {
  return {
    id: item.penaltyCode,
    backendId: item.id,
    name: item.penaltyName,
    status: item.isActive ? 'Active' : 'Inactive',
    calculationType: item.calculationType,
    penaltyValue: item.penaltyValue,
    gracePeriodDays: item.gracePeriodDays,
  };
}
