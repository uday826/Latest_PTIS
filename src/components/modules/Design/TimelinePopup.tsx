import React from 'react';
import { stageDataMap } from './timelineData';

interface TimelinePopupProps {
  selectedTimelineStage: string | null;
  popupPosition: { top: number; left: number } | null;
  timelineLoading: boolean;
  timelineError: string | null;
  closeStageDetails: () => void;
  handleRetryLoad: () => void;
}

export default function TimelinePopup({
  selectedTimelineStage,
  popupPosition,
  timelineLoading,
  timelineError,
  closeStageDetails,
  handleRetryLoad
}: TimelinePopupProps) {
  if (!selectedTimelineStage) return null;
  
  const stageData = stageDataMap[selectedTimelineStage];
  if (!stageData) return null;

  const isAppeal = selectedTimelineStage === 'appeal';
  const isEmpty = !isAppeal && (!stageData.fields || stageData.fields.length === 0);

  return (
    <>
      {/* Click-outside backdrop overlay */}
      <div 
        className="fixed inset-0 z-40 bg-transparent" 
        onClick={closeStageDetails}
      />
      
      {/* Popover Card */}
      <div
        id={`timeline-popup-${selectedTimelineStage}`}
        className="absolute z-50 timeline-popup bg-white border border-[#002fbe]/25 rounded-xl shadow-2xl p-3 w-[360px] max-w-[calc(100vw-24px)] animate-fadeIn flex flex-col gap-2.5 font-sans"
        style={{
          left: popupPosition ? `${popupPosition.left}px` : '50%',
          top: popupPosition ? `${popupPosition.top}px` : '50%',
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-1.5 border-b border-gray-100 shrink-0">
          <span id="popup-title" className="font-extrabold text-[#002fbe] text-[10px] uppercase tracking-wider">
            {stageData.title}
          </span>
          <button
            onClick={closeStageDetails}
            className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#002fbe]"
            aria-label="Close details"
          >
            <span className="text-[12px] font-bold">×</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-grow overflow-y-auto max-h-[220px] pr-0.5 text-[8.5px] no-scrollbar">
          {timelineLoading ? (
            <div className="py-8 flex flex-col items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-[#002fbe] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-400 font-bold">Loading stage details...</span>
            </div>
          ) : timelineError ? (
            <div className="py-6 flex flex-col items-center justify-center gap-2 text-center">
              <span className="text-red-500 font-bold">{timelineError}</span>
              <button
                onClick={handleRetryLoad}
                className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-655 font-black border border-red-200 rounded cursor-pointer transition-all"
              >
                Retry
              </button>
            </div>
          ) : isAppeal ? (
            <div className="py-4 text-center font-bold text-gray-550">
              No appeal information is currently available.
            </div>
          ) : isEmpty ? (
            <div className="py-4 text-center font-bold text-gray-555">
              No details available for this stage.
            </div>
          ) : (
            <div className="space-y-1.5 font-medium text-gray-700">
              {stageData.fields.map((field: any, idx: number) => {
                const isStatusField = field.label.toLowerCase().includes('status');
                let statusBadge = null;

                if (isStatusField) {
                  let badgeBg = 'bg-slate-100 text-slate-600 border-slate-200';
                  if (field.value === 'Completed') {
                    badgeBg = 'bg-green-50 text-green-700 border-green-200';
                  } else if (field.value === 'In Progress') {
                    badgeBg = 'bg-blue-50 text-blue-700 border-blue-200';
                  } else if (field.value === 'Pending') {
                    badgeBg = 'bg-slate-50 text-slate-655 border-slate-200';
                  }
                  statusBadge = (
                    <span className={`px-1.5 py-0.5 rounded-full border text-[7.5px] font-extrabold ${badgeBg}`}>
                      {field.value}
                    </span>
                  );
                }

                // Check if value highlights mutation steps or in progress details
                const isMutationStep = selectedTimelineStage === 'mutation' && 
                  ['current processing stage', 'pending action', 'responsible department', 'expected next step'].includes(field.label.toLowerCase());

                return (
                  <div 
                    key={idx} 
                    className={`flex items-start justify-between gap-2 py-0.5 ${
                      isMutationStep ? 'bg-blue-50/50 p-1 rounded border border-blue-100/50' : ''
                    }`}
                  >
                    <span className={`text-gray-400 font-bold shrink-0 ${
                      isMutationStep ? 'text-[#002fbe]' : ''
                    }`}>
                      {field.label}
                    </span>
                    <span className={`text-right font-black ${
                      isStatusField ? '' : 'text-gray-900'
                    } ${isMutationStep ? 'text-blue-900 font-black' : ''}`}>
                      {statusBadge || field.value}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Action Button */}
        {stageData.hasFullDetails && !timelineLoading && !timelineError && (
          <div className="pt-1.5 border-t border-gray-100 flex justify-end shrink-0 font-bold">
            <button
              onClick={() => alert(`Opening full dashboard record for ${stageData.title}...`)}
              className="w-full text-center py-1 bg-blue-50 border border-blue-200 hover:bg-blue-100/75 text-[#002fbe] text-[8.5px] font-black rounded cursor-pointer transition-colors focus:outline-none focus:ring-1 focus:ring-[#002fbe]"
            >
              View Full Details
            </button>
          </div>
        )}
      </div>
    </>
  );
}
