import { RefObject, ChangeEvent } from "react";

/**
 * Floor Details & Media — Type Definitions
 * Scope: municipal-Asset / add-New-Asset / floor-details screen only.
 * Do NOT modify types shared with other screens here.
 */

/* ── Floor record stored in AssetFormContext ──────────────────────────────── */
export interface FloorEntry {
  id: number;
  checked: boolean;
  floor: string;
  conYear: string;
  asstYear: string;
  conType: string;
  useType: string;
  subUseType: string;
  rooms: number;
  carpetAreaSqFt: number;
  carpetAreaSqM: number;
  builtUpAreaSqFt: number;
  builtUpAreaSqM: number;
  baseValue: number;
  floorFactor: string;
  ageFactor: number;
  units: SubUnit[];
}

/* ── Sub-unit record stored per floor ───────────────────────────────────────*/
export interface SubUnit {
  id: number;
  unitNumber: string;
  unitType: string;
  carpetAreaSqFt: number;
  status: string;
  baseValue: number;
  floorId?: number;
  floorDetailsId?: number;
}

/* ── Form state for the "add new floor" row ─────────────────────────────────*/
export interface NewFloorFormState {
  floor: string;
  conYear: string;
  asstYear: string;
  conType: string;
  useType: string;
  subUseType: string;
  rooms: number;
  carpetAreaSqM: number;
  builtUpAreaSqM: number;
  baseValue: number;
}

/* ── Bulk unit generator form state ─────────────────────────────────────────*/
export interface BulkGeneratorState {
  unitType: string;
  prefix: string;
  startNum: number;
  count: number;
  areaSqFt: number;
}

/* ── Component props ─────────────────────────────────────────────────────── */
export interface MediaDetailsStepProps {
  formData: any;
  photoUrl: string | null;
  photoFile: File | null;
  planUrl: string | null;
  photoInputRef: RefObject<HTMLInputElement | null>;
  planInputRef: RefObject<HTMLInputElement | null>;
  onPhotoUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  onPlanUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  onOpenMap: () => void;
}

export interface RoomWiseSubmissionStepProps {
  isOpen: boolean;
  onClose: () => void;
  floorId: number | null;
  currentFloor?: FloorEntry;
  localUnits: SubUnit[];
  bulk: BulkGeneratorState;
  activeUnit: SubUnit | null;
  dropdownOptions?: FloorDropdownOptions | null;
  onBulkChange: (updated: Partial<BulkGeneratorState>) => void;
  onGenerateBulk: () => void;
  onDeleteUnit: (id: number) => void;
  onSaveSubUnits: () => void;
  setActiveUnit: (unit: SubUnit | null) => void;
  onSaveUnitDetail: (updated: SubUnit) => void;
  setLocalUnits: (units: SubUnit[]) => void;
}

export interface FloorDetailApiRequest {
  isActive: boolean;
  createdBy?: number;
  assetId: number;
  floorId: number;
  subFloorId?: number;
  constructionYear: string;
  assessmentYear: string;
  constructionTypeId: number;
  typeOfUseId: number;
  subTypeOfUseId: number;
  carpetAreaSqMeter: number;
  carpetAreaSqFeet: number;
  builtUpAreaSqMeter: number;
  builtUpAreaSqFeet: number;
  noOfRooms: number;
  isRented?: boolean;
  rentMonthly?: number | null;
  rentYearly?: number | null;
  nonCalculateRentMonthly?: number | null;
  renterNameEnglish?: string | null;
  renterNameLocal?: string | null;
  agreementFromDate?: string | null;
  agreementDate?: string | null;
  agreementToDate?: string | null;
  taxLiability?: string | null;
  isTaxable?: boolean;
  occupancyDate?: string | null;
  occupancyApplied?: boolean | null;
  occupancyNumber?: string | null;
  capitalValue?: number | null;
  marketValue?: number | null;
  baseValue?: number | null;
  lastCVCalculationDate?: string | null;
  cvBaseRate?: number | null;
  cvAgeFactor?: number | null;
  cvFloorFactor?: number | null;
  cvNatureFactor?: number | null;
  cvUseFactor?: number | null;
  cvCalculationFormula?: string | null;
  markedForDeletion?: boolean;
  markedForDeletionDate?: string | null;
}

export interface FloorDetailApiResponse extends FloorDetailApiRequest {
  id: number;
  createdDate: string;
  updatedDate?: string | null;
}

export interface SubUnitApiRequest {
  floorDetailId: number;
  unitNumber: string;
  unitType: string;
  carpetAreaSqFt: number;
  status: string;
  baseValue: number;
  isActive: boolean;
}

export interface SubUnitApiResponse extends SubUnitApiRequest {
  id: number;
  createdDate: string;
  modifiedDate?: string;
}

/* ── Select option helpers (used by form dropdowns) ─────────────────────────*/
export interface FloorSelectOption {
  label: string;
  value: string;
}

export interface FloorDropdownOptions {
  floorLevels: FloorSelectOption[];
  constructionTypes: FloorSelectOption[];
  useTypes: FloorSelectOption[];
  subUseTypes: FloorSelectOption[];
  unitTypes: FloorSelectOption[];
}

/* ── ManageSubUnits API Types ────────────────────────────────────────────── */
export interface BulkGenerateChildAssetsRequest {
  parentAssetId: number;
  floorDetailsId: number;
  type: string;
  prefix: string;
  startNumber: number;
  count: number;
  areaSqFt: number;
  createdBy?: number;
}

export interface GeneratedAssetDto {
  assetId: number;
  assetNo: string;
  assetName: string;
  roomWiseSubmissionDetailsId?: number | null;
}

export interface BulkGenerateChildAssetsResponse {
  totalGenerated: number;
  generatedAssets: GeneratedAssetDto[];
  errors: string[];
}

export interface RentInformationDto {
  leaseRentType?: string | null;
  leaseStart?: string | null;
  leaseEnd?: string | null;
  duration?: number | null;
  rentFrequency?: string | null;
  rentAmount?: number | null;
  securityDeposit?: number | null;
  depositType?: string | null;
}

export interface FloorConfigurationDto {
  unitAreaSqFt?: number | null;
  calculatedCapitalValue?: number | null;
}

export interface RoomDetailDto {
  lengthMtr?: number | null;
  widthMtr?: number | null;
  heightMtr?: number | null;
  areaSqMtr?: number | null;
  base1Mtr?: number | null;
  base2Mtr?: number | null;
  noOfRooms?: number | null;
  totalAreaSqMtr?: number | null;
  roomNo?: string | null;
  roomType?: string | null;
  shape?: string | null;
  submissionType?: string | null;
  outerYesNo: boolean;
  minusYesNo: boolean;
}

export interface CreateChildAssetRequest {
  parentAssetId: number;
  assetId: number;
  floorDetailsId?: number;
  complexName?: string | null;
  renterName?: string | null;
  propertyDescription?: string | null;
  shopUnitName?: string | null;
  zoneNo?: number | null;
  unitNo?: string | null;
  wardNo?: number | null;
  propertyNo?: string | null;
  partitionNo?: string | null;
  mobileNo?: string | null;
  surveyNo?: string | null;
  emailId?: string | null;
  gstNo?: string | null;
  totalAreaSqFt?: number | null;
  shopActNo?: string | null;
  aadhaarCardNo?: string | null;
  panCardNo?: string | null;
  createdBy?: number | null;
  rentInformation?: RentInformationDto | null;
  floorConfiguration?: FloorConfigurationDto | null;
  isRoomWiseValuationActive: boolean;
  roomDetails?: RoomDetailDto[] | null;
}

export interface CreateChildAssetResponse {
  success: boolean;
  message: string;
  assetId?: number | null;
  assetNo?: string | null;
  roomWiseSubmissionDetailsId?: number | null;
  renterDetailsId?: number | null;
  errors: string[];
}
