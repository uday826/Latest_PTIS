import React from 'react';

interface StatusBadgeProps {
  icon: React.ReactNode;
  title: string;
  status: string;
  statusColor?: string;
  isBlue?: boolean;
}

export default function StatusBadge({ icon, title, status, statusColor, isBlue }: StatusBadgeProps) {
  const bgClass = isBlue ? 'bg-blue-50 text-blue-650' : 'bg-green-50 text-green-655';
  return (
    <div className="flex items-center gap-1.5 pr-2.5 border-r border-gray-200 last:border-0 last:pr-0 shrink-0 flex-1 justify-center">
      <div className={`p-1 rounded-full flex items-center justify-center ${bgClass} w-[22px] h-[22px]`}>
        {icon}
      </div>
      <div>
        <div className="text-[8.5px] text-[#002fbe] font-bold leading-none">{title}</div>
        <div className={`text-[9px] font-black mt-0.5 leading-none ${statusColor || 'text-green-650'}`}>{status}</div>
      </div>
    </div>
  );
}
