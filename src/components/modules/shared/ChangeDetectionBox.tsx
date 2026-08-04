import React, { useState, useEffect, useRef } from 'react';
import { Maximize2 } from 'lucide-react';

interface ChangeDetectionBoxProps {
  title: string;
  beforeImg: string;
  afterImg: string;
  beforeImgZoom: string;
  afterImgZoom: string;
  onHover: (url: string | null) => void;
  onZoom: () => void;
  isEnlarged?: boolean;
}

export default function ChangeDetectionBox({
  title,
  beforeImg,
  afterImg,
  beforeImgZoom,
  afterImgZoom,
  onHover,
  onZoom,
  isEnlarged
}: ChangeDetectionBoxProps) {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(270);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isEnlarged) return;
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
    if (isEnlarged) return;
    onHover(null);
  };

  return (
    <div
      className={`bg-white border rounded-xl overflow-hidden flex flex-col group transition-all relative shrink-0 flex-1 min-h-0 ${isEnlarged
        ? 'border-gray-200 w-full h-full animate-scaleIn'
        : 'border-gray-200 hover:border-blue-500 hover:shadow-md cursor-pointer transform hover:-translate-y-0.5 shadow-xs'
        }`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={isEnlarged ? undefined : onZoom}
      role={isEnlarged ? undefined : "button"}
      aria-label={isEnlarged ? undefined : "Open Change Detection preview"}
      tabIndex={isEnlarged ? undefined : 0}
      onKeyDown={(e) => {
        if (!isEnlarged && (e.key === ' ' || e.key === 'Enter')) {
          e.preventDefault();
          onZoom();
        }
      }}
    >
      <div className="px-2.5 py-1 font-black text-[#1e2b58] text-[9.5px] bg-gray-50 border-b border-gray-150 uppercase tracking-wider flex justify-between items-center select-none">
        <span>{title}</span>
        {!isEnlarged ? (
          <div className="flex items-center gap-1.5">
            <span className="text-[7.5px] bg-blue-50 text-blue-600 px-1 py-0.25 rounded font-normal">Drag to compare</span>
            <Maximize2 size={10} className="text-gray-400 group-hover:text-[#002fbe] transition-colors" />
          </div>
        ) : (
          <span className="text-[8px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold">Use slider below to compare</span>
        )}
      </div>

      <div ref={containerRef} className={`w-full relative overflow-hidden select-none bg-gray-100 ${isEnlarged ? 'flex-1 min-h-0' : 'h-[125px]'}`}>
        {/* Before Image */}
        <img
          src={beforeImg}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          alt="Before"
        />

        {/* After Image Overlay */}
        <div className="absolute inset-0 overflow-hidden z-10 pointer-events-none" style={{ width: `${sliderPos}%` }}>
          <img
            src={afterImg}
            className="absolute inset-0 object-cover max-w-none pointer-events-none"
            style={{ width: `${containerWidth}px`, height: '100%' }}
            alt="After"
          />
        </div>

        {/* Labels */}
        <div className="absolute bottom-1.5 left-1.5 bg-[#3b82f6]/95 text-[7px] font-bold text-white px-1 py-0.5 rounded z-20 pointer-events-none uppercase tracking-wider">
          After (2024)
        </div>
        <div className="absolute bottom-1.5 right-1.5 bg-black/60 text-[7px] font-bold text-white px-1 py-0.5 rounded z-20 pointer-events-none uppercase tracking-wider">
          Before (2023)
        </div>

        {/* Vertical divider line */}
        <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-md z-20 pointer-events-none" style={{ left: `${sliderPos}%` }}>
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border border-gray-300 shadow flex items-center justify-center text-[8px] font-bold text-gray-500 pointer-events-none">
            ↔
          </div>
        </div>

        {/* Range slider */}
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPos}
          onChange={(e) => setSliderPos(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
}
