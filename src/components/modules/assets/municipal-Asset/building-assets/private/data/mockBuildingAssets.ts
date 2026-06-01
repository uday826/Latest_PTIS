import { MOCK_PARENT_BUILDINGS } from '@/lib/constants/mockParentBuildings';
import type { BuildingAsset } from '../types';

export const MOCK_BUILDING_ASSETS: BuildingAsset[] = MOCK_PARENT_BUILDINGS.map((asset, index) => {
  const currentValue = 25000000 + index * 1250000;
  const depreciation = 850000 + index * 50000;

  return {
    id: String(asset.id),
    assetId: asset.assetCode,
    assetName: asset.assetName,
    description: asset.attributes?.buildingName || asset.assetName,
    subCategory: asset.category,
    assetType: asset.assetType,
    location: asset.fullAddress,
    ward: asset.ward,
    zone: asset.zone,
    acquisitionDate: asset.possessionDate,
    acquisitionValue: currentValue,
    department: asset.department,
    remainingLife: 10,
    condition: 'good',
    status: 'active',
    custodian: asset.inChargeName,
    insuranceStatus: 'Insured',
    insurancePolicy: '',
    insuranceExpiry: '',
    lastMaintenanceDate: asset.possessionDate,
    nextMaintenanceStatus: '',
    propertyNo: asset.propertyNumber,
    partitionNo: '',
    remarks: '',
    currentValue,
    depreciation,
    netBookValue: currentValue - depreciation,
    lifeYears: 30,
  };
});
