'use client';

import { useMemo } from 'react';
import { Drawer, Input } from '@/components/common';
import { Select } from '@/components/common/select';
import { ToggleSwitch } from '@/components/common/ToggleSwitch';
import { SaveButton, CancelButton } from '@/components/common/ActionButtons';
import { CheckCircle2, X, LayoutGrid } from 'lucide-react';
import type { MasterDataFormProps } from '@/types/asset-type/asset.types';
import { useMasterDataFormState } from '@/hooks/asset-hooks/useMasterDataFormState';
import { useTranslations } from 'next-intl';

export function PenaltyRuleMasterForm({
  open,
  onClose,
  onSave,
  editData,
  masterId,
  selectedGroup,
  existingCodes = [],
  existingNames = [],
  isPending = false,
}: MasterDataFormProps) {
  const t = useTranslations('penaltyRuleMaster');
  const tErrors = useTranslations('asset.configuration.masterData.form.errors');

  const translateError = (key?: string) => {
    if (!key) return undefined;
    const normalizedKey = key.startsWith('errors.') ? key.slice(7) : key;
    try {
      return tErrors(normalizedKey as never);
    } catch {
      return normalizedKey;
    }
  };

  const {
    formData,
    setField,
    errors,
    handleSubmit,
  } = useMasterDataFormState(
    masterId,
    editData,
    (payload, onSuccess) => onSave(payload, onSuccess),
    onClose,
    selectedGroup,
    existingCodes,
    existingNames
  );

  const calculationTypeOptions = useMemo(() => [
    { label: '-- Select --', value: '' },
    { label: t('form.calculationTypeOptions.Percentage'), value: 'Percentage' },
    { label: t('form.calculationTypeOptions.FlatAmount'), value: 'FlatAmount' },
    { label: t('form.calculationTypeOptions.PerDay'), value: 'PerDay' },
  ], [t]);

  const isEdit = !!editData;
  const labels = {
    title: isEdit
      ? t('form.editTitle')
      : t('form.addTitle'),
    subtitle: isEdit
      ? t('form.updateSubtitle')
      : t('form.createSubtitle'),
    cancelLabel: t('form.buttons.cancel'),
    saveLabel: isEdit
      ? t('form.buttons.update')
      : t('form.buttons.save'),
    statusLabel: t('form.labels.status'),
    activeLabel: t('form.labels.active'),
    inactiveLabel: t('form.labels.inactive'),
  };

  const handlePenaltyValueChange = (val: string) => {
    if (val === '') {
      setField('penaltyValue', 0);
      return;
    }
    const num = parseFloat(val);
    if (!isNaN(num)) {
      if (num < 0) {
        setField('penaltyValue', 0);
      } else if (formData.calculationType === 'Percentage' && num > 100) {
        setField('penaltyValue', 100);
      } else {
        setField('penaltyValue', num);
      }
    }
  };

  const handleGracePeriodChange = (val: string) => {
    if (val === '') {
      setField('gracePeriodDays', 0);
      return;
    }
    const num = parseInt(val, 10);
    if (!isNaN(num)) {
      setField('gracePeriodDays', num < 0 ? 0 : num);
    }
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width="md"
      title={
        <div className="flex items-start sm:items-center gap-3 w-full !text-blue-800">
          <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl !bg-white/10 !border !border-blue-600 flex items-center justify-center shrink-0 shadow-sm">
            <LayoutGrid className="w-5 h-5 !text-blue-600" />
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <h2 className="!text-[15px] sm:!text-[16px] !font-semibold leading-tight tracking-tight m-0">
              {labels.title}
            </h2>
            <p className="!text-[11px] sm:!text-[12px] mt-1 leading-snug font-medium m-0">
              {labels.subtitle}
            </p>
          </div>
        </div>
      }
      footer={
        <>
          <CancelButton
            label={labels.cancelLabel}
            onClick={onClose}
            className="!bg-white !text-slate-700 !border !border-gray-300"
          />
          <SaveButton
            label={labels.saveLabel}
            onClick={(e) => handleSubmit(e, isPending)}
            className="!bg-[#2563eb]"
            disabled={isPending}
          />
        </>
      }
    >
      <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-4 sm:space-y-5">
        {isEdit && (
          <div className="rounded-xl border border-[#DCEAFF] bg-slate-50 p-3 sm:p-4">
            <div
              className={`rounded-xl p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 transition-all duration-300 ${
                formData.isActive ? 'border border-blue-200 bg-[#F0F6FF]' : 'border border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`h-9 w-9 flex items-center justify-center rounded-full ${
                    formData.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {formData.isActive ? <CheckCircle2 size={18} /> : <X size={18} />}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{labels.statusLabel}</div>
                  <div className="text-sm text-gray-500">
                    {formData.isActive ? labels.activeLabel : labels.inactiveLabel}
                  </div>
                </div>
              </div>
              <div className="self-start sm:self-center">
                <ToggleSwitch
                  checked={formData.isActive}
                  onChange={(val) => setField('isActive', val)}
                  showPopup={false}
                  activeLabel={labels.activeLabel}
                  inactiveLabel={labels.inactiveLabel}
                  disabled={isPending}
                />
              </div>
            </div>
          </div>
        )}
        <Input
          label={t('form.labels.penaltyCode')}
          required
          value={formData.code}
          placeholder={t('form.placeholders.penaltyCode')}
          onChange={(e) => setField('code', e.target.value)}
          disabled={isPending || isEdit}
          fullWidth
          maxLength={15}
          error={translateError(errors.code)}
          className="placeholder:!text-slate-500 placeholder:!text-[13px] !text-[13px] !text-slate-700"
        />

        <Input
          label={t('form.labels.penaltyName')}
          required
          value={formData.name}
          placeholder={t('form.placeholders.penaltyName')}
          onChange={(e) => setField('name', e.target.value)}
          disabled={isPending}
          fullWidth
          maxLength={40}
          error={translateError(errors.name)}
          className="placeholder:!text-slate-500 placeholder:!text-[13px] !text-[13px] !text-slate-700"
        />

        <Select
          label={t('form.labels.calculationType')}
          required
          options={calculationTypeOptions}
          value={formData.calculationType}
          onChange={(_, val) => {
            setField('calculationType', val);
            // Clear or reset value to prevent invalid states if switching to percentage
            if (val === 'Percentage' && Number(formData.penaltyValue) > 100) {
              setField('penaltyValue', 100);
            }
          }}
          placeholder={t('form.placeholders.calculationType')}
          className="w-full"
          disabled={isPending}
          error={translateError(errors.calculationType)}
        />

        <Input
          label={t('form.labels.penaltyValue')}
          required
          type="number"
          value={formData.penaltyValue ?? ''}
          placeholder={t('form.placeholders.penaltyValue')}
          onChange={(e) => handlePenaltyValueChange(e.target.value)}
          disabled={isPending}
          fullWidth
          min={0}
          max={formData.calculationType === 'Percentage' ? 100 : undefined}
          step={0.01}
          error={translateError(errors.penaltyValue)}
          className="placeholder:!text-slate-500 placeholder:!text-[13px] !text-[13px] !text-slate-700"
        />

        <Input
          label={t('form.labels.gracePeriodDays')}
          required
          type="number"
          value={formData.gracePeriodDays ?? ''}
          placeholder={t('form.placeholders.gracePeriodDays')}
          onChange={(e) => handleGracePeriodChange(e.target.value)}
          disabled={isPending}
          fullWidth
          min={0}
          step={1}
          error={translateError(errors.gracePeriodDays)}
          className="placeholder:!text-slate-500 placeholder:!text-[13px] !text-[13px] !text-slate-700"
        />
      </div>
    </Drawer>
  );
}
