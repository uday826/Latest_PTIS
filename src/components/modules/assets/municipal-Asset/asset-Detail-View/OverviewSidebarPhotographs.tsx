"use client";

import React from 'react';
import { Building2, Eye, Layers } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { OverviewSidebarPhotographsProps } from '@/types/asset-types/asset-detail-view-types/asset-detail-view-types';

export function OverviewSidebarPhotographs({
  currentAssetImages,
  openLightbox,
  allFloorPlans,
  currentFloorPlans,
  openFloorPlanLightbox,
  demoFloorPlanImage
}: OverviewSidebarPhotographsProps): React.JSX.Element {
  const t = useTranslations('municipalAsset');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, callback: () => void): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback();
    }
  };

  return (
    <div className="w-64 space-y-3 flex-shrink-0">
      <div>
        <h3 className="text-sm text-[rgb(15,23,43)] mb-3 flex items-center gap-2 text-[14px] font-bold">
          <Building2 className="w-4 h-4" />
          {t('overviewTab.assetPhotographs')}
        </h3>

        {/* Whatsapp-style Image Gallery */}
        {currentAssetImages.length <= 3 ? (
          <div className="space-y-1.5">
            {currentAssetImages.filter((img, idx, arr) => arr.indexOf(img) === idx).map((img, idx) => (
              <div
                key={idx}
                className="relative aspect-square rounded-lg overflow-hidden border border-municipal-primary/20 group cursor-pointer hover:shadow-lg transition-all bg-[#F8FAFC]"
                onClick={(): void => openLightbox(idx)}
                onKeyDown={(e): void => handleKeyDown(e, () => openLightbox(idx))}
                role="button"
                tabIndex={0}
                aria-label={t('overviewTab.floorPlanAlt', { num: idx + 1 })}
              >
                <img
                  src={img}
                  alt={t('overviewTab.floorPlanAlt', { num: idx + 1 })}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <Eye className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-1.5">
            {currentAssetImages.slice(0, 4).map((img, idx) => (
              <div
                key={idx}
                className="relative rounded-lg overflow-hidden border border-municipal-primary/20 group cursor-pointer hover:shadow-lg transition-all bg-[#F8FAFC]"
                onClick={(): void => openLightbox(idx)}
                onKeyDown={(e): void => handleKeyDown(e, () => openLightbox(idx))}
                role="button"
                tabIndex={0}
                aria-label={t('overviewTab.floorPlanAlt', { num: idx + 1 })}
              >
                <img
                  src={img}
                  alt={t('overviewTab.floorPlanAlt', { num: idx + 1 })}
                  className="w-full h-20 object-cover transition-transform group-hover:scale-105"
                />
                {idx === 3 && currentAssetImages.length > 4 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white text-xl font-semibold">+{currentAssetImages.length - 4}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <Eye className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Floor Plans */}
        {allFloorPlans.length > 0 && (
          <div className="mt-3">
            <h3 className="text-xs text-[rgb(15,23,43)] mb-2 flex items-center gap-1 text-[14px] font-bold">
              <Layers className="w-3 h-3" />
              {t('overviewTab.floorPlans')}
            </h3>

            {currentFloorPlans.length <= 3 ? (
              <div className="space-y-1.5">
                {currentFloorPlans.map((img: string, idx: number) => (
                  <div
                    key={idx}
                    className="relative rounded-lg overflow-hidden border border-municipal-primary/20 group cursor-pointer hover:shadow-lg transition-all bg-[#F8FAFC]"
                    onClick={(): void => openFloorPlanLightbox(idx)}
                    onKeyDown={(e): void => handleKeyDown(e, () => openFloorPlanLightbox(idx))}
                    role="button"
                    tabIndex={0}
                    aria-label={t('overviewTab.floorPlanAlt', { num: idx + 1 })}
                  >
                    <img
                      src={img}
                      alt={t('overviewTab.floorPlanAlt', { num: idx + 1 })}
                      className="w-full h-24 object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute bottom-1 left-1 px-2 py-0.5 bg-blue-600 text-white text-xs rounded">
                      {t('overviewTab.planLabel', { num: idx + 1 })}
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <Eye className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-1.5">
                {currentFloorPlans.slice(0, 4).map((img: string, idx: number) => (
                  <div
                    key={idx}
                    className="relative rounded-lg overflow-hidden border border-municipal-primary/20 group cursor-pointer hover:shadow-lg transition-all bg-[#F8FAFC]"
                    onClick={(): void => openFloorPlanLightbox(idx)}
                    onKeyDown={(e): void => handleKeyDown(e, () => openFloorPlanLightbox(idx))}
                    role="button"
                    tabIndex={0}
                    aria-label={t('overviewTab.floorPlanAlt', { num: idx + 1 })}
                  >
                    <img
                      src={img}
                      alt={t('overviewTab.floorPlanAlt', { num: idx + 1 })}
                      className="w-full h-24 object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute bottom-1 left-1 px-2 py-0.5 bg-blue-600 text-white text-xs rounded">
                      {t('overviewTab.planLabel', { num: idx + 1 })}
                    </div>
                    {idx === 3 && currentFloorPlans.length > 4 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white text-xl font-semibold">+{currentFloorPlans.length - 4}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <Eye className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
                {demoFloorPlanImage && (
                  <div
                    className="relative rounded-lg overflow-hidden border border-municipal-primary/20 group cursor-pointer hover:shadow-lg transition-all bg-[#F8FAFC]"
                    onClick={(): void => openFloorPlanLightbox(currentFloorPlans.length)}
                    onKeyDown={(e): void => handleKeyDown(e, () => openFloorPlanLightbox(currentFloorPlans.length))}
                    role="button"
                    tabIndex={0}
                    aria-label={t('overviewTab.groundFirstPlanAlt')}
                  >
                    <img
                      src={demoFloorPlanImage}
                      alt={t('overviewTab.groundFirstPlanAlt')}
                      className="w-full h-24 object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute bottom-1 left-1 px-2 py-0.5 bg-blue-600 text-white text-xs rounded">
                      {t('overviewTab.groundFirstPlan')}
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <Eye className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
