import { LucideIcon } from "lucide-react";

export interface AssetFormStepConfig {
  id: number;
  key: "identification" | "basic-info" | "floor-details" | "legal-complience" | "furniture-fixture" | "valuation" | "documents";
  label: string;
  icon: LucideIcon;
  path: string;
}

export interface AssetStepperProps {
  currentStepId: number;
  steps: AssetFormStepConfig[];
}

export interface CategoryFlags {
  isMovable?: boolean;
  hasFloorDetails?: boolean;
  hasInventory?: boolean;
  isInventoryMandatory?: boolean;
  hasLegalCompliance?: boolean;
}

export interface AssetFormData {
  category: string;
  categoryCode?: string;
  // DB-driven valuation type: BUILDING | LAND | INFRASTRUCTURE | MOVABLE | GENERIC
  // Set from AssetCategoryMaster.ValuationType — never derive from string matching
  valuationType?: string;
  assetType: string;
  assetName: string;
  assetCode: string;
  isMovableCategory?: boolean;
  hasFloorDetails?: boolean;
  hasInventory?: boolean;
  isInventoryMandatory?: boolean;
  hasLegalCompliance?: boolean;
  allowUnitRegistration?: boolean;
  allowRoomRegistration?: boolean;
  attributes: Record<string, any>;
  documents: any[];
  [key: string]: any;
}

export interface AssetFormContextType {
  formData: AssetFormData;
  updateFormData: (data: Partial<AssetFormData>) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleToggleChange: (name: string, checked: boolean) => void;
  handleAttributeChange: (name: string, value: any) => void;
  errors?: Record<string, string>;
  setErrors?: (errors: Record<string, string>) => void;
  submittedOnce?: boolean;
  setSubmittedOnce?: (submitted: boolean) => void;
  lastSavedFormData?: AssetFormData | null;
  setLastSavedFormData?: (data: AssetFormData) => void;
  onSubmitHook?: (() => Promise<boolean>) | null;
  registerSubmitHook?: (hook: (() => Promise<boolean>) | null) => void;
  stagedFiles?: Record<number, { file: File; definition: any }>;
  setStagedFiles?: React.Dispatch<React.SetStateAction<Record<number, { file: File; definition: any }>>>;
  basicInfoFiles?: { frontPhoto?: File; buildingPlan?: File };
  setBasicInfoFiles?: React.Dispatch<React.SetStateAction<{ frontPhoto?: File; buildingPlan?: File }>>;
  subunitFiles?: Record<number, { photoFile?: File | null; planFile?: File | null }>;
  setSubunitFiles?: React.Dispatch<React.SetStateAction<Record<number, { photoFile?: File | null; planFile?: File | null }>>>;
  registerStepSave?: (stepKey: string, saveFn: () => Promise<{ success: boolean; error?: string }>) => void;
  unregisterStepSave?: (stepKey: string) => void;
  isDataLoading?: boolean;
  setIsDataLoading?: (loading: boolean) => void;
}

export interface AssetWizardStepProps {
  formData: AssetFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onToggleChange?: (name: string, checked: boolean) => void;
}
export interface AssetFieldValueRequest {
  fieldDefinitionId?: number;
  fieldName: string;
  textValue?: string | null;
  numberValue?: number | null;
  dateValue?: string | null;
  booleanValue?: boolean | null;
}

export interface AssetFloorDetailsRequest {
  floorId: number;
  subFloorId?: number | null;
  constructionYear?: string;
  assessmentYear?: string;
  constructionTypeId: number;
  typeOfUseId: number;
  subTypeOfUseId?: number | null;
  carpetAreaSqMeter?: number;
  carpetAreaSqFeet?: number;
  builtUpAreaSqMeter?: number;
  builtUpAreaSqFeet?: number;
  noOfRooms?: number;
  isRented?: boolean | null;
  rentMonthly?: number | null;
  rentYearly?: number | null;
  nonCalculateRentMonthly?: number | null;
  renterNameEnglish?: string | null;
  renterNameLocal?: string | null;
  agreementFromDate?: string | null;
  agreementDate?: string | null;
  agreementToDate?: string | null;
  taxLiability?: string | null;
  isTaxable?: boolean | null;
  occupancyDate?: string | null;
  occupancyApplied?: boolean | null;
  occupancyNumber?: string | null;
  capitalValue?: number | null;
  marketValue?: number | null;
  lastCvCalculationDate?: string | null;
  cvBaseRate?: number | null;
  cvAgeFactor?: number | null;
  cvFloorFactor?: number | null;
  cvNatureFactor?: number | null;
  cvUseFactor?: number | null;
  cvCalculationFormula?: string | null;
  isActive: boolean;
}

/**
 * Matches backend CreateAssetMasterDto exactly.
 * Only include fields the backend DTO declares.
 */
export interface AssetMasterRequest {
  // Required fields
  authorityId: number;
  organizationId: number;
  assetNo: string;        // maps to AssetNo (backend has NO assetCode field)
  assetName: string;
  assetCategoryId: number;
  assetTypeId: number;
  hierarchyLevel: number;
  status: string;
  isActive: boolean;

  // Optional FK IDs — send null, NOT 0 or invalid fallback
  departmentId?: number | null;
  parentAssetId?: number | null;
  wardId?: number | null;
  zoneId?: number | null;
  subZoneId?: number | null;
  moujaId?: number | null;
  typeOfUseId?: number | null;
  subTypeOfUseId?: number | null;

  // Optional strings
  hierarchyPath?: string | null;
  address?: string | null;
  csn?: string | null;
  ownershipType?: string | null;
  occupancyStatus?: string | null;
  operationalControl?: string | null;
  assetCondition?: string | null;
  inChargeName?: string | null;
  inChargeDesignation?: string | null;
  inChargeMobile?: string | null;
  inChargeEmail?: string | null;
  locality?: string | null;
  pinCode?: string | null;
  partitionNo?: string | null;
  upicId?: string | null;


  // Optional location
  latitude?: number | null;
  longitude?: number | null;

  // Optional area details
  builtUpAreaSqMeter?: number | null;
  carpetAreaSqMeter?: number | null;
  landAreaSqMeter?: number | null;
  totalLength?: number | null;
  averageWidth?: number | null;
  hasLift?: boolean;

  // Optional valuation
  purchaseValue?: number | null;
  purchaseDate?: string | null;
  marketValue?: number | null;
  marketValueDate?: string | null;
  capitalValue?: number | null;
  lastCVCalculationDate?: string | null;
  currentBookValue?: number | null;
  depreciationRate?: number | null;

  // Optional booleans
  isRevenueGenerating?: boolean | null;

  // EAV dynamic field values
  fieldValues?: AssetFieldValueRequest[];

  // Base DTO fields
  createdBy?: number;
}

export interface AssetFormDataRequest {
  sectionCode: string;
  sectionName: string;
  formData: string; // JSON string representation of section fields
  displayOrder: number;
}

export interface AssetMasterResponse {
  id: number;
  isActive: boolean;
  assetCode: string;
  name: string;
  // ... other fields as needed
}
