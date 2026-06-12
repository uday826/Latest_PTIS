/**
 * Inventory Condition Service
 *
 * Provides CRUD operations for inventory conditions.
 *
 * All methods wrap API calls in try/catch and throw typed ApiErrors.
 *
 * @module inventory-condition.service
 */

import { apiClient } from '@/services/api.service';
import { ApiError } from '@/lib/utils/api';
import type {
  InventoryConditionItem,
  InventoryConditionListParams,
  InventoryConditionListResponse,
  InventoryConditionPayload,
} from '@/types/asset-type/inventory-model.types';

function createInventoryApiError(statusCode?: number, errorMessage?: string, defaultMessage = 'Operation failed'): ApiError {
  const msg = errorMessage ?? '';
  const isDuplicate = msg.toLowerCase().includes('already exists') || msg.toLowerCase().includes('duplicate');
  return new ApiError(statusCode ?? (isDuplicate ? 409 : 500), msg || defaultMessage, defaultMessage);
}

export const inventoryConditionService = {
  /**
   * Fetches a paginated list of inventory conditions.
   *
   * @param params - Optional filter/pagination parameters
   * @returns Paginated response containing condition records
   */
  async getAll(params?: InventoryConditionListParams): Promise<InventoryConditionListResponse> {
    try {
      const q = new URLSearchParams();
      if (params?.PageNumber) q.set('PageNumber', params.PageNumber.toString());
      if (params?.PageSize) q.set('PageSize', params.PageSize.toString());
      if (params?.SearchTerm) q.set('SearchTerm', params.SearchTerm);
      if (params?.ConditionName) q.set('ConditionName', params.ConditionName);
      if (params?.InventoryItemCategoryId)
        q.set('InventoryItemCategoryId', params.InventoryItemCategoryId.toString());
      q.set('MarkedForDeletion', String(params?.MarkedForDeletion ?? false));
      q.set('IsActive', String(params?.IsActive ?? true));

      const queryString = q.toString();
      const res = await apiClient.get<InventoryConditionListResponse>(
        queryString ? `/InventoryItemCondition?${queryString}` : '/InventoryItemCondition'
      );
      if (!res.success || !res.data) {
        throw createInventoryApiError(
          res.statusCode,
          res.error,
          'Failed to fetch inventory conditions'
        );
      }
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Fetches a single inventory condition by its ID.
   *
   * @param id - Numeric or string condition ID
   * @returns The matching InventoryConditionItem
   */
  async getById(id: number | string): Promise<InventoryConditionItem> {
    try {
      const res = await apiClient.get<InventoryConditionItem>(`/InventoryItemCondition/${id}`);
      if (!res.success) {
        throw createInventoryApiError(
          res.statusCode,
          res.error,
          `Failed to fetch inventory condition ${id}`
        );
      }
      return res.data!;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Creates a new inventory condition.
   *
   * @param payload - Condition data to persist
   * @returns The newly created InventoryConditionItem
   */
  async create(payload: InventoryConditionPayload): Promise<InventoryConditionItem> {
    try {
      const res = await apiClient.post<InventoryConditionItem>(
        '/InventoryItemCondition',
        payload
      );
      if (!res.success) {
        throw createInventoryApiError(
          res.statusCode,
          res.error,
          'Create inventory condition failed'
        );
      }
      return res.data!;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Updates an existing inventory condition.
   *
   * @param id - ID of the condition to update
   * @param payload - Updated condition data
   * @returns The updated InventoryConditionItem
   */
  async update(
    id: number | string,
    payload: InventoryConditionPayload
  ): Promise<InventoryConditionItem> {
    try {
      const res = await apiClient.put<InventoryConditionItem>(
        `/InventoryItemCondition/${id}`,
        payload
      );
      if (!res.success) {
        throw createInventoryApiError(
          res.statusCode,
          res.error,
          'Update inventory condition failed'
        );
      }
      return res.data!;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Soft-deletes an inventory condition by ID.
   *
   * @param id - ID of the condition to delete
   */
  async delete(id: number | string): Promise<void> {
    try {
      const res = await apiClient.delete<void>(`/InventoryItemCondition/${id}`);
      if (!res.success) {
        throw createInventoryApiError(
          res.statusCode,
          res.error,
          'Delete inventory condition failed'
        );
      }
    } catch (error) {
      throw error;
    }
  },
};
