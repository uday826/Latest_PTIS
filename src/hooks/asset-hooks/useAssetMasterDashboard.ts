import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import type {
  DashboardDataPayload,
  DashboardMapAssetType,
  MunicipalAsset,
} from '@/types/asset-type/asset-dashboard.types';
import type {
  AssetDashboardTypeByCategory,
  AssetDashboardAssetByType,
} from '@/types/asset-type/asset-dashboard-api.types';
import {
  fetchTypesByCategoryRSCAction,
  fetchAssetsByTypeRSCAction,
  fetchFilteredRSCAction,
} from '@/app/[locale]/assets/dashboard/master-dashboard/actions';

/** Parse AssetDashboardTypeByCategory[] from the RSC element tree returned by fetchTypesByCategoryRSCAction */
function parseTypesFromNode(node: any): AssetDashboardTypeByCategory[] {
  if (!node?.props?.children) return [];
  const kids = Array.isArray(node.props.children) ? node.props.children.flat(2) : [node.props.children];
  return (kids as any[]).filter((a) => a && typeof a === 'object' && a.type === 'article').map((a) => ({
    id: Number(a.props?.['data-type-id'] ?? 0),
    categoryId: Number(a.props?.['data-category-id'] ?? 0),
    assetType: String(a.props?.['aria-label'] ?? ''),
    count: Number(a.props?.['data-count'] ?? 0),
    totalValue: Number(a.props?.['data-total-value'] ?? 0),
  }));
}

/** Parse AssetDashboardAssetByType[] from the RSC element tree returned by fetchAssetsByTypeRSCAction */
function parseAssetsFromNode(node: any): AssetDashboardAssetByType[] {
  if (!node?.props?.children) return [];
  const kids = Array.isArray(node.props.children) ? node.props.children.flat(2) : [node.props.children];
  return (kids as any[]).filter((a) => a && typeof a === 'object' && a.type === 'article').map((a) => ({
    id: Number(a.props?.['data-asset-id'] ?? 0),
    name: String(a.props?.['aria-label'] ?? ''),
    code: String(a.props?.['data-code'] ?? ''),
    status: String(a.props?.['data-status'] ?? 'Active'),
    marketValue: Number(a.props?.['data-market-value'] ?? 0),
    latitude: Number(a.props?.['data-lat'] ?? 0),
    longitude: Number(a.props?.['data-lng'] ?? 0),
    wardName: String(a.props?.['data-ward'] ?? ''),
    zoneName: String(a.props?.['data-zone'] ?? ''),
  }));
}

function toMunicipal(
  raw: AssetDashboardAssetByType[],
  typeName: string,
  catName: string
): MunicipalAsset[] {
  return raw.map((a) => ({
    id: String(a.id),
    name: a.name,
    category: catName.trim().toLowerCase() as MunicipalAsset['category'],
    subCategory: typeName,
    location: `${a.wardName || ''} ${a.zoneName || ''}`.trim() || 'Municipal Area',
    zone: a.zoneName || '',
    ward: a.wardName || '',
    latitude: a.latitude || 0,
    longitude: a.longitude || 0,
    status: a.status || 'Active',
    health: 0,
    lastInspection: '',
    valueLakhs: a.marketValue ? a.marketValue / 1e5 : 0,
    usage: '',
    marketValue: a.marketValue ?? 0,
    encroachment: { hasEncroachment: false },
    coordinates: { lat: a.latitude || 0, lng: a.longitude || 0 },
  }));
}

export function useAssetMasterDashboard(initialData: DashboardDataPayload) {
  const [data, setData] = useState<DashboardDataPayload>(initialData);
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Client-side zone/ward state — drives filtering without page navigation
  const [zone, setZone] = useState(searchParams.get('zone') || 'all');
  const [ward, setWard] = useState(searchParams.get('ward') || 'all');

  const [selectedAsset, setSelectedAsset] = useState<DashboardMapAssetType | null>(null);
  const [catFilters, setCatFilters] = useState<string[]>([]);
  const [showEncroachment, setShowEncroachment] = useState(false);
  const [loading, setLoading] = useState(false);

  const typeInfoMap = useRef(new Map<number, { typeName: string; categoryId: number; categoryName: string }>());

  const clearCaches = useCallback(() => {
    typeInfoMap.current.clear();
  }, []);

  // Sync data when parent server re-renders (e.g. on first load)
  useEffect(() => {
    setData(initialData);
    setLoading(false);
  }, [initialData]);

  const loadTypesByCategory = useCallback(
    async (categoryId: number | null): Promise<AssetDashboardTypeByCategory[]> => {
      const result = await fetchTypesByCategoryRSCAction(categoryId, zone, ward);
      if (!result) return [];
      const types = parseTypesFromNode(result.node);
      types.forEach((tp) => {
        const cat = data.categories.find((c) => c.categoryId === tp.categoryId);
        typeInfoMap.current.set(tp.id, { typeName: tp.assetType, categoryId: tp.categoryId, categoryName: cat?.name || '' });
      });
      return types;
    },
    [zone, ward, data.categories]
  );

  const loadAssetsByType = useCallback(
    async (typeId: number): Promise<AssetDashboardAssetByType[]> => {
      const result = await fetchAssetsByTypeRSCAction(typeId, zone, ward);
      if (!result) return [];
      const assets = parseAssetsFromNode(result.node);
      const info = typeInfoMap.current.get(typeId);
      if (info) {
        const toAdd = toMunicipal(assets, info.typeName, info.categoryName);
        setData((prev) => {
          const ids = new Set(prev.filteredAssets.map((a) => a.id));
          const fresh = toAdd.filter((a) => !ids.has(a.id));
          return fresh.length ? { ...prev, filteredAssets: [...prev.filteredAssets, ...fresh] } : prev;
        });
      }
      return assets;
    },
    [zone, ward]
  );

  /**
   * Applies a zone/ward filter via RSC action — no page navigation.
   * URL is updated with window.history.replaceState() to avoid ANY Next.js routing.
   */
  const applyFilter = useCallback(async (newZone: string, newWard: string) => {
    clearCaches();
    setSelectedAsset(null);
    setLoading(true);
    setCatFilters([]);

    // Update URL silently using native History API — no Next.js re-render at all
    const params = new URLSearchParams();
    if (newZone !== 'all') params.set('zone', newZone);
    if (newWard !== 'all') params.set('ward', newWard);
    const qs = params.toString();
    window.history.replaceState(null, '', `${pathname}${qs ? `?${qs}` : ''}`);

    try {
      const result = await fetchFilteredRSCAction(newZone, newWard);
      if (result && !(result as any).error) {
        setData(result as DashboardDataPayload);
      }
    } catch {
      // keep existing data on error
    } finally {
      setLoading(false);
    }
  }, [clearCaches, pathname]);

  const handleZoneChange = useCallback((z: string) => {
    setZone(z);
    setWard('all');
    applyFilter(z, 'all');
  }, [applyFilter]);

  const handleWardChange = useCallback((w: string) => {
    setWard(w);
    applyFilter(zone, w);
  }, [applyFilter, zone]);

  const visibleAssets = useMemo(() => catFilters.length > 0 ? data.filteredAssets.filter((a) => catFilters.includes(a.category)) : data.filteredAssets, [data.filteredAssets, catFilters]);
  const zonesList = useMemo(() => ['all', ...new Set([...(data.allZones || []), ...data.filteredAssets.map((a) => a.zone)])].filter(Boolean), [data.allZones, data.filteredAssets]);
  const wardsList = useMemo(() => {
    const asset = data.filteredAssets.filter((a) => zone === 'all' || a.zone === zone).map((a) => a.ward);
    const master = (data.allWards || []).filter((w) => zone === 'all' || w.zoneNo === zone).map((w) => w.wardNo);
    return ['all', ...new Set([...master, ...asset])].filter(Boolean);
  }, [data.allWards, data.filteredAssets, zone]);

  const encroached = useMemo(() => visibleAssets.filter((a) => (a.encroachment as any)?.hasEncroachment), [visibleAssets]);
  const activeZone = zone !== 'all' && zonesList.includes(zone) ? zone : 'all';
  const activeWard = ward !== 'all' && wardsList.includes(ward) ? ward : 'all';

  return {
    data, loading, zone, ward, activeZone, activeWard,
    zonesList, wardsList, visibleAssets, encroached,
    selectedAsset, setSelectedAsset, catFilters, setCatFilters,
    showEncroachment, setShowEncroachment,
    loadTypesByCategory, loadAssetsByType,
    handleZoneChange, handleWardChange
  };
}

