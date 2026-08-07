import React from 'react';

export function RetrospectivePanel({ taxBefore }: { taxBefore: number }) {
  const baseTax = taxBefore;
  
  // Year 1 (FY 2021-22) - 3 years retro (72% interest)
  const penaltyY1 = Math.round(baseTax * 0.72);
  const surchargeY1 = Math.round(baseTax * 0.10);
  const totalY1 = baseTax + penaltyY1 + surchargeY1;

  // Year 2 (FY 2022-23) - 2 years retro (48% interest)
  const penaltyY2 = Math.round(baseTax * 0.48);
  const surchargeY2 = Math.round(baseTax * 0.10);
  const totalY2 = baseTax + penaltyY2 + surchargeY2;

  // Year 3 (FY 2023-24) - 1 year retro (24% interest)
  const penaltyY3 = Math.round(baseTax * 0.24);
  const surchargeY3 = Math.round(baseTax * 0.10);
  const totalY3 = baseTax + penaltyY3 + surchargeY3;

  const grandTotal = totalY1 + totalY2 + totalY3;

  return (
    <div className="flex flex-col gap-5 flex-grow font-sans">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 shrink-0 select-none text-[10px]">
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-wider">Annual Base Tax</span>
          <div className="text-[16px] font-black text-slate-800 mt-1">₹{baseTax.toLocaleString()}</div>
        </div>
        <div className="bg-[#fffbeb] border border-amber-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[8.5px] font-black text-amber-600 uppercase tracking-wider">Retrospective Years</span>
          <div className="text-[16px] font-black text-amber-700 mt-1">3 Financial Years</div>
        </div>
        <div className="bg-[#fef2f2] border border-red-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[8.5px] font-black text-red-600 uppercase tracking-wider">Total Interest (24% p.a.)</span>
          <div className="text-[16px] font-black text-red-700 mt-1">₹{(penaltyY1 + penaltyY2 + penaltyY3).toLocaleString()}</div>
        </div>
        <div className="bg-[#eff6ff] border border-blue-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[8.5px] font-black text-blue-600 uppercase tracking-wider">Grand Total Retro Tax</span>
          <div className="text-[16px] font-black text-blue-700 mt-1">₹{grandTotal.toLocaleString()}</div>
        </div>
      </div>

      {/* Table block */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex-grow min-h-[220px] text-[10px]">
        <div className="overflow-x-auto w-full h-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-black uppercase tracking-wider h-[38px]">
                <th className="py-2.5 px-4">Financial Year</th>
                <th className="py-2.5 px-4 text-center">Retro Age</th>
                <th className="py-2.5 px-4 text-right">Base Tax (₹)</th>
                <th className="py-2.5 px-4 text-right">Surcharges (10%)</th>
                <th className="py-2.5 px-4 text-center">Interest Penalty Rate</th>
                <th className="py-2.5 px-4 text-right">Interest Penalty (₹)</th>
                <th className="py-2.5 px-4 text-right font-black">Yearly Net Total (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              <tr className="h-[36px]">
                <td className="py-2 px-4 font-black">FY 2021-22</td>
                <td className="py-2 px-4 text-center"><span className="bg-amber-100 text-amber-800 text-[8.5px] font-black px-2 py-0.5 rounded">36 Months</span></td>
                <td className="py-2 px-4 text-right">₹{baseTax.toLocaleString()}</td>
                <td className="py-2 px-4 text-right">+₹{surchargeY1.toLocaleString()}</td>
                <td className="py-2 px-4 text-center text-red-500 font-bold">24% p.a. (72% Total)</td>
                <td className="py-2 px-4 text-right text-red-500 font-bold">+₹{penaltyY1.toLocaleString()}</td>
                <td className="py-2 px-4 text-right font-black text-slate-800">₹{totalY1.toLocaleString()}</td>
              </tr>
              <tr className="bg-slate-50/30 h-[36px]">
                <td className="py-2 px-4 font-black">FY 2022-23</td>
                <td className="py-2 px-4 text-center"><span className="bg-amber-100 text-amber-800 text-[8.5px] font-black px-2 py-0.5 rounded">24 Months</span></td>
                <td className="py-2 px-4 text-right">₹{baseTax.toLocaleString()}</td>
                <td className="py-2 px-4 text-right">+₹{surchargeY2.toLocaleString()}</td>
                <td className="py-2 px-4 text-center text-red-500 font-bold">24% p.a. (48% Total)</td>
                <td className="py-2 px-4 text-right text-red-500 font-bold">+₹{penaltyY2.toLocaleString()}</td>
                <td className="py-2 px-4 text-right font-black text-slate-800">₹{totalY2.toLocaleString()}</td>
              </tr>
              <tr className="h-[36px]">
                <td className="py-2 px-4 font-black">FY 2023-24</td>
                <td className="py-2 px-4 text-center"><span className="bg-amber-100 text-amber-800 text-[8.5px] font-black px-2 py-0.5 rounded">12 Months</span></td>
                <td className="py-2 px-4 text-right">₹{baseTax.toLocaleString()}</td>
                <td className="py-2 px-4 text-right">+₹{surchargeY3.toLocaleString()}</td>
                <td className="py-2 px-4 text-center text-red-500 font-bold">24% p.a. (24% Total)</td>
                <td className="py-2 px-4 text-right text-red-500 font-bold">+₹{penaltyY3.toLocaleString()}</td>
                <td className="py-2 px-4 text-right font-black text-slate-800">₹{totalY3.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-[#fffbeb] border border-amber-200/50 rounded-xl p-3 text-[9.5px] font-medium text-amber-850 leading-normal select-none">
        <span className="font-extrabold block mb-1">Assessment Rule Reference:</span>
        Under Maharashtra Municipal Corporations Act Section 129A, retrospective taxes are assessed with a compound interest rate of 2% per month (24% per annum) calculated from the date on which the tax originally became due. Lift surcharges and other amenity-based taxes apply to all past periods of actual occupancy or construction completion.
      </div>
    </div>
  );
}
