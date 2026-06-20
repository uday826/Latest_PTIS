'use client';

import { Button, Card } from '@/components/common';
import { Badge } from '@/components/common/Badge';
import { getCategoryKey, normKey, toTitleCase } from '@/lib/utils/asset-utils/asset-dashboard-helpers';
import type { DashboardMapAssetType, DashboardMapComponentProps, DashboardSubcategorySelection } from '@/types/asset-type/asset-dashboard.types';
import type { AssetDashboardTypeByCategory, AssetDashboardAssetByType } from '@/types/asset-type/asset-dashboard-api.types';
import { Activity, Building2, Factory, IndianRupee, Landmark, Layers, Loader2, MapPin, Truck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';

// Load MapView with SSR disabled to avoid Leaflet/window issues on server
const MapView = dynamic(() => import('./MapView').then((mod) => mod.MapView), { ssr: false });

const FALLBACK_STYLES = [
  { Icon: Landmark, icon: 'text-teal-500', pill: 'bg-teal-50', border: 'border-teal-500', titleColor: 'text-teal-600' },
  { Icon: Building2, icon: 'text-blue-500', pill: 'bg-blue-50', border: 'border-blue-500', titleColor: 'text-blue-600' },
  { Icon: Factory, icon: 'text-purple-500', pill: 'bg-purple-50', border: 'border-purple-500', titleColor: 'text-purple-600' },
  { Icon: Truck, icon: 'text-orange-500', pill: 'bg-orange-50', border: 'border-orange-500', titleColor: 'text-orange-600' },
  { Icon: Building2, icon: 'text-pink-500', pill: 'bg-pink-50', border: 'border-pink-500', titleColor: 'text-pink-600' },
  { Icon: Building2, icon: 'text-emerald-500', pill: 'bg-emerald-50', border: 'border-emerald-500', titleColor: 'text-emerald-600' },
];

const CATEGORY_STYLE_INDEX: Record<string, number> = { land: 0, building: 1, infrastructure: 2, movable: 3 };
const getCategoryStyles = (id: string, idx: number) => {
  const norm = normKey(id);
  const titles: Record<string, string> = { land: 'Land', building: 'Buildings', infrastructure: 'Infrastructure', movable: 'Movable' };
  return { id, title: titles[norm] || toTitleCase(id), ...FALLBACK_STYLES[CATEGORY_STYLE_INDEX[norm] ?? idx % FALLBACK_STYLES.length] };
};
const tCat = (t: (k: string) => string, key: string, fallback: string) => key ? t(key) : fallback;

export function DashboardMap({
  categories,
  assets,
  selectedAsset,
  onCategoryClick,
  onAssetClick,
  selectedDistrict,
  activeFilters,
  onLoadTypesByCategory,
  onLoadAssetsByType,
  filterKey,
}: DashboardMapComponentProps) {
  const t = useTranslations('assetmasterdashboard');
  const [selectedSubcategory, setSelectedSubcategory] = useState<DashboardSubcategorySelection | null>(null);

  // Lazy-loaded types per categoryId → { types, loading }
  const [apiTypesByCat, setApiTypesByCat] = useState<
    Record<number, { types: AssetDashboardTypeByCategory[]; loading: boolean }>
  >({});

  // Lazy-loaded assets per assetTypeId → AssetDashboardAssetByType[]
  const [apiAssetsByType, setApiAssetsByType] = useState<
    Record<number, { assets: AssetDashboardAssetByType[]; loading: boolean }>
  >({});

  useEffect(() => {
    // When the global zone/ward filter changes, reset the subcategory and asset caches
    setApiTypesByCat({});
    setApiAssetsByType({});
  }, [filterKey]);

  // Currently selected type for right panel
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);

  // Pre-load all types by category on mount so that subcategories are visible immediately
  useEffect(() => {
    if (onLoadTypesByCategory) {
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
                if (!grouped[tp.categoryId].types.some((x) => x.id === tp.id)) {
                  grouped[tp.categoryId].types.push(tp);
                }
              });
              return grouped;
            });
          }
        } catch (err) {
          console.error('Failed to pre-load subcategories:', err);
        }
      };
      fetchAll();
      return () => {
        cancelled = true;
      };
    }
  }, [onLoadTypesByCategory]);


  // ---------------------------------------------------------------------------
  // Sections (left panel) – uses API types if loaded, else uses count from cat
  // ---------------------------------------------------------------------------
  const sections = useMemo(() => {
    return categories.map((cat, idx) => {
      const style = getCategoryStyles(cat.id, idx);
      const catId = Number(cat.categoryId ?? 0);
      const apiEntry = apiTypesByCat[catId];
      const items: { name: string; count: number; typeId: number; totalValue: number }[] = apiEntry
        ? apiEntry.types.map((tp) => ({ name: tp.assetType, count: tp.count, typeId: tp.id, totalValue: tp.totalValue }))
        : [];
      // Fallback: derive subcategories from already-loaded asset list
      if (!apiEntry) {
        const raw = assets.filter((a) => normKey(a.category) === normKey(cat.id));
        const itemMap: Record<string, number> = {};
        raw.forEach((a) => { const n = a.subCategory?.trim() || `Other ${style.title}`; itemMap[n] = (itemMap[n] || 0) + 1; });
        Object.entries(itemMap)
          .sort(([, a], [, b]) => b - a)
          .forEach(([name, count]) => items.push({ name, count, typeId: 0, totalValue: 0 }));
      }
      return { ...style, categoryId: catId, count: cat.count, totalValue: cat.value ?? 0, items, loading: apiEntry?.loading ?? false };
    });
  }, [assets, categories, apiTypesByCat]);

  // ---------------------------------------------------------------------------
  // Lazy loaders
  // ---------------------------------------------------------------------------
  const handleCategoryClick = useCallback(
    async (id: string, categoryId: number) => {
      // Toggle filter (existing behaviour)
      const updated = activeFilters.includes(id)
        ? activeFilters.filter((x) => x !== id)
        : [...activeFilters, id];
      onCategoryClick(updated);
      setSelectedSubcategory(null);
      onAssetClick(null);
      setSelectedTypeId(null);

      // Lazy-load types for this category if not yet fetched
      if (onLoadTypesByCategory && categoryId > 0 && !apiTypesByCat[categoryId]) {
        setApiTypesByCat((prev) => ({ ...prev, [categoryId]: { types: [], loading: true } }));
        try {
          const types = await onLoadTypesByCategory(categoryId);
          setApiTypesByCat((prev) => ({ ...prev, [categoryId]: { types, loading: false } }));
        } catch {
          setApiTypesByCat((prev) => ({ ...prev, [categoryId]: { types: [], loading: false } }));
        }
      } else if (onLoadAssetsByType && categoryId > 0 && apiTypesByCat[categoryId]?.types) {
        // We do not pre-fetch assets here anymore to prevent unnecessary API spam.
        // The map already has locations from the initial fetchLocationsAction.
      }
    },
    [activeFilters, onCategoryClick, onAssetClick, onLoadTypesByCategory, apiTypesByCat]
  );




  const handleSubcategoryClick = useCallback(
    async (type: string, name: string, typeId: number) => {
      setSelectedSubcategory({ type, name });
      setSelectedTypeId(typeId);
      onAssetClick(null);

      // Lazy-load assets for this type if not yet fetched and typeId is valid
      if (onLoadAssetsByType && typeId > 0 && !apiAssetsByType[typeId]) {
        setApiAssetsByType((prev) => ({ ...prev, [typeId]: { assets: [], loading: true } }));
        try {
          const loaded = await onLoadAssetsByType(typeId);
          setApiAssetsByType((prev) => ({ ...prev, [typeId]: { assets: loaded, loading: false } }));
        } catch {
          setApiAssetsByType((prev) => ({ ...prev, [typeId]: { assets: [], loading: false } }));
        }
      }
    },
    [onAssetClick, onLoadAssetsByType, apiAssetsByType]
  );

  // ---------------------------------------------------------------------------
  // Subcategory panel assets
  // ---------------------------------------------------------------------------
  const subcategoryAssets = useMemo<(DashboardMapAssetType | AssetDashboardAssetByType)[]>(() => {
    if (!selectedSubcategory) return [];
    // If we have API-loaded assets for the selectedTypeId, show them
    if (selectedTypeId && apiAssetsByType[selectedTypeId]) {
      const entry = apiAssetsByType[selectedTypeId];
      if (entry.loading) return [];
      return entry.assets;
    }
    // Fallback: filter from the locally-known MunicipalAsset list
    const type = normKey(selectedSubcategory.type), name = normKey(selectedSubcategory.name);
    return assets.filter(
      (a) =>
        normKey(a.category) === type &&
        normKey(a.subCategory || `Other ${getCategoryStyles(a.category, 0).title}`) === name
    );
  }, [selectedSubcategory, selectedTypeId, apiAssetsByType, assets]);

  const isLoadingSubcategoryAssets =
    selectedTypeId != null &&
    apiAssetsByType[selectedTypeId]?.loading === true;

  const clearFilters = useCallback(() => {
    onCategoryClick([]);
    setSelectedSubcategory(null);
    setSelectedTypeId(null);
    onAssetClick(null);
  }, [onAssetClick, onCategoryClick]);

  const handleBackClick = useCallback(() => {
    if (selectedAsset) {
      onAssetClick(null);
    } else {
      setSelectedSubcategory(null);
      setSelectedTypeId(null);
      onAssetClick(null);
    }
  }, [selectedAsset, onAssetClick]);

  const displayedAsset = selectedAsset ?? null;
  const showBack = activeFilters.length > 0 || displayedAsset || selectedSubcategory;

  return (
    <div className="relative z-0 mb-0 min-h-[500px] overflow-hidden rounded-2xl border-2 border-gray-200 bg-white shadow-xl lg:h-[calc(100vh-370px)] lg:min-h-[400px] h-auto">
      <div className="flex h-full flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
        {/* ── Left panel: Categories ── */}
        <div className="relative w-full flex-shrink-0 overflow-y-auto border-b border-gray-200 bg-gradient-to-b from-gray-50 to-white p-4 lg:h-full lg:w-[25%] lg:border-b-0 lg:border-r h-[300px]">
          <Card variant="bordered" padding="sm" className="shadow-lg">
            <h3 className="mb-3 flex items-center gap-2 text-base font-extrabold text-gray-900">
              <Layers className="h-4.5 w-4.5 text-blue-600" /> {t('assetCategory')}
            </h3>
            <div className="grid max-h-[290px] grid-cols-2 gap-2 overflow-y-auto pr-1 scrollbar-thin">
              {sections.length ? (
                sections.map(({ id, title, Icon, icon, pill, border, titleColor, count, totalValue: catTotalValue, categoryId, loading: catLoading }, catIdx) => {
                  const on = activeFilters.includes(id);
                  const displayTitle = tCat(t as (k: string) => string, getCategoryKey(title), title);
                  return (
                    <Button
                      key={`cat-${id || 'unknown'}-${catIdx}`}
                      variant="ghost"
                      onClick={() => handleCategoryClick(id, categoryId)}
                      className={`h-auto min-w-0 w-full rounded-lg p-1.5 transition-all !items-start !justify-start !text-left flex flex-col ${on ? `${pill} border-2 ${border} shadow-sm` : 'bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:text-inherit'
                        }`}
                    >
                      <div className="flex w-full flex-col items-start justify-start text-left">
                        {catLoading ? (
                          <Loader2 className={`mb-1 h-4.5 w-4.5 animate-spin ${on ? titleColor : icon}`} />
                        ) : (
                          <Icon className={`mb-1 h-4.5 w-4.5 ${on ? titleColor : icon}`} />
                        )}
                        <span className={`text-xs leading-snug ${on ? 'font-bold text-gray-900' : 'font-semibold text-gray-700'}`}>{displayTitle}</span>
                        <span className={`mt-0.5 text-sm font-extrabold ${on ? titleColor : 'text-gray-500'}`}>{count}</span>
                        {catTotalValue > 0 && (
                          <span className={`mt-0.5 flex items-center gap-0.5 text-[10px] font-bold ${on ? 'text-emerald-600' : 'text-emerald-500'}`}>
                            <IndianRupee className="h-2.5 w-2.5" />
                            {catTotalValue >= 1e7
                              ? `${(catTotalValue / 1e7).toFixed(0)}Cr`
                              : catTotalValue >= 1e5
                              ? `${(catTotalValue / 1e5).toFixed(1)}L`
                              : catTotalValue.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </Button>
                  );
                })
              ) : (
                <div className="col-span-2 py-4 text-center text-xs font-medium text-gray-400">{t('noCategories')}</div>
              )}
            </div>
            {!!activeFilters.length && (
              <div className="mt-2 border-t border-gray-200 pt-2">
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="h-auto w-full rounded-lg px-0 py-1.5 text-xs font-semibold text-red-600 shadow-none hover:bg-red-50 hover:text-red-700"
                >
                  {t('clearFilters')}
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* ── Middle panel: Map ── */}
        <div className="relative flex-shrink-0 h-[350px] w-full border-b border-gray-200 transition-all duration-300 lg:h-full lg:w-[45%] lg:border-b-0 lg:border-r">
          <Suspense
            fallback={
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                  <span className="text-sm text-gray-600">{t('loadingMap')}</span>
                </div>
              </div>
            }
          >
            <MapView
              assets={
                selectedTypeId
                  ? ((apiAssetsByType[selectedTypeId]?.assets as any) || []).map((a: any) => ({
                      ...a,
                      category: activeFilters[0] || 'building',
                      valueLakhs: a.marketValue ? a.marketValue / 1e5 : 0,
                      location: `${a.wardName || ''} ${a.zoneName || ''}`.trim() || 'Municipal Area',
                      zone: a.zoneName || '',
                      ward: a.wardName || '',
                    }))
                  : assets
              }
              selectedAsset={selectedAsset}
              onAssetClick={onAssetClick}
              activeFilters={activeFilters}
              categories={categories}
            />
          </Suspense>
        </div>

        {/* ── Right panel: Subcategories / Asset details ── */}
        <div className="relative w-full flex-shrink-0 overflow-y-auto bg-gradient-to-b from-gray-50 to-white p-2 lg:h-full lg:w-[30%] h-[400px]">
          <Card variant="bordered" padding="sm" className="flex h-full flex-col overflow-hidden shadow-lg">
            <div className="mb-4 flex flex-shrink-0 items-start justify-between">
              <div>
                <h3 className="flex items-center gap-1.5 text-base font-extrabold text-gray-900">
                  <Activity className="h-4 w-4 text-blue-600" />
                  {displayedAsset ? t('assetDetails') : t('assetSubcategories')}
                </h3>
                <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-0.5 text-[10px] font-bold text-purple-700">
                  <MapPin className="h-2.5 w-2.5" /> {t('districtDistrict', { district: selectedDistrict })}
                </span>
                {selectedSubcategory && (
                  <span className="ml-2 mt-1 inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-bold text-blue-700">
                    {tCat(t as (k: string) => string, getCategoryKey(selectedSubcategory.type), toTitleCase(selectedSubcategory.type))}
                  </span>
                )}
              </div>
              {showBack && (
                <Button
                  variant="ghost"
                  onClick={handleBackClick}
                  className="h-auto min-w-0 border-0 bg-transparent px-0 text-xs font-semibold text-gray-600 shadow-none hover:bg-transparent hover:text-gray-900"
                >
                  {t('back')}
                </Button>
              )}
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto pr-1">
              {displayedAsset ? (
                /* ── Asset detail card ── */
                <div className="space-y-2.5 rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-3 shadow-md">
                  <div className="flex items-start justify-between border-b border-blue-100 pb-2">
                    <div>
                      <h4 className="mb-0.5 text-sm font-bold text-gray-900">{displayedAsset.name}</h4>
                      <div className="flex items-center gap-1.5">
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold capitalize text-blue-700">{displayedAsset.category}</span>
                        {displayedAsset.subCategory && (
                          <span className="max-w-[100px] truncate rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-semibold text-purple-700">{displayedAsset.subCategory}</span>
                        )}
                      </div>
                    </div>
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">{displayedAsset.status}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded border border-blue-50 bg-white/80 p-2"><p className="text-[10px] font-medium text-gray-500">{t('zone')}</p><p className="font-semibold text-gray-900">{displayedAsset.zone}</p></div>
                    <div className="rounded border border-blue-50 bg-white/80 p-2"><p className="text-[10px] font-medium text-gray-500">{t('ward')}</p><p className="font-semibold text-gray-900">{displayedAsset.ward || 'N/A'}</p></div>
                  </div>
                  <div className="rounded border border-blue-50 bg-white/80 p-2 text-xs">
                    <p className="flex items-center gap-1 text-[10px] font-medium text-gray-500"><MapPin className="h-3 w-3 text-gray-400" /> {t('location')}</p>
                    <p className="truncate font-semibold text-gray-900" title={displayedAsset.location}>{displayedAsset.location}</p>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-2.5 text-xs">
                    <p className="flex items-center gap-1 text-[10px] font-medium text-gray-600"><IndianRupee className="h-3 w-3 text-green-600" /> {t('assetValue')}</p>
                    <p className="text-base font-bold text-green-700">{'Rs. '}{displayedAsset.valueLakhs}{' L'}</p>
                  </div>
                </div>
              ) : selectedSubcategory ? (
                /* ── Asset list within a type (lazy-loaded) ── */
                <div className="space-y-2">
                  <h4 className="mb-2 text-sm font-bold text-gray-900">{selectedSubcategory.name}</h4>
                  {isLoadingSubcategoryAssets ? (
                    <div className="flex items-center justify-center py-6">
                      <Loader2 className="h-5 w-5 animate-spin text-blue-500 mr-2" />
                      <span className="text-xs text-gray-500">Loading assets…</span>
                    </div>
                  ) : subcategoryAssets.length ? (
                    subcategoryAssets.map((asset, index) => {
                      // Handle both MunicipalAsset and AssetDashboardAssetByType shapes
                      const assetId = String((asset as any).id ?? index);
                      const assetName = (asset as any).name || (asset as any).assetName || '';
                      const assetStatus = (asset as any).status || 'Active';
                      const assetCode = (asset as any).code || '';
                      const isMunicipalAsset = 'valueLakhs' in asset;
                      const assetLocation = isMunicipalAsset
                        ? (asset as any).location 
                        : `${(asset as any).wardName || ''} ${(asset as any).zoneName || ''}`.trim() || assetCode || 'Municipal Area';
                      const marketValue = (asset as any).marketValue;

                      return (
                        <div
                          key={`asset-${assetId}-${index}`}
                          className="cursor-pointer rounded-lg border border-gray-200 bg-white p-2.5 transition-all hover:border-blue-300 hover:shadow-xs"
                          onClick={() => {
                            if (isMunicipalAsset) {
                              onAssetClick(asset as DashboardMapAssetType);
                            } else {
                              // It's an AssetDashboardAssetByType, we need to find it in the global `assets` list
                              // because AssetMasterDashboard maps it and adds it there.
                              const mappedAsset = assets.find(a => String(a.id) === String(assetId));
                              if (mappedAsset) {
                                onAssetClick(mappedAsset);
                              }
                            }
                          }}
                        >
                          <div className="mb-1 flex items-start justify-between">
                            <h5 className="flex-1 truncate text-xs font-bold text-gray-900">{assetName}</h5>
                            <Badge
                              variant={assetStatus === 'Active' || assetStatus === 'complete' ? 'success' : 'secondary'}
                              size="sm"
                              className="h-4 min-h-[16px] px-1.5 py-0 text-[9px] leading-none"
                            >
                              {assetStatus}
                            </Badge>
                          </div>
                          <p className="truncate text-[10px] text-gray-500">{assetLocation}</p>
                          {marketValue != null && (
                            <p className="mt-0.5 text-[10px] font-semibold text-green-600 flex items-center gap-0.5">
                              <IndianRupee className="h-2.5 w-2.5" />
                              {marketValue > 0 ? `${(marketValue / 1e5).toFixed(1)}L` : 'N/A'}
                            </p>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="rounded-lg border border-dashed border-gray-200 bg-white px-3 py-4 text-center text-xs text-gray-400">{t('noAssetsFound')}</div>
                  )}
                </div>
              ) : (
                /* ── Default view: subcategory type list per filtered category ── */
                sections
                  .filter((section) => !activeFilters.length || activeFilters.includes(section.id))
                  .map(({ id, title, Icon, icon, pill, titleColor, items, loading: catLoading }, sectionIdx) => {
                    const displayTitle = tCat(t as (k: string) => string, getCategoryKey(title), title);
                    return (
                      <div key={`section-${id || 'unknown'}-${sectionIdx}`} className="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                        <div className={`${pill} mb-2 flex items-center gap-2 rounded-lg px-3 py-2`}>
                          <Icon className={`h-4.5 w-4.5 ${icon}`} />
                          <h4 className={`text-sm font-extrabold sm:text-base ${titleColor}`}>{displayTitle}</h4>
                        </div>
                        {catLoading ? (
                          <div className="flex items-center gap-1.5 py-2 pl-2">
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-400" />
                            <span className="text-[10px] text-gray-400">Loading types…</span>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-1.5">
                            {items.length ? (
                              items.map((item, itemIdx) => (
                                <Button
                                  key={`${item.name}-${itemIdx}`}
                                  variant="ghost"
                                  onClick={() => handleSubcategoryClick(id, item.name, item.typeId)}
                                  className="h-auto w-full rounded-lg border border-gray-200 bg-white p-2.5 shadow-sm transition-all hover:border-blue-300 hover:bg-gray-50 hover:text-inherit flex flex-col !items-stretch !justify-start !text-left"
                                >
                                  <div className="flex w-full flex-col">
                                    <p className="w-full break-words whitespace-normal text-left text-[12px] font-bold leading-snug text-gray-900 sm:text-xs">{item.name}</p>
                                    <div className="mt-0.5 flex w-full items-center justify-between gap-1">
                                      <span className="text-[10px] font-semibold text-gray-500">
                                        {item.count === 1 ? t('assetCountLabel', { count: item.count }) : t('assetsCountLabel', { count: item.count })}
                                      </span>
                                      {item.totalValue > 0 && (
                                        <span className="flex flex-shrink-0 items-center gap-0.5 text-[10px] font-bold text-emerald-600">
                                          <IndianRupee className="h-2.5 w-2.5" />
                                          {item.totalValue >= 1e7
                                            ? `${(item.totalValue / 1e7).toFixed(1)}Cr`
                                            : item.totalValue >= 1e5
                                            ? `${(item.totalValue / 1e5).toFixed(1)}L`
                                            : item.totalValue.toLocaleString('en-IN')}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </Button>
                              ))
                            ) : (
                              <div className="col-span-2 py-2 text-center text-xs font-medium text-gray-400">{t('noSubcategories')}</div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
