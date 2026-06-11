import React from 'react';
import { AssetCategory } from './asset-category.types';
import { AssetType } from './asset-type.types';
export type { AssetCategory, AssetType };
import type { AssetDocumentDefinitionDto } from '@/lib/api/asset/asset-document.service';
import {
  Type,
  FileText,
  Hash,
  Mail,
  Phone,
  Calendar,
  ChevronDown,
  Radio,
  CheckSquare,
  Upload,
  List,
  Plus
} from 'lucide-react';

// --- Core Data Types (from screenFields.ts) ---

export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'email'
  | 'phone'
  | 'date'
  | 'dropdown'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'file'
  | 'multiselect'
  | 'button';

export type FieldOptionsSource = 'manual' | 'master';

export interface FieldOption {
  value: string;
  label: string;
}

export interface ConditionalRule {
  fieldId: string;
  operator: 'equals' | 'notEquals' | 'contains' | 'in';
  value: string | string[];
}

export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'min' | 'max';
  value?: string | number;
  message: string;
}

/**
 * Base representation of a municipal asset screen field configuration.
 * Defines structure, UI controls, validation constraints, and database mapping.
 */
export interface BaseScreenField {
  id: string;
  fieldName: string;
  label: string;
  fieldLabelLocal?: string;
  fieldCode?: string;
  fieldLabel?: string; // Duplicate of label but often used in payloads
  required: boolean;
  isRequired?: boolean; // Duplicate for API compatibility
  order: number;
  displayOrder?: number; // For API compatibility
  isActive: boolean;
  createdDate: string;
  modifiedDate?: string;
  placeholder?: string;
  helpText?: string;
  defaultValue?: string | number | boolean;
  dependsOnFieldId?: string;
  dependsOnFieldName?: string;
  conditionalDisplay?: ConditionalRule[];
  validationRules?: ValidationRule[];
  
  // Advanced Config
  dataType?: string;
  controlType?: string;
  columnSpan?: number;
  isReadonly?: boolean;
  isVisible?: boolean;
  isUnique?: boolean;
  isSearchable?: boolean;
  isFilterable?: boolean;
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
  regexPattern?: string;
  validationMessage?: string;
  
  // JSON Configs
  validationJson?: string;
  extraConfigJson?: string;
  staticOptionsJson?: string;
  visibilityConditionJson?: string;
  screenId?: number | string | null;
  sectionId?: number | string | null;
}

export interface TextScreenField extends BaseScreenField {
  fieldType: 'text' | 'textarea' | 'email' | 'phone';
}

export interface NumberScreenField extends BaseScreenField {
  fieldType: 'number';
}

export interface DateScreenField extends BaseScreenField {
  fieldType: 'date';
}

export interface DropdownScreenField extends BaseScreenField {
  fieldType: 'dropdown' | 'select' | 'multiselect' | 'radio';
  options?: FieldOption[];
  optionsSource?: FieldOptionsSource;
  masterKey?: string;
}

export interface CheckboxScreenField extends BaseScreenField {
  fieldType: 'checkbox';
}

export interface FileScreenField extends BaseScreenField {
  fieldType: 'file';
  accept?: string;
  allowMultiple?: boolean;
  attachmentUrl?: string;
  filePreview?: string;
}

export interface ButtonScreenField extends BaseScreenField {
  fieldType: 'button';
  buttonAction?: string;
  buttonStyle?: 'primary' | 'secondary' | 'success' | 'danger';
}

export type ScreenField =
  | TextScreenField
  | NumberScreenField
  | DateScreenField
  | DropdownScreenField
  | CheckboxScreenField
  | FileScreenField
  | ButtonScreenField;

/**
 * Interface representing the "flat" version of all possible field properties
 * used for managing form state during editing. This allows components to
 * access properties from different union members safely during the draft phase.
 */
export type FieldFormData = Partial<BaseScreenField> & {
  fieldType?: FieldType;
  options?: FieldOption[];
  optionsSource?: FieldOptionsSource;
  masterKey?: string;
  accept?: string;
  allowMultiple?: boolean;
  buttonAction?: string;
  buttonStyle?: 'primary' | 'secondary' | 'success' | 'danger';
  attachmentUrl?: string;
  filePreview?: string;
  // Temporary state for form UI
  newOptionValue?: string;
  newRuleFieldId?: string;
  newRuleValues?: string[];
  newRuleSubValues?: string[];
};

export type FieldRow = ScreenField;

export interface SectionGroup {
  groupLabel: string;
  sections: ScreenSection[];
  fieldsCount: number;
  firstOrder: number;
}

/**
 * Enterprise representation of a screen form section.
 * Encapsulates layout, multi-column grid settings, expand/collapse state, and child fields.
 */
export interface ScreenSection {
  id: string | number;
  sectionName: string;
  sectionNameLocal?: string;
  sectionCode?: string;
  label: string;
  description?: string;
  sectionType?: string;
  order: number;
  displayOrder?: number;
  columnCount?: number;
  isCollapsible: boolean;
  isDefaultExpanded: boolean;
  isCollapsedByDefault?: boolean;
  isOptional?: boolean;
  isRepeatable?: boolean;
  isActive: boolean;
  conditionalDisplay?: ConditionalRule[];
  fields: ScreenField[];
  sectionImage?: string;
  sectionIcon?: string;
  createdDate: string;
  modifiedDate?: string;
  screenId?: number | string;
  parentSectionId?: number | string | null;
}

/**
 * Top-level municipal asset screen configuration domain object.
 * Defines navigation routing, module hierarchy, authentication requirements, and associated sections.
 */
export interface ScreenConfig {
  id: number | string;
  screenName: string;
  screenNameLocal?: string;
  screenCode: string;
  screenIcon?: string;
  description?: string;
  moduleId: number | string | null;
  parentScreenId?: number | string | null;
  isActive: boolean;
  isMenuVisible: boolean;
  isAuthenticationRequired: boolean;
  displayOrder: number;
  menuLevel?: number;
  routePath?: string | null;
  baseRoutePath?: string | null;
  routeParamPattern?: string | null;
  purpose?: string | null;
  componentName?: string | null;
  areaName?: string | null;
  controllerName?: string | null;
  actionName?: string | null;
  sections: ScreenSection[];
  createdDate?: string;
  updatedDate?: string | null;
  modifiedDate?: string;
}

export interface ScreenGroupConfig {
  id: number | string;
  name: string;
  description?: string;
  isActive: boolean;
  order?: number;
  displayOrder?: number;
  createdDate?: string;
  modifiedDate?: string;
}

export interface EnrichedScreen extends ScreenConfig {
  sectionsCount: number;
  fieldsCount: number;
}

export interface MasterDataRecord {
  id: number;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdDate: string;
  modifiedDate?: string;
  parentId?: string;
  parentCategory?: string;
  templateKey?: string;
  hiddenSectionKeys?: string;
  screenFieldSelectionsJson?: string;
}

export interface MasterDataConfig {
  assetCategory: MasterDataRecord[];
  assetType: MasterDataRecord[];
  zone: MasterDataRecord[];
  ward: MasterDataRecord[];
  propertyCategory: MasterDataRecord[];
  propertySubCategory: MasterDataRecord[];
  owningDepartment: MasterDataRecord[];
  ownershipType: MasterDataRecord[];
  maintainingDepartment: MasterDataRecord[];
  yesNo: MasterDataRecord[];
  landAreaUnit: MasterDataRecord[];
  landShape: MasterDataRecord[];
  encumbranceStatus: MasterDataRecord[];
  terrainType: MasterDataRecord[];
  approachRoadType: MasterDataRecord[];
  surroundingDevelopment: MasterDataRecord[];
  currentLandUsage: MasterDataRecord[];
  buildableStatus: MasterDataRecord[];
  floodProneArea: MasterDataRecord[];
  furnitureItemName: MasterDataRecord[];
  furnitureTypeModel: MasterDataRecord[];
  equipmentName: MasterDataRecord[];
  equipmentBrandModel: MasterDataRecord[];
  electronicFixturesName: MasterDataRecord[];
  electronicFixturesModel: MasterDataRecord[];
  vehicleType: MasterDataRecord[];
  vehicleMakeModel: MasterDataRecord[];
  inventoryCondition: MasterDataRecord[];
  equipmentStatus: MasterDataRecord[];
  rentFrequency: MasterDataRecord[];
  depositType: MasterDataRecord[];
  landClassification: MasterDataRecord[];
  plotBoundaryType: MasterDataRecord[];
  condition: MasterDataRecord[];
  roadCategory: MasterDataRecord[];
  roadClass: MasterDataRecord[];
  numberOfLanes: MasterDataRecord[];
  surfaceType: MasterDataRecord[];
  trafficFlow: MasterDataRecord[];
  medianType: MasterDataRecord[];
  footpathAvailability: MasterDataRecord[];
  drainageSystem: MasterDataRecord[];
  streetLighting: MasterDataRecord[];
  roadMarking: MasterDataRecord[];
  trafficSignals: MasterDataRecord[];
  parkingFacility: MasterDataRecord[];
}

// --- Component Prop Types (from asset.types.ts) ---

export interface ScreenFieldsMasterProps {
  onManageData?: (field: AssetFieldDefinition) => void;
  initialData?: {
    categoryId: number | null;
    typeId: number | null;
    categoriesResult: { items: AssetCategory[]; totalCount: number };
    typesResult: { items: AssetType[]; totalCount: number };
    fieldsResult: { items: AssetFieldDefinition[]; totalCount: number };
    docDefsResult?: { items: AssetDocumentDefinitionDto[] };
  };
}

export interface ScreenListProps {
  screens: EnrichedScreen[];
  groups: ScreenGroupConfig[];
  selectedScreenId: string | null;
  pagination: { page: number; total: number; pageSize?: number; next: () => void; prev: () => void; setPage: (page: number) => void };
  onScreenSelect: (id: string) => void;
  onAddScreen: () => void;
  onAddGroup: () => void;
  onEditScreen: (screen: EnrichedScreen) => void;
  onEditGroup: (group: ScreenGroupConfig) => void;
  onDeleteScreen: (id: string) => void;
  onDeleteGroup: (id: string) => void;
  isLoading?: boolean;
}

export interface SectionListProps {
  sections: ScreenSection[];
  selectedSectionId: string | null;
  onSectionSelect?: (sectionId: string | number) => void;
  onAddSection?: () => void;
  onEditSection?: (section: ScreenSection) => void;
  onDeleteSection?: (sectionId: string | number) => void;
  screenName?: string;
  pagination?: { page: number; total: number; pageSize?: number; next: () => void; prev: () => void; setPage: (page: number) => void };
  isLoading?: boolean;
}

export interface FieldListProps {
  fields: ScreenField[];
  onAddField?: () => void;
  onEditField?: (field: ScreenField) => void;
  onDeleteField?: (fieldId: string | number) => void;
  onReorderField?: (fieldId: string, direction: 'up' | 'down') => void;
  onManageData?: (field: ScreenField) => void;
  sourceSectionId?: string | null;
  sourceSectionLabel?: string | null;
  screenName?: string | null;
  isLoading?: boolean;
  pagination?: { page: number; total: number; pageSize?: number; next: () => void; prev: () => void; setPage: (page: number) => void };
}

export interface FieldFormModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onSave?: (field: ScreenField) => void;
  existingField?: ScreenField | null;
  maxOrder: number;
  availableFields?: ScreenField[];
  onManageData?: (field: ScreenField) => void;
  selectedScreen?: ScreenConfig | null;
  isLoading?: boolean;
}

export interface SectionFormModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onSave?: (section: ScreenSection) => void;
  existingSection?: ScreenSection | null;
  maxOrder: number;
  screenName?: string;
  sections?: ScreenSection[];
  isLoading?: boolean;
}

export type SectionFormValues = Partial<ScreenSection> & {
  sectionCode?: string;
};

// --- Constants & Helper Types (from Components) ---

export interface FieldTypeOption {
  value: FieldType | 'all' | 'active' | 'inactive';
  label: string;
}

export const fieldTypeOptions: Array<{ value: FieldType; label: string }> = [
  { value: 'text', label: 'Text Input' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'number', label: 'Number Input' },
  { value: 'email', label: 'Email Input' },
  { value: 'phone', label: 'Phone Number' },
  { value: 'date', label: 'Date Picker' },
  { value: 'dropdown', label: 'Dropdown Select' },
  { value: 'select', label: 'Select Dropdown' },
  { value: 'radio', label: 'Radio Buttons' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'file', label: 'File Upload' },
  { value: 'multiselect', label: 'Multi-Select' },
  { value: 'button', label: 'Button' },
];

export const fieldTypeIcons: Record<string, React.ElementType> = {
  text: Type,
  textarea: FileText,
  number: Hash,
  email: Mail,
  phone: Phone,
  date: Calendar,
  dropdown: ChevronDown,
  select: ChevronDown,
  radio: Radio,
  checkbox: CheckSquare,
  file: Upload,
  multiselect: List,
  button: Plus,
};

export const dropdownFieldTypes: FieldType[] = ['dropdown', 'select', 'multiselect', 'radio'];

export const statusFilterOptions: FieldTypeOption[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

export const fieldTypeFilterOptions: FieldTypeOption[] = [
  { value: 'all', label: 'All Types' },
  ...fieldTypeOptions,
];

export interface ScreenFieldsUI {
  showFieldModal: boolean;
  editingField: ScreenField | null;
  showSectionModal: boolean;
  editingSection: ScreenSection | null;
  modalType: string | null;
  actionType: string | null;
  editingScreen: ScreenConfig | null;
  editingGroup: ScreenGroupConfig | null;
}

export interface ScreenFieldsData {
  screenConfigs: ScreenConfig[];
  screenGroups: ScreenGroupConfig[];
  selectedScreenId: string | null;
  selectedSectionId: string | null;
  selectedScreen: ScreenConfig | null;
  selectedSection: ScreenSection | null;
  enrichedScreens: EnrichedScreen[];
  activeSections: ScreenSection[];
  activeFields: ScreenField[];
  /** All fields for the selected screen (ungrouped), used by the unified panel */
  allScreenFields: ScreenField[];
  pagination: {
    screens: { page: number; total: number; pageSize: number; next: () => void; prev: () => void; setPage: (page: number) => void };
    sections: { page: number; total: number; pageSize: number; next: () => void; prev: () => void; setPage: (page: number) => void };
    fields: { page: number; total: number; pageSize: number; next: () => void; prev: () => void; setPage: (page: number) => void };
  };
  isLoading: boolean;
  isScreensLoading: boolean;
  isSectionsLoading: boolean;
  isFieldsLoading: boolean;
  initialData?: unknown;
  isPending: boolean;
}

export interface ScreenFieldsActions {
  setSelectedScreenId: (id: string | null) => void;
  setSelectedSectionId: (id: string | null) => void;
  handleScreenSelect: (id: string | null) => void;
  handleSectionSelect: (id: string | null) => void;
  handleAddField: () => void;
  /** Open the add-field modal pre-bound to a specific section (unified panel use-case) */
  handleAddFieldForSection: (sectionId: string) => void;
  handleEditField: (field: ScreenField) => void;
  handleSaveField: (field: ScreenField) => void;
  handleDeleteField: (fieldId: string) => void;
  handleReorderField: (fieldId: string, direction: 'up' | 'down') => void;
  handleAddSection: () => void;
  handleEditSection: (section: ScreenSection) => void;
  handleSaveSection: (section: ScreenSection) => void;
  handleDeleteSection: (sectionId: string) => void;
  handleToggleSectionStatus: (sectionId: string | number) => void;
  handleToggleScreenStatus: (screenId: string | number) => void;
  handleToggleGroupStatus: (groupId: string | number) => void;
  setShowFieldModal: (show: boolean) => void;
  setShowSectionModal: (show: boolean) => void;
  handleCloseFieldModal: () => void;
  handleCloseSectionModal: () => void;
  onManageData?: (field: ScreenField) => void;
  // Group actions
  openScreenModal: (action: 'add' | 'edit', id?: string | null) => void;
  openGroupModal: (action: 'add' | 'edit', id?: string | null) => void;
  saveScreen: (screen: ScreenConfig) => Promise<void>;
  deleteScreen: (id: string) => Promise<void>;
  saveGroup: (group: ScreenGroupConfig) => Promise<void>;
  deleteGroup: (id: string) => Promise<void>;
  closeModal: () => void;
}

export interface ScreenFieldsContextType extends ScreenFieldsData, ScreenFieldsActions, ScreenFieldsUI { }


// --- Hook & Service Specific Types ---

export interface MasterRecord {
  id: string;
  name: string;
  isActive?: boolean;
  status?: string;
  parentCategory?: string;
  group?: string;
}

export interface FieldFormHookProps {
  existingField: ScreenField | null | undefined;
  maxOrder: number;
  availableFields: ScreenField[];
  selectedScreen: ScreenConfig | null | undefined;
  onSave?: (field: ScreenField) => void;
  onClose?: () => void;
}

export interface FieldFormHookReturn {
  formData: FieldFormData;
  setFormData: React.Dispatch<React.SetStateAction<FieldFormData>>;
  newOptionValue: string;
  setNewOptionValue: (value: string) => void;
  newRuleFieldId: string;
  setNewRuleFieldId: (value: string) => void;
  newRuleValues: string[];
  setNewRuleValues: (values: string[]) => void;
  newRuleSubValues: string[];
  setNewRuleSubValues: (values: string[]) => void;
  isMasterLoading: boolean;
  parentField: ScreenField | undefined;
  parentFieldOptions: Array<{ label: string; value: string }>;
  activeSubCategoryOptions: Array<{ label: string; value: string }>;
  subCategoryFieldId: string;
  isDropdownConfig: boolean;
  conditionFieldOptions: Array<{ label: string; value: string }>;
  handleSave: () => void;
  errors: Record<string, string>;
}

export interface FieldListHookProps {
  fields: ScreenField[];
  sourceSectionId?: string | null;
  itemsPerPage: number;
  pagination?: { page: number; total: number; pageSize?: number; next: () => void; prev: () => void; setPage: (page: number) => void };
}

// --- Component Specific Props ---

export interface BasicInfoSectionProps {
  formData: FieldFormData;
  setFormData: React.Dispatch<React.SetStateAction<FieldFormData>>;
  toFieldName: (value: string) => string;
  existingField: ScreenField | null | undefined;
  errors?: Record<string, string>;
}

export interface DropdownConfigSectionProps {
  formData: FieldFormData;
  setFormData: React.Dispatch<React.SetStateAction<FieldFormData>>;
  newOptionValue: string;
  setNewOptionValue: (value: string) => void;
}

export interface FileConfigSectionProps {
  formData: FieldFormData;
  setFormData: React.Dispatch<React.SetStateAction<FieldFormData>>;
}

export interface ConditionalDisplaySectionProps {
  formData: FieldFormData;
  setFormData: React.Dispatch<React.SetStateAction<FieldFormData>>;
  conditionFieldOptions: Array<{ label: string; value: string }>;
  newRuleFieldId: string;
  setNewRuleFieldId: (value: string) => void;
  newRuleValues: string[];
  setNewRuleValues: (values: string[]) => void;
  newRuleSubValues: string[];
  setNewRuleSubValues: (values: string[]) => void;
  parentFieldOptions: Array<{ label: string; value: string }>;
  activeSubCategoryOptions: Array<{ label: string; value: string }>;
  isMasterLoading: boolean;
  parentField: ScreenField | undefined;
  subCategoryFieldId: string;
  availableFields: ScreenField[];
}

export interface ScreenFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (screen: ScreenConfig) => void;
  existingScreen: ScreenConfig | null;
  groups: ScreenGroupConfig[];
  allScreens: ScreenConfig[];
  isLoading?: boolean;
}

export interface GroupFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (group: ScreenGroupConfig) => void;
  existingGroup: ScreenGroupConfig | null;
  maxOrder: number;
  isLoading?: boolean;
}

export interface FieldTableProps {
  data: ScreenField[];
  onEditField: (field: ScreenField) => void;
  onDeleteField: (id: string) => void;
}

export interface FieldFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterFieldType: string;
  setFilterFieldType: (value: string) => void;
  filterStatus: string;
  setFilterStatus: (value: string) => void;
}

export interface FieldPaginationProps {
  currentPage: number;
  setCurrentPage: (page: number | ((prev: number) => number)) => void;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  totalCount: number;
}

type SetFormCallback = (prev: Partial<ScreenConfig>) => Partial<ScreenConfig>;

export interface GeneralConfigSectionProps {
  formData: Partial<ScreenConfig>;
  setFormData: (data: Partial<ScreenConfig> | SetFormCallback) => void;
  existingScreen?: ScreenConfig | null;
  errors?: Record<string, string>;
}

export interface HierarchySectionProps {
  formData: Partial<ScreenConfig>;
  setFormData: (data: Partial<ScreenConfig> | SetFormCallback) => void;
  groups: ScreenGroupConfig[];
  allScreens: ScreenConfig[];
  existingScreen?: ScreenConfig | null;
  errors?: Record<string, string>;
}

export interface RoutingConfigSectionProps {
  formData: Partial<ScreenConfig>;
  setFormData: (data: Partial<ScreenConfig> | SetFormCallback) => void;
  errors?: Record<string, string>;
}

export interface BackendApiSectionProps {
  formData: Partial<ScreenConfig>;
  setFormData: (data: Partial<ScreenConfig> | SetFormCallback) => void;
  errors?: Record<string, string>;
}

// --- Payload Types for API Mutations ---

export interface CreateScreenPayload {
  screenName: string;
  screenCode: string;
  moduleId: number | null;
  parentScreenId: number | null;
  isActive: boolean;
  displayOrder: number;
  isMenuVisible: boolean;
  isAuthenticationRequired: boolean;
  menuLevel: number | null;
  routePath: string | null;
  baseRoutePath: string | null;
  routeParamPattern: string | null;
  purpose: string | null;
  componentName: string | null;
  areaName: string | null;
  controllerName: string | null;
  actionName: string | null;
  screenNameLocal?: string;
  screenIcon?: string;
  createdBy: number;
}

export interface UpdateScreenPayload extends Omit<CreateScreenPayload, 'createdBy'> {
  id: number;
  updatedBy: number;
}

export interface CreateSectionPayload {
  screenId: number;
  sectionName: string;
  sectionNameLocal: string;
  sectionCode: string;
  sectionType: string;
  description: string;
  displayOrder: number;
  columnCount: number;
  isActive: boolean;
  isOptional: boolean;
  isCollapsible: boolean;
  isCollapsedByDefault: boolean;
  isRepeatable: boolean;
  parentSectionId: number | null;
  createdBy: number;
}

export interface UpdateSectionPayload extends Omit<CreateSectionPayload, 'createdBy'> {
  id: number;
  updatedBy: number;
}

export interface CreateFieldPayload {
  screenId: number;
  sectionId: number;
  fieldName: string;
  fieldLabel: string;
  fieldLabelLocal: string;
  fieldCode: string;
  dataType: string;
  controlType: string;
  placeholder: string;
  defaultValue: string;
  displayOrder: number;
  columnSpan: number;
  isActive: boolean;
  isRequired: boolean;
  isReadonly: boolean;
  isVisible: boolean;
  isUnique: boolean;
  isSearchable: boolean;
  isFilterable: boolean;
  minLength: number;
  maxLength: number;
  minValue: number;
  maxValue: number;
  regexPattern: string;
  validationMessage: string;
  validationJson: string;
  extraConfigJson: string;
  staticOptionsJson: string;
  visibilityConditionJson: string;
  createdBy: number;
}

export interface UpdateFieldPayload extends Omit<CreateFieldPayload, 'createdBy'> {
  id: number;
  updatedBy: number;
}

export interface CreateGroupPayload {
  groupName: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
  createdBy: number;
}

export interface UpdateGroupPayload extends Omit<CreateGroupPayload, 'createdBy'> {
  id: number;
  updatedBy: number;
}

// ==========================================
// 5. Asset Field Definition Types (New Business Logic)
// ==========================================

export interface AssetFieldDefinition {
  id: number;
  assetCategoryId: number;
  assetTypeId: number;
  fieldCode: string;
  fieldName: string;
  fieldLabel: string;
  fieldType: string;
  fieldGroup?: string | null;
  isRequired: boolean;
  displayOrder: number;
  validationRules?: string | null;
  defaultValue?: string | null;
  minValue?: number | null;
  maxValue?: number | null;
  maxLength?: number | null;
  isActive: boolean;
  createdDate?: string;
  modifiedDate?: string;
  createdBy?: number;
  updatedBy?: number;
}

export type FieldDefinitionFormData = Partial<AssetFieldDefinition>;

