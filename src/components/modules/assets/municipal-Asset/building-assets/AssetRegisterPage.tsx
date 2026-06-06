/* eslint-disable i18next/no-literal-string */
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeft, Building2Icon } from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  DashboardCard,
  MasterTable,
  SearchInput,
  SearchSelect,
  ExportButton,
  useToast,
} from '@/components/common';
import { useDebounce } from '@/hooks/useDebounce';
import { fetchAssetRegisterPage } from '@/app/[locale]/assets/municipal-Asset/asset-register/actions';
import {
  AssetRegisterRow,
  AssetRegisterApiRecord,
  mapAssetToRow,
  getRegisterColumns,
  exportToExcel,
} from './registerHelpers';

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];
const EXPORT_BATCH_SIZE = 200;

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
  totalPurchaseValue = 0,
  totalMarketValue = 0,
  totalDepreciation = 0,
  netBookValue = 0,
  activeAssetsCount = 0,
  initialAssetTypes = [],
  initialZones = [],
  initialWards = [],
  updatedDate = '',
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
  totalPurchaseValue?: number;
  totalMarketValue?: number;
  totalDepreciation?: number;
  netBookValue?: number;
  activeAssetsCount?: number;
  initialAssetTypes?: { id: number; label: string }[];
  initialZones?: { id: number; label: string }[];
  initialWards?: { id: number; label: string; zoneId?: number | null }[];
  updatedDate?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();
  const [searchValue, setSearchValue] = useState(search);
  const debouncedSearch = useDebounce(searchValue, 500);
  const isInitialSearchSync = useRef(true);
  const categoryName = initialCategoryName;

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

  // Only update URL when debounced search changes (avoids server fetch on every keypress)
  useEffect(() => {
    if (isInitialSearchSync.current) {
      isInitialSearchSync.current = false;
      return;
    }
    const trimmed = debouncedSearch.trim();
    updateQuery({ search: trimmed || null, page: '1' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

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

  const handleSearchChange = (val: string) => {
    setSearchValue(val);
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
  const activeAssets = activeAssetsCount;
  const purchaseAssetsValue = totalPurchaseValue;

  const handleExportExcel = async () => {
    try {
      const totalToExport = totalCount || assets.length;
      const firstPageSize = Math.min(EXPORT_BATCH_SIZE, Math.max(totalToExport, pageSize));
      const exportResponse = await fetchAssetRegisterPage(
        categoryId,
        1,
        firstPageSize,
        searchValue.trim(),
        requestParams.assetTypeId,
        requestParams.zoneId,
        requestParams.wardId
      );

      const firstItems = exportResponse.items || [];
      const allItems = [...firstItems];
      const exportTotal = exportResponse.totalCount || totalToExport || allItems.length;
      let currentPage = 2;

      while (allItems.length < exportTotal) {
        const nextResponse = await fetchAssetRegisterPage(
          categoryId,
          currentPage,
          EXPORT_BATCH_SIZE,
          searchValue.trim(),
          requestParams.assetTypeId,
          requestParams.zoneId,
          requestParams.wardId
        );

        const nextItems = nextResponse.items || [];
        if (!nextItems.length) {
          break;
        }

        allItems.push(...nextItems);
        currentPage += 1;
      }

      await exportToExcel(
        allItems,
        categoryId,
        initialCategoryName
      );
    } catch (error) {
      console.error('Failed to export asset register Excel:', error);
      toast.error('Failed to export asset register. Please try again.');
    }
  };

  const columns = useMemo(() => getRegisterColumns(pathname, router), [pathname, router]);

  return (
    <div className="min-h-[calc(100vh-120px)] bg-slate-50/80 p-2 font-sans">
      <div className="mx-auto flex w-full max-w-437.5 flex-col gap-2.5">
        <Card variant="elevated" className="overflow-hidden border-0 bg-white shadow-sm">
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
                {registerSubtitle} | Updated: {updatedDate}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2 px-4 py-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
              <DashboardCard
                label="Total Assets"
                value={totalAssets}
                className="min-h-[78px]"
              />
              <DashboardCard
                label="Purchase Value"
                value={`₹${purchaseAssetsValue.toLocaleString('en-IN')}`}
                className="min-h-[78px]"
              />
              <DashboardCard
                label="Current Value"
                value={`₹${totalMarketValue.toLocaleString('en-IN')}`}
                className="min-h-[78px]"
              />
              <DashboardCard
                label="Depreciation"
                value={`₹${totalDepreciation.toLocaleString('en-IN')}`}
                valueColor="text-red-600"
                className="min-h-[78px]"
              />
              <DashboardCard
                label="Net Book Value"
                value={`₹${netBookValue.toLocaleString('en-IN')}`}
                valueColor="text-emerald-600"
                className="min-h-[78px]"
              />
              <DashboardCard
                label="Active Assets"
                value={activeAssets}
                valueColor="text-blue-600"
                className="min-h-[78px]"
              />
            </div>
          </CardContent>
        </Card>

        <Card
          variant="bordered"
          padding="none"
          className="relative z-30 overflow-visible border-slate-200/80 bg-white shadow-[0_12px_32px_rgba(15,23,42,0.06)]"
        >
          <CardContent className="flex flex-col gap-3 overflow-visible px-4 py-4 xl:flex-row xl:items-center xl:justify-between xl:gap-4">
            <div className="w-full xl:max-w-[320px]">
              <SearchInput
                value={searchValue}
                onChange={handleSearchChange}
                placeholder="Search assets ..."
                className="mb-0 w-full"
                showClear={false}
              />
            </div>

            <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center xl:w-auto xl:flex-nowrap xl:justify-end">
              <div className="w-full sm:w-57.5">
                <SearchSelect
                  name="assetType"
                  label=""
                  options={assetTypeOptions}
                  value={assetTypeId}
                  onChange={(_, value) => handleAssetTypeChange(value)}
                  placeholder="All Asset Types"
                  className="w-full"
                />
              </div>

              <div className="w-full sm:w-57.5">
                <SearchSelect
                  name="zone"
                  label=""
                  options={zoneOptions}
                  value={zoneId}
                  onChange={(_, value) => handleZoneChange(value)}
                  placeholder="All Zones"
                  className="w-full"
                />
              </div>

              <div className="w-full sm:w-57.5">
                <SearchSelect
                  name="ward"
                  label=""
                  options={wardOptions}
                  value={wardId}
                  onChange={(_, value) => handleWardChange(value)}
                  placeholder="All Wards"
                  className="w-full"
                />
              </div>

              <div className="w-full sm:w-auto">
                <ExportButton
                  size="sm"
                  onClick={() => void handleExportExcel()}
                  className="h-9 w-full rounded-md border-slate-200 bg-white px-4 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 sm:w-auto"
                >
                  Export
                </ExportButton>
              </div>
            </div>
          </CardContent>
        </Card>

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
          getRowKey={(row, index) => row.id ?? `${row.assetCode}-${index}`}
        />
      </div>
    </div>
  );
}
