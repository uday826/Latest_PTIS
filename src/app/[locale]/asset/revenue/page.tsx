import { redirect } from 'next/navigation';

interface PageProps {
    params: Promise<{
        locale: string;
    }>;
}

export default async function RevenueRootPage({ params }: PageProps) {
    const { locale } = await params;
    redirect(`/${locale}/asset/revenue/manage-renters`);
}
