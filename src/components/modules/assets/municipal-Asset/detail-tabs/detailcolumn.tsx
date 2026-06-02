'use client';

import React from 'react';
import { Badge, type Column } from '@/components/common';
import type { 
  AssetFloorDetailItem, 
  AssetChildAssetItem 
} from '@/types/municipal-asset/detail-tabs.types';
import type { 
  InventoryBatchDetail, 
  InventoryUnitResponse 
} from '@/types/municipal-asset/furniture-fixtures.types';

// Helpers
export function blank(value?: string | number | null) {
  return value === null || value === undefined || value === '' ? '-' : String(value);
}

export function boolToYesNo(value?: boolean | null) {
  if (value === true) return 'Yes';
  if (value === false) return 'No';
  return '-';
}

export function formatArea(value?: string | number | null) {
  if (value === null || value === undefined || value === '') return '-';
  const parsed = typeof value === 'number' ? value : Number(value);
  if (Number.isNaN(parsed)) return String(value);
  return `${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(parsed)} sq.m`;
}

export function formatNumber(value?: string | number | null) {
  if (value === null || value === undefined || value === '') return '-';
  const parsed = typeof value === 'number' ? value : Number(value);
  if (Number.isNaN(parsed)) return String(value);
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(parsed);
}

export function formatMoney(value?: number | null): string {
  if (value === null || value === undefined) return '-';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
}

export function formatDate(value?: string | null) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function formatCurrency(value?: string | number | null) {
  if (value === null || value === undefined || value === '') return '-';
  const parsed = typeof value === 'number' ? value : Number(value);
  if (Number.isNaN(parsed)) return String(value);
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(parsed);
}

function areaText(floor: AssetFloorDetailItem) {
  const builtUp = floor.builtUpAreaSqMeter ?? floor.builtUpAreaSqFeet;
  const carpet = floor.carpetAreaSqMeter ?? floor.carpetAreaSqFeet;
  return {
    builtUp: formatNumber(builtUp),
    carpet: formatNumber(carpet),
  };
}

// ─── FloorDetailsTab Columns ──────────────────────────────────────────────────
type FloorTableRow = AssetFloorDetailItem & Record<string, unknown>;

export function getFloorDetailsColumns(): Column<FloorTableRow>[] {
  return [
    {
      key: 'floorName',
      label: 'Floor',
      width: '180px',
      render: (_value, row) => blank(row.floorName || `Floor ${row.floorId || row.id}`),
    },
    {
      key: 'constructionTypeName',
      label: 'Construction Type',
      width: '170px',
      render: (value) => blank(value as string | null | undefined),
    },
    {
      key: 'typeOfUseName',
      label: 'Use Type',
      width: '140px',
      render: (value) => blank(value as string | null | undefined),
    },
    {
      key: 'constructionYear',
      label: 'Year',
      width: '90px',
      render: (value) => blank(value as string | number | null | undefined),
    },
    {
      key: 'builtUpAreaSqMeter',
      label: 'Built-up Area',
      width: '140px',
      render: (_value, row) => areaText(row).builtUp,
    },
    {
      key: 'carpetAreaSqMeter',
      label: 'Carpet Area',
      width: '140px',
      render: (_value, row) => areaText(row).carpet,
    },
    {
      key: 'noOfRooms',
      label: 'Rooms',
      width: '90px',
      render: (value) => blank(value as string | number | null | undefined),
    },
    {
      key: 'baseValue',
      label: 'Base Value',
      width: '130px',
      render: (value) => formatCurrency(value as string | number | null | undefined),
    },
    {
      key: 'capitalValue',
      label: 'Capital Value',
      width: '130px',
      render: (value) => formatCurrency(value as string | number | null | undefined),
    },
    {
      key: 'marketValue',
      label: 'Market Value',
      width: '130px',
      render: (value) => formatCurrency(value as string | number | null | undefined),
    },
  ];
}

// ─── FurnitureFixturesTab Columns ─────────────────────────────────────────────
type InventoryRow = Record<string, unknown> & InventoryBatchDetail;
type InventoryUnitRow = Record<string, unknown> & InventoryUnitResponse;

export function getInventoryBatchColumns(): Column<InventoryRow>[] {
  return [
    { key: 'batchId', label: 'Batch ID', width: '110px' },
    { key: 'inventoryType', label: 'Inventory Type', width: '160px' },
    { key: 'itemName', label: 'Item Name', width: '180px' },
    { key: 'modelBrand', label: 'Model / Brand', width: '190px' },
    {
      key: 'quantity',
      label: 'Qty',
      width: '90px',
      render: (value: unknown) => <span className="font-semibold">{blank(value as string | number | null)}</span>,
    },
    {
      key: 'condition',
      label: 'Condition',
      width: '140px',
      render: (value: unknown) => (
        <Badge variant="secondary" size="sm" className="border-emerald-200 bg-emerald-50 text-emerald-700">
          {blank(value as string | number | null)}
        </Badge>
      ),
    },
    { key: 'unitValue', label: 'Unit Value', width: '120px', render: (value: unknown) => formatMoney(Number((value as number) ?? 0)) },
    { key: 'totalBatchValue', label: 'Purchase Value', width: '140px', render: (value: unknown) => formatMoney(Number((value as number) ?? 0)) },
    { key: 'totalBatchCV', label: 'Capital Value', width: '140px', render: (value: unknown) => formatMoney(Number((value as number) ?? 0)) },
  ];
}

export function getInventoryUnitColumns(): Column<InventoryUnitRow>[] {
  return [
    { key: 'assetNo', label: 'Asset No', width: '200px', cellClassName: 'font-semibold text-blue-600' },
    { key: 'assetName', label: 'Asset Name', width: '360px' },
    { key: 'unitNumber', label: 'Unit #', width: '100px' },
    {
      key: 'condition',
      label: 'Condition',
      width: '140px',
      render: (value: unknown) => (
        <Badge variant="secondary" size="sm" className="border-emerald-200 bg-emerald-50 text-emerald-700">
          {blank(value as string | number | null)}
        </Badge>
      ),
    },
    {
      key: 'unitPurchaseValue',
      label: 'Purchase Value',
      width: '160px',
      render: (value: unknown) => <span className="font-medium text-slate-700">{formatMoney(Number((value as number) ?? 0))}</span>,
    },
    {
      key: 'unitCapitalValue',
      label: 'Capital Value',
      width: '160px',
      render: (value: unknown) => <span className="font-semibold text-emerald-700">{formatMoney(Number((value as number) ?? 0))}</span>,
    },
  ];
}

// ─── SubUnitsTab Columns ──────────────────────────────────────────────────────
type SubUnitRow = AssetChildAssetItem & Record<string, unknown>;

export function getSubUnitMainColumns(): Column<SubUnitRow>[] {
  return [
    { key: 'id', label: 'ID', width: '70px', render: (v) => blank(v as string | number | null) },
    { key: 'assetNo', label: 'Asset No', width: '130px', render: (v) => <span className="font-semibold text-blue-700">{blank(v as string | null)}</span> },
    { key: 'assetName', label: 'Asset Name', width: '200px', render: (v) => blank(v as string | null) },
    { key: 'assetCategoryName', label: 'Category', width: '140px', render: (v) => blank(v as string | null) },
    { key: 'assetTypeName', label: 'Type', width: '160px', render: (v) => blank(v as string | null) },
    { key: 'parentAssetId', label: 'Parent ID', width: '100px', render: (v) => blank(v as string | number | null) },
    { key: 'floorDetailsId', label: 'Floor ID', width: '90px', render: (v) => blank(v as string | number | null) },
    { key: 'status', label: 'Status', width: '100px', render: (v) => blank(v as string | null) },
    { key: 'occupancyStatus', label: 'Occupancy', width: '110px', render: (v) => blank(v as string | null) },
    { key: 'typeOfUseName', label: 'Use Type', width: '130px', render: (v) => blank(v as string | null) },
    { key: 'subTypeOfUseName', label: 'Sub Use Type', width: '140px', render: (v) => blank(v as string | null) },
    { key: 'builtUpAreaSqMeter', label: 'Built-up (sq.m)', width: '130px', render: (v) => formatArea(v as string | number | null) },
    { key: 'carpetAreaSqMeter', label: 'Carpet (sq.m)', width: '120px', render: (v) => formatArea(v as string | number | null) },
    { key: 'purchaseValue', label: 'Purchase Value', width: '130px', render: (v) => formatNumber(v as string | number | null) },
    { key: 'capitalValue', label: 'Capital Value', width: '120px', render: (v) => formatNumber(v as string | number | null) },
    { key: 'currentBookValue', label: 'Book Value', width: '110px', render: (v) => formatNumber(v as string | number | null) },
    { key: 'depreciationRate', label: 'Depreciation', width: '110px', render: (v) => formatNumber(v as string | number | null) },
    { key: 'zoneName', label: 'Zone', width: '110px', render: (v) => blank(v as string | null) },
    { key: 'wardName', label: 'Ward', width: '90px', render: (v) => blank(v as string | null) },
    { key: 'moujaName', label: 'Mouja', width: '110px', render: (v) => blank(v as string | null) },
    { key: 'purchaseDate', label: 'Purchase Date', width: '130px', render: (v) => formatDate(v as string | null) },
    { key: 'lastCVCalculationDate', label: 'Last CV Date', width: '130px', render: (v) => formatDate(v as string | null) },
    { key: 'createdDate', label: 'Created Date', width: '130px', render: (v) => formatDate(v as string | null) },
    { key: 'updatedDate', label: 'Updated Date', width: '130px', render: (v) => formatDate(v as string | null) },
  ];
}

export function getSubUnitRenterColumns(): Column<Record<string, unknown>>[] {
  return [
    { key: 'renterName', label: 'Renter Name', width: '180px', render: (v) => <span className="font-semibold text-slate-900">{blank(v as string | null)}</span> },
    { key: 'leaseRentType', label: 'Lease Type', width: '120px', render: (v) => blank(v as string | null) },
    { key: 'mobileNo', label: 'Mobile', width: '120px', render: (v) => blank(v as string | null) },
    { key: 'emailId', label: 'Email', width: '180px', render: (v) => blank(v as string | null) },
    { key: 'agreementId', label: 'Agreement', width: '120px', render: (v) => blank(v as string | null) },
    { key: 'rentAmount', label: 'Rent', width: '110px', cellClassName: 'text-right', render: (v) => formatNumber(v as string | number | null) },
    { key: 'securityDeposit', label: 'Deposit', width: '120px', cellClassName: 'text-right font-semibold text-emerald-700', render: (v) => formatNumber(v as string | number | null) },
  ];
}

export function getSubUnitRoomColumns(): Column<Record<string, unknown>>[] {
  return [
    { key: 'roomNo', label: 'Room No', width: '110px', render: (v) => <span className="font-semibold text-slate-900">{blank(v as string | null)}</span> },
    { key: 'roomType', label: 'Room Type', width: '140px', render: (v) => blank(v as string | null) },
    { key: 'shape', label: 'Shape', width: '110px', render: (v) => blank(v as string | null) },
    { key: 'submissionType', label: 'Submission Type', width: '160px', render: (v) => blank(v as string | null) },
    { key: 'lengthMtr', label: 'L', width: '80px', cellClassName: 'text-right', render: (v) => blank(v as string | number | null) },
    { key: 'widthMtr', label: 'W', width: '80px', cellClassName: 'text-right', render: (v) => blank(v as string | number | null) },
    { key: 'heightMtr', label: 'H', width: '80px', cellClassName: 'text-right', render: (v) => blank(v as string | number | null) },
    { key: 'outerYesNo', label: 'Outer', width: '90px', render: (v) => boolToYesNo(v as boolean | null) },
    { key: 'minusYesNo', label: 'Minus', width: '90px', render: (v) => boolToYesNo(v as boolean | null) },
  ];
}

export function getSubUnitFloorColumns(): Column<Record<string, unknown>>[] {
  return [
    { key: 'floorName', label: 'Floor', width: '120px', render: (v) => <span className="font-semibold text-slate-900">{blank(v as string | null)}</span> },
    { key: 'constructionYear', label: 'Construction Year', width: '150px', render: (v) => blank(v as string | null) },
    { key: 'constructionTypeName', label: 'Construction Type', width: '160px', render: (v) => blank(v as string | null) },
    { key: 'typeOfUseName', label: 'Use Type', width: '140px', render: (v) => blank(v as string | null) },
    { key: 'carpetAreaSqMeter', label: 'Carpet', width: '110px', cellClassName: 'text-right', render: (v) => formatArea(v as string | number | null) },
    { key: 'builtUpAreaSqMeter', label: 'Built-up', width: '110px', cellClassName: 'text-right', render: (v) => formatArea(v as string | number | null) },
    { key: 'noOfRooms', label: 'Rooms', width: '100px', cellClassName: 'text-right', render: (v) => blank(v as string | number | null) },
    { key: 'capitalValue', label: 'Capital Value', width: '130px', cellClassName: 'text-right', render: (v) => formatNumber(v as string | number | null) },
    { key: 'marketValue', label: 'Market Value', width: '130px', cellClassName: 'text-right', render: (v) => formatNumber(v as string | number | null) },
  ];
}

export function getSubUnitDetailColumns(): Column<Record<string, unknown>>[] {
  return [
    { key: 'id', label: 'ID', width: '70px', render: (v) => blank(v as string | number | null) },
    { key: 'assetNo', label: 'Asset No', width: '130px', render: (v) => <span className="font-semibold text-blue-700">{blank(v as string | null)}</span> },
    { key: 'assetName', label: 'Asset Name', width: '200px', render: (v) => blank(v as string | null) },
    { key: 'assetCategoryName', label: 'Category', width: '140px', render: (v) => blank(v as string | null) },
    { key: 'assetTypeName', label: 'Type', width: '160px', render: (v) => blank(v as string | null) },
    { key: 'parentAssetId', label: 'Parent ID', width: '100px', render: (v) => blank(v as string | number | null) },
    { key: 'floorDetailsId', label: 'Floor ID', width: '90px', render: (v) => blank(v as string | number | null) },
    { key: 'status', label: 'Status', width: '100px', render: (v) => blank(v as string | null) },
    { key: 'occupancyStatus', label: 'Occupancy', width: '110px', render: (v) => blank(v as string | null) },
    { key: 'typeOfUseName', label: 'Use Type', width: '130px', render: (v) => blank(v as string | null) },
    { key: 'subTypeOfUseName', label: 'Sub Use Type', width: '140px', render: (v) => blank(v as string | null) },
    { key: 'builtUpAreaSqMeter', label: 'Built-up (sq.m)', width: '130px', render: (v) => formatArea(v as string | number | null) },
    { key: 'carpetAreaSqMeter', label: 'Carpet (sq.m)', width: '120px', render: (v) => formatArea(v as string | number | null) },
    { key: 'purchaseValue', label: 'Purchase Value', width: '130px', render: (v) => formatNumber(v as string | number | null) },
    { key: 'capitalValue', label: 'Capital Value', width: '120px', render: (v) => formatNumber(v as string | number | null) },
    { key: 'currentBookValue', label: 'Book Value', width: '110px', render: (v) => formatNumber(v as string | number | null) },
    { key: 'depreciationRate', label: 'Depreciation', width: '110px', render: (v) => formatNumber(v as string | number | null) },
    { key: 'zoneName', label: 'Zone', width: '110px', render: (v) => blank(v as string | null) },
    { key: 'wardName', label: 'Ward', width: '90px', render: (v) => blank(v as string | null) },
    { key: 'moujaName', label: 'Mouja', width: '110px', render: (v) => blank(v as string | null) },
    { key: 'purchaseDate', label: 'Purchase Date', width: '130px', render: (v) => formatDate(v as string | null) },
    { key: 'createdDate', label: 'Created Date', width: '130px', render: (v) => formatDate(v as string | null) },
    { key: 'updatedDate', label: 'Updated Date', width: '130px', render: (v) => formatDate(v as string | null) },
  ];
}
