import { PagedResponse } from "../common.types";

/** 
 * Form model for creating and editing asset categories
 */
export interface AssetCategoryFormModel {
  id?: number;
  categoryCode: string;
  categoryName: string;
  description: string;
  isActive: boolean;
}

/**
 * Interface for the Asset Category record as returned by the backend API.
 */
export interface AssetCategoryApiRecord {
  id: number;
  categoryName: string;
  categoryCode: string;
  description: string;
  isActive: boolean;
  createdDate?: string;
  updatedDate?: string | null;
}

/**
 * Normalized model for Asset Category
 */
export interface AssetCategory {
  id: number;
  categoryCode: string;
  categoryName: string;
  description: string;
  isActive: boolean;
  createdDate: string;
  updatedDate: string | null;
}

/**
 * Props for Asset Category list component
 */
export interface AssetCategoryProps extends Omit<PagedResponse<AssetCategory>, 'items' | 'hasPrevious' | 'hasNext'> {
  data: AssetCategory[];
}
