import { useMemo, useCallback } from "react";
import type {
  BuildingBasicInfoFormData,
  BuildingBasicInfoFormErrors,
} from "@/types/asset-types/basic-info/buildBasicInfo.types";
import { buildingBasicInfoSchema } from "@/utils/asset-utils/basic-info/basic-info-validation-schemas";
import { validateForm } from "@/utils/asset-utils/basic-info/basic-info-validation-helpers";

// ─── Pure validation function ─────────────────────────────────────────────────

/**
 * Returns a map of field → error message.
 * An empty object means the form is valid.
 * This is a plain function so it can be called in tests without React.
 */
export function validateBuildingBasicInfo(
  formData: BuildingBasicInfoFormData
): BuildingBasicInfoFormErrors {
  const errors = validateForm(formData, buildingBasicInfoSchema) as BuildingBasicInfoFormErrors;

  // Conditionally mandate Total Land Area only for Land Assets
  const isLand =
    formData.category === "Land Assets" ||
    formData.category === "LAND" ||
    (formData as any).categoryId === 2;

  if (isLand && (!formData.landArea || String(formData.landArea).trim() === "")) {
    (errors as any).landArea = "Total Land Area is required.";
  }
  if (isLand && (!(formData as any).length || String((formData as any).length).trim() === "")) {
    (errors as any).length = "Length is required.";
  }
  if (isLand && (!(formData as any).width || String((formData as any).width).trim() === "")) {
    (errors as any).width = "Width is required.";
  }

  return errors;
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

export interface BuildingBasicInfoFormValidationReturn {
  errors: BuildingBasicInfoFormErrors;
  isValid: boolean;
  /** Returns true if the error for `field` should currently be displayed */
  showError: (field: keyof BuildingBasicInfoFormData) => boolean;
  /** Run validation imperatively and return the error map */
  validate: () => BuildingBasicInfoFormErrors;
}

interface UseBuildingBasicInfoFormValidationArgs {
  formData: BuildingBasicInfoFormData;
  touched: Partial<Record<keyof BuildingBasicInfoFormData, boolean>>;
  submittedOnce: boolean;
}

export function useBuildingBasicInfoFormValidation({
  formData,
  touched,
  submittedOnce,
}: UseBuildingBasicInfoFormValidationArgs): BuildingBasicInfoFormValidationReturn {
  const errors = useMemo(
    () => validateBuildingBasicInfo(formData),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [formData]
  );

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  const showError = useCallback(
    (field: keyof BuildingBasicInfoFormData): boolean =>
      Boolean((submittedOnce || touched[field]) && errors[field]),
    [submittedOnce, touched, errors]
  );

  const validate = useCallback(
    () => validateBuildingBasicInfo(formData),
    [formData]
  );

  return { errors, isValid, showError, validate };
}

