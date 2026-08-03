import React from 'react';
import { History, ShieldAlert, FileText, ArrowRight } from 'lucide-react';

const mockHistoryRecords = [
  { year: '2023-24', rv: '₹16,20,000', cv: '₹2,02,50,000', tax: '₹16,500', penalty: '₹0', status: 'Paid', date: '10-Jul-2023', rcpt: 'RCPT-2304910' },
  { year: '2022-23', rv: '₹16,20,000', cv: '₹2,02,50,000', tax: '₹16,500', penalty: '₹0', status: 'Paid', date: '15-Jun-2022', rcpt: 'RCPT-2201827' },
  { year: '2021-22', rv: '₹14,50,000', cv: '₹1,81,25,000', tax: '₹14,200', penalty: '₹1,420', status: 'Paid', date: '05-Sep-2021', rcpt: 'RCPT-2100845' }
];

export default function OldDetailsTab() {
  return (
    <div className="flex flex-col gap-3 font-sans text-gray-800 animate-fadeIn">
      {/* Historical Taxes Table */}
      <div className="bg-white border border-gray-200 rounded-xl p-3 flex flex-col shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-2">
          <span className="font-extrabold text-[#002fbe] text-[10px] uppercase tracking-wider flex items-center gap-1.5">
            <History size={13} />
            <span>Historical Assessment Ledger</span>
          </span>
          <span className="text-gray-500 text-[8px] font-bold">(Past 3 Years)</span>
        </div>

        <div className="overflow-x-auto w-full scrollbar-thin">
          <table className="w-full text-center border-collapse text-[9.5px] font-bold">
            <thead>
              <tr className="bg-[#edf2ff]/40 border-b border-gray-200 text-[#002fbe] font-extrabold uppercase h-[28px]">
                <th className="py-1 px-2 text-left">Financial Year</th>
                <th className="py-1 px-2 text-right">Rateable Value (RV)</th>
                <th className="py-1 px-2 text-right">Capital Value (CV)</th>
                <th className="py-1 px-2 text-right">Tax Assessed</th>
                <th className="py-1 px-2 text-right">Penalty</th>
                <th className="py-1 px-2">Payment Status</th>
                <th className="py-1 px-2">Payment Date</th>
                <th className="py-1 px-2 text-left">Receipt No</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700 font-semibold h-[32px]">
              {mockHistoryRecords.map((rec) => (
                <tr key={rec.year} className="hover:bg-slate-50/50">
                  <td className="py-1.5 px-2 text-left text-slate-800 font-extrabold">{rec.year}</td>
                  <td className="py-1.5 px-2 text-right font-extrabold text-[#002fbe]">{rec.rv}</td>
                  <td className="py-1.5 px-2 text-right text-gray-500">{rec.cv}</td>
                  <td className="py-1.5 px-2 text-right font-black text-green-600">{rec.tax}</td>
                  <td className="py-1.5 px-2 text-right text-red-500">{rec.penalty}</td>
                  <td className="py-1.5 px-2">
                    <span className="bg-green-50 text-green-700 border border-green-250 text-[8px] px-1.5 py-0.25 rounded font-black uppercase leading-none">
                      {rec.status}
                    </span>
                  </td>
                  <td className="py-1.5 px-2 text-gray-400 font-medium">{rec.date}</td>
                  <td className="py-1.5 px-2 text-left text-gray-400 font-medium">{rec.rcpt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Structural Audit Deviation / Changes Summary */}
      <div className="bg-white border border-gray-200 rounded-xl p-3 flex flex-col shadow-sm">
        <div className="flex items-center gap-1.5 border-b border-gray-100 pb-1.5 mb-2.5">
          <ShieldAlert size={13} className="text-orange-500" />
          <span className="font-extrabold text-[#002fbe] text-[10px] uppercase tracking-wider">Change Detection History Details</span>
        </div>

        <div className="space-y-2 text-[9px] font-bold">
          <div className="bg-orange-50/30 border border-orange-100/50 rounded-lg p-2.5 flex items-start gap-3">
            <div className="bg-orange-50 border border-orange-200 text-orange-600 rounded p-1 shrink-0 mt-0.5">
              <FileText size={13} />
            </div>
            <div className="text-gray-700 leading-normal">
              <span className="font-black text-[#1e2b58]">Prior Assessment Area Shift Detected:</span>
              <p className="font-medium text-gray-550 mt-1 flex items-center gap-1.5">
                <span>Total Carpet Area (Old Assessment):</span> 
                <span className="font-extrabold text-gray-700">400.00 m²</span>
                <ArrowRight size={10} className="text-gray-400" />
                <span>Current Survey Area:</span>
                <span className="font-black text-[#002fbe]">440.00 m²</span>
              </p>
              <p className="text-[8px] text-gray-400 font-bold mt-1">Audit Event logged during GIS Overlay sync on 20-Feb-2024 by System Auto-detect.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
