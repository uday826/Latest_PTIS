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

/**
 * Validates the entire Asset Category form, separating rules from the component/hook.
 */
export function validateAssetCategoryForm(
  formData: { code?: string; name?: string; description?: string; valuationType?: string; [key: string]: unknown },
  existingCodes: string[] = [],
  existingNames: string[] = [],
  editDataId?: string,
  editDataName?: string
): Record<string, string> {
  const errors: Record<string, string> = {};

  const code = formData.code?.trim() || "";
  if (!code) errors.code = "errors.codeRequired";
  else if (code.length > 15) errors.code = "errors.codeTooLong15";
  else if (!/^[\p{L}\p{N}_-]+$/u.test(code)) errors.code = "errors.codeInvalidChars";
  else if (existingCodes.some(c => c.toLowerCase() === code.toLowerCase() && c.toLowerCase() !== editDataId?.toLowerCase())) {
    errors.code = "errors.codeDuplicate";
  }

  const name = formData.name?.trim() || "";
  if (!name) errors.name = "errors.nameRequired";
  else if (name.length > 50) errors.name = "errors.nameTooLong50";
  else if (!/^[\p{L}\p{N}\s_-]+$/u.test(name)) errors.name = "errors.nameInvalidChars";
  else if (existingNames.some(n => n.toLowerCase() === name.toLowerCase() && n.toLowerCase() !== editDataName?.toLowerCase())) {
    errors.name = "errors.nameDuplicate";
  }

  const desc = formData.description?.trim() || "";
  if (desc.length > 500) errors.description = "errors.descriptionTooLong";
  else if (desc && !/^[\p{L}\p{N}\s_-]+$/u.test(desc)) errors.description = "errors.descInvalidChars";

  const valType = formData.valuationType?.trim() || "";
  if (valType && !/^[\p{L}\p{N}\s_-]+$/u.test(valType)) errors.valuationType = "errors.valuationTypeInvalidChars";

  return errors;
}
