'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import type { MasterDataCommonProps, MasterDataRecord, MasterDataGroup } from '@/types/asset-type/master-data.types';
import { MasterTypes } from '../common/MasterTypes';
import { GroupFilter } from '../common/GroupFilter';
import { AssetTypeMasterTable } from './AssetTypeMasterTable';

import { AssetCategoryMasterForm } from '../asset-category-master/AssetCategoryMasterForm';
import { MASTER_STATUS, MASTER_IDS } from '@/types/asset-type/master-data.types';


export function AssetTypeMasterView(props: MasterDataCommonProps) {
  const t = useTranslations('asset.configuration.masterData');
  const { master, selectedMaster, selectedGroup, isPending, onSelectMaster, onSelectGroup, masterTypes, onDelete, onSave, onSaveGroup, onDeleteGroup, pagination } = props;
  const [groupFormOpen, setGroupFormOpen] = useState(false);
  const [groupEditData, setGroupEditData] = useState<MasterDataRecord | null>(null);

  const isCategory = selectedMaster === MASTER_IDS.CATEGORY;

  /**
   * For the Asset Category master, we display the records directly in the GroupFilter 
   * to fulfill the requirement of no table for categories.
   */
  const displayGroups = useMemo(() => {
    const allGroup = { id: 'all', name: t('allRecords'), count: master.totalCount || master.records?.length || 0 };
    
    if (isCategory) {
      const categoryGroups = (master.records || []).map(r => ({
        id: r.id,
        name: r.name,
        count: 0,
        backendId: r.backendId,
        description: r.description,
        status: r.status
      }));
      return [
        allGroup,
        ...(master.groups || []),
        ...categoryGroups
      ];
    }
    
    // For non-category masters, ensure the 'all' group is always present first
    // and its label is normalized to the localized UI string.
    const groups = master.groups || [];
    if (groups.length > 0 && groups[0].id === 'all') {
      return [{ ...groups[0], name: allGroup.name, count: allGroup.count }, ...groups.slice(1)];
    }
    return [allGroup, ...groups];
  }, [isCategory, master.records, master.groups, master.totalCount, t]);

  const handleAddGroup = () => {
    setGroupEditData(null);
    setGroupFormOpen(true);
  };

  const handleEditGroup = (group: MasterDataGroup) => {
    setGroupEditData({
      id: group.code || group.id,
      backendId: group.backendId,
      name: group.name,
      description: group.description || '',
      status: group.status || MASTER_STATUS.ACTIVE,
      group: 'all'
    });
    setGroupFormOpen(true);
  };

  return (
    <>
      <div className="flex flex-col gap-6 w-full min-w-0 h-[calc(100vh-310px)] overflow-hidden pb-4">
        <div className="grid grid-cols-12 gap-4 h-full">
          {/* Master Types Column */}
          <div className="col-span-12 lg:col-span-3 h-full flex min-h-0">
            <div className="w-full h-full min-h-0">
              <MasterTypes selected={selectedMaster} onSelect={onSelectMaster} masterTypes={masterTypes} />
            </div>
          </div>

          {/* Group Filter Column */}
          <div className={`col-span-12 h-full flex min-h-0 ${isCategory ? 'lg:col-span-9' : 'lg:col-span-3'}`}>
            <div className="w-full h-full min-h-0">
              <GroupFilter
                groups={displayGroups}
                selected={selectedGroup}
                onSelect={onSelectGroup}
                masterId={isCategory ? master.id : MASTER_IDS.CATEGORY}
                onAdd={handleAddGroup}
                onEdit={handleEditGroup}
                onDelete={onDeleteGroup}
                pagination={isCategory ? pagination : undefined}
              />
            </div>
          </div>

          {/* Records Table Column */}
          {!isCategory && (
            <div className="col-span-12 lg:col-span-6 h-full flex min-h-0">
              <div className="w-full h-full min-h-0">
                <AssetTypeMasterTable master={master} selectedGroup={selectedGroup} onDelete={onDelete} onSave={onSave} isPending={isPending} pagination={pagination} />
              </div>
            </div>
          )}
        </div>
      </div>


      <AssetCategoryMasterForm
        key={groupFormOpen ? `edit-${groupEditData?.id || 'new'}` : 'closed'}
        open={groupFormOpen}
        onClose={() => setGroupFormOpen(false)}
        onSave={(payload, onSuccess) => onSaveGroup(payload, groupEditData, onSuccess)}
        editData={groupEditData}
        masterId={MASTER_IDS.CATEGORY}
        selectedGroup="all"
        isPending={isPending}
      />
    </>
  );
}

