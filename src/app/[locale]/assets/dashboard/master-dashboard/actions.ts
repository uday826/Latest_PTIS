'use server';

import { assetDashboardService } from '@/lib/api/asset/asset-dashboard.service';
import { getCachedZones, getCachedWards } from '@/lib/api/asset/cached-master-data';
import { logger } from '@/lib/utils/logger';
import type { AssetDashboardSummaryDto, AssetDashboardTypeByCategory, AssetDashboardAssetByType } from '@/types/asset-type/asset-dashboard-api.types';
import type { DashboardCategoryItem, DashboardDataPayload, DashboardStats, MunicipalAsset } from '@/types/asset-type/asset-dashboard.types';

// ─── Private helpers ─────────────────────────────────────────────────────────

const n = (v: unknown) => Number(v ?? 0);
const chg = (v: number, s = '') => v === 0 ? '' : `${v > 0 ? '+' : ''}${v.toFixed(1)}${s} vs last period`;

/** Resolve zone/ward display names → numeric IDs once using React-cached zone/ward lists */
async function resolveIds(zoneNo?: string, wardNo?: string): Promise<{ zoneId: number | null; wardId: number | null }> {
  if ((!zoneNo || zoneNo === 'all') && (!wardNo || wardNo === 'all')) return { zoneId: null, wardId: null };
  const [z, w] = await Promise.all([
    getCachedZones().catch(() => ({ data: [] as any[] })),
    getCachedWards().catch(() => ({ data: [] as any[] })),
  ]);
  const zd = (z.data as any[]) ?? [];
  const wd = (w.data as any[]) ?? [];
  return {
    zoneId: zoneNo && zoneNo !== 'all' ? (Number(zd.find((x: any) => String(x.zoneNo) === zoneNo)?.id) || null) : null,
    wardId: wardNo && wardNo !== 'all' ? (Number(wd.find((x: any) => String(x.wardNo) === wardNo)?.id) || null) : null,
  };
}

function buildStats(dto: AssetDashboardSummaryDto, cats: DashboardCategoryItem[]): DashboardStats {
  const cr = n(dto.totalValue) / 1e7;
  const countCards = (dto.assetCountCardDetails ?? []) as any[];
  const valueCards = (dto.assetValueCardDetails ?? []) as any[];
  const assetsBack = countCards.length
    ? countCards.map(c => ({ label: c.category, value: String(c.count), category: String(c.category).trim().toLowerCase() }))
    : cats.map(c => ({ label: c.name, value: String(c.count), category: c.id }));
  const valuesBack = valueCards.length
    ? valueCards.map(c => ({ label: c.title, value: c.value }))
    : cats.map(c => ({ label: `${c.name} Value`, value: c.value > 0 ? `₹${(c.value / 1e7).toFixed(0)}Cr` : '₹0Cr' }));
  return {
    totalAssets: { value: n(dto.totalAssets).toLocaleString('en-IN'), change: chg(n(dto.percentageChange), '%'), backInfo: assetsBack },
    totalValue: { value: `₹${cr >= 1 ? cr.toFixed(0) + 'Cr' : (n(dto.totalValue) / 1e5).toFixed(1) + 'L'}`, change: chg(n(dto.valueChange)), backInfo: valuesBack },
    monetized: {
      value: n(dto.monetizedAssetsCount).toLocaleString('en-IN'), change: '',
      backInfo: [
        { label: 'Leased', value: n(dto.activeLeasedAssetsCount).toLocaleString('en-IN') },
        { label: 'Rented', value: n(dto.activeRentedAssetsCount).toLocaleString('en-IN') },
      ],
    },
    encroachments: { value: String(n(dto.encroachments)), change: chg(n(dto.encroachmentChange)), backInfo: [] },
    maintenance: { value: String(n(dto.maintenanceDue)), change: chg(n(dto.maintenanceChange)), backInfo: [] },
    auctions: { value: String(n(dto.activeAuctions)), change: chg(n(dto.auctionChange)), backInfo: [] },
    acquisitions: { value: String(n(dto.assetAcquisition)), change: chg(n(dto.acquisitionChange)), backInfo: [] },
  };
}

function mapCategory(dto: any): DashboardCategoryItem {
  const name = String(dto.category ?? dto.categoryName ?? '');
  return {
    id: name.trim().toLowerCase() || String(dto.id ?? dto.categoryId ?? ''),
    categoryId: Number(dto.id ?? dto.categoryId ?? 0),
    name: name || `Category ${dto.id}`,
    count: Number(dto.count ?? 0),
    value: Number(dto.totalValue ?? dto.value ?? 0),
    color: '#3B82F6',
    description: '',
  };
}

function mapLocation(dto: any, zoneNo?: string, wardNo?: string): MunicipalAsset {
  return {
    id: String(dto.id || Math.random()),
    name: dto.name || dto.assetNo || `Asset ${dto.id}`,
    category: (dto.categoryName || 'building').trim().toLowerCase() as MunicipalAsset['category'],
    subCategory: dto.categoryName || '',
    location: 'Municipal Area',
    zone: zoneNo && zoneNo !== 'all' ? zoneNo : '',
    ward: wardNo && wardNo !== 'all' ? wardNo : '',
    latitude: Number(dto.latitude) || 0,
    longitude: Number(dto.longitude) || 0,
    status: dto.status || 'Active',
    health: 0, lastInspection: '',
    valueLakhs: dto.marketValue ? dto.marketValue / 1e5 : 0,
    usage: '', marketValue: dto.marketValue || 0,
    encroachment: { hasEncroachment: false },
  };
}

const EMPTY_STATS: DashboardStats = {
  totalAssets: { value: '0', change: '', backInfo: [] }, totalValue: { value: '₹0Cr', change: '', backInfo: [] },
  monetized: { value: '0', change: '', backInfo: [] }, encroachments: { value: '0', change: '', backInfo: [] },
  maintenance: { value: '0', change: '', backInfo: [] }, auctions: { value: '0', change: '', backInfo: [] },
  acquisitions: { value: '0', change: '', backInfo: [] },
};

// ─── Exported Server Actions ──────────────────────────────────────────────────

/**
 * SSR (page.tsx): Parallel-fetches summary + categories + locations + zones + wards in one shot.
 * Client gets fully populated initial state — no waterfall loading after hydration.
 */
export async function fetchInitialDashboardAction() {
  try {
    const [summaryData, catsData, locsData, zonesRes, wardsRes] = await Promise.all([
      assetDashboardService.getSummary().catch(() => null),
      assetDashboardService.getCategoryCounts().catch(() => []),
      assetDashboardService.getLocations().catch(() => []),
      getCachedZones().catch(() => ({ data: [] as any[] })),
      getCachedWards().catch(() => ({ data: [] as any[] })),
    ]);

    const zoneData = (zonesRes.data as any[]) ?? [];
    const wardData = (wardsRes.data as any[]) ?? [];
    const allZones = [...new Set(zoneData.map((z: any) => String(z.zoneNo || '')).filter(Boolean))];
    const zoneMap = new Map<any, string>(zoneData.map((z: any) => [z.id, String(z.zoneNo || '')]));
    const allWards = wardData.map((w: any) => ({ wardNo: String(w.wardNo || ''), zoneNo: zoneMap.get(w.zoneId) || '' })).filter(w => w.wardNo);

    const categories = (catsData as any[]).map(mapCategory);
    const stats = summaryData ? buildStats(summaryData as AssetDashboardSummaryDto, categories) : EMPTY_STATS;
    const allLocs = (locsData as any[]).map((d: any) => mapLocation(d));
    const assets = allLocs.filter(a => a.latitude !== 0 || a.longitude !== 0);

    const data: DashboardDataPayload = { stats, categories, filteredAssets: assets.length > 0 ? assets : allLocs, zoneDistribution: [], acquisitionsList: [], auctionsList: [], allZones, allWards };
    
    return data;
  } catch (error) {
    logger.error('[SSR] fetchInitialDashboardAction failed', { error: error as Error });
    return { error: error instanceof Error ? error.message : "Failed to fetch initial dashboard data" };
  }
}

/**
 * Client: One call for zone/ward filter changes. Returns stats + categories + map assets together.
 */
export async function fetchFilteredAction(zoneNo: string, wardNo: string) {
  try {
    const { zoneId, wardId } = await resolveIds(zoneNo, wardNo);
    const [summaryData, locsData, zonesRes, wardsRes] = await Promise.all([
      assetDashboardService.getSummary(zoneId, wardId).catch(() => null),
      assetDashboardService.getLocations(zoneId, wardId).catch(() => []),
      getCachedZones().catch(() => ({ data: [] as any[] })),
      getCachedWards().catch(() => ({ data: [] as any[] })),
    ]);

    const zoneData = (zonesRes.data as any[]) ?? [];
    const wardData = (wardsRes.data as any[]) ?? [];
    const allZones = [...new Set(zoneData.map((z: any) => String(z.zoneNo || '')).filter(Boolean))];
    const zoneMap = new Map<any, string>(zoneData.map((z: any) => [z.id, String(z.zoneNo || '')]));
    const allWards = wardData.map((w: any) => ({ wardNo: String(w.wardNo || ''), zoneNo: zoneMap.get(w.zoneId) || '' })).filter(w => w.wardNo);

    const countCards = (summaryData?.assetCountCardDetails ?? []) as any[];
    const valueCards = (summaryData?.assetValueCardDetails ?? []) as any[];
    const categories: DashboardCategoryItem[] = countCards.map((c: any) => {
      const cat = mapCategory(c);
      if (!cat.value) {
        const vc = valueCards.find((v: any) => String(v.title || '').replace(/\s*Value$/i, '').toLowerCase() === cat.name.toLowerCase());
        if (vc) {
          const cr = String(vc.value || '').match(/([\d.]+)\s*Cr/i);
          const l = String(vc.value || '').match(/([\d.]+)\s*L/i);
          if (cr) cat.value = parseFloat(cr[1]) * 1e7;
          else if (l) cat.value = parseFloat(l[1]) * 1e5;
        }
      }
      return cat;
    });

    const stats = summaryData ? buildStats(summaryData as AssetDashboardSummaryDto, categories) : EMPTY_STATS;
    const allLocs = (locsData as any[]).map((d: any) => mapLocation(d, zoneNo, wardNo));
    const assets = allLocs.filter(a => a.latitude !== 0 || a.longitude !== 0);
    
    return { stats, categories, filteredAssets: assets.length > 0 ? assets : allLocs, allZones, allWards, zoneDistribution: [], acquisitionsList: [], auctionsList: [] };
  } catch (error) {
    logger.error('[Action] fetchFilteredAction failed', { error: error as Error });
    return { error: error instanceof Error ? error.message : "Failed to fetch filtered data" };
  }
}

/**
 * On-demand: Subcategory type breakdown. When zone/ward active, recounts via parallel assets-by-type calls
 */
export async function fetchTypesByCategoryAction(categoryId: number | null, zoneNo?: string, wardNo?: string) {
  try {
    const typesData = await assetDashboardService.getTypesByCategory(categoryId);

    let types = (typesData as any[]).map(tp => ({
      id: tp.id ?? tp.Id, assetType: tp.assetType ?? tp.AssetType,
      count: tp.count ?? tp.Count, totalValue: tp.totalValue ?? tp.TotalValue ?? 0,
      categoryId: tp.categoryId ?? tp.CategoryId,
    }));
    if (categoryId) types = types.filter(tp => tp.categoryId === categoryId || tp.categoryId == null);

    if ((zoneNo && zoneNo !== 'all') || (wardNo && wardNo !== 'all')) {
      const counts = await Promise.all(types.map(async tp => {
        try {
          const r = await assetDashboardService.getAssetsByType(tp.id, null, null);
          let assets = (r ?? []) as any[];
          if (zoneNo && zoneNo !== 'all') assets = assets.filter((a: any) => a.zoneName === zoneNo);
          if (wardNo && wardNo !== 'all') assets = assets.filter((a: any) => a.wardName === wardNo);
          return { id: tp.id, count: assets.length };
        } catch { return { id: tp.id, count: 0 }; }
      }));
      const countMap = new Map(counts.map(c => [c.id, c.count]));
      types = types.map(tp => ({ ...tp, count: countMap.get(tp.id) ?? 0 })).filter(tp => tp.count > 0);
    }

    return types as AssetDashboardTypeByCategory[];
  } catch (error) {
    logger.error('[Action] fetchTypesByCategoryAction failed', { error: error as Error });
    return { error: error instanceof Error ? error.message : "Failed to fetch types" };
  }
}

/**
 * On-demand: Assets for a type drill-down. Filters by zone/ward string matching (no ID resolution needed).
 */
export async function fetchAssetsByTypeAction(assetTypeId: number, zoneNo?: string, wardNo?: string) {
  try {
    const assetsData = await assetDashboardService.getAssetsByType(assetTypeId, null, null);
    
    let assets = (assetsData as any[]).map((dto: any) => ({
      id: dto.id || 0, name: dto.name || `Asset ${dto.id}`, code: dto.code || dto.assetNo || '',
      status: dto.status || 'Active', marketValue: dto.marketValue || 0,
      latitude: dto.latitude || 0, longitude: dto.longitude || 0,
      wardName: dto.wardName || '', zoneName: dto.zoneName || '',
    }));
    if (zoneNo && zoneNo !== 'all') assets = assets.filter((a: any) => a.zoneName === zoneNo);
    if (wardNo && wardNo !== 'all') assets = assets.filter((a: any) => a.wardName === wardNo);
    
    return assets as AssetDashboardAssetByType[];
  } catch (error) {
    logger.error('[Action] fetchAssetsByTypeAction failed', { error: error as Error });
    return { error: error instanceof Error ? error.message : "Failed to fetch assets" };
  }
}

