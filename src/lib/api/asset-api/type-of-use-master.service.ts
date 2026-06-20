import { apiClient } from '@/services/api.service';
import { ApiError } from '@/lib/utils/api';
import type {
  TypeOfUseMasterItem,
  TypeOfUseMasterListParams,
  TypeOfUseMasterListResponse,
  TypeOfUseMasterPayload,
} from '@/types/asset/type-of-use-master.types';

function createApiError(statusCode?: number, errorMessage?: string, defaultMessage = 'Operation failed'): ApiError {
  const msg = errorMessage ?? '';
  const isDuplicate = msg.toLowerCase().includes('already exists') || msg.toLowerCase().includes('duplicate');
  return new ApiError(statusCode ?? (isDuplicate ? 409 : 500), msg || defaultMessage, defaultMessage);
}

export const typeOfUseMasterService = {
  async getAll(params?: TypeOfUseMasterListParams): Promise<TypeOfUseMasterListResponse> {
    try {
      const q = new URLSearchParams();
      if (params?.PageNumber) q.set('PageNumber', params.PageNumber.toString());
      if (params?.PageSize) q.set('PageSize', params.PageSize.toString());
      if (params?.SearchTerm) q.set('SearchTerm', params.SearchTerm);
      if (params?.AssetTypeId) q.set('AssetTypeId', params.AssetTypeId.toString());

      const queryString = q.toString();
      const res = await apiClient.get<TypeOfUseMasterListResponse>(
        queryString ? `/AssetTypeOfUseMaster?${queryString}` : '/AssetTypeOfUseMaster'
      );

      if (!res.success || !res.data) {
        throw createApiError(res.statusCode, res.error, 'Failed to fetch Type of Use records');
      }
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  async getById(id: number | string): Promise<TypeOfUseMasterItem> {
    try {
      const res = await apiClient.get<TypeOfUseMasterItem>(`/AssetTypeOfUseMaster/${id}`);
      if (!res.success) {
        throw createApiError(res.statusCode, res.error, `Failed to fetch Type of Use record ${id}`);
      }
      return res.data!;
    } catch (error) {
      throw error;
    }
  },

  async create(payload: TypeOfUseMasterPayload): Promise<TypeOfUseMasterItem> {
    try {
      const res = await apiClient.post<TypeOfUseMasterItem>('/AssetTypeOfUseMaster', payload);
      if (!res.success) {
        throw createApiError(res.statusCode, res.error, 'Create Type of Use record failed');
      }
      return res.data!;
    } catch (error) {
      throw error;
    }
  },

  async update(id: number | string, payload: TypeOfUseMasterPayload): Promise<TypeOfUseMasterItem> {
    try {
      const res = await apiClient.put<TypeOfUseMasterItem>(`/AssetTypeOfUseMaster/${id}`, payload);
      if (!res.success) {
        throw createApiError(res.statusCode, res.error, 'Update Type of Use record failed');
      }
      return res.data!;
    } catch (error) {
      throw error;
    }
  },

  async delete(id: number | string): Promise<void> {
    try {
      const res = await apiClient.delete<void>(`/AssetTypeOfUseMaster/${id}`);
      if (!res.success) {
        throw createApiError(res.statusCode, res.error, 'Delete Type of Use record failed');
      }
    } catch (error) {
      throw error;
    }
  },
};
