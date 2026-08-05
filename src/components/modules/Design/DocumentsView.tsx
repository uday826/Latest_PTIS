import React, { useState } from 'react';
import { FileText, Download, X } from 'lucide-react';

export default function DocumentsView({ onClose }: { onClose: () => void }) {
  const [downloadStates, setDownloadStates] = useState<Record<string, { progress: number; status: string; success: boolean }>>({});

  const documentAssets = [
    { 
      id: 'plan', 
      title: 'Typical Floor Plan Layout', 
      type: 'APPROVED PLAN', 
      format: 'PDF', 
      size: '4.8 MB', 
      date: '12-Jan-2026', 
      desc: 'Typical structural floor plan layouts registered and approved by the planning authority.',
      color: 'border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-500/5 to-transparent',
      badgeColor: 'bg-blue-50 text-blue-700'
    },
    { 
      id: 'oc', 
      title: 'Occupancy Certificate (OC) (A & C)', 
      type: 'CERTIFICATE', 
      format: 'PDF', 
      size: '1.2 MB', 
      date: '05-Feb-2026', 
      desc: 'Officially sanctioned Occupancy Certificate certifying compliance and habitability for Wings A and C.',
      color: 'border-l-4 border-l-green-500 bg-gradient-to-r from-green-500/5 to-transparent',
      badgeColor: 'bg-green-50 text-green-700'
    },
    { 
      id: 'gis-map', 
      title: 'GIS Overlay Cadastral Survey Map', 
      type: 'GIS MAP', 
      format: 'PDF', 
      size: '8.5 MB', 
      date: '20-Feb-2026', 
      desc: 'Georeferenced cadastral mapping layer matching high-resolution satellite imagery records.',
      color: 'border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-500/5 to-transparent',
      badgeColor: 'bg-purple-50 text-purple-700'
    }
  ];

  const handleDownload = (id: string) => {
    if (downloadStates[id]?.progress > 0 && !downloadStates[id]?.success) return;

    setDownloadStates(prev => ({
      ...prev,
      [id]: { progress: 0, status: 'Connecting to document server...', success: false }
    }));

    const statusSteps = [
      { p: 30, s: 'Locating file archive...' },
      { p: 60, s: 'Verifying signature keys...' },
      { p: 90, s: 'Decompressing document bytes...' },
      { p: 100, s: 'Download complete.' }
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < statusSteps.length) {
        const step = statusSteps[stepIndex];
        setDownloadStates(prev => ({
          ...prev,
          [id]: { progress: step.p, status: step.s, success: step.p === 100 }
        }));
        stepIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setDownloadStates(prev => ({
            ...prev,
            [id]: { ...prev[id], success: false, progress: 0 }
          }));
        }, 3000);
      }
    }, 300);
  };

  return (
    <div className="flex flex-col h-full gap-3 font-sans animate-fadeIn p-1 select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-[#eff6ff] text-[#3b82f6] p-2 rounded-xl border border-blue-150 shadow-xs">
            <FileText size={16} />
          </div>
          <div>
            <h2 className="font-extrabold text-[#1e2b58] text-xs uppercase tracking-wider leading-none">Building & Flat Document Repository</h2>
            <span className="text-slate-600 text-[9px] font-extrabold mt-1 block leading-none">Official Documents & Certificate Files</span>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-655 font-extrabold hover:bg-gray-150 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-all active:scale-95"
        >
          <X size={14} />
        </button>
      </div>

      {/* Grid of Document Cards */}
      <div className="flex-grow flex-1 min-h-[220px] overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pr-0.5 no-scrollbar content-start">
        {documentAssets.map((doc) => {
          const state = downloadStates[doc.id];
          const isDownloading = state && state.progress > 0 && !state.success;
          return (
            <div key={doc.id} className={`bg-white border border-gray-250 rounded-2xl p-3 flex flex-col justify-between shadow-sm transition-all hover:shadow-md h-fit ${doc.color}`}>
              <div className="flex flex-col gap-1 text-[9.5px]">
                <div className="flex justify-between items-baseline select-none">
                  <span className={`${doc.badgeColor} font-extrabold px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider`}>{doc.type}</span>
                  <span className="text-gray-400 text-[8.5px] scale-90">{doc.format} • {doc.size}</span>
                </div>
                <span className="font-black text-[#1e2b58] block mt-1.5 text-[10px]">{doc.title}</span>
                <p className="text-slate-500 font-bold leading-normal mt-1">{doc.desc}</p>
                <span className="text-gray-400 text-[8.5px] block mt-1">Updated: {doc.date}</span>
              </div>

              <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[8px] font-extrabold min-h-[32px]">
                {state && state.progress > 0 ? (
                  <div className="flex-1 flex flex-col gap-1.5 pr-2.5">
                    <div className="flex justify-between items-center text-[7.5px] font-bold text-gray-500 leading-none">
                      <span className={`${state.success ? 'text-green-600 font-black' : ''}`}>{state.status}</span>
                      <span className="font-black">{state.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-300 ${state.success ? 'bg-green-600' : 'bg-[#3b82f6]'}`} style={{ width: `${state.progress}%` }}></div>
                    </div>
                  </div>
                ) : (
                  <span className="text-slate-600 font-extrabold leading-none">Status: Available</span>
                )}

                {state?.success ? (
                  <span className="text-green-600 font-black flex items-center gap-1 text-[9.5px] shrink-0 leading-none py-1.5">✓ Downloaded</span>
                ) : (
                  <button 
                    onClick={() => handleDownload(doc.id)}
                    disabled={isDownloading}
                    className={`flex items-center gap-1.5 px-3 py-1 text-[9px] font-bold rounded-lg cursor-pointer border transition-all active:scale-[0.97] ${
                      isDownloading
                        ? 'bg-gray-100 text-gray-400 border-gray-200/80 cursor-not-allowed'
                        : 'bg-[#002fbe] hover:bg-[#002598] text-white border-blue-650 shadow-xs'
                    }`}
                  >
                    <Download size={11} />
                    <span>{isDownloading ? 'Downloading...' : 'Download'}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
