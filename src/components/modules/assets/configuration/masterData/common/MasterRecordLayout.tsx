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
  extraHeaderAction?: React.ReactNode;
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
  extraHeaderAction,
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
          <div className="flex items-center gap-3">
            {extraHeaderAction}
            <AddButton
              onClick={onAdd}
              label={t('addNew', { name: displayMasterName })}
              className="bg-cyan-600 hover:bg-cyan-700 rounded-md border-0 !h-8 !px-3 py-2"
            />
          </div>
        }
      >
        {/* Stats Subheader & Search */}
        <div className="px-5 py-3 bg-[#faf7ff] border-b border-purple-200 flex items-center justify-between flex-wrap gap-3">
          <span className="text-sm text-purple-700 font-medium whitespace-nowrap">
            {t('stats.master')}: {subTitle}
          </span>
          <div className="w-full sm:w-1/2 md:w-1/3 min-w-[200px]">
            <SearchInput
              value={localSearch}
              onChange={(val) => {
                const sanitized = val.replace(/[^a-zA-Z0-9 \-_]/g, '');
                setLocalSearch(sanitized);
              }}
              className="w-full mb-0"
              placeholder={t('searchPlaceholder')}
            />
          </div>
        </div>


        {/* Table Content */}
        <div className="flex-1 min-h-0">
          {children}
        </div>


      </MasterCard>
    </>
  );
}
