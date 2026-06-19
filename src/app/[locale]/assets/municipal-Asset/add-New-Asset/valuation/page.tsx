import ValuationPage from "@/components/modules/assets/municipal-Asset/add-New-Asset/valuation/ValuationStep";
import { inventoryService } from "@/lib/api/asset/inventory.service";

export default async function Page() {
  let categories: any[] = [];
  let conditions: any[] = [];
  try {
    const [catRes, condRes] = await Promise.all([
      inventoryService.getCategories(),
      inventoryService.getConditions()
    ]);
    if (catRes.success && catRes.data) {
      categories = catRes.data.filter((item: any) => 
        item.isActive !== false && item.isActive !== 0 && 
        item.status?.toLowerCase() !== 'inactive'
      );
    }
    if (condRes.success && condRes.data) {
      conditions = condRes.data.filter((item: any) => 
        item.isActive !== false && item.isActive !== 0 && 
        item.status?.toLowerCase() !== 'inactive'
      );
    }
  } catch (error) {
    console.error("Failed to load categories for valuation page:", error);
  }

  return <ValuationPage initialCategories={categories} initialConditions={conditions} />;
}


