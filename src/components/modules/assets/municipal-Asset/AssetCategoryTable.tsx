'use client';

import { Eye, Edit } from 'lucide-react';
import { MOCK_DATA } from './AssetCategoryMock';

interface AssetCategoryTableProps {
  onSelectAsset: (id: string) => void;
  formatCur: (val: number) => string;
}

export function AssetCategoryTable({ onSelectAsset, formatCur }: AssetCategoryTableProps) {
  return (
    <div className="flex-1 overflow-auto custom-scrollbar bg-white">
      <table className="w-full text-left text-[10px] whitespace-nowrap">
        <thead className="sticky top-0 bg-[#112240] text-white z-10 shadow-sm">
          <tr>
            <th className="px-4 py-3 font-bold border-r border-slate-700/50">Asset ID ↕</th>
            <th className="px-4 py-3 font-bold border-r border-slate-700/50 min-w-[200px]">Asset Name & Description ↕</th>
            <th className="px-4 py-3 font-bold border-r border-slate-700/50">Sub Category ↕</th>
            <th className="px-4 py-3 font-bold border-r border-slate-700/50">Location & Ward ↕</th>
            <th className="px-4 py-3 font-bold border-r border-slate-700/50">Acquisition Date ↕</th>
            <th className="px-4 py-3 font-bold border-r border-slate-700/50 text-right">Acquisition Value ↕</th>
            <th className="px-4 py-3 font-bold border-r border-slate-700/50 text-right">Current Value ↕</th>
            <th className="px-4 py-3 font-bold border-r border-slate-700/50 text-right">Depreciation ↕</th>
            <th className="px-4 py-3 font-bold border-r border-slate-700/50 text-right">Net Book Value ↕</th>
            <th className="px-4 py-3 font-bold border-r border-slate-700/50 text-center">Life (Yrs) ↕</th>
            <th className="px-4 py-3 font-bold border-r border-slate-700/50 text-center">Condition ↕</th>
            <th className="px-4 py-3 font-bold border-r border-slate-700/50 text-center">Status ↕</th>
            <th className="px-4 py-3 font-bold border-r border-slate-700/50">Custodian & Department ↕</th>
            <th className="px-4 py-3 font-bold border-r border-slate-700/50">Insurance Details ↕</th>
            <th className="px-4 py-3 font-bold border-r border-slate-700/50">Maintenance Schedule ↕</th>
            <th className="px-4 py-3 font-bold border-r border-slate-700/50">Remarks ↕</th>
            <th className="px-4 py-3 font-bold text-center sticky right-0 bg-[#112240] z-20 shadow-[-4px_0_10px_rgba(0,0,0,0.1)] border-l border-slate-700/50">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-medium">
          {MOCK_DATA.map((row, idx) => (
            <tr key={idx} className="hover:bg-slate-50 transition-colors group">
              <td className="px-4 py-3 border-r border-slate-100 text-slate-800 font-bold">{row.id}</td>
              <td className="px-4 py-3 border-r border-slate-100 text-slate-700">{row.name}</td>
              <td className="px-4 py-3 border-r border-slate-100 text-slate-600">{row.sub}</td>
              <td className="px-4 py-3 border-r border-slate-100 text-slate-600">
                <div className="flex flex-col">
                  <span>{row.loc.split('\n')[0]}</span>
                  <span className="text-[9px] text-slate-400">{row.loc.split('\n')[1]}</span>
                </div>
              </td>
              <td className="px-4 py-3 border-r border-slate-100 text-slate-600">{row.date}</td>
              <td className="px-4 py-3 border-r border-slate-100 text-right font-bold text-slate-700">{formatCur(row.acqVal)}</td>
              <td className="px-4 py-3 border-r border-slate-100 text-right font-black text-emerald-600">{formatCur(row.curVal)}</td>
              <td className="px-4 py-3 border-r border-slate-100 text-right font-bold text-red-500">{formatCur(row.dep)}</td>
              <td className="px-4 py-3 border-r border-slate-100 text-right font-black text-slate-800">{formatCur(row.nbv)}</td>
              <td className="px-4 py-3 border-r border-slate-100 text-center text-slate-600">
                 <div className="flex flex-col items-center">
                    <span className="font-bold">{row.life}</span>
                    <span className="text-[8px] text-slate-400">Rem: {row.rem}</span>
                 </div>
              </td>
              <td className="px-4 py-3 border-r border-slate-100 text-center">
                <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold ${
                  row.condition === 'excellent' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-blue-50 text-blue-600 border-blue-200'
                }`}>
                  {row.condition}
                </span>
              </td>
              <td className="px-4 py-3 border-r border-slate-100 text-center">
                <span className="px-2 py-0.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-600 text-[9px] font-bold">
                  {row.status}
                </span>
              </td>
              <td className="px-4 py-3 border-r border-slate-100 text-slate-600">
                <div className="flex flex-col">
                  <span className="font-bold text-slate-700">{row.cust.split('\n')[0]}</span>
                  <span className="text-[9px] text-slate-500">{row.cust.split('\n')[1]}</span>
                </div>
              </td>
              <td className="px-4 py-3 border-r border-slate-100 text-slate-600">
                <div className="flex flex-col gap-0.5">
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                    </svg> 
                    {row.ins.split('\n')[0]}
                  </span>
                  <span className="text-[9px] text-slate-500">{row.ins.split('\n')[1]}</span>
                  <span className="text-[9px] text-slate-500 font-medium">{row.ins.split('\n')[2]}</span>
                  <span className="text-[9px] text-slate-400">{row.ins.split('\n')[3]}</span>
                </div>
              </td>
              <td className="px-4 py-3 border-r border-slate-100 text-slate-600">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] text-slate-700">{row.maint.split('\n')[0]}</span>
                  <span className="text-[9px] text-slate-500">{row.maint.split('\n')[1]}</span>
                </div>
              </td>
              <td className="px-4 py-3 border-r border-slate-100 text-slate-600">{row.remarks}</td>
              
              <td className="px-4 py-3 text-center sticky right-0 bg-white group-hover:bg-slate-50 z-20 border-l border-slate-200 shadow-[-4px_0_10px_rgba(0,0,0,0.02)]">
                <div className="flex items-center justify-center gap-2">
                  <button 
                    onClick={() => onSelectAsset(row.id)}
                    className="p-1 rounded text-blue-500 hover:bg-blue-50 border border-blue-100 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1 rounded text-emerald-500 hover:bg-emerald-50 border border-emerald-100 transition-colors">
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
