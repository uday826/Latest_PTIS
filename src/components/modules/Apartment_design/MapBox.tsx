import React from 'react';
import { Maximize2, MapPin } from 'lucide-react';

interface MapBoxProps {
  title: string;
  imgUrl: string;
  onZoom: () => void;
  onHover: (url: string | null) => void;
}

export default function MapBox({ title, imgUrl, onZoom, onHover }: MapBoxProps) {
  return (
    <div 
      className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col group shadow-xs hover:shadow-md hover:border-blue-500 transition-all cursor-pointer transform hover:-translate-y-0.5 shrink-0"
      onClick={onZoom}
      onMouseEnter={() => onHover && onHover(imgUrl)}
      onMouseLeave={() => onHover && onHover(null)}
      role="button"
      aria-label={`Open ${title} preview`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          onZoom();
        }
      }}
    >
      <div className="px-2.5 py-1 font-black text-[#1e2b58] text-[9.5px] bg-gray-50 border-b border-gray-150 uppercase tracking-wider flex justify-between items-center select-none">
        <span>{title}</span>
        <Maximize2 size={10} className="text-gray-400 group-hover:text-[#002fbe] transition-colors" />
      </div>
      <div className="w-full h-[125px] bg-gray-200 relative overflow-hidden">
        <img
          src={imgUrl}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          alt={title}
        />
        <div className="absolute top-1.5 right-1.5 bg-white/90 p-0.5 rounded shadow-sm">
          <MapPin size={11} className="text-red-600" />
        </div>
      </div>
    </div>
  );
}
