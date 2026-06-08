"use server";

import { assetMasterService } from "@/lib/api/asset/asset-master.service";
import { categoryTypeService } from "@/lib/api/asset/category-type.service";
import { wardService } from "@/lib/api/asset/ward.service";
import { zoneService } from "@/lib/api/asset/zone.service";

export async function fetchAssetRegisterPage(
  categoryId: number,
  page: number = 1,
  pageSize: number = 10,
  search: string = "",
  assetTypeId?: number | string | null,
  zoneId?: number | string | null,
  wardId?: number | string | null
) {
  const response = await assetMasterService.getAllAssetsPaginated({
    pageNumber: page,
    pageSize,
    assetCategoryId: categoryId,
    assetTypeId: assetTypeId && assetTypeId !== "all" ? Number(assetTypeId) : null,
    zoneId: zoneId && zoneId !== "all" ? Number(zoneId) : null,
    wardId: wardId && wardId !== "all" ? Number(wardId) : null,
    searchTerm: search || undefined,
  });

  if (!response.success) {
    throw new Error("Failed to fetch asset register data");
  }

  const data = response.data;
  const items = Array.isArray(data) ? data : (data?.items || []);
  return {
    items,
    totalCount: (data as any).totalCount || items.length,
    totalPurchaseValue: (data as any).totalPurchaseValue || 0,
    totalMarketValue: (data as any).totalMarketValue || 0,
    totalDepreciation: (data as any).totalDepreciation || 0,
    netBookValue: (data as any).netBookValue || 0,
    activeAssetsCount: (data as any).activeAssetsCount || 0,
  };
}

export async function fetchAssetTypesByCategory(categoryId: number) {
  const response = await categoryTypeService.getTypesByCategory(categoryId);
  if (!response.success) {
    throw new Error("Failed to fetch asset types");
  }
  return (response.data || [])
    .filter((type) => type && type.id != null)
    .map((type) => ({
      id: type.id,
      label: type.typeName || type.assetTypeName || `Type ${type.id}`,
    }));
}

export async function fetchZones() {
  const response = await zoneService.getZones();
  if (!response.success) {
    throw new Error("Failed to fetch zones");
  }
  return (response.data || [])
    .filter((zone) => zone && zone.id != null)
    .map((zone) => ({
      id: Number(zone.id),
      label: `${zone.description || zone.zoneNo || zone.zoneName || `Zone ${zone.id}`}${zone.zoneNo ? ` (${zone.zoneNo})` : ""}`,
    }));
}

export async function fetchWards() {
  const response = await wardService.getWards();
  if (!response.success) {
    throw new Error("Failed to fetch wards");
  }
  return (response.data || [])
    .filter((ward) => ward && ward.id != null)
    .map((ward) => ({
      id: Number(ward.id),
      zoneId: ward.zoneId == null ? null : Number(ward.zoneId),
      label: `${(ward as any).description || ward.wardNo || ward.wardName || ward.name || `Ward ${ward.id}`}${ward.wardNo ? ` (${ward.wardNo})` : ""}`,
    }));
}

/**
 * Fetch category name by ID — wraps categoryTypeService so pages don't import services directly
 */
export async function fetchCategoryNameById(categoryId: number): Promise<string> {
  const response = await categoryTypeService.getCategories();
  if (!response.success) {
    throw new Error("Failed to fetch category name");
  }
  const match = (response.data || []).find((item) => item.id === categoryId);
  return match?.categoryName || '';
}

