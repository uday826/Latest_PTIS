'use client';

import type { MasterDataCommonProps } from '@/types/asset-type/master-data.types';
import { MasterDataLayout } from '../common/MasterDataLayout';
import { MasterTypes } from '../common/MasterTypes';
import { OwningDepartmentMasterTable } from './OwningDepartmentMasterTable';
import type { Option } from '@/components/common';

interface OwningDepartmentMasterViewProps extends MasterDataCommonProps {
  departmentOptions?: Option[];
}

export function OwningDepartmentMasterView(props: OwningDepartmentMasterViewProps) {
  const { master, selectedMaster, selectedGroup, isPending, onSelectMaster, masterTypes, onDelete, onSave, pagination } = props;

  return (
    <MasterDataLayout
      hideGroupFilter
      masterTypesList={<MasterTypes selected={selectedMaster} onSelect={onSelectMaster} masterTypes={masterTypes} />}
      recordsTable={
        <OwningDepartmentMasterTable
          master={master}
          selectedGroup={selectedGroup}
          onDelete={onDelete}
          onSave={onSave}
          isPending={isPending}
          pagination={pagination}
          departmentOptions={props.departmentOptions ?? []}
        />
      }
    />
  );
}

