/**
 * Penalty Rule Master API Service
 */

import { apiClient } from '@/services/api.service';
import { ApiError } from '@/lib/utils/api';
import type {
  PenaltyRuleMasterItem,
  PenaltyRuleMasterListParams,
  PenaltyRuleMasterListResponse,
  PenaltyRuleMasterPayload,
} from '@/types/asset/penalty-rule-master.types';

function createApiError(statusCode?: number, errorMessage?: string, defaultMessage = 'Operation failed'): ApiError {
  const msg = errorMessage ?? '';
  const isDuplicate = msg.toLowerCase().includes('already exists') || msg.toLowerCase().includes('duplicate');
  return new ApiError(statusCode ?? (isDuplicate ? 409 : 500), msg || defaultMessage, defaultMessage);
}

export const penaltyRuleMasterService = {
  async getAll(params?: PenaltyRuleMasterListParams): Promise<PenaltyRuleMasterListResponse> {
    try {
      const q = new URLSearchParams();
      if (params?.PageNumber) q.set('PageNumber', params.PageNumber.toString());
      if (params?.PageSize) q.set('PageSize', params.PageSize.toString());
      if (params?.SearchTerm) q.set('SearchTerm', params.SearchTerm);
      if (params?.PenaltyCode) q.set('PenaltyCode', params.PenaltyCode);
      if (params?.PenaltyName) q.set('PenaltyName', params.PenaltyName);

      const queryString = q.toString();
      const res = await apiClient.get<PenaltyRuleMasterListResponse>(
        queryString ? `/PenaltyRule?${queryString}` : '/PenaltyRule'
      );

      if (!res.success || !res.data) {
        throw createApiError(res.statusCode, res.error, 'Failed to fetch penalty rule records');
      }
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  async getById(id: number | string): Promise<PenaltyRuleMasterItem> {
    try {
      const res = await apiClient.get<PenaltyRuleMasterItem>(`/PenaltyRule/${id}`);
      if (!res.success) {
        throw createApiError(res.statusCode, res.error, `Failed to fetch penalty rule record ${id}`);
      }
      return res.data!;
    } catch (error) {
      throw error;
    }
  },

  async create(payload: PenaltyRuleMasterPayload): Promise<PenaltyRuleMasterItem> {
    try {
      const res = await apiClient.post<PenaltyRuleMasterItem>('/PenaltyRule', payload);
      if (!res.success) {
        throw createApiError(res.statusCode, res.error, 'Create penalty rule record failed');
      }
      return res.data!;
    } catch (error) {
      throw error;
    }
  },

  async update(id: number | string, payload: PenaltyRuleMasterPayload): Promise<PenaltyRuleMasterItem> {
    try {
      const res = await apiClient.put<PenaltyRuleMasterItem>(`/PenaltyRule/${id}`, payload);
      if (!res.success) {
        throw createApiError(res.statusCode, res.error, 'Update penalty rule record failed');
      }
      return res.data!;
    } catch (error) {
      throw error;
    }
  },

  async delete(id: number | string): Promise<void> {
    try {
      const res = await apiClient.delete<void>(`/PenaltyRule/${id}`);
      if (!res.success) {
        throw createApiError(res.statusCode, res.error, 'Delete penalty rule record failed');
      }
    } catch (error) {
      throw error;
    }
  },
};
