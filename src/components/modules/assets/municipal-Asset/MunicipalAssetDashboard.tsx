/* eslint-disable i18next/no-literal-string */
'use client';

import { AddButton, Card, CardContent, CardHeader, CardTitle } from '@/components/common';
import { AssetCategory, AssetType } from '@/lib/api/asset/category-type.service';
import { Building2 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { AssetCategoryCard } from './AssetCategoryCard';
import { getCategoryMeta, themes } from './dashboardHelpers';

type DashboardAssetTypeStat = {
  assetTypeId: number;
  assetTypeName: string;
  assetCount: number;
};

type DashboardCategoryStat = {
  categoryId: number;
  categoryName: string;
  categoryDescription?: string;
  registeredAssets?: number;
  totalCategoryItem?: number;
  totalValue?: number | null;
  assetTypeStats?: DashboardAssetTypeStat[];
};

type DashboardStatsResponse = {
  totalAssets: number;
  totalCategories: number;
  categoryStats: DashboardCategoryStat[];
};

type MunicipalAssetDashboardProps = {
  initialStats?: DashboardStatsResponse | null;
  initialCategories?: AssetCategory[] | null;
  initialTypes?: AssetType[] | null;
};

export default function MunicipalAssetDashboard({
  initialStats = null,
  initialCategories = null,
  initialTypes = null,
}: MunicipalAssetDashboardProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [categories] = useState<AssetCategory[]>(() => {
    let raw: any[] = [];
    if (initialCategories && initialCategories.length > 0) {
      raw = initialCategories;
    } else if (initialStats?.categoryStats?.length) {
      raw = initialStats.categoryStats.map((category) => ({
        id: category.categoryId,
        categoryName: category.categoryName,
        categoryCode: `CAT-${category.categoryId}`,
        isActive: true,
        isMovable: false,
        hasFloorDetails: false,
        hasInventory: false,
        isInventoryMandatory: false,
        hasLegalCompliance: false,
        valuationType: "GENERIC",
      }));
    }
    return raw.filter(c => 
      c.isActive !== false && c.isActive !== 0 && 
      c.IsActive !== false && c.IsActive !== 0 && 
      c.status?.toLowerCase() !== 'inactive'
    );
  });

  const [typesByCategory] = useState<Record<number, AssetType[]>>(() => {
    const typesMap: Record<number, AssetType[]> = {};

    const filterActive = (t: any) => 
      t.isActive !== false && t.isActive !== 0 && 
      t.IsActive !== false && t.IsActive !== 0 && 
      t.status?.toLowerCase() !== 'inactive';

    if (initialTypes) {
      initialTypes.filter(filterActive).forEach((type) => {
        const catId = type.categoryId || type.assetCategoryId;
        if (catId) {
          if (!typesMap[catId]) {
            typesMap[catId] = [];
          }
          if (!typesMap[catId].some((t) => t.id === type.id)) {
            typesMap[catId].push(type);
          }
        }
      });
    }

    if (initialStats?.categoryStats) {
      initialStats.categoryStats.forEach((category) => {
        const catId = category.categoryId;
        if (!typesMap[catId]) {
          typesMap[catId] = [];
        }
        if (category.assetTypeStats) {
          category.assetTypeStats.filter(filterActive).forEach((statType) => {
            if (!typesMap[catId].some((t) => t.id === statType.assetTypeId)) {
              typesMap[catId].push({
                id: statType.assetTypeId,
                assetTypeName: statType.assetTypeName,
                typeName: statType.assetTypeName,
                assetCategoryId: catId,
                isActive: true,
              });
            }
          });
        }
      });
    }

    return typesMap;
  });

  const [visibleExamples, setVisibleExamples] = useState<Record<string, number>>(() => {
    const initialVisible: Record<string, number> = {};
    categories.forEach((c) => {
      initialVisible[c.id.toString()] = 5;
    });
    return initialVisible;
  });

  const [dashboardStats] = useState<DashboardStatsResponse | null>(initialStats);

  const resolvedCategories = categories;

  const handleSelectCategory = (categoryId: number) => {
    const segments = pathname.split('/').filter(Boolean);
    const locale = segments[0] || 'en';
    router.push(`/${locale}/assets/municipal-Asset/asset-register/${categoryId}`);
  };

  return (
    <div className="space-y-6 pb-4">
      <Card variant="bordered" padding="none" className="overflow-hidden rounded-2xl border-slate-200 shadow-sm">
        <CardContent className="p-0">
          <div className="bg-white px-6 pb-0 pt-8">
            <CardHeader className="mb-3 p-0">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 opacity-40 blur-[4px]" />
                    <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-700 shadow-lg">
                      <Building2 className="h-5 w-5 text-white drop-shadow" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg font-black leading-tight tracking-tight text-[#1a1a2e]">
                        Asset Management
                      </CardTitle>
                      <span className="rounded-full border border-violet-300 bg-violet-100 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-violet-700">
                        MC-EMS
                      </span>
                    </div>
                    <p className="mt-0.5 flex items-center gap-1 text-[10px] font-medium">
                      <span className="font-bold text-violet-600">मालमत्ता व्यवस्थापन</span>
                      <span className="inline-block h-0.5 w-0.5 rounded-full bg-slate-300" />
                      <span className="text-slate-400">Municipal Corporation Estate Management System</span>
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>

            <div className="flex items-center justify-between border-t border-municipal-primary/8 py-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 rounded-lg border border-emerald-100 bg-emerald-50 px-2.5 py-1">
                  <span className="text-[10px] font-bold text-emerald-700">Categories:</span>
                  <span className="text-[10px] font-black text-emerald-800">
                    {dashboardStats?.totalCategories ?? categories.length}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1">
                  <span className="text-[10px] font-bold text-slate-500">Assets:</span>
                  <span className="text-[10px] font-black text-slate-800">{dashboardStats?.totalAssets ?? 0}</span>
                </div>
              </div>
              <AddButton
                label="Add New Asset"
                onClick={() => {
                  const segments = pathname.split('/').filter(Boolean);
                  const locale = segments[0] || 'en';
                  router.push(`/${locale}/assets/municipal-Asset/add-New-Asset`);
                }}
                className="h-auto rounded-lg border-0 bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-1.5 text-[11px] font-bold text-white shadow-md transition-all hover:opacity-95 hover:shadow-lg"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="px-8 pb-0 pt-6">
        {!dashboardStats ? (
          <Card variant="bordered" className="mx-auto max-w-md border-slate-200">
            <CardContent className="flex flex-col items-center justify-center py-16 opacity-70">
              <div className="mb-4 size-10 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
              <p className="text-sm font-bold uppercase tracking-wide text-slate-500">Loading Categories...</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {resolvedCategories.map((category) => {
              const meta = getCategoryMeta(category.categoryName);
              const t = themes[meta.id] || themes.building;
              return (
                <AssetCategoryCard
                  key={category.id}
                  category={category}
                  meta={meta}
                  theme={t}
                  catTypes={typesByCategory[category.id] || []}
                  visibleCount={visibleExamples[category.id.toString()] || 5}
                  onVisibleCountChange={(count) =>
                    setVisibleExamples((prev) => ({ ...prev, [category.id.toString()]: count }))
                  }
                  onSelectCategory={() => handleSelectCategory(category.id)}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
