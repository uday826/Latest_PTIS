import React from 'react';
import { Plus } from 'lucide-react';
import WingCard from './WingCard';
import { WingDetails } from './mockData';

interface WingSummaryProps {
  summaryRef: React.RefObject<HTMLDivElement | null>;
  wings: WingDetails[];
  activeMetrics: Record<string, 'discount' | 'exemptions' | 'rvImpact'>;
  handleMetricClick: (e: React.MouseEvent<HTMLButtonElement>, wing: WingDetails, metricType: 'discount' | 'exemptions' | 'rvImpact') => void;
  handleDeleteWing: (e: React.MouseEvent<HTMLButtonElement>, wingId: string) => void;
  onAddWingClick: () => void;
}

export default function WingSummary({
  summaryRef,
  wings,
  activeMetrics,
  handleMetricClick,
  handleDeleteWing,
  onAddWingClick
}: WingSummaryProps) {
  return (
    <div ref={summaryRef} className="bg-white border border-gray-200 rounded-xl p-3 shadow-xs relative shrink-0">
      {/* Section Title & Legend Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 px-1 gap-2 select-none">
        <div className="flex items-baseline gap-1.5">
          <h3 className="text-[12px] font-black text-[#1e2b58] tracking-tight uppercase">Wing Intelligence</h3>
          <span className="text-[9px] text-gray-500 font-bold">(Click any wing to load comparison)</span>
        </div>
        
        {/* Legend Row */}
        <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 text-[9px] font-bold text-gray-555">
          <span className="flex items-center gap-1">
            <span className="text-green-600 font-black text-[9.5px]">A+</span>
            <span className="text-gray-700 font-bold text-[8.5px]">: Excellent (90%+)</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="text-green-500 font-black text-[9.5px]">A</span>
            <span className="text-gray-700 font-bold text-[8.5px]">: Good (75-90%)</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="text-orange-500 font-black text-[9.5px]">B</span>
            <span className="text-gray-700 font-bold text-[8.5px]">: Average (50-75%)</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="text-amber-500 font-black text-[9.5px]">C</span>
            <span className="text-gray-700 font-bold text-[8.5px]">: Poor (&lt;50%)</span>
          </span>
        </div>
      </div>

      {/* Horizontal row of Wing cards */}
      <div className="flex gap-2.5 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        {wings.map((wing) => (
          <div key={wing.wing} className="flex-grow flex-shrink-0 flex-1 min-w-[190px] max-w-[245px]">
            <WingCard 
              wing={wing}
              activeMetric={activeMetrics[wing.id] || 'discount'}
              onMetricClick={handleMetricClick}
              onDeleteClick={handleDeleteWing}
            />
          </div>
        ))}
        
        {/* Add Wing Card */}
        <div className="flex-grow flex-shrink-0 flex-1 min-w-[190px] max-w-[245px]">
          <button 
            onClick={onAddWingClick}
            className="flex flex-col justify-center items-center bg-white border border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50/10 cursor-pointer transition-all p-2.5 h-full min-h-[185px] focus:ring-1 focus:ring-blue-500 outline-none w-full"
            aria-label="Add new Wing"
          >
            <div className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center border border-gray-200 text-[#3b82f6]">
              <Plus size={15} />
            </div>
            <span className="text-[10px] font-black text-[#3b82f6] mt-2 uppercase tracking-wider">Add Wing</span>
          </button>
        </div>
      </div>
    </div>
  );
}
