'use client';
import { useState, useMemo, useTransition, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useMasterData } from '@/hooks/asset-hooks/useMasterData';
import type { MasterDataRootProps, MasterDataCommonProps, MasterDataRecord, MasterDataGroup } from '@/types/asset-type/master-data.types';
import { MASTER_IDS, type MasterId } from '@/types/asset-type/master-data.types';
import type { ComponentType } from 'react';

const ROUTE_MAP: Record<string, string> = {
  [MASTER_IDS.TYPE]: 'asset-type',
  [MASTER_IDS.CATEGORY]: 'asset-category',
};

/**
 * MasterDataView: The core layout component for Master Data management.
 * Handles selection of master types, filtering by groups, and coordinates CRUD actions.
 */
export default function MasterDataView({
  initialMaster,
  initialGroup = 'all',
  initialMasters = [],
  actions,
  viewComponent: ViewComponent,
  allowedIds,
  children
}: MasterDataRootProps & { viewComponent?: ComponentType<MasterDataCommonProps>, allowedIds?: string[] }) {
  const t = useTranslations('asset.configuration.masterData');
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [selectedMaster, setSelectedMaster] = useState<MasterId>((initialMaster as MasterId) || MASTER_IDS.TYPE);
  const [selectedGroup, setSelectedGroup] = useState(initialGroup);
  const [isNavigating, startNavTransition] = useTransition();

  const mergedMasters = useMemo(() => {
    const ids = allowedIds || Object.values(MASTER_IDS);
    return (initialMasters || []).filter(m => ids.includes(m.id));
  }, [initialMasters, allowedIds]);

  const { optimisticMasters, isPending: isOptimisticPending, handleSave, handleDelete } = useMasterData(mergedMasters, actions);
  


  const master = optimisticMasters.find(m => m.id === selectedMaster) || optimisticMasters[0];
  const isPending = isOptimisticPending || isNavigating;

  const updateParams = useCallback((newParams: Record<string, string | number>) => {
    startNavTransition(() => {
      const currentParams = new URLSearchParams(searchParams.toString());
      Object.entries(newParams).forEach(([k, v]) => {
        if (v === undefined || v === null || v === '') currentParams.delete(k);
        else currentParams.set(k, String(v));
      });
      router.push(`${pathname}?${currentParams.toString()}`, { scroll: false });
    });
  }, [searchParams, router, pathname, startNavTransition]);

  const handleSelectMaster = useCallback((id: string) => {
    startNavTransition(() => {
      const route = ROUTE_MAP[id];
      if (route) {
        // Construct new path by replacing the last segment of the current master-data path
        const basePath = pathname.includes('/master-data/')
          ? pathname.split('/master-data/')[0] + '/master-data/'
          : pathname;

        router.push(`${basePath}${route}`);
      } else {
        setSelectedMaster(id as MasterId);
        setSelectedGroup('all');
        updateParams({ group: 'all', page: 1 });
      }
    });
  }, [updateParams, startNavTransition, pathname, router]);

  const onSaveGroup = useCallback(async (payload: MasterDataRecord, editData: MasterDataRecord | null, onSuccess?: () => void) => {
    await handleSave(payload, MASTER_IDS.CATEGORY, editData, onSuccess);
  }, [handleSave]);

  const onDeleteGroup = useCallback(async (group: MasterDataGroup) => {
    const recordToDelete: MasterDataRecord = {
      id: group.id,
      backendId: group.backendId,
      name: group.name,
      status: 'Active',
    };
    await handleDelete(recordToDelete, MASTER_IDS.CATEGORY);
  }, [handleDelete]);

  const onSelectGroup = useCallback((id: string) => {
    setSelectedGroup(id);
    updateParams({ group: id, page: '1' });
  }, [updateParams]);

  const onPageChange = useCallback((page: number) => updateParams({ page }), [updateParams]);
  const onPageSizeChange = useCallback((pageSize: number) => updateParams({ pageSize, page: 1 }), [updateParams]);
  const onSearch = useCallback((search: string) => updateParams({ search, page: 1 }), [updateParams]);

  const masterTypes = useMemo(() => {
    const ids = (allowedIds || Object.values(MASTER_IDS));
    return optimisticMasters.filter(m => ids.includes(m.id));
  }, [optimisticMasters, allowedIds]);

  if (optimisticMasters.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div role="alert" className="text-slate-500 font-medium">
          {t('noDataAvailable')}
        </div>
      </div>
    );
  }

  const commonProps: MasterDataCommonProps = {
    master: master!,
    selectedMaster,
    selectedGroup,
    isPending,
    onSelectMaster: handleSelectMaster,
    onSelectGroup,
    masterTypes,
    onDelete: handleDelete,
    onSave: handleSave,
    onSaveGroup,
    onDeleteGroup,
    pagination: {
      page: Number(searchParams.get('page') || 1),
      pageSize: Number(searchParams.get('pageSize') || 10),
      search: searchParams.get('search') || "",
      sortBy: searchParams.get('sortBy') || "typeName",
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || "asc",
      totalCount: master?.totalCount || 0,
      totalPages: master?.totalPages || 1,
      onPageChange,
      onPageSizeChange,
      onSearch,
      onSort: (sortBy: string, sortOrder: 'asc' | 'desc') => updateParams({ sortBy, sortOrder, page: 1 }),
    },
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50 !overflow-hidden">
      {children || (ViewComponent ? <ViewComponent {...commonProps} /> : null)}
    </div>
  );
}

