'use client';

import { Card } from '@/components/common/Card';
import { Tabs } from '@/components/common/Tabs';
import type { LeaseRentPaymentDetail } from '@/types/asset/leaseRentPayment.types';
import {
  ArrowLeft,
  Building2,
  Calendar,
  Circle,
  CreditCard,
  FileText,
  History,
  Home,
  Map,
  MapPin,
  Navigation,
  Shield,
  User,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

export type PaymentDetailTabKey = 'make-payment' | 'other-payment' | 'payment-history';

interface PaymentDetailLayoutProps {
  record: LeaseRentPaymentDetail;
  activeTab: PaymentDetailTabKey;
  children: React.ReactNode;
}

function InfoItem({ icon, label, value, iconClassName }: { icon: React.ReactNode; label: string; value: string; iconClassName: string }) {
  return (
    <Card variant="bordered" padding="none" className="p-2.5 rounded-lg border-slate-100 bg-slate-50 flex items-start gap-2 shadow-none">
      <div className={`p-1 rounded mt-0.5 ${iconClassName}`}>{icon}</div>
      <div>
        <p className="text-[9px] text-slate-500 font-bold uppercase">{label}</p>
        <p className="text-[11px] font-bold text-slate-800">{value}</p>
      </div>
    </Card>
  );
}

export function PaymentDetailLayout({ record, activeTab, children }: PaymentDetailLayoutProps) {
  const t = useTranslations('AssetPayment.layout');
  const router = useRouter();
  const params = useParams<{ locale: string; recordId: string }>();
  const searchParams = useSearchParams();
  const assetNo = record.assetNo?.trim() || '-';
  const zone = record.zone?.trim() || '-';
  const wardNo = record.wardNo?.trim() || '-';
  const category = record.category?.trim() || '-';
  const shopName = record.shopName?.trim() || '-';

  const handleBack = () => {
    const next = new URLSearchParams();
    const listKeys = ['PageSize', 'PageNumber', 'ZoneId', 'WardId', 'AssetCategoryId', 'LeaseRentType', 'Status', 'Search', 'SortBy', 'SortOrder'];

    listKeys.forEach((key) => {
      const value = searchParams.get(key);
      if (value) {
        next.set(key, value);
      }
    });

    const query = next.toString();
    router.push(query ? `/${params.locale}/assets/revenue/payment?${query}` : `/${params.locale}/assets/revenue/payment`);
  };

  const onTabChange = (value: string | number) => {
    const target = String(value) as PaymentDetailTabKey;
    const next = new URLSearchParams(searchParams.toString());
    const query = next.toString();
    const basePath = `/${params.locale}/assets/revenue/payment/details/${params.recordId}/${target}`;
    router.push(query ? `${basePath}?${query}` : basePath);
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-800">{t('title')}</h2>
          <p className="text-xs text-slate-400">{t('subtitle')}</p>
        </div>

        <div className="min-w-[420px]">
          <Tabs value={activeTab} onChange={onTabChange} variant="pills" size="sm" justify="between" fullWidth className="w-full">
            <Tabs.TabList className="w-full p-1 bg-slate-100 rounded-lg">
              <Tabs.Tab value="make-payment" icon={CreditCard} className="text-xs font-bold rounded-md aria-selected:bg-blue-600 aria-selected:text-white">
                {t('tabs.makePayment')}
              </Tabs.Tab>
              <Tabs.Tab value="other-payment" icon={Circle} className="text-xs font-bold rounded-md aria-selected:bg-blue-600 aria-selected:text-white">
                {t('tabs.otherPayment')}
              </Tabs.Tab>
              <Tabs.Tab value="payment-history" icon={History} className="text-xs font-bold rounded-md aria-selected:bg-blue-600 aria-selected:text-white">
                {t('tabs.paymentHistory')}
              </Tabs.Tab>
            </Tabs.TabList>
          </Tabs>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-[10px] text-slate-500 font-semibold uppercase">{t('summary.totalPayments')}</p>
            <p className="text-sm font-black text-blue-600">1</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-500 font-semibold uppercase">{t('summary.totalAmount')}</p>
            <p className="text-sm font-black text-emerald-600">{`\u20B9${record.totalPayable.toLocaleString('en-IN')}`}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-500 font-semibold uppercase">{t('summary.status')}</p>
            <p className={`text-sm font-black ${record.pendingDue <= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {record.pendingDue <= 0 ? t('summary.paid') : t('summary.unpaid')}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card variant="bordered" padding="none" className="bg-white overflow-hidden flex flex-col h-full border-slate-200">
          <div className="p-4 border-b border-slate-100 flex items-center gap-2">
            <div className="p-1 bg-blue-100 text-blue-600 rounded">
              <Shield className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-700">{t('assetInfo.title')}</h3>
          </div>

          <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
            <div className="relative h-32 rounded-xl bg-slate-100 overflow-hidden mb-4 border border-slate-200">
              <div
                className="absolute inset-0 bg-center bg-cover opacity-90"
                style={{ backgroundImage: "url('/payment-img.png')" }}
              />

              <div className="absolute inset-x-4 bottom-4 bg-blue-600 rounded-lg p-3 text-white shadow-lg">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="w-3.5 h-3.5 opacity-80" />
                  <span className="text-[10px] font-bold opacity-90 uppercase tracking-wide">{t('assetInfo.assetId')}</span>
                  <span className="text-xs font-black">{assetNo}</span>
                </div>
                <p className="text-[10px] font-medium opacity-80">{t('assetInfo.assetName')}</p>
                <p className="text-xs font-bold leading-tight">{record.assetName}</p>
                {/* <p className="text-[10px] leading-tight opacity-90 mt-0.5">{shopName}</p> */}
              </div>

            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <InfoItem icon={<MapPin className="w-3 h-3" />} label={t('assetInfo.zone')} value={zone} iconClassName="bg-orange-100 text-orange-600" />
              <InfoItem icon={<Navigation className="w-3 h-3" />} label={t('assetInfo.wardNo')} value={wardNo} iconClassName="bg-purple-100 text-purple-600" />
            </div>

            {/* <InfoItem icon={<Map className="w-3 h-3" />} label={t('assetInfo.assetId')} value={assetNo} iconClassName="bg-blue-100 text-blue-600" /> */}
            <InfoItem icon={<Home className="w-3 h-3" />} label={t('assetInfo.shopPlotNo')} value={record.shopNo} iconClassName="bg-emerald-100 text-emerald-600" />

            <div className="grid grid-cols-2 gap-3 my-3">
              <InfoItem icon={<Building2 className="w-3 h-3" />} label={t('assetInfo.assetCategory')} value={category} iconClassName="bg-teal-100 text-teal-600" />
              <InfoItem icon={<FileText className="w-3 h-3" />} label="Shop Name" value={shopName} iconClassName="bg-rose-100 text-rose-600" />
            </div>

            <InfoItem icon={<MapPin className="w-3 h-3" />} label={t('assetInfo.assetName')} value={record.assetName} iconClassName="bg-orange-100 text-orange-600" />

            <div className="grid grid-cols-2 gap-3 my-3">
              <InfoItem icon={<User className="w-3 h-3" />} label={t('assetInfo.tenantName')} value={record.tenantName} iconClassName="bg-indigo-100 text-indigo-600" />
              <InfoItem icon={<User className="w-3 h-3" />} label="Email" value={record.tenantEmail} iconClassName="bg-indigo-100 text-indigo-600" />
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-slate-50 my-3">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-blue-100 text-blue-600">
                  <FileText className="w-3 h-3" />
                </div>
                <div>
                  <p className="text-[9px] text-slate-500 font-bold uppercase">{t('assetInfo.leaseType')}</p>
                  <span className="inline-block px-2 py-0.5 mt-0.5 bg-blue-500 text-white text-[9px] font-bold rounded-full">{record.leaseType}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-cyan-100 text-cyan-600">
                  <Calendar className="w-3 h-3" />
                </div>
                <div>
                  <p className="text-[9px] text-slate-500 font-bold uppercase">{t('assetInfo.financeYear')}</p>
                  <p className="text-[11px] font-bold text-slate-800">2025</p>
                </div>
              </div>
            </div>

            <button onClick={handleBack} className="flex items-center gap-1.5 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-lg transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              {t('back')}
            </button>
          </div>
        </Card>

        <Card variant="bordered" padding="none" className="bg-white overflow-hidden flex flex-col h-full border-slate-200">
          {children}
        </Card>
      </div>
    </div>
  );
}


