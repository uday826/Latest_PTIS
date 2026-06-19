import { RoomTypeMasterItem } from '@/types/asset/room-type-master.types';
import { MasterDataRecord } from '@/types/asset-type/master-data.types';

export function mapRoomTypeToMasterRecord(item: RoomTypeMasterItem): MasterDataRecord {
  return {
    id: item.roomTypeCode,
    backendId: item.id,
    name: item.roomTypeName,
    status: item.isActive ? 'Active' : 'Inactive',
  };
}
