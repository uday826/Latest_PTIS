import React, { Suspense } from 'react';
import { AssetFormHeader } from '@/components/modules/assets/municipal-Asset/add-New-Asset/assetFormHeader';

export default function AddNewAssetLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[calc(100vh-140px)] overflow-hidden">
      <div className="flex-1 p-2 bg-slate-50/50 overflow-hidden">
        <Suspense
          fallback={<div className="p-4 text-center text-sm text-slate-500">Loading Wizard...</div>}
        >
          <AssetFormHeader>{children}</AssetFormHeader>
        </Suspense>
      </div>
    </div>
  );
}
