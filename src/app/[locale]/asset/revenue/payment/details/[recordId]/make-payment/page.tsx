import { PaymentDetailLayout } from '@/components/modules/assets/revenue/payment/PaymentDetailLayout';
import { MakePaymentScreen } from '@/components/modules/assets/revenue/payment/MakePaymentScreen';
import { getMakePaymentRecordAction } from './actions';

interface PageProps {
  params: Promise<{ recordId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function MakePaymentPage({ params, searchParams }: PageProps) {
  const { recordId } = await params;
  const query = await searchParams;
  const record = await getMakePaymentRecordAction(recordId);
  const rawMode = typeof query.mode === 'string' ? query.mode : typeof query.Mode === 'string' ? query.Mode : '';
  const initialMode =
    rawMode === 'cash'
      ? 'Cash'
      : rawMode === 'dd'
        ? 'DD'
        : rawMode === 'cheque'
          ? 'Cheque'
          : rawMode === 'qr-upi' || rawMode === 'or-upi'
            ? 'QR / UPI'
            : rawMode === 'online'
              ? 'Online'
              : '';

  if (!record) {
    return <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">Payment record not found.</div>;
  }

  return (
    <div className="flex h-[calc(100vh-140px)] overflow-hidden">
      <div className="flex-1 p-6 bg-slate-50/50 overflow-y-auto custom-scrollbar">
        <PaymentDetailLayout record={record} activeTab="make-payment">
          <MakePaymentScreen record={record} initialMode={initialMode} />
        </PaymentDetailLayout>
      </div>
    </div>
  );
}
