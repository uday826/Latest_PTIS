import React from 'react';
import { 
  FileText, 
  UserCheck, 
  Percent, 
  Wallet, 
  Briefcase, 
  Clock 
} from 'lucide-react';
import { TimelineStep } from './DesignComponents';

interface TimelineAndMetricsRowProps {
  selectedTimelineStage: string | null;
  onTimelineNodeClick: (stageId: string, event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function TimelineAndMetricsRow({
  selectedTimelineStage,
  onTimelineNodeClick
}: TimelineAndMetricsRowProps) {
  return (
    <div className="summary-timeline-row grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2 shrink-0 select-none items-stretch">
      {/* Card 1: Area Comparison */}
      <div className="border border-slate-200/90 rounded-xl p-2.5 bg-white hover:border-slate-350 shadow-3xs flex items-center gap-2.5 min-w-0 h-full transition-all duration-300">
        <div className="bg-slate-50 w-9 h-9 rounded-lg grid place-items-center text-slate-500 shrink-0 border border-slate-200">
          <FileText size={15} />
        </div>
        <div className="leading-tight min-w-0 flex flex-col gap-0.5">
          <div className="font-extrabold text-[#002fbe] text-[10px] leading-tight uppercase tracking-wider summary-card-title">Area Comparison</div>
          <div className="space-y-0.5 text-gray-500 font-bold text-[9.5px] lg:text-[10.5px] summary-card-label">
            <div>OLD: <span className="font-extrabold text-gray-700 summary-card-primary-value whitespace-nowrap text-[10px] lg:text-[11px]">400.00 m²</span></div>
            <div>NEW: <span className="font-black text-slate-900 summary-card-primary-value whitespace-nowrap text-[10px] lg:text-[11.5px]">440.00 m²</span></div>
            <div className="text-emerald-600 font-black summary-card-growth flex items-center gap-0.5 mt-0.5 whitespace-nowrap text-[9.5px] lg:text-[10.5px]">
              <span>↑ 40 m² (10%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card 2: Rateable Value */}
      <div className="border border-slate-200/90 rounded-xl p-2.5 bg-white hover:border-slate-350 shadow-3xs flex items-center gap-2.5 min-w-0 h-full transition-all duration-300">
        <div className="bg-slate-50 w-9 h-9 rounded-lg grid place-items-center text-slate-500 shrink-0 border border-slate-200">
          <UserCheck size={15} />
        </div>
        <div className="leading-tight min-w-0 flex flex-col gap-0.5">
          <div className="font-extrabold text-[#002fbe] text-[10px] leading-tight uppercase tracking-wider summary-card-title">Rateable Value (RV)</div>
          <div className="space-y-0.5 text-gray-500 font-bold text-[9.5px] lg:text-[10.5px] summary-card-label">
            <div>OLD: <span className="font-extrabold text-gray-700 summary-card-primary-value whitespace-nowrap text-[10px] lg:text-[11px]">₹16,20,000</span></div>
            <div>NEW: <span className="font-black text-slate-900 summary-card-primary-value whitespace-nowrap text-[10px] lg:text-[11.5px]">₹18,45,000</span></div>
            <div className="text-emerald-600 font-black summary-card-growth flex items-center gap-0.5 mt-0.5 whitespace-nowrap text-[9.5px] lg:text-[10.5px]">
              <span>↑ 13.89%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card 3: Tax (Current) */}
      <div className="border border-slate-200/90 rounded-xl p-2.5 bg-white hover:border-slate-350 shadow-3xs flex items-center gap-2.5 min-w-0 h-full transition-all duration-300">
        <div className="bg-slate-50 w-9 h-9 rounded-lg grid place-items-center text-slate-500 shrink-0 border border-slate-200">
          <Percent size={15} />
        </div>
        <div className="leading-tight min-w-0 flex flex-col gap-0.5">
          <div className="font-extrabold text-[#002fbe] text-[10px] leading-tight uppercase tracking-wider summary-card-title">Tax (Current)</div>
          <div className="space-y-0.5 text-gray-500 font-bold text-[9.5px] lg:text-[10.5px] summary-card-label">
            <div>OLD: <span className="font-extrabold text-gray-700 summary-card-primary-value whitespace-nowrap text-[10px] lg:text-[11px]">₹16,500</span></div>
            <div>NEW: <span className="font-black text-slate-900 summary-card-primary-value whitespace-nowrap text-[10px] lg:text-[11.5px]">₹18,752</span></div>
            <div className="text-emerald-600 font-black summary-card-growth flex items-center gap-0.5 mt-0.5 whitespace-nowrap text-[9.5px] lg:text-[10.5px]">
              <span>↑ 13.65%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card 4: Collection */}
      <div className="border border-slate-200/90 rounded-xl p-2.5 bg-white hover:border-slate-350 shadow-3xs flex items-center gap-2.5 min-w-0 h-full transition-all duration-300">
        <div className="bg-slate-50 w-9 h-9 rounded-lg grid place-items-center text-slate-500 shrink-0 border border-slate-200">
          <Wallet size={15} />
        </div>
        <div className="leading-tight min-w-0 flex flex-col gap-0.5">
          <div className="font-extrabold text-[#002fbe] text-[10px] leading-tight uppercase tracking-wider summary-card-title">Collection</div>
          <div className="space-y-0.5 text-gray-550 font-bold text-[9.5px] lg:text-[10.5px] summary-card-label">
            <div>Paid: <span className="font-extrabold text-emerald-600 summary-card-primary-value whitespace-nowrap text-[10px] lg:text-[11px]">₹12,456</span></div>
            <div>O/S: <span className="font-extrabold text-rose-500 summary-card-primary-value whitespace-nowrap text-[10px] lg:text-[11px]">₹6,296</span></div>
            <div className="text-slate-700 font-black summary-card-growth flex items-center gap-0.5 mt-0.5 whitespace-nowrap text-[9.5px] lg:text-[10.5px]">
              <span>Total: ₹18,752</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card 5: Additional Revenue */}
      <div className="border border-slate-200/90 rounded-xl p-2.5 bg-white hover:border-slate-350 shadow-3xs flex items-center gap-2.5 min-w-0 h-full transition-all duration-300">
        <div className="bg-slate-50 w-9 h-9 rounded-lg grid place-items-center text-slate-500 shrink-0 border border-slate-200">
          <Briefcase size={15} />
        </div>
        <div className="leading-tight min-w-0 flex flex-col gap-0.5">
          <div className="font-extrabold text-[#002fbe] text-[10px] leading-tight uppercase tracking-wider summary-card-title">Addl. Revenue</div>
          <div className="text-gray-400 font-bold text-[8.5px] lg:text-[9px] summary-card-label">This Assessment</div>
          <div className="flex flex-wrap items-baseline gap-1 mt-0.5">
            <span className="font-black text-slate-900 leading-none summary-card-primary-value whitespace-nowrap text-[11px] lg:text-[12px]">₹1,12,892</span>
            <span className="text-emerald-600 font-black summary-card-growth shrink-0 whitespace-nowrap text-[9.5px] lg:text-[10px]">↑ 12.4%</span>
          </div>
          <div className="text-gray-400 font-extrabold mt-0.5 text-[8px] lg:text-[9px] whitespace-nowrap">(Tax+Pen+Int)</div>
        </div>
      </div>

      {/* Card 6: Property Timeline */}
      <div className="timeline-card-wrapper border border-slate-200/90 rounded-xl p-2.5 bg-white hover:border-slate-350 shadow-3xs flex flex-col justify-between select-none col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-2 min-w-0 transition-all duration-300">
        <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 shrink-0">
          <span className="font-extrabold text-[#002fbe] uppercase tracking-wider text-[10px] summary-card-title">Property Timeline</span>
          <Clock size={13} className="text-slate-400" />
        </div>
        
        <div className="flex-1 flex flex-col justify-center my-2">
          <div className="relative flex items-center justify-between px-1 text-[8.5px] lg:text-[9.5px] min-w-0 w-full font-bold">
            <div className="absolute top-[8px] left-[6.25%] w-[56.25%] h-[1.5px] bg-emerald-500 z-0"></div>
            <div className="absolute top-[8px] left-[62.5%] w-[18.75%] h-[1.5px] bg-blue-600 z-0"></div>
            <div className="absolute top-[8px] left-[81.25%] right-[6.25%] h-[1.5px] bg-slate-200/80 z-0"></div>

            <TimelineStep id="geoSequencing" label="Geo Seq" date="15-Jan" active onClick={onTimelineNodeClick} isSelected={selectedTimelineStage === 'geoSequencing'} />
            <TimelineStep id="survey" label="Survey" date="10-Feb" active onClick={onTimelineNodeClick} isSelected={selectedTimelineStage === 'survey'} />
            <TimelineStep id="verification" label="Verify" date="20-Feb" active onClick={onTimelineNodeClick} isSelected={selectedTimelineStage === 'verification'} />
            <TimelineStep id="assessment" label="Assess" date="01-Apr" active onClick={onTimelineNodeClick} isSelected={selectedTimelineStage === 'assessment'} />
            <TimelineStep id="approval" label="Approval" date="20-Apr" active onClick={onTimelineNodeClick} isSelected={selectedTimelineStage === 'approval'} />
            <TimelineStep id="collection" label="Collection" date="05-May" active onClick={onTimelineNodeClick} isSelected={selectedTimelineStage === 'collection'} />
            <TimelineStep id="mutation" label="Mutation" date="In Progress" isInProgress onClick={onTimelineNodeClick} isSelected={selectedTimelineStage === 'mutation'} />
            <TimelineStep id="appeal" label="Appeal" date="Pending" isPending onClick={onTimelineNodeClick} isSelected={selectedTimelineStage === 'appeal'} />
          </div>
        </div>

        <div className="flex gap-3 justify-center text-[7.5px] lg:text-[8px] font-bold text-slate-500 shrink-0 border-t border-slate-100 pt-1.5">
          <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /><span className="leading-none">Completed</span></div>
          <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-600" /><span className="leading-none">In Progress</span></div>
          <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-slate-350" /><span className="leading-none">Pending</span></div>
        </div>
      </div>
    </div>
  );
}
