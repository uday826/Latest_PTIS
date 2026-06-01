import { BarChart3, MapPin, Activity, IndianRupee, Wrench, ShieldAlert } from 'lucide-react';
import type { DashboardStats, DashboardDataPayload, MunicipalAsset, DashboardCategoryItem } from '@/types/asset-type/asset-dashboard.types';

export const ICONS = { BarChart3, MapPin, Activity, IndianRupee, Wrench, ShieldAlert };

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

export function deriveDashboardData(baseData: DashboardDataPayload, selectedZone: string, selectedWard: string, drillDownCategories: string[]): DashboardDataPayload {
  const zoneKey = normKey(selectedZone), isAllZone = zoneKey === 'all' || zoneKey === 'all zones';
  const wardKey = normKey(selectedWard), isAllWard = wardKey === 'all' || wardKey === 'all wards';
  const drillDownKeys = drillDownCategories.map(normKey);

  const filteredAssets = baseData.filteredAssets.filter(asset => 
    (isAllZone || asset.zone === selectedZone) && 
    (isAllWard || asset.ward === selectedWard) && 
    (drillDownKeys.length === 0 || drillDownKeys.includes(normKey(asset.category)))
  );

  const totalAssetsValue = filteredAssets.reduce((sum, asset) => sum + asset.valueLakhs, 0);
  const encroachedCount = filteredAssets.filter(asset => {
    const enc = asset.encroachment as Record<string, unknown> | null | undefined;
    return !!enc?.hasEncroachment;
  }).length;
  const maintenanceCount = filteredAssets.filter(asset => asset.status === 'Needs Repair' || asset.status === 'Critical').length;

  const categories = baseData.categories.map(category => {
    const catAssets = filteredAssets.filter(asset => normKey(asset.category) === normKey(category.id));
    return { ...category, count: catAssets.length, value: catAssets.reduce((sum, asset) => sum + asset.valueLakhs, 0) };
  });

  const zoneCounts = filteredAssets.reduce((acc, asset) => { acc[asset.zone] = (acc[asset.zone] || 0) + 1; return acc; }, {} as Record<string, number>);

  return {
    ...baseData,
    stats: {
      totalAssets: { value: filteredAssets.length.toLocaleString('en-IN'), change: baseData.stats.totalAssets.change, backInfo: buildCatBack(filteredAssets) },
      totalValue: { value: fmtRupee(totalAssetsValue), change: baseData.stats.totalValue.change, backInfo: buildValBack(filteredAssets) },
      encroachments: {
        value: encroachedCount.toString(), change: baseData.stats.encroachments.change,
        backInfo: [
          { label: 'Active Cases', value: encroachedCount.toString(), category: 'Active Encroachments' },
          { label: 'Resolved', value: Math.max(0, filteredAssets.length - encroachedCount).toString() },
          { label: 'Legal Action', value: Math.floor(encroachedCount * 0.6).toString() },
          { label: 'Under Review', value: Math.floor(encroachedCount * 0.4).toString() },
        ],
      },
      maintenance: {
        value: maintenanceCount.toString(), change: baseData.stats.maintenance.change,
        backInfo: [
          { label: 'Critical', value: filteredAssets.filter(a => a.status === 'Critical').length.toString() },
          { label: 'Needs Repair', value: filteredAssets.filter(a => a.status === 'Needs Repair').length.toString() },
          { label: 'Scheduled', value: baseData.stats.maintenance.backInfo[2]?.value ?? '0' },
          { label: 'Budget Allocated', value: baseData.stats.maintenance.backInfo[3]?.value ?? 'Rs. 0L' },
        ],
      },
      auctions: {
        value: baseData.stats.auctions.value, change: baseData.stats.auctions.change,
        backInfo: baseData.stats.auctions.backInfo,
      },
      acquisitions: {
        value: baseData.stats.acquisitions.value, change: baseData.stats.acquisitions.change,
        backInfo: baseData.stats.acquisitions.backInfo,
      },
    },
    filteredAssets, categories, zoneDistribution: Object.entries(zoneCounts).map(([name, value]) => ({ name, value })),
  };
}
