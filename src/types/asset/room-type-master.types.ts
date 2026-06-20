/**
 * Room Type Master Types
 */

export interface RoomTypeMasterItem {
  id: number;
  assetTypeId: number;
  roomTypeCode: string;
  roomTypeName: string;
  isActive: boolean;
}

export type RoomTypeMasterPayload = Omit<RoomTypeMasterItem, 'id'>;

export interface RoomTypeMasterListParams {
  PageNumber?: number;
  PageSize?: number;
  SearchTerm?: string;
  RoomTypeCode?: string;
  RoomTypeName?: string;
  AssetTypeId?: number;
}

export interface RoomTypeMasterListResponse {
  items: RoomTypeMasterItem[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}
