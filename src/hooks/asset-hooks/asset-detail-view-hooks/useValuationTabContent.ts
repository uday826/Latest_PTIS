"use client";

import { useMemo } from 'react';
import type { AssetDetailController, ValuationTabContentResult } from '@/types/asset-types/asset-detail-view-types/asset-detail-view-types';
import { getBuildingValuation } from '@/components/modules/assets/municipal-Asset/data/assetDetailMockData';

export function useValuationTabContent(
  controller: AssetDetailController
): ValuationTabContentResult {
  const { asset, buildingData } = controller;

  const buildingAge = useMemo(() => {
    return asset.constructionYear ? new Date().getFullYear() - asset.constructionYear : null;
  }, [asset.constructionYear]);

  const valuationData = useMemo(() => {
    return getBuildingValuation(asset, buildingData, buildingAge);
  }, [asset, buildingData, buildingAge]);

  return {
    asset,
    buildingData,
    floors: valuationData.floors,
    buildingCapitalValue: valuationData.buildingCapitalValue
  };
}
