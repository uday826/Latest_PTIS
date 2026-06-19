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

  if (formData.isMovableCategory) {
    // Location details are inherited & disabled, so bypass required validation on these
    delete (errors as any).zone;
    delete (errors as any).ward;
    delete (errors as any).mouja;
    delete (errors as any).subzone;
    delete (errors as any).propertyNumber;
    delete (errors as any).department;
    delete (errors as any).fullAddress;
    delete (errors as any).pinCode;
  }

  // Conditionally mandate Total Land Area only for Land Assets
  const isLand =
    formData.category === "Land Assets" ||
    formData.category === "LAND" ||
    (formData as any).categoryId === 2;

  const isBuilding =
    formData.category === "Building Assets" ||
    formData.category === "BUILDING" ||
    (formData as any).categoryId === 1;

  if ((isLand || isBuilding) && (!formData.landArea || String(formData.landArea).trim() === "")) {
    (errors as any).landArea = "Total Area is required.";
  }

  if (isLand) {
    if (!formData.plotNumber || String(formData.plotNumber).trim() === "") {
      (errors as any).plotNumber = "Plot Number is required.";
    }
    if (!formData.typeOfUseId || String(formData.typeOfUseId).trim() === "") {
      (errors as any).typeOfUseId = "Type of Use is required.";
    }
    if (!formData.subTypeOfUseId || String(formData.subTypeOfUseId).trim() === "") {
      (errors as any).subTypeOfUseId = "Sub Type of Use is required.";
    }
    if (!formData.offset || String(formData.offset).trim() === "") {
      (errors as any).offset = "Offset is required.";
    } else {
      const offsetVal = Number(formData.offset);
      if (isNaN(offsetVal) || offsetVal < 0) {
        (errors as any).offset = "Offset must be a valid non-negative number.";
      }
    }
  }

  if (formData.isMovableCategory && !formData.parentBuildingId) {
    (errors as any).parentBuildingId = "Parent Building/Property selection is required.";
  }
  if (formData.isMovableCategory && formData.isRented === "Yes") {
    if (!formData.lessorName || String(formData.lessorName).trim() === "") {
      (errors as any).lessorName = "Lessor Name is required.";
    }
    if (!formData.lessorMobile || String(formData.lessorMobile).trim() === "") {
      (errors as any).lessorMobile = "Lessor Contact Number is required.";
    } else if (!/^[6-9]\d{9}$/.test(String(formData.lessorMobile).trim())) {
      (errors as any).lessorMobile = "Contact Number must be a valid 10-digit mobile number starting with 6, 7, 8, or 9.";
    }
    if (formData.lessorEmail && String(formData.lessorEmail).trim() !== "") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(formData.lessorEmail).trim())) {
        (errors as any).lessorEmail = "Please enter a valid email address.";
      }
    }
    if (!formData.leaseStartDate || String(formData.leaseStartDate).trim() === "") {
      (errors as any).leaseStartDate = "Lease Start Date is required.";
    }
    if (!formData.leaseAmount || String(formData.leaseAmount).trim() === "") {
      (errors as any).leaseAmount = "Monthly Lease Amount is required.";
    } else {
      const amt = Number(formData.leaseAmount);
      if (isNaN(amt) || amt <= 0) {
        (errors as any).leaseAmount = "Monthly Lease Amount must be a valid positive number.";
      }
    }
    if (formData.securityDeposit && String(formData.securityDeposit).trim() !== "") {
      const dep = Number(formData.securityDeposit);
      if (isNaN(dep) || dep < 0) {
        (errors as any).securityDeposit = "Security Deposit must be a valid non-negative number.";
      }
    }
    if (formData.leaseStartDate && formData.leaseEndDate && String(formData.leaseEndDate).trim() !== "") {
      const start = new Date(formData.leaseStartDate);
      const end = new Date(formData.leaseEndDate);
      if (end < start) {
        (errors as any).leaseEndDate = "Lease End Date cannot be before Lease Start Date.";
      }
    }
  }
  if ((isLand || isBuilding) && (!(formData as any).length || String((formData as any).length).trim() === "")) {
    (errors as any).length = "Length is required.";
  }
  if ((isLand || isBuilding) && (!(formData as any).width || String((formData as any).width).trim() === "")) {
    (errors as any).width = "Width is required.";
  }

  // Latitude and Longitude validation
  if (formData.latitude) {
    const latStr = String(formData.latitude).trim();
    if (!/^-?\d*(\.\d+)?$/.test(latStr) || isNaN(Number(latStr))) {
      (errors as any).latitude = "Latitude must be a valid number.";
    }
  }
  if (formData.longitude) {
    const lngStr = String(formData.longitude).trim();
    if (!/^-?\d*(\.\d+)?$/.test(lngStr) || isNaN(Number(lngStr))) {
      (errors as any).longitude = "Longitude must be a valid number.";
    }
  }

  // Length constraints matching backend validation
  if (formData.assetName && String(formData.assetName).length > 250) {
    (errors as any).assetName = "Asset Name cannot exceed 250 characters.";
  }
  if ((formData as any).assetNameLocal && String((formData as any).assetNameLocal).length > 250) {
    (errors as any).assetNameLocal = "Local Name cannot exceed 250 characters.";
  }
  if (formData.inChargeName && String(formData.inChargeName).length > 200) {
    (errors as any).inChargeName = "In Charge Name cannot exceed 200 characters.";
  }
  if (formData.inChargeDesignation && String(formData.inChargeDesignation).length > 100) {
    (errors as any).inChargeDesignation = "Designation cannot exceed 100 characters.";
  }
  if (formData.inChargeEmail && String(formData.inChargeEmail).length > 100) {
    (errors as any).inChargeEmail = "Email cannot exceed 100 characters.";
  }
  if (formData.fullAddress && String(formData.fullAddress).length > 500) {
    (errors as any).fullAddress = "Address cannot exceed 500 characters.";
  }
  if (formData.locality && String(formData.locality).length > 200) {
    (errors as any).locality = "Landmark cannot exceed 200 characters.";
  }
  if (formData.propertyNumber && String(formData.propertyNumber).length > 100) {
    (errors as any).propertyNumber = "Property No cannot exceed 100 characters.";
  }
  if (formData.surveyNumber && String(formData.surveyNumber).length > 30) {
    (errors as any).surveyNumber = "CSN No cannot exceed 30 characters.";
  }
  if ((formData as any).partitionNo && String((formData as any).partitionNo).length > 30) {
    (errors as any).partitionNo = "Partition No cannot exceed 30 characters.";
  }
  if ((formData as any).upicId && String((formData as any).upicId).length > 30) {
    (errors as any).upicId = "UPIC ID cannot exceed 30 characters.";
  }
  if ((formData as any).plotNumber && String((formData as any).plotNumber).length > 30) {
    (errors as any).plotNumber = "Plot Number cannot exceed 30 characters.";
  }
  if ((formData as any).length && String((formData as any).length).length > 10) {
    (errors as any).length = "Length value is too large.";
  }
  if ((formData as any).width && String((formData as any).width).length > 10) {
    (errors as any).width = "Width value is too large.";
  }
  if ((formData as any).offset && String((formData as any).offset).length > 10) {
    (errors as any).offset = "Offset value is too large.";
  }
  if (formData.inChargeMobile && String(formData.inChargeMobile).trim() !== "") {
    if (!/^[6-9]\d{9}$/.test(String(formData.inChargeMobile).trim())) {
      (errors as any).inChargeMobile = "Contact Number must be a valid 10-digit mobile number starting with 6, 7, 8, or 9.";
    }
  }
  if (formData.pinCode && String(formData.pinCode).trim() !== "") {
    if (!/^\d{6}$/.test(String(formData.pinCode).trim())) {
      (errors as any).pinCode = "Pin Code must be exactly 6 digits.";
    }
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

