'use server';

import { leaseRentPaymentService } from '@/lib/api/asset/leaseRentPayment.service';
import type { LeaseRentPaymentDetail, LeaseRentPaymentListItem } from '@/types/asset/leaseRentPayment.types';

export async function getPaymentDetailsRecordsAction(): Promise<LeaseRentPaymentListItem[]> {
  const response = await leaseRentPaymentService.getLeaseRentPayments({
    pageNumber: 1,
    pageSize: 1000,
  });

  if (!response.success || !response.data?.items) return [];
  return response.data.items;
}

export async function getPaymentDetailRecordAction(
  assetId: string | null,
  srNoParam: string | null
): Promise<LeaseRentPaymentDetail | null> {
  if (!assetId || !srNoParam) return null;

  const srNo = Number(srNoParam);
  if (!Number.isFinite(srNo)) return null;

  const response = await leaseRentPaymentService.getLeaseRentPaymentById(srNo);
  if (!response.success || !response.data) return null;
  return response.data.assetId === Number(assetId) ? response.data : null;
}
