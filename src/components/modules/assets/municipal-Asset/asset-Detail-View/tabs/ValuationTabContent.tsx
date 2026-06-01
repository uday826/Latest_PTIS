"use client";

import React from 'react';
import { Home } from 'lucide-react';
import { motion } from 'motion/react';
import { useLocale, useTranslations } from 'next-intl';
import { Badge, Table } from '@/components/common';
import { useValuationTabContent } from '@/hooks/asset-hooks/asset-detail-view-hooks/useValuationTabContent';
import type { AssetDetailController, ValuationFloorRow, FloorSourceRow } from '@/types/asset-types/asset-detail-view-types/asset-detail-view-types';
import type { TableColumn } from '@/types/common.types';

export function ValuationTabContent({ controller }: { controller: AssetDetailController }): React.JSX.Element {
  const t = useTranslations('municipalAsset');
  const locale = useLocale();
  const { floors, buildingCapitalValue } = useValuationTabContent(controller);
  const naStr = t('statusBar.notAvailableShort');

  const tableData = React.useMemo<ValuationFloorRow[]>(
    () =>
      (floors as FloorSourceRow[]).map((floor, index) => ({
        id: String(index),
        floor: floor.floor || naStr,
        constructionYear: floor.constructionYear || naStr,
        assessmentYear: floor.assessmentYear || naStr,
        constructionType: floor.constructionType || naStr,
        natureTypeBuilding: floor.natureTypeBuilding || naStr,
        subtype: floor.subtype || naStr,
        noOfRooms: floor.noOfRooms || '0',
        carpetArea: `${floor.carpetAreaSqFt ? parseFloat(floor.carpetAreaSqFt).toLocaleString(locale, { minimumFractionDigits: 2 }) : '0.00'} / ${floor.carpetAreaSqM ? parseFloat(floor.carpetAreaSqM).toLocaleString(locale, { minimumFractionDigits: 2 }) : '0.00'}`,
        builtUpArea: `${floor.builtUpAreaSqFt ? parseFloat(floor.builtUpAreaSqFt).toLocaleString(locale, { minimumFractionDigits: 2 }) : '0.00'} / ${floor.builtUpAreaSqM ? parseFloat(floor.builtUpAreaSqM).toLocaleString(locale, { minimumFractionDigits: 2 }) : '0.00'}`,
        sdrr: floor.sdrr || '0',
        baseValue: floor.baseValue || 0,
        floorFactorValue: floor.floorFactorValue || '0.00',
        ageFactorValue: floor.ageFactorValue || '0.00',
        ntbFactorValue: floor.ntbFactorValue || '0.00',
        useFactorValue: floor.useFactorValue || '0.00',
        finalCapitalValue: floor.finalCapitalValue || 0
      })),
    [floors, locale, naStr]
  );

  const columns = React.useMemo<TableColumn<ValuationFloorRow>[]>(
    () => [
      {
        key: 'floor',
        label: t('valuationTab.columns.floor'),
        render: (_value, row): React.JSX.Element => (
          <div className="flex items-center gap-1">
            <Home className="w-3.5 h-3.5 text-blue-700" />
            <span className="font-extrabold text-xs text-slate-900">{row.floor}</span>
          </div>
        )
      },
      { key: 'constructionYear', label: t('valuationTab.columns.constructionYear') },
      { key: 'assessmentYear', label: t('valuationTab.columns.assessmentYear') },
      {
        key: 'constructionType',
        label: t('valuationTab.columns.constructionType'),
        render: (_value, row): React.JSX.Element => (
          <Badge variant="default" size="sm" className="bg-teal-100 text-teal-800 border-transparent whitespace-nowrap">
            {row.constructionType}
          </Badge>
        )
      },
      {
        key: 'natureTypeBuilding',
        label: t('valuationTab.columns.use'),
        render: (_value, row): React.JSX.Element => (
          <Badge variant="default" size="sm" className="bg-purple-100 text-purple-800 border-transparent whitespace-nowrap">
            {row.natureTypeBuilding}
          </Badge>
        )
      },
      {
        key: 'subtype',
        label: t('valuationTab.columns.subTypeOfUse'),
        render: (_value, row): React.JSX.Element => (
          <Badge variant="default" size="sm" className="bg-indigo-100 text-indigo-800 border-transparent whitespace-nowrap">
            {row.subtype}
          </Badge>
        )
      },
      { key: 'noOfRooms', label: t('valuationTab.columns.rooms') },
      { key: 'carpetArea', label: t('valuationTab.columns.carpetArea') },
      { key: 'builtUpArea', label: t('valuationTab.columns.builtUpArea') },
      { key: 'sdrr', label: t('valuationTab.columns.sdrr') },
      {
        key: 'baseValue',
        label: t('valuationTab.columns.baseValue'),
        render: (_value, row): React.ReactNode => row.baseValue.toLocaleString(locale, { minimumFractionDigits: 0 })
      },
      { key: 'floorFactorValue', label: t('valuationTab.columns.floorFactor'), render: (_value, row): React.ReactNode => row.floorFactorValue },
      { key: 'ageFactorValue', label: t('valuationTab.columns.ageFactor'), render: (_value, row): React.ReactNode => row.ageFactorValue },
      { key: 'ntbFactorValue', label: t('valuationTab.columns.ntbFactor'), render: (_value, row): React.ReactNode => row.ntbFactorValue },
      { key: 'useFactorValue', label: t('valuationTab.columns.useFactor'), render: (_value, row): React.ReactNode => row.useFactorValue },
      {
        key: 'finalCapitalValue',
        label: t('valuationTab.columns.capitalValue'),
        render: (_value, row): React.JSX.Element => (
          <span className="font-bold whitespace-nowrap">
            &#8377; {row.finalCapitalValue.toLocaleString(locale, { minimumFractionDigits: 2 })}
          </span>
        )
      }
    ],
    [locale, t]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="px-3 py-4 overflow-y-auto max-h-[calc(64vh-100px)]"
    >
      <div className="
        border border-gray-300 rounded-lg overflow-x-auto shadow-sm
        [&_table]:w-full [&_table]:border-collapse [&_table]:min-w-[1500px]
        [&_thead]:sticky [&_thead]:top-0 [&_thead]:z-10
        [&_thead_tr]:bg-[#E6F2FF]
        [&_th]:border [&_th]:border-gray-300 [&_th]:py-3 [&_th]:px-1 [&_th]:text-[11px] [&_th]:font-bold [&_th]:text-slate-800 [&_th]:text-center
        [&_th:first-child]:pl-4 [&_th:first-child]:pr-4 [&_th:first-child]:text-left
        [&_tbody_tr]:bg-white [&_tbody_tr]:transition-colors
        hover:[&_tbody_tr]:bg-blue-50/70
        [&_td]:border [&_td]:border-gray-300 [&_td]:py-2.5 [&_td]:px-1 [&_td]:text-xs [&_td]:text-center [&_td]:whitespace-nowrap
        [&_td:first-child]:pl-4 [&_td:first-child]:pr-4 [&_td:first-child]:text-left [&_td:first-child]:bg-white
        [&_td:last-child]:bg-blue-50/30 [&_td:last-child]:font-extrabold
      ">
        <Table
          data={tableData}
          columns={columns}
          className="overflow-x-auto"
          emptyMessage={t('valuationTab.noConstructionDetails')}
        />

        {tableData.length > 0 && (
          <div className="sticky bottom-0 z-10">
            <div className="font-extrabold text-slate-900 bg-[#E6F2FF]">
              <div className="grid grid-cols-[1fr_auto] border border-gray-300">
                <div className="px-3 py-4 text-xs text-right border-r border-gray-300">
                  <span className="text-slate-900 font-extrabold text-xs uppercase tracking-wider">
                    {t('valuationTab.totalCapitalValue')}
                  </span>
                </div>
                <div className="px-3 py-4 text-sm text-right bg-blue-100/50 whitespace-nowrap">
                  <span className="text-base font-black text-blue-900 whitespace-nowrap font-mono">
                    &#8377; {buildingCapitalValue.toLocaleString(locale, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
