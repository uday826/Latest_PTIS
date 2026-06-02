'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Layers, ArrowRight } from 'lucide-react';
import { Button } from '@/components/common';
import { AssetCategory, AssetType } from '@/lib/api/asset/category-type.service';

interface AssetCategoryCardProps {
  category: AssetCategory;
  meta: {
    id: string;
    icon: React.ComponentType<any>;
    description: string;
  };
  theme: any;
  catTypes: AssetType[];
  visibleCount: number;
  onVisibleCountChange: (count: number) => void;
  onSelectCategory: () => void;
}

export function AssetCategoryCard({
  category,
  meta,
  theme: t,
  catTypes,
  visibleCount,
  onVisibleCountChange,
  onSelectCategory
}: AssetCategoryCardProps) {
  const Icon = meta.icon;
  const examples = catTypes.map(t => t.assetTypeName || t.typeName || (t as any).name || "Unknown");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      onClick={onSelectCategory}
      className={`group relative rounded-2xl overflow-hidden shadow-md border ${t.heroBorder} bg-white flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer`}
    >
      {/* ── HERO BANNER ── */}
      <div className={`relative bg-gradient-to-br ${
        meta.id === 'building' ? 'from-[#f0f9ff] via-[#e0f2fe] to-[#bae6fd]' :
        meta.id === 'land' ? 'from-[#f7fee7] via-[#ecfccb] to-[#d9f99d]' :
        meta.id === 'infrastructure' ? 'from-[#fdf4ff] via-[#fae8ff] to-[#f5d0fe]' :
        'from-[#fffbeb] via-[#fef3c7] to-[#fde68a]'
      } px-4 pt-4 pb-12 overflow-hidden flex-shrink-0`}>

        <div className={`absolute inset-0 bg-gradient-to-br ${t.hero} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

        <div className="relative z-[2] flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className={`relative w-10 h-10 rounded-lg ring-2 ${t.iconRing} flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-105 transition-transform duration-300 overflow-hidden`}>
              <div className={`absolute inset-0 ${t.dot} opacity-100 group-hover:opacity-0 transition-opacity duration-300`} />
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Icon className="relative z-10 w-5 h-5 text-white" />
            </div>

            <div className="min-w-0">
              <h3 className={`text-slate-900 group-hover:text-white text-[15px] font-black leading-tight truncate transition-colors duration-300`}>
                {category.categoryName}
              </h3>
              <p className={`text-slate-500 group-hover:text-white/90 text-[9px] mt-0.5 font-medium leading-snug line-clamp-2 transition-colors duration-300`}>
                {meta.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── STAT CARD ── */}
      <div className="relative -mt-7 mx-4 z-10 flex-shrink-0">
        <div className={`${t.statBg} border ${t.statBorder} rounded-xl shadow-lg overflow-hidden p-2.5`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${t.statBg}`}>
                <BarChart3 className={`w-3.5 h-3.5 ${t.statText}`} />
              </div>
              <div>
                <p className={`text-[8px] font-bold uppercase tracking-widest ${t.statLabel} leading-none mb-0.5`}>
                  Types
                </p>
                <p className={`text-lg font-black leading-none ${t.statText}`}>
                  {catTypes.length.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="flex-1 px-4 pt-3 pb-4 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Layers className={`w-3 h-3 ${t.statLabel}`} />
          <p className={`text-[9px] font-bold uppercase tracking-widest ${t.statLabel}`}>
            Asset Types
          </p>
          <div className={`flex-1 h-px opacity-30 ${t.accentBar}`} />
        </div>

        <div className="flex flex-wrap gap-1.5" onClick={(e) => e.stopPropagation()}>
          {examples.length > 0 ? examples.slice(0, visibleCount).map((example, idx) => (
            <div
              key={idx}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-bold transition-all duration-150 ${t.chipBg} ${t.chipBorder} ${t.chipText} ${t.chipHover} hover:shadow-sm`}
            >
              <span className={`w-1 h-1 rounded-full flex-shrink-0 ${t.dot}`} />
              {example}
            </div>
          )) : (
            <div className={`text-[10px] font-medium text-slate-400 italic`}>No types found</div>
          )}
          {examples.length > visibleCount && (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onVisibleCountChange(examples.length);
              }}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold text-white bg-slate-800 hover:opacity-90 transition-all duration-150 shadow-sm border-0"
            >
              +{examples.length - visibleCount} more
            </Button>
          )}
        </div>

        <div className="flex items-center justify-between mt-auto pt-1" onClick={(e) => e.stopPropagation()}>
          {visibleCount > 5 && examples.length > 5 ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onVisibleCountChange(5);
              }}
              className={`inline-flex items-center gap-1 text-[10px] font-bold ${t.statLabel} hover:underline p-0 h-auto border-0`}
            >
              Show less
            </Button>
          ) : (
            <span />
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onSelectCategory}
            className={`inline-flex items-center gap-1 text-[10px] font-bold ${t.statLabel} hover:underline ml-auto p-0 h-auto border-0`}
          >
            View all assets <ArrowRight className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
