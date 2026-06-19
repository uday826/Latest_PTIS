import { AssetRegisterRow } from '@/types/municipal-asset-register.types';
import type { AssetRegisterApiRecord } from '@/types/municipal-asset-service.types';

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

export function formatFieldValue(value: unknown): string {
  if (value == null || value === '') return '-';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) {
    return value.length === 0 ? '-' : value.map((entry) => formatFieldValue(entry)).join(', ');
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return '-';
    const flattened = entries
      .map(([key, entry]) => {
        const formatted = formatFieldValue(entry);
        return formatted === '-' ? null : `${key}: ${formatted}`;
      })
      .filter((entry): entry is string => Boolean(entry));
    return flattened.length > 0 ? flattened.join(', ') : '-';
  }
  try {
    return JSON.stringify(value);
  } catch {
    return '-';
  }
}

export function mapAssetToRow(item: AssetRegisterApiRecord, fallbackCategoryName: string): AssetRegisterRow {
  const record = item;
  const parsedId = Number(record.id);
  const safeId = Number.isFinite(parsedId) && parsedId > 0 ? parsedId : null;
  return {
    id: safeId,
    assetId: record.assetNo || '-',
    authorityName: record.authorityName || '-',
    organizationName: record.organizationName || '-',
    departmentName: record.departmentName || '-',
    assetCode: record.assetNo || '-',
    assetName: record.assetName || '-',
    categoryName: record.assetCategoryName || fallbackCategoryName || '-',
    assetTypeName: record.assetTypeName || '-',
    parentAssetName: record.parentAssetName || '-',
    address: record.address || '-',
    wardName: record.wardName || '-',
    zoneName: record.zoneName || '-',
    latitude: record.latitude == null ? '-' : String(record.latitude),
    longitude: record.longitude == null ? '-' : String(record.longitude),
    csn: record.csn || '-',
    hasLift: formatBoolean(record.hasLift),
    purchaseDate: record.purchaseDate || '',
    marketValueDate: record.marketValueDate || '',
    capitalValue: record.capitalValue == null ? '-' : String(record.capitalValue),
    lastCVCalculationDate: record.lastCVCalculationDate || '',
    currentBookValue: record.currentBookValue == null ? '-' : String(record.currentBookValue),
    depreciationRate: record.depreciationRate == null ? '-' : String(record.depreciationRate),
    isRevenueGenerating: formatBoolean(record.isRevenueGenerating),
    operationalControl: record.operationalControl || '-',
    fieldValues: formatFieldValue(record.fieldValues),
    occupancyStatus: record.occupancyStatus || '-',
    ownershipType: record.ownershipType || '-',
    assetCondition: record.assetCondition || '-',
    status: record.status ? record.status : (record.isActive === false ? 'Inactive' : record.isActive === true ? 'Active' : '-'),
    lifeYears: record.purchaseDate ? String(Math.max(0, new Date().getFullYear() - new Date(record.purchaseDate).getFullYear())) : '-',
    purchaseValue: record.purchaseValue == null ? '-' : String(record.purchaseValue),
    marketValue: record.marketValue == null ? '-' : String(record.marketValue),
    depreciation: record.depreciation == null ? '-' : String(record.depreciation),
    netBookValue:
      record.currentBookValue != null
        ? String(record.currentBookValue)
        : record.capitalValue != null
          ? String(record.capitalValue)
          : record.marketValue == null
            ? '-'
            : String(record.marketValue),
    builtUpAreaSqMeter: record.builtUpAreaSqMeter == null ? '-' : String(record.builtUpAreaSqMeter),
    carpetAreaSqMeter: record.carpetAreaSqMeter == null ? '-' : String(record.carpetAreaSqMeter),
    landAreaSqMeter: record.landAreaSqMeter == null ? '-' : String(record.landAreaSqMeter),
    createdDate: record.createdDate || record.updatedDate || '',
    assetCategoryId: record.assetCategoryId || null,
    assetTypeId: record.assetTypeId || null,
  };
}

