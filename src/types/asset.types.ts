import React from 'react';

/* =============================================================================
   CORE ASSET TYPES (SCREEN, SECTION, FIELD)
   ============================================================================= */

export interface AssetUser {
  id: string;
  name: string;
  role: string;
  accessibleScreenCodes?: string[];
  screenStates?: Record<string, boolean>;
}

export interface ScreenItem {
  screenCode: string;
  screenPath: string;
}

export interface AssetRequestItem {
  id: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  route: string;
}

export interface SidebarSection {
  id: string;
  label: string;
  icon: React.ElementType;
  items: MenuItem[];
  colorClass: string;
}

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

export type FieldOptionsSource = 'manual' | 'linkedMaster' | 'master';

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

export interface ScreenField {
  id: string;
  fieldName: string;
  label: string;
  fieldLabel?: string;
  fieldLabelLocal?: string;
  fieldCode?: string;
  placeholder?: string;
  fieldType: FieldType;
  controlType?: string;
  dataType?: string;
  required: boolean;
  isRequired?: boolean;
  options?: FieldOption[];
  staticOptionsJson?: string;
  optionsSource?: FieldOptionsSource;
  masterKey?: string;
  dropdownSourceId?: number;
  linkedMasterId?: string;
  linkedMasterLabel?: string;
  linkedMasterSection?: string;
  linkedMasterScreen?: string;
  dependsOnFieldId?: string;
  dependsOnFieldName?: string;
  parentFieldId?: number;
  conditionalDisplay?: ConditionalRule[];
  visibilityConditionJson?: string;
  validationRules?: ValidationRule[];
  validationJson?: string;
  extraConfigJson?: string;
  defaultValue?: string | number | boolean;
  helpText?: string;
  cssClass?: string;
  columnSpan?: number;
  isReadonly?: boolean;
  isVisible?: boolean;
  isUnique?: boolean;
  isSearchable?: boolean;
  isFilterable?: boolean;
  isCascading?: boolean;
  isMultiSelect?: boolean;
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
  regexPattern?: string;
  validationMessage?: string;
  enablePropertyLookup?: boolean;
  allowMultiple?: boolean;
  accept?: string;
  buttonAction?: string;
  buttonStyle?: 'primary' | 'secondary' | 'success' | 'danger';
  order: number;
  displayOrder?: number;
  isActive: boolean;
  createdDate: string;
  modifiedDate?: string;
  screenId?: number;
  sectionId?: number;
}

export type GroupedScreenField = ScreenField & {
  sourceSectionId?: string;
  sourceSectionLabel?: string;
  sourceScreenName?: string;
  sourceScreenId?: string;
};

export type FieldRow = GroupedScreenField;

export interface ScreenSection {
  id: string;
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
  createdDate: string;
  modifiedDate?: string;
  screenId?: number;
  parentSectionId?: number;
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

export interface EnrichedScreen extends ScreenConfig {
  sectionsCount: number;
  fieldsCount: number;
}

/* =============================================================================
   MASTER DATA TYPES
   ============================================================================= */

export interface UlbMaster {
  id: number;
  ulbCode: string;
  ulbName: string;
  ulbNameLocal?: string;
  ulbTypeId: number;
  ulbLogo?: string;
  email?: string;
  phoneNo?: string;
  websiteUrl?: string;
  ulbAddress?: string;
  isActive: boolean;
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
  meta?: Record<string, string | number | boolean | null>;
  [key: string]: any;
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
  inventoryType: MasterDataRecord[];
  inventorySubType: MasterDataRecord[];
  furnitureItemName: MasterDataRecord[];
  furnitureTypeModel: MasterDataRecord[];
  equipmentName: MasterDataRecord[];
  equipmentBrandModel: MasterDataRecord[];
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
  electronicFixturesName: MasterDataRecord[];
  electronicFixturesModel: MasterDataRecord[];
  vehicleType: MasterDataRecord[];
  vehicleMakeModel: MasterDataRecord[];
}

export type MasterKey = keyof MasterDataConfig;

export interface LinkedFieldMasterBucket {
  id: string;
  fieldId: string;
  fieldName: string;
  fieldLabel: string;
  fieldType: string;
  screenName: string;
  sectionId: string;
  sectionLabel: string;
  masterKey?: string;
  dependsOnFieldId?: string;
  parentBucketId?: string;
  isActive: boolean;
  createdDate: string;
  modifiedDate?: string;
  records: MasterDataRecord[];
}

export interface LinkedFieldMasterMeta {
  fieldId: string;
  fieldName: string;
  fieldLabel: string;
  fieldType: string;
  screenName: string;
  sectionId: string;
  sectionLabel: string;
  masterKey?: string;
  dependsOnFieldId?: string;
  seedOptions?: Array<{ value: string; label: string }>;
}

export interface ConfigurationMasterContextType {
  masterData: MasterDataConfig;
  linkedFieldMasters: LinkedFieldMasterBucket[];
  isLoading: boolean;
  isMutating: boolean;
  getMasterDataByKey: (key: MasterKey) => MasterDataRecord[];
  getActiveDataByKey: (key: MasterKey) => MasterDataRecord[];
  getDependentData: (key: MasterKey, parentId: string) => MasterDataRecord[];
  addMasterData: (key: MasterKey, record: Omit<MasterDataRecord, 'id' | 'createdDate'>) => void;
  updateMasterData: (key: MasterKey, id: number, record: Partial<MasterDataRecord>) => void;
  deleteMasterData: (key: MasterKey, id: number) => void;
  toggleActiveStatus: (key: MasterKey, id: number) => void;
  refreshMasterData: () => void;
  ensureLinkedFieldMaster: (meta: LinkedFieldMasterMeta) => LinkedFieldMasterBucket;
  ensureLinkedFieldMasters: (metas: LinkedFieldMasterMeta[]) => LinkedFieldMasterBucket[];
  getLinkedFieldMasterByFieldId: (fieldId: string) => LinkedFieldMasterBucket | null;
  getLinkedFieldMasterById: (bucketId: string) => LinkedFieldMasterBucket | null;
  getLinkedFieldMasterRecords: (bucketId: string) => MasterDataRecord[];
  addLinkedFieldMasterRecord: (bucketId: string, record: Omit<MasterDataRecord, 'id' | 'createdDate'>) => void;
  updateLinkedFieldMasterRecord: (bucketId: string, id: number, record: Partial<MasterDataRecord>) => void;
  deleteLinkedFieldMasterRecord: (bucketId: string, id: number) => void;
  toggleLinkedFieldMasterRecordStatus: (bucketId: string, id: number) => void;
  toggleLinkedFieldMasterStatus: (bucketId: string) => void;
  deleteLinkedFieldMaster: (bucketId: string) => void;
  getOrphanMasterIds: () => string[];
}

export interface MasterConfig {
  id: MasterKey | 'inventoryMaster';
  label: string;
  icon: React.ElementType;
  color: string;
  fields: readonly FieldConfig[];
  dependsOn?: MasterKey;
}

export interface FieldConfig {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select';
  required: boolean;
  placeholder?: string;
  masterKey?: MasterKey;
  dependsOnFieldId?: string;
}

/* =============================================================================
   FLOW & DOCUMENT DEFINITIONS
   ============================================================================= */

export type AssetDocumentCategory = 'building' | 'land' | 'infrastructure' | 'movable';
export type AssetDocumentSectionKey = 'basicInfo' | 'legalSafety' | 'inventory' | 'valuation';
export type AssetDocumentIconKey = 'building' | 'shield' | 'inventory' | 'valuation';
export type AssetInventoryIconKey = 'package' | 'fileText' | 'camera' | 'truck';

export interface AssetDocumentFileDefinition {
  id: string;
  fieldName: string;
  documentName: string;
  stage: string;
  categories: AssetDocumentCategory[];
  fileNameFallback: string;
  iconKind: 'photo' | 'document';
  isArray?: boolean;
}

export interface AssetInventoryCollectionDefinition {
  id: string;
  collectionKey: 'furnitureItems' | 'itEquipmentItems' | 'electronicFixturesItems' | 'vehicleItems';
  itemType: string;
  itemIconKey: AssetInventoryIconKey;
  stage: string;
  categories: AssetDocumentCategory[];
  itemNameField: string;
  detailFieldName: string;
  quantityFieldName: string;
  detailMode: 'quantity' | 'registration';
  photoFieldName: string;
  invoiceIdFieldName: string;
  invoiceNumberFieldName: string;
  invoiceDateFieldName: string;
}

export interface AssetDocumentSectionDefinition {
  id: string;
  sectionKey: AssetDocumentSectionKey;
  label: string;
  description: string;
  iconKey: AssetDocumentIconKey;
  categories: AssetDocumentCategory[];
  emptyMessage: string;
  emptyDescription: string;
  fileDocuments: AssetDocumentFileDefinition[];
  inventoryDocuments?: AssetInventoryCollectionDefinition[];
}

export interface AddAssetFlowStepDefinition {
  id: number;
  name: string;
  iconKey: AssetDocumentIconKey | 'inventory';
}

export interface AddAssetFlowDefinition {
  category: AssetDocumentCategory;
  steps: AddAssetFlowStepDefinition[];
}

/* =============================================================================
   SERVICE & DASHBOARD TYPES
   ============================================================================= */

export interface Stat {
  label: string;
  value: string;
}

export interface Service {
  id: number;
  link: string;
  icon: string;
  title: string;
  subtext: string;
  stats?: Stat[];
}

export interface DashboardData {
  id: string;
  route: string;
  status: 'Active' | 'Delayed' | 'Completed';
  vehicles: number;
  lastUpdate: string;
  [key: string]: unknown;
}

/* =============================================================================
   COMPONENT PROPS TYPES
   ============================================================================= */

export interface AssetSidebarProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  currentPage?: string;
  onNavigate?: (page: string) => void;
  isSidebarExpanded: boolean;
  setSidebarExpanded: (expanded: boolean) => void;
}

export interface FieldListProps {
  fields: FieldRow[];
  groupedFieldCount?: number;
  variantCount?: number;
  onAddField?: () => void;
  onEditField?: (field: FieldRow) => void;
  onDeleteField?: (fieldId: string, sourceSectionId?: string) => void;
  onToggleFieldStatus?: (fieldId: string, sourceSectionId?: string) => void;
  onReorderField?: (fieldId: string, direction: 'up' | 'down', sourceSectionId?: string) => void;
  onManageData?: (field: FieldRow) => void;
  sectionName?: string;
  sourceSectionId?: string | null;
  sourceSectionLabel?: string | null;
  screenName?: string | null;
}

export interface ScreenListProps {
  screens: ScreenConfig[];
  selectedScreenId: string | null;
  onScreenSelect: (screenId: string) => void;
}

export interface SectionListProps {
  sections: ScreenSection[];
  selectedSectionId: string | null;
  onSectionSelect: (sectionId: string) => void;
  onAddSection: () => void;
  screenName?: string;
  onEditSection?: (section: ScreenSection) => void;
  onDeleteSection?: (sectionId: string) => void;
  onToggleSectionStatus?: (sectionId: string) => void;
}

export interface SectionGroup {
  groupLabel: string;
  sections: ScreenSection[];
  fieldsCount: number;
  firstOrder: number;
}

export interface InlineMultiSelectOption {
  label: string;
  value: string;
}

export interface InlineMultiSelectProps {
  label?: string;
  options: InlineMultiSelectOption[];
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
}

export interface FieldFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (field: ScreenField) => void;
  existingField?: ScreenField | null;
  maxOrder: number;
  availableFields?: ScreenField[];
  onManageData?: (field: ScreenField) => void;
}

export interface SectionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (section: ScreenSection) => void;
  existingSection?: ScreenSection | null;
  maxOrder: number;
  screenName?: string;
}

export type SectionFormValues = Partial<ScreenSection> & {
  sectionCode?: string;
};

export interface GroupFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (group: ScreenGroupConfig) => void;
  existingGroup: ScreenGroupConfig | null;
  maxOrder: number;
}

export interface ConfigurationMasterProps {
  initialScreenConfigs?: ScreenConfig[];
}

export interface ScreenFieldsMasterProps {
  onManageData?: (field: GroupedScreenField) => void;
}

export interface FieldListShellProps {
  sections: ScreenSection[];
  sectionName?: string;
  screenId?: string;
}

export interface ScreenListShellProps {
  initialScreens: ScreenConfig[];
}

export interface SectionListShellProps {
  initialSections: ScreenSection[];
  screenName?: string;
}
