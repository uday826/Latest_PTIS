import React from 'react';

export default function TaxesComparisonCard() {
  return (
    <div className="bg-white border border-[#002fbe]/25 rounded-lg p-2.5 flex flex-col shrink-0 mt-1 shadow-md relative">
      <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-gray-150 h-[34px] shrink-0">
        <div className="flex items-center gap-1.5">
          <h3 className="font-extrabold text-[#1e2b58] text-[10px] uppercase tracking-wider leading-none">Headwise Taxes Comparison</h3>
          <span className="text-gray-500 text-[8px] font-bold leading-none">(All Floors Total)</span>
        </div>
        <div className="flex items-center gap-1 bg-gray-50/75 text-gray-500 border border-gray-200/50 px-2.5 py-0.5 rounded-full text-[7.5px] font-semibold leading-none">
          <span>All figures in INR</span>
        </div>
      </div>
      <div className="relative border border-[#002fbe]/15 rounded-md overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-[10px] text-center border-collapse">
            <thead className="bg-[#002fbe] border-b border-[#002fbe]/15 text-white font-bold whitespace-nowrap">
              <tr>
                <th className="py-2 px-2 text-left sticky left-0 bg-[#002fbe] border-r border-white/10 uppercase text-[8px] font-extrabold z-20 text-white">Taxes</th>
                <th className="py-2 px-2 border-r border-white/10 uppercase text-[8px] font-extrabold leading-tight text-white">General Tax</th>
                <th className="py-2 px-2 border-r border-white/10 uppercase text-[8px] font-extrabold leading-tight text-white">State Education Tax</th>
                <th className="py-2 px-2 border-r border-white/10 uppercase text-[8px] font-extrabold leading-tight text-white">Tree Cess</th>
                <th className="py-2 px-2 border-r border-white/10 uppercase text-[8px] font-extrabold leading-tight text-white">Special Water Cess</th>
                <th className="py-2 px-2 border-r border-white/10 uppercase text-[8px] font-extrabold leading-tight text-white">Road Cess</th>
                <th className="py-2 px-2 border-r border-white/10 uppercase text-[8px] font-extrabold leading-tight text-white">Fire Cess</th>
                <th className="py-2 px-2 border-r border-white/10 uppercase text-[8px] font-extrabold leading-tight text-white">Light Cess</th>
                <th className="py-2 px-2 border-r border-white/10 uppercase text-[8px] font-extrabold leading-tight text-white">Water Benefit Cess</th>
                <th className="py-2 px-2 border-r border-white/10 uppercase text-[8px] font-extrabold leading-tight text-white">Sewage Disposal Cess</th>
                <th className="py-2 px-2 uppercase text-[8px] font-extrabold leading-tight text-white">Special Education Tax</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 font-medium text-[#1e2b58] whitespace-nowrap bg-white text-center">
              {/* Row 1: Old Taxes */}
              <tr className="bg-white hover:bg-slate-50 transition-colors duration-150">
                <td className="py-1.5 px-2 text-left sticky left-0 bg-white border-r border-gray-200 z-10">
                  <span className="text-blue-600 text-[8.5px] font-black uppercase tracking-wider pl-1">Old Taxes</span>
                </td>
                <td className="py-1.5 px-2 border-r border-gray-200 text-slate-800 font-bold">0</td>
                <td className="py-1.5 px-2 border-r border-gray-200 text-slate-800 font-bold">0</td>
                <td className="py-1.5 px-2 border-r border-gray-200 text-slate-800 font-bold">0</td>
                <td className="py-1.5 px-2 border-r border-gray-200 text-slate-800 font-bold">0</td>
                <td className="py-1.5 px-2 border-r border-gray-200 text-slate-800 font-bold">0</td>
                <td className="py-1.5 px-2 border-r border-gray-200 text-slate-800 font-bold">0</td>
                <td className="py-1.5 px-2 border-r border-gray-200 text-slate-800 font-bold">0</td>
                <td className="py-1.5 px-2 border-r border-gray-200 text-slate-800 font-bold">0</td>
                <td className="py-1.5 px-2 border-r border-gray-200 text-slate-800 font-bold">0</td>
                <td className="py-1.5 px-2 text-slate-800 font-bold">0</td>
              </tr>
              {/* Row 2: RV Taxes */}
              <tr className="bg-slate-50/40 hover:bg-slate-50 transition-colors duration-150">
                <td className="py-1.5 px-2 text-left sticky left-0 bg-[#fbfdff] border-r border-gray-200 z-10">
                  <span className="text-blue-700 text-[8.5px] font-black uppercase tracking-wider pl-1">RV Taxes</span>
                </td>
                <td className="py-1.5 px-2 border-r border-gray-200 font-bold text-slate-800 tabular-nums">33,480</td>
                <td className="py-1.5 px-2 border-r border-gray-200 font-bold text-slate-800 tabular-nums">6,480</td>
                <td className="py-1.5 px-2 border-r border-gray-200 font-bold text-slate-800 tabular-nums">1,080</td>
                <td className="py-1.5 px-2 border-r border-gray-200 font-bold text-slate-800 tabular-nums">2,160</td>
                <td className="py-1.5 px-2 border-r border-gray-200 font-bold text-slate-800 tabular-nums">6,480</td>
                <td className="py-1.5 px-2 border-r border-gray-200 font-bold text-slate-800 tabular-nums">1,080</td>
                <td className="py-1.5 px-2 border-r border-gray-200 font-bold text-slate-800 tabular-nums">10,800</td>
                <td className="py-1.5 px-2 border-r border-gray-200 font-bold text-slate-800 tabular-nums">18,360</td>
                <td className="py-1.5 px-2 border-r border-gray-200 font-bold text-slate-800 tabular-nums">15,120</td>
                <td className="py-1.5 px-2 font-bold text-slate-800 tabular-nums">3,240</td>
              </tr>
              {/* Row 3: CV Taxes */}
              <tr className="bg-purple-50/20 hover:bg-purple-50/40 transition-colors duration-150 font-bold">
                <td className="py-1.5 px-2 text-left sticky left-0 bg-[#fcfbfe] border-r border-gray-200 z-10">
                  <span className="text-purple-700 text-[8.5px] font-black uppercase tracking-wider pl-1">CV Taxes</span>
                </td>
                <td className="py-1.5 px-2 border-r border-gray-200 font-bold text-slate-800 tabular-nums">1,53,47,12,291</td>
                <td className="py-1.5 px-2 border-r border-gray-200 font-bold text-slate-800 tabular-nums">41,80,17,898</td>
                <td className="py-1.5 px-2 border-r border-gray-200 font-bold text-slate-800 tabular-nums">27,86,78,598</td>
                <td className="py-1.5 px-2 border-r border-gray-200 font-bold text-slate-800 tabular-nums">27,86,78,598</td>
                <td className="py-1.5 px-2 border-r border-gray-200 font-bold text-slate-800 tabular-nums">27,86,78,598</td>
                <td className="py-1.5 px-2 border-r border-gray-200 font-bold text-slate-800 tabular-nums">27,86,78,598</td>
                <td className="py-1.5 px-2 border-r border-gray-200 font-bold text-slate-800 tabular-nums">27,86,78,598</td>
                <td className="py-1.5 px-2 border-r border-gray-200 font-bold text-slate-800 tabular-nums">34,83,48,248</td>
                <td className="py-1.5 px-2 border-r border-gray-200 font-bold text-slate-800 tabular-nums">34,83,48,248</td>
                <td className="py-1.5 px-2 font-bold text-slate-800 tabular-nums">27,86,78,598</td>
              </tr>
              {/* Row 4: Retain U.S. 129 */}
              <tr className="bg-white hover:bg-slate-50 transition-colors duration-150">
                <td className="py-1.5 px-2 text-left sticky left-0 bg-[#fffdfd] border-r border-gray-200 z-10">
                  <span className="text-red-600 text-[8.5px] font-black uppercase tracking-wider pl-1">Retain U.S. 129</span>
                </td>
                <td className="py-1.5 px-2 border-r border-gray-200 text-slate-800 font-bold">0</td>
                <td className="py-1.5 px-2 border-r border-gray-200 text-slate-800 font-bold">0</td>
                <td className="py-1.5 px-2 border-r border-gray-200 text-slate-800 font-bold">0</td>
                <td className="py-1.5 px-2 border-r border-gray-200 text-slate-800 font-bold">0</td>
                <td className="py-1.5 px-2 border-r border-gray-200 text-slate-800 font-bold">0</td>
                <td className="py-1.5 px-2 border-r border-gray-200 text-slate-800 font-bold">0</td>
                <td className="py-1.5 px-2 border-r border-gray-200 text-slate-800 font-bold">0</td>
                <td className="py-1.5 px-2 border-r border-gray-200 text-slate-800 font-bold">0</td>
                <td className="py-1.5 px-2 border-r border-gray-200 text-slate-800 font-bold">0</td>
                <td className="py-1.5 px-2 text-slate-800 font-bold">0</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
