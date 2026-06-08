import { ApiError } from "@/lib/utils/api";
import { AssetCategoryFormModel } from "@/types/asset-type/asset-category.types";

/**
 * Validates Asset Category ID
 */
export function validateAssetCategoryId(id: number): boolean {
  return Number.isFinite(id) && id > 0;
}

/**
 * Validates and prepares search term for API request
 */
export function validateAndPrepareSearchTerm(searchTerm?: string): string | undefined {
  if (typeof searchTerm !== "string") return undefined;
  const trimmedSearchTerm = searchTerm.trim();
  if (trimmedSearchTerm.length === 0) return undefined;
  const MAX_SEARCH_TERM_LENGTH = 100;
  return trimmedSearchTerm.slice(0, MAX_SEARCH_TERM_LENGTH);
}

/**
 * Validates form data for create operation
 */
export function validateCreateFormData(data: AssetCategoryFormModel): void {
  if (!data.categoryCode?.trim()) {
    throw new ApiError(400, "Category code is required", "Validation failed");
  }
  if (!data.categoryName?.trim()) {
    throw new ApiError(400, "Category name is required", "Validation failed");
  }
}

/**
 * Validates form data for update operation
 */
export function validateUpdateFormData(data: AssetCategoryFormModel): void {
  if (!data.id || data.id <= 0) {
    throw new ApiError(400, "Valid Category ID is required", "Validation failed");
  }
  validateCreateFormData(data);
}

/**
 * Creates appropriate ApiError based on response status and message
 */
export function createApiError(statusCode?: number, errorMessage?: string, context: string = "Operation failed"): ApiError {
  const errorMsg = errorMessage || "";
  const isDuplicate = errorMsg.toLowerCase().includes("already exists") ||
    errorMsg.toLowerCase().includes("duplicate");

  return new ApiError(
    statusCode ?? (isDuplicate ? 409 : 500),
    errorMessage || context,
    context
  );
}
