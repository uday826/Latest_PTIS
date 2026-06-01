"use server";

import { assetMasterService } from "@/lib/api/asset/asset-master.service";

export async function fetchAssetRegisterPage(
  categoryId: number,
  page: number = 1,
  pageSize: number = 10,
  search: string = "",
  assetTypeId?: number | string | null,
  zoneId?: number | string | null,
  wardId?: number | string | null
) {
  try {
    const response = await assetMasterService.getAllAssetsPaginated({
      pageNumber: page,
      pageSize,
      assetCategoryId: categoryId,
      assetTypeId: assetTypeId && assetTypeId !== "all" ? Number(assetTypeId) : null,
      zoneId: zoneId && zoneId !== "all" ? Number(zoneId) : null,
      wardId: wardId && wardId !== "all" ? Number(wardId) : null,
      searchTerm: search || undefined,
    });

    if (response.success && response.data) {
      const data = response.data;
      const items = Array.isArray(data) ? data : (data.items || []);
      return {
        items,
        totalCount: (data as any).totalCount || items.length,
      };
    }
  } catch (err) {
    console.error("Failed to fetch asset register page:", err);
  }

  return { items: [], totalCount: 0 };
}
