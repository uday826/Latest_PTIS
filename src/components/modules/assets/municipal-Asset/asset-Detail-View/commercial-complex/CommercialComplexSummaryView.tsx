"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/common';
import type { AssetDetailController, CommercialComplexShopRow } from '@/types/asset-types/asset-detail-view-types/asset-detail-view-types';
import { motion } from 'framer-motion';
import { Building2, Store } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';

const MotionCard = motion.create(Card);

export function CommercialComplexSummaryView({ controller }: { controller: AssetDetailController }): React.JSX.Element | null {
  const { asset } = controller;
  const t = useTranslations('municipalAsset');

  if (!asset) return null;

  const totalBuiltUpArea = asset.shopDetails?.reduce((sum: number, shop: CommercialComplexShopRow) => sum + (parseFloat(String(shop.builtUpArea)) || 0), 0) || 0;
  const totalCarpetArea = asset.shopDetails?.reduce((sum: number, shop: CommercialComplexShopRow) => sum + (parseFloat(String(shop.builtUpArea)) * 0.9 || 0), 0) || 0;

  const naStr = t('statusBar.notAvailableShort');

  const basicInfoItems = React.useMemo(() => [
    { label: t('summaryView.labels.assetName'), value: asset.name, bold: true },
    { label: t('summaryView.labels.address'), value: asset.location, title: asset.location },
    { label: t('summaryView.labels.owningDept'), value: asset.department, title: asset.department },
    { label: t('summaryView.labels.ownershipType'), value: t('summaryView.labels.municipal') },
    { label: t('summaryView.labels.inChargeName'), value: asset.inChargeName || naStr },
    { label: t('summaryView.labels.designation'), value: asset.inChargeDesignation || naStr },
    { label: t('summaryView.labels.contactNo'), value: asset.inChargeContact || naStr },
    { label: t('summaryView.labels.emailId'), value: asset.inChargeEmail || naStr }
  ], [asset, t, naStr]);

  const overviewItems = React.useMemo(() => [
    { label: t('summaryView.labels.totalShops'), value: asset.totalShops, highlight: true },
    { label: t('summaryView.labels.occupied'), value: asset.occupiedShops, highlight: true },
    { label: t('summaryView.labels.vacant'), value: asset.vacantShops, highlight: true },
    { label: t('summaryView.labels.builtUpArea'), value: t('summaryView.labels.sqft', { area: totalBuiltUpArea.toLocaleString() }) },
    { label: t('summaryView.labels.carpetArea'), value: t('summaryView.labels.sqft', { area: totalCarpetArea.toLocaleString() }) }
  ], [asset, totalBuiltUpArea, totalCarpetArea, t]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="grid grid-cols-2 gap-3"
    >
      {/* Basic Information Panel */}
      <MotionCard
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
        padding="none"
      >
        <CardHeader className="mb-0 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 px-3 py-2.5">
          <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-600" />
            {t('summaryView.basicInfo')}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 py-3">
          <div className="space-y-2.5">
            {basicInfoItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.15 + (index * 0.03) }}
                className="flex justify-between items-start py-1.5 border-b border-slate-100 last:border-0"
              >
                <span className="text-xs text-gray-600 w-[35%]">{item.label}</span>
                <span
                  className={`text-xs text-slate-800 w-[63%] text-right leading-tight ${item.bold ? 'font-semibold' : ''}`}
                  title={item.title}
                >
                  {item.value}
                </span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </MotionCard>

      {/* Municipal Shop Complex Overview */}
      <MotionCard
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
        padding="none"
      >
        <CardHeader className="mb-0 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 px-3 py-2.5">
          <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Store className="w-4 h-4 text-slate-600" />
            {t('summaryView.complexOverview')}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 py-3">
          <div className="space-y-2.5">
            {overviewItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.15 + (index * 0.03) }}
                className="flex justify-between items-center py-1.5 border-b border-slate-100 last:border-0"
              >
                <span className="text-xs text-gray-600">{item.label}</span>
                <motion.span
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 + (index * 0.03) }}
                  className={`text-sm text-slate-800 ${item.highlight ? 'font-bold bg-slate-100 px-2.5 py-1 rounded' : ''}`}
                >
                  {item.value}
                </motion.span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </MotionCard>
    </motion.div>
  );
}
