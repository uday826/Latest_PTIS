/* eslint-disable i18next/no-literal-string */
/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { MasterTable } from '@/components/common';
import type { AssetDetailRecord, AssetFloorDetailItem } from '@/types/municipal-asset/detail-tabs.types';
import { AlertCircle, BadgeIndianRupee, Layers } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { blank, formatCurrency, getFloorDetailsColumns } from './detailcolumn';

type FloorTableRow = AssetFloorDetailItem & Record<string, unknown>;

export function FloorDetailsTab({ asset }: { asset: AssetDetailRecord }) {
  const summary = asset.floorSummary;
  const floors = useMemo(() => summary?.floorDetails ?? [], [summary?.floorDetails]);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;
  const totalCount = floors.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const paginatedFloors = useMemo(
    () => floors.slice((pageNumber - 1) * pageSize, pageNumber * pageSize),
    [floors, pageNumber]
  );

  React.useEffect(() => {
    if (pageNumber > totalPages) {
      setPageNumber(totalPages);
    }
  }, [pageNumber, totalPages]);

  React.useEffect(() => {
    setPageNumber(1);
  }, [summary?.totalFloors]);

  const columns = useMemo(() => getFloorDetailsColumns(), []);

  if (asset.floorSummaryError) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
        <div className="flex items-center gap-2 font-bold">
          <AlertCircle className="h-4 w-4" />
          Floor details could not be loaded
        </div>
        <p className="mt-1 text-xs">{asset.floorSummaryError}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Floors', value: blank(summary?.totalFloors ?? floors.length), icon: Layers },
          { label: 'Total Base Value', value: formatCurrency(summary?.totalBaseValue), icon: BadgeIndianRupee },
          { label: 'Total Capital Value', value: formatCurrency(summary?.totalCapitalValue), icon: BadgeIndianRupee },
          { label: 'Total Market Value', value: formatCurrency(summary?.totalMarketValue), icon: BadgeIndianRupee },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
              <p className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                <Icon className="h-3.5 w-3.5 text-blue-500" />
                {item.label}
              </p>
              <p className="mt-1 text-sm font-bold text-slate-900">{item.value}</p>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <div className="flex items-center gap-2 text-slate-800">
            <Layers className="h-4 w-4 text-blue-600" />
            <h3 className="text-sm font-bold">Floor Details</h3>
          </div>
          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-600">{floors.length} floors</span>
        </div>

        <MasterTable<FloorTableRow>
          columns={columns}
          data={paginatedFloors as FloorTableRow[]}
          getRowKey={(row) => row.id}
          pageNumber={pageNumber}
          pageSize={pageSize}
          totalCount={totalCount}
          totalPages={totalPages}
          onPageChange={setPageNumber}
          paginationConfig={{ enabled: true }}
          emptyText="No floor details available for this asset."
          headerTitle=""
          headerSubtitle=""
          tableClassName="min-w-[1280px]"
          maxBodyHeightClassName="max-h-[calc(100vh-360px)]"
          containerClassName="overflow-hidden"
        />
      </div>
    </div>
  );
}
