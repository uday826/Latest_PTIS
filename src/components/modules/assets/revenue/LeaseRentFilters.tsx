'use client';

import { Search } from 'lucide-react';

interface FiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  category: string;
  setCategory: (cat: string) => void;
  zone: string;
  setZone: (zone: string) => void;
  ward: string;
  setWard: (ward: string) => void;
  assetSelect: string;
  setAssetSelect: (asset: string) => void;
}

export function LeaseRentFilters({
  searchQuery,
  setSearchQuery,
  category,
  setCategory,
  zone,
  setZone,
  ward,
  setWard,
  assetSelect,
  setAssetSelect,
}: FiltersProps) {
  return (
    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 shadow-inner">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Search */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Search</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </span>
            <input
              type="text"
              placeholder="Search by name, path or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all outline-none"
            />
          </div>
        </div>

        {/* Category */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Asset Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all outline-none"
          >
            <option value="Shopping Complex">Shopping Complex</option>
            <option value="Open Land">Open Land</option>
            <option value="Garden">Municipal Garden</option>
            <option value="Quarters">Municipal Quarters</option>
          </select>
        </div>

        {/* Zone */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Zone</label>
          <select
            value={zone}
            onChange={(e) => setZone(e.target.value)}
            className="w-full px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all outline-none"
          >
            <option value="all">All Zones</option>
            <option value="East">East Zone</option>
            <option value="West">West Zone</option>
            <option value="North">North Zone</option>
            <option value="South">South Zone</option>
          </select>
        </div>

        {/* Ward */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Ward</label>
          <select
            value={ward}
            onChange={(e) => setWard(e.target.value)}
            className="w-full px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all outline-none"
          >
            <option value="all">All Wards</option>
            <option value="Ward 1">Ward 1</option>
            <option value="Ward 2">Ward 2</option>
            <option value="Ward 3">Ward 3</option>
          </select>
        </div>

        {/* Select Asset */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Select Asset</label>
          <select
            value={assetSelect}
            onChange={(e) => setAssetSelect(e.target.value)}
            className="w-full px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all outline-none"
          >
            <option value="all">All</option>
            <option value="MPMS-AS-9">MPMS-AS-9</option>
            <option value="MPMS-AS-10">MPMS-AS-10</option>
            <option value="MPMS-AS-15">MPMS-AS-15</option>
          </select>
        </div>
      </div>
    </div>
  );
}
