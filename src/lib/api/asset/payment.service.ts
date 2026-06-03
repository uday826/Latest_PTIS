import type { PaymentRecord } from '@/types/asset/payment.types';
import paymentRecordsData from '@/components/modules/assets/revenue/payment/paymentRecords.json';

/**
 * Fetch payment records from local mock source until backend API is available.
 */
export async function getPaymentRecords(): Promise<PaymentRecord[]> {
  return paymentRecordsData as PaymentRecord[];
}

/**
 * Fetch a single payment record by id (mapped to srNo in local mock data).
 */
export async function getPaymentRecordById(recordId: string): Promise<PaymentRecord | null> {
  const id = Number(recordId);
  if (!Number.isFinite(id)) return null;

  const records = await getPaymentRecords();
  return records.find((item) => item.srNo === id) ?? null;
}
