'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useConfirm } from '@/components/common/ConfirmProvider';
import { EditButton, DeleteButton } from '@/components/common/ActionButtons';
import { MasterTable, type Column } from '@/components/common/MasterTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import type { MasterDataRecord, MasterTableRecordProps } from '@/types/asset-type/asset.types';
import { useMasterTableRecordLogic } from '@/hooks/asset-hooks/useMasterTableRecordLogic';
import { MasterRecordLayout } from '../common/MasterRecordLayout';
import { OwnershipTypeMasterForm } from './OwnershipTypeMasterForm';

interface PaginationConfig {
  page: number;
  pageSize: number;
  search: string;
  totalCount: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSearch: (term: string) => void;
}

export function OwnershipTypeMasterTable({ master, selectedGroup, onDelete, onSave, isPending = false, pagination }: MasterTableRecordProps & { pagination: PaginationConfig }) {
  const t = useTranslations('ownershipType.configuration.masterData.form.labels');
  const { confirm } = useConfirm();
  const { filteredRecords } = useMasterTableRecordLogic(master?.records || [], selectedGroup);
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState<MasterDataRecord | null>(null);

  const columns = useMemo((): Column<MasterDataRecord>[] => [
    {
      key: 'name',
      label: t('name').toUpperCase(),
      width: '35%',
      render: (_, row) => (
        <div className="font-semibold text-xs sm:text-sm text-slate-800 break-all whitespace-normal line-clamp-2">{row.name}</div>
      )
    },
    {
      key: 'description',
      label: t('description').toUpperCase(),
      width: '40%',
      render: (v) => <div className="text-xs sm:text-sm text-slate-600 line-clamp-1 sm:line-clamp-2 break-all whitespace-normal">{String(v ?? '') || '-'}</div>
    },
    {
      key: 'status',
      label: t('status').toUpperCase(),
      width: '15%',
      render: (v) => <StatusBadge value={v ? String(v) : null} />
    },
  ], [t]);

  if (!master) return null;

  return (
    <MasterRecordLayout
      masterName={master.id}
      onAdd={() => { setEditData(null); setFormOpen(true); }}
      search={pagination.search}
      onSearchChange={pagination.onSearch}
    >
      <div className="h-full flex flex-col">
        <div className="flex-1 min-h-0" style={{ display: 'flex', flexDirection: 'column' }}>
          <MasterTable
            columns={columns}
            data={filteredRecords}
            loading={isPending}
            paginationConfig={{ enabled: true, showPageSizeSelector: true }}
            pageNumber={pagination.page}
            pageSize={pagination.pageSize}
            totalCount={pagination.totalCount}
            totalPages={pagination.totalPages}
            onPageChange={pagination.onPageChange}
            onPageSizeChange={pagination.onPageSizeChange}
            containerClassName="h-full flex flex-col [&>div]:flex [&>div]:flex-col [&>div]:h-full"
            maxBodyHeightClassName="flex-1 overflow-auto"
            tableClassName="min-w-[600px]"

            theadClassName="bg-[#33445c] [&_th]:!text-white [&_th]:!font-bold [&_th]:!text-[11px] sm:[&_th]:!text-[13px]"
            rowClassName={() => 'border-b border-gray-100 hover:bg-gray-50/50 transition-colors'}
            renderActions={(row: MasterDataRecord) => (
              <div className="flex gap-1 sm:gap-2">
                <EditButton
                  onClick={() => { setEditData(row); setFormOpen(true); }}
                  className="!p-1 sm:!p-1.5 !w-7 !h-7 sm:!w-8 sm:!h-8 !rounded-md"
                  disabled={isPending || row.backendId == null}
                />
                <DeleteButton
                  onClick={() => confirm({
                    variant: 'delete',
                    onConfirm: () => onDelete(row, master.id)
                  })}
                  className="!p-1 sm:!p-1.5 !w-7 !h-7 sm:!w-8 sm:!h-8 !rounded-md"
                  disabled={isPending || row.backendId == null}
                />
              </div>
            )}
          />
        </div>
      </div>

      <OwnershipTypeMasterForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditData(null); }}
        onSave={(payload, onSuccess) => onSave(payload, master.id, editData, onSuccess)}
        editData={editData}
        masterId={master.id}
        selectedGroup={selectedGroup}
        groups={master.groups}
        isPending={isPending}
      />
    </MasterRecordLayout>
  );
}
