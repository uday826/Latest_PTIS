'use client';

import { useState, useRef, useEffect } from 'react';
import { Filter, Download, MapPin, Users, User, FileText, Check, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { AssetCategory } from '@/lib/api/asset/category-type.service';
import { AssetDetailView } from './asset-Detail-View/AssetDetailView';

import { AssetCategoryTable } from './AssetCategoryTable';

interface Props {
  category: AssetCategory;
  onBack: () => void;
}

export function AssetCategoryList({ category, onBack }: Props) {
  const formatCur = (val: number) => '₹' + val.toLocaleString('en-IN');
  const catNameLower = (category.categoryName || '').toLowerCase();
  
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [isFieldDropdownOpen, setIsFieldDropdownOpen] = useState(true); // default open for screenshot representation
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFieldDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (selectedAssetId) {
    return (
      <div className="h-full relative z-10 w-full animate-in fade-in zoom-in-95 duration-200">
        <AssetDetailView assetId={selectedAssetId} onBack={() => setSelectedAssetId(null)} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Top Header */}
      <div className="flex items-center gap-3 bg-[#112240] text-white p-3 rounded-lg shadow-sm w-full mx-auto">
         <button onClick={onBack} className="p-1 hover:bg-white/10 rounded transition-colors text-white cursor-pointer flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
         </button>
         <h2 className="font-bold text-sm tracking-wide">{category.categoryName} Assets</h2>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-visible flex flex-col flex-1">
        {/* Title Banner */}
        <div className="border-b border-slate-200 p-4 text-center">
           <div className="inline-flex items-center gap-2 mb-1">
              <svg className="w-4 h-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/></svg>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">MUNICIPAL CORPORATION ASSET REGISTER</h2>
           </div>
           <p className="text-[10px] text-slate-500 font-medium">Register of {catNameLower} Properties | Updated: 19/5/2026</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-5 divide-x divide-slate-100 border-b border-slate-200 bg-slate-50/50">
          <div className="p-3 text-center flex flex-col justify-center">
             <span className="text-[10px] text-slate-500 mb-1">Total Assets</span>
             <span className="text-sm font-black text-slate-800">8</span>
          </div>
          <div className="p-3 text-center flex flex-col justify-center">
             <span className="text-[10px] text-slate-500 mb-1">Current Value</span>
             <span className="text-sm font-black text-slate-800">₹23,60,00,00,000</span>
          </div>
          <div className="p-3 text-center flex flex-col justify-center">
             <span className="text-[10px] text-slate-500 mb-1">Depreciation</span>
             <span className="text-sm font-black text-slate-800">₹0</span>
          </div>
          <div className="p-3 text-center flex flex-col justify-center">
             <span className="text-[10px] text-slate-500 mb-1">Net Book Value</span>
             <span className="text-sm font-black text-slate-800">₹9,07,69,23,077</span>
          </div>
          <div className="p-3 text-center flex flex-col justify-center">
             <span className="text-[10px] text-slate-500 mb-1">Active Assets</span>
             <span className="text-sm font-black text-slate-800">8</span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between p-3 border-b border-slate-100 bg-slate-50/30">
           <div className="flex items-center gap-3">
             <div className="relative" ref={dropdownRef}>
               <div 
                 onClick={() => setIsFieldDropdownOpen(!isFieldDropdownOpen)}
                 className={`flex items-center gap-2 border rounded-md px-3 py-1.5 cursor-pointer transition-colors shadow-sm ${isFieldDropdownOpen ? 'bg-white border-blue-200 ring-2 ring-blue-50/50' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
               >
                  <Filter className="w-3.5 h-3.5 text-blue-500" />
                  <span className="text-[11px] font-bold text-blue-900">All Fields</span>
                  {isFieldDropdownOpen ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
               </div>

               {isFieldDropdownOpen && (
                 <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-blue-100 rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                   <div className="p-1">
                     <div className="flex items-center justify-between px-3 py-2 bg-blue-50/80 rounded-md cursor-pointer">
                       <div className="flex items-center gap-2 text-blue-700">
                         <Filter className="w-3.5 h-3.5" />
                         <span className="text-[11px] font-bold">All Fields</span>
                       </div>
                       <Check className="w-3.5 h-3.5 text-blue-600" />
                     </div>
                     <div className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-md cursor-pointer text-slate-600">
                       <FileText className="w-3.5 h-3.5 text-slate-400" />
                       <span className="text-[11px] font-bold">Asset ID</span>
                     </div>
                     <div className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-md cursor-pointer text-slate-600">
                       <FileText className="w-3.5 h-3.5 text-slate-400" />
                       <span className="text-[11px] font-bold">Asset Name</span>
                     </div>
                     <div className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-md cursor-pointer text-slate-600">
                       <MapPin className="w-3.5 h-3.5 text-slate-400" />
                       <span className="text-[11px] font-bold">Location</span>
                     </div>
                     <div className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-md cursor-pointer text-slate-600">
                       <Users className="w-3.5 h-3.5 text-slate-400" />
                       <span className="text-[11px] font-bold">Department</span>
                     </div>
                     <div className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-md cursor-pointer text-slate-600">
                       <User className="w-3.5 h-3.5 text-slate-400" />
                       <span className="text-[11px] font-bold">Custodian</span>
                     </div>
                   </div>
                 </div>
               )}
             </div>

             <div className="flex items-center gap-2 border border-slate-200 rounded-md px-3 py-1.5 bg-white w-72 shadow-sm focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400 transition-all">
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <input type="text" placeholder="Search assets..." className="text-[11px] outline-none bg-transparent w-full font-medium placeholder:text-slate-400 text-slate-800" />
             </div>
           </div>
           
           <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 border border-slate-200 rounded-md px-3 py-1.5 bg-white cursor-pointer hover:bg-slate-50 shadow-sm">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-[11px] font-bold text-slate-700">Zone</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
             </div>

             <div className="flex items-center gap-2 border border-slate-200 rounded-md px-3 py-1.5 bg-white cursor-pointer hover:bg-slate-50 shadow-sm">
                <Users className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-[11px] font-bold text-slate-700">Ward</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
             </div>

             <div className="border border-slate-200 rounded-md px-3 py-1.5 bg-slate-50 opacity-70">
                <span className="text-[11px] font-bold text-slate-400">Property No.</span>
             </div>

             <div className="border border-slate-200 rounded-md px-3 py-1.5 bg-slate-50 opacity-70">
                <span className="text-[11px] font-bold text-slate-400">Partition No.</span>
             </div>

             <button className="flex items-center gap-1.5 rounded-md px-4 py-1.5 bg-[#0b5cff] text-white hover:bg-blue-700 transition-colors shadow-sm ml-1">
                <Filter className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold tracking-wide">Filters</span>
                <ChevronUp className="w-3.5 h-3.5 ml-1" />
             </button>

             <button className="flex items-center gap-1.5 border border-emerald-200 rounded-md px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors shadow-sm">
                <Download className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold">Export Excel</span>
                <span className="bg-emerald-200 text-emerald-800 text-[9px] font-black px-1.5 py-0.5 rounded-full ml-1">8</span>
             </button>
           </div>
        </div>

        <AssetCategoryTable onSelectAsset={setSelectedAssetId} formatCur={formatCur} />
        
        {/* Pagination/Footer */}
        <div className="flex items-center justify-end p-2 border-t border-slate-200 bg-slate-50">
           {/* Simple pagination mock for density */}
           <div className="flex items-center gap-1">
             <button className="px-2 py-1 border border-slate-200 bg-white rounded text-[10px] text-slate-400">❮</button>
             <button className="px-2 py-1 bg-blue-600 text-white rounded text-[10px] font-bold">1</button>
             <button className="px-2 py-1 border border-slate-200 bg-white rounded text-[10px] text-slate-600">2</button>
             <button className="px-2 py-1 border border-slate-200 bg-white rounded text-[10px] text-slate-600">3</button>
             <button className="px-2 py-1 border border-slate-200 bg-white rounded text-[10px] text-slate-600">❯</button>
           </div>
        </div>
      </div>
    </div>
  );
}
