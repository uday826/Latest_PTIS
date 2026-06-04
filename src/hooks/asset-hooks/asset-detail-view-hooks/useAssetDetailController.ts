"use client";

import React, { useCallback, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import type { MunicipalAsset } from '@/components/modules/assets/municipal-Asset/data/municipalAssets';
import {
  demoBuildingImage,
  demoFloorPlanImage,
  assetThumbnails,
  buildingPlan,
  assetImages,
  floorPlanImages,
  getBuildingData,
  getCategoryDetailedData
} from '@/components/modules/assets/municipal-Asset/data/assetDetailMockData';
import type {
  AssetDetailController,
  AssetDetailTab,
  OverviewSubTab,
  DocumentItem,
  BuildingDataFields,
  DocumentActionPayload
} from '@/types/asset-types/asset-detail-view-types/asset-detail-view-types';

type AssetLightboxKind = 'asset-photo' | 'floor-plan';

interface ParsedAssetDetailRoute {
  activeTab: AssetDetailTab;
  overviewSubTab: OverviewSubTab;
  lightboxKind: AssetLightboxKind | null;
  lightboxIndex: number;
}

const DETAIL_ROOT = '/assets/municipal-Asset';
const DEFAULT_ROUTE_STATE: ParsedAssetDetailRoute = {
  activeTab: 'overview',
  overviewSubTab: 'summary',
  lightboxKind: null,
  lightboxIndex: 0
};

function parseLightboxKind(value: string | undefined): AssetLightboxKind | null {
  if (value === 'asset-photo' || value === 'floor-plan') {
    return value;
  }

  return null;
}

function parseIndex(value: string | undefined): number {
  const parsed = Number.parseInt(value ?? '0', 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

function parseAssetDetailRoute(pathname: string): ParsedAssetDetailRoute {
  const segments = pathname.split('/').filter(Boolean);
  const rootIndex = segments.findIndex((segment, index) => index >= 2 && segment === 'municipal-Asset');

  if (rootIndex === -1 || segments.length <= rootIndex + 1) {
    return DEFAULT_ROUTE_STATE;
  }

  const routeSegments = segments.slice(rootIndex + 2);
  const [first, second] = routeSegments;

  if (!first || first === 'overview') {
    const overviewSubTab: OverviewSubTab = second === 'shop-details' ? 'shopDetails' : 'summary';
    const imageStartIndex = second === 'shop-details' ? 2 : 1;
    const lightboxKind = parseLightboxKind(routeSegments[imageStartIndex + 1]);

    if (routeSegments[imageStartIndex] === 'image' && lightboxKind) {
      return {
        activeTab: 'overview',
        overviewSubTab,
        lightboxKind,
        lightboxIndex: parseIndex(routeSegments[imageStartIndex + 2])
      };
    }

    return {
      activeTab: 'overview',
      overviewSubTab,
      lightboxKind: null,
      lightboxIndex: 0
    };
  }

  if (first === 'legal' || first === 'documents' || first === 'assets') {
    return {
      activeTab: first,
      overviewSubTab: 'summary',
      lightboxKind: null,
      lightboxIndex: 0
    };
  }

  if (first === 'valuation' || first === 'financial') {
    return {
      activeTab: 'financial',
      overviewSubTab: 'summary',
      lightboxKind: null,
      lightboxIndex: 0
    };
  }

  return DEFAULT_ROUTE_STATE;
}

function buildAssetDetailPath(
  locale: string,
  assetId: string,
  tab: AssetDetailTab,
  overviewSubTab: OverviewSubTab,
  lightboxKind: AssetLightboxKind | null = null,
  lightboxIndex = 0
): string {
  const basePath = `/${locale}${DETAIL_ROOT}/${assetId}`;

  if (tab !== 'overview') {
    const tabSegment = tab === 'financial' ? 'valuation' : tab;
    return `${basePath}/${tabSegment}`;
  }

  const overviewPath = overviewSubTab === 'shopDetails'
    ? `${basePath}/overview/shop-details`
    : `${basePath}/overview`;

  if (!lightboxKind) {
    return overviewPath;
  }

  return `${overviewPath}/image/${lightboxKind}/${lightboxIndex}`;
}

export function useAssetDetailController(asset: MunicipalAsset): AssetDetailController {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [uploadedDocuments] = useState<DocumentItem[]>([]);
  const routeState = useMemo(() => parseAssetDetailRoute(pathname), [pathname]);

  // Resolved dynamically from the data service layer to enable easy future API integration
  const detailedData = useMemo(() => getCategoryDetailedData(asset) as BuildingDataFields, [asset]);

  const buildingAge = asset.constructionYear ? new Date().getFullYear() - asset.constructionYear : null;
  const buildingData = useMemo(() => getBuildingData(asset) as BuildingDataFields, [asset]);

  const mapFigmaAssets = useCallback((images: string[] | undefined): string[] => {
    if (!images) return [];

    return images.map((img) => {
      if (img.toLowerCase().includes('floorplan') || img.toLowerCase().includes('plan') || img.toLowerCase().includes('survey')) {
        return demoFloorPlanImage;
      }

      return demoBuildingImage;
    });
  }, []);

  // Simplified generic asset images resolver
  const currentAssetImages = useMemo(() => {
    // 1. Direct asset images
    if (asset.images && asset.images.length > 0) {
      return mapFigmaAssets(asset.images);
    }

    // 2. Category-specific detailed images
    if (detailedData?.images && Array.isArray(detailedData.images) && detailedData.images.length > 0) {
      return mapFigmaAssets(detailedData.images as string[]);
    }

    // 3. Fallbacks
    const assetThumbnail = asset.thumbnail || assetThumbnails[asset.id] || 'https://images.unsplash.com/photo-1701788462665-48b6d237e8d1?w=400';
    return assetImages[asset.id] || [assetThumbnail, assetThumbnail, assetThumbnail];
  }, [asset, detailedData, mapFigmaAssets]);

  // Simplified generic floor plans resolver
  const allFloorPlans = useMemo(() => {
    // 1. Direct asset floor plans
    if (asset.floorPlans && asset.floorPlans.length > 0) {
      return mapFigmaAssets(asset.floorPlans);
    }

    // 2. Category-specific detailed floor plans
    if (detailedData?.floorPlans && Array.isArray(detailedData.floorPlans) && detailedData.floorPlans.length > 0) {
      return mapFigmaAssets(detailedData.floorPlans as string[]);
    }

    // 3. Category building default fallback
    if (buildingData) {
      return floorPlanImages[asset.id] || [buildingPlan];
    }

    return [];
  }, [asset, detailedData, buildingData, mapFigmaAssets]);

  const currentFloorPlans = allFloorPlans;

  const lightboxImages = useMemo(() => {
    if (routeState.lightboxKind === 'floor-plan') {
      return currentFloorPlans;
    }

    if (routeState.lightboxKind === 'asset-photo') {
      return currentAssetImages;
    }

    return [];
  }, [currentAssetImages, currentFloorPlans, routeState.lightboxKind]);

  const lightboxTitle = routeState.lightboxKind === 'floor-plan'
    ? 'Floor Plan'
    : 'Asset Photo';

  const lightboxOpen = routeState.lightboxKind !== null && lightboxImages.length > 0;
  const lightboxIndex = lightboxImages.length > 0
    ? Math.min(routeState.lightboxIndex, lightboxImages.length - 1)
    : 0;

  const updateRoute = useCallback((next: Partial<ParsedAssetDetailRoute>, mode: 'push' | 'replace' = 'push') => {
    const path = buildAssetDetailPath(
      locale,
      asset.id,
      next.activeTab ?? routeState.activeTab,
      next.overviewSubTab ?? routeState.overviewSubTab,
      next.lightboxKind === undefined ? routeState.lightboxKind : next.lightboxKind,
      next.lightboxIndex ?? routeState.lightboxIndex
    );

    if (mode === 'replace') {
      router.replace(path);
      return;
    }

    router.push(path);
  }, [asset.id, locale, routeState.activeTab, routeState.lightboxIndex, routeState.lightboxKind, routeState.overviewSubTab, router]);

  const handleViewDocument = useCallback((doc: DocumentActionPayload) => {
    let url = doc.fileData;

    if (!url || url === '#') {
      url = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf-test.pdf';
    }

    window.open(url, '_blank');
  }, []);

  const handleDownloadDocument = useCallback((doc: DocumentActionPayload) => {
    const link = document.createElement('a');
    link.href = doc.fileData || '#';
    link.download = doc.fileName || doc.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const openLightbox = useCallback((index: number) => {
    updateRoute({
      activeTab: 'overview',
      overviewSubTab: routeState.overviewSubTab,
      lightboxKind: 'asset-photo',
      lightboxIndex: index
    });
  }, [routeState.overviewSubTab, updateRoute]);

  const openFloorPlanLightbox = useCallback((index: number) => {
    updateRoute({
      activeTab: 'overview',
      overviewSubTab: routeState.overviewSubTab,
      lightboxKind: 'floor-plan',
      lightboxIndex: index
    });
  }, [routeState.overviewSubTab, updateRoute]);

  const closeLightbox = useCallback(() => {
    updateRoute({
      activeTab: 'overview',
      overviewSubTab: routeState.overviewSubTab,
      lightboxKind: null,
      lightboxIndex: 0
    }, 'replace');
  }, [routeState.overviewSubTab, updateRoute]);

  const nextImage = useCallback(() => {
    if (!lightboxOpen || lightboxImages.length === 0) return;
    updateRoute({
      lightboxKind: routeState.lightboxKind,
      lightboxIndex: (lightboxIndex + 1) % lightboxImages.length
    }, 'replace');
  }, [lightboxImages.length, lightboxIndex, lightboxOpen, routeState.lightboxKind, updateRoute]);

  const prevImage = useCallback(() => {
    if (!lightboxOpen || lightboxImages.length === 0) return;
    updateRoute({
      lightboxKind: routeState.lightboxKind,
      lightboxIndex: (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length
    }, 'replace');
  }, [lightboxImages.length, lightboxIndex, lightboxOpen, routeState.lightboxKind, updateRoute]);

  const handleLightboxKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!lightboxOpen) return;
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'Escape') closeLightbox();
  }, [closeLightbox, lightboxOpen, nextImage, prevImage]);

  const setActiveTab = useCallback((tab: AssetDetailTab) => {
    updateRoute({
      activeTab: tab,
      overviewSubTab: 'summary',
      lightboxKind: null,
      lightboxIndex: 0
    });
  }, [updateRoute]);

  const setOverviewSubTab = useCallback((subTab: OverviewSubTab) => {
    updateRoute({
      activeTab: 'overview',
      overviewSubTab: subTab,
      lightboxKind: null,
      lightboxIndex: 0
    });
  }, [updateRoute]);

  const setLightboxIndex = useCallback((index: number) => {
    if (!routeState.lightboxKind) return;

    updateRoute({
      lightboxKind: routeState.lightboxKind,
      lightboxIndex: index
    }, 'replace');
  }, [routeState.lightboxKind, updateRoute]);

  return {
    asset,
    activeTab: routeState.activeTab,
    setActiveTab,
    uploadedDocuments,
    overviewSubTab: routeState.overviewSubTab,
    setOverviewSubTab,
    buildingData,
    buildingAge,
    detailedData,
    currentAssetImages,
    openLightbox,
    allFloorPlans,
    currentFloorPlans,
    openFloorPlanLightbox,
    demoFloorPlanImage,
    handleViewDocument,
    handleDownloadDocument,
    lightboxOpen,
    lightboxImages,
    lightboxIndex,
    lightboxTitle,
    closeLightbox,
    nextImage,
    prevImage,
    setLightboxIndex,
    handleLightboxKeyDown
  };
}
