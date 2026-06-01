import React, { Suspense } from 'react';
import { MainLayout } from '@/components/layout';
import { AssetSidebar } from '@/components/layout/AssetSidebar';
import { LoadingPage } from '@/components/common';

export default function MunicipalAssetDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MainLayout>
      <div className="flex h-[calc(100vh-140px)] overflow-hidden">
        <AssetSidebar currentPage="assets" />
        <div className="flex-1 p-2 bg-slate-50/50 overflow-y-auto custom-scrollbar">
          <div className="mx-auto w-full max-w-[99%]">
            <Suspense fallback={<LoadingPage />}>
              {children}
            </Suspense>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
