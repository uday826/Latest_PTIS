import React, { useState } from 'react';
import { FileText, X } from 'lucide-react';
import { RulesPanel } from './RulesPanel';
import { DiscountsPanel } from './DiscountsPanel';
import { RetrospectivePanel } from './RetrospectivePanel';

interface TaxRulesModalProps {
  onClose: () => void;
  wing: string;
  unit: string;
  use: string;
  owner: string;
  tax: string;
}

export default function TaxRulesModal({ onClose, wing, unit, use, owner, tax }: TaxRulesModalProps) {
  const [activeTab, setActiveTab] = useState<'rules' | 'discounts' | 'retrospective'>('rules');

  const taxBefore = parseFloat(tax.replace(/[^\d]/g, '')) || 3825;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
      {/* Modal Card Wrapper */}
      <div className="bg-[#1e1b4b] text-white w-full max-w-[1200px] h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-indigo-500/20 font-sans text-[10px]">
        
        {/* Header Block */}
        <div className="bg-[#1e1b4b] px-6 py-4 flex flex-col gap-3 border-b border-indigo-900/50 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="bg-indigo-950 p-2 rounded-lg border border-indigo-800/40">
                <FileText className="text-indigo-400" size={20} />
              </div>
              <div>
                <h2 className="text-[16px] font-black tracking-tight leading-none uppercase text-slate-100">Tax Rules & Discounts</h2>
                <span className="text-[11px] text-indigo-300 font-bold block mt-1">Shivam Residency</span>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white bg-indigo-950 hover:bg-indigo-900/80 p-1.5 rounded-lg border border-indigo-800/40 transition cursor-pointer font-bold"
              type="button"
            >
              <X size={16} />
            </button>
          </div>

          {/* Sub-header details badges */}
          <div className="flex flex-wrap gap-2 text-[10px] font-black uppercase text-indigo-200">
            <span className="bg-indigo-950 border border-indigo-800/40 px-2.5 py-1 rounded">Apartment: Shivam Residency</span>
            <span className="bg-indigo-950 border border-indigo-800/40 px-2.5 py-1 rounded">Wing: {wing}</span>
            <span className="bg-indigo-950 border border-indigo-800/40 px-2.5 py-1 rounded">Unit: {unit}</span>
            <span className="bg-indigo-950 border border-indigo-800/40 px-2.5 py-1 rounded">Use: {use}</span>
            <span className="bg-indigo-950 border border-indigo-800/40 px-2.5 py-1 rounded">Owner: {owner}</span>
            <span className="bg-indigo-950 border border-indigo-800/40 px-2.5 py-1 rounded">Base Tax: ₹{taxBefore.toLocaleString()}</span>
          </div>
        </div>

        {/* Inner Content Area */}
        <div className="flex-1 bg-slate-50 text-slate-800 flex flex-col min-h-0">
          
          {/* Tabs bar */}
          <div className="bg-white border-b border-slate-200 px-6 py-2.5 flex items-center justify-between shrink-0">
            <div className="flex gap-4">
              <button 
                onClick={() => setActiveTab('rules')}
                className={`px-4 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all border cursor-pointer ${
                  activeTab === 'rules' 
                    ? 'bg-[#ffe4e6] text-[#be123c] border-[#f43f5e] shadow-xs' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-transparent'
                }`}
                type="button"
              >
                Taxation Rules Applied <span className="ml-1 text-[9px] bg-white border border-[#be123c]/20 px-1 py-0.25 rounded font-black">4/12</span>
              </button>
              <button 
                onClick={() => setActiveTab('discounts')}
                className={`px-4 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all border cursor-pointer ${
                  activeTab === 'discounts' 
                    ? 'bg-[#ecfdf5] text-[#065f46] border-[#10b981] shadow-xs' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-transparent'
                }`}
                type="button"
              >
                Discounts Applied <span className="ml-1 text-[9px] bg-white border border-[#065f46]/20 px-1 py-0.25 rounded font-black">4/8</span>
              </button>
              <button 
                onClick={() => setActiveTab('retrospective')}
                className={`px-4 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all border cursor-pointer ${
                  activeTab === 'retrospective' 
                    ? 'bg-[#fef3c7] text-[#92400e] border-[#f59e0b] shadow-xs' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-transparent'
                }`}
                type="button"
              >
                Retrospective Tax Calc <span className="ml-1 text-[9px] bg-white border border-[#92400e]/20 px-1 py-0.25 rounded font-black">3 Yrs</span>
              </button>
            </div>
            <span className="text-[10px] font-bold text-slate-400">Unit-level view</span>
          </div>

          {/* Dynamic Content Panel */}
          <div className="flex-grow flex flex-col p-6 overflow-y-auto min-h-0">
            {activeTab === 'rules' ? (
              <RulesPanel taxBefore={taxBefore} />
            ) : activeTab === 'discounts' ? (
              <DiscountsPanel taxBefore={taxBefore} />
            ) : (
              <RetrospectivePanel taxBefore={taxBefore} />
            )}
          </div>

          {/* Footer Bar */}
          <div className="bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
            <span className="text-[9.5px] font-bold text-slate-400 italic">
              * Unit-specific view: Apartment + Wing + Unit level rules and discounts. Discounts require prior approval with valid supporting documents.
            </span>
            <button 
              onClick={onClose}
              className="bg-indigo-950 text-white hover:bg-indigo-900 border border-indigo-850 px-5 py-1.5 rounded-lg text-[11px] font-black tracking-wide shadow-sm hover:shadow transition cursor-pointer"
              type="button"
            >
              Close
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
