'use client';

import React from 'react';
import type { ScreenFieldsMasterProps } from '@/types/asset-type/screenfieldmaster.types';
import { useAssetFieldsLogic } from '@/hooks/asset-hooks/screen-field-master-hooks/useAssetFieldsLogic';
import { ScreenList } from './ScreenList';
import { ScreenSectionsAndFields } from './ScreenSectionsAndFields';
import { FieldFormModal } from './FieldFormModal';

export function ScreenFieldsMaster(props: ScreenFieldsMasterProps): React.ReactElement {
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
  } = useAssetFieldsLogic(props.onManageData, props.initialData);

  // Get active names for the right panel header
  const selectedCategory = categories.find((c: any) => c.id === categoryId);
  const selectedType = types.find((t: any) => t.id === typeId);
  const selectedCategoryName = selectedCategory ? selectedCategory.categoryName : null;
  const selectedTypeName = selectedType ? selectedType.typeName : null;

  // Extract unique field groups to pass to form suggestions
  const uniqueFieldGroups = React.useMemo(() => {
    const groupsSet = new Set<string>();
    fields.forEach((f: any) => {
      if (f.fieldGroup?.trim()) {
        groupsSet.add(f.fieldGroup.trim());
      }
    });
    return Array.from(groupsSet);
  }, [fields]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-12 gap-6 items-stretch min-h-[calc(100vh-180px)]">
        {/* Left Column: Category and Type Selection Sidebar */}
        <div className="col-span-12 md:col-span-4 lg:col-span-3">
          <ScreenList
            categories={categories}
            types={types}
            selectedCategoryId={categoryId}
            selectedTypeId={typeId}
            viewAll={viewAll}
            onCategorySelect={handleCategorySelect}
            onTypeSelect={handleTypeSelect}
            onViewAllSelect={handleViewAllSelect}
            isLoading={isPending}
          />
        </div>

        {/* Right Column: Grouped Field Definitions list */}
        <div className="col-span-12 md:col-span-8 lg:col-span-9 flex flex-col">
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
          />
        </div>
      </div>

      {/* Field Editor Drawer */}
      <FieldFormModal
        key={editingField?.id || (showFieldModal ? 'new-field-open' : 'new-field-closed')}
        isOpen={showFieldModal}
        onClose={handleCloseModal}
        onSave={handleSaveField}
        existingField={editingField}
        fieldGroups={uniqueFieldGroups}
      />
    </div>
  );
}
