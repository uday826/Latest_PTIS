"use client";

import React from "react";
import { Armchair } from "lucide-react";
import FurnitureFixtureClient from "./FurnitureFixtureClient";
import { useAssetForm } from "../AssetFormContext";
import type { InventoryItemCategory, InventoryItemCondition, InventoryItemName, InventoryItemModel } from "@/lib/api/asset/inventory.service";
import type { InventoryBatchListResponse } from "@/app/[locale]/asset/municipal-Asset/add-New-Asset/furniture&Fixture/actions";

interface Props {
  parentAssetId?: number | null;
  categories?: InventoryItemCategory[];
  conditions?: InventoryItemCondition[];
  itemNames?: InventoryItemName[];
  itemModels?: InventoryItemModel[];
  initialBatches?: InventoryBatchListResponse | null;
}

export default function FurnitureFixturePage({ parentAssetId, categories = [], conditions = [], itemNames = [], itemModels = [], initialBatches = null }: Props) {
  const { formData, handleInputChange, handleToggleChange } = useAssetForm();

  const typeLower = (formData.assetType || "").toLowerCase();
  const isLandFurnitureAllowed = ["garden", "park", "playground", "reserved"].some(keyword => typeLower.includes(keyword));

  const isLand = formData.category === "LAND" && !isLandFurnitureAllowed;
  const isMovable = formData.category === "MOVABLE";
  
  // We show the full form if it's a building/infrastructure or an applicable land asset
  const showForm = !isLand && !isMovable;

  return (
    <div className="space-y-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {showForm && (
        <div className="pt-2">
          <FurnitureFixtureClient 
            parentAssetId={parentAssetId}
            categories={categories} 
            conditions={conditions} 
            itemNames={itemNames} 
            itemModels={itemModels}
            initialBatches={initialBatches}
          />
        </div>
      )}

      {(isLand || isMovable) && (
        <div className="p-10 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center">
            <div className="bg-white p-2 rounded-full shadow-sm mb-2">
              <Armchair className="size-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-700">Inventory Tracking Not Applicable</h3>
            <p className="text-sm text-slate-500 max-w-xs mt-2 uppercase tracking-tight font-medium">
              Inventory tracking for furniture and fixtures is typically not required for {formData.category.toLowerCase()} assets of this type.
            </p>
            <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-widest font-black">
              Please proceed to the next step
            </p>
        </div>
      )}

      {/* Temporarily hidden - SafetyInfrastructure section */}
      {/* {showForm && <SafetyInfrastructure formData={formData} onToggle={handleToggleChange} onChange={handleInputChange} />} */}
      
      <div className="mt-2 p-2 bg-violet-50/50 rounded-xl border border-violet-100 flex items-center gap-3">
        <div className="bg-violet-600 size-2 rounded-full animate-pulse" />
        <p className="text-[10px] font-black text-violet-800 uppercase tracking-widest">
          Dynamic Inventory: Showing fields relevant to {formData.category} category
        </p>
      </div>
    </div>
  );
}
