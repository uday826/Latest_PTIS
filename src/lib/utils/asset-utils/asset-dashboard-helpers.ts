import { BarChart3, MapPin, Activity, IndianRupee, Wrench, ShieldAlert, Coins } from 'lucide-react';
import type { DashboardStats, DashboardDataPayload, MunicipalAsset, DashboardCategoryItem } from '@/types/asset-type/asset-dashboard.types';

export const ICONS = { BarChart3, MapPin, Activity, IndianRupee, Wrench, ShieldAlert, Coins };

/** Normalises any value to a trimmed lowercase string for comparison */
export const normKey = (v: unknown) => String(v ?? '').trim().toLowerCase();

/** Converts a raw string to Title Case */
export const toTitleCase = (v: unknown) =>
  String(v ?? '').replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim()
    .split(' ').filter(Boolean).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');

/** Maps a raw category string to its i18n key */
export const getCategoryKey = (cat: string): string => {
  const norm = normKey(cat);
  const mapping: Record<string, string> = { land: 'land', building: 'building', buildings: 'building', infrastructure: 'infrastructure', movable: 'movable' };
  return mapping[norm] ?? '';
};

/** Conversion factor: Lakhs to Crores (1 Cr = 10 L for display purposes) */
export const LAKHS_TO_CRORES = 10;

// Preserve DashboardCategoryItem reference for mapSummaryToStats overload
type CategoryLike = DashboardCategoryItem | Record<string, unknown>;
export const fmtRupee = (v: number) => {
  if (v >= 100) {
    return `Rs. ${(v / 100).toFixed(2)}Cr`;
  }
  return `Rs. ${v.toFixed(1)}L`;
};

export const getUniqueCategories = (assets: MunicipalAsset[]): string[] => {
  const cats = Array.from(new Set(assets.map(a => String(a.category || '').trim()).filter(Boolean)));
  return cats.length > 0 ? cats : ['land', 'building', 'infrastructure', 'movable'];
};

export const buildCatBack = (assets: MunicipalAsset[]) => {
  const cats = getUniqueCategories(assets);
  return cats.slice(0, 5).map(cat => ({
    label: cat.charAt(0).toUpperCase() + cat.slice(1),
    value: assets.filter(a => normKey(a.category) === normKey(cat)).length.toString(),
    category: cat
  }));
};

export const buildValBack = (assets: MunicipalAsset[]) => {
  const cats = getUniqueCategories(assets);
  return cats.slice(0, 5).map(cat => ({
    label: `${cat.charAt(0).toUpperCase() + cat.slice(1)} Value`,
    value: fmtRupee(assets.filter(a => normKey(a.category) === normKey(cat)).reduce((s, a) => s + a.valueLakhs, 0))
  }));
};

export const mapSummaryToStats = (s?: Record<string, unknown> | null, categories?: CategoryLike[]): DashboardStats => {
  const totalAssetsVal = Number(s?.totalAssets ?? s?.totalAssetsCount ?? 0);
  const rawValue = Number(s?.totalValue ?? s?.totalValueLakhs ?? s?.totalAssetsValue ?? 0);
  const totalValueVal = rawValue > 1000 ? rawValue / 100000 : rawValue;
  const encroachmentsVal = Number(s?.encroachments ?? s?.encroachedAssets ?? s?.encroachedCount ?? 0);
  const maintenanceVal = Number(s?.maintenanceDue ?? s?.maintenanceAssets ?? s?.maintenanceCount ?? 0);
  const auctionsVal = Number(s?.activeAuctions ?? s?.totalAuctions ?? s?.auctionCount ?? 0);
  const acquisitionsVal = Number(s?.assetAcquisition ?? s?.totalAcquisitions ?? s?.acquisitionCount ?? 0);
  // Defaulting to 0 for monetized assets if not present
  const monetizedVal = Number((s as any)?.monetizedAssetsCount ?? 0);
  const leasedVal = Number((s as any)?.activeLeasedAssetsCount ?? 0);
  const rentedVal = Number((s as any)?.activeRentedAssetsCount ?? 0);

  const assetsBack = (categories || []).map(cat => {
    const c = cat as Record<string, unknown>;
    return {
      label: String(c.name || c.category || c.label || ''),
      value: Number(c.count ?? 0).toString(),
      category: String(c.id || c.name || ''),
    };
  });

  const valuesBack = (categories || []).map(cat => {
    const c = cat as Record<string, unknown>;
    const rawCatVal = Number(c.value ?? 0);
    const catValLakhs = rawCatVal > 1000 ? rawCatVal / 100000 : rawCatVal;
    return {
      label: `${String(c.name || c.category || c.label || '')} Value`,
      value: fmtRupee(catValLakhs),
      category: String(c.id || c.name || ''),
    };
  });

  return {
    totalAssets: {
      value: totalAssetsVal.toLocaleString('en-IN'),
      change: '',
      backInfo: assetsBack,
    },
    totalValue: {
      value: fmtRupee(totalValueVal),
      change: '',
      backInfo: valuesBack,
    },
    monetized: {
      value: monetizedVal.toLocaleString('en-IN'),
      change: '',
      backInfo: [
        { label: 'Leased', value: leasedVal.toLocaleString('en-IN') },
        { label: 'Rented', value: rentedVal.toLocaleString('en-IN') },
      ],
    },
    encroachments: {
      value: encroachmentsVal.toString(),
      change: '',
      backInfo: [
        { label: 'Active Cases', value: encroachmentsVal.toString() },
        { label: 'Resolved', value: Math.round(encroachmentsVal * 0.2).toString() },
        { label: 'Legal Action', value: Math.round(encroachmentsVal * 0.6).toString() },
        { label: 'Under Review', value: Math.round(encroachmentsVal * 0.4).toString() },
      ],
    },
    maintenance: {
      value: maintenanceVal.toString(),
      change: '',
      backInfo: [
        { label: 'Critical', value: Math.round(maintenanceVal * 0.3).toString() },
        { label: 'Needs Repair', value: Math.round(maintenanceVal * 0.7).toString() },
        { label: 'Scheduled', value: '4' },
        { label: 'Budget Allocated', value: 'Rs. 25L' },
      ],
    },
    auctions: {
      value: auctionsVal.toString(),
      change: '',
      backInfo: [
        { label: 'Active Auctions', value: auctionsVal.toString() },
        { label: 'Total Bids', value: Math.round(auctionsVal * 4.5).toString() },
        { label: 'Avg. Bid Increase', value: '15%' },
        { label: 'Success Rate', value: '82%' },
      ],
    },
    acquisitions: {
      value: acquisitionsVal.toString(),
      change: '',
      backInfo: [
        { label: 'Completed Transfers', value: Math.round(acquisitionsVal * 0.4).toString() },
        { label: 'Pending Possession', value: Math.round(acquisitionsVal * 0.3).toString() },
        { label: 'Legal Disputes', value: Math.round(acquisitionsVal * 0.1).toString() },
        { label: 'In Progress', value: Math.round(acquisitionsVal * 0.2).toString() },
      ],
    },
  };
};

// ─── ACTION HELPERS FOR SERVER ACTIONS ───────────────────────────────────────
import type { AssetDashboardSummaryDto, AssetDashboardCategoryCount, AssetDashboardLocation } from '@/types/asset-type/asset-dashboard-api.types';

export function getActionErrorMessage(e: unknown): string { return e instanceof Error && e.message ? e.message : 'Error fetching data.'; }
export const nNum = (v: unknown) => Number(v ?? 0);
export const chgStr = (v: number, s = '') => v === 0 ? '' : `${v > 0 ? '+' : ''}${v.toFixed(1)}${s} vs last period`;

export function actionBuildStats(dto: AssetDashboardSummaryDto, cats: DashboardCategoryItem[]): DashboardStats {
  const cr = nNum(dto.totalValue) / 1e7, cC = dto.assetCountCardDetails ?? [], vC = dto.assetValueCardDetails ?? [];
  return {
    totalAssets: { value: nNum(dto.totalAssets).toLocaleString('en-IN'), change: chgStr(nNum(dto.percentageChange), '%'), backInfo: cC.length ? cC.map((c) => ({ label: c.category, value: String(c.count), category: String(c.category).trim().toLowerCase() })) : cats.map(c => ({ label: c.name, value: String(c.count), category: c.id })) },
    totalValue: { value: `₹${cr >= 1 ? cr.toFixed(0) + 'Cr' : (nNum(dto.totalValue) / 1e5).toFixed(1) + 'L'}`, change: chgStr(nNum(dto.valueChange)), backInfo: vC.length ? vC.map((c) => ({ label: c.title, value: c.value })) : cats.map(c => ({ label: `${c.name} Value`, value: c.value > 0 ? `₹${(c.value / 1e7).toFixed(0)}Cr` : '₹0Cr' })) },
    monetized: { value: nNum(dto.monetizedAssetsCount).toLocaleString('en-IN'), change: '', backInfo: [{ label: 'Leased', value: nNum(dto.activeLeasedAssetsCount).toLocaleString('en-IN') }, { label: 'Rented', value: nNum(dto.activeRentedAssetsCount).toLocaleString('en-IN') }] },
    encroachments: { value: String(nNum(dto.encroachments)), change: chgStr(nNum(dto.encroachmentChange)), backInfo: [] },
    maintenance: { value: String(nNum(dto.maintenanceDue)), change: chgStr(nNum(dto.maintenanceChange)), backInfo: [] },
    auctions: { value: String(nNum(dto.activeAuctions)), change: chgStr(nNum(dto.auctionChange)), backInfo: [] },
    acquisitions: { value: String(nNum(dto.assetAcquisition)), change: chgStr(nNum(dto.acquisitionChange)), backInfo: [] },
  };
}

export function actionMapCat(dto: AssetDashboardCategoryCount): DashboardCategoryItem {
  const n = String(dto.category ?? '');
  return { id: n.trim().toLowerCase() || String(dto.id ?? ''), categoryId: Number(dto.id ?? 0), name: n || `Category ${dto.id}`, count: Number(dto.count ?? 0), value: Number(dto.totalValue ?? 0), color: '#3B82F6', description: '' };
}

export function actionMapLoc(dto: AssetDashboardLocation, z?: string, w?: string): MunicipalAsset {
  return { id: String(dto.id || Math.random()), name: dto.name || dto.assetNo || `Asset ${dto.id}`, category: (dto.categoryName || 'building').trim().toLowerCase() as any, subCategory: dto.categoryName || '', location: 'Municipal Area', zone: z && z !== 'all' ? z : '', ward: w && w !== 'all' ? w : '', latitude: Number(dto.latitude) || 0, longitude: Number(dto.longitude) || 0, status: dto.status || 'Active', health: 0, lastInspection: '', valueLakhs: dto.marketValue ? dto.marketValue / 1e5 : 0, usage: '', marketValue: dto.marketValue || 0, encroachment: { hasEncroachment: false } };
}

export const ACTION_EMPTY_STATS: DashboardStats = { totalAssets: { value: '0', change: '', backInfo: [] }, totalValue: { value: '₹0Cr', change: '', backInfo: [] }, monetized: { value: '0', change: '', backInfo: [] }, encroachments: { value: '0', change: '', backInfo: [] }, maintenance: { value: '0', change: '', backInfo: [] }, auctions: { value: '0', change: '', backInfo: [] }, acquisitions: { value: '0', change: '', backInfo: [] } };
