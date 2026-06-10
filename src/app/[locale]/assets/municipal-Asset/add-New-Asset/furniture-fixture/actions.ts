"use server";

import { apiClient } from "@/services/api.service";

// Types for inventory responses
export interface InventoryUnitResponse {
  assetId: number;
  assetNo: string;
  assetName: string;
  unitNumber: number;
  serialNumber?: string;
  assetTag?: string;
  condition?: string;
  unitPurchaseValue?: number;
  unitCapitalValue?: number;
  depreciationRate?: number;
  conditionFactor?: number;
  cvFormula?: string;
  dynamicAttributes?: Record<string, string>;
}

export interface InventoryBatchDetail {
  batchId: number;
  parentAssetId: number;
  inventoryType: string;
  itemName: string;
  modelBrand?: string;
  specifications?: string;
  purchaseDate: string;
  condition?: string;
  quantity: number;
  unitValue: number;
  totalBatchValue: number;
  totalBatchCV: number;
  invoiceNumber?: string;
  invoiceDate?: string;
  invoiceFileName?: string;
  owningDepartment?: string;
  photoFileName?: string;
  isRegistered: boolean;
  registeredDate?: string;
  createdDate: string;
  units: InventoryUnitResponse[];
}

export interface InventoryBatchListResponse {
  parentAssetId: number;
  parentAssetName: string;
  totalBatches: number;
  totalUnits: number;
  totalPurchaseValue: number;
  totalCapitalValue: number;
  batches: InventoryBatchDetail[];
}

/**
 * Server action to get all inventory batches for a parent asset.
 */
export async function getInventoryBatchesAction(parentAssetId: number): Promise<{
  success: boolean;
  data?: InventoryBatchListResponse;
  error?: string;
}> {
  try {
    const response = await apiClient.get<InventoryBatchListResponse>(
      `/asset-management/AssetInventory/batches/${parentAssetId}`
    );

    if (response.success && response.data) {
      return { success: true, data: response.data };
    }

    return { success: false, error: response.error || "Failed to load batches" };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to load inventory batches"
    };
  }
}

/**
 * Server action to get a single inventory batch by ID.
 */
export async function getInventoryBatchByIdAction(batchId: number): Promise<{
  success: boolean;
  data?: InventoryBatchDetail;
  error?: string;
}> {
  try {
    const response = await apiClient.get<InventoryBatchDetail>(
      `/asset-management/AssetInventory/batch/${batchId}`
    );

    if (response.success && response.data) {
      return { success: true, data: response.data };
    }

    return { success: false, error: response.error || "Batch not found" };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to load batch"
    };
  }
}

/**
 * Server action to update an inventory batch.
 */
export async function updateInventoryBatchAction(batchId: number, updates: {
  itemName?: string;
  modelBrand?: string;
  specifications?: string;
  purchaseDate?: string;
  condition?: string;
  unitValue?: number;
  invoiceNumber?: string;
  invoiceDate?: string;
  invoiceFileName?: string;
  owningDepartment?: string;
  photoFileName?: string;
}): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  try {
    const payload = {
      batchId,
      itemName: updates.itemName,
      modelBrand: updates.modelBrand,
      specifications: updates.specifications,
      purchaseDate: updates.purchaseDate,
      condition: updates.condition,
      unitValue: updates.unitValue,
      invoiceNumber: updates.invoiceNumber,
      invoiceDate: updates.invoiceDate,
      invoiceFileName: updates.invoiceFileName,
      owningDepartment: updates.owningDepartment,
      photoFileName: updates.photoFileName
    };

    const response = await apiClient.put<any>(
      `/asset-management/AssetInventory/batch/${batchId}`,
      payload
    );

    if (response.success && response.data) {
      return { success: true, data: response.data };
    }

    return { success: false, error: response.error || "Failed to update batch" };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update batch"
    };
  }
}

/**
 * Server action to delete an inventory batch.
 */
export async function deleteInventoryBatchAction(batchId: number): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const response = await apiClient.delete<{ message: string }>(
      `/asset-management/AssetInventory/batch/${batchId}`
    );

    if (response.success) {
      return { success: true };
    }

    return { success: false, error: response.error || "Failed to delete batch" };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete batch"
    };
  }
}

/** * Server action to save a single inventory batch immediately.
 * Use this when user clicks "Add Row" to save right away.
 */
export async function saveSingleInventoryBatchAction(item: any): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  try {
    const response = await apiClient.post<any>("/asset-management/AssetInventory/batch", item);
    
    if (response.success && response.data) {
      return { success: true, data: response.data };
    }

    return { success: false, error: response.error || "Failed to save batch" };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save batch"
    };
  }
}

/** * Server action to register inventory batches.
 * Calls POST /api/asset-management/AssetInventory/batch for each item.
 */
export async function saveInventoryBatchAction(payload: { items: any[] }) {
  try {
    const results: any[] = [];
    const errors: string[] = [];

    // Process each batch item sequentially
    for (const item of payload.items) {
      try {
        const response = await apiClient.post<any>("/asset-management/AssetInventory/batch", item);
        
        if (response.success && response.data) {
          results.push(response.data);
        } else {
          const errorMsg = `${item.itemName}: ${response.error || 'Failed'}`;
          errors.push(errorMsg);
        }
      } catch (err: any) {
        const errorMsg = `${item.itemName}: ${err.message || 'Request failed'}`;
        errors.push(errorMsg);
      }
    }

    if (errors.length > 0 && results.length === 0) {
      return { success: false, error: errors.join("; ") };
    }

    // Build aggregated response matching InventoryCVResponseDto structure
    const categoryGroups: Record<string, any> = {};
    for (const batch of results) {
      const type = batch.inventoryType || 'unknown';
      if (!categoryGroups[type]) {
        categoryGroups[type] = {
          inventoryType: type,
          label: batch.label || type,
          totalBatches: 0,
          totalUnits: 0,
          totalPurchaseValue: 0,
          totalCapitalValue: 0,
          totalDepreciation: 0,
          batches: []
        };
      }
      categoryGroups[type].totalBatches++;
      categoryGroups[type].totalUnits += batch.quantity || 0;
      categoryGroups[type].totalPurchaseValue += batch.totalBatchValue || 0;
      categoryGroups[type].totalCapitalValue += batch.totalCapitalValue || 0;
      categoryGroups[type].totalDepreciation += batch.totalDepreciation || 0;
      categoryGroups[type].batches.push(batch);
    }

    return {
      success: true,
      data: {
        totalBatches: results.length,
        totalUnitsRegistered: results.reduce((s, b) => s + (b.quantity || 0), 0),
        grandPurchaseValue: results.reduce((s, b) => s + (b.totalBatchValue || 0), 0),
        grandCapitalValue: results.reduce((s, b) => s + (b.totalCapitalValue || 0), 0),
        categoryGroups: Object.values(categoryGroups)
      },
      errors: errors.length > 0 ? errors : undefined
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Internal Server Error during batch registration"
    };
  }
}

/**
 * Trigger CV calculation for a movable/inventory asset.
 * POST /api/AssetCapitalValue/movable/calculate-cv
 * Calculates: CV = PurchaseValue × (1 - TotalDepreciation) × ConditionFactor
 * Updates AssetMaster.CapitalValue for the asset.
 */
export async function calculateMovableCVAction(
  assetId: number,
  conditionFactor: number = 1.0
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const response = await apiClient.post<any>("/AssetCapitalValue/movable/calculate-cv", {
      assetId,
      valuationMethod: 1, // DepreciatedValue
      conditionFactor,
      createdBy: 1,
    });
    if (response.success) return { success: true, data: response.data };
    return { success: false, error: response.error ?? "Movable CV calculation failed" };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Movable CV calculation failed"
    };
  }
}
