'use client';

import { useMemo, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { CheckCircle2, X, LayoutGrid } from 'lucide-react';
import { Drawer, Input, TextArea } from '@/components/common';
import { Select } from '@/components/common/select';
import { ToggleSwitch } from '@/components/common/ToggleSwitch';
import { SaveButton, CancelButton } from '@/components/common/ActionButtons';
import type { MasterDataFormProps } from '@/types/asset-type/asset.types';
import { useMasterDataFormState } from '../../../../../../hooks/asset-hooks/useMasterDataFormState';
import { useTranslations } from 'next-intl';
import { MASTER_IDS, type MasterId } from '@/types/asset-type/master-data.types';

export function InventoryConditionMasterForm({
  open,
  onClose,
  onSave,
  editData,
  masterId,
  selectedGroup,
  groups = [],
  existingCodes = [],
  existingNames = [],
  isPending = false,
}: MasterDataFormProps) {
  const t = useTranslations('inventoryCondition');
  const tNames = useTranslations('inventoryCondition.masterNames');

  const groupOptions = useMemo(() => {
    return [
      { label: '-- Select --', value: '' },
      ...(groups || [])
        .filter((g) => g.id !== 'all')
        .map((g) => ({ label: g.name, value: g.id }))
    ];
  }, [groups]);

  const {
    formData,
    setField,
    errors,
    handleSubmit,
  } = useMasterDataFormState(
    masterId,
    editData,
    (payload, onSuccess) => {
      // Fix the hook's stripping of the group property for non-Asset Type forms
      const fixedPayload = { ...payload, group: formData.group || 'all' };
      onSave(fixedPayload, onSuccess);
    },
    onClose,
    selectedGroup,
    existingCodes,
    existingNames
  );



  const isEdit = !!editData;
  const isValidMasterId = (id: string): id is MasterId => 
    Object.values(MASTER_IDS).includes(id as MasterId);
  const validMasterId = isValidMasterId(masterId)
    ? masterId
    : MASTER_IDS.INVENTORY_CONDITION;
  const masterName = tNames(validMasterId);
  const title = isEdit
    ? t('configuration.masterData.form.editTitle', { name: masterName })
    : t('configuration.masterData.form.addTitle', { name: masterName });

  const handleNumericChange = (field: string, val: string) => {
    if (val === '' || val === '-') return;
    const num = parseFloat(val);
    if (!isNaN(num) && num < 0) setField(field, '0');
    else if (!isNaN(num) && num > 1) setField(field, '1');
    else setField(field, val);
  };

  return (
    <>
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
                {title}
              </h2>
              <p className="!text-[11px] sm:!text-[12px] mt-1 leading-snug font-medium m-0">
                {isEdit
                  ? t('configuration.masterData.form.updateSubtitle')
                  : t('configuration.masterData.form.createSubtitle')}
              </p>
            </div>
          </div>
        }
        footer={
          <>
            <CancelButton
              label={t('configuration.masterData.form.buttons.cancel')}
              onClick={onClose}
              className="!bg-white !text-slate-700 !border !border-gray-300"
            />
            <SaveButton
              label={
                isEdit
                  ? t('configuration.masterData.form.buttons.update')
                  : t('configuration.masterData.form.buttons.save')
              }
              onClick={handleSubmit}
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
                className={`rounded-xl p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 transition-all duration-300 ${formData.isActive ? 'border border-blue-200 bg-[#F0F6FF]' : 'border border-gray-200 bg-gray-50'}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`h-9 w-9 flex items-center justify-center rounded-full ${formData.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-700'}`}
                  >
                    {formData.isActive ? <CheckCircle2 size={18} /> : <X size={18} />}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {t('configuration.masterData.form.labels.status')}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formData.isActive
                        ? t('configuration.masterData.form.labels.active')
                        : t('configuration.masterData.form.labels.inactive')}
                    </div>
                  </div>
                </div>
                <div className="self-start sm:self-center">
                <ToggleSwitch
                  checked={formData.isActive}
                  onChange={(val) => setField('isActive', val)}
                  showPopup={false}
                  activeLabel={t('configuration.masterData.form.labels.active')}
                  inactiveLabel={t('configuration.masterData.form.labels.inactive')}
                  disabled={isPending}
                />
                </div>
              </div>
            </div>
          )}

          <Select
            label={t('configuration.masterData.form.labels.category')}
            required
            options={groupOptions}
            value={formData.group}
            onChange={(_, v) => setField('group', v)}
            placeholder={t('configuration.masterData.form.placeholders.category')}
            className="w-full"
            disabled={isPending}
            error={errors.group ? t(`configuration.masterData.form.${String(errors.group)}` as any) : undefined}
          />

          <Input
            label={t('configuration.masterData.form.labels.name')}
            required
            value={formData.name}
            placeholder={t('configuration.masterData.form.placeholders.name')}
            onChange={(e) => setField('name', e.target.value)}
            disabled={isPending}
            fullWidth
            maxLength={40}
            error={errors.name ? t(`configuration.masterData.form.${String(errors.name)}` as any) : undefined}
            className="placeholder:!text-slate-500 placeholder:!text-[13px] !text-[13px] !text-slate-700"
          />
          
          <Input 
            label={t('configuration.masterData.form.labels.conditionFactor')} 
            required 
            type="number" 
            value={formData.conditionFactor ?? ''} 
            placeholder={t('configuration.masterData.form.placeholders.conditionFactor')} 
            onChange={(e) => handleNumericChange('conditionFactor', e.target.value)} 
            disabled={isPending} 
            fullWidth 
            step={0.01} 
            min={0} 
            max={1} 
            error={errors.conditionFactor ? t(`configuration.masterData.form.${String(errors.conditionFactor)}` as any) : undefined} 
            className="placeholder:!text-slate-500 placeholder:!text-[13px] !text-[13px] !text-slate-700"
          />

          <TextArea
            label={t('configuration.masterData.form.labels.description')}
            value={formData.description}
            placeholder={t('configuration.masterData.form.placeholders.description')}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setField('description', e.target.value)}
            disabled={isPending}
            className="w-full placeholder:!text-slate-500 placeholder:!text-[13px] !text-[13px] !text-slate-700"
            rows={3}
            maxLength={500}
            errorMessage={errors.description ? t(`configuration.masterData.form.${String(errors.description)}` as any) : undefined}
            error={!!errors.description}
          />

        </div>
      </Drawer>
    </>
  );
}
