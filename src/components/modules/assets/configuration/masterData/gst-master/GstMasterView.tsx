'use client';

import type { MasterDataCommonProps } from '@/types/asset-type/master-data.types';
import { MasterDataLayout } from '../common/MasterDataLayout';
import { MasterTypes } from '../common/MasterTypes';
import { GstMasterTable } from './GstMasterTable';

export function GstMasterView(props: MasterDataCommonProps) {
  const {
    master,
    selectedMaster,
    selectedGroup,
    isPending,
    onSelectMaster,
    masterTypes,
    onDelete,
    onSave,
    pagination,
  } = props;

  return (
    <MasterDataLayout
      hideGroupFilter
      masterTypesList={
        <MasterTypes
          selected={selectedMaster}
          onSelect={onSelectMaster}
          masterTypes={masterTypes}
        />
      }
      recordsTable={
        <GstMasterTable
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
