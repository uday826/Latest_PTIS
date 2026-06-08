import { OtherPaymentScreen } from '@/components/modules/assets/revenue/payment/OtherPaymentScreen';
import { PaymentDetailLayout } from '@/components/modules/assets/revenue/payment/PaymentDetailLayout';
import { getOtherPaymentRecordAction } from './actions';

interface PageProps {
  params: Promise<{ recordId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function OtherPaymentPage({ params, searchParams }: PageProps) {
  const { recordId } = await params;
  const query = await searchParams;
  const record = await getOtherPaymentRecordAction(recordId);
  const rawType = typeof query.type === 'string' ? query.type : typeof query.Type === 'string' ? query.Type : '';
  const rawMode = typeof query.mode === 'string' ? query.mode : typeof query.Mode === 'string' ? query.Mode : '';
  const initialPaymentType =
    rawType === 'Deposit' || rawType === 'Penalty' || rawType === 'Transfer Fee'
      ? rawType
      : '';
  const initialPaymentMode =
    rawMode === 'Cash'
      ? 'Cash'
      : rawMode === 'DD'
        ? 'DD'
        : rawMode === 'Cheque'
          ? 'Cheque'
          : rawMode === 'QR'
            ? 'QR'
            : rawMode === 'Online'
              ? 'Online'
              : '';

  if (!record) {
    return <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">Payment record not found.</div>;
  }

  return (
    <div className="flex h-[calc(100vh-140px)] overflow-hidden">
      <div className="flex-1 p-6 bg-slate-50/50 overflow-y-auto custom-scrollbar">
        <PaymentDetailLayout record={record} activeTab="other-payment">
          <OtherPaymentScreen record={record} initialPaymentType={initialPaymentType} initialPaymentMode={initialPaymentMode} />
        </PaymentDetailLayout>
      </div>
    </div>
  );
}
