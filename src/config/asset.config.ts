/**
 * Asset Module Configuration
 * --------------------------
 * Centralized configuration for the Asset module, including:
 * - Master Data Type Definitions (MASTER_CONFIGS)
 * - Sidebar Navigation (sidebarItems, ASSET_MENU_SECTIONS)
 * - Default Data Shapes (createEmptyMasterData)
 * - Screen Field Options (FIELD_TYPE_OPTIONS)
 */

import {
  // Master Module Icons
  AlertCircle,
  Box,
  Briefcase,
  Building2,
  Database,
  FileText,
  Grid3x3,
  Home,
  Layers,
  List,
  Map as MapIcon,
  MapPin,
  Monitor,
  Package,
  Shield,
  Square,
  Tag,
  TreeDeciduous,
  // Sidebar Icons
  LayoutDashboard,
  RefreshCw,
  Gavel,
  Zap,
  ClipboardCheck,
  ShieldAlert,
  Users,
  CreditCard,
  Rocket,
  BarChart3,
  TrendingUp,
  Send,
  ClipboardList,
  Wrench,
  Settings,
  LayoutGrid,
} from 'lucide-react';
import type { 
  MasterConfig, 
  SidebarSection, 
  MasterDataConfig 
} from '@/types/asset.types';

/* =============================================================================
   1. MASTER DATA TYPE DEFINITIONS (MASTER_CONFIGS)
   ============================================================================= */

export const MASTER_MODULE_GROUPS = {
  MAIN_NAV: [
    'assetCategory',
    'assetType',
    'zone',
    'ward',
    'propertyCategory',
    'propertySubCategory',
    'owningDepartment',
    'ownershipType',
    'maintainingDepartment',
  ],
  INVENTORY_CHILDREN: [
    'inventoryType',
    'inventorySubType',
    'furnitureItemName',
    'furnitureTypeModel',
    'equipmentName',
    'equipmentBrandModel',
    'inventoryCondition',
    'equipmentStatus',
  ]
} as const;

export const MASTER_CONFIGS: MasterConfig[] = [
  {
    id: 'assetCategory',
    label: 'Asset Category Master',
    icon: Building2,
    color: 'blue',
    fields: [
      { name: 'code', label: 'Category Code', type: 'text', required: true, placeholder: 'e.g., AC-001' },
      { name: 'name', label: 'Category Name', type: 'text', required: true, placeholder: 'e.g., Commercial Building' },
      { name: 'description', label: 'Description', type: 'textarea', required: false, placeholder: 'Category details' },
      { name: 'templateKey', label: 'Form Template Key', type: 'text', required: false, placeholder: 'building / land / infrastructure / movable' },
      { name: 'hiddenSectionKeys', label: 'Hidden Section Keys', type: 'textarea', required: false, placeholder: 'Comma-separated keys, e.g. buildingSafety, valuation, documents' },
    ],
  },
  {
    id: 'assetType',
    label: 'Asset Type Master',
    icon: Layers,
    color: 'blue',
    dependsOn: 'assetCategory',
    fields: [
      { name: 'code', label: 'Asset Type Code', type: 'text', required: true, placeholder: 'e.g., AT-001' },
      { name: 'name', label: 'Asset Type Name', type: 'text', required: true, placeholder: 'e.g., Office Building' },
      { name: 'parentCategory', label: 'Parent Category', type: 'select', required: true, placeholder: 'Select Asset Category', masterKey: 'assetCategory' },
      { name: 'description', label: 'Description', type: 'textarea', required: false, placeholder: 'Type details' },
    ],
  },
  {
    id: 'zone',
    label: 'Zone Master',
    icon: MapIcon,
    color: 'blue',
    fields: [
      { name: 'code', label: 'Zone Code', type: 'text', required: true, placeholder: 'e.g., Z-001' },
      { name: 'name', label: 'Zone Name', type: 'text', required: true, placeholder: 'e.g., Zone A - North' },
      { name: 'description', label: 'Description', type: 'textarea', required: false, placeholder: 'Zone details' },
    ],
  },
  {
    id: 'ward',
    label: 'Ward Master',
    icon: MapPin,
    color: 'blue',
    dependsOn: 'zone',
    fields: [
      { name: 'code', label: 'Ward Code', type: 'text', required: true, placeholder: 'e.g., W-001' },
      { name: 'name', label: 'Ward Name', type: 'text', required: true, placeholder: 'e.g., Ward 1' },
      { name: 'parentCategory', label: 'Zone', type: 'select', required: true, placeholder: 'Select Zone', masterKey: 'zone' },
      { name: 'description', label: 'Description', type: 'textarea', required: false, placeholder: 'Ward details' },
    ],
  },
  {
    id: 'propertyCategory',
    label: 'Property Category Master',
    icon: Home,
    color: 'blue',
    fields: [
      { name: 'code', label: 'Property Category Code', type: 'text', required: true, placeholder: 'e.g., PC-001' },
      { name: 'name', label: 'Category Name', type: 'text', required: true, placeholder: 'e.g., Residential' },
      { name: 'description', label: 'Description', type: 'textarea', required: false, placeholder: 'Category details' },
    ],
  },
  {
    id: 'propertySubCategory',
    label: 'Property Sub-Category Master',
    icon: FileText,
    color: 'blue',
    dependsOn: 'assetType',
    fields: [
      { name: 'code', label: 'Sub-Category Code', type: 'text', required: true, placeholder: 'e.g., PSC-001' },
      { name: 'name', label: 'Sub-Category Name', type: 'text', required: true, placeholder: 'e.g., Apartment' },
      { name: 'parentCategory', label: 'Asset Type', type: 'select', required: true, placeholder: 'Select Asset Type', masterKey: 'assetType' },
      { name: 'description', label: 'Description', type: 'textarea', required: false, placeholder: 'Sub-category details' },
    ],
  },
  {
    id: 'owningDepartment',
    label: 'Owning Department',
    icon: Briefcase,
    color: 'blue',
    fields: [
      { name: 'code', label: 'Department Code', type: 'text', required: true, placeholder: 'e.g., DEPT-001' },
      { name: 'name', label: 'Department Name', type: 'text', required: true, placeholder: 'e.g., Public Works Department' },
      { name: 'description', label: 'Description', type: 'textarea', required: false, placeholder: 'Department responsibilities' },
    ],
  },
  {
    id: 'ownershipType',
    label: 'Ownership Type',
    icon: Shield,
    color: 'blue',
    fields: [
      { name: 'code', label: 'Ownership Code', type: 'text', required: true, placeholder: 'e.g., OT-001' },
      { name: 'name', label: 'Ownership Type', type: 'text', required: true, placeholder: 'e.g., Municipal Owned' },
      { name: 'description', label: 'Description', type: 'textarea', required: false, placeholder: 'Ownership details' },
    ],
  },
  {
    id: 'maintainingDepartment',
    label: 'Maintaining Department',
    icon: Briefcase,
    color: 'blue',
    fields: [
      { name: 'code', label: 'Department Code', type: 'text', required: true, placeholder: 'e.g., MDEPT-001' },
      { name: 'name', label: 'Department Name', type: 'text', required: true, placeholder: 'e.g., Public Works' },
      { name: 'description', label: 'Description', type: 'textarea', required: false, placeholder: 'Maintenance department responsibilities' },
    ],
  },
  {
    id: 'yesNo',
    label: 'Yes / No Master',
    icon: Shield,
    color: 'blue',
    fields: [
      { name: 'code', label: 'Option Code', type: 'text', required: true, placeholder: 'e.g., YN-001' },
      { name: 'name', label: 'Option Name', type: 'text', required: true, placeholder: 'Yes / No' },
      { name: 'description', label: 'Description', type: 'textarea', required: false, placeholder: 'Option details' },
    ],
  },
  {
    id: 'landAreaUnit',
    label: 'Land Area Unit Master',
    icon: Square,
    color: 'blue',
    fields: [
      { name: 'code', label: 'Unit Code', type: 'text', required: true, placeholder: 'e.g., AU-001' },
      { name: 'name', label: 'Unit Name', type: 'text', required: true, placeholder: 'e.g., Sq.m' },
      { name: 'description', label: 'Description', type: 'textarea', required: false, placeholder: 'Unit details' },
    ],
  },
  {
    id: 'landShape',
    label: 'Land Shape Master',
    icon: Square,
    color: 'blue',
    fields: [
      { name: 'code', label: 'Shape Code', type: 'text', required: true, placeholder: 'e.g., LS-001' },
      { name: 'name', label: 'Shape Name', type: 'text', required: true, placeholder: 'e.g., Rectangular' },
      { name: 'description', label: 'Description', type: 'textarea', required: false, placeholder: 'Shape details' },
    ],
  },
  {
    id: 'encumbranceStatus',
    label: 'Encumbrance Status Master',
    icon: Shield,
    color: 'blue',
    fields: [
      { name: 'code', label: 'Status Code', type: 'text', required: true, placeholder: 'e.g., EN-001' },
      { name: 'name', label: 'Status Name', type: 'text', required: true, placeholder: 'e.g., Free' },
      { name: 'description', label: 'Description', type: 'textarea', required: false, placeholder: 'Encumbrance details' },
    ],
  },
  {
    id: 'terrainType',
    label: 'Terrain Type Master',
    icon: Square,
    color: 'blue',
    fields: [
      { name: 'code', label: 'Terrain Code', type: 'text', required: true, placeholder: 'e.g., TT-001' },
      { name: 'name', label: 'Terrain Type', type: 'text', required: true, placeholder: 'e.g., Flat' },
      { name: 'description', label: 'Description', type: 'textarea', required: false, placeholder: 'Terrain details' },
    ],
  },
  {
    id: 'approachRoadType',
    label: 'Approach Road Type Master',
    icon: MapIcon,
    color: 'blue',
    fields: [
      { name: 'code', label: 'Approach Road Code', type: 'text', required: true, placeholder: 'e.g., ART-001' },
      { name: 'name', label: 'Approach Road Type', type: 'text', required: true, placeholder: 'e.g., CC (Cement Concrete)' },
      { name: 'description', label: 'Description', type: 'textarea', required: false, placeholder: 'Approach road details' },
    ],
  },
  {
    id: 'surroundingDevelopment',
    label: 'Surrounding Development Master',
    icon: Layers,
    color: 'blue',
    fields: [
      { name: 'code', label: 'Development Code', type: 'text', required: true, placeholder: 'e.g., SD-001' },
      { name: 'name', label: 'Development Type', type: 'text', required: true, placeholder: 'e.g., Residential' },
      { name: 'description', label: 'Description', type: 'textarea', required: false, placeholder: 'Development details' },
    ],
  },
  {
    id: 'currentLandUsage',
    label: 'Current Land Usage Master',
    icon: Home,
    color: 'blue',
    fields: [
      { name: 'code', label: 'Usage Code', type: 'text', required: true, placeholder: 'e.g., CLU-001' },
      { name: 'name', label: 'Usage Type', type: 'text', required: true, placeholder: 'e.g., Vacant' },
      { name: 'description', label: 'Description', type: 'textarea', required: false, placeholder: 'Land usage details' },
    ],
  },
  {
    id: 'buildableStatus',
    label: 'Buildable Status Master',
    icon: Home,
    color: 'blue',
    fields: [
      { name: 'code', label: 'Status Code', type: 'text', required: true, placeholder: 'e.g., BS-001' },
      { name: 'name', label: 'Buildable Status', type: 'text', required: true, placeholder: 'e.g., Buildable' },
      { name: 'description', label: 'Description', type: 'textarea', required: false, placeholder: 'Buildable status details' },
    ],
  },
  {
    id: 'floodProneArea',
    label: 'Flood Prone Area Master',
    icon: AlertCircle,
    color: 'blue',
    fields: [
      { name: 'code', label: 'Option Code', type: 'text', required: true, placeholder: 'e.g., FPA-001' },
      { name: 'name', label: 'Option Name', type: 'text', required: true, placeholder: 'Yes / No' },
      { name: 'description', label: 'Description', type: 'textarea', required: false, placeholder: 'Flood risk option details' },
    ],
  },
  {
    id: 'inventoryType',
    label: 'Inventory Type Master',
    icon: Package,
    color: 'blue',
    fields: [
      { name: 'code', label: 'Inventory Type Code', type: 'text', required: true, placeholder: 'e.g., IT-001' },
      { name: 'name', label: 'Type Name', type: 'text', required: true, placeholder: 'e.g., Office Supplies' },
      { name: 'description', label: 'Description', type: 'textarea', required: false, placeholder: 'Inventory type details' },
    ],
  },
  {
    id: 'inventorySubType',
    label: 'Inventory Sub-Type Master',
    icon: Box,
    color: 'blue',
    dependsOn: 'inventoryType',
    fields: [
      { name: 'code', label: 'Sub-Type Code', type: 'text', required: true, placeholder: 'e.g., IST-001' },
      { name: 'name', label: 'Sub-Type Name', type: 'text', required: true, placeholder: 'e.g., Stationery' },
      { name: 'parentCategory', label: 'Inventory Type', type: 'select', required: true, placeholder: 'Select Inventory Type', masterKey: 'inventoryType' },
      { name: 'description', label: 'Description', type: 'textarea', required: false, placeholder: 'Sub-type details' },
    ],
  },
  {
    id: 'furnitureItemName',
    label: 'Furniture Item Name Master',
    icon: List,
    color: 'blue',
    dependsOn: 'assetType',
    fields: [
      { name: 'code', label: 'Item Code', type: 'text', required: true, placeholder: 'e.g., FIN-001' },
      { name: 'name', label: 'Item Name', type: 'text', required: true, placeholder: 'e.g., Office Tables' },
      { name: 'parentCategory', label: 'Asset Type', type: 'select', required: false, placeholder: 'Select Asset Type', masterKey: 'assetType' },
      { name: 'description', label: 'Description', type: 'textarea', required: false, placeholder: 'Furniture item details' },
    ],
  },
  {
    id: 'furnitureTypeModel',
    label: 'Furniture Type / Model Master',
    icon: Grid3x3,
    color: 'blue',
    dependsOn: 'furnitureItemName',
    fields: [
      { name: 'code', label: 'Type / Model Code', type: 'text', required: true, placeholder: 'e.g., FTM-001' },
      { name: 'name', label: 'Type / Model Name', type: 'text', required: true, placeholder: 'e.g., Wooden' },
      { name: 'parentCategory', label: 'Furniture Item', type: 'select', required: true, placeholder: 'Select Furniture Item', masterKey: 'furnitureItemName' },
      { name: 'description', label: 'Description', type: 'textarea', required: false, placeholder: 'Furniture type/model details' },
    ],
  },
  {
    id: 'equipmentName',
    label: 'Equipment Name Master',
    icon: Monitor,
    color: 'blue',
    dependsOn: 'assetType',
    fields: [
      { name: 'code', label: 'Equipment Code', type: 'text', required: true, placeholder: 'e.g., EQN-001' },
      { name: 'name', label: 'Equipment Name', type: 'text', required: true, placeholder: 'e.g., Desktop Computers' },
      { name: 'parentCategory', label: 'Asset Type', type: 'select', required: false, placeholder: 'Select Asset Type', masterKey: 'assetType' },
      { name: 'description', label: 'Description', type: 'textarea', required: false, placeholder: 'Equipment details' },
    ],
  },
  {
    id: 'equipmentBrandModel',
    label: 'Equipment Brand / Model Master',
    icon: Tag,
    color: 'blue',
    dependsOn: 'equipmentName',
    fields: [
      { name: 'code', label: 'Brand / Model Code', type: 'text', required: true, placeholder: 'e.g., EBM-001' },
      { name: 'name', label: 'Brand / Model Name', type: 'text', required: true, placeholder: 'e.g., Dell OptiPlex' },
      { name: 'parentCategory', label: 'Equipment Name', type: 'select', required: true, placeholder: 'Select Equipment Name', masterKey: 'equipmentName' },
      { name: 'description', label: 'Description', type: 'textarea', required: false, placeholder: 'Brand/model details' },
    ],
  },
  {
    id: 'electronicFixturesName',
    label: 'Electronic Fixtures Name Master',
    icon: Monitor,
    color: 'blue',
    dependsOn: 'assetType',
    fields: [
      { name: 'code', label: 'Fixture Code', type: 'text', required: true, placeholder: 'e.g. EF-001' },
      { name: 'name', label: 'Fixture Name', type: 'text', required: true, placeholder: 'e.g. Air Conditioner' },
      { name: 'parentCategory', label: 'Asset Type', type: 'select', required: false, placeholder: 'Select Asset Type', masterKey: 'assetType' },
      { name: 'description', label: 'Description', type: 'textarea', required: false },
    ],
  },
  {
    id: 'electronicFixturesModel',
    label: 'Electronic Fixtures Model Master',
    icon: Tag,
    color: 'blue',
    dependsOn: 'electronicFixturesName',
    fields: [
      { name: 'code', label: 'Model Code', type: 'text', required: true, placeholder: 'e.g. EFM-001' },
      { name: 'name', label: 'Model Name', type: 'text', required: true, placeholder: 'e.g. 1.5 Ton Split' },
      { name: 'parentCategory', label: 'Fixture Name', type: 'select', required: true, placeholder: 'Select Fixture Name', masterKey: 'electronicFixturesName' },
      { name: 'description', label: 'Description', type: 'textarea', required: false },
    ],
  },
  {
    id: 'vehicleType',
    label: 'Vehicle Type Master',
    icon: Package,
    color: 'blue',
    dependsOn: 'assetType',
    fields: [
      { name: 'code', label: 'Type Code', type: 'text', required: true, placeholder: 'e.g. VH-001' },
      { name: 'name', label: 'Type Name', type: 'text', required: true, placeholder: 'e.g. Car' },
      { name: 'parentCategory', label: 'Asset Type', type: 'select', required: false, placeholder: 'Select Asset Type', masterKey: 'assetType' },
      { name: 'description', label: 'Description', type: 'textarea', required: false },
    ],
  },
  {
    id: 'vehicleMakeModel',
    label: 'Vehicle Make / Model Master',
    icon: Tag,
    color: 'blue',
    dependsOn: 'vehicleType',
    fields: [
      { name: 'code', label: 'Model Code', type: 'text', required: true, placeholder: 'e.g. VM-001' },
      { name: 'name', label: 'Model Name', type: 'text', required: true, placeholder: 'e.g. Maruti Suzuki' },
      { name: 'parentCategory', label: 'Vehicle Type', type: 'select', required: true, placeholder: 'Select Vehicle Type', masterKey: 'vehicleType' },
      { name: 'description', label: 'Description', type: 'textarea', required: false },
    ],
  },
  {
    id: 'inventoryCondition',
    label: 'Inventory Condition Master',
    icon: Shield,
    color: 'blue',
    fields: [
      { name: 'code', label: 'Condition Code', type: 'text', required: true, placeholder: 'e.g., IC-001' },
      { name: 'name', label: 'Condition Name', type: 'text', required: true, placeholder: 'e.g., Good' },
      { name: 'description', label: 'Description', type: 'textarea', required: false, placeholder: 'Inventory condition details' },
    ],
  },
  {
    id: 'equipmentStatus',
    label: 'Equipment Status Master',
    icon: Database,
    color: 'blue',
    fields: [
      { name: 'code', label: 'Status Code', type: 'text', required: true, placeholder: 'e.g., ES-001' },
      { name: 'name', label: 'Status Name', type: 'text', required: true, placeholder: 'e.g., Working' },
      { name: 'description', label: 'Description', type: 'textarea', required: false, placeholder: 'Equipment status details' },
    ],
  },
  {
    id: 'landClassification',
    label: 'Land Classification Master',
    icon: TreeDeciduous,
    color: 'blue',
    fields: [
      { name: 'code', label: 'Classification Code', type: 'text', required: true, placeholder: 'e.g., LC-001' },
      { name: 'name', label: 'Classification Name', type: 'text', required: true, placeholder: 'e.g., Agricultural' },
      { name: 'description', label: 'Description', type: 'textarea', required: false, placeholder: 'Land classification details' },
    ],
  },
  {
    id: 'plotBoundaryType',
    label: 'Plot Boundary Type Master',
    icon: Square,
    color: 'blue',
    fields: [
      { name: 'code', label: 'Boundary Type Code', type: 'text', required: true, placeholder: 'e.g., PB-001' },
      { name: 'name', label: 'Boundary Type', type: 'text', required: true, placeholder: 'e.g., Fenced' },
      { name: 'description', label: 'Description', type: 'textarea', required: false, placeholder: 'Boundary details' },
    ],
  },
  {
    id: 'roadCategory',
    label: 'Road Category Master',
    icon: MapIcon,
    color: 'blue',
    fields: [
      { name: 'code', label: 'Road Category Code', type: 'text', required: true, placeholder: 'e.g., RC-001' },
      { name: 'name', label: 'Road Category Name', type: 'text', required: true, placeholder: 'e.g., Arterial Road' },
      { name: 'description', label: 'Description', type: 'textarea', required: false, placeholder: 'Road category details' },
    ],
  },
  {
    id: 'roadClass',
    label: 'Road Class Master',
    icon: Layers,
    color: 'blue',
    fields: [
      { name: 'code', label: 'Road Class Code', type: 'text', required: true, placeholder: 'e.g., RCL-001' },
      { name: 'name', label: 'Road Class Name', type: 'text', required: true, placeholder: 'e.g., Class I' },
      { name: 'description', label: 'Description', type: 'textarea', required: false, placeholder: 'Road class details' },
    ],
  },
  {
    id: 'numberOfLanes',
    label: 'Number of Lanes Master',
    icon: Grid3x3,
    color: 'blue',
    fields: [
      { name: 'code', label: 'Lane Code', type: 'text', required: true, placeholder: 'e.g., NL-001' },
      { name: 'name', label: 'Lane Count', type: 'text', required: true, placeholder: 'e.g., 2 Lane' },
      { name: 'description', label: 'Description', type: 'textarea', required: false, placeholder: 'Lane details' },
    ],
  },
  {
    id: 'surfaceType',
    label: 'Surface Type Master',
    icon: Square,
    color: 'blue',
    fields: [
      { name: 'code', label: 'Surface Code', type: 'text', required: true, placeholder: 'e.g., ST-001' },
      { name: 'name', label: 'Surface Type', type: 'text', required: true, placeholder: 'e.g., Asphalt' },
      { name: 'description', label: 'Description', type: 'textarea', required: false, placeholder: 'Surface details' },
    ],
  },
  {
    id: 'condition',
    label: 'Condition Master',
    icon: Shield,
    color: 'blue',
    fields: [
      { name: 'code', label: 'Condition Code', type: 'text', required: true, placeholder: 'e.g., COND-001' },
      { name: 'name', label: 'Condition Name', type: 'text', required: true, placeholder: 'e.g., Good' },
      { name: 'description', label: 'Description', type: 'textarea', required: false, placeholder: 'Condition details' },
    ],
  },
  {
    id: 'trafficFlow',
    label: 'Traffic Flow Master',
    icon: MapPin,
    color: 'blue',
    fields: [
      { name: 'code', label: 'Traffic Flow Code', type: 'text', required: true, placeholder: 'e.g., TF-001' },
      { name: 'name', label: 'Traffic Flow', type: 'text', required: true, placeholder: 'e.g., Heavy' },
      { name: 'description', label: 'Description', type: 'textarea', required: false, placeholder: 'Traffic flow details' },
    ],
  },
  {
    id: 'medianType',
    label: 'Median Type Master',
    icon: Square,
    color: 'blue',
    fields: [
      { name: 'code', label: 'Median Code', type: 'text', required: true, placeholder: 'e.g., MT-001' },
      { name: 'name', label: 'Median Type', type: 'text', required: true, placeholder: 'e.g., Raised Median' },
      { name: 'description', label: 'Description', type: 'textarea', required: false, placeholder: 'Median details' },
    ],
  },
  {
    id: 'footpathAvailability',
    label: 'Footpath Availability Master',
    icon: MapPin,
    color: 'blue',
    fields: [
      { name: 'code', label: 'Footpath Code', type: 'text', required: true, placeholder: 'e.g., FP-001' },
      { name: 'name', label: 'Footpath Availability', type: 'text', required: true, placeholder: 'e.g., Available' },
      { name: 'description', label: 'Description', type: 'textarea', required: false, placeholder: 'Footpath details' },
    ],
  },
  {
    id: 'drainageSystem',
    label: 'Drainage System Master',
    icon: Layers,
    color: 'blue',
    fields: [
      { name: 'code', label: 'Drainage Code', type: 'text', required: true, placeholder: 'e.g., DS-001' },
      { name: 'name', label: 'Drainage System', type: 'text', required: true, placeholder: 'e.g., Adequate' },
      { name: 'description', label: 'Description', type: 'textarea', required: false, placeholder: 'Drainage details' },
    ],
  },
  {
    id: 'streetLighting',
    label: 'Street Lighting Master',
    icon: Monitor,
    color: 'blue',
    fields: [
      { name: 'code', label: 'Lighting Code', type: 'text', required: true, placeholder: 'e.g., SL-001' },
      { name: 'name', label: 'Street Lighting', type: 'text', required: true, placeholder: 'e.g., Available' },
      { name: 'description', label: 'Description', type: 'textarea', required: false, placeholder: 'Lighting details' },
    ],
  },
  {
    id: 'roadMarking',
    label: 'Road Marking Master',
    icon: Tag,
    color: 'blue',
    fields: [
      { name: 'code', label: 'Marking Code', type: 'text', required: true, placeholder: 'e.g., RM-001' },
      { name: 'name', label: 'Road Marking', type: 'text', required: true, placeholder: 'e.g., Painted' },
      { name: 'description', label: 'Description', type: 'textarea', required: false, placeholder: 'Marking details' },
    ],
  },
  {
    id: 'trafficSignals',
    label: 'Traffic Signals Master',
    icon: Database,
    color: 'blue',
    fields: [
      { name: 'code', label: 'Signal Code', type: 'text', required: true, placeholder: 'e.g., TS-001' },
      { name: 'name', label: 'Traffic Signals', type: 'text', required: true, placeholder: 'e.g., Available' },
      { name: 'description', label: 'Description', type: 'textarea', required: false, placeholder: 'Signal details' },
    ],
  },
  {
    id: 'parkingFacility',
    label: 'Parking Facility Master',
    icon: Package,
    color: 'blue',
    fields: [
      { name: 'code', label: 'Parking Code', type: 'text', required: true, placeholder: 'e.g., PF-001' },
      { name: 'name', label: 'Parking Facility', type: 'text', required: true, placeholder: 'e.g., Available' },
      { name: 'description', label: 'Description', type: 'textarea', required: false, placeholder: 'Parking details' },
    ],
  },
];

export type MasterModuleId = MasterConfig['id'];
export type MasterModuleGroup = keyof typeof MASTER_MODULE_GROUPS;

/* =============================================================================
   2. SIDEBAR NAVIGATION CONFIGURATION
   ============================================================================= */

export const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, route: '/dashboard' },
  { id: 'map', label: 'GIS Map Viewer', icon: MapIcon, route: '/map-viewer' },
  { id: 'addnewasset', label: 'Add New Asset', icon: LayoutDashboard, route: '/assets/addnewasset' },
  { id: 'assets', label: 'Municipal Assets', icon: Building2, route: '/assets' },
];

export const secondarySidebarItems = [
  {
    id: 'change-detection',
    label: 'Change Detection',
    icon: RefreshCw,
    route: '/change-detection',
  },
];

export const ASSET_MENU_SECTIONS: SidebarSection[] = [
  {
    id: 'maintenance',
    label: 'Maintenance',
    icon: Wrench,
    colorClass: 'text-yellow-400',
    items: [
      { id: 'maintenance-dashboard', label: 'Dashboard', icon: LayoutDashboard, route: '/maintenance/dashboard' },
      { id: 'maintenance-asset-master', label: 'Asset Master', icon: Database, route: '/maintenance/asset-master' },
      { id: 'maintenance-requests', label: 'Request Details', icon: FileText, route: '/maintenance/request-details' },
      { id: 'maintenance-inception', label: 'Inception', icon: Rocket, route: '/maintenance/inception' },
      { id: 'maintenance-reports', label: 'Reports', icon: BarChart3, route: '/maintenance/reports' },
    ],
  },
  {
    id: 'inventory',
    label: 'Inventory Management',
    icon: Package,
    colorClass: 'text-rose-400',
    items: [
      { id: 'inventory-manage', label: 'Manage Inventory', icon: TrendingUp, route: '/inventory-dashboard' },
      { id: 'inventory-request', label: 'Item Request', icon: Send, route: '/inventory-request' },
      { id: 'inventory-approval', label: 'Req. Approval', icon: ClipboardList, route: '/inventory-approval' },
    ],
  },
  {
    id: 'auctions',
    label: 'Asset Auctions',
    icon: Gavel,
    colorClass: 'text-blue-400',
    items: [
      { id: 'auction-management', label: 'Auction Management', icon: Gavel, route: '/auction-management' },
      { id: 'live-bidding', label: 'Live Bidding', icon: Zap, route: '/live-bidding' },
      { id: 'verify-registrations', label: 'Verify Registrations', icon: ClipboardCheck, route: '/verify-registrations' },
      { id: 'blacklist-defaulters', label: 'Blacklist & Defaulters', icon: ShieldAlert, route: '/blacklist-defaulters' },
    ],
  },
  {
    id: 'revenue',
    label: 'Revenue Management',
    icon: CreditCard,
    colorClass: 'text-green-400',
    items: [
      { id: 'manage-renters', label: 'Manage Renters Details', icon: Users, route: '/lease-rent-registration' },
      { id: 'make-payments', label: 'Payment', icon: CreditCard, route: '/payment-management' },
    ],
  },
  {
    id: 'configuration',
    label: 'Configuration',
    icon: Settings,
    colorClass: 'text-indigo-400',
    items: [
      { id: 'configuration-master', label: 'Master Data', icon: Database, route: '/assets/configuration' },
      { id: 'screen-field-master', label: 'Screen Field Master', icon: LayoutGrid, route: '/assets/configuration/screen-fields-master' },
    ],
  },
];

export const routeMap = {
  dashboard: '/dashboard',
  'asset-register': '/asset-register',
  map: '/map-viewer',
  assets: '/assets',
  maintenance: '/maintenance/dashboard',
  'maintenance-dashboard': '/maintenance/dashboard',
  'maintenance-asset-master': '/maintenance/asset-master',
  'maintenance-requests': '/maintenance/request-details',
  'maintenance-inception': '/maintenance/inception',
  'maintenance-reports': '/maintenance/reports',
  'change-detection': '/change-detection',
  inventory: '/inventory',
  'inventory-dashboard': '/inventory-dashboard',
  'inventory-manage': '/inventory-dashboard',
  'inventory-request': '/inventory-request',
  'inventory-approval': '/inventory-approval',
  configuration: '/assets/configuration',
  'screen-fields': '/assets/configuration/screen-fields-master',
  'auction-management': '/auction-management',
  'live-bidding': '/live-bidding',
  'verify-registrations': '/verify-registrations',
  'blacklist-defaulters': '/blacklist-defaulters',
  'manage-renters': '/lease-rent-registration',
  'make-payments': '/payment-management',
  'add-new-asset-basic-info': '/assets/municipal-Asset/add-New-Asset/basic-Info',
};

/* =============================================================================
   3. MASTER DATA DEFAULTS
   ============================================================================= */

export const createEmptyMasterData = (): MasterDataConfig => ({
  assetCategory: [],
  assetType: [],
  zone: [],
  ward: [],
  propertyCategory: [],
  propertySubCategory: [],
  owningDepartment: [],
  ownershipType: [],
  maintainingDepartment: [],
  yesNo: [],
  landAreaUnit: [],
  landShape: [],
  encumbranceStatus: [],
  terrainType: [],
  approachRoadType: [],
  surroundingDevelopment: [],
  currentLandUsage: [],
  buildableStatus: [],
  floodProneArea: [],
  inventoryType: [],
  inventorySubType: [],
  furnitureItemName: [],
  furnitureTypeModel: [],
  equipmentName: [],
  equipmentBrandModel: [],
  inventoryCondition: [],
  equipmentStatus: [],
  rentFrequency: [],
  depositType: [],
  landClassification: [],
  plotBoundaryType: [],
  condition: [],
  roadCategory: [],
  roadClass: [],
  numberOfLanes: [],
  surfaceType: [],
  trafficFlow: [],
  medianType: [],
  footpathAvailability: [],
  drainageSystem: [],
  streetLighting: [],
  roadMarking: [],
  trafficSignals: [],
  parkingFacility: [],
  electronicFixturesName: [],
  electronicFixturesModel: [],
  vehicleType: [],
  vehicleMakeModel: [],
});

/* =============================================================================
   4. SCREEN FIELD OPTIONS
   ============================================================================= */

export const FIELD_TYPE_OPTIONS = [
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
] as const;

export const DROPDOWN_FIELD_TYPES = ['dropdown', 'select', 'multiselect', 'radio'] as const;

export type FieldType = (typeof FIELD_TYPE_OPTIONS)[number]['value'];
