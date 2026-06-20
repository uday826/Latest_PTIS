import { apiClient } from '@/services/api.service';
import { ApiError } from '@/lib/utils/api';
import type {
  SubTypeOfUseMasterItem,
  SubTypeOfUseMasterListParams,
  SubTypeOfUseMasterListResponse,
  SubTypeOfUseMasterPayload,
} from '@/types/asset/sub-type-of-use-master.types';

function createApiError(statusCode?: number, errorMessage?: string, defaultMessage = 'Operation failed'): ApiError {
  const msg = errorMessage ?? '';
  const isDuplicate = msg.toLowerCase().includes('already exists') || msg.toLowerCase().includes('duplicate');
  return new ApiError(statusCode ?? (isDuplicate ? 409 : 500), msg || defaultMessage, defaultMessage);
}

export const subTypeOfUseMasterService = {
  async getAll(params?: SubTypeOfUseMasterListParams): Promise<SubTypeOfUseMasterListResponse> {
    try {
      const q = new URLSearchParams();
      if (params?.PageNumber) q.set('PageNumber', params.PageNumber.toString());
      if (params?.PageSize) q.set('PageSize', params.PageSize.toString());
      if (params?.SearchTerm) q.set('SearchTerm', params.SearchTerm);
      if (params?.TypeOfUseId) q.set('TypeOfUseId', params.TypeOfUseId.toString());

      const queryString = q.toString();
      const res = await apiClient.get<SubTypeOfUseMasterListResponse>(
        queryString ? `/AssetSubTypeOfUse?${queryString}` : '/AssetSubTypeOfUse'
      );

      if (!res.success || !res.data) {
        throw createApiError(res.statusCode, res.error, 'Failed to fetch Sub Type of Use records');
      }
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  async getById(id: number | string): Promise<SubTypeOfUseMasterItem> {
    try {
      const res = await apiClient.get<SubTypeOfUseMasterItem>(`/AssetSubTypeOfUse/${id}`);
      if (!res.success) {
        throw createApiError(res.statusCode, res.error, `Failed to fetch Sub Type of Use record ${id}`);
      }
      return res.data!;
    } catch (error) {
      throw error;
    }
  },

  async create(payload: SubTypeOfUseMasterPayload): Promise<SubTypeOfUseMasterItem> {
    try {
      const res = await apiClient.post<SubTypeOfUseMasterItem>('/AssetSubTypeOfUse', payload);
      if (!res.success) {
        throw createApiError(res.statusCode, res.error, 'Create Sub Type of Use record failed');
      }
      return res.data!;
    } catch (error) {
      throw error;
    }
  },

  async update(id: number | string, payload: SubTypeOfUseMasterPayload): Promise<SubTypeOfUseMasterItem> {
    try {
      const res = await apiClient.put<SubTypeOfUseMasterItem>(`/AssetSubTypeOfUse/${id}`, payload);
      if (!res.success) {
        throw createApiError(res.statusCode, res.error, 'Update Sub Type of Use record failed');
      }
      return res.data!;
    } catch (error) {
      throw error;
    }
  },

  async delete(id: number | string): Promise<void> {
    try {
      const res = await apiClient.delete<void>(`/AssetSubTypeOfUse/${id}`);
      if (!res.success) {
        throw createApiError(res.statusCode, res.error, 'Delete Sub Type of Use record failed');
      }
    } catch (error) {
      throw error;
    }
  },
};
