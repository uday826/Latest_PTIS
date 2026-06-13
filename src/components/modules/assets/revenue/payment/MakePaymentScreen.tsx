'use client';

import { processMakePaymentAction } from '@/app/[locale]/assets/revenue/payment/details/[recordId]/make-payment/actions';
import { Button } from '@/components/common/ActionButton';
import { Card } from '@/components/common/Card';
import { useConfirm } from '@/components/common/ConfirmProvider';
import { Drawer } from '@/components/common/Drawer';
import { Input } from '@/components/common/Input';
import { RadioGroup, RadioGroupItem } from '@/components/common/radio-group';
import { Select } from '@/components/common/select';
import { formatDDMMYYYYToISO, formatDateToDDMMYYYY } from '@/lib/utils/format';
import {
  EMAIL_REGEX,
  MOBILE_10_REGEX,
  POSITIVE_INTEGER_REGEX,
} from '@/lib/utils/validation-rules';
import type { LeaseRentPaymentDetail } from '@/types/asset/leaseRentPayment.types';
import { Calendar, IndianRupee } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState, useTransition } from 'react';
import { toast } from 'sonner';

type PaymentMode = 'Cash' | 'DD' | 'Cheque' | 'QR / UPI' | 'Online' | '';
type PaymentOption = 'CURRENT' | 'PENDING' | 'FULL';
type CurrentSubOption = 'FULL_BUCKET' | 'CUSTOM_AMOUNT';
type PendingSubOption = 'FULL_BUCKET' | 'CUSTOM_AMOUNT' | 'PERIOD_SELECTION';

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

const MONTH_OPTIONS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const AMOUNT_REGEX = /^\d+(\.\d{1,2})?$/;
const PAYMENT_REFERENCE_REGEX = /^[A-Za-z0-9._/-]{6,50}$/;
const BANK_INSTRUMENT_REGEX = /^[A-Za-z0-9/-]{4,20}$/;
const DD_MM_YYYY_REGEX = /^(0[1-9]|[12]\d|3[01])-(0[1-9]|1[0-2])-\d{4}$/;

function getFinancialYearOptions(): string[] {
  const today = new Date();
  const currentYear = today.getMonth() >= 3 ? today.getFullYear() : today.getFullYear() - 1;
  return Array.from({ length: 5 }, (_, index) => {
    const startYear = currentYear - index;
    return `FY ${startYear}-${String((startYear + 1) % 100).padStart(2, '0')}`;
  });
}

function getDateInputValueFromDDMMYYYY(value: string): string {
  const isoDate = formatDDMMYYYYToISO(value);
  return isoDate ? isoDate.split('T')[0] : '';
}

export function MakePaymentScreen({
  record,
  initialMode = '',
}: {
  record: LeaseRentPaymentDetail;
  initialMode?: PaymentMode;
}) {
  const t = useTranslations('AssetPayment.makePayment');
  const { confirm } = useConfirm();
  const router = useRouter();
  const params = useParams<{ locale: string; recordId: string }>();
  const searchParams = useSearchParams();

  const modeFromQuery = useMemo<PaymentMode>(() => {
    const queryMode = searchParams.get('mode') ?? searchParams.get('Mode');
    if (!queryMode) return initialMode;
    return QUERY_TO_MODE[queryMode] ?? '';
  }, [initialMode, searchParams]);

  const [selectedMode, setSelectedMode] = useState<PaymentMode>(modeFromQuery);
  const [paymentOption, setPaymentOption] = useState<PaymentOption>('PENDING');
  const [currentSubOption, setCurrentSubOption] = useState<CurrentSubOption>('FULL_BUCKET');
  const [pendingSubOption, setPendingSubOption] = useState<PendingSubOption>('FULL_BUCKET');
  const [isPeriodDrawerOpen, setIsPeriodDrawerOpen] = useState(false);
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([]);
  const [customAmount, setCustomAmount] = useState('');
  const [mobile, setMobile] = useState(record.tenantMobile);
  const [email, setEmail] = useState(record.tenantEmail);
  const [bankName, setBankName] = useState('');
  const [instrumentNumber, setInstrumentNumber] = useState('');
  const [instrumentDate, setInstrumentDate] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [isPending, startTransition] = useTransition();

  const pendingDemandAmount = record.pendingDue;
  const currentDemandAmount = record.currentDemand;
  const penaltyAmount = record.penalty;
  const gstAmount = record.gst;
  const summaryTotalAmount = record.totalPayable;
  const customNumericAmount = Number(customAmount);
  const normalizedPaymentFrequency = record.paymentFrequency?.trim().toLowerCase() ?? '';
  const isYearlyPayment = normalizedPaymentFrequency === 'yearly';
  const periodOptions = isYearlyPayment ? getFinancialYearOptions() : MONTH_OPTIONS;
  const isCurrentCustom = paymentOption === 'CURRENT' && currentSubOption === 'CUSTOM_AMOUNT';
  const isPendingCustom = paymentOption === 'PENDING' && pendingSubOption === 'CUSTOM_AMOUNT';
  const isPendingPeriodSelection =
    paymentOption === 'PENDING' && pendingSubOption === 'PERIOD_SELECTION';
  const maxCustomAmount =
    paymentOption === 'CURRENT' ? currentDemandAmount : pendingDemandAmount;
  const payNowAmount = useMemo(() => {
    if (paymentOption === 'FULL') {
      return pendingDemandAmount + currentDemandAmount + penaltyAmount + gstAmount;
    }

    if (paymentOption === 'CURRENT') {
      if (currentSubOption === 'CUSTOM_AMOUNT') {
        return Number.isFinite(customNumericAmount) && customNumericAmount > 0
          ? customNumericAmount
          : 0;
      }

      return currentDemandAmount;
    }

    if (pendingSubOption === 'CUSTOM_AMOUNT') {
      return Number.isFinite(customNumericAmount) && customNumericAmount > 0
        ? customNumericAmount
        : 0;
    }

    if (pendingSubOption === 'PERIOD_SELECTION') {
      // TODO: Replace this fallback with backend-calculated period amounts once
      // selected pending months/years are supported by the payment API.
      return pendingDemandAmount;
    }

    return pendingDemandAmount;
  }, [
    currentDemandAmount,
    currentSubOption,
    customNumericAmount,
    gstAmount,
    paymentOption,
    pendingDemandAmount,
    pendingSubOption,
    penaltyAmount,
  ]);

  const backendPaymentType = useMemo(() => {
    if (paymentOption === 'FULL') return 'Full';

    if (paymentOption === 'CURRENT') {
      return currentSubOption === 'FULL_BUCKET' ? 'Full' : 'Partial';
    }

    return pendingSubOption === 'FULL_BUCKET' ? 'Full' : 'Partial';
  }, [currentSubOption, paymentOption, pendingSubOption]);

  const selectedPeriodsLabel = selectedPeriods.join(', ');
  const periodDrawerButtonLabel = isYearlyPayment ? 'Select Financial Years' : t('selectMonths');
  const periodDrawerTitle = isYearlyPayment ? 'Select Financial Years' : t('drawer.title');
  const periodSelectionHelpText = isYearlyPayment
    ? 'Financial year selection is UI-ready. Exact year-wise payable calculation will be added with backend support.'
    : 'Month selection is UI-ready. Exact month-wise payable calculation will be added with backend support.';
  const instrumentDateInputValue = getDateInputValueFromDDMMYYYY(instrumentDate);

  useEffect(() => {
    setSelectedMode(modeFromQuery);
  }, [modeFromQuery]);

  const validatePaymentForm = (): string | null => {
    const trimmedMobile = mobile.trim();
    const trimmedEmail = email.trim();
    const trimmedCustomAmount = customAmount.trim();
    const trimmedTransactionId = transactionId.trim();
    const trimmedInstrumentNumber = instrumentNumber.trim();
    const trimmedInstrumentDate = instrumentDate.trim();

    if (!trimmedMobile) {
      return 'Mobile number is required.';
    }

    if (!MOBILE_10_REGEX.test(trimmedMobile)) {
      return 'Please enter a valid 10-digit mobile number.';
    }

    if (!trimmedEmail) {
      return 'Email address is required.';
    }

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      return 'Please enter a valid email address.';
    }

    if (!selectedMode) {
      return 'Payment mode is required.';
    }

    if ((isCurrentCustom || isPendingCustom) && !trimmedCustomAmount) {
      return 'Custom amount is required.';
    }

    if ((isCurrentCustom || isPendingCustom) && !AMOUNT_REGEX.test(trimmedCustomAmount)) {
      return 'Please enter a valid amount with up to 2 decimal places.';
    }

    if ((isCurrentCustom || isPendingCustom) && !Number.isFinite(customNumericAmount)) {
      return 'Please enter a valid payment amount.';
    }

    if (payNowAmount <= 0) {
      return 'Payment amount must be greater than zero.';
    }

    if ((isCurrentCustom || isPendingCustom) && payNowAmount > maxCustomAmount) {
      return 'Custom amount cannot exceed the selected payable amount.';
    }

    if (isPendingPeriodSelection && selectedPeriods.length === 0) {
      return isYearlyPayment
        ? 'Please select at least one financial year.'
        : 'Please select at least one month.';
    }

    if (selectedMode === 'QR / UPI') {
      if (!trimmedTransactionId) {
        return 'UPI reference ID is required.';
      }

      if (!PAYMENT_REFERENCE_REGEX.test(trimmedTransactionId)) {
        return 'Please enter a valid UPI reference ID.';
      }
    }

    if (selectedMode === 'Cheque' || selectedMode === 'DD') {
      if (!bankName.trim()) {
        return 'Bank name is required.';
      }

      if (!trimmedInstrumentNumber) {
        return selectedMode === 'Cheque'
          ? 'Cheque number is required.'
          : 'DD number is required.';
      }

      if (!BANK_INSTRUMENT_REGEX.test(trimmedInstrumentNumber)) {
        return selectedMode === 'Cheque'
          ? 'Please enter a valid cheque number.'
          : 'Please enter a valid DD number.';
      }

      if (!POSITIVE_INTEGER_REGEX.test(trimmedInstrumentNumber.replace(/\//g, '').replace(/-/g, ''))) {
        return selectedMode === 'Cheque'
          ? 'Cheque number must contain digits only.'
          : 'DD number must contain digits only.';
      }

      if (!trimmedInstrumentDate) {
        return selectedMode === 'Cheque'
          ? 'Cheque date is required.'
          : 'DD date is required.';
      }

      if (!DD_MM_YYYY_REGEX.test(trimmedInstrumentDate)) {
        return 'Please enter the date in DD-MM-YYYY format.';
      }
    }

    return null;
  };

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

  const handlePayNow = () => {
    const validationMessage = validatePaymentForm();
    if (validationMessage) {
      toast.error(validationMessage);
      return;
    }

    const resolvedTransactionId =
      selectedMode === 'QR / UPI'
        ? transactionId.trim()
        : selectedMode === 'Cheque' || selectedMode === 'DD'
          ? instrumentNumber.trim()
          : '';

    confirm({
      variant: 'warning',
      title: 'Confirm Payment',
      description: `Are you sure you want to process this payment of Rs. ${payNowAmount.toLocaleString('en-IN')}?`,
      confirmText: 'Confirm Payment',
      cancelText: 'Cancel',
      onConfirm: async () => {
        startTransition(async () => {
          try {
            const result = await processMakePaymentAction(params.recordId, {
              mobile: mobile.trim(),
              email: email.trim(),
              paymentMode: selectedMode,
              // TODO: Send explicit CURRENT/PENDING/PERIOD metadata when the backend
              // process API supports period-aware payment payload fields.
              paymentType: backendPaymentType,
              amount: payNowAmount,
              penaltyAmount,
              gstAmount,
              transactionId: resolvedTransactionId,
            });

            if (!result.success) {
              toast.error(result.message);
              return;
            }

            toast.success(result.message);
            const next = new URLSearchParams(searchParams.toString());
            const queryString = next.toString();
            const historyPath = `/${params.locale}/assets/revenue/payment/details/${params.recordId}/payment-history`;
            
            // Await router.push before refresh to avoid microtask race conditions
            await router.push(queryString ? `${historyPath}?${queryString}` : historyPath);
          } catch (err) {
            console.error('Payment confirmation error:', err);
            toast.error('An unexpected error occurred during payment processing.');
          }
        });
      },
    });
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
            <Input label={t('mobileNumber')} required value={mobile} onChange={(e) => setMobile(e.target.value)} className="h-9 text-xs font-medium bg-slate-50 border-slate-200 rounded-lg" />
            <Input label={t('emailAddress')} required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('emailAddress')} className="h-9 text-xs font-medium bg-white border-slate-200 rounded-lg placeholder:text-slate-400" />
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
                  <Input
                    label={t('upiReferenceId')}
                    required
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder={t('enterUpiReferenceId')}
                    className="h-9 text-xs font-medium bg-white border-slate-200 rounded-lg placeholder:text-slate-400"
                  />
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
                    value={bankName}
                    onChange={(_e, value) => setBankName(value)}
                    placeholder={t('selectBank')}
                    className="text-xs"
                  />
                  <Input
                    label={selectedMode === 'Cheque' ? t('chequeNumber') : t('ddNumber')}
                    required
                    value={instrumentNumber}
                    onChange={(e) => setInstrumentNumber(e.target.value)}
                    placeholder={selectedMode === 'Cheque' ? t('enterChequeNumber') : t('enterDdNumber')}
                    className="h-9 text-xs font-medium bg-white border-slate-200 rounded-lg placeholder:text-slate-400"
                  />
                  <Input
                    label={selectedMode === 'Cheque' ? t('chequeDate') : t('ddDate')}
                    required
                    type="date"
                    value={instrumentDateInputValue}
                    onChange={(e) =>
                      setInstrumentDate(
                        e.target.value ? formatDateToDDMMYYYY(e.target.value) : ''
                      )
                    }
                    className="h-9 text-xs font-medium bg-white border-slate-200 rounded-lg placeholder:text-slate-400"
                  />
                </div>
              )}
            </div>
          )}

          <div className="space-y-1.5 pt-2">
            <div className="border-t border-slate-200 mb-3" />
            <label className="text-sm font-semibold text-slate-700">Payment Option</label>
            <RadioGroup
              value={paymentOption}
              onValueChange={(value) => setPaymentOption(value as PaymentOption)}
              name="paymentOption"
              className="mt-2 grid grid-cols-3 gap-3"
            >
              <label
                onClick={() => setPaymentOption('CURRENT')}
                className={`flex items-center justify-center gap-2 px-3 py-2 border rounded-lg cursor-pointer transition-colors ${
                  paymentOption === 'CURRENT' ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:bg-slate-50'
                }`}
              >
                <RadioGroupItem value="CURRENT" className="border-slate-400 text-slate-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-blue-600" />
                <span className={`text-xs font-semibold ${paymentOption === 'CURRENT' ? 'text-blue-700' : 'text-slate-700'}`}>Current</span>
              </label>
              <label
                onClick={() => setPaymentOption('PENDING')}
                className={`flex items-center justify-center gap-2 px-3 py-2 border rounded-lg cursor-pointer transition-colors ${
                  paymentOption === 'PENDING' ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:bg-slate-50'
                }`}
              >
                <RadioGroupItem value="PENDING" className="border-slate-400 text-slate-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-blue-600" />
                <span className={`text-xs font-semibold ${paymentOption === 'PENDING' ? 'text-blue-700' : 'text-slate-700'}`}>Pending</span>
              </label>
              <label
                onClick={() => setPaymentOption('FULL')}
                className={`flex items-center justify-center gap-2 px-3 py-2 border rounded-lg cursor-pointer transition-colors ${
                  paymentOption === 'FULL' ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:bg-slate-50'
                }`}
              >
                <RadioGroupItem value="FULL" className="border-slate-400 text-slate-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-blue-600" />
                <span className={`text-xs font-semibold ${paymentOption === 'FULL' ? 'text-blue-700' : 'text-slate-700'}`}>Full</span>
              </label>
            </RadioGroup>

            {paymentOption === 'CURRENT' && (
              <div className="pt-3">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Current Payment
                </label>
                <RadioGroup
                  value={currentSubOption}
                  onValueChange={(value) => setCurrentSubOption(value as CurrentSubOption)}
                  name="currentSubOption"
                  className="mt-2 grid grid-cols-2 gap-3"
                >
                  <label
                    onClick={() => setCurrentSubOption('FULL_BUCKET')}
                    className={`flex items-center justify-center gap-2 px-3 py-2 border rounded-lg cursor-pointer transition-colors ${
                      currentSubOption === 'FULL_BUCKET'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <RadioGroupItem value="FULL_BUCKET" className="border-slate-400 text-slate-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-blue-600" />
                    <span className={`text-xs font-semibold ${currentSubOption === 'FULL_BUCKET' ? 'text-blue-700' : 'text-slate-700'}`}>Full Current</span>
                  </label>
                  <label
                    onClick={() => setCurrentSubOption('CUSTOM_AMOUNT')}
                    className={`flex items-center justify-center gap-2 px-3 py-2 border rounded-lg cursor-pointer transition-colors ${
                      currentSubOption === 'CUSTOM_AMOUNT'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <RadioGroupItem value="CUSTOM_AMOUNT" className="border-slate-400 text-slate-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-blue-600" />
                    <span className={`text-xs font-semibold ${currentSubOption === 'CUSTOM_AMOUNT' ? 'text-blue-700' : 'text-slate-700'}`}>Custom Amount</span>
                  </label>
                </RadioGroup>
              </div>
            )}

            {paymentOption === 'PENDING' && (
              <div className="pt-3 space-y-3">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Pending Payment
                </label>
                <RadioGroup
                  value={pendingSubOption}
                  onValueChange={(value) => setPendingSubOption(value as PendingSubOption)}
                  name="pendingSubOption"
                  className="grid grid-cols-3 gap-3"
                >
                  <label
                    onClick={() => setPendingSubOption('FULL_BUCKET')}
                    className={`flex items-center justify-center gap-2 px-3 py-2 border rounded-lg cursor-pointer transition-colors ${
                      pendingSubOption === 'FULL_BUCKET'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <RadioGroupItem value="FULL_BUCKET" className="border-slate-400 text-slate-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-blue-600" />
                    <span className={`text-xs font-semibold ${pendingSubOption === 'FULL_BUCKET' ? 'text-blue-700' : 'text-slate-700'}`}>Full Pending</span>
                  </label>
                  <label
                    onClick={() => setPendingSubOption('CUSTOM_AMOUNT')}
                    className={`flex items-center justify-center gap-2 px-3 py-2 border rounded-lg cursor-pointer transition-colors ${
                      pendingSubOption === 'CUSTOM_AMOUNT'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <RadioGroupItem value="CUSTOM_AMOUNT" className="border-slate-400 text-slate-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-blue-600" />
                    <span className={`text-xs font-semibold ${pendingSubOption === 'CUSTOM_AMOUNT' ? 'text-blue-700' : 'text-slate-700'}`}>Custom Amount</span>
                  </label>
                  <label
                    onClick={() => setPendingSubOption('PERIOD_SELECTION')}
                    className={`flex items-center justify-center gap-2 px-3 py-2 border rounded-lg cursor-pointer transition-colors ${
                      pendingSubOption === 'PERIOD_SELECTION'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <RadioGroupItem value="PERIOD_SELECTION" className="border-slate-400 text-slate-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-blue-600" />
                    <span className={`text-xs font-semibold ${pendingSubOption === 'PERIOD_SELECTION' ? 'text-blue-700' : 'text-slate-700'}`}>
                      {isYearlyPayment ? 'Select Years' : 'Select Months'}
                    </span>
                  </label>
                </RadioGroup>

                {pendingSubOption === 'PERIOD_SELECTION' && (
                  <div className="space-y-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                      onClick={() => setIsPeriodDrawerOpen(true)}
                      icon={Calendar}
                    >
                      {periodDrawerButtonLabel}
                    </Button>
                    {selectedPeriods.length > 0 && (
                      <p className="text-xs text-slate-600">
                        {isYearlyPayment
                          ? `Selected: ${selectedPeriodsLabel}`
                          : t('selectedMonths', { months: selectedPeriodsLabel })}
                      </p>
                    )}
                    <p className="text-xs text-amber-700">{periodSelectionHelpText}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg min-w-[176px]">
              <IndianRupee className="w-4 h-4 text-slate-500" />
              {isCurrentCustom || isPendingCustom ? (
                <Input
                  naked
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder={t('totalAmount')}
                  className="w-full bg-transparent outline-none font-bold text-[18px] text-emerald-500 placeholder:text-emerald-500"
                />
              ) : (
                <span className="text-[18px] font-black text-slate-800">{payNowAmount.toLocaleString('en-IN')}</span>
              )}
            </div>
            <Button
              variant="success"
              size="sm"
              className="px-6 py-2 font-bold text-xs rounded-lg"
              onClick={handlePayNow}
              disabled={isPending}
            >
              {isPending ? 'Processing...' : t('payNow')}
            </Button>
          </div>
        </Card>
      </div>

      <Drawer
        open={isPeriodDrawerOpen}
        onClose={() => setIsPeriodDrawerOpen(false)}
        width="sm"
        title={
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Calendar className="size-4 text-white" />
            </div>
            <span className="text-sm font-bold text-slate-800 uppercase tracking-wide">{periodDrawerTitle}</span>
          </div>
        }
        footer={
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPeriodDrawerOpen(false)}
              className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
            >
              {t('drawer.cancel')}
            </button>
            <button
              onClick={() => setIsPeriodDrawerOpen(false)}
              className="px-5 py-2 rounded-lg text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              {t('drawer.apply')}
            </button>
          </div>
        }
      >
        <div className="p-4 bg-slate-50/50 min-h-full">
          <div className="grid grid-cols-2 gap-2">
            {periodOptions.map((period) => {
              const isSelected = selectedPeriods.includes(period);
              return (
                <button
                  key={period}
                  type="button"
                  onClick={() =>
                    setSelectedPeriods((prev) =>
                      prev.includes(period)
                        ? prev.filter((item) => item !== period)
                        : [...prev, period]
                    )
                  }
                  className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-colors text-left ${
                    isSelected
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {period}
                </button>
              );
            })}
          </div>
        </div>
      </Drawer>
    </div>
  );
}
