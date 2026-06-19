'use server';

import { revalidatePath } from 'next/cache';
import { getAssetLeaseRentDetailsById } from '@/lib/api/asset/asset-lease-rent-details.service';
import { leaseRentPaymentService } from '@/lib/api/asset/leaseRentPayment.service';
import type {
  LeaseRentPaymentDetail,
  LeaseRentDemandItem,
  LeaseRentBillRequest,
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

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/**
 * Raw shape from the GET /api/LeaseRentDemand/{leaseId} endpoint.
 * Maps the backend field names to the UI‑facing LeaseRentDemandItem type.
 */
interface LeaseRentDemandApiRow {
  assetId?: number;
  leaseRegistrationId?: number;
  financeYear?: number;
  demandYear?: number;
  quarterNo?: number;
  demandMonth?: number;
  monthlyRentAmount?: number;
  penaltyRuleMasterId?: number;
  penaltyAmount?: number;
  gstMasterId?: number;
  gstAmount?: number;
  totalDemandAmount?: number;
  paidAmount?: number;
  pendingAmount?: number;
  demandStatus?: string;
  lastPaymentDate?: string | null;
  dueDate?: string | null;
  id?: number;
  isActive?: boolean;
  createdDate?: string;
  updatedDate?: string | null;
}

/**
 * Server action: fetch the lease rent demand items for a given lease id.
 * Used by the Client-side useLeaseRentDemands hook to avoid importing
 * server-only modules (api.service.ts with next/headers) into the client bundle.
 */
export async function getLeaseRentDemandsAction(
  leaseId: number | string,
  financeYear?: number | string
): Promise<{ success: boolean; data: LeaseRentDemandItem[]; error?: string }> {
  const response = await leaseRentPaymentService.getLeaseRentDemands(leaseId, financeYear);
  if (!response.success) {
    return { success: false, data: [], error: response.error ?? 'Failed to fetch lease rent demands.' };
  }

  const raw = response.data as unknown;
  const rawItems = (raw as { items?: unknown[] } | null | undefined)?.items;
  const rows: LeaseRentDemandApiRow[] = Array.isArray(raw)
    ? raw
    : Array.isArray(rawItems)
      ? rawItems
      : [];

  const list: LeaseRentDemandItem[] = rows.map((r) => {
    const monthIndex = r.demandMonth ?? -1;
    const monthName =
      monthIndex >= 1 && monthIndex <= 12 ? MONTH_NAMES[monthIndex - 1] : String(monthIndex);
    // Qualify the period with its calendar year so months from different finance years
    // (e.g. arrears Jan 2026 in FY 2025-26 vs current Apr 2026 in FY 2026-27) stay unique —
    // the payment screen keys selection by this label.
    const periodYear = r.demandYear ?? r.financeYear;
    const monthLabel = periodYear ? `${monthName} ${periodYear}` : monthName;

    return {
      id: r.id ?? r.leaseRegistrationId,
      month: monthLabel,
      financeYear: r.financeYear,
      rent: r.monthlyRentAmount ?? 0,
      penalty: r.penaltyAmount ?? 0,
      gst: r.gstAmount ?? 0,
      total: r.totalDemandAmount ?? 0,
      demandStatus: r.demandStatus ?? null,
      paidAmount: r.paidAmount ?? null,
      pendingAmount: r.pendingAmount ?? null,
      dueDate: r.dueDate ?? null,
    };
  });

  return { success: true, data: list };
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
  
  const demandSummaryRes = await leaseRentPaymentService.getLeaseRentDemandSummary(parsedRecordId);
  if (demandSummaryRes.success && demandSummaryRes.data) {
    const summary = demandSummaryRes.data;
    baseDetail.currentDemand = summary.totalRent ?? 0;
    baseDetail.penalty = summary.totalPenalty ?? 0;
    baseDetail.gst = summary.totalGst ?? 0;
    baseDetail.totalPayable = summary.totalDemand ?? 0;
    baseDetail.pendingDue = summary.totalPending ?? 0;
    baseDetail.financeYear = summary.financeYear ?? currentYear;
    baseDetail.totalPaid = summary.totalPaid ?? 0;
    baseDetail.totalPending = summary.totalPending ?? 0;
  }

  return baseDetail;
}

export interface ProcessLeaseRentPaymentActionResult {
  success: boolean;
  message: string;
}

export async function processMakePaymentAction(
  recordId: string,
  payload: LeaseRentBillRequest
): Promise<ProcessLeaseRentPaymentActionResult> {
  const response = await leaseRentPaymentService.createLeaseRentBill(recordId, payload);

  if (!response.success) {
    return {
      success: false,
      message: normalizeProcessPaymentErrorMessage(response.error),
    };
  }

  revalidatePath('/[locale]/assets/revenue/payment/details/[recordId]', 'layout');
  revalidatePath('/[locale]/assets/revenue/payment/details/[recordId]/payment-history');
  revalidatePath('/[locale]/assets/revenue/payment/details/[recordId]/make-payment');

  return {
    success: true,
    message: 'Payment processed successfully.',
  };
}
