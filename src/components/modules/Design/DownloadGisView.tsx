import React, { useState } from 'react';
import { Download, X } from 'lucide-react';

export default function DownloadGisView({ onClose }: { onClose: () => void }) {
  const [downloadStates, setDownloadStates] = useState<Record<string, { progress: number; status: string; success: boolean }>>({});

  const gisAssets = [
    { id: 'report', title: 'GIS Summary Report', format: 'PDF', size: '2.4 MB', desc: 'Comprehensive tax parcel report containing area overlays, plot maps, and spatial assessments.', color: 'border-l-4 border-l-emerald-500 bg-gradient-to-r from-emerald-500/5 to-transparent' },
    { id: 'map', title: 'High-Res Satellite Map', format: 'PNG Image', size: '4.8 MB', desc: 'Pre-rendered high resolution image containing spatial polygon boundary lines matching the municipal register.', color: 'border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-500/5 to-transparent' },
    { id: 'geojson', title: 'Boundary GeoJSON', format: 'GEOJSON', size: '150 KB', desc: 'Geospatial database vector nodes coordinates for property GIS borders mapping.', color: 'border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-500/5 to-transparent' },
    { id: 'kml', title: 'Google Earth KML', format: 'KML Vector', size: '180 KB', desc: 'Keyhole Markup Language vector parameters containing coordinate polygons for standard viewer imports.', color: 'border-l-4 border-l-amber-500 bg-gradient-to-r from-amber-500/5 to-transparent' },
    { id: 'coordinates', title: 'Boundary Node Index', format: 'TXT Log', size: '12 KB', desc: 'Tab-delimited text list specifying physical corner coordinates (Latitude, Longitude, Altitude).', color: 'border-l-4 border-l-rose-500 bg-gradient-to-r from-rose-500/5 to-transparent' },
    { id: 'survey', title: 'Survey Inspector Report', format: 'PDF Report', size: '1.2 MB', desc: 'Verified field survey measurements sheet complete with audit parameters.', color: 'border-l-4 border-l-teal-500 bg-gradient-to-r from-teal-500/5 to-transparent' }
  ];

  const handleDownload = (id: string, title: string, ext: string) => {
    if (downloadStates[id]?.progress > 0 && !downloadStates[id]?.success) return;

    setDownloadStates(prev => ({
      ...prev,
      [id]: { progress: 0, status: 'Connecting to GIS servers...', success: false }
    }));

    const statusSteps = [
      { p: 20, s: 'Querying spatial databases...' },
      { p: 50, s: 'Resolving parcel coordinate nodes...' },
      { p: 80, s: 'Packaging geospatial data...' },
      { p: 100, s: 'Preparing local download...' }
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
    }, 400);
  };

  return (
    <div className="flex flex-col h-full gap-3 font-sans animate-fadeIn p-1 select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-[#f0fdf4] text-emerald-600 p-2 rounded-xl border border-green-150 shadow-xs animate-pulse">
            <Download size={16} />
          </div>
          <div>
            <h2 className="font-extrabold text-[#1e2b58] text-xs uppercase tracking-wider leading-none">Download GIS Assets & Spatial Data</h2>
            <span className="text-slate-600 text-[9px] font-extrabold mt-1 block leading-none">Interactive Export Center • Property ID: 1290082181</span>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-655 font-extrabold hover:bg-gray-150 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-all active:scale-95"
        >
          <X size={14} />
        </button>
      </div>

      {/* Grid of Downloadable Cards */}
      <div className="flex-grow flex-1 min-h-[220px] overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pr-0.5 no-scrollbar content-start">
        {gisAssets.map((asset) => {
          const state = downloadStates[asset.id];
          const isDownloading = state && state.progress > 0 && !state.success;
          return (
            <div key={asset.id} className={`bg-white border border-gray-250 rounded-2xl p-3 flex flex-col justify-between shadow-sm transition-all hover:shadow-md h-fit ${asset.color}`}>
              <div className="flex flex-col gap-1 text-[9.5px]">
                <div className="flex justify-between items-baseline select-none">
                  <span className="font-black text-[#1e2b58] uppercase tracking-wider text-[10px]">{asset.title}</span>
                  <span className="bg-gray-100 text-gray-500 font-extrabold px-1.5 py-0.5 rounded text-[8px] scale-90">{asset.format} • {asset.size}</span>
                </div>
                <p className="text-slate-700 font-extrabold leading-normal mt-1">{asset.desc}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[8px] font-extrabold min-h-[32px]">
                {state && state.progress > 0 ? (
                  <div className="flex-1 flex flex-col gap-1.5 pr-2.5">
                    <div className="flex justify-between items-center text-[7.5px] font-bold text-gray-500 leading-none">
                      <span className={`${state.success ? 'text-green-600 font-black' : ''}`}>{state.status}</span>
                      <span className="font-black">{state.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-300 ${state.success ? 'bg-green-600' : 'bg-[#002fbe]'}`} style={{ width: `${state.progress}%` }}></div>
                    </div>
                  </div>
                ) : (
                  <span className="text-slate-600 font-extrabold leading-none">Asset Status: Ready</span>
                )}

                {state?.success ? (
                  <span className="text-green-600 font-black flex items-center gap-1 text-[9.5px] shrink-0 leading-none py-1.5">✓ Downloaded</span>
                ) : (
                  <button 
                    onClick={() => handleDownload(asset.id, asset.title, asset.format.toLowerCase())}
                    disabled={isDownloading}
                    className={`flex items-center gap-1.5 px-3 py-1 text-[9px] font-bold rounded-lg cursor-pointer border transition-all active:scale-[0.97] ${
                      isDownloading
                        ? 'bg-gray-100 text-gray-400 border-gray-200/80 cursor-not-allowed'
                        : 'bg-[#002fbe] hover:bg-[#002598] text-white border-blue-650 shadow-xs'
                    }`}
                  >
                    <Download size={11} />
                    <span>{isDownloading ? 'Processing...' : 'Export'}</span>
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
