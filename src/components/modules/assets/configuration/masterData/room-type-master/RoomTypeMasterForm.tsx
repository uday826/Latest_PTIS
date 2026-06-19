'use client';

import { Drawer, Input } from '@/components/common';
import { ToggleSwitch } from '@/components/common/ToggleSwitch';
import { SaveButton, CancelButton } from '@/components/common/ActionButtons';
import { CheckCircle2, X, LayoutGrid } from 'lucide-react';
import type { MasterDataFormProps } from '@/types/asset-type/master-data.types';
import { useMasterDataFormState } from '@/hooks/asset-hooks/useMasterDataFormState';
import { useTranslations } from 'next-intl';

export function RoomTypeMasterForm({
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
  const t = useTranslations('roomTypeMaster');
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
          label={t('form.labels.roomTypeCode')}
          required
          value={formData.code}
          placeholder={t('form.placeholders.roomTypeCode')}
          onChange={(e) => setField('code', e.target.value)}
          disabled={isPending || isEdit}
          fullWidth
          maxLength={15}
          error={translateError(errors.code)}
          className="placeholder:!text-slate-500 placeholder:!text-[13px] !text-[13px] !text-slate-700"
        />

        <Input
          label={t('form.labels.roomTypeName')}
          required
          value={formData.name}
          placeholder={t('form.placeholders.roomTypeName')}
          onChange={(e) => setField('name', e.target.value)}
          disabled={isPending}
          fullWidth
          maxLength={40}
          error={translateError(errors.name)}
          className="placeholder:!text-slate-500 placeholder:!text-[13px] !text-[13px] !text-slate-700"
        />
      </div>
    </Drawer>
  );
}
