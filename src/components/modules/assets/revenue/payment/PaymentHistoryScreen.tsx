'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Eye, Download, Search } from 'lucide-react';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/select';
import { PrevPageButton, NextPageButton, PageNumberButton } from '@/components/common/ActionButtons';

export function PaymentHistoryScreen() {
  const t = useTranslations('AssetPayment.paymentHistory');
  const rows = [
    {
      receiptNo: 'RCP-2024-001',
      finYear: '2025',
      amount: '\u20B925,000',
      date: '2024-11-20',
      time: '10:30:45',
      mode: 'Online',
      paid: true,
    },
    {
      receiptNo: 'RCP-2024-002',
      finYear: '2025',
      amount: '\u20B925,000',
      date: '2024-10-20',
      time: '02:15:30',
      mode: 'QR',
      paid: false,
    },
  ];

  const [pageSize, setPageSize] = useState(5);
  const [pageNumber, setPageNumber] = useState(1);

  const totalEntries = rows.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / pageSize));
  const safePage = Math.min(pageNumber, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalEntries);

  const pagedRows = useMemo(() => rows.slice(startIndex, endIndex), [rows, startIndex, endIndex]);

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
              {pagedRows.map((row) => (
                <tr key={row.receiptNo} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-700">{row.receiptNo}</td>
                  <td className="px-4 py-3 text-slate-600">{row.finYear}</td>
                  <td className="px-4 py-3 font-bold text-emerald-600">{row.amount}</td>
                  <td className="px-4 py-3 text-slate-500">
                    <div>{row.date}</div>
                    <div className="text-[10px]">{row.time}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-blue-600 font-medium">{row.mode}</span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge value={row.paid ? 'true' : 'false'} activeLabel={t('paid')} inactiveLabel={t('unpaid')} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50 transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                      <button className="p-1.5 rounded-md text-emerald-600 hover:bg-emerald-50 transition-colors"><Download className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
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
