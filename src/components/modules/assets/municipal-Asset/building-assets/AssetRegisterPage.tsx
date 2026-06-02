/* eslint-disable i18next/no-literal-string */
'use client';

import React, { useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeft, Building2Icon } from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  MasterTable,
  SearchInput,
  SearchSelect,
  ExportButton,
} from '@/components/common';
import {
  AssetRegisterRow,
  AssetRegisterApiRecord,
  PAGE_SIZE_OPTIONS,
  mapAssetToRow,
  getRegisterColumns,
  exportToExcel,
} from './registerHelpers';

export default function AssetRegisterPage({
  categoryId,
  initialCategoryName = '',
  page = 1,
  pageSize = 10,
  search = '',
  assetTypeId = 'all',
  zoneId = 'all',
  wardId = 'all',
  assets: initialAssets = [],
  totalCount = 0,
  initialAssetTypes = [],
  initialZones = [],
  initialWards = [],
}: {
  categoryId: number;
  initialCategoryName?: string;
  page?: number;
  pageSize?: number;
  search?: string;
  assetTypeId?: string;
  zoneId?: string;
  wardId?: string;
  assets?: AssetRegisterApiRecord[];
  totalCount?: number;
  initialAssetTypes?: { id: number; label: string }[];
  initialZones?: { id: number; label: string }[];
  initialWards?: { id: number; label: string; zoneId?: number | null }[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [searchValue, setSearchValue] = useState(search);
  const categoryName = initialCategoryName;
  const error = null;

  const assets = useMemo(
    () => initialAssets.map((item) => mapAssetToRow(item, initialCategoryName)),
    [initialAssets, initialCategoryName]
  );

  const assetTypeOptions = useMemo(
    () => [
      { label: 'All Asset Types', value: 'all' },
      ...initialAssetTypes.map((type) => ({ label: type.label, value: String(type.id) })),
    ],
    [initialAssetTypes]
  );

  const zoneOptions = useMemo(
    () => [
      { label: 'All Zones', value: 'all' },
      ...initialZones.map((zone) => ({ label: zone.label, value: String(zone.id) })),
    ],
    [initialZones]
  );

  const allWards = initialWards;

  const wardOptions = useMemo(() => {
    return [
      { label: 'All Wards', value: 'all' },
      ...allWards
        .filter((ward) => zoneId === 'all' || ward.zoneId == null || String(ward.zoneId) === zoneId)
        .map((ward) => ({ label: ward.label, value: String(ward.id) })),
    ];
  }, [allWards, zoneId]);

  const resolvedCategoryName = categoryName || initialCategoryName || 'Asset Register';
  const hasResolvedCategoryName = Boolean(categoryName || initialCategoryName);
  const registerSubtitle = hasResolvedCategoryName
    ? `Register of ${resolvedCategoryName}`
    : 'Private municipal asset register';

  const requestParams = useMemo(
    () => ({
      assetTypeId: assetTypeId === 'all' ? null : Number(assetTypeId),
      zoneId: zoneId === 'all' ? null : Number(zoneId),
      wardId: wardId === 'all' ? null : Number(wardId),
    }),
    [assetTypeId, zoneId, wardId]
  );

  const updateQuery = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(window.location.search);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const handleSearchChange = (val: string) => {
    setSearchValue(val);
    updateQuery({ search: val.trim() || null, page: '1' });
  };

  const handlePageChange = (newPage: number) => {
    updateQuery({ page: String(newPage) });
  };

  const handlePageSizeChange = (newSize: number) => {
    updateQuery({ pageSize: String(newSize), page: '1' });
  };

  const handleAssetTypeChange = (newType: string) => {
    updateQuery({ AssetTypeId: newType === 'all' ? null : newType, page: '1' });
  };

  const handleZoneChange = (newZone: string) => {
    updateQuery({ ZoneId: newZone === 'all' ? null : newZone, WardId: null, page: '1' });
  };

  const handleWardChange = (newWard: string) => {
    updateQuery({ WardId: newWard === 'all' ? null : newWard, page: '1' });
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePage = Math.min(page, totalPages);
  const totalAssets = totalCount;
  const activeAssets = useMemo(() => assets.filter((item) => item.status === 'Active').length, [assets]);
  const totalPurchaseValue = useMemo(
    () => assets.reduce((sum, item) => sum + (Number(item.purchaseValue.replace(/,/g, '')) || 0), 0),
    [assets]
  );
  const totalMarketValue = useMemo(
    () => assets.reduce((sum, item) => sum + (Number(item.marketValue.replace(/,/g, '')) || 0), 0),
    [assets]
  );

  const handleExportExcel = async () => {
    try {
      await exportToExcel(
        categoryId,
        search,
        totalCount,
        requestParams,
        initialCategoryName,
        pageSize,
        assets
      );
    } catch {
      // keep export failures silent for now
    }
  };

  const columns = useMemo(() => getRegisterColumns(pathname, router), [pathname, router]);

  return (
    <div className="min-h-[calc(100vh-120px)] bg-slate-50/80 p-2 font-sans">
      <div className="mx-auto flex w-full max-w-437.5 flex-col gap-2.5">
        <Card variant="elevated" className="border-0 bg-white shadow-sm overflow-hidden">
          <div className="bg-[#0e315d] text-white px-4 py-3">
            <div className="flex items-center gap-2.5">
              <Button
                type="button"
                aria-label="Go back"
                onClick={() => router.back()}
                variant="ghost"
                size="sm"
                className="h-8 w-8 border border-white/15 bg-transparent px-0 text-white hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-[20px] font-extrabold leading-none">{resolvedCategoryName}</h1>
              </div>
            </div>
          </div>

          <CardContent className="border border-slate-200 p-0">
            <div className="border-b border-slate-200 px-4 py-3 text-center">
              <div className="inline-flex items-center gap-2 text-slate-900">
                <Building2Icon className="h-4 w-4" />
                <h2 className="text-[15px] font-extrabold uppercase tracking-tight">MUNICIPAL CORPORATION ASSET REGISTER</h2>
              </div>
              <p className="mt-1 text-[11px] text-slate-600">
                {registerSubtitle} | Updated: {new Date().toLocaleDateString('en-GB')}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2 px-4 py-3 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5">
              <div className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-center shadow-sm">
                <p className="text-[10px] font-medium uppercase tracking-widest text-slate-500">Total Assets</p>
                <p className="mt-1 text-[22px] font-extrabold leading-none text-slate-900">{totalAssets}</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-center shadow-sm">
                <p className="text-[10px] font-medium uppercase tracking-widest text-slate-500">Current Value</p>
                <p className="mt-1 text-[22px] font-extrabold leading-none text-slate-900">₹{totalMarketValue.toLocaleString('en-IN')}</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-center shadow-sm">
                <p className="text-[10px] font-medium uppercase tracking-widest text-slate-500">Depreciation</p>
                <p className="mt-1 text-[22px] font-extrabold leading-none text-red-600">₹{Math.max(0, totalPurchaseValue - totalMarketValue).toLocaleString('en-IN')}</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-center shadow-sm">
                <p className="text-[10px] font-medium uppercase tracking-widest text-slate-500">Net Book Value</p>
                <p className="mt-1 text-[22px] font-extrabold leading-none text-emerald-600">₹{Math.min(totalPurchaseValue, totalMarketValue).toLocaleString('en-IN')}</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-center shadow-sm">
                <p className="text-[10px] font-medium uppercase tracking-widest text-slate-500">Active Assets</p>
                <p className="mt-1 text-[22px] font-extrabold leading-none text-blue-600">{activeAssets}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="bordered" padding="none" className="relative z-30 border-blue-100 shadow-sm overflow-visible">
          <CardContent className="flex flex-col gap-2.5 px-4 py-3 xl:flex-row xl:items-center xl:justify-between overflow-visible">
            <div className="relative z-40 w-full xl:max-w-[320px]">
              <SearchInput
                value={searchValue}
                onChange={handleSearchChange}
                placeholder="Search assets ..."
                className="w-full"
                showClear={false}
              />
            </div>

            <div className="relative z-40 flex flex-wrap items-center gap-2 xl:justify-end">
              <SearchSelect
                name="assetType"
                label=""
                options={assetTypeOptions}
                value={assetTypeId}
                onChange={(_, value) => handleAssetTypeChange(value)}
                placeholder="Asset Type"
                className="relative z-50 min-w-41.25"
              />

              <SearchSelect
                name="zone"
                label=""
                options={zoneOptions}
                value={zoneId}
                onChange={(_, value) => handleZoneChange(value)}
                placeholder="All Zones"
                className="relative z-50 min-w-41.25"
              />

              <SearchSelect
                name="ward"
                label=""
                options={wardOptions}
                value={wardId}
                onChange={(_, value) => handleWardChange(value)}
                placeholder="All Wards"
                className="relative z-50 min-w-41.25"
              />

              <ExportButton
                size="sm"
                onClick={() => void handleExportExcel()}
                className="h-9 rounded-md border-slate-200 bg-white px-4 text-xs text-slate-700 shadow-sm hover:bg-slate-50"
              >
                Export
              </ExportButton>
            </div>
          </CardContent>
        </Card>

        {error ? (
          <Card variant="bordered" className="border-red-200 bg-red-50">
            <CardContent className="p-6 text-sm text-red-700">{error}</CardContent>
          </Card>
        ) : null}

        <MasterTable<AssetRegisterRow>
          columns={columns}
          data={assets}
          loading={false}
          emptyText="No asset records found for this category"
          pageNumber={safePage}
          pageSize={pageSize}
          totalCount={totalCount}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          pageSizeOptions={PAGE_SIZE_OPTIONS}
          paginationConfig={{ enabled: true, showPageSizeSelector: true }}
          containerClassName="rounded-lg"
          tableClassName="min-w-[2800px] table-fixed"
          rowClassName={(_, index) => (index % 2 === 0 ? 'bg-white' : 'bg-slate-50')}
          getRowKey={(row) => row.id}
        />
      </div>
    </div>
  );
}
