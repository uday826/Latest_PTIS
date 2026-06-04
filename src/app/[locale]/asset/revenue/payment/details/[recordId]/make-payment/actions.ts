'use server';

import { leaseRentPaymentService } from '@/lib/api/asset/leaseRentPayment.service';
import type { LeaseRentPaymentDetail } from '@/types/asset/leaseRentPayment.types';

export async function getMakePaymentRecordAction(recordId: string): Promise<LeaseRentPaymentDetail | null> {
  const response = await leaseRentPaymentService.getLeaseRentPaymentById(recordId);
  if (!response.success || !response.data) return null;
  return response.data;
}
