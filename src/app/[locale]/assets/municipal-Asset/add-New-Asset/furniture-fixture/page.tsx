import FurnitureFixturePage from "@/components/modules/assets/municipal-Asset/add-New-Asset/furniture-fixture/FurnitureFixtureStep";
import {
    inventoryService,
    type InventoryItemCategory,
    type InventoryItemCondition,
    type InventoryItemName,
    type InventoryItemModel,
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
    
    console.log("🔵 [SSR page.tsx] URL params:", JSON.stringify(params));
    console.log("🔵 [SSR page.tsx] Extracted parentAssetId:", parentAssetId);
    console.log("🔵 [SSR page.tsx] params.id:", params.id, "params.assetId:", params.assetId);
    
    if (!parentAssetId) {
        console.error("❌ [SSR page.tsx] Parent asset ID is missing from URL!");
    }

    let categories: InventoryItemCategory[] = [];
    let conditions: InventoryItemCondition[] = [];
    let itemNames: InventoryItemName[] = [];
    let itemModels: InventoryItemModel[] = [];
    let initialBatches: InventoryBatchListResponse | null = null;

    try {
        // Fetch master data and existing batches in parallel
        const fetchPromises: Promise<any>[] = [
            inventoryService.getCategories(),
            inventoryService.getConditions(),
            inventoryService.getItemNames(),
            inventoryService.getItemModels(),
        ];

        // Only fetch existing batches if we have a valid parentAssetId
        if (parentAssetId && parentAssetId > 0) {
            fetchPromises.push(getInventoryBatchesAction(parentAssetId));
        }

        const [catRes, condRes, namesRes, modelsRes, batchesRes] = await Promise.all(fetchPromises);

        if (catRes.success && Array.isArray(catRes.data)) {
            categories = catRes.data;
        }
        if (condRes.success && Array.isArray(condRes.data)) {
            conditions = condRes.data;
        }
        if (namesRes.success && Array.isArray(namesRes.data)) {
            itemNames = namesRes.data;
        }
        if (modelsRes.success && Array.isArray(modelsRes.data)) {
            itemModels = modelsRes.data;
        }
        // Load existing batches if available
        if (batchesRes?.success && batchesRes.data) {
            initialBatches = batchesRes.data;
        }
    } catch (error) {
        console.error("⚠️ Failed to fetch inventory data from API on server:", error);
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
