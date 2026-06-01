"use client";

import React from 'react';
import { Tabs } from '@/components/common';
import { useTranslations } from 'next-intl';
import { CommercialComplexSummaryView } from '../commercial-complex/CommercialComplexSummaryView';
import { CommercialComplexShopTable } from '../commercial-complex/CommercialComplexShopTable';
import type { AssetDetailController, OverviewSubTab } from '@/types/asset-types/asset-detail-view-types/asset-detail-view-types';
import { StandardBuildingOverview } from '../StandardBuildingOverview';
import { OverviewSidebarPhotographs } from '../OverviewSidebarPhotographs';

export function OverviewTabContent({ controller }: { controller: AssetDetailController }): React.JSX.Element {
  const {
    asset,
    overviewSubTab,
    setOverviewSubTab,
    buildingData,
    detailedData,
    currentAssetImages,
    openLightbox,
    allFloorPlans,
    currentFloorPlans,
    openFloorPlanLightbox,
    demoFloorPlanImage
  } = controller;

  const t = useTranslations('municipalAsset');

  const isCommercialComplex = asset.category === 'building' && asset.assetType === 'Municipal Commercial Complex';
  const isStandardBuilding = asset.category === 'building' && !isCommercialComplex;

  return (
    <div className="flex gap-4">
      {/* Main Content - Left Side */}
      <div className="flex-1 space-y-3 pr-6">

        {/* Sub-tabs for Municipal Commercial Complex */}
        {isCommercialComplex && asset.shopDetails && (
          <Tabs
            value={overviewSubTab}
            onChange={(val): void => setOverviewSubTab(val as OverviewSubTab)}
            variant="pills"
            size="md"
          >
            <Tabs.TabList className="bg-[#EDF2F7]">
              <Tabs.Tab value="summary">
                {t('overviewTab.summarySubTab')}
              </Tabs.Tab>
              <Tabs.Tab value="shopDetails">
                {t('overviewTab.shopDetailsSubTab')}
              </Tabs.Tab>
            </Tabs.TabList>
          </Tabs>
        )}

        {/* Commercial Complex Summary View */}
        {isCommercialComplex && overviewSubTab === 'summary' && (
          <CommercialComplexSummaryView controller={controller} />
        )}

        {/* Generic Building Overview Panel */}
        {isStandardBuilding && (
          <StandardBuildingOverview
            asset={asset}
            detailedData={detailedData}
          />
        )}

        {/* Building-specific Overview Details */}
        {buildingData && (
          <div>
            {/* Shop-wise Details Table - Separate Tab */}
            {isCommercialComplex && asset.shopDetails && overviewSubTab === 'shopDetails' && (
              <CommercialComplexShopTable controller={controller} />
            )}

            <div className="space-y-4">
              {/* Building overview panels would go here */}
            </div>
          </div>
        )}

      </div>

      {/* Asset Photographs - Right Sidebar */}
      <OverviewSidebarPhotographs
        currentAssetImages={currentAssetImages}
        openLightbox={openLightbox}
        allFloorPlans={allFloorPlans}
        currentFloorPlans={currentFloorPlans}
        openFloorPlanLightbox={openFloorPlanLightbox}
        demoFloorPlanImage={demoFloorPlanImage}
      />
    </div>
  );
}
