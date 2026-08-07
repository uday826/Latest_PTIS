import React, { useState } from 'react';
import { Building2, Maximize2, ChevronLeft, ChevronRight, X, Check } from 'lucide-react';
import MapBox from '../shared/MapBox';
import ChangeDetectionBox from '../shared/ChangeDetectionBox';

interface RightPanelProps {
  onHoverImage: (url: string | null, position?: 'left' | 'right') => void;
  onSelectImage: (url: string, title: string) => void;
  selectedWing?: string;
  onChangeWing?: (wing: string) => void;
  role?: 'surveyor' | 'qc' | 'final';
}



const getWingKey = (wingProp?: string): string => {
  if (!wingProp) return 'B Wing';
  if (wingProp.includes('A Wing') || wingProp.includes('A-')) return 'A Wing';
  if (wingProp.includes('B Wing') || wingProp.includes('B-')) return 'B Wing';
  if (wingProp.includes('C Wing') || wingProp.includes('C-')) return 'C Wing';
  if (wingProp.includes('D Wing') || wingProp.includes('D-')) return 'D Wing';
  return 'B Wing';
};

export default function RightPanel({ onHoverImage, onSelectImage, selectedWing, onChangeWing, role = 'surveyor' }: RightPanelProps) {
  const wingKey = getWingKey(selectedWing);

  const getWingImage = (wing: string) => {
    if (wing.includes('A Wing') || wing.includes('A-')) return '/wing_a.jpg';
    if (wing.includes('B Wing') || wing.includes('B-')) return '/wing_b.png';
    if (wing.includes('C Wing') || wing.includes('C-') || wing.includes('C Win')) return '/wing_c.jpg';
    if (wing.includes('D Wing') || wing.includes('D-')) return '/wing_d.jpg';
    return '/wing_b.png';
  };
  const wingImage = getWingImage(wingKey);

  const WINGS_LIST = [
    { key: 'A Wing', value: 'A Wing (19)' },
    { key: 'B Wing', value: 'B Wing (19)' },
    { key: 'C Wing', value: 'C Wing (15)' },
    { key: 'D Wing', value: 'D Wing (14)' },
  ];

  const handleCycleWing = (direction: 'left' | 'right') => {
    const currentIdx = WINGS_LIST.findIndex(w => w.key === wingKey);
    if (currentIdx === -1) return;

    let nextIdx = currentIdx;
    if (direction === 'right') {
      nextIdx = (currentIdx + 1) % WINGS_LIST.length;
    } else {
      nextIdx = (currentIdx - 1 + WINGS_LIST.length) % WINGS_LIST.length;
    }

    if (onChangeWing) {
      onChangeWing(WINGS_LIST[nextIdx].value);
    }
  };

  return (
    <div className="w-full lg:w-[280px] shrink-0 flex flex-col gap-1.5 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pr-1.5 select-none">

      {/* Wing Photo Section */}
      <div
        onMouseEnter={() => onHoverImage(wingImage, "left")}
        onMouseLeave={() => onHoverImage(null)}
        onClick={() => onSelectImage(wingImage, `Wing Photo (${wingKey})`)}
        className="bg-white border border-gray-200 hover:border-blue-500 rounded-xl p-1.5 flex flex-col shadow-xs hover:shadow-md transition-all cursor-pointer transform hover:-translate-y-0.5 shrink-0"
        role="button"
        aria-label={`Open Wing Photo ${wingKey} preview`}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            onSelectImage(wingImage, `Wing Photo (${wingKey})`);
          }
        }}
      >
        <div className="flex justify-between items-center mb-1">
          <div className="flex flex-col gap-0.5">
            <span className="text-[9.5px] font-black text-[#1e2b58] uppercase tracking-wider">Wing Photo</span>
            <span className="text-[8px] text-gray-400 font-bold uppercase tracking-wider">{wingKey}</span>
          </div>
          <Maximize2 size={10} className="text-gray-400 group-hover:text-[#002fbe] transition-colors" />
        </div>
        <div className="overflow-hidden rounded-lg w-full h-[140px] bg-gray-50 flex items-center justify-center border border-dashed border-gray-200 relative group">
          <img src={wingImage} className="w-full h-full object-cover rounded" alt={`Wing Photo - ${wingKey}`} />
          
          {/* Left Arrow Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCycleWing('left');
            }}
            className="absolute left-1 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white/80 backdrop-blur-xs border border-gray-200 hover:bg-white shadow flex items-center justify-center cursor-pointer transition-all active:scale-90 opacity-0 group-hover:opacity-100 z-10"
            aria-label="Previous wing"
          >
            <ChevronLeft size={11} className="text-[#1e2b58]" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCycleWing('right');
            }}
            className="absolute right-1 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white/80 backdrop-blur-xs border border-gray-200 hover:bg-white shadow flex items-center justify-center cursor-pointer transition-all active:scale-90 opacity-0 group-hover:opacity-100 z-10"
            aria-label="Next wing"
          >
            <ChevronRight size={11} className="text-[#1e2b58]" />
          </button>
        </div>
      </div>

      {/* Media Section: Building Plan */}
      <div
        onMouseEnter={() => onHoverImage("/blueprint_plan.png", "left")}
        onMouseLeave={() => onHoverImage(null)}
        onClick={() => onSelectImage("/blueprint_plan.png", "Building Plan (Typical Floor)")}
        className="bg-white border border-gray-200 hover:border-blue-500 rounded-xl p-1.5 flex flex-col shadow-xs hover:shadow-md transition-all cursor-pointer transform hover:-translate-y-0.5"
        role="button"
        aria-label="Open Building Plan preview"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            onSelectImage("/blueprint_plan.png", "Building Plan (Typical Floor)");
          }
        }}
      >
        <div className="flex justify-between items-center mb-1">
          <span className="text-[9.5px] font-black text-[#1e2b58] uppercase tracking-wider">Building Plan <span className="text-[8px] text-gray-400 lowercase font-medium">(Typical Floor)</span></span>
          <Maximize2 size={10} className="text-gray-400 group-hover:text-[#002fbe] transition-colors" />
        </div>
        <div className="overflow-hidden rounded-lg w-full h-[140px] bg-gray-50 flex items-center justify-center border border-dashed border-gray-200">
          <img src="/blueprint_plan.png" className="w-full h-full object-contain rounded" alt="Building Plan" />
        </div>
      </div>

      {/* Media Section: GIS / Satellite View */}
      <div className="flex flex-col">
        <MapBox
          title="GIS / Satellite View"
          imgUrl="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=400&auto=format&fit=crop"
          onZoom={() => onSelectImage("https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop", "GIS / Satellite View")}
          onHover={(url) => onHoverImage(url, "left")}
          height="h-[140px]"
        />
      </div>


      {/* Media Section: Change Detection */}
      <div className="flex flex-col">
        <ChangeDetectionBox
          title="Change Detection"
          beforeImg="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=400&auto=format&fit=crop"
          afterImg="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400&auto=format&fit=crop"
          beforeImgZoom="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop"
          afterImgZoom="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop"
          onHover={(url) => onHoverImage(url, "left")}
          onZoom={() => onSelectImage("change-detection", "Change Detection Slider")}
          height="h-[140px]"
        />
      </div>

    </div>
  );
}
