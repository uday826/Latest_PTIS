import { apiClient } from "@/services/api.service";
import { AssetCategory, AssetCategoryApiRecord, AssetCategoryFormModel } from "@/types/asset-type/asset-category.types";
import { PagedResponse } from "@/types/common.types";
import { ApiError } from "@/lib/utils/api";
import { isAssetCategoryShape, normalizeAssetCategory } from "./asset-category-types-guard";
import { buildAssetCategoryCreatePayloadFromModel, buildAssetCategoryUpdatePayloadFromModel } from "./asset-payload-builders";

import type { AssetCategoryParams } from "@/types/asset-type/asset-category.types";

async function handleMasterDataApiRequest<T>(
  requestFn: () => Promise<{ success: boolean; data?: T; statusCode?: number; error?: string }>,
  defaultErrorMessage = 'Operation failed'
): Promise<T> {
  try {
    const res = await requestFn();
    if (!res.success || !res.data) {
      const msg = res.error ?? '';
      const isDuplicate = msg.toLowerCase().includes('already exists') || msg.toLowerCase().includes('duplicate');
      throw new ApiError(res.statusCode ?? (isDuplicate ? 409 : 500), msg || defaultErrorMessage, msg || defaultErrorMessage);
    }
    return res.data as T;
  } catch (error) {
    throw error;
  }
}

export const assetCategoryService = {
  async getAll(params?: AssetCategoryParams): Promise<PagedResponse<AssetCategory>> {
    const q = new URLSearchParams();
    if (params?.PageNumber) q.set('PageNumber', params.PageNumber.toString());
    if (params?.PageSize) q.set('PageSize', params.PageSize.toString());
    if (params?.SearchTerm) q.set('SearchTerm', params.SearchTerm);
    q.set('IsActive', params?.IsActive ?? 'true');
    if (params?.SortBy) q.set('SortBy', params.SortBy);
    if (params?.SortOrder) q.set('SortOrder', params.SortOrder);

    const queryString = q.toString();
    const res = await apiClient.get<PagedResponse<AssetCategoryApiRecord>>(
      queryString ? `/AssetCategory?${queryString}` : '/AssetCategory',
      { cache: 'no-store' }
    );

    if (!res.success || !res.data) throw new ApiError(res.statusCode ?? 500, res.error || "Failed to fetch paged asset categories", "Get paged categories failed");

    const rawData: unknown = res.data;
    const items: unknown[] = Array.isArray(rawData)
      ? rawData
      : (rawData && typeof rawData === 'object' && 'items' in rawData && Array.isArray((rawData as Record<string, unknown>).items))
        ? (rawData as Record<string, unknown>).items as unknown[]
        : [];
    
    const normalized = items.filter(isAssetCategoryShape).map(normalizeAssetCategory);

    return {
      items: normalized,
      totalCount: res.data.totalCount ?? normalized.length,
      totalPages: res.data.totalPages ?? 1,
      pageNumber: res.data.pageNumber ?? (params?.PageNumber || 1),
      pageSize: res.data.pageSize ?? (params?.PageSize || 10),
      hasPrevious: res.data.hasPrevious ?? ((params?.PageNumber || 1) > 1),
      hasNext: res.data.hasNext ?? ((params?.PageNumber || 1) < (res.data.totalPages ?? 1))
    };
  },

  async getById(id: number | string): Promise<AssetCategoryApiRecord> {
    return handleMasterDataApiRequest(
      () => apiClient.get<AssetCategoryApiRecord>(`/AssetCategory/${id}`),
      `Failed to fetch asset category ${id}`
    );
  },

  async create(payload: Record<string, unknown>): Promise<AssetCategoryApiRecord> {
    return handleMasterDataApiRequest(
      () => apiClient.post<AssetCategoryApiRecord>('/AssetCategory', payload),
      'Create asset category failed'
    );
  },

  async update(id: number | string, payload: Record<string, unknown>): Promise<AssetCategoryApiRecord> {
    return handleMasterDataApiRequest(
      () => apiClient.put<AssetCategoryApiRecord>(`/AssetCategory/${id}`, payload),
      'Update asset category failed'
    );
  },

  async delete(id: number | string, userId?: number): Promise<void> {
    return handleMasterDataApiRequest(
      () => apiClient.delete<void>(`/AssetCategory/${id}${userId ? `?userId=${userId}` : ''}`),
      'Delete asset category failed'
    ) as Promise<void>;
  }
};

/** @deprecated Use assetCategoryService.getAll() */
export async function getAssetCategoriesPaged(
  pageNumber: number,
  pageSize: number,
  searchTerm?: string
): Promise<PagedResponse<AssetCategory>> {
  return assetCategoryService.getAll({ PageNumber: pageNumber, PageSize: pageSize, SearchTerm: searchTerm });
}

/** @deprecated Use assetCategoryService.create() */
export async function createAssetCategory(data: AssetCategoryFormModel, userId: number): Promise<AssetCategoryApiRecord> {
  const payload = buildAssetCategoryCreatePayloadFromModel(data, userId);
  return assetCategoryService.create(payload);
}

/** @deprecated Use assetCategoryService.update() */
export async function updateAssetCategory(data: AssetCategoryFormModel, userId: number): Promise<AssetCategoryApiRecord> {
  const payload = buildAssetCategoryUpdatePayloadFromModel(data, userId);
  return assetCategoryService.update(data.id ?? 0, payload);
}

/** @deprecated Use assetCategoryService.delete() */
export async function deleteAssetCategory(id: number, userId: number): Promise<void> {
  return assetCategoryService.delete(id, userId);
}

