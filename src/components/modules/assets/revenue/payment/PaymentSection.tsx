'use client';

import { useMemo, useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { useTranslations } from 'next-intl';
import { Search, IndianRupee, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/common/Card';
import { Button, MasterTable, SearchInput, SearchSelect, type Column } from '@/components/common';
import { StatusBadge } from '@/components/common/StatusBadge';
import type { PaymentFilterOptions, PaymentRecordRow, PaymentRecordsPageData } from '@/app/[locale]/assets/revenue/payment/actions';

interface PaymentSectionProps {
  pageData?: PaymentRecordsPageData;
  filterOptions?: PaymentFilterOptions;
}

const DEFAULT_PAGE_DATA: PaymentRecordsPageData = {
  query: {
    pageSize: 10,
    pageNumber: 1,
    zone: 'all',
    ward: 'all',
    assetCategory: 'all',
    leaseRentType: 'all',
    status: 'all',
    search: '',
    sortBy: '',
    sortOrder: 'asc',
  },
  records: [],
  totalEntries: 0,
  totalPages: 1,
  startIndex: 0,
  endIndex: 0,
};

const DEFAULT_FILTER_OPTIONS: PaymentFilterOptions = {
  zoneOptions: [],
  wardOptions: [],
  assetCategoryOptions: [],
};

const LEASE_RENT_TYPE_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Lease', value: 'lease' },
  { label: 'Rent', value: 'rent' },
];

const PAYMENT_STATUS_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Paid', value: 'paid' },
  { label: 'Unpaid', value: 'unpaid' },
  { label: 'Partial', value: 'partial' },
];

type PaymentTableRow = PaymentRecordRow & Record<string, unknown>;

export function PaymentSection({
  pageData = DEFAULT_PAGE_DATA,
  filterOptions = DEFAULT_FILTER_OPTIONS,
}: PaymentSectionProps) {
  const t = useTranslations('AssetPayment.records');
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const { query, records, totalEntries, totalPages, startIndex } = pageData;
  const [smartSearch, setSmartSearch] = useState(query.search);
  const debouncedSearch = useDebounce(smartSearch, 500);

  useEffect(() => {
    if (debouncedSearch !== query.search) {
      updateRoute({ Search: debouncedSearch.trim(), PageNumber: '1' });
    }
  }, [debouncedSearch]);

  const listQueryString = (() => {
    const next = new URLSearchParams();
    next.set('PageSize', String(query.pageSize));
    next.set('PageNumber', String(query.pageNumber));
    next.set('ZoneId', query.zone);
    next.set('WardId', query.ward);
    next.set('AssetCategoryId', query.assetCategory);
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
      ZoneId: query.zone,
      WardId: query.ward,
      AssetCategoryId: query.assetCategory,
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

    router.push(`/${params.locale}/assets/revenue/payment?${next.toString()}`);
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
      { key: 'shopNo', label: sortableHeader(t('table.shopno'), 'shopNo'), align: 'center' },
      // { key: 'zone', label: sortableHeader(t('table.zone'), 'zone'), align: 'center', render: (value) => String(value ?? '-') },
      // { key: 'wardNo', label: sortableHeader(t('table.ward'), 'wardNo'), align: 'center', render: (value) => String(value ?? '-') },
      { key: 'shopName', label: sortableHeader(t('table.shopName'), 'shopName') },
      { key: 'tenantName', label: sortableHeader(t('table.tenant'), 'tenantName') },
      { key: 'tenantMobile', label: sortableHeader(t('table.mobile'), 'tenantMobile'), align: 'center' },
      { key: 'leaseType', label: sortableHeader(t('table.type'), 'leaseType'), align: 'center' },
      { key: 'leaseStartDate', label: sortableHeader(t('table.leaseStartDate'), 'leaseStartDate'), align: 'center' },
      { key: 'leaseEndDate', label: sortableHeader(t('table.leaseEndDate'), 'leaseEndDate'), align: 'center' },
      {
        key: 'rentDue',
        label: sortableHeader(t('table.amount'), 'rentDue'),
        align: 'center',
        render: (value) => `\u20B9${Number(value ?? 0).toLocaleString('en-IN')}`,
      },
      {
        key: 'status',
        label: sortableHeader(t('table.status'), 'status'),
        align: 'center',
        render: (value) => {
          const statusVal = String(value ?? '').trim();
          if (!statusVal || statusVal === '-') {
            return '-';
          }
          const lowerVal = statusVal.toLowerCase();
          if (lowerVal === 'pending' || lowerVal === 'partial') {
            return <StatusBadge variant="pending" label={statusVal} />;
          }
          const isPaid = lowerVal === 'paid';
          return (
            <StatusBadge
              value={isPaid ? 'true' : 'false'}
              activeLabel={statusVal}
              inactiveLabel={statusVal}
            />
          );
        },
      },
    ],
    [startIndex, t, query.sortBy, query.sortOrder]
  );

  const renderFilters = () => (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="space-y-1 text-left">
          <label className="text-[10px] font-bold text-slate-600">{t('filters.zone')}</label>
          <SearchSelect name="zone" options={[{ label: 'All', value: 'all' }, ...filterOptions.zoneOptions]} value={query.zone} onChange={(_, value) => updateRoute({ ZoneId: value, WardId: 'all', PageNumber: '1' })} placeholder={t('filters.select')} className="w-full" />
        </div>
        <div className="space-y-1 text-left">
          <label className="text-[10px] font-bold text-slate-600">{t('filters.ward')}</label>
          <SearchSelect name="ward" options={[{ label: 'All', value: 'all' }, ...filterOptions.wardOptions]} value={query.ward} onChange={(_, value) => updateRoute({ WardId: value, PageNumber: '1' })} placeholder={t('filters.select')} className="w-full" />
        </div>
        <div className="space-y-1 text-left">
          <label className="text-[10px] font-bold text-slate-600">{t('filters.assetCategory')}</label>
          <SearchSelect name="assetCategory" options={[{ label: 'All', value: 'all' }, ...filterOptions.assetCategoryOptions]} value={query.assetCategory} onChange={(_, value) => updateRoute({ AssetCategoryId: value, PageNumber: '1' })} placeholder={t('filters.allCategories')} className="w-full" />
        </div>
        <div className="space-y-1 text-left">
          <label className="text-[10px] font-bold text-slate-600">{t('filters.leaseRentType')}</label>
          <SearchSelect name="leaseRentType" options={LEASE_RENT_TYPE_OPTIONS} value={query.leaseRentType} onChange={(_, value) => updateRoute({ LeaseRentType: value, PageNumber: '1' })} placeholder={t('filters.allTypes')} className="w-full" />
        </div>
        <div className="space-y-1 text-left">
          <label className="text-[10px] font-bold text-slate-600">{t('filters.paymentStatus')}</label>
          <SearchSelect name="paymentStatus" options={PAYMENT_STATUS_OPTIONS} value={query.status} onChange={(_, value) => updateRoute({ Status: value, PageNumber: '1' })} placeholder={t('filters.allStatus')} className="w-full" />
        </div>
        <div className="space-y-1 text-left">
          <label className="text-[10px] font-bold text-slate-600">{t('filters.smartSearch')}</label>
          <SearchInput value={smartSearch} onChange={setSmartSearch} placeholder={t('filters.smartSearchPlaceholder')} className="mb-0 w-full" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full">
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
        headerExtra={renderFilters()}
        renderActions={(record) => {
          const statusLower = String(record.status).toLowerCase();
          return statusLower !== 'paid' ? (
            <Button
              onClick={() => {
                const next = new URLSearchParams(listQueryString);
                next.set('recordId', String(record.id));
                next.set('assetId', String(record.assetId));
                router.push(`/${params.locale}/assets/revenue/payment/details?${next.toString()}`);
              }}
              variant="success"
              size="xs"
              icon={IndianRupee}
            >
              {t('table.pay')}
            </Button>
          ) : null;
        }}
        actionLabel={t('table.action')}
        getRowKey={(record) => `${record.assetId}-${record.id}`}
        maxBodyHeightClassName="max-h-[calc(100vh-360px)]"
        tableClassName="text-sm text-slate-700 text-center"
      />
    </div>
  );
}
