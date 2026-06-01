import { PaymentSection } from '@/components/modules/assets/revenue/PaymentSection';

interface PageProps {
    params: Promise<{
        locale: string;
    }>;
}

/**
 * Dedicated Static Route for Payment Management
 * Resolves to /asset/revenue/payment
 */
export default async function PaymentPage({ params }: PageProps) {
    const { locale } = await params;

    return (
        <div className="p-6 bg-slate-50/50 overflow-y-auto custom-scrollbar">
            <PaymentSection />
        </div>
    );
}
