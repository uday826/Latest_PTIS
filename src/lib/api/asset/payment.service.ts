import type { PaymentRecord } from '@/types/asset/payment.types';

export const getPaymentRecords = async (): Promise<PaymentRecord[]> => {
  return [];
};

export const getPaymentRecordById = async (_id: string | number): Promise<PaymentRecord | null> => {
  return null;
};
