'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { Card } from '@/components/common/Card';
import { DashboardLayout } from '../DashboardLayout';
import { RevenueFilters } from './RevenueFilters';
import { useRevenueUrlFilters } from '@/hooks/useRevenueUrlFilters';
import { Select } from '@/components/common/select';
import { MasterTable, Column } from '@/components/common/MasterTable';
import { Tabs } from '@/components/common/Tabs';
import { cn } from '@/lib/utils/cn';
import { formatINR, formatLakh } from '@/lib/utils/asset-utils/revenue-format';
import {
  LayoutDashboard,
  MapPin,
  ShoppingBag,
  Building2,
  Home,
  Car,
  ArrowLeft,
  Filter,
  Search,
} from 'lucide-react';
import type {
  AssetRevenueListItem,
  RevenueCategoryDistribution,
  RevenueRecordsData,
} from '@/types/asset-type/revenue-dashboard.types';

const VALUATION_ICON: Record<string, React.ElementType> = {
  LAND: MapPin,
  BUILDING: ShoppingBag,
  INFRASTRUCTURE: Building2,
  MOVABLE: Car,
  GENERIC: Home,
};

const ALL = 'all';

function iconForCategory(valuationType: string): React.ElementType {
  return VALUATION_ICON[valuationType?.toUpperCase()] ?? Building2;
}

/* -------------------------------------------------------------------------- */
/* Presentational sub-components                                               */
/* -------------------------------------------------------------------------- */

const SummaryCard: React.FC<{
  title: string;
  value: string | number;
  variant: 'default' | 'success' | 'purple' | 'warning';
}> = ({ title, value, variant }) => {
  const variants = {
    default: 'bg-blue-50 border-blue-100 text-blue-700',
    success: 'bg-green-50 border-green-100 text-green-700',
    purple: 'bg-purple-50 border-purple-100 text-purple-700',
    warning: 'bg-orange-50 border-orange-100 text-orange-700',
  };
  const valueColor = {
    default: 'text-blue-900',
    success: 'text-green-900',
    purple: 'text-purple-900',
    warning: 'text-orange-900',
  };

  return (
    <Card variant="default" padding="md" className={cn('border-l-4', variants[variant])}>
      <p className="text-sm font-medium mb-1">{title}</p>
      <p className={cn('text-2xl font-bold', valueColor[variant])}>{value}</p>
    </Card>
  );
};

const StatusBadge: React.FC<{ status: string; paidLabel: string; unpaidLabel: string }> = ({
  status,
  paidLabel,
  unpaidLabel,
}) => {
  const isPaid = status?.toLowerCase() === 'paid';
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      )}
    >
      {isPaid ? paidLabel : unpaidLabel}
    </span>
  );
};

const LeaseTypeBadge: React.FC<{ type: string }> = ({ type }) => {
  const isLease = type?.toLowerCase() === 'lease';
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        isLease ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
      )}
    >
      {type}
    </span>
  );
};

/* -------------------------------------------------------------------------- */
/* Main view                                                                   */
/* -------------------------------------------------------------------------- */

interface RevenueAssetRecordsViewProps {
  data?: RevenueRecordsData;
  searchTerm?: string;
}

export default function RevenueAssetRecordsView({ data, searchTerm = '' }: RevenueAssetRecordsViewProps) {
  const router = useRouter();
  const t = useTranslations('revenueDashboard');
  const { isPending, setParams, searchParams } = useRevenueUrlFilters();
  const [searchInput, setSearchInput] = useState(searchTerm);

  if (!data) {
    return (
      <DashboardLayout>
        <Card className="border-red-200 bg-red-50">
          <p className="py-10 text-center text-sm font-medium text-red-700">{t('errors.loadFailed')}</p>
        </Card>
      </DashboardLayout>
    );
  }

  const { categories, summary, list, zones, wards, selectedCategoryId } = data;

  const totalAssets = categories.reduce((sum, c) => sum + c.assetCount, 0);
  const activeCategory: RevenueCategoryDistribution | null =
    selectedCategoryId != null
      ? categories.find((c) => c.assetCategoryId === selectedCategoryId) ?? null
      : null;

  // Money cards: scoped to the selected category, or the whole portfolio for "All".
  // The "Total" card is driven by the list's totalCount (below) so it always matches the
  // records actually shown — never the raw asset count.
  const stats = activeCategory
    ? {
      demand: activeCategory.demand,
      collected: activeCategory.collection,
      pending: activeCategory.unpaidCount,
    }
    : {
      demand: summary.totalDemand,
      collected: summary.totalCollection,
      pending: summary.unpaidLeaseCount,
    };

  const headerName = activeCategory ? activeCategory.categoryName : t('records.allCategories');

  const currentType = (searchParams.get('type') as string) || ALL;
  const currentStatus = (searchParams.get('status') as string) || ALL;
  const currentZoneId = searchParams.get('zoneId') ? Number(searchParams.get('zoneId')) : null;
  const currentWardId = searchParams.get('wardId') ? Number(searchParams.get('wardId')) : null;

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setParams({ q: searchInput.trim() || null }, { resetPage: true });
  };

  const startIndex = (list.pageNumber - 1) * list.pageSize;

  const columns: Column<any>[] = [
    {
      key: 'srNo',
      label: t('records.cols.srNo'),
      width: '80px',
      render: (_, row, rowIndex) => startIndex + rowIndex + 1,
    },
    {
      key: 'assetNo',
      label: t('records.cols.assetId'),
      cellClassName: 'font-semibold text-blue-600',
    },
    {
      key: 'assetName',
      label: t('records.cols.assetName'),
    },
    {
      key: 'zoneName',
      label: t('records.cols.zone'),
    },
    {
      key: 'wardName',
      label: t('records.cols.ward'),
    },
    {
      key: 'leaseType',
      label: t('records.cols.leaseType'),
      render: (val) => <LeaseTypeBadge type={String(val)} />,
    },
    {
      key: 'tenantName',
      label: t('records.cols.tenant'),
    },
    {
      key: 'paymentStatus',
      label: t('records.cols.status'),
      render: (val) => (
        <StatusBadge
          status={String(val)}
          paidLabel={t('records.statusPaid')}
          unpaidLabel={t('records.statusUnpaid')}
        />
      ),
    },
    {
      key: 'monthlyRent',
      label: t('records.cols.rent'),
      align: 'right',
      cellClassName: 'font-medium text-right',
      render: (val) => formatINR(Number(val)),
    },
  ];

  return (
    <DashboardLayout
      loading={isPending}
    >
      <div className="bg-gray-50 flex rounded-xl overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 bg-white border-r border-gray-200 flex-shrink-0 hidden lg:block">
          <div className="p-6">
            <button
              type="button"
              onClick={() => router.push('/assets/dashboard/revenue-dashboard')}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('records.backToDashboard')}
            </button>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">{t('records.totalLeasedAssets')}</h2>
              <p className="text-sm text-gray-500">{t('records.assetCategories')}</p>
            </div>
            <Tabs
              value={selectedCategoryId == null ? 'all' : selectedCategoryId}
              onChange={(val) => setParams({ category: val === 'all' ? null : Number(val) }, { resetPage: true })}
              orientation="vertical"
              variant="pills"
              className="space-y-2 w-full"
            >
              <Tabs.TabList className="flex flex-col gap-2 w-full border-none p-0 bg-transparent">
                <Tabs.Tab
                  value="all"
                  className={cn(
                    "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 border-none [&>span]:w-full [&>span]:flex [&>span]:items-center",
                    selectedCategoryId == null ? "bg-blue-600 text-white shadow-md hover:text-white" : "text-gray-700 hover:bg-gray-100 hover:text-gray-700"
                  )}
                >
                  <div className="flex items-center justify-between gap-3 w-full">
                    <div className="flex items-center gap-3">
                      <LayoutDashboard className={cn('w-5 h-5 shrink-0', selectedCategoryId == null ? 'text-white' : 'text-gray-500')} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold truncate leading-tight">{t('records.allCategories')}</div>
                        <div className={cn('text-xs truncate font-normal leading-normal mt-0.5', selectedCategoryId == null ? 'text-blue-100' : 'text-gray-500')}>
                          {t('records.allCategoriesCount', { count: totalAssets })}
                        </div>
                      </div>
                    </div>
                    <span className={cn('text-xs font-semibold px-2 py-1 rounded-full shrink-0', selectedCategoryId == null ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600')}>
                      {totalAssets}
                    </span>
                  </div>
                </Tabs.Tab>

                {categories.map((category) => {
                  const Icon = iconForCategory(category.valuationType);
                  const isActive = selectedCategoryId === category.assetCategoryId;
                  return (
                    <Tabs.Tab
                      key={category.assetCategoryId}
                      value={category.assetCategoryId}
                      className={cn(
                        "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 border-none [&>span]:w-full [&>span]:flex [&>span]:items-center",
                        isActive ? "bg-blue-600 text-white shadow-md hover:text-white" : "text-gray-700 hover:bg-gray-100 hover:text-gray-700"
                      )}
                    >
                      <div className="flex items-center justify-between gap-3 w-full">
                        <div className="flex items-center gap-3">
                          <Icon className={cn('w-5 h-5 shrink-0', isActive ? 'text-white' : 'text-gray-500')} />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold truncate leading-tight">{category.categoryName}</div>
                            <div className={cn('text-xs truncate font-normal leading-normal mt-0.5', isActive ? 'text-blue-100' : 'text-gray-500')}>
                              {category.categoryCode}
                            </div>
                          </div>
                        </div>
                        <span className={cn('text-xs font-semibold px-2 py-1 rounded-full shrink-0', isActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600')}>
                          {category.assetCount}
                        </span>
                      </div>
                    </Tabs.Tab>
                  );
                })}
              </Tabs.TabList>
            </Tabs>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 flex flex-col min-w-0">
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{headerName}</h1>
                <p className="text-sm text-gray-500 mt-1">{t('records.subtitle', { name: headerName })}</p>
              </div>
              <form onSubmit={submitSearch} className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder={t('records.searchPlaceholder')}
                  className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm w-64 text-slate-800 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                  aria-label={t('records.searchPlaceholder')}
                />
              </form>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-700">
                <Filter className="w-4 h-4" />
                <span className="text-sm font-semibold">{t('filters.label')}:</span>
              </div>
              <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl">
                <Select
                  ariaLabel={t('filters.zone')}
                  placeholder={t('filters.zone')}
                  options={[
                    { label: t('filters.zone'), value: ALL },
                    ...zones.map((zone) => ({ label: zone.label, value: String(zone.id) })),
                  ]}
                  value={currentZoneId == null ? ALL : String(currentZoneId)}
                  onChange={(e, val) =>
                    setParams(
                      { zoneId: val === ALL ? null : Number(val), wardId: null },
                      { resetPage: true }
                    )
                  }
                  className="w-full"
                />

                <Select
                  ariaLabel={t('filters.ward')}
                  placeholder={t('filters.ward')}
                  options={[
                    { label: t('filters.ward'), value: ALL },
                    ...wards.map((ward) => ({ label: ward.label, value: String(ward.id) })),
                  ]}
                  value={currentWardId == null ? ALL : String(currentWardId)}
                  onChange={(e, val) =>
                    setParams({ wardId: val === ALL ? null : Number(val) }, { resetPage: true })
                  }
                  className="w-full"
                />

                <Select
                  ariaLabel={t('filters.type')}
                  placeholder={t('filters.allTypes')}
                  options={[
                    { label: t('filters.allTypes'), value: ALL },
                    { label: t('cards.lease'), value: 'Lease' },
                    { label: t('cards.rent'), value: 'Rent' },
                  ]}
                  value={currentType}
                  onChange={(e, val) => setParams({ type: val }, { resetPage: true })}
                  className="w-full"
                />

                <Select
                  ariaLabel={t('filters.status')}
                  placeholder={t('filters.allStatuses')}
                  options={[
                    { label: t('filters.allStatuses'), value: ALL },
                    { label: t('records.statusPaid'), value: 'Paid' },
                    { label: t('records.statusUnpaid'), value: 'Unpaid' },
                  ]}
                  value={currentStatus}
                  onChange={(e, val) => setParams({ status: val }, { resetPage: true })}
                  className="w-full"
                />
              </div>
            </div>
          </header>

          <div className="flex-1 p-6 overflow-auto">
            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <SummaryCard title={t('records.total')} value={list.totalCount} variant="default" />
              <SummaryCard title={t('cards.demand')} value={formatLakh(stats.demand, { space: true })} variant="success" />
              <SummaryCard title={t('records.collected')} value={formatLakh(stats.collected, { space: true })} variant="purple" />
              <SummaryCard title={t('records.pending')} value={stats.pending} variant="warning" />
            </div>

            {/* Table */}
            <MasterTable
              columns={columns}
              data={list.items as any}
              pageNumber={list.pageNumber}
              pageSize={list.pageSize}
              totalCount={list.totalCount}
              totalPages={list.totalPages}
              onPageChange={(page) => setParams({ pageNumber: page })}
              paginationConfig={{ enabled: true, showPageSizeSelector: false }}
              emptyText={t('records.empty')}
            />
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
}
