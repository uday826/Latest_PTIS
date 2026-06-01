export const dynamic = 'force-dynamic';

/**
 * Asset Dashboard Page
 * 
 * IMPORTANT: This page displays AssetIntroVideo component before the dashboard.
 * - Video plays once per session (tracked via sessionStorage: 'ntis_asset_management_intro_played')
 * - To test video again: Open browser console and run: sessionStorage.removeItem('ntis_asset_management_intro_played')
 * - Check browser console for video debugging logs
 * - Video ONLY plays when navigating to Asset Management from home page
 */

import { cookies } from 'next/headers';
import { AssetMasterDashboard } from '@/components/modules/assets/dashboard/master-dashboard/AssetMasterDashboard';
import { fetchDashboardDataAction } from '@/app/[locale]/asset/dashboard/master-dashboard/actions';
import { authService } from '@/lib/api/auth.service';
import { AssetIntroVideo } from '@/components/modules/assets/AssetIntroVideo';

export default async function AssetDashboardPage() {
    const cookieStore = await cookies();
    let districtName = cookieStore.get('ulb_name')?.value || '';

    // Fetch initial data concurrently on the server
    const [dashboardRes, ulbRes] = await Promise.all([
        fetchDashboardDataAction(),
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

    const initialDashboardData = dashboardRes.success ? dashboardRes.data : undefined;
    const hasPlayedAssetIntro = cookieStore.get('ntis_asset_management_intro_played')?.value === 'true';

    return (
        <>
            {!hasPlayedAssetIntro && (
                <style id="server-intro-style" dangerouslySetInnerHTML={{ __html: `
                    body header, body footer, body main, html header, html footer, html main {
                        display: none !important;
                    }
                    body, html {
                        background-color: black !important;
                        overflow: hidden !important;
                    }
                ` }} />
            )}
            <AssetIntroVideo displayUlbName={districtName} />
            <div className="p-2 bg-slate-50/50 overflow-y-auto custom-scrollbar">
                <div className="mx-auto w-full max-w-[99%]">
                    <AssetMasterDashboard
                        initialDashboardData={initialDashboardData}
                        selectedDistrict={districtName}
                    />
                </div>
            </div>
        </>
    );
}
