'use client';

import { useTranslations } from 'next-intl';
import type { MasterDataCommonProps } from '@/types/asset-type/master-data.types';
import { MasterDataLayout } from '../common/MasterDataLayout';
import { MasterTypes } from '../common/MasterTypes';
import { GroupFilter } from '../common/GroupFilter';
import { InventoryNameMasterTable } from './InventoryNameMasterTable';

export function InventoryNameMasterView(props: MasterDataCommonProps) {
  const t = useTranslations('inventoryName');
  const {
    master,
    selectedMaster,
    selectedGroup,
    isPending,
    onSelectMaster,
    onSelectGroup,
    masterTypes,
    onDelete,
    onSave,
    pagination,
  } = props;

  return (
    <MasterDataLayout
      masterTypesList={
        <MasterTypes
          selected={selectedMaster}
          onSelect={onSelectMaster}
          masterTypes={masterTypes}
        />
      }
      groupFilterList={
          <GroupFilter
            groups={master.groups || []}
            selected={selectedGroup}
            onSelect={onSelectGroup}
            masterId="inventory-name-master"
          title={t('configuration.masterData.groupFilter.itemNamesTitle')}
          />
      }
      recordsTable={
        <InventoryNameMasterTable
          master={master}
          selectedGroup={selectedGroup}
          onDelete={onDelete}
          onSave={onSave}
          isPending={isPending}
          pagination={pagination}
        />
      }
    />
  );
}
