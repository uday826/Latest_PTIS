import React from 'react';

interface RulesPanelProps {
  taxBefore: number;
}

export function RulesPanel({ taxBefore }: RulesPanelProps) {
  return (
    <div className="flex flex-col gap-5 flex-grow">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 shrink-0">
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-wider">Tax Before Rules</span>
          <div className="text-[16px] font-black text-slate-800 mt-1">₹{taxBefore.toLocaleString()}</div>
        </div>
        <div className="bg-[#fffbeb] border border-amber-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[8.5px] font-black text-amber-600 uppercase tracking-wider">Total Surcharge</span>
          <div className="text-[16px] font-black text-amber-700 mt-1">+₹86</div>
        </div>
        <div className="bg-[#f0fdf4] border border-green-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[8.5px] font-black text-green-600 uppercase tracking-wider">Total Reduction</span>
          <div className="text-[16px] font-black text-green-700 mt-1">-₹57</div>
        </div>
        <div className="bg-[#eff6ff] border border-blue-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[8.5px] font-black text-blue-600 uppercase tracking-wider">Final Tax</span>
          <div className="text-[16px] font-black text-blue-700 mt-1">₹{(taxBefore + 29).toLocaleString()}</div>
        </div>
        <div className="bg-[#fff7ed] border border-orange-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[8.5px] font-black text-orange-600 uppercase tracking-wider">Net Impact</span>
          <div className="inline-block bg-orange-100 text-orange-700 font-black text-[11px] px-2 py-0.5 rounded-lg mt-1 border border-orange-200">+₹29</div>
        </div>
      </div>

      {/* Table Block */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex-grow min-h-[300px]">
        <div className="overflow-x-auto w-full h-full">
          <table className="w-full text-left border-collapse text-[10.5px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-black uppercase tracking-wider h-[38px]">
                <th className="py-2.5 px-4">Rule</th>
                <th className="py-2.5 px-4 w-20 text-center">Level</th>
                <th className="py-2.5 px-4">Description</th>
                <th className="py-2.5 px-4 w-28">Use Group</th>
                <th className="py-2.5 px-4 w-24 text-right">Before Rate</th>
                <th className="py-2.5 px-4 w-20 text-center">Change</th>
                <th className="py-2.5 px-4 w-24 text-right">Revised Rate</th>
                <th className="py-2.5 px-4 w-24 text-right">Before Tax</th>
                <th className="py-2.5 px-4 w-24 text-right">Tax Impact</th>
                <th className="py-2.5 px-4 w-24 text-right">Revised Tax</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              <tr>
                <td className="py-2 px-4 font-black">R01 Lift — Floor ≤ 10</td>
                <td className="py-2 px-4 text-center"><span className="bg-purple-100 text-purple-700 text-[8.5px] font-black px-2 py-0.5 rounded">Wing</span></td>
                <td className="py-2 px-4 text-slate-500">Wing has operational lift & unit at floor ≤ 10 — surcharge applied</td>
                <td className="py-2 px-4 font-black text-blue-600">All</td>
                <td className="py-2 px-4 text-right">15.0%</td>
                <td className="py-2 px-4 text-center text-red-500 font-black">+10%</td>
                <td className="py-2 px-4 text-right">16.5%</td>
                <td className="py-2 px-4 text-right">₹{taxBefore.toLocaleString()}</td>
                <td className="py-2 px-4 text-right text-red-500 font-black">+₹57</td>
                <td className="py-2 px-4 text-right font-black">₹{(taxBefore + 57).toLocaleString()}</td>
              </tr>
              <tr className="bg-slate-50/30">
                <td className="py-2 px-4 font-black text-slate-400">R02 Lift — Floor &gt; 10</td>
                <td className="py-2 px-4 text-center"><span className="bg-purple-50 text-purple-400 text-[8.5px] font-bold px-2 py-0.5 rounded border border-purple-100">Wing</span></td>
                <td className="py-2 px-4 text-slate-400">Wing has lift & floor above 10 — higher surcharge applied</td>
                <td className="py-2 px-4 text-slate-400">All</td>
                <td className="py-2 px-4 text-right text-slate-400">15.0%</td>
                <td className="py-2 px-4 text-center text-slate-400">—</td>
                <td className="py-2 px-4 text-right text-slate-400">—</td>
                <td className="py-2 px-4 text-right text-slate-400">₹{taxBefore.toLocaleString()}</td>
                <td className="py-2 px-4 text-right text-slate-400">—</td>
                <td className="py-2 px-4 text-right text-slate-400">—</td>
              </tr>
              <tr>
                <td className="py-2 px-4 font-black">R03 Clubhouse / Pool Amenity</td>
                <td className="py-2 px-4 text-center"><span className="bg-purple-100 text-purple-700 text-[8.5px] font-black px-2 py-0.5 rounded">Wing</span></td>
                <td className="py-2 px-4 text-slate-500">Wing has club house or swimming pool — all units surcharge</td>
                <td className="py-2 px-4 font-black text-blue-600">All</td>
                <td className="py-2 px-4 text-right">15.0%</td>
                <td className="py-2 px-4 text-center text-red-500 font-black">+5%</td>
                <td className="py-2 px-4 text-right">15.8%</td>
                <td className="py-2 px-4 text-right">₹{taxBefore.toLocaleString()}</td>
                <td className="py-2 px-4 text-right text-red-500 font-black">+₹29</td>
                <td className="py-2 px-4 text-right font-black">₹{(taxBefore + 29).toLocaleString()}</td>
              </tr>
              <tr className="bg-slate-50/30">
                <td className="py-2 px-4 font-black text-slate-400">R04 Steel Parking Reduction</td>
                <td className="py-2 px-4 text-center"><span className="bg-purple-50 text-purple-400 text-[8.5px] font-bold px-2 py-0.5 rounded border border-purple-100">Wing</span></td>
                <td className="py-2 px-4 text-slate-400">Mechanical/steel parking system — parking units reduced</td>
                <td className="py-2 px-4 text-slate-400">Parking</td>
                <td className="py-2 px-4 text-right text-slate-400">15.0%</td>
                <td className="py-2 px-4 text-center text-slate-400">—</td>
                <td className="py-2 px-4 text-right text-slate-400">—</td>
                <td className="py-2 px-4 text-right text-slate-400">₹{taxBefore.toLocaleString()}</td>
                <td className="py-2 px-4 text-right text-slate-400">—</td>
                <td className="py-2 px-4 text-right text-slate-400">—</td>
              </tr>
              <tr>
                <td className="py-2 px-4 font-black text-slate-400">R05 Open Parking Reduction</td>
                <td className="py-2 px-4 text-center"><span className="bg-purple-50 text-purple-400 text-[8.5px] font-bold px-2 py-0.5 rounded border border-purple-100">Wing</span></td>
                <td className="py-2 px-4 text-slate-400">Open surface parking — parking units reduced rate</td>
                <td className="py-2 px-4 text-slate-400">Parking</td>
                <td className="py-2 px-4 text-right text-slate-400">15.0%</td>
                <td className="py-2 px-4 text-center text-slate-400">—</td>
                <td className="py-2 px-4 text-right text-slate-400">—</td>
                <td className="py-2 px-4 text-right text-slate-400">₹{taxBefore.toLocaleString()}</td>
                <td className="py-2 px-4 text-right text-slate-400">—</td>
                <td className="py-2 px-4 text-right text-slate-400">—</td>
              </tr>
              <tr className="bg-slate-50/30">
                <td className="py-2 px-4 font-black text-slate-400">R06 Mezzanine Floor Reduction</td>
                <td className="py-2 px-4 text-center"><span className="bg-purple-50 text-purple-400 text-[8.5px] font-bold px-2 py-0.5 rounded border border-purple-100">Wing</span></td>
                <td className="py-2 px-4 text-slate-400">Mezzanine/magazine floor — reduced rate for that floor only</td>
                <td className="py-2 px-4 text-slate-400">All</td>
                <td className="py-2 px-4 text-right text-slate-400">15.0%</td>
                <td className="py-2 px-4 text-center text-slate-400">—</td>
                <td className="py-2 px-4 text-right text-slate-400">—</td>
                <td className="py-2 px-4 text-right text-slate-400">₹{taxBefore.toLocaleString()}</td>
                <td className="py-2 px-4 text-right text-slate-400">—</td>
                <td className="py-2 px-4 text-right text-slate-400">—</td>
              </tr>
              <tr>
                <td className="py-2 px-4 font-black text-slate-400">R07 IT Office — Tax Waiver</td>
                <td className="py-2 px-4 text-center"><span className="bg-[#eff6ff] text-blue-700 text-[8.5px] font-black px-2 py-0.5 rounded">Apartment</span></td>
                <td className="py-2 px-4 text-slate-400">Sub-property designated as IT Office — general tax not applied</td>
                <td className="py-2 px-4 text-slate-400">All</td>
                <td className="py-2 px-4 text-right text-slate-400">15.0%</td>
                <td className="py-2 px-4 text-center text-slate-400">—</td>
                <td className="py-2 px-4 text-right text-slate-400">—</td>
                <td className="py-2 px-4 text-right text-slate-400">₹{taxBefore.toLocaleString()}</td>
                <td className="py-2 px-4 text-right text-slate-400">—</td>
                <td className="py-2 px-4 text-right text-slate-400">—</td>
              </tr>
              <tr className="bg-slate-50/30">
                <td className="py-2 px-4 font-black text-slate-400">R08 Small Unit Exemption (&lt;500 sqft)</td>
                <td className="py-2 px-4 text-center"><span className="bg-[#f0fdf4] text-green-700 text-[8.5px] font-black px-2 py-0.5 rounded">Unit</span></td>
                <td className="py-2 px-4 text-slate-400">Built-up area below 500 sqft — 100% tax exemption</td>
                <td className="py-2 px-4 text-slate-400">All</td>
                <td className="py-2 px-4 text-right text-slate-400">15.0%</td>
                <td className="py-2 px-4 text-center text-slate-400">—</td>
                <td className="py-2 px-4 text-right text-slate-400">—</td>
                <td className="py-2 px-4 text-right text-slate-400">₹{taxBefore.toLocaleString()}</td>
                <td className="py-2 px-4 text-right text-slate-400">—</td>
                <td className="py-2 px-4 text-right text-slate-400">—</td>
              </tr>
              <tr>
                <td className="py-2 px-4 font-black text-slate-400">R09 Freedom Fighter Property Waiver</td>
                <td className="py-2 px-4 text-center"><span className="bg-[#f0fdf4] text-green-700 text-[8.5px] font-black px-2 py-0.5 rounded">Unit</span></td>
                <td className="py-2 px-4 text-slate-500">Registered Freedom Fighter / Legal Heir — 100% Tax Waiver</td>
                <td className="py-2 px-4 text-slate-400">All</td>
                <td className="py-2 px-4 text-right">15.0%</td>
                <td className="py-2 px-4 text-center text-slate-400">—</td>
                <td className="py-2 px-4 text-right text-slate-400">—</td>
                <td className="py-2 px-4 text-right text-slate-400">₹{taxBefore.toLocaleString()}</td>
                <td className="py-2 px-4 text-right text-slate-400">—</td>
                <td className="py-2 px-4 text-right text-slate-400">—</td>
              </tr>
              <tr className="bg-slate-50/30">
                <td className="py-2 px-4 font-black">R10 1st Floor Commercial Reduction</td>
                <td className="py-2 px-4 text-center"><span className="bg-purple-100 text-purple-700 text-[8.5px] font-black px-2 py-0.5 rounded">Wing</span></td>
                <td className="py-2 px-4 text-slate-500">Ground floor has commercial use — all floors get rate reduction</td>
                <td className="py-2 px-4 font-black text-blue-600">All</td>
                <td className="py-2 px-4 text-right">15.0%</td>
                <td className="py-2 px-4 text-center text-green-600 font-black">-10%</td>
                <td className="py-2 px-4 text-right">13.5%</td>
                <td className="py-2 px-4 text-right">₹{taxBefore.toLocaleString()}</td>
                <td className="py-2 px-4 text-right text-green-600 font-black">-₹57</td>
                <td className="py-2 px-4 text-right font-black">₹{(taxBefore - 57).toLocaleString()}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 font-black">R11 Balcony — Reduced Rate</td>
                <td className="py-2 px-4 text-center"><span className="bg-[#f0fdf4] text-green-700 text-[8.5px] font-black px-2 py-0.5 rounded">Unit</span></td>
                <td className="py-2 px-4 text-slate-500">Balcony area taxed at 40% of applicable rate only</td>
                <td className="py-2 px-4 font-black text-slate-650">Residential</td>
                <td className="py-2 px-4 text-right">15.0%</td>
                <td className="py-2 px-4 text-center text-[#9333ea] font-black">-40%</td>
                <td className="py-2 px-4 text-right">6.0%</td>
                <td className="py-2 px-4 text-right">₹{taxBefore.toLocaleString()}</td>
                <td className="py-2 px-4 text-right text-[#9333ea] font-black">-₹344</td>
                <td className="py-2 px-4 text-right font-black">₹{(taxBefore - 344).toLocaleString()}</td>
              </tr>
              <tr className="bg-slate-50/30">
                <td className="py-2 px-4 font-black text-slate-400">R12 Ex-Serviceman / Military Exemption</td>
                <td className="py-2 px-4 text-center"><span className="bg-[#f0fdf4] text-green-700 text-[8.5px] font-black px-2 py-0.5 rounded">Unit</span></td>
                <td className="py-2 px-4 text-slate-400">Shaurya Chakra / Ex-Serviceman / Widow — 100% tax exemption</td>
                <td className="py-2 px-4 text-slate-400">All</td>
                <td className="py-2 px-4 text-right text-slate-400">15.0%</td>
                <td className="py-2 px-4 text-center text-slate-400">—</td>
                <td className="py-2 px-4 text-right text-slate-400">—</td>
                <td className="py-2 px-4 text-right text-slate-400">₹{taxBefore.toLocaleString()}</td>
                <td className="py-2 px-4 text-right text-slate-400">—</td>
                <td className="py-2 px-4 text-right text-slate-400">—</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
