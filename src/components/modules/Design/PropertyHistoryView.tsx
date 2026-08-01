import React, { useState } from 'react';
import { History, X, Info, Download } from 'lucide-react';
import { historyEvents, auditDetailsMap } from './auditHistoryData.tsx';

export default function PropertyHistoryView({ onClose }: { onClose: () => void }) {
  const [selectedAudit, setSelectedAudit] = useState<string | null>(null);
  const activeAudit = selectedAudit ? auditDetailsMap[selectedAudit] : null;

  return (
    <div className="flex flex-col h-full gap-3 font-sans animate-fadeIn p-1">
      {selectedAudit && activeAudit && (
        <>
          <div className="fixed inset-0 bg-black/45 z-[990]" onClick={() => setSelectedAudit(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[999] bg-white border border-[#2563eb]/25 rounded-xl shadow-2xl p-4 w-[360px] flex flex-col gap-3 font-sans">
            <div className="flex items-center justify-between border-b border-gray-100 pb-1.5 shrink-0">
              <span className="font-extrabold text-[#2563eb] text-[10.5px] uppercase tracking-wider flex items-center gap-1">
                <Info size={12} />
                Audit Log Details
              </span>
              <button 
                onClick={() => setSelectedAudit(null)}
                className="text-gray-400 hover:text-gray-655 font-black hover:bg-gray-50 w-5 h-5 rounded-full flex items-center justify-center cursor-pointer transition-all"
              >
                <X size={12} />
              </button>
            </div>
            
            <div className="text-[9px] leading-relaxed space-y-2 font-semibold text-gray-700">
              <div className="flex flex-col gap-0.5">
                <span className="text-gray-400 font-extrabold uppercase text-[7.5px]">Audit Event Name</span>
                <span className="font-black text-gray-950 text-[10px]">{activeAudit.title}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-0.5">
                  <span className="text-gray-400 font-extrabold uppercase text-[7.5px]">Updated Date/Time</span>
                  <span className="font-bold text-gray-900">{activeAudit.date}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-gray-400 font-extrabold uppercase text-[7.5px]">Operator Role</span>
                  <span className="font-bold text-gray-900">{activeAudit.role}</span>
                </div>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-gray-400 font-extrabold uppercase text-[7.5px]">Operator Name</span>
                <span className="font-black text-[#2563eb]">{activeAudit.user}</span>
              </div>
              <div className="flex flex-col gap-0.5 bg-gray-50 p-2 rounded border border-gray-200/50">
                <div className="flex flex-col gap-0.5 pb-1.5 border-b border-gray-200/30">
                  <span className="text-red-500 font-bold text-[7px] uppercase">Previous Value</span>
                  <span className="font-mono text-gray-500 text-[8px]">{activeAudit.prevVal}</span>
                </div>
                <div className="flex flex-col gap-0.5 pt-1.5">
                  <span className="text-green-600 font-bold text-[7px] uppercase">Updated Value</span>
                  <span className="font-mono text-gray-900 text-[8.5px] font-black">{activeAudit.newVal}</span>
                </div>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-gray-400 font-extrabold uppercase text-[7.5px]">Remarks</span>
                <p className="text-gray-750 font-medium italic">"{activeAudit.remarks}"</p>
              </div>
              {activeAudit.docs && (
                <div className="flex flex-col gap-0.5">
                  <span className="text-gray-400 font-extrabold uppercase text-[7.5px]">Supporting Files</span>
                  <span className="text-[#2563eb] hover:underline cursor-pointer flex items-center gap-0.5 font-black text-[8px]">
                    <Download size={9} />
                    {activeAudit.docs}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-gray-155 flex justify-end shrink-0">
              <button 
                onClick={() => setSelectedAudit(null)}
                className="w-full text-center py-1.5 bg-[#eff6ff] hover:bg-[#dbeafe] text-[#2563eb] text-[9px] font-black rounded cursor-pointer transition-colors shadow-2xs border border-[#2563eb]/25"
              >
                Close Audit Details
              </button>
            </div>
          </div>
        </>
      )}

      <div className="flex items-center justify-between border-b border-gray-100 pb-2 shrink-0 select-none">
        <div className="flex items-center gap-1.5">
          <div className="bg-blue-50 text-blue-600 p-1.5 rounded-lg border border-blue-100">
            <History size={14} />
          </div>
          <div>
            <h2 className="font-extrabold text-[#1e2b58] text-[11px] uppercase tracking-wider leading-none">Property Transaction & Audit History</h2>
            <span className="text-slate-600 text-[8.5px] font-extrabold mt-1 block leading-none">Property ID: 1290082181</span>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-655 font-extrabold hover:bg-gray-100 w-5 h-5 rounded-full flex items-center justify-center cursor-pointer transition-all"
        >
          <X size={12} />
        </button>
      </div>

      <div className="flex-grow flex-1 min-h-0 overflow-y-auto pr-1.5 relative py-3 pl-4 no-scrollbar">
        <div className="absolute top-2 bottom-2 left-[30px] w-[2px] bg-blue-100 z-0"></div>
        <div className="space-y-4">
          {historyEvents.map((evt) => (
            <button
              key={evt.id}
              onClick={() => setSelectedAudit(evt.id)}
              className="flex items-start gap-3.5 w-full text-left relative z-10 group outline-none focus:outline-none transition-transform hover:translate-x-0.5 cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-white border-2 border-[#2563eb] hover:bg-[#2563eb] hover:text-white text-[#2563eb] flex items-center justify-center font-extrabold shadow-sm shrink-0 transition-all group-hover:scale-110">
                {evt.icon}
              </div>
              
              <div className="flex-grow bg-white border border-gray-200 hover:border-[#2563eb]/40 rounded-xl p-3 shadow-xs transition-colors flex flex-col gap-1">
                <div className="flex justify-between items-baseline select-none">
                  <span className="font-extrabold text-[#1e2b58] text-[10px] group-hover:text-[#2563eb] transition-colors">{evt.title}</span>
                  <span className="text-slate-500 font-extrabold text-[8px]">{evt.date}</span>
                </div>
                <p className="text-slate-700 font-bold text-[9px] leading-tight pr-4">{evt.desc}</p>
                <span className="text-[#2563eb] font-extrabold text-[8px] tracking-wider uppercase mt-1 inline-flex items-center gap-0.5 group-hover:underline">
                  View Audit Details →
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
