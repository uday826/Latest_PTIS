'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useConfirm } from '@/components/common/ConfirmProvider';
import { EditButton, DeleteButton } from '@/components/common/ActionButtons';
import { MasterTable, type Column } from '@/components/common/MasterTable';
import { Badge } from '@/components/common/Badge';
import { StatusBadge } from '@/components/common/StatusBadge';
import type {
  MasterDataRecord,
  MasterTableRecordProps,
  PaginationConfig,
} from '@/types/asset-type/asset.types';
import { useMasterTableRecordLogic } from '@/hooks/asset-hooks/useMasterTableRecordLogic';
import { MasterRecordLayout } from '../common/MasterRecordLayout';
import { PenaltyRuleMasterForm } from './PenaltyRuleMasterForm';

export function PenaltyRuleMasterTable({
  master,
  selectedGroup,
  onDelete,
  onSave,
  isPending = false,
  pagination,
}: MasterTableRecordProps & { pagination: PaginationConfig }) {
  const t = useTranslations('penaltyRuleMaster');
  const { confirm } = useConfirm();
  
  const { filteredRecords } = useMasterTableRecordLogic(
    master?.records || [],
    selectedGroup
  );
  
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState<MasterDataRecord | null>(null);
  
  const formSessionKey = `${editData?.backendId ?? editData?.id ?? 'new'}-${formOpen}-${selectedGroup}-${master.id}`;

  const columns = useMemo(
    (): Column<MasterDataRecord>[] => [
      {
        key: 'id',
        label: t('table.columns.penaltyCode').toUpperCase(),
        width: '15%',
        render: (v) => (
          <Badge variant="secondary" size="sm">
            {String(v ?? '')}
          </Badge>
        ),
      },
      {
        key: 'name',
        label: t('table.columns.penaltyName').toUpperCase(),
        width: '25%',
        render: (_, row) => <div className="font-semibold text-sm text-slate-800 break-all whitespace-normal">{row.name}</div>,
      },
      {
        key: 'calculationType',
        label: t('table.columns.calculationType').toUpperCase(),
        width: '15%',
        render: (v) => (
          <div className="text-sm font-semibold text-slate-700">
            {v ? t(`form.calculationTypeOptions.${String(v)}`) : '—'}
          </div>
        ),
      },
      {
        key: 'penaltyValue',
        label: t('table.columns.penaltyValue').toUpperCase(),
        width: '15%',
        render: (v, row) => {
          if (v == null) return '—';
          const isPercentage = row.calculationType === 'Percentage';
          return (
            <div className="text-sm font-semibold text-slate-700">
              {isPercentage ? `${Number(v)}%` : `₹${Number(v)}`}
            </div>
          );
        },
      },
      {
        key: 'gracePeriodDays',
        label: t('table.columns.gracePeriodDays').toUpperCase(),
        width: '15%',
        render: (v) => (
          <div className="text-sm text-slate-600">
            {v != null ? `${Number(v)} ${t('form.labels.days')}` : '—'}
          </div>
        ),
      },
      {
        key: 'status',
        label: t('table.columns.status').toUpperCase(),
        width: '15%',
        render: (v) => <StatusBadge value={v ? String(v) : null} />,
      },
    ],
    [t]
  );

  if (!master) return null;

  const handleEdit = (row: MasterDataRecord) => {
    setEditData(row);
    setFormOpen(true);
  };

  const rowClassName = () => 'border-b border-gray-100 hover:bg-gray-50/50 transition-colors';

  const renderActions = (row: MasterDataRecord) => (
    <>
      <EditButton
        onClick={() => handleEdit(row)}
        className="!p-1.5 !w-8 !h-8 !rounded-md"
        disabled={isPending || row.backendId == null}
      />
      <DeleteButton
        onClick={() =>
          confirm({
            variant: 'delete',
            meta: { name: row.name },
            onConfirm: () => onDelete(row, master.id),
          })
        }
        className="!p-1.5 !w-8 !h-8 !rounded-md"
        disabled={isPending || row.backendId == null}
      />
    </>
  );

  return (
    <MasterRecordLayout
      key={pagination.search}
      masterName={master.id}
      onAdd={() => {
        setEditData(null);
        setFormOpen(true);
      }}
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
            tableClassName="min-w-[860px] md:min-w-0"
            maxBodyHeightClassName="flex-1 overflow-auto"
            theadClassName="bg-[#33445c] [&_th]:!text-white [&_th]:!font-bold [&_th]:!text-[12px] sm:[&_th]:!text-[13px]"
            rowClassName={rowClassName}
            renderActions={renderActions}
          />
        </div>
      </div>

      <PenaltyRuleMasterForm
        key={formSessionKey}
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditData(null);
        }}
        onSave={(payload: MasterDataRecord, onSuccess?: () => void) => onSave(payload, master.id, editData, onSuccess)}
        editData={editData}
        masterId={master.id}
        selectedGroup={selectedGroup}
        groups={master.groups}
        existingCodes={master.records.map((r: MasterDataRecord) => r.id)}
        existingNames={master.records.map((r: MasterDataRecord) => r.name)}
        isPending={isPending}
      />
    </MasterRecordLayout>
  );
}
