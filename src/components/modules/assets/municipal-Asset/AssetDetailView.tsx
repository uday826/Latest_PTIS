
'use client';

import { Button, Card, CardContent, Tabs } from '@/components/common';
import type { AssetDetailRecord, AssetDetailTabConfig, AssetDetailTabKey } from '@/types/municipal-asset/detail-tabs.types';
import {
  Armchair,
  ArrowLeft,
  BadgeIndianRupee,
  Building2,
  ClipboardList,
  Info,
  Layers,
  Map,
  MapPin,
  Search,
} from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import { DocumentsTab } from './detail-tabs/DocumentsTab';
import { FloorDetailsTab } from './detail-tabs/FloorDetailsTab';
import { FurnitureFixturesTab } from './detail-tabs/FurnitureFixturesTab';
import { OverviewTab } from './detail-tabs/OverviewTab';
import { SubUnitsTab } from './detail-tabs/SubUnitsTab';

interface AssetDetailProps {
  asset: AssetDetailRecord;
  initialDocumentId?: string | null;
  initialTab?: string | null;
  tabs: AssetDetailTabConfig[];
}

function textOrBlank(value?: string | number | null) {
  return value === null || value === undefined || value === '' ? '' : String(value);
}


const TAB_ICONS: Record<AssetDetailTabKey, React.ElementType> = {
  overview: Info,
  'floor-details': Layers,
  'legal-planning': Info,
  valuation: BadgeIndianRupee,
  documents: ClipboardList,
  'sub-units': Building2,
  'furniture-fixtures': Armchair,
};

export function AssetDetailView({ asset, initialDocumentId, initialTab, tabs }: AssetDetailProps) {
  const visibleTabs = useMemo(
    () => (tabs.length > 0 ? tabs : [{ key: 'overview' as const, label: 'Overview' }]),
    [tabs]
  );
  const [activeTab, setActiveTab] = useState<AssetDetailTabKey>(() => {
    const initialKey = visibleTabs.find((tab) => tab.key === initialTab)?.key;
    return initialKey ?? visibleTabs[0].key;
  });
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const resolvedActiveTab = visibleTabs.some((tab) => tab.key === activeTab) ? activeTab : visibleTabs[0].key;

  const handleTabChange = (value: AssetDetailTabKey) => {
    setActiveTab(value);
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', value);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex h-full min-h-0 flex-col space-y-4 overflow-hidden bg-slate-50/50 animate-in fade-in duration-200">
      <Card variant="bordered" padding="none" className="rounded-t-xl shadow-sm">
        <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold leading-tight text-slate-900">{textOrBlank(asset.assetName)}</h1>
            <p className="truncate text-sm font-medium text-blue-500">
              {[asset.assetTypeName, asset.zoneName, asset.wardName].filter(Boolean).join(' - ')}
            </p>
          </div>
        </div>
      </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        <Card variant="default" padding="sm" className="group relative min-h-22 overflow-hidden border-blue-200 shadow-sm">
          <div className="absolute left-0 top-0 h-full w-1 bg-blue-500" />
          <p className="flex items-center gap-1 text-[10px] font-bold text-slate-500"><Info className="h-3 w-3 text-blue-500" /> Asset ID</p>
          <p className="mt-1 text-sm font-bold text-slate-800">{textOrBlank(asset.assetNo)}</p>
        </Card>
        <Card variant="default" padding="sm" className="min-h-22 border-slate-200 shadow-sm">
          <p className="flex items-center gap-1 text-[10px] font-bold text-slate-500"><Map className="h-3 w-3 text-blue-500" /> Zone</p>
          <p className="mt-1 text-sm font-bold text-slate-800">{textOrBlank(asset.zoneName)}</p>
        </Card>
        <Card variant="default" padding="sm" className="min-h-22 border-slate-200 shadow-sm">
          <p className="flex items-center gap-1 text-[10px] font-bold text-slate-500"><MapPin className="h-3 w-3 text-blue-500" /> Ward</p>
          <p className="mt-1 text-sm font-bold text-slate-800">{textOrBlank(asset.wardName)}</p>
        </Card>
        <Card variant="default" padding="sm" className="min-h-22 border-slate-200 shadow-sm">
          <p className="flex items-center gap-1 text-[10px] font-bold text-slate-500"><ClipboardList className="h-3 w-3 text-blue-500" /> Category</p>
          <p className="mt-1 text-sm font-bold text-slate-800">{textOrBlank(asset.assetCategoryName)}</p>
        </Card>
        <Card variant="default" padding="sm" className="min-h-22 border-slate-200 shadow-sm">
          <p className="flex items-center gap-1 text-[10px] font-bold text-slate-500"><Search className="h-3 w-3 text-blue-500" /> CSN</p>
          <p className="mt-1 text-sm font-bold text-slate-800">{textOrBlank(asset.csn)}</p>
        </Card>
      </div>

      <Card variant="bordered" padding="none" className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-t-xl border-b-0">
        <Tabs value={resolvedActiveTab} onChange={(value) => handleTabChange(value as AssetDetailTabKey)} variant="line" size="md" className="flex min-h-0 flex-1 flex-col">
          <CardContent className="border-b border-slate-200 px-4 pt-2">
            <Tabs.TabList scrollable className="gap-6">
              {visibleTabs.map((tab) => (
                <Tabs.Tab
                  key={tab.key}
                  value={tab.key}
                  icon={TAB_ICONS[tab.key]}
                  className="relative h-auto px-1 pb-3 pt-2 text-[13px] font-bold"
                >
                  {tab.label}
                </Tabs.Tab>
              ))}
            </Tabs.TabList>
          </CardContent>

          <CardContent className="custom-scrollbar min-h-0 flex-1 overflow-y-auto bg-white p-4 shadow-sm">
            <Tabs.TabPanel value="overview">
              <OverviewTab asset={asset} />
            </Tabs.TabPanel>
            <Tabs.TabPanel value="floor-details">
              <FloorDetailsTab asset={asset} />
            </Tabs.TabPanel>
            <Tabs.TabPanel value="documents">
              <DocumentsTab asset={asset} initialDocumentId={initialDocumentId} />
            </Tabs.TabPanel>
            <Tabs.TabPanel value="sub-units">
              <SubUnitsTab asset={asset} />
            </Tabs.TabPanel>
            <Tabs.TabPanel value="furniture-fixtures">
              <FurnitureFixturesTab asset={asset} />
            </Tabs.TabPanel>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
}

export type { AssetDetailRecord } from '@/types/municipal-asset/detail-tabs.types';
