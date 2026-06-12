export interface InventoryCategoryItem {
  id: number;
  typeCode: string;
  typeName: string;
  displayOrder: number;
  depreciationRate: number;
  description: string | null;
  isActive: boolean;
  createdDate: string;
  updatedDate: string | null;
}

export interface InventoryCategoryListResponse {
  items: InventoryCategoryItem[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface InventoryCategoryListParams {
  TypeCode?: string;
  TypeName?: string;
  PageNumber?: number;
  PageSize?: number;
  SearchTerm?: string;
  MarkedForDeletion?: boolean;
}

export interface InventoryCategoryPayload {
  typeCode: string;
  typeName: string;
  description?: string;
  depreciationRate?: number;
  displayOrder: number;
  isActive?: boolean;
  createdBy?: number;
  updatedBy?: number;
}
