/**
 * GST Master API Service
 */

import { apiClient } from '@/services/api.service';
import { ApiError } from '@/lib/utils/api';
import type {
  GstMasterItem,
  GstMasterListParams,
  GstMasterListResponse,
  GstMasterPayload,
} from '@/types/asset/gst-master.types';

function createApiError(statusCode?: number, errorMessage?: string, defaultMessage = 'Operation failed'): ApiError {
  const msg = errorMessage ?? '';
  const isDuplicate = msg.toLowerCase().includes('already exists') || msg.toLowerCase().includes('duplicate');
  return new ApiError(statusCode ?? (isDuplicate ? 409 : 500), msg || defaultMessage, defaultMessage);
}

export const gstMasterService = {
  async getAll(params?: GstMasterListParams): Promise<GstMasterListResponse> {
    try {
      const q = new URLSearchParams();
      if (params?.PageNumber) q.set('PageNumber', params.PageNumber.toString());
      if (params?.PageSize) q.set('PageSize', params.PageSize.toString());
      if (params?.SearchTerm) q.set('SearchTerm', params.SearchTerm);
      if (params?.TaxCode) q.set('TaxCode', params.TaxCode);
      if (params?.TaxName) q.set('TaxName', params.TaxName);

      const queryString = q.toString();
      const res = await apiClient.get<GstMasterListResponse>(
        queryString ? `/GST?${queryString}` : '/GST'
      );

      if (!res.success || !res.data) {
        throw createApiError(res.statusCode, res.error, 'Failed to fetch GST records');
      }
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  async getById(id: number | string): Promise<GstMasterItem> {
    try {
      const res = await apiClient.get<GstMasterItem>(`/GST/${id}`);
      if (!res.success) {
        throw createApiError(res.statusCode, res.error, `Failed to fetch GST record ${id}`);
      }
      return res.data!;
    } catch (error) {
      throw error;
    }
  },

  async create(payload: GstMasterPayload): Promise<GstMasterItem> {
    try {
      const res = await apiClient.post<GstMasterItem>('/GST', payload);
      if (!res.success) {
        throw createApiError(res.statusCode, res.error, 'Create GST record failed');
      }
      return res.data!;
    } catch (error) {
      throw error;
    }
  },

  async update(id: number | string, payload: GstMasterPayload): Promise<GstMasterItem> {
    try {
      const res = await apiClient.put<GstMasterItem>(`/GST/${id}`, payload);
      if (!res.success) {
        throw createApiError(res.statusCode, res.error, 'Update GST record failed');
      }
      return res.data!;
    } catch (error) {
      throw error;
    }
  },

  async delete(id: number | string): Promise<void> {
    try {
      const res = await apiClient.delete<void>(`/GST/${id}`);
      if (!res.success) {
        throw createApiError(res.statusCode, res.error, 'Delete GST record failed');
      }
    } catch (error) {
      throw error;
    }
  },
};
