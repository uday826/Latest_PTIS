'use client';

import { fetchFilteredAction, fetchTypesByCategoryAction, fetchAssetsByTypeAction } from '@/app/[locale]/assets/dashboard/master-dashboard/actions';
import { ICONS } from '@/lib/utils/asset-utils/asset-dashboard-helpers';
import type { AssetDashboardTypeByCategory, AssetDashboardAssetByType } from '@/types/asset-type/asset-dashboard-api.types';
import type { DashboardDataPayload, DashboardMapAssetType, MunicipalAsset } from '@/types/asset-type/asset-dashboard.types';
import { AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DashboardMap } from './DashboardMap';
import { EncroachmentModal } from './DashboardModals';
import { DashboardStats as StatsSection } from './DashboardStats';
import { DashboardLayout } from '../DashboardLayout';
import { DashboardFilters } from '../DashboardFilter';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

interface Props { initialData: DashboardDataPayload; selectedDistrict: string; }

function toMunicipal(raw: AssetDashboardAssetByType[], typeName: string, catName: string): MunicipalAsset[] {
  return raw.map(a => ({
    id: String(a.id), name: a.name,
    category: catName.trim().toLowerCase() as MunicipalAsset['category'],
    subCategory: typeName, location: `${a.wardName || ''} ${a.zoneName || ''}`.trim() || 'Municipal Area',
    zone: a.zoneName || '', ward: a.wardName || '',
    latitude: a.latitude || 0, longitude: a.longitude || 0,
    status: a.status || 'Active', health: 0, lastInspection: '',
    valueLakhs: a.marketValue ? a.marketValue / 1e5 : 0, usage: '',
    marketValue: a.marketValue ?? 0, encroachment: { hasEncroachment: false },
    coordinates: { lat: a.latitude || 0, lng: a.longitude || 0 },
  }));
}

export function AssetMasterDashboard({ initialData, selectedDistrict }: Props) {
  const t = useTranslations('assetmasterdashboard');
  const [data, setData] = useState<DashboardDataPayload>(initialData);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const zone = searchParams.get('zone') || 'all';
  const ward = searchParams.get('ward') || 'all';

  const [selectedAsset, setSelectedAsset] = useState<DashboardMapAssetType | null>(null);
  const [catFilters, setCatFilters] = useState<string[]>([]);
  const [showEncroachment, setShowEncroachment] = useState(false);
  const [loading, setLoading] = useState(false);

  // Ref-based caches: Map mutations don't cause re-renders
  const typesCache = useRef(new Map<number | string, AssetDashboardTypeByCategory[]>());
  const assetsCache = useRef(new Map<number, AssetDashboardAssetByType[]>());
  const typeInfoMap = useRef(new Map<number, { typeName: string; categoryId: number; categoryName: string }>());
  const hasFetchedAll = useRef(false);

  const clearCaches = () => { typesCache.current.clear(); assetsCache.current.clear(); hasFetchedAll.current = false; };

  // Whenever the Server Component updates `initialData` (because the URL changed), update our client state
  useEffect(() => {
    setData(initialData);
    setLoading(false);
  }, [initialData]);

  const loadTypesByCategory = useCallback(async (categoryId: number | null): Promise<AssetDashboardTypeByCategory[]> => {
    const key = categoryId ?? 'all';
    if (categoryId !== null && hasFetchedAll.current) {
      return (typesCache.current.get('all') ?? []).filter(t => t.categoryId === categoryId);
    }
    if (typesCache.current.has(key)) return typesCache.current.get(key)!;
    const res: any = await fetchTypesByCategoryAction(categoryId, zone, ward);
    if (!res || res.error) return [];
    typesCache.current.set(key, res);
    if (categoryId === null) hasFetchedAll.current = true;
    res.forEach((tp: any) => {
      const cat = data.categories.find(c => c.categoryId === tp.categoryId);
      typeInfoMap.current.set(tp.id, { typeName: tp.assetType, categoryId: tp.categoryId, categoryName: cat?.name || '' });
    });
    return res;
  }, [zone, ward, data.categories]);

  const loadAssetsByType = useCallback(async (typeId: number): Promise<AssetDashboardAssetByType[]> => {
    if (assetsCache.current.has(typeId)) return assetsCache.current.get(typeId)!;
    const res: any = await fetchAssetsByTypeAction(typeId, zone, ward);
    if (!res || res.error) return [];
    assetsCache.current.set(typeId, res);
    const info = typeInfoMap.current.get(typeId);
    if (info) {
      const toAdd = toMunicipal(res, info.typeName, info.categoryName);
      setData(prev => {
        const ids = new Set(prev.filteredAssets.map(a => a.id));
        const fresh = toAdd.filter(a => !ids.has(a.id));
        return fresh.length ? { ...prev, filteredAssets: [...prev.filteredAssets, ...fresh] } : prev;
      });
    }
    return res;
  }, [zone, ward]);

  const handleZoneChange = (z: string) => { 
    clearCaches(); 
    setSelectedAsset(null); 
    setLoading(true);
    const params = new URLSearchParams(searchParams.toString());
    if (z === 'all') params.delete('zone');
    else params.set('zone', z);
    params.delete('ward'); // Reset ward on zone change
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleWardChange = (w: string) => { 
    clearCaches(); 
    setSelectedAsset(null);
    setLoading(true);
    const params = new URLSearchParams(searchParams.toString());
    if (w === 'all') params.delete('ward');
    else params.set('ward', w);
    router.push(`${pathname}?${params.toString()}`);
  };

  const visibleAssets = useMemo(() =>
    catFilters.length > 0 ? data.filteredAssets.filter(a => catFilters.includes(a.category)) : data.filteredAssets,
    [data.filteredAssets, catFilters]);

  const zonesList = useMemo(() =>
    ['all', ...new Set([...(data.allZones || []), ...data.filteredAssets.map(a => a.zone)])].filter(Boolean),
    [data.allZones, data.filteredAssets]);

  const wardsList = useMemo(() => {
    const asset = data.filteredAssets.filter(a => zone === 'all' || a.zone === zone).map(a => a.ward);
    const master = (data.allWards || []).filter(w => zone === 'all' || w.zoneNo === zone).map(w => w.wardNo);
    return ['all', ...new Set([...master, ...asset])].filter(Boolean);
  }, [data.allWards, data.filteredAssets, zone]);

  const encroached = useMemo(() => visibleAssets.filter(a => (a.encroachment as any)?.hasEncroachment), [visibleAssets]);
  const activeZone = zone !== 'all' && zonesList.includes(zone) ? zone : 'all';
  const activeWard = ward !== 'all' && wardsList.includes(ward) ? ward : 'all';
  return (
    <DashboardLayout
      loading={loading}
      filters={
        <DashboardFilters
          zonesList={zonesList} wardsList={wardsList}
          activeZone={activeZone} activeWard={activeWard}
          onZoneChange={handleZoneChange} onWardChange={handleWardChange}
          allZonesLabel={t('allZones')} allWardsLabel={t('allWards')} filtersLabel={t('filters')}
        />
      }
    >
      <StatsSection stats={data.stats} icons={ICONS}
        onCategoryClick={cat => {
          if (!cat) { setCatFilters([]); return; }
          if (cat === 'Active Encroachments') { setShowEncroachment(true); return; }
          setSelectedAsset(null); setCatFilters([cat]);
        }}
      />
      <DashboardMap
        filterKey={`${zone}-${ward}`}
        categories={data.categories} assets={visibleAssets}
        selectedAsset={selectedAsset} selectedDistrict={selectedDistrict}
        onCategoryClick={cats => { setCatFilters(cats); setSelectedAsset(null); }}
        onAssetClick={setSelectedAsset} activeFilters={catFilters}
        onLoadTypesByCategory={loadTypesByCategory} onLoadAssetsByType={loadAssetsByType}
      />
      <AnimatePresence>
        {showEncroachment && <EncroachmentModal assets={encroached} onClose={() => setShowEncroachment(false)} />}
      </AnimatePresence>
    </DashboardLayout>
  );
}
