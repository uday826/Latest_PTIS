"use client";

import { Card } from '@/components/common';
import type { AssetDetailController } from '@/types/asset-types/asset-detail-view-types/asset-detail-view-types';
import { AlertCircle, Bookmark, Calculator, CheckCircle2, FileText, IndianRupee, Info, Layers, Map, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';

export function AssetDetailSummaryBar({ controller }: { controller: AssetDetailController }): React.JSX.Element {
  const { asset } = controller;
  const t = useTranslations('municipalAsset');

  const naStr = t('statusBar.notAvailableShort');
  const formatRawValue = (value?: number | string | null): string => {
    if (value === null || value === undefined || value === '') return naStr;
    return String(value);
  };

  return (
    <Card className="flex-shrink-0 mx-4 mt-[16px] bg-[#F8FAFC] rounded-xl shadow-lg border-1 border-gray-300 hover:shadow-xl transition-shadow duration-300 pt-[4px] pr-[16px] pb-[0px] pl-[16px] px-[16px] py-[4px] mr-[16px] mb-[3px] ml-[16px]" padding="none">
      <div className="grid grid-cols-6 gap-3 mx-[0px] my-[3px]">
        {/* Asset ID */}
        <div className="bg-blue-50 rounded-lg border-2 border-blue-300 pt-[3px] pr-[8px] pb-[1px] pl-[8px] mx-[0px] my-[6px] shadow-sm">
          <p className="text-xs text-black mb-0.5 flex items-center gap-1 font-bold">
            <Info className="w-3 h-3" />
            {t('statusBar.assetId')}
          </p>
          <p className="text-sm text-black">{asset.id}</p>
        </div>

        {/* Zone */}
        <div className="bg-white rounded-lg border border-gray-300 pt-[3px] pr-[8px] pb-[1px] pl-[8px] mx-[0px] my-[6px]">
          <p className="text-xs text-black mb-0.5 flex items-center gap-1 font-bold">
            <Map className="w-3 h-3" />
            {t('statusBar.zone')}
          </p>
          <p className="text-sm text-black truncate" title={asset.zone}>{asset.zone}</p>
        </div>

        {/* Ward */}
        <div className="bg-white rounded-lg border border-gray-300 pt-[3px] pr-[8px] pb-[1px] pl-[8px] mx-[0px] my-[6px]">
          <p className="text-xs text-black mb-0.5 flex items-center gap-1 font-bold">
            <MapPin className="w-3 h-3" />
            {t('statusBar.ward')}
          </p>
          <p className="text-sm text-black">{asset.ward}</p>
        </div>

        {/* Property Tax No. */}
        <div className="bg-white rounded-lg border border-gray-300 pt-[3px] pr-[8px] pb-[1px] pl-[8px] mx-[0px] my-[6px]">
          <p className="text-xs text-black mb-0.5 flex items-center gap-1 font-bold">
            <FileText className="w-3 h-3" />
            {t('statusBar.propertyTaxNo')}
          </p>
          <p className="text-sm text-black">{asset.propertyTaxNumber || naStr}</p>
        </div>

        {/* UPIC ID */}
        <div className="bg-white rounded-lg border border-gray-300 pt-[3px] pr-[8px] pb-[1px] pl-[8px] mx-[0px] my-[6px]">
          <p className="text-xs text-black mb-0.5 flex items-center gap-1 font-bold">
            <Bookmark className="w-3 h-3" />
            {t('statusBar.upicId')}
          </p>
          <p className="text-sm text-black">{asset.upicId || naStr}</p>
        </div>

        {/* Plot Number */}
        <div className="bg-white rounded-lg border border-gray-300 pt-[3px] pr-[8px] pb-[1px] pl-[8px] mx-[0px] my-[6px]">
          <p className="text-xs text-black mb-0.5 flex items-center gap-1 font-bold">
            <Layers className="w-3 h-3" />
            {t('statusBar.plotNumber')}
          </p>
          <p className="text-sm text-black">{asset.plotNumber || naStr}</p>
        </div>

        {/* Value */}
        <div className="bg-white rounded-lg border border-gray-300 pt-[3px] pr-[8px] pb-[1px] pl-[8px] mx-[0px] my-[6px]">
          <p className="text-xs text-black mb-0.5 flex items-center gap-1 font-bold">
            <IndianRupee className="w-3 h-3" />
            {t('statusBar.value')}
          </p>
          <p className="text-sm text-black">{formatRawValue(asset.curVal)}</p>
        </div>

        {/* Rent Collection KPIs - For Municipal Commercial Complex */}
        {asset.assetType === 'Municipal Commercial Complex' && asset.totalShops ? (
          <div className="contents">
            <div className="bg-white rounded-lg border border-gray-300 pt-[3px] pr-[8px] pb-[1px] pl-[8px] mx-[0px] my-[6px]">
              <p className="text-xs text-black mb-0.5 flex items-center gap-1 font-bold">
                <Calculator className="w-3 h-3" />
                {t('statusBar.totalDemand')}
              </p>
              <p className="text-sm text-black">{formatRawValue(asset.totalDemand)}</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-300 pt-[3px] pr-[8px] pb-[1px] pl-[8px] mx-[0px] my-[6px]">
              <p className="text-xs text-black mb-0.5 flex items-center gap-1 font-bold">
                <CheckCircle2 className="w-3 h-3" />
                {t('statusBar.totalCollection')}
              </p>
              <p className="text-sm text-black">{formatRawValue(asset.totalCollection)}</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-300 pt-[3px] pr-[8px] pb-[1px] pl-[8px] mx-[0px] my-[6px]">
              <p className="text-xs text-black mb-0.5 flex items-center gap-1 font-bold">
                <AlertCircle className="w-3 h-3" />
                {t('statusBar.totalPending')}
              </p>
              <p className="text-sm text-black">{formatRawValue(asset.totalPending)}</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-300 pt-[3px] pr-[8px] pb-[1px] pl-[8px] mx-[0px] my-[6px]">
              <p className="text-xs text-black mb-0.5 flex items-center gap-1 font-bold">
                <IndianRupee className="w-3 h-3" />
                {t('statusBar.annualRent')}
              </p>
              <p className="text-sm text-black">{formatRawValue(asset.annualRent)}</p>
            </div>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
