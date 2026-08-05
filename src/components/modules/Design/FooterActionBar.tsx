"use client";

import React from 'react';
import { 
  FileEdit, 
  Printer, 
  FileText, 
  Wallet, 
  History, 
  Download, 
  ChevronDown,
  Building2
} from 'lucide-react';

interface FooterActionBarProps {
  activeAction: string | null;
  setActiveAction: (action: string | null) => void;
}

export default function FooterActionBar({ activeAction, setActiveAction }: FooterActionBarProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-2 flex items-center justify-between gap-3 shadow-md select-none w-full relative z-30">
      
      {/* Button 1: Edit Property */}
      <button 
        onClick={() => setActiveAction(activeAction === 'edit-property' ? null : 'edit-property')}
        className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer shadow-sm flex-1 truncate ${
          activeAction === 'edit-property'
            ? 'bg-[#3b82f6] text-white border-2 border-blue-600 scale-[1.02]'
            : 'bg-[#edf2ff] text-[#3b82f6] border border-[#3b82f6]/20 hover:bg-[#dbeafe]'
        }`}
      >
        <FileEdit size={14} className={activeAction === 'edit-property' ? 'text-white shrink-0' : 'text-[#3b82f6] shrink-0'} />
        <span className="truncate">Edit Property</span>
      </button>

      {/* Button 2: Print Property Card */}
      <button 
        onClick={() => setActiveAction(activeAction === 'print-card' ? null : 'print-card')}
        className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer shadow-sm flex-1 truncate ${
          activeAction === 'print-card'
            ? 'bg-[#10b981] text-white border-2 border-green-600 scale-[1.02]'
            : 'bg-[#ecfdf5] text-[#10b981] border border-[#10b981]/20 hover:bg-[#d1fae5]'
        }`}
      >
        <Printer size={14} className={activeAction === 'print-card' ? 'text-white shrink-0' : 'text-[#10b981] shrink-0'} />
        <span className="truncate">Print Property Card</span>
      </button>

      {/* Button 3: View Demand */}
      <button 
        onClick={() => setActiveAction(activeAction === 'view-demand' ? null : 'view-demand')}
        className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer shadow-sm flex-1 truncate ${
          activeAction === 'view-demand'
            ? 'bg-[#8b5cf6] text-white border-2 border-purple-600 scale-[1.02]'
            : 'bg-[#f5f3ff] text-[#8b5cf6] border border-[#8b5cf6]/20 hover:bg-[#ede9fe]'
        }`}
      >
        <FileText size={14} className={activeAction === 'view-demand' ? 'text-white shrink-0' : 'text-[#8b5cf6] shrink-0'} />
        <span className="truncate">View Demand</span>
      </button>

      {/* Button 4: View Collection */}
      <button 
        onClick={() => setActiveAction(activeAction === 'view-collection' ? null : 'view-collection')}
        className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer shadow-sm flex-1 truncate ${
          activeAction === 'view-collection'
            ? 'bg-[#f97316] text-white border-2 border-orange-600 scale-[1.02]'
            : 'bg-[#fff7ed] text-[#f97316] border border-[#f97316]/20 hover:bg-[#ffedd5]'
        }`}
      >
        <Wallet size={14} className={activeAction === 'view-collection' ? 'text-white shrink-0' : 'text-[#f97316] shrink-0'} />
        <span className="truncate">View Collection</span>
      </button>

      {/* Button 5: Generate Notice */}
      <button 
        onClick={() => setActiveAction(activeAction === 'generate-notice' ? null : 'generate-notice')}
        className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer shadow-sm flex-1 truncate ${
          activeAction === 'generate-notice'
            ? 'bg-[#ef4444] text-white border-2 border-red-600 scale-[1.02]'
            : 'bg-[#fef2f2] text-[#ef4444] border border-[#ef4444]/20 hover:bg-[#fee2e2]'
        }`}
      >
        <FileText size={14} className={activeAction === 'generate-notice' ? 'text-white shrink-0' : 'text-[#ef4444] shrink-0'} />
        <span className="truncate">Generate Notice</span>
      </button>

      {/* Button 6: Property History */}
      <button 
        onClick={() => setActiveAction(activeAction === 'property-history' ? null : 'property-history')}
        className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer shadow-sm flex-1 truncate ${
          activeAction === 'property-history'
            ? 'bg-[#2563eb] text-white border-2 border-blue-700 scale-[1.02]'
            : 'bg-[#eff6ff] text-[#3b82f6] border border-[#3b82f6]/20 hover:bg-[#dbeafe]'
        }`}
      >
        <History size={14} className={activeAction === 'property-history' ? 'text-white shrink-0' : 'text-[#3b82f6] shrink-0'} />
        <span className="truncate">Property History</span>
      </button>

      {/* Button 7: Documents (Interactive Page Tab) */}
      <button 
        onClick={() => setActiveAction(activeAction === 'documents' ? null : 'documents')}
        className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer shadow-sm flex-1 truncate ${
          activeAction === 'documents'
            ? 'bg-[#22c55e] text-white border-2 border-green-600 scale-[1.02]'
            : 'bg-[#f0fdf4] text-[#22c55e] border border-[#22c55e]/20 hover:bg-[#dcfce7]'
        }`}
      >
        <FileText size={14} className={activeAction === 'documents' ? 'text-white shrink-0' : 'text-[#22c55e] shrink-0'} />
        <span className="truncate">Documents</span>
      </button>

      {/* Button 7.5: Apply OC (Interactive Page Tab) */}
      <button 
        onClick={() => setActiveAction(activeAction === 'apply-oc' ? null : 'apply-oc')}
        className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer shadow-sm flex-1 truncate ${
          activeAction === 'apply-oc'
            ? 'bg-[#2563eb] text-white border-2 border-blue-700 scale-[1.02]'
            : 'bg-[#eff6ff] text-[#3b82f6] border border-[#3b82f6]/20 hover:bg-[#dbeafe]'
        }`}
      >
        <Building2 size={14} className={activeAction === 'apply-oc' ? 'text-white shrink-0' : 'text-[#3b82f6] shrink-0'} />
        <span className="truncate">Apply OC</span>
      </button>

      {/* Button 8: More Actions (Interactive Page Tab) */}
      <button 
        onClick={() => setActiveAction(activeAction === 'more-actions' ? null : 'more-actions')}
        className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer shadow-sm flex-1 truncate ${
          activeAction === 'more-actions'
            ? 'bg-gray-800 text-white border-2 border-gray-900 scale-[1.02]'
            : 'border-gray-250 bg-white hover:bg-gray-50 text-gray-700'
        }`}
      >
        <span className="truncate">More Actions</span>
        <ChevronDown size={14} className={activeAction === 'more-actions' ? 'text-white shrink-0 ml-0.5' : 'text-gray-700 shrink-0 ml-0.5'} />
      </button>

    </div>
  );
}
