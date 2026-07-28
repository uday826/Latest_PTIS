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
    <div className="flex flex-wrap xl:flex-nowrap items-stretch gap-3 w-full font-sans">

      {/* Card 1: Main Property Info & Details */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3.5 flex flex-1 flex-wrap xl:flex-nowrap items-center gap-5 relative overflow-visible z-20">
        {/* Background visual accent */}
        <div className="absolute top-0 left-0 w-1.5 h-full bg-[#002fbe] rounded-l-xl pointer-events-none" />

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
          <button className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#002fbe] shadow-sm hover:bg-gray-50 transition-colors cursor-pointer" title="Update photo">
            <Camera size={12} />
          </button>
        </div>

        {/* 2. Property ID / UPIC & Holder Block */}
        <div className="min-w-[210px] space-y-2 shrink-0">
          <div>
            <div className="text-[10px] text-[#002fbe] uppercase tracking-wider font-extrabold">Property ID / UPIC</div>
            <div className="flex items-center gap-1.5 mt-0.5 relative">
              <span className="font-extrabold text-[#002fbe] text-sm tracking-wide select-all">UPIC-270465-2024-000123</span>
              <button
                onClick={handleCopy}
                className="p-1 hover:bg-gray-100 rounded text-[#002fbe] transition-colors cursor-pointer"
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

          <div className="space-y-1 text-[11px] leading-tight">
            <div className="flex items-center">
              <span className="font-bold text-[#002fbe] w-[110px]">Owner</span>
              <span className="font-bold text-[#002fbe] mr-2">:</span>
              <span className="font-extrabold text-[#002fbe] uppercase">MATOSHREE BUILDERS PVT LTD</span>
            </div>
            <div className="flex items-center">
              <span className="font-bold text-[#002fbe] w-[110px]">Property Description</span>
              <span className="font-bold text-[#002fbe] mr-2">:</span>
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
                  className="font-extrabold text-red-650 cursor-pointer hover:bg-red-50 px-1 rounded transition-colors"
                  title="Click to edit"
                >
                  {description}
                </span>
              )}
            </div>
            <div className="flex items-center">
              <span className="font-bold text-[#002fbe] w-[110px]">Property Holder</span>
              <span className="font-bold text-[#002fbe] mr-2">:</span>
              <span className="font-extrabold text-[#002fbe] uppercase">MATOSHREE BUILDERS</span>
            </div>
          </div>
        </div>

        {/* 3. Specifications Middle Columns */}
        <div className="flex-[2.5] grid grid-cols-3 gap-x-4 gap-y-2 min-w-[320px] text-[10px] shrink-0 leading-tight">
          {/* Column 1 */}
          <div className="space-y-2.5">
            <div>
              <div className="text-[#002fbe] font-bold uppercase tracking-wider text-[8.5px]">Division</div>
              <div className="font-extrabold text-[#002fbe] text-[11px] mt-0.5">कोपरी</div>
            </div>
            <div>
              <div className="text-[#002fbe] font-bold uppercase tracking-wider text-[8.5px]">Mouja Name</div>
              <div className="font-extrabold text-[#002fbe] text-[11px] mt-0.5">Kopri</div>
            </div>
            <div>
              <div className="text-[#002fbe] font-bold uppercase tracking-wider text-[8.5px]">Category</div>
              <div className="font-extrabold text-[#002fbe] text-[11px] mt-0.5">Individual</div>
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-2.5">
            <div>
              <div className="text-[#002fbe] font-bold uppercase tracking-wider text-[8.5px]">Survey No.</div>
              <div className="font-extrabold text-[#002fbe] text-[11px] mt-0.5">CSN005A</div>
            </div>
            <div>
              <div className="text-[#002fbe] font-bold uppercase tracking-wider text-[8.5px]">SubZone No.</div>
              <div className="font-extrabold text-[#002fbe] text-[11px] mt-0.5">-</div>
            </div>
            <div>
              <div className="text-[#002fbe] font-bold uppercase tracking-wider text-[8.5px]">Flat / Shop No.</div>
              <div className="font-extrabold text-[#002fbe] text-[11px] mt-0.5">-</div>
            </div>
          </div>

          {/* Column 3 */}
          <div className="space-y-2.5">
            <div>
              <div className="text-[#002fbe] font-bold uppercase tracking-wider text-[8.5px]">Plot No.</div>
              <div className="font-extrabold text-[#002fbe] text-[11px] mt-0.5">55</div>
            </div>
            <div>
              <div className="text-[#002fbe] font-bold uppercase tracking-wider text-[8.5px]">Wing</div>
              <div className="font-extrabold text-[#002fbe] text-[11px] mt-0.5">-</div>
            </div>
            <div>
              <div className="text-[#002fbe] font-bold uppercase tracking-wider text-[8.5px]">Tax Zone</div>
              <div className="font-extrabold text-[#002fbe] text-[11px] mt-0.5">1 - KOLSHEET</div>
            </div>
          </div>
        </div>

        {/* 4. Areas Column Layout */}
        <div className="min-w-[175px] shrink-0 space-y-2">
          {/* Plot Area */}
          <div className="flex items-center gap-2 group relative">
            <div className="bg-blue-50 p-1.5 rounded-md mt-0.5 shrink-0 border border-blue-100/55">
              <BarChart2 size={13} className="text-[#002fbe]" />
            </div>
            <div>
              <div className="text-[8.5px] text-[#002fbe] font-bold uppercase tracking-wider">Plot Area (ft/mtr)</div>
              <div className="font-extrabold text-[11.5px] text-[#002fbe] mt-0.5">4305.60 / 400.00</div>
            </div>
          </div>

          {/* Carpet Area */}
          <div className="flex items-center gap-2 group relative">
            <div className="bg-blue-50 p-1.5 rounded-md mt-0.5 shrink-0 border border-blue-100/55">
              <Ruler size={13} className="text-[#002fbe]" />
            </div>
            <div>
              <div className="text-[8.5px] text-[#002fbe] font-bold uppercase tracking-wider">Carpet Area (ft/mtr)</div>
              <div className="font-extrabold text-[11.5px] text-[#002fbe] mt-0.5">538.20 / 50.00</div>
            </div>
          </div>

          {/* Built-up Area */}
          <div className="flex items-center gap-2 group relative">
            <div className="bg-blue-50 p-1.5 rounded-md mt-0.5 shrink-0 border border-blue-100/55">
              <Camera size={13} className="text-[#002fbe]" />
            </div>
            <div>
              <div className="text-[8.5px] text-[#002fbe] font-bold uppercase tracking-wider">Built-up Area (ft/mtr)</div>
              <div className="font-extrabold text-[11.5px] text-[#002fbe] mt-0.5">538.20 / 50.00</div>
            </div>
          </div>
        </div>
      </div>

      {/* Card 2: Property Grade & Index */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col justify-between w-[220px] shrink-0 relative group">
        <div className="text-[11px] text-[#002fbe] font-extrabold uppercase tracking-wider select-none">
          Property Grade & Index
        </div>
        <div className="flex text-orange-500 gap-1 mt-2.5">
          <Star size={20} fill="currentColor" className="stroke-orange-500" />
          <Star size={20} fill="currentColor" className="stroke-orange-500" />
          <Star size={20} fill="currentColor" className="stroke-orange-500" />
          <Star size={20} fill="currentColor" className="stroke-orange-500" />
          <Star size={20} className="text-gray-300" />
        </div>
        <div className="text-[#002fbe] font-extrabold text-[24px] flex items-baseline leading-none mt-2.5">
          <span>6.2</span>
          <span className="text-[12px] text-gray-400 font-bold ml-1">/ 7</span>
        </div>
        <div className="text-green-600 text-[9.5px] font-extrabold uppercase tracking-wider mt-2.5">
          A+ Grade • Excellent Property
        </div>
      </div>

      {/* Card 3: Health Score */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col justify-between w-[250px] shrink-0 relative group">
        <div className="text-[11px] text-[#002fbe] font-extrabold uppercase tracking-wider select-none">
          Health Score
        </div>
        <div className="flex items-center gap-4 mt-2.5">
          {/* Circle progress */}
          <div className="relative w-18 h-18 flex items-center justify-center shrink-0">
            <svg className="w-18 h-18 transform -rotate-90">
              <circle cx="36" cy="36" r="28" stroke="#e5e7eb" strokeWidth="5" fill="transparent" />
              <circle cx="36" cy="36" r="28" stroke="#047857" strokeWidth="5" fill="transparent" strokeDasharray="175.9" strokeDashoffset="14.1" strokeLinecap="round" />
            </svg>
            <div className="absolute font-extrabold text-[14px] text-[#002fbe]">92%</div>
          </div>

          {/* Stats right */}
          <div className="flex-1 flex flex-col justify-center leading-none">
            <div className="font-extrabold text-[22px] text-green-700">92%</div>
            <div className="text-green-600 text-[11px] font-bold mt-1.5">Excellent</div>
            <button className="text-[#002fbe] text-[9.5px] font-bold mt-2.5 hover:underline text-left cursor-pointer border border-[#002fbe]/20 rounded px-2.5 py-0.5 bg-blue-50/30 w-fit">
              View Details
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
