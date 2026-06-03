import type { BuildingBasicInfoFormData } from "@/types/asset-types/basic-info/buildBasicInfo.types";
import { validateForm } from "./basic-info-validation-helpers";

export interface ValidationRule {
  required?: boolean;
  requiredMessage?: string;
  pattern?: RegExp;
  patternMessage?: string;
  minLength?: number;
  minLengthMessage?: string;
  maxLength?: number;
  maxLengthMessage?: string;
  custom?: (value: any, formData: any) => string | undefined;
}

export type ValidationSchema<T> = {
  [K in keyof T]?: ValidationRule;
};

// ─── Regex patterns ────────────────────────────────────────────────────────────
export const PIN_CODE_RE = /^[1-9]\d{5}$/;
export const MOBILE_RE = /^[6-9]\d{9}$/;
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const NAME_RE = /^[a-zA-Z\s.]+$/;
export const PROPERTY_TAX_RE = /^[a-zA-Z0-9/\-_]+$/;

export const buildingBasicInfoSchema: ValidationSchema<BuildingBasicInfoFormData> = {
  // Section A: Property Number Details
  propertyNumber: {
    required: true,
    requiredMessage: "Property Tax No is required.",
    pattern: PROPERTY_TAX_RE,
    patternMessage: "Property Tax No can only contain alphanumeric characters, '/', '-', and '_'.",
  },
  zone: {
    required: true,
    requiredMessage: "Zone is required.",
  },
  subzone: {
    required: true,
    requiredMessage: "Subzone is required.",
  },
  ward: {
    required: true,
    requiredMessage: "Ward is required.",
  },
  mouja: {
    required: true,
    requiredMessage: "Mouja is required.",
  },

  // Section B: Ownership & Address Details
  assetName: {
    required: true,
    requiredMessage: "Asset Name is required.",
    minLength: 3,
    minLengthMessage: "Asset Name must be at least 3 characters.",
  },
  department: {
    required: true,
    requiredMessage: "Owning Department is required.",
  },
  ownershipType: {
    required: true,
    requiredMessage: "Ownership Type is required.",
  },
  fullAddress: {
    required: true,
    requiredMessage: "Full Address is required.",
    minLength: 10,
    minLengthMessage: "Full Address must be at least 10 characters.",
  },
  pinCode: {
    required: true,
    requiredMessage: "Pin Code is required.",
    pattern: PIN_CODE_RE,
    patternMessage: "Pin Code must be a valid 6-digit Indian PIN code not starting with 0.",
  },
  inChargeName: {
    required: true,
    requiredMessage: "In-Charge Name is required.",
    pattern: NAME_RE,
    patternMessage: "In-Charge Name should only contain letters, spaces, and periods.",
  },
  inChargeMobile: {
    required: true,
    requiredMessage: "Contact Number is required.",
    pattern: MOBILE_RE,
    patternMessage: "Contact Number must be a valid 10-digit mobile number starting with 6, 7, 8, or 9.",
  },
  inChargeEmail: {
    pattern: EMAIL_RE,
    patternMessage: "Please enter a valid email address.",
  },
};

export const landBasicInfoSchema: ValidationSchema<any> = {
  // Asset Identity
  assetName: {
    required: true,
    requiredMessage: "Asset Name is required.",
    minLength: 3,
    minLengthMessage: "Asset Name must be at least 3 characters.",
  },
  // Jurisdiction
  authorityId: {
    required: true,
    requiredMessage: "Authority is required.",
  },
  organizationId: {
    required: true,
    requiredMessage: "Organization / Office is required.",
  },
  departmentId: {
    required: true,
    requiredMessage: "Owning Department is required.",
  },
  zoneId: {
    required: true,
    requiredMessage: "Zone is required.",
  },
  wardId: {
    required: true,
    requiredMessage: "Ward is required.",
  },
  // In-Charge / Contact
  inChargeName: {
    required: true,
    requiredMessage: "In-Charge Name is required.",
    pattern: NAME_RE,
    patternMessage: "In-Charge Name should only contain letters, spaces, and periods.",
  },
  inChargeDesignation: {
    required: true,
    requiredMessage: "Designation is required.",
  },
  inChargeMobile: {
    required: true,
    requiredMessage: "Contact Number is required.",
    pattern: MOBILE_RE,
    patternMessage: "Contact Number must be a valid 10-digit mobile number starting with 6, 7, 8, or 9.",
  },
  inChargeEmail: {
    pattern: EMAIL_RE,
    patternMessage: "Please enter a valid email address.",
  },
  // Location details (Survey Number is only required for LAND category, we handle this conditionally or keep it required for Land validation)

  landArea: {
    required: true,
    requiredMessage: "Total Land Area is required.",
  },
  fullAddress: {
    required: true,
    requiredMessage: "Full Postal Address is required.",
    minLength: 10,
    minLengthMessage: "Full Address must be at least 10 characters.",
  },
  pinCode: {
    required: true,
    requiredMessage: "Pin Code is required.",
    pattern: PIN_CODE_RE,
    patternMessage: "Pin Code must be a valid 6-digit Indian PIN code not starting with 0.",
  },
};

export function validateLandBasicInfo(formData: any): Record<string, string> {
  return validateForm(formData, landBasicInfoSchema) as Record<string, string>;
}

