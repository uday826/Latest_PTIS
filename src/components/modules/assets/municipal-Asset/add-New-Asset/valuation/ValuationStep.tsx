"use client";

import { getAssetValuationDataAction } from "@/app/[locale]/assets/municipal-Asset/add-New-Asset/valuation/actions";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useAssetForm } from "../AssetFormContext";
import { AssetValuation } from "./AssetValuation";
import { BuildingValuationSummary } from "./BuildingValuationSummary";
import { InfrastructureValuation } from "./InfrastructureValuation";
import { LandValuation } from "./LandValuation";
import { TaxationDetails } from "./TaxationDetails";

// Infrastructure asset types
const INFRASTRUCTURE_TYPES = ["Road", "Bridge", "Subway", "Bridge/Subway", "Water Tank", "Water Tank/Reservoir"];

export default function ValuationPage() {
  const { formData, handleInputChange, updateFormData, registerSubmitHook } = useAssetForm();
  const searchParams = useSearchParams();

  // Dynamically load the current AssetId from searchParams or context exactly like Basic Info & Floor Details
  const assetIdStr = searchParams.get("assetId") || searchParams.get("id") || String(formData.id || formData.assetId || "0");
  const assetId = Number(assetIdStr);

  // Register a no-op submit hook: Valuation is display-only; Final Submit is handled by the footer
  const noOpHook = useCallback(async (): Promise<boolean> => true, []);
  useEffect(() => {
    if (registerSubmitHook) {
      registerSubmitHook(noOpHook);
    }
    return () => {
      if (registerSubmitHook) {
        registerSubmitHook(null);
      }
    };
  }, [registerSubmitHook, noOpHook]);

  const [isLoading, setIsLoading] = useState(true);
  const [dynamicFloors, setDynamicFloors] = useState<any[]>([]);
  const [plotCV, setPlotCV] = useState<any>(null);
  const [inventoryState, setInventoryState] = useState<{
    furnitureItems: any[];
    itEquipmentItems: any[];
    electronicFixtures: any[];
    vehicles: any[];
  }>({
    furnitureItems: [],
    itEquipmentItems: [],
    electronicFixtures: [],
    vehicles: [],
  });

  const category: string = formData.category || "";
  const assetType: string = formData.assetType || "";

  const isBuilding =
    category === "Building Assets" ||
    category === "BUILDING" ||
    category === "INFRASTRUCTURE";

  const isLand =
    category === "LAND" ||
    category === "Land Assets";

  const isInfrastructure =
    INFRASTRUCTURE_TYPES.some((t) => assetType === t) ||
    category === "INFRASTRUCTURE";

  // Effect to load full asset details for this AssetId only, dynamically from DB
  useEffect(() => {
    if (assetId > 0) {
      setIsLoading(true);
      getAssetValuationDataAction(assetId, isBuilding)
        .then((res) => {
          if (res.success) {
            // 1. Bind floor valuation values saved in DB with robust casing fallbacks
            if (res.floors && res.floors.length > 0) {
              const mappedFloors = res.floors.map((f: any) => {
                const floorDetailsId = f.floorDetailsId ?? f.FloorDetailsId ?? f.id ?? f.Id ?? 0;
                const assetIdVal = f.assetId ?? f.AssetId ?? 0;
                const contextFloor = formData.floors?.find((cf: any) => cf.id === floorDetailsId || cf.floor === String(f.floorId || f.FloorId));
                
                const finalCapitalValue = f.CapitalValue ?? f.capitalValue ?? f.baseValue ?? f.BaseValue ?? f.marketValue ?? f.MarketValue ?? contextFloor?.finalCapitalValue ?? contextFloor?.baseValue ?? 0;
                const builtUpArea = f.builtUpAreaSqFeet ?? f.BuiltUpAreaSqFeet ?? f.builtUpAreaSqMeter ?? f.BuiltUpAreaSqMeter ?? f.carpetAreaSqFeet ?? f.CarpetAreaSqFeet ?? contextFloor?.builtUpAreaSqFt ?? contextFloor?.builtUpAreaSqM ?? 0;
                const carpetArea = f.carpetAreaSqFeet ?? f.CarpetAreaSqFeet ?? f.carpetAreaSqMeter ?? f.CarpetAreaSqMeter ?? contextFloor?.carpetAreaSqFt ?? contextFloor?.carpetAreaSqM ?? 0;
                
                return {
                  id: floorDetailsId || contextFloor?.id || 0,
                  floorDetailsId: floorDetailsId || contextFloor?.id || 0,
                  assetId: assetIdVal || contextFloor?.assetId || 0,
                  floor: String(f.floorId ?? f.FloorId ?? contextFloor?.floor ?? ""),
                  constructionYear: String(f.constructionYear ?? f.ConstructionYear ?? contextFloor?.conYear ?? ""),
                  assessmentYear: String(f.assessmentYear ?? f.AssessmentYear ?? contextFloor?.asstYear ?? ""),
                  noOfRooms: Number(f.noOfRooms ?? f.NoOfRooms ?? contextFloor?.rooms ?? 0),
                  carpetAreaSqFt: Number(carpetArea),
                  carpetAreaSqM: Number(f.carpetAreaSqMeter ?? f.CarpetAreaSqMeter ?? contextFloor?.carpetAreaSqM ?? 0),
                  builtUpAreaSqFt: Number(builtUpArea),
                  builtUpAreaSqM: Number(f.builtUpAreaSqMeter ?? f.BuiltUpAreaSqMeter ?? contextFloor?.builtUpAreaSqM ?? 0),
                  baseValue: Number(f.baseValue ?? f.BaseValue ?? contextFloor?.baseValue ?? 0),
                  floorFactorValue: Number(f.cvFloorFactor ?? f.CvFloorFactor ?? contextFloor?.floorFactorValue ?? 1),
                  ageFactorValue: Number(f.cvAgeFactor ?? f.CvAgeFactor ?? contextFloor?.ageFactorValue ?? 1),
                  ntbFactorValue: Number(f.cvNatureFactor ?? f.CvNatureFactor ?? contextFloor?.ntbFactorValue ?? 1),
                  useFactorValue: Number(f.cvUseFactor ?? f.CvUseFactor ?? contextFloor?.useFactorValue ?? 1),
                  finalCapitalValue: String(finalCapitalValue),
                  cvCalculationFormula: String(f.cvCalculationFormula ?? ""),
                  isCalculated: Boolean(f.isCalculated ?? false),
                  calculationMessage: String(f.calculationMessage ?? ""),
                  floorDescription: String(f.floorDescription ?? ""),
                  subFloorDescription: String(f.subFloorDescription ?? ""),
                  constructionTypeDescription: String(f.constructionTypeDescription ?? ""),
                  typeOfUseDescription: String(f.typeOfUseDescription ?? ""),
                  subTypeOfUseDescription: String(f.subTypeOfUseDescription ?? ""),
                };
              });
              setDynamicFloors(mappedFloors);
              updateFormData({ floors: mappedFloors });
            }

            if (res.plotCV) {
              setPlotCV(res.plotCV);
            }

            // 2. Bind dynamic inventory valuation totals saved in DB with robust category matching and casing
            if (res.inventories && res.inventories.length > 0) {
              const furniture: any[] = [];
              const it: any[] = [];
              const electronic: any[] = [];
              const vehicle: any[] = [];

              res.inventories.forEach((batch: any) => {
                const batchId = batch.batchId ?? batch.BatchId ?? 0;
                const itemName = batch.itemName ?? batch.ItemName ?? "";
                const modelBrand = batch.modelBrand ?? batch.ModelBrand ?? "";
                const purchaseDate = batch.purchaseDate ?? batch.PurchaseDate ?? "";
                const condition = batch.condition ?? batch.Condition ?? "";
                const quantity = batch.quantity ?? batch.Quantity ?? 0;
                const unitValue = batch.unitValue ?? batch.UnitValue ?? 0;
                const totalBatchCV = batch.totalBatchCV ?? batch.TotalBatchCV ?? batch.totalBatchValue ?? batch.TotalBatchValue ?? 0;
                const specifications = batch.specifications ?? batch.Specifications ?? "";

                const rawType = String(batch.inventoryType ?? batch.InventoryType ?? "").toLowerCase().trim();

                const item = {
                  id: String(batchId),
                  itemName: itemName,
                  equipmentName: itemName,
                  typeModel: modelBrand,
                  brandModel: modelBrand,
                  purchaseDate: purchaseDate,
                  condition: condition,
                  status: condition,
                  quantity: quantity,
                  unitValue: unitValue,
                  totalValue: totalBatchCV,
                  specifications: specifications,
                };

                // Group by type / category robustly
                if (rawType.includes("furniture") || rawType.includes("furn")) {
                  furniture.push(item);
                } else if (rawType.includes("it-equipment") || rawType.includes("it_equipment") || rawType.includes("it-equip") || rawType === "it" || rawType.includes("computer")) {
                  it.push(item);
                } else if (rawType.includes("electronic") || rawType.includes("elect") || rawType.includes("fixture")) {
                  electronic.push(item);
                } else if (rawType.includes("vehicle") || rawType.includes("veh") || rawType.includes("car")) {
                  vehicle.push(item);
                } else {
                  // Fallback to furniture
                  furniture.push(item);
                }
              });

              setInventoryState({
                furnitureItems: furniture,
                itEquipmentItems: it,
                electronicFixtures: electronic,
                vehicles: vehicle,
              });
            }

            // 3. Bind AssetMaster properties (e.g. Land Area, Valuation Values)
            if (res.asset) {
              const asset = res.asset;
              
              // Extract EAV attributes
              const attributes: Record<string, any> = {};
              if (asset.fieldValues && Array.isArray(asset.fieldValues)) {
                asset.fieldValues.forEach((fv: any) => {
                  if (fv.fieldName) {
                    attributes[fv.fieldName] = fv.numberValue ?? fv.textValue ?? fv.booleanValue ?? fv.dateValue;
                  }
                });
              }

              // Safely merge AssetMaster data into context state
              updateFormData({
                id: asset.id,
                assetId: asset.id,
                assetCode: asset.assetNo || asset.assetCode || "",
                assetName: asset.assetName || "",
                landArea: asset.landAreaSqMeter || attributes.landArea || formData.landArea || "",
                landRate: attributes.landRate || formData.landRate || "",
                developmentCost: attributes.developmentCost || formData.developmentCost || "",
                marketAppreciation: attributes.marketAppreciation || formData.marketAppreciation || "",
                grossValue: asset.purchaseValue || "",
                currentBookValue: asset.currentBookValue || "",
                marketValue: asset.marketValue || "",
                capitalValue: asset.capitalValue || "",
                attributes: {
                  ...formData.attributes,
                  ...attributes
                }
              });
            }
          }
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch dynamic valuation data:", err);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetId]);

  useEffect(() => {
    if (!isBuilding && !isLand && formData.grossValue && formData.grossValue !== formData.capitalValue) {
      updateFormData({ capitalValue: formData.grossValue });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.grossValue, formData.capitalValue, updateFormData]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="text-sm font-semibold text-slate-500">Loading dynamic valuation data...</p>
      </div>
    );
  }

  // Use dynamic floors loaded from DB, falling back to context
  const floors = dynamicFloors.length > 0 ? dynamicFloors : (formData.floors || []);

  return (
    <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {isBuilding && !isInfrastructure ? (
        <BuildingValuationSummary
          floors={floors}
          furnitureItems={inventoryState.furnitureItems}
          itEquipmentItems={inventoryState.itEquipmentItems}
          electronicFixtures={inventoryState.electronicFixtures}
          vehicles={inventoryState.vehicles}
        />
      ) : isInfrastructure ? (
        <InfrastructureValuation formData={formData} onChange={handleInputChange} />
      ) : isLand ? (
        <LandValuation formData={formData} onChange={handleInputChange} plotCV={plotCV} />
      ) : (
        <>
          <AssetValuation formData={formData} onChange={handleInputChange} />
          <TaxationDetails formData={formData} onChange={handleInputChange} />
        </>
      )}

      <div className="mt-2 p-2 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-center gap-3">
        <div className="bg-emerald-600 size-2 rounded-full animate-pulse" />
        <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">
          {isBuilding && !isInfrastructure
            ? "Financial Summary: Building capital value auto-calculated from floor construction details"
            : isInfrastructure
            ? "Financial Summary: Infrastructure valuation auto-calculated from metrics and depreciation"
            : isLand
            ? "Financial Summary: Land valuation auto-calculated based on area and market rates"
            : "Financial Summary: Total capital value calculated based on current market rates"}
        </p>
      </div>
    </div>
  );
}
