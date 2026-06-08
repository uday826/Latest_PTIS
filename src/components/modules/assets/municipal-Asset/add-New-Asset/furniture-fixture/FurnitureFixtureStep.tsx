"use client";


import { Armchair } from "lucide-react";
import FurnitureFixtureClient from "./FurnitureFixtureClient";
import { useAssetForm } from "../AssetFormContext";
import type { InventoryItemCategory, InventoryItemCondition, InventoryItemName, InventoryItemModel } from "@/lib/api/asset/inventory.service";
import type { InventoryBatchListResponse } from "@/app/[locale]/assets/municipal-Asset/add-New-Asset/furniture-fixture/actions";

interface Props {
  parentAssetId?: number | null;
  categories?: InventoryItemCategory[];
  conditions?: InventoryItemCondition[];
  itemNames?: InventoryItemName[];
  itemModels?: InventoryItemModel[];
  initialBatches?: InventoryBatchListResponse | null;
}

export default function FurnitureFixturePage({ parentAssetId, categories = [], conditions = [], itemNames = [], itemModels = [], initialBatches = null }: Props) {
  const { formData } = useAssetForm();

  const typeLower = (formData.assetType || "").toLowerCase();
  const isLandFurnitureAllowed = ["garden", "park", "playground", "reserved"].some(keyword => typeLower.includes(keyword));

  const isLand = formData.category === "LAND" && !isLandFurnitureAllowed;

  // Use DB flag when available (new flow); fall back to legacy string check
  const showForm = formData.hasInventory !== undefined
    ? formData.hasInventory === true
    : !isLand;

  const isInventoryMandatory = formData.isInventoryMandatory !== undefined
    ? formData.isInventoryMandatory === true
    : formData.isMovableCategory === true;

  return (
    <div className="space-y-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Mandatory banner — driven by DB flag */}
      {isInventoryMandatory && (
        <div className="px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl mb-3 flex items-center gap-3">
          <div className="bg-amber-500 size-2 rounded-full shrink-0" />
          <p className="text-xs font-bold text-amber-800 uppercase tracking-widest">
            Mandatory: At least one inventory item must be added before proceeding
          </p>
        </div>
      )}

      {/* Inventory form */}
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

      {/* Not Applicable placeholder */}
      {!showForm && (
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
