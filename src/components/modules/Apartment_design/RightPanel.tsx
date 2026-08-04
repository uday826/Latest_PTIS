import React, { useState } from 'react';
import { Building2, Maximize2, ChevronLeft, ChevronRight, X, Check } from 'lucide-react';
import MapBox from '../shared/MapBox';
import ChangeDetectionBox from '../shared/ChangeDetectionBox';

interface RightPanelProps {
  onHoverImage: (url: string | null, position?: 'left' | 'right') => void;
  onSelectImage: (url: string, title: string) => void;
  role?: 'surveyor' | 'qc' | 'final';
}

const wingPhotos = [
  { src: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=400&auto=format&fit=crop', label: 'A Wing - Front View' },
  { src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400&auto=format&fit=crop', label: 'B Wing - Front View' },
  { src: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=400&auto=format&fit=crop', label: 'C Wing - Front View' },
  { src: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?q=80&w=400&auto=format&fit=crop', label: 'D Wing - Front View' },
];

export default function RightPanel({ onHoverImage, onSelectImage, role = 'surveyor' }: RightPanelProps) {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  // Removed local OC manager states

  const prevPhoto = () => setActivePhotoIdx((i) => (i === 0 ? wingPhotos.length - 1 : i - 1));
  const nextPhoto = () => setActivePhotoIdx((i) => (i === wingPhotos.length - 1 ? 0 : i + 1));

  return (
    <div className="w-full lg:w-[280px] shrink-0 flex flex-col gap-1 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pr-1.5 select-none">
      

      {/* Visual Intelligence - Wing Photos */}
      <div className="bg-white border border-gray-200 rounded-xl p-1.5 flex flex-col shadow-sm shrink-0">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <Building2 size={13} className="text-[#002fbe]" />
            <span className="text-[10px] font-black text-[#1e2b58] uppercase tracking-wider">Visual Intelligence</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-1">
          <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Wing Photos <span className="text-gray-400 font-medium">({wingPhotos.length} Wings)</span></span>
          <button className="text-[8.5px] font-bold text-[#3b82f6] hover:underline cursor-pointer">View All</button>
        </div>

        {/* Photo Carousel */}
        <div className="relative group rounded-lg overflow-hidden border border-gray-100 bg-gray-50 h-[140px]">
          <img
            src={wingPhotos[activePhotoIdx].src}
            alt={wingPhotos[activePhotoIdx].label}
            className="w-full h-full object-cover transition-all duration-300 cursor-pointer"
            onClick={() => onSelectImage(wingPhotos[activePhotoIdx].src, wingPhotos[activePhotoIdx].label)}
            onMouseEnter={() => onHoverImage(wingPhotos[activePhotoIdx].src, 'left')}
            onMouseLeave={() => onHoverImage(null)}
          />
          {/* Left Arrow */}
          <button
            onClick={prevPhoto}
            className="absolute left-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/80 hover:bg-white shadow flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Previous photo"
          >
            <ChevronLeft size={14} className="text-gray-700" />
          </button>
          {/* Right Arrow */}
          <button
            onClick={nextPhoto}
            className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/80 hover:bg-white shadow flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Next photo"
          >
            <ChevronRight size={14} className="text-gray-700" />
          </button>
          {/* Caption overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-2 pb-1.5 pt-4">
            <span className="text-[8.5px] font-bold text-white drop-shadow">{wingPhotos[activePhotoIdx].label}</span>
          </div>
        </div>

        {/* Dot Indicators */}
        <div className="flex items-center justify-center gap-1.5 mt-1.5">
          {wingPhotos.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActivePhotoIdx(idx)}
              className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                idx === activePhotoIdx ? 'bg-[#002fbe] scale-110' : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`View wing photo ${idx + 1}`}
            />
          ))}
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
        <div className="overflow-hidden rounded-lg w-full h-[125px] bg-gray-50 flex items-center justify-center border border-dashed border-gray-200">
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
        />
      </div>

      {/* Media Section: Street View */}
      <div className="flex flex-col">
        <MapBox 
          title="Street View" 
          imgUrl="/street_view.jpg" 
          onZoom={() => onSelectImage("/street_view.jpg", "Street View")}
          onHover={(url) => onHoverImage(url, "left")}
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
        />
      </div>

  </div>
  );
}
