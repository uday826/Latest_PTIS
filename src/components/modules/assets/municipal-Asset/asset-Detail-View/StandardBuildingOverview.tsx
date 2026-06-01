"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Ruler, Layers, Bookmark, FileCheck } from 'lucide-react';
import { Card } from '@/components/common';
import { useTranslations } from 'next-intl';

import type { MunicipalAsset } from '@/components/modules/assets/municipal-Asset/data/municipalAssets';
import type { BuildingDataFields } from '@/types/asset-types/asset-detail-view-types/asset-detail-view-types';

const MotionCard = motion.create(Card);

interface StandardBuildingOverviewProps {
  asset: MunicipalAsset;
  detailedData: BuildingDataFields | null | undefined;
}

export function StandardBuildingOverview({
  asset,
  detailedData
}: StandardBuildingOverviewProps): React.JSX.Element {
  const t = useTranslations('municipalAsset');
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

  const totalRooms = asset.totalRooms || detailedData?.totalRooms || detailedData?.numberOfRooms || '-';
  const floors = asset.floors?.toString() || asset.totalFloors?.toString() || detailedData?.numberOfFloors?.toString() || '-';
  const sectionsLength = detailedData?.floorSections?.length || 0;

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
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 px-3 py-2.5">
          <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-600" />
            {t('summaryView.basicInfo')}
          </h3>
        </div>
        <div className="px-3 py-3">
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
        </div>
      </MotionCard>

      {/* Comprehensive Details Panel */}
      <MotionCard
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
        padding="none"
      >
        {/* Property & Registration Details Section */}
        <div className="border-b border-slate-200">
          <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 border-b border-emerald-200 px-3 py-2">
            <h3 className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
              {t('overviewTab.propertyRegistration')}
            </h3>
          </div>
          <div className="px-3 py-2">
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
              <div className="flex justify-between items-start">
                <span className="text-xs text-gray-600">{t('overviewTab.propertyNo')}</span>
                <span className="text-xs text-slate-800 font-medium">{asset.propertyNumber || detailedData?.propertyNumber || asset.legacyId || '-'}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-xs text-gray-600">{t('overviewTab.ward')}</span>
                <span className="text-xs text-slate-800 font-medium">{asset.wardNumber || detailedData?.wardNumber?.split('-')[0] || '-'}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-xs text-gray-600">{t('overviewTab.zone')}</span>
                <span className="text-xs text-slate-800 font-medium">{asset.zone || '-'}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-xs text-gray-600">{t('overviewTab.ownerId')}</span>
                <span className="text-xs text-slate-800 font-medium">{asset.ownerId || '32105'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Property Details Section */}
        <div className="border-b border-slate-200">
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 border-b border-purple-200 px-3 py-2">
            <h3 className="text-xs font-bold text-purple-800 flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-purple-600" />
              {t('overviewTab.propertyDetails')}
            </h3>
          </div>
          <div className="px-3 py-2">
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
              <div className="flex justify-between items-start">
                <span className="text-xs text-gray-600">{t('overviewTab.surveyNo')}</span>
                <span className="text-xs text-slate-800 font-medium">{asset.surveyNumber || '-'}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-xs text-gray-600">{t('overviewTab.plotNo')}</span>
                <span className="text-xs text-slate-800 font-medium">{asset.plotNumber || '-'}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-xs text-gray-600">{t('overviewTab.city')}</span>
                <span className="text-xs text-slate-800 font-medium">{asset.city || 'Akola'}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-xs text-gray-600">{t('overviewTab.pincode')}</span>
                <span className="text-xs text-slate-800 font-medium">{asset.pincode || '-'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Area Measurements Section */}
        <div className="border-b border-slate-200">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 px-3 py-2">
            <h3 className="text-xs font-bold text-blue-800 flex items-center gap-1.5">
              <Ruler className="w-3.5 h-3.5 text-blue-600" />
              {t('overviewTab.areaMeasurements')}
            </h3>
          </div>
          <div className="px-3 py-2">
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
              <div className="flex justify-between items-start">
                <span className="text-xs text-gray-600">{t('overviewTab.plotArea')}</span>
                <span className="text-xs text-slate-800 font-semibold">
                  {detailedData?.plotAreaSqFt
                    ? `${detailedData.plotAreaSqFt.toLocaleString()} sq.ft`
                    : asset.area
                      ? `${parseFloat(asset.area).toLocaleString()} sq.m`
                      : '-'}
                </span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-xs text-gray-600">{t('overviewTab.builtUpArea')}</span>
                <span className="text-xs text-slate-800 font-medium">
                  {detailedData?.builtUpAreaSqFt
                    ? `${detailedData.builtUpAreaSqFt.toLocaleString()} sq.ft`
                    : asset.builtUpArea
                      ? `${parseFloat(asset.builtUpArea).toLocaleString()} sq.m`
                      : '-'}
                </span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-xs text-gray-600">{t('overviewTab.carpetArea')}</span>
                <span className="text-xs text-slate-800 font-medium">
                  {detailedData?.carpetAreaSqFt
                    ? `${detailedData.carpetAreaSqFt.toLocaleString()} sq.ft`
                    : asset.carpetArea
                      ? `${parseFloat(asset.carpetArea).toLocaleString()} sq.m`
                      : '-'}
                </span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-xs text-gray-600">{t('overviewTab.carpetAreaSqMtr')}</span>
                <span className="text-xs text-slate-800 font-medium">
                  {asset.plinthArea
                    ? `${parseFloat(asset.plinthArea).toLocaleString()} sq.m`
                    : '-'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Building Structure Section */}
        <div>
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200 px-3 py-2">
            <h3 className="text-xs font-bold text-orange-800 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-orange-600" />
              {t('overviewTab.buildingStructure')}
            </h3>
          </div>
          <div className="px-3 py-2">
            <div className="space-y-1.5">
              <div className="grid grid-cols-3 gap-x-2">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-600 mb-0.5">{t('overviewTab.totalRooms')}</span>
                  <span className="text-xs text-slate-800 font-semibold">{totalRooms}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-600 mb-0.5">{t('overviewTab.totalFloors')}</span>
                  <span className="text-xs text-slate-800 font-semibold">{floors}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-600 mb-0.5">{t('overviewTab.floorSections')}</span>
                  <span className="text-xs text-slate-800 font-semibold">
                    {sectionsLength > 0 ? t('overviewTab.floorSectionsCount', { count: sectionsLength }) : '-'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MotionCard>
    </motion.div>
  );
}
