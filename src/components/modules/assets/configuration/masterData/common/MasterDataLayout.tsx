'use client';

import React from 'react';

interface MasterDataLayoutProps {
  masterTypesList: React.ReactNode;
  groupFilterList?: React.ReactNode;
  recordsTable: React.ReactNode;
  hideGroupFilter?: boolean;
}

export function MasterDataLayout({
  masterTypesList,
  groupFilterList,
  recordsTable,
  hideGroupFilter = false,
}: MasterDataLayoutProps) {
  const hasGroupFilter = !hideGroupFilter && !!groupFilterList;

  return (
    <div className="flex flex-col gap-6 w-full min-w-0 h-[calc(100vh-310px)] overflow-hidden pb-4">
      <div className="grid grid-cols-12 gap-4 h-full">


        {/* Master Types Column */}
        <div
          className={`col-span-12 h-full flex min-h-0 ${
            hasGroupFilter ? 'lg:col-span-3' : 'lg:col-span-4'
          }`}
        >
          <div className="w-full h-full min-h-0">
            {masterTypesList}
          </div>
        </div>

        {/* Group Filter Column */}
        {hasGroupFilter && (
          <div className={`col-span-12 h-full flex min-h-0 ${recordsTable ? 'lg:col-span-3' : 'lg:col-span-9'}`}>
            <div className="w-full h-full min-h-0">
              {groupFilterList}
            </div>
          </div>
        )}

        {/* Records Table Column */}
        {recordsTable && (
          <div
            className={`col-span-12 h-full flex min-h-0 ${
              hasGroupFilter ? 'lg:col-span-6' : 'lg:col-span-8'
            }`}
          >
            <div className="w-full h-full min-h-0">
              {recordsTable}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
