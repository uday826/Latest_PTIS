import { redirect } from 'next/navigation';

export default async function AssetRootPage({ params }: { params: Promise<{ locale: string }> }) {
    const resolvedParams = await params;
    // When the user clicks the home card, instantly redirect to the dashboard
    redirect(`/${resolvedParams.locale}/assets/dashboard/master-dashboard`);
}
