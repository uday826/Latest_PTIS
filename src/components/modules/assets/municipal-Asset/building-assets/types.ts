export type AssetCondition = 'good' | 'fair' | 'poor';
export type AssetStatus = 'active' | 'inactive';
export type InsuranceStatus = 'Insured' | 'Not Insured';

export type BuildingAsset = {
  id: string;
  assetId: string;
  assetName: string;
  description: string;
  subCategory: string;
  assetType: string;
  location: string;
  ward: string;
  zone: string;
  acquisitionDate: string;
  acquisitionValue: number;
  currentValue: number;
  depreciation: number;
  netBookValue: number;
  lifeYears: number;
  remainingLife: number;
  condition: AssetCondition;
  status: AssetStatus;
  custodian: string;
  department: string;
  insuranceStatus: InsuranceStatus;
  insurancePolicy: string;
  insuranceExpiry: string;
  lastMaintenanceDate: string;
  nextMaintenanceStatus: string;
  propertyNo: string;
  partitionNo: string;
  remarks: string;
};

export type AssetTypeOption = {
  label: string;
  value: string;
  count: number;
  disabled?: boolean;
};
