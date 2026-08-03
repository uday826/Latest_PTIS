import React from 'react';

// Re-export shared components so existing imports continue to work
export { default as StatusBadge } from '../shared/StatusBadge';
export { default as MapBox } from '../shared/MapBox';
export { default as ChangeDetectionBox } from '../shared/ChangeDetectionBox';

export function Tab({ icon, label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-4 py-2 rounded-t-lg transition-all cursor-pointer text-[10px] font-bold border-t border-l border-r relative z-10 -mb-[1px] ${
        active 
          ? 'bg-white text-[#002fbe] border-[#002fbe] border-b-white z-20' 
          : 'bg-[#002fbe] text-white border-transparent hover:bg-[#002fbe]/90 z-10'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

export function TimelineStep({ id, label, date, active, isInProgress, onClick, isSelected }: any) {
  let circleBg = 'bg-slate-400';
  let symbol = '?';
  let statusText = 'Pending';
  if (active) {
    circleBg = 'bg-[#10b981]';
    symbol = '✓';
    statusText = 'Completed';
  } else if (isInProgress) {
    circleBg = 'bg-blue-600';
    symbol = '●';
    statusText = 'In Progress';
  }

  return (
    <button
      id={`timeline-node-${id}`}
      onClick={(e) => onClick(id, e)}
      aria-label={`View ${label} details (${statusText})`}
      aria-expanded={isSelected}
      aria-controls={isSelected ? `timeline-popup-${id}` : undefined}
      className={`flex flex-col items-center gap-0.5 relative z-10 flex-1 min-w-0 cursor-pointer outline-none group focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 rounded transition-all ${
        isSelected ? 'scale-105' : 'hover:scale-105'
      }`}
    >
      <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-white font-semibold shadow-sm transition-all ${circleBg} text-[8px] group-hover:brightness-95 group-active:scale-90`}>
        {symbol}
      </div>
      <div className="text-center font-semibold text-[7.5px] text-[#002fbe] truncate w-full leading-none mt-0.5 group-hover:underline">{label}</div>
      <div className="text-center font-medium text-[6.5px] text-gray-555 truncate w-full leading-none mt-0.5">{date}</div>
    </button>
  );
}
