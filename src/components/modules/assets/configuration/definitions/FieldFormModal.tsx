'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { LayoutGrid, CheckCircle2, X } from 'lucide-react';
import { Drawer } from '@/components/common/Drawer';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/select';
import { ToggleSwitch } from '@/components/common/ToggleSwitch';
import { ValidationMessage } from '@/components/common/ValidationMessage';
import { SaveButton, CancelButton } from '@/components/common/ActionButtons';
import type { AssetFieldDefinition, FieldDefinitionFormData } from '@/types/asset-type/definitions.types';

interface FieldFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FieldDefinitionFormData) => Promise<void>;
  existingField?: AssetFieldDefinition | null;
  fieldGroups: string[];
  existingFields?: AssetFieldDefinition[];
}

export function FieldFormModal({
  isOpen,
  onClose,
  onSave,
  existingField,
  fieldGroups = []
}: FieldFormModalProps): React.ReactElement {
  const [formData, setFormData] = useState({
    id: 0,
    fieldCode: '',
    fieldName: '',
    fieldType: 'text',
    fieldGroup: '',
    isRequired: false,
    displayOrder: 1,
    isActive: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  // Reset form when modal opens / closes or existing field changes
  useEffect(() => {
    if (existingField) {
      setFormData({
        id: existingField.id || 0,
        fieldCode: existingField.fieldCode || '',
        fieldName: existingField.fieldName || '',
        fieldType: existingField.fieldType || 'text',
        fieldGroup: existingField.fieldGroup || '',
        isRequired: !!existingField.isRequired,
        displayOrder: existingField.displayOrder || 1,
        isActive: existingField.isActive !== false
      });
    } else {
      setFormData({
        id: 0,
        fieldCode: '',
        fieldName: '',
        fieldType: 'text',
        fieldGroup: '',
        isRequired: false,
        displayOrder: 1,
        isActive: true
      });
    }
    setErrors({});
  }, [existingField, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    // 1. Field Code validation (optional, but format check if entered)
    if (formData.fieldCode.trim()) {
      if (formData.fieldCode.length > 50) {
        newErrors.fieldCode = 'Field code cannot exceed 50 characters';
      } else {
        const codePattern = /^[A-Z0-9_]+$/;
        if (!codePattern.test(formData.fieldCode)) {
          newErrors.fieldCode = 'Field code must contain only uppercase letters, numbers, and underscores';
        }
      }
    }

    // 2. Field Name validation
    if (!formData.fieldName.trim()) {
      newErrors.fieldName = 'Field name is required';
    } else if (formData.fieldName.length > 100) {
      newErrors.fieldName = 'Field name cannot exceed 100 characters';
    }

    if (!formData.fieldType) newErrors.fieldType = 'Field type is required';

    // 3. Field Group validation
    if (!formData.fieldGroup.trim()) {
      newErrors.fieldGroup = 'Field group is required';
    } else if (formData.fieldGroup.length > 100) {
      newErrors.fieldGroup = 'Field group name cannot exceed 100 characters';
    }
    
    if (formData.displayOrder < 1) {
      newErrors.displayOrder = 'Display order must be at least 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    startTransition(async () => {
      await onSave({
        ...formData,
        fieldLabel: formData.fieldName, // Map fieldLabel to fieldName automatically
        minValue: null,
        maxValue: null,
        maxLength: null
      });
    });
  };

  const fieldTypeOptions = [
    { label: 'Text Input', value: 'text' },
    { label: 'Text Area', value: 'textarea' },
    { label: 'Number Input', value: 'number' },
    { label: 'Date Picker', value: 'date' }
  ];

  const title = (
    <div id="drawer-title" className="flex items-center gap-3 w-full text-blue-800">
      <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 shadow-sm">
        <LayoutGrid className="w-5 h-5 text-blue-600" />
      </div>
      <div className="flex flex-col justify-center">
        <h2 className="text-[16px] font-semibold leading-none tracking-tight m-0 text-slate-900">
          {existingField && existingField.id > 0 ? 'Edit Field Definition' : 'Add Field Definition'}
        </h2>
        <p className="text-[12px] mt-1 leading-none font-medium m-0 text-slate-500">
          {existingField && existingField.id > 0 ? 'Update field settings and rules' : 'Configure a new field configuration'}
        </p>
      </div>
    </div>
  );

  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      title={title}
      width="md"
      footer={
        <>
          <CancelButton
            label="Cancel"
            onClick={onClose}
            className="!bg-white !text-slate-700 !border !border-gray-300"
            disabled={isPending}
          />
          <SaveButton
            label={existingField && existingField.id > 0 ? 'Update' : 'Save'}
            onClick={handleSave}
            className="!bg-blue-600 hover:!bg-blue-700 transition-colors"
            disabled={isPending}
            isLoading={isPending}
          />
        </>
      }
    >
      <div id="field-form-container" className="px-6 py-4 space-y-4">
        {/* Status card */}
        {existingField && existingField.id > 0 && (
          <div className="rounded-xl border border-slate-100 bg-slate-50/50">
            <div className={`rounded-xl p-3 flex items-center justify-between transition-all duration-300 ${formData.isActive ? 'border border-blue-100 bg-blue-50/30' : 'border border-gray-200 bg-gray-50'}`}>
              <div className="flex items-center gap-3">
                <div className={`h-9 w-9 flex items-center justify-center rounded-full ${formData.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-700'}`}>
                  {formData.isActive ? <CheckCircle2 size={18} /> : <X size={18} />}
                </div>
                <div>
                  <div className="font-medium text-slate-900 text-sm">Status</div>
                  <div className="text-xs text-slate-500">{formData.isActive ? 'Active and visible on forms' : 'Inactive / Hidden'}</div>
                </div>
              </div>
              <ToggleSwitch
                checked={formData.isActive}
                onChange={(checked) => setFormData({ ...formData, isActive: checked })}
                showPopup={false}
                activeLabel="Active"
                inactiveLabel="Inactive"
                disabled={isPending}
              />
            </div>
          </div>
        )}

        {/* General Details Grid */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h4 className="text-sm font-bold text-slate-800 border-b pb-2">General Config</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Field Code (optional input, sequentially first) */}
            <div className="md:col-span-2">
              <Input
                label="Field Code (Optional)"
                placeholder="e.g. ASSET_COST (generated automatically if left blank)"
                value={formData.fieldCode}
                onChange={(e) => setFormData({ ...formData, fieldCode: e.target.value.toUpperCase().replace(/\s+/g, '_') })}
                disabled={isPending}
                fullWidth
                error={errors.fieldCode}
              />
            </div>

            {/* Field Name */}
            <div className="md:col-span-2">
              <Input
                label="Field Name"
                required
                placeholder="e.g. Asset Cost"
                value={formData.fieldName}
                onChange={(e) => setFormData({ ...formData, fieldName: e.target.value })}
                disabled={isPending}
                fullWidth
                error={errors.fieldName}
              />
            </div>

            {/* Field Type */}
            <div className="space-y-1 md:col-span-2">
              <label className="block text-sm font-medium text-slate-700">
                Field Type <span className="text-red-500">*</span>
              </label>
              <Select
                options={fieldTypeOptions}
                value={formData.fieldType}
                onChange={(_, v) => setFormData({ ...formData, fieldType: v })}
                placeholder="Select Type..."
                className="w-full"
                disabled={isPending}
              />
              <ValidationMessage message={errors.fieldType} />
            </div>

            {/* Field Group */}
            <div className="space-y-1 md:col-span-2">
              <label className="block text-sm font-medium text-slate-700">
                Field Group Name <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. General Info"
                  value={formData.fieldGroup}
                  onChange={(e) => setFormData({ ...formData, fieldGroup: e.target.value })}
                  disabled={isPending}
                  className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {fieldGroups.length > 0 && (
                  <select
                    onChange={(e) => e.target.value && setFormData({ ...formData, fieldGroup: e.target.value })}
                    value=""
                    disabled={isPending}
                    className="px-2 py-2 text-xs rounded-lg border border-gray-300 bg-white text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="" disabled>Select group...</option>
                    {fieldGroups.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                )}
              </div>
              <ValidationMessage message={errors.fieldGroup} />
            </div>

            {/* Display Order & Mandatory Toggle side by side */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <div>
                <Input
                  type="number"
                  label="Display Order"
                  required
                  min="1"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: Math.max(1, parseInt(e.target.value) || 1) })}
                  disabled={isPending}
                  fullWidth
                  error={errors.displayOrder}
                />
              </div>

              <div className="flex items-center justify-between border border-slate-100 bg-slate-50/50 px-3 h-[42px] rounded-lg">
                <span className="text-sm font-medium text-slate-700">Required Field</span>
                <ToggleSwitch
                  checked={formData.isRequired}
                  onChange={(checked) => setFormData({ ...formData, isRequired: checked })}
                  showPopup={false}
                  disabled={isPending}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
