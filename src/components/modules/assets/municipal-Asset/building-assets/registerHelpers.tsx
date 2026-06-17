/* eslint-disable i18next/no-literal-string */
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Eye, PencilLine, Printer } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Badge, Button, type Column } from '@/components/common';

import { AssetRegisterRow, AssetRegisterApiRecord } from '@/types/municipal-asset/register.types';
export type { AssetRegisterRow, AssetRegisterApiRecord };

export function formatDate(value?: string) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-IN');
}

export function formatMoney(value: string) {
  if (!value || value === '-') return '-';
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return value;
  return numeric.toLocaleString('en-IN');
}

export function formatBoolean(value?: boolean | string | null) {
  if (value === true || value === 'true') return 'Yes';
  if (value === false || value === 'false') return 'No';
  return '-';
}

export function formatFieldValue(value: unknown) {
  if (value == null || value === '') return '-';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  try {
    return JSON.stringify(value);
  } catch {
    return '-';
  }
}

export function renderTruncatedText(value?: string) {
  const text = value || '-';
  return (
    <span className="block max-w-full whitespace-normal wrap-break-word leading-5" title={text}>
      {text}
    </span>
  );
}

export function renderBadge(value?: string) {
  const text = (value || '-').toLowerCase();
  const variant: 'success' | 'destructive' | 'default' | 'warning' | 'secondary' =
    text === 'active' || text === 'yes' || text === 'true'
      ? 'success'
      : text === 'inactive' || text === 'no' || text === 'false' || text === 'poor'
        ? 'destructive'
      : text === 'good' || text === 'owned'
        ? 'default'
      : text === 'fair' || text === 'leased out'
          ? 'warning'
          : 'secondary';

  return <Badge variant={variant} size="sm">{value || '-'}</Badge>;
}

export function mapAssetToRow(item: AssetRegisterApiRecord, fallbackCategoryName: string): AssetRegisterRow {
  const record = item as AssetRegisterApiRecord;
  const parsedId = Number(record.id);
  const safeId = Number.isFinite(parsedId) && parsedId > 0 ? parsedId : null;
  return {
    id: safeId,
    assetId: record.id?.toString() || record.assetNo || '-',
    authorityName: record.authorityName || '-',
    organizationName: record.organizationName || '-',
    departmentName: record.departmentName || record.department || '-',
    assetCode: record.assetNo || record.assetNo || '-',
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
    depreciation: record.depreciation == null ? '-' : String(record.depreciation),
    netBookValue:
      record.currentBookValue != null
        ? String(record.currentBookValue)
        : record.marketValue == null
          ? '-'
          : String(record.marketValue),
    builtUpAreaSqMeter: record.builtUpAreaSqMeter == null ? '-' : String(record.builtUpAreaSqMeter),
    carpetAreaSqMeter: record.carpetAreaSqMeter == null ? '-' : String(record.carpetAreaSqMeter),
    landAreaSqMeter: record.landAreaSqMeter == null ? '-' : String(record.landAreaSqMeter),
    createdDate: record.createdDate || record.createdDate || '',
    // Edit context — needed to navigate to the edit form with correct category/type
    assetCategoryId: record.assetCategoryId ?? null,
    assetTypeId: record.assetTypeId ?? null,
  };
}

export function getRegisterColumns(
  pathname: string,
  router: ReturnType<typeof useRouter>
): Column<AssetRegisterRow>[] {
  return [
    { key: 'assetCode', label: 'Asset No', width: '150px', headerClassName: 'whitespace-nowrap', cellClassName: 'whitespace-nowrap font-semibold text-slate-900', render: (value) => renderTruncatedText(typeof value === 'string' ? value : undefined) },
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
    { key: 'netBookValue', label: 'Net Book Value', width: '140px', headerClassName: 'whitespace-nowrap text-center', cellClassName: 'align-middle text-center', render: (_, row) => formatMoney(row.currentBookValue) },
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
      width: '120px',
      headerClassName: 'whitespace-nowrap text-center',
      cellClassName: 'align-middle text-center',
      render: (_, row) => (
        <div className="flex items-center justify-center gap-1.5">
          {/* View Detail */}
          <Button
            type="button"
            onClick={() => {
              if (row.id == null) return;
              const segments = pathname.split('/').filter(Boolean);
              const locale = segments[0] || 'en';
              router.push(`/${locale}/assets/municipal-Asset/asset-detail/${row.id}`);
            }}
            variant="secondary"
            size="sm"
            className="h-8 w-8 px-0 text-slate-600"
            aria-label={`View ${row.assetName}`}
            disabled={row.id == null}
            title="View details"
          >
            <Eye className="h-4 w-4" />
          </Button>

          {/* Print Report */}
          <Button
            type="button"
            onClick={() => {
              if (row.id == null) return;
              const segments = window.location.pathname.split('/').filter(Boolean);
              const locale = segments[0] || 'en';
              router.push(`/${locale}/assets/municipal-Asset/asset-report/${row.id}`);
            }}
            variant="secondary"
            size="sm"
            className="h-8 w-8 border-amber-200 bg-amber-50 px-0 text-amber-700 hover:bg-amber-100"
            aria-label={`Print report for ${row.assetName}`}
            title="Open report"
            disabled={row.id == null}
          >
            <Printer className="h-4 w-4" />
          </Button>

          {/* Edit Asset */}
          <Button
            type="button"
            onClick={() => {
              const segments = window.location.pathname.split('/').filter(Boolean);
              const locale = segments[0] || 'en';
              // Build query params so the existing multi-step form can
              // auto-fetch & prefill the asset data via its draft-recovery logic
              const categoryId = row.assetCategoryId ?? 1;
              const typeId = row.assetTypeId ?? 1;
              const params = new URLSearchParams({
                assetId: String(row.id),
                id: String(row.id),
                categoryId: String(categoryId),
                typeId: String(typeId),
                category: row.categoryName !== '-' ? row.categoryName : '',
                assetType: row.assetTypeName !== '-' ? row.assetTypeName : '',
                assetCode: row.assetCode !== '-' ? row.assetCode : '',
                mode: 'edit',
              });
              router.push(`/${locale}/assets/municipal-Asset/add-New-Asset/basic-Info?${params.toString()}`);
            }}
            variant="secondary"
            size="sm"
            className="h-8 w-8 border-emerald-200 bg-emerald-50 px-0 text-emerald-700 hover:bg-emerald-100"
            aria-label={`Edit ${row.assetName}`}
            disabled={row.id == null}
            title="Edit asset"
          >
            <PencilLine className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];
}

export async function exportToExcel(
  items: AssetRegisterApiRecord[],
  categoryId: number,
  categoryName: string
) {
  const exportRows = items.map((record) => {
    return {
      'Asset No': record.assetNo || record.assetNo || '',
      'Asset Name': record.assetName || record.name || '',
      'Category': record.categoryName || categoryName || '',
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
      'Created Date': formatDate(record.createdDate || record.createdDate || undefined),
    };
  });

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(exportRows);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Asset Register');
  XLSX.writeFile(workbook, `asset-register-${categoryId}.xlsx`);
}







