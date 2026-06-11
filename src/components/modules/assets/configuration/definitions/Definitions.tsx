'use client';

import React, { useState, useCallback, useEffect } from 'react';
import type { ScreenFieldsMasterProps as DefinitionsProps, AssetCategory, AssetType, AssetFieldDefinition } from '@/types/asset-type/definitions.types';
import { useDefinitionsLogic } from '@/hooks/asset-hooks/definitions-hooks/useDefinitionsLogic';
import { ScreenList } from './ScreenList';
import { ScreenSectionsAndFields } from './ScreenSectionsAndFields';
import { FieldFormModal } from './FieldFormModal';
import { DocDefList } from './DocDefList';
import { DocDefFormModal, type DocumentDefinitionFormData } from './DocDefFormModal';
import type { AssetDocumentDefinitionDto } from '@/lib/api/asset/asset-document.service';
import { getDocumentDefinitionsAction, saveDocumentDefinitionAction, deleteDocumentDefinitionAction } from '@/app/[locale]/assets/configuration/definitions/action';
import { LayoutList, FileBadge } from 'lucide-react';
import { toast } from 'sonner';

type ActiveTab = 'fields' | 'documents';

export function Definitions(props: DefinitionsProps): React.ReactElement {
  const {
    categoryId,
    typeId,
    viewAll,
    categories,
    types,
    fields,
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
  } = useDefinitionsLogic(props.onManageData, props.initialData);

  // ── Document Definitions State ──────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<ActiveTab>('fields');
  const [docDefs, setDocDefs] = useState<AssetDocumentDefinitionDto[]>(
    props.initialData?.docDefsResult?.items || []
  );
  const [docDefsLoading, setDocDefsLoading] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState<AssetDocumentDefinitionDto | null>(null);
  const [docDefsLoaded, setDocDefsLoaded] = useState<string>(
    props.initialData?.categoryId
      ? `${props.initialData.categoryId}-${props.initialData.typeId || 'null'}`
      : ''
  );

  // Sync state when initialData changes from SSR/RSC updates
  useEffect(() => {
    if (props.initialData?.docDefsResult?.items) {
      setDocDefs(props.initialData.docDefsResult.items);
      setDocDefsLoaded(
        props.initialData.categoryId
          ? `${props.initialData.categoryId}-${props.initialData.typeId || 'null'}`
          : ''
      );
    }
  }, [props.initialData]);

  // Fetch document definitions when switching to doc tab or when selection changes
  const fetchDocDefs = useCallback(async (catId: number | null, tId: number | null) => {
    setDocDefsLoading(true);
    try {
      if (!catId) {
        setDocDefs([]);
        return;
      }
      const key = `${catId}-${tId || 'null'}`;
      const res = await getDocumentDefinitionsAction(catId, tId || null);
      if (res.success && res.data) {
        setDocDefs(res.data);
      } else {
        setDocDefs([]);
      }
      setDocDefsLoaded(key);
    } catch (err) {
      console.error('Error fetching document definitions:', err);
      setDocDefs([]);
    } finally {
      setDocDefsLoading(false);
    }
  }, []);

  // Refetch when tab switches to documents (or when category/type changes while on doc tab)
  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (tab === 'documents') {
      if (categoryId) {
        const key = `${categoryId}-${typeId || 'null'}`;
        if (docDefsLoaded !== key) {
          fetchDocDefs(categoryId, typeId || null);
        }
      } else {
        setDocDefs([]);
        setDocDefsLoaded('');
      }
    }
  };

  // Also refetch on category/type change if we're already on doc tab
  const handleCategorySelectWithSync = (id: number | null) => {
    handleCategorySelect(id);
    setDocDefsLoaded('');
    setDocDefs([]);
    if (activeTab === 'documents') {
      if (id) {
        fetchDocDefs(id, null);
      }
    }
  };

  const handleTypeSelectWithSync = (id: number | null) => {
    handleTypeSelect(id);
    setDocDefsLoaded('');
    setDocDefs([]);
    if (activeTab === 'documents' && categoryId && id) {
      fetchDocDefs(categoryId, id);
    }
  };

  const handleViewAllSelectWithSync = () => {
    handleViewAllSelect();
    setDocDefsLoaded('');
    setDocDefs([]);
  };

  // ── Doc Def CRUD ─────────────────────────────────────────────────────────────
  const handleAddDoc = () => {
    setEditingDoc(null);
    setShowDocModal(true);
  };

  const handleEditDoc = (def: AssetDocumentDefinitionDto) => {
    setEditingDoc(def);
    setShowDocModal(true);
  };

  const handleDeleteDoc = async (id: number) => {
    const res = await deleteDocumentDefinitionAction(id);
    if (res.success) {
      setDocDefs(prev => prev.filter(d => d.id !== id));
      toast.success('Document definition deleted successfully');
    } else {
      toast.error(res.error || 'Failed to delete document definition');
    }
  };

  const handleSaveDoc = async (data: DocumentDefinitionFormData) => {
    const payload = {
      assetCategoryId: data.assetCategoryId || categoryId,
      assetTypeId: data.assetTypeId || typeId,
      documentCode: data.documentCode,
      documentName: data.documentName,
      description: data.description || null,
      isRequired: Boolean(data.isRequired),
      maxFileSizeMB: Number(data.maxFileSizeMB),
      allowedExtensions: data.allowedExtensions,
      displayOrder: Number(data.displayOrder),
    };

    const res = await saveDocumentDefinitionAction(data.id || null, payload);
    if (res.success && res.data) {
      const savedDoc = res.data;
      if (data.id) {
        setDocDefs(prev => prev.map(d => (d.id === data.id ? savedDoc : d)));
      } else {
        setDocDefs(prev => [...prev, savedDoc]);
      }
      setShowDocModal(false);
      setEditingDoc(null);
      toast.success(`Document definition ${data.id ? 'updated' : 'created'} successfully`);
    } else {
      toast.error(res.error || `Failed to ${data.id ? 'update' : 'create'} document definition`);
    }
  };

  // ── Derived values ────────────────────────────────────────────────────────────
  const selectedCategory = categories.find((c: AssetCategory) => c.id === categoryId);
  const selectedType = types.find((t: AssetType) => t.id === typeId);
  const selectedCategoryName = selectedCategory ? selectedCategory.categoryName : null;
  const selectedTypeName = selectedType ? selectedType.typeName : null;

  const uniqueFieldGroups = React.useMemo(() => {
    const groupsSet = new Set<string>();
    fields.forEach((f: AssetFieldDefinition) => {
      if (f.fieldGroup?.trim()) groupsSet.add(f.fieldGroup.trim());
    });
    return Array.from(groupsSet);
  }, [fields]);

  // Convert editingDoc to form shape
  const editingDocForm: DocumentDefinitionFormData | null = editingDoc
    ? {
        id: editingDoc.id,
        assetCategoryId: editingDoc.assetCategoryId,
        assetTypeId: editingDoc.assetTypeId ?? null,
        documentCode: editingDoc.documentCode,
        documentName: editingDoc.documentName,
        description: editingDoc.description ?? '',
        isRequired: editingDoc.isRequired,
        maxFileSizeMB: editingDoc.maxFileSizeMB,
        allowedExtensions: editingDoc.allowedExtensions,
        displayOrder: editingDoc.displayOrder,
      }
    : null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-12 gap-6 items-stretch min-h-[calc(100vh-240px)]">
        {/* Left Column: Sidebar */}
        <div className="col-span-12 md:col-span-4 lg:col-span-3">
          <ScreenList
            categories={categories}
            types={types}
            selectedCategoryId={categoryId}
            selectedTypeId={typeId}
            viewAll={viewAll}
            onCategorySelect={handleCategorySelectWithSync}
            onTypeSelect={handleTypeSelectWithSync}
            onViewAllSelect={handleViewAllSelectWithSync}
            isLoading={isPending}
            activeTab={activeTab}
          />
        </div>

        {/* Right Column */}
        <div className="col-span-12 md:col-span-8 lg:col-span-9 flex flex-col min-h-0">
          {(() => {
            const tabsComponent = (
              <div className="flex items-center gap-1 bg-black/20 p-1 rounded-lg border border-white/10">
                <button
                  onClick={() => handleTabChange('fields')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                    activeTab === 'fields'
                      ? 'bg-white text-[#33445c] shadow-sm'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <LayoutList className="w-3.5 h-3.5" />
                  Field Definitions
                </button>
                <button
                  onClick={() => handleTabChange('documents')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                    activeTab === 'documents'
                      ? 'bg-white text-[#33445c] shadow-sm'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <FileBadge className="w-3.5 h-3.5" />
                  Document Definitions
                </button>
              </div>
            );

            return activeTab === 'fields' ? (
              <ScreenSectionsAndFields
                selectedCategoryName={selectedCategoryName}
                selectedTypeName={selectedTypeName}
                fields={fields}
                isLoading={isPending}
                viewAll={viewAll}
                categories={categories}
                types={types}
                onAddField={handleAddField}
                onEditField={handleEditField}
                onDeleteField={handleDeleteField}
                tabsComponent={tabsComponent}
              />
            ) : (
              <DocDefList
                definitions={docDefs}
                isLoading={docDefsLoading}
                hasSelection={!!selectedTypeName}
                selectedCategoryName={selectedCategoryName}
                selectedTypeName={selectedTypeName}
                onAdd={handleAddDoc}
                onEdit={handleEditDoc}
                onDelete={handleDeleteDoc}
                onRefresh={() => fetchDocDefs(categoryId, typeId)}
                tabsComponent={tabsComponent}
              />
            );
          })()}
        </div>
      </div>

      {/* Field Form Modal */}
      <FieldFormModal
        key={editingField?.id || (showFieldModal ? 'new-field-open' : 'new-field-closed')}
        isOpen={showFieldModal}
        onClose={handleCloseModal}
        onSave={handleSaveField}
        existingField={editingField}
        fieldGroups={uniqueFieldGroups}
        existingFields={fields}
      />

      {/* Document Definition Form Modal */}
      <DocDefFormModal
        key={editingDoc?.id ?? (showDocModal ? 'new-doc-open' : 'new-doc-closed')}
        isOpen={showDocModal}
        onClose={() => { setShowDocModal(false); setEditingDoc(null); }}
        onSave={handleSaveDoc}
        existingDef={editingDocForm}
        assetCategoryId={categoryId ?? 0}
        assetTypeId={typeId ?? null}
      />
    </div>
  );
}
