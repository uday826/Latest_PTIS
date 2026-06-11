'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { LayoutGrid, CheckCircle2, X } from 'lucide-react';
import { Drawer } from '@/components/common/Drawer';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/select';
import { ToggleSwitch } from '@/components/common/ToggleSwitch';
import { ValidationMessage } from '@/components/common/ValidationMessage';
import { SaveButton, CancelButton } from '@/components/common/ActionButtons';
import { TextArea } from '@/components/common/Textarea';
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
  fieldGroups = [],
  existingFields = []
}: FieldFormModalProps): React.ReactElement {
  const [formData, setFormData] = useState({
    id: 0,
    fieldCode: '',
    fieldName: '',
    fieldLabel: '',
    fieldType: 'text',
    fieldGroup: '',
    isRequired: false,
    displayOrder: 1,
    defaultValue: '',
    minValue: '',
    maxValue: '',
    maxLength: '',
    validationRules: '',
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
        fieldLabel: existingField.fieldLabel || '',
        fieldType: existingField.fieldType || 'text',
        fieldGroup: existingField.fieldGroup || '',
        isRequired: !!existingField.isRequired,
        displayOrder: existingField.displayOrder || 1,
        defaultValue: existingField.defaultValue || '',
        minValue: existingField.minValue !== null && existingField.minValue !== undefined ? String(existingField.minValue) : '',
        maxValue: existingField.maxValue !== null && existingField.maxValue !== undefined ? String(existingField.maxValue) : '',
        maxLength: existingField.maxLength !== null && existingField.maxLength !== undefined ? String(existingField.maxLength) : '',
        validationRules: existingField.validationRules || '',
        isActive: existingField.isActive !== false
      });
    } else {
      setFormData({
        id: 0,
        fieldCode: '',
        fieldName: '',
        fieldLabel: '',
        fieldType: 'text',
        fieldGroup: '',
        isRequired: false,
        displayOrder: 1,
        defaultValue: '',
        minValue: '',
        maxValue: '',
        maxLength: '',
        validationRules: '',
        isActive: true
      });
    }
    setErrors({});
  }, [existingField, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    // 1. Field Code validation
    if (!formData.fieldCode.trim()) {
      newErrors.fieldCode = 'Field code is required';
    } else if (formData.fieldCode.length > 50) {
      newErrors.fieldCode = 'Field code cannot exceed 50 characters';
    } else {
      const codePattern = /^[A-Z0-9_]+$/;
      if (!codePattern.test(formData.fieldCode)) {
        newErrors.fieldCode = 'Field code must contain only uppercase letters, numbers, and underscores';
      } else {
        const isDuplicate = existingFields.some(
          (field) =>
            field.fieldCode?.toUpperCase() === formData.fieldCode.toUpperCase() &&
            field.id !== formData.id
        );
        if (isDuplicate) {
          newErrors.fieldCode = 'Field code already exists for this category and type';
        }
      }
    }

    // 2. Field Name validation
    if (!formData.fieldName.trim()) {
      newErrors.fieldName = 'Field name is required';
    } else if (formData.fieldName.length > 100) {
      newErrors.fieldName = 'Field name cannot exceed 100 characters';
    }

    // 3. Field Label validation
    if (!formData.fieldLabel.trim()) {
      newErrors.fieldLabel = 'Field label is required';
    } else if (formData.fieldLabel.length > 200) {
      newErrors.fieldLabel = 'Field label cannot exceed 200 characters';
    }

    if (!formData.fieldType) newErrors.fieldType = 'Field type is required';

    // 4. Field Group validation
    if (!formData.fieldGroup.trim()) {
      newErrors.fieldGroup = 'Field group is required';
    } else if (formData.fieldGroup.length > 100) {
      newErrors.fieldGroup = 'Field group name cannot exceed 100 characters';
    }
    
    if (formData.displayOrder < 1) {
      newErrors.displayOrder = 'Display order must be at least 1';
    }

    // 5. Default value length constraint (SQL: nvarchar(500))
    if (formData.defaultValue.trim() && formData.defaultValue.length > 500) {
      newErrors.defaultValue = 'Default value cannot exceed 500 characters';
    }

    // 6. Constraints and defaults validation based on field type
    if (formData.fieldType === 'number') {
      const minVal = formData.minValue !== '' ? Number(formData.minValue) : null;
      const maxVal = formData.maxValue !== '' ? Number(formData.maxValue) : null;

      if (minVal !== null && isNaN(minVal)) {
        newErrors.minValue = 'Minimum value must be a valid number';
      }
      if (maxVal !== null && isNaN(maxVal)) {
        newErrors.maxValue = 'Maximum value must be a valid number';
      }

      if (minVal !== null && maxVal !== null && minVal > maxVal) {
        newErrors.minValue = 'Minimum value cannot be greater than Maximum value';
        newErrors.maxValue = 'Maximum value cannot be less than Minimum value';
      }

      if (formData.defaultValue.trim() && !newErrors.defaultValue) {
        const defVal = Number(formData.defaultValue);
        if (isNaN(defVal)) {
          newErrors.defaultValue = 'Default value must be a valid number';
        } else {
          if (minVal !== null && defVal < minVal) {
            newErrors.defaultValue = `Default value cannot be less than Minimum (${minVal})`;
          }
          if (maxVal !== null && defVal > maxVal) {
            newErrors.defaultValue = `Default value cannot be greater than Maximum (${maxVal})`;
          }
        }
      }
    } else if (formData.fieldType === 'text' || formData.fieldType === 'textarea') {
      const maxLen = formData.maxLength !== '' ? Number(formData.maxLength) : null;
      if (maxLen !== null) {
        if (isNaN(maxLen) || maxLen <= 0 || !Number.isInteger(maxLen)) {
          newErrors.maxLength = 'Max length must be a positive integer greater than 0';
        } else if (formData.defaultValue.trim() && !newErrors.defaultValue && formData.defaultValue.length > maxLen) {
          newErrors.defaultValue = `Default value length (${formData.defaultValue.length}) exceeds Max Length (${maxLen})`;
        }
      }
    }

    // 7. JSON format validation for validationRules
    if (formData.validationRules.trim()) {
      try {
        JSON.parse(formData.validationRules);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        newErrors.validationRules = 'Invalid JSON: ' + msg;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    startTransition(async () => {
      await onSave({
        ...formData,
        minValue: formData.minValue === '' ? null : Number(formData.minValue),
        maxValue: formData.maxValue === '' ? null : Number(formData.maxValue),
        maxLength: formData.maxLength === '' ? null : Number(formData.maxLength),
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
          {existingField ? 'Edit Field Definition' : 'Add Field Definition'}
        </h2>
        <p className="text-[12px] mt-1 leading-none font-medium m-0 text-slate-500">
          {existingField ? 'Update field settings and rules' : 'Configure a new field configuration'}
        </p>
      </div>
    </div>
  );

  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      title={title}
      width="lg"
      footer={
        <>
          <CancelButton
            label="Cancel"
            onClick={onClose}
            className="!bg-white !text-slate-700 !border !border-gray-300"
            disabled={isPending}
          />
          <SaveButton
            label={existingField ? 'Update' : 'Save'}
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
        {existingField && (
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
            {/* Field Code */}
            <div>
              <Input
                label="Field Code"
                required
                placeholder="e.g. ASSET_COST"
                value={formData.fieldCode}
                onChange={(e) => setFormData({ ...formData, fieldCode: e.target.value.toUpperCase().replace(/\s+/g, '_') })}
                disabled={isPending}
                fullWidth
                error={errors.fieldCode}
              />
            </div>

            {/* Field Name */}
            <div>
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

            {/* Field Label */}
            <div>
              <Input
                label="Field Display Label"
                required
                placeholder="e.g. Asset Acquisition Cost ($)"
                value={formData.fieldLabel}
                onChange={(e) => setFormData({ ...formData, fieldLabel: e.target.value })}
                disabled={isPending}
                fullWidth
                error={errors.fieldLabel}
              />
            </div>

            {/* Field Type */}
            <div className="space-y-1">
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
            <div className="space-y-1">
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

            {/* Display Order */}
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
          </div>
        </div>

        {/* Validation & Constraints Grid */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h4 className="text-sm font-bold text-slate-800 border-b pb-2">Validation Rules &amp; Constraints</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Required field toggle */}
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium text-slate-700">Mandatory / Required</span>
              <ToggleSwitch
                checked={formData.isRequired}
                onChange={(checked) => setFormData({ ...formData, isRequired: checked })}
                showPopup={false}
                disabled={isPending}
              />
            </div>

            {/* Default Value */}
            <div>
              <Input
                label="Default Value"
                placeholder="Default value when field initializes"
                value={formData.defaultValue}
                onChange={(e) => setFormData({ ...formData, defaultValue: e.target.value })}
                disabled={isPending}
                fullWidth
                error={errors.defaultValue}
              />
            </div>

            {/* Min Value */}
            <div>
              <Input
                type="number"
                label="Minimum Value"
                placeholder="Minimum allowed number"
                value={formData.minValue}
                disabled={formData.fieldType !== 'number' || isPending}
                onChange={(e) => setFormData({ ...formData, minValue: e.target.value })}
                fullWidth
                error={errors.minValue}
              />
            </div>

            {/* Max Value */}
            <div>
              <Input
                type="number"
                label="Maximum Value"
                placeholder="Maximum allowed number"
                value={formData.maxValue}
                disabled={formData.fieldType !== 'number' || isPending}
                onChange={(e) => setFormData({ ...formData, maxValue: e.target.value })}
                fullWidth
                error={errors.maxValue}
              />
            </div>

            {/* Max Length */}
            <div>
              <Input
                type="number"
                label="Max Length (Characters)"
                placeholder="e.g. 100"
                value={formData.maxLength}
                disabled={(formData.fieldType !== 'text' && formData.fieldType !== 'textarea') || isPending}
                onChange={(e) => setFormData({ ...formData, maxLength: e.target.value })}
                fullWidth
                error={errors.maxLength}
              />
            </div>

            {/* Validation Rules JSON */}
            <div className="md:col-span-2">
              <TextArea
                label="Extra Validation / Config Json"
                placeholder="e.g. { &quot;pattern&quot;: &quot;^[A-Z0-9]+$&quot;, &quot;message&quot;: &quot;Only uppercase letters and numbers are allowed&quot; }"
                value={formData.validationRules}
                onChange={(e) => setFormData({ ...formData, validationRules: e.target.value })}
                rows={2}
                disabled={isPending}
                maxLength={1000}
              />
              <ValidationMessage message={errors.validationRules} />
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
