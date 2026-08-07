import React from 'react';

interface DiscountsPanelProps {
  taxBefore: number;
}

export function DiscountsPanel({ taxBefore }: DiscountsPanelProps) {
  return (
    <div className="flex flex-col gap-5 flex-grow">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 shrink-0">
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-wider">Tax Before Discounts</span>
          <div className="text-[16px] font-black text-slate-800 mt-1">₹{taxBefore.toLocaleString()}</div>
        </div>
        <div className="bg-[#f0fdf4] border border-green-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[8.5px] font-black text-green-600 uppercase tracking-wider">% Benefit</span>
          <div className="text-[16px] font-black text-green-700 mt-1">₹688</div>
        </div>
        <div className="bg-[#eff6ff] border border-blue-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[8.5px] font-black text-blue-600 uppercase tracking-wider">Fixed Benefit</span>
          <div className="text-[16px] font-black text-blue-700 mt-1">₹3,000</div>
        </div>
        <div className="bg-emerald-55 border border-emerald-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[8.5px] font-black text-emerald-600 uppercase tracking-wider">Total Benefit</span>
          <div className="text-[16px] font-black text-emerald-700 mt-1">₹3,688</div>
        </div>
        <div className="bg-[#eef2ff] border border-indigo-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[8.5px] font-black text-indigo-600 uppercase tracking-wider">Final Payable Tax</span>
          <div className="inline-block bg-indigo-100 text-indigo-700 font-black text-[11px] px-2.5 py-0.5 rounded-lg mt-1 border border-indigo-200">₹{(taxBefore - 3688 > 0 ? taxBefore - 3688 : 137).toLocaleString()}</div>
        </div>
      </div>

      {/* Table Block */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex-grow min-h-[300px]">
        <div className="overflow-x-auto w-full h-full">
          <table className="w-full text-left border-collapse text-[10.5px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-black uppercase tracking-wider h-[38px]">
                <th className="py-2.5 px-4">Discount</th>
                <th className="py-2.5 px-4 w-20 text-center">Level</th>
                <th className="py-2.5 px-4">Approval Basis</th>
                <th className="py-2.5 px-4 w-24">Type</th>
                <th className="py-2.5 px-4 w-24">Use Group</th>
                <th className="py-2.5 px-4 w-20 text-center">Benefit</th>
                <th className="py-2.5 px-4 w-28">Validity</th>
                <th className="py-2.5 px-4">Document</th>
                <th className="py-2.5 px-4 w-24 text-right">Before Tax</th>
                <th className="py-2.5 px-4 w-24 text-right">Benefit Amt</th>
                <th className="py-2.5 px-4 w-24 text-right">Final Tax</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              <tr>
                <td className="py-2 px-4 font-black">D01 Women Property Owner</td>
                <td className="py-2 px-4 text-center"><span className="bg-[#f0fdf4] text-green-700 text-[8.5px] font-black px-2 py-0.5 rounded">Unit</span></td>
                <td className="py-2 px-4 text-slate-500">Prior approval + gender certificate</td>
                <td className="py-2 px-4">30% off</td>
                <td className="py-2 px-4 font-black text-blue-600">All</td>
                <td className="py-2 px-4 text-center">30%</td>
                <td className="py-2 px-4 text-slate-500">Ongoing (annual renewal)</td>
                <td className="py-2 px-4 truncate max-w-[150px]">Aadhaar / gender affidavit</td>
                <td className="py-2 px-4 text-right">₹{taxBefore.toLocaleString()}</td>
                <td className="py-2 px-4 text-right text-slate-400">—</td>
                <td className="py-2 px-4 text-right text-slate-400">—</td>
              </tr>
              <tr className="bg-slate-50/30">
                <td className="py-2 px-4 font-black">D02 Person with Disability (≥40%)</td>
                <td className="py-2 px-4 text-center"><span className="bg-[#f0fdf4] text-green-700 text-[8.5px] font-black px-2 py-0.5 rounded">Unit</span></td>
                <td className="py-2 px-4 text-slate-500">Prior approval + disability certificate</td>
                <td className="py-2 px-4">50% off</td>
                <td className="py-2 px-4 font-black text-blue-600">All</td>
                <td className="py-2 px-4 text-center">50%</td>
                <td className="py-2 px-4 text-slate-500">Ongoing</td>
                <td className="py-2 px-4 truncate max-w-[150px]">Disability certificate ≥40% from competent authority</td>
                <td className="py-2 px-4 text-right">₹{taxBefore.toLocaleString()}</td>
                <td className="py-2 px-4 text-right text-slate-400">—</td>
                <td className="py-2 px-4 text-right text-slate-400">—</td>
              </tr>
              <tr>
                <td className="py-2 px-4 font-black">D03 Online Payment Rebate</td>
                <td className="py-2 px-4 text-center"><span className="bg-[#f0fdf4] text-green-700 text-[8.5px] font-black px-2 py-0.5 rounded">Unit</span></td>
                <td className="py-2 px-4 text-slate-500">Auto-verified from payment gateway</td>
                <td className="py-2 px-4">5% off</td>
                <td className="py-2 px-4 font-black text-blue-600">All</td>
                <td className="py-2 px-4 text-center">5%</td>
                <td className="py-2 px-4 text-slate-500">Per transaction</td>
                <td className="py-2 px-4 truncate max-w-[150px]">Online payment receipt</td>
                <td className="py-2 px-4 text-right">₹{taxBefore.toLocaleString()}</td>
                <td className="py-2 px-4 text-right text-slate-400">—</td>
                <td className="py-2 px-4 text-right text-slate-400">—</td>
              </tr>
              <tr className="bg-slate-50/30">
                <td className="py-2 px-4 font-black">D04 Green Building Certificate</td>
                <td className="py-2 px-4 text-center"><span className="bg-purple-100 text-purple-700 text-[8.5px] font-black px-2 py-0.5 rounded">Wing</span></td>
                <td className="py-2 px-4 text-slate-500">Building green rating certificate</td>
                <td className="py-2 px-4">8% off</td>
                <td className="py-2 px-4 font-black text-blue-600">All</td>
                <td className="py-2 px-4 text-center text-green-600 font-bold">8%</td>
                <td className="py-2 px-4 text-slate-500">3 years from certification</td>
                <td className="py-2 px-4 truncate max-w-[150px]">GRIHA/LEED/BEE certificate with star rating</td>
                <td className="py-2 px-4 text-right">₹{taxBefore.toLocaleString()}</td>
                <td className="py-2 px-4 text-right text-green-600 font-black">-₹306</td>
                <td className="py-2 px-4 text-right font-black text-blue-700">₹{(taxBefore - 306).toLocaleString()}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 font-black">D05 Lump-sum Full Payment</td>
                <td className="py-2 px-4 text-center"><span className="bg-[#f0fdf4] text-green-700 text-[8.5px] font-black px-2 py-0.5 rounded">Unit</span></td>
                <td className="py-2 px-4 text-slate-500">Auto-verified — full dues cleared</td>
                <td className="py-2 px-4">5% off</td>
                <td className="py-2 px-4 font-black text-blue-600">All</td>
                <td className="py-2 px-4 text-center text-green-600 font-bold">5%</td>
                <td className="py-2 px-4 text-slate-500">Per assessment year</td>
                <td className="py-2 px-4 truncate max-w-[150px]">Full payment receipt</td>
                <td className="py-2 px-4 text-right">₹{taxBefore.toLocaleString()}</td>
                <td className="py-2 px-4 text-right text-green-600 font-black">-₹191</td>
                <td className="py-2 px-4 text-right font-black text-blue-700">₹{(taxBefore - 191).toLocaleString()}</td>
              </tr>
              <tr className="bg-slate-50/30">
                <td className="py-2 px-4 font-black">D06 Educational Institute + Waste Mgmt</td>
                <td className="py-2 px-4 text-center"><span className="bg-[#eff6ff] text-blue-700 text-[8.5px] font-black px-2 py-0.5 rounded">Apartment</span></td>
                <td className="py-2 px-4 text-slate-500">Prior approval + waste audit report</td>
                <td className="py-2 px-4">7% off</td>
                <td className="py-2 px-4 font-black text-blue-600">All</td>
                <td className="py-2 px-4 text-center">7%</td>
                <td className="py-2 px-4 text-slate-500">Annual (audit required)</td>
                <td className="py-2 px-4 truncate max-w-[150px]">Educational certificate + waste compliance report</td>
                <td className="py-2 px-4 text-right">₹{taxBefore.toLocaleString()}</td>
                <td className="py-2 px-4 text-right text-slate-400">—</td>
                <td className="py-2 px-4 text-right text-slate-400">—</td>
              </tr>
              <tr>
                <td className="py-2 px-4 font-black">D07 Rainwater Harvesting</td>
                <td className="py-2 px-4 text-center"><span className="bg-purple-100 text-purple-700 text-[8.5px] font-black px-2 py-0.5 rounded">Wing</span></td>
                <td className="py-2 px-4 text-slate-500">RWH inspection certificate</td>
                <td className="py-2 px-4">5% off</td>
                <td className="py-2 px-4 font-black text-slate-650">Residential</td>
                <td className="py-2 px-4 text-center text-green-600 font-bold">5%</td>
                <td className="py-2 px-4 text-slate-500">1 year from certification</td>
                <td className="py-2 px-4 truncate max-w-[150px]">RWH installation & inspection certificate</td>
                <td className="py-2 px-4 text-right">₹{taxBefore.toLocaleString()}</td>
                <td className="py-2 px-4 text-right text-green-600 font-black">-₹191</td>
                <td className="py-2 px-4 text-right font-black text-blue-700">₹{(taxBefore - 191).toLocaleString()}</td>
              </tr>
              <tr className="bg-slate-50/30">
                <td className="py-2 px-4 font-black">D08 Solar Power System</td>
                <td className="py-2 px-4 text-center"><span className="bg-purple-100 text-purple-700 text-[8.5px] font-black px-2 py-0.5 rounded">Wing</span></td>
                <td className="py-2 px-4 text-slate-500">Solar commission certificate</td>
                <td className="py-2 px-4">₹3,000 flat</td>
                <td className="py-2 px-4 font-black text-blue-600">All</td>
                <td className="py-2 px-4 text-center text-green-600 font-bold">₹3,000</td>
                <td className="py-2 px-4 text-slate-500">First 3 years</td>
                <td className="py-2 px-4 truncate max-w-[150px]">Solar commission certificate + net-metering bill</td>
                <td className="py-2 px-4 text-right">₹{taxBefore.toLocaleString()}</td>
                <td className="py-2 px-4 text-right text-green-600 font-black">-₹3,000</td>
                <td className="py-2 px-4 text-right font-black text-blue-700">₹{(taxBefore - 3000 > 0 ? taxBefore - 3000 : 825).toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
