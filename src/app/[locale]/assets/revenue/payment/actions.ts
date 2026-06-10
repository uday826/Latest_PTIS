'use server';

import {
  getAssetLeaseRentDetailsList,
  type AssetLeaseRentDetailsListItem,
} from '@/lib/api/asset/asset-lease-rent-details.service';
import { categoryTypeService } from '@/lib/api/asset/category-type.service';
import { wardService } from '@/lib/api/asset/ward.service';
import { zoneService } from '@/lib/api/asset/zone.service';

const PAYMENT_WORKFLOW_STATUS = 'Approved';

function normalizeStatus(status: string): string {
  const value = status.trim().toLowerCase();
  if (value === 'paid') return 'Paid';
  if (value === 'unpaid') return 'Unpaid';
  return status;
}

function normalizeOptionText(value: string | null | undefined): string {
  return value?.trim() ?? '';
}

function buildZoneOptionLabel(zone: Record<string, unknown>): string {
  const zoneNo = normalizeOptionText(
    typeof zone.zoneNo === 'string'
      ? zone.zoneNo
      : typeof zone.ZoneNo === 'string'
        ? zone.ZoneNo
        : typeof zone.zone === 'string'
          ? zone.zone
        : typeof zone.zoneName === 'string'
          ? zone.zoneName
          : typeof zone.ZoneName === 'string'
            ? zone.ZoneName
            : ''
  );
  const description = normalizeOptionText(
    typeof zone.description === 'string' ? zone.description : ''
  );

  if (zoneNo && description) return `${zoneNo} : ${description}`;
  return description || zoneNo || String(zone.id ?? '');
}

function buildWardOptionLabel(ward: Record<string, unknown>): string {
  const wardNo = normalizeOptionText(
    typeof ward.wardNo === 'string'
      ? ward.wardNo
      : typeof ward.WardNo === 'string'
        ? ward.WardNo
        : typeof ward.wardName === 'string'
          ? ward.wardName
          : typeof ward.WardName === 'string'
            ? ward.WardName
            : typeof ward.name === 'string'
              ? ward.name
              : typeof ward.Name === 'string'
                ? ward.Name
                : ''
  );
  const description = normalizeOptionText(
    typeof ward.description === 'string' ? ward.description : ''
  );

  if (wardNo && description && wardNo !== description) return `${wardNo} : ${description}`;
  return description || wardNo || String(ward.id ?? '');
}

function buildZoneOptionValue(zone: Record<string, unknown>): string {
  const id = zone.id;
  if (typeof id === 'number' || typeof id === 'string') return String(id);

  const zoneNo = normalizeOptionText(
    typeof zone.zoneNo === 'string'
      ? zone.zoneNo
      : typeof zone.ZoneNo === 'string'
        ? zone.ZoneNo
        : ''
  );

  return zoneNo || buildZoneOptionLabel(zone);
}

function buildWardOptionValue(ward: Record<string, unknown>): string {
  const id = ward.id;
  if (typeof id === 'number' || typeof id === 'string') return String(id);

  const wardNo = normalizeOptionText(
    typeof ward.wardNo === 'string'
      ? ward.wardNo
      : typeof ward.WardNo === 'string'
        ? ward.WardNo
        : ''
  );

  return wardNo || buildWardOptionLabel(ward);
}

function dedupeOptions(options: Array<{ label: string; value: string }>) {
  const seen = new Set<string>();
  return options.filter((option) => {
    if (!option.label || seen.has(option.value)) return false;
    seen.add(option.value);
    return true;
  });
}

function sortBySequenceThenId<T extends { sequenceNo?: unknown; id?: unknown }>(items: T[]): T[] {
  return [...items].sort((left, right) => {
    const leftSequence = Number(left.sequenceNo ?? Number.MAX_SAFE_INTEGER);
    const rightSequence = Number(right.sequenceNo ?? Number.MAX_SAFE_INTEGER);

    if (leftSequence !== rightSequence) return leftSequence - rightSequence;

    const leftId = Number(left.id ?? Number.MAX_SAFE_INTEGER);
    const rightId = Number(right.id ?? Number.MAX_SAFE_INTEGER);
    return leftId - rightId;
  });
}

function normalizeLeaseType(item: AssetLeaseRentDetailsListItem): string {
  return normalizeOptionText(item.leaseType) || normalizeOptionText(item.leaseRentType) || '-';
}

function normalizePaymentStatusValue(item: AssetLeaseRentDetailsListItem): string {
  const paymentStatus = normalizeOptionText(item.paymentStatus).toLowerCase();
  return paymentStatus === 'paid' ? 'Paid' : 'Unpaid';
}

function normalizeRentDue(item: AssetLeaseRentDetailsListItem): number {
  return Number(
    item.rentAmount ??
    item.monthlyRent ??
    item.rentMonthly ??
    item.previousMonthlyRent ??
    0
  );
}

export interface PaymentRecordRow {
  id: number;
  assetId: number;
  assetNo: string;
  assetName: string;
  zone: string;
  wardNo: string;
  category: string;
  shopNo: string;
  shopName: string;
  tenantName: string;
  tenantMobile: string;
  leaseType: string;
  rentDue: number;
  status: string;
}

function mapAssetLeaseRentDetailsToPaymentRow(item: AssetLeaseRentDetailsListItem): PaymentRecordRow {
  return {
    id: item.id,
    assetId: item.assetId,
    assetNo: normalizeOptionText(item.assetNo) || String(item.assetId),
    assetName: normalizeOptionText(item.assetName) || '-',
    zone: normalizeOptionText(item.zone) || '-',
    wardNo: normalizeOptionText(item.wardNo) || '-',
    category:
      normalizeOptionText(item.category) ||
      normalizeOptionText(item.assetCategory) ||
      normalizeOptionText(item.assetCategoryName) ||
      '-',
    shopNo: normalizeOptionText(item.shopNo) || '-',
    shopName: normalizeOptionText(item.shopName) || '-',
    tenantName: normalizeOptionText(item.tenantName) || '-',
    tenantMobile: normalizeOptionText(item.tenantMobile) || '-',
    leaseType: normalizeLeaseType(item),
    rentDue: normalizeRentDue(item),
    status: normalizePaymentStatusValue(item),
  };
}

export async function getPaymentRecordsAction(): Promise<PaymentRecordRow[]> {
  const response = await getAssetLeaseRentDetailsList({
    pageNumber: 1,
    pageSize: 1000,
    workflowStatus: PAYMENT_WORKFLOW_STATUS,
  });

  return response.items.map(mapAssetLeaseRentDetailsToPaymentRow);
}

export interface PaymentRecordsQuery {
  pageSize: number;
  pageNumber: number;
  zone: string;
  ward: string;
  assetCategory: string;
  leaseRentType: string;
  status: string;
  search: string;
  sortBy: keyof PaymentRecordRow | '';
  sortOrder: 'asc' | 'desc';
}

export interface PaymentRecordsPageData {
  query: PaymentRecordsQuery;
  records: PaymentRecordRow[];
  totalEntries: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
}

export interface PaymentFilterOptions {
  zoneOptions: Array<{ label: string; value: string }>;
  wardOptions: Array<{ label: string; value: string }>;
  assetCategoryOptions: Array<{ label: string; value: string }>;
}

export async function getPaymentRecordsPageDataAction(
  query: PaymentRecordsQuery
): Promise<PaymentRecordsPageData> {
  const response = await getAssetLeaseRentDetailsList({
    pageNumber: 1,
    pageSize: 1000,
    workflowStatus: PAYMENT_WORKFLOW_STATUS,
    zoneId: query.zone === 'all' ? undefined : Number(query.zone),
    wardId: query.ward === 'all' ? undefined : Number(query.ward),
    assetCategoryId: query.assetCategory === 'all' ? undefined : Number(query.assetCategory),
    paymentStatus: query.status === 'all' ? undefined : normalizeStatus(query.status),
    searchTerm: query.search.trim() || undefined,
  });
  const allRecords = response.items.map(mapAssetLeaseRentDetailsToPaymentRow);
  const normalizedSearch = query.search.trim().toLowerCase();

  const filtered = allRecords.filter((item) => {
    const leaseMatch =
      query.leaseRentType === 'all' || item.leaseType.toLowerCase() === query.leaseRentType.toLowerCase();
    const statusMatch = query.status === 'all' || item.status.toLowerCase() === query.status.toLowerCase();
    const searchMatch =
      !normalizedSearch ||
      String(item.assetId).toLowerCase().includes(normalizedSearch) ||
      item.assetNo.toLowerCase().includes(normalizedSearch) ||
      item.shopName.toLowerCase().includes(normalizedSearch) ||
      item.shopNo.toLowerCase().includes(normalizedSearch) ||
      item.assetName.toLowerCase().includes(normalizedSearch) ||
      item.tenantName.toLowerCase().includes(normalizedSearch);

    return leaseMatch && statusMatch && searchMatch;
  });

  const sorted = [...filtered];
  const sortBy = query.sortBy;
  if (sortBy) {
    sorted.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return query.sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }

      const aText = String(aValue ?? '').toLowerCase();
      const bText = String(bValue ?? '').toLowerCase();
      if (aText < bText) return query.sortOrder === 'asc' ? -1 : 1;
      if (aText > bText) return query.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  const totalEntries = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / query.pageSize));
  const safePageNumber = Math.min(Math.max(1, query.pageNumber), totalPages);
  const startIndex = (safePageNumber - 1) * query.pageSize;
  const endIndex = Math.min(startIndex + query.pageSize, totalEntries);

  return {
    query: { ...query, pageNumber: safePageNumber },
    records: sorted.slice(startIndex, endIndex),
    totalEntries,
    totalPages,
    startIndex,
    endIndex,
  };
}

export async function getPaymentFilterOptionsAction(
  selectedZone: string
): Promise<PaymentFilterOptions> {
  const [zonesResponse, wardsResponse, categoriesResponse] = await Promise.all([
    zoneService.getZones(),
    wardService.getWards(),
    categoryTypeService.getCategories(),
  ]);

  const zoneOptions = dedupeOptions(
    sortBySequenceThenId(zonesResponse.success && zonesResponse.data ? zonesResponse.data : [])
      .map((zone) => {
        const zoneRecord = zone as unknown as Record<string, unknown>;
        const label = buildZoneOptionLabel(zoneRecord);
        const value = buildZoneOptionValue(zoneRecord);
        return label && value ? { label, value } : null;
      })
      .filter((option): option is { label: string; value: string } => Boolean(option))
  );

  const selectedZoneId = selectedZone !== 'all' && /^\d+$/.test(selectedZone) ? Number(selectedZone) : null;
  const wardOptionsSource = sortBySequenceThenId(wardsResponse.success && wardsResponse.data ? wardsResponse.data : [])
    .filter((ward) => selectedZoneId === null || ward.zoneId == null || Number(ward.zoneId) === selectedZoneId);

  const wardOptions = dedupeOptions(
    wardOptionsSource
      .map((ward) => {
        const wardRecord = ward as unknown as Record<string, unknown>;
        const label = buildWardOptionLabel(wardRecord);
        const value = buildWardOptionValue(wardRecord);
        return label && value ? { label, value } : null;
      })
      .filter((option): option is { label: string; value: string } => Boolean(option))
  );

  const assetCategoryOptions = dedupeOptions(
    (categoriesResponse.success && categoriesResponse.data ? categoriesResponse.data : [])
      .map((category) => ({
        label: normalizeOptionText(category.categoryName) || String(category.id),
        value: String(category.id),
      }))
  );

  return {
    zoneOptions,
    wardOptions,
    assetCategoryOptions,
  };
}
