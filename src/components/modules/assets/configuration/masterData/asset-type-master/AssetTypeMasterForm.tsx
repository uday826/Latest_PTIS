'use client';

import { useMemo, useRef } from 'react';
import { CheckCircle2, X, LayoutGrid } from 'lucide-react';
import { Drawer } from '@/components/common/Drawer';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/select';
import { ToggleSwitch } from '@/components/common/ToggleSwitch';
import { ValidationMessage } from '@/components/common/ValidationMessage';
import { SaveButton, CancelButton } from '@/components/common/ActionButtons';
import type { MasterDataFormProps } from '@/types/asset-type/master-data.types';
import { useMasterDataFormState } from '@/hooks/asset-hooks/useMasterDataFormState';
import { useTranslations } from 'next-intl';
import { TextArea } from '@/components/common/Textarea';
import { MASTER_IDS } from '@/types/asset-type/master-data.types';

/**
 * Form Drawer Component for Creating or Editing Master Data records.
 * 
 * @param props Properties including open state, data to edit, and save/close handlers.
 */
export function AssetTypeMasterForm({
  open,
  onClose,
  onSave,
  editData,
  masterId,
  selectedGroup,
  groups = [],
  isPending = false,
  existingCodes = [],
  existingNames = [],
}: MasterDataFormProps) {
  const t = useTranslations('asset.configuration.masterData.form');
  const tNames = useTranslations('asset.masterNames');
  const descRef = useRef<HTMLTextAreaElement>(null);

  // Centralized form logic hook
  const { formData, setField, errors, handleSubmit } = useMasterDataFormState(
    masterId, editData, (payload, onSuccess) => onSave(payload, onSuccess), onClose, selectedGroup, existingCodes, existingNames
  );

  // Prepare options for the category dropdown (if applicable)
  const groupOptions = useMemo(() => {
    return (groups || [])
      .filter((g) => g.id !== 'all' && (g.status !== 'Inactive' || g.id === String(formData.group ?? '')))
      .map((g) => ({ label: g.name, value: g.id }));
  }, [groups, formData.group]);

  const isEdit = !!editData;
  type MasterId = typeof MASTER_IDS[keyof typeof MASTER_IDS];
  const validMasterId = Object.values(MASTER_IDS).includes(masterId as MasterId) ? (masterId as MasterId) : MASTER_IDS.TYPE;
  const masterName = tNames(validMasterId);
  const title = isEdit ? t('editTitle', { name: masterName }) : t('addTitle', { name: masterName });

  return (
    <>
      <Drawer
        open={open}
        onClose={onClose}
        width="md"
        title={
          <div className="flex items-center gap-3 w-full text-blue-800">
            <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 shadow-sm">
              <LayoutGrid className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-[16px] font-semibold leading-none tracking-tight m-0 text-slate-900">{title}</h2>
              <p className="text-[12px] mt-1 leading-none font-medium m-0 text-slate-500">
                {isEdit ? t('updateSubtitle') : t('createSubtitle')}
              </p>
            </div>
          </div>
        }
        footer={
          <>
            <CancelButton label={t('buttons.cancel')} onClick={onClose} className="!bg-white !text-slate-700 !border !border-gray-300" />
            <SaveButton label={isEdit ? t('buttons.update') : t('buttons.save')} onClick={handleSubmit} className="!bg-blue-600 hover:!bg-blue-700 transition-colors" disabled={isPending} isLoading={isPending} />
          </>
        }
      >
        <div className="px-6 py-5 space-y-6">
          {isEdit && (
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
              <div className={`rounded-xl p-3 flex items-center justify-between transition-all duration-300 ${formData.isActive ? 'border border-blue-100 bg-blue-50/30' : 'border border-gray-200 bg-gray-50'}`}>
                <div className="flex items-center gap-3">
                  <div className={`h-9 w-9 flex items-center justify-center rounded-full ${formData.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-700'}`}>
                    {formData.isActive ? <CheckCircle2 size={18} /> : <X size={18} />}
                  </div>
                  <div>
                    <div className="font-medium text-slate-900 text-sm">{t('labels.status')}</div>
                    <div className="text-xs text-slate-500">{formData.isActive ? t('labels.active') : t('labels.inactive')}</div>
                  </div>
                </div>
                <ToggleSwitch checked={formData.isActive} onChange={(v) => setField('isActive', v)} showPopup={false} activeLabel={t('labels.active')} inactiveLabel={t('labels.inactive')} disabled={isPending} />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">
              {t('labels.category')} <span className="text-red-500">*</span>
            </label>
            <Select options={groupOptions} value={String(formData.group ?? "")} onChange={(_, v) => setField('group', v)} placeholder={t('placeholders.category')} className="w-full" disabled={isPending} />
            <ValidationMessage message={errors.group ? t(String(errors.group)) : undefined} />
          </div>

          <div>
            <Input label={t('labels.code')} required value={formData.code} placeholder={t('placeholders.code')} onChange={(e) => setField('code', e.target.value)} disabled={isPending} fullWidth maxLength={15} error={errors.code ? t(String(errors.code)) : undefined} />
          </div>

          <div>
            <Input label={t('labels.name')} required value={formData.name} placeholder={t('placeholders.name')} onChange={(e) => setField('name', e.target.value)} disabled={isPending} fullWidth maxLength={50} error={errors.name ? t(String(errors.name)) : undefined} />
          </div>

          <div>
            <TextArea
              ref={descRef}
              label={t('labels.description')}
              rows={4}
              value={formData.description}
              placeholder={t('placeholders.description')}
              onChange={(e) => {
                const val = e.target.value.replace(/[^\p{L}\p{N}\s_-]/gu, '');
                if (descRef.current) descRef.current.value = val;
                setField('description', val);
              }}
              disabled={isPending}
              maxLength={500}
              error={!!errors.description}
              errorMessage={errors.description ? t(String(errors.description)) : undefined}
            />
          </div>

        </div>
      </Drawer>
    </>
  );
}

