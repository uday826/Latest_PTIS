import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Maximize2, 
  MapPin 
} from 'lucide-react';

export function StatusBadge({ icon, title, status, statusColor, isBlue }: any) {
  const bgClass = isBlue ? 'bg-blue-50 text-blue-655' : 'bg-green-50 text-green-655';
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

export function Tab({ icon, label, active, onClick }: any) {
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

export function TimelineStep({ id, label, date, active, isInProgress, onClick, isSelected }: any) {
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
      <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-white font-semibold shadow-sm transition-all ${circleBg} text-[8px] group-hover:brightness-95 group-active:scale-90`}>
        {symbol}
      </div>
      <div className="text-center font-semibold text-[7.5px] text-[#002fbe] truncate w-full leading-none mt-0.5 group-hover:underline">{label}</div>
      <div className="text-center font-medium text-[6.5px] text-gray-555 truncate w-full leading-none mt-0.5">{date}</div>
    </button>
  );
}

export function MapBox({ title, imgUrl, onZoom, onHover }: any) {
  return (
    <div 
      onMouseEnter={() => onHover && onHover(imgUrl)}
      onMouseLeave={() => onHover && onHover(null)}
      className="bg-white border border-[#002fbe]/25 rounded-lg overflow-hidden flex flex-col group shadow-md hover:border-[#002fbe] transition-colors flex-1 min-h-0 cursor-pointer"
      onClick={onZoom}
    >
      <div className="px-2 py-1 font-extrabold text-[#002fbe] text-[9px] bg-gray-50 border-b border-gray-100 uppercase tracking-wider flex justify-between items-center select-none">
        <span>{title}</span>
        <Maximize2 size={10} className="text-gray-400 group-hover:text-[#002fbe] transition-colors" />
      </div>
      <div className="w-full bg-gray-200 relative overflow-hidden flex-1 min-h-0">
        <img
          src={imgUrl}
          className="w-full h-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-110"
          alt={title}
        />
        <div className="absolute top-1.5 right-1.5 bg-white/80 p-0.5 rounded shadow-sm group-hover:bg-white transition-colors pointer-events-none">
          <MapPin size={11} className="text-red-600" />
        </div>
      </div>
    </div>
  );
}

export function ChangeDetectionBox({ title, beforeImg, afterImg, beforeImgZoom, afterImgZoom, onHover, onZoom }: any) {
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
        <img
          src={beforeImg}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          alt="Before"
        />

        <div className="absolute inset-0 overflow-hidden z-10 pointer-events-none" style={{ width: `${sliderPos}%` }}>
          <img
            src={afterImg}
            className="absolute inset-0 object-cover max-w-none pointer-events-none"
            style={{ width: '268px', height: '100%' }}
            alt="After"
          />
        </div>

        <div className="absolute bottom-1.5 left-1.5 bg-[#3b82f6]/95 text-[7px] font-bold text-white px-1 py-0.5 rounded z-20 pointer-events-none uppercase tracking-wider">
          After
        </div>
        <div className="absolute bottom-1.5 right-1.5 bg-black/60 text-[7px] font-bold text-white px-1 py-0.5 rounded z-20 pointer-events-none uppercase tracking-wider">
          Before
        </div>

        <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-md z-20 pointer-events-none" style={{ left: `${sliderPos}%` }}>
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white border border-gray-300 shadow flex items-center justify-center text-[7.5px] font-bold text-gray-500 pointer-events-none">
            ↔
          </div>
        </div>

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
