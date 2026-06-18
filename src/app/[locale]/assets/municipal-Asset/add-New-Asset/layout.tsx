import { AssetFormHeader } from '@/components/modules/assets/municipal-Asset/add-New-Asset/assetFormHeader';
import React, { Suspense } from 'react';
import { getTranslations } from "next-intl/server";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function AddNewAssetLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "addAssetForm" });

  return (
    <div className="flex h-[calc(100vh-104px)] overflow-hidden -mt-3 -mb-3 -mx-3 md:-mx-4">
      <div className="flex-1 p-0 overflow-hidden">
        <Suspense
          fallback={<div className="p-4 text-center text-sm text-slate-500">{t("loading.wizard")}</div>}
        >
          <AssetFormHeader>{children}</AssetFormHeader>
        </Suspense>
      </div>
    </div>
  );
}
