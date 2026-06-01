import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import DynamicAssetPageClient from './DynamicAssetPageClient';

interface PageProps {
    params: Promise<{
        slug?: string[];
        locale: string;
    }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

/**
 * Consolidated Asset Page
 * Handles all routes under /asset using a single file.
 */
export default async function ConsolidatedAssetPage({ params, searchParams }: PageProps) {
    const { slug, locale } = await params;
    await searchParams;
    await getTranslations('asset');

    // Normalize slug by removing leading 'ScreenField' case-insensitively to allow both /asset/ScreenField/... and /asset/...
    const normalizedSlug = slug && slug.length > 0 && slug[0].toLowerCase() === 'screenfield'
        ? slug.slice(1)
        : slug;

    // Handle default route /asset -> redirect to master data
    if (!normalizedSlug || normalizedSlug.length === 0) {
        redirect(`/${locale}/asset/configuration/master-data`);
    }

    // Redirect /asset/dashboard to the correct master dashboard page
    if (normalizedSlug && normalizedSlug.length === 1 && normalizedSlug[0].toLowerCase() === 'dashboard') {
        redirect(`/${locale}/asset/dashboard/master-dashboard`);
    }

    // Helper function to wrap rendered screens in the asset page container
    const wrapWithLayout = (content: React.ReactNode) => {
        return (
            <div className="flex-1 p-4 bg-slate-50/50 overflow-y-auto custom-scrollbar">
                {content}
            </div>
        );
    };

    // 4. Dynamic screens (catch-all for all other routes)
    return wrapWithLayout(<DynamicAssetPageClient slug={normalizedSlug} locale={locale} />);
}
