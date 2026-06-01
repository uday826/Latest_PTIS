import React, { Suspense } from 'react';
import MunicipalAssetDashboard from '@/components/modules/assets/municipal-Asset/MunicipalAssetDashboard';
import { AssetFormProvider } from '@/components/modules/assets/municipal-Asset/add-New-Asset/AssetFormContext';
import { fetchMunicipalAssetDashboardStats } from '@/app/[locale]/asset/actions';

export default async function MunicipalAssetPage() {
  const initialStats = await fetchMunicipalAssetDashboardStats();

  return (
    <div className="p-2 bg-slate-50/50 overflow-y-auto custom-scrollbar">
      <div className="mx-auto w-full max-w-[99%]">
        <Suspense fallback={<div className="p-4 text-center text-sm text-slate-500">Loading Dashboard...</div>}>
          <AssetFormProvider>
            <MunicipalAssetDashboard initialStats={initialStats} />
          </AssetFormProvider>
        </Suspense>
      </div>
        </div>
  );
}
