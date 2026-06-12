'use client';

import type { MasterDataCommonProps } from '@/types/asset-types/asset.types';
import { MasterDataLayout } from '../common/MasterDataLayout';
import { MasterTypes } from '../common/MasterTypes';
import { OwnershipTypeMasterTable } from './OwnershipTypeMasterTable';

export function OwnershipTypeMasterView(props: MasterDataCommonProps) {
  const { master, selectedMaster, selectedGroup, isPending, onSelectMaster, masterTypes, onDelete, onSave, pagination } = props;

  return (
    <MasterDataLayout
      hideGroupFilter
      masterTypesList={<MasterTypes selected={selectedMaster} onSelect={onSelectMaster} masterTypes={masterTypes} />}
      recordsTable={
        <OwnershipTypeMasterTable
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
