'use client';

import { motion } from 'framer-motion';
import {
  FileText, Plus, FileCheck, HardDrive,
  ArrowUpDown,
  Monitor, RefreshCw, Layers,
} from 'lucide-react';
import { MasterCard } from '../masterData/common/MasterCard';
import { AddButton, EditButton, DeleteButton } from '@/components/common/ActionButtons';
import type { AssetDocumentDefinitionDto } from '@/lib/api/asset/asset-document.service';
import { useConfirm } from '@/components/common';

interface DocDefListProps {
  definitions: AssetDocumentDefinitionDto[];
  isLoading: boolean;
  hasSelection: boolean;
  selectedCategoryName: string | null;
  selectedTypeName: string | null;
  onAdd: () => void;
  onEdit: (def: AssetDocumentDefinitionDto) => void;
  onDelete: (id: number) => void;
  onRefresh: () => void;
  tabsComponent?: React.ReactNode;
}

function ExtensionBadge({ ext }: { ext: string }) {
  const colorMap: Record<string, string> = {
    '.pdf':  'bg-red-50 text-red-600 border-red-200',
    '.doc':  'bg-blue-50 text-blue-600 border-blue-200',
    '.docx': 'bg-blue-50 text-blue-600 border-blue-200',
    '.jpg':  'bg-amber-50 text-amber-600 border-amber-200',
    '.jpeg': 'bg-amber-50 text-amber-600 border-amber-200',
    '.png':  'bg-green-50 text-green-600 border-green-200',
    '.xls':  'bg-emerald-50 text-emerald-600 border-emerald-200',
    '.xlsx': 'bg-emerald-50 text-emerald-600 border-emerald-200',
    '.zip':  'bg-purple-50 text-purple-600 border-purple-200',
  };
  const cls = colorMap[ext.toLowerCase()] ?? 'bg-slate-50 text-slate-600 border-slate-200';
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border ${cls}`}>
      {ext}
    </span>
  );
}

export function DocDefList({
  definitions,
  isLoading,
  hasSelection,
  selectedCategoryName,
  selectedTypeName,
  onAdd,
  onEdit,
  onDelete,
  onRefresh,
  tabsComponent,
}: DocDefListProps) {
  const { confirm } = useConfirm();

  const handleDeleteClick = (def: AssetDocumentDefinitionDto) => {
    confirm({
      variant: 'delete',
      title: 'Delete Document Definition',
      description: `Are you sure you want to delete the document definition "${def.documentName}"?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      onConfirm: async () => {
        await onDelete(def.id);
      },
    });
  };

  const subTitle = hasSelection ? `${selectedCategoryName} > ${selectedTypeName}` : '';

  return (
    <MasterCard
      title={tabsComponent}
      headerAction={
        <div className="flex items-center gap-4">
          {hasSelection && (
            <div className="flex items-center gap-2">
              <button
                onClick={onRefresh}
                title="Refresh"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <AddButton
                onClick={onAdd}
                label="Add Document"
                className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-md border-0 !h-8 !px-3 py-2 flex items-center gap-2"
              />
            </div>
          )}
        </div>
      }
    >
      {/* Stats Subheader — matches ScreenSectionsAndFields style */}
      {hasSelection && (
        <div className="px-5 py-3 bg-[#faf7ff] border-b border-purple-200 flex items-center justify-between">
          <span className="text-sm text-purple-700 font-medium">
            Active Type: {subTitle}
          </span>
          <span className="text-xs text-slate-400 font-semibold">
            {definitions.length} definition{definitions.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50/20">

        {/* ── No Selection ─────────────────────────────────────────────────── */}
        {!hasSelection ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
              <Monitor className="h-8 w-8 text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-700">No Asset Type Selected</p>
              <p className="mt-1 text-xs text-slate-400 max-w-sm">
                Select an Asset Category and Type from the left sidebar to manage its document definitions.
              </p>
            </div>
          </div>

        /* ── Loading ──────────────────────────────────────────────────────── */
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 animate-pulse">
              Loading definitions...
            </span>
          </div>

        /* ── Empty ────────────────────────────────────────────────────────── */
        ) : definitions.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100">
              <Layers className="h-7 w-7 text-slate-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-700">No Document Definitions</p>
              <p className="mt-0.5 text-xs text-slate-400">
                Define which documents are required for {selectedTypeName} assets.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onAdd}
              className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-100 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add First Document Definition
            </motion.button>
          </div>

        /* ── Table ───────────────────────────────────────────────────────── */
        ) : (
          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
            {/* Table Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#f8fafc] border-b border-[#d9dee5]">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#0b89a3]" />
                <span className="text-sm font-semibold text-slate-800">Required Documents</span>
                <span className="text-xs bg-[#0b89a3]/10 text-[#0b89a3] px-2 py-0.5 rounded-full font-semibold">
                  {definitions.length} {definitions.length === 1 ? 'document' : 'documents'}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-slate-800 text-[11px] uppercase font-bold text-white border-b border-gray-200">
                    <th className="px-4 py-3 w-14">
                      <div className="flex items-center gap-1"><ArrowUpDown className="w-3 h-3" /> Order</div>
                    </th>
                    <th className="px-4 py-3">Code</th>
                    <th className="px-4 py-3">Document Name</th>
                    <th className="px-4 py-3">Allowed Types</th>
                    <th className="px-4 py-3">
                      <div className="flex items-center gap-1"><HardDrive className="w-3 h-3" /> Max Size</div>
                    </th>
                    <th className="px-4 py-3">Required</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {[...definitions]
                    .sort((a, b) => a.displayOrder - b.displayOrder)
                    .map(def => (
                      <tr key={def.id} className="hover:bg-gray-50/50 text-slate-700 transition-colors">
                        {/* Display Order */}
                        <td className="px-4 py-3 font-medium text-slate-500">{def.displayOrder}</td>

                        {/* Code */}
                        <td className="px-4 py-3 font-mono font-bold text-slate-800">{def.documentCode}</td>

                        {/* Name + description */}
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-800">{def.documentName}</div>
                          {def.description && (
                            <div className="text-[10px] text-slate-400 mt-0.5 italic truncate max-w-[180px]">
                              {def.description}
                            </div>
                          )}
                        </td>

                        {/* Extensions */}
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {(def.allowedExtensions || '').split(',').map(e => e.trim()).filter(Boolean).map(ext => (
                              <ExtensionBadge key={ext} ext={ext} />
                            ))}
                          </div>
                        </td>

                        {/* Max size */}
                        <td className="px-4 py-3 text-slate-600 font-semibold">{def.maxFileSizeMB} MB</td>

                        {/* Required badge */}
                        <td className="px-4 py-3">
                          {def.isRequired ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
                              <FileCheck className="w-3 h-3" /> Yes
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md">No</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <EditButton
                              onClick={() => onEdit(def)}
                              className="!p-1.5 !w-8 !h-8 !rounded-md"
                              title="Edit Document Definition"
                            />
                            <DeleteButton
                              onClick={() => handleDeleteClick(def)}
                              className="!p-1.5 !w-8 !h-8 !rounded-md"
                              title="Delete Document Definition"
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </MasterCard>
  );
}
