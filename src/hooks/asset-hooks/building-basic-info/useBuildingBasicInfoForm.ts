/**
 * useBuildingBasicInfoForm.ts — orchestrator hook
 *
 * Owns all Next.js hooks (useTranslations, useRouter, useAssetForm context).
 * Sub-hooks receive these as parameters so they stay independently testable.
 */
"use client";

import { useCallback, useEffect } from "react";
import { useAssetForm } from "@/components/modules/assets/municipal-Asset/add-New-Asset/AssetFormContext";
import { useBuildingBasicInfoFormState } from "./useBuildingBasicInfoFormState";
import { useBuildingBasicInfoFormValidation } from "./useBuildingBasicInfoFormValidation";
import type {
  BuildingBasicInfoFormData,
  BuildingBasicInfoFormErrors,
} from "@/types/asset-types/basic-info/buildBasicInfo.types";

export interface UseBuildingBasicInfoFormReturn {
  // ── State ──────────────────────────────────────────────────────────────────
  formData: BuildingBasicInfoFormData;
  errors: BuildingBasicInfoFormErrors;
  touched: Partial<Record<keyof BuildingBasicInfoFormData, boolean>>;
  // ── Status ─────────────────────────────────────────────────────────────────
  isValid: boolean;
  // ── Handlers ───────────────────────────────────────────────────────────────
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleBlur: (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleAttributeChange: (
    name: string,
    value: string | number | boolean
  ) => void;
  handleSubmitStep: () => boolean;
  showError: (field: keyof BuildingBasicInfoFormData) => boolean;
  updateFormData: (patch: Partial<BuildingBasicInfoFormData>) => void;
}

export function useBuildingBasicInfoForm(): UseBuildingBasicInfoFormReturn {
  // Sync initial values from the shared AssetFormContext so the building form
  // stays in-step with the wizard stepper's data.
  const { 
    formData: contextData, 
    updateFormData: syncContext,
    submittedOnce: contextSubmittedOnce,
    setSubmittedOnce: setContextSubmittedOnce
  } = useAssetForm();

  const stateBag = useBuildingBasicInfoFormState({
    id: contextData.id || 0,
    assetId: contextData.assetId || 0,
    category: contextData.category || "Building Assets",
    assetType: contextData.assetType || "",
    zone: contextData.zone || "",
    subzone: (contextData as any).subzone || "",
    ward: contextData.ward || "",
    mouja: (contextData as any).mouja || "",
    propertyNumber: contextData.propertyNumber || "",
    surveyNumber: contextData.surveyNumber || "",
    length: (contextData as any).length || "",
    width: (contextData as any).width || "",
    assetName: contextData.assetName || "",
    department: contextData.department || "",
    fullAddress: contextData.fullAddress || "",
    locality: contextData.locality || "",
    pinCode: contextData.pinCode || "",
    ownershipType: contextData.ownershipType || "",
    operationalControl: contextData.operationalControl || "",
    inChargeName: contextData.inChargeName || "",
    inChargeDesignation: contextData.inChargeDesignation || "",
    inChargeMobile: contextData.inChargeMobile || "",
    inChargeEmail: contextData.inChargeEmail || "",
    attributes: (contextData.attributes as Record<
      string,
      string | number | boolean
    >) || {},
    categoryId: Number(contextData.categoryId) || 0,
    typeId: Number(contextData.typeId) || 0,
    latitude: contextData.latitude || "",
    longitude: contextData.longitude || "",
    zoneId: contextData.zoneId || "",
    wardId: contextData.wardId || "",
    departmentId: contextData.departmentId || "",
    status: contextData.status || "Active",
    condition: contextData.condition || "Good",
    assetCode: contextData.assetCode || "",
  });

  const {
    formData,
    touched,
    submittedOnce: localSubmittedOnce,
    setErrors,
    setSubmittedOnce: setLocalSubmittedOnce,
    handleChange: baseHandleChange,
    handleAttributeChange: baseHandleAttributeChange,
    handleBlur,
    updateFormData: baseUpdateFormData,
  } = stateBag;

  const submittedOnce = contextSubmittedOnce !== undefined ? contextSubmittedOnce : localSubmittedOnce;
  const setSubmittedOnce = setContextSubmittedOnce || setLocalSubmittedOnce;

  const { errors, isValid, showError, validate } =
    useBuildingBasicInfoFormValidation({ formData, touched, submittedOnce });

  // Sync category and type from context if they change after mount
  useEffect(() => {
    baseUpdateFormData({
      category: contextData.category || "Building Assets",
      assetType: contextData.assetType || "",
      categoryId: Number(contextData.categoryId) || 0,
      typeId: Number(contextData.typeId) || 0,
      length: (contextData as any).length || "",
      width: (contextData as any).width || "",
      landArea: contextData.landArea || "",
    });
  }, [
    contextData.category, 
    contextData.assetType, 
    contextData.categoryId, 
    contextData.typeId, 
    (contextData as any).length,
    (contextData as any).width,
    contextData.landArea,
    baseUpdateFormData
  ]);

  // Keep the shared context in sync so other wizard steps see updated values
  const handleUpdateFormData = useCallback(
    (patch: Partial<BuildingBasicInfoFormData>) => {
      baseUpdateFormData(patch);
      syncContext(patch);
    },
    [baseUpdateFormData, syncContext]
  );

  // Auto-calculate land area if length and width change
  useEffect(() => {
    const isLand = formData.valuationType
      ? formData.valuationType === "LAND"
      : formData.category?.toLowerCase().includes("land");

    if (isLand) {
      const lenVal = parseFloat((formData as any).length || "0");
      const widthVal = parseFloat((formData as any).width || "0");
      if (lenVal > 0 && widthVal > 0) {
        const calculatedArea = (lenVal * widthVal).toFixed(2);
        if (formData.landArea !== calculatedArea) {
          handleUpdateFormData({ landArea: calculatedArea });
        }
      }
    }
  }, [formData.length, formData.width, formData.valuationType, formData.category, formData.landArea, handleUpdateFormData]);

  // Keep the shared context in sync so other wizard steps see updated values
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      baseHandleChange(e);
      syncContext({ [e.target.name]: e.target.value });
    },
    [baseHandleChange, syncContext]
  );

  const handleAttributeChange = useCallback(
    (name: string, value: string | number | boolean) => {
      baseHandleAttributeChange(name, value);
      syncContext({
        attributes: { ...formData.attributes, [name]: value },
      });
    },
    [baseHandleAttributeChange, syncContext, formData.attributes]
  );

  /**
   * Called by the "Next" button on the step.
   * Returns true if the form is valid so the stepper can advance.
   */
  const handleSubmitStep = useCallback((): boolean => {
    setSubmittedOnce(true);
    const currentErrors = validate();
    setErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  }, [validate, setErrors, setSubmittedOnce]);

  return {
    formData,
    errors,
    touched,
    isValid,
    handleChange,
    handleBlur,
    handleAttributeChange,
    handleSubmitStep,
    showError,
    updateFormData: handleUpdateFormData,
  };
}
