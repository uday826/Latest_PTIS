'use server';

import type { AssetDashboardStatsDto } from '@/lib/api/asset/asset-master.service';
import { assetMasterService } from '@/lib/api/asset/asset-master.service';
import { wardService } from '@/lib/api/asset/ward.service';
import { zoneService } from '@/lib/api/asset/zone.service';
import { mapSummaryToStats } from '@/lib/utils/asset-utils/asset-dashboard-helpers';
import { logger } from '@/lib/utils/logger';
import type { AssetCategoryCount, AssetSummaryData, DashboardCategoryItem, DashboardDataPayload, MunicipalAsset } from '@/types/asset-type/asset-dashboard.types';
import { ApiResponse } from '@/types/common.types';

const mapCategoryItem = (c: { categoryName?: string; category?: string; categoryId?: string | number; id?: string | number; count?: number; value?: number; color?: string; description?: string }): DashboardCategoryItem => {
  const name = String(c.categoryName || c.category || '');
  return {
    id: name.trim().toLowerCase() || String(c.categoryId ?? c.id ?? '').trim().toLowerCase(),
    categoryId: Number(c.categoryId ?? c.id ?? 0),
    name: name || `Category ${c.id}`,
    count: Number(c.count || 0),
    value: Number(c.value || 0),
    color: String(c.color || '#3B82F6'),
    description: String(c.description || ''),
  };
};

/** Convert AssetMaster dashboard-stats into the AssetSummaryData shape */
function statsToSummary(stats: AssetDashboardStatsDto): AssetSummaryData {
  const totalValue = stats.categoryStats.reduce((sum, c) => sum + Number(c.totalValue ?? 0), 0);
  return {
    totalAssets: stats.totalAssets,
    totalAssetsCount: stats.totalAssets,
    totalValue,
    totalAssetsValue: totalValue,
    encroachedAssets: 0,
    encroachedCount: 0,
    maintenanceAssets: 0,
    maintenanceCount: 0,
    totalAuctions: 0,
    auctionCount: 0,
    totalAcquisitions: 0,
    acquisitionCount: 0,
  };
}

/** Convert AssetMaster dashboard-stats categories into AssetCategoryCount[] */
function statsToCategoryCounts(stats: AssetDashboardStatsDto): AssetCategoryCount[] {
  return stats.categoryStats.map(cat => ({
    categoryId: cat.categoryId,
    categoryName: cat.categoryName,
    count: cat.registeredAssets,
    value: Number(cat.totalValue ?? 0),
    description: cat.categoryDescription || '',
  }));
}

/**
 * Server Action to fetch the dashboard stat card summary data (used by page.tsx for SSR)
 */
export async function fetchSummaryAction(): Promise<ApiResponse<AssetSummaryData>> {
  logger.debug('[Server Action] Fetching summary via AssetMaster/dashboard-stats...');
  try {
    const res = await assetMasterService.getDashboardStats();
    if (res.success && res.data) {
      return { success: true, statusCode: 200, message: 'Success', data: statsToSummary(res.data) };
    }
    return { success: false, statusCode: res.statusCode || 500, message: res.message || 'Failed to fetch stats' };
  } catch (err) {
    logger.error('[Server Action] fetchSummaryAction failed', { error: err as Error });
    return { success: false, statusCode: 500, message: String(err) };
  }
}

/**
 * Server Action to fetch asset counts by parent category (used by page.tsx for SSR)
 */
export async function fetchCategoryCountsAction(): Promise<ApiResponse<AssetCategoryCount[]>> {
  logger.debug('[Server Action] Fetching category counts via AssetMaster/dashboard-stats...');
  try {
    const res = await assetMasterService.getDashboardStats();
    if (res.success && res.data) {
      return { success: true, statusCode: 200, message: 'Success', data: statsToCategoryCounts(res.data) };
    }
    return { success: false, statusCode: res.statusCode || 500, message: res.message || 'Failed to fetch category counts' };
  } catch (err) {
    logger.error('[Server Action] fetchCategoryCountsAction failed', { error: err as Error });
    return { success: false, statusCode: 500, message: String(err) };
  }
}

/**
 * Single optimized Server Action to fetch the entire DashboardDataPayload on the server.
 * Now uses AssetMaster endpoints exclusively:
 *  - GET /AssetMaster/dashboard-stats → summary, categories, types
 *  - GET /AssetMaster?AssetTypeId=X&PageSize=-1 → actual asset records per type
 */
export async function fetchDashboardDataAction(): Promise<ApiResponse<DashboardDataPayload>> {
  logger.debug('[Server Action] Fetching entire dashboard data via AssetMaster...');
  try {
    // 1. Fetch dashboard stats (summary + categories + type breakdowns)
    const statsRes = await assetMasterService.getDashboardStats();
    if (!statsRes.success || !statsRes.data) {
      return { success: false, statusCode: statsRes.statusCode || 500, message: statsRes.message || 'Failed to fetch dashboard stats' };
    }

    const statsData = statsRes.data;
    const summary = statsToSummary(statsData);
    const rawCategories = statsToCategoryCounts(statsData);
    const categories = rawCategories.map(mapCategoryItem);

    // 2. Collect all asset type IDs from the stats with their category info
    const subcategories: { typeId: number; typeName: string; categoryId: number; categoryName: string }[] = [];
    statsData.categoryStats.forEach(cat => {
      const catItem = categories.find(c => Number(c.categoryId) === cat.categoryId);
      const catName = catItem ? catItem.id : cat.categoryName.trim().toLowerCase();
      (cat.assetTypeStats || []).forEach(type => {
        if (type.assetTypeId) {
          subcategories.push({
            typeId: type.assetTypeId,
            typeName: type.assetTypeName,
            categoryId: cat.categoryId,
            categoryName: catName,
          });
        }
      });
    });

    // 3. Fetch actual asset records for each type and master data for lookups
    const [zonesRes, wardsRes] = await Promise.all([
      zoneService.getZones().catch(() => null),
      wardService.getWards().catch(() => null)
    ]);
    const zonesMasterList = zonesRes?.success && zonesRes.data ? zonesRes.data : [];
    const wardsMasterList = wardsRes?.success && wardsRes.data ? wardsRes.data : [];

    const allAssets: MunicipalAsset[] = [];
    if (subcategories.length > 0) {
      const assetsResults = await Promise.all(
        subcategories.map(async sub => {
          try {
            const res = await assetMasterService.getAllAssetsPaginated({
              assetTypeId: sub.typeId,
              pageSize: -1, // Get all records
            });
            const data = res.success && res.data ? res.data : null;
            const items = data ? (Array.isArray(data) ? data : data.items || []) : [];
            return { sub, assets: items };
          } catch {
            return { sub, assets: [] };
          }
        })
      );

      assetsResults.forEach(({ sub, assets }) => {
        (assets as any[]).forEach((asset, index) => {
          const rawVal = Number(asset.marketValue ?? asset.purchaseValue ?? asset.capitalValue ?? 0);
          const assetIdNum = Number(asset.id) || index;
          
          const latitude = Number(asset.latitude ?? 0);
          const longitude = Number(asset.longitude ?? 0);

          // Lookup zone and ward to get the short "No" (e.g. "A", "A1") instead of descriptions
          const assetZoneName = String(asset.zoneName || asset.zone || '').trim();
          const assetWardName = String(asset.wardName || asset.ward || '').trim();
          
          let resolvedZoneNo = asset.zoneNo;
          if (!resolvedZoneNo && assetZoneName) {
            const foundZone = zonesMasterList.find(z => 
              z.id === asset.zoneId || 
              z.description === assetZoneName || 
              z.zoneName === assetZoneName ||
              z.ZoneName === assetZoneName
            );
            resolvedZoneNo = foundZone?.zoneNo || foundZone?.ZoneNo;
          }
          
          let resolvedWardNo = asset.wardNo;
          if (!resolvedWardNo && assetWardName) {
            const foundWard = wardsMasterList.find(w => 
              w.id === asset.wardId || 
              w.name === assetWardName || 
              w.wardName === assetWardName ||
              w.WardName === assetWardName ||
              w.description === assetWardName ||
              w.Description === assetWardName
            );
            resolvedWardNo = foundWard?.wardNo || foundWard?.WardNo;
          }

          const finalZone = String(resolvedZoneNo || assetZoneName || '');
          const finalWard = String(resolvedWardNo || assetWardName || '');

          allAssets.push({
            id: String(asset.id ?? assetIdNum),
            name: String(asset.assetName || asset.name || asset.assetNo || ''),
            category: String(asset.assetCategoryName || asset.categoryName || sub.categoryName) as MunicipalAsset['category'],
            subCategory: String(asset.assetTypeName || asset.typeName || sub.typeName || ''),
            zone: finalZone,
            ward: finalWard,
            location: String(asset.address || 'Municipal Area'),
            valueLakhs: rawVal > 1000000 ? rawVal / 100000 : rawVal,
            status: String(asset.status || 'Active'),
            latitude,
            longitude,
            health: Number(asset.health ?? 0),
            lastInspection: String(asset.lastInspection || asset.purchaseDate || ''),
            usage: String(asset.usage || asset.occupancyStatus || ''),
            encroachment: asset.encroachment || { hasEncroachment: false },
            // Additional fields from AssetMaster
            department: String(asset.departmentName || ''),
            marketValue: Number(asset.marketValue ?? 0),
            builtUpArea: Number(asset.builtUpAreaSqMeter ?? 0),
            landArea: Number(asset.landAreaSqMeter ?? 0),
            ownerID: String(asset.ownershipType || ''),
            surveyNumber: String(asset.csn || ''),
            condition: String(asset.assetCondition || ''),
          });
        });
      });
    }

    const stats = mapSummaryToStats(summary as Record<string, unknown>, categories);

    const allZones = Array.from(new Set(zonesMasterList.map(z => String(z.zoneNo || z.ZoneNo || z.zoneName || z.description || '')).filter(Boolean)));
    const allWardsRaw = wardsMasterList.map(w => {
      const wardNo = String(w.wardNo || w.WardNo || w.name || w.wardName || w.description || '');
      const foundZone = zonesMasterList.find(z => z.id === w.zoneId);
      const zoneNo = foundZone ? String(foundZone.zoneNo || foundZone.ZoneNo || foundZone.zoneName || foundZone.description || '') : '';
      return { wardNo, zoneNo };
    }).filter(w => w.wardNo);
    const allWards = Array.from(new Map(allWardsRaw.map(w => [w.wardNo, w])).values());

    const payload: DashboardDataPayload = {
      stats,
      filteredAssets: allAssets,
      categories,
      zoneDistribution: [],
      acquisitionsList: [],
      auctionsList: [],
      allZones,
      allWards,
    };

    return {
      success: true,
      statusCode: 200,
      message: 'Success',
      data: payload,
    };
  } catch (err) {
    logger.error('[Server Action] fetchDashboardDataAction failed', { error: err as Error });
    return {
      success: false,
      statusCode: 500,
      message: String(err),
    };
  }
}
