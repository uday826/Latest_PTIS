import React from 'react';
import { Star } from 'lucide-react';

interface PerformanceSummaryCardProps {
  role?: 'surveyor' | 'qc' | 'final';
}

export default function PerformanceSummaryCard({ role = 'surveyor' }: PerformanceSummaryCardProps) {


  // Surveyor View (default)
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2.5 flex flex-col justify-start xl:col-span-3 w-full relative group xl:h-[148px] shrink-0 animate-fadeIn">
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="star-half-orange" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="50%" stopColor="#e5e7eb" />
          </linearGradient>
        </defs>
      </svg>
      <div className="text-[11.5px] text-[#002fbe] font-extrabold leading-none mb-2 border-b border-gray-100 pb-1.5 flex justify-between items-center uppercase tracking-wide">
        <span>PROPERTY PERFORMANCE SUMMARY</span>
      </div>
      <div className="flex flex-col sm:flex-row items-stretch gap-3 flex-grow min-h-0">
        <div className="w-full sm:w-[48%] flex flex-col justify-between pr-2 sm:border-r sm:border-gray-200 py-0.5">
          <div>
            <div className="text-[9.5px] text-gray-500 font-extrabold uppercase tracking-wider leading-none">Property Grade</div>
            <div className="flex text-orange-500 gap-0.5 mt-1.5 justify-start">
              <Star size={13} fill="#f97316" className="stroke-orange-500" />
              <Star size={13} fill="#f97316" className="stroke-orange-500" />
              <Star size={13} fill="#f97316" className="stroke-orange-500" />
              <Star size={13} fill="#f97316" className="stroke-orange-500" />
              <Star size={13} fill="url(#star-half-orange)" className="stroke-orange-500" />
              <Star size={13} fill="transparent" className="stroke-gray-300" />
            </div>
            <div className="text-[#002fbe] font-extrabold text-[22px] flex items-baseline leading-none mt-1.5 select-all font-sans">
              <span>6.2</span>
              <span className="text-[11px] text-[#002fbe] font-semibold ml-1">/ 7</span>
            </div>
          </div>
          <div className="mt-1">
            <div className="text-green-600 text-[10.5px] font-bold leading-tight">A+ Grade</div>
            <div className="text-gray-500 text-[9.5px] font-medium leading-tight mt-0.5">Excellent Property</div>
          </div>
        </div>
        <div className="w-full sm:w-[52%] flex flex-col justify-between pl-0 sm:pl-1 py-0.5">
          <div className="text-[9.5px] text-gray-500 font-extrabold uppercase tracking-wider leading-none">Survey Health Score</div>
          <div className="flex items-center gap-2 mt-1 flex-grow">
            <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
              <svg width="56" height="56" viewBox="0 0 56 56" className="transform -rotate-90">
                <circle cx="28" cy="28" r="22" stroke="#10b981" strokeWidth="4.5" strokeOpacity="0.2" fill="transparent" />
                <circle cx="28" cy="28" r="22" stroke="#047857" strokeWidth="4.5" fill="transparent" strokeDasharray="138.2" strokeDashoffset="11.0" strokeLinecap="round" />
              </svg>
              <div className="absolute font-black text-[11px] text-[#002fbe] select-none">92%</div>
            </div>
            <div className="flex-1 flex flex-col justify-center leading-none">
              <div>
                <div className="font-extrabold text-[20px] text-[#002fbe] select-all">92%</div>
                <div className="text-green-600 text-[10px] font-bold mt-1 select-none flex items-center gap-1">
                  <span className="w-1 h-1 bg-green-500 rounded-full" />
                  Excellent
                </div>
              </div>
              <button className="text-[#002fbe] text-[8.5px] font-bold mt-1.5 hover:bg-[#002fbe] hover:text-white transition-all text-center cursor-pointer border border-[#002fbe] rounded-md px-1.5 py-0.25 bg-white w-fit shadow-2xs select-none" type="button">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
