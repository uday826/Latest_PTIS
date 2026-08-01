import React, { useState } from 'react';
import { FileText, X } from 'lucide-react';

export default function ViewDemandView({ onClose }: { onClose: () => void }) {
  const [selectedYear, setSelectedYear] = useState('2026-27');

  const demandDataMap: Record<string, any> = {
    '2026-27': {
      status: 'Paid',
      statusColor: 'bg-green-50 text-green-707 border-green-200',
      dueDate: '31-Dec-2026',
      values: {
        current: '18,752', arrears: '0', general: '10,800', water: '2,160',
        education: '1,080', fire: '3,240', other: '1,472', penalty: '0',
        discount: '1,875', total: '16,877'
      }
    },
    '2025-26': {
      status: 'Paid',
      statusColor: 'bg-green-50 text-green-707 border-green-200',
      dueDate: '31-Dec-2025',
      values: {
        current: '17,250', arrears: '0', general: '9,900', water: '1,980',
        education: '990', fire: '2,980', other: '1,400', penalty: '0',
        discount: '1,725', total: '15,525'
      }
    },
    '2024-25': {
      status: 'Partially Paid',
      statusColor: 'bg-orange-55 text-orange-707 border-orange-200',
      dueDate: '31-Dec-2024',
      values: {
        current: '16,200', arrears: '6,480', general: '9,300', water: '1,860',
        education: '930', fire: '2,810', other: '1,300', penalty: '1,080',
        discount: '0', total: '23,760'
      }
    },
    '2023-24': {
      status: 'Outstanding',
      statusColor: 'bg-red-50 text-red-707 border-red-200',
      dueDate: '31-Dec-2023',
      values: {
        current: '15,000', arrears: '15,000', general: '8,600', water: '1,725',
        education: '860', fire: '2,580', other: '1,235', penalty: '3,000',
        discount: '0', total: '33,000'
      }
    }
  };

  const activeDemand = demandDataMap[selectedYear] || demandDataMap['2026-27'];

  return (
    <div className="flex flex-col h-full gap-3 font-sans animate-fadeIn p-1">
      <div className="flex items-center justify-between border-b border-gray-100 pb-2 shrink-0 select-none">
        <div className="flex items-center gap-1.5">
          <div className="bg-purple-50 text-purple-600 p-1.5 rounded-lg border border-purple-100">
            <FileText size={14} />
          </div>
          <div>
            <h2 className="font-extrabold text-[#1e2b58] text-[11px] uppercase tracking-wider leading-none">Property Assessment Demand Details</h2>
            <span className="text-slate-600 text-[8.5px] font-extrabold mt-1 block leading-none">Property ID: 1290082181</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="font-extrabold text-slate-700 text-[9px] uppercase tracking-wider">Financial Year:</label>
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(e.target.value)}
            className="p-1 bg-white border border-[#8b5cf6]/20 rounded font-bold text-gray-800 text-[9px] outline-none cursor-pointer"
          >
            <option value="2026-27">2026-27 (Current)</option>
            <option value="2025-26">2025-26</option>
            <option value="2024-25">2024-25</option>
            <option value="2023-24">2023-24</option>
          </select>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-655 font-extrabold hover:bg-gray-100 w-5 h-5 rounded-full flex items-center justify-center cursor-pointer transition-all"
          >
            <X size={12} />
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-4 no-scrollbar">
        <div className="grid grid-cols-4 gap-2.5 shrink-0 select-none">
          <div className="bg-white border border-[#8b5cf6]/25 rounded-lg p-3.5 flex flex-col gap-0.5 shadow-sm text-center">
            <span className="text-slate-600 font-extrabold text-[9px] uppercase tracking-wider">Current Demand</span>
            <span className="font-black text-[#1e2b58] text-[15px] tabular-nums mt-0.5">₹{activeDemand.values.current}</span>
          </div>
          <div className="bg-white border border-[#8b5cf6]/25 rounded-lg p-3.5 flex flex-col gap-0.5 shadow-sm text-center">
            <span className="text-slate-600 font-extrabold text-[9px] uppercase tracking-wider">Arrears Pending</span>
            <span className={`font-black text-[15px] tabular-nums mt-0.5 ${
              activeDemand.values.arrears !== '0' ? 'text-red-650' : 'text-slate-900'
            }`}>₹{activeDemand.values.arrears}</span>
          </div>
          <div className="bg-[#8b5cf6]/5 border border-[#8b5cf6]/20 rounded-lg p-3.5 flex flex-col gap-0.5 shadow-sm text-center">
            <span className="text-purple-700 font-extrabold text-[9px] uppercase tracking-wider">Total Payable</span>
            <span className="font-black text-[#8b5cf6] text-[16px] tabular-nums mt-0.5">₹{activeDemand.values.total}</span>
          </div>
          <div className="bg-white border border-[#8b5cf6]/25 rounded-lg p-3.5 flex flex-col justify-center items-center gap-1.5 shadow-sm">
            <span className="text-slate-600 font-extrabold text-[9px] uppercase tracking-wider leading-none">Demand Status</span>
            <span className={`px-3 py-1 rounded-full border text-[8.5px] font-extrabold leading-none ${activeDemand.statusColor}`}>
              {activeDemand.status}
            </span>
          </div>
        </div>

        <div className="bg-white border border-[#8b5cf6]/20 rounded-xl overflow-hidden shadow-sm flex flex-col flex-1 min-h-[180px]">
          <div className="bg-gray-55 border-b border-gray-150 px-3.5 py-2 font-extrabold text-[#1e2b58] text-[9.5px] uppercase tracking-wider select-none flex justify-between">
            <span>Tax Component Breakdown</span>
            <span>Due Date: {activeDemand.dueDate}</span>
          </div>
          <div className="p-4 text-[9.5px] leading-relaxed space-y-2.5 font-bold text-gray-700">
            <div className="flex justify-between border-b border-gray-100 pb-1.5">
              <span className="text-[#1e2b58] font-black">General Tax (सामान्य कर)</span>
              <span className="text-gray-900 font-black tabular-nums">₹{activeDemand.values.general}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-1.5">
              <span className="text-blue-700 font-black">Water Tax (जल पट्टी)</span>
              <span className="text-gray-900 font-black tabular-nums">₹{activeDemand.values.water}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-1.5">
              <span className="text-purple-700 font-black">Education Tax (शिक्षण कर)</span>
              <span className="text-gray-900 font-black tabular-nums">₹{activeDemand.values.education}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-1.5">
              <span className="text-red-705 font-black">Fire Tax (अग्निशमन कर)</span>
              <span className="text-gray-900 font-black tabular-nums">₹{activeDemand.values.fire}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-1.5">
              <span className="text-orange-705 font-black">Other Tax Components</span>
              <span className="text-gray-900 font-black tabular-nums">₹{activeDemand.values.other}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-1.5">
              <span className="text-amber-705 font-black">Penalty & Interest</span>
              <span className="text-red-600 font-black tabular-nums">+ ₹{activeDemand.values.penalty}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-1.5">
              <span className="text-green-705 font-black">Early Bird Discount / Exemption</span>
              <span className="text-green-600 font-black tabular-nums">- ₹{activeDemand.values.discount}</span>
            </div>
            <div className="flex justify-between text-[11px] font-black text-gray-955 pt-1.5 uppercase tracking-wider">
              <span>Total Calculated Demand</span>
              <span className="text-[#8b5cf6]">₹{activeDemand.values.total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
