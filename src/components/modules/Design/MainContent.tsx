"use client";

import React, { useState, useEffect, useRef } from 'react';
import PropertySummary from './PropertySummary';
import {
  FolderOpen,
  UserCheck,
  Users,
  Building,
  Percent,
  History,
  Map,
  FileText,
  Wallet,
  Droplet,
  ShieldCheck,
  Briefcase,
  Link2
} from 'lucide-react';
import ActionViews from './ActionViews';
import { Tab, StatusBadge } from './DesignComponents';
import FloorComponentDetailsTable from './FloorComponentDetailsTable';
import TimelineAndMetricsRow from './TimelineAndMetricsRow';
import TaxesComparisonCard from './TaxesComparisonCard';
import BottomValidationPanel from './BottomValidationPanel';
import AiReportPopup from './AiReportPopup';
import TimelinePopup from './TimelinePopup';
import DesignRightPanel from './DesignRightPanel';

export default function MainContent({ 
  activeAction = null, 
  setActiveAction = () => {}, 
  activeValuationModel = 'rv' 
}: { 
  activeAction?: string | null; 
  setActiveAction?: (action: string | null) => void; 
  activeValuationModel?: 'rv' | 'cvm' | 'dual' 
} = {}) {
  const [activeTab, setActiveTab] = useState<'property' | 'kyc' | 'society' | 'building' | 'discount' | 'old'>('property');
  const [selectedTimelineStage, setSelectedTimelineStage] = useState<string | null>(null);
  const [timelinePopupOpen, setTimelinePopupOpen] = useState(false);
  const [popupPosition, setPopupPosition] = useState<{ top: number; left: number } | null>(null);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [timelineError, setTimelineError] = useState<string | null>(null);
  const hasRetriedApproval = useRef(false);

  // AI Property Inspector Popups
  const [aiReportPopupOpen, setAiReportPopupOpen] = useState(false);
  const [aiReportPopupPosition, setAiReportPopupPosition] = useState<{ top: number; left: number } | null>(null);
  const [aiReportLoading, setAiReportLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [activeSubTab, setActiveSubTab] = useState<'rateable' | 'capital' | 'dual' | 'reassessment'>('rateable');
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [hoveredImg, setHoveredImg] = useState<string | null>(null);
  const [hoverPosition, setHoverPosition] = useState<'left' | 'right'>('right');

  const handleViewReportClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    let left = rect.left + rect.width / 2 - 180;
    let top = rect.bottom + 8;
    const containerEl = containerRef.current;
    if (containerEl) {
      const containerRect = containerEl.getBoundingClientRect();
      left = rect.left - containerRect.left + rect.width / 2 - 180;
      top = rect.bottom - containerRect.top + 8;
      if (left < 16) left = 16;
      if (left + 360 > containerRect.width - 16) left = containerRect.width - 360 - 16;
      if (top + 285 > containerRect.height - 16) top = rect.top - containerRect.top - 285 - 8;
    }
    setAiReportPopupPosition({ top, left });
    setAiReportPopupOpen(true);
    setAiReportLoading(true);
    setTimeout(() => setAiReportLoading(false), 400);
  };

  const closeAiReport = () => {
    setAiReportPopupOpen(false);
  };

  const loadStageDetails = (stageId: string) => {
    setTimelineLoading(true);
    setTimelineError(null);
    if (stageId === 'approval' && !hasRetriedApproval.current) {
      setTimeout(() => {
        setTimelineLoading(false);
        setTimelineError('Unable to load stage details.');
      }, 400);
      return;
    }
    setTimeout(() => setTimelineLoading(false), 400);
  };

  const handleTimelineNodeClick = (stageId: string, event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    let left = rect.left + rect.width / 2 - 180;
    let top = rect.bottom + 8;
    const containerEl = containerRef.current;
    if (containerEl) {
      const containerRect = containerEl.getBoundingClientRect();
      left = rect.left - containerRect.left + rect.width / 2 - 180;
      top = rect.bottom - containerRect.top + 8;
      if (left < 16) left = 16;
      if (left + 360 > containerRect.width - 16) left = containerRect.width - 360 - 16;
      if (top + 285 > containerRect.height - 16) top = rect.top - containerRect.top - 285 - 8;
    }
    setPopupPosition({ top, left });
    setSelectedTimelineStage(stageId);
    setTimelinePopupOpen(true);
    loadStageDetails(stageId);
  };

  const handleRetryLoad = () => {
    if (selectedTimelineStage === 'approval') hasRetriedApproval.current = true;
    if (selectedTimelineStage) loadStageDetails(selectedTimelineStage);
  };

  const closeStageDetails = () => {
    setTimelinePopupOpen(false);
    setSelectedTimelineStage(null);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeStageDetails();
        closeAiReport();
      }
    };
    if (timelinePopupOpen || aiReportPopupOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [timelinePopupOpen, aiReportPopupOpen, selectedTimelineStage]);

  return (
    <div ref={containerRef} className="dashboard-content flex-1 h-full overflow-hidden bg-transparent p-0 font-sans text-gray-800 relative z-10 flex flex-col gap-2">
      <PropertySummary 
        activeTab={activeTab} 
        onHoverImg={(url, pos) => {
          setHoveredImg(url);
          if (pos) setHoverPosition(pos);
        }} 
        onClickImg={(url) => setSelectedImg(url)} 
        activeAction={activeAction} 
        setActiveAction={setActiveAction} 
      />

      {activeAction ? (
        <div className="flex-grow flex-1 min-h-0 bg-white border border-gray-200 rounded-xl p-3.5 shadow-md overflow-hidden relative select-none">
          <ActionViews activeAction={activeAction} setActiveAction={setActiveAction} />
        </div>
      ) : (
        <div className="flex-1 min-h-0 flex gap-2.5 overflow-hidden">
          <div className="flex-1 min-h-0 flex flex-col gap-2 overflow-hidden">
            
            {/* Status Badges Row */}
            <div className="bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm text-xs flex flex-wrap items-center justify-between gap-y-1.5 shrink-0 select-none">
              <StatusBadge icon={<Map size={13} className="text-green-600" />} title="GIS Verified" status="Verified" statusColor="text-green-600" />
              <StatusBadge icon={<FileText size={13} className="text-green-600" />} title="Assessment" status="Approved" statusColor="text-green-600" />
              <StatusBadge icon={<Wallet size={13} className="text-green-600" />} title="Collection Status" status="Paid" statusColor="text-green-600" />
              <StatusBadge icon={<UserCheck size={13} className="text-green-600" />} title="KYC Status" status="Verified" statusColor="text-green-600" />
              <StatusBadge icon={<Droplet size={13} className="text-blue-600" />} title="Water Connection" status="Active" statusColor="text-green-600" isBlue />
              <StatusBadge icon={<ShieldCheck size={13} className="text-green-600" />} title="Fire NOC" status="Valid" statusColor="text-green-600" />
              <StatusBadge icon={<Briefcase size={13} className="text-green-600" />} title="Trade License" status="Active" statusColor="text-green-600" />
              <StatusBadge icon={<Link2 size={13} className="text-green-600" />} title="BPMS Linked" status="Yes" statusColor="text-green-600" />
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-[#002fbe] font-bold text-xs text-[#002fbe] shrink-0 select-none items-end gap-1.5 mt-1 pb-[1px]">
              <Tab active={activeTab === 'property'} onClick={() => setActiveTab('property')} icon={<FolderOpen size={13} />} label="Property Details" />
              <Tab active={activeTab === 'kyc'} onClick={() => setActiveTab('kyc')} icon={<UserCheck size={13} />} label="KYC Details" />
              <Tab active={activeTab === 'society'} onClick={() => setActiveTab('society')} icon={<Users size={13} />} label="Society Details" />
              <Tab active={activeTab === 'building'} onClick={() => setActiveTab('building')} icon={<Building size={13} />} label="Building Permission" />
              <Tab active={activeTab === 'discount'} onClick={() => setActiveTab('discount')} icon={<Percent size={13} />} label="Discount & Social Data" />
              <Tab active={activeTab === 'old'} onClick={() => setActiveTab('old')} icon={<History size={13} />} label="Old Details" />
            </div>

            {/* Tab Panel Content */}
            <div className="flex-1 min-h-0 bg-white border border-gray-200 rounded-lg p-2.5 shadow-sm flex flex-col overflow-y-auto no-scrollbar gap-2">
              <div className="flex flex-col gap-2 transition-all duration-300 animate-fadeIn">
                <div className="flex items-center justify-between pb-1 shrink-0 select-none">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-extrabold text-[#002fbe] text-[11px] uppercase tracking-wider">Floor / Component Details</h3>
                    <span className="text-gray-400 text-[10px] font-semibold">(6 Components)</span>
                  </div>
                </div>

                <FloorComponentDetailsTable activeSubTab={activeSubTab} />
                <TimelineAndMetricsRow 
                  selectedTimelineStage={selectedTimelineStage}
                  onTimelineNodeClick={handleTimelineNodeClick}
                />
                <TaxesComparisonCard />
                <BottomValidationPanel 
                  activeTab={activeTab}
                  aiReportPopupOpen={aiReportPopupOpen}
                  onViewReportClick={handleViewReportClick}
                />
              </div>
            </div>
          </div>

          <DesignRightPanel 
            handleHoverImage={(url, pos) => {
              setHoveredImg(url);
              if (pos) setHoverPosition(pos);
            }}
            openPreview={(url) => setSelectedImg(url)}
          />
        </div>
      )}

      {/* Floating Hover Zoom Portal */}
      {hoveredImg && (
        <div className={`fixed z-50 w-96 bg-white border border-gray-300 rounded-xl shadow-2xl p-2.5 pointer-events-none animate-fadeIn flex flex-col gap-2 ${
          hoverPosition === 'left' ? 'right-[290px] top-[180px]' : 
          hoverPosition === 'property' ? 'left-[235px] top-[25px]' : 
          'left-[290px] top-[180px]'
        }`}>
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex justify-between">
            <span>Complete Zoom View</span>
            <span className="text-[#1e2b58] font-semibold text-[8px] bg-blue-50 px-1 py-0.25 rounded">Live Preview</span>
          </div>
          <div className="overflow-hidden rounded-lg border border-gray-100 bg-gray-50 h-72 w-full flex items-center justify-center">
            <img src={hoveredImg} className="w-full h-full object-contain" alt="Complete Zoom" />
          </div>
        </div>
      )}

      <AiReportPopup 
        aiReportPopupOpen={aiReportPopupOpen}
        aiReportPopupPosition={aiReportPopupPosition}
        aiReportLoading={aiReportLoading}
        closeAiReport={closeAiReport}
      />

      <TimelinePopup 
        selectedTimelineStage={selectedTimelineStage}
        popupPosition={popupPosition}
        timelineLoading={timelineLoading}
        timelineError={timelineError}
        closeStageDetails={closeStageDetails}
        handleRetryLoad={handleRetryLoad}
      />

      {/* Enlarged Zoom Backdrop Modal */}
      {selectedImg && (
        <div
          onClick={() => setSelectedImg(null)}
          className="fixed inset-0 bg-black/75 flex items-center justify-center z-[999] cursor-zoom-out animate-fadeIn font-sans"
        >
          <div className="relative max-w-4xl max-h-[85vh] p-2 bg-white rounded-xl shadow-2xl">
            <img src={selectedImg} alt="Large Preview" className="max-w-full max-h-[80vh] rounded-lg object-contain" />
            <div className="text-center text-xs text-gray-550 mt-2 font-medium">Click anywhere to close preview</div>
          </div>
        </div>
      )}
    </div>
  );
}
