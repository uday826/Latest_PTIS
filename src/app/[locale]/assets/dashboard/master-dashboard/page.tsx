export const dynamic = 'force-dynamic';

/**
 * Asset Master Dashboard Page
 * 
 * IMPORTANT: This page displays AssetIntroVideo component before the dashboard.
 * - Video plays once per session (tracked via sessionStorage: 'ntis_asset_management_intro_played')
 * - To test video again: Open browser console and run: sessionStorage.removeItem('ntis_asset_management_intro_played')
 * - Check browser console for video debugging logs
 * - Video ONLY plays when navigating to Asset Management from home page
 */

import { fetchInitialDashboardAction, fetchFilteredAction } from '@/app/[locale]/assets/dashboard/master-dashboard/actions';
import { AssetMasterDashboard } from '@/components/modules/assets/dashboard/master-dashboard/AssetMasterDashboard';
import { authService } from '@/lib/api/auth.service';
import { cookies } from 'next/headers';

interface PageProps {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AssetMasterDashboardPage({ searchParams }: PageProps) {
    const cookieStore = await cookies();
    let districtName = cookieStore.get('ulb_name')?.value || '';

    const sp = await searchParams;
    const zone = typeof sp?.zone === 'string' ? sp.zone : 'all';
    const ward = typeof sp?.ward === 'string' ? sp.ward : 'all';

    // Fetch initial data concurrently on the server
    const [dashboardRes, ulbRes] = await Promise.all([
        (zone === 'all' && ward === 'all') ? fetchInitialDashboardAction() : fetchFilteredAction(zone, ward),
        districtName ? Promise.resolve(null) : authService.getUlbConfig().catch(() => null),
    ]);

    if (!districtName && ulbRes && ulbRes.success && ulbRes.data?.ulbName) {
        districtName = ulbRes.data.ulbName;
    }

    // Dynamic clean-up (e.g. "Akola Municipal Corporation" -> "Akola")
    if (districtName) {
        districtName = districtName.replace(/\s+(Municipal\s+Corporation|Council|ULB|Corporation)$/i, '').trim();
    } else {
        districtName = ''; // ULB name unavailable; let the component render a generic label
    }

    const initialData = dashboardRes && !(dashboardRes as any).error ? dashboardRes : {
        stats: {
            totalAssets: { value: '0', change: '', backInfo: [] },
            totalValue: { value: '₹0Cr', change: '', backInfo: [] },
            monetized: { value: '0', change: '', backInfo: [] },
            encroachments: { value: '0', change: '', backInfo: [] },
            maintenance: { value: '0', change: '', backInfo: [] },
            auctions: { value: '0', change: '', backInfo: [] },
            acquisitions: { value: '0', change: '', backInfo: [] },
        },
        filteredAssets: [],
        categories: [],
        zoneDistribution: [],
        acquisitionsList: [],
        auctionsList: [],
        allZones: [],
        allWards: [],
    };

    return (
        <>
            <div className="p-2 bg-slate-50/50 overflow-y-auto custom-scrollbar">
                <div className="mx-auto w-full max-w-[99%]">
                    <AssetMasterDashboard
                        initialData={initialData as any}
                        selectedDistrict={districtName}
                    />
                </div>
            </div>
        </>
    );
}


