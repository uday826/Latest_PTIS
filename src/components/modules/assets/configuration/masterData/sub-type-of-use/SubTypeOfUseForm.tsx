'use client';

import { Drawer, Input, Select } from '@/components/common';
import { ToggleSwitch } from '@/components/common/ToggleSwitch';
import { SaveButton, CancelButton } from '@/components/common/ActionButtons';
import { CheckCircle2, X, LayoutGrid } from 'lucide-react';
import type { MasterDataFormProps } from '@/types/asset-type/master-data.types';
import { useMasterDataFormState } from '@/hooks/asset-hooks/useMasterDataFormState';
import { useTranslations } from 'next-intl';

export function SubTypeOfUseForm({
  open,
  onClose,
  onSave,
  editData,
  masterId,
  selectedGroup,
  existingCodes = [],
  existingNames = [],
  groups,
  isPending = false,
}: MasterDataFormProps) {
  const t = useTranslations('subTypeOfUseMaster.form');
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
    (payload, onSuccess) => {
      // make sure name and code are populated to pass hook validation if they are needed internally
      const finalPayload = {
        ...payload,
        name: payload.description || 'SubType',
        id: payload.id || 'SUBTYPE',
      };
      onSave(finalPayload, onSuccess);
    },
    onClose,
    selectedGroup,
    existingCodes,
    existingNames
  );

  const isEdit = !!editData;
  const labels = {
    title: t(isEdit ? 'editTitle' : 'addTitle'),
    subtitle: t(isEdit ? 'updateSubtitle' : 'createSubtitle'),
    cancelLabel: t('buttons.cancel'),
    saveLabel: t(isEdit ? 'buttons.update' : 'buttons.save'),
    statusLabel: t('labels.status'),
    activeLabel: t('labels.active'),
    inactiveLabel: t('labels.inactive'),
  };

  // Pre-fill dummy code/name to bypass strict hook validation if fields aren't shown
  if (!formData.code) setField('code', 'SUBTYPE');
  if (!formData.name) setField('name', 'SubType');

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

        <Select
          label="Type Of Use"
          required
          options={[{ label: 'Select...', value: '' }, ...(groups?.filter(g => g.id !== 'all').map(g => ({ label: g.name, value: g.id })) || [])]}
          value={formData.departmentId?.toString() || ''}
          onChange={(_e, val) => setField('departmentId', val ? Number(val) : 0)}
          disabled={isPending || isEdit}
          error={translateError(errors.departmentId)}
        />

        <Input
          label={t('labels.description')}
          required
          value={formData.description}
          placeholder={t('placeholders.description')}
          onChange={(e) => {
            setField('description', e.target.value);
            setField('name', e.target.value); // Keep hook happy
          }}
          disabled={isPending}
          fullWidth
          maxLength={80}
          error={translateError(errors.description)}
          className="placeholder:!text-slate-500 placeholder:!text-[13px] !text-[13px] !text-slate-700"
        />

        <Input
          label={t('labels.searchSequence')}
          type="number"
          required
          value={formData.displayOrder || ''}
          placeholder={t('placeholders.searchSequence')}
          onChange={(e) => setField('displayOrder', Number(e.target.value))}
          disabled={isPending}
          fullWidth
          error={translateError(errors.displayOrder)}
          className="placeholder:!text-slate-500 placeholder:!text-[13px] !text-[13px] !text-slate-700"
        />
      </div>
    </Drawer>
  );
}
