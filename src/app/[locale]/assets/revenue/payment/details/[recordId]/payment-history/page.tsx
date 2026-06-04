import { PaymentDetailLayout } from '@/components/modules/assets/revenue/payment/PaymentDetailLayout';
import { PaymentHistoryScreen } from '@/components/modules/assets/revenue/payment/PaymentHistoryScreen';
import { getPaymentHistoryRecordAction } from './actions';

interface PageProps {
  params: Promise<{ recordId: string }>;
}

export default async function PaymentHistoryPage({ params }: PageProps) {
  const { recordId } = await params;
  const record = await getPaymentHistoryRecordAction(recordId);

  if (!record) {
    return <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">Payment record not found.</div>;
  }

  return (
    <div className="flex h-[calc(100vh-140px)] overflow-hidden">
      <div className="flex-1 p-6 bg-slate-50/50 overflow-y-auto custom-scrollbar">
        <PaymentDetailLayout record={record} activeTab="payment-history">
          <PaymentHistoryScreen />
        </PaymentDetailLayout>
      </div>
    </div>
  );
}
