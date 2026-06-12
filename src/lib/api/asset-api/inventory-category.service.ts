/**
 * Inventory Category Service
 *
 * Provides CRUD operations for inventory item categories.
 * All methods wrap API calls in try/catch and throw typed ApiErrors.
 *
 * @module inventory-category.service
 */

import { apiClient } from '@/services/api.service';
import { ApiError } from '@/lib/utils/api';
import type {
  InventoryCategoryItem,
  InventoryCategoryListParams,
  InventoryCategoryListResponse,
  InventoryCategoryPayload,
} from '@/types/asset-type/inventory-category.types';

function createInventoryApiError(statusCode?: number, errorMessage?: string, defaultMessage = 'Operation failed'): ApiError {
  const msg = errorMessage ?? '';
  const isDuplicate = msg.toLowerCase().includes('already exists') || msg.toLowerCase().includes('duplicate');
  return new ApiError(statusCode ?? (isDuplicate ? 409 : 500), msg || defaultMessage, defaultMessage);
}

export const inventoryCategoryService = {
  /**
   * Fetches a paginated list of inventory categories.
   *
   * @param params - Optional filter/pagination parameters
   * @returns Paginated response containing category records
   */
  async getAll(params?: InventoryCategoryListParams): Promise<InventoryCategoryListResponse> {
    try {
      const q = new URLSearchParams();
      if (params?.PageNumber) q.set('PageNumber', params.PageNumber.toString());
      if (params?.PageSize) q.set('PageSize', params.PageSize.toString());
      if (params?.SearchTerm) q.set('SearchTerm', params.SearchTerm);
      if (params?.TypeCode) q.set('TypeCode', params.TypeCode);
      if (params?.TypeName) q.set('TypeName', params.TypeName);
      q.set('MarkedForDeletion', String(params?.MarkedForDeletion ?? false));

      const queryString = q.toString();
      const res = await apiClient.get<InventoryCategoryListResponse>(
        queryString ? `/InventoryItemCategory?${queryString}` : '/InventoryItemCategory'
      );

      if (!res.success || !res.data) {
        throw createInventoryApiError(
          res.statusCode,
          res.error,
          'Failed to fetch inventory categories'
        );
      }
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Fetches a single inventory category by its ID.
   *
   * @param id - Numeric or string category ID
   * @returns The matching InventoryCategoryItem
   */
  async getById(id: number | string): Promise<InventoryCategoryItem> {
    try {
      const res = await apiClient.get<InventoryCategoryItem>(`/InventoryItemCategory/${id}`);
      if (!res.success) {
        throw createInventoryApiError(
          res.statusCode,
          res.error,
          `Failed to fetch inventory category ${id}`
        );
      }
      return res.data!;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Creates a new inventory category.
   *
   * @param payload - Category data to persist
   * @returns The newly created InventoryCategoryItem
   */
  async create(payload: InventoryCategoryPayload): Promise<InventoryCategoryItem> {
    try {
      const res = await apiClient.post<InventoryCategoryItem>('/InventoryItemCategory', payload);
      if (!res.success) {
        throw createInventoryApiError(
          res.statusCode,
          res.error,
          'Create inventory category failed'
        );
      }
      return res.data!;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Updates an existing inventory category.
   *
   * @param id - ID of the category to update
   * @param payload - Updated category data
   * @returns The updated InventoryCategoryItem
   */
  async update(id: number | string, payload: InventoryCategoryPayload): Promise<InventoryCategoryItem> {
    try {
      const res = await apiClient.put<InventoryCategoryItem>(
        `/InventoryItemCategory/${id}`,
        payload
      );
      if (!res.success) {
        throw createInventoryApiError(
          res.statusCode,
          res.error,
          'Update inventory category failed'
        );
      }
      return res.data!;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Soft-deletes an inventory category by ID.
   *
   * @param id - ID of the category to delete
   */
  async delete(id: number | string): Promise<void> {
    try {
      const res = await apiClient.delete<void>(`/InventoryItemCategory/${id}`);
      if (!res.success) {
        throw createInventoryApiError(
          res.statusCode,
          res.error,
          'Delete inventory category failed'
        );
      }
    } catch (error) {
      throw error;
    }
  },
};
