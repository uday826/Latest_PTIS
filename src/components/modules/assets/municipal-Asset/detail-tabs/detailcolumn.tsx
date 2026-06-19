'use client';


import { Badge, type Column } from '@/components/common';
import type {
  AssetChildAssetItem,
  AssetFloorDetailItem
} from '@/types/municipal-asset/detail-tabs.types';
import type {
  InventoryBatchDetail,
  InventoryUnitResponse
} from '@/types/municipal-asset/furniture-fixtures.types';

// Helpers
export function blank(value?: string | number | null) {
  return value === null || value === undefined || value === '' ? '-' : String(value);
}

export function boolToYesNo(value?: boolean | null, t?: any) {
  if (value === true) return t ? t('subUnitsTab.yes') : 'Yes';
  if (value === false) return t ? t('subUnitsTab.no') : 'No';
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

export function getFloorDetailsColumns(t: any): Column<FloorTableRow>[] {
  return [
    {
      key: 'floorName',
      label: t('floorTab.cols.floorName'),
      width: '180px',
      align: 'center',
      render: (_value, row) => blank(row.floorName || `${t('floorTab.cols.floorName')} ${row.floorId || row.id}`),
    },
    {
      key: 'constructionTypeName',
      label: t('floorTab.cols.constructionType'),
      width: '170px',
      align: 'center',
      render: (value) => blank(value as string | null | undefined),
    },
    {
      key: 'typeOfUseName',
      label: t('floorTab.cols.useType'),
      width: '140px',
      align: 'center',
      render: (value) => blank(value as string | null | undefined),
    },
    {
      key: 'constructionYear',
      label: t('floorTab.cols.year'),
      width: '90px',
      align: 'center',
      render: (value) => blank(value as string | number | null | undefined),
    },
    {
      key: 'carpetAreaSqMeter',
      label: t('floorTab.cols.carpetArea'),
      width: '140px',
      align: 'center',
      render: (_value, row) => areaText(row).carpet,
    },
  ];
}

// ─── FurnitureFixturesTab Columns ─────────────────────────────────────────────
type InventoryRow = Record<string, unknown> & InventoryBatchDetail;
type InventoryUnitRow = Record<string, unknown> & InventoryUnitResponse;

export function getInventoryBatchColumns(t: any): Column<InventoryRow>[] {
  return [
    { key: 'inventoryType', label: t('furnitureTab.cols.inventoryType'), align: 'center' },
    { key: 'itemName', label: t('furnitureTab.cols.itemName'), align: 'center' },
    { key: 'modelBrand', label: t('furnitureTab.cols.modelBrand'), align: 'center' },
    {
      key: 'quantity',
      label: t('furnitureTab.cols.qty'),
      align: 'center',
      render: (value: unknown) => <span className="font-semibold">{blank(value as string | number | null)}</span>,
    },
    {
      key: 'condition',
      label: t('furnitureTab.cols.condition'),
      align: 'center',
      render: (value: unknown) => (
        <Badge variant="secondary" size="sm" className="border-emerald-200 bg-emerald-50 text-emerald-700">
          {blank(value as string | number | null)}
        </Badge>
      ),
    },
    { key: 'unitValue', label: t('furnitureTab.cols.unitValue'), align: 'center', render: (value: unknown) => formatMoney(Number((value as number) ?? 0)) },
    { key: 'totalBatchValue', label: t('furnitureTab.cols.purchaseValue'), align: 'center', render: (value: unknown) => formatMoney(Number((value as number) ?? 0)) },
    { key: 'totalBatchCV', label: t('furnitureTab.cols.capitalValue'), align: 'center', render: (value: unknown) => formatMoney(Number((value as number) ?? 0)) },
  ];
}

export function getInventoryUnitColumns(t: any): Column<InventoryUnitRow>[] {
  return [
    { key: 'assetNo', label: t('furnitureTab.cols.assetNo'), width: '200px', cellClassName: 'font-semibold text-blue-600' },
    { key: 'assetName', label: t('furnitureTab.cols.assetName'), width: '360px' },
    { key: 'unitNumber', label: t('furnitureTab.cols.unitHash'), width: '100px' },
    {
      key: 'condition',
      label: t('furnitureTab.cols.condition'),
      width: '140px',
      render: (value: unknown) => (
        <Badge variant="secondary" size="sm" className="border-emerald-200 bg-emerald-50 text-emerald-700">
          {blank(value as string | number | null)}
        </Badge>
      ),
    },
    {
      key: 'unitPurchaseValue',
      label: t('furnitureTab.cols.purchaseValue'),
      width: '160px',
      render: (value: unknown) => <span className="font-medium text-slate-700">{formatMoney(Number((value as number) ?? 0))}</span>,
    },
    {
      key: 'unitCapitalValue',
      label: t('furnitureTab.cols.capitalValue'),
      width: '160px',
      render: (value: unknown) => <span className="font-semibold text-emerald-700">{formatMoney(Number((value as number) ?? 0))}</span>,
    },
  ];
}

// ─── SubUnitsTab Columns ──────────────────────────────────────────────────────
type SubUnitRow = AssetChildAssetItem & Record<string, unknown>;

export function getSubUnitMainColumns(t: any): Column<SubUnitRow>[] {
  return [
    { key: 'assetNo', label: t('subUnitsTab.cols.assetNo'), width: '130px', render: (v) => <span className="font-semibold text-blue-700">{blank(v as string | null)}</span> },
    { key: 'assetName', label: t('subUnitsTab.cols.assetName'), width: '200px', render: (v) => blank(v as string | null) },
    { key: 'assetCategoryName', label: t('subUnitsTab.cols.category'), width: '140px', render: (v) => blank(v as string | null) },
    { key: 'assetTypeName', label: t('subUnitsTab.cols.type'), width: '160px', render: (v) => blank(v as string | null) },
    { key: 'occupancyStatus', label: t('subUnitsTab.cols.occupancy'), width: '110px', render: (v) => blank(v as string | null) },
    { key: 'typeOfUseName', label: t('subUnitsTab.cols.useType'), width: '130px', render: (v) => blank(v as string | null) },
    { key: 'subTypeOfUseName', label: t('subUnitsTab.cols.subUseType'), width: '140px', render: (v) => blank(v as string | null) },
    { key: 'builtUpAreaSqMeter', label: t('subUnitsTab.cols.builtUp'), width: '130px', render: (v) => formatArea(v as string | number | null) },
    { key: 'carpetAreaSqMeter', label: t('subUnitsTab.cols.carpet'), width: '120px', render: (v) => formatArea(v as string | number | null) },
    { key: 'zoneName', label: t('subUnitsTab.cols.zone'), width: '110px', render: (v) => blank(v as string | null) },
    { key: 'wardName', label: t('subUnitsTab.cols.ward'), width: '90px', render: (v) => blank(v as string | null) },
    { key: 'moujaName', label: t('subUnitsTab.cols.mouja'), width: '110px', render: (v) => blank(v as string | null) },
  ];
}

export function getSubUnitRenterColumns(t: any): Column<Record<string, unknown>>[] {
  return [
    { key: 'renterName', label: t('subUnitsTab.cols.renterName'), width: '180px', render: (v) => <span className="font-semibold text-slate-900">{blank(v as string | null)}</span> },
    { key: 'leaseRentType', label: t('subUnitsTab.cols.leaseType'), width: '120px', render: (v) => blank(v as string | null) },
    { key: 'mobileNo', label: t('subUnitsTab.cols.mobile'), width: '120px', render: (v) => blank(v as string | null) },
    { key: 'emailId', label: t('subUnitsTab.cols.email'), width: '180px', render: (v) => blank(v as string | null) },
    { key: 'rentAmount', label: t('subUnitsTab.cols.rent'), width: '110px', align: 'center', render: (v) => formatNumber(v as string | number | null) },
    { key: 'securityDeposit', label: t('subUnitsTab.cols.deposit'), width: '120px', align: 'center', cellClassName: 'font-semibold text-emerald-700', render: (v) => formatNumber(v as string | number | null) },
  ];
}

export function getSubUnitRoomColumns(t: any): Column<Record<string, unknown>>[] {
  return [
    { key: 'roomNo', label: t('subUnitsTab.cols.roomNo'), width: '110px', render: (v) => <span className="font-semibold text-slate-900">{blank(v as string | null)}</span> },
    { key: 'roomType', label: t('subUnitsTab.cols.roomType'), width: '140px', render: (v) => blank(v as string | null) },
    { key: 'shape', label: t('subUnitsTab.cols.shape'), width: '110px', render: (v) => blank(v as string | null) },
    { key: 'submissionType', label: t('subUnitsTab.cols.submissionType'), width: '160px', render: (v) => blank(v as string | null) },
    { key: 'lengthMtr', label: t('subUnitsTab.cols.length'), width: '80px', align: 'center', render: (v) => blank(v as string | number | null) },
    { key: 'widthMtr', label: t('subUnitsTab.cols.width'), width: '80px', align: 'center', render: (v) => blank(v as string | number | null) },
    { key: 'heightMtr', label: t('subUnitsTab.cols.height'), width: '80px', align: 'center', render: (v) => blank(v as string | number | null) },
    { key: 'outerYesNo', label: t('subUnitsTab.cols.outer'), width: '90px', align: 'center', render: (v) => boolToYesNo(v as boolean | null, t) },
    { key: 'minusYesNo', label: t('subUnitsTab.cols.minus'), width: '90px', align: 'center', render: (v) => boolToYesNo(v as boolean | null, t) },
  ];
}

export function getSubUnitFloorColumns(t: any): Column<Record<string, unknown>>[] {
  return [
    { key: 'floorName', label: t('subUnitsTab.cols.floor'), width: '120px', render: (v) => <span className="font-semibold text-slate-900">{blank(v as string | null)}</span> },
    { key: 'constructionYear', label: t('subUnitsTab.cols.constructionYear'), width: '150px', render: (v) => blank(v as string | null) },
    { key: 'constructionTypeName', label: t('subUnitsTab.cols.constructionType'), width: '160px', render: (v) => blank(v as string | null) },
    { key: 'typeOfUseName', label: t('subUnitsTab.cols.useType'), width: '140px', render: (v) => blank(v as string | null) },
    { key: 'carpetAreaSqMeter', label: t('subUnitsTab.cols.carpet'), width: '110px', align: 'center', render: (v) => formatArea(v as string | number | null) },
    { key: 'builtUpAreaSqMeter', label: t('subUnitsTab.cols.builtUp'), width: '110px', align: 'center', render: (v) => formatArea(v as string | number | null) },
    { key: 'capitalValue', label: t('subUnitsTab.cols.capitalValue'), width: '130px', align: 'center', render: (v) => formatNumber(v as string | number | null) },
  ];
}

export function getSubUnitDetailColumns(t: any): Column<Record<string, unknown>>[] {
  return [
    { key: 'assetNo', label: t('subUnitsTab.cols.assetNo'), width: '130px', render: (v) => <span className="font-semibold text-blue-700">{blank(v as string | null)}</span> },
    { key: 'assetName', label: t('subUnitsTab.cols.assetName'), width: '200px', render: (v) => blank(v as string | null) },
    { key: 'assetCategoryName', label: t('subUnitsTab.cols.category'), width: '140px', render: (v) => blank(v as string | null) },
    { key: 'assetTypeName', label: t('subUnitsTab.cols.type'), width: '160px', render: (v) => blank(v as string | null) },
    { key: 'occupancyStatus', label: t('subUnitsTab.cols.occupancy'), width: '110px', render: (v) => blank(v as string | null) },
    { key: 'typeOfUseName', label: t('subUnitsTab.cols.useType'), width: '130px', render: (v) => blank(v as string | null) },
    { key: 'subTypeOfUseName', label: t('subUnitsTab.cols.subUseType'), width: '140px', render: (v) => blank(v as string | null) },
    { key: 'builtUpAreaSqMeter', label: t('subUnitsTab.cols.builtUp'), width: '130px', render: (v) => formatArea(v as string | number | null) },
    { key: 'carpetAreaSqMeter', label: t('subUnitsTab.cols.carpet'), width: '120px', render: (v) => formatArea(v as string | number | null) },
    { key: 'zoneName', label: t('subUnitsTab.cols.zone'), width: '110px', render: (v) => blank(v as string | null) },
    { key: 'wardName', label: t('subUnitsTab.cols.ward'), width: '90px', render: (v) => blank(v as string | null) },
    { key: 'moujaName', label: t('subUnitsTab.cols.mouja'), width: '110px', render: (v) => blank(v as string | null) },
  ];
}
