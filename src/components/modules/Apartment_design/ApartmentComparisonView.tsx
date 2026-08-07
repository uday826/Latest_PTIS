import React from 'react';
import { SlidersHorizontal, Download, Maximize2, Minimize2 } from 'lucide-react';
import { Tabs, TabList, Tab, Select, Button } from '@/components/common';
import ComparisonTable from './ComparisonTable';

interface ApartmentComparisonViewProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedWing: string;
  setSelectedWing: (wing: string) => void;
  selectedFloor: string;
  setSelectedFloor: (floor: string) => void;
  areaPolicyThreshold: string;
  setAreaPolicyThreshold: (threshold: string) => void;
  diffFilter: string;
  setDiffFilter: (filter: string) => void;
  comparisonTableRef: React.RefObject<HTMLDivElement | null>;
  isDashboardExpanded: boolean;
  setIsDashboardExpanded: (expanded: boolean) => void;
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1 leading-none shrink-0">
      <div className={`w-1.5 h-1.5 rounded-full ${color} shrink-0`}></div>
      <span className="text-[8px] text-slate-700 font-extrabold uppercase tracking-wide whitespace-nowrap">{label}</span>
    </div>
  );
}

export default function ApartmentComparisonView({
  activeTab,
  setActiveTab,
  selectedWing,
  setSelectedWing,
  selectedFloor,
  setSelectedFloor,
  areaPolicyThreshold,
  setAreaPolicyThreshold,
  diffFilter,
  setDiffFilter,
  comparisonTableRef,
  isDashboardExpanded,
  setIsDashboardExpanded
}: ApartmentComparisonViewProps) {
  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm mb-1 shrink-0" ref={comparisonTableRef}>
        <div className="flex flex-wrap items-center justify-between border-b border-gray-150 px-4 py-2 gap-2 bg-white rounded-t-xl">
          <Tabs 
            value={activeTab} 
            onChange={(val) => setActiveTab(val as string)} 
            variant="pills" 
            size="sm"
            activeTabClassName="bg-[#111c44] text-white font-extrabold"
          >
            <TabList>
              <Tab value="wing-overview">Wing Overview</Tab>
              <Tab value="floor-comparison">Floor / Unit Comparison</Tab>
              <Tab value="tax-comparison">Headwise Tax Comparison</Tab>
              <Tab value="assessment-comparison">Assessment Comparison</Tab>
              <Tab value="discount-exemption">Discount & Exemption</Tab>
              <Tab value="reports">Reports</Tab>
              <Tab value="old-details">Old Details</Tab>
            </TabList>
          </Tabs>
        </div>
        {activeTab === 'floor-comparison' && (
          <div className="flex flex-col gap-2.5 p-3 bg-gray-50/50 rounded-b-xl border-t border-gray-150">
            {/* Row 1: Filters on Left, Actions on Right */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 w-full">
              {/* 4 Dropdowns in one line */}
              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                <div className="flex items-center gap-1 shrink-0 text-slate-700">
                  <span className="text-[8.5px] text-slate-600 font-extrabold uppercase whitespace-nowrap">Select Wing</span>
                  <Select 
                    value={selectedWing} 
                    onChange={(e, val) => setSelectedWing(val)}
                    options={[
                      { label: 'All Wings (67)', value: 'All Wings' },
                      { label: 'B Wing (19)', value: 'B Wing (19)' },
                      { label: 'A Wing (19)', value: 'A Wing (19)' },
                      { label: 'C Wing (15)', value: 'C Wing (15)' },
                      { label: 'D Wing (14)', value: 'D Wing (14)' },
                    ]}
                    selectSize="sm"
                    className="w-[115px] [&>button]:rounded-full [&>button]:h-[22px] [&>button]:px-2.5 [&>button]:py-0 [&>button]:border-slate-400 [&>button_span]:text-[10px] [&>button_span]:font-bold [&>button_svg]:w-3 [&>button_svg]:h-3 [&>button_svg]:ml-0.5 [&>ul]:min-w-[140px]"
                  />
                </div>

                <div className="flex items-center gap-1 shrink-0 text-slate-700">
                  <span className="text-[8.5px] text-slate-600 font-extrabold uppercase whitespace-nowrap">Select Floor</span>
                  <Select 
                    value={selectedFloor} 
                    onChange={(e, val) => setSelectedFloor(val)}
                    options={[
                      { label: 'All Floors', value: 'All Floors' },
                      { label: 'Ground Floor', value: 'Ground Floor' },
                      { label: '1st Floor', value: '1st Floor' },
                      { label: '2nd Floor', value: '2nd Floor' },
                    ]}
                    selectSize="sm"
                    className="w-[95px] [&>button]:rounded-full [&>button]:h-[22px] [&>button]:px-2.5 [&>button]:py-0 [&>button]:border-slate-400 [&>button_span]:text-[10px] [&>button_span]:font-bold [&>button_svg]:w-3 [&>button_svg]:h-3 [&>button_svg]:ml-0.5 [&>ul]:min-w-[130px]"
                  />
                </div>

                {/* Policy Area Deviation Filter */}
                <div className="flex items-center gap-1 shrink-0 text-slate-700">
                  <span className="text-[8.5px] text-slate-600 font-extrabold uppercase whitespace-nowrap">Policy Area Δ</span>
                  <Select 
                    value={areaPolicyThreshold} 
                    onChange={(e, val) => setAreaPolicyThreshold(val)}
                    options={[
                      { label: 'All Deviations', value: 'all' },
                      { label: '> 5% Area Diff', value: '5' },
                      { label: '> 10% Area Diff', value: '10' },
                      { label: '> 20% Area Diff', value: '20' },
                    ]}
                    selectSize="sm"
                    className="w-[115px] [&>button]:rounded-full [&>button]:h-[22px] [&>button]:px-2.5 [&>button]:py-0 [&>button]:border-slate-400 [&>button_span]:text-[10px] [&>button_span]:font-bold [&>button_svg]:w-3 [&>button_svg]:h-3 [&>button_svg]:ml-0.5 [&>ul]:min-w-[140px]"
                  />
                </div>

                {/* Diff Category Filter */}
                <div className="flex items-center gap-1 shrink-0 text-slate-700">
                  <span className="text-[8.5px] text-slate-600 font-extrabold uppercase whitespace-nowrap">Filter Diff</span>
                  <Select 
                    value={diffFilter} 
                    onChange={(e, val) => setDiffFilter(val)}
                    options={[
                      { label: 'All Differences', value: 'all' },
                      { label: 'Carpet Diff Only', value: 'carpet' },
                      { label: 'BUA Diff Only', value: 'bua' },
                      { label: 'RV Diff Only', value: 'rv' },
                      { label: 'Tax Diff Only', value: 'tax' },
                    ]}
                    selectSize="sm"
                    className="w-[120px] [&>button]:rounded-full [&>button]:h-[22px] [&>button]:px-2.5 [&>button]:py-0 [&>button]:border-slate-400 [&>button_span]:text-[10px] [&>button_span]:font-bold [&>button_svg]:w-3 [&>button_svg]:h-3 [&>button_svg]:ml-0.5 [&>ul]:min-w-[150px]"
                  />
                </div>

                {/* Legend Items */}
                <div className="h-3.5 w-px bg-gray-250 mx-1 shrink-0 hidden xl:block" />
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 select-none">
                  <LegendItem color="bg-green-500" label="Matched" />
                  <LegendItem color="bg-amber-500" label="Modified" />
                  <LegendItem color="bg-blue-500" label="New" />
                  <LegendItem color="bg-red-500" label="Missing" />
                  <LegendItem color="bg-purple-500" label="Eligible for Discount" />
                  <LegendItem color="bg-teal-500" label="Exempted" />
                </div>
              </div>

              {/* Actions on Right */}
              <div className="flex items-center gap-2 select-none shrink-0 lg:ml-auto">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={SlidersHorizontal}
                  className="text-[10px] font-extrabold h-7 border-gray-255 text-gray-700"
                >
                  Filters
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={Download}
                  className="text-[10px] font-extrabold h-7 border-gray-255 text-gray-700"
                >
                  Export
                </Button>
                <Button 
                  onClick={() => setIsDashboardExpanded(!isDashboardExpanded)}
                  className="flex items-center gap-1.5 px-3 py-1 border border-[#3b82f6]/20 bg-[#edf2ff] rounded-lg text-[10px] font-extrabold text-[#3b82f6] hover:bg-[#dbeafe] cursor-pointer h-7" 
                  variant="ghost"
                  icon={isDashboardExpanded ? Minimize2 : Maximize2}
                >
                  <span>{isDashboardExpanded ? 'Collapse' : 'Expand'}</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <ComparisonTable 
        selectedWing={selectedWing} 
        selectedFloor={selectedFloor}
        areaPolicyThreshold={areaPolicyThreshold}
        diffFilter={diffFilter}
        activeTab={activeTab}
      />
    </>
  );
}
