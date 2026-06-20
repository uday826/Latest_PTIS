'use client';


import {
  fetchTypesByCategoryRSCAction,
  fetchAssetsByTypeRSCAction,
} from '@/app/[locale]/assets/dashboard/master-dashboard/actions';
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

import { AssetMasterDashboardProps } from '@/types/asset-type/asset-dashboard.types';
import { useAssetMasterDashboard } from '@/hooks/asset-hooks/useAssetMasterDashboard';

export function AssetMasterDashboard({ initialData, selectedDistrict }: { initialData: any, selectedDistrict: string }) {
  const t = useTranslations('assetmasterdashboard');
  const {
    data, loading, activeZone, activeWard,
    zonesList, wardsList, visibleAssets, encroached,
    selectedAsset, setSelectedAsset, catFilters, setCatFilters,
    showEncroachment, setShowEncroachment,
    loadTypesByCategory, loadAssetsByType,
    handleZoneChange, handleWardChange
  } = useAssetMasterDashboard(initialData);

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
          if (!cat) { setCatFilters([]); return; }
          if (cat === 'Active Encroachments') { setShowEncroachment(true); return; }
          setSelectedAsset(null); setCatFilters([cat]);
        }}
      />
      <DashboardMap
        filterKey={`${activeZone}-${activeWard}`}
        categories={data.categories}
        assets={visibleAssets}
        selectedAsset={selectedAsset}
        selectedDistrict={selectedDistrict}
        onCategoryClick={(cats) => { setCatFilters(cats); setSelectedAsset(null); }}
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
