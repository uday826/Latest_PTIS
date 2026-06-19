/**
 * Room Type Master API Service
 */

import { apiClient } from '@/services/api.service';
import { ApiError } from '@/lib/utils/api';
import type {
  RoomTypeMasterItem,
  RoomTypeMasterListParams,
  RoomTypeMasterListResponse,
  RoomTypeMasterPayload,
} from '@/types/asset/room-type-master.types';

function createApiError(statusCode?: number, errorMessage?: string, defaultMessage = 'Operation failed'): ApiError {
  const msg = errorMessage ?? '';
  const isDuplicate = msg.toLowerCase().includes('already exists') || msg.toLowerCase().includes('duplicate');
  return new ApiError(statusCode ?? (isDuplicate ? 409 : 500), msg || defaultMessage, defaultMessage);
}

export const roomTypeMasterService = {
  async getAll(params?: RoomTypeMasterListParams): Promise<RoomTypeMasterListResponse> {
    try {
      const q = new URLSearchParams();
      if (params?.PageNumber) q.set('PageNumber', params.PageNumber.toString());
      if (params?.PageSize) q.set('PageSize', params.PageSize.toString());
      if (params?.SearchTerm) q.set('SearchTerm', params.SearchTerm);
      if (params?.RoomTypeCode) q.set('RoomTypeCode', params.RoomTypeCode);
      if (params?.RoomTypeName) q.set('RoomTypeName', params.RoomTypeName);

      const queryString = q.toString();
      const res = await apiClient.get<RoomTypeMasterListResponse>(
        queryString ? `/RoomTypeMaster?${queryString}` : '/RoomTypeMaster'
      );

      if (!res.success || !res.data) {
        throw createApiError(res.statusCode, res.error, 'Failed to fetch Room Type records');
      }
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  async getById(id: number | string): Promise<RoomTypeMasterItem> {
    try {
      const res = await apiClient.get<RoomTypeMasterItem>(`/RoomTypeMaster/${id}`);
      if (!res.success) {
        throw createApiError(res.statusCode, res.error, `Failed to fetch Room Type record ${id}`);
      }
      return res.data!;
    } catch (error) {
      throw error;
    }
  },

  async create(payload: RoomTypeMasterPayload): Promise<RoomTypeMasterItem> {
    try {
      const res = await apiClient.post<RoomTypeMasterItem>('/RoomTypeMaster', payload);
      if (!res.success) {
        throw createApiError(res.statusCode, res.error, 'Create Room Type record failed');
      }
      return res.data!;
    } catch (error) {
      throw error;
    }
  },

  async update(id: number | string, payload: RoomTypeMasterPayload): Promise<RoomTypeMasterItem> {
    try {
      const res = await apiClient.put<RoomTypeMasterItem>(`/RoomTypeMaster/${id}`, payload);
      if (!res.success) {
        throw createApiError(res.statusCode, res.error, 'Update Room Type record failed');
      }
      return res.data!;
    } catch (error) {
      throw error;
    }
  },

  async delete(id: number | string): Promise<void> {
    try {
      const res = await apiClient.delete<void>(`/RoomTypeMaster/${id}`);
      if (!res.success) {
        throw createApiError(res.statusCode, res.error, 'Delete Room Type record failed');
      }
    } catch (error) {
      throw error;
    }
  },
};
