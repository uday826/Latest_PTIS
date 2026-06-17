
'use client';

import type { AssetDetailRecord } from '@/types/municipal-asset/detail-tabs.types';
import { ClipboardList, Map } from 'lucide-react';
import { useTranslations } from 'next-intl';

function blank(value?: string | number | null) {
  return value === null || value === undefined || value === '' ? '-' : String(value);
}

function FieldCard({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-white p-3">
      <p className="mb-1 text-[10px] font-bold text-slate-500">{label}</p>
      <p className="break-words text-sm font-bold text-slate-800">{blank(value)}</p>
    </div>
  );
}

export function OverviewTab({ asset }: { asset: AssetDetailRecord }) {
  const t = useTranslations('assetDetail');

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/70 px-4 py-3">
          <ClipboardList className="h-4 w-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-800">{t('overviewTab.basicInfo')}</h3>
        </div>
        <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <FieldCard label={t('overviewTab.assetName')} value={asset.assetName} />
          <FieldCard label={t('overviewTab.assetNo')} value={asset.assetNo} />
          <FieldCard label={t('overviewTab.category')} value={asset.assetCategoryName} />
          <FieldCard label={t('overviewTab.type')} value={asset.assetTypeName} />
          <FieldCard label={t('overviewTab.ownershipType')} value={asset.ownershipType} />
          <FieldCard label={t('overviewTab.status')} value={asset.isActive === false ? t('overviewTab.inactive') : asset.status || t('overviewTab.active')} />
          <FieldCard label={t('overviewTab.condition')} value={asset.assetCondition} />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/70 px-4 py-3">
          <Map className="h-4 w-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-800">{t('overviewTab.location')}</h3>
        </div>
        <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <FieldCard label={t('overviewTab.zone')} value={asset.zoneName} />
          <FieldCard label={t('overviewTab.ward')} value={asset.wardName} />
          <FieldCard label={t('overviewTab.csn')} value={asset.csn} />
          <FieldCard label={t('overviewTab.latitude')} value={asset.latitude} />
          <FieldCard label={t('overviewTab.longitude')} value={asset.longitude} />
          <FieldCard label={t('overviewTab.address')} value={asset.address} />
        </div>
      </div>
    </div>
  );
}
