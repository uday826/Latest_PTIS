'use server';

import { getAssetLeaseRentDetailsById } from '@/lib/api/asset/asset-lease-rent-details.service';
import { leaseRentPaymentService } from '@/lib/api/asset/leaseRentPayment.service';
import type { LeaseRentPaymentDetail } from '@/types/asset/leaseRentPayment.types';
import type { PaymentRecordRow } from '../actions';
import { getPaymentRecordsAction } from '../actions';
import { mapAssetLeaseRentDetailsToPaymentDetail } from './record.mapper';

export async function getPaymentDetailsRecordsAction(): Promise<PaymentRecordRow[]> {
  return getPaymentRecordsAction();
}

export async function getPaymentDetailRecordAction(
  assetId: string | null,
  recordIdParam: string | null
): Promise<LeaseRentPaymentDetail | null> {
  if (!assetId || !recordIdParam) return null;

  const recordId = Number(recordIdParam);
  if (!Number.isFinite(recordId)) return null;

  const record = await getAssetLeaseRentDetailsById(recordId);
  if (!record) return null;
  if (record.assetId !== Number(assetId)) return null;

  const [assetResponse, summaryResponse] = await Promise.all([
    leaseRentPaymentService.getAssetById(record.assetId),
    leaseRentPaymentService.getLeaseRentDemandSummary(recordId),
  ]);

  const mapped = mapAssetLeaseRentDetailsToPaymentDetail(
    record,
    assetResponse.success ? assetResponse.data ?? null : null
  );

  if (summaryResponse.success && summaryResponse.data) {
    mapped.totalPaid = summaryResponse.data.totalPaid;
    mapped.totalPending = summaryResponse.data.totalPending;
  }

  return mapped;
}
