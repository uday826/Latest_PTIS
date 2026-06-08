'use client';

import React, { useState, useEffect } from 'react';
import { List } from 'lucide-react';
import { AddButton } from '@/components/common/ActionButtons';
import { SearchInput } from '@/components/common/SearchInput';
import { type MasterId } from '@/types/asset-type/master-data.types';

interface MasterRecordLayoutProps {
  masterName: string;
  selectedGroupId?: string;
  selectedGroupName?: string;
  onAdd: () => void;
  search: string;
  onSearchChange: (val: string) => void;
  children: React.ReactNode;
}

import { useTranslations } from 'next-intl';
import { MasterCard } from './MasterCard';

export function MasterRecordLayout({
  masterName,
  selectedGroupId,
  selectedGroupName,
  onAdd,
  search,
  onSearchChange,
  children,
}: MasterRecordLayoutProps) {
  const t = useTranslations('asset.configuration.masterData');
  const mt = useTranslations('asset.masterNames');

  const displayMasterName = mt(masterName as MasterId) || masterName.replace(' Master', '');
  const [localSearch, setLocalSearch] = useState(search);

  // Sync local search with external search (e.g. URL change)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalSearch(search);
  }, [search]);

  // Debounced search effect
  useEffect(() => {
    if (localSearch === search) return;

    const handler = setTimeout(() => {
      onSearchChange(localSearch);
    }, 400); // 400ms debounce

    return () => clearTimeout(handler);
  }, [localSearch, onSearchChange, search]);

  const subTitle = selectedGroupName && selectedGroupId !== 'all' 
    ? `${displayMasterName} - ${selectedGroupName}`
    : displayMasterName;

  return (
    <>
      <MasterCard
        title={t('records')}
        icon={List}
        headerAction={
          <AddButton
            onClick={onAdd}
            label={t('addNew', { name: displayMasterName })}
            className="bg-cyan-600 hover:bg-cyan-700 rounded-md border-0 !h-8 !px-3 py-2"
          />
        }
      >
        {/* Stats Subheader */}
        <div className="px-5 py-3 bg-[#faf7ff] border-b border-purple-200 flex items-center justify-between">
          <span className="text-sm text-purple-700 font-medium">
            {t('stats.master')}: {subTitle}
          </span>
        </div>

        {/* Search Bar */}
        <div className="px-5 py-3 bg-white border-b border-slate-100">
          <SearchInput
            value={localSearch}
            onChange={setLocalSearch}
            className="w-full mb-0"
            placeholder={t('searchPlaceholder')}
          />
        </div>


        {/* Table Content */}
        <div className="flex-1 min-h-0">
          {children}
        </div>


      </MasterCard>
    </>
  );
}
