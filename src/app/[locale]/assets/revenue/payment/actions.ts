'use server';

import { leaseRentPaymentService } from '@/lib/api/asset/leaseRentPayment.service';
import type { LeaseRentPaymentListItem } from '@/types/asset/leaseRentPayment.types';

function normalizeStatus(status: string): string {
  const value = status.trim().toLowerCase();
  if (value === 'paid') return 'Paid';
  if (value === 'unpaid') return 'Unpaid';
  return status;
}

export async function getPaymentRecordsAction(): Promise<LeaseRentPaymentListItem[]> {
  const response = await leaseRentPaymentService.getLeaseRentPayments({
    pageNumber: 1,
    pageSize: 1000,
  });

  if (!response.success || !response.data?.items) return [];
  return response.data.items;
}

export interface PaymentRecordsQuery {
  pageSize: number;
  pageNumber: number;
  zone: string;
  ward: string;
  leaseRentType: string;
  status: string;
  search: string;
  sortBy: keyof LeaseRentPaymentListItem | '';
  sortOrder: 'asc' | 'desc';
}

export interface PaymentRecordsPageData {
  query: PaymentRecordsQuery;
  records: LeaseRentPaymentListItem[];
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
  const response = await leaseRentPaymentService.getLeaseRentPayments({
    pageNumber: 1,
    pageSize: 1000,
    leaseType: query.leaseRentType === 'all' ? undefined : query.leaseRentType,
    paymentStatus: query.status === 'all' ? undefined : normalizeStatus(query.status),
    searchTerm: query.search.trim() || undefined,
  });
  const allRecords = response.success && response.data?.items ? response.data.items : [];
  const normalizedSearch = query.search.trim().toLowerCase();

  const filtered = allRecords.filter((item) => {
    const zoneMatch = query.zone === 'all' || item.zone === query.zone;
    const wardMatch = query.ward === 'all' || item.wardNo === query.ward;
    const leaseMatch = query.leaseRentType === 'all' || item.leaseType === query.leaseRentType;
    const statusMatch = query.status === 'all' || item.status.toLowerCase() === query.status.toLowerCase();
    const searchMatch =
      !normalizedSearch ||
      String(item.assetId).toLowerCase().includes(normalizedSearch) ||
      item.shopNo.toLowerCase().includes(normalizedSearch) ||
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
  const wardOptions = Array.from(new Set(allRecords.map((item) => item.wardNo))).map((value) => ({ label: value, value }));
  const leaseRentTypeOptions = Array.from(new Set(allRecords.map((item) => item.leaseType))).map((value) => ({ label: value, value }));
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
