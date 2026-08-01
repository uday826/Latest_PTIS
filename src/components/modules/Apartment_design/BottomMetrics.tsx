import React from 'react';
import { Percent, TrendingUp } from 'lucide-react';

export default function BottomMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 shrink-0">
      {/* Area Comparison */}
      <div className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-sm flex flex-col justify-between">
        <span className="text-[10px] font-extrabold text-gray-400 uppercase">Area Comparison</span>
        <div className="my-1 space-y-1.5">
          <div>
            <span className="text-[9px] text-gray-400 font-semibold block leading-none">Carpet Diff.</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[15px] font-black text-gray-800">+312 ft²</span>
              <span className="text-[9.5px] text-green-500 font-extrabold">(+6.86%)</span>
            </div>
          </div>
          <div>
            <span className="text-[9px] text-gray-400 font-semibold block leading-none">BUA Diff.</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[15px] font-black text-gray-800">+290 ft²</span>
              <span className="text-[9.5px] text-green-500 font-extrabold">(+4.07%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Assessment Comparison */}
      <div className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-sm flex flex-col justify-between">
        <span className="text-[10px] font-extrabold text-gray-400 uppercase">Assessment Comparison</span>
        <div className="my-1 space-y-1.5">
          <div>
            <span className="text-[9px] text-gray-400 font-semibold block leading-none">RV Diff.</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[15px] font-black text-gray-800">+₹ 5,821</span>
              <span className="text-[9.5px] text-green-500 font-extrabold">(+16.33%)</span>
            </div>
          </div>
          <div>
            <span className="text-[9px] text-gray-400 font-semibold block leading-none">Tax Diff.</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[15px] font-black text-gray-800">+₹ 10,105</span>
              <span className="text-[9.5px] text-green-500 font-extrabold">(+0.16%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mapping Status */}
      <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm flex flex-col justify-between">
        <span className="text-[10px] font-extrabold text-gray-400 uppercase block pl-0.5">Mapping Status</span>
        <div className="flex items-center gap-3.5 mt-1 select-none">
          {/* Radial progress for total */}
          <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="none" stroke="#f1f5f9" strokeWidth="4" />
              {/* Matched part */}
              <circle cx="18" cy="18" r="16" fill="none" stroke="#22c55e" strokeWidth="4" strokeDasharray="58 100" />
              {/* Modified part */}
              <circle cx="18" cy="18" r="16" fill="none" stroke="#f97316" strokeWidth="4" strokeDasharray="25 100" strokeDashoffset="-58" />
              {/* New/Missing */}
              <circle cx="18" cy="18" r="16" fill="none" stroke="#3b82f6" strokeWidth="4" strokeDasharray="17 100" strokeDashoffset="-83" />
            </svg>
            <div className="absolute font-black text-[12px] text-gray-800">48</div>
          </div>
          {/* mini metrics list */}
          <div className="flex-1 flex flex-col gap-0.5 text-[8.5px] font-extrabold text-gray-500">
            <div className="flex justify-between items-center leading-none">
              <span className="text-green-600 font-black">Matched</span>
              <span>28</span>
            </div>
            <div className="flex justify-between items-center leading-none">
              <span className="text-amber-500 font-black">Modified</span>
              <span>12</span>
            </div>
            <div className="flex justify-between items-center leading-none">
              <span className="text-blue-500 font-black">New</span>
              <span>4</span>
            </div>
            <div className="flex justify-between items-center leading-none">
              <span className="text-red-500 font-black">Missing</span>
              <span>4</span>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Insight */}
      <div className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-sm flex flex-col justify-between">
        <span className="text-[10px] font-extrabold text-gray-400 uppercase">Revenue Insight</span>
        <div className="my-1 space-y-1">
          <div>
            <span className="text-[9px] text-gray-400 font-semibold block leading-none">Potential Revenue</span>
            <span className="text-[15px] font-black text-gray-800">₹ 5,821</span>
          </div>
          <div>
            <span className="text-[9px] text-gray-400 font-semibold block leading-none">Revenue Leakage</span>
            <div className="flex items-baseline gap-1">
              <span className="text-[15px] font-black text-red-500">₹ 3,298</span>
              <span className="text-[9px] text-red-500 font-extrabold">(7.02%)</span>
            </div>
          </div>
          <div className="flex justify-between items-center text-[9px] font-bold pt-1 border-t border-gray-55 mt-1">
            <span className="text-gray-400">Efficiency</span>
            <span className="text-green-500 font-extrabold">87.64% ▲</span>
          </div>
        </div>
      </div>

      {/* Comparison Completion */}
      <div className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-sm flex flex-col justify-between items-center text-center">
        <span className="text-[10px] font-extrabold text-gray-400 uppercase block w-full text-left">Comparison Completion</span>
        
        <div className="relative w-12 h-12 my-1">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="16" fill="none" stroke="#f1f5f9" strokeWidth="3.5" />
            <circle cx="18" cy="18" r="16" fill="none" stroke="#22c55e" strokeWidth="3.5" strokeDasharray="85 100" strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-700">
            <span className="text-[12px] font-black">85%</span>
          </div>
        </div>

        <div className="text-[9px] font-bold text-gray-500 leading-tight">
          <div>41 / 48 Units</div>
          <button className="text-blue-500 hover:underline text-[8.5px] cursor-pointer" type="button">View Incomplete (7)</button>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-2.5 shadow-sm flex flex-col justify-between gap-1">
        <span className="text-[10px] font-extrabold text-gray-400 uppercase">Quick Filters</span>
        
        <div className="space-y-1">
          <select className="w-full bg-gray-50 border border-gray-200 rounded px-1.5 py-0.5 text-[10px] font-bold text-gray-600 outline-none">
            <option>All Status</option>
            <option>Matched</option>
            <option>Modified</option>
            <option>New</option>
            <option>Missing</option>
          </select>
          <select className="w-full bg-gray-50 border border-gray-200 rounded px-1.5 py-0.5 text-[10px] font-bold text-gray-600 outline-none">
            <option>All Use</option>
            <option>Residential</option>
            <option>Commercial</option>
          </select>
        </div>

        <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 text-[10px] font-black py-0.5 rounded transition cursor-pointer" type="button">
          Reset
        </button>
      </div>
    </div>
  );
}
