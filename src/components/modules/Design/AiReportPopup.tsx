import React from 'react';

interface AiReportPopupProps {
  aiReportPopupOpen: boolean;
  aiReportPopupPosition: { top: number; left: number } | null;
  aiReportLoading: boolean;
  closeAiReport: () => void;
}

export default function AiReportPopup({
  aiReportPopupOpen,
  aiReportPopupPosition,
  aiReportLoading,
  closeAiReport
}: AiReportPopupProps) {
  if (!aiReportPopupOpen) return null;

  return (
    <>
      {/* Click-outside backdrop overlay */}
      <div 
        className="fixed inset-0 z-40 bg-transparent" 
        onClick={closeAiReport}
      />
      
      {/* Popover Card */}
      <div
        id="ai-report-popup"
        className="absolute z-50 timeline-popup bg-white border border-[#002fbe]/25 rounded-xl shadow-2xl p-3 w-[360px] animate-fadeIn flex flex-col gap-2.5 font-sans"
        style={{
          left: aiReportPopupPosition ? `${aiReportPopupPosition.left}px` : '50%',
          top: aiReportPopupPosition ? `${aiReportPopupPosition.top}px` : '50%',
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-popup-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-1.5 border-b border-gray-100 shrink-0">
          <span id="ai-popup-title" className="font-extrabold text-[#002fbe] text-[10px] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            AI Property Inspection Report
          </span>
          <button
            onClick={closeAiReport}
            className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-550 hover:text-gray-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#002fbe]"
            aria-label="Close report details"
          >
            <span className="text-[12px] font-bold">×</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-grow overflow-y-auto max-h-[220px] pr-0.5 text-[8.5px] no-scrollbar font-bold">
          {aiReportLoading ? (
            <div className="py-8 flex flex-col items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-[#002fbe] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-400 font-bold">Generating AI compliance audit...</span>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Status Banner */}
              <div className="bg-red-50 border border-red-200 text-red-700 p-1.5 rounded font-black text-center uppercase tracking-wider mb-1 shrink-0 flex items-center justify-center gap-1">
                <span>8 Compliance Issues Flagged</span>
              </div>

              {/* Issues */}
              <div className="space-y-1.5 text-gray-700 font-medium">
                <div className="p-1 border border-red-100/50 bg-red-50/10 rounded flex flex-col gap-0.5">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-red-650">Possible Commercial Use</span>
                    <span className="bg-red-50 text-red-600 border border-red-200 font-extrabold px-1 rounded text-[7px] scale-90">High</span>
                  </div>
                  <p className="text-gray-450 leading-tight font-medium">Satellite change detection matches garage/shop activities.</p>
                </div>

                <div className="p-1 border border-red-100/50 bg-red-50/10 rounded flex flex-col gap-0.5">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-red-650">Area Difference Found</span>
                    <span className="bg-red-50 text-red-600 border border-red-200 font-extrabold px-1 rounded text-[7px] scale-90">High</span>
                  </div>
                  <p className="text-gray-450 leading-tight font-medium">Sat footprint shows 440 m² vs 400 m² reported (10% diff).</p>
                </div>

                <div className="p-1 border border-orange-100/50 bg-orange-50/10 rounded flex flex-col gap-0.5">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-orange-600">Parking Provision Missing</span>
                    <span className="bg-orange-50 text-orange-500 border border-orange-200 font-extrabold px-1 rounded text-[7px] scale-90">Medium</span>
                  </div>
                  <p className="text-gray-450 leading-tight font-medium">Design permits lack ground-floor parking configurations.</p>
                </div>

                <div className="p-1 border border-orange-100/50 bg-orange-50/10 rounded flex flex-col gap-0.5">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-orange-600">Fire NOC Expired</span>
                    <span className="bg-orange-50 text-orange-500 border border-orange-200 font-extrabold px-1 rounded text-[7px] scale-90">Medium</span>
                  </div>
                  <p className="text-gray-450 leading-tight font-medium">Fire NOC has expired in Dec 2023.</p>
                </div>

                <div className="p-1 border border-blue-100/50 bg-blue-50/10 rounded flex flex-col gap-0.5">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-blue-650">Duplicate Water Connection</span>
                    <span className="bg-blue-50 text-blue-600 border border-blue-200 font-extrabold px-1 rounded text-[7px] scale-90">Low</span>
                  </div>
                  <p className="text-gray-450 leading-tight font-medium">Tap connection matches another property unit in Wing B.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions footer */}
        {!aiReportLoading && (
          <div className="pt-1.5 border-t border-gray-100 flex justify-end gap-1.5 shrink-0 font-bold">
            <button
              onClick={() => alert('Printing full AI audit summary...')}
              className="px-2.5 py-1 border border-gray-200 text-gray-600 hover:bg-gray-50 text-[8.5px] font-black rounded cursor-pointer transition-colors focus:outline-none"
            >
              Print
            </button>
            <button
              onClick={() => alert('Opening full detailed dashboard report...')}
              className="flex-1 text-center py-1 bg-blue-50 border border-blue-200 hover:bg-blue-100/75 text-[#002fbe] text-[8.5px] font-black rounded cursor-pointer transition-colors focus:outline-none focus:ring-1 focus:ring-[#002fbe]"
            >
              View Full Audit Details
            </button>
          </div>
        )}
      </div>
    </>
  );
}
