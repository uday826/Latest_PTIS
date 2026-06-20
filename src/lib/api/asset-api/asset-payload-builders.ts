import type { MasterDataRecord } from '@/types/asset-type/master-data.types';
import type { AssetTypeFormModel } from '@/types/asset-type/asset-type.types';
import type { AssetCategoryFormModel } from '@/types/asset-type/asset-category.types';

// Core Helpers
const trim = (s?: string) => (s || '').trim();
const isActive = (r: MasterDataRecord | { isActive: boolean }) => 'status' in r ? r.status === 'Active' : r.isActive;
const baseRecord = (r: MasterDataRecord, u: number, isUpdate: boolean, id?: number) => isUpdate ? { id: id!, updatedBy: u, isActive: isActive(r) } : { createdBy: u, isActive: isActive(r) };

// Asset Type
export const buildAssetTypeCreatePayload = (r: MasterDataRecord, u = 0) => ({ ...baseRecord(r, u, false), typeCode: trim(r.id), typeName: r.name.trim(), assetCategoryId: Number(r.group)||0, description: trim(r.description), allowUnitRegistration: r.allowUnitRegistration??false, allowRoomRegistration: r.allowRoomRegistration??false, codeFormat: "1" });
export const buildAssetTypeUpdatePayload = (r: MasterDataRecord, id: number, u = 0) => ({ ...baseRecord(r, u, true, id), typeCode: trim(r.id), typeName: r.name.trim(), assetCategoryId: Number(r.group)||0, description: trim(r.description), allowUnitRegistration: r.allowUnitRegistration??false, allowRoomRegistration: r.allowRoomRegistration??false, codeFormat: "1" });
export const buildAssetTypeCreatePayloadFromModel = (d: AssetTypeFormModel, u = 0) => ({ typeCode: trim(d.typeCode), typeName: trim(d.typeName), assetCategoryId: d.categoryId, description: trim(d.description), isActive: d.isActive, allowUnitRegistration: d.allowUnitRegistration??false, allowRoomRegistration: d.allowRoomRegistration??false, createdBy: u, codeFormat: "1" });
export const buildAssetTypeUpdatePayloadFromModel = (d: AssetTypeFormModel, u = 0) => ({ id: d.id??0, typeCode: trim(d.typeCode), typeName: trim(d.typeName), assetCategoryId: d.categoryId, description: trim(d.description), isActive: d.isActive, allowUnitRegistration: d.allowUnitRegistration??false, allowRoomRegistration: d.allowRoomRegistration??false, updatedBy: u, codeFormat: "1" });

// Asset Category
export const buildAssetCategoryCreatePayload = (r: MasterDataRecord, u = 0) => ({ ...baseRecord(r, u, false), categoryCode: trim(r.id), categoryName: r.name.trim(), description: trim(r.description), isMovable: r.isMovable??false, hasFloorDetails: r.hasFloorDetails??false, hasInventory: r.hasInventory??false, isInventoryMandatory: r.isInventoryMandatory??false, hasLegalCompliance: r.hasLegalCompliance??false, valuationType: trim(r.valuationType), codeFormat: "1" });
export const buildAssetCategoryUpdatePayload = (r: MasterDataRecord, id: number, u = 0) => ({ ...baseRecord(r, u, true, id), categoryCode: trim(r.id), categoryName: r.name.trim(), description: trim(r.description), isMovable: r.isMovable??false, hasFloorDetails: r.hasFloorDetails??false, hasInventory: r.hasInventory??false, isInventoryMandatory: r.isInventoryMandatory??false, hasLegalCompliance: r.hasLegalCompliance??false, valuationType: trim(r.valuationType), codeFormat: "1" });
export const buildAssetCategoryCreatePayloadFromModel = (d: AssetCategoryFormModel, u = 0) => ({ categoryCode: trim(d.categoryCode), categoryName: trim(d.categoryName), description: trim(d.description), isActive: d.isActive, isMovable: d.isMovable, hasFloorDetails: d.hasFloorDetails, hasInventory: d.hasInventory, isInventoryMandatory: d.isInventoryMandatory, hasLegalCompliance: d.hasLegalCompliance, valuationType: trim(d.valuationType), createdBy: u, codeFormat: "1" });
export const buildAssetCategoryUpdatePayloadFromModel = (d: AssetCategoryFormModel, u = 0) => ({ id: d.id??0, categoryCode: trim(d.categoryCode), categoryName: trim(d.categoryName), description: trim(d.description), isActive: d.isActive, isMovable: d.isMovable, hasFloorDetails: d.hasFloorDetails, hasInventory: d.hasInventory, isInventoryMandatory: d.isInventoryMandatory, hasLegalCompliance: d.hasLegalCompliance, valuationType: trim(d.valuationType), updatedBy: u, codeFormat: "1" });

// Inventory Masters
export const buildCategoryPayload = (r: MasterDataRecord, u = 0) => ({ ...baseRecord(r, u, false), updatedBy: u, typeCode: r.id, typeName: r.name, description: trim(r.description), displayOrder: r.displayOrder??1, depreciationRate: r.depreciationRate??0.1 });
export const buildCategoryCreatePayload = buildCategoryPayload;
export const buildCategoryUpdatePayload = buildCategoryPayload;

export const buildConditionPayload = (r: MasterDataRecord, u = 0) => ({ ...baseRecord(r, u, false), updatedBy: u, inventoryItemCategoryId: Number(r.group)||0, conditionName: r.name, conditionFactor: r.conditionFactor??1.0, description: trim(r.description), displayOrder: r.displayOrder??1 });
export const buildConditionCreatePayload = buildConditionPayload;
export const buildConditionUpdatePayload = buildConditionPayload;

export const buildItemNamePayload = (r: MasterDataRecord, u = 0) => ({ ...baseRecord(r, u, false), updatedBy: u, inventoryItemCategoryId: Number(r.group)||0, subTypeCode: r.id, subTypeName: r.name, description: trim(r.description), displayOrder: r.displayOrder??1 });
export const buildItemNameCreatePayload = buildItemNamePayload;
export const buildItemNameUpdatePayload = buildItemNamePayload;

export const buildModelPayload = (r: MasterDataRecord, u = 0) => ({ ...baseRecord(r, u, false), updatedBy: u, inventoryItemNameId: Number(r.group)||0, modelName: r.name, description: trim(r.description), displayOrder: r.displayOrder??1 });
export const buildModelCreatePayload = buildModelPayload;
export const buildModelUpdatePayload = buildModelPayload;

// Standard Masters
export const buildOwnershipTypeCreatePayload = (r: MasterDataRecord, u = 0) => ({ ...baseRecord(r, u, false), ownershipTypeName: r.name, description: r.description });
export const buildOwnershipTypeUpdatePayload = (r: MasterDataRecord, id: number, u = 0) => ({ ...baseRecord(r, u, true, id), ownershipTypeName: r.name, description: r.description });

export const buildOwningDepartmentCreatePayload = (r: MasterDataRecord, u = 0) => ({ ...baseRecord(r, u, false), owningDepartmentName: r.name, departmentId: r.departmentId, departmentName: r.departmentName, description: r.description });
export const buildOwningDepartmentUpdatePayload = (r: MasterDataRecord, id: number, u = 0) => ({ ...baseRecord(r, u, true, id), owningDepartmentName: r.name, departmentId: r.departmentId, departmentName: r.departmentName, description: r.description });

export const buildGstCreatePayload = (r: MasterDataRecord, u = 0) => ({ ...baseRecord(r, u, false), taxCode: trim(r.id), taxName: r.name.trim(), taxPercentage: r.taxPercentage??0, effectiveFromDate: r.effectiveFromDate || new Date().toISOString().split('T')[0], effectiveToDate: r.effectiveToDate || null });
export const buildGstUpdatePayload = (r: MasterDataRecord, id: number, u = 0) => ({ ...baseRecord(r, u, true, id), taxCode: trim(r.id), taxName: r.name.trim(), taxPercentage: r.taxPercentage??0, effectiveFromDate: r.effectiveFromDate || new Date().toISOString().split('T')[0], effectiveToDate: r.effectiveToDate || null });

export const buildPenaltyCreatePayload = (r: MasterDataRecord, u = 0) => ({ ...baseRecord(r, u, false), penaltyCode: trim(r.id), penaltyName: r.name.trim(), calculationType: r.calculationType || 'FlatAmount', penaltyValue: r.penaltyValue??0, gracePeriodDays: r.gracePeriodDays??0 });
export const buildPenaltyUpdatePayload = (r: MasterDataRecord, id: number, u = 0) => ({ ...baseRecord(r, u, true, id), penaltyCode: trim(r.id), penaltyName: r.name.trim(), calculationType: r.calculationType || 'FlatAmount', penaltyValue: r.penaltyValue??0, gracePeriodDays: r.gracePeriodDays??0 });

export const buildRoomTypeCreatePayload = (r: MasterDataRecord, u = 0) => ({ ...baseRecord(r, u, false), assetTypeId: Number(r.group)||0, roomTypeCode: trim(r.id), roomTypeName: r.name.trim() });
export const buildRoomTypeUpdatePayload = (r: MasterDataRecord, id: number, u = 0) => ({ ...baseRecord(r, u, true, id), assetTypeId: Number(r.group)||0, roomTypeCode: trim(r.id), roomTypeName: r.name.trim() });

export const buildTypeOfUseCreatePayload = (r: MasterDataRecord, u = 0) => ({ ...baseRecord(r, u, false), assetTypeId: Number(r.group)||0, typeOfUseGroupId: r.departmentId||0, typeOfUseCode: trim(r.id), description: trim(r.description) });
export const buildTypeOfUseUpdatePayload = (r: MasterDataRecord, id: number, u = 0) => ({ ...baseRecord(r, u, true, id), assetTypeId: Number(r.group)||0, typeOfUseGroupId: r.departmentId||0, typeOfUseCode: trim(r.id), description: trim(r.description) });

export const buildSubTypeOfUseCreatePayload = (r: MasterDataRecord, u = 0) => ({ ...baseRecord(r, u, false), typeOfUseId: r.departmentId||0, description: trim(r.description), searchSequence: r.displayOrder||0 });
export const buildSubTypeOfUseUpdatePayload = (r: MasterDataRecord, id: number, u = 0) => ({ ...baseRecord(r, u, true, id), typeOfUseId: r.departmentId||0, description: trim(r.description), searchSequence: r.displayOrder||0 });
