import React from 'react';
import { Star } from 'lucide-react';

export default function PerformanceSummaryCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2.5 flex flex-col justify-between xl:col-span-3 w-full relative group xl:h-[185px] shrink-0 select-none">
      {/* local linear gradient definition for half star */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="star-half-orange" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="50%" stopColor="#e5e7eb" />
          </linearGradient>
        </defs>
      </svg>

      {/* Card Title */}
      <div className="text-[12.5px] text-[#002fbe] font-extrabold select-none leading-none mb-2 border-b border-gray-100 pb-1.5">
        PROPERTY PERFORMANCE SUMMARY
      </div>

      {/* Two Columns Grid/Flexbox Layout */}
      <div className="flex flex-col sm:flex-row items-stretch gap-3 flex-grow min-h-0">
        {/* Left Column: Property Grade */}
        <div className="w-full sm:w-[48%] flex flex-col justify-between pr-2 sm:border-r sm:border-gray-200 py-0.5">
          <div>
            <div className="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider leading-none">
              Property Grade
            </div>
            <div className="flex text-orange-500 gap-0.5 mt-1.5 justify-start">
              <Star size={13.5} fill="#f97316" className="stroke-orange-500" />
              <Star size={13.5} fill="#f97316" className="stroke-orange-500" />
              <Star size={13.5} fill="#f97316" className="stroke-orange-500" />
              <Star size={13.5} fill="#f97316" className="stroke-orange-500" />
              <Star size={13.5} fill="url(#star-half-orange)" className="stroke-orange-500" />
              <Star size={13.5} fill="transparent" className="stroke-gray-300" />
            </div>
            <div className="text-[#002a8f] font-black text-[23px] flex items-baseline leading-none mt-1.5 select-all font-sans">
              <span>6.2</span>
              <span className="text-[12px] text-[#1749b5] font-extrabold ml-0.5">/ 7</span>
            </div>
          </div>
          <div>
            <div className="text-green-600 text-[12px] font-black leading-tight">
              A+ Grade
            </div>
            <div className="text-gray-500 text-[10px] font-bold leading-tight mt-0.5">
              Excellent Property
            </div>
          </div>
        </div>

        {/* Right Column: Health Score */}
        <div className="w-full sm:w-[52%] flex flex-col justify-between pl-0 sm:pl-1 py-0.5">
          <div className="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider leading-none">
            Health Score
          </div>
          
          <div className="flex items-center gap-2.5 mt-1 flex-grow">
            {/* Circle progress - Compact */}
            <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
              <svg width="56" height="56" viewBox="0 0 56 56" className="transform -rotate-90">
                <circle cx="28" cy="28" r="22" stroke="#10b981" strokeWidth="4.5" strokeOpacity="0.2" fill="transparent" />
                <circle 
                  cx="28" 
                  cy="28" 
                  r="22" 
                  stroke="#047857" 
                  strokeWidth="4.5" 
                  fill="transparent" 
                  strokeDasharray="138.2" 
                  strokeDashoffset="11.0" 
                  strokeLinecap="round" 
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute font-black text-[12px] text-[#002a8f] select-none">92%</div>
            </div>

            {/* Stats right */}
            <div className="flex-1 flex flex-col justify-center leading-none">
              <div>
                <div className="font-black text-[22px] text-[#002a8f] select-all">92%</div>
                <div className="text-green-600 text-[11px] font-black mt-1 select-none flex items-center gap-1">
                  <span className="w-1 h-1 bg-green-500 rounded-full" />
                  Excellent
                </div>
              </div>
              <button className="text-[#002fbe] text-[9.5px] font-extrabold mt-2 hover:bg-[#002fbe] hover:text-white border border-[#002fbe] rounded-lg px-2 py-0.5 bg-white w-fit shadow-2xs cursor-pointer select-none transition-all" type="button">
                Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
