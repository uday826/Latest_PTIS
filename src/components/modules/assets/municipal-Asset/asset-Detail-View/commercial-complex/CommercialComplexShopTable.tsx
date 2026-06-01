"use client";

import React from 'react';
import { Store, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Select, SearchInput, Table, Badge, StatusBadge, Button } from '@/components/common';
import { useTranslations } from 'next-intl';
import type { AssetDetailController, CommercialComplexShopRow } from '@/types/asset-types/asset-detail-view-types/asset-detail-view-types';
import { useCommercialComplexShopTable } from '@/hooks/asset-hooks/asset-detail-view-hooks/useCommercialComplexShopTable';
import type { TableColumn } from '@/types/common.types';
import { cn } from '@/lib/utils/cn';

export function CommercialComplexShopTable({ controller }: { controller: AssetDetailController }): React.JSX.Element | null {
  const { asset } = controller;
  const t = useTranslations('municipalAsset');

  const {
    shopSortColumn,
    shopSortDirection,
    shopSearchQuery,
    setShopSearchQuery,
    selectedFloorFilter,
    setSelectedFloorFilter,
    currentShopPage,
    setCurrentShopPage,
    shopsPerPage,
    availableFloors,
    filteredShops,
    paginatedShops,
    totalShopPages,
    handleShopSort
  } = useCommercialComplexShopTable(asset?.shopDetails);

  const floorOptions = React.useMemo(() => {
    return availableFloors.map((floor) => ({
      label: floor === 'All' ? t('shopTable.allFloors') : floor,
      value: floor,
    }));
  }, [availableFloors, t]);

  const columns = React.useMemo<TableColumn<CommercialComplexShopRow>[]>(() => [
    {
      key: 'srNo',
      label: t('shopTable.cols.srNo'),
      render: (_, row: CommercialComplexShopRow): React.JSX.Element => {
        const indexInPage = paginatedShops.findIndex((s: CommercialComplexShopRow) => s.id === row.id);
        const globalIndex = ((currentShopPage - 1) * shopsPerPage) + indexInPage + 1;
        return <span className="text-slate-800 font-medium text-xs">{globalIndex}</span>;
      }
    },
    {
      key: 'id',
      label: t('shopTable.cols.assetId'),
      render: (val: unknown): React.JSX.Element => (
        <span className="text-xs font-mono text-slate-700">
          {String(val || '-')}
        </span>
      )
    },
    {
      key: 'floorName',
      label: t('shopTable.cols.floor'),
      render: (val: unknown): React.JSX.Element => (
        <Badge variant="default" size="sm" className="rounded text-xs font-medium px-2 py-0.5 bg-blue-100 text-blue-700 border-transparent h-auto min-h-0">
          {String(val || '-')}
        </Badge>
      )
    },
    {
      key: 'shopNumber',
      label: (
        <div
          className="flex items-center gap-1 cursor-pointer select-none"
          onClick={(): void => handleShopSort('shopNumber')}
        >
          <span>{t('shopTable.cols.shopNo')}</span>
          {shopSortColumn === 'shopNumber' ? (
            shopSortDirection === 'asc' ? (
              <ArrowUp className="w-3 h-3 text-blue-600" />
            ) : (
              <ArrowDown className="w-3 h-3 text-blue-600" />
            )
          ) : (
            <ArrowUpDown className="w-3 h-3 text-slate-400" />
          )}
        </div>
      ) as unknown as string,
      render: (val: unknown): React.JSX.Element => <span className="font-semibold text-slate-900 text-xs">{String(val || '-')}</span>
    },
    {
      key: 'shopName',
      label: t('shopTable.cols.shopName'),
      render: (val: unknown): React.JSX.Element => <span className="text-slate-900 text-xs">{String(val || '-')}</span>
    },
    {
      key: 'builtUpArea',
      label: t('shopTable.cols.area'),
      render: (val: unknown): React.JSX.Element => <span className="text-slate-900 text-xs">{String(val || '-')}</span>
    },
    {
      key: 'occupier',
      label: t('shopTable.cols.occupier'),
      render: (_, row: CommercialComplexShopRow): React.JSX.Element => {
        if (row.occupancyStatus === 'Occupied') {
          return <span className="font-medium text-slate-800 text-xs">{row.renterEnglishName || '-'}</span>;
        }
        return (
          <Badge
            variant="destructive"
            size="sm"
            className="rounded-full text-xs font-medium px-2 py-1 bg-red-100 text-red-700 border-transparent h-auto min-h-0"
          >
            {t('shopTable.status.vacant')}
          </Badge>
        );
      }
    },
    {
      key: 'contact',
      label: t('shopTable.cols.contact'),
      render: (_, row: CommercialComplexShopRow): React.JSX.Element => {
        if (row.occupancyStatus === 'Occupied') {
          return <span className="text-slate-900 text-xs">{row.renterMobile || '-'}</span>;
        }
        return <span className="text-slate-00 text-xs">-</span>;
      }
    },
    {
      key: 'demandRent',
      label: t('shopTable.cols.annualRent'),
      render: (_, row: CommercialComplexShopRow): React.JSX.Element => {
        if (row.occupancyStatus === 'Occupied' && row.demandRent && row.demandRent > 0) {
          return <span className="text-green-600 font-semibold text-xs">₹{row.demandRent.toLocaleString()}</span>;
        }
        return <span className="text-slate-400 text-xs">-</span>;
      }
    },
    {
      key: 'agreementPeriod',
      label: t('shopTable.cols.agreementPeriod'),
      render: (_, row: CommercialComplexShopRow): React.JSX.Element => {
        if (row.occupancyStatus === 'Occupied' && row.leaseFromDate && row.leaseToDate) {
          try {
            const start = new Date(row.leaseFromDate).getTime();
            const end = new Date(row.leaseToDate).getTime();
            const diffYears = Math.ceil((end - start) / (1000 * 60 * 60 * 24 * 365));
            return (
              <div className="text-xs">
                <span className="text-slate-900 block">{row.leaseFromDate}</span>
                <span className="text-slate-500 block text-[10px]">{t('shopTable.years', { count: diffYears })}</span>
              </div>
            );
          } catch {
            return <span className="text-slate-400 text-xs">-</span>;
          }
        }
        return <span className="text-slate-400 text-xs">-</span>;
      }
    },
    {
      key: 'balanceAmount',
      label: t('shopTable.cols.status'),
      render: (val: unknown): React.JSX.Element => {
        const valNum = val as number;
        if (valNum === 0 || valNum > 0) {
          return (
            <StatusBadge
              value={valNum === 0}
              activeLabel={t('shopTable.status.paid')}
              inactiveLabel={t('shopTable.status.pending')}
            />
          );
        }
        return (
          <Badge
            variant="secondary"
            size="sm"
            className="rounded-full text-xs font-medium px-2 py-1 bg-gray-100 text-gray-700 border-transparent h-auto min-h-0"
          >
            -
          </Badge>
        );
      }
    },
    {
      key: 'condition',
      label: t('shopTable.cols.condition'),
      render: (val: unknown): React.JSX.Element => {
        const condition = String(val || '');
        const localizedCondition =
          condition === 'Excellent' ? t('shopTable.conditionLabels.excellent') :
            condition === 'Good' ? t('shopTable.conditionLabels.good') :
              condition === 'Fair' ? t('shopTable.conditionLabels.fair') :
                condition ? condition : t('statusBar.notAvailableShort');
        const badgeColor =
          condition === 'Excellent' ? 'bg-green-100 text-green-700' :
            condition === 'Good' ? 'bg-blue-100 text-blue-700' :
              condition === 'Fair' ? 'bg-yellow-100 text-yellow-700' :
                'bg-orange-100 text-orange-700';
        return (
          <Badge
            size="sm"
            className={cn("rounded-full border-transparent h-auto min-h-0 text-xs font-medium px-2 py-1", badgeColor)}
          >
            {localizedCondition}
          </Badge>
        );
      }
    }
  ], [paginatedShops, currentShopPage, shopsPerPage, t, shopSortColumn, shopSortDirection, handleShopSort]);

  if (!asset || !asset.shopDetails) return null;

  return (
    <Card className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden" padding="none">
      <CardHeader className="mb-0 bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-200 px-3 py-2">
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="text-sm font-semibold text-slate-800 flex items-center gap-2">
            <Store className="w-4 h-4 text-emerald-600" />
            {t('shopTable.title')}
          </CardTitle>

          {/* Floor Filter and Search Bar */}
          <div className="flex items-center gap-3">
            {/* Floor Filter Dropdown */}
            <Select
              options={floorOptions}
              value={selectedFloorFilter}
              onChange={(val): void => {
                setSelectedFloorFilter(val);
                setCurrentShopPage(1);
              }}
              selectSize="sm"
              className="w-36 text-xs"
            />

            {/* Search Bar */}
            <SearchInput
              value={shopSearchQuery}
              onChange={(val): void => {
                setShopSearchQuery(val);
                setCurrentShopPage(1);
              }}
              placeholder={t('shopTable.searchPlaceholder')}
              className="mb-0 w-60 text-xs"
              showClear={true}
            />

            <span className="text-xs text-gray-600 whitespace-nowrap">
              {filteredShops.length > 0
                ? t('shopTable.showingEntries', {
                  start: ((currentShopPage - 1) * shopsPerPage) + 1,
                  end: Math.min(currentShopPage * shopsPerPage, filteredShops.length),
                  total: filteredShops.length
                })
                : t('shopTable.noShopsFound')}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto text-xs">
          <Table
            data={paginatedShops}
            columns={columns}
            emptyMessage={t('shopTable.noShopsFound')}
            className="text-xs [&_td]:px-3 [&_td]:py-2 [&_th]:px-3 [&_th]:py-2 [&_td]:text-xs [&_th]:text-xs [&_td]:text-center [&_th]:text-center [&_th]:normal-case [&_th]:font-semibold [&_th]:text-slate-800"
          />
        </div>

        {/* Pagination Controls */}
        {totalShopPages > 1 && (
          <div className="bg-gray-50 border-t border-gray-200 px-4 py-3 flex items-center justify-between">
            <div className="text-xs text-gray-600">
              {t('shopTable.pageInfo', { current: currentShopPage, total: totalShopPages })}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={(): void => setCurrentShopPage(prev => Math.max(1, prev - 1))}
                disabled={currentShopPage === 1}
                className="px-3 py-1 text-xs font-semibold"
              >
                {t('shopTable.previous')}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={(): void => setCurrentShopPage(prev => Math.min(totalShopPages, prev + 1))}
                disabled={currentShopPage === totalShopPages}
                className="px-3 py-1 text-xs font-semibold"
              >
                {t('shopTable.next')}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
