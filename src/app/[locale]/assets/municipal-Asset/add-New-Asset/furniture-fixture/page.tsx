import FurnitureFixturePage from "@/components/modules/assets/municipal-Asset/add-New-Asset/furniture-fixture/FurnitureFixtureStep";
import {
  inventoryService,
  type InventoryItemCategory,
  type InventoryItemCondition,
  type InventoryItemModel,
  type InventoryItemName,
} from "@/lib/api/asset/inventory.service";
import { getInventoryBatchesAction, type InventoryBatchListResponse } from "./actions";

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function FurnitureFixturesInventoryPage({ searchParams }: PageProps) {
    const params = await searchParams;
    
    // 🔥 IMMEDIATE SAVE FIX: Read parent asset ID from URL - prioritize assetId param
    const parentAssetId = params.assetId 
        ? Number(params.assetId) 
        : (params.id ? Number(params.id) : null);

    let categories: InventoryItemCategory[] = [];
    let conditions: InventoryItemCondition[] = [];
    let itemNames: InventoryItemName[] = [];
    let itemModels: InventoryItemModel[] = [];
    let initialBatches: InventoryBatchListResponse | null = null;

    try {
        const masterDataPromise = Promise.all([
            inventoryService.getCategories(),
            inventoryService.getConditions(),
            inventoryService.getItemNames(),
            inventoryService.getItemModels(),
        ]);
        const batchesPromise = parentAssetId && parentAssetId > 0
            ? getInventoryBatchesAction(parentAssetId)
            : Promise.resolve(null);

        const [[catRes, condRes, namesRes, modelsRes], batchesRes] = await Promise.all([masterDataPromise, batchesPromise]);

        categories = catRes.success && Array.isArray(catRes.data) ? catRes.data : [];
        conditions = condRes.success && Array.isArray(condRes.data) ? condRes.data : [];
        itemNames = namesRes.success && Array.isArray(namesRes.data) ? namesRes.data : [];
        itemModels = modelsRes.success && Array.isArray(modelsRes.data) ? modelsRes.data : [];

        if (batchesRes?.success && batchesRes.data) {
            initialBatches = batchesRes.data;
        }
    } catch (error) {

    }

    return (
        <FurnitureFixturePage
            parentAssetId={parentAssetId}
            categories={categories}
            conditions={conditions}
            itemNames={itemNames}
            itemModels={itemModels}
            initialBatches={initialBatches}
        />
    );
}
