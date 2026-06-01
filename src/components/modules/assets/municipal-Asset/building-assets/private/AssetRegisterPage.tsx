'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeft, Building2, Building2Icon, Eye, PencilLine, Printer } from 'lucide-react';
import { fetchAssetRegisterPage } from '@/app/[locale]/asset/municipal-Asset/asset-register/actions';
import {
  Badge,
  Button,
  Card,
  CardContent,
  MasterTable,
  SearchInput,
  SearchSelect,
  ExportButton,
  type Column,
} from '@/components/common';
import { ConfigurationService } from '@/services/asset/configuration.service';
import * as XLSX from 'xlsx';

type AssetRegisterRow = {
  id: number;
  assetId: string;
  authorityName: string;
  organizationName: string;
  departmentName: string;
  assetCode: string;
  assetName: string;
  categoryName: string;
  assetTypeName: string;
  parentAssetName: string;
  address: string;
  wardName: string;
  zoneName: string;
  latitude: string;
  longitude: string;
  csn: string;
  hasLift: string;
  purchaseDate: string;
  marketValueDate: string;
  capitalValue: string;
  lastCVCalculationDate: string;
  currentBookValue: string;
  depreciation: string;
  netBookValue: string;
  lifeYears: string;
  depreciationRate: string;
  isRevenueGenerating: string;
  operationalControl: string;
  fieldValues: string;
  occupancyStatus: string;
  ownershipType: string;
  assetCondition: string;
  status: string;
  purchaseValue: string;
  marketValue: string;
  builtUpAreaSqMeter: string;
  carpetAreaSqMeter: string;
  landAreaSqMeter: string;
  createdDate: string;
};

type AssetRegisterApiRecord = {
  id?: number | string;
  assetCode?: string;
  assetNo?: string;
  assetId?: string;
  assetName?: string;
  name?: string;
  categoryName?: string;
  assetCategoryName?: string;
  assetTypeName?: string;
  departmentName?: string;
  department?: string;
  authorityName?: string;
  organizationName?: string;
  status?: string;
  isActive?: boolean;
  assetCondition?: string;
  ownershipType?: string;
  occupancyStatus?: string;
  address?: string;
  wardName?: string;
  zoneName?: string;
  parentAssetName?: string;
  latitude?: number | string | null;
  longitude?: number | string | null;
  csn?: string;
  hasLift?: boolean | string | null;
  purchaseDate?: string | null;
  marketValueDate?: string | null;
  capitalValue?: number | string | null;
  lastCVCalculationDate?: string | null;
  currentBookValue?: number | string | null;
  depreciationRate?: number | string | null;
  isRevenueGenerating?: boolean | string | null;
  operationalControl?: string | null;
  fieldValues?: unknown;
  purchaseValue?: number | string | null;
  marketValue?: number | string | null;
  netBookValue?: number | string | null;
  builtUpAreaSqMeter?: number | string | null;
  carpetAreaSqMeter?: number | string | null;
  landAreaSqMeter?: number | string | null;
  createdDate?: string;
  createdAt?: string;
};

type AssetRegisterPageResult = {
  items: AssetRegisterApiRecord[];
  totalCount: number;
};

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

function formatDate(value?: string) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-IN');
}

function formatMoney(value: string) {
  if (!value || value === '-') return '-';
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return value;
  return numeric.toLocaleString('en-IN');
}

function formatBoolean(value?: boolean | string | null) {
  if (value === true || value === 'true') return 'Yes';
  if (value === false || value === 'false') return 'No';
  return '-';
}

function formatFieldValue(value: unknown) {
  if (value == null || value === '') return '-';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  try {
    return JSON.stringify(value);
  } catch {
    return '-';
  }
}

function renderTruncatedText(value?: string) {
  const text = value || '-';
  return (
    <span className="block max-w-full whitespace-normal wrap-break-word leading-5" title={text}>
      {text}
    </span>
  );
}

function renderBadge(value?: string) {
  const text = (value || '-').toLowerCase();
  const classes =
    text === 'active' || text === 'yes' || text === 'true'
      ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
      : text === 'inactive' || text === 'no' || text === 'false'
        ? 'bg-rose-100 text-rose-700 border-rose-200'
      : text === 'good' || text === 'owned'
        ? 'bg-blue-100 text-blue-700 border-blue-200'
      : text === 'fair' || text === 'leased out'
          ? 'bg-amber-100 text-amber-700 border-amber-200'
          : text === 'poor'
            ? 'bg-rose-100 text-rose-700 border-rose-200'
            : 'bg-slate-100 text-slate-700 border-slate-200';

  return <span className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold ${classes}`}>{value || '-'}</span>;
}

export default function AssetRegisterPage({
  categoryId,
  initialCategoryName = '',
  initialPage = 1,
  initialPageSize = 10,
  initialSearch = '',
  initialAssetTypeId = 'all',
  initialZoneId = 'all',
  initialWardId = 'all',
  initialAssets = [],
  initialTotalCount = 0,
  }: {
  categoryId: number;
  initialCategoryName?: string;
  initialPage?: number;
  initialPageSize?: number;
  initialSearch?: string;
  initialAssetTypeId?: string;
  initialZoneId?: string;
  initialWardId?: string;
  initialAssets?: AssetRegisterApiRecord[];
  initialTotalCount?: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [categoryName, setCategoryName] = useState<string>(initialCategoryName || '');
  const [assets, setAssets] = useState<AssetRegisterRow[]>(() => initialAssets.map((item) => mapAssetToRow(item, initialCategoryName)));
  const [loading, setLoading] = useState(initialAssets.length === 0);
  const [search, setSearch] = useState(initialSearch);
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  const [error, setError] = useState<string | null>(null);
  const [assetTypeId, setAssetTypeId] = useState(initialAssetTypeId || 'all');
  const [zoneId, setZoneId] = useState(initialZoneId || 'all');
  const [wardId, setWardId] = useState(initialWardId || 'all');
  const [assetTypeOptions, setAssetTypeOptions] = useState<{ label: string; value: string }[]>([{ label: 'All Asset Types', value: 'all' }]);
  const [zoneOptions, setZoneOptions] = useState<{ label: string; value: string }[]>([{ label: 'All Zones', value: 'all' }]);
  const [wardOptions, setWardOptions] = useState<{ label: string; value: string }[]>([{ label: 'All Wards', value: 'all' }]);
  const resolvedCategoryName = categoryName || initialCategoryName || 'Asset Register';
  const hasResolvedCategoryName = Boolean(categoryName || initialCategoryName);
  const registerSubtitle = hasResolvedCategoryName
    ? `Register of ${resolvedCategoryName}`
    : 'Private municipal asset register';

  const requestParams = useMemo(() => ({
    assetTypeId: assetTypeId === 'all' ? null : Number(assetTypeId),
    zoneId: zoneId === 'all' ? null : Number(zoneId),
    wardId: wardId === 'all' ? null : Number(wardId),
  }), [assetTypeId, zoneId, wardId]);

  function mapAssetToRow(item: AssetRegisterApiRecord, fallbackCategoryName: string): AssetRegisterRow {
    const record = item as AssetRegisterApiRecord;
    return {
      id: Number(record.id ?? 0),
      assetId: record.assetId || record.assetNo || '-',
      authorityName: record.authorityName || '-',
      organizationName: record.organizationName || '-',
      departmentName: record.departmentName || record.department || '-',
      assetCode: record.assetCode || record.assetNo || '-',
      assetName: record.assetName || record.name || '-',
      categoryName: record.categoryName || record.assetCategoryName || fallbackCategoryName || '-',
      assetTypeName: record.assetTypeName || '-',
      parentAssetName: record.parentAssetName || '-',
      address: record.address || '-',
      wardName: record.wardName || '-',
      zoneName: record.zoneName || '-',
      latitude: record.latitude == null ? '-' : String(record.latitude),
      longitude: record.longitude == null ? '-' : String(record.longitude),
      csn: record.csn || '-',
      hasLift: formatBoolean(record.hasLift),
      purchaseDate: formatDate(record.purchaseDate || undefined),
      marketValueDate: formatDate(record.marketValueDate || undefined),
      capitalValue: record.capitalValue == null ? '-' : String(record.capitalValue),
      lastCVCalculationDate: formatDate(record.lastCVCalculationDate || undefined),
      currentBookValue: record.currentBookValue == null ? '-' : String(record.currentBookValue),
      depreciationRate: record.depreciationRate == null ? '-' : String(record.depreciationRate),
      isRevenueGenerating: formatBoolean(record.isRevenueGenerating),
      operationalControl: record.operationalControl || '-',
      fieldValues: formatFieldValue(record.fieldValues),
      occupancyStatus: record.occupancyStatus || '-',
      ownershipType: record.ownershipType || '-',
      assetCondition: record.assetCondition || '-',
      status: record.isActive === false
        ? 'Inactive'
        : record.isActive === true
          ? 'Active'
          : record.status || '-',
      lifeYears: record.purchaseDate ? String(Math.max(0, new Date().getFullYear() - new Date(record.purchaseDate).getFullYear())) : '-',
      purchaseValue: record.purchaseValue == null ? '-' : String(record.purchaseValue),
      marketValue: record.marketValue == null ? '-' : String(record.marketValue),
      depreciation:
        record.purchaseValue != null && record.marketValue != null
          ? String(Math.max(0, Number(record.purchaseValue) - Number(record.marketValue)))
          : '-',
      netBookValue:
        record.netBookValue != null
          ? String(record.netBookValue)
          : record.marketValue == null
            ? '-'
            : String(record.marketValue),
      builtUpAreaSqMeter: record.builtUpAreaSqMeter == null ? '-' : String(record.builtUpAreaSqMeter),
      carpetAreaSqMeter: record.carpetAreaSqMeter == null ? '-' : String(record.carpetAreaSqMeter),
      landAreaSqMeter: record.landAreaSqMeter == null ? '-' : String(record.landAreaSqMeter),
      createdDate: record.createdDate || record.createdAt || '',
    };
  }

  useEffect(() => {
    const loadAssetTypes = async () => {
      try {
        const types = await ConfigurationService.getAssetTypesByCategory(categoryId);
        setAssetTypeOptions([
          { label: 'All Asset Types', value: 'all' },
          ...types.map((type) => ({ label: type.label, value: String(type.id) })),
        ]);
      } catch {
        setAssetTypeOptions([{ label: 'All Asset Types', value: 'all' }]);
      }
    };

    void loadAssetTypes();
  }, [categoryId]);

  useEffect(() => {
    const loadLocationOptions = async () => {
      try {
        const [zones, wards] = await Promise.all([
          ConfigurationService.getZones(),
          ConfigurationService.getWards(),
        ]);

        setZoneOptions([
          { label: 'All Zones', value: 'all' },
          ...zones.map((zone) => ({ label: zone.label, value: String(zone.id) })),
        ]);

        setWardOptions([
          { label: 'All Wards', value: 'all' },
          ...wards
            .filter((ward) => zoneId === 'all' || ward.zoneId == null || String(ward.zoneId) === zoneId)
            .map((ward) => ({ label: ward.label, value: String(ward.id) })),
        ]);
      } catch {
        setZoneOptions([{ label: 'All Zones', value: 'all' }]);
        setWardOptions([{ label: 'All Wards', value: 'all' }]);
      }
    };

    void loadLocationOptions();
  }, [zoneId]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (page > 1) params.set('page', String(page));
    if (pageSize !== 10) params.set('pageSize', String(pageSize));
    if (search.trim()) params.set('search', search.trim());
    if (assetTypeId !== 'all') params.set('AssetTypeId', assetTypeId);
    if (zoneId !== 'all') params.set('ZoneId', zoneId);
    if (wardId !== 'all') params.set('WardId', wardId);

    const query = params.toString();
    router.replace(
      query
        ? `${window.location.pathname}?${query}`
        : window.location.pathname,
      { scroll: false }
    );
  }, [page, pageSize, search, assetTypeId, zoneId, wardId, router]);

  useEffect(() => {
    const loadAssets = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = (await fetchAssetRegisterPage(
          categoryId,
          page,
          pageSize,
          search,
          requestParams.assetTypeId,
          requestParams.zoneId,
          requestParams.wardId
        )) as AssetRegisterPageResult;

        const rows = response.items.map((item) => mapAssetToRow(item, initialCategoryName));

        setAssets(rows);
        setTotalCount(response.totalCount || rows.length);
        const first = response.items[0] as AssetRegisterApiRecord | undefined;
        setCategoryName(first?.categoryName || initialCategoryName);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load asset register';
        setError(message);
        setAssets([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };

    loadAssets();
  }, [categoryId, page, pageSize, search, requestParams, initialCategoryName]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePage = Math.min(page, totalPages);
  const totalAssets = totalCount;
  const activeAssets = assets.filter((item) => item.status === 'Active').length;
  const totalPurchaseValue = assets.reduce((sum, item) => sum + (Number(item.purchaseValue.replace(/,/g, '')) || 0), 0);
  const totalMarketValue = assets.reduce((sum, item) => sum + (Number(item.marketValue.replace(/,/g, '')) || 0), 0);

  const handleExportExcel = async () => {
    try {
      const exportResponse = (await fetchAssetRegisterPage(
        categoryId,
        1,
        Math.max(totalCount || assets.length || pageSize, pageSize),
        search,
        requestParams.assetTypeId,
        requestParams.zoneId,
        requestParams.wardId
      )) as AssetRegisterPageResult;

      const exportRows = exportResponse.items.map((item) => {
        const record = item as AssetRegisterApiRecord;
        return {
          'Asset ID': record.assetId || record.assetNo || '',
          'Asset Name': record.assetName || record.name || '',
          'Category': record.assetCategoryName || initialCategoryName || '',
          'Sub-Category': record.assetTypeName || '',
          'Authority': record.authorityName || '',
          'Organization': record.organizationName || '',
          'Department': record.departmentName || record.department || '',
          'Address': record.address || '',
          'Ward': record.wardName || '',
          'Zone': record.zoneName || '',
          'Latitude': record.latitude == null ? '' : String(record.latitude),
          'Longitude': record.longitude == null ? '' : String(record.longitude),
          'CSN': record.csn || '',
          'Purchase Date': formatDate(record.purchaseDate || undefined),
          'Purchase Value': record.purchaseValue == null ? '' : String(record.purchaseValue),
          'Market Value': record.marketValue == null ? '' : String(record.marketValue),
          'Market Value Date': formatDate(record.marketValueDate || undefined),
          'Capital Value': record.capitalValue == null ? '' : String(record.capitalValue),
          'Last CV Date': formatDate(record.lastCVCalculationDate || undefined),
          'Current Book Value': record.currentBookValue == null ? '' : String(record.currentBookValue),
          'Depreciation Rate': record.depreciationRate == null ? '' : String(record.depreciationRate),
          'Revenue Generating': formatBoolean(record.isRevenueGenerating),
          'Operational Control': record.operationalControl || '',
          'Field Values': formatFieldValue(record.fieldValues),
          'Occupancy Status': record.occupancyStatus || '',
          'Ownership Type': record.ownershipType || '',
          'Asset Condition': record.assetCondition || '',
          'Status': record.status || (record.isActive ? 'Active' : 'Inactive'),
          'Built-Up Area (Sq.M)': record.builtUpAreaSqMeter == null ? '' : String(record.builtUpAreaSqMeter),
          'Carpet Area (Sq.M)': record.carpetAreaSqMeter == null ? '' : String(record.carpetAreaSqMeter),
          'Land Area (Sq.M)': record.landAreaSqMeter == null ? '' : String(record.landAreaSqMeter),
          'Created Date': formatDate(record.createdDate || record.createdAt || undefined),
        };
      });

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(exportRows);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Asset Register');
      XLSX.writeFile(workbook, `asset-register-${categoryId}.xlsx`);
    } catch {
      // keep export failures silent for now; the page already surfaces fetch errors
    }
  };

  React.useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const columns = useMemo<Column<AssetRegisterRow>[]>(
    () => [
      { key: 'assetCode', label: 'Asset ID', width: '150px', headerClassName: 'whitespace-nowrap', cellClassName: 'whitespace-nowrap font-semibold text-slate-900', render: (value) => renderTruncatedText(typeof value === 'string' ? value : undefined) },
      {
        key: 'assetName',
        label: 'Asset Name & Description',
        width: '310px',
        headerClassName: 'whitespace-nowrap text-center',
        cellClassName: 'align-middle text-center',
        render: (_, row) => (
          <div className="flex flex-col items-center text-center">
            <span className="whitespace-normal wrap-break-word font-semibold text-slate-900" title={row.assetName}>{row.assetName}</span>
            <span className="whitespace-normal wrap-break-word text-[11px] text-slate-500" title={row.address}>{row.address}</span>
            <span className="whitespace-normal wrap-break-word text-[11px] text-slate-500" title={row.categoryName}>{row.categoryName}</span>
          </div>
        ),
      },
      { key: 'assetTypeName', label: 'Sub-Category', width: '150px', headerClassName: 'whitespace-nowrap text-center', cellClassName: 'align-middle text-center', render: (value) => renderTruncatedText(typeof value === 'string' ? value : undefined) },
      {
        key: 'address',
        label: 'Location & Ward',
        width: '240px',
        headerClassName: 'whitespace-nowrap text-center',
        cellClassName: 'align-middle text-center',
        render: (_, row) => (
          <div className="flex flex-col items-center text-center">
            <span className="whitespace-normal wrap-break-word font-semibold text-slate-900" title={row.address}>{row.address}</span>
            <span className="whitespace-normal wrap-break-word text-[11px] text-slate-500">{row.wardName !== '-' ? `Ward: ${row.wardName}` : '-'}</span>
          </div>
        ),
      },
      { key: 'purchaseDate', label: 'Acquisition Date', width: '120px', headerClassName: 'whitespace-nowrap text-center', cellClassName: 'align-middle text-center', render: (value) => formatDate(typeof value === 'string' ? value : undefined) },
      { key: 'purchaseValue', label: 'Acquisition Value', width: '140px', headerClassName: 'whitespace-nowrap text-center', cellClassName: 'align-middle text-center', render: (_, row) => formatMoney(row.purchaseValue) },
      { key: 'marketValue', label: 'Current Value', width: '130px', headerClassName: 'whitespace-nowrap text-center', cellClassName: 'align-middle text-center', render: (_, row) => formatMoney(row.marketValue) },
      { key: 'depreciation', label: 'Depreciation', width: '130px', headerClassName: 'whitespace-nowrap text-center', cellClassName: 'align-middle text-center', render: (_, row) => formatMoney(row.depreciation) },
      { key: 'netBookValue', label: 'Net Book Value', width: '140px', headerClassName: 'whitespace-nowrap text-center', cellClassName: 'align-middle text-center', render: (_, row) => formatMoney(row.netBookValue) },
      { key: 'hasLift', label: 'Lift', width: '90px', headerClassName: 'whitespace-nowrap text-center', cellClassName: 'align-middle text-center', render: (value) => renderBadge(typeof value === 'string' ? value : undefined) },
      { key: 'lifeYears', label: 'Life (Yrs)', width: '90px', headerClassName: 'whitespace-nowrap text-center', cellClassName: 'align-middle text-center', render: (value) => renderTruncatedText(typeof value === 'string' ? value : undefined) },
      { key: 'assetCondition', label: 'Condition', width: '100px', headerClassName: 'whitespace-nowrap text-center', cellClassName: 'align-middle text-center', render: (value) => renderBadge(typeof value === 'string' ? value : undefined) },
      { key: 'status', label: 'Status', width: '100px', headerClassName: 'whitespace-nowrap text-center', cellClassName: 'align-middle text-center', render: (value) => renderBadge(typeof value === 'string' ? value : undefined) },
      {
        key: 'departmentName',
        label: 'Custodian & Department',
        width: '200px',
        headerClassName: 'whitespace-nowrap text-center',
        cellClassName: 'align-middle text-center',
        render: (_, row) => (
          <div className="flex flex-col items-center text-center">
            <span className="whitespace-normal wrap-break-word font-semibold text-slate-900" title={row.departmentName}>{row.departmentName}</span>
            <span className="whitespace-normal wrap-break-word text-[11px] text-slate-500" title={row.organizationName}>{row.organizationName}</span>
          </div>
        ),
      },
      {
        key: 'fieldValues',
        label: 'Insurance Details',
        width: '180px',
        headerClassName: 'whitespace-nowrap text-center',
        cellClassName: 'align-middle text-center',
        render: (_, row) => (
          <div className="flex flex-col items-center text-center">
            <span className="whitespace-normal wrap-break-word font-semibold text-emerald-600">Insured</span>
            <span className="whitespace-normal wrap-break-word text-[11px] text-slate-500" title={row.fieldValues}>{row.fieldValues}</span>
          </div>
        ),
      },
      {
        key: 'lastCVCalculationDate',
        label: 'Maintenance Schedule',
        width: '180px',
        headerClassName: 'whitespace-nowrap text-center',
        cellClassName: 'align-middle text-center',
        render: (_, row) => (
          <div className="flex flex-col items-center text-center">
            <span className="whitespace-normal wrap-break-word font-semibold text-slate-900">Last: {formatDate(row.lastCVCalculationDate)}</span>
            <span className="whitespace-normal wrap-break-word text-[11px] text-slate-500">Next: {formatDate(row.marketValueDate)}</span>
          </div>
        ),
      },
      {
        key: 'ownershipType',
        label: 'Remarks',
        width: '150px',
        headerClassName: 'whitespace-nowrap text-center',
        cellClassName: 'align-middle text-center',
        render: (value) => renderTruncatedText(typeof value === 'string' ? value : undefined),
      },
      {
        key: 'id',
        label: 'Action',
        width: '100px',
        headerClassName: 'whitespace-nowrap text-center',
        cellClassName: 'align-middle text-center',
        render: (_, row) => (
          <div className="flex items-center justify-center gap-2">
            <Button
              type="button"
              onClick={() => {
                const segments = pathname.split('/').filter(Boolean);
                const locale = segments[0] || 'en';
                router.push(`/${locale}/asset/municipal-Asset/asset-detail/${row.id}`);
              }}
              variant="secondary"
              size="sm"
              className="h-8 w-8 px-0 text-slate-600"
              aria-label={`View ${row.assetName}`}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              onClick={() => {
                const segments = window.location.pathname.split('/').filter(Boolean);
                const locale = segments[0] || 'en';
                router.push(`/${locale}/asset/municipal-Asset/asset-report/${row.id}`);
              }}
              variant="secondary"
              size="sm"
              className="h-8 w-8 border-amber-200 bg-amber-50 px-0 text-amber-700 hover:bg-amber-100"
              aria-label={`Print report for ${row.assetName}`}
              title="Open report"
            >
              <Printer className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="h-8 w-8 border-emerald-200 bg-emerald-50 px-0 text-emerald-700 hover:bg-emerald-100 ml-1 mr-0.5"
              aria-label={`Edit ${row.assetName}`}
            >
              <PencilLine className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="min-h-[calc(100vh-120px)] bg-slate-50/80 p-2">
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
                value={search}
                onChange={setSearch}
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
                onChange={(_, value) => {
                  setAssetTypeId(value === 'all' ? 'all' : value);
                  setPage(1);
                }}
                placeholder="Asset Type"
                className="relative z-50 min-w-41.25"
              />

              <SearchSelect
                name="zone"
                label=""
                options={zoneOptions}
                value={zoneId}
                onChange={(_, value) => {
                  setZoneId(value);
                  setWardId('all');
                  setPage(1);
                }}
                placeholder="All Zones"
                className="relative z-50 min-w-41.25"
              />

              <SearchSelect
                name="ward"
                label=""
                options={wardOptions}
                value={wardId}
                onChange={(_, value) => {
                  setWardId(value);
                  setPage(1);
                }}
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

        <MasterTable
          columns={columns}
          data={assets}
          loading={loading}
          emptyText="No asset records found for this category"
          pageNumber={safePage}
          pageSize={pageSize}
          totalCount={totalCount}
          totalPages={totalPages}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
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
