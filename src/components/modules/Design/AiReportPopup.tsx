import React from 'react';
import { ComplianceIssue } from './aiReportData';

interface AiReportPopupProps {
  aiReportPopupOpen: boolean;
  aiReportPopupPosition: { top: number; left: number } | null;
  aiReportLoading: boolean;
  closeAiReport: () => void;
  issues: ComplianceIssue[];
  onResolve: (id: string) => void;
  onOverride: (id: string) => void;
  onReopen: (id: string) => void;
}

export default function AiReportPopup({
  aiReportPopupOpen,
  aiReportPopupPosition,
  aiReportLoading,
  closeAiReport,
  issues,
  onResolve,
  onOverride,
  onReopen
}: AiReportPopupProps) {
  if (!aiReportPopupOpen) return null;

  const openIssuesCount = issues.filter(i => i.status === 'Open').length;

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
        className="absolute z-50 timeline-popup bg-white border border-[#002fbe]/25 rounded-xl shadow-2xl p-3 w-[360px] max-w-[calc(100vw-24px)] animate-fadeIn flex flex-col gap-2.5 font-sans"
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
            <span className={`w-2 h-2 rounded-full ${openIssuesCount > 0 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
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
        <div className="flex-grow overflow-y-auto max-h-[260px] pr-0.5 text-[8.5px] no-scrollbar font-bold">
          {aiReportLoading ? (
            <div className="py-8 flex flex-col items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-[#002fbe] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-400 font-bold">Generating AI compliance audit...</span>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Status Banner */}
              <div className={`p-1.5 rounded font-black text-center uppercase tracking-wider mb-1 shrink-0 flex items-center justify-center gap-1 border transition-all ${
                openIssuesCount > 0
                  ? 'bg-red-50 border-red-200 text-red-700'
                  : 'bg-green-50 border-green-200 text-green-700'
              }`}>
                <span>{openIssuesCount} Compliance Issues Flagged</span>
              </div>

              {/* Issues List */}
              <div className="space-y-1.5 text-gray-750 font-semibold">
                {issues.map((issue) => {
                  let severityBg = 'bg-red-50 text-red-600 border-red-200';
                  let borderClass = 'border-red-100/50 bg-red-50/5';
                  let titleColor = 'text-red-650';

                  if (issue.severity === 'Medium') {
                    severityBg = 'bg-orange-50 text-orange-500 border-orange-200';
                    borderClass = 'border-orange-100/50 bg-orange-50/5';
                    titleColor = 'text-orange-600';
                  } else if (issue.severity === 'Low') {
                    severityBg = 'bg-blue-50 text-blue-600 border-blue-200';
                    borderClass = 'border-blue-100/50 bg-blue-50/5';
                    titleColor = 'text-blue-650';
                  }

                  if (issue.status === 'Resolved') {
                    borderClass = 'border-green-200 bg-green-50/20';
                    titleColor = 'text-green-700';
                  } else if (issue.status === 'Overridden') {
                    borderClass = 'border-gray-200 bg-gray-50/40';
                    titleColor = 'text-gray-500';
                  }

                  return (
                    <div key={issue.id} className={`p-2 border rounded-lg flex flex-col gap-1 transition-all ${borderClass}`}>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1">
                          {issue.status === 'Resolved' && (
                            <span className="text-green-600 text-[10px] font-black mr-0.5">✓</span>
                          )}
                          {issue.status === 'Overridden' && (
                            <span className="text-gray-500 text-[10px] font-black mr-0.5">⊘</span>
                          )}
                          <span className={`font-black ${titleColor}`}>{issue.title}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className={`border font-extrabold px-1 rounded text-[7px] leading-none uppercase ${severityBg}`}>
                            {issue.severity}
                          </span>
                          <span className="text-[7.5px] text-gray-400 capitalize">({issue.status})</span>
                        </div>
                      </div>
                      <p className="text-gray-550 leading-tight font-medium text-[8px]">{issue.description}</p>
                      
                      {/* Action buttons or details depending on status */}
                      {issue.status === 'Open' ? (
                        <div className="mt-1 bg-gray-50 p-1.5 rounded text-[7.5px] text-gray-500 font-medium border border-gray-100 flex flex-col gap-1">
                          <div><span className="font-extrabold text-blue-600">Advice:</span> {issue.remediation}</div>
                          <div className="flex gap-1.5 justify-end mt-0.5">
                            <button
                              onClick={() => onOverride(issue.id)}
                              className="px-1.5 py-0.5 bg-white border border-gray-250 hover:bg-gray-100 rounded text-[7px] font-bold text-gray-650 cursor-pointer transition shadow-2xs"
                              type="button"
                            >
                              Override
                            </button>
                            <button
                              onClick={() => onResolve(issue.id)}
                              className="px-2 py-0.5 bg-green-600 hover:bg-green-700 border border-green-700 rounded text-[7px] font-bold text-white cursor-pointer transition shadow-2xs"
                              type="button"
                            >
                              Resolve
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center mt-1 text-[7.5px] border-t border-gray-150/40 pt-1">
                          <span className="text-gray-400 italic font-medium">
                            Action marked as {issue.status}
                          </span>
                          <button
                            onClick={() => onReopen(issue.id)}
                            className="px-1.5 py-0.5 bg-white border border-blue-200 hover:bg-blue-50 rounded text-[7px] font-bold text-blue-600 cursor-pointer transition shadow-2xs animate-fadeIn"
                            type="button"
                          >
                            Reopen
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
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
              type="button"
            >
              Print
            </button>
            <button
              onClick={() => alert('Opening full detailed dashboard report...')}
              className="flex-1 text-center py-1 bg-blue-50 border border-blue-200 hover:bg-blue-100/75 text-[#002fbe] text-[8.5px] font-black rounded cursor-pointer transition-colors focus:outline-none focus:ring-1 focus:ring-[#002fbe]"
              type="button"
            >
              View Full Audit Details
            </button>
          </div>
        )}
      </div>
    </>
  );
}
