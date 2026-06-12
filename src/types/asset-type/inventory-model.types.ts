export interface InventoryModelItem {
  id: number;
  inventoryItemNameId: number;
  modelName: string;
  displayOrder: number;
  description: string | null;
  isActive: boolean;
  createdDate: string;
  updatedDate: string | null;
}

export interface InventoryModelListResponse {
  items: InventoryModelItem[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface InventoryItemNameItem {
  id: number;
  inventoryItemCategoryId: number;
  subTypeCode: string;
  subTypeName: string;
  displayOrder: number;
  description: string | null;
  isActive: boolean;
  createdDate: string;
  updatedDate: string | null;
}

export interface InventoryItemNameListResponse {
  items: InventoryItemNameItem[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface InventoryModelListParams {
  InventoryItemNameId?: number;
  ModelName?: string;
  PageNumber?: number;
  PageSize?: number;
  SearchTerm?: string;
  MarkedForDeletion?: boolean;
}

export interface InventoryItemNameListParams {
  InventoryItemCategoryId?: number;
  SubTypeName?: string;
  PageNumber?: number;
  PageSize?: number;
  SearchTerm?: string;
  MarkedForDeletion?: boolean;
}

export interface InventoryModelPayload {
  inventoryItemNameId: number;
  modelName: string;
  description?: string;
  displayOrder?: number;
  isActive?: boolean;
  createdBy?: number;
  updatedBy?: number;
}

export interface InventoryItemNamePayload {
  inventoryItemCategoryId: number;
  subTypeCode: string;
  subTypeName: string;
  description?: string;
  displayOrder?: number;
  isActive?: boolean;
  createdBy?: number;
  updatedBy?: number;
}

export interface InventoryConditionItem {
  id: number;
  inventoryItemCategoryId: number;
  conditionName: string;
  conditionFactor: number;
  displayOrder?: number;
  description: string | null;
  isActive: boolean;
  createdDate: string;
  updatedDate: string | null;
}

export interface InventoryConditionListResponse {
  items: InventoryConditionItem[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface InventoryConditionListParams {
  InventoryItemCategoryId?: number;
  ConditionName?: string;
  PageNumber?: number;
  PageSize?: number;
  SearchTerm?: string;
  MarkedForDeletion?: boolean;
}

export interface InventoryConditionPayload {
  inventoryItemCategoryId: number;
  conditionName: string;
  conditionFactor: number;
  description?: string;
  displayOrder?: number;
  isActive?: boolean;
  createdBy?: number;
  updatedBy?: number;
}
