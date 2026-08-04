"use client";

import React, { useState } from 'react';
import { 
  ChevronDown, 
  SlidersHorizontal,
  Download,
  Layers,
  Maximize2,
  Minimize2
} from 'lucide-react';
import ActionViews from '../Design/ActionViews';

// Sub-components & Mock Data
import { initialWings, WingDetails } from './mockData';
import PropertyDetailsCard from './PropertyDetailsCard';
import PerformanceSummaryCard from './PerformanceSummaryCard';
import VerificationBadges from './VerificationBadges';
import WingSummary from './WingSummary';
import AddWingModal from './AddWingModal';
import ComparisonTable from './ComparisonTable';
import BottomMetrics from './BottomMetrics';
import RightPanel from './RightPanel';
import WingMetricDetailsPopup from './WingMetricDetailsPopup';
import ChangeDetectionBox from '../shared/ChangeDetectionBox';

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg cursor-pointer transition select-none ${
        active 
          ? 'bg-[#1e2b58] text-white' 
          : 'hover:bg-gray-100 text-gray-500'
      }`}
    >
      {label}
    </button>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5 leading-none">
      <div className={`w-2 h-2 rounded-full ${color}`}></div>
      <span>{label}</span>
    </div>
  );
}

export default function ApartmentContent({
  activeAction,
  setActiveAction,
  role = 'surveyor'
}: {
  activeAction?: string | null;
  setActiveAction?: (action: string | null) => void;
  role?: 'surveyor' | 'qc' | 'final';
}) {
  const [activeTab, setActiveTab] = useState('floor-comparison');
  const [selectedWing, setSelectedWing] = useState('B Wing (19)');
  const [selectedFloor, setSelectedFloor] = useState('All Floors');
  const [areaPolicyThreshold, setAreaPolicyThreshold] = useState<string>('all');
  const [diffFilter, setDiffFilter] = useState<string>('all');
  const [isDashboardExpanded, setIsDashboardExpanded] = useState<boolean>(false);
  const [copiedUpic, setCopiedUpic] = useState(false);

  // States for right column media preview & hover zoom
  const [hoveredImg, setHoveredImg] = useState<string | null>(null);
  const [hoverPosition, setHoverPosition] = useState<'left' | 'right'>('left');
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [selectedImgTitle, setSelectedImgTitle] = useState<string | null>(null);

  // Wing state array and interactive metric states
  const [wings, setWings] = useState<WingDetails[]>(initialWings);
  const [activeMetrics, setActiveMetrics] = useState<Record<string, 'discount' | 'exemptions' | 'rvImpact'>>({
    A: 'discount', B: 'discount', C: 'discount', D: 'discount'
  });
  const [popupData, setPopupData] = useState<any | null>(null);
  const [addWingModalOpen, setAddWingModalOpen] = useState(false);
  const summaryRef = React.useRef<HTMLDivElement>(null);

  const handleMetricClick = (e: React.MouseEvent<HTMLButtonElement>, wing: WingDetails, metricType: 'discount' | 'exemptions' | 'rvImpact') => {
    e.stopPropagation();
    
    setActiveMetrics(prev => ({
      ...prev,
      [wing.id]: metricType
    }));

    if (summaryRef.current) {
      const rect = summaryRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      
      setPopupData({
        top: clickY - 140,
        left: Math.max(10, Math.min(clickX - 147, rect.width - 315)),
        type: metricType,
        wing
      });
    }
  };

  const handleDeleteWing = (e: React.MouseEvent<HTMLButtonElement>, wingId: string) => {
    e.stopPropagation();
    setWings(prev => prev.filter(w => w.id !== wingId));
    if (popupData && popupData.wing.id === wingId) {
      setPopupData(null);
    }
  };

  const handleHoverImage = (imgUrl: string | null, position: 'left' | 'right' = 'left') => {
    setHoveredImg(imgUrl);
    setHoverPosition(position);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUpic(true);
    setTimeout(() => setCopiedUpic(false), 2000);
  };

  if (activeAction && setActiveAction) {
    return (
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
        <ActionViews activeAction={activeAction} setActiveAction={setActiveAction} />
      </div>
    );
  }

  return (
    <div className="flex-grow flex-1 min-h-0 bg-[#f0f2f5] p-2.5 font-sans text-gray-855 animate-fadeIn relative flex flex-col h-full overflow-hidden">
      {/* 1. Header Overview Sections */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 w-full shrink-0 mb-2.5">
        <PropertyDetailsCard 
          copiedUpic={copiedUpic}
          onCopyUpic={copyToClipboard}
          onHoverImage={handleHoverImage}
          onSelectImage={(url, title) => {
            setSelectedImg(url);
            setSelectedImgTitle(title);
          }}
        />
         <PerformanceSummaryCard role={role} />
      </div>



      {/* Main Split Layout Grid */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch flex-1 min-h-0 w-full overflow-hidden">
        {/* Left Column: Wing Summary, Table, Metrics */}
        <div className="flex-grow flex-1 flex flex-col gap-3 min-h-0 w-full lg:w-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pr-1.5">
          {/* Verification Badges Row - same width as Wing Summary */}
          <VerificationBadges />

          <WingSummary 
            summaryRef={summaryRef}
            wings={wings}
            activeMetrics={activeMetrics}
            handleMetricClick={handleMetricClick}
            handleDeleteWing={handleDeleteWing}
            onAddWingClick={() => setAddWingModalOpen(true)}
            onWingCardClick={(wingName) => {
              let val = "All Wings";
              if (wingName.includes("A")) val = "A Wing (19)";
              else if (wingName.includes("B")) val = "B Wing (19)";
              else if (wingName.includes("C")) val = "C Wing (15)";
              else if (wingName.includes("D")) val = "D Wing (14)";
              setSelectedWing(val);
            }}
          />

          {/* Tabs & Sub-Filter Bar */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm mb-1 shrink-0">
            <div className="flex flex-wrap items-center justify-between border-b border-gray-150 px-4 py-2 gap-2">
              <div className="flex flex-wrap gap-1 text-[11px] font-extrabold text-gray-550">
                <TabButton label="Wing Overview" active={activeTab === 'wing-overview'} onClick={() => setActiveTab('wing-overview')} />
                <TabButton label="Floor / Unit Comparison" active={activeTab === 'floor-comparison'} onClick={() => setActiveTab('floor-comparison')} />
                <TabButton label="Headwise Tax Comparison" active={activeTab === 'tax-comparison'} onClick={() => setActiveTab('tax-comparison')} />
                <TabButton label="Assessment Comparison" active={activeTab === 'assessment-comparison'} onClick={() => setActiveTab('assessment-comparison')} />
                <TabButton label="Society Details" active={activeTab === 'society-details'} onClick={() => setActiveTab('society-details')} />
                <TabButton label="Documents" active={activeTab === 'documents'} onClick={() => setActiveTab('documents')} />
                <TabButton label="Discount & Exemption" active={activeTab === 'discount-exemption'} onClick={() => setActiveTab('discount-exemption')} />
                <TabButton label="Reports" active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} />
                <TabButton label="Old Details" active={activeTab === 'old-details'} onClick={() => setActiveTab('old-details')} />
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#edf2ff] text-[#3b82f6] rounded-lg text-[10px] font-extrabold border border-[#3b82f6]/10 hover:bg-[#dbeafe] transition cursor-pointer" type="button">
                <Layers size={12} />
                <span>Comparison Summary</span>
              </button>
            </div>

            <div className="flex flex-col gap-2.5 p-3 bg-gray-50/50 rounded-b-xl border-t border-gray-150">
              {/* Row 1: Filters on Left, Actions on Right */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 w-full">
                {/* 4 Dropdowns in one line */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[9.5px] text-slate-600 font-extrabold uppercase whitespace-nowrap">Select Wing</span>
                    <div className="relative">
                      <select 
                        value={selectedWing} 
                        onChange={(e) => setSelectedWing(e.target.value)}
                        className="appearance-none bg-white border border-gray-250 rounded-lg pl-2.5 pr-7 py-1 text-[10.5px] font-bold text-gray-700 outline-none focus:border-blue-500 cursor-pointer shadow-3xs"
                      >
                        <option value="All Wings">All Wings (67)</option>
                        <option>B Wing (19)</option>
                        <option>A Wing (19)</option>
                        <option>C Wing (15)</option>
                        <option>D Wing (14)</option>
                      </select>
                      <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[9.5px] text-slate-600 font-extrabold uppercase whitespace-nowrap">Select Floor</span>
                    <div className="relative">
                      <select 
                        value={selectedFloor} 
                        onChange={(e) => setSelectedFloor(e.target.value)}
                        className="appearance-none bg-white border border-gray-250 rounded-lg pl-2.5 pr-7 py-1 text-[10.5px] font-bold text-gray-700 outline-none focus:border-blue-500 cursor-pointer shadow-3xs"
                      >
                        <option>All Floors</option>
                        <option>Ground Floor</option>
                        <option>1st Floor</option>
                        <option>2nd Floor</option>
                      </select>
                      <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    </div>
                  </div>

                  {/* Policy Area Deviation Filter */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[9.5px] text-slate-600 font-extrabold uppercase whitespace-nowrap">Policy Area Δ</span>
                    <div className="relative">
                      <select 
                        value={areaPolicyThreshold} 
                        onChange={(e) => setAreaPolicyThreshold(e.target.value)}
                        className="appearance-none bg-white border border-gray-250 rounded-lg pl-2.5 pr-7 py-1 text-[10.5px] font-bold text-gray-700 outline-none focus:border-blue-500 cursor-pointer shadow-3xs"
                      >
                        <option value="all">All Deviations</option>
                        <option value="5">&gt; 5% Area Diff</option>
                        <option value="10">&gt; 10% Area Diff</option>
                        <option value="20">&gt; 20% Area Diff</option>
                      </select>
                      <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    </div>
                  </div>

                  {/* Diff Category Filter */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[9.5px] text-slate-600 font-extrabold uppercase whitespace-nowrap">Filter Diff</span>
                    <div className="relative">
                      <select 
                        value={diffFilter} 
                        onChange={(e) => setDiffFilter(e.target.value)}
                        className="appearance-none bg-white border border-gray-250 rounded-lg pl-2.5 pr-7 py-1 text-[10.5px] font-bold text-gray-700 outline-none focus:border-blue-500 cursor-pointer shadow-3xs"
                      >
                        <option value="all">All Differences</option>
                        <option value="carpet">Carpet Diff Only</option>
                        <option value="bua">BUA Diff Only</option>
                        <option value="rv">RV Diff Only</option>
                        <option value="tax">Tax Diff Only</option>
                      </select>
                      <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Actions on Right */}
                <div className="flex items-center gap-2 select-none shrink-0 lg:ml-auto">
                  <button className="flex items-center gap-1.5 px-3 py-1 border border-gray-255 bg-white rounded-lg text-[10px] font-extrabold text-gray-700 hover:bg-gray-50 cursor-pointer" type="button">
                    <SlidersHorizontal size={12} />
                    <span>Filters</span>
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1 border border-gray-255 bg-white rounded-lg text-[10px] font-extrabold text-gray-700 hover:bg-gray-50 cursor-pointer" type="button">
                    <Download size={12} />
                    <span>Export</span>
                  </button>
                  <button 
                    onClick={() => setIsDashboardExpanded(!isDashboardExpanded)}
                    className="flex items-center gap-1.5 px-3 py-1 border border-[#3b82f6]/20 bg-[#edf2ff] rounded-lg text-[10px] font-extrabold text-[#3b82f6] hover:bg-[#dbeafe] cursor-pointer" 
                    type="button"
                  >
                    {isDashboardExpanded ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
                    <span>{isDashboardExpanded ? 'Collapse' : 'Expand'}</span>
                  </button>
                </div>
              </div>

              {/* Row 2: Legend Indicators in one line */}
              <div className="flex items-center gap-x-4 border-t border-gray-200/60 pt-2 text-[9px] font-extrabold text-slate-700 uppercase tracking-wide select-none whitespace-nowrap overflow-x-auto no-scrollbar w-full">
                <LegendItem color="bg-green-500" label="Matched" />
                <LegendItem color="bg-amber-500" label="Modified" />
                <LegendItem color="bg-blue-500" label="New" />
                <LegendItem color="bg-red-500" label="Missing" />
                <LegendItem color="bg-purple-500" label="Eligible for Discount" />
                <LegendItem color="bg-teal-500" label="Exempted" />
              </div>
            </div>
          </div>

          <ComparisonTable 
            selectedWing={selectedWing} 
            selectedFloor={selectedFloor}
            areaPolicyThreshold={areaPolicyThreshold}
            diffFilter={diffFilter}
            activeTab={activeTab}
          />
          <BottomMetrics />
        </div>
        
        {!isDashboardExpanded && (
          <RightPanel 
            onHoverImage={handleHoverImage}
            onSelectImage={(url, title) => {
              setSelectedImg(url);
              setSelectedImgTitle(title);
            }}
            role={role}
          />
        )}
      </div>

      {/* Floating Hover Zoom Portal */}
      {hoveredImg && (
        <div className={`fixed z-50 w-96 bg-white border border-gray-300 rounded-xl shadow-2xl p-2.5 pointer-events-none animate-fadeIn flex flex-col gap-2 ${hoverPosition === 'left' ? 'right-[305px] top-[180px]' : 'left-[305px] top-[180px]'}`}>
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex justify-between">
            <span>Complete Zoom View</span>
            <span className="text-[#1e2b58] font-semibold text-[8px] bg-blue-50 px-1 py-0.25 rounded">Live Preview</span>
          </div>
          <div className="overflow-hidden rounded-lg border border-gray-100 bg-gray-50 h-72 w-full flex items-center justify-center">
            <img src={hoveredImg} className="w-full h-full object-contain" alt="Complete Zoom" />
          </div>
        </div>
      )}

      {/* Enlarged Lightbox Modal */}
      {selectedImg && (
        <div
          onClick={() => setSelectedImg(null)}
          className="fixed inset-0 bg-black/75 flex items-center justify-center z-[999] cursor-zoom-out animate-fadeIn font-sans"
        >
          <div className="relative max-w-4xl max-h-[88vh] p-3.5 bg-white rounded-xl shadow-2xl cursor-default" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-gray-150">
              <span className="font-extrabold text-[#002fbe] text-[10.5px] uppercase tracking-wider">
                {selectedImgTitle || 'Enlarged Preview'}
              </span>
              <button 
                onClick={() => setSelectedImg(null)}
                className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 font-extrabold text-[13px] cursor-pointer"
              >
                ×
              </button>
            </div>
            
            {selectedImg === 'change-detection' ? (
              <div className="w-[600px] h-[360px] relative overflow-hidden rounded-lg border border-gray-200">
                <ChangeDetectionBox 
                  title="Change Detection (Enlarged)" 
                  beforeImg="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop" 
                  afterImg="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop" 
                  beforeImgZoom="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop"
                  afterImgZoom="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop"
                  onHover={() => {}}
                  onZoom={() => {}}
                  isEnlarged
                />
              </div>
            ) : (
              <img src={selectedImg} alt="Large Preview" className="max-w-full max-h-[75vh] rounded-lg object-contain animate-scaleIn" />
            )}
            <div className="text-center text-xs text-gray-400 mt-2.5 font-medium select-none">Click outside or press Escape to close</div>
          </div>
        </div>
      )}

      {/* Add Wing Modal Component */}
      <AddWingModal 
        isOpen={addWingModalOpen}
        onClose={() => setAddWingModalOpen(false)}
        wings={wings}
        onAddWing={(newWing) => setWings(prev => [...prev, newWing])}
      />

      {/* popupData details popover */}
      <WingMetricDetailsPopup 
        popupData={popupData}
        onClose={() => setPopupData(null)}
      />
    </div>
  );
}
