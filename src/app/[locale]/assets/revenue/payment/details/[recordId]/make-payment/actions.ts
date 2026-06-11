'use server';

import { getAssetLeaseRentDetailsById } from '@/lib/api/asset/asset-lease-rent-details.service';
import { leaseRentPaymentService } from '@/lib/api/asset/leaseRentPayment.service';
import type {
  LeaseRentPaymentDetail,
  ProcessLeaseRentPaymentRequest,
} from '@/types/asset/leaseRentPayment.types';
import { mapAssetLeaseRentDetailsToPaymentDetail } from '../../record.mapper';

export async function getMakePaymentRecordAction(recordId: string): Promise<LeaseRentPaymentDetail | null> {
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

export interface ProcessLeaseRentPaymentActionResult {
  success: boolean;
  message: string;
}

export async function processMakePaymentAction(
  recordId: string,
  payload: ProcessLeaseRentPaymentRequest
): Promise<ProcessLeaseRentPaymentActionResult> {
  const response = await leaseRentPaymentService.processLeaseRentPayment(recordId, payload);

  if (!response.success) {
    return {
      success: false,
      message: response.error || 'Failed to process payment.',
    };
  }

  return {
    success: true,
    message: 'Payment processed successfully.',
  };
}
