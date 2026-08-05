import React, { useState } from 'react';
import { Building2, Maximize2, ChevronLeft, ChevronRight, X, Check } from 'lucide-react';
import MapBox from '../shared/MapBox';
import ChangeDetectionBox from '../shared/ChangeDetectionBox';

interface RightPanelProps {
  onHoverImage: (url: string | null, position?: 'left' | 'right') => void;
  onSelectImage: (url: string, title: string) => void;
  selectedWing?: string;
  role?: 'surveyor' | 'qc' | 'final';
}

const wingPhotosData: Record<string, { src: string; label: string }[]> = {
  'A Wing': [
    { src: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=400&auto=format&fit=crop', label: 'A Wing Front' },
    { src: 'https://images.unsplash.com/photo-1554384965-f9a15900fdae?q=80&w=400&auto=format&fit=crop', label: 'A Wing Entrance' },
    { src: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=400&auto=format&fit=crop', label: 'A Wing Lobby' },
    { src: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?q=80&w=400&auto=format&fit=crop', label: 'A Wing Side' },
    { src: 'https://images.unsplash.com/photo-1592595896551-12b371d546d5?q=80&w=400&auto=format&fit=crop', label: 'A Wing Yard' },
  ],
  'B Wing': [
    { src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400&auto=format&fit=crop', label: 'B Wing Front' },
    { src: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=400&auto=format&fit=crop', label: 'B Wing Entrance' },
    { src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=400&auto=format&fit=crop', label: 'B Wing Lobby' },
    { src: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=400&auto=format&fit=crop', label: 'B Wing Side' },
    { src: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=400&auto=format&fit=crop', label: 'B Wing Yard' },
  ],
  'C Wing': [
    { src: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=400&auto=format&fit=crop', label: 'C Wing Front' },
    { src: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=400&auto=format&fit=crop', label: 'C Wing Entrance' },
    { src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=400&auto=format&fit=crop', label: 'C Wing Lobby' },
    { src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=400&auto=format&fit=crop', label: 'C Wing Side' },
    { src: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=400&auto=format&fit=crop', label: 'C Wing Yard' },
  ],
  'D Wing': [
    { src: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?q=80&w=400&auto=format&fit=crop', label: 'D Wing Front' },
    { src: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?q=80&w=400&auto=format&fit=crop', label: 'D Wing Entrance' },
    { src: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=400&auto=format&fit=crop', label: 'D Wing Lobby' },
    { src: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=400&auto=format&fit=crop', label: 'D Wing Side' },
    { src: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=400&auto=format&fit=crop', label: 'D Wing Yard' },
  ],
};

const getWingKey = (wingProp?: string): string => {
  if (!wingProp) return 'B Wing';
  if (wingProp.includes('A Wing') || wingProp.includes('A-')) return 'A Wing';
  if (wingProp.includes('B Wing') || wingProp.includes('B-')) return 'B Wing';
  if (wingProp.includes('C Wing') || wingProp.includes('C-')) return 'C Wing';
  if (wingProp.includes('D Wing') || wingProp.includes('D-')) return 'D Wing';
  return 'B Wing';
};

export default function RightPanel({ onHoverImage, onSelectImage, selectedWing, role = 'surveyor' }: RightPanelProps) {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  const wingKey = getWingKey(selectedWing);
  const currentPhotos = wingPhotosData[wingKey] || wingPhotosData['B Wing'];

  const prevPhoto = () => setActivePhotoIdx((i) => (i === 0 ? currentPhotos.length - 1 : i - 1));
  const nextPhoto = () => setActivePhotoIdx((i) => (i === currentPhotos.length - 1 ? 0 : i + 1));

  // Determine index values for 3 side-by-side images in loop
  const firstIdx = activePhotoIdx;
  const secondIdx = (activePhotoIdx + 1) % currentPhotos.length;
  const thirdIdx = (activePhotoIdx + 2) % currentPhotos.length;

  const activeIndices = [firstIdx, secondIdx, thirdIdx];

  return (
    <div className="w-full lg:w-[280px] shrink-0 flex flex-col gap-1 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pr-1.5 select-none">
      
      {/* Visual Intelligence - Wing Photos */}
      <div className="bg-white border border-gray-200 rounded-xl p-1.5 flex flex-col shadow-sm shrink-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5">
            <Building2 size={13} className="text-[#002fbe]" />
            <span className="text-[10px] font-black text-[#1e2b58] uppercase tracking-wider">Visual Intelligence</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[8.5px] font-bold text-[#1e2b58] uppercase tracking-wide">
            Wing Photos <span className="text-gray-400 font-bold lowercase">({wingKey})</span>
          </span>
          <button className="text-[8.5px] font-extrabold text-[#002fbe] hover:underline cursor-pointer">View All</button>
        </div>

        {/* 3 Photos Carousel Container */}
        <div className="relative group flex gap-1 items-center justify-between bg-gray-50/50 p-1.5 rounded-lg border border-gray-150 h-[80px]">
          {activeIndices.map((photoIdx, screenIdx) => {
            const photo = currentPhotos[photoIdx];
            return (
              <div 
                key={screenIdx}
                className="w-[32%] h-full rounded border border-gray-200 overflow-hidden relative shadow-3xs hover:border-blue-400 cursor-pointer"
                onClick={() => onSelectImage(photo.src, photo.label)}
                onMouseEnter={() => onHoverImage(photo.src, 'left')}
                onMouseLeave={() => onHoverImage(null)}
              >
                <img
                  src={photo.src}
                  alt={photo.label}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            );
          })}

          {/* Left Arrow Button */}
          <button
            onClick={prevPhoto}
            className="absolute left-0.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white border border-gray-200 hover:bg-gray-50 shadow flex items-center justify-center cursor-pointer transition-all active:scale-90"
            aria-label="Previous photo"
          >
            <ChevronLeft size={11} className="text-[#1e2b58]" />
          </button>
          
          {/* Right Arrow Button */}
          <button
            onClick={nextPhoto}
            className="absolute right-0.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white border border-gray-200 hover:bg-gray-50 shadow flex items-center justify-center cursor-pointer transition-all active:scale-90"
            aria-label="Next photo"
          >
            <ChevronRight size={11} className="text-[#1e2b58]" />
          </button>
        </div>

        {/* Dot Indicators */}
        <div className="flex items-center justify-center gap-1 mt-1.5">
          {currentPhotos.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActivePhotoIdx(idx)}
              className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
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
