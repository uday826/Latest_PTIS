import React, { useState } from 'react';
import { Printer, Download, X, CheckCircle2 } from 'lucide-react';

export default function PrintCardView({ onClose }: { onClose: () => void }) {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    setDownloading(true);
    setDownloadSuccess(false);
    setTimeout(() => {
      setDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2000);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full gap-2 font-sans animate-fadeIn p-1">
      <div className="flex items-center justify-between border-b border-gray-155 pb-1.5 shrink-0 select-none">
        <div className="flex items-center gap-1.5">
          <div className="bg-green-50 text-green-605 p-1 rounded border border-green-100">
            <Printer size={13} />
          </div>
          <h2 className="font-extrabold text-[#1e2b58] text-[10px] uppercase tracking-wider">Property Card Print Preview</h2>
        </div>
        <div className="flex items-center gap-1.5">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-1 px-2.5 py-1 bg-[#ecfdf5] hover:bg-[#d1fae5] text-[#10b981] border border-[#10b981]/25 text-[8.5px] font-black rounded cursor-pointer transition-all shadow-xs"
          >
            <Printer size={11} />
            <span>Print</span>
          </button>
          <button 
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-1 px-2.5 py-1 bg-[#eff6ff] hover:bg-[#dbeafe] text-[#3b82f6] border border-[#3b82f6]/25 text-[8.5px] font-black rounded cursor-pointer transition-all shadow-xs disabled:opacity-50"
          >
            <Download size={11} />
            <span>{downloading ? 'Downloading...' : 'Download PDF'}</span>
          </button>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-655 font-extrabold hover:bg-gray-100 w-5 h-5 rounded-full flex items-center justify-center cursor-pointer transition-all"
          >
            <X size={11} />
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[100] bg-green-600 text-white font-extrabold px-6 py-2 rounded-xl shadow-2xl flex items-center gap-2 border border-green-500 animate-slideDown text-[9px]">
          <CheckCircle2 size={13} />
          <span>PDF Download started successfully!</span>
        </div>
      )}

      {/* Expanded full width & height scroll area */}
      <div className="flex-grow flex-1 min-h-0 overflow-y-auto border border-gray-250 bg-gray-100 p-6 rounded-xl relative select-none flex justify-center no-scrollbar">
        <div 
          className="w-full bg-white border border-gray-300 shadow-md p-8 font-sans text-gray-850 flex flex-col gap-5 relative max-w-[820px] transition-all"
          id="print-sheet-content"
          style={{ minHeight: '520px' }}
        >
          <div className="absolute inset-0 bg-transparent flex items-center justify-center pointer-events-none opacity-[0.03]">
            <img src="/ulb_logo.png" alt="ULB Logo Watermark" className="w-48 h-48 object-contain" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
          </div>
          <div className="flex justify-between items-start border-b border-gray-300 pb-2.5">
            <div className="flex gap-2.5 items-center">
              <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center font-black text-[#002fbe] text-[18px]">
                N
              </div>
              <div>
                <h1 className="font-extrabold text-[#1e2b58] text-[13px] uppercase tracking-wider leading-tight">Nagpur Municipal Corporation</h1>
                <p className="text-[#002fbe] font-extrabold text-[9px] mt-0.5 uppercase tracking-wider">Property Tax Assessment Department</p>
              </div>
            </div>
            <div className="text-right text-[8.5px] font-black text-slate-700 leading-tight">
              <p>DATE: {new Date().toLocaleDateString('en-GB')}</p>
              <p>REF NO: NMC-PT-2026-908A</p>
            </div>
          </div>

          <div className="bg-[#eff6ff] border border-blue-200/50 text-[#002fbe] p-1.5 text-center font-black uppercase text-[10px] rounded tracking-wider shadow-2xs">
            Official Property Register Card
          </div>

          <div className="grid grid-cols-3 gap-x-5 gap-y-3 border-b border-gray-150 pb-4">
            <div>
              <span className="text-slate-600 font-extrabold block mb-0.5 uppercase text-[8.5px]">Property ID / UPIC</span>
              <span className="font-black text-[#002fbe] text-[11.5px]">1290082181</span>
            </div>
            <div>
              <span className="text-slate-600 font-extrabold block mb-0.5 uppercase text-[8.5px]">Tax Zone</span>
              <span className="font-black text-gray-900 text-[10px]">Zone-A (Nishigandha)</span>
            </div>
            <div>
              <span className="text-slate-600 font-extrabold block mb-0.5 uppercase text-[8.5px]">Ward & Mouja</span>
              <span className="font-black text-gray-900 text-[10px]">Ward-04, Mouja A</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5 border-b border-gray-150 pb-4">
            <div>
              <h3 className="font-black text-[#1e2b58] mb-2 uppercase text-[9px] tracking-wider">Owner Details</h3>
              <div className="space-y-1.5 text-slate-800 text-[10px]">
                <p className="font-extrabold text-slate-600">NAME: <span className="font-black text-slate-900">Shri Balasaheb Thackeray</span></p>
                <p className="font-extrabold text-slate-600">RELATION: <span className="font-black text-slate-900">Self (Holder)</span></p>
                <p className="font-extrabold text-slate-600">AADHAAR: <span className="font-black text-slate-900">**** **** 9081</span></p>
              </div>
            </div>
            <div>
              <h3 className="font-black text-[#1e2b58] mb-2 uppercase text-[9px] tracking-wider">Property Location</h3>
              <div className="space-y-1.5 text-slate-800 text-[10px]">
                <p className="font-extrabold text-slate-600">PLOT NO: <span className="font-black text-slate-900">Plot No. 129</span></p>
                <p className="font-extrabold text-slate-600">BUILDING: <span className="font-black text-slate-900">Wing B, Flat 101</span></p>
                <p className="font-extrabold text-slate-600">SOCIETY: <span className="font-black text-slate-900">Gokuldham Co-op Society</span></p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-x-5 gap-y-3 border-b border-gray-150 pb-4">
            <div>
              <span className="text-slate-600 font-extrabold block mb-0.5 uppercase text-[8.5px]">Property Usage</span>
              <span className="font-black text-gray-900 text-[10.5px]">निवासी (Residential)</span>
            </div>
            <div>
              <span className="text-slate-600 font-extrabold block mb-0.5 uppercase text-[8.5px]">Built-up Area</span>
              <span className="font-black text-gray-900 text-[10.5px]">440.00 m²</span>
            </div>
            <div>
              <span className="text-slate-600 font-extrabold block mb-0.5 uppercase text-[8.5px]">Carpet Area</span>
              <span className="font-black text-gray-900 text-[10.5px]">400.00 m²</span>
            </div>
            <div>
              <span className="text-slate-600 font-extrabold block mb-0.5 uppercase text-[8.5px]">Rateable Value (RV)</span>
              <span className="font-black text-[#002fbe] text-[11.5px]">₹18,45,000</span>
            </div>
            <div>
              <span className="text-slate-600 font-extrabold block mb-0.5 uppercase text-[8.5px]">Capital Value (CV)</span>
              <span className="font-black text-[#002fbe] text-[11.5px]">₹36,90,000</span>
            </div>
            <div>
              <span className="text-slate-600 font-extrabold block mb-0.5 uppercase text-[8.5px]">Annual Tax (Current)</span>
              <span className="font-black text-green-700 text-[11.5px]">₹18,752</span>
            </div>
          </div>

          <div className="flex justify-between items-end mt-auto pt-4 border-t border-dashed border-gray-300">
            <div className="space-y-1 font-extrabold text-slate-700 text-[8.5px] leading-relaxed">
              <p>GIS COORDINATES: 19.0760° N, 72.8777° E</p>
              <p className="text-slate-600 font-extrabold">Scan QR Code at the right to verify registration authenticity.</p>
              <p className="font-black text-[#002fbe] uppercase text-[7.5px]">Nagpur Municipal Digital Assessment Registry</p>
            </div>
            <div className="flex flex-col items-center gap-1 shrink-0 bg-white border border-gray-200 p-1.5 rounded shadow-2xs">
              <div className="w-18 h-18 bg-gray-100 flex items-center justify-center font-bold text-gray-450 border border-gray-250 rounded text-[7.5px] text-center select-none relative">
                <span className="block absolute text-[8.5px] font-black text-gray-400">QR SCAN</span>
                <div className="w-12 h-12 border border-gray-400/30 flex flex-wrap gap-0.5 justify-center items-center opacity-65">
                  <div className="w-3.5 h-3.5 bg-gray-800 rounded-2xs" />
                  <div className="w-3.5 h-3.5 bg-gray-800 rounded-2xs" />
                  <div className="w-3.5 h-3.5 bg-gray-800 rounded-2xs" />
                  <div className="w-3.5 h-3.5 bg-gray-800 rounded-2xs" />
                </div>
              </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
