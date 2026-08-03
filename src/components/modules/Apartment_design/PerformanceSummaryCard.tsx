import React from 'react';
import { Star } from 'lucide-react';

export default function PerformanceSummaryCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3.5 flex flex-col justify-between xl:col-span-3 w-full relative group xl:h-[185px] shrink-0">
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
      <div className="text-[13.5px] text-[#002fbe] font-bold leading-none mb-2.5 border-b border-gray-100 pb-2">
        PROPERTY PERFORMANCE SUMMARY
      </div>

      {/* Two Columns Grid/Flexbox Layout */}
      <div className="flex flex-col sm:flex-row items-stretch gap-4 flex-grow min-h-0">
        {/* Left Column: Property Grade */}
        <div className="w-full sm:w-[48%] flex flex-col justify-between pr-2.5 sm:border-r sm:border-gray-200 py-0.5">
          <div>
            <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider leading-none">
              Property Grade
            </div>
            <div className="flex text-orange-500 gap-0.5 mt-2 justify-start">
              <Star size={16} fill="#f97316" className="stroke-orange-500" />
              <Star size={16} fill="#f97316" className="stroke-orange-500" />
              <Star size={16} fill="#f97316" className="stroke-orange-500" />
              <Star size={16} fill="#f97316" className="stroke-orange-500" />
              <Star size={16} fill="url(#star-half-orange)" className="stroke-orange-500" />
              <Star size={16} fill="transparent" className="stroke-gray-300" />
            </div>
            <div className="text-[#002fbe] font-extrabold text-[26px] flex items-baseline leading-none mt-2 select-all font-sans">
              <span>6.2</span>
              <span className="text-[13px] text-[#002fbe] font-semibold ml-1">/ 7</span>
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-green-600 text-[12px] font-bold leading-tight">
              A+ Grade
            </div>
            <div className="text-gray-500 text-[10.5px] font-medium leading-tight mt-0.5">
              Excellent Property
            </div>
          </div>
        </div>

        {/* Right Column: Health Score */}
        <div className="w-full sm:w-[52%] flex flex-col justify-between pl-0 sm:pl-1 py-0.5">
          <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider leading-none">
            Health Score
          </div>
          
          <div className="flex items-center gap-3.5 mt-1.5 flex-grow">
            {/* Circle progress - Compact */}
            <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
              <svg width="64" height="64" viewBox="0 0 64 64" className="transform -rotate-90">
                <circle cx="32" cy="32" r="25" stroke="#10b981" strokeWidth="5" strokeOpacity="0.2" fill="transparent" />
                <circle 
                  cx="32" 
                  cy="32" 
                  r="25" 
                  stroke="#047857" 
                  strokeWidth="5" 
                  fill="transparent" 
                  strokeDasharray="157.1" 
                  strokeDashoffset="12.6" 
                  strokeLinecap="round" 
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute font-black text-[13px] text-[#002fbe] select-none">92%</div>
            </div>

            {/* Stats right */}
            <div className="flex-1 flex flex-col justify-center leading-none">
              <div>
                <div className="font-extrabold text-[24px] text-[#002fbe] select-all">92%</div>
                <div className="text-green-600 text-[11px] font-bold mt-1.5 select-none flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  Excellent
                </div>
              </div>
              <button className="text-[#002fbe] text-[9.5px] font-bold mt-2.5 hover:bg-[#002fbe] hover:text-white transition-all text-center cursor-pointer border border-[#002fbe] rounded-lg px-2 py-0.5 bg-white w-fit shadow-2xs select-none" type="button">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
