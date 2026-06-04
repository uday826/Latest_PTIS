import { LeaseRentRegistration } from '@/components/modules/assets/revenue/LeaseRentRegistration';

interface PageProps {
    params: Promise<{
        locale: string;
    }>;
}

/**
 * Dedicated Static Route for Manage Renters Details
 * Resolves to /asset/revenue/manage-renters
 */
export default async function ManageRentersPage({ params }: PageProps) {
    const { locale } = await params;

    return (
        <div className="p-6 bg-slate-50/50 overflow-y-auto custom-scrollbar">
            <LeaseRentRegistration />
        </div>
    );
}
