'use server';

import { valuationApiService } from "@/lib/api/asset/valuation.service";

/**
 * Server Action to load all valuation-related data for a specific assetId
 */
export async function getAssetValuationDataAction(assetId: number, isBuildingClient?: boolean) {
  try {
    const [assetRes, inventoryRes] = await Promise.all([
      valuationApiService.getAssetDetails(assetId),
      valuationApiService.getInventoryBatchesByAsset(assetId)
    ]);

    // Robustly extract the asset object
    let assetObj: any = null;
    if (assetRes.success && assetRes.data) {
      const data = assetRes.data as any;
      if (data && typeof data === "object") {
        assetObj = data.items?.[0] ?? data.Items?.[0] ?? data.data?.[0] ?? data.Data?.[0] ?? data.result ?? data.Result ?? data;
      }
    }

    // Determine category
    const assetCategoryId = Number(assetObj?.assetCategoryId ?? assetObj?.categoryId ?? 0);
    const category = String(assetObj?.categoryName ?? assetObj?.category ?? assetObj?.assetCategoryName ?? assetObj?.assetCategory ?? "").toLowerCase().trim();
    
    const isBuilding =
      isBuildingClient === true ||
      assetCategoryId === 1 ||
      category.includes("building") ||
      category.includes("infra") ||
      assetObj?.categoryId === 1;

    const isLand =
      assetCategoryId === 2 ||
      category.includes("land") ||
      category.includes("plot");





    let floorsList: any[] = [];
    let buildingCVData: any = null;
    let plotCVData: any = null;

    if (isBuilding) {
      // Call Building CV Calculation Endpoint

      const cvRes = await valuationApiService.calculateBuildingCV(assetId);

      
      if (cvRes.success && cvRes.data) {
        buildingCVData = cvRes.data;

        // Use buildingFloorDetails from calculation response as floorsList
        floorsList = cvRes.data.buildingFloorDetails ?? [];

      } else {

        const floorsRes = await valuationApiService.getFloorsByAsset(assetId);
        if (floorsRes.success && floorsRes.data) {
          const data = floorsRes.data as any;
          if (Array.isArray(data)) {
            floorsList = data;
          } else if (data && typeof data === "object") {
            const candidateArray = data.floorDetails ?? data.FloorDetails ?? data.items ?? data.Items ?? data.data ?? data.Data ?? data.result ?? data.Result;
            floorsList = Array.isArray(candidateArray) ? candidateArray : [];
          }
        }
      }
    } else if (isLand) {
      // Call Plot CV Calculation Endpoint

      const cvRes = await valuationApiService.calculatePlotCV(assetId);

      
      if (cvRes.success && cvRes.data) {
        plotCVData = cvRes.data;

      } else {

      }

      // Load standard floors for land if any
      const floorsRes = await valuationApiService.getFloorsByAsset(assetId);
      if (floorsRes.success && floorsRes.data) {
        const data = floorsRes.data as any;
        if (Array.isArray(data)) {
          floorsList = data;
        } else if (data && typeof data === "object") {
          const candidateArray = data.floorDetails ?? data.FloorDetails ?? data.items ?? data.Items ?? data.data ?? data.Data ?? data.result ?? data.Result;
          floorsList = Array.isArray(candidateArray) ? candidateArray : [];
        }
      }
    } else {
      // Non-building, non-land assets: fetch standard floors
      const floorsRes = await valuationApiService.getFloorsByAsset(assetId);
      if (floorsRes.success && floorsRes.data) {
        const data = floorsRes.data as any;
        if (Array.isArray(data)) {
          floorsList = data;
        } else if (data && typeof data === "object") {
          const candidateArray = data.floorDetails ?? data.FloorDetails ?? data.items ?? data.Items ?? data.data ?? data.Data ?? data.result ?? data.Result;
          if (Array.isArray(candidateArray)) {
            floorsList = candidateArray;
          } else {
            const arrays = Object.values(data).filter(Array.isArray);
            if (arrays.length > 0) {
              floorsList = arrays[0];
            }
          }
        }
      }
    }

    // Robustly extract the inventories list
    let inventoriesList: any[] = [];
    if (inventoryRes.success && inventoryRes.data) {
      const data = inventoryRes.data as any;
      if (Array.isArray(data)) {
        inventoriesList = data;
      } else if (data && typeof data === "object") {
        const candidateArray = data.batches ?? data.Batches ?? data.items ?? data.Items ?? data.data ?? data.Data ?? data.result ?? data.Result;
        if (Array.isArray(candidateArray)) {
          inventoriesList = candidateArray;
        } else {
          const arrays = Object.values(data).filter(Array.isArray);
          if (arrays.length > 0) {
            inventoriesList = arrays[0];
          }
        }
      }
    }

    try {
      const fs = require('fs');
      fs.writeFileSync('C:/Users/yash.more/.gemini/antigravity-ide/brain/c68ce206-f891-4e08-b66f-5c6c1ccb1b92/raw_valuation_data.json', JSON.stringify({
        inventories: inventoriesList
      }, null, 2));
    } catch (e) {
      console.error("Failed to write debug file:", e);
    }

    return {
      success: true,
      asset: assetObj,
      floors: floorsList,
      inventories: inventoriesList,
      buildingCV: buildingCVData,
      plotCV: plotCVData
    };
  } catch (error) {

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to load valuation data from server"
    };
  }
}
