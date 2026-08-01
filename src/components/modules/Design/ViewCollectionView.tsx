import React, { useState } from 'react';
import { Wallet, X, Eye, Printer, Download } from 'lucide-react';

export default function ViewCollectionView({ onClose }: { onClose: () => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const paymentRecords = [
    { receipt: 'REC-2026-908A', date: '05-May-2024', year: '2026-27', mode: 'Net Banking', txn: 'TXN-8817281', amount: '12,456', status: 'Completed', collector: 'Manoj Shinde' },
    { receipt: 'REC-2025-102C', date: '10-Jun-2023', year: '2025-26', mode: 'UPI (GPay)', txn: 'TXN-902811A', amount: '15,525', status: 'Completed', collector: 'R. K. Patil' },
    { receipt: 'REC-2024-889B', date: '18-Aug-2022', year: '2024-25', mode: 'Credit Card', txn: 'TXN-110298B', amount: '23,760', status: 'Completed', collector: 'Self Portal' },
    { receipt: 'REC-2023-401X', date: '20-Nov-2021', year: '2023-24', mode: 'Cheque', txn: 'TXN-99827C', amount: '15,000', status: 'Pending', collector: 'A. R. Sharma' }
  ];

  const filteredRecords = paymentRecords.filter(rec => {
    const matchesSearch = rec.receipt.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          rec.txn.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = selectedYear === 'All' || rec.year === selectedYear;
    const matchesStatus = selectedStatus === 'All' || rec.status === selectedStatus;
    return matchesSearch && matchesYear && matchesStatus;
  });

  return (
    <div className="flex flex-col h-full gap-3 font-sans animate-fadeIn p-1">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 shrink-0 select-none">
        <div className="flex items-center gap-2">
          <div className="bg-[#eff6ff] text-[#002fbe] p-2 rounded-xl border border-blue-100 shadow-xs">
            <Wallet size={16} />
          </div>
          <div>
            <h2 className="font-extrabold text-[#1e2b58] text-xs uppercase tracking-wider leading-none">Property Collection & Payment History</h2>
            <span className="text-slate-600 text-[9px] font-extrabold mt-1 block leading-none">Property ID: 1290082181</span>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 font-extrabold hover:bg-gray-150 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-all active:scale-95"
        >
          <X size={14} />
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap lg:flex-nowrap gap-3 shrink-0 select-none text-[9.5px] font-bold text-gray-550 bg-white border border-gray-200/80 p-3.5 rounded-xl items-center shadow-xs">
        <div className="flex-1 min-w-[200px] flex flex-col gap-1.5">
          <span className="text-slate-600 uppercase tracking-wider text-[8px] font-extrabold">Search Receipt/Txn</span>
          <input 
            type="text" 
            placeholder="Search by Receipt or Transaction ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-1.5 px-3 bg-gray-55/50 border border-gray-200 focus:border-[#002fbe]/40 rounded-lg text-[10px] font-semibold text-gray-800 outline-none transition-colors" 
          />
        </div>
        <div className="flex flex-col gap-1.5 w-full sm:w-32">
          <span className="text-slate-600 uppercase tracking-wider text-[8px] font-extrabold">Filter Year</span>
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full py-1.5 px-2 bg-gray-55/50 border border-gray-200 focus:border-[#002fbe]/40 rounded-lg text-[10px] font-semibold text-gray-800 outline-none transition-colors cursor-pointer"
          >
            <option value="All">All Years</option>
            <option value="2026-27">2026-27</option>
            <option value="2025-26">2025-26</option>
            <option value="2024-25">2024-25</option>
            <option value="2023-24">2023-24</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5 w-full sm:w-36">
          <span className="text-slate-600 uppercase tracking-wider text-[8px] font-extrabold">Filter Payment Status</span>
          <select 
            value={selectedStatus} 
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full py-1.5 px-2 bg-gray-55/50 border border-gray-200 focus:border-[#002fbe]/40 rounded-lg text-[10px] font-semibold text-gray-800 outline-none transition-colors cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Modern Table Container */}
      <div className="flex-grow flex-1 min-h-[220px] overflow-x-auto overflow-y-auto border border-gray-200 rounded-xl relative shadow-xs bg-white table-scroll-container no-scrollbar">
        <table className="w-full text-[9px] text-center border-collapse table-auto">
          <thead>
            <tr className="bg-[#1e2b58] text-white font-extrabold uppercase text-[8px] tracking-wider sticky top-0 z-20 whitespace-nowrap">
              <th className="py-3 px-3 text-left font-black border-r border-white/10">Receipt No</th>
              <th className="py-3 px-3 font-black border-r border-white/10">Date</th>
              <th className="py-3 px-3 font-black border-r border-white/10">FY</th>
              <th className="py-3 px-3 font-black border-r border-white/10">Mode</th>
              <th className="py-3 px-3 font-black border-r border-white/10">Txn ID</th>
              <th className="py-3 px-3 font-black border-r border-white/10">Paid Amount (₹)</th>
              <th className="py-3 px-3 font-black border-r border-white/10">Status</th>
              <th className="py-3 px-3 font-black border-r border-white/10">Collector</th>
              <th className="py-3 px-3 font-black">Actions</th>
            </tr>
          </thead>
          <tbody className="font-extrabold text-slate-800 whitespace-nowrap text-[9.5px]">
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-500 font-extrabold">
                  No payment collection records found.
                </td>
              </tr>
            ) : (
              filteredRecords.map((rec, i) => (
                <tr key={i} className="hover:bg-slate-50/50 border-b border-gray-150 transition-colors">
                  <td className="py-3 px-3 text-left text-blue-700 font-black border-r border-gray-150/40">{rec.receipt}</td>
                  <td className="py-3 px-3 border-r border-gray-150/40 text-slate-700 font-extrabold">{rec.date}</td>
                  <td className="py-3 px-3 border-r border-gray-150/40 font-black text-slate-900">{rec.year}</td>
                  <td className="py-3 px-3 border-r border-gray-150/40 text-slate-700 font-extrabold">{rec.mode}</td>
                  <td className="py-3 px-3 border-r border-gray-150/40 text-slate-800 font-mono font-bold text-[9.5px]">{rec.txn}</td>
                  <td className="py-3 px-3 border-r border-gray-150/40 font-black text-slate-900 tabular-nums text-[10.5px]">₹{rec.amount}</td>
                  <td className="py-3 px-3 border-r border-gray-150/40">
                    <span className={`px-2.5 py-0.5 border rounded-full text-[9.5px] font-black shadow-xs ${
                      rec.status === 'Completed'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200/50'
                        : 'bg-amber-50 text-amber-800 border-amber-200/50'
                    }`}>
                      {rec.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 border-r border-gray-150/40 text-slate-700 font-extrabold">{rec.collector}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center justify-center gap-1.5">
                      <button 
                        onClick={() => alert(`Viewing receipt: ${rec.receipt}`)}
                        className="w-6 h-6 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-xs cursor-pointer active:scale-95"
                        title="View Receipt"
                      >
                        <Eye size={12} />
                      </button>
                      <button 
                        onClick={() => alert(`Printing receipt: ${rec.receipt}`)}
                        className="w-6 h-6 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-xs cursor-pointer active:scale-95"
                        title="Print Receipt"
                      >
                        <Printer size={12} />
                      </button>
                      <button 
                        onClick={() => alert(`Downloading receipt PDF: ${rec.receipt}`)}
                        className="w-6 h-6 flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-xs cursor-pointer active:scale-95"
                        title="Download Receipt"
                      >
                        <Download size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
