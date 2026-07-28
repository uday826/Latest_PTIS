"use client";

import React from 'react';
import { 
  FileEdit, 
  Printer, 
  FileText, 
  Wallet, 
  AlertTriangle, 
  History, 
  Download, 
  ChevronDown 
} from 'lucide-react';

export default function FooterActionBar() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-2 flex items-center justify-between gap-3 shadow-md select-none w-full">
      <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[11px] font-extrabold bg-[#edf2ff] text-[#3b82f6] border border-[#3b82f6]/20 hover:bg-[#dbeafe] transition-all cursor-pointer shadow-sm flex-1 truncate">
        <FileEdit size={14} className="text-[#3b82f6] shrink-0" />
        <span className="truncate">Edit Property</span>
      </button>
      <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[11px] font-extrabold bg-[#ecfdf5] text-[#10b981] border border-[#10b981]/20 hover:bg-[#d1fae5] transition-all cursor-pointer shadow-sm flex-1 truncate">
        <Printer size={14} className="text-[#10b981] shrink-0" />
        <span className="truncate">Print Property Card</span>
      </button>
      <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[11px] font-extrabold bg-[#f5f3ff] text-[#8b5cf6] border border-[#8b5cf6]/20 hover:bg-[#ede9fe] transition-all cursor-pointer shadow-sm flex-1 truncate">
        <FileText size={14} className="text-[#8b5cf6] shrink-0" />
        <span className="truncate">View Demand</span>
      </button>
      <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[11px] font-extrabold bg-[#fff7ed] text-[#f97316] border border-[#f97316]/20 hover:bg-[#ffedd5] transition-all cursor-pointer shadow-sm flex-1 truncate">
        <Wallet size={14} className="text-[#f97316] shrink-0" />
        <span className="truncate">View Collection</span>
      </button>
      <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[11px] font-extrabold bg-[#fef2f2] text-[#ef4444] border border-[#ef4444]/20 hover:bg-[#fee2e2] transition-all cursor-pointer shadow-sm flex-1 truncate">
        <FileText size={14} className="text-[#ef4444] shrink-0" />
        <span className="truncate">Generate Notice</span>
      </button>
      <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[11px] font-extrabold bg-[#eff6ff] text-[#3b82f6] border border-[#3b82f6]/20 hover:bg-[#dbeafe] transition-all cursor-pointer shadow-sm flex-1 truncate">
        <History size={14} className="text-[#3b82f6] shrink-0" />
        <span className="truncate">Property History</span>
      </button>
      <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[11px] font-extrabold bg-[#f0fdf4] text-[#22c55e] border border-[#22c55e]/20 hover:bg-[#dcfce7] transition-all cursor-pointer shadow-sm flex-1 truncate">
        <Download size={14} className="text-[#22c55e] shrink-0" />
        <span className="truncate">Download GIS</span>
      </button>

      <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[11px] font-extrabold border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 cursor-pointer shadow-sm flex-1 truncate">
        <span className="truncate">More Actions</span>
        <ChevronDown size={14} className="shrink-0 ml-0.5" />
      </button>
    </div>
  );
}
