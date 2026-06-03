'use server';

import { getPaymentRecordById } from '@/lib/api/asset/payment.service';
import type { PaymentRecord } from '@/types/asset/payment.types';

export async function getMakePaymentRecordAction(recordId: string): Promise<PaymentRecord | null> {
  return getPaymentRecordById(recordId);
}
