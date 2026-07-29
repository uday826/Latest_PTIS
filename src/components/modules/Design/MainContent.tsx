"use client";

import React, { useState } from 'react';
import PropertySummary from './PropertySummary';
import {
  CheckCircle2,
  Map,
  Wallet,
  UserCheck,
  Droplet,
  ShieldCheck,
  Briefcase,
  Link2,
  FileText,
  Users,
  Building,
  Home,
  Percent,
  History,
  MoreVertical,
  Plus,
  ArrowUp,
  RefreshCcw,
  AlertTriangle,
  FileEdit,
  Camera,
  MapPin,
  Maximize2,
  Printer,
  Download,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  FolderOpen,
  SlidersHorizontal
} from 'lucide-react';
import ActionViews from './ActionViews';

export default function MainContent({ activeAction = null, setActiveAction = () => {} }: { activeAction?: string | null; setActiveAction?: (action: string | null) => void } = {}) {
  const [activeTab, setActiveTab] = useState<'property' | 'kyc' | 'society' | 'building' | 'discount' | 'old'>('property');
  const [selectedTimelineStage, setSelectedTimelineStage] = useState<string | null>(null);
  const [timelinePopupOpen, setTimelinePopupOpen] = useState(false);
  const [popupPosition, setPopupPosition] = useState<{ top: number; left: number } | null>(null);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [timelineError, setTimelineError] = useState<string | null>(null);
  const hasRetriedApproval = React.useRef(false);

  // AI Property Inspector Popups
  const [aiReportPopupOpen, setAiReportPopupOpen] = useState(false);
  const [aiReportPopupPosition, setAiReportPopupPosition] = useState<{ top: number; left: number } | null>(null);
  const [aiReportLoading, setAiReportLoading] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

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
      if (left + 360 > containerRect.width - 16) {
        left = containerRect.width - 360 - 16;
      }
      if (top + 285 > containerRect.height - 16) {
        top = rect.top - containerRect.top - 285 - 8;
      }
    } else {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      if (left < 16) left = 16;
      if (left + 360 > viewportWidth - 16) {
        left = viewportWidth - 360 - 16;
      }
      if (top + 280 > viewportHeight - 16) {
        top = rect.top - 280 - 8;
      }
    }

    setAiReportPopupPosition({ top, left });
    setAiReportPopupOpen(true);
    setAiReportLoading(true);
    setTimeout(() => {
      setAiReportLoading(false);
    }, 400);
  };

  const closeAiReport = () => {
    setAiReportPopupOpen(false);
    const targetId = activeTab !== 'property' ? 'ai-view-report-btn-full' : 'ai-view-report-btn-half';
    const btnEl = document.getElementById(targetId);
    if (btnEl) {
      btnEl.focus();
    }
  };

  const loadStageDetails = (stageId: string) => {
    setTimelineLoading(true);
    setTimelineError(null);

    // Simulate a failure on the first click to Approval to demonstrate error + retry state
    if (stageId === 'approval' && !hasRetriedApproval.current) {
      setTimeout(() => {
        setTimelineLoading(false);
        setTimelineError('Unable to load stage details.');
      }, 400);
      return;
    }

    setTimeout(() => {
      setTimelineLoading(false);
    }, 400);
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
      if (left + 360 > containerRect.width - 16) {
        left = containerRect.width - 360 - 16;
      }
      if (top + 285 > containerRect.height - 16) {
        top = rect.top - containerRect.top - 285 - 8;
      }
    } else {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      if (left < 16) left = 16;
      if (left + 360 > viewportWidth - 16) {
        left = viewportWidth - 360 - 16;
      }
      if (top + 280 > viewportHeight - 16) {
        top = rect.top - 280 - 8;
      }
    }

    setPopupPosition({ top, left });
    setSelectedTimelineStage(stageId);
    setTimelinePopupOpen(true);
    loadStageDetails(stageId);
  };

  const handleRetryLoad = () => {
    if (selectedTimelineStage === 'approval') {
      hasRetriedApproval.current = true;
    }
    if (selectedTimelineStage) {
      loadStageDetails(selectedTimelineStage);
    }
  };

  const closeStageDetails = () => {
    setTimelinePopupOpen(false);
    if (selectedTimelineStage) {
      const nodeEl = document.getElementById(`timeline-node-${selectedTimelineStage}`);
      if (nodeEl) {
        nodeEl.focus();
      }
    }
    setSelectedTimelineStage(null);
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeStageDetails();
        closeAiReport();
      }
    };
    if (timelinePopupOpen || aiReportPopupOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [timelinePopupOpen, aiReportPopupOpen, selectedTimelineStage]);

  const [activeSubTab, setActiveSubTab] = useState<'rateable' | 'capital' | 'dual' | 'reassessment'>('rateable');
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [hoveredImg, setHoveredImg] = useState<string | null>(null);
  const [hoverPosition, setHoverPosition] = useState<'left' | 'right'>('right');

  const handleHoverImage = (url: string | null, position: 'left' | 'right' = 'right') => {
    setHoveredImg(url);
    if (url) {
      setHoverPosition(position);
    }
  };

  const openPreview = (url: string) => {
    setSelectedImg(url);
  };

  // Horizontal Scroll Controls for Floor Details Table
  const tableRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [showScrollControls, setShowScrollControls] = useState(false);

  const updateScrollState = React.useCallback(() => {
    const el = tableRef.current;
    if (el) {
      const hasOverflow = el.scrollWidth > el.clientWidth;
      setShowScrollControls(hasOverflow);
      setCanScrollLeft(el.scrollLeft > 2);
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
    }
  }, []);

  React.useEffect(() => {
    const el = tableRef.current;
    if (el) {
      updateScrollState();
      el.addEventListener('scroll', updateScrollState);
      window.addEventListener('resize', updateScrollState);

      const observer = new MutationObserver(updateScrollState);
      observer.observe(el, { childList: true, subtree: true });

      return () => {
        el.removeEventListener('scroll', updateScrollState);
        window.removeEventListener('resize', updateScrollState);
        observer.disconnect();
      };
    }
  }, [activeTab, activeSubTab, updateScrollState]);

  const scrollLeft = () => {
    const el = tableRef.current;
    if (el) {
      el.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const el = tableRef.current;
    if (el) {
      el.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };
  return (
    <div ref={containerRef} className="flex-1 h-full overflow-hidden bg-transparent p-0 font-sans text-gray-800 relative z-10 flex flex-col gap-2">
      <style dangerouslySetInnerHTML={{__html: `
        .table-scroll-container::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .table-scroll-container::-webkit-scrollbar-thumb {
          background: transparent;
          border-radius: 4px;
        }
        .table-scroll-container:hover::-webkit-scrollbar-thumb {
          background: rgba(0, 47, 190, 0.3);
        }
        .table-scroll-container::-webkit-scrollbar-track {
          background: transparent;
        }
        @media (min-width: 1024px) {
          .summary-timeline-row {
            display: grid !important;
            grid-template-columns: repeat(6, minmax(70px, 1fr)) minmax(290px, 2.5fr) !important;
          }
        }
      `}} />

      <PropertySummary 
        activeTab={activeTab} 
        onHoverImg={(url) => handleHoverImage(url, 'left')} 
        onClickImg={openPreview} 
        activeAction={activeAction} 
        setActiveAction={setActiveAction} 
      />

      {activeAction ? (
        <div className="flex-grow flex-1 min-h-0 bg-white border border-gray-200 rounded-xl p-3.5 shadow-md overflow-hidden relative select-none">
          <ActionViews activeAction={activeAction} setActiveAction={setActiveAction} />
        </div>
      ) : (
        /* Unified Two-Column Layout (Zero scrolling, tight dimensions for perfect vertical fit) */
        <div className="flex-1 min-h-0 flex gap-2.5 overflow-hidden">

        {/* Left Column: Badges, Tabs, and Tab Content Card */}
        <div className="flex-1 min-h-0 flex flex-col gap-2 overflow-hidden">

          {/* Status Badges Row (Tighter padding for zero scrolling) */}
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

          {/* Tabs Navigation Bar */}
          <div className="flex border-b border-[#002fbe] font-bold text-xs text-[#002fbe] shrink-0 select-none items-end gap-1.5 mt-1 pb-[1px]">
            <Tab active={activeTab === 'property'} onClick={() => setActiveTab('property')} icon={<FolderOpen size={13} />} label="Property Details" />
            <Tab active={activeTab === 'kyc'} onClick={() => setActiveTab('kyc')} icon={<UserCheck size={13} />} label="KYC Details" />
            <Tab active={activeTab === 'society'} onClick={() => setActiveTab('society')} icon={<Users size={13} />} label="Society Details" />
            <Tab active={activeTab === 'building'} onClick={() => setActiveTab('building')} icon={<Building size={13} />} label="Building Permission" />
            <Tab active={activeTab === 'discount'} onClick={() => setActiveTab('discount')} icon={<Percent size={13} />} label="Discount & Social Data" />
            <Tab active={activeTab === 'old'} onClick={() => setActiveTab('old')} icon={<History size={13} />} label="Old Details" />
          </div>

          {/* Tab Content Panel (100% Scrollable on compact resolution) */}
          <div className="flex-1 min-h-0 bg-white border border-gray-200 rounded-lg p-2.5 shadow-sm flex flex-col overflow-y-auto no-scrollbar gap-2">

            {/* PANEL 1: Property Details & Shared Assessment Content */}
            {(activeTab === 'property' || activeTab === 'kyc' || activeTab === 'society' || activeTab === 'building' || activeTab === 'discount' || activeTab === 'old') && (
              <div className="flex flex-col gap-2 transition-all duration-300 animate-fadeIn">

                {/* Floor / Component Details Header & Buttons */}
                <div className="flex items-center justify-between pb-1 shrink-0 select-none">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-extrabold text-[#002fbe] text-[11px] uppercase tracking-wider">Floor / Component Details</h3>
                    <span className="text-gray-400 text-[10px] font-semibold">(6 Components)</span>
                  </div>
                </div>

                {/* Sub Tab Table (Extremely compact py-0.5) */}
                <div className="relative flex items-stretch gap-1.5 w-full shrink-0">
                  <div ref={tableRef} className="overflow-x-auto overflow-y-auto max-h-[168px] border border-gray-200 rounded-lg relative table-scroll-container flex-grow">
                  {activeSubTab === 'rateable' && (
                    <table className="w-full text-[10px] text-center border-collapse animate-fadeIn bg-white table-auto">
                      <thead className="bg-[#002fbe] text-white font-extrabold whitespace-nowrap sticky top-0 z-20">
                        <tr>
                          <th className="py-2.5 px-1.5 font-extrabold text-white w-7 border-r border-white/10 text-[8.5px] uppercase sticky left-0 bg-[#002fbe] z-30">#</th>
                          {/* Group 1 */}
                          <th className="py-2.5 px-1.5 w-14 border-r border-white/10 font-bold uppercase tracking-wider text-[8.5px]">Taxable</th>
                          <th className="py-2.5 px-1.5 w-24 border-r border-white/10 font-bold uppercase tracking-wider text-[8.5px]">Floor</th>
                          <th className="py-2.5 px-1.5 w-20 border-r border-white/10 font-bold uppercase tracking-wider text-[8.5px]">Use</th>
                          <th className="py-2.5 px-1.5 w-28 border-r border-white/10 font-bold uppercase tracking-wider text-[8.5px]">Sub Type</th>
                          <th className="py-2.5 px-1.5 w-16 border-r border-white/10 font-bold uppercase tracking-wider text-[8.5px]">Rooms / Units</th>
                          <th className="py-2.5 px-1.5 w-32 border-r border-white/10 font-bold uppercase tracking-wider text-[8.5px]">Carpet Area (ft/mtr)</th>
                          <th className="py-2.5 px-1.5 w-32 border-r border-white/10 font-bold uppercase tracking-wider text-[8.5px]">Built-up Area (ft/mtr)</th>
                          <th className="py-2.5 px-1.5 w-32 border-r border-white/10 font-bold uppercase tracking-wider text-[8.5px]">Rateable Value (₹)</th>
                          <th className="py-2.5 px-1.5 w-32 border-r border-white/10 font-bold uppercase tracking-wider text-[8.5px]">Tax (Current) (₹)</th>
                          <th className="py-2.5 px-1.5 w-20 border-r border-white/10 font-bold uppercase tracking-wider text-[8.5px]">Actions</th>
                          {/* Group 2 */}
                          <th className="py-2.5 px-1.5 w-14 border-r border-white/10 font-bold uppercase tracking-wider text-[8.5px]">Taxable</th>
                          <th className="py-2.5 px-1.5 w-24 border-r border-white/10 font-bold uppercase tracking-wider text-[8.5px]">Floor</th>
                          <th className="py-2.5 px-1.5 w-20 border-r border-white/10 font-bold uppercase tracking-wider text-[8.5px]">Use</th>
                          <th className="py-2.5 px-1.5 w-28 border-r border-white/10 font-bold uppercase tracking-wider text-[8.5px]">Sub Type</th>
                          <th className="py-2.5 px-1.5 w-16 border-r border-white/10 font-bold uppercase tracking-wider text-[8.5px]">Rooms / Units</th>
                          <th className="py-2.5 px-1.5 w-32 border-r border-white/10 font-bold uppercase tracking-wider text-[8.5px]">Carpet Area (ft/mtr)</th>
                          <th className="py-2.5 px-1.5 w-32 border-r border-white/10 font-bold uppercase tracking-wider text-[8.5px]">Built-up Area (ft/mtr)</th>
                          <th className="py-2.5 px-1.5 w-32 border-r border-white/10 font-bold uppercase tracking-wider text-[8.5px]">Rateable Value (₹)</th>
                          <th className="py-2.5 px-1.5 w-32 border-r border-white/10 font-bold uppercase tracking-wider text-[8.5px]">Tax (Current) (₹)</th>
                          <th className="py-2.5 px-1.5 w-20 font-bold uppercase tracking-wider text-[8.5px]">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="font-medium text-gray-700 whitespace-nowrap bg-white text-center">
                        {/* Row 1 */}
                        <tr className="hover:bg-gray-50/50 border-b border-gray-200">
                          <td className="py-2 px-2 text-gray-400 font-bold border-r border-gray-200 sticky left-0 bg-white z-10">1</td>
                          {/* Group 1 */}
                          <td className="py-2 px-2 text-red-500 font-extrabold border-r border-gray-200 text-[9.5px]">No</td>
                          <td className="py-2 px-2 text-[#1e2b58] font-extrabold border-r border-gray-200 text-[9.5px]">Open Plot</td>
                          <td className="py-2 px-2 text-gray-400 font-extrabold border-r border-gray-200 text-[9.5px]">-</td>
                          <td className="py-2 px-2 text-gray-400 font-extrabold border-r border-gray-200 text-[9.5px]">-</td>
                          <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">0</td>
                          <td className="py-2 px-2 font-extrabold text-gray-600 border-r border-gray-200 text-[9.5px]">0.00 / 0.00</td>
                          <td className="py-2 px-2 font-extrabold text-gray-600 border-r border-gray-200 text-[9.5px]">0.00 / 0.00</td>
                          <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">0</td>
                          <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">0</td>
                          <td className="py-2 px-2 border-r border-gray-200 text-center"><span className="bg-gray-100 text-gray-400 rounded px-2.5 py-0.5 text-[8.5px] font-extrabold border border-gray-200">NA</span></td>
                          {/* Group 2 */}
                          <td className="py-2 px-2 text-red-500 font-extrabold border-r border-gray-200 text-[9.5px]">No</td>
                          <td className="py-2 px-2 text-[#1e2b58] font-extrabold border-r border-gray-200 text-[9.5px]">Open Plot</td>
                          <td className="py-2 px-2 text-gray-400 font-extrabold border-r border-gray-200 text-[9.5px]">-</td>
                          <td className="py-2 px-2 text-gray-400 font-extrabold border-r border-gray-200 text-[9.5px]">-</td>
                          <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">0</td>
                          <td className="py-2 px-2 font-extrabold text-gray-600 border-r border-gray-200 text-[9.5px]">0.00 / 0.00</td>
                          <td className="py-2 px-2 font-extrabold text-gray-600 border-r border-gray-200 text-[9.5px]">0.00 / 0.00</td>
                          <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">0</td>
                          <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">0</td>
                          <td className="py-2 px-2 border-r border-gray-200 text-center"><span className="bg-gray-100 text-gray-400 rounded px-2.5 py-0.5 text-[8.5px] font-extrabold border border-gray-200">NA</span></td>
                        </tr>
                        {/* Row 2 */}
                        <tr className="hover:bg-gray-50/50 border-b border-gray-200">
                          <td className="py-2 px-2 text-gray-400 font-bold border-r border-gray-200 sticky left-0 bg-white z-10">2</td>
                          {/* Group 1 */}
                          <td className="py-2 px-2 text-green-600 font-extrabold border-r border-gray-200 text-[9.5px]">Yes</td>
                          <td className="py-2 px-2 text-[#1e2b58] font-extrabold border-r border-gray-200 text-[9.5px]">Ground Floor</td>
                          <td className="py-2 px-2 text-[#1e2b58] font-extrabold font-sans border-r border-gray-200 text-[9.5px]">व्यवसायिक</td>
                          <td className="py-2 px-2 text-[#1e2b58] font-extrabold border-r border-gray-200 text-[9.5px]">Shop</td>
                          <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">2</td>
                          <td className="py-2 px-2 font-extrabold text-gray-600 border-r border-gray-200 text-[9.5px]">120.50 / 11.20</td>
                          <td className="py-2 px-2 font-extrabold text-gray-600 border-r border-gray-200 text-[9.5px]">135.75 / 12.62</td>
                          <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">₹ 1,20,500</td>
                          <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">₹ 18,752</td>
                          <td className="py-2 px-2 border-r border-gray-200 text-center"><span className="bg-[#ecfdf5] text-[#10b981] rounded px-2.5 py-0.5 text-[8.5px] font-extrabold border border-[#10b981]/20">Verified</span></td>
                          {/* Group 2 */}
                          <td className="py-2 px-2 text-green-600 font-extrabold border-r border-gray-200 text-[9.5px]">Yes</td>
                          <td className="py-2 px-2 text-[#1e2b58] font-extrabold border-r border-gray-200 text-[9.5px]">Ground Floor</td>
                          <td className="py-2 px-2 text-[#1e2b58] font-extrabold font-sans border-r border-gray-200 text-[9.5px]">व्यवसायिक</td>
                          <td className="py-2 px-2 text-[#1e2b58] font-extrabold border-r border-gray-200 text-[9.5px]">Shop</td>
                          <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">2</td>
                          <td className="py-2 px-2 font-extrabold text-gray-600 border-r border-gray-200 text-[9.5px]">120.50 / 11.20</td>
                          <td className="py-2 px-2 font-extrabold text-gray-600 border-r border-gray-200 text-[9.5px]">135.75 / 12.62</td>
                          <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">₹ 1,20,500</td>
                          <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">₹ 18,752</td>
                          <td className="py-2 px-2 border-r border-gray-200 text-center"><span className="bg-[#ecfdf5] text-[#10b981] rounded px-2.5 py-0.5 text-[8.5px] font-extrabold border border-[#10b981]/20">Verified</span></td>
                        </tr>
                        {/* Row 3 */}
                        <tr className="hover:bg-gray-50/50 border-b border-gray-200">
                          <td className="py-2 px-2 text-gray-400 font-bold border-r border-gray-200 sticky left-0 bg-white z-10">3</td>
                          {/* Group 1 */}
                          <td className="py-2 px-2 text-green-600 font-extrabold border-r border-gray-200 text-[9.5px]">Yes</td>
                          <td className="py-2 px-2 text-[#1e2b58] font-extrabold border-r border-gray-200 text-[9.5px]">First Floor</td>
                          <td className="py-2 px-2 text-[#1e2b58] font-extrabold font-sans border-r border-gray-200 text-[9.5px]">निवासी</td>
                          <td className="py-2 px-2 text-[#1e2b58] font-extrabold border-r border-gray-200 text-[9.5px]">Residential</td>
                          <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">5</td>
                          <td className="py-2 px-2 font-extrabold text-gray-600 border-r border-gray-200 text-[9.5px]">138.75 / 12.89</td>
                          <td className="py-2 px-2 font-extrabold text-gray-600 border-r border-gray-200 text-[9.5px]">155.40 / 14.43</td>
                          <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">₹ 1,38,750</td>
                          <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">₹ 21,456</td>
                          <td className="py-2 px-2 border-r border-gray-200 text-center"><span className="bg-[#ecfdf5] text-[#10b981] rounded px-2.5 py-0.5 text-[8.5px] font-extrabold border border-[#10b981]/20">Verified</span></td>
                          {/* Group 2 */}
                          <td className="py-2 px-2 text-green-600 font-extrabold border-r border-gray-200 text-[9.5px]">Yes</td>
                          <td className="py-2 px-2 text-[#1e2b58] font-extrabold border-r border-gray-200 text-[9.5px]">First Floor</td>
                          <td className="py-2 px-2 text-[#1e2b58] font-extrabold font-sans border-r border-gray-200 text-[9.5px]">निवासी</td>
                          <td className="py-2 px-2 text-[#1e2b58] font-extrabold border-r border-gray-200 text-[9.5px]">Residential</td>
                          <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">5</td>
                          <td className="py-2 px-2 font-extrabold text-gray-600 border-r border-gray-200 text-[9.5px]">138.75 / 12.89</td>
                          <td className="py-2 px-2 font-extrabold text-gray-600 border-r border-gray-200 text-[9.5px]">155.40 / 14.43</td>
                          <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">₹ 1,38,750</td>
                          <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">₹ 21,456</td>
                          <td className="py-2 px-2 border-r border-gray-200 text-center"><span className="bg-[#ecfdf5] text-[#10b981] rounded px-2.5 py-0.5 text-[8.5px] font-extrabold border border-[#10b981]/20">Verified</span></td>
                        </tr>
                        {/* Row 4 */}
                        <tr className="hover:bg-gray-50/50 border-b border-gray-200">
                          <td className="py-2 px-2 text-gray-400 font-bold border-r border-gray-200 sticky left-0 bg-white z-10">4</td>
                          {/* Group 1 */}
                          <td className="py-2 px-2 text-green-600 font-extrabold border-r border-gray-200 text-[9.5px]">Yes</td>
                          <td className="py-2 px-2 text-[#1e2b58] font-extrabold border-r border-gray-200 text-[9.5px]">Second Floor</td>
                          <td className="py-2 px-2 text-[#1e2b58] font-extrabold font-sans border-r border-gray-200 text-[9.5px]">निवासी</td>
                          <td className="py-2 px-2 text-[#1e2b58] font-extrabold border-r border-gray-200 text-[9.5px]">Residential</td>
                          <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">5</td>
                          <td className="py-2 px-2 font-extrabold text-gray-600 border-r border-gray-200 text-[9.5px]">138.75 / 12.89</td>
                          <td className="py-2 px-2 font-extrabold text-gray-600 border-r border-gray-200 text-[9.5px]">155.40 / 14.43</td>
                          <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">₹ 1,38,750</td>
                          <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">₹ 21,456</td>
                          <td className="py-2 px-2 border-r border-gray-200 text-center"><span className="bg-[#ecfdf5] text-[#10b981] rounded px-2.5 py-0.5 text-[8.5px] font-extrabold border border-[#10b981]/20">Verified</span></td>
                          {/* Group 2 */}
                          <td className="py-2 px-2 text-green-600 font-extrabold border-r border-gray-200 text-[9.5px]">Yes</td>
                          <td className="py-2 px-2 text-[#1e2b58] font-extrabold border-r border-gray-200 text-[9.5px]">Second Floor</td>
                          <td className="py-2 px-2 text-[#1e2b58] font-extrabold font-sans border-r border-gray-200 text-[9.5px]">निवासी</td>
                          <td className="py-2 px-2 text-[#1e2b58] font-extrabold border-r border-gray-200 text-[9.5px]">Residential</td>
                          <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">5</td>
                          <td className="py-2 px-2 font-extrabold text-gray-600 border-r border-gray-200 text-[9.5px]">138.75 / 12.89</td>
                          <td className="py-2 px-2 font-extrabold text-gray-600 border-r border-gray-200 text-[9.5px]">155.40 / 14.43</td>
                          <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">₹ 1,38,750</td>
                          <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">₹ 21,456</td>
                          <td className="py-2 px-2 border-r border-gray-200 text-center"><span className="bg-[#ecfdf5] text-[#10b981] rounded px-2.5 py-0.5 text-[8.5px] font-extrabold border border-[#10b981]/20">Verified</span></td>
                        </tr>
                        {/* Row 5 */}
                        <tr className="hover:bg-gray-50/50 border-b border-gray-200">
                          <td className="py-2 px-2 text-gray-400 font-bold border-r border-gray-200 sticky left-0 bg-white z-10">5</td>
                          {/* Group 1 */}
                          <td className="py-2 px-2 text-green-600 font-extrabold border-r border-gray-200 text-[9.5px]">Yes</td>
                          <td className="py-2 px-2 text-[#1e2b58] font-extrabold border-r border-gray-200 text-[9.5px]">Third Floor</td>
                          <td className="py-2 px-2 text-[#1e2b58] font-extrabold font-sans border-r border-gray-200 text-[9.5px]">निवासी</td>
                          <td className="py-2 px-2 text-[#1e2b58] font-extrabold border-r border-gray-200 text-[9.5px]">Residential</td>
                          <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">5</td>
                          <td className="py-2 px-2 font-extrabold text-gray-600 border-r border-gray-200 text-[9.5px]">138.75 / 12.89</td>
                          <td className="py-2 px-2 font-extrabold text-gray-600 border-r border-gray-200 text-[9.5px]">155.40 / 14.43</td>
                          <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">₹ 1,38,750</td>
                          <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">₹ 21,456</td>
                          <td className="py-2 px-2 border-r border-gray-200 text-center"><span className="bg-[#ecfdf5] text-[#10b981] rounded px-2.5 py-0.5 text-[8.5px] font-extrabold border border-[#10b981]/20">Verified</span></td>
                          {/* Group 2 */}
                          <td className="py-2 px-2 text-green-600 font-extrabold border-r border-gray-200 text-[9.5px]">Yes</td>
                          <td className="py-2 px-2 text-[#1e2b58] font-extrabold border-r border-gray-200 text-[9.5px]">Third Floor</td>
                          <td className="py-2 px-2 text-[#1e2b58] font-extrabold font-sans border-r border-gray-200 text-[9.5px]">निवासी</td>
                          <td className="py-2 px-2 text-[#1e2b58] font-extrabold border-r border-gray-200 text-[9.5px]">Residential</td>
                          <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">5</td>
                          <td className="py-2 px-2 font-extrabold text-gray-600 border-r border-gray-200 text-[9.5px]">138.75 / 12.89</td>
                          <td className="py-2 px-2 font-extrabold text-gray-600 border-r border-gray-200 text-[9.5px]">155.40 / 14.43</td>
                          <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">₹ 1,38,750</td>
                          <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">₹ 21,456</td>
                          <td className="py-2 px-2 border-r border-gray-200 text-center"><span className="bg-[#ecfdf5] text-[#10b981] rounded px-2.5 py-0.5 text-[8.5px] font-extrabold border border-[#10b981]/20">Verified</span></td>
                        </tr>
                        {/* Row 6 */}
                        <tr className="hover:bg-gray-50/50">
                          <td className="py-2 px-2 text-gray-400 font-bold border-r border-gray-200 sticky left-0 bg-white z-10">6</td>
                          {/* Group 1 */}
                          <td className="py-2 px-2 text-green-600 font-extrabold border-r border-gray-200 text-[9.5px]">Yes</td>
                          <td className="py-2 px-2 text-[#1e2b58] font-extrabold border-r border-gray-200 text-[9.5px]">Terrace Floor</td>
                          <td className="py-2 px-2 text-[#1e2b58] font-extrabold font-sans border-r border-gray-200 text-[9.5px]">छत</td>
                          <td className="py-2 px-2 text-[#1e2b58] font-extrabold border-r border-gray-200 text-[9.5px]">Terrace</td>
                          <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">0</td>
                          <td className="py-2 px-2 font-extrabold text-gray-600 border-r border-gray-200 text-[9.5px]">0.00 / 0.00</td>
                          <td className="py-2 px-2 font-extrabold text-gray-600 border-r border-gray-200 text-[9.5px]">21.25 / 1.97</td>
                          <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">₹ 21,250</td>
                          <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">₹ 1,620</td>
                          <td className="py-2 px-2 border-r border-gray-200 text-center"><span className="bg-[#ecfdf5] text-[#10b981] rounded px-2.5 py-0.5 text-[8.5px] font-extrabold border border-[#10b981]/20">Verified</span></td>
                          {/* Group 2 */}
                          <td className="py-2 px-2 text-green-600 font-extrabold border-r border-gray-200 text-[9.5px]">Yes</td>
                          <td className="py-2 px-2 text-[#1e2b58] font-extrabold border-r border-gray-200 text-[9.5px]">Terrace Floor</td>
                          <td className="py-2 px-2 text-[#1e2b58] font-extrabold font-sans border-r border-gray-200 text-[9.5px]">छत</td>
                          <td className="py-2 px-2 text-[#1e2b58] font-extrabold border-r border-gray-200 text-[9.5px]">Terrace</td>
                          <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">0</td>
                          <td className="py-2 px-2 font-extrabold text-gray-600 border-r border-gray-200 text-[9.5px]">0.00 / 0.00</td>
                          <td className="py-2 px-2 font-extrabold text-gray-600 border-r border-gray-200 text-[9.5px]">21.25 / 1.97</td>
                          <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">₹ 21,250</td>
                          <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">₹ 1,620</td>
                          <td className="py-2 px-2 border-r border-gray-200 text-center"><span className="bg-[#ecfdf5] text-[#10b981] rounded px-2.5 py-0.5 text-[8.5px] font-extrabold border border-[#10b981]/20">Verified</span></td>
                        </tr>
                      </tbody>
                    </table>
                  )}
                  {activeSubTab === 'capital' && (
                    <table className="w-full text-[10px] text-center border-collapse animate-fadeIn bg-white">
                      <thead className="bg-[#1e2b58] text-white font-extrabold border-b border-gray-200 whitespace-nowrap">
                        <tr>
                          <th className="py-1.5 px-1.5 w-10 text-center font-bold">#</th>
                          <th className="py-1.5 px-1.5 text-left font-bold uppercase tracking-wider text-[8.5px]">Use</th>
                          <th className="py-1.5 px-1.5 text-right font-bold uppercase tracking-wider text-[8.5px]">RV (₹)</th>
                          <th className="py-1.5 px-1.5 text-[#1e2b58] font-bold text-right">RV Tax (₹)</th>
                          <th className="py-1.5 px-1.5 text-right font-bold uppercase tracking-wider text-[8.5px]">CV (₹)</th>
                          <th className="py-1.5 px-1.5 text-right font-bold uppercase tracking-wider text-[8.5px]">CV Tax (₹)</th>
                          <th className="py-1.5 px-1.5 text-right font-bold uppercase tracking-wider text-[8.5px]">Calculated (Higher) (₹)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-150 font-medium text-gray-700 bg-white whitespace-nowrap">
                        <tr className="hover:bg-gray-50">
                          <td className="py-1.5 px-1.5 text-center font-bold text-gray-500">1</td>
                          <td className="py-1.5 px-1.5 text-blue-900 font-bold text-left">खुला भूखंड</td>
                          <td className="py-1.5 px-1.5 text-right">₹6,000</td>
                          <td className="py-1.5 px-1.5 font-bold text-right text-green-600">₹900</td>
                          <td className="py-1.5 px-1.5 text-right">₹4,50,000</td>
                          <td className="py-1.5 px-1.5 text-right">₹1,350</td>
                          <td className="py-1.5 px-1.5 font-bold text-green-600 text-right">₹1,350</td>
                        </tr>
                      </tbody>
                    </table>
                  )}
                  {activeSubTab === 'dual' && (
                    <table className="w-full text-[10px] text-center border-collapse animate-fadeIn bg-white">
                      <thead className="bg-[#1e2b58] text-white font-extrabold border-b border-gray-200 whitespace-nowrap">
                        <tr>
                          <th className="py-1.5 px-1.5 w-10 text-center font-bold">#</th>
                          <th className="py-1.5 px-1.5 text-left font-bold uppercase tracking-wider text-[8.5px]">Use</th>
                          <th className="py-1.5 px-1.5 text-right font-bold uppercase tracking-wider text-[8.5px]">RV (₹)</th>
                          <th className="py-1.5 px-1.5 text-right font-bold uppercase tracking-wider text-[8.5px]">RV Tax (₹)</th>
                          <th className="py-1.5 px-1.5 text-right font-bold uppercase tracking-wider text-[8.5px]">CV (₹)</th>
                          <th className="py-1.5 px-1.5 text-right font-bold uppercase tracking-wider text-[8.5px]">CV Tax (₹)</th>
                          <th className="py-1.5 px-1.5 text-right font-bold uppercase tracking-wider text-[8.5px]">Calculated (Higher) (₹)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-150 font-medium text-gray-700 bg-white whitespace-nowrap">
                        <tr className="hover:bg-gray-50">
                          <td className="py-1.5 px-1.5 text-center font-bold text-gray-500">1</td>
                          <td className="py-1.5 px-1.5 text-blue-900 font-bold text-left">निवासी</td>
                          <td className="py-1.5 px-1.5 text-right">₹6,000</td>
                          <td className="py-1.5 px-1.5 text-right">₹900</td>
                          <td className="py-1.5 px-1.5 text-right">₹4,50,000</td>
                          <td className="py-1.5 px-1.5 text-right">₹1,350</td>
                          <td className="py-1.5 px-1.5 font-bold text-green-600 text-right">₹1,350</td>
                        </tr>
                      </tbody>
                    </table>
                  )}
                </div>

                {/* Right-side Slim Control Strip for Table Scrolling */}
                {showScrollControls && (
                  <div className="flex flex-col gap-1 justify-center items-center shrink-0 w-8 border border-gray-200 rounded-lg bg-gray-50/50 p-1">
                    <button
                      onClick={scrollLeft}
                      disabled={!canScrollLeft}
                      className={`w-6 h-6 flex items-center justify-center rounded-md border text-center transition-all cursor-pointer ${
                        canScrollLeft
                          ? 'bg-white text-[#002fbe] border-blue-200 hover:bg-blue-50 active:scale-95 shadow-sm'
                          : 'bg-gray-100/50 text-gray-300 border-gray-200 cursor-not-allowed'
                      }`}
                      title="Scroll Left"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <button
                      onClick={scrollRight}
                      disabled={!canScrollRight}
                      className={`w-6 h-6 flex items-center justify-center rounded-md border text-center transition-all cursor-pointer ${
                        canScrollRight
                          ? 'bg-white text-[#002fbe] border-blue-200 hover:bg-blue-50 active:scale-95 shadow-sm'
                          : 'bg-gray-100/50 text-gray-300 border-gray-200 cursor-not-allowed'
                      }`}
                      title="Scroll Right"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                )}
              </div>
                <div className="summary-timeline-row grid grid-cols-1 md:grid-cols-2 gap-2 shrink-0 select-none items-stretch">
                  {/* Card 1: Area Comparison */}
                  <div className="border border-[#002fbe]/25 rounded-xl p-2 bg-white shadow-md flex items-center gap-1.5 min-w-0">
                    <div className="bg-[#eff6ff] w-7.5 h-7.5 rounded-full flex items-center justify-center text-[#002fbe] shrink-0">
                      <FileText size={15} />
                    </div>
                    <div className="flex-grow text-[9px] leading-tight min-w-0">
                      <div className="font-extrabold text-[#002fbe] text-[8.5px] uppercase tracking-wider mb-0.5 leading-tight">Area Comparison</div>
                      <div className="space-y-0.5 text-gray-500 font-bold text-[8px]">
                        <div>OLD: <span className="font-black text-gray-800 text-[9px] whitespace-nowrap">400.00 m²</span></div>
                        <div>NEW: <span className="font-black text-[#002fbe] text-[9.5px] whitespace-nowrap">440.00 m²</span></div>
                        <div className="text-[#10b981] font-black text-[8.5px] flex items-center gap-0.5 mt-0.5 whitespace-nowrap">
                          <span>↑ 40 m² (10%)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Rateable Value */}
                  <div className="border border-[#002fbe]/25 rounded-xl p-2 bg-white shadow-md flex items-center gap-1.5 min-w-0">
                    <div className="bg-[#f5f3ff] w-7.5 h-7.5 rounded-full flex items-center justify-center text-[#8b5cf6] shrink-0">
                      <UserCheck size={15} />
                    </div>
                    <div className="flex-grow text-[9px] leading-tight min-w-0">
                      <div className="font-extrabold text-[#002fbe] text-[8.5px] uppercase tracking-wider mb-0.5 leading-tight">Rateable Value (RV)</div>
                      <div className="space-y-0.5 text-gray-500 font-bold text-[8px]">
                        <div>OLD: <span className="font-black text-gray-800 text-[9px] whitespace-nowrap">₹16,20,000</span></div>
                        <div>NEW: <span className="font-black text-[#002fbe] text-[9.5px] whitespace-nowrap">₹18,45,000</span></div>
                        <div className="text-[#10b981] font-black text-[8.5px] flex items-center gap-0.5 mt-0.5 whitespace-nowrap">
                          <span>↑ 13.89%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Capital Value */}
                  <div className="border border-[#002fbe]/25 rounded-xl p-2 bg-white shadow-md flex items-center gap-1.5 min-w-0">
                    <div className="bg-[#eff6ff] w-7.5 h-7.5 rounded-full flex items-center justify-center text-[#002fbe] shrink-0">
                      <Home size={15} />
                    </div>
                    <div className="flex-grow text-[9px] leading-tight min-w-0">
                      <div className="font-extrabold text-[#002fbe] text-[8.5px] uppercase tracking-wider mb-0.5 leading-tight">Capital Value (CV)</div>
                      <div className="space-y-0.5 text-gray-500 font-bold text-[8px]">
                        <div>OLD: <span className="font-black text-gray-800 text-[9px] whitespace-nowrap">₹32,40,000</span></div>
                        <div>NEW: <span className="font-black text-[#002fbe] text-[9.5px] whitespace-nowrap">₹36,90,000</span></div>
                        <div className="text-[#10b981] font-black text-[8.5px] flex items-center gap-0.5 mt-0.5 whitespace-nowrap">
                          <span>↑ 13.89%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 4: Tax (Current) */}
                  <div className="border border-[#002fbe]/25 rounded-xl p-2 bg-white shadow-md flex items-center gap-1.5 min-w-0">
                    <div className="bg-[#ecfdf5] w-7.5 h-7.5 rounded-full flex items-center justify-center text-[#10b981] shrink-0">
                      <Percent size={15} />
                    </div>
                    <div className="flex-grow text-[9px] leading-tight min-w-0">
                      <div className="font-extrabold text-[#002fbe] text-[8.5px] uppercase tracking-wider mb-0.5 leading-tight">Tax (Current)</div>
                      <div className="space-y-0.5 text-gray-500 font-bold text-[8px]">
                        <div>OLD: <span className="font-black text-gray-800 text-[9px] whitespace-nowrap">₹16,500</span></div>
                        <div>NEW: <span className="font-black text-[#002fbe] text-[9.5px] whitespace-nowrap">₹18,752</span></div>
                        <div className="text-[#10b981] font-black text-[8.5px] flex items-center gap-0.5 mt-0.5 whitespace-nowrap">
                          <span>↑ 13.65%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 5: Collection */}
                  <div className="border border-[#002fbe]/25 rounded-xl p-2 bg-white shadow-md flex items-center gap-1.5 min-w-0">
                    <div className="bg-[#fef2f2] w-7.5 h-7.5 rounded-full flex items-center justify-center text-[#ef4444] shrink-0">
                      <Wallet size={15} />
                    </div>
                    <div className="flex-grow text-[9px] leading-tight min-w-0">
                      <div className="font-extrabold text-[#002fbe] text-[8.5px] uppercase tracking-wider mb-0.5 leading-tight">Collection</div>
                      <div className="space-y-0.5 text-gray-500 font-bold text-[8px]">
                        <div>Paid: <span className="font-black text-green-600 text-[9.5px] whitespace-nowrap">₹12,456</span></div>
                        <div className="text-red-500">O/S: <span className="font-black text-[#ef4444] text-[9.5px] whitespace-nowrap">₹6,296</span></div>
                        <div className="text-[#002fbe] font-black text-[8.5px] flex items-center gap-0.5 mt-0.5 whitespace-nowrap">
                          <span>Total: ₹18,752</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 6: Additional Revenue */}
                  <div className="border border-[#002fbe]/25 rounded-xl p-2 bg-white shadow-md flex items-center gap-1.5 min-w-0">
                    <div className="bg-[#eff6ff] w-7.5 h-7.5 rounded-full flex items-center justify-center text-[#002fbe] shrink-0">
                      <Briefcase size={15} />
                    </div>
                    <div className="flex-grow text-[9px] leading-tight min-w-0">
                      <div className="font-extrabold text-[#002fbe] text-[8.5px] uppercase tracking-wider mb-0.5 leading-tight">Additional Revenue</div>
                      <div className="text-gray-500 text-[7.5px] font-bold">This Assessment</div>
                      <div className="flex items-baseline gap-0.5 mt-0.5 whitespace-nowrap">
                        <span className="font-black text-[11px] text-[#002fbe] leading-none">₹1,12,892</span>
                        <span className="text-[#10b981] font-black text-[8px] shrink-0">↑ 12.4%</span>
                      </div>
                      <div className="text-gray-400 text-[6.5px] font-semibold mt-0.5">(Tax+Pen+Int)</div>
                    </div>
                  </div>

                  {/* Card 7: Property Timeline */}
                  <div className="border border-[#002fbe]/25 rounded-xl p-1.5 bg-white shadow-md flex flex-col justify-between select-none col-span-1 md:col-span-2 lg:col-span-1 min-w-0">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-0.5 shrink-0">
                      <span className="font-extrabold text-[#002fbe] text-[8px] uppercase tracking-wider">Property Timeline</span>
                      <Clock size={10} className="text-[#002fbe]" />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-center my-1">
                      <div className="relative flex items-center justify-between px-1 text-[7px] min-w-0 w-full">
                        <div className="absolute top-[7px] left-[6.25%] w-[56.25%] h-[1px] bg-[#10b981] z-0"></div>
                        <div className="absolute top-[7px] left-[62.5%] w-[18.75%] h-[1px] bg-blue-600 z-0"></div>
                        <div className="absolute top-[7px] left-[81.25%] right-[6.25%] h-[1px] bg-slate-300 z-0"></div>

                        <TimelineStep id="geoSequencing" label="Geo Seq" date="15-Jan" active onClick={handleTimelineNodeClick} isSelected={selectedTimelineStage === 'geoSequencing'} />
                        <TimelineStep id="survey" label="Survey" date="10-Feb" active onClick={handleTimelineNodeClick} isSelected={selectedTimelineStage === 'survey'} />
                        <TimelineStep id="verification" label="Verify" date="20-Feb" active onClick={handleTimelineNodeClick} isSelected={selectedTimelineStage === 'verification'} />
                        <TimelineStep id="assessment" label="Assess" date="01-Apr" active onClick={handleTimelineNodeClick} isSelected={selectedTimelineStage === 'assessment'} />
                        <TimelineStep id="approval" label="Approval" date="20-Apr" active onClick={handleTimelineNodeClick} isSelected={selectedTimelineStage === 'approval'} />
                        <TimelineStep id="collection" label="Collection" date="05-May" active onClick={handleTimelineNodeClick} isSelected={selectedTimelineStage === 'collection'} />
                        <TimelineStep id="mutation" label="Mutation" date="In Progress" isInProgress onClick={handleTimelineNodeClick} isSelected={selectedTimelineStage === 'mutation'} />
                        <TimelineStep id="appeal" label="Appeal" date="Pending" isPending onClick={handleTimelineNodeClick} isSelected={selectedTimelineStage === 'appeal'} />
                      </div>
                    </div>

                    <div className="flex gap-2.5 justify-center text-[6.5px] font-bold text-[#002fbe] shrink-0 border-t border-gray-50 pt-0.5">
                      <div className="flex items-center gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" /><span className="leading-none">Completed</span></div>
                      <div className="flex items-center gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-600" /><span className="leading-none">In Progress</span></div>
                      <div className="flex items-center gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-slate-400" /><span className="leading-none">Pending</span></div>
                    </div>
                  </div>
                </div>

                {/* Headwise Taxes Comparison Card */}
                <div className="bg-white border border-[#002fbe]/25 rounded-lg p-2.5 flex flex-col shrink-0 select-none mt-1 shadow-md relative">
                  <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-gray-150 h-[34px] shrink-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-extrabold text-[#1e2b58] text-[10px] uppercase tracking-wider leading-none">Headwise Taxes Comparison</h3>
                      <span className="text-gray-500 text-[8px] font-bold leading-none">(All Floors Total)</span>
                    </div>
                    <div className="flex items-center gap-1 bg-gray-50/75 text-gray-500 border border-gray-200/50 px-2.5 py-0.5 rounded-full text-[7.5px] font-semibold leading-none">
                      <span>All figures in INR</span>
                    </div>
                  </div>
                  <div className="relative border border-[#002fbe]/15 rounded-md overflow-hidden bg-white">
                    <div className="overflow-x-auto">
                      <table className="w-full text-[10px] text-center border-collapse">
                        <thead className="bg-[#002fbe] border-b border-[#002fbe]/15 text-white font-bold whitespace-nowrap">
                          <tr>
                            <th className="py-2 px-2 text-left sticky left-0 bg-[#002fbe] border-r border-white/10 uppercase text-[8px] font-extrabold z-20 text-white">Taxes</th>
                            <th className="py-2 px-2 border-r border-white/10 uppercase text-[8px] font-extrabold leading-tight text-white">General Tax</th>
                            <th className="py-2 px-2 border-r border-white/10 uppercase text-[8px] font-extrabold leading-tight text-white">State Education Tax</th>
                            <th className="py-2 px-2 border-r border-white/10 uppercase text-[8px] font-extrabold leading-tight text-white">Tree Cess</th>
                            <th className="py-2 px-2 border-r border-white/10 uppercase text-[8px] font-extrabold leading-tight text-white">Special Water Cess</th>
                            <th className="py-2 px-2 border-r border-white/10 uppercase text-[8px] font-extrabold leading-tight text-white">Road Cess</th>
                            <th className="py-2 px-2 border-r border-white/10 uppercase text-[8px] font-extrabold leading-tight text-white">Fire Cess</th>
                            <th className="py-2 px-2 border-r border-white/10 uppercase text-[8px] font-extrabold leading-tight text-white">Light Cess</th>
                            <th className="py-2 px-2 border-r border-white/10 uppercase text-[8px] font-extrabold leading-tight text-white">Water Benefit Cess</th>
                            <th className="py-2 px-2 border-r border-white/10 uppercase text-[8px] font-extrabold leading-tight text-white">Sewage Disposal Cess</th>
                            <th className="py-2 px-2 uppercase text-[8px] font-extrabold leading-tight text-white">Special Education Tax</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-150 font-medium text-[#1e2b58] whitespace-nowrap bg-white text-center">
                          {/* Row 1: Old Taxes */}
                          <tr className="bg-white hover:bg-[#edf2ff]/30 transition-colors duration-150">
                            <td className="py-1.5 px-2 text-left sticky left-0 bg-white border-r border-[#002fbe]/10 z-10">
                              <span className="bg-[#eff6ff] text-blue-600 border border-blue-200 font-bold px-2 py-0.5 rounded text-[7.5px] inline-block text-center uppercase tracking-wider shadow-2xs">Old Taxes</span>
                            </td>
                            <td className="py-1.5 px-2 border-r border-[#002fbe]/10 text-blue-900/30 font-bold">0</td>
                            <td className="py-1.5 px-2 border-r border-[#002fbe]/10 text-blue-900/30 font-bold">0</td>
                            <td className="py-1.5 px-2 border-r border-[#002fbe]/10 text-blue-900/30 font-bold">0</td>
                            <td className="py-1.5 px-2 border-r border-[#002fbe]/10 text-blue-900/30 font-bold">0</td>
                            <td className="py-1.5 px-2 border-r border-[#002fbe]/10 text-blue-900/30 font-bold">0</td>
                            <td className="py-1.5 px-2 border-r border-[#002fbe]/10 text-blue-900/30 font-bold">0</td>
                            <td className="py-1.5 px-2 border-r border-[#002fbe]/10 text-blue-900/30 font-bold">0</td>
                            <td className="py-1.5 px-2 border-r border-[#002fbe]/10 text-blue-900/30 font-bold">0</td>
                            <td className="py-1.5 px-2 border-r border-[#002fbe]/10 text-blue-900/30 font-bold">0</td>
                            <td className="py-1.5 px-2 text-blue-900/30 font-bold">0</td>
                          </tr>
                          {/* Row 2: RV Taxes */}
                          <tr className="bg-[#edf2ff]/10 hover:bg-[#edf2ff]/30 transition-colors duration-150">
                            <td className="py-1.5 px-2 text-left sticky left-0 bg-[#fbfdff] border-r border-[#002fbe]/10 z-10">
                              <span className="bg-[#edf2ff] text-blue-700 border border-blue-300 font-bold px-2 py-0.5 rounded text-[7.5px] inline-block text-center uppercase tracking-wider shadow-2xs">RV Taxes</span>
                            </td>
                            <td className="py-1.5 px-2 border-r border-[#002fbe]/10 font-bold text-[#002fbe] tabular-nums">33,480</td>
                            <td className="py-1.5 px-2 border-r border-[#002fbe]/10 font-bold text-[#002fbe] tabular-nums">6,480</td>
                            <td className="py-1.5 px-2 border-r border-[#002fbe]/10 font-bold text-[#002fbe] tabular-nums">1,080</td>
                            <td className="py-1.5 px-2 border-r border-[#002fbe]/10 font-bold text-[#002fbe] tabular-nums">2,160</td>
                            <td className="py-1.5 px-2 border-r border-[#002fbe]/10 font-bold text-[#002fbe] tabular-nums">6,480</td>
                            <td className="py-1.5 px-2 border-r border-[#002fbe]/10 font-bold text-[#002fbe] tabular-nums">1,080</td>
                            <td className="py-1.5 px-2 border-r border-[#002fbe]/10 font-bold text-[#002fbe] tabular-nums">10,800</td>
                            <td className="py-1.5 px-2 border-r border-[#002fbe]/10 font-bold text-[#002fbe] tabular-nums">18,360</td>
                            <td className="py-1.5 px-2 border-r border-[#002fbe]/10 font-bold text-[#002fbe] tabular-nums">15,120</td>
                            <td className="py-1.5 px-2 font-bold text-[#002fbe] tabular-nums">3,240</td>
                          </tr>
                          {/* Row 3: CV Taxes (High Value Highlighted Row) */}
                          <tr className="bg-[#f5f3ff]/15 hover:bg-[#f5f3ff]/35 transition-colors duration-150 font-bold">
                            <td className="py-1.5 px-2 text-left sticky left-0 bg-[#fcfbfe] border-r border-[#002fbe]/10 z-10">
                              <span className="bg-[#f5f3ff] text-purple-700 border border-purple-300 font-bold px-2 py-0.5 rounded text-[7.5px] inline-block text-center uppercase tracking-wider shadow-2xs">CV Taxes</span>
                            </td>
                            <td className="py-1.5 px-2 border-r border-[#002fbe]/10 font-black text-[#002fbe] tabular-nums">1,53,47,12,291</td>
                            <td className="py-1.5 px-2 border-r border-[#002fbe]/10 font-black text-[#002fbe] tabular-nums">41,80,17,898</td>
                            <td className="py-1.5 px-2 border-r border-[#002fbe]/10 font-black text-[#002fbe] tabular-nums">27,86,78,598</td>
                            <td className="py-1.5 px-2 border-r border-[#002fbe]/10 font-black text-[#002fbe] tabular-nums">27,86,78,598</td>
                            <td className="py-1.5 px-2 border-r border-[#002fbe]/10 font-black text-[#002fbe] tabular-nums">27,86,78,598</td>
                            <td className="py-1.5 px-2 border-r border-[#002fbe]/10 font-black text-[#002fbe] tabular-nums">27,86,78,598</td>
                            <td className="py-1.5 px-2 border-r border-[#002fbe]/10 font-black text-[#002fbe] tabular-nums">27,86,78,598</td>
                            <td className="py-1.5 px-2 border-r border-[#002fbe]/10 font-black text-[#002fbe] tabular-nums">34,83,48,248</td>
                            <td className="py-1.5 px-2 border-r border-[#002fbe]/10 font-black text-[#002fbe] tabular-nums">34,83,48,248</td>
                            <td className="py-1.5 px-2 font-black text-[#002fbe] tabular-nums">27,86,78,598</td>
                          </tr>
                          {/* Row 4: Retain U.S. 129 */}
                          <tr className="bg-[#fffbfa]/30 hover:bg-[#edf2ff]/30 transition-colors duration-150">
                            <td className="py-1.5 px-2 text-left sticky left-0 bg-[#fffdfd] border-r border-[#002fbe]/10 z-10">
                              <span className="bg-[#fef2f2] text-red-600 border border-red-200 font-bold px-2 py-0.5 rounded text-[7.5px] inline-block text-center uppercase tracking-wider shadow-2xs">Retain U.S. 129</span>
                            </td>
                            <td className="py-1.5 px-2 border-r border-[#002fbe]/10 text-blue-900/30 font-bold">0</td>
                            <td className="py-1.5 px-2 border-r border-[#002fbe]/10 text-blue-900/30 font-bold">0</td>
                            <td className="py-1.5 px-2 border-r border-[#002fbe]/10 text-blue-900/30 font-bold">0</td>
                            <td className="py-1.5 px-2 border-r border-[#002fbe]/10 text-blue-900/30 font-bold">0</td>
                            <td className="py-1.5 px-2 border-r border-[#002fbe]/10 text-blue-900/30 font-bold">0</td>
                            <td className="py-1.5 px-2 border-r border-[#002fbe]/10 text-blue-900/30 font-bold">0</td>
                            <td className="py-1.5 px-2 border-r border-[#002fbe]/10 text-blue-900/30 font-bold">0</td>
                            <td className="py-1.5 px-2 border-r border-[#002fbe]/10 text-blue-900/30 font-bold">0</td>
                            <td className="py-1.5 px-2 border-r border-[#002fbe]/10 text-blue-900/30 font-bold">0</td>
                            <td className="py-1.5 px-2 text-blue-900/30 font-bold">0</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Bottom Row Grid (Spans AI Inspector & Validation Status on Left + Service Availability & Timeline on Right) */}
                {activeTab !== 'property' ? (
                  /* AI Property Inspector full width for Building Permission tab */
                  <div className="shrink-0 bg-white border border-[#002fbe]/25 rounded-lg p-2.5 flex flex-col justify-between shadow-md select-none w-full mt-1">
                    <div>
                      <div className="flex items-center justify-between border-b border-gray-100 pb-1.5 mb-2 shrink-0">
                        <h3 className="font-extrabold text-[#002fbe] text-[9.5px] uppercase tracking-wider">AI Property Inspector</h3>
                        <span className="text-gray-400 text-[8.5px] font-bold">Issues Found (8)</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1.5 text-[8.5px]">
                        <div className="space-y-1.5 font-bold">
                          <div className="flex items-center justify-between"><span className="flex items-center gap-1 text-gray-655"><AlertTriangle size={10} className="text-orange-500 fill-orange-50" /><span>Possible Commercial Use</span></span><span className="bg-[#fef2f2] text-[#ef4444] border border-[#ef4444]/20 font-bold px-1.5 py-0.5 rounded text-[8px]">High</span></div>
                          <div className="flex items-center justify-between"><span className="flex items-center gap-1 text-gray-655"><AlertTriangle size={10} className="text-orange-500 fill-orange-50" /><span>Area Difference Found</span></span><span className="bg-[#fef2f2] text-[#ef4444] border border-[#ef4444]/20 font-bold px-1.5 py-0.5 rounded text-[8px]">High</span></div>
                          <div className="flex items-center justify-between"><span className="flex items-center gap-1 text-gray-655"><AlertTriangle size={10} className="text-amber-500 fill-amber-50" /><span>Parking Provision Missing</span></span><span className="bg-[#fff7ed] text-[#f97316] border border-[#f97316]/20 font-bold px-1.5 py-0.5 rounded text-[8px]">Medium</span></div>
                          <div className="flex items-center justify-between"><span className="flex items-center gap-1 text-gray-655"><AlertTriangle size={10} className="text-amber-500 fill-amber-50" /><span>Fire NOC Expired</span></span><span className="bg-[#fff7ed] text-[#f97316] border border-[#f97316]/20 font-bold px-1.5 py-0.5 rounded text-[8px]">Medium</span></div>
                        </div>
                        <div className="space-y-1.5 sm:border-l sm:border-gray-100 sm:pl-3 font-bold">
                          <div className="flex items-center justify-between"><span className="flex items-center gap-1 text-gray-655"><AlertTriangle size={10} className="text-blue-500 fill-blue-50" /><span>Duplicate Water Connection</span></span><span className="bg-[#ecfdf5] text-[#10b981] border border-[#10b981]/20 font-bold px-1.5 py-0.5 rounded text-[8px]">Low</span></div>
                          <div className="flex items-center justify-between"><span className="flex items-center gap-1 text-gray-655"><AlertTriangle size={10} className="text-blue-500 fill-blue-50" /><span>Occupancy Change Detected</span></span><span className="bg-[#ecfdf5] text-[#10b981] border border-[#10b981]/20 font-bold px-1.5 py-0.5 rounded text-[8px]">Low</span></div>
                          <div className="flex items-center justify-between"><span className="flex items-center gap-1 text-gray-655"><AlertTriangle size={10} className="text-blue-500 fill-blue-50" /><span>Boundary Wall Missing</span></span><span className="bg-[#ecfdf5] text-[#10b981] border border-[#10b981]/20 font-bold px-1.5 py-0.5 rounded text-[8px]">Low</span></div>
                          <div className="flex items-center justify-between"><span className="flex items-center gap-1 text-gray-655"><AlertTriangle size={10} className="text-blue-500 fill-blue-50" /><span>Taxpayer Mobile Not Verified</span></span><span className="bg-[#ecfdf5] text-[#10b981] border border-[#10b981]/20 font-bold px-1.5 py-0.5 rounded text-[8px]">Low</span></div>
                        </div>
                      </div>
                    </div>
                    <button id="ai-view-report-btn-full" onClick={handleViewReportClick} aria-expanded={aiReportPopupOpen} aria-controls="ai-report-popup" className="w-full mt-2 py-1 bg-[#edf2ff] hover:bg-[#dbeafe] border border-[#3b82f6]/20 text-[#3b82f6] font-extrabold text-[8.5px] rounded transition-all text-center cursor-pointer shadow-xs shrink-0">View All Report</button>
                  </div>
                ) : (
                  <div className="shrink-0 grid grid-cols-5 gap-3 mt-1 items-stretch">

                  {/* Left Column (3/5 width): AI Property Inspector & Validation Status */}
                  <div className="col-span-3 grid grid-cols-2 gap-3 overflow-hidden items-stretch">
                    {/* AI Property Inspector */}
                    <div className="bg-white border border-[#002fbe]/25 rounded-lg p-2.5 flex flex-col justify-between shadow-md select-none h-full">
                      <div>
                        <div className="flex items-center justify-between border-b border-gray-100 pb-1.5 mb-2 shrink-0">
                          <h3 className="font-extrabold text-[#002fbe] text-[9.5px] uppercase tracking-wider">AI Property Inspector</h3>
                          <span className="text-gray-400 text-[8.5px] font-bold">Issues Found (8)</span>
                        </div>
                        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[8.5px]">
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between"><span className="flex items-center gap-1 text-gray-655"><AlertTriangle size={10} className="text-orange-500 fill-orange-50" /><span>Possible Commercial Use</span></span><span className="bg-[#fef2f2] text-[#ef4444] border border-[#ef4444]/20 font-bold px-1.5 py-0.5 rounded text-[8px]">High</span></div>
                            <div className="flex items-center justify-between"><span className="flex items-center gap-1 text-gray-655"><AlertTriangle size={10} className="text-orange-500 fill-orange-50" /><span>Area Difference Found</span></span><span className="bg-[#fef2f2] text-[#ef4444] border border-[#ef4444]/20 font-bold px-1.5 py-0.5 rounded text-[8px]">High</span></div>
                            <div className="flex items-center justify-between"><span className="flex items-center gap-1 text-gray-655"><AlertTriangle size={10} className="text-amber-500 fill-amber-50" /><span>Parking Provision Missing</span></span><span className="bg-[#fff7ed] text-[#f97316] border border-[#f97316]/20 font-bold px-1.5 py-0.5 rounded text-[8px]">Medium</span></div>
                            <div className="flex items-center justify-between"><span className="flex items-center gap-1 text-gray-655"><AlertTriangle size={10} className="text-amber-500 fill-amber-50" /><span>Fire NOC Expired</span></span><span className="bg-[#fff7ed] text-[#f97316] border border-[#f97316]/20 font-bold px-1.5 py-0.5 rounded text-[8px]">Medium</span></div>
                          </div>
                          <div className="space-y-1.5 border-l border-gray-100 pl-3">
                            <div className="flex items-center justify-between"><span className="flex items-center gap-1 text-gray-655"><AlertTriangle size={10} className="text-blue-500 fill-blue-50" /><span>Duplicate Water Connection</span></span><span className="bg-[#ecfdf5] text-[#10b981] border border-[#10b981]/20 font-bold px-1.5 py-0.5 rounded text-[8px]">Low</span></div>
                            <div className="flex items-center justify-between"><span className="flex items-center gap-1 text-gray-655"><AlertTriangle size={10} className="text-blue-500 fill-blue-50" /><span>Occupancy Change Detected</span></span><span className="bg-[#ecfdf5] text-[#10b981] border border-[#10b981]/20 font-bold px-1.5 py-0.5 rounded text-[8px]">Low</span></div>
                            <div className="flex items-center justify-between"><span className="flex items-center gap-1 text-gray-655"><AlertTriangle size={10} className="text-blue-500 fill-blue-50" /><span>Boundary Wall Missing</span></span><span className="bg-[#ecfdf5] text-[#10b981] border border-[#10b981]/20 font-bold px-1.5 py-0.5 rounded text-[8px]">Low</span></div>
                            <div className="flex items-center justify-between"><span className="flex items-center gap-1 text-gray-655"><AlertTriangle size={10} className="text-blue-500 fill-blue-50" /><span>Taxpayer Mobile Not Verified</span></span><span className="bg-[#ecfdf5] text-[#10b981] border border-[#10b981]/20 font-bold px-1.5 py-0.5 rounded text-[8px]">Low</span></div>
                          </div>
                        </div>
                      </div>
                      <button id="ai-view-report-btn-half" onClick={handleViewReportClick} aria-expanded={aiReportPopupOpen} aria-controls="ai-report-popup" className="w-full mt-2 py-1 bg-[#edf2ff] hover:bg-[#dbeafe] border border-[#3b82f6]/20 text-[#3b82f6] font-extrabold text-[8.5px] rounded transition-all text-center cursor-pointer shadow-xs shrink-0">View All Report</button>
                    </div>

                    {/* Validation Status */}
                    <div className="bg-white border border-[#002fbe]/25 rounded-lg p-2.5 flex flex-col justify-between shadow-md select-none h-full">
                      <div>
                        <div className="flex items-center justify-between border-b border-gray-100 pb-1.5 mb-2 shrink-0">
                          <h3 className="font-extrabold text-[#002fbe] text-[9.5px] uppercase tracking-wider">Validation Status</h3>
                          <span className="text-gray-400 text-[8.5px] font-bold">(9/11)</span>
                        </div>
                        <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[8.5px]">
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between"><span className="flex items-center gap-1 text-gray-650"><Camera size={10} className="text-blue-600" /><span>Photo</span></span><span className="text-green-600 font-bold">Valid</span></div>
                            <div className="flex items-center justify-between"><span className="flex items-center gap-1 text-gray-655"><Map size={10} className="text-blue-600" /><span>GIS</span></span><span className="text-green-600 font-bold">Verified</span></div>
                            <div className="flex items-center justify-between"><span className="flex items-center gap-1 text-gray-655"><UserCheck size={10} className="text-blue-600" /><span>Aadhaar</span></span><span className="text-green-600 font-bold">Verified</span></div>
                            <div className="flex items-center justify-between"><span className="flex items-center gap-1 text-gray-655"><UserCheck size={10} className="text-blue-600" /><span>Mobile</span></span><span className="text-green-600 font-bold">Verified</span></div>
                            <div className="flex items-center justify-between"><span className="flex items-center gap-1 text-gray-655"><FileText size={10} className="text-blue-600" /><span>Documents</span></span><span className="text-green-600 font-bold">Verified</span></div>
                          </div>
                          <div className="space-y-1.5 border-l border-gray-100 pl-2">
                            <div className="flex items-center justify-between"><span className="flex items-center gap-1 text-gray-655"><Droplet size={10} className="text-blue-600" /><span>Water</span></span><span className="text-orange-500 font-bold">Not Linked</span></div>
                            <div className="flex items-center justify-between"><span className="flex items-center gap-1 text-gray-655"><ShieldCheck size={10} className="text-blue-600" /><span>Fire</span></span><span className="text-red-500 font-bold">Expired</span></div>
                            <div className="flex items-center justify-between"><span className="flex items-center gap-1 text-gray-655"><FileEdit size={10} className="text-blue-600" /><span>Mutation</span></span><span className="text-orange-500 font-bold">Pending</span></div>
                            <div className="flex items-center justify-between"><span className="flex items-center gap-1 text-gray-655"><Link2 size={10} className="text-blue-600" /><span>BPMS</span></span><span className="text-green-600 font-bold">Linked</span></div>
                            <div className="flex items-center justify-between"><span className="flex items-center gap-1 text-gray-655"><UserCheck size={10} className="text-blue-600" /><span>Email</span></span><span className="text-green-600 font-bold">Verified</span></div>
                            <div className="flex items-center justify-between"><span className="flex items-center gap-1 text-gray-655"><Wallet size={10} className="text-blue-600" /><span>Bank</span></span><span className="text-green-600 font-bold">Verified</span></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column (2/5 width): Service & Facility Availability */}
                  <div className="col-span-2 flex flex-col items-stretch overflow-hidden">
                    <div className="flex-grow bg-white border border-[#002fbe]/25 rounded-lg p-2.5 flex flex-col justify-between shadow-md select-none h-full">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-1.5 mb-2 shrink-0">
                        <h3 className="font-extrabold text-[#002fbe] text-[9.5px] uppercase tracking-wider">Service & Facility Availability</h3>
                        <span className="text-gray-400 text-[8.5px] font-bold">(7/8)</span>
                      </div>
                      <div className="flex-1 flex flex-col justify-center my-auto">
                        <div className="relative flex items-center justify-between px-1.5 py-1 text-[7.5px]">
                          <div className="absolute top-[10px] left-[6.25%] right-[6.25%] h-[2px] bg-[#10b981] z-0"></div>
                          {[
                            { l: 'Water', s: '✓' }, { l: 'Road', s: '✓' }, { l: 'Drainage', s: '✓' }, { l: 'Street Light', s: '✓' },
                            { l: 'Fire', s: '✓' }, { l: 'Garden', s: '✕', red: true }, { l: 'Sewer', s: '✓' }, { l: 'Solid Waste', s: '✓' }
                          ].map((v, i) => (
                            <div key={i} className="flex flex-col items-center gap-1.5 flex-1 relative z-10">
                              <div className={`w-5 h-5 rounded-full ${v.red ? 'bg-red-600 text-white' : 'bg-[#10b981] text-white'} flex items-center justify-center font-bold text-[10px] shadow-sm`}>{v.s}</div>
                              <span className="text-[#002fbe] font-bold text-[7.5px] bg-white px-0.5 mt-0.5">{v.l}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              </div>
            )}

            {/* Panel 2-6 definitions */}
          </div>
        </div>

        {/* Right Column: Photos Card + Map Stack */}
        <div className="w-[270px] shrink-0 flex flex-col gap-2.5 h-full">
          <div onMouseEnter={() => handleHoverImage("/blueprint_plan.png")} onMouseLeave={() => handleHoverImage(null)} className="bg-white border border-[#002fbe]/25 rounded-lg p-2 flex flex-col shadow-md group hover:border-[#002fbe] transition-colors cursor-pointer flex-1 min-h-0">
            <div className="text-[9px] font-extrabold text-[#002fbe] mb-1.5 uppercase tracking-wider">Photo Plan</div>
            <div className="overflow-hidden rounded w-full relative bg-gray-50 flex items-center justify-center border border-dashed border-gray-200 flex-1 min-h-0">
              <img src="/blueprint_plan.png" className="w-full h-full object-contain rounded transition-transform duration-500 group-hover:scale-110" alt="Blueprint Plan" onClick={() => openPreview("/blueprint_plan.png")} />
            </div>
          </div>
          
          <div onMouseEnter={() => handleHoverImage("https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop")} onMouseLeave={() => handleHoverImage(null)} className="flex-1 min-h-0 flex flex-col">
            <MapBox title="GIS / Satellite View" imgUrl="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=400&auto=format&fit=crop" onZoom={() => openPreview("https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop")} />
          </div>

          <div onMouseEnter={() => handleHoverImage("https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=800&auto=format&fit=crop")} onMouseLeave={() => handleHoverImage(null)} className="flex-1 min-h-0 flex flex-col">
            <MapBox title="Street View" imgUrl="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=400&auto=format&fit=crop" onZoom={() => openPreview("https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=800&auto=format&fit=crop")} />
          </div>

          <div className="flex-1 min-h-0 flex flex-col">
            <ChangeDetectionBox 
              title="Change Detection" 
              beforeImg="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=400&auto=format&fit=crop" 
              afterImg="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400&auto=format&fit=crop" 
              beforeImgZoom="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop"
              afterImgZoom="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop"
              onHover={(url: string | null) => handleHoverImage(url)}
              onZoom={() => openPreview("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop")} 
            />
          </div>
        </div>
      </div>
      )}


      {/* Floating Hover Zoom Portal */}
      {hoveredImg && (
        <div className={`fixed z-50 w-96 bg-white border border-gray-300 rounded-xl shadow-2xl p-2.5 pointer-events-none animate-fadeIn flex flex-col gap-2 ${hoverPosition === 'left' ? 'left-72 top-[180px]' : 'right-72 top-24'}`}>
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex justify-between">
            <span>Complete Zoom View</span>
            <span className="text-[#1e2b58] font-semibold text-[8px] bg-blue-50 px-1 py-0.25 rounded">Live Preview</span>
          </div>
          <div className="overflow-hidden rounded-lg border border-gray-100 bg-gray-50 h-72 w-full flex items-center justify-center">
            <img src={hoveredImg} className="w-full h-full object-contain" alt="Complete Zoom" />
          </div>
        </div>
      )}

      {aiReportPopupOpen && (
        <>
          {/* Click-outside backdrop overlay */}
          <div 
            className="fixed inset-0 z-40 bg-transparent" 
            onClick={closeAiReport}
          />
          
          {/* Popover Card */}
          <div
            id="ai-report-popup"
            className="absolute z-50 timeline-popup bg-white border border-[#002fbe]/25 rounded-xl shadow-2xl p-3 w-[360px] animate-fadeIn flex flex-col gap-2.5 font-sans"
            style={{
              left: aiReportPopupPosition ? `${aiReportPopupPosition.left}px` : '50%',
              top: aiReportPopupPosition ? `${aiReportPopupPosition.top}px` : '50%',
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="ai-popup-title"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-1.5 border-b border-gray-100 shrink-0">
              <span id="ai-popup-title" className="font-extrabold text-[#002fbe] text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                AI Property Inspection Report
              </span>
              <button
                onClick={closeAiReport}
                className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#002fbe]"
                aria-label="Close report details"
              >
                <span className="text-[12px] font-bold">×</span>
              </button>
            </div>

            {/* Body */}
            <div className="flex-grow overflow-y-auto max-h-[220px] pr-0.5 text-[8.5px] no-scrollbar">
              {aiReportLoading ? (
                <div className="py-8 flex flex-col items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-[#002fbe] border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-gray-400 font-bold">Generating AI compliance audit...</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {/* Status Banner */}
                  <div className="bg-red-50 border border-red-200 text-red-700 p-1.5 rounded font-black text-center uppercase tracking-wider mb-1 shrink-0 flex items-center justify-center gap-1">
                    <span>8 Compliance Issues Flagged</span>
                  </div>

                  {/* Issues */}
                  <div className="space-y-1.5 text-gray-700 font-medium">
                    <div className="p-1 border border-red-100/50 bg-red-50/10 rounded flex flex-col gap-0.5">
                      <div className="flex justify-between items-center">
                        <span className="font-black text-red-650">Possible Commercial Use</span>
                        <span className="bg-red-50 text-red-600 border border-red-200 font-extrabold px-1 rounded text-[7px] scale-90">High</span>
                      </div>
                      <p className="text-gray-450 leading-tight">Satellite change detection matches garage/shop activities.</p>
                    </div>

                    <div className="p-1 border border-red-100/50 bg-red-50/10 rounded flex flex-col gap-0.5">
                      <div className="flex justify-between items-center">
                        <span className="font-black text-red-650">Area Difference Found</span>
                        <span className="bg-red-50 text-red-600 border border-red-200 font-extrabold px-1 rounded text-[7px] scale-90">High</span>
                      </div>
                      <p className="text-gray-450 leading-tight">Sat footprint shows 440 m² vs 400 m² reported (10% diff).</p>
                    </div>

                    <div className="p-1 border border-orange-100/50 bg-orange-50/10 rounded flex flex-col gap-0.5">
                      <div className="flex justify-between items-center">
                        <span className="font-black text-orange-600">Parking Provision Missing</span>
                        <span className="bg-orange-50 text-orange-500 border border-orange-200 font-extrabold px-1 rounded text-[7px] scale-90">Medium</span>
                      </div>
                      <p className="text-gray-450 leading-tight">Design permits lack ground-floor parking configurations.</p>
                    </div>

                    <div className="p-1 border border-orange-100/50 bg-orange-50/10 rounded flex flex-col gap-0.5">
                      <div className="flex justify-between items-center">
                        <span className="font-black text-orange-600">Fire NOC Expired</span>
                        <span className="bg-orange-50 text-orange-500 border border-orange-200 font-extrabold px-1 rounded text-[7px] scale-90">Medium</span>
                      </div>
                      <p className="text-gray-450 leading-tight">Fire NOC has expired in Dec 2023.</p>
                    </div>

                    <div className="p-1 border border-blue-100/50 bg-blue-50/10 rounded flex flex-col gap-0.5">
                      <div className="flex justify-between items-center">
                        <span className="font-black text-blue-650">Duplicate Water Connection</span>
                        <span className="bg-blue-50 text-blue-600 border border-blue-200 font-extrabold px-1 rounded text-[7px] scale-90">Low</span>
                      </div>
                      <p className="text-gray-450 leading-tight">Tap connection matches another property unit in Wing B.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions footer */}
            {!aiReportLoading && (
              <div className="pt-1.5 border-t border-gray-100 flex justify-end gap-1.5 shrink-0">
                <button
                  onClick={() => alert('Printing full AI audit summary...')}
                  className="px-2.5 py-1 border border-gray-200 text-gray-600 hover:bg-gray-50 text-[8.5px] font-black rounded cursor-pointer transition-colors focus:outline-none"
                >
                  Print
                </button>
                <button
                  onClick={() => alert('Opening full detailed dashboard report...')}
                  className="flex-1 text-center py-1 bg-blue-50 border border-blue-200 hover:bg-blue-100/75 text-[#002fbe] text-[8.5px] font-black rounded cursor-pointer transition-colors focus:outline-none focus:ring-1 focus:ring-[#002fbe]"
                >
                  View Full Audit Details
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {timelinePopupOpen && selectedTimelineStage && (() => {
        const stageData = stageDataMap[selectedTimelineStage];
        if (!stageData) return null;

        const isAppeal = selectedTimelineStage === 'appeal';
        const isEmpty = !isAppeal && (!stageData.fields || stageData.fields.length === 0);

        return (
          <>
            {/* Click-outside backdrop overlay */}
            <div 
              className="fixed inset-0 z-40 bg-transparent" 
              onClick={closeStageDetails}
            />
            
            {/* Popover Card */}
            <div
              id={`timeline-popup-${selectedTimelineStage}`}
              className="absolute z-50 timeline-popup bg-white border border-[#002fbe]/25 rounded-xl shadow-2xl p-3 w-[360px] animate-fadeIn flex flex-col gap-2.5 font-sans"
              style={{
                left: popupPosition ? `${popupPosition.left}px` : '50%',
                top: popupPosition ? `${popupPosition.top}px` : '50%',
              }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="popup-title"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-1.5 border-b border-gray-100 shrink-0">
                <span id="popup-title" className="font-extrabold text-[#002fbe] text-[10px] uppercase tracking-wider">
                  {stageData.title}
                </span>
                <button
                  onClick={closeStageDetails}
                  className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#002fbe]"
                  aria-label="Close details"
                >
                  <span className="text-[12px] font-bold">×</span>
                </button>
              </div>

              {/* Body Content */}
              <div className="flex-grow overflow-y-auto max-h-[220px] pr-0.5 text-[8.5px] no-scrollbar">
                {timelineLoading ? (
                  <div className="py-8 flex flex-col items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-[#002fbe] border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-gray-400 font-bold">Loading stage details...</span>
                  </div>
                ) : timelineError ? (
                  <div className="py-6 flex flex-col items-center justify-center gap-2 text-center">
                    <span className="text-red-500 font-bold">{timelineError}</span>
                    <button
                      onClick={handleRetryLoad}
                      className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-650 font-black border border-red-200 rounded cursor-pointer transition-all"
                    >
                      Retry
                    </button>
                  </div>
                ) : isAppeal ? (
                  <div className="py-4 text-center font-bold text-gray-500">
                    No appeal information is currently available.
                  </div>
                ) : isEmpty ? (
                  <div className="py-4 text-center font-bold text-gray-500">
                    No details available for this stage.
                  </div>
                ) : (
                  <div className="space-y-1.5 font-medium text-gray-700">
                    {stageData.fields.map((field: any, idx: number) => {
                      const isStatusField = field.label.toLowerCase().includes('status');
                      let statusBadge = null;

                      if (isStatusField) {
                        let badgeBg = 'bg-slate-100 text-slate-600 border-slate-200';
                        if (field.value === 'Completed') {
                          badgeBg = 'bg-green-50 text-green-700 border-green-200';
                        } else if (field.value === 'In Progress') {
                          badgeBg = 'bg-blue-50 text-blue-700 border-blue-200';
                        } else if (field.value === 'Pending') {
                          badgeBg = 'bg-slate-50 text-slate-600 border-slate-200';
                        }
                        statusBadge = (
                          <span className={`px-1.5 py-0.5 rounded-full border text-[7.5px] font-extrabold ${badgeBg}`}>
                            {field.value}
                          </span>
                        );
                      }

                      // Check if value highlights mutation steps or in progress details
                      const isMutationStep = selectedTimelineStage === 'mutation' && 
                        ['current processing stage', 'pending action', 'responsible department', 'expected next step'].includes(field.label.toLowerCase());

                      return (
                        <div 
                          key={idx} 
                          className={`flex items-start justify-between gap-2 py-0.5 ${
                            isMutationStep ? 'bg-blue-50/50 p-1 rounded border border-blue-100/50' : ''
                          }`}
                        >
                          <span className={`text-gray-400 font-bold shrink-0 ${
                            isMutationStep ? 'text-[#002fbe]' : ''
                          }`}>
                            {field.label}
                          </span>
                          <span className={`text-right font-black ${
                            isStatusField ? '' : 'text-gray-900'
                          } ${isMutationStep ? 'text-blue-900 font-black' : ''}`}>
                            {statusBadge || field.value}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Action Button */}
              {stageData.hasFullDetails && !timelineLoading && !timelineError && (
                <div className="pt-1.5 border-t border-gray-100 flex justify-end shrink-0">
                  <button
                    onClick={() => alert(`Opening full dashboard record for ${stageData.title}...`)}
                    className="w-full text-center py-1 bg-blue-50 border border-blue-200 hover:bg-blue-100/75 text-[#002fbe] text-[8.5px] font-black rounded cursor-pointer transition-colors focus:outline-none focus:ring-1 focus:ring-[#002fbe]"
                  >
                    View Full Details
                  </button>
                </div>
              )}
            </div>
          </>
        );
      })()}

      {/* Cool Hover Zoom Backdrop / Modal overlay */}
      {selectedImg && (
        <div
          onClick={() => setSelectedImg(null)}
          className="fixed inset-0 bg-black/75 flex items-center justify-center z-[999] cursor-zoom-out animate-fadeIn font-sans"
        >
          <div className="relative max-w-4xl max-h-[85vh] p-2 bg-white rounded-xl shadow-2xl">
            <img src={selectedImg} alt="Large Preview" className="max-w-full max-h-[80vh] rounded-lg object-contain" />
            <div className="text-center text-xs text-gray-500 mt-2 font-medium">Click anywhere to close preview</div>
          </div>
        </div>
      )}
    </div>
  );
}

/* Helper Components */

function StatusBadge({ icon, title, status, statusColor, isBlue }: any) {
  const bgClass = isBlue ? 'bg-blue-50 text-blue-650' : 'bg-green-50 text-green-650';
  return (
    <div className="flex items-center gap-2 pr-4 border-r border-gray-200 last:border-0 last:pr-0 shrink-0 flex-1 justify-center">
      <div className={`p-1.5 rounded-full flex items-center justify-center ${bgClass} w-7 h-7`}>
        {icon}
      </div>
      <div>
        <div className="text-[9px] text-[#002fbe] font-bold leading-none">{title}</div>
        <div className={`text-[9.5px] font-extrabold mt-0.5 leading-none ${statusColor || 'text-green-600'}`}>{status}</div>
      </div>
    </div>
  );
}

function Tab({ icon, label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-4 py-2 rounded-t-lg transition-all cursor-pointer text-[10px] font-bold border-t border-l border-r relative z-10 -mb-[1px] ${
        active 
          ? 'bg-white text-[#002fbe] border-[#002fbe] border-b-white z-20' 
          : 'bg-[#002fbe] text-white border-transparent hover:bg-[#002fbe]/90 z-10'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function ComparisonCard({ icon, title, oldVal, newVal, change }: any) {
  return (
    <div className="border border-[#002fbe]/25 rounded-lg py-1.5 px-2.5 bg-white shadow-md flex items-start gap-2 flex-1">
      <div className="bg-gray-50 p-1 rounded-full border border-gray-100 mt-0.5">
        {icon}
      </div>
      <div className="flex-1 text-[10px] leading-tight">
        <div className="font-extrabold text-[#002fbe] mb-0.5">{title}</div>
        <div className="flex justify-between items-end">
          <div className="space-y-0.5">
            <div className="text-gray-600 font-bold">OLD: <span className="font-black text-gray-900">{oldVal}</span></div>
            <div className="text-gray-600 font-bold">NEW: <span className="font-black text-gray-950">{newVal}</span></div>
          </div>
          {change && <div>{change}</div>}
        </div>
      </div>
    </div>
  );
}

function InfoList({ title, items }: any) {
  return (
    <div className="flex-1 min-w-0 bg-white border border-[#002fbe]/25 rounded-lg p-2 shadow-xs">
      <div className="font-bold text-[#002fbe] mb-1.5 uppercase tracking-wider truncate border-b border-gray-100 pb-1">{title}</div>
      <ul className="space-y-1">
        {items.map((it: any, idx: number) => (
          <div key={idx} className="flex flex-col text-[8.5px] leading-none mb-1">
            <span className="text-gray-400 font-bold truncate mb-0.5">{it.label}</span>
            <span className={`font-extrabold truncate ${it.valueColor || 'text-gray-800'}`}>{it.value}</span>
          </div>
        ))}
      </ul>
    </div>
  );
}

function TimelineStep({ id, label, date, active, isInProgress, isPending, onClick, isSelected }: any) {
  let circleBg = 'bg-slate-400';
  let symbol = '?';
  let statusText = 'Pending';
  if (active) {
    circleBg = 'bg-[#10b981]';
    symbol = '✓';
    statusText = 'Completed';
  } else if (isInProgress) {
    circleBg = 'bg-blue-600';
    symbol = '●';
    statusText = 'In Progress';
  }

  return (
    <button
      id={`timeline-node-${id}`}
      onClick={(e) => onClick(id, e)}
      aria-label={`View ${label} details (${statusText})`}
      aria-expanded={isSelected}
      aria-controls={isSelected ? `timeline-popup-${id}` : undefined}
      className={`flex flex-col items-center gap-0.5 relative z-10 flex-1 min-w-0 cursor-pointer outline-none group focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 rounded transition-all ${
        isSelected ? 'scale-105' : 'hover:scale-105'
      }`}
    >
      <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-white font-extrabold shadow-sm transition-all ${circleBg} text-[8px] group-hover:brightness-95 group-active:scale-90`}>
        {symbol}
      </div>
      <div className="text-center font-extrabold text-[7.5px] text-[#002fbe] truncate w-full leading-none mt-0.5 group-hover:underline">{label}</div>
      <div className="text-center font-bold text-[6.5px] text-gray-500 truncate w-full leading-none mt-0.5">{date}</div>
    </button>
  );
}

function ValStatus({ icon, label, status, warn, danger }: any) {
  let statusColor = 'text-green-600';
  let statusIcon = <CheckCircle2 size={10} className="text-green-500 shrink-0" />;

  if (warn) {
    statusColor = 'text-amber-600';
    statusIcon = <AlertTriangle size={10} className="text-amber-500 shrink-0" />;
  }
  if (danger) {
    statusColor = 'text-red-600';
    statusIcon = <AlertTriangle size={10} className="text-red-500 shrink-0" />;
  }

  return (
    <div className="flex flex-col items-center flex-1 min-w-[62px] bg-white rounded border border-gray-200 p-1 text-center shadow-xs">
      <div className="flex items-center gap-0.5 text-[8.5px] text-gray-500 font-bold truncate leading-none mb-1">
        {icon}
        <span>{label}</span>
      </div>
      <div className={`flex items-center gap-0.5 font-bold text-[8.5px] ${statusColor} leading-none mt-0.5`}>
        {statusIcon}
        <span>{status}</span>
      </div>
    </div>
  );
}

function ActionButton({ icon, label, bg, text, borderClass }: any) {
  return (
    <button className={`flex items-center justify-center gap-1 px-2 py-1.5 rounded text-[9px] font-bold ${bg} ${text} ${borderClass || 'border border-transparent'} hover:brightness-95 transition-all cursor-pointer shadow-xs truncate`}>
      {icon} <span className="truncate">{label}</span>
    </button>
  );
}

function MapBox({ title, imgUrl, onZoom }: any) {
  return (
    <div className="bg-white border border-[#002fbe]/25 rounded-lg overflow-hidden flex flex-col group shadow-md hover:border-[#002fbe] transition-colors flex-1 min-h-0">
      <div className="px-2 py-1 font-extrabold text-[#002fbe] text-[9px] bg-gray-50 border-b border-gray-100 uppercase tracking-wider">{title}</div>
      <div className="w-full bg-gray-200 relative overflow-hidden flex-1 min-h-0">
        <img
          src={imgUrl}
          className="w-full h-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-150 cursor-pointer"
          alt={title}
          onClick={onZoom}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 flex items-center justify-center transition-all duration-300">
          <Maximize2 size={16} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="absolute top-1.5 right-1.5 bg-white/80 p-0.5 rounded shadow-sm group-hover:bg-white transition-colors pointer-events-none">
          <MapPin size={11} className="text-red-600" />
        </div>
      </div>
    </div>
  );
}

// Custom interactive Before/After comparison slider box for Change Detection
function ChangeDetectionBox({ title, beforeImg, afterImg, beforeImgZoom, afterImgZoom, onHover, onZoom }: any) {
  const [sliderPos, setSliderPos] = useState(50);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    if (percentage < sliderPos) {
      onHover(afterImgZoom);
    } else {
      onHover(beforeImgZoom);
    }
  };

  const handleMouseLeave = () => {
    onHover(null);
  };

  return (
    <div 
      className="bg-white border border-[#002fbe]/25 rounded-lg overflow-hidden flex flex-col group shadow-md hover:border-[#002fbe] transition-colors relative flex-1 min-h-0"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="px-2 py-1 font-extrabold text-[#002fbe] text-[9px] bg-gray-50 border-b border-gray-100 uppercase tracking-wider flex justify-between items-center">
        <span>{title}</span>
        <span className="text-[7.5px] bg-blue-50 text-blue-600 px-1 py-0.25 rounded font-normal">Drag to compare</span>
      </div>

      <div className="w-full bg-gray-200 relative overflow-hidden select-none flex-1 min-h-0">
        {/* Before Image (Forest field) */}
        <img
          src={beforeImg}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          alt="Before"
        />

        {/* After Image Overlay (Clipped by slider position width) */}
        <div className="absolute inset-0 overflow-hidden z-10 pointer-events-none" style={{ width: `${sliderPos}%` }}>
          {/* Keep width matching the inner card width (268px) to prevent distortion */}
          <img
            src={afterImg}
            className="absolute inset-0 object-cover max-w-none pointer-events-none"
            style={{ width: '268px', height: '100%' }}
            alt="After"
          />
        </div>

        {/* Static Labels overlaying the images (Z-20, pointer-events-none) */}
        <div className="absolute bottom-1.5 left-1.5 bg-[#3b82f6]/95 text-[7px] font-bold text-white px-1 py-0.5 rounded z-20 pointer-events-none uppercase tracking-wider">
          After
        </div>
        <div className="absolute bottom-1.5 right-1.5 bg-black/60 text-[7px] font-bold text-white px-1 py-0.5 rounded z-20 pointer-events-none uppercase tracking-wider">
          Before
        </div>

        {/* Vertical divider line */}
        <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-md z-20 pointer-events-none" style={{ left: `${sliderPos}%` }}>
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white border border-gray-300 shadow flex items-center justify-center text-[7.5px] font-bold text-gray-500 pointer-events-none">
            ↔
          </div>
        </div>

        {/* Transparent Range slider overlaid to capture mouse drag events */}
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPos}
          onChange={(e) => setSliderPos(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
        />
      </div>
    </div>
  );
}

const stageDataMap: Record<string, any> = {
  geoSequencing: {
    title: 'GEO SEQUENCING DETAILS',
    status: 'Completed',
    statusType: 'completed',
    fields: [
      { label: 'Geo Sequencing Status', value: 'Completed' },
      { label: 'Sequencing Date', value: '15-Jan-2024' },
      { label: 'GIS Reference Number', value: 'GIS-GEO-2024-0019' },
      { label: 'Property Coordinates', value: '19.0760° N, 72.8777° E' },
      { label: 'Zone', value: 'Zone-A' },
      { label: 'Ward', value: 'Ward-04' },
      { label: 'Survey or Plot Reference', value: 'Plot-129' },
      { label: 'Verified By', value: 'Officer A. R. Sharma' },
      { label: 'Remarks', value: 'Geo-sequencing verify successful. Coordinates verified on GIS map.' },
      { label: 'Last Updated', value: '15-Jan-2024 16:30' },
    ],
    hasFullDetails: true,
  },
  survey: {
    title: 'SURVEY DETAILS',
    status: 'Completed',
    statusType: 'completed',
    fields: [
      { label: 'Survey Status', value: 'Completed' },
      { label: 'Survey Date', value: '10-Feb-2024' },
      { label: 'Survey Number', value: 'SRV-90821-B' },
      { label: 'Surveyor Name', value: 'Inspector Rahul Verma' },
      { label: 'Survey Type', value: 'Physical Audit' },
      { label: 'Plot Area', value: '400.00 m²' },
      { label: 'Built-up Area', value: '440.00 m²' },
      { label: 'Measurement Notes', value: 'Measurements verify 10% area increase due to carpet extensions.' },
      { label: 'Supporting Documents', value: 'Survey_Report.pdf, Ground_Photo.jpg' },
      { label: 'Remarks', value: 'Physical survey completed and signed by surveyor.' },
      { label: 'Last Updated', value: '10-Feb-2024 14:15' },
    ],
    hasFullDetails: true,
  },
  verification: {
    title: 'VERIFICATION DETAILS',
    status: 'Completed',
    statusType: 'completed',
    fields: [
      { label: 'Verification Status', value: 'Completed' },
      { label: 'Verification Date', value: '20-Feb-2024' },
      { label: 'Verified By', value: 'Officer Deepali Patil' },
      { label: 'Verification Type', value: 'Document & Physical Audit' },
      { label: 'Documents Verified', value: 'Sale Deed, Tax Receipts, GIS Coordinate Log' },
      { label: 'GIS Verification', value: 'Verified & Matched' },
      { label: 'Ownership Verification', value: 'Confirmed (Shri Balasaheb Thackeray)' },
      { label: 'Discrepancies Found', value: 'None' },
      { label: 'Remarks', value: 'Document audits are complete. Cross-matched ownership registry successfully.' },
      { label: 'Last Updated', value: '20-Feb-2024 11:20' },
    ],
    hasFullDetails: false,
  },
  assessment: {
    title: 'ASSESSMENT DETAILS',
    status: 'Completed',
    statusType: 'completed',
    fields: [
      { label: 'Assessment Status', value: 'Completed' },
      { label: 'Assessment Date', value: '01-Apr-2024' },
      { label: 'Assessment Number', value: 'ASM-PT-2024-9901' },
      { label: 'Assessed By', value: 'Assessor K. G. Joshi' },
      { label: 'Property Category', value: 'Residential' },
      { label: 'Usage Type', value: 'निवासी (Residential Tenant/Owner)' },
      { label: 'Rateable Value', value: '₹18,45,000' },
      { label: 'Capital Value', value: '₹36,90,000' },
      { label: 'Assessed Tax', value: '₹18,752' },
      { label: 'Remarks', value: 'Annual tax assessment processed on latest rateable values.' },
      { label: 'Last Updated', value: '01-Apr-2024 18:00' },
    ],
    hasFullDetails: true,
  },
  approval: {
    title: 'APPROVAL DETAILS',
    status: 'Completed',
    statusType: 'completed',
    fields: [
      { label: 'Approval Status', value: 'Completed' },
      { label: 'Approval Date', value: '20-Apr-2024' },
      { label: 'Approval Reference Number', value: 'APP-DEC-99812-C' },
      { label: 'Approved By', value: 'Commissioner S. K. Mehta' },
      { label: 'Approval Level', value: 'Level 3 (Final Board)' },
      { label: 'Conditions', value: 'Subject to yearly property tax compliance.' },
      { label: 'Remarks', value: 'Approved for final collection.' },
      { label: 'Last Updated', value: '20-Apr-2024 10:45' },
    ],
    hasFullDetails: false,
  },
  collection: {
    title: 'COLLECTION DETAILS',
    status: 'Completed',
    statusType: 'completed',
    fields: [
      { label: 'Collection Status', value: 'Completed' },
      { label: 'Collection Date', value: '05-May-2024' },
      { label: 'Demand Amount', value: '₹18,752' },
      { label: 'Paid Amount', value: '₹12,456' },
      { label: 'Outstanding Amount', value: '₹6,296' },
      { label: 'Payment Mode', value: 'Net Banking (HDFC)' },
      { label: 'Receipt Number', value: 'REC-882711-PT' },
      { label: 'Transaction Reference', value: 'TXN-8817281928' },
      { label: 'Collection Officer', value: 'Officer Manoj Shinde' },
      { label: 'Last Updated', value: '05-May-2024 15:30' },
    ],
    hasFullDetails: true,
  },
  mutation: {
    title: 'MUTATION DETAILS',
    status: 'In Progress',
    statusType: 'inProgress',
    fields: [
      { label: 'Mutation Status', value: 'In Progress' },
      { label: 'Application Date', value: '29-Jul-2026' },
      { label: 'Mutation Application Number', value: 'MUT-APP-2026-880' },
      { label: 'Current Owner', value: 'Shri Balasaheb Thackeray' },
      { label: 'Proposed Owner', value: 'Smt. Shalini Thackeray' },
      { label: 'Transfer Type', value: 'Inheritance' },
      { label: 'Supporting Documents', value: 'Family Deed, Death Certificate' },
      { label: 'Expected Completion Date', value: '30-Aug-2024' },
      { label: 'Current Processing Stage', value: 'Document Verification Phase' },
      { label: 'Pending Action', value: 'Review by Mutation Officer' },
      { label: 'Responsible Department', value: 'Revenue Department' },
      { label: 'Expected Next Step', value: 'Public Notice Issuance' },
      { label: 'Remarks', value: 'Mutation in progress. Pending final verified inheritance document.' },
      { label: 'Last Updated', value: '29-Jul-2026 12:00' },
    ],
    hasFullDetails: false,
  },
  appeal: {
    title: 'APPEAL DETAILS',
    status: 'Pending',
    statusType: 'pending',
    fields: [],
    hasFullDetails: false,
  }
};
