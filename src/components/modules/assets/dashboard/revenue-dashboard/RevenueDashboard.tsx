'use client';

import {
  Building2,
  IndianRupee,
  TrendingUp,
  MapPin,
  ShoppingBag,
  Home,
  Car,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/common/Card';
import { DashboardLayout } from '../DashboardLayout';
import { RevenueFilters } from './RevenueFilters';
import ZoneWiseDemandCollection from './ZoneWiseDemandCollection';
import MonthlyRevenueTrendScreen from './MonthlyRevenueTrend';
import { useRevenueUrlFilters } from '@/hooks/useRevenueUrlFilters';
import {
  formatLakh,
  formatPercent,
  paletteForIndex,
} from '@/lib/utils/asset-utils/revenue-format';
import type {
  RevenueCategoryDistribution,
  RevenueDashboardData,
} from '@/types/asset-type/revenue-dashboard.types';

const VALUATION_ICON: Record<string, React.ElementType> = {
  LAND: MapPin,
  BUILDING: ShoppingBag,
  INFRASTRUCTURE: Building2,
  MOVABLE: Car,
  GENERIC: Home,
};

function iconForCategory(valuationType: string): React.ElementType {
  return VALUATION_ICON[valuationType?.toUpperCase()] ?? Building2;
}

function SummaryCard({
  icon: Icon,
  value,
  title,
  subtitle,
  className,
}: {
  icon: React.ElementType;
  value: string | number;
  title: string;
  subtitle: string;
  className?: string;
}) {
  return (
    <Card padding="sm" className={`h-full ${className}`}>
      <CardContent className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon className="w-7 h-7" />
          <span className="text-2xl font-bold">{value}</span>
        </div>

        <div className="text-right">
          <p className="font-semibold text-xs text-slate-700">{title}</p>
          <p className="text-[11px] text-slate-500">{subtitle}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function RevenueCategoryCard({
  item,
  index,
  icon: Icon,
  labels,
  onClick,
}: {
  item: RevenueCategoryDistribution;
  index: number;
  icon: React.ElementType;
  labels: { demand: string; collected: string; lease: string; rent: string; paid: string; unpaid: string };
  onClick: () => void;
}) {
  const palette = paletteForIndex(index);

  return (
    <Card
      padding="sm"
      onClick={onClick}
      className={`${palette.border} ${palette.bg} cursor-pointer hover:shadow-md hover:scale-[1.01] transition-all duration-200`}
    >
      <CardContent>
        <div className="flex justify-between">
          <div className="flex gap-3">
            <div className={`w-9 h-9 rounded-xl ${palette.iconBg} flex items-center justify-center`}>
              <Icon className="w-5 h-5 text-white" />
            </div>

            <div>
              <p className="font-medium text-sm text-slate-800">{item.categoryName}</p>
              <p className="text-2xl font-bold mt-1 text-slate-900">{item.assetCount}</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs font-medium text-slate-600">{labels.demand}</p>
            <p className="text-sm font-semibold text-slate-900">{formatLakh(item.demand)}</p>
            <p className="text-sm font-semibold mt-1 text-slate-900">{labels.collected}</p>
            <p className="text-sm font-semibold text-green-700">{formatLakh(item.collection)}</p>
          </div>
        </div>

        <div className="mt-4 border-t border-slate-200 pt-3 flex flex-wrap gap-4 text-xs font-medium text-slate-700">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            {labels.lease} {item.leaseCount}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            {labels.rent} {item.rentCount}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            {labels.paid} {item.paidCount}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            {labels.unpaid} {item.unpaidCount}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

interface RevenueAssetDashboardProps {
  data?: RevenueDashboardData;
}

export function RevenueAssetDashboard({ data }: RevenueAssetDashboardProps) {
  const router = useRouter();
  const t = useTranslations('revenueDashboard');
  const { isPending, setParams } = useRevenueUrlFilters();

  if (!data) {
    return (
      <DashboardLayout>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="py-10 text-center text-sm font-medium text-red-700">
            {t('errors.loadFailed')}
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  const { overview, zones, wards, selectedZoneId, selectedWardId } = data;
  const { summary } = overview;

  const categoryLabels = {
    demand: t('cards.demand'),
    collected: t('cards.collected'),
    lease: t('cards.lease'),
    rent: t('cards.rent'),
    paid: t('cards.paid'),
    unpaid: t('cards.unpaid'),
  };

  const openCategory = (categoryId: number) => {
    router.push(`/assets/dashboard/revenue-dashboard/revenue-records?category=${categoryId}`);
  };

  return (
    <DashboardLayout
      loading={isPending}
      filters={
        <RevenueFilters
          zones={zones}
          wards={wards}
          selectedZoneId={selectedZoneId}
          selectedWardId={selectedWardId}
          onZoneChange={(zoneId) => setParams({ zoneId, wardId: null })}
          onWardChange={(wardId) => setParams({ wardId })}
          filtersLabel={t('filters.label')}
          allZonesLabel={t('filters.allZones')}
          allWardsLabel={t('filters.allWards')}
        />
      }
    >
      <div className="space-y-4">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t('title')}</h1>
          <p className="text-sm text-blue-600 mt-1">
            {t('subtitle', { year: overview.year })}
          </p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <SummaryCard
            icon={Building2}
            value={summary.totalLeasedAssets}
            title={t('summary.leasedAssets')}
            subtitle={t('summary.leasedAssetsSub')}
            className="bg-blue-50 border-blue-200 text-blue-700"
          />
          <SummaryCard
            icon={IndianRupee}
            value={formatLakh(summary.totalDemand, { decimals: 2, space: true })}
            title={t('summary.totalDemand')}
            subtitle={t('summary.totalDemandSub')}
            className="bg-emerald-50 border-emerald-200 text-emerald-700"
          />
          <SummaryCard
            icon={TrendingUp}
            value={formatLakh(summary.totalCollection, { decimals: 2, space: true })}
            title={t('summary.totalCollection')}
            subtitle={t('summary.collectionRate', {
              rate: formatPercent(summary.collectionRatePercent),
            })}
            className="bg-purple-50 border-purple-200 text-purple-700"
          />
        </div>

        {/* Distribution */}
        <Card className="border-emerald-200">
          <CardHeader>
            <CardTitle className="text-xl">{t('distribution.title')}</CardTitle>
          </CardHeader>

          <CardContent>
            {overview.categoryDistribution.length > 0 ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-4 gap-4">
                {overview.categoryDistribution.map((item, index) => (
                  <RevenueCategoryCard
                    key={item.assetCategoryId}
                    item={item}
                    index={index}
                    icon={iconForCategory(item.valuationType)}
                    labels={categoryLabels}
                    onClick={() => openCategory(item.assetCategoryId)}
                  />
                ))}
              </div>
            ) : (
              <p className="py-6 text-center text-sm text-slate-500">{t('distribution.empty')}</p>
            )}
          </CardContent>
        </Card>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-0">
              <MonthlyRevenueTrendScreen
                data={overview.monthlyTrend}
                title={t('trend.title')}
                collectedLabel={t('trend.collected')}
                pendingLabel={t('trend.pending')}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <ZoneWiseDemandCollection
                data={overview.zoneStats}
                title={t('zones.title')}
                totalDemandLabel={t('zones.totalDemand')}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
