'use client';

import { CheckCircle2, X, LayoutGrid } from 'lucide-react';
import { Drawer } from '@/components/common/Drawer';
import { Input } from '@/components/common/Input';
import { ToggleSwitch } from '@/components/common/ToggleSwitch';
import { ValidationMessage } from '@/components/common/ValidationMessage';
import { SaveButton, CancelButton } from '@/components/common/ActionButtons';
import type { MasterDataFormProps } from '@/types/asset-type/asset.types';
import { useMasterDataFormState } from '../../../../../../hooks/asset-hooks/useMasterDataFormState';
import { useTranslations } from 'next-intl';
import { TextArea } from '@/components/common/Textarea';
import { MASTER_IDS, type MasterId } from '@/types/asset-type/master-data.types';

export function OwnershipTypeMasterForm({
  open,
  onClose,
  onSave,
  editData,
  masterId,
  selectedGroup,
  isPending = false,
}: MasterDataFormProps) {
  const t = useTranslations('ownershipType.configuration.masterData.form');
  const tNames = useTranslations('ownershipType.masterNames');

  const {
    formData, setField, errors, handleSubmit
  } = useMasterDataFormState(masterId, editData, onSave, onClose, selectedGroup);

  const isEdit = !!editData;
  const validMasterId = Object.values(MASTER_IDS).includes(masterId as MasterId) ? (masterId as MasterId) : MASTER_IDS.OWNERSHIP_TYPE;
  const masterName = tNames(validMasterId);
  const title = isEdit ? t('editTitle', { name: masterName }) : t('addTitle', { name: masterName });
  const formKey = `${masterId}-${open ? 'open' : 'closed'}-${editData?.backendId ?? editData?.id ?? selectedGroup ?? 'new'}`;

  return (
    <>
      <Drawer
        key={formKey}
        open={open}
        onClose={onClose}
        width="md"
        title={
          <div className="flex items-center gap-2 sm:gap-3 w-full !text-blue-800">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl !bg-white/10 !border !border-blue-600 flex items-center justify-center shrink-0 shadow-sm">
              <LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5 !text-blue" />
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <h2 className="text-sm sm:!text-[16px] !font-semibold leading-none tracking-tight m-0 truncate">{title}</h2>
              <p className="text-[10px] sm:!text-[12px] mt-1 leading-none font-medium m-0 truncate">
                {isEdit ? t('updateSubtitle') : t('createSubtitle')}
              </p>
            </div>
          </div>
        }
        footer={
          <div className="flex flex-col-reverse sm:flex-row gap-2 w-full">
            <CancelButton 
              label={t('buttons.cancel')} 
              onClick={onClose} 
              className="!bg-white !text-slate-700 !border !border-gray-300 w-full sm:w-auto" 
            />
            <SaveButton 
              label={isEdit ? t('buttons.update') : t('buttons.save')} 
              onClick={handleSubmit} 
              className="!bg-[#2563eb] w-full sm:w-auto" 
              disabled={isPending} 
            />
          </div>
        }
      >
        <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-4 sm:space-y-5">
          {isEdit && (
            <div className="rounded-xl border border-[#DCEAFF] bg-slate-50 p-3 sm:p-4">
              <div className={`rounded-xl p-2.5 sm:p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 transition-all duration-300 ${formData.isActive ? 'border border-blue-200 bg-[#F0F6FF]' : 'border border-gray-200 bg-gray-50'}`}>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className={`h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center rounded-full shrink-0 ${formData.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-700'}`}>
                    {formData.isActive ? <CheckCircle2 size={16} className="sm:size-[18px]" /> : <X size={16} className="sm:size-[18px]" />}
                  </div>
                  <div>
                    <div className="font-medium text-sm sm:text-base text-gray-900">{t('labels.status')}</div>
                    <div className="text-xs sm:text-sm text-gray-500">{formData.isActive ? t('labels.active') : t('labels.inactive')}</div>
                  </div>
                </div>
                <ToggleSwitch checked={formData.isActive} onChange={(val) => setField('isActive', val)} showPopup={false} activeLabel={t('labels.active')} inactiveLabel={t('labels.inactive')} disabled={isPending} />
              </div>
            </div>
          )}

          <div>
            <Input 
              label={t('labels.name')} 
              required 
              value={formData.name} 
              placeholder={t('placeholders.name')} 
              onChange={(e) => setField('name', e.target.value)} 
              maxLength={40}
              disabled={isPending} 
              fullWidth 
              className="placeholder:!text-slate-500 placeholder:!text-[13px] !text-[13px] !text-slate-700"
            />
            <ValidationMessage message={errors.name ? t(errors.name as string) : undefined} />
          </div>

          <div className="text-black [&_label]:text-black [&_textarea]:text-black">
            <TextArea
              key={`${isEdit ? editData?.backendId ?? editData?.id ?? 'edit' : 'new'}-${open ? 'open' : 'closed'}`}
              label={t('labels.description')}
              required
              rows={4}
              value={formData.description}
              placeholder={t('placeholders.description')}
              onChange={(e) => setField('description', e.target.value)}
              maxLength={500}
              disabled={isPending}
              error={!!errors.description}
              errorMessage={errors.description ? t(errors.description as string) : undefined}
              className="w-full placeholder:!text-slate-500 placeholder:!text-[13px] !text-[13px] !text-slate-700"
            />
          </div>
        </div>
      </Drawer>
    </>
  );
}
