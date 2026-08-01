import React from 'react';
import { 
  ChevronUp, 
  Plus, 
  ChevronDown, 
  Layers, 
  Image as ImageIcon, 
  FileText 
} from 'lucide-react';
import { comparisonRows } from './mockData';

function getStatusBgClass(status: string) {
  switch (status) {
    case 'Matched':
      return 'bg-green-50/70';
    case 'Modified':
      return 'bg-amber-50/70';
    case 'New':
      return 'bg-blue-50/75';
    case 'Missing':
      return 'bg-red-50/75';
    default:
      return '';
  }
}

function getStatusBadgeClass(status: string) {
  switch (status) {
    case 'Matched':
      return 'bg-green-50 text-green-600 border border-green-200/50';
    case 'Modified':
      return 'bg-amber-50 text-amber-600 border border-amber-200/50';
    case 'New':
      return 'bg-blue-50 text-blue-600 border border-blue-200/50';
    case 'Missing':
      return 'bg-red-50 text-red-600 border border-red-200/50';
    default:
      return 'bg-gray-50 text-gray-500 border border-gray-200/50';
  }
}

export default function ComparisonTable() {
  return (
    <div className="w-full flex flex-col border border-gray-200 rounded-xl shadow-xs overflow-hidden bg-white select-none shrink-0">
      <div className="w-full flex divide-x divide-gray-200">
      
      {/* LEFT TABLE: Existing Assessment (Previous) */}
      <div className="w-[41%] shrink-0 flex flex-col bg-white">
        {/* Header block with green tint gradient */}
        <div className="bg-[#edf7f4] border-b border-gray-200 px-3 py-1.5 flex items-center justify-between h-[34px] shrink-0">
          <div className="flex items-center gap-1 select-none">
            <span className="text-[10px] font-black text-[#006a4e] uppercase tracking-tight">Existing Assessment</span>
            <span className="text-[9.5px] text-[#006a4e]/75 font-semibold">(Previous)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button className="text-[8.5px] font-bold text-blue-600 bg-white border border-gray-200 hover:bg-gray-50 rounded px-1.5 py-0.5 shadow-2xs leading-none">
              View Grouped
            </button>
            <button className="text-gray-400 hover:text-gray-600 cursor-pointer">
              <ChevronUp size={11} />
            </button>
            <button className="text-gray-400 hover:text-gray-655 cursor-pointer">
              <Plus size={11} className="rotate-45" />
            </button>
          </div>
        </div>
        
        {/* Horizontal scroll wrapper for left table */}
        <div className="overflow-x-auto w-full scrollbar-thin">
          <table className="min-w-[1100px] text-left border-collapse text-[10px] w-full">
            <thead>
              <tr className="bg-[#edf7f4]/45 border-b border-gray-250 text-[#006a4e] font-black uppercase h-[32px]">
                <th className="py-2 px-1.5 w-6 text-center whitespace-nowrap">#</th>
                <th className="py-2 px-1.5 whitespace-nowrap">Prop No.</th>
                <th className="py-2 px-1.5 whitespace-nowrap">Wing/Flat</th>
                <th className="py-2 px-1.5 whitespace-nowrap">Type</th>
                <th className="py-2 px-1.5 text-center whitespace-nowrap">Flr</th>
                <th className="py-2 px-1.5 text-center whitespace-nowrap">Con Yr</th>
                <th className="py-2 px-1.5 whitespace-nowrap">Con Type</th>
                <th className="py-2 px-1.5 whitespace-nowrap">Use</th>
                <th className="py-2 px-1.5 text-right whitespace-nowrap">Rent/Mo (₹)</th>
                <th className="py-2 px-1.5 text-right whitespace-nowrap">Carpet (Ft²)</th>
                <th className="py-2 px-1.5 text-right whitespace-nowrap">BUA (Ft²)</th>
                <th className="py-2 px-1.5 text-center whitespace-nowrap">AYR</th>
                <th className="py-2 px-1.5 text-center whitespace-nowrap">Rt Pd</th>
                <th className="py-2 px-1.5 text-right whitespace-nowrap">Rate %</th>
                <th className="py-2 px-1.5 text-right whitespace-nowrap">RV (₹)</th>
                <th className="py-2 px-1.5 text-right whitespace-nowrap">Tax (₹)</th>
                <th className="py-2 px-1.5 text-right whitespace-nowrap">Rt Tax (₹)</th>
                <th className="py-2 px-1.5 text-right whitespace-nowrap">Pen (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150">
              {comparisonRows.map((row, index) => {
                const bgClass = getStatusBgClass(row.diffStatus);
                return (
                  <tr key={index} className={`h-[30px] text-gray-700 hover:bg-gray-50/50 ${bgClass}`}>
                    <td className="py-1 px-1.5 text-center font-extrabold text-gray-400 whitespace-nowrap">{row.prevNo}</td>
                    <td className="py-1 px-1.5 font-bold whitespace-nowrap">{row.prevNo !== "-" ? row.currProp : "-"}</td>
                    <td className="py-1 px-1.5 font-bold text-[#002fbe] whitespace-nowrap">{row.prevWing}</td>
                    <td className="py-1 px-1.5 font-bold whitespace-nowrap">{row.prevType}</td>
                    <td className="py-1 px-1.5 text-center whitespace-nowrap">{row.prevFlr}</td>
                    <td className="py-1 px-1.5 text-center whitespace-nowrap">{row.prevYr}</td>
                    <td className="py-1 px-1.5 whitespace-nowrap">{row.prevCon}</td>
                    <td className="py-1 px-1.5 font-semibold text-gray-550 whitespace-nowrap">{row.prevUse}</td>
                    <td className="py-1 px-1.5 text-right whitespace-nowrap">{row.prevRent}</td>
                    <td className="py-1 px-1.5 text-right font-extrabold whitespace-nowrap">{row.prevCarpet || "-"}</td>
                    <td className="py-1 px-1.5 text-right font-extrabold whitespace-nowrap">{row.prevBua || "-"}</td>
                    <td className="py-1 px-1.5 text-center whitespace-nowrap">{row.prevAyr}</td>
                    <td className="py-1 px-1.5 text-center whitespace-nowrap">{row.prevRtPd}</td>
                    <td className="py-1 px-1.5 text-right whitespace-nowrap">{row.prevRate}</td>
                    <td className="py-1 px-1.5 text-right font-extrabold whitespace-nowrap">{row.prevRv}</td>
                    <td className="py-1 px-1.5 text-right font-extrabold text-[#006a4e] whitespace-nowrap">{row.prevTax}</td>
                    <td className="py-1 px-1.5 text-right font-extrabold text-[#006a4e]/85 whitespace-nowrap">{row.prevRtTax}</td>
                    <td className="py-1 px-1.5 text-right text-red-500 font-extrabold whitespace-nowrap">{row.prevPen}</td>
                  </tr>
                );
              })}
              
              {/* Grand Total Row Left */}
              <tr className="h-[32px] bg-gray-50 font-black border-t border-gray-250 text-slate-800">
                <td colSpan={9} className="py-2 px-1.5 uppercase text-[9px] tracking-wider select-none">Total (10 Units)</td>
                <td className="py-2 px-1.5 text-right whitespace-nowrap">4,456</td>
                <td className="py-2 px-1.5 text-right whitespace-nowrap">5,570</td>
                <td colSpan={4} className="whitespace-nowrap"></td>
                <td className="py-2 px-1.5 text-right text-[#006a4e] whitespace-nowrap">83,479</td>
                <td className="py-2 px-1.5 text-right text-[#006a4e] whitespace-nowrap">2,10,039</td>
                <td className="py-2 px-1.5 text-right text-[#006a4e]/85 whitespace-nowrap">2,10,039</td>
                <td className="py-2 px-1.5 text-right text-red-500 whitespace-nowrap">3,360</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* MIDDLE COLUMN: Difference Engine */}
      <div className="w-[18%] shrink-0 flex flex-col bg-[#fffdf5] border-l border-r border-gray-200">
        {/* Header block with yellow tint gradient */}
        <div className="bg-[#fdf8e2] border-b border-amber-250/60 px-3 py-1.5 flex items-center justify-between h-[34px] shrink-0">
          <span className="text-[10px] font-black text-[#8a6d1c] uppercase tracking-tight">Difference Engine</span>
          <button className="text-[8.5px] font-bold text-blue-600 bg-white border border-gray-200 hover:bg-gray-50 rounded px-1.5 py-0.5 shadow-2xs leading-none">
            AI Status
          </button>
        </div>
        
        <div className="w-full overflow-x-auto scrollbar-thin">
          <table className="min-w-[420px] text-left border-collapse text-[10px] w-full">
            <thead>
              <tr className="bg-[#fdf8e2]/60 border-b border-amber-200 text-[#8a6d1c] font-black uppercase h-[32px]">
                <th className="py-2 px-1.5 text-right whitespace-nowrap">Carpet Δ</th>
                <th className="py-2 px-1.5 text-right whitespace-nowrap">BUA Δ</th>
                <th className="py-2 px-1.5 text-right whitespace-nowrap">RV Δ (₹)</th>
                <th className="py-2 px-1.5 text-right whitespace-nowrap">Tax Δ (₹)</th>
                <th className="py-2 px-1.5 text-right whitespace-nowrap">Rt Tax Δ</th>
                <th className="py-2 px-1.5 text-right whitespace-nowrap">Pen Δ</th>
                <th className="py-2 px-1.5 text-center whitespace-nowrap">Suggestion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150">
              {comparisonRows.map((row, index) => {
                const bgClass = getStatusBgClass(row.diffStatus);
                return (
                  <tr key={index} className={`h-[30px] font-bold hover:bg-gray-50/50 ${bgClass}`}>
                    <td className={`py-1 px-1.5 text-right whitespace-nowrap ${row.diffCarpet > 0 ? 'text-red-500 font-extrabold' : 'text-gray-400 font-normal'}`}>
                      {row.diffCarpet > 0 ? `+${row.diffCarpet}` : '0'}
                    </td>
                    <td className={`py-1 px-1.5 text-right whitespace-nowrap ${row.diffBua > 0 ? 'text-red-500 font-extrabold' : 'text-gray-400 font-normal'}`}>
                      {row.diffBua > 0 ? `+${row.diffBua}` : '0'}
                    </td>
                    <td className={`py-1 px-1.5 text-right whitespace-nowrap ${row.diffRv > 0 ? 'text-red-500 font-extrabold' : 'text-gray-400 font-normal'}`}>
                      {row.diffRv > 0 ? `+${row.diffRv.toLocaleString()}` : '0'}
                    </td>
                    <td className={`py-1 px-1.5 text-right whitespace-nowrap ${row.diffTax > 0 ? 'text-red-500 font-extrabold' : 'text-gray-400 font-normal'}`}>
                      {row.diffTax > 0 ? `+${row.diffTax.toLocaleString()}` : '0'}
                    </td>
                    <td className="py-1 px-1.5 text-right text-gray-450 font-normal whitespace-nowrap">0</td>
                    <td className="py-1 px-1.5 text-right text-gray-455 font-normal whitespace-nowrap">0</td>
                    <td className="py-1 px-1 text-center whitespace-nowrap select-none">
                      {row.diffSuggestion !== "-" ? (
                        <span className={`text-[8.5px] font-black px-1.5 py-0.5 rounded border leading-none ${
                          row.diffSuggestion === 'Verify Area' ? 'bg-green-50 text-green-600 border-green-200' :
                          row.diffSuggestion === 'Create New' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                          'bg-amber-50 text-amber-600 border-amber-200'
                        }`}>
                          {row.diffSuggestion}
                        </span>
                      ) : "-"}
                    </td>
                  </tr>
                );
              })}
              
              {/* Grand Total Row Middle */}
              <tr className="h-[32px] bg-[#fdf8e2]/60 font-black border-t border-amber-200 text-[#8a6d1c]">
                <td className="py-2 px-1.5 text-right whitespace-nowrap text-red-500 font-black">+124</td>
                <td className="py-2 px-1.5 text-right whitespace-nowrap text-red-500 font-black">+200</td>
                <td className="py-2 px-1.5 text-right whitespace-nowrap text-red-500 font-black">+2,917</td>
                <td className="py-2 px-1.5 text-right whitespace-nowrap text-red-500 font-black">+11,680</td>
                <td className="py-2 px-1.5 text-right text-gray-400 font-black whitespace-nowrap">0</td>
                <td className="py-2 px-1.5 text-right text-gray-400 font-black whitespace-nowrap">0</td>
                <td className="whitespace-nowrap"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* RIGHT TABLE: New Survey (Current) */}
      <div className="w-[41%] shrink-0 flex flex-col bg-white">
        {/* Header block with blue tint gradient */}
        <div className="bg-[#edf2ff] border-b border-gray-200 px-3 py-1.5 flex items-center justify-between h-[34px] shrink-0">
          <div className="flex items-center gap-1 select-none">
            <span className="text-[10px] font-black text-[#1e40af] uppercase tracking-tight">New Survey</span>
            <span className="text-[9.5px] text-[#1e40af]/75 font-semibold">(Current)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button className="text-[8.5px] font-bold text-blue-600 bg-white border border-gray-200 hover:bg-gray-50 rounded px-1.5 py-0.5 shadow-2xs leading-none">
              View Grouped
            </button>
            <button className="text-gray-400 hover:text-gray-655 cursor-pointer">
              <ChevronUp size={11} />
            </button>
            <button className="text-gray-400 hover:text-gray-655 cursor-pointer">
              <Plus size={11} className="rotate-45" />
            </button>
          </div>
        </div>
        
        {/* Horizontal scroll wrapper for right table */}
        <div className="overflow-x-auto w-full scrollbar-thin">
          <table className="min-w-[1100px] text-left border-collapse text-[10px] w-full">
            <thead>
              <tr className="bg-[#edf2ff]/45 border-b border-gray-250 text-[#1e40af] font-black uppercase h-[32px]">
                <th className="py-2 px-1.5 w-6 text-center whitespace-nowrap">#</th>
                <th className="py-2 px-1.5 whitespace-nowrap">Prop/Flat</th>
                <th className="py-2 px-1.5 whitespace-nowrap">Type</th>
                <th className="py-2 px-1.5 text-center whitespace-nowrap">Flr</th>
                <th className="py-2 px-1.5 text-center whitespace-nowrap">Con Yr</th>
                <th className="py-2 px-1.5 whitespace-nowrap">Con Type</th>
                <th className="py-2 px-1.5 whitespace-nowrap">Use</th>
                <th className="py-2 px-1.5 text-right whitespace-nowrap">Rent/Mo (₹)</th>
                <th className="py-2 px-1.5 text-right whitespace-nowrap">Carpet (Ft²)</th>
                <th className="py-2 px-1.5 text-right whitespace-nowrap">BUA (Ft²)</th>
                <th className="py-2 px-1.5 text-center whitespace-nowrap">AYR-C</th>
                <th className="py-2 px-1.5 text-center whitespace-nowrap">RTPD-C</th>
                <th className="py-2 px-1.5 text-right whitespace-nowrap">Rate %</th>
                <th className="py-2 px-1.5 text-right whitespace-nowrap">RV-C (₹)</th>
                <th className="py-2 px-1.5 text-right whitespace-nowrap">RTX-C (₹)</th>
                <th className="py-2 px-1.5 text-center whitespace-nowrap">Party Details</th>
                <th className="py-2 px-1.5 text-center whitespace-nowrap">Images</th>
                <th className="py-2 px-1.5 text-center whitespace-nowrap">Doc</th>
                <th className="py-2 px-1.5 text-center whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150">
              {comparisonRows.map((row, index) => {
                const bgClass = getStatusBgClass(row.diffStatus);
                const badgeClass = getStatusBadgeClass(row.diffStatus);
                return (
                  <tr key={index} className={`h-[30px] text-gray-700 hover:bg-gray-50/50 ${bgClass}`}>
                    <td className="py-1 px-1.5 text-center font-extrabold text-gray-400 whitespace-nowrap">{row.prevNo}</td>
                    <td className="py-1 px-1.5 font-bold whitespace-nowrap">{row.currProp}</td>
                    <td className="py-1 px-1.5 font-bold text-gray-700 whitespace-nowrap">{row.currType}</td>
                    <td className="py-1 px-1.5 text-center whitespace-nowrap">{row.currFlr}</td>
                    <td className="py-1 px-1.5 text-center whitespace-nowrap">{row.currYr}</td>
                    <td className="py-1 px-1.5 whitespace-nowrap">{row.currCon}</td>
                    <td className="py-1 px-1.5 font-semibold text-gray-550 whitespace-nowrap">{row.currUse}</td>
                    <td className="py-1 px-1.5 text-right whitespace-nowrap">{row.currRent}</td>
                    <td className="py-1 px-1.5 text-right font-extrabold whitespace-nowrap">{row.currCarpet || "-"}</td>
                    <td className="py-1 px-1.5 text-right font-extrabold whitespace-nowrap">{row.currBua || "-"}</td>
                    <td className="py-1 px-1.5 text-center whitespace-nowrap">{row.currAyr}</td>
                    <td className="py-1 px-1.5 text-center whitespace-nowrap">{row.currRtPd}</td>
                    <td className="py-1 px-1.5 text-right whitespace-nowrap">{row.currRate}</td>
                    <td className="py-1 px-1.5 text-right font-extrabold whitespace-nowrap">{row.currRv}</td>
                    <td className="py-1 px-1.5 text-right font-extrabold text-[#1e40af] whitespace-nowrap">{row.currTax}</td>
                    <td className="py-1 px-1.5 text-center text-blue-650 font-bold whitespace-nowrap select-none">
                      {row.currProp !== "-" ? <span className="hover:underline cursor-pointer">Owner</span> : "-"}
                    </td>
                    <td className="py-1 px-1.5 text-center text-gray-400 hover:text-gray-600 whitespace-nowrap cursor-pointer select-none">
                      {row.currProp !== "-" ? <ImageIcon size={12} /> : "-"}
                    </td>
                    <td className="py-1 px-1.5 text-center text-gray-400 hover:text-gray-600 whitespace-nowrap cursor-pointer select-none">
                      {row.currProp !== "-" ? <FileText size={12} /> : "-"}
                    </td>
                    <td className="py-1 px-1 text-center whitespace-nowrap select-none font-bold">
                      <span className={`text-[8.5px] px-1.5 py-0.5 rounded border leading-none ${badgeClass}`}>
                        {row.diffStatus}
                      </span>
                    </td>
                  </tr>
                );
              })}
              
              {/* Grand Total Row Right */}
              <tr className="h-[32px] bg-gray-50 font-black border-t border-gray-250 text-slate-800">
                <td colSpan={8} className="py-2 px-1.5 uppercase text-[9px] tracking-wider select-none">Total</td>
                <td className="py-2 px-1.5 text-right whitespace-nowrap">4,580</td>
                <td className="py-2 px-1.5 text-right whitespace-nowrap">5,770</td>
                <td colSpan={3} className="whitespace-nowrap"></td>
                <td className="py-2 px-1.5 text-right text-[#1e40af] whitespace-nowrap">86,396</td>
                <td className="py-2 px-1.5 text-right text-[#1e40af] whitespace-nowrap">2,21,719</td>
                <td colSpan={4} className="whitespace-nowrap"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      </div>

      {/* Footer info labels inside table card */}
      <div className="flex flex-col md:flex-row items-center justify-between p-3 bg-gray-50/50 border-t border-gray-100 text-[10px] font-bold text-gray-400 rounded-b-xl">
        <div>* Note: Click on any row to view detailed comparison, photos, documents and history.</div>
        <div>Click on <Layers size={11} className="inline mr-1 text-[#3b82f6]" /> to view complete Tax Rules & Discounts policy for the record.</div>
      </div>
    </div>
  );
}
