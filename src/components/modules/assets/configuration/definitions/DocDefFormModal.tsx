'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { FileBadge } from 'lucide-react';
import { Drawer } from '@/components/common/Drawer';
import { Input } from '@/components/common/Input';
import { ToggleSwitch } from '@/components/common/ToggleSwitch';
import { ValidationMessage } from '@/components/common/ValidationMessage';
import { SaveButton, CancelButton } from '@/components/common/ActionButtons';
import { TextArea } from '@/components/common/Textarea';

export interface DocumentDefinitionFormData {
  id?: number;
  assetCategoryId: number;
  assetTypeId: number | null;
  documentCode: string;
  documentName: string;
  description: string;
  isRequired: boolean;
  maxFileSizeMB: number;
  allowedExtensions: string;
  displayOrder: number;
}

interface DocDefFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: DocumentDefinitionFormData) => Promise<void>;
  existingDef?: DocumentDefinitionFormData | null;
  assetCategoryId: number;
  assetTypeId: number | null;
}

const COMMON_EXTENSIONS = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.xls', '.xlsx', '.txt', '.zip'];

const initialForm = (categoryId: number, typeId: number | null): DocumentDefinitionFormData => ({
  assetCategoryId: categoryId,
  assetTypeId: typeId,
  documentCode: '',
  documentName: '',
  description: '',
  isRequired: false,
  maxFileSizeMB: 5,
  allowedExtensions: '.pdf,.jpg,.jpeg,.png',
  displayOrder: 1,
});

export function DocDefFormModal({
  isOpen,
  onClose,
  onSave,
  existingDef,
  assetCategoryId,
  assetTypeId,
}: DocDefFormModalProps): React.ReactElement {
  const isEdit = !!existingDef?.id;
  const [form, setForm] = useState<DocumentDefinitionFormData>(initialForm(assetCategoryId, assetTypeId));
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [isPending, startTransition] = useTransition();

  // Reset form when drawer opens / closes or existing def changes
  useEffect(() => {
    if (existingDef) {
      setForm({ ...existingDef });
    } else {
      setForm(initialForm(assetCategoryId, assetTypeId));
    }
    setErrors({});
  }, [existingDef, isOpen, assetCategoryId, assetTypeId]);

  const update = <K extends keyof DocumentDefinitionFormData>(key: K, value: DocumentDefinitionFormData[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  const toggleExtension = (ext: string) => {
    const current = (form.allowedExtensions || '').split(',').map(e => e.trim()).filter(Boolean);
    const next = current.includes(ext) ? current.filter(e => e !== ext) : [...current, ext];
    update('allowedExtensions', next.join(','));
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    // Document Code
    const docCode = form.documentCode.trim();
    if (!docCode) {
      errs.documentCode = 'Document code is required';
    } else if (docCode.length > 100) {
      errs.documentCode = 'Document code cannot exceed 100 characters';
    } else if (!/^[A-Z][A-Z0-9_-]*$/.test(docCode)) {
      errs.documentCode = 'Code must be uppercase alphanumeric, starting with a letter (underscores and hyphens allowed)';
    }

    // Document Name
    const docName = form.documentName.trim();
    if (!docName) {
      errs.documentName = 'Document name is required';
    } else if (docName.length > 200) {
      errs.documentName = 'Document name cannot exceed 200 characters';
    } else if (!/^[a-zA-Z0-9\s()_.-]+$/.test(docName)) {
      errs.documentName = 'Document name can only contain letters, numbers, spaces, and basic punctuation';
    }

    // Description
    if (form.description && form.description.length > 500) {
      errs.description = 'Description cannot exceed 500 characters';
    }

    // Max File Size
    if (form.maxFileSizeMB === undefined || form.maxFileSizeMB === null) {
      errs.maxFileSizeMB = 'Max file size is required';
    } else if (isNaN(Number(form.maxFileSizeMB)) || Number(form.maxFileSizeMB) < 1 || Number(form.maxFileSizeMB) > 100) {
      errs.maxFileSizeMB = 'File size must be between 1 and 100 MB';
    }

    // Extensions
    const rawExts = (form.allowedExtensions || '').trim();
    if (!rawExts) {
      errs.allowedExtensions = 'At least one file extension is required';
    } else {
      const extsList = rawExts.split(',').map(e => e.trim()).filter(Boolean);
      if (extsList.length === 0) {
        errs.allowedExtensions = 'At least one file extension is required';
      } else {
        const invalidExts = extsList.filter(e => !/^\.?[a-zA-Z0-9]+$/.test(e));
        if (invalidExts.length > 0) {
          errs.allowedExtensions = `Invalid extension format: ${invalidExts.join(', ')}. Format should be like .pdf or pdf.`;
        } else if (rawExts.length > 200) {
          errs.allowedExtensions = 'Allowed extensions cannot exceed 200 characters';
        }
      }
    }

    // Display Order
    if (form.displayOrder === undefined || form.displayOrder === null) {
      errs.displayOrder = 'Display order is required';
    } else if (isNaN(Number(form.displayOrder)) || Number(form.displayOrder) < 1) {
      errs.displayOrder = 'Display order must be at least 1';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    
    // Normalize allowedExtensions to start with dots and be in lowercase, comma-separated
    const normalizedExtensions = (form.allowedExtensions || '')
      .split(',')
      .map(e => e.trim().toLowerCase())
      .filter(Boolean)
      .map(e => e.startsWith('.') ? e : `.${e}`)
      .join(',');

    const normalizedForm = {
      ...form,
      documentCode: form.documentCode.trim().toUpperCase(),
      documentName: form.documentName.trim(),
      description: (form.description || '').trim(),
      allowedExtensions: normalizedExtensions,
      maxFileSizeMB: Number(form.maxFileSizeMB),
      displayOrder: Number(form.displayOrder),
    };

    startTransition(async () => {
      await onSave(normalizedForm);
    });
  };

  const selectedExts = (form.allowedExtensions || '').split(',').map(e => e.trim()).filter(Boolean);

  const drawerTitle = (
    <div id="drawer-title" className="flex items-center gap-3 w-full text-blue-800">
      <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 shadow-sm">
        <FileBadge className="w-5 h-5 text-blue-600" />
      </div>
      <div className="flex flex-col justify-center">
        <h2 className="text-[16px] font-semibold leading-none tracking-tight m-0 text-slate-900">
          {isEdit ? 'Edit Document Definition' : 'Add Document Definition'}
        </h2>
        <p className="text-[12px] mt-1 leading-none font-medium m-0 text-slate-500">
          {isEdit ? 'Update document requirement settings' : 'Configure a required document for this asset type'}
        </p>
      </div>
    </div>
  );

  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      title={drawerTitle}
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
            label={isEdit ? 'Update' : 'Save'}
            onClick={handleSave}
            className="!bg-blue-600 hover:!bg-blue-700 transition-colors"
            disabled={isPending}
            isLoading={isPending}
          />
        </>
      }
    >
      <div id="doc-def-form-container" className="px-6 py-4 space-y-4">

        {/* ── General Details ──────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h4 className="text-sm font-bold text-slate-800 border-b pb-2">Document Identity</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Document Code */}
            <div>
              <Input
                label="Document Code"
                required
                placeholder="e.g. OWNERSHIP_CERT"
                value={form.documentCode}
                onChange={e => update('documentCode', e.target.value.toUpperCase().replace(/\s+/g, '_'))}
                disabled={isEdit || isPending}
                fullWidth
                error={errors.documentCode}
              />
              {isEdit && (
                <p className="text-[11px] text-slate-400 mt-1">Code cannot be changed after creation</p>
              )}
            </div>

            {/* Document Name */}
            <div>
              <Input
                label="Document Name"
                required
                placeholder="e.g. Ownership Certificate"
                value={form.documentName}
                onChange={e => update('documentName', e.target.value)}
                disabled={isPending}
                fullWidth
                error={errors.documentName}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <TextArea
              label="Description"
              placeholder="Brief description of what this document proves or contains..."
              value={form.description}
              onChange={e => update('description', e.target.value)}
              rows={2}
              disabled={isPending}
              maxLength={500}
            />
            <ValidationMessage message={errors.description} />
          </div>
        </div>

        {/* ── File Constraints ─────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h4 className="text-sm font-bold text-slate-800 border-b pb-2">File Constraints</h4>

          {/* Extension Chip Selector */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Allowed File Types <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {COMMON_EXTENSIONS.map(ext => {
                const isSelected = selectedExts.includes(ext);
                return (
                  <button
                    key={ext}
                    type="button"
                    onClick={() => toggleExtension(ext)}
                    disabled={isPending}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer disabled:opacity-50 ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-300 hover:border-blue-400 hover:text-blue-600'
                    }`}
                  >
                    {ext}
                  </button>
                );
              })}
            </div>
            {/* Manual entry */}
            <Input
              label=""
              placeholder=".pdf,.jpg,.docx  (comma-separated)"
              value={form.allowedExtensions}
              onChange={e => update('allowedExtensions', e.target.value)}
              disabled={isPending}
              fullWidth
              error={errors.allowedExtensions}
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Click chips above to toggle, or type extensions manually (comma-separated)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Max File Size */}
            <div>
              <Input
                type="number"
                label="Max File Size (MB)"
                required
                min="1"
                max="100"
                placeholder="e.g. 5"
                value={form.maxFileSizeMB}
                onChange={e => update('maxFileSizeMB', Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                disabled={isPending}
                fullWidth
                error={errors.maxFileSizeMB}
              />
            </div>

            {/* Display Order */}
            <div>
              <Input
                type="number"
                label="Display Order"
                required
                min="1"
                placeholder="e.g. 1"
                value={form.displayOrder}
                onChange={e => update('displayOrder', Math.max(1, parseInt(e.target.value) || 1))}
                disabled={isPending}
                fullWidth
                error={errors.displayOrder}
              />
            </div>
          </div>
        </div>

        {/* ── Requirement Setting ──────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h4 className="text-sm font-bold text-slate-800 border-b pb-2">Requirement Setting</h4>

          <div className="flex items-center justify-between py-1">
            <div>
              <span className="text-sm font-medium text-slate-700">Mandatory / Required</span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {form.isRequired
                  ? 'This document must be uploaded before asset registration can proceed'
                  : 'This document is optional — asset can be saved without it'}
              </p>
            </div>
            <ToggleSwitch
              checked={form.isRequired}
              onChange={checked => update('isRequired', checked)}
              showPopup={false}
              activeLabel="Required"
              inactiveLabel="Optional"
              disabled={isPending}
            />
          </div>
        </div>

      </div>
    </Drawer>
  );
}
