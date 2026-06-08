'use client';

import { Button } from '@/components/common/ActionButton';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/select';
import type { LeaseRentPaymentDetail } from '@/types/asset/leaseRentPayment.types';
import { IndianRupee } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

const PAYMENT_TYPE_VALUES = ['', 'Deposit', 'Penalty', 'Transfer Fee'] as const;
const PAYMENT_MODE_VALUES = ['', 'Cash', 'DD', 'Cheque', 'QR', 'Online'] as const;

export function OtherPaymentScreen({
  record,
  initialPaymentType = '',
  initialPaymentMode = '',
}: {
  record: LeaseRentPaymentDetail;
  initialPaymentType?: (typeof PAYMENT_TYPE_VALUES)[number];
  initialPaymentMode?: (typeof PAYMENT_MODE_VALUES)[number];
}) {
  const t = useTranslations('AssetPayment.otherPayment');
  const router = useRouter();
  const params = useParams<{ locale: string; recordId: string }>();
  const searchParams = useSearchParams();

  const paymentTypeFromQuery = useMemo(() => {
    const value = searchParams.get('type') ?? searchParams.get('Type') ?? '';
    if (!value) return initialPaymentType;
    return PAYMENT_TYPE_VALUES.includes(value as (typeof PAYMENT_TYPE_VALUES)[number]) ? value : '';
  }, [initialPaymentType, searchParams]);

  const paymentModeFromQuery = useMemo(() => {
    const value = searchParams.get('mode') ?? searchParams.get('Mode') ?? '';
    if (!value) return initialPaymentMode;
    return PAYMENT_MODE_VALUES.includes(value as (typeof PAYMENT_MODE_VALUES)[number]) ? value : '';
  }, [initialPaymentMode, searchParams]);

  const [mobileNo, setMobileNo] = useState(record.tenantMobile);
  const [email, setEmail] = useState(record.tenantEmail);
  const [paymentType, setPaymentType] = useState(paymentTypeFromQuery);
  const [paymentMode, setPaymentMode] = useState(paymentModeFromQuery);
  const [amount, setAmount] = useState(String(record.totalPayable));
  const [transactionId, setTransactionId] = useState('');
  const [bankGateway, setBankGateway] = useState('');
  const [upiId, setUpiId] = useState('');
  const [ddNumber, setDdNumber] = useState('');
  const [ddDate, setDdDate] = useState('');
  const [bankName, setBankName] = useState('');
  const [chequeNumber, setChequeNumber] = useState('');
  const [chequeDate, setChequeDate] = useState('');

  useEffect(() => {
    setPaymentType(paymentTypeFromQuery);
  }, [paymentTypeFromQuery]);

  useEffect(() => {
    setPaymentMode(paymentModeFromQuery);
  }, [paymentModeFromQuery]);

  const updateUrlParams = (nextType: string, nextMode: string) => {
    const next = new URLSearchParams(searchParams.toString());

    if (nextType) {
      next.set('type', nextType);
    } else {
      next.delete('type');
      next.delete('Type');
    }
    next.delete('Type');

    if (nextMode) {
      next.set('mode', nextMode);
    } else {
      next.delete('mode');
      next.delete('Mode');
    }
    next.delete('Mode');

    const basePath = `/${params.locale}/assets/revenue/payment/details/${params.recordId}/other-payment`;
    const queryString = next.toString();
    router.replace(queryString ? `${basePath}?${queryString}` : basePath);
  };

  const handlePaymentTypeChange = (_e: React.ChangeEvent<HTMLSelectElement>, value: string) => {
    setPaymentType(value);
    updateUrlParams(value, paymentMode);
  };

  const handlePaymentModeChange = (_e: React.ChangeEvent<HTMLSelectElement>, value: string) => {
    setPaymentMode(value);
    updateUrlParams(paymentType, value);
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded"><IndianRupee className="w-4 h-4" /></div>
          <h3 className="font-bold text-slate-700">{t('title')}</h3>
        </div>
        <div className="px-2.5 py-1 text-[10px] font-bold bg-white border border-slate-200 rounded text-slate-600 shadow-sm">{t('financeYear', { year: '2025' })}</div>
      </div>

      <div className="p-5 flex-1">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5">
          <div className="grid grid-cols-2 gap-5">
            
            <Select
              label={t('paymentType')}
              required
              options={[
                { label: t('selectType'), value: '' },
                { label: t('types.deposit'), value: 'Deposit' },
                { label: t('types.penalty'), value: 'Penalty' },
                { label: t('types.transferFee'), value: 'Transfer Fee' },
              ]}
              value={paymentType}
              onChange={handlePaymentTypeChange}
              placeholder={t('selectType')}
              className="text-xs"
            />
            <Select
              label={t('paymentMode')}
              required
              options={[
                { label: t('selectMode'), value: '' },
                { label: t('modes.cash'), value: 'Cash' },
                { label: t('modes.dd'), value: 'DD' },
                { label: t('modes.cheque'), value: 'Cheque' },
                { label: t('modes.qr'), value: 'QR' },
                { label: t('modes.online'), value: 'Online' },
              ]}
              value={paymentMode}
              onChange={handlePaymentModeChange}
              placeholder={t('selectMode')}
              className="text-xs"
            />
            <Input
              label={t('mobileNumber')}
              required
              value={mobileNo}
              onChange={(e) => setMobileNo(e.target.value)}
              className="h-10 text-xs font-medium bg-slate-50 border-slate-200 rounded-lg"
            />
            <Input
              label={t('emailId')}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('emailId')}
              className="h-10 text-xs font-medium bg-white border-slate-200 rounded-lg placeholder:text-slate-400"
            />

            {paymentMode === 'Online' && (
              <>
                <Input
                  label={t('transactionId')}
                  required
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder={t('enterTransactionId')}
                  className="h-10 text-xs font-medium bg-white border-slate-200 rounded-lg placeholder:text-slate-400"
                />
                <Input
                  label={t('bankGateway')}
                  required
                  value={bankGateway}
                  onChange={(e) => setBankGateway(e.target.value)}
                  placeholder={t('enterBankGateway')}
                  className="h-10 text-xs font-medium bg-white border-slate-200 rounded-lg placeholder:text-slate-400"
                />
              </>
            )}

            {paymentMode === 'QR' && (
              <>
                <Input
                  label={t('transactionId')}
                  required
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder={t('enterTransactionId')}
                  className="h-10 text-xs font-medium bg-white border-slate-200 rounded-lg placeholder:text-slate-400"
                />
                <Input
                  label={t('upiId')}
                  required
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder={t('enterUpiId')}
                  className="h-10 text-xs font-medium bg-white border-slate-200 rounded-lg placeholder:text-slate-400"
                />
              </>
            )}

            {paymentMode === 'DD' && (
              <>
                <Input
                  label={t('ddNumber')}
                  required
                  value={ddNumber}
                  onChange={(e) => setDdNumber(e.target.value)}
                  placeholder={t('enterDdNumber')}
                  className="h-10 text-xs font-medium bg-white border-slate-200 rounded-lg placeholder:text-slate-400"
                />
                <Input
                  label={t('ddDate')}
                  required
                  value={ddDate}
                  onChange={(e) => setDdDate(e.target.value)}
                  placeholder={t('datePlaceholder')}
                  className="h-10 text-xs font-medium bg-white border-slate-200 rounded-lg placeholder:text-slate-400"
                />
                <Select
                  label={t('bankName')}
                  required
                  options={[
                    { label: t('selectBank'), value: '' },
                    { label: 'State Bank of India', value: 'SBI' },
                    { label: 'HDFC Bank', value: 'HDFC' },
                    { label: 'ICICI Bank', value: 'ICICI' },
                  ]}
                  value={bankName}
                  onChange={(_e, value) => setBankName(value)}
                  placeholder={t('selectBank')}
                  className="text-xs"
                />
              </>
            )}

            {paymentMode === 'Cheque' && (
              <>
                <Select
                  label={t('bankName')}
                  required
                  options={[
                    { label: t('selectBank'), value: '' },
                    { label: 'State Bank of India', value: 'SBI' },
                    { label: 'HDFC Bank', value: 'HDFC' },
                    { label: 'ICICI Bank', value: 'ICICI' },
                  ]}
                  value={bankName}
                  onChange={(_e, value) => setBankName(value)}
                  placeholder={t('selectBank')}
                  className="text-xs"
                />
                <Input
                  label={t('chequeNumber')}
                  required
                  value={chequeNumber}
                  onChange={(e) => setChequeNumber(e.target.value)}
                  placeholder={t('enterChequeNumber')}
                  className="h-10 text-xs font-medium bg-white border-slate-200 rounded-lg placeholder:text-slate-400"
                />
                <Input
                  label={t('chequeDate')}
                  required
                  value={chequeDate}
                  onChange={(e) => setChequeDate(e.target.value)}
                  placeholder={t('datePlaceholder')}
                  className="h-10 text-xs font-medium bg-white border-slate-200 rounded-lg placeholder:text-slate-400"
                />
              </>
            )}
          </div>

          <div className="flex justify-center items-center gap-4 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-1.5 px-6 py-2.5 bg-slate-50 border border-slate-200 rounded-lg w-40">
              <IndianRupee className="w-4 h-4 text-slate-500" />
              <Input
                naked
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-transparent outline-none font-bold text-sm text-slate-800"
              />
            </div>
            <Button variant="success" size="sm" className="px-8 py-2.5 font-bold text-xs rounded-lg">
              {t('payNow')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
