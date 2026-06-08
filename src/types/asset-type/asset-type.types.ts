import { PagedResponse } from "../common.types";

/** 
 * Form model for creating and editing asset types
 */
export interface AssetTypeFormModel {
  id?: number;
  typeCode: string;
  typeName: string;
  categoryId: number;
  description: string;
  isActive: boolean;
}

/**
 * Interface for the Asset Type record as returned by the backend API.
 */
export interface AssetTypeApiRecord {
  id: number;
  typeName: string;
  typeCode: string;
  categoryId: number;
  categoryName?: string;
  description: string;
  isActive: boolean;
  createdDate?: string;
  updatedDate?: string | null;
}

/**
 * Normalized model for Asset Type
 */
export interface AssetType {
  id: number;
  typeCode: string;
  typeName: string;
  categoryId: number;
  categoryName: string;
  description: string;
  isActive: boolean;
  createdDate: string;
  updatedDate: string | null;
}

/**
 * Props for Asset Type list component
 */
export interface AssetTypeProps extends Omit<PagedResponse<AssetType>, 'items' | 'hasPrevious' | 'hasNext'> {
  data: AssetType[];
}
