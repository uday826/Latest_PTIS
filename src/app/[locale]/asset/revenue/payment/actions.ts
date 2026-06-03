'use server';

import { getPaymentRecords } from '@/lib/api/asset/payment.service';
import type { PaymentRecord } from '@/types/asset/payment.types';

export async function getPaymentRecordsAction(): Promise<PaymentRecord[]> {
  return getPaymentRecords();
}

export interface PaymentRecordsQuery {
  pageSize: number;
  pageNumber: number;
  zone: string;
  ward: string;
  leaseRentType: string;
  status: string;
  search: string;
  sortBy: keyof PaymentRecord | '';
  sortOrder: 'asc' | 'desc';
}

export interface PaymentRecordsPageData {
  query: PaymentRecordsQuery;
  records: PaymentRecord[];
  totalEntries: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  zoneOptions: Array<{ label: string; value: string }>;
  wardOptions: Array<{ label: string; value: string }>;
  leaseRentTypeOptions: Array<{ label: string; value: string }>;
  statusOptions: Array<{ label: string; value: string }>;
}

export async function getPaymentRecordsPageDataAction(
  query: PaymentRecordsQuery
): Promise<PaymentRecordsPageData> {
  const allRecords = await getPaymentRecords();
  const normalizedSearch = query.search.trim().toLowerCase();

  const filtered = allRecords.filter((item) => {
    const zoneMatch = query.zone === 'all' || item.zone === query.zone;
    const wardMatch = query.ward === 'all' || item.ward === query.ward;
    const leaseMatch = query.leaseRentType === 'all' || item.leaseRentType === query.leaseRentType;
    const statusMatch = query.status === 'all' || item.status === query.status;
    const searchMatch =
      !normalizedSearch ||
      item.assetId.toLowerCase().includes(normalizedSearch) ||
      item.shopPlotNo.toLowerCase().includes(normalizedSearch) ||
      item.assetName.toLowerCase().includes(normalizedSearch) ||
      item.tenantName.toLowerCase().includes(normalizedSearch);

    return zoneMatch && wardMatch && leaseMatch && statusMatch && searchMatch;
  });

  const sorted = [...filtered];
  if (query.sortBy) {
    sorted.sort((a, b) => {
      const aValue = a[query.sortBy];
      const bValue = b[query.sortBy];

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

  const zoneOptions = Array.from(new Set(allRecords.map((item) => item.zone))).map((value) => ({ label: value, value }));
  const wardOptions = Array.from(new Set(allRecords.map((item) => item.ward))).map((value) => ({ label: value, value }));
  const leaseRentTypeOptions = Array.from(new Set(allRecords.map((item) => item.leaseRentType))).map((value) => ({ label: value, value }));
  const statusOptions = [
    { label: 'Unpaid', value: 'unpaid' },
    { label: 'Paid', value: 'paid' },
  ];

  return {
    query: { ...query, pageNumber: safePageNumber },
    records: sorted.slice(startIndex, endIndex),
    totalEntries,
    totalPages,
    startIndex,
    endIndex,
    zoneOptions,
    wardOptions,
    leaseRentTypeOptions,
    statusOptions,
  };
}
