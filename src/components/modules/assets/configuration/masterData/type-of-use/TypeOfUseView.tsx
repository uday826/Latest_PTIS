'use client';

import type { MasterDataCommonProps } from '@/types/asset-type/master-data.types';
import { MasterDataLayout } from '../common/MasterDataLayout';
import { MasterTypes } from '../common/MasterTypes';
import { GroupFilter } from '../common/GroupFilter';
import { TypeOfUseTable } from './TypeOfUseTable';

export function TypeOfUseView(props: MasterDataCommonProps) {
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
      groupFilter={
        <GroupFilter
          groups={master?.groups || []}
          selected={selectedGroup}
          onSelect={onSelectGroup}
          masterId={selectedMaster}
          title="Asset Type"
        />
      }
      recordsTable={
        <TypeOfUseTable
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
