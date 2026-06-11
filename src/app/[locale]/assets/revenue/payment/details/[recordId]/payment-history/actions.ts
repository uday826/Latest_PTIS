'use server';

import { getAssetLeaseRentDetailsById } from '@/lib/api/asset/asset-lease-rent-details.service';
import { leaseRentPaymentService } from '@/lib/api/asset/leaseRentPayment.service';
import type { LeaseRentPaymentDetail, LeaseRentPaymentHistoryItem } from '@/types/asset/leaseRentPayment.types';
import { mapAssetLeaseRentDetailsToPaymentDetail } from '../../record.mapper';

export async function getPaymentHistoryRecordAction(recordId: string): Promise<LeaseRentPaymentDetail | null> {
  const parsedRecordId = Number(recordId);
  if (!Number.isFinite(parsedRecordId)) return null;

  const record = await getAssetLeaseRentDetailsById(parsedRecordId);
  if (!record) return null;

  const assetResponse = await leaseRentPaymentService.getAssetById(record.assetId);
  return mapAssetLeaseRentDetailsToPaymentDetail(
    record,
    assetResponse.success ? assetResponse.data ?? null : null
  );
}

export async function getPaymentHistoryItemsAction(recordId: string): Promise<LeaseRentPaymentHistoryItem[]> {
  const response = await leaseRentPaymentService.getLeaseRentPaymentHistory(recordId);
  if (!response.success || !response.data?.items) return [];
  return response.data.items;
}
