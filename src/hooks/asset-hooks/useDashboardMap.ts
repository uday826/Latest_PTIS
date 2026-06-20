import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { DashboardMapAssetType, DashboardMapComponentProps, DashboardSubcategorySelection } from '@/types/asset-type/asset-dashboard.types';
import type { AssetDashboardTypeByCategory, AssetDashboardAssetByType } from '@/types/asset-type/asset-dashboard-api.types';
import { getCategoryKey, normKey, toTitleCase } from '@/lib/utils/asset-utils/asset-dashboard-helpers';
import { Building2, Factory, Landmark, Truck } from 'lucide-react';

const FALLBACK_STYLES = [
  { Icon: Landmark, icon: 'text-teal-500', pill: 'bg-teal-50', border: 'border-teal-500', titleColor: 'text-teal-600' },
  { Icon: Building2, icon: 'text-blue-500', pill: 'bg-blue-50', border: 'border-blue-500', titleColor: 'text-blue-600' },
  { Icon: Factory, icon: 'text-purple-500', pill: 'bg-purple-50', border: 'border-purple-500', titleColor: 'text-purple-600' },
  { Icon: Truck, icon: 'text-orange-500', pill: 'bg-orange-50', border: 'border-orange-500', titleColor: 'text-orange-600' },
  { Icon: Building2, icon: 'text-pink-500', pill: 'bg-pink-50', border: 'border-pink-500', titleColor: 'text-pink-600' },
  { Icon: Building2, icon: 'text-emerald-500', pill: 'bg-emerald-50', border: 'border-emerald-500', titleColor: 'text-emerald-600' },
];

const CATEGORY_STYLE_INDEX: Record<string, number> = { land: 0, building: 1, infrastructure: 2, movable: 3 };
export const getCategoryStyles = (id: string, idx: number) => {
  const norm = normKey(id);
  const titles: Record<string, string> = { land: 'Land', building: 'Buildings', infrastructure: 'Infrastructure', movable: 'Movable' };
  return { id, title: titles[norm] || toTitleCase(id), ...FALLBACK_STYLES[CATEGORY_STYLE_INDEX[norm] ?? idx % FALLBACK_STYLES.length] };
};

export const tCat = (t: (k: string) => string, key: string, fallback: string) => key ? t(key) : fallback;

export function useDashboardMap({
  categories, assets, selectedAsset, onCategoryClick, onAssetClick, activeFilters, onLoadTypesByCategory, onLoadAssetsByType, filterKey,
}: DashboardMapComponentProps) {
  const [selectedSubcategory, setSelectedSubcategory] = useState<DashboardSubcategorySelection | null>(null);
  const [apiTypesByCat, setApiTypesByCat] = useState<Record<number, { types: AssetDashboardTypeByCategory[]; loading: boolean }>>({});
  const [apiAssetsByType, setApiAssetsByType] = useState<Record<number, { assets: AssetDashboardAssetByType[]; loading: boolean }>>({});
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
  // Track whether the null pre-load (all types) has already completed
  const allTypesPreloaded = useRef(false);

  useEffect(() => { setApiTypesByCat({}); setApiAssetsByType({}); allTypesPreloaded.current = false; }, [filterKey]);

  useEffect(() => {
    if (onLoadTypesByCategory) {
      // Guard against React Strict Mode double-invocation — ref persists across dev remounts
      if (allTypesPreloaded.current) return;
      let cancelled = false;
      const fetchAll = async () => {
        try {
          const types = await onLoadTypesByCategory(null);
          if (cancelled) return;
          if (types && types.length > 0) {
            setApiTypesByCat((prev) => {
              const grouped: Record<number, { types: AssetDashboardTypeByCategory[]; loading: boolean }> = { ...prev };
              types.forEach((tp) => {
                if (!grouped[tp.categoryId]) grouped[tp.categoryId] = { types: [], loading: false };
                if (!grouped[tp.categoryId].types.some((x) => x.id === tp.id)) grouped[tp.categoryId].types.push(tp);
              });
              return grouped;
            });
            // Mark pre-load done — no per-category RSC calls needed anymore
            allTypesPreloaded.current = true;
          }
        } catch (err) {
          // pre-load failed silently; per-category calls will handle individual fetches
        }
      };
      fetchAll();
      return () => { cancelled = true; };
    }
  }, [onLoadTypesByCategory]);

  const sections = useMemo(() => {
    return categories.map((cat, idx) => {
      const style = getCategoryStyles(cat.id, idx);
      const catId = Number(cat.categoryId ?? 0);
      const apiEntry = apiTypesByCat[catId];
      const items = apiEntry ? apiEntry.types.map((tp) => ({ name: tp.assetType, count: tp.count, typeId: tp.id, totalValue: tp.totalValue })) : [];
      if (!apiEntry) {
        const raw = assets.filter((a) => normKey(a.category) === normKey(cat.id));
        const itemMap: Record<string, number> = {};
        raw.forEach((a) => { const n = a.subCategory?.trim() || `Other ${style.title}`; itemMap[n] = (itemMap[n] || 0) + 1; });
        Object.entries(itemMap).sort(([, a], [, b]) => b - a).forEach(([name, count]) => items.push({ name, count, typeId: 0, totalValue: 0 }));
      }
      return { ...style, categoryId: catId, count: cat.count, totalValue: cat.value ?? 0, items, loading: apiEntry?.loading ?? false };
    });
  }, [assets, categories, apiTypesByCat]);

  const handleCategoryClick = useCallback(async (id: string, categoryId: number) => {
    const updated = activeFilters.includes(id) ? activeFilters.filter((x) => x !== id) : [...activeFilters, id];
    onCategoryClick(updated); setSelectedSubcategory(null); onAssetClick(null); setSelectedTypeId(null);
    // Skip RSC call if pre-load already fetched all types, or if this category is already cached
    if (onLoadTypesByCategory && categoryId > 0 && !apiTypesByCat[categoryId] && !allTypesPreloaded.current) {
      setApiTypesByCat((prev) => ({ ...prev, [categoryId]: { types: [], loading: true } }));
      try {
        const types = await onLoadTypesByCategory(categoryId);
        setApiTypesByCat((prev) => ({ ...prev, [categoryId]: { types, loading: false } }));
      } catch { setApiTypesByCat((prev) => ({ ...prev, [categoryId]: { types: [], loading: false } })); }
    }
  }, [activeFilters, onCategoryClick, onAssetClick, onLoadTypesByCategory, apiTypesByCat]);

  const handleSubcategoryClick = useCallback(async (type: string, name: string, typeId: number) => {
    setSelectedSubcategory({ type, name }); setSelectedTypeId(typeId); onAssetClick(null);
    if (onLoadAssetsByType && typeId > 0 && !apiAssetsByType[typeId]) {
      setApiAssetsByType((prev) => ({ ...prev, [typeId]: { assets: [], loading: true } }));
      try {
        const loaded = await onLoadAssetsByType(typeId);
        setApiAssetsByType((prev) => ({ ...prev, [typeId]: { assets: loaded, loading: false } }));
      } catch { setApiAssetsByType((prev) => ({ ...prev, [typeId]: { assets: [], loading: false } })); }
    }
  }, [onAssetClick, onLoadAssetsByType, apiAssetsByType]);

  const subcategoryAssets = useMemo<(DashboardMapAssetType | AssetDashboardAssetByType)[]>(() => {
    if (!selectedSubcategory) return [];
    if (selectedTypeId && apiAssetsByType[selectedTypeId]) return apiAssetsByType[selectedTypeId].loading ? [] : apiAssetsByType[selectedTypeId].assets;
    const type = normKey(selectedSubcategory.type), name = normKey(selectedSubcategory.name);
    return assets.filter((a) => normKey(a.category) === type && normKey(a.subCategory || `Other ${getCategoryStyles(a.category, 0).title}`) === name);
  }, [selectedSubcategory, selectedTypeId, apiAssetsByType, assets]);

  const isLoadingSubcategoryAssets = selectedTypeId != null && apiAssetsByType[selectedTypeId]?.loading === true;
  const clearFilters = useCallback(() => { onCategoryClick([]); setSelectedSubcategory(null); setSelectedTypeId(null); onAssetClick(null); }, [onAssetClick, onCategoryClick]);
  const handleBackClick = useCallback(() => { if (selectedAsset) onAssetClick(null); else { setSelectedSubcategory(null); setSelectedTypeId(null); onAssetClick(null); } }, [selectedAsset, onAssetClick]);
  const displayedAsset = selectedAsset ?? null;
  const showBack = activeFilters.length > 0 || displayedAsset || selectedSubcategory;

  return {
    sections, selectedSubcategory, subcategoryAssets, isLoadingSubcategoryAssets,
    clearFilters, handleBackClick, displayedAsset, showBack,
    handleCategoryClick, handleSubcategoryClick
  };
}
