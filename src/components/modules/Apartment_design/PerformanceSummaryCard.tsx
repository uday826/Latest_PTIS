import React from 'react';
import { Star } from 'lucide-react';

interface PerformanceSummaryCardProps {
  role?: 'surveyor' | 'qc' | 'final';
}

export default function PerformanceSummaryCard({ role = 'surveyor' }: PerformanceSummaryCardProps) {
  if (role === 'qc') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3.5 flex flex-col justify-between xl:col-span-3 w-full relative group xl:h-[185px] shrink-0 animate-fadeIn">
        <div className="text-[13.5px] text-[#8a6d1c] font-bold leading-none mb-2.5 border-b border-gray-100 pb-2 flex justify-between items-center">
          <span>QC AUDITOR VERIFICATION SUMMARY</span>
          <span className="text-[9.5px] bg-amber-50 text-[#8a6d1c] px-2 py-0.5 rounded border border-amber-200 font-extrabold uppercase">Queue Level: Medium</span>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch gap-4 flex-grow min-h-0">
          <div className="w-full sm:w-[48%] flex flex-col justify-between pr-2.5 sm:border-r sm:border-gray-200 py-0.5">
            <div>
              <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider leading-none">Pending Verification</div>
              <div className="text-amber-600 font-extrabold text-[26px] mt-2 select-all font-sans leading-none">
                <span>14 Units</span>
              </div>
            </div>
            <div className="mt-2.5">
              <div className="text-amber-700 text-[12px] font-bold leading-tight">SLA Limit: 24 Hours</div>
              <div className="text-gray-500 text-[10.5px] font-medium leading-tight mt-0.5">Discrepancy validation active</div>
            </div>
          </div>
          <div className="w-full sm:w-[52%] flex flex-col justify-between pl-0 sm:pl-1 py-0.5">
            <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider leading-none">Validation Health Score</div>
            <div className="flex items-center gap-3.5 mt-1.5 flex-grow">
              <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                <svg width="64" height="64" viewBox="0 0 64 64" className="transform -rotate-90">
                  <circle cx="32" cy="32" r="25" stroke="#f59e0b" strokeWidth="5" strokeOpacity="0.2" fill="transparent" />
                  <circle cx="32" cy="32" r="25" stroke="#d97706" strokeWidth="5" fill="transparent" strokeDasharray="157.1" strokeDashoffset="31.42" strokeLinecap="round" />
                </svg>
                <div className="absolute font-black text-[13px] text-amber-700 select-none">80%</div>
              </div>
              <div className="flex-1 flex flex-col justify-center leading-none">
                <div>
                  <div className="font-extrabold text-[16px] text-[#1e2b58]">12 Approved</div>
                  <div className="font-extrabold text-[11px] text-red-500 mt-1">2 Rejected</div>
                </div>
                <button className="text-amber-700 text-[9.5px] font-bold mt-2 hover:bg-amber-750 hover:text-white transition-all text-center cursor-pointer border border-amber-500 rounded-lg px-2 py-0.5 bg-white w-fit shadow-2xs select-none" type="button">
                  Verification Queue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (role === 'final') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3.5 flex flex-col justify-between xl:col-span-3 w-full relative group xl:h-[185px] shrink-0 animate-fadeIn">
        <div className="text-[13.5px] text-[#006a4e] font-bold leading-none mb-2.5 border-b border-gray-100 pb-2 flex justify-between items-center">
          <span>FINAL APPROVER SIGN-OFF STATUS</span>
          <span className="text-[9.5px] bg-green-50 text-[#006a4e] px-2 py-0.5 rounded border border-green-200 font-extrabold uppercase">Municipal Ledger Lock</span>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch gap-4 flex-grow min-h-0">
          <div className="w-full sm:w-[48%] flex flex-col justify-between pr-2.5 sm:border-r sm:border-gray-200 py-0.5">
            <div>
              <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider leading-none">Assessed Demand Lockups</div>
              <div className="text-[#006a4e] font-extrabold text-[26px] mt-2 select-all font-sans leading-none">
                <span>₹1.53 Cr</span>
              </div>
            </div>
            <div className="mt-2.5">
              <div className="text-green-700 text-[12px] font-bold leading-tight">4 Pending Approvals</div>
              <div className="text-gray-500 text-[10.5px] font-medium leading-tight mt-0.5">Gazette notification compliance</div>
            </div>
          </div>
          <div className="w-full sm:w-[52%] flex flex-col justify-between pl-0 sm:pl-1 py-0.5">
            <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider leading-none">Sign-off Ratio</div>
            <div className="flex items-center gap-3.5 mt-1.5 flex-grow">
              <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                <svg width="64" height="64" viewBox="0 0 64 64" className="transform -rotate-90">
                  <circle cx="32" cy="32" r="25" stroke="#10b981" strokeWidth="5" strokeOpacity="0.2" fill="transparent" />
                  <circle cx="32" cy="32" r="25" stroke="#059669" strokeWidth="5" fill="transparent" strokeDasharray="157.1" strokeDashoffset="7.8" strokeLinecap="round" />
                </svg>
                <div className="absolute font-black text-[13px] text-[#006a4e] select-none">95%</div>
              </div>
              <div className="flex-1 flex flex-col justify-center leading-none">
                <div>
                  <div className="font-extrabold text-[16px] text-[#1e2b58]">38 Locked</div>
                  <div className="font-extrabold text-[11px] text-blue-500 mt-1">4 Escalated</div>
                </div>
                <button className="text-[#006a4e] text-[9.5px] font-bold mt-2 hover:bg-[#006a4e] hover:text-white transition-all text-center cursor-pointer border border-[#006a4e] rounded-lg px-2 py-0.5 bg-white w-fit shadow-2xs select-none" type="button">
                  Approvals Registry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Surveyor View (default)
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3.5 flex flex-col justify-between xl:col-span-3 w-full relative group xl:h-[185px] shrink-0 animate-fadeIn">
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="star-half-orange" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="50%" stopColor="#e5e7eb" />
          </linearGradient>
        </defs>
      </svg>
      <div className="text-[13.5px] text-[#002fbe] font-bold leading-none mb-2.5 border-b border-gray-100 pb-2 flex justify-between items-center">
        <span>PROPERTY PERFORMANCE SUMMARY (SURVEYOR VIEW)</span>
        <span className="text-[9.5px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-200 font-extrabold uppercase">Field Survey Active</span>
      </div>
      <div className="flex flex-col sm:flex-row items-stretch gap-4 flex-grow min-h-0">
        <div className="w-full sm:w-[48%] flex flex-col justify-between pr-2.5 sm:border-r sm:border-gray-200 py-0.5">
          <div>
            <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider leading-none">Property Grade</div>
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
            <div className="text-green-600 text-[12px] font-bold leading-tight">A+ Grade</div>
            <div className="text-gray-500 text-[10.5px] font-medium leading-tight mt-0.5">Excellent Property</div>
          </div>
        </div>
        <div className="w-full sm:w-[52%] flex flex-col justify-between pl-0 sm:pl-1 py-0.5">
          <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider leading-none">Survey Health Score</div>
          <div className="flex items-center gap-3.5 mt-1.5 flex-grow">
            <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
              <svg width="64" height="64" viewBox="0 0 64 64" className="transform -rotate-90">
                <circle cx="32" cy="32" r="25" stroke="#10b981" strokeWidth="5" strokeOpacity="0.2" fill="transparent" />
                <circle cx="32" cy="32" r="25" stroke="#047857" strokeWidth="5" fill="transparent" strokeDasharray="157.1" strokeDashoffset="12.6" strokeLinecap="round" />
              </svg>
              <div className="absolute font-black text-[13px] text-[#002fbe] select-none">92%</div>
            </div>
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
