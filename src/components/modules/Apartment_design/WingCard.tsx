import React from 'react';
import { 
  Home, 
  Briefcase, 
  ShieldCheck, 
  Trash2, 
  Star, 
  Percent, 
  FileText, 
  TrendingUp 
} from 'lucide-react';
import { WingDetails } from './mockData';

interface WingCardProps {
  wing: WingDetails;
  activeMetric: 'discount' | 'exemptions' | 'rvImpact';
  onMetricClick: (e: React.MouseEvent<HTMLButtonElement>, wing: WingDetails, metricType: 'discount' | 'exemptions' | 'rvImpact') => void;
  onDeleteClick: (e: React.MouseEvent<HTMLButtonElement>, wingId: string) => void;
}

export default function WingCard({ 
  wing, 
  activeMetric, 
  onMetricClick,
  onDeleteClick
}: WingCardProps) {
  const getSubMetricIconColor = (type: 'discount' | 'exemptions' | 'rvImpact') => {
    if (activeMetric === type) {
      if (type === 'discount' || type === 'rvImpact') return 'text-green-600';
      return 'text-purple-600';
    }
    if (wing.themeColor === 'purple') return 'text-purple-500';
    if (wing.themeColor === 'orange') return 'text-orange-500';
    if (type === 'discount' || type === 'rvImpact') return 'text-green-500';
    return 'text-blue-500';
  };

  const cardBorderAndShadow = () => {
    if (wing.themeColor === 'purple') return 'border-2 border-purple-200 hover:border-purple-400 hover:shadow-purple-50/40';
    if (wing.themeColor === 'orange') return 'border-2 border-orange-200 hover:border-orange-400 hover:shadow-orange-50/40';
    return 'border-2 border-green-200 hover:border-green-400 hover:shadow-green-50/40';
  };

  return (
    <div className={`bg-white rounded-xl p-2.5 shadow-xs hover:shadow-md transition-all relative flex flex-col justify-between h-full min-h-[195px] ${cardBorderAndShadow()}`}>
      {/* Top row */}
      <div className="flex items-center justify-between pb-0.5">
        <div className="flex items-center gap-1">
          <div className={`w-5 h-5 rounded flex items-center justify-center font-extrabold text-[8.5px] text-white ${wing.badgeBgColor}`}>
            {wing.wing[0]}
          </div>
          <div>
            <span className="text-[11.5px] font-black text-gray-800 block leading-tight">{wing.wing}</span>
            <span className="text-[8.5px] text-gray-500 font-semibold block leading-tight">{wing.name}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 select-none">
          <button 
            onClick={(e) => onDeleteClick(e, wing.id)}
            className="w-5 h-5 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 flex items-center justify-center cursor-pointer transition-colors focus:ring-1 focus:ring-red-400 outline-none"
            title={`Delete ${wing.wing}`}
            aria-label={`Delete ${wing.wing}`}
          >
            <Trash2 size={10.5} />
          </button>
          <div className={`w-6.5 h-6.5 rounded-full border-[1.5px] bg-white flex items-center justify-center font-black text-[9px] ${wing.gradeBorderColor}`}>
            {wing.grade}
          </div>
        </div>
      </div>

      {/* Floors and Units Row */}
      <div className="flex justify-between items-center text-[9px] font-bold text-gray-700 mt-1 px-0.5">
        <span>{wing.floors} Floors</span>
        <span>{wing.units} Units</span>
      </div>

      {/* Usage Categories Row */}
      <div className="bg-[#f8fafc] border-t border-b border-gray-150 py-1 px-1 my-1 flex divide-x divide-gray-200 rounded-md">
        <div className="flex items-center justify-center gap-1 flex-1 text-[8.5px] font-extrabold text-gray-700">
          <Home size={9} className="text-[#3b82f6] shrink-0" />
          <span>Res {wing.res}</span>
        </div>
        <div className="flex items-center justify-center gap-1 flex-1 text-[8.5px] font-extrabold text-gray-700 pl-0.5">
          <Briefcase size={9} className="text-[#f97316] shrink-0" />
          <span>Com {wing.com}</span>
        </div>
        <div className="flex items-center justify-center gap-1 flex-1 text-[8.5px] font-extrabold text-gray-700 pl-0.5">
          <ShieldCheck size={9} className="text-[#a855f7] shrink-0" />
          <span>Amen {wing.amen}</span>
        </div>
      </div>

      {/* Demands Grid */}
      <div className="grid grid-cols-2 divide-x divide-gray-150 py-0.5 my-1 text-center bg-gray-50/50 rounded-md border border-gray-100">
        <div className="pr-0.5 text-center flex flex-col justify-center">
          <span className="text-gray-500 font-semibold text-[8px] uppercase tracking-wider block">New Demand</span>
          <span className="font-extrabold text-[#1e2b58] text-[11px] mt-0.5 block">₹{wing.newDem}</span>
        </div>
        <div className="pl-0.5 text-center flex flex-col justify-center">
          <span className="text-gray-500 font-semibold text-[8px] uppercase tracking-wider block">Retro Demand</span>
          <span className="font-extrabold text-[#1e2b58] text-[11px] mt-0.5 block">₹{wing.retroDem}</span>
        </div>
      </div>

      {/* Collection & Outstanding Row */}
      <div className="grid grid-cols-3 divide-x divide-gray-150 py-0.5 my-0.5 text-center bg-gray-50/50 rounded-md border border-gray-100">
        <div className="flex flex-col justify-center">
          <span className="text-gray-500 font-semibold text-[7px] uppercase tracking-wider block">Collection</span>
          <span className="font-extrabold text-green-600 text-[9.5px] mt-0.5 block">{wing.collection}</span>
          <span className="text-[7px] text-gray-400 font-bold">({wing.collectionPct})</span>
        </div>
        <div className="flex flex-col justify-center">
          <span className="text-gray-500 font-semibold text-[7px] uppercase tracking-wider block">Outstanding</span>
          <span className="font-extrabold text-red-500 text-[9.5px] mt-0.5 block">{wing.outstanding}</span>
        </div>
        <div className="flex flex-col justify-center">
          <span className="text-gray-500 font-semibold text-[7px] uppercase tracking-wider block">Addl. Revenue</span>
          <span className="font-extrabold text-[#002fbe] text-[9.5px] mt-0.5 block">{wing.additionalRevenue}</span>
        </div>
      </div>

      {/* Bottom Metrics Row (Interactive Mini-Tabs) */}
      <div className="grid grid-cols-3 gap-0.5 border-t border-gray-100 pt-1.5 mt-1 text-[8px] leading-tight">
        {/* Discount */}
        <button 
          onClick={(e) => onMetricClick(e, wing, 'discount')}
          className={`flex flex-col items-center justify-center p-1 rounded-md border transition-all cursor-pointer focus:ring-1 focus:ring-blue-500 outline-none ${
            activeMetric === 'discount' 
              ? 'bg-green-50/90 border-green-300 text-green-700 shadow-xs border-b-2 border-b-green-500 font-extrabold' 
              : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50/60 hover:border-gray-250 font-bold'
          }`}
          aria-expanded={activeMetric === 'discount'}
          aria-label={`View ${wing.wing} Discount details`}
        >
          <div className="flex items-center gap-0.5">
            <Percent size={8} className={getSubMetricIconColor('discount')} />
            <span className="text-[7.5px] uppercase tracking-wider">Discount</span>
          </div>
          <span className="text-[10px] mt-0.5">{wing.discount}</span>
          <span className="text-[7.5px] text-gray-550 font-bold">({wing.discLabel})</span>
        </button>

        {/* Exemptions */}
        <button 
          onClick={(e) => onMetricClick(e, wing, 'exemptions')}
          className={`flex flex-col items-center justify-center p-1 rounded-md border transition-all cursor-pointer focus:ring-1 focus:ring-blue-500 outline-none ${
            activeMetric === 'exemptions' 
              ? 'bg-purple-50/90 border-purple-300 text-purple-700 shadow-xs border-b-2 border-b-purple-500 font-extrabold' 
              : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50/60 hover:border-gray-250 font-bold'
          }`}
          aria-expanded={activeMetric === 'exemptions'}
          aria-label={`View ${wing.wing} Exemptions details`}
        >
          <div className="flex items-center gap-0.5">
            <FileText size={8} className={getSubMetricIconColor('exemptions')} />
            <span className="text-[7.5px] uppercase tracking-wider">Exempt</span>
          </div>
          <span className="text-[10px] mt-0.5">{wing.exemp}</span>
          <span className="text-[7.5px] text-gray-550 font-bold truncate max-w-full" title={wing.exempLabel}>({wing.exempLabel})</span>
        </button>

        {/* REV Impact */}
        <button 
          onClick={(e) => onMetricClick(e, wing, 'rvImpact')}
          className={`flex flex-col items-center justify-center p-1 rounded-md border transition-all cursor-pointer focus:ring-1 focus:ring-blue-500 outline-none ${
            activeMetric === 'rvImpact' 
              ? 'bg-green-50/90 border-green-300 text-green-700 shadow-xs border-b-2 border-b-green-500 font-extrabold' 
              : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50/60 hover:border-gray-250 font-bold'
          }`}
          aria-expanded={activeMetric === 'rvImpact'}
          aria-label={`View ${wing.wing} REV Impact details`}
        >
          <div className="flex items-center gap-0.5">
            <TrendingUp size={8} className={getSubMetricIconColor('rvImpact')} />
            <span className="text-[7.5px] uppercase tracking-wider">REV</span>
          </div>
          <span className="text-[10px] mt-0.5">{wing.rvImpact}</span>
          <span className="text-[7.5px] text-green-600 font-bold">({wing.rvLabel})</span>
        </button>
      </div>

      {/* Mods Row */}
      <div className="flex items-center justify-between text-[7.5px] font-bold text-gray-500 mt-1 pt-1 border-t border-gray-100">
        <span>Mods <span className="text-gray-700 font-extrabold">{wing.mods.matched}</span></span>
        <span className="text-red-500">Missing <span className="font-extrabold">{wing.mods.missing}</span></span>
        <span className="text-blue-500">New <span className="font-extrabold">{wing.mods.newCount}</span></span>
        <span className="text-amber-500">Matched <span className="font-extrabold">{wing.mods.modified}</span></span>
      </div>
    </div>
  );
}
