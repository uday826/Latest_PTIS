"use client";

import React from 'react';
import { Info, Scale, IndianRupee, FileText, Package } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Badge, Tabs } from '@/components/common';
import { OverviewTabContent } from './tabs/OverviewTabContent';
import { LegalPlanningTabContent } from './tabs/LegalPlanningTabContent';
import { ValuationTabContent } from './tabs/ValuationTabContent';
import { DocumentsTabContent } from './tabs/DocumentsTabContent';
import { FurnitureFixturesTabContent } from './tabs/FurnitureFixturesTabContent';
import type { AssetDetailController, AssetDetailTab } from '@/types/asset-types/asset-detail-view-types/asset-detail-view-types';

export function AssetDetailTabsLayout({ controller }: { controller: AssetDetailController }): React.JSX.Element {
  const { activeTab, setActiveTab, uploadedDocuments } = controller;
  const t = useTranslations('municipalAsset');

  const tabs: Array<{ id: AssetDetailTab; name: string; icon: typeof Info; badge: number | null; color: string }> = [
    { id: 'overview', name: t('tabs.overview'), icon: Info, badge: null, color: 'blue' },
    { id: 'legal', name: t('tabs.legal'), icon: Scale, badge: null, color: 'purple' },
    { id: 'financial', name: t('tabs.valuation'), icon: IndianRupee, badge: null, color: 'green' },
    { id: 'documents', name: t('tabs.documents'), icon: FileText, badge: uploadedDocuments.length > 0 ? uploadedDocuments.length : null, color: 'amber' },
    { id: 'assets', name: t('tabs.furniture'), icon: Package, badge: null, color: 'teal' },
  ];

  return (
    <Tabs
      value={activeTab}
      onChange={(val) => setActiveTab(val as AssetDetailTab)}
      className="flex-1 mx-4 mb-4 mt-4 bg-[#F8FAFC] rounded-xl shadow-lg border border-municipal-primary/10 overflow-hidden flex flex-col min-h-0"
    >
      {/* Modern Tab Bar - Sticky */}
      <div className="sticky top-0 z-30 bg-white border-b-2 border-municipal-primary/10 shadow-sm">
        {/* Desktop Tabs - Hidden on Mobile */}
        <Tabs.TabList
          scrollable={true}
          className="hidden md:flex px-2 pt-2 overflow-x-auto scrollbar-thin scrollbar-thumb-municipal-primary/20 scrollbar-track-transparent border-0 rounded-none bg-[#E6F2FF]"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <Tabs.Tab
                key={tab.id}
                value={tab.id}
                className={`relative flex !flex-row !items-center gap-2 px-4 py-3 transition-all duration-200 ease-in-out whitespace-nowrap text-sm group border-0 rounded-none bg-transparent hover:bg-transparent ${
                  isActive ? 'hover:bg-transparent text-[#0F172B]' : 'hover:bg-municipal-pale/30 text-[#0F172B]/60'
                }`}
              >
                <span className="flex flex-row items-center gap-2">
                  {/* Icon with color coding */}
                  <Icon className={`w-4 h-4 transition-all ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />

                  {/* Tab Name */}
                  <span className={isActive ? 'font-semibold' : 'font-medium'}>
                    {tab.name}
                  </span>

                  {/* Badge for counts/alerts */}
                  {tab.badge && (
                    <Badge
                      variant={isActive ? "default" : "secondary"}
                      size="sm"
                      className={`ml-1 px-1.5 py-0.5 text-xs rounded-full flex items-center justify-center min-w-[20px] h-auto min-h-0 border-transparent ${
                        isActive ? 'bg-municipal-primary text-white' : 'bg-municipal-primary/20 text-municipal-primary'
                      }`}
                    >
                      {tab.badge}
                    </Badge>
                  )}
                </span>

                {/* Active Tab Indicator - Animated Underline */}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-municipal-primary"></div>
                )}

                {/* Hover Effect - Top Border */}
                {!isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-municipal-primary/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></div>
                )}
              </Tabs.Tab>
            );
          })}
        </Tabs.TabList>
      </div>

      {/* Tab Content with Smooth Transition */}
      <div className="p-4 mb-3 relative flex-1 overflow-y-auto transition-opacity duration-200 ease-in-out scrollbar-hide">
        <Tabs.TabPanel value="overview" className="mt-0">
          <OverviewTabContent controller={controller} />
        </Tabs.TabPanel>
        <Tabs.TabPanel value="legal" className="mt-0">
          <LegalPlanningTabContent controller={controller} />
        </Tabs.TabPanel>
        <Tabs.TabPanel value="financial" className="mt-0">
          <ValuationTabContent controller={controller} />
        </Tabs.TabPanel>
        <Tabs.TabPanel value="documents" className="mt-0">
          <DocumentsTabContent controller={controller} />
        </Tabs.TabPanel>
        <Tabs.TabPanel value="assets" className="mt-0">
          <FurnitureFixturesTabContent controller={controller} />
        </Tabs.TabPanel>
      </div>
    </Tabs>
  );
}
