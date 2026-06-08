import { apiClient } from "@/services/api.service";
import { AssetType, AssetTypeFormModel, AssetTypeApiRecord } from "@/types/asset-type/asset-type.types";
import { PagedResponse } from "@/types/common.types";
import { ApiError } from "@/lib/utils/api";
import { isAssetTypeShape, normalizeAssetType } from "./asset-type-types-guard";
import {
  validateAssetTypeId, validateAndPrepareSearchTerm, validateCreateFormData,
  validateUpdateFormData, createApiError,
} from "./asset-type-validation";

/** Fetches paginated asset types from the API */
export async function getAssetTypesPaged(
  pageNumber: number,
  pageSize: number,
  searchTerm?: string,
  categoryId?: number,
  sortBy: string = "typeName",
  sortOrder: "asc" | "desc" = "asc"
): Promise<PagedResponse<AssetType>> {
  try {
    const isCategoryFiltered = categoryId && categoryId > 0;
    const safeSearchTerm = validateAndPrepareSearchTerm(searchTerm);
    const isClientFiltered = isCategoryFiltered || !!safeSearchTerm;

    const params = new URLSearchParams({
      PageNumber: isClientFiltered ? "1" : pageNumber.toString(),
      PageSize: isClientFiltered ? "1000" : pageSize.toString(),
      SortBy: sortBy,
      SortOrder: sortOrder,
      MarkedForDeletion: "false",
    });

    if (categoryId && categoryId > 0) {
      params.append("CategoryId", categoryId.toString());
    }

    if (safeSearchTerm) {
      params.append("SearchTerm", safeSearchTerm);
    }

    const res = await apiClient.get<PagedResponse<AssetTypeApiRecord>>(`/AssetType?${params}`);
    if (!res.success || !res.data) throw new ApiError(res.statusCode ?? 500, res.error || "Failed to fetch paged asset types", "Get paged types failed");

    const rawData: unknown = res.data;
    const items: unknown[] = Array.isArray(rawData)
      ? rawData
      : (rawData && typeof rawData === 'object' && 'items' in rawData && Array.isArray((rawData as Record<string, unknown>).items))
        ? (rawData as Record<string, unknown>).items as unknown[]
        : [];
    let normalized = items
      .filter(isAssetTypeShape)
      .filter((item) => {
        const marked = item['markedForDeletion'] ?? item['MarkedForDeletion'];
        return marked !== true && marked !== 1 && marked !== "true" && marked !== "1";
      })
      .map(item => normalizeAssetType(item));

    // Client-side category filtering since backend has CategoryId commented out in AssetTypeQueryParameters
    if (isCategoryFiltered) {
      normalized = normalized.filter(item => item.categoryId === categoryId);
    }

    // Client-side search filtering safeguard
    if (safeSearchTerm) {
      const search = safeSearchTerm.toLowerCase();
      normalized = normalized.filter(item => 
        item.typeName.toLowerCase().includes(search) || 
        item.typeCode.toLowerCase().includes(search)
      );
    }

    if (isClientFiltered) {
      const totalCount = normalized.length;
      const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
      const start = (pageNumber - 1) * pageSize;
      const sliced = normalized.slice(start, start + pageSize);

      return {
        items: sliced,
        totalCount,
        totalPages,
        pageNumber,
        pageSize,
        hasPrevious: pageNumber > 1,
        hasNext: pageNumber < totalPages
      };
    }

    return {
      items: normalized,
      totalCount: res.data.totalCount ?? normalized.length,
      totalPages: res.data.totalPages ?? 1,
      pageNumber: res.data.pageNumber ?? pageNumber,
      pageSize: res.data.pageSize ?? pageSize,
      hasPrevious: res.data.hasPrevious ?? (pageNumber > 1),
      hasNext: res.data.hasNext ?? (pageNumber < (res.data.totalPages ?? 1))
    };
  } catch (err) {
    console.error("Error in getAssetTypesPaged:", err);
    return { items: [], totalCount: 0, totalPages: 1, pageNumber, pageSize, hasPrevious: false, hasNext: false };
  }
}

/** Creates a new asset type */
export async function createAssetType(data: AssetTypeFormModel, userId: number): Promise<AssetType> {
  validateCreateFormData(data);
  const payload = {
    typeCode: data.typeCode.trim(),
    typeName: data.typeName.trim(),
    categoryId: data.categoryId,
    description: data.description?.trim() || "",
    isActive: data.isActive,
    createdBy: userId,
    codeFormat: "1"
  };

  const res = await apiClient.post<{ items: AssetTypeApiRecord; success: boolean; message: string }>("/AssetType", payload);
  if (!res.success || !res.data?.success) throw createApiError(res.statusCode, res.error || res.data?.message || "Create asset type failed", "Create asset type failed");
  if (!res.data?.items) throw new ApiError(500, "No data received from server", "Create asset type failed");
  return normalizeAssetType(res.data.items as unknown as Record<string, unknown>);
}

/** Updates an existing asset type */
export async function updateAssetType(data: AssetTypeFormModel, userId: number): Promise<AssetType> {
  validateUpdateFormData(data);
  const payload = {
    assetTypeId: data.id,
    typeCode: data.typeCode.trim(),
    typeName: data.typeName.trim(),
    categoryId: data.categoryId,
    description: data.description?.trim() || "",
    isActive: data.isActive,
    updatedBy: userId,
    codeFormat: "1"
  };

  const res = await apiClient.put<{ items: AssetTypeApiRecord; success: boolean; message: string }>(`/AssetType/${data.id}`, payload);
  if (!res.success || !res.data?.success) throw createApiError(res.statusCode, res.error || res.data?.message || "Update asset type failed", "Update asset type failed");
  if (!res.data?.items) throw new ApiError(500, "No data received from server", "Update asset type failed");
  return normalizeAssetType(res.data.items as unknown as Record<string, unknown>);
}

/** Deletes an asset type by ID */
export async function deleteAssetType(id: number, userId: number): Promise<void> {
  if (!validateAssetTypeId(id)) throw new ApiError(400, "Valid Asset Type ID is required", "Validation failed");
  const res = await apiClient.delete<void>(`/AssetType/${id}?userId=${userId}`);
  if (!res.success) throw createApiError(res.statusCode, res.error, `Delete asset type ${id} failed`);
}
