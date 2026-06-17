'use client';

import { processMakePaymentAction } from '@/app/[locale]/assets/revenue/payment/details/[recordId]/make-payment/actions';
import { Button } from '@/components/common/ActionButton';
import { Card } from '@/components/common/Card';
import { Checkbox } from '@/components/common/checkbox';
import { useConfirm } from '@/components/common/ConfirmProvider';
import { Drawer } from '@/components/common/Drawer';
import { Input } from '@/components/common/Input';
import { MasterTable, type Column } from '@/components/common/MasterTable';
import { RadioGroup, RadioGroupItem } from '@/components/common/radio-group';
import { Select } from '@/components/common/select';
import { useLeaseRentDemands } from '@/hooks/asset-hooks/useLeaseRentDemands';
import { formatDDMMYYYYToISO, formatDateToDDMMYYYY } from '@/lib/utils/format';
import {
  EMAIL_REGEX,
  MOBILE_10_REGEX,
  POSITIVE_INTEGER_REGEX,
} from '@/lib/utils/validation-rules';
import type {
  LeaseRentDemandItem,
  LeaseRentPaymentDetail,
} from '@/types/asset/leaseRentPayment.types';
import { Calendar, IndianRupee, RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import { toast } from 'sonner';

type PaymentMode = 'Cash' | 'DD' | 'Cheque' | 'QR / UPI' | 'Online' | '';
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

const AMOUNT_REGEX = /^\d+(\.\d{1,2})?$/;
const PAYMENT_REFERENCE_REGEX = /^[A-Za-z0-9._/-]{6,50}$/;
const BANK_INSTRUMENT_REGEX = /^[A-Za-z0-9/-]{4,20}$/;
const DD_MM_YYYY_REGEX = /^(0[1-9]|[12]\d|3[01])-(0[1-9]|1[0-2])-\d{4}$/;

function getDateInputValueFromDDMMYYYY(value: string): string {
  const isoDate = formatDDMMYYYYToISO(value);
  return isoDate ? isoDate.split('T')[0] : '';
}

function formatCurrency(value: number): string {
  if (!Number.isFinite(value)) return '\u20b9 0.00';
  return `\u20b9 ${value.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
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

  // Fetch the master-table demand list (month/rent/penalty/gst/total) for this lease.
  // The hook gracefully handles missing leaseId by returning an empty list.
  const {
    demands: leaseDemandRows,
    isLoading: isDemandsLoading,
    error: demandsError,
    refetch: refetchDemands,
  } = useLeaseRentDemands(record.leaseRentRegistrationId, record.financeYear);

  const pendingDemandAmount = record.pendingDue;
  const penaltyAmount = record.penalty;
  const gstAmount = record.gst;
  const summaryTotalAmount = record.totalPayable;
  const customNumericAmount = Number(customAmount);
  const normalizedPaymentFrequency = record.paymentFrequency?.trim().toLowerCase() ?? '';
  const isYearlyPayment = normalizedPaymentFrequency === 'yearly';
  const isPendingCustom = pendingSubOption === 'CUSTOM_AMOUNT';
  const isPendingPeriodSelection = pendingSubOption === 'PERIOD_SELECTION';
  const maxCustomAmount = pendingDemandAmount;

  // Build a fast lookup of demand rows keyed by the `month` label so the
  // selected periods can be converted to the master-table amounts. This
  // runs before any computed values reference the totals.
  const demandRowByMonth = useMemo(() => {
    const map = new Map<string, LeaseRentDemandItem>();
    for (const row of leaseDemandRows) {
      if (row?.month) {
        map.set(String(row.month).trim().toLowerCase(), row);
      }
    }
    return map;
  }, [leaseDemandRows]);

  // Sum of the `total` column for the currently selected months. Falls back
  // to zero when no demand rows are available yet.
  const selectedPeriodsTotal = useMemo(() => {
    if (selectedPeriods.length === 0) return 0;
    let sum = 0;
    for (const period of selectedPeriods) {
      const row = demandRowByMonth.get(String(period).trim().toLowerCase());
      if (row && Number.isFinite(row.total)) {
        sum += Number(row.total);
      }
    }
    return sum;
  }, [demandRowByMonth, selectedPeriods]);

  // Demand record IDs for the selected periods (used for allocations in LeaseRentBill).
  const selectedDemandIds = useMemo(() => {
    if (selectedPeriods.length === 0) return [];
    const ids: number[] = [];
    for (const period of selectedPeriods) {
      const row = demandRowByMonth.get(String(period).trim().toLowerCase());
      if (row && row.id != null) {
        const numId = Number(row.id);
        if (Number.isFinite(numId)) ids.push(numId);
      }
    }
    return ids;
  }, [demandRowByMonth, selectedPeriods]);

  // For Full Pending / Custom Amount, include all pending demand IDs.
  const allPendingDemandIds = useMemo(() => {
    return leaseDemandRows
      .filter((r) => r.demandStatus?.toLowerCase() !== 'paid')
      .map((r) => Number(r.id))
      .filter((id) => Number.isFinite(id));
  }, [leaseDemandRows]);

  const selectedPeriodsRent = useMemo(() => {
    let sum = 0;
    for (const period of selectedPeriods) {
      const row = demandRowByMonth.get(String(period).trim().toLowerCase());
      if (row && Number.isFinite(row.rent)) {
        sum += Number(row.rent);
      }
    }
    return sum;
  }, [demandRowByMonth, selectedPeriods]);

  const selectedPeriodsPenalty = useMemo(() => {
    let sum = 0;
    for (const period of selectedPeriods) {
      const row = demandRowByMonth.get(String(period).trim().toLowerCase());
      if (row && Number.isFinite(row.penalty)) {
        sum += Number(row.penalty);
      }
    }
    return sum;
  }, [demandRowByMonth, selectedPeriods]);

  const selectedPeriodsGst = useMemo(() => {
    let sum = 0;
    for (const period of selectedPeriods) {
      const row = demandRowByMonth.get(String(period).trim().toLowerCase());
      if (row && Number.isFinite(row.gst)) {
        sum += Number(row.gst);
      }
    }
    return sum;
  }, [demandRowByMonth, selectedPeriods]);

  const payNowAmount = useMemo(() => {
    if (pendingSubOption === 'CUSTOM_AMOUNT') {
      return Number.isFinite(customNumericAmount) && customNumericAmount > 0
        ? customNumericAmount
        : 0;
    }

    if (pendingSubOption === 'PERIOD_SELECTION') {
      if (leaseDemandRows.length > 0 && selectedPeriods.length > 0) {
        return selectedPeriodsTotal;
      }
      return pendingDemandAmount;
    }

    return pendingDemandAmount;
  }, [
    customNumericAmount,
    leaseDemandRows.length,
    pendingDemandAmount,
    pendingSubOption,
    selectedPeriods.length,
    selectedPeriodsTotal,
  ]);

  const backendPaymentType = useMemo(() => {
    if (pendingSubOption === 'FULL_BUCKET') return 'Full';
    if (pendingSubOption === 'PERIOD_SELECTION') {
      const selectedAll = allPendingDemandIds.length > 0 && 
        allPendingDemandIds.every(id => selectedDemandIds.includes(id));
      return selectedAll ? 'Full' : 'Monthwise';
    }
    return 'Partial';
  }, [pendingSubOption, allPendingDemandIds, selectedDemandIds]);

  const periodDrawerTitle = isYearlyPayment ? 'Select Financial Years' : t('drawer.title');
  const instrumentDateInputValue = getDateInputValueFromDDMMYYYY(instrumentDate);

  // Toggle a single period in the selectedPeriods list. Case-insensitive.
  const togglePeriod = useCallback((period: string) => {
    const normalized = period.trim();
    if (!normalized) return;
    setSelectedPeriods((prev) => {
      const exists = prev.some((p) => p.trim().toLowerCase() === normalized.toLowerCase());
      if (exists) {
        return prev.filter((p) => p.trim().toLowerCase() !== normalized.toLowerCase());
      }
      return [...prev, normalized];
    });
  }, []);

  // True when every available demand row is currently selected.
  const allPeriodsSelected = useMemo(() => {
    if (leaseDemandRows.length === 0) return false;
    return leaseDemandRows.every((row) =>
      selectedPeriods.some(
        (p) => p.trim().toLowerCase() === String(row.month ?? '').trim().toLowerCase()
      )
    );
  }, [leaseDemandRows, selectedPeriods]);

  // Toggle every demand row at once. Convenience for the master-table
  // "Select all" header action.
  const toggleAllPeriods = useCallback(() => {
    if (leaseDemandRows.length === 0) return;
    const months = leaseDemandRows
      .map((row) => String(row.month ?? '').trim())
      .filter(Boolean);
    if (allPeriodsSelected) {
      setSelectedPeriods((prev) =>
        prev.filter(
          (p) =>
            !months.some((m) => m.toLowerCase() === p.trim().toLowerCase())
        )
      );
    } else {
      setSelectedPeriods(months);
    }
  }, [allPeriodsSelected, leaseDemandRows]);

  // Build the master-table columns. Uses a custom first column with a
  // checkbox that toggles a single demand row.
  const demandTableColumns: Column<LeaseRentDemandItem>[] = useMemo(
    () => [
      {
        key: 'select',
        label: (
          <Checkbox
            checked={allPeriodsSelected}
            onCheckedChange={toggleAllPeriods}
            aria-label={t('drawer.selectAll')}
          />
        ),
        width: '52px',
        align: 'center',
        render: (_value, row) => {
          const periodKey = String(row.month ?? '').trim();
          const checked = selectedPeriods.some(
            (p) => p.trim().toLowerCase() === periodKey.toLowerCase()
          );
          return (
            <Checkbox
              checked={checked}
              onCheckedChange={() => togglePeriod(periodKey)}
              aria-label={`${t('drawer.table.select')} ${periodKey}`}
            />
          );
        },
      },
      {
        key: 'month',
        label: t('drawer.table.month'),
        align: 'left',
        cellClassName: 'font-semibold text-slate-700',
      },
      {
        key: 'rent',
        label: t('drawer.table.rent'),
        align: 'right',
        cellClassName: 'font-medium text-slate-700',
        render: (value) => formatCurrency(Number(value ?? 0)),
      },
      {
        key: 'penalty',
        label: t('drawer.table.penalty'),
        align: 'right',
        cellClassName: 'font-medium text-red-600',
        render: (value) => formatCurrency(Number(value ?? 0)),
      },
      {
        key: 'gst',
        label: t('drawer.table.gst'),
        align: 'right',
        cellClassName: 'font-medium text-purple-600',
        render: (value) => formatCurrency(Number(value ?? 0)),
      },
      {
        key: 'total',
        label: t('drawer.table.total'),
        align: 'right',
        cellClassName: 'font-bold text-blue-700',
        render: (value) => formatCurrency(Number(value ?? 0)),
      },
      {
        key: 'demandStatus',
        label: t('drawer.table.status'),
        align: 'center',
        width: '80px',
        cellClassName: 'font-medium',
        render: (value) => {
          const status = String(value ?? '').toLowerCase();
          if (status === 'paid' || status === 'true') {
            return (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">
                Paid
              </span>
            );
          }
          return (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">
              Unpaid
            </span>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allPeriodsSelected, selectedPeriods, t, toggleAllPeriods, togglePeriod]
  );

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

    if (isPendingCustom && !trimmedCustomAmount) {
      return 'Custom amount is required.';
    }

    if (isPendingCustom && !AMOUNT_REGEX.test(trimmedCustomAmount)) {
      return 'Please enter a valid amount with up to 2 decimal places.';
    }

    if (isPendingCustom && !Number.isFinite(customNumericAmount)) {
      return 'Please enter a valid payment amount.';
    }

    if (payNowAmount <= 0) {
      return 'Payment amount must be greater than zero.';
    }

    if (isPendingCustom && payNowAmount > maxCustomAmount) {
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
            // Determine which demand IDs and amounts to allocate based on the selected option
            const demandIds =
              pendingSubOption === 'PERIOD_SELECTION'
                ? selectedDemandIds
                : allPendingDemandIds;

            const allocations = demandIds
              .map((id) => {
                const row = leaseDemandRows.find((r) => Number(r.id) === id);
                if (!row) return null;
                return { monthWiseDemandId: id, payAmount: row.total };
              })
              .filter((a): a is { monthWiseDemandId: number; payAmount: number } => a !== null);

            const resolvedChequeDate = selectedMode === 'Cheque' || selectedMode === 'DD'
              ? (instrumentDateInputValue ? `${instrumentDateInputValue}T00:00:00.000Z` : null)
              : null;

            const result = await processMakePaymentAction(params.recordId, {
              paymentType: backendPaymentType,
              paymentMode: selectedMode === 'QR / UPI' ? 'UPI' : selectedMode,
              paymentDate: new Date().toISOString(),
              payerMobile: mobile.trim() || undefined,
              payerEmail: email.trim() || undefined,
              bankName: bankName.trim() || undefined,
              branchName: undefined,
              chequeOrTransactionNo: resolvedTransactionId || undefined,
              chequeDate: resolvedChequeDate,
              onlineTransactionId: (selectedMode === 'Online' || selectedMode === 'QR / UPI') ? resolvedTransactionId : undefined,
              paymentGatewayName: undefined,
              discountAmount: 0,
              adjustmentAmount: 0,
              remark: undefined,
              customAmount: isPendingCustom ? payNowAmount : undefined,
              allocations,
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
          {t('financeYear', { year: record.financeYear ? String(record.financeYear) : '2026' })}
        </div>
      </div>

      <div className="p-5 flex-1 overflow-y-auto custom-scrollbar">
        {String(record.paymentStatus ?? '').toLowerCase() === 'partial' ? (
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Left Side: Demand, Penalty, GST, Total Amount */}
            <div className="space-y-3">
              <Card variant="bordered" padding="none" className="bg-emerald-50 border-emerald-200 rounded-xl p-3 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-400"></div>
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Demand</span>
                  <p className="text-sm font-black text-emerald-600">{`₹ ${record.currentDemand.toLocaleString('en-IN')}`}</p>
                </div>
              </Card>

              <Card variant="bordered" padding="none" className="flex justify-between items-center p-3 bg-red-50/50 border-red-100 rounded-lg shadow-none">
                <span className="text-xs font-bold text-red-700">{t('penalty')}</span>
                <span className="text-sm font-black text-red-600">{`₹ ${penaltyAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</span>
              </Card>

              <Card variant="bordered" padding="none" className="flex justify-between items-center p-3 bg-purple-50/50 border-purple-100 rounded-lg shadow-none">
                <span className="text-xs font-bold text-purple-700">{t('gst')}</span>
                <span className="text-sm font-black text-purple-600">{`₹ ${gstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</span>
              </Card>

              <Card variant="bordered" padding="none" className="flex justify-between items-center p-4 bg-blue-50 border-blue-200 rounded-xl shadow-sm">
                <span className="text-sm font-bold text-blue-900">{t('totalAmount')}</span>
                <span className="text-xl font-black text-blue-700">{`₹ ${summaryTotalAmount.toLocaleString('en-IN')}`}</span>
              </Card>
            </div>

            {/* Right Side: Total Paid and Total Pending Demand */}
            <div className="space-y-3">
              <Card variant="bordered" padding="none" className="bg-emerald-50 border-emerald-200 rounded-xl p-3 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-400"></div>
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">{t('totalPaid')}</span>
                  <p className="text-sm font-black text-emerald-600">{`₹ ${(record.totalPaid ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</p>
                </div>
              </Card>

              <Card variant="bordered" padding="none" className="flex justify-between items-center p-4 bg-red-50 border-red-200 rounded-xl shadow-sm">
                <span className="text-sm font-bold text-red-900">{t('totalPendingDemand')}</span>
                <span className="text-xl font-black text-red-700">{`₹ ${(record.totalPending ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</span>
              </Card>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <Card variant="bordered" padding="none" className="bg-emerald-50 border-emerald-200 rounded-xl p-4 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-400"></div>
                <div className="flex items-center justify-between w-full">
                  <span className="text-base font-extrabold text-emerald-800 uppercase tracking-wider">Demand</span>
                  <p className="text-2xl font-black text-emerald-600">{`₹ ${record.currentDemand.toLocaleString('en-IN')}`}</p>
                </div>
              </Card>
            </div>

            <div className="space-y-3 mb-6">
              <Card variant="bordered" padding="none" className="flex justify-between items-center p-3 bg-red-50/50 border-red-100 rounded-lg shadow-none">
                <span className="text-xs font-bold text-red-700">{t('penalty')}</span>
                <span className="text-sm font-black text-red-600">{`₹ ${penaltyAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</span>
              </Card>
              <Card variant="bordered" padding="none" className="flex justify-between items-center p-3 bg-purple-50/50 border-purple-100 rounded-lg shadow-none">
                <span className="text-xs font-bold text-purple-700">{t('gst')}</span>
                <span className="text-sm font-black text-purple-600">{`₹ ${gstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</span>
              </Card>
              <Card variant="bordered" padding="none" className="flex justify-between items-center p-4 bg-blue-50 border-blue-200 rounded-xl shadow-sm">
                <span className="text-sm font-bold text-blue-900">{t('totalAmount')}</span>
                <span className="text-xl font-black text-blue-700">{`₹ ${summaryTotalAmount.toLocaleString('en-IN')}`}</span>
              </Card>
            </div>
          </>
        )}

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

          {/* Pending Payment Options — only three: Full Pending, Custom Amount, Period Selection */}
          <div className="space-y-1.5 pt-2">
            <div className="border-t border-slate-200 mb-3" />
            <label className="text-sm font-semibold text-slate-700">Payment Types</label>
            <RadioGroup
              value={pendingSubOption}
              onValueChange={(value) => setPendingSubOption(value as PendingSubOption)}
              name="pendingSubOption"
              className="grid grid-cols-3 gap-3"
            >
              <label
                onClick={() => setPendingSubOption('FULL_BUCKET')}
                className={`flex items-center justify-center gap-2 px-3 py-2 border rounded-lg cursor-pointer transition-colors ${pendingSubOption === 'FULL_BUCKET'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-300 hover:bg-slate-50'
                  }`}
              >
                <RadioGroupItem value="FULL_BUCKET" className="border-slate-400 text-slate-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-blue-600" />
                <span className={`text-xs font-semibold ${pendingSubOption === 'FULL_BUCKET' ? 'text-blue-700' : 'text-slate-700'}`}>Full Payment</span>
              </label>
              <label
                onClick={() => setPendingSubOption('CUSTOM_AMOUNT')}
                className={`flex items-center justify-center gap-2 px-3 py-2 border rounded-lg cursor-pointer transition-colors ${pendingSubOption === 'CUSTOM_AMOUNT'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-300 hover:bg-slate-50'
                  }`}
              >
                <RadioGroupItem value="CUSTOM_AMOUNT" className="border-slate-400 text-slate-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-blue-600" />
                <span className={`text-xs font-semibold ${pendingSubOption === 'CUSTOM_AMOUNT' ? 'text-blue-700' : 'text-slate-700'}`}>Custom Amount</span>
              </label>
              <label
                onClick={() => {
                  setPendingSubOption('PERIOD_SELECTION');
                  setIsPeriodDrawerOpen(true);
                }}
                className={`flex items-center justify-center gap-2 px-3 py-2 border rounded-lg cursor-pointer transition-colors ${pendingSubOption === 'PERIOD_SELECTION'
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
          </div>

          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg min-w-[176px]">
              <IndianRupee className="w-4 h-4 text-slate-500" />
              {isPendingCustom ? (
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
              disabled={isPending || !selectedMode || !pendingSubOption || record.pendingDue <= 0}
            >
              {isPending ? 'Processing...' : t('payNow')}
            </Button>
          </div>
        </Card>
      </div>

      <Drawer
        open={isPeriodDrawerOpen}
        onClose={() => setIsPeriodDrawerOpen(false)}
        width="lg"
        title={
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Calendar className="size-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-800 uppercase tracking-wide">{periodDrawerTitle}</span>
              <span className="text-[10px] font-medium text-slate-500 normal-case tracking-normal">
                {t('drawer.subtitle')}
              </span>
            </div>
          </div>
        }
        footer={
          <div className="flex w-full items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-xs text-slate-600">
              <span className="font-semibold text-slate-700">
                {t('drawer.selectedSummary', { count: selectedPeriods.length })}
              </span>
              <span className="font-bold text-blue-700">
                {t('drawer.amountSummary', {
                  amount: formatCurrency(selectedPeriodsTotal).replace('\u20b9 ', ''),
                })}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setSelectedPeriods([]);
                }}
                disabled={selectedPeriods.length === 0}
                className="px-3 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors disabled:opacity-40 disabled:hover:text-slate-500"
              >
                {t('drawer.clear')}
              </button>
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
          </div>
        }
      >
        <div className="p-4 bg-slate-50/50 min-h-full space-y-3">
          {demandsError && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
              {t('drawer.loadError')}
              {demandsError ? `: ${demandsError}` : ''}
            </div>
          )}

          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-600">
              {t('drawer.selectedSummary', { count: selectedPeriods.length })}
              {leaseDemandRows.length > 0 && (
                <span className="ml-2 text-slate-400">
                  ({leaseDemandRows.length} {t('drawer.table.month').toLowerCase()}
                  {leaseDemandRows.length === 1 ? '' : 's'})
                </span>
              )}
            </p>
            <button
              type="button"
              onClick={() => void refetchDemands()}
              className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-600 hover:bg-slate-50"
              aria-label="Refresh demand rows"
            >
              <RefreshCw className="size-3" />
              {t('drawer.refresh')}
            </button>
          </div>

          <MasterTable<LeaseRentDemandItem>
            columns={demandTableColumns}
            data={leaseDemandRows}
            loading={isDemandsLoading}
            loadingText={t('drawer.loading')}
            emptyText={t('drawer.empty')}
            getRowKey={(row) => String(row.id ?? row.month)}
            height="md"
            containerClassName="border-0 shadow-none"
            maxBodyHeightClassName="max-h-[60vh]"
            rowClassName={(row) =>
              selectedPeriods.some(
                (p) => p.trim().toLowerCase() === String(row.month ?? '').trim().toLowerCase()
              )
                ? 'bg-blue-50/60'
                : ''
            }
            onRowClick={(row) => togglePeriod(String(row.month ?? ''))}
            footerLeftContent={
              <div className="flex items-center gap-3 text-[11px] text-slate-600">
                <span>
                  {t('drawer.amountSummary', {
                    amount: formatCurrency(selectedPeriodsRent).replace('\u20b9 ', ''),
                  }).replace('Total', 'Rent')}
                </span>
                <span>
                  {t('drawer.amountSummary', {
                    amount: formatCurrency(selectedPeriodsPenalty).replace('\u20b9 ', ''),
                  }).replace('Total', 'Penalty')}
                </span>
                <span>
                  {t('drawer.amountSummary', {
                    amount: formatCurrency(selectedPeriodsGst).replace('\u20b9 ', ''),
                  }).replace('Total', 'GST')}
                </span>
              </div>
            }
          />
        </div>
      </Drawer>
    </div>
  );
}