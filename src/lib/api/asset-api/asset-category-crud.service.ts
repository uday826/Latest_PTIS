import { apiClient } from "@/services/api.service";
import { AssetCategory, AssetCategoryFormModel, AssetCategoryApiRecord } from "@/types/asset-type/asset-category.types";
import { PagedResponse } from "@/types/common.types";
import { ApiError } from "@/lib/utils/api";
import { isAssetCategoryShape, normalizeAssetCategory } from "./asset-category-types-guard";
import {
  validateAssetCategoryId, validateAndPrepareSearchTerm, validateCreateFormData,
  validateUpdateFormData, createApiError,
} from "./asset-category-validation";

/** Fetches paginated asset categories from the API */
export async function getAssetCategoriesPaged(
  pageNumber: number,
  pageSize: number,
  searchTerm?: string
): Promise<PagedResponse<AssetCategory>> {
  try {
    const params = new URLSearchParams({
      PageNumber: pageNumber.toString(),
      PageSize: pageSize.toString(),
      MarkedForDeletion: "false",
    });

    const safeSearchTerm = validateAndPrepareSearchTerm(searchTerm);
    if (safeSearchTerm) params.append("SearchTerm", safeSearchTerm);

    const res = await apiClient.get<PagedResponse<AssetCategoryApiRecord>>(`/AssetCategory?${params}`);
    if (!res.success || !res.data) throw new ApiError(res.statusCode ?? 500, res.error || "Failed to fetch paged asset categories", "Get paged categories failed");

    const rawData: unknown = res.data;
    const items: unknown[] = Array.isArray(rawData)
      ? rawData
      : (rawData && typeof rawData === 'object' && 'items' in rawData && Array.isArray((rawData as Record<string, unknown>).items))
        ? (rawData as Record<string, unknown>).items as unknown[]
        : [];
    const normalized = items
      .filter(isAssetCategoryShape)
      .filter((item) => {
        const marked = item['markedForDeletion'] ?? item['MarkedForDeletion'];
        return marked !== true && marked !== 1 && marked !== "true" && marked !== "1";
      })
      .map(item => normalizeAssetCategory(item));

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
    console.error("Error in getAssetCategoriesPaged:", err);
    return { items: [], totalCount: 0, totalPages: 1, pageNumber, pageSize, hasPrevious: false, hasNext: false };
  }
}

/** Creates a new asset category */
export async function createAssetCategory(data: AssetCategoryFormModel, userId: number): Promise<AssetCategory> {
  validateCreateFormData(data);
  const payload = {
    categoryCode: data.categoryCode.trim(),
    categoryName: data.categoryName.trim(),
    description: data.description?.trim() || "",
    isActive: data.isActive,
    createdBy: userId,
    codeFormat: "1"
  };

  const res = await apiClient.post<{ items: AssetCategoryApiRecord; success: boolean; message: string }>("/AssetCategory", payload);
  if (!res.success || !res.data?.success) throw createApiError(res.statusCode, res.error || res.data?.message || "Create asset category failed", "Create asset category failed");
  if (!res.data?.items) throw new ApiError(500, "No data received from server", "Create asset category failed");
  return normalizeAssetCategory(res.data.items as unknown as Record<string, unknown>);
}

/** Updates an existing asset category */
export async function updateAssetCategory(data: AssetCategoryFormModel, userId: number): Promise<AssetCategory> {
  validateUpdateFormData(data);
  const payload = {
    categoryId: data.id,
    categoryCode: data.categoryCode.trim(),
    categoryName: data.categoryName.trim(),
    description: data.description?.trim() || "",
    isActive: data.isActive,
    updatedBy: userId,
    codeFormat: "1"
  };

  const res = await apiClient.put<{ items: AssetCategoryApiRecord; success: boolean; message: string }>(`/AssetCategory/${data.id}`, payload);
  if (!res.success || !res.data?.success) throw createApiError(res.statusCode, res.error || res.data?.message || "Update asset category failed", "Update asset category failed");
  if (!res.data?.items) throw new ApiError(500, "No data received from server", "Update asset category failed");
  return normalizeAssetCategory(res.data.items as unknown as Record<string, unknown>);
}

/** Deletes an asset category by ID */
export async function deleteAssetCategory(id: number, userId: number): Promise<void> {
  if (!validateAssetCategoryId(id)) throw new ApiError(400, "Valid Category ID is required", "Validation failed");
  const res = await apiClient.delete<void>(`/AssetCategory/${id}?userId=${userId}`);
  if (!res.success) throw createApiError(res.statusCode, res.error, `Delete asset category ${id} failed`);
}
