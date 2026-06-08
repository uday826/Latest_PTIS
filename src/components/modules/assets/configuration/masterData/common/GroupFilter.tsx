'use client';

import { Layers, ChevronRight, LayoutGrid } from 'lucide-react';
import { useConfirm } from '@/components/common/ConfirmProvider';
import { AddButton, EditButton, DeleteButton } from '@/components/common/ActionButtons';
import { Badge } from '@/components/common/Badge';
import { Card } from '@/components/common/Card';
import type { GroupFilterProps, MasterId } from '@/types/asset-type/master-data.types';
import { useTranslations } from 'next-intl';

export function GroupFilter({ groups, selected, onSelect, title, buttonLabel, onAdd, onEdit, onDelete, pagination, masterId }: GroupFilterProps) {
  const t = useTranslations('asset.configuration.masterData');
  const mt = useTranslations('asset.masterNames');
  const { confirm } = useConfirm();

  // Dynamically resolve master name based on masterId
  const masterName = mt(masterId as MasterId) || masterId;
  const displayTitle = title || masterName;
  const displayButtonLabel = buttonLabel || t('addNew', { name: masterName });

  const showAddButton = !!onAdd;

  return (
    <Card
      variant="bordered"
      padding="none"
      className="w-full h-full rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-md flex flex-col"
    >
      {/* Header */}
      <div className="h-[54px] shrink-0 bg-[#33445c] text-white px-5 flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold text-[15px]">
          <Layers size={16} className="stroke-[2.2]" />
          <span>{displayTitle}</span>
        </div>
        {showAddButton && (
          <AddButton
            label={displayButtonLabel}
            onClick={(e) => { e.stopPropagation(); onAdd?.(); }}
            className="bg-cyan-600 hover:bg-cyan-700 text-white !h-8 !px-3 py-2 rounded-md text-xs font-medium flex items-center gap-2"
          />
        )}
      </div>

      <div className="p-3 space-y-2.5 flex-1 overflow-y-auto">
        {groups.map((group, index) => {
          const isActive = selected === group.id;
          const isAll = group.id === 'all';
          return (
            <div key={group.id} onClick={() => onSelect(group.id)} className={`h-[52px] rounded-[10px] border px-3 flex items-center justify-between cursor-pointer transition-all ${isActive ? 'bg-gradient-to-r from-[#8b1cf6] to-[#b000ff] border-[#8b1cf6] text-white' : 'bg-[#f8fafc] border-[#d9dee5] hover:bg-[#f1f5f9] text-[#0f172a]'}`}>
              <div className="flex items-center gap-3 min-w-0">
                <Badge className={`w-8 h-8 rounded-lg p-0 flex items-center justify-center shrink-0 border-0 ${isActive ? 'bg-white/15 text-white' : 'bg-[#8b1cf6] text-white'}`}>{isAll ? <LayoutGrid size={14} /> : <span className="text-[13px] font-semibold">{index}</span>}</Badge>
                <div className="leading-tight min-w-0">
                  <div className="flex items-center gap-2">
                    <div className={`text-[14px] font-semibold truncate ${isActive ? 'text-white' : 'text-[#111827]'}`}>
                      {group.name} {group.count > 0 && <span className="text-[12px] opacity-80 ml-1">({group.count})</span>}
                    </div>
                    {group.status && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${group.status === 'Active'
                          ? (isActive ? 'bg-white/20 text-white' : 'bg-green-100 text-green-700')
                          : (isActive ? 'bg-red-400/30 text-white' : 'bg-red-100 text-red-700')
                        }`}>
                        {group.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!isAll && onEdit && (
                  <EditButton
                    onClick={(e) => { e.stopPropagation(); onEdit(group); }}
                    className={`!p-1.5 !rounded-md ${isActive ? '!border-white/40 !bg-transparent hover:!bg-white/20 !text-white' : ''}`}
                  />
                )}
                {!isAll && onDelete && (
                  <DeleteButton
                    onClick={(e) => {
                      e.stopPropagation(); confirm({
                        variant: 'delete',
                        title: t('form.labels.confirmDeactivateTitle'),
                        description: t('form.labels.confirmDeactivateDesc'),
                        confirmText: t('form.labels.deactivate'),
                        onConfirm: () => onDelete(group)
                      });
                    }}
                    className={`!p-1.5 !rounded-md ${isActive ? '!border-white/40 !bg-transparent hover:!bg-white/20 !text-white' : ''}`}
                  />
                )}
                {!isAll && <ChevronRight size={16} strokeWidth={2.2} className={isActive ? 'text-white' : 'text-[#94a3b8]'} />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Optional Footer */}
      {pagination && pagination.totalPages > 1 && (
        <div className="shrink-0 border-t border-gray-100 bg-gray-50/50 p-3">
          <div className="flex items-center justify-between">
            <button
              onClick={(e) => { e.stopPropagation(); pagination.onPageChange(pagination.page - 1); }}
              disabled={pagination.page <= 1}
              className="text-xs font-medium text-slate-600 disabled:opacity-40 hover:text-blue-600 transition-colors"
            >
              {t('pagination.previous')}
            </button>
            <span className="text-xs text-slate-500 font-medium">
              {t('pagination.pageInfo', { current: pagination.page, total: pagination.totalPages })}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); pagination.onPageChange(pagination.page + 1); }}
              disabled={pagination.page >= pagination.totalPages}
              className="text-xs font-medium text-slate-600 disabled:opacity-40 hover:text-blue-600 transition-colors"
            >
              {t('pagination.next')}
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}
