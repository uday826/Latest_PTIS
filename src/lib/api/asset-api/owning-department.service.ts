/**
 * Owning Department Service
 *
 * Provides CRUD operations for owning departments.
 * All methods wrap API calls in try/catch and throw typed ApiErrors.
 *
 * @module owning-department.service
 */

import { apiClient } from '@/services/api.service';

import type { MasterDataRecord } from '@/types/asset-type/asset.types';
import type { 
  OwningDepartmentApiRecord, 
  OwningDepartmentPagedResponse, 
  OwningDepartmentParams 
} from '@/types/asset-type/master-data-api.types';
import { buildOwningDepartmentCreatePayload, buildOwningDepartmentUpdatePayload } from './asset-payload-builders';
import { ApiError } from '@/lib/utils/api';

export type { OwningDepartmentApiRecord, OwningDepartmentPagedResponse, OwningDepartmentParams };

async function handleMasterDataApiRequest<T>(
  requestFn: () => Promise<{ success: boolean; data?: T; statusCode?: number; error?: string }>,
  defaultErrorMessage = 'Operation failed'
): Promise<T> {
  try {
    const res = await requestFn();
    if (!res.success) {
      const msg = res.error ?? '';
      const isDuplicate = msg.toLowerCase().includes('already exists') || msg.toLowerCase().includes('duplicate');
      throw new ApiError(res.statusCode ?? (isDuplicate ? 409 : 500), msg || defaultErrorMessage, defaultErrorMessage);
    }
    return res.data as T;
  } catch (error) {
    throw error;
  }
}

export const owningDepartmentService = {
  /**
   * Fetches a paginated list of owning departments.
   */
  async getAll(params?: OwningDepartmentParams): Promise<OwningDepartmentPagedResponse> {
    const q = new URLSearchParams();
    if (params?.PageNumber) q.set('PageNumber', params.PageNumber.toString());
    if (params?.PageSize) q.set('PageSize', params.PageSize.toString());
    if (params?.SearchTerm) q.set('SearchTerm', params.SearchTerm);
    q.set('MarkedForDeletion', String(params?.MarkedForDeletion ?? false));
    q.set('IsActive', params?.IsActive ?? 'true');

    const queryString = q.toString();
    return handleMasterDataApiRequest(
      () => apiClient.get<OwningDepartmentPagedResponse>(
        queryString ? `/OwningDepartment?${queryString}` : '/OwningDepartment',
        { cache: 'no-store' }
      ),
      'Failed to fetch owning departments'
    );
  },

  /**
   * Fetches a single owning department by its ID.
   */
  async getById(id: number | string): Promise<OwningDepartmentApiRecord> {
    return handleMasterDataApiRequest(
      () => apiClient.get<OwningDepartmentApiRecord>(`/OwningDepartment/${id}`),
      `Failed to fetch owning department ${id}`
    );
  },

  /**
   * Creates a new owning department.
   */
  async create(payload: Record<string, unknown>): Promise<OwningDepartmentApiRecord> {
    return handleMasterDataApiRequest(
      () => apiClient.post<OwningDepartmentApiRecord>('/OwningDepartment', payload),
      'Create owning department failed'
    );
  },

  /**
   * Updates an existing owning department.
   */
  async update(id: number | string, payload: Record<string, unknown>): Promise<OwningDepartmentApiRecord> {
    return handleMasterDataApiRequest(
      () => apiClient.put<OwningDepartmentApiRecord>(`/OwningDepartment/${id}`, payload),
      'Update owning department failed'
    );
  },

  /**
   * Soft-deletes an owning department by ID.
   */
  async delete(id: number | string): Promise<void> {
    return handleMasterDataApiRequest(
      () => apiClient.delete<void>(`/OwningDepartment/${id}`),
      'Delete owning department failed'
    ) as Promise<void>;
  },
};

// ─── Named exports (kept for backward compatibility with existing imports) ──

/** @deprecated Use owningDepartmentService.getAll() */
export const getOwningDepartments = (params?: OwningDepartmentParams) =>
  owningDepartmentService.getAll(params);

/** @deprecated Use owningDepartmentService.getById() */
export const getOwningDepartmentById = (id: number | string) =>
  owningDepartmentService.getById(id);

/** @deprecated Use owningDepartmentService.create() */
export const createOwningDepartment = (record: MasterDataRecord, userId: number = 0) =>
  owningDepartmentService.create(buildOwningDepartmentCreatePayload(record, userId));

/** @deprecated Use owningDepartmentService.update() */
export const updateOwningDepartment = (id: string | number, record: MasterDataRecord, userId: number = 0) =>
  owningDepartmentService.update(id, buildOwningDepartmentUpdatePayload(record, Number(id), userId));

/** @deprecated Use owningDepartmentService.delete() */
export const deleteOwningDepartment = (id: string | number) =>
  owningDepartmentService.delete(id);

