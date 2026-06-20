'use client';


import {
  fetchTypesByCategoryRSCAction,
  fetchAssetsByTypeRSCAction,
} from '@/app/[locale]/assets/dashboard/master-dashboard/actions-rsc';
import { ICONS } from '@/lib/utils/asset-utils/asset-dashboard-helpers';
import type {
  AssetDashboardTypeByCategory,
  AssetDashboardAssetByType,
} from '@/types/asset-type/asset-dashboard-api.types';
import type {
  DashboardDataPayload,
  DashboardMapAssetType,
  MunicipalAsset,
} from '@/types/asset-type/asset-dashboard.types';
import { AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { DashboardMap } from './DashboardMap';
import { EncroachmentModal } from './DashboardModals';
import { DashboardStats as StatsSection } from './DashboardStats';
import { DashboardLayout } from '../DashboardLayout';
import { DashboardFilters } from '../DashboardFilter';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

interface Props {
  initialData: DashboardDataPayload;
  selectedDistrict: string;
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

/**
 * Extracts typed data from the hidden RSC payload injected by TypeListRSC / AssetListRSC.
 * The RSC server action renders a <script data-rsc-payload="..."> element so the client
 * can read back the serialized data after React hydrates the RSC tree.
 */
function extractRSCPayload<T>(
  rscNode: ReactNode,
  payloadKey: 'types' | 'assets'
): T[] {
  // When Next.js renders the RSC action result, it injects a hidden DOM node.
  // We use a temporary container to parse it and read the embedded JSON payload.
  if (typeof document === 'undefined') return [];
  try {
    const tmp = document.createElement('div');
    // React renders the node into a string-like object; we extract via data attribute
    const scripts = document.querySelectorAll(`[data-rsc-payload="${payloadKey}"]`);
    if (scripts.length > 0) {
      const last = scripts[scripts.length - 1];
      const parsed = JSON.parse(last.textContent || '{}');
      return (parsed[payloadKey] as T[]) ?? [];
    }
  } catch {
    // Silent fail — caller will use empty array
  }
  return [];
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
  const typeInfoMap = useRef(
    new Map<number, { typeName: string; categoryId: number; categoryName: string }>()
  );
  const hasFetchedAll = useRef(false);

  const clearCaches = () => {
    typesCache.current.clear();
    assetsCache.current.clear();
    hasFetchedAll.current = false;
  };

  // Whenever the Server Component updates `initialData` (because the URL changed), update client state
  useEffect(() => {
    setData(initialData);
    setLoading(false);
  }, [initialData]);

  // ─── RSC-backed type loader (on-demand only) ────────────────────────────────
  // Called ONLY when the user clicks a category — never on page load.
  // ONE network request per interaction: RSC action returns { node, types }.
  const loadTypesByCategory = useCallback(
    async (categoryId: number | null): Promise<AssetDashboardTypeByCategory[]> => {
      const key = categoryId ?? 'all';

      // Serve from in-memory cache — no network call
      if (categoryId !== null && hasFetchedAll.current) {
        return (typesCache.current.get('all') ?? []).filter((t) => t.categoryId === categoryId);
      }
      if (typesCache.current.has(key)) return typesCache.current.get(key)!;

      // ONE RSC action call → wire format in Network tab + typed data in `.types`
      const result = await fetchTypesByCategoryRSCAction(categoryId, zone, ward);
      if (!result || !result.types) return [];

      const types = result.types;
      typesCache.current.set(key, types);
      if (categoryId === null) hasFetchedAll.current = true;
      types.forEach((tp) => {
        const cat = data.categories.find((c) => c.categoryId === tp.categoryId);
        typeInfoMap.current.set(tp.id, {
          typeName: tp.assetType,
          categoryId: tp.categoryId,
          categoryName: cat?.name || '',
        });
      });
      return types;
    },
    [zone, ward, data.categories]
  );

  // ─── RSC-backed asset loader (on-demand only) ───────────────────────────────
  // Called ONLY when the user clicks a subcategory type — never on page load.
  // ONE network request per interaction: RSC action returns { node, assets }.
  const loadAssetsByType = useCallback(
    async (typeId: number): Promise<AssetDashboardAssetByType[]> => {
      // Serve from in-memory cache — no network call
      if (assetsCache.current.has(typeId)) return assetsCache.current.get(typeId)!;

      // ONE RSC action call → wire format in Network tab + typed data in `.assets`
      const result = await fetchAssetsByTypeRSCAction(typeId, zone, ward);
      if (!result || !result.assets) return [];

      const assets = result.assets;
      assetsCache.current.set(typeId, assets);
      const info = typeInfoMap.current.get(typeId);
      if (info) {
        const toAdd = toMunicipal(assets, info.typeName, info.categoryName);
        setData((prev) => {
          const ids = new Set(prev.filteredAssets.map((a) => a.id));
          const fresh = toAdd.filter((a) => !ids.has(a.id));
          return fresh.length
            ? { ...prev, filteredAssets: [...prev.filteredAssets, ...fresh] }
            : prev;
        });
      }
      return assets;
    },
    [zone, ward]
  );

  const handleZoneChange = (z: string) => {
    clearCaches();
    setSelectedAsset(null);
    setLoading(true);
    const params = new URLSearchParams(searchParams.toString());
    if (z === 'all') params.delete('zone');
    else params.set('zone', z);
    params.delete('ward');
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

  const visibleAssets = useMemo(
    () =>
      catFilters.length > 0
        ? data.filteredAssets.filter((a) => catFilters.includes(a.category))
        : data.filteredAssets,
    [data.filteredAssets, catFilters]
  );

  const zonesList = useMemo(
    () =>
      ['all', ...new Set([...(data.allZones || []), ...data.filteredAssets.map((a) => a.zone)])].filter(
        Boolean
      ),
    [data.allZones, data.filteredAssets]
  );

  const wardsList = useMemo(() => {
    const asset = data.filteredAssets
      .filter((a) => zone === 'all' || a.zone === zone)
      .map((a) => a.ward);
    const master = (data.allWards || [])
      .filter((w) => zone === 'all' || w.zoneNo === zone)
      .map((w) => w.wardNo);
    return ['all', ...new Set([...master, ...asset])].filter(Boolean);
  }, [data.allWards, data.filteredAssets, zone]);

  const encroached = useMemo(
    () => visibleAssets.filter((a) => (a.encroachment as any)?.hasEncroachment),
    [visibleAssets]
  );
  const activeZone = zone !== 'all' && zonesList.includes(zone) ? zone : 'all';
  const activeWard = ward !== 'all' && wardsList.includes(ward) ? ward : 'all';

  return (
    <DashboardLayout
      loading={loading}
      filters={
        <DashboardFilters
          zonesList={zonesList}
          wardsList={wardsList}
          activeZone={activeZone}
          activeWard={activeWard}
          onZoneChange={handleZoneChange}
          onWardChange={handleWardChange}
          allZonesLabel={t('allZones')}
          allWardsLabel={t('allWards')}
          filtersLabel={t('filters')}
        />
      }
    >
      <StatsSection
        stats={data.stats}
        icons={ICONS}
        onCategoryClick={(cat) => {
          if (!cat) {
            setCatFilters([]);
            return;
          }
          if (cat === 'Active Encroachments') {
            setShowEncroachment(true);
            return;
          }
          setSelectedAsset(null);
          setCatFilters([cat]);
        }}
      />
      <DashboardMap
        filterKey={`${zone}-${ward}`}
        categories={data.categories}
        assets={visibleAssets}
        selectedAsset={selectedAsset}
        selectedDistrict={selectedDistrict}
        onCategoryClick={(cats) => {
          setCatFilters(cats);
          setSelectedAsset(null);
        }}
        onAssetClick={setSelectedAsset}
        activeFilters={catFilters}
        onLoadTypesByCategory={loadTypesByCategory}
        onLoadAssetsByType={loadAssetsByType}
      />
      <AnimatePresence>
        {showEncroachment && (
          <EncroachmentModal assets={encroached} onClose={() => setShowEncroachment(false)} />
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
