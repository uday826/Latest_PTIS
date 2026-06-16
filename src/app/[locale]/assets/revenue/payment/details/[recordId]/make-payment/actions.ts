'use server';

import { getAssetLeaseRentDetailsById } from '@/lib/api/asset/asset-lease-rent-details.service';
import { leaseRentPaymentService } from '@/lib/api/asset/leaseRentPayment.service';
import type {
  LeaseRentPaymentDetail,
  ProcessLeaseRentPaymentRequest,
} from '@/types/asset/leaseRentPayment.types';
import { mapAssetLeaseRentDetailsToPaymentDetail } from '../../record.mapper';

function normalizeProcessPaymentErrorMessage(message: string | undefined): string {
  const normalized = message?.trim() ?? '';
  if (!normalized) return 'Failed to process payment.';

  if (
    normalized.includes('Payment_PaymentType_Invalid') ||
    normalized.includes('PaymentType')
  ) {
    return 'Invalid payment type.';
  }

  return normalized;
}

export async function getMakePaymentRecordAction(recordId: string): Promise<LeaseRentPaymentDetail | null> {
  const parsedRecordId = Number(recordId);
  if (!Number.isFinite(parsedRecordId)) return null;

  const record = await getAssetLeaseRentDetailsById(parsedRecordId);
  if (!record) return null;

  const assetResponse = await leaseRentPaymentService.getAssetById(record.assetId);
  const baseDetail = mapAssetLeaseRentDetailsToPaymentDetail(
    record,
    assetResponse.success ? assetResponse.data ?? null : null
  );

  const currentYear = new Date().getFullYear();
  baseDetail.financeYear = currentYear;
  
  const demandSummaryRes = await leaseRentPaymentService.getLeaseRentDemandSummary(parsedRecordId, currentYear);
  if (demandSummaryRes.success && demandSummaryRes.data) {
    const summary = demandSummaryRes.data;
    baseDetail.currentDemand = summary.totalRent ?? 0;
    baseDetail.penalty = summary.totalPenalty ?? 0;
    baseDetail.gst = summary.totalGst ?? 0;
    baseDetail.totalPayable = summary.totalDemand ?? 0;
    baseDetail.pendingDue = summary.totalPending ?? 0;
    baseDetail.financeYear = summary.financeYear ?? currentYear;
  }

  return baseDetail;
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
      message: normalizeProcessPaymentErrorMessage(response.error),
    };
  }

  return {
    success: true,
    message: 'Payment processed successfully.',
  };
}
