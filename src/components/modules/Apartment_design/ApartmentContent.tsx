"use client";

import React, { useState } from 'react';
import ActionViews from '../Design/ActionViews';

// Sub-components & Mock Data
import { initialWings, WingDetails } from './mockData';
import PropertyDetailsCard from './PropertyDetailsCard';
import PerformanceSummaryCard from './PerformanceSummaryCard';
import VerificationBadges from './VerificationBadges';
import WingSummary from './WingSummary';
import AddWingModal from './AddWingModal';
import RightPanel from './RightPanel';
import WingMetricDetailsPopup from './WingMetricDetailsPopup';
import ApartmentComparisonView from './ApartmentComparisonView';
import ApartmentImageOverlays from './ApartmentImageOverlays';
import BottomMetrics from './BottomMetrics';

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
  const comparisonTableRef = React.useRef<HTMLDivElement>(null);

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
    <div className="flex-grow flex-1 min-h-0 bg-[#f0f2f5] p-1.5 font-sans text-gray-855 animate-fadeIn relative flex flex-col h-full overflow-hidden">
      {/* 1. Header Overview Sections */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-1.5 w-full shrink-0 mb-1.5">
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
      <div className="flex flex-col lg:flex-row gap-1.5 items-stretch flex-1 min-h-0 w-full overflow-hidden">
        {/* Left Column: Wing Summary, Table, Metrics */}
        <div className="flex-grow flex-1 flex flex-col gap-1 min-h-0 w-full lg:w-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pr-1.5">
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

              // Smoothly scroll the comparison table area into view
              setTimeout(() => {
                comparisonTableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 100);
            }}
          />

          <ApartmentComparisonView 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            selectedWing={selectedWing}
            setSelectedWing={setSelectedWing}
            selectedFloor={selectedFloor}
            setSelectedFloor={setSelectedFloor}
            areaPolicyThreshold={areaPolicyThreshold}
            setAreaPolicyThreshold={setAreaPolicyThreshold}
            diffFilter={diffFilter}
            setDiffFilter={setDiffFilter}
            comparisonTableRef={comparisonTableRef}
            isDashboardExpanded={isDashboardExpanded}
            setIsDashboardExpanded={setIsDashboardExpanded}
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
            selectedWing={selectedWing}
            onChangeWing={(wing) => setSelectedWing(wing)}
            role={role}
          />
        )}
      </div>

      <ApartmentImageOverlays 
        hoveredImg={hoveredImg}
        hoverPosition={hoverPosition}
        selectedImg={selectedImg}
        setSelectedImg={setSelectedImg}
        selectedImgTitle={selectedImgTitle}
      />

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
