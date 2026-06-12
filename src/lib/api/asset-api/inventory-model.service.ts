/**
 * Inventory Model Service
 *
 * Provides CRUD operations for inventory models.
 *
 * All methods wrap API calls in try/catch and throw typed ApiErrors.
 *
 * @module inventory-model.service
 */

import { apiClient } from '@/services/api.service';
import { ApiError } from '@/lib/utils/api';
import type {
  InventoryModelItem,
  InventoryModelListParams,
  InventoryModelListResponse,
  InventoryModelPayload,
} from '@/types/asset-type/inventory-model.types';

function createInventoryApiError(statusCode?: number, errorMessage?: string, defaultMessage = 'Operation failed'): ApiError {
  const msg = errorMessage ?? '';
  const isDuplicate = msg.toLowerCase().includes('already exists') || msg.toLowerCase().includes('duplicate');
  return new ApiError(statusCode ?? (isDuplicate ? 409 : 500), msg || defaultMessage, defaultMessage);
}

export const inventoryModelService = {
  /**
   * Fetches a paginated list of inventory models.
   *
   * @param params - Optional filter/pagination parameters
   * @returns Paginated response containing model records
   */
  async getAll(params?: InventoryModelListParams): Promise<InventoryModelListResponse> {
    try {
      const q = new URLSearchParams();
      if (params?.PageNumber) q.set('PageNumber', params.PageNumber.toString());
      if (params?.PageSize) q.set('PageSize', params.PageSize.toString());
      if (params?.SearchTerm) q.set('SearchTerm', params.SearchTerm);
      if (params?.ModelName) q.set('ModelName', params.ModelName);
      if (params?.InventoryItemNameId)
        q.set('InventoryItemNameId', params.InventoryItemNameId.toString());
      q.set('MarkedForDeletion', String(params?.MarkedForDeletion ?? false));
      q.set('IsActive', String(params?.IsActive ?? true));

      const queryString = q.toString();
      const res = await apiClient.get<InventoryModelListResponse>(
        queryString ? `/InventoryItemModel?${queryString}` : '/InventoryItemModel'
      );
      if (!res.success || !res.data) {
        throw createInventoryApiError(res.statusCode, res.error, 'Failed to fetch inventory models');
      }
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Fetches a single inventory model by its ID.
   *
   * @param id - Numeric or string model ID
   * @returns The matching InventoryModelItem
   */
  async getById(id: number | string): Promise<InventoryModelItem> {
    try {
      const res = await apiClient.get<InventoryModelItem>(`/InventoryItemModel/${id}`);
      if (!res.success) {
        throw createInventoryApiError(
          res.statusCode,
          res.error,
          `Failed to fetch inventory model ${id}`
        );
      }
      return res.data!;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Creates a new inventory model.
   *
   * @param payload - Model data to persist
   * @returns The newly created InventoryModelItem
   */
  async create(payload: InventoryModelPayload): Promise<InventoryModelItem> {
    try {
      const res = await apiClient.post<InventoryModelItem>('/InventoryItemModel', payload);
      if (!res.success) {
        throw createInventoryApiError(res.statusCode, res.error, 'Create inventory model failed');
      }
      return res.data!;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Updates an existing inventory model.
   *
   * @param id - ID of the model to update
   * @param payload - Updated model data
   * @returns The updated InventoryModelItem
   */
  async update(id: number | string, payload: InventoryModelPayload): Promise<InventoryModelItem> {
    try {
      const res = await apiClient.put<InventoryModelItem>(`/InventoryItemModel/${id}`, payload);
      if (!res.success) {
        throw createInventoryApiError(res.statusCode, res.error, 'Update inventory model failed');
      }
      return res.data!;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Soft-deletes an inventory model by ID.
   *
   * @param id - ID of the model to delete
   */
  async delete(id: number | string): Promise<void> {
    try {
      const res = await apiClient.delete<void>(`/InventoryItemModel/${id}`);
      if (!res.success) {
        throw createInventoryApiError(res.statusCode, res.error, 'Delete inventory model failed');
      }
    } catch (error) {
      throw error;
    }
  },
};
