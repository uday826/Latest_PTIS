'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { Card } from '@/components/common/Card';
import { DashboardLayout } from '../DashboardLayout';
import { RevenueFilters } from './RevenueFilters';
import { useRevenueUrlFilters } from '@/hooks/useRevenueUrlFilters';
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

const SidebarItem: React.FC<{
  icon: React.ElementType;
  name: string;
  description: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon: Icon, name, description, count, isActive, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left',
      isActive ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'
    )}
  >
    <Icon className={cn('w-5 h-5', isActive ? 'text-white' : 'text-gray-500')} />
    <div className="flex-1 min-w-0">
      <div className={cn('text-sm font-medium truncate', isActive ? 'text-white' : 'text-gray-900')}>
        {name}
      </div>
      <div className={cn('text-xs truncate', isActive ? 'text-blue-100' : 'text-gray-500')}>
        {description}
      </div>
    </div>
    <span
      className={cn(
        'text-xs font-semibold px-2 py-1 rounded-full',
        isActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
      )}
    >
      {count}
    </span>
  </button>
);

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

const SELECT_CLS =
  'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-slate-800 bg-white shadow-sm focus:border-blue-500 focus:outline-none';

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

  const renderRow = (item: AssetRevenueListItem, index: number) => (
    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{startIndex + index + 1}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{item.assetNo}</td>
      <td className="px-6 py-4 text-sm text-gray-900">{item.assetName}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.zoneName}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.wardName}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <LeaseTypeBadge type={item.leaseType} />
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">{item.tenantName}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge
          status={item.paymentStatus}
          paidLabel={t('records.statusPaid')}
          unpaidLabel={t('records.statusUnpaid')}
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
        {formatINR(item.monthlyRent)}
      </td>
    </tr>
  );

  return (
    <DashboardLayout
      loading={isPending}
      filters={
        <RevenueFilters
          zones={zones}
          wards={wards}
          selectedZoneId={currentZoneId}
          selectedWardId={currentWardId}
          onZoneChange={(zoneId) => setParams({ zoneId, wardId: null }, { resetPage: true })}
          onWardChange={(wardId) => setParams({ wardId }, { resetPage: true })}
          filtersLabel={t('filters.label')}
          allZonesLabel={t('filters.allZones')}
          allWardsLabel={t('filters.allWards')}
        />
      }
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

            <nav className="space-y-2">
              <SidebarItem
                icon={LayoutDashboard}
                name={t('records.allCategories')}
                description={t('records.allCategoriesCount', { count: totalAssets })}
                count={totalAssets}
                isActive={selectedCategoryId == null}
                onClick={() => setParams({ category: null }, { resetPage: true })}
              />
              {categories.map((category) => (
                <SidebarItem
                  key={category.assetCategoryId}
                  icon={iconForCategory(category.valuationType)}
                  name={category.categoryName}
                  description={category.categoryCode}
                  count={category.assetCount}
                  isActive={selectedCategoryId === category.assetCategoryId}
                  onClick={() => setParams({ category: category.assetCategoryId }, { resetPage: true })}
                />
              ))}
            </nav>
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
                <select
                  className={SELECT_CLS}
                  aria-label={t('filters.zone')}
                  value={currentZoneId == null ? ALL : String(currentZoneId)}
                  onChange={(e) =>
                    setParams(
                      { zoneId: e.target.value === ALL ? null : e.target.value, wardId: null },
                      { resetPage: true }
                    )
                  }
                >
                  <option value={ALL}>{t('filters.zone')}</option>
                  {zones.map((zone) => (
                    <option key={zone.id} value={zone.id}>
                      {zone.label}
                    </option>
                  ))}
                </select>

                <select
                  className={SELECT_CLS}
                  aria-label={t('filters.ward')}
                  value={currentWardId == null ? ALL : String(currentWardId)}
                  onChange={(e) =>
                    setParams({ wardId: e.target.value === ALL ? null : e.target.value }, { resetPage: true })
                  }
                >
                  <option value={ALL}>{t('filters.ward')}</option>
                  {wards.map((ward) => (
                    <option key={ward.id} value={ward.id}>
                      {ward.label}
                    </option>
                  ))}
                </select>

                <select
                  className={SELECT_CLS}
                  aria-label={t('filters.type')}
                  value={currentType}
                  onChange={(e) => setParams({ type: e.target.value }, { resetPage: true })}
                >
                  <option value={ALL}>{t('filters.allTypes')}</option>
                  <option value="Lease">{t('cards.lease')}</option>
                  <option value="Rent">{t('cards.rent')}</option>
                </select>

                <select
                  className={SELECT_CLS}
                  aria-label={t('filters.status')}
                  value={currentStatus}
                  onChange={(e) => setParams({ status: e.target.value }, { resetPage: true })}
                >
                  <option value={ALL}>{t('filters.allStatuses')}</option>
                  <option value="Paid">{t('records.statusPaid')}</option>
                  <option value="Unpaid">{t('records.statusUnpaid')}</option>
                </select>
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
            <Card variant="default" padding="none">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('records.cols.srNo')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('records.cols.assetId')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('records.cols.assetName')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('records.cols.zone')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('records.cols.ward')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('records.cols.leaseType')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('records.cols.tenant')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('records.cols.status')}</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('records.cols.rent')}</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {list.items.length > 0 ? (
                      list.items.map(renderRow)
                    ) : (
                      <tr>
                        <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                          <div className="flex flex-col items-center gap-2">
                            <Search className="w-8 h-8 text-gray-400" />
                            <p>{t('records.empty')}</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Pagination */}
            {list.totalCount > 0 && (
              <div className="mt-4 flex items-center justify-between px-6 py-3 bg-white border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-500">
                  {t('records.showing', {
                    from: startIndex + 1,
                    to: startIndex + list.items.length,
                    total: list.totalCount,
                  })}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                    disabled={!list.hasPrevious}
                    onClick={() => setParams({ pageNumber: list.pageNumber - 1 })}
                  >
                    {t('records.previous')}
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                    disabled={!list.hasNext}
                    onClick={() => setParams({ pageNumber: list.pageNumber + 1 })}
                  >
                    {t('records.next')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
}
