import React, { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import type { MasterDataRecord, MasterDataFormErrors } from '@/types/asset-type/master-data.types';
import { MASTER_IDS } from '@/types/asset-type/master-data.types';
import { toast } from 'sonner';

/**
 * Hook to manage form state for master data records.
 * Initializes form state from `editData` and `selectedGroup` when the hook is created.
 * Note: Use a `key` prop on the component using this hook to force a reset when the data changes.
 */
export function useMasterDataFormState(
  masterId: string,
  editData: MasterDataRecord | null,
  onSave: (payload: MasterDataRecord, onSuccess?: () => void) => void,
  onClose: () => void,
  selectedGroup: string = 'all',
  existingCodes: string[] = [],
  existingNames: string[] = []
) {
  const [formData, setFormData] = useState({
    code: editData?.id || '',
    name: editData?.name || '',
    group: editData?.group || ((!selectedGroup || selectedGroup === 'all') ? '' : selectedGroup),
    description: editData?.description ?? '',
    isActive: editData ? editData.status === 'Active' : true,
  });

  const [errors, setErrors] = useState<MasterDataFormErrors>({});

  const validate = useCallback(() => {
    const errors: MasterDataFormErrors = {};

    // 1. Code Validation (Unicode Alphanumeric + Hyphen + Underscore ONLY)
    const code = formData.code?.trim() || "";
    if (!code) errors.code = "errors.codeRequired";
    else if (code.length > 15) errors.code = "errors.codeTooLong15";
    else if (!/^[\p{L}\p{N}_-]+$/u.test(code)) errors.code = "errors.codeInvalidChars";
    else if (existingCodes.some(c => c.toLowerCase() === code.toLowerCase() && c.toLowerCase() !== editData?.id?.toLowerCase())) {
      errors.code = "errors.codeDuplicate";
    }

    // 2. Name Validation (Unicode Alphanumeric + Spaces + Hyphen + Underscore)
    const name = formData.name?.trim() || "";
    if (!name) errors.name = "errors.nameRequired";
    else if (name.length > 50) errors.name = "errors.nameTooLong50";
    else if (!/^[\p{L}\p{N}\s_-]+$/u.test(name)) errors.name = "errors.nameInvalidChars";
    else if (existingNames.some(n => n.toLowerCase() === name.toLowerCase() && n.toLowerCase() !== editData?.name?.toLowerCase())) {
      errors.name = "errors.nameDuplicate";
    }

    // 3. Category validation for Asset Type
    if (masterId === MASTER_IDS.TYPE && (!formData.group || formData.group === 'all')) {
      errors.group = "errors.categoryRequired";
    }

    // 4. Description Validation (Unicode Alphanumeric + Space + underscore + hyphen)
    const desc = formData.description?.trim() || "";
    if (desc.length > 500) errors.description = "errors.descriptionTooLong";
    else if (desc && !/^[\p{L}\p{N}\s_-]+$/u.test(desc)) errors.description = "errors.descInvalidChars";

    return errors;
  }, [formData, masterId, existingCodes, existingNames, editData?.id, editData?.name]);


  const t = useTranslations('asset.configuration.masterData.form');

  const handleSubmit = (e?: React.FormEvent | { preventDefault: () => void; stopPropagation: () => void }, isPending: boolean = false) => {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }

    if (isPending) return;

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error(t('errors.fillRequired'));
      return;
    }

    onSave({
      id: formData.code,
      backendId: editData?.backendId,
      name: formData.name,
      description: formData.description,
      group: masterId === MASTER_IDS.TYPE ? formData.group : 'all',
      status: formData.isActive ? 'Active' : 'Inactive',
    }, onClose);
  };

  const setField = (field: string, value: string | boolean | number | null) => {
    let sanitizedValue = value;

    // Real-time sanitization to block restricted special characters while allowing Unicode
    if (typeof value === 'string') {
      if (field === 'code') {
        // Allow Unicode Letters, Numbers, hyphen and underscore ONLY
        sanitizedValue = value.replace(/[^\p{L}\p{N}_-]/gu, '');
      } else if (field === 'name') {
        // Allow Unicode Letters, Numbers, Spaces, hyphen and underscore ONLY
        sanitizedValue = value.replace(/[^\p{L}\p{N}\s_-]/gu, '');
      } else if (field === 'description') {
        // Allow Unicode Letters, Numbers, Spaces, underscore (_) and hyphen (-) ONLY
        sanitizedValue = value.replace(/[^\p{L}\p{N}\s_-]/gu, '');
      }
    }

    setFormData(prev => ({ ...prev, [field]: sanitizedValue }));
    if (errors[field as keyof MasterDataFormErrors]) {
      setErrors(prev => {
        const newErrs = { ...prev };
        delete newErrs[field as keyof MasterDataFormErrors];
        return newErrs;
      });
    }
  };

  return {
    formData,
    setField,
    errors,
    handleSubmit
  };
}

