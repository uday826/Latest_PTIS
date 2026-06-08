'use client';

import { NextPageButton, PageNumberButton, PrevPageButton } from '@/components/common/ActionButtons';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/select';
import { StatusBadge } from '@/components/common/StatusBadge';
import type { LeaseRentPaymentHistoryItem } from '@/types/asset/leaseRentPayment.types';
import { Download, Eye, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

interface PaymentHistoryScreenProps {
  items: LeaseRentPaymentHistoryItem[];
}

export function PaymentHistoryScreen({ items }: PaymentHistoryScreenProps) {
  const t = useTranslations('AssetPayment.paymentHistory');
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(5);
  const [pageNumber, setPageNumber] = useState(1);

  const filteredRows = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) return items;

    return items.filter((row) =>
      row.receiptNo.toLowerCase().includes(normalizedSearch) ||
      row.paymentMode.toLowerCase().includes(normalizedSearch) ||
      row.paymentType.toLowerCase().includes(normalizedSearch) ||
      row.paymentStatus.toLowerCase().includes(normalizedSearch)
    );
  }, [items, searchTerm]);

  const totalEntries = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / pageSize));
  const safePage = Math.min(pageNumber, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalEntries);

  const pagedRows = useMemo(() => filteredRows.slice(startIndex, endIndex), [filteredRows, startIndex, endIndex]);

  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      <div className="p-4 bg-gradient-to-r from-indigo-900 to-indigo-700 text-white rounded-t-md">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-white">{t('title')}</h3>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col h-full">
        <div className="mb-4 ml-auto w-64">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-3.5 w-3.5 text-slate-400" />
            </span>
            <Input
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPageNumber(1);
              }}
              placeholder={t('searchPlaceholder')}
              className="w-full h-9 pl-9 pr-3 text-xs font-medium bg-white border-slate-200 rounded-full placeholder:text-slate-400 shadow-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <th className="px-4 py-3">{t('table.receiptNo')}</th>
                <th className="px-4 py-3">{t('table.finYear')}</th>
                <th className="px-4 py-3">{t('table.amount')}</th>
                <th className="px-4 py-3">{t('table.dateTime')}</th>
                <th className="px-4 py-3">{t('table.mode')}</th>
                <th className="px-4 py-3">{t('table.status')}</th>
                <th className="px-4 py-3 text-center">{t('table.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pagedRows.map((row) => {
                const paymentDate = new Date(row.paymentDate);
                const isValidDate = !Number.isNaN(paymentDate.getTime());
                const finYear = isValidDate ? String(paymentDate.getFullYear()) : '-';
                const date = isValidDate ? paymentDate.toLocaleDateString('en-CA') : '-';
                const time = isValidDate ? paymentDate.toLocaleTimeString('en-GB') : '-';
                const isPaid = row.paymentStatus.trim().toLowerCase() === 'paid';

                return (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-700">{row.receiptNo}</td>
                    <td className="px-4 py-3 text-slate-600">{finYear}</td>
                    <td className="px-4 py-3 font-bold text-emerald-600">{`₹${row.paidAmount.toLocaleString('en-IN')}`}</td>
                    <td className="px-4 py-3 text-slate-500">
                      <div>{date}</div>
                      <div className="text-[10px]">{time}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-blue-600 font-medium">{row.paymentMode}</span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge value={isPaid ? 'true' : 'false'} activeLabel={t('paid')} inactiveLabel={t('unpaid')} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50 transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                        <button className="p-1.5 rounded-md text-emerald-600 hover:bg-emerald-50 transition-colors"><Download className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-600 font-medium">{t('rowsPerPage')}</span>
            <Select
              options={[
                { label: '5', value: '5' },
                { label: '10', value: '10' },
                { label: '20', value: '20' },
              ]}
              value={String(pageSize)}
              onChange={(_e, value) => {
                const next = Number(value);
                if (!Number.isNaN(next) && next > 0) {
                  setPageSize(next);
                  setPageNumber(1);
                }
              }}
              selectSize="sm"
              className="w-20 [&>ul]:bottom-full [&>ul]:mb-1 [&>ul]:mt-0"
            />
            <span className="text-xs text-slate-500">{t('showingEntries', { start: totalEntries === 0 ? 0 : startIndex + 1, end: endIndex, total: totalEntries })}</span>
          </div>
          <div className="flex items-center gap-1">
            <PrevPageButton
              onClick={() => setPageNumber((prev) => Math.max(1, prev - 1))}
              disabled={safePage === 1}
              className="h-7 min-w-[36px] px-2"
            />
            <PageNumberButton page={safePage} active />
            <NextPageButton
              onClick={() => setPageNumber((prev) => Math.min(totalPages, prev + 1))}
              disabled={safePage === totalPages}
              className="h-7 min-w-[36px] px-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
