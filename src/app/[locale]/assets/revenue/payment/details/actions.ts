'use server';

import { getAssetLeaseRentDetailsById } from '@/lib/api/asset/asset-lease-rent-details.service';
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
  return record.assetId === Number(assetId) ? mapAssetLeaseRentDetailsToPaymentDetail(record) : null;
}
