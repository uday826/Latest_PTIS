import { apiClient } from "@/services/api.service";
import { AssetType, AssetTypeApiRecord, AssetTypeFormModel } from "@/types/asset-type/asset-type.types";
import { PagedResponse } from "@/types/common.types";
import { ApiError } from "@/lib/utils/api";
import { isAssetTypeShape, normalizeAssetType } from "./asset-type-types-guard";
import { buildAssetTypeCreatePayloadFromModel, buildAssetTypeUpdatePayloadFromModel } from "./asset-payload-builders";

import type { AssetTypeParams } from "@/types/asset-type/asset-type.types";

// paginateAndFilterRecords removed as backend now supports filtering natively

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

export const assetTypeService = {
  async getAll(params?: AssetTypeParams): Promise<PagedResponse<AssetType>> {
    const q = new URLSearchParams();
    if (params?.PageNumber) q.set('PageNumber', params.PageNumber.toString());
    if (params?.PageSize) q.set('PageSize', params.PageSize.toString());
    if (params?.SearchTerm) q.set('SearchTerm', params.SearchTerm);
    q.set('IsActive', params?.IsActive ?? 'true');
    if (params?.CategoryId && params.CategoryId > 0) q.set('AssetCategoryId', params.CategoryId.toString());
    if (params?.SortBy) q.set('SortBy', params.SortBy);
    if (params?.SortOrder) q.set('SortOrder', params.SortOrder);

    const queryString = q.toString();
    const res = await apiClient.get<PagedResponse<AssetTypeApiRecord>>(
      queryString ? `/AssetType?${queryString}` : '/AssetType',
      { cache: 'no-store' }
    );

    if (!res.success || !res.data) throw new ApiError(res.statusCode ?? 500, res.error || "Failed to fetch paged asset types", "Get paged types failed");

    const rawData: unknown = res.data;
    const items: unknown[] = Array.isArray(rawData)
      ? rawData
      : (rawData && typeof rawData === 'object' && 'items' in rawData && Array.isArray((rawData as Record<string, unknown>).items))
        ? (rawData as Record<string, unknown>).items as unknown[]
        : [];
    
    const normalized = items.filter(isAssetTypeShape).map(normalizeAssetType);

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

  async getById(id: number | string): Promise<AssetTypeApiRecord> {
    return handleMasterDataApiRequest(
      () => apiClient.get<AssetTypeApiRecord>(`/AssetType/${id}`),
      `Failed to fetch asset type ${id}`
    );
  },

  async create(payload: Record<string, unknown>): Promise<AssetTypeApiRecord> {
    try {
      return await handleMasterDataApiRequest(
        () => apiClient.post<AssetTypeApiRecord>('/AssetType', payload),
        'Create asset type failed'
      );
    } catch (e: any) {
      if (e instanceof ApiError) {
        e.message = e.message + " | Payload: " + JSON.stringify(payload);
        throw e;
      }
      throw new ApiError(500, e.message + " | Payload: " + JSON.stringify(payload), "Create asset type failed");
    }
  },

  async update(id: number | string, payload: Record<string, unknown>): Promise<AssetTypeApiRecord> {
    try {
      return await handleMasterDataApiRequest(
        () => apiClient.put<AssetTypeApiRecord>(`/AssetType/${id}`, payload),
        'Update asset type failed'
      );
    } catch (e: any) {
      if (e instanceof ApiError) {
        e.message = e.message + " | Payload: " + JSON.stringify(payload);
        throw e;
      }
      throw new ApiError(500, e.message + " | Payload: " + JSON.stringify(payload), "Update asset type failed");
    }
  },

  async delete(id: number | string, userId?: number): Promise<void> {
    return handleMasterDataApiRequest(
      () => apiClient.delete<void>(`/AssetType/${id}${userId ? `?userId=${userId}` : ''}`),
      'Delete asset type failed'
    ) as Promise<void>;
  }
};

/** @deprecated Use assetTypeService.getAll() */
export async function getAssetTypesPaged(
  pageNumber: number,
  pageSize: number,
  searchTerm?: string,
  categoryId?: number,
  _sortBy: string = "typeName",
  _sortOrder: "asc" | "desc" = "asc"
): Promise<PagedResponse<AssetType>> {
  return assetTypeService.getAll({ PageNumber: pageNumber, PageSize: pageSize, SearchTerm: searchTerm, CategoryId: categoryId, SortBy: _sortBy, SortOrder: _sortOrder });
}

/** @deprecated Use assetTypeService.create() */
export async function createAssetType(data: AssetTypeFormModel, userId: number): Promise<AssetTypeApiRecord> {
  const payload = buildAssetTypeCreatePayloadFromModel(data, userId);
  return assetTypeService.create(payload);
}

/** @deprecated Use assetTypeService.update() */
export async function updateAssetType(data: AssetTypeFormModel, userId: number): Promise<AssetTypeApiRecord> {
  const payload = buildAssetTypeUpdatePayloadFromModel(data, userId);
  return assetTypeService.update(data.id ?? 0, payload);
}

/** @deprecated Use assetTypeService.delete() */
export async function deleteAssetType(id: number, userId: number): Promise<void> {
  return assetTypeService.delete(id, userId);
}

