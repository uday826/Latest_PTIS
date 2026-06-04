export type ApiRecord = Record<string, unknown>;

export function formatText(value: unknown): string {
  return value === null || value === undefined || value === '' ? '-' : String(value);
}

export function toMarathiDigits(value: unknown): string {
  const digits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return String(value ?? '-').replace(/\d/g, (d) => digits[Number(d)]);
}

export function formatCurrencyINR(value: unknown): string {
  if (value === null || value === undefined || value === '') return '-';
  const num = Number(value);
  if (Number.isNaN(num)) return formatText(value);
  return toMarathiDigits(new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(num));
}

export function getField(record: ApiRecord, keys: string[]): unknown {
  for (const key of keys) {
    if (record[key] !== undefined && record[key] !== null && record[key] !== '') return record[key];
  }
  return undefined;
}

export function pickText(record: ApiRecord, keys: string[]): string {
  return formatText(getField(record, keys));
}

export function getFirstImage(record: ApiRecord, key: string): string | null {
  const value = record[key];
  if (!Array.isArray(value) || value.length === 0) return null;
  const first = value[0] as ApiRecord;
  return typeof first.url === 'string' ? first.url : typeof first.image === 'string' ? first.image : null;
}

function normalizeText(value: unknown): string {
  return String(value ?? '').trim().toLowerCase();
}

export function inferAssetCategory(record: ApiRecord): 'building' | 'land' | 'movable' | 'other' {
  const categoryId = Number(getField(record, ['assetCategoryId', 'categoryId']) ?? NaN);
  if (categoryId === 1) return 'building';
  if (categoryId === 2) return 'land';
  if (categoryId === 3) return 'movable';

  const hint = [
    record.assetCategoryName,
    record.categoryName,
    record.assetTypeName,
    record.assetType,
    record.assetName,
    record.name,
  ].map(normalizeText).join(' ');

  if (/(building|office|hospital|school|facility|property)/.test(hint)) return 'building';
  if (/(land|plot|open|vacant|encroach)/.test(hint)) return 'land';
  if (/(vehicle|bus|truck|car|furniture|equipment|machinery|it)/.test(hint)) return 'movable';

  return 'other';
}

export function formatBooleanMarathi(value: unknown): string {
  if (value === true) return 'होय';
  if (value === false) return 'नाही';
  return '-';
}

export function formatDateMarathi(value: unknown): string {
  if (!value) return '-';
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return '-';

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear());

  return `${toMarathiDigits(day)}-${toMarathiDigits(month)}-${toMarathiDigits(year)}`;
}

export function firstAvailable(...values: unknown[]): unknown {
  for (const value of values) {
    if (value !== null && value !== undefined && value !== '') return value;
  }
  return undefined;
}
