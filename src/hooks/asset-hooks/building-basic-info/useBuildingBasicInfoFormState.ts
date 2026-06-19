import { useState, useCallback, useEffect } from "react";
import type {
  BuildingBasicInfoFormData,
  BuildingBasicInfoFormErrors,
} from "@/types/asset-types/basic-info/buildBasicInfo.types";
import { INITIAL_BUILDING_BASIC_INFO } from "@/types/asset-types/basic-info/buildBasicInfo.types";

export interface BuildingBasicInfoFormStateReturn {
  formData: BuildingBasicInfoFormData;
  errors: BuildingBasicInfoFormErrors;
  touched: Partial<Record<keyof BuildingBasicInfoFormData, boolean>>;
  submittedOnce: boolean;
  setErrors: React.Dispatch<React.SetStateAction<BuildingBasicInfoFormErrors>>;
  setSubmittedOnce: React.Dispatch<React.SetStateAction<boolean>>;
  updateFormData: (patch: Partial<BuildingBasicInfoFormData>) => void;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleAttributeChange: (
    name: string,
    value: string | number | boolean
  ) => void;
  handleBlur: (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  resetForm: () => void;
}

export function sanitizeBasicInfoField(name: string, value: string): string {
  // Sanitize: 1. No leading spaces. 2. Numeric only for contact/pin fields.
  let sanitizedValue = value.replace(/^\s+/, "");
  const lowerName = name.toLowerCase();
  if (
    lowerName.includes("mobile") ||
    lowerName.includes("pincode") ||
    lowerName.includes("phone") ||
    lowerName.includes("contact")
  ) {
    sanitizedValue = sanitizedValue.replace(/\D/g, "");
  }

  // 3. Special character restrictions for specific text fields
  if (name === "inChargeName" || name === "surveyedBy") {
    sanitizedValue = sanitizedValue.replace(/[^a-zA-Z\s.]/g, "");
  } else if (name === "inChargeDesignation") {
    sanitizedValue = sanitizedValue.replace(/[^a-zA-Z\s-]/g, "");
  } else if (name === "assetName") {
    sanitizedValue = sanitizedValue.replace(/[^a-zA-Z0-9\s-_]/g, "");
  } else if (name === "locality" || name === "landmark") {
    sanitizedValue = sanitizedValue.replace(/[^a-zA-Z0-9\s,./-]/g, "");
  } else if (name === "fullAddress") {
    sanitizedValue = sanitizedValue.replace(/[^a-zA-Z0-9\s,./#\-()]/g, "");
  }

  // 4. Added new validations requested by the user
  if (name === "assetCode" || name === "assetNo") {
    sanitizedValue = sanitizedValue.replace(/[^a-zA-Z0-9\-_/]/g, "");
  } else if (name === "propertyNumber") {
    sanitizedValue = sanitizedValue.replace(/[^a-zA-Z0-9\-/]/g, "");
  } else if (name === "plotNumber") {
    sanitizedValue = sanitizedValue.replace(/[^a-zA-Z0-9\-_/.\s]/g, "");
  } else if (lowerName.includes("email")) {
    sanitizedValue = sanitizedValue.replace(/\s/g, "");
  } else if (name === "latitude" || name === "longitude") {
    sanitizedValue = sanitizedValue.replace(/[^0-9.\-]/g, "");
    const parts = sanitizedValue.split(".");
    if (parts.length > 2) {
      sanitizedValue = parts[0] + "." + parts.slice(1).join("");
    }
    if (sanitizedValue.includes("-")) {
      sanitizedValue = (sanitizedValue.startsWith("-") ? "-" : "") + sanitizedValue.replace(/-/g, "");
    }
  } else if (
    lowerName.includes("value") ||
    lowerName.includes("rate") ||
    lowerName.includes("cost") ||
    lowerName.includes("price") ||
    lowerName.includes("valuation") ||
    lowerName.includes("offset") ||
    name === "length" ||
    name === "width"
  ) {
    sanitizedValue = sanitizedValue.replace(/[^0-9.]/g, "");
    const parts = sanitizedValue.split(".");
    if (parts.length > 2) {
      sanitizedValue = parts[0] + "." + parts.slice(1).join("");
    }
  }

  const isTitleCased = name === "assetName" || name === "inChargeName" || name === "inChargeDesignation";
  if (isTitleCased) {
    sanitizedValue = sanitizedValue.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  return sanitizedValue;
}

/**
 * Manages local state for the Building Basic Info form.
 * No Next.js hooks (router, translations) live here — those belong in the
 * orchestrator hook so this hook remains unit-testable in isolation.
 */
export function useBuildingBasicInfoFormState(
  initialOverrides?: Partial<BuildingBasicInfoFormData>
): BuildingBasicInfoFormStateReturn {
  const [formData, setFormData] = useState<BuildingBasicInfoFormData>({
    ...INITIAL_BUILDING_BASIC_INFO,
    ...initialOverrides,
  });

  const [errors, setErrors] = useState<BuildingBasicInfoFormErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof BuildingBasicInfoFormData, boolean>>
  >({});
  const [submittedOnce, setSubmittedOnce] = useState(false);

  // Sync changes from parent context/initialOverrides (like generated ID or assetCode after successful save)
  useEffect(() => {
    if (initialOverrides) {
      setFormData((prev) => {
        let changed = false;
        const next = { ...prev };
        for (const key in initialOverrides) {
          if (Object.prototype.hasOwnProperty.call(initialOverrides, key)) {
            const val = initialOverrides[key as keyof BuildingBasicInfoFormData];
            if (val !== undefined && prev[key as keyof BuildingBasicInfoFormData] !== val) {
              (next as any)[key] = val;
              changed = true;
            }
          }
        }
        return changed ? next : prev;
      });
    }
  }, [initialOverrides]);

  const updateFormData = useCallback(
    (patch: Partial<BuildingBasicInfoFormData>) => {
      setFormData((prev) => {
        let changed = false;
        const next = { ...prev };
        for (const key in patch) {
          if (Object.prototype.hasOwnProperty.call(patch, key)) {
            const val = patch[key as keyof BuildingBasicInfoFormData];
            if (val !== undefined && prev[key as keyof BuildingBasicInfoFormData] !== val) {
              (next as any)[key] = val;
              changed = true;
            }
          }
        }
        return changed ? next : prev;
      });
    },
    []
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      const target = e.target as HTMLInputElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      
      const sanitizedValue = sanitizeBasicInfoField(name, value);

      setFormData((prev) => {
        const patch: Partial<BuildingBasicInfoFormData> = { [name]: sanitizedValue };
        if (name === "zone") {
          patch.ward = "";
        } else if (name === "typeOfUseId") {
          patch.subTypeOfUseId = "";
        }
        return {
          ...prev,
          ...patch,
        };
      });

      const isTitleCased = name === "assetName" || name === "inChargeName" || name === "inChargeDesignation";
      if (start !== null && end !== null && isTitleCased) {
        requestAnimationFrame(() => {
          try {
            target.setSelectionRange(start, end);
          } catch {}
        });
      }
    },
    []
  );

  const handleAttributeChange = useCallback(
    (name: string, value: string | number | boolean) => {
      setFormData((prev) => ({
        ...prev,
        attributes: { ...prev.attributes, [name]: value },
      }));
    },
    []
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name } = e.target;
      setTouched((prev) => ({
        ...prev,
        [name as keyof BuildingBasicInfoFormData]: true,
      }));
    },
    []
  );

  const resetForm = useCallback(() => {
    setFormData({ ...INITIAL_BUILDING_BASIC_INFO, ...initialOverrides });
    setErrors({});
    setTouched({});
    setSubmittedOnce(false);
  }, [initialOverrides]);

  return {
    formData,
    errors,
    touched,
    submittedOnce,
    setErrors,
    setSubmittedOnce,
    updateFormData,
    handleChange,
    handleAttributeChange,
    handleBlur,
    resetForm,
  };
}
