'use server';

import { leaseRentPaymentService } from '@/lib/api/asset/leaseRentPayment.service';
import type { LeaseRentPaymentDetail, LeaseRentPaymentHistoryItem } from '@/types/asset/leaseRentPayment.types';

export async function getPaymentHistoryRecordAction(recordId: string): Promise<LeaseRentPaymentDetail | null> {
  const response = await leaseRentPaymentService.getLeaseRentPaymentById(recordId);
  if (!response.success || !response.data) return null;
  return response.data;
}

export async function getPaymentHistoryItemsAction(recordId: string): Promise<LeaseRentPaymentHistoryItem[]> {
  const response = await leaseRentPaymentService.getLeaseRentPaymentHistory(recordId);
  if (!response.success || !response.data?.items) return [];
  return response.data.items;
}
