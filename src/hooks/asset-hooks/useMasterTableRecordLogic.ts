
import type {
  MasterDataRecord,
  
} from '@/types/asset-type/asset.types';



export function useMasterTableRecordLogic(
  records: MasterDataRecord[] = [],
  selectedGroup: string,
  
) {


  const filteredRecords = records.filter(
    (record) =>
      !selectedGroup || selectedGroup === 'all' || String(record.group) === String(selectedGroup)
  );
  const activeCount = filteredRecords.filter((item) => item.status === 'Active').length;
  const shownCount = filteredRecords.length;



  return {

    filteredRecords,
    activeCount,
    shownCount,
  };
}
