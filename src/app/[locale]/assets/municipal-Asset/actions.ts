"use server";

import { categoryTypeService } from "@/lib/api/asset/category-type.service";
import { assetMasterService } from "@/lib/api/asset/asset-master.service";
import { zoneService } from "@/lib/api/asset/zone.service";
import { wardService } from "@/lib/api/asset/ward.service";
import { apiClient } from "@/services/api.service";

/**
 * Fetch all active asset categories
 */
export async function fetchCategories() {
  const response = await categoryTypeService.getCategories();
  return response;
}

/**
 * Fetch all active asset types
 */
export async function fetchAllTypes() {
  const response = await categoryTypeService.getAllTypes();
  return response;
}

/**
 * Fetch asset types for a specific category
 */
export async function fetchTypesByCategory(categoryId: number) {
  const response = await categoryTypeService.getTypesByCategory(categoryId);
  return response;
}

/**
 * Fetch dashboard summary stats for municipal assets
 * Uses the AssetMaster/dashboard-stats endpoint exclusively
 */
export async function fetchMunicipalAssetDashboardStats() {
  try {
    const response = await assetMasterService.getDashboardStats();
    if (response.success && response.data) {
      return response.data;
    }
  } catch (err) {
    console.error("Failed to fetch dashboard stats from AssetMaster:", err);
  }
  return null;
}

/**
 * Fetch all active Zones
 */
export async function fetchZones() {
  try {
    const response = await zoneService.getZones();
    return response;
  } catch (error) {
    console.error("Error fetching zones:", error);
    return { success: false, error: "Failed to fetch zones", data: [] as any[] };
  }
}

/**
 * Fetch all active Wards (optionally filtered by zone)
 */
export async function fetchWards() {
  try {
    const response = await wardService.getWards();
    return response;
  } catch (error) {
    console.error("Error fetching wards:", error);
    return { success: false, error: "Failed to fetch wards", data: [] as any[] };
  }
}

/**
 * Fetch assets for "Use Existing Asset" flow — filter by zone/ward/search
 * API: GET /AssetMaster?search=...&zoneId=...&wardId=...&pageSize=...
 * Response: { items: [...], totalCount, pageNumber, pageSize, totalPages, hasNext, hasPrevious }
 */
export async function fetchAssetsByFilter(params: { zoneId?: number; wardId?: number; search?: string; pageSize?: number }) {
  try {
    const query = new URLSearchParams();
    if (params.zoneId) query.set("zoneId", String(params.zoneId));
    if (params.wardId) query.set("wardId", String(params.wardId));
    if (params.search) query.set("search", params.search.trim());
    query.set("pageSize", String(params.pageSize ?? 50));
    query.set("pageNumber", "1");

    const response = await apiClient.get<any>(`/AssetMaster?${query.toString()}`);
    if (response.success && response.data) {
      // Handle both direct array and paginated object response
      const isPagedResponse = !Array.isArray(response.data) && response.data.items !== undefined;
      const items: any[] = isPagedResponse
        ? (response.data.items ?? [])
        : (Array.isArray(response.data) ? response.data : (response.data.data ?? []));
      const totalCount: number = isPagedResponse ? (response.data.totalCount ?? items.length) : items.length;
      return { success: true, data: items, totalCount };
    }
    return { success: false, data: [] as any[], totalCount: 0, error: response.error };
  } catch (error) {
    console.error("Error fetching assets by filter:", error);
    return { success: false, data: [] as any[], totalCount: 0, error: "Failed to fetch assets" };
  }
}
