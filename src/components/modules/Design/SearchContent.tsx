import React, { useState } from 'react';
import { Search, Filter, RefreshCw, FileText, ArrowRight, UserCheck } from 'lucide-react';

export default function SearchContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    // Add mock results
    setResults([
      { upic: 'UPIC-270465-2024-000123', name: 'MATOSHREE', mobile: '+91 98******10', ward: 'घोडबंदर मानपाडा', type: 'Residential', status: 'Active' },
      { upic: 'UPIC-270465-2024-000185', name: 'SHIV PRASAD COOP', mobile: '+91 97******22', ward: 'कोपरी', type: 'Residential', status: 'Active' },
      { upic: 'UPIC-270465-2024-000214', name: 'KOTHARI APARTMENTS', mobile: '+91 90******05', ward: 'वागळे इस्टेट', type: 'Commercial', status: 'Active' },
    ]);
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar bg-gray-50/50 p-6 font-sans text-gray-800 animate-fadeIn">
      {/* Title */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-[#1e2b58]">Property Tax Search</h2>
          <p className="text-xs text-gray-500 mt-1">Lookup municipal properties by ID, UPIC, Owner name, or mobile registration.</p>
        </div>
      </div>

      {/* Search Box Card */}
      <div className="bg-white border border-gray-150 rounded-xl p-5 shadow-sm mb-6">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="col-span-1 md:col-span-2">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Property Details (UPIC / Owner / Mobile)</label>
            <div className="relative flex items-center border border-gray-200 rounded-md overflow-hidden bg-white shadow-inner">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter search parameters..."
                className="w-full py-2 px-3 text-xs outline-none placeholder-gray-400"
              />
              <span className="p-2 text-gray-400"><Search size={15} /></span>
            </div>
          </div>
          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Ward / Division</label>
            <select className="w-full py-2 px-3 border border-gray-200 rounded-md text-xs outline-none bg-white">
              <option>All Divisions</option>
              <option>घोडबंदर मानपाडा</option>
              <option>कोपरी</option>
              <option>वागळे इस्टेट</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 rounded-md transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer">
              <Search size={14} /> Search
            </button>
            <button type="button" onClick={() => { setSearchQuery(''); setResults([]); setSearched(false); }} className="px-3 py-2 border border-gray-200 hover:bg-gray-50 rounded-md text-gray-500 transition-colors flex items-center justify-center cursor-pointer">
              <RefreshCw size={14} />
            </button>
          </div>
        </form>
      </div>

      {/* Results Table */}
      {searched && (
        <div className="bg-white border border-gray-150 rounded-xl overflow-hidden shadow-sm animate-fadeIn">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-xs text-[#1e2b58]">SEARCH RESULTS ({results.length})</h3>
          </div>
          {results.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#1e2b58] text-white">
                  <tr>
                    <th className="p-3 uppercase text-[10px] font-semibold">Property ID / UPIC</th>
                    <th className="p-3 uppercase text-[10px] font-semibold">Property Holder</th>
                    <th className="p-3 uppercase text-[10px] font-semibold">Mobile No</th>
                    <th className="p-3 uppercase text-[10px] font-semibold">Ward / Division</th>
                    <th className="p-3 uppercase text-[10px] font-semibold">Property Type</th>
                    <th className="p-3 uppercase text-[10px] font-semibold">Status</th>
                    <th className="p-3 uppercase text-[10px] font-semibold text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {results.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="p-3 font-bold text-blue-700">{row.upic}</td>
                      <td className="p-3 font-semibold text-gray-800">{row.name}</td>
                      <td className="p-3 text-gray-500 font-mono">{row.mobile}</td>
                      <td className="p-3 text-gray-700">{row.ward}</td>
                      <td className="p-3">{row.type}</td>
                      <td className="p-3">
                        <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded font-bold">{row.status}</span>
                      </td>
                      <td className="p-3 text-center">
                        <button className="text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1 mx-auto font-semibold hover:underline cursor-pointer">
                          Select <ArrowRight size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-400">No properties found matching your search.</div>
          )}
        </div>
      )}
    </div>
  );
}
