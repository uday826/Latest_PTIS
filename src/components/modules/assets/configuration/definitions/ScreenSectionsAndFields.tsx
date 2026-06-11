'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Monitor, Layers, Plus, Folder, ChevronDown, ChevronRight } from 'lucide-react';
import { AddButton, EditButton, DeleteButton } from '@/components/common/ActionButtons';
import { SearchInput } from '@/components/common/SearchInput';
import { MasterCard } from '../masterData/common/MasterCard';
import type { AssetFieldDefinition, AssetCategory, AssetType } from '@/types/asset-type/definitions.types';

interface ScreenSectionsAndFieldsProps {
  selectedCategoryName: string | null;
  selectedTypeName: string | null;
  fields: AssetFieldDefinition[];
  isLoading: boolean;
  viewAll?: boolean;
  categories?: AssetCategory[];
  types?: AssetType[];
  onAddField: () => void;
  onEditField: (field: AssetFieldDefinition) => void;
  onDeleteField: (id: number) => void;
  tabsComponent?: React.ReactNode;
}

export function ScreenSectionsAndFields({
  selectedCategoryName,
  selectedTypeName,
  fields,
  isLoading,
  viewAll = false,
  categories = [],
  types = [],
  onAddField,
  onEditField,
  onDeleteField,
  tabsComponent,
}: ScreenSectionsAndFieldsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroupFilter, setSelectedGroupFilter] = useState('all');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  // 1. Group fields dynamically
  const groupedFields = useMemo(() => {
    const map: Record<string, AssetFieldDefinition[]> = {};
    
    // Filter first
    const filtered = fields.filter(field => {
      const matchesSearch = 
        field.fieldName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        field.fieldCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (field.fieldLabel || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesGroup = 
        selectedGroupFilter === 'all' || 
        (field.fieldGroup || 'General Info') === selectedGroupFilter;

      return matchesSearch && matchesGroup;
    });

    for (const field of filtered) {
      const groupName = field.fieldGroup?.trim() || 'General Info';
      if (!map[groupName]) map[groupName] = [];
      map[groupName].push(field);
    }

    // Sort fields in each group by displayOrder
    Object.keys(map).forEach(groupName => {
      map[groupName].sort((a, b) => a.displayOrder - b.displayOrder);
    });

    return map;
  }, [fields, searchTerm, selectedGroupFilter]);

  // Unique groups list for filter dropdown
  const uniqueGroups = useMemo(() => {
    const groupsSet = new Set<string>();
    fields.forEach(f => {
      groupsSet.add(f.fieldGroup?.trim() || 'General Info');
    });
    return Array.from(groupsSet);
  }, [fields]);

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  const hasSelection = !!selectedTypeName || viewAll;
  const subTitle = viewAll ? 'All Categories & Types' : (hasSelection ? `${selectedCategoryName} > ${selectedTypeName}` : '');

  return (
    <MasterCard
      title={tabsComponent}
      headerAction={
        <div className="flex items-center gap-4">
          {hasSelection && !viewAll && (
            <AddButton
              onClick={onAddField}
              label="Add Field"
              className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-md border-0 !h-8 !px-3 py-2 flex items-center gap-2"
            />
          )}
        </div>
      }
    >
      {/* Stats Subheader */}
      {hasSelection && (
        <div className="px-5 py-3 bg-[#faf7ff] border-b border-purple-200 flex items-center justify-between">
          <span className="text-sm text-purple-700 font-medium">
            Active Type: {subTitle}
          </span>
        </div>
      )}

      {/* Filters Bar */}
      {hasSelection && fields.length > 0 && (
        <div className="px-5 py-3 bg-white border-b border-slate-100 flex flex-col sm:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              className="w-full mb-0"
              placeholder="Filter fields by name, label, or code..."
            />
          </div>

          {/* Group Filter Dropdown */}
          <div className="relative w-full sm:w-48 flex items-center">
            <select
              value={selectedGroupFilter}
              onChange={(e) => setSelectedGroupFilter(e.target.value)}
              className="w-full pl-3 pr-3 py-2 text-sm rounded-lg border border-gray-300 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">All Groups</option>
              {uniqueGroups.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50/20">
        {!hasSelection ? (
          /* ── No Selection State ─────────────────────────────────────────── */
          <div className="flex h-full flex-col items-center justify-center gap-3 py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
              <Monitor className="h-8 w-8 text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-700">
                No Asset Type Selected
              </p>
              <p className="mt-1 text-xs text-slate-455 max-w-sm">
                Select an Asset Category and Type from the left structure sidebar to manage its field configurations, or click 'View All Fields' at the top.
              </p>
            </div>
          </div>
        ) : isLoading ? (
          /* ── Loading State ─────────────────────────────────────────────── */
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-455 animate-pulse">
              Loading definitions...
            </span>
          </div>
        ) : fields.length === 0 ? (
          /* ── Empty State ───────────────────────────────────────────────── */
          <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100">
              <Layers className="h-7 w-7 text-slate-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-700">
                No Fields Configured
              </p>
              <p className="mt-0.5 text-xs text-slate-455">
                {viewAll ? 'No fields configured across all categories.' : `Configure custom fields for ${selectedTypeName} to get started.`}
              </p>
            </div>
            {!viewAll && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={onAddField}
                className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-100 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Configure First Field
              </motion.button>
            )}
          </div>
        ) : Object.keys(groupedFields).length === 0 ? (
          <div className="text-center py-12 text-sm text-slate-455">
            No fields match your filters.
          </div>
        ) : (
          /* ── Grouped Fields Grid ────────────────────────────────────────── */
          <div className="space-y-4">
            {Object.entries(groupedFields).map(([groupName, groupFields]) => {
              const isCollapsed = expandedGroups[groupName] ?? false;

              return (
                <div key={groupName} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
                  {/* Group Title Header */}
                  <div
                    onClick={() => toggleGroup(groupName)}
                    className="flex items-center justify-between px-4 py-3 bg-[#f8fafc] border-b border-[#d9dee5] cursor-pointer hover:bg-[#f1f5f9] select-none transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Folder className="w-4 h-4 text-[#0b89a3]" />
                      <span className="text-sm font-semibold text-slate-800">{groupName}</span>
                      <span className="text-xs bg-[#0b89a3]/10 text-[#0b89a3] px-2 py-0.5 rounded-full font-semibold">
                        {groupFields.length} {groupFields.length === 1 ? 'field' : 'fields'}
                      </span>
                    </div>
                    {isCollapsed ? (
                      <ChevronRight size={16} className="text-slate-400" />
                    ) : (
                      <ChevronDown size={16} className="text-slate-400" />
                    )}
                  </div>

                  {/* Fields List */}
                  {!isCollapsed && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                          <tr className="bg-slate-800 text-[11px] uppercase font-bold text-white border-b border-gray-200">
                            <th className="px-4 py-3 w-16">Order</th>
                            {viewAll && <th className="px-4 py-3">Category</th>}
                            {viewAll && <th className="px-4 py-3">Type</th>}
                            <th className="px-4 py-3">Code</th>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Label</th>
                            <th className="px-4 py-3">Type</th>
                            <th className="px-4 py-3">Required</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-150 text-xs">
                          {groupFields.map((field) => (
                            <tr key={field.id} className="hover:bg-gray-50/50 text-slate-700 transition-colors">
                              <td className="px-4 py-3 font-medium text-slate-500">{field.displayOrder}</td>
                              {viewAll && (
                                <td className="px-4 py-3 font-semibold text-[#0b89a3]">
                                  {categories.find(c => c.id === field.assetCategoryId)?.categoryName || `ID: ${field.assetCategoryId}`}
                                </td>
                              )}
                              {viewAll && (
                                <td className="px-4 py-3 font-semibold text-purple-755">
                                  {types.find(t => t.id === field.assetTypeId)?.typeName || `ID: ${field.assetTypeId}`}
                                </td>
                              )}
                              <td className="px-4 py-3 font-mono font-bold text-slate-800">{field.fieldCode}</td>
                              <td className="px-4 py-3 font-semibold text-slate-800">{field.fieldName}</td>
                              <td className="px-4 py-3 text-slate-500">{field.fieldLabel}</td>
                              <td className="px-4 py-3">
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600 capitalize">
                                  {field.fieldType}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                {field.isRequired ? (
                                  <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md">Yes</span>
                                ) : (
                                  <span className="text-[10px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md">No</span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <EditButton
                                    onClick={() => onEditField(field)}
                                    className="!p-1.5 !w-8 !h-8 !rounded-md"
                                    title="Edit Field"
                                  />
                                  <DeleteButton
                                    onClick={() => onDeleteField(field.id)}
                                    className="!p-1.5 !w-8 !h-8 !rounded-md"
                                    title="Delete Field"
                                  />
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </MasterCard>
  );
}
