'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Search, IndianRupee, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/common/Card';
import { Button, SearchInput, Select } from '@/components/common';
import { FirstPageButton, LastPageButton, NextPageButton, PageNumberButton, PrevPageButton } from '@/components/common/ActionButtons';
import { StatusBadge } from '@/components/common/StatusBadge';
import type { PaymentRecordsPageData } from '@/app/[locale]/asset/revenue/payment/actions';

interface PaymentSectionProps {
  pageData: PaymentRecordsPageData;
}

const allOption = [{ label: 'All', value: 'all' }];

export function PaymentSection({ pageData }: PaymentSectionProps) {
  const t = useTranslations('AssetPayment.records');
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const { query, records, totalEntries, totalPages, startIndex, endIndex } = pageData;
  const [smartSearch, setSmartSearch] = useState(query.search);

  const pageNumbers = Array.from({ length: totalPages }, (_, idx) => idx + 1);
  const visiblePageNumbers = pageNumbers.filter((page) =>
    totalPages <= 5 ? true : Math.abs(page - query.pageNumber) <= 1 || page === 1 || page === totalPages
  );

  const listQueryString = (() => {
    const next = new URLSearchParams();
    next.set('PageSize', String(query.pageSize));
    next.set('PageNumber', String(query.pageNumber));
    next.set('Zone', query.zone);
    next.set('Ward', query.ward);
    next.set('LeaseRentType', query.leaseRentType);
    next.set('Status', query.status);
    if (query.search) next.set('Search', query.search);
    if (query.sortBy) next.set('SortBy', query.sortBy);
    if (query.sortOrder) next.set('SortOrder', query.sortOrder);
    return next.toString();
  })();

  const updateRoute = (updates: Record<string, string>) => {
    const merged = {
      PageSize: String(query.pageSize),
      PageNumber: String(query.pageNumber),
      Zone: query.zone,
      Ward: query.ward,
      LeaseRentType: query.leaseRentType,
      Status: query.status,
      Search: query.search,
      SortBy: query.sortBy,
      SortOrder: query.sortOrder,
      ...updates,
    };

    const next = new URLSearchParams();
    Object.entries(merged).forEach(([key, value]) => {
      if (key === 'PageSize' || key === 'PageNumber' || value) next.set(key, value);
    });

    router.push(`/${params.locale}/asset/revenue/payment?${next.toString()}`);
  };

  const handleSort = (column: string) => {
    if (query.sortBy !== column) {
      updateRoute({ SortBy: column, SortOrder: 'asc', PageNumber: '1' });
      return;
    }

    const nextOrder = query.sortOrder === 'asc' ? 'desc' : 'asc';
    updateRoute({ SortBy: column, SortOrder: nextOrder, PageNumber: '1' });
  };

  const sortIcon = (column: string) => {
    if (query.sortBy !== column) return <ArrowUpDown className="w-3 h-3 opacity-80" />;
    return query.sortOrder === 'asc' ? (
      <ArrowUp className="w-3 h-3 opacity-90" />
    ) : (
      <ArrowDown className="w-3 h-3 opacity-90" />
    );
  };

  return (
    <div className="space-y-3">
      <Card variant="bordered" padding="none" className="bg-white shadow-sm border-slate-200">
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-1">
            <Search className="w-4 h-4 text-blue-500" />
            <h2 className="text-sm font-bold text-slate-800">{t('searchFilterTitle')}</h2>
          </div>
          <p className="text-[10px] text-slate-500 font-medium mb-4">{t('searchFilterSubtitle')}</p>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-600">{t('filters.zone')}</label>
              <Select options={[{ label: t('filters.all'), value: 'all' }, ...pageData.zoneOptions]} value={query.zone} onChange={(_e, value) => updateRoute({ Zone: value, PageNumber: '1' })} placeholder={t('filters.select')} selectSize="sm" className="text-xs" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-600">{t('filters.ward')}</label>
              <Select options={[{ label: t('filters.all'), value: 'all' }, ...pageData.wardOptions]} value={query.ward} onChange={(_e, value) => updateRoute({ Ward: value, PageNumber: '1' })} placeholder={t('filters.select')} selectSize="sm" className="text-xs" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-600">{t('filters.assetCategory')}</label>
              <Select options={[{ label: t('filters.all'), value: 'all' }]} value="all" placeholder={t('filters.allCategories')} selectSize="sm" className="text-xs" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-600">{t('filters.leaseRentType')}</label>
              <Select options={[{ label: t('filters.all'), value: 'all' }, ...pageData.leaseRentTypeOptions]} value={query.leaseRentType} onChange={(_e, value) => updateRoute({ LeaseRentType: value, PageNumber: '1' })} placeholder={t('filters.allTypes')} selectSize="sm" className="text-xs" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-600">{t('filters.paymentStatus')}</label>
              <Select options={[{ label: t('filters.all'), value: 'all' }, ...pageData.statusOptions]} value={query.status} onChange={(_e, value) => updateRoute({ Status: value, PageNumber: '1' })} placeholder={t('filters.allStatus')} selectSize="sm" className="text-xs" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-600">{t('filters.smartSearch')}</label>
              <div className="flex gap-2">
                <SearchInput value={smartSearch} onChange={setSmartSearch} placeholder={t('filters.smartSearchPlaceholder')} className="mb-0 w-full" />
                <Button onClick={() => updateRoute({ Search: smartSearch.trim(), PageNumber: '1' })} variant="primary" size="sm" className="h-9 px-4 text-xs font-bold rounded-lg">{t('filters.search')}</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-100 text-left text-xs text-slate-700">
            <thead>
              <tr className="bg-[#1f2937] text-white font-semibold text-[10px] leading-tight">
                <th className="px-4 py-3 border border-gray-100">{t('table.srNo')}</th>
                <th className="px-4 py-3 border border-gray-100 cursor-pointer" onClick={() => handleSort('zone')}><span className="inline-flex items-center gap-1">{t('table.zone')} {sortIcon('zone')}</span></th>
                <th className="px-4 py-3 border border-gray-100 cursor-pointer" onClick={() => handleSort('ward')}><span className="inline-flex items-center gap-1">{t('table.ward')} {sortIcon('ward')}</span></th>
                <th className="px-4 py-3 border border-gray-100 cursor-pointer" onClick={() => handleSort('assetId')}><span className="inline-flex items-center gap-1">{t('table.assetId')} {sortIcon('assetId')}</span></th>
                <th className="px-4 py-3 border border-gray-100 cursor-pointer" onClick={() => handleSort('complexName')}><span className="inline-flex items-center gap-1">{t('table.complex')} {sortIcon('complexName')}</span></th>
                <th className="px-4 py-3 border border-gray-100 cursor-pointer" onClick={() => handleSort('shopPlotNo')}><span className="inline-flex items-center gap-1">{t('table.shopPlot')} {sortIcon('shopPlotNo')}</span></th>
                <th className="px-4 py-3 border border-gray-100 cursor-pointer" onClick={() => handleSort('assetName')}><span className="inline-flex items-center gap-1">{t('table.asset')} {sortIcon('assetName')}</span></th>
                <th className="px-4 py-3 border border-gray-100 cursor-pointer" onClick={() => handleSort('tenantName')}><span className="inline-flex items-center gap-1">{t('table.tenant')} {sortIcon('tenantName')}</span></th>
                <th className="px-4 py-3 border border-gray-100 cursor-pointer" onClick={() => handleSort('mobileNo')}><span className="inline-flex items-center gap-1">{t('table.mobile')} {sortIcon('mobileNo')}</span></th>
                <th className="px-4 py-3 border border-gray-100 cursor-pointer" onClick={() => handleSort('leaseRentType')}><span className="inline-flex items-center gap-1">{t('table.type')} {sortIcon('leaseRentType')}</span></th>
                <th className="px-4 py-3 border border-gray-100 cursor-pointer" onClick={() => handleSort('rentDueAmount')}><span className="inline-flex items-center gap-1">{t('table.amount')} {sortIcon('rentDueAmount')}</span></th>
                <th className="px-4 py-3 border border-gray-100 cursor-pointer" onClick={() => handleSort('status')}><span className="inline-flex items-center gap-1">{t('table.status')} {sortIcon('status')}</span></th>
                <th className="px-4 py-3 border border-gray-100">{t('table.action')}</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record, index) => (
                <tr key={`${record.assetId}-${record.srNo}`}>
                  <td className="px-4 py-3 border border-gray-100">{record.srNo || startIndex + index + 1}</td>
                  <td className="px-4 py-3 border border-gray-100">{record.zone}</td>
                  <td className="px-4 py-3 border border-gray-100">{record.ward}</td>
                  <td className="px-4 py-3 border border-gray-100">{record.assetId}</td>
                  <td className="px-4 py-3 border border-gray-100">{record.complexName}</td>
                  <td className="px-4 py-3 border border-gray-100">{record.shopPlotNo}</td>
                  <td className="px-4 py-3 border border-gray-100">{record.assetName}</td>
                  <td className="px-4 py-3 border border-gray-100">{record.tenantName}</td>
                  <td className="px-4 py-3 border border-gray-100">{record.mobileNo}</td>
                  <td className="px-4 py-3 border border-gray-100">{record.leaseRentType}</td>
                  <td className="px-4 py-3 border border-gray-100">{'\u20B9'}{record.rentDueAmount.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 border border-gray-100">
                    <StatusBadge
                      value={record.status === 'paid' ? 'true' : 'false'}
                      activeLabel={t('status.paid')}
                      inactiveLabel={t('status.unpaid')}
                    />
                  </td>
                  <td className="px-4 py-3 border border-gray-100">
                    {record.status === 'unpaid' && (
                      <Button
                        onClick={() => {
                          const next = new URLSearchParams(listQueryString);
                          next.set('srNo', String(record.srNo));
                          next.set('assetId', record.assetId);
                          router.push(`/${params.locale}/asset/revenue/payment/details?${next.toString()}`);
                        }}
                        variant="success"
                        size="xs"
                        icon={IndianRupee}
                      >
                        {t('table.pay')}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 font-medium">{t('pagination.rowsPerPage')}</span>
            <Select options={[{ label: '5', value: '5' }, { label: '10', value: '10' }, { label: '20', value: '20' }]} value={String(query.pageSize)} onChange={(_e, value) => updateRoute({ PageSize: value, PageNumber: '1' })} selectSize="sm" className="w-20" />
            <span className="text-xs text-slate-500 ml-2">{t('pagination.showingEntries', { start: totalEntries === 0 ? 0 : startIndex + 1, end: endIndex, total: totalEntries })}</span>
          </div>

          <div className="flex items-center gap-1">
            <FirstPageButton onClick={() => updateRoute({ PageNumber: '1' })} disabled={query.pageNumber === 1} className="h-7 min-w-[36px] px-2" />
            <PrevPageButton onClick={() => updateRoute({ PageNumber: String(Math.max(1, query.pageNumber - 1)) })} disabled={query.pageNumber === 1} className="h-7 min-w-[36px] px-2" />
            {visiblePageNumbers.map((page, idx) => {
              const prev = visiblePageNumbers[idx - 1];
              const showGap = idx > 0 && prev !== undefined && page - prev > 1;
              return (
                <React.Fragment key={page}>
                  {showGap && <span className="text-slate-400 text-xs px-1">...</span>}
                  <PageNumberButton page={page} active={page === query.pageNumber} onClick={() => updateRoute({ PageNumber: String(page) })} />
                </React.Fragment>
              );
            })}
            <NextPageButton onClick={() => updateRoute({ PageNumber: String(Math.min(totalPages, query.pageNumber + 1)) })} disabled={query.pageNumber === totalPages} className="h-7 min-w-[36px] px-2" />
            <LastPageButton onClick={() => updateRoute({ PageNumber: String(totalPages) })} disabled={query.pageNumber === totalPages} className="h-7 min-w-[36px] px-2" />
          </div>
        </div>
      </Card>
    </div>
  );
}
