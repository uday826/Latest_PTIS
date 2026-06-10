import type React from 'react';
import type { LucideIcon } from 'lucide-react';
import type { AssetDetailRecord } from '@/types/municipal-asset/detail-tabs.types';

export type AssetDetailTab = 'overview' | 'legal' | 'financial' | 'documents' | 'assets' | 'allocations';
export type OverviewSubTab = 'summary' | 'shopDetails';
export type BuildingValuationSubTab = 'summary' | 'floors';
export type LandValuationSubTab = 'value' | 'tax';
export type AnalysisValuationSubTab = 'capital' | 'depreciation';

export interface DocumentItem {
  name: string;
  type?: string;
  size?: string;
  uploadDate?: string;
  url?: string;
  status?: string;
  number?: string;
  date?: string;
  fileName?: string;
}

export interface BuildingDataFields extends Record<string, unknown> {
  totalRooms?: number | string;
  numberOfRooms?: number | string;
  numberOfFloors?: number | string;
  floorSections?: unknown[];
  plotAreaSqFt?: number;
  builtUpAreaSqFt?: number;
  carpetAreaSqFt?: number;
  sanctionedPlanNumber?: string;
  sanctionDate?: string;
  completionCertificateNumber?: string;
  completionCertificateDate?: string;
  occupancyCert?: string;
  occupancyCertDate?: string;
  waterMeterNumber?: string;
  waterConnectionDate?: string;
  solarCapacity?: string;
  solarInstallationDate?: string;
  wardNumber?: string;
  propertyNumber?: string;
}

export interface ValuationTabsState {
  building: BuildingValuationSubTab;
  land: LandValuationSubTab;
  analysis: AnalysisValuationSubTab;
}

export interface AssetDetailViewProps {
  asset?: AssetDetailRecord;
  assetId?: string;
  initialTab?: string | null;
  onBack?: () => void;
}

export interface AssetDetailViewContentProps {
  asset: AssetDetailRecord;
  onBack: () => void;
}

export interface ImageLightboxModalProps {
  assetName: string;
  images: string[];
  index: number;
  title: string;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSelectIndex: (idx: number) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}

export interface OverviewSidebarPhotographsProps {
  currentAssetImages: string[];
  openLightbox: (index: number) => void;
  allFloorPlans: string[];
  currentFloorPlans: string[];
  openFloorPlanLightbox: (index: number) => void;
  demoFloorPlanImage: string | null;
}

export interface StandardBuildingOverviewProps {
  asset: AssetDetailRecord;
  detailedData: BuildingDataFields | null | undefined;
}

export interface ValuationFloorRow extends Record<string, unknown> {
  id: string;
  floor: string;
  constructionYear: string | number;
  assessmentYear: string | number;
  constructionType: string;
  natureTypeBuilding: string;
  subtype: string;
  noOfRooms: string | number;
  carpetAreaSqFt?: string;
  carpetAreaSqM?: string;
  builtUpAreaSqFt?: string;
  builtUpAreaSqM?: string;
  carpetArea: string;
  builtUpArea: string;
  sdrr: string | number;
  baseValue: number;
  floorFactorValue: string;
  ageFactorValue: string;
  ntbFactorValue: string;
  useFactorValue: string;
  finalCapitalValue: number;
}

export interface FloorSourceRow {
  floor?: string;
  constructionYear?: string | number;
  assessmentYear?: string | number;
  constructionType?: string;
  natureTypeBuilding?: string;
  subtype?: string;
  noOfRooms?: string | number;
  carpetAreaSqFt?: string;
  carpetAreaSqM?: string;
  builtUpAreaSqFt?: string;
  builtUpAreaSqM?: string;
  sdrr?: string | number;
  baseValue?: number;
  floorFactorValue?: string;
  ageFactorValue?: string;
  ntbFactorValue?: string;
  useFactorValue?: string;
  finalCapitalValue?: number;
}

export interface DocumentActionPayload {
  name: string;
  fileData: string;
  fileName?: string;
}

export interface AssetDetailController {
  asset: AssetDetailRecord;
  activeTab: AssetDetailTab;
  setActiveTab: (tab: AssetDetailTab) => void;
  uploadedDocuments: DocumentItem[];
  overviewSubTab: OverviewSubTab;
  setOverviewSubTab: (subTab: OverviewSubTab) => void;
  buildingData: BuildingDataFields | null | undefined;
  buildingAge: number | null;
  detailedData: BuildingDataFields | null | undefined;
  currentAssetImages: string[];
  openLightbox: (index: number) => void;
  allFloorPlans: string[];
  currentFloorPlans: string[];
  openFloorPlanLightbox: (index: number) => void;
  demoFloorPlanImage: string;
  handleViewDocument: (doc: DocumentActionPayload) => void;
  handleDownloadDocument: (doc: DocumentActionPayload) => void;
  lightboxOpen: boolean;
  lightboxImages: string[];
  lightboxIndex: number;
  lightboxTitle: string;
  closeLightbox: () => void;
  nextImage: () => void;
  prevImage: () => void;
  setLightboxIndex: (index: number) => void;
  handleLightboxKeyDown: (e: React.KeyboardEvent) => void;
}

export interface CommercialComplexShopRow extends Record<string, unknown> {
  id: string;
  srNo: number;
  floorName: string;
  shopNumber: string;
  shopName: string;
  builtUpArea: string | number;
  renterEnglishName?: string;
  renterMobile?: string;
  demandRent?: number;
  leaseFromDate?: string;
  leaseToDate?: string;
  balanceAmount?: number;
  occupancyStatus?: string;
  condition?: string;
}

export interface DetailField {
  label: string;
  value: (data: BuildingDataFields) => React.ReactNode;
}

export interface DetailSection {
  title: string;
  icon: LucideIcon;
  fields: DetailField[];
}

export interface CommercialComplexShopTableResult {
  shopSortColumn: 'shopNumber' | 'floor' | null;
  shopSortDirection: 'asc' | 'desc';
  shopSearchQuery: string;
  setShopSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  selectedFloorFilter: string;
  setSelectedFloorFilter: React.Dispatch<React.SetStateAction<string>>;
  currentShopPage: number;
  setCurrentShopPage: React.Dispatch<React.SetStateAction<number>>;
  shopsPerPage: number;
  sortedShops: CommercialComplexShopRow[];
  availableFloors: string[];
  filteredShops: CommercialComplexShopRow[];
  paginatedShops: CommercialComplexShopRow[];
  totalShopPages: number;
  handleShopSort: (column: 'shopNumber' | 'floor') => void;
}

export interface ValuationTabContentResult {
  asset: AssetDetailRecord;
  buildingData: BuildingDataFields | null | undefined;
  floors: Omit<ValuationFloorRow, 'id' | 'carpetArea' | 'builtUpArea'>[];
  buildingCapitalValue: number;
}
