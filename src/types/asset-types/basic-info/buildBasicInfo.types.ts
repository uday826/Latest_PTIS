/**
 * buildBasicInfo.types.ts
 *
 * All types scoped to the Building Asset → Basic Info registration step.
 * Kept separate so the Building team can raise a clean, isolated PR.
 */

import type { ProcessedField } from "@/components/modules/assets/municipal-Asset/add-New-Asset/FieldRenderer";

// ─── Section A: Property Number Details ──────────────────────────────────────

export interface BuildingPropertyDetailsFormData {
  /** Read-only badge: resolved from searchParams / context */
  category: string;
  /** Read-only badge: resolved from searchParams / context */
  assetType: string;
  zone: string;
  subzone: string;
  ward: string;
  mouja: string;
  propertyNumber: string;
  surveyNumber: string;
}

// ─── Section B: Ownership & Address Details ───────────────────────────────────

export interface BuildingOwnershipDetailsFormData {
  assetName: string;
  /** Department select value (e.g. "estate") */
  department: string;
  fullAddress: string;
  locality: string;
  pinCode: string;
  ownershipType: string;
  operationalControl: string;
  inChargeName: string;
  inChargeDesignation: string;
  inChargeMobile: string;
  inChargeEmail: string;
  latitude?: string;
  longitude?: string;
}

// ─── Combined form model ──────────────────────────────────────────────────────

export interface BuildingBasicInfoFormData
  extends BuildingPropertyDetailsFormData,
    BuildingOwnershipDetailsFormData {
  /**
   * EAV dynamic attributes fetched from /AssetFieldDefinition.
   * Keys are fieldNames returned by the API; values are user input.
   */
  attributes: Record<string, string | number | boolean>;
  /** Numeric IDs resolved from the API – needed by the submit action */
  categoryId: number;
  typeId: number;
}

// ─── Validation error map ─────────────────────────────────────────────────────

export type BuildingBasicInfoFormErrors = Partial<
  Record<keyof BuildingBasicInfoFormData, string>
>;

// ─── Component prop shapes ────────────────────────────────────────────────────

import type { Ward } from "@/lib/api/asset/ward.service";
import type { Zone } from "@/lib/api/asset/zone.service";
import type { Department } from "@/lib/api/asset/department.service";
import type { Mouja } from "@/lib/api/asset/mouja.service";

export interface BuildingPropertyDetailsSectionProps {
  formData: BuildingPropertyDetailsFormData;
  errors: BuildingBasicInfoFormErrors;
  showError: (field: keyof BuildingBasicInfoFormData) => boolean;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  wards?: Ward[];
  zones?: Zone[];
  moujas?: Mouja[];
  subzones?: any[];
}

export interface BuildingOwnershipDetailsSectionProps {
  formData: BuildingOwnershipDetailsFormData;
  errors: BuildingBasicInfoFormErrors;
  showError: (field: keyof BuildingBasicInfoFormData) => boolean;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  departments?: Department[];
  updateFormData?: (patch: Partial<any>) => void;
}

export interface BuildingDynamicAttributesSectionProps {
  /** Pre-fetched field definitions from the server (SSR) */
  prefetchedFields: ProcessedField[];
  attributes: Record<string, string | number | boolean>;
  onAttributeChange: (name: string, value: string | number | boolean) => void;
}

/**
 * Props passed from the server page to the client orchestrator component.
 */
export interface BuildingBasicInfoStepProps {
  prefetchedFields: ProcessedField[];
}

// ─── Initial form state constant ──────────────────────────────────────────────

export const INITIAL_BUILDING_BASIC_INFO: BuildingBasicInfoFormData = {
  // Section A
  category: "Building Assets",
  assetType: "",
  zone: "",
  subzone: "",
  ward: "",
  mouja: "",
  propertyNumber: "",
  surveyNumber: "",
  // Section B
  assetName: "",
  department: "",
  fullAddress: "",
  locality: "",
  pinCode: "",
  ownershipType: "municipal",
  operationalControl: "self",
  inChargeName: "",
  inChargeDesignation: "",
  inChargeMobile: "",
  inChargeEmail: "",
  latitude: "",
  longitude: "",
  // Dynamic attributes
  attributes: {},
  categoryId: 0,
  typeId: 0,
};
