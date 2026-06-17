"use server";

import { assetMasterService } from "@/lib/api/asset/asset-master.service";
import { categoryTypeService } from "@/lib/api/asset/category-type.service";
import { wardService } from "@/lib/api/asset/ward.service";
import { zoneService } from "@/lib/api/asset/zone.service";
import { departmentService } from "@/lib/api/asset/department.service";
import type { AssetRegisterPageResult } from "@/types/municipal-asset-service.types";

const EMPTY_ASSET_REGISTER_PAGE_RESULT: AssetRegisterPageResult = {
  items: [],
  totalCount: 0,
  totalPurchaseValue: 0,
  totalMarketValue: 0,
  totalDepreciation: 0,
  netBookValue: 0,
  activeAssetsCount: 0,
  error: null,
};

export async function fetchAssetRegisterPage(
  categoryId: number,
  page: number = 1,
  pageSize: number = 10,
  search: string = "",
  assetTypeId?: number | string | null,
  zoneId?: number | string | null,
  wardId?: number | string | null,
  owningDepartmentId?: number | string | null
): Promise<AssetRegisterPageResult> {
  try {
    const response = await assetMasterService.getAllAssetsPaginated({
      pageNumber: page,
      pageSize,
      assetCategoryId: categoryId,
      assetTypeId: assetTypeId && assetTypeId !== "all" ? Number(assetTypeId) : null,
      zoneId: zoneId && zoneId !== "all" ? Number(zoneId) : null,
      wardId: wardId && wardId !== "all" ? Number(wardId) : null,
      owningDepartmentId: owningDepartmentId && owningDepartmentId !== "all" ? Number(owningDepartmentId) : null,
      searchTerm: search || undefined,
    });

    if (!response.success || !response.data) {
      return { ...EMPTY_ASSET_REGISTER_PAGE_RESULT, error: response.error || 'Failed to fetch asset register data' };
    }

    const data = response.data;
    const items = Array.isArray(data) ? data : (data.items || []);

    return {
      items,
      totalCount: data.totalCount || items.length,
      totalPurchaseValue: data.totalPurchaseValue || 0,
      totalMarketValue: data.totalMarketValue || 0,
      totalDepreciation: data.totalDepreciation || 0,
      netBookValue: data.netBookValue || 0,
      activeAssetsCount: data.activeAssetsCount || 0,
      error: null,
    };
  } catch (error) {
    console.error("Failed to fetch asset register data:", error);
    return { ...EMPTY_ASSET_REGISTER_PAGE_RESULT, error: error instanceof Error ? error.message : 'Failed to fetch asset register data' };
  }
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

export async function fetchWards(zoneId?: number | string | null) {
  const response = await wardService.getWards(zoneId);
  if (!response.success) {
    throw new Error("Failed to fetch wards");
  }
  return (response.data || [])
    .filter((ward) => ward && ward.id != null)
    .map((ward) => {
      const w = ward as { description?: string; wardNo?: string; wardName?: string; name?: string; id?: number };
      return {
        id: Number(ward.id),
        zoneId: ward.zoneId == null ? null : Number(ward.zoneId),
        label: `${w.description || w.wardNo || w.wardName || w.name || `Ward ${ward.id}`}${w.wardNo ? ` (${w.wardNo})` : ""}`,
      };
    });
}

/**
 * Fetch category name by ID - wraps categoryTypeService so pages do not import services directly
 */
export async function fetchCategoryNameById(categoryId: number): Promise<string | null> {
  const response = await categoryTypeService.getCategories();
  if (!response.success) {
    throw new Error("Failed to fetch category name");
  }
  const match = (response.data || []).find((item) => item.id === categoryId);
  return match?.categoryName || null;
}

export async function fetchDepartments() {
  try {
    const response = await departmentService.getDepartments();
    if (response.success && response.data) {
      return response.data
        .filter((dept) => dept && dept.id != null)
        .map((dept) => ({
          id: Number(dept.id),
          label: dept.departmentName || `Department ${dept.id}`,
        }));
    }
  } catch (error) {
    console.error("Failed to fetch departments:", error);
  }
  return [];
}
