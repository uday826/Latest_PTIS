'use client';
import { useState, useMemo, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useConfirm } from '@/components/common/ConfirmProvider';
import { EditButton, DeleteButton } from '@/components/common/ActionButtons';
import { MasterTable, type Column } from '@/components/common/MasterTable';
import { Badge } from '@/components/common/Badge';
import { StatusBadge } from '@/components/common/StatusBadge';
import { MasterDataRecord, MasterTableRecordProps, MASTER_IDS } from '@/types/asset-type/master-data.types';
import { AssetTypeMasterForm } from './AssetTypeMasterForm';
import { AssetCategoryMasterForm } from '../asset-category-master/AssetCategoryMasterForm';
import { MasterRecordLayout } from '../common/MasterRecordLayout';
import { cn } from '@/lib/utils/cn';

interface PaginationConfig {
  page: number; pageSize: number; search: string; sortBy: string; sortOrder: 'asc' | 'desc';
  totalCount: number; totalPages: number; onPageChange: (p: number) => void;
  onPageSizeChange: (s: number) => void; onSearch: (t: string) => void; onSort: (f: string, o: 'asc' | 'desc') => void;
}

export function AssetTypeMasterTable({ master, selectedGroup, onDelete, onSave, isPending = false, pagination }: MasterTableRecordProps & { pagination: PaginationConfig }) {
  const t = useTranslations('asset.configuration.masterData.form.labels');
  const { confirm } = useConfirm();
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState<MasterDataRecord | null>(null);

  const columns = useMemo((): Column<MasterDataRecord>[] => [
    { key: 'id', width: '18%', label: t('code'), render: (_, r) => <Badge variant="secondary" size="sm">{String(r.id ?? '')}</Badge> },
    { key: 'name', width: '48%', label: t('name'), render: (_, r) => (<div><div className="font-semibold text-sm text-slate-800">{r.name}</div><div className="text-xs text-slate-500 line-clamp-1">{r.description}</div></div>) },
    { key: 'status', width: '18%', label: t('status'), render: (_, r) => <StatusBadge value={r.status} /> },
  ], [t]);

  const renderActions = useCallback((row: MasterDataRecord) => (
    <div className="flex items-center gap-2">
      <EditButton onClick={() => { setEditData(row); setFormOpen(true); }} className="!p-1.5 !w-8 !h-8 !rounded-md" disabled={isPending} />
      <DeleteButton onClick={() => confirm({ 
        variant: 'delete', 
        title: t('confirmDeactivateTitle'),
        description: t('confirmDeactivateDesc'),
        confirmText: t('deactivate'),
        onConfirm: () => onDelete(row, master.id) 
      })} className="!p-1.5 !w-8 !h-8 !rounded-md" disabled={isPending} />
    </div>
  ), [confirm, master.id, onDelete, isPending, t]);

  const selectedGroupName = useMemo(() => master?.groups?.find(g => g.id === selectedGroup)?.name, [master, selectedGroup]);
  const existingCodes = useMemo(() => master?.records?.map(r => String(r.id)) || [], [master]);
  const existingNames = useMemo(() => master?.records?.map(r => String(r.name)) || [], [master]);

  if (!master) return null;

  return (
    <MasterRecordLayout masterName={master.id} selectedGroupId={selectedGroup} selectedGroupName={selectedGroupName} onAdd={() => { setEditData(null); setFormOpen(true); }} search={pagination.search} onSearchChange={pagination.onSearch}>
      <div className="flex-1 min-h-0 relative group">
        {isPending && <div className="absolute top-0 left-0 right-0 z-30 h-[2px] overflow-hidden bg-blue-100/50"><div className="h-full bg-blue-600 animate-pulse w-full" /></div>}
        <div className={cn("h-full transition-all duration-300", isPending && "opacity-60 pointer-events-none filter grayscale-[20%]")}>
          <MasterTable columns={columns} data={master.records || []} loading={false} paginationConfig={{ enabled: true, showPageSizeSelector: true }} pageNumber={pagination.page} pageSize={pagination.pageSize} totalCount={pagination.totalCount} totalPages={pagination.totalPages} onPageChange={pagination.onPageChange} onPageSizeChange={pagination.onPageSizeChange} containerClassName="h-full flex flex-col" maxBodyHeightClassName="max-h-[400px] overflow-y-auto" tableClassName="overflow-y-auto" theadClassName="bg-slate-800 [&_th]:!text-white [&_th]:!font-bold [&_th]:!text-[13px] [&_th]:!uppercase" rowClassName={() => 'border-b border-gray-100 hover:bg-gray-50/50 transition-colors'} renderActions={renderActions} />
        </div>
      </div>
      {master.id === MASTER_IDS.CATEGORY ? (
        <AssetCategoryMasterForm key={formOpen ? `edit-${editData?.id || 'new'}` : 'closed'} open={formOpen} onClose={() => { setFormOpen(false); setEditData(null); }} onSave={(p, s) => onSave(p, master.id, editData, s)} editData={editData} masterId={master.id} selectedGroup="all" isPending={isPending} existingCodes={existingCodes} existingNames={existingNames} />
      ) : (
        <AssetTypeMasterForm key={formOpen ? `edit-${editData?.id || 'new'}-${selectedGroup}` : 'closed'} open={formOpen} onClose={() => { setFormOpen(false); setEditData(null); }} onSave={(p, s) => onSave(p, master.id, editData, s)} editData={editData} masterId={master.id} selectedGroup={selectedGroup} groups={master.groups} isPending={isPending} existingCodes={existingCodes} existingNames={existingNames} />
      )}
    </MasterRecordLayout>
  );
}

