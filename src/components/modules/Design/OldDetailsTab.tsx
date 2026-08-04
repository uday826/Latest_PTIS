import React, { useState } from 'react';
import { History, ShieldAlert, FileText, ArrowRight } from 'lucide-react';

const mockHistoryRecords = [
  { year: '2023-24', rv: '₹16,20,000', cv: '₹2,02,50,000', tax: '₹16,500', penalty: '₹0', status: 'Paid', date: '10-Jul-2023', rcpt: 'RCPT-2304910' },
  { year: '2022-23', rv: '₹16,20,000', cv: '₹2,02,50,000', tax: '₹16,500', penalty: '₹0', status: 'Paid', date: '15-Jun-2022', rcpt: 'RCPT-2201827' },
  { year: '2021-22', rv: '₹14,50,000', cv: '₹1,81,25,000', tax: '₹14,200', penalty: '₹1,420', status: 'Paid', date: '05-Sep-2021', rcpt: 'RCPT-2100845' }
];

export default function OldDetailsTab() {
  const [mappedUpic, setMappedUpic] = useState<string | null>('UPIC-MUM-7731908');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);

  const mockUpicDatabase = [
    'UPIC-MUM-2041289 (Ramesh K. - Ward 4)',
    'UPIC-MUM-1104820 (Sunita P. - Ward 12)',
    'UPIC-MUM-4592019 (Aniket S. - Ward 3)',
    'UPIC-MUM-8820491 (Varun G. - Ward 9)'
  ];

  const handleSearch = (val: string) => {
    setSearchQuery(val);
    if (val.trim() === '') {
      setSearchResults([]);
    } else {
      setSearchResults(
        mockUpicDatabase.filter(item => 
          item.toLowerCase().includes(val.toLowerCase())
        )
      );
    }
  };

  const linkAccount = (account: string) => {
    setMappedUpic(account.split(' ')[0]);
    setSearchQuery('');
    setSearchResults([]);
    alert(`Successfully mapped Legacy Property Account: ${account.split(' ')[0]}`);
  };

  const unlinkAccount = () => {
    setMappedUpic(null);
    setShowConfirm(false);
    alert('Legacy Property Account unlinked successfully.');
  };

  return (
    <div className="flex flex-col gap-3 font-sans text-gray-800 animate-fadeIn">
      {/* Legacy Mapping Manager */}
      <div className="bg-white border border-gray-200 rounded-xl p-3 flex flex-col shadow-sm select-none">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-2">
          <span className="font-extrabold text-[#002fbe] text-[10px] uppercase tracking-wider flex items-center gap-1.5">
            <History size={13} />
            <span>Legacy Property Mapping Manager (जुना नंबर Mapping)</span>
          </span>
          <span className="text-gray-500 text-[8px] font-bold">PTIS Mapping Index</span>
        </div>

        {mappedUpic ? (
          <div className="bg-green-50/50 border border-green-200 rounded-lg p-2.5 flex flex-col gap-2">
            <div className="flex justify-between items-center text-[10px]">
              <div>
                <span className="text-gray-500 font-bold block">CURRENTLY MAPPED ACCOUNT</span>
                <span className="text-[#006a4e] font-black text-xs block mt-0.5">{mappedUpic}</span>
              </div>
              <button 
                onClick={() => setShowConfirm(true)}
                className="bg-red-50 text-red-500 hover:bg-red-100 border border-red-200 px-2 py-1 rounded text-[8px] font-black tracking-wider uppercase cursor-pointer transition-colors"
                type="button"
              >
                Unlink / Remove
              </button>
            </div>
            
            {showConfirm && (
              <div className="bg-red-50 border border-red-100 rounded-md p-2 mt-1 text-[9px] font-bold text-red-700 flex justify-between items-center animate-scaleIn">
                <span>Are you sure you want to remove this old number mapping?</span>
                <div className="flex gap-2">
                  <button onClick={unlinkAccount} className="bg-red-600 text-white px-2 py-0.5 rounded text-[8px] font-black cursor-pointer uppercase" type="button">Yes, Unlink</button>
                  <button onClick={() => setShowConfirm(false)} className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-[8px] font-black cursor-pointer uppercase" type="button">Cancel</button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-amber-50/30 border border-amber-250/55 rounded-lg p-2.5 flex flex-col gap-2">
            <span className="text-gray-500 text-[9px] font-black uppercase text-amber-800">No legacy assessment account mapped.</span>
            
            {/* Search Input for Linkage */}
            <div className="relative mt-0.5">
              <input 
                type="text" 
                placeholder="Search legacy UPIC, Survey or Assessment No. to link..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full bg-white border border-gray-250 rounded-lg pl-3 pr-8 py-1.5 text-[10px] font-bold text-gray-700 outline-none focus:border-blue-500"
              />
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto z-40 divide-y divide-gray-100">
                  {searchResults.map((item, index) => (
                    <div 
                      key={index}
                      onClick={() => linkAccount(item)}
                      className="px-3 py-2 text-[9.5px] font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer transition-colors flex justify-between items-center"
                    >
                      <span>{item}</span>
                      <span className="text-[8px] bg-blue-100 text-blue-700 px-1 py-0.25 rounded uppercase font-black">Link</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <span className="text-gray-400 text-[8px] leading-tight font-medium mt-0.5">* Type 'UPIC' to view legacy property entries.</span>
          </div>
        )}
      </div>
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
