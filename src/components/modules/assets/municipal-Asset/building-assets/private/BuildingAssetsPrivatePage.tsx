'use client';

import React from 'react';
import {
  ArrowLeft,
  CalendarClock,
  Eye,
  FileSpreadsheet,
  Filter,
  ShieldCheck,
} from 'lucide-react';

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  EditButton,
  ExportButton,
  MasterTable,
  PageContainer,
  Input,
  SearchInput,
  SearchSelect,
} from '@/components/common';
import type { Column } from '@/components/common';

import { MOCK_BUILDING_ASSETS } from './data/mockBuildingAssets';
import type { AssetCondition, BuildingAsset } from './types';
import { exportAssetsAsCsv, formatINR, getAssetTypeOptions, WARD_OPTIONS, ZONE_OPTIONS } from './utils';
import { createBuildingAssetColumns } from './tablecolumn';
import { SummaryReport } from './summary';
import { ToggleValue } from './togglevalue';


const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];
const ALL_ASSETS_VALUE = 'All Assets';

export default function BuildingAssetsPrivatePage() {
  const [search, setSearch] = React.useState('');
  const [selectedAssetTypes, setSelectedAssetTypes] = React.useState<string[]>([ALL_ASSETS_VALUE]);
  const [selectedZone, setSelectedZone] = React.useState(ZONE_OPTIONS[0]);
  const [selectedWard, setSelectedWard] = React.useState(WARD_OPTIONS[0]);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(DEFAULT_PAGE_SIZE);

  const assetTypeOptions = React.useMemo(() => getAssetTypeOptions(MOCK_BUILDING_ASSETS), []);
  const columns = React.useMemo(() => createBuildingAssetColumns(), []);

  const filteredAssets = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    const shouldFilterByAssetType =
      selectedAssetTypes.length > 0 && !selectedAssetTypes.includes(ALL_ASSETS_VALUE);

    return MOCK_BUILDING_ASSETS.filter((asset) => {
      const textMatches = query
        ? [
            asset.assetId,
            asset.assetName,
            asset.description,
            asset.subCategory,
            asset.assetType,
            asset.location,
            asset.ward,
            asset.zone,
            asset.department,
          ]
            .join(' ')
            .toLowerCase()
            .includes(query)
        : true;

      const assetTypeMatches = shouldFilterByAssetType ? selectedAssetTypes.includes(asset.assetType) : true;
      const zoneMatches = selectedZone === ZONE_OPTIONS[0] ? true : asset.zone === selectedZone;
      const wardMatches = selectedWard === WARD_OPTIONS[0] ? true : asset.ward === selectedWard;

      return textMatches && assetTypeMatches && zoneMatches && wardMatches;
    });
  }, [search, selectedAssetTypes, selectedWard, selectedZone]);

  React.useEffect(() => {
    setPage(1);
  }, [search, selectedAssetTypes, selectedZone, selectedWard]);

  const totalPages = Math.max(1, Math.ceil(filteredAssets.length / pageSize));

  React.useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const end = Math.min(start + pageSize, filteredAssets.length);
  const pageAssets = filteredAssets.slice(start, end);

  return (
    <PageContainer className="min-h-screen bg-[#eef7fb] text-slate-950">
      <div className="space-y-3 pt-2">
        <Card variant="elevated" padding="sm" className="border-0 bg-[#0e315d] text-white shadow-sm">
          <CardContent className="flex items-center gap-3 p-0">
            <Button
              type="button"
              aria-label="Go back"
              onClick={() => window.history.back()}
              variant="ghost"
              size="sm"
              className="h-8 w-8 border border-white/15 bg-transparent px-0 text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-extrabold leading-none">Building Assets</h1>
              <p className="mt-1 text-xs text-white/70">Private municipal asset register</p>
            </div>
          </CardContent>
        </Card>

        <SummaryReport totalAssets={MOCK_BUILDING_ASSETS.length} filteredAssets={filteredAssets.length} />

        <Card variant="bordered" padding="none" className="relative z-30 overflow-visible border-blue-100 shadow-[0_10px_30px_rgba(37,99,235,0.08)]">
          <CardHeader className="border-b border-blue-100 bg-gradient-to-r from-[#f8fbff] via-[#ffffff] to-[#f4f8ff] px-4 py-3">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <SearchInput
                  value={search}
                  onChange={setSearch}
                  placeholder="Search assets ..."
                  className="mb-0 w-full sm:w-[330px]"
                  showClear={false}
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 xl:justify-end">
                <ToggleValue
                  options={assetTypeOptions.map((option) => ({
                    label: option.label,
                    value: option.value,
                  }))}
                  selectedValues={selectedAssetTypes}
                  onChange={setSelectedAssetTypes}
                />

                <SearchSelect
                  name="zone"
                  label=""
                  options={ZONE_OPTIONS.map((zone) => ({ label: zone, value: zone }))}
                  value={selectedZone}
                  onChange={(_, value) => setSelectedZone(value)}
                  placeholder="Zone"
                  className="min-w-[180px]"
                />

                <SearchSelect
                  name="ward"
                  label=""
                  options={WARD_OPTIONS.map((ward) => ({ label: ward, value: ward }))}
                  value={selectedWard}
                  onChange={(_, value) => setSelectedWard(value)}
                  placeholder="Ward"
                  className="min-w-[160px]"
                />
                
                <ExportButton
                  size="sm"
                  onClick={() => exportAssetsAsCsv(filteredAssets)}
                  className="h-9 rounded-lg border-emerald-200 bg-emerald-50 px-4 text-xs text-emerald-700 shadow-sm hover:bg-emerald-100"
                >
                  Export Excel
                  <span className="ml-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                    {filteredAssets.length}
                  </span>
                </ExportButton>
              </div>
            </div>
          </CardHeader>
        </Card>

        <MasterTable
          columns={columns}
          data={pageAssets}
          actionLabel="Action"
          renderActions={(row) => (
            <>
              <Button
                type="button"
                aria-label={`View ${row.assetName}`}
                variant="secondary"
                size="xs"
                className="h-7 w-7 border-blue-200 bg-blue-50 px-0 text-blue-600 hover:bg-blue-100"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <EditButton
                type="button"
                aria-label={`Edit ${row.assetName}`}
                size="xs"
                className="h-7 w-7 border-emerald-200 bg-emerald-50 px-0 text-emerald-600 hover:bg-emerald-100"
              />
            </>
          )}
          emptyText="No building assets found"
          containerClassName="rounded-xl border border-[#062b4f] shadow-sm"
          tableClassName="min-w-[2300px] text-[11px]"
          theadClassName="!bg-[#062b4f] text-white"
          rowClassName={(_, index) =>
            `border-b border-slate-300 transition hover:bg-blue-50 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`
          }
          pageNumber={safePage}
          pageSize={pageSize}
          totalCount={filteredAssets.length}
          totalPages={totalPages}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
          pageSizeOptions={PAGE_SIZE_OPTIONS}
          paginationConfig={{ enabled: true, showPageSizeSelector: true }}
        />
      </div>
    </PageContainer>
  );
}
