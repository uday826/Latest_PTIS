'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { AssetCategory } from '@/lib/api/asset/category-type.service';
import { IconOnlyActionButton } from '@/components/common/ActionButtons';
import { ArrowLeft, Check, ChevronDown, ChevronUp, Download, FileText, Filter, MapPin, Search, User, Users } from 'lucide-react';
import { AssetCategoryTable } from './AssetCategoryTable';

interface Props {
  category: AssetCategory;
  onBack: () => void;
}

export function AssetCategoryList({ category, onBack }: Props) {
  const router = useRouter();
  const locale = useLocale();
  const formatCur = (val: number) => `\u20B9${val.toLocaleString('en-IN')}`;
  const catNameLower = (category.categoryName || '').toLowerCase();

  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [isFieldDropdownOpen, setIsFieldDropdownOpen] = useState(true);
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

  useEffect(() => {
    if (!selectedAssetId) return;
    router.push(`/${locale}/assets/municipal-Asset/asset-detail/${selectedAssetId}`);
  }, [locale, router, selectedAssetId]);

  return (
    <div className="flex h-full flex-col space-y-4">
      <div className="mx-auto flex w-full items-center gap-3 rounded-lg bg-[#112240] p-3 text-white shadow-sm">
        <IconOnlyActionButton
          icon={ArrowLeft}
          onClick={onBack}
          aria-label="Go back"
          title="Go back"
          variant="ghost"
          size="sm"
          className="h-8 w-8 border border-white/15 bg-transparent px-0 text-white hover:bg-white/10"
        />
        <h2 className="text-sm font-bold tracking-wide">{category.categoryName} Assets</h2>
      </div>

      <div className="flex flex-1 flex-col overflow-visible rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-4 text-center">
          <div className="mb-1 inline-flex items-center gap-2">
            <svg className="h-4 w-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <path d="M22 6l-10 7L2 6" />
            </svg>
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-800">MUNICIPAL CORPORATION ASSET REGISTER</h2>
          </div>
          <p className="text-[10px] font-medium text-slate-500">Register of {catNameLower} Properties | Updated: 19/5/2026</p>
        </div>

        <div className="grid grid-cols-5 divide-x divide-slate-100 border-b border-slate-200 bg-slate-50/50">
          <div className="flex min-h-22 flex-col justify-center p-3 text-center"><span className="mb-1 text-[10px] text-slate-500">Total Assets</span><span className="text-sm font-black text-slate-800">8</span></div>
          <div className="flex min-h-22 flex-col justify-center p-3 text-center"><span className="mb-1 text-[10px] text-slate-500">Current Value</span><span className="text-sm font-black text-slate-800">{formatCur(23600000000)}</span></div>
          <div className="flex min-h-22 flex-col justify-center p-3 text-center"><span className="mb-1 text-[10px] text-slate-500">Depreciation</span><span className="text-sm font-black text-slate-800">{formatCur(0)}</span></div>
          <div className="flex min-h-22 flex-col justify-center p-3 text-center"><span className="mb-1 text-[10px] text-slate-500">Net Book Value</span><span className="text-sm font-black text-slate-800">{formatCur(9076923077)}</span></div>
          <div className="flex min-h-22 flex-col justify-center p-3 text-center"><span className="mb-1 text-[10px] text-slate-500">Active Assets</span><span className="text-sm font-black text-slate-800">8</span></div>
        </div>

        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/30 p-3">
          <div className="flex items-center gap-3">
            <div className="relative" ref={dropdownRef}>
              <div
                onClick={() => setIsFieldDropdownOpen(!isFieldDropdownOpen)}
                className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-1.5 shadow-sm transition-colors ${isFieldDropdownOpen ? 'border-blue-200 bg-white ring-2 ring-blue-50/50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
              >
                <Filter className="h-3.5 w-3.5 text-blue-500" />
                <span className="text-[11px] font-bold text-blue-900">All Fields</span>
                {isFieldDropdownOpen ? <ChevronUp className="h-3.5 w-3.5 text-slate-400" /> : <ChevronDown className="h-3.5 w-3.5 text-slate-400" />}
              </div>

              {isFieldDropdownOpen && (
                <div className="absolute left-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-lg border border-blue-100 bg-white shadow-xl animate-in fade-in zoom-in-95 duration-100">
                  <div className="p-1">
                    <div className="flex items-center justify-between rounded-md bg-blue-50/80 px-3 py-2 cursor-pointer">
                      <div className="flex items-center gap-2 text-blue-700"><Filter className="h-3.5 w-3.5" /><span className="text-[11px] font-bold">All Fields</span></div>
                      <Check className="h-3.5 w-3.5 text-blue-600" />
                    </div>
                    <div className="flex items-center gap-2 rounded-md px-3 py-2 text-slate-600 cursor-pointer hover:bg-slate-50"><FileText className="h-3.5 w-3.5 text-slate-400" /><span className="text-[11px] font-bold">Asset ID</span></div>
                    <div className="flex items-center gap-2 rounded-md px-3 py-2 text-slate-600 cursor-pointer hover:bg-slate-50"><FileText className="h-3.5 w-3.5 text-slate-400" /><span className="text-[11px] font-bold">Asset Name</span></div>
                    <div className="flex items-center gap-2 rounded-md px-3 py-2 text-slate-600 cursor-pointer hover:bg-slate-50"><MapPin className="h-3.5 w-3.5 text-slate-400" /><span className="text-[11px] font-bold">Location</span></div>
                    <div className="flex items-center gap-2 rounded-md px-3 py-2 text-slate-600 cursor-pointer hover:bg-slate-50"><Users className="h-3.5 w-3.5 text-slate-400" /><span className="text-[11px] font-bold">Department</span></div>
                    <div className="flex items-center gap-2 rounded-md px-3 py-2 text-slate-600 cursor-pointer hover:bg-slate-50"><User className="h-3.5 w-3.5 text-slate-400" /><span className="text-[11px] font-bold">Custodian</span></div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex w-72 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 shadow-sm transition-all focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400">
              <Search className="h-3.5 w-3.5 text-slate-400" />
              <input type="text" placeholder="Search assets..." className="w-full bg-transparent text-[11px] font-medium text-slate-800 outline-none placeholder:text-slate-400" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex cursor-pointer items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 shadow-sm hover:bg-slate-50"><MapPin className="h-3.5 w-3.5 text-slate-500" /><span className="text-[11px] font-bold text-slate-700">Zone</span><ChevronDown className="ml-1 h-3.5 w-3.5 text-slate-400" /></div>
            <div className="flex cursor-pointer items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 shadow-sm hover:bg-slate-50"><Users className="h-3.5 w-3.5 text-slate-500" /><span className="text-[11px] font-bold text-slate-700">Ward</span><ChevronDown className="ml-1 h-3.5 w-3.5 text-slate-400" /></div>
            <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 opacity-70"><span className="text-[11px] font-bold text-slate-400">Property No.</span></div>
            <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 opacity-70"><span className="text-[11px] font-bold text-slate-400">Partition No.</span></div>
            <button className="ml-1 flex items-center gap-1.5 rounded-md bg-[#0b5cff] px-4 py-1.5 text-white shadow-sm transition-colors hover:bg-blue-700"><Filter className="h-3.5 w-3.5" /><span className="text-[11px] font-bold tracking-wide">Filters</span><ChevronUp className="ml-1 h-3.5 w-3.5" /></button>
            <button className="flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-emerald-700 shadow-sm transition-colors hover:bg-emerald-100"><Download className="h-3.5 w-3.5" /><span className="text-[11px] font-bold">Export Excel</span><span className="ml-1 rounded-full bg-emerald-200 px-1.5 py-0.5 text-[9px] font-black text-emerald-800">8</span></button>
          </div>
        </div>

        <AssetCategoryTable onSelectAsset={setSelectedAssetId} formatCur={formatCur} />

        <div className="flex items-center justify-end border-t border-slate-200 bg-slate-50 p-2">
          <div className="flex items-center gap-1">
            <button className="rounded border border-slate-200 bg-white px-2 py-1 text-[10px] text-slate-400">‹</button>
            <button className="rounded bg-blue-600 px-2 py-1 text-[10px] font-bold text-white">1</button>
            <button className="rounded border border-slate-200 bg-white px-2 py-1 text-[10px] text-slate-600">2</button>
            <button className="rounded border border-slate-200 bg-white px-2 py-1 text-[10px] text-slate-600">3</button>
            <button className="rounded border border-slate-200 bg-white px-2 py-1 text-[10px] text-slate-600">›</button>
          </div>
        </div>
      </div>
    </div>
  );
}
