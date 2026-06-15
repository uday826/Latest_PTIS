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
        const batchesPromise = parentAssetId && parentAssetId > 0
            ? getInventoryBatchesAction(parentAssetId)
            : Promise.resolve(null);

        // Fetch sequentially to prevent overloading the backend with 5 simultaneous requests
        const catRes = await inventoryService.getCategories();
        const condRes = await inventoryService.getConditions();
        const namesRes = await inventoryService.getItemNames();
        const modelsRes = await inventoryService.getItemModels();
        const batchesRes = await batchesPromise;

        const filterActive = (data: any) => Array.isArray(data) ? data.filter((item: any) => 
            item.isActive !== false && item.isActive !== 0 && 
            item.IsActive !== false && item.IsActive !== 0 && 
            item.status?.toLowerCase() !== 'inactive'
        ) : [];
        

        categories = catRes.success ? filterActive(catRes.data) : [];
        conditions = condRes.success ? filterActive(condRes.data) : [];
        itemNames = namesRes.success ? filterActive(namesRes.data) : [];
        itemModels = modelsRes.success ? filterActive(modelsRes.data) : [];

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
