'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Search, IndianRupee, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/common/Card';
import { Button, MasterTable, SearchInput, Select, type Column } from '@/components/common';
import { StatusBadge } from '@/components/common/StatusBadge';
import type { PaymentRecordsPageData } from '@/app/[locale]/asset/revenue/payment/actions';
import type { PaymentRecord } from '@/types/asset/payment.types';

interface PaymentSectionProps {
  pageData: PaymentRecordsPageData;
}

type PaymentTableRow = PaymentRecord & Record<string, unknown>;

export function PaymentSection({ pageData }: PaymentSectionProps) {
  const t = useTranslations('AssetPayment.records');
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const { query, records, totalEntries, totalPages, startIndex } = pageData;
  const [smartSearch, setSmartSearch] = useState(query.search);

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

  const sortableHeader = (label: string, column: string) => (
    <button
      type="button"
      onClick={() => handleSort(column)}
      className="inline-flex items-center gap-1 text-left"
    >
      <span>{label}</span>
      {sortIcon(column)}
    </button>
  );

  const tableRows = records as PaymentTableRow[];

  const columns = useMemo<Column<PaymentTableRow>[]>(
    () => [
      {
        key: 'srNo',
        label: t('table.srNo'),
        align: 'center',
        render: (value, _row, rowIndex) => String(value ?? startIndex + rowIndex + 1),
      },
      { key: 'zone', label: sortableHeader(t('table.zone'), 'zone'), align: 'center' },
      { key: 'ward', label: sortableHeader(t('table.ward'), 'ward'), align: 'center' },
      { key: 'assetId', label: sortableHeader(t('table.assetId'), 'assetId'), align: 'center' },
      { key: 'complexName', label: sortableHeader(t('table.complex'), 'complexName') },
      { key: 'shopPlotNo', label: sortableHeader(t('table.shopPlot'), 'shopPlotNo'), align: 'center' },
      { key: 'assetName', label: sortableHeader(t('table.asset'), 'assetName') },
      { key: 'tenantName', label: sortableHeader(t('table.tenant'), 'tenantName') },
      { key: 'mobileNo', label: sortableHeader(t('table.mobile'), 'mobileNo'), align: 'center' },
      { key: 'leaseRentType', label: sortableHeader(t('table.type'), 'leaseRentType'), align: 'center' },
      {
        key: 'rentDueAmount',
        label: sortableHeader(t('table.amount'), 'rentDueAmount'),
        align: 'center',
        render: (value) => `₹${Number(value ?? 0).toLocaleString('en-IN')}`,
      },
      {
        key: 'status',
        label: sortableHeader(t('table.status'), 'status'),
        align: 'center',
        render: (value) => (
          <StatusBadge
            value={value === 'paid' ? 'true' : 'false'}
            activeLabel={t('status.paid')}
            inactiveLabel={t('status.unpaid')}
          />
        ),
      },
    ],
    [startIndex, t, query.sortBy, query.sortOrder]
  );

  return (
    <div className="space-y-3">
      <Card variant="bordered" padding="none" className="bg-white shadow-sm border-slate-200 overflow-hidden">
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

        <div className="p-0 pt-0">
          <MasterTable<PaymentTableRow>
            columns={columns}
            data={tableRows}
            pageNumber={query.pageNumber}
            pageSize={query.pageSize}
            totalCount={totalEntries}
            totalPages={totalPages}
            onPageChange={(page) => updateRoute({ PageNumber: String(page) })}
            onPageSizeChange={(size) => updateRoute({ PageSize: String(size), PageNumber: '1' })}
            paginationConfig={{ enabled: true, showPageSizeSelector: true }}
            pageSizeOptions={[5, 10, 20]}
            renderActions={(record) =>
              record.status === 'unpaid' ? (
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
              ) : null
            }
            actionLabel={t('table.action')}
            getRowKey={(record) => `${record.assetId}-${record.srNo}`}
            maxBodyHeightClassName="max-h-[calc(100vh-360px)]"
            tableClassName="text-xs text-slate-700 text-center"
            theadClassName="bg-[#1f2937] [&_th]:!text-white [&_th]:font-semibold [&_th]:text-xs [&_th]:px-3 [&_th]:py-2 [&_th:first-child]:!rounded-none [&_th:last-child]:!rounded-none"
            containerClassName="gap-0 [&>div]:!rounded-none [&>div]:!border-0 [&>div]:!shadow-none"
            footerClassName="!rounded-none"
          />
        </div>
      </Card>
    </div>
  );
}
