'use client';

import { deriveDashboardData, ICONS, mapSummaryToStats } from '@/lib/utils/asset-utils/asset-dashboard-helpers';
import type {
  AssetMasterDashboardProps, DashboardAuctionDetail,
  DashboardCategoryItem,
  DashboardContentProps,
  DashboardDataPayload,
  DashboardMapAssetType,
} from '@/types/asset-type/asset-dashboard.types';
import { AnimatePresence } from 'framer-motion';
import { BarChart3, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { DashboardAcquisition } from './DashboardAcquisition';
import { DashboardMap } from './DashboardMap';
import { AuctionDetailModal, EncroachmentModal } from './DashboardModals';
import { DashboardStats as StatsSection } from './DashboardStats';
import { DashboardZone } from './DashboardZone';
import { DashboardLayout } from '../DashboardLayout';
import { DashboardFilters } from '../DashboardFilter';

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

function DashboardContent({ initialSummary, initialCategories, initialDashboardData, selectedDistrict }: DashboardContentProps & { initialDashboardData?: DashboardDataPayload; selectedDistrict?: string }) {
  const t = useTranslations('assetmasterdashboard');
  const [district] = useState(selectedDistrict || '');
  const [selectedZone, setSelectedZone] = useState('all');
  const [selectedWard, setSelectedWard] = useState('all');
  const [selectedAsset, setSelectedAsset] = useState<DashboardMapAssetType | null>(null);
  const [selectedAuctionDetail, setSelectedAuctionDetail] = useState<DashboardAuctionDetail | null>(null);
  const [showEncroachmentModal, setShowEncroachmentModal] = useState(false);
  const [drillDownCategories, setDrillDownCategories] = useState<string[]>([]);
  const [loading] = useState(false);

  // Initialize data with the pre-fetched 100% SSR props
  const [dashboardData] = useState<DashboardDataPayload>(() => initialDashboardData || {
    stats: mapSummaryToStats(initialSummary as Record<string, unknown>, (initialCategories || []).map(mapCategoryItem)),
    filteredAssets: [],
    categories: (initialCategories || []).map(mapCategoryItem),
    zoneDistribution: [],
    acquisitionsList: [],
    auctionsList: [],
    allZones: [],
    allWards: [],
  });




  const data = useMemo(() => deriveDashboardData(dashboardData, selectedZone, selectedWard, drillDownCategories), [dashboardData, selectedZone, selectedWard, drillDownCategories]);
  const visibleAssets = useMemo(() => data.filteredAssets, [data.filteredAssets]);
  const zonesList = useMemo(() => ['all', ...new Set([...(dashboardData.allZones || []), ...dashboardData.filteredAssets.map(a => a.zone)])].filter(Boolean), [dashboardData.allZones, dashboardData.filteredAssets]);
  const wardsList = useMemo(() => {
    const assetWards = dashboardData.filteredAssets
      .filter(a => selectedZone === 'all' || a.zone === selectedZone)
      .map(a => a.ward);
    const masterWards = (dashboardData.allWards || [])
      .filter(w => selectedZone === 'all' || w.zoneNo === selectedZone)
      .map(w => w.wardNo);
    return ['all', ...new Set([...masterWards, ...assetWards])].filter(Boolean);
  }, [dashboardData.allWards, dashboardData.filteredAssets, selectedZone]);
  const encroachedAssets = useMemo(() => visibleAssets.filter(a => (a.encroachment as { hasEncroachment?: boolean })?.hasEncroachment), [visibleAssets]);
  const visibleZoneDistribution = useMemo(() => { const c: Record<string, number> = {}; visibleAssets.forEach(a => { c[a.zone] = (c[a.zone] || 0) + 1; }); return Object.entries(c).map(([name, value]) => ({ name, value })); }, [visibleAssets]);
  const activeZone = useMemo(() => (selectedZone !== 'all' && zonesList.includes(selectedZone)) ? selectedZone : 'all', [selectedZone, zonesList]);
  const activeWard = useMemo(() => (selectedWard !== 'all' && wardsList.includes(selectedWard)) ? selectedWard : 'all', [selectedWard, wardsList]);

  const handleZoneChange = (z: string) => { setSelectedZone(z); setSelectedAsset(null); setSelectedAuctionDetail(null); };
  const handleWardChange = (w: string) => { setSelectedWard(w); setSelectedAsset(null); setSelectedAuctionDetail(null); };
  const handleCategoryClickFromMap = (cats: string[]) => { setDrillDownCategories(cats); setSelectedAsset(null); setSelectedAuctionDetail(null); };
  const handleStatsCategoryClick = (cat: string | null) => {
    if (!cat) return setDrillDownCategories([]);
    if (cat === 'Active Encroachments') return setShowEncroachmentModal(true);
    setSelectedAsset(null); setSelectedAuctionDetail(null); setDrillDownCategories([cat]);
  };

  const SELECT_CLS = 'px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm hover:border-gray-300 transition-colors cursor-pointer';
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
        onCategoryClick={handleStatsCategoryClick}
      />

      <DashboardMap
        categories={data.categories}
        assets={visibleAssets}
        selectedAsset={selectedAsset}
        selectedDistrict={district}
        onCategoryClick={handleCategoryClickFromMap}
        onAssetClick={setSelectedAsset}
        activeFilters={drillDownCategories}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[7fr_3fr] gap-6">
        <DashboardAcquisition
          acquisitionsList={data.acquisitionsList}
          auctionsList={data.auctionsList}
          onAuctionClick={setSelectedAuctionDetail}
        />

        <DashboardZone
          zoneDistribution={visibleZoneDistribution}
          filteredAssets={visibleAssets}
          selectedDistrict={district}
        />
      </div>
    </DashboardLayout>
  );
}

export function AssetMasterDashboard({ initialSummary, initialCategories, initialDashboardData, selectedDistrict }: AssetMasterDashboardProps & { initialDashboardData?: DashboardDataPayload; selectedDistrict?: string }) {
  return (
    <DashboardContent
      initialSummary={initialSummary}
      initialCategories={initialCategories}
      initialDashboardData={initialDashboardData}
      selectedDistrict={selectedDistrict}
    />
  );
}
