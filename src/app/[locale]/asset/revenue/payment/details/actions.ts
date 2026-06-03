'use server';

import { getPaymentRecords } from '@/lib/api/asset/payment.service';
import type { PaymentRecord } from '@/types/asset/payment.types';

export async function getPaymentDetailsRecordsAction(): Promise<PaymentRecord[]> {
  return getPaymentRecords();
}

export async function getPaymentDetailRecordAction(
  assetId: string | null,
  srNoParam: string | null
): Promise<PaymentRecord | null> {
  if (!assetId || !srNoParam) return null;

  const srNo = Number(srNoParam);
  if (!Number.isFinite(srNo)) return null;

  const records = await getPaymentRecords();
  return records.find((item) => item.assetId === assetId && item.srNo === srNo) ?? null;
}
