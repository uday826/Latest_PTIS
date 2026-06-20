'use client';

import type { MasterDataCommonProps } from '@/types/asset-type/master-data.types';
import { MasterDataLayout } from '../common/MasterDataLayout';
import { MasterTypes } from '../common/MasterTypes';
import { GroupFilter } from '../common/GroupFilter';
import { SubTypeOfUseTable } from './SubTypeOfUseTable';

export function SubTypeOfUseView(props: MasterDataCommonProps) {
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
          title="Type of Use"
        />
      }
      recordsTable={
        <SubTypeOfUseTable
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
