'use client';

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Layers, Folder } from 'lucide-react';
import { Card, CardContent } from '@/components/common';

interface ScreenListProps {
  categories: Array<{ id: number; categoryName: string; categoryCode: string; isActive: boolean }>;
  types: Array<{ id: number; typeName: string; typeCode: string; categoryId: number; isActive: boolean }>;
  selectedCategoryId: number | null;
  selectedTypeId: number | null;
  viewAll?: boolean;
  onCategorySelect: (id: number | null) => void;
  onTypeSelect: (id: number | null) => void;
  onViewAllSelect?: () => void;
  isLoading?: boolean;
}

export function ScreenList({
  categories,
  types,
  selectedCategoryId,
  selectedTypeId,
  viewAll,
  onCategorySelect,
  onTypeSelect,
  onViewAllSelect,
  isLoading
}: ScreenListProps): React.ReactElement {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>({});

  // Toggle category expansion
  const toggleCategory = (catId: number) => {
    setExpandedCategories(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
    onCategorySelect(catId);
  };

  // Auto-expand selected category
  React.useEffect(() => {
    if (selectedCategoryId) {
      setExpandedCategories(prev => ({
        ...prev,
        [selectedCategoryId]: true
      }));
    }
  }, [selectedCategoryId]);

  // Filter Categories and Types based on search term
  const filteredCategories = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return categories;

    return categories.filter(cat => {
      const catMatches = cat.categoryName.toLowerCase().includes(term) || cat.categoryCode.toLowerCase().includes(term);
      const hasMatchingTypes = types.some(t => 
        t.categoryId === cat.id && 
        (t.typeName.toLowerCase().includes(term) || t.typeCode.toLowerCase().includes(term))
      );
      return catMatches || hasMatchingTypes;
    });
  }, [categories, types, searchTerm]);

  return (
    <Card className="p-0 flex flex-col h-full border border-gray-200 bg-white rounded-2xl overflow-hidden shadow-md">
      {/* Header */}
      <div className="h-[54px] shrink-0 bg-[#33445c] text-white px-5 flex items-center gap-2">
        <Layers size={16} className="stroke-[2.2]" />
        <span className="font-semibold text-[15px]">Asset Structure</span>
      </div>

      {/* Search Bar */}
      <div className="p-3 border-b border-gray-150 bg-gray-50/50">
        <input
          type="text"
          placeholder="Search categories & types..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-300 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <CardContent className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {/* View All Fields Toggle */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={onViewAllSelect}
          className={`flex items-center justify-between p-3 rounded-xl cursor-pointer border select-none transition-all ${
            viewAll
              ? 'bg-[#0b89a3] text-white border-[#0b89a3] shadow-md font-semibold'
              : 'bg-white hover:bg-slate-50 border-gray-200 text-slate-755 hover:text-slate-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <div className={`p-1 rounded-lg ${viewAll ? 'bg-white/20' : 'bg-slate-100'}`}>
              <Layers size={14} className={viewAll ? 'text-white' : 'text-slate-500'} />
            </div>
            <span className="text-sm">View All Fields</span>
          </div>
          <ChevronRight size={14} className={viewAll ? 'text-white' : 'text-slate-400'} />
        </motion.div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8 text-slate-400 gap-2">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs">Loading structure...</span>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-8 text-sm text-slate-400">
            No categories found
          </div>
        ) : (
          filteredCategories.map((cat) => {
            const catTypes = types.filter(t => t.categoryId === cat.id);
            const isExpanded = !!expandedCategories[cat.id];
            const isSelectedCat = selectedCategoryId === cat.id;

            return (
              <div key={cat.id} className="space-y-2">
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(cat.id)}
                  className={`w-full flex items-center justify-between h-[52px] rounded-[10px] border px-3 text-left transition-all ${
                    isSelectedCat 
                      ? 'bg-[#0b89a3] border-[#0b89a3] text-white shadow-sm font-semibold' 
                      : 'bg-[#f8fafc] border-[#d9dee5] hover:bg-[#f1f5f9] text-[#0f172a]'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isSelectedCat ? 'bg-white/10' : 'bg-[#0b89a3]'}`}>
                      <Folder className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-[14px] truncate">{cat.categoryName}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className={`w-4 h-4 shrink-0 ${isSelectedCat ? 'text-white' : 'text-[#94a3b8]'}`} />
                  ) : (
                    <ChevronRight className={`w-4 h-4 shrink-0 ${isSelectedCat ? 'text-white' : 'text-[#94a3b8]'}`} />
                  )}
                </button>

                {/* Sub Types */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="overflow-hidden pl-4 space-y-2 border-l border-slate-100 ml-4"
                    >
                      {catTypes.length === 0 ? (
                        <div className="text-xs text-slate-400 py-1.5 pl-3">
                          No types configured
                        </div>
                      ) : (
                        catTypes
                          .filter(t => {
                            const term = searchTerm.toLowerCase().trim();
                            if (!term) return true;
                            return t.typeName.toLowerCase().includes(term) || t.typeCode.toLowerCase().includes(term);
                          })
                          .map((type) => {
                            const isSelectedType = selectedTypeId === type.id;

                            return (
                              <button
                                key={type.id}
                                onClick={() => onTypeSelect(type.id)}
                                className={`w-full flex items-center justify-between h-[42px] rounded-[8px] border px-3 text-left transition-all truncate ${
                                  isSelectedType
                                    ? 'bg-gradient-to-r from-[#8b1cf6] to-[#b000ff] border-[#8b1cf6] text-white font-semibold shadow-sm'
                                    : 'bg-[#f8fafc] border-[#d9dee5] hover:bg-[#f1f5f9] text-[#0f172a]'
                                }`}
                              >
                                <div className="flex items-center gap-2.5 truncate">
                                  <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${isSelectedType ? 'bg-white/15 text-white' : 'bg-[#8b1cf6] text-white'}`}>
                                    <Layers size={12} />
                                  </div>
                                  <span className="text-[13px] truncate">{type.typeName}</span>
                                </div>
                                <ChevronRight size={14} strokeWidth={2.2} className={isSelectedType ? 'text-white' : 'text-[#94a3b8]'} />
                              </button>
                            );
                          })
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
