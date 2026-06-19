'use client';

import type { MasterDataCommonProps } from '@/types/asset-type/master-data.types';
import { MasterDataLayout } from '../common/MasterDataLayout';
import { MasterTypes } from '../common/MasterTypes';
import { RoomTypeMasterTable } from './RoomTypeMasterTable';

export function RoomTypeMasterView(props: MasterDataCommonProps) {
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
        <RoomTypeMasterTable
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
