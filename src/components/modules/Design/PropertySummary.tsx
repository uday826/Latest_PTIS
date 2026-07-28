"use client";

import React, { useState } from 'react';
import { Copy, MapPin, Camera, Star, Info, Ruler, BarChart2 } from 'lucide-react';

export default function PropertySummary({ onHoverImg, onClickImg }: { onHoverImg?: (url: string | null) => void; onClickImg?: (url: string) => void }) {
  const [copied, setCopied] = useState(false);
  const [description, setDescription] = useState('निवासी');
  const [isEditingDesc, setIsEditingDesc] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('UPIC-270465-2024-000123');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-3.5 flex flex-wrap xl:flex-nowrap items-center gap-4 font-sans w-full transition-all hover:shadow-lg relative overflow-visible z-30">

      {/* Background visual accent */}
      <div className="absolute top-0 left-0 w-1.5 h-full bg-[#1e2b58] rounded-l-xl pointer-events-none" />

      {/* 1. Image Section */}
      <div
        onMouseEnter={() => onHoverImg && onHoverImg("https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop")}
        onMouseLeave={() => onHoverImg && onHoverImg(null)}
        onClick={() => onClickImg && onClickImg("https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop")}
        className="relative w-36 h-24 shrink-0 rounded-lg overflow-hidden border border-gray-200 group cursor-pointer hover:border-blue-300 transition-colors bg-gray-50"
      >
        <img
          src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=300&auto=format&fit=crop"
          alt="Property"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-125 cursor-zoom-in"
        />
        <button className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-blue-600 shadow-sm hover:bg-gray-50 transition-colors cursor-pointer" title="Update photo">
          <Camera size={12} />
        </button>
      </div>

      {/* 2. Property ID / UPIC & Holder Block */}
      <div className="min-w-[210px] space-y-2 shrink-0">
        <div>
          <div className="text-[10px] text-[#1e2b58] uppercase tracking-wider font-extrabold">Property ID / UPIC</div>
          <div className="flex items-center gap-1.5 mt-0.5 relative">
            <span className="font-extrabold text-[#1e2b58] text-sm tracking-wide select-all">UPIC-270465-2024-000123</span>
            <button
              onClick={handleCopy}
              className="p-1 hover:bg-gray-100 rounded text-blue-600 transition-colors cursor-pointer"
              title="Copy UPIC"
            >
              <Copy size={13} />
            </button>

            {/* Copied tooltip */}
            {copied && (
              <span className="absolute left-full ml-2 bg-green-600 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow z-50">
                Copied!
              </span>
            )}
          </div>
          <div className="mt-1 flex items-center">
            <span className="bg-green-50 text-green-700 border border-green-200 text-[9px] px-2 py-0.5 rounded font-extrabold uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Active Property
            </span>
          </div>
        </div>

        <div className="space-y-1 text-[11px] leading-tight text-gray-650">
          <div className="flex items-center">
            <span className="font-semibold text-gray-500 w-[110px]">Owner</span>
            <span className="font-semibold text-gray-500 mr-2">:</span>
            <span className="font-bold text-[#1e2b58] uppercase">MATOSHREE BUILDERS PVT LTD</span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold text-gray-500 w-[110px]">Property Description</span>
            <span className="font-semibold text-gray-500 mr-2">:</span>
            {isEditingDesc ? (
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={() => setIsEditingDesc(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingDesc(false)}
                className="border border-blue-200 rounded px-1 text-xs font-bold text-red-650 outline-none w-20"
                autoFocus
              />
            ) : (
              <span
                onClick={() => setIsEditingDesc(true)}
                className="font-extrabold text-red-600 cursor-pointer hover:bg-red-50 px-1 rounded transition-colors"
                title="Click to edit"
              >
                {description}
              </span>
            )}
          </div>
          <div className="flex items-center">
            <span className="font-semibold text-gray-500 w-[110px]">Property Holder</span>
            <span className="font-semibold text-gray-500 mr-2">:</span>
            <span className="font-bold text-[#1e2b58] uppercase">MATOSHREE BUILDERS</span>
          </div>
        </div>
      </div>

      {/* 3. Specifications Middle Columns */}
      <div className="flex-[2.5] grid grid-cols-3 gap-x-4 gap-y-2 min-w-[320px] text-[10px] shrink-0 leading-tight">
        {/* Column 1 */}
        <div className="space-y-2.5">
          <div>
            <div className="text-gray-400 font-semibold uppercase tracking-wider text-[8.5px]">Division</div>
            <div className="font-bold text-[#1e2b58] text-[11px] mt-0.5">कोपरी</div>
          </div>
          <div>
            <div className="text-gray-400 font-semibold uppercase tracking-wider text-[8.5px]">Mouja Name</div>
            <div className="font-bold text-[#1e2b58] text-[11px] mt-0.5">Kopri</div>
          </div>
          <div>
            <div className="text-gray-400 font-semibold uppercase tracking-wider text-[8.5px]">Category</div>
            <div className="font-bold text-[#1e2b58] text-[11px] mt-0.5">Individual</div>
          </div>
        </div>

        {/* Column 2 */}
        <div className="space-y-2.5">
          <div>
            <div className="text-gray-400 font-semibold uppercase tracking-wider text-[8.5px]">Survey No.</div>
            <div className="font-bold text-[#1e2b58] text-[11px] mt-0.5">CSN005A</div>
          </div>
          <div>
            <div className="text-gray-400 font-semibold uppercase tracking-wider text-[8.5px]">SubZone No.</div>
            <div className="font-bold text-[#1e2b58] text-[11px] mt-0.5">-</div>
          </div>
          <div>
            <div className="text-gray-400 font-semibold uppercase tracking-wider text-[8.5px]">Flat / Shop No.</div>
            <div className="font-bold text-[#1e2b58] text-[11px] mt-0.5">-</div>
          </div>
        </div>

        {/* Column 3 */}
        <div className="space-y-2.5">
          <div>
            <div className="text-gray-400 font-semibold uppercase tracking-wider text-[8.5px]">Plot No.</div>
            <div className="font-bold text-[#1e2b58] text-[11px] mt-0.5">55</div>
          </div>
          <div>
            <div className="text-gray-400 font-semibold uppercase tracking-wider text-[8.5px]">Wing</div>
            <div className="font-bold text-[#1e2b58] text-[11px] mt-0.5">-</div>
          </div>
          <div>
            <div className="text-gray-400 font-semibold uppercase tracking-wider text-[8.5px]">Tax Zone</div>
            <div className="font-bold text-[#1e2b58] text-[11px] mt-0.5">1 - KOLSHEET</div>
          </div>
        </div>
      </div>

      {/* 4. Areas Column Layout */}
      <div className="min-w-[175px] shrink-0 space-y-2 border-l border-gray-150 pl-4">
        {/* Plot Area */}
        <div className="flex items-center gap-2 group relative">
          <div className="bg-blue-50 p-1.5 rounded-md mt-0.5 shrink-0 border border-blue-100/50">
            <BarChart2 size={13} className="text-blue-500" />
          </div>
          <div>
            <div className="text-[8.5px] text-gray-400 font-bold uppercase tracking-wider">Plot Area (ft/mtr)</div>
            <div className="font-extrabold text-[11.5px] text-[#1e2b58] mt-0.5">4305.60 / 400.00</div>
          </div>
        </div>

        {/* Carpet Area */}
        <div className="flex items-center gap-2 group relative">
          <div className="bg-blue-50 p-1.5 rounded-md mt-0.5 shrink-0 border border-blue-100/50">
            <Ruler size={13} className="text-blue-500" />
          </div>
          <div>
            <div className="text-[8.5px] text-gray-400 font-bold uppercase tracking-wider">Carpet Area (ft/mtr)</div>
            <div className="font-extrabold text-[11.5px] text-[#1e2b58] mt-0.5">538.20 / 50.00</div>
          </div>
        </div>

        {/* Built-up Area */}
        <div className="flex items-center gap-2 group relative">
          <div className="bg-blue-50 p-1.5 rounded-md mt-0.5 shrink-0 border border-blue-100/50">
            <Camera size={13} className="text-blue-500" />
          </div>
          <div>
            <div className="text-[8.5px] text-gray-400 font-bold uppercase tracking-wider">Built-up Area (ft/mtr)</div>
            <div className="font-extrabold text-[11.5px] text-[#1e2b58] mt-0.5">538.20 / 50.00</div>
          </div>
        </div>
      </div>

      {/* 5. Ratings & Score Right Block */}
      <div className="flex gap-2.5 shrink-0 pl-1">
        {/* Star Rating Card */}
        <div className="border border-gray-200 rounded-xl p-2 flex flex-col justify-between bg-white w-[130px] relative group shadow-sm transition-all duration-300">
          <div className="text-[8.5px] text-[#1e2b58] font-extrabold uppercase tracking-wider flex items-center gap-1 select-none">
            Property Grade & Index
          </div>
          <div className="flex items-center justify-between mt-2.5">
            <div className="flex text-orange-500 gap-0.5">
              <Star size={11} fill="currentColor" className="stroke-orange-500" />
              <Star size={11} fill="currentColor" className="stroke-orange-500" />
              <Star size={11} fill="currentColor" className="stroke-orange-500" />
              <Star size={11} fill="currentColor" className="stroke-orange-500" />
              <Star size={11} className="text-gray-300" />
            </div>
            <div className="text-[#1e2b58] font-extrabold text-[13px] flex items-baseline leading-none">
              <span>6.2</span>
              <span className="text-[8.5px] text-gray-400 font-semibold ml-0.5">/ 7</span>
            </div>
          </div>
          <div className="text-green-600 text-[8px] font-extrabold uppercase tracking-wider mt-3">
            A+ Grade • Excellent Property
          </div>
        </div>

        {/* Health Score Card */}
        <div className="border border-gray-200 rounded-xl p-2 flex flex-col justify-between bg-white w-[140px] relative group shadow-sm transition-all duration-300">
          <div className="text-[8.5px] text-[#1e2b58] font-extrabold uppercase tracking-wider select-none">
            Health Score
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            {/* Circle progress */}
            <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
              <svg className="w-10 h-10 transform -rotate-90">
                <circle cx="20" cy="20" r="15" stroke="#e5e7eb" strokeWidth="3" fill="transparent" />
                <circle cx="20" cy="20" r="15" stroke="#047857" strokeWidth="3" fill="transparent" strokeDasharray="94.2" strokeDashoffset="7.5" strokeLinecap="round" />
              </svg>
              <div className="absolute font-extrabold text-[9px] text-[#1e2b58]">92%</div>
            </div>

            {/* Stats right */}
            <div className="flex-1 flex flex-col justify-center leading-none">
              <div className="font-extrabold text-[12px] text-green-700">92%</div>
              <div className="text-green-600 text-[8.5px] font-bold mt-0.5">Excellent</div>
              <button className="text-[#2563eb] text-[8px] font-bold mt-1.5 hover:underline text-left cursor-pointer border border-[#2563eb]/20 rounded px-1 py-0.25 bg-blue-50/30 w-fit">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
