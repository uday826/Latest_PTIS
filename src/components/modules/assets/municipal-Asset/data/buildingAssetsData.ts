export interface BuildingAsset {
  assetId: string;
  assetName: string;
  assetType: string;
  subType: string;
  floor: string;
  room: string;
  buildingId: string;
  building: string;
  quantity: number;
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Critical';
  amcStatus: 'Active' | 'Expired' | 'N/A';
  purchaseDate: string;
  originalValue: number;
  currentValue: number;
  responsibleOfficer: string;
  responsibleDept: string;
  officerContact?: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  warrantyExpiry?: string;
  amcVendor?: string;
  amcExpiry?: string;
  lastMaintenanceDate?: string;
  nextMaintenanceDue?: string;
}

export const allBuildingAssets: BuildingAsset[] = [];
