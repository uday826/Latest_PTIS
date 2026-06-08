'use client';

import { useCallback, useMemo, useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { AssetFieldDefinition } from '@/types/asset-type/screenfieldmaster.types';
import { saveFieldDefinitionAction, deleteFieldDefinitionAction } from '@/app/[locale]/assets/configuration/screen-fields-master/action';

export function useAssetFieldsLogic(_onManageData?: (field: AssetFieldDefinition) => void, initialData?: any) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // --- URL State ---
  const categoryId = useMemo(() => {
    const val = searchParams.get('categoryId');
    return val ? Number(val) : null;
  }, [searchParams]);

  const typeId = useMemo(() => {
    const val = searchParams.get('typeId');
    return val ? Number(val) : null;
  }, [searchParams]);

  const viewAll = useMemo(() => {
    return searchParams.get('viewAll') === 'true';
  }, [searchParams]);

  const modalType = useMemo(() => searchParams.get('modal'), [searchParams]);
  const actionType = useMemo(() => searchParams.get('action'), [searchParams]);
  const targetId = useMemo(() => searchParams.get('id'), [searchParams]);

  // --- Data from Server (SSR Initial + CSR Revalidation/State) ---
  const categories = useMemo(() => initialData?.categoriesResult?.items || [], [initialData]);
  const types = useMemo(() => initialData?.typesResult?.items || [], [initialData]);
  const fields = useMemo(() => initialData?.fieldsResult?.items || [], [initialData]);

  // --- Filter states ---
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroupFilter, setSelectedGroupFilter] = useState('all');

  // --- Modal Forms state ---
  const showFieldModal = modalType === 'fieldForm';
  const editingField = useMemo(() => {
    if (!showFieldModal || !targetId || actionType !== 'edit') return null;
    return fields.find((f: AssetFieldDefinition) => String(f.id) === String(targetId)) || null;
  }, [showFieldModal, targetId, actionType, fields]);

  // --- URL updates Helper ---
  const updateUrl = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pathname, searchParams, router]);

  // --- Selection Handlers ---
  const handleCategorySelect = useCallback((catId: number | null) => {
    updateUrl({
      viewAll: null,
      categoryId: catId ? String(catId) : null,
      typeId: null, // Reset Type selection
      modal: null,
      action: null,
      id: null,
    });
  }, [updateUrl]);

  const handleTypeSelect = useCallback((tId: number | null) => {
    updateUrl({
      viewAll: null,
      typeId: tId ? String(tId) : null,
      modal: null,
      action: null,
      id: null,
    });
  }, [updateUrl]);

  const handleViewAllSelect = useCallback(() => {
    updateUrl({
      viewAll: 'true',
      categoryId: null,
      typeId: null,
      modal: null,
      action: null,
      id: null,
    });
  }, [updateUrl]);

  // --- Modal Trigger Handlers ---
  const handleAddField = useCallback(() => {
    updateUrl({ modal: 'fieldForm', action: 'add', id: null });
  }, [updateUrl]);

  const handleEditField = useCallback((field: AssetFieldDefinition) => {
    updateUrl({ modal: 'fieldForm', action: 'edit', id: String(field.id) });
  }, [updateUrl]);

  const handleCloseModal = useCallback(() => {
    updateUrl({ modal: null, action: null, id: null });
  }, [updateUrl]);

  // --- Mutation Handlers ---
  const handleSaveField = useCallback(async (formData: Record<string, any>) => {
    if (!categoryId || !typeId) return;

    startTransition(async () => {
      const payload = {
        ...formData,
        assetCategoryId: categoryId,
        assetTypeId: typeId,
      };

      const res = await saveFieldDefinitionAction(payload);
      if (res.success) {
        handleCloseModal();
      } else {
        alert(res.error || 'Failed to save field definition');
      }
    });
  }, [categoryId, typeId, handleCloseModal]);

  const handleDeleteField = useCallback(async (id: number) => {
    if (!confirm('Are you sure you want to delete this field definition?')) return;

    startTransition(async () => {
      const res = await deleteFieldDefinitionAction(id);
      if (!res.success) {
        alert(res.error || 'Failed to delete field definition');
      }
    });
  }, []);

  return {
    categoryId,
    typeId,
    viewAll,
    categories,
    types,
    fields,
    searchTerm,
    setSearchTerm,
    selectedGroupFilter,
    setSelectedGroupFilter,
    showFieldModal,
    editingField,
    isPending,
    handleCategorySelect,
    handleTypeSelect,
    handleViewAllSelect,
    handleAddField,
    handleEditField,
    handleCloseModal,
    handleSaveField,
    handleDeleteField,
  };
}
