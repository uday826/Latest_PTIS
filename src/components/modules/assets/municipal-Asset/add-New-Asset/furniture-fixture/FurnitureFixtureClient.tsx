"use client";

import type { InventoryBatchListResponse } from "@/app/[locale]/assets/municipal-Asset/add-New-Asset/furniture-fixture/actions";
import { Badge, Card, CardContent, DeleteButton, EditButton, MasterTable } from "@/components/common";
import type { InventoryItemCategory, InventoryItemCondition, InventoryItemModel, InventoryItemName } from "@/lib/api/asset/inventory.service";
import { FileText, Image as ImageIcon, Loader2, Package2 } from "lucide-react";
import React, { useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useAssetForm } from "../AssetFormContext";
import { formatCurrency, inventoryMeta, PAGE_SIZE } from "./FurnitureFixtureConstants";
import { InventoryCVGroupTable } from "./InventoryCVGroupTable";
import { InventoryEditDrawer } from "./InventoryEditDrawer";
import { InventoryFormSection } from "./InventoryFormSection";
import { InvoiceDrawer } from "./InvoiceDrawer";
import { useFurnitureFixtureState } from "./useFurnitureFixtureState";
import { calculateMovableCVAction } from "@/app/[locale]/assets/municipal-Asset/add-New-Asset/furniture-fixture/actions";

interface Props {
  parentAssetId?: number | null;
  categories?: InventoryItemCategory[];
  conditions?: InventoryItemCondition[];
  itemNames?: InventoryItemName[];
  itemModels?: InventoryItemModel[];
  initialBatches?: InventoryBatchListResponse | null;
}

const formatCurrencyCompact = (value: number): string => {
  if (value >= 1000000) {
    return `₹${(value / 1000000).toFixed(2).replace(/\.?0+$/, "")}M`;
  }
  return formatCurrency(value);
};

export default function FurnitureFixtureClient({ parentAssetId, categories = [], conditions = [], itemNames = [], itemModels = [], initialBatches = null }: Props): React.ReactElement {
  // Pass parentAssetId to state hook for immediate save operations
  const s = useFurnitureFixtureState(categories, conditions, itemNames, itemModels, initialBatches, parentAssetId);
  const { registerSubmitHook, formData } = useAssetForm();

  // Register the inventory save function so Save & Next can trigger it
  const saveInventory = useCallback(async (): Promise<boolean> => {

    // Use DB flag when present; fall back to isMovableCategory for legacy URLs
    const isInventoryMandatory =
      formData.isInventoryMandatory !== undefined
        ? formData.isInventoryMandatory === true
        : formData.isMovableCategory === true;

    // 1. Block if mandatory and no items added
    if (isInventoryMandatory && (!s.rows || s.rows.length === 0)) {
      toast.error('At least one inventory item is required before proceeding.');
      return false;
    }

    // 2. Optional — allow proceeding with no rows
    if (!isInventoryMandatory && (!s.rows || s.rows.length === 0)) {
      return true;
    }

    // 3. Warn if form has unadded inputs (unchanged)
    const hasUnaddedInputs = s.form.type || s.form.itemName || s.form.modelName;
    if (hasUnaddedInputs) {
      toast.warning('You have configured inventory details that haven\'t been added...');
      return false;
    }

    // 4. Trigger movable CV calculation for the parent asset
    // POST /api/AssetCapitalValue/movable/calculate-cv
    // Updates AssetMaster.CapitalValue = PurchaseValue × (1 - depreciation) × conditionFactor
    if (parentAssetId && parentAssetId > 0) {
      try {
        await calculateMovableCVAction(parentAssetId, 1.0);
      } catch { /* non-fatal — CV visible on valuation step */ }
    }

    return true;
  }, [s.rows, s.form, formData.isInventoryMandatory, formData.isMovableCategory, parentAssetId]);

  useEffect(() => {
    if (registerSubmitHook) {
      registerSubmitHook(saveInventory);
    }
    return () => {
      if (registerSubmitHook) {
        registerSubmitHook(null);
      }
    };
  }, [registerSubmitHook, saveInventory]);

  const tableData = React.useMemo(() => {
    return s.paginatedRows.map((row, index) => ({
      ...row,
      srNo: (s.currentPage - 1) * PAGE_SIZE + index + 1,
    }));
  }, [s.paginatedRows, s.currentPage]);

  return (
    <div>
      <div className="space-y-2 pb-1.5">
        {/* <TableHeader title="Furniture & Fixtures Inventory" subtitle="" icon={Package2} className="rounded-xl border border-[#CBD8EA] bg-[#F5F8FD] shadow-sm" /> */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {s.summaryCards.map((card, index) => (
            <Card key={card.type} variant="bordered" className={`rounded-xl border border-[#D8E3F1] bg-white shadow-sm ${card.cardRing}`}>
              <CardContent className="flex items-start justify-between gap-2 px-2 py-1.5">
                <div className="min-w-0">
                  <p className="truncate text-base font-bold leading-none text-[#1D4ED8] sm:text-lg lg:text-md xl:text-base">{formatCurrencyCompact(card.totalAmount)}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-700 truncate sm:text-sm">{String.fromCharCode(65 + index)}) {card.label}</p>
                  <p className="text-[10px] text-slate-500 sm:text-xs">{card.totalItems} items</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card variant="bordered" padding="sm" className="rounded-xl border border-[#BFD0E6] bg-white shadow-md">
          <CardContent className="space-y-2">
            <div className="mb-1 flex flex-col gap-2 border-b border-[#D7E1EE] pb-1.5 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-semibold text-[#1E40AF] sm:text-xl">Furniture & Fixtures Inventory</h2>
              <p className="text-sm font-medium text-[#1D4ED8]">Total {s.filteredRows.length} items</p>
            </div>
            <InventoryFormSection
              form={s.form}
              updateForm={(k, v) => s.setForm(prev => ({ ...prev, [k]: v }))}
              handleTypeChange={(val) => s.setForm(prev => ({
                ...prev,
                type: val as any,
                itemName: "",
                modelName: ""
              }))}
              handleItemNameChange={(val) => s.setForm(prev => ({
                ...prev,
                itemName: val,
                modelName: ""
              }))}
              addPhotoInputRef={s.addPhotoInputRef}
              handleAddPhotoUpload={s.handleAddPhotoUpload}
              openInvoiceDrawer={() => s.openInvoiceDrawer(false)}
              addInvoicePreviewLabel={s.draftInvoice?.invoiceNumber || "Add Invoice"}
              handleAddRow={s.handleAddRow}
              formError={s.formError}
              dynamicCategoryOptions={s.dynamicCategoryOptions}
              dynamicConditionOptions={s.dynamicConditionOptions}
              dynamicItemNameOptions={s.dynamicItemNameOptions}
              dynamicModelOptions={s.dynamicModelOptions}
              departments={s.departments}
            />
          </CardContent>
        </Card>

        <Card variant="bordered" padding="none" className="overflow-hidden rounded-xl border border-[#BFD0E6] bg-white shadow-md">
          <div className="w-full overflow-x-auto">
            <div className="flex items-center justify-between gap-3 border-b border-[#D7E1EE] bg-[#F7FAFF] px-3 py-2">
              <div className="text-sm font-semibold text-slate-700">Inventory</div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-600">Type</span>
                <select value={s.filterType} onChange={(e) => { s.setFilterType(e.target.value); s.setCurrentPage(1); }} className="h-9 rounded-lg border border-slate-300 bg-white px-2 text-sm text-slate-700 focus:ring-1 focus:ring-blue-500">
                  <option value="all">All</option>
                  <option value="furniture">Furniture</option>
                  <option value="it-equipment">IT Equipment</option>
                  <option value="electronic-fixtures">Electronic Fixtures</option>
                  <option value="vehicle">Vehicle</option>
                </select>
              </div>
            </div>
            <MasterTable
              data={tableData}
              columns={[
                { key: "srNo", label: "No." },
                {
                  key: "type", label: "Type", render: (_, row) => {
                    const meta = inventoryMeta[row.type];
                    return <Badge variant="outline" size="sm" className={meta?.badgeClassName || "bg-gray-50 text-gray-700 border-gray-200"}>{meta?.label || row.type}</Badge>;
                  }
                },
                { key: "photoUrl", label: "Photo", render: (_, row) => {
                  if (row.photoUrl) {
                    return <img src={row.photoUrl} alt={row.itemName} className="h-12 w-12 rounded-lg border object-cover cursor-pointer hover:opacity-80 transition-opacity" onClick={() => s.handlePreviewDocument(row, 'photo')} title="Click to preview local photo" />;
                  } else if (row.photoName) {
                    return <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-blue-500 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => s.handlePreviewDocument(row, 'photo')} title={`Click to preview: ${row.photoName}`}><ImageIcon className="h-5 w-5" /></div>;
                  } else {
                    return <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-dashed bg-slate-50 text-slate-400" title="No photo uploaded"><Package2 className="h-4 w-4" /></div>;
                  }
                } },
                { key: "itemName", label: "Item / Equipment Name" },
                { key: "modelName", label: "Type / Model / Brand", render: (val) => <span className="font-medium text-blue-700">{String(val ?? "-")}</span> },
                { key: "specifications", label: "Specs / Reg No." },
                { key: "purchaseDate", label: "Date" },
                { key: "owningDepartment", label: "Owning Dept", render: (val) => <span className="text-slate-600">{String(val ?? "-")}</span> },
                { key: "condition", label: "Cond. / Status", render: (val) => <Badge variant="default" size="sm" className="border-sky-200 bg-sky-50 text-sky-700">{String(val ?? "-")}</Badge> },
                { key: "quantity", label: "Quantity" },
                { key: "unitValue", label: "Unit Value (₹)", render: (val) => formatCurrency(Number(val ?? 0)) },
                { key: "total", label: "Total (₹)", render: (val) => <span className="font-semibold text-blue-700">{formatCurrency(Number(val ?? 0))}</span> },
                { key: "totalCV", label: "Live CV (₹)", render: (val) => <span className="font-bold text-emerald-600">{formatCurrency(Number(val ?? 0))}</span> },
                { key: "invoice", label: "Invoice", render: (val, row) => {
                  const inv = val as any;
                  if (inv?.invoiceNumber) {
                    return (
                      <div 
                        className="flex flex-col h-12 w-12 items-center justify-center rounded-lg border border-amber-200 bg-amber-50 text-amber-600 cursor-pointer hover:bg-amber-100 transition-colors" 
                        onClick={() => s.handlePreviewDocument(row, 'invoice')} 
                        title={`Click to preview Invoice: ${inv.invoiceNumber}`}
                      >
                        <FileText className="h-4 w-4 mb-1" />
                        <span className="text-[9px] font-bold leading-none truncate w-10 text-center">{inv.invoiceNumber}</span>
                      </div>
                    );
                  } else {
                    return <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-dashed bg-slate-50 text-slate-400" title="No invoice uploaded"><FileText className="h-4 w-4 opacity-50" /></div>;
                  }
                } },
              ]}
              emptyText="No inventory rows added yet."
              renderActions={(row) => (
                <>
                  <EditButton onClick={() => s.handleStartEdit(row)} />
                  <DeleteButton onClick={() => s.handleDeleteRow(row.id)} />
                </>
              )}
              actionLabel="Actions" pageNumber={s.currentPage} pageSize={PAGE_SIZE} totalCount={s.filteredRows.length} totalPages={Math.max(1, Math.ceil(s.filteredRows.length / PAGE_SIZE))} onPageChange={s.setCurrentPage} paginationConfig={{ enabled: true }} maxBodyHeightClassName="max-h-none" tableClassName="min-w-[1160px]" containerClassName="overflow-hidden rounded-xl border border-[#CBD8EA]"
            />
          </div>
          <div className="border-t border-[#D7E1EE] bg-[#F7FAFF] p-3 flex sm:justify-end gap-3 flex-wrap">
            <Card variant="bordered" className="w-full sm:max-w-[260px] overflow-hidden rounded-xl border border-[#0F172A] bg-[#0F172A] text-white shadow-md">
              <CardContent className="px-3 py-2 flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-semibold text-slate-300">GRAND PURCHASE TOTAL</p>
                  <p className="mt-1 text-lg font-bold sm:text-xl">{formatCurrency(s.grandAssetValue)}</p>
                  <p className="mt-1 text-xs text-slate-300">{s.rows.length} items</p>
                </div>
                <div className="text-right border-l border-slate-700 pl-3">
                  <p className="text-[10px] font-semibold text-emerald-300">GRAND CV</p>
                  <p className="mt-1 text-lg font-bold sm:text-xl text-emerald-400">{formatCurrency(s.grandCV)}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </Card>

        {s.categoryGroups.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Category-wise CV & Individual Asset Register</h3>
                <p className="text-sm text-slate-500">
                  Each item will be registered as a separate Asset Master with unique Asset No. when you click <strong>Save &amp; Next</strong>.
                </p>
              </div>
              <div className="mt-3 sm:mt-0 flex flex-col items-end gap-2">
                {s.isSaving && (
                  <div className="flex items-center gap-2 text-blue-600">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm font-medium">Saving inventory...</span>
                  </div>
                )}
                {s.saveError && <p className="text-xs text-red-500 max-w-[200px] text-right">{s.saveError}</p>}
                {s.saveSuccess && <p className="text-xs text-emerald-600 font-semibold">✓ Inventory saved successfully!</p>}
              </div>
            </div>

            <InventoryCVGroupTable
              groups={s.categoryGroups}
              grandPurchase={s.grandAssetValue}
              grandCV={s.grandCV}
            />
          </div>
        )}
      </div>

      <InventoryEditDrawer
        open={s.editDrawerOpen}
        onClose={s.resetEditForm}
        editForm={s.editForm}
        updateEditForm={(k, v) => s.setEditForm(prev => ({ ...prev, [k]: v }))}
        handleEditTypeChange={(val) => s.setEditForm(prev => ({ ...prev, type: val as any, itemName: "", modelName: "", condition: "" }))}
        handleEditItemNameChange={(val) => s.setEditForm(prev => ({ ...prev, itemName: val, modelName: "" }))}
        editPhotoInputRef={s.editPhotoInputRef}
        handleEditPhotoUpload={s.handleEditPhotoUpload}
        openInvoiceDrawer={() => s.openInvoiceDrawer(true)}
        editInvoicePreviewLabel={s.editDraftInvoice?.invoiceNumber || "Add Invoice"}
        handleUpdateRow={s.handleUpdateRow}
        formError={s.formError}
        dynamicCategoryOptions={s.dynamicCategoryOptions}
        dynamicConditionOptions={s.dynamicEditConditionOptions}
        dynamicItemNameOptions={s.dynamicEditItemNameOptions}
        dynamicModelOptions={s.dynamicEditModelOptions}
        departments={s.departments}
      />

      {s.editDrawerOpen && s.invoiceDrawerOpen && <div className="fixed top-0 right-0 z-50 h-full w-[95vw] bg-white/10 backdrop-blur-sm md:w-[900px]" />}

      <InvoiceDrawer
        open={s.invoiceDrawerOpen}
        onClose={() => s.setInvoiceDrawerOpen(false)}
        invoiceForm={s.invoiceForm}
        updateInvoiceForm={(k, v) => s.setInvoiceForm(prev => ({ ...prev, [k]: v }))}
        existingInvoiceOptions={s.existingInvoiceOptions}
        invoiceInputRef={s.invoiceInputRef}
        handleInvoiceUpload={s.handleInvoiceUpload}
        saveInvoiceDetails={s.saveInvoiceDetails}
        invoiceError={s.invoiceError}
      />
    </div>
  );
}


