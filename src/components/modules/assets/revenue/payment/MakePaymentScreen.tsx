'use client';

import { Button } from '@/components/common/ActionButton';
import { Card } from '@/components/common/Card';
import { Drawer } from '@/components/common/Drawer';
import { Input } from '@/components/common/Input';
import { RadioGroup, RadioGroupItem } from '@/components/common/radio-group';
import { Select } from '@/components/common/select';
import type { LeaseRentPaymentDetail } from '@/types/asset/leaseRentPayment.types';
import { Calendar, IndianRupee } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

type PaymentMode = 'Cash' | 'DD' | 'Cheque' | 'QR / UPI' | 'Online' | '';

const MODE_TO_QUERY: Record<Exclude<PaymentMode, ''>, string> = {
  Cash: 'cash',
  DD: 'dd',
  Cheque: 'cheque',
  'QR / UPI': 'qr-upi',
  Online: 'online',
};

const QUERY_TO_MODE: Record<string, Exclude<PaymentMode, ''>> = {
  cash: 'Cash',
  dd: 'DD',
  cheque: 'Cheque',
  'or-upi': 'QR / UPI',
  'qr-upi': 'QR / UPI',
  online: 'Online',
};

export function MakePaymentScreen({
  record,
  initialMode = '',
}: {
  record: LeaseRentPaymentDetail;
  initialMode?: PaymentMode;
}) {
  const t = useTranslations('AssetPayment.makePayment');
  const router = useRouter();
  const params = useParams<{ locale: string; recordId: string }>();
  const searchParams = useSearchParams();

  const modeFromQuery = useMemo<PaymentMode>(() => {
    const queryMode = searchParams.get('mode') ?? searchParams.get('Mode');
    if (!queryMode) return initialMode;
    return QUERY_TO_MODE[queryMode] ?? '';
  }, [initialMode, searchParams]);

  const [selectedMode, setSelectedMode] = useState<PaymentMode>(modeFromQuery);
  const [paymentType, setPaymentType] = useState<'monthly' | 'pending' | 'partial' | 'total'>('pending');
  const [isMonthDrawerOpen, setIsMonthDrawerOpen] = useState(false);
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [partialAmount, setPartialAmount] = useState('');
  const monthOptions = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const pendingDemandAmount = record.pendingDue;
  const currentDemandAmount = record.currentDemand;
  const penaltyAmount = record.penalty;
  const gstAmount = record.gst;
  const summaryTotalAmount = record.totalPayable;
  const payNowAmount = paymentType === 'partial' ? 0 : record.totalPayable;

  useEffect(() => {
    setSelectedMode(modeFromQuery);
  }, [modeFromQuery]);

  const handleModeChange = (_e: React.ChangeEvent<HTMLSelectElement>, modeValue: string) => {
    const nextMode = (modeValue as PaymentMode) || '';
    setSelectedMode(nextMode);

    const next = new URLSearchParams(searchParams.toString());
    if (!nextMode) {
      next.delete('mode');
      next.delete('Mode');
    } else {
      next.set('mode', MODE_TO_QUERY[nextMode as Exclude<PaymentMode, ''>]);
      next.delete('Mode');
    }

    const queryString = next.toString();
    const basePath = `/${params.locale}/assets/revenue/payment/details/${params.recordId}/make-payment`;
    router.replace(queryString ? `${basePath}?${queryString}` : basePath);
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded">
            <IndianRupee className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-700">{t('title')}</h3>
        </div>
        <div className="px-2.5 py-1 text-[10px] font-bold bg-white border border-slate-200 rounded text-slate-600 shadow-sm">
          {t('financeYear', { year: '2025' })}
        </div>
      </div>

      <div className="p-5 flex-1 overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Card variant="bordered" padding="none" className="bg-orange-50 border-orange-200 rounded-xl p-4 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-orange-400"></div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded flex items-center justify-center bg-orange-500 text-white text-[10px] font-bold">?</div>
              <span className="text-xs font-bold text-orange-800">{t('pendingDemand')}</span>
            </div>
            <p className="text-xl font-black text-orange-600">{`₹ ${pendingDemandAmount.toLocaleString('en-IN')}`}</p>
          </Card>
          <Card variant="bordered" padding="none" className="bg-emerald-50 border-emerald-200 rounded-xl p-4 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-400"></div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded flex items-center justify-center bg-emerald-500 text-white text-[10px] font-bold">?</div>
              <span className="text-xs font-bold text-emerald-800">{t('currentDemand')}</span>
            </div>
            <p className="text-xl font-black text-emerald-600">{`₹ ${currentDemandAmount.toLocaleString('en-IN')}`}</p>
          </Card>
        </div>

        <div className="space-y-3 mb-6">
          <Card variant="bordered" padding="none" className="flex justify-between items-center p-3 bg-red-50/50 border-red-100 rounded-lg shadow-none">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-red-500 text-white flex items-center justify-center text-[10px] font-bold">%</div>
              <span className="text-xs font-bold text-red-700">{t('penalty')}</span>
            </div>
            <span className="text-sm font-black text-red-600">{`₹ ${penaltyAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</span>
          </Card>
          <Card variant="bordered" padding="none" className="flex justify-between items-center p-3 bg-purple-50/50 border-purple-100 rounded-lg shadow-none">
            <span className="text-xs font-bold text-purple-700 ml-7">{t('gst')}</span>
            <span className="text-sm font-black text-purple-600">{`₹ ${gstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</span>
          </Card>
          <Card variant="bordered" padding="none" className="flex justify-between items-center p-4 bg-blue-50 border-blue-200 rounded-xl shadow-sm">
            <span className="text-sm font-bold text-blue-900">{t('totalAmount')}</span>
            <span className="text-xl font-black text-blue-700">{`₹ ${summaryTotalAmount.toLocaleString('en-IN')}`}</span>
          </Card>
        </div>

        <Card variant="bordered" padding="none" className="bg-white border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Input label={t('mobileNumber')} required defaultValue={record.tenantMobile} className="h-9 text-xs font-medium bg-slate-50 border-slate-200 rounded-lg" />
            <Input label={t('emailAddress')} required defaultValue={record.tenantEmail} placeholder={t('emailAddress')} className="h-9 text-xs font-medium bg-white border-slate-200 rounded-lg placeholder:text-slate-400" />
            <Select
              label={t('paymentMode')}
              required
              options={[
                { label: t('selectMode'), value: '' },
                { label: 'Cash', value: 'Cash' },
                { label: 'DD', value: 'DD' },
                { label: 'Cheque', value: 'Cheque' },
                { label: 'QR / UPI', value: 'QR / UPI' },
                { label: 'Online', value: 'Online' },
              ]}
              value={selectedMode}
              onChange={handleModeChange}
              placeholder={t('selectMode')}
              className="text-xs"
            />
          </div>

          {(selectedMode === 'QR / UPI' || selectedMode === 'Cheque' || selectedMode === 'DD') && (
            <div className="pt-0.5">
              <div className="border-t border-slate-200 mb-3" />

              {selectedMode === 'QR / UPI' && (
                <div className="grid grid-cols-1 gap-4">
                  <Input label={t('upiReferenceId')} required placeholder={t('enterUpiReferenceId')} className="h-9 text-xs font-medium bg-white border-slate-200 rounded-lg placeholder:text-slate-400" />
                </div>
              )}

              {(selectedMode === 'Cheque' || selectedMode === 'DD') && (
                <div className="grid grid-cols-3 gap-4">
                  <Select
                    label={t('bankName')}
                    required
                    options={[
                      { label: t('selectBank'), value: '' },
                      { label: 'State Bank of India', value: 'SBI' },
                      { label: 'HDFC Bank', value: 'HDFC' },
                      { label: 'ICICI Bank', value: 'ICICI' },
                    ]}
                    value=""
                    placeholder={t('selectBank')}
                    className="text-xs"
                  />
                  <Input
                    label={selectedMode === 'Cheque' ? t('chequeNumber') : t('ddNumber')}
                    required
                    placeholder={selectedMode === 'Cheque' ? t('enterChequeNumber') : t('enterDdNumber')}
                    className="h-9 text-xs font-medium bg-white border-slate-200 rounded-lg placeholder:text-slate-400"
                  />
                  <Input
                    label={selectedMode === 'Cheque' ? t('chequeDate') : t('ddDate')}
                    required
                    placeholder={t('datePlaceholder')}
                    className="h-9 text-xs font-medium bg-white border-slate-200 rounded-lg placeholder:text-slate-400"
                  />
                </div>
              )}
            </div>
          )}

          <div className="space-y-1.5 pt-2">
            <div className="border-t border-slate-200 mb-3" />
            <label className="text-sm font-semibold text-slate-700">{t('paymentType')}</label>
            <RadioGroup value={paymentType} onValueChange={(v) => setPaymentType(v as 'monthly' | 'pending' | 'partial' | 'total')} name="payType" className="mt-2 grid grid-cols-4 gap-3">
              <label
                onClick={() => setPaymentType('monthly')}
                className={`flex items-center justify-center gap-2 px-3 py-2 border rounded-lg cursor-pointer transition-colors ${
                  paymentType === 'monthly' ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:bg-slate-50'
                }`}
              >
                <RadioGroupItem value="monthly" className="border-slate-400 text-slate-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-blue-600" />
                <span className={`text-xs font-semibold ${paymentType === 'monthly' ? 'text-blue-700' : 'text-slate-700'}`}>{t('monthly')}</span>
              </label>
              <label
                onClick={() => setPaymentType('pending')}
                className={`flex items-center justify-center gap-2 px-3 py-2 border rounded-lg cursor-pointer transition-colors ${
                  paymentType === 'pending' ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:bg-slate-50'
                }`}
              >
                <RadioGroupItem value="pending" className="border-slate-400 text-slate-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-blue-600" />
                <span className={`text-xs font-semibold ${paymentType === 'pending' ? 'text-blue-700' : 'text-slate-700'}`}>{t('pending')}</span>
              </label>
              <label
                onClick={() => setPaymentType('partial')}
                className={`flex items-center justify-center gap-2 px-3 py-2 border rounded-lg cursor-pointer transition-colors ${
                  paymentType === 'partial' ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:bg-slate-50'
                }`}
              >
                <RadioGroupItem value="partial" className="border-slate-400 text-slate-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-blue-600" />
                <span className={`text-xs font-semibold ${paymentType === 'partial' ? 'text-blue-700' : 'text-slate-700'}`}>{t('partial')}</span>
              </label>
              <label
                onClick={() => setPaymentType('total')}
                className={`flex items-center justify-center gap-2 px-3 py-2 border rounded-lg cursor-pointer transition-colors ${
                  paymentType === 'total' ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:bg-slate-50'
                }`}
              >
                <RadioGroupItem value="total" className="border-slate-400 text-slate-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-blue-600" />
                <span className={`text-xs font-semibold ${paymentType === 'total' ? 'text-blue-700' : 'text-slate-700'}`}>{t('total')}</span>
              </label>
            </RadioGroup>

            {paymentType === 'monthly' && (
              <div className="pt-3">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                  onClick={() => setIsMonthDrawerOpen(true)}
                  icon={Calendar}
                >
                  {t('selectMonths')}
                </Button>
                {selectedMonths.length > 0 && (
                  <p className="mt-2 text-xs text-slate-600">
                    {t('selectedMonths', { months: selectedMonths.join(', ') })}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg min-w-[176px]">
              <IndianRupee className="w-4 h-4 text-slate-500" />
              {paymentType === 'partial' ? (
                <Input
                  naked
                  value={partialAmount}
                  onChange={(e) => setPartialAmount(e.target.value)}
                  placeholder={t('totalAmount')}
                  className="w-full bg-transparent outline-none font-bold text-[18px] text-emerald-500 placeholder:text-emerald-500"
                />
              ) : (
                <span className="text-[18px] font-black text-slate-800">{payNowAmount.toLocaleString('en-IN')}</span>
              )}
            </div>
            <Button variant="success" size="sm" className="px-6 py-2 font-bold text-xs rounded-lg">{t('payNow')}</Button>
          </div>
        </Card>
      </div>

      <Drawer
        open={isMonthDrawerOpen}
        onClose={() => setIsMonthDrawerOpen(false)}
        width="sm"
        title={
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Calendar className="size-4 text-white" />
            </div>
            <span className="text-sm font-bold text-slate-800 uppercase tracking-wide">{t('drawer.title')}</span>
          </div>
        }
        footer={
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMonthDrawerOpen(false)}
              className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
            >
              {t('drawer.cancel')}
            </button>
            <button
              onClick={() => setIsMonthDrawerOpen(false)}
              className="px-5 py-2 rounded-lg text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              {t('drawer.apply')}
            </button>
          </div>
        }
      >
        <div className="p-4 bg-slate-50/50 min-h-full">
          <div className="grid grid-cols-2 gap-2">
            {monthOptions.map((month) => {
              const isSelected = selectedMonths.includes(month);
              return (
                <button
                  key={month}
                  type="button"
                  onClick={() =>
                    setSelectedMonths((prev) =>
                      prev.includes(month) ? prev.filter((item) => item !== month) : [...prev, month]
                    )
                  }
                  className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-colors text-left ${
                    isSelected
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {month}
                </button>
              );
            })}
          </div>
        </div>
      </Drawer>
    </div>
  );
}
