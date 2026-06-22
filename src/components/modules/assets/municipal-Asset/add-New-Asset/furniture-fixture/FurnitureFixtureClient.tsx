"use client";

import React, { useEffect, useCallback, useRef } from "react";
import { Badge, Card, CardContent, DeleteButton, EditButton, MasterTable, SearchSelect } from "@/components/common";
import { Package2, Image as ImageIcon, FileText, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { inventoryMeta, PAGE_SIZE, formatCurrency, formatCurrencyCompact } from "./FurnitureFixtureConstants";
import { InventoryFormSection } from "./InventoryFormSection";
import { InventoryEditDrawer } from "./InventoryEditDrawer";
import { InvoiceDrawer } from "./InvoiceDrawer";
import { useFurnitureFixtureState } from "./useFurnitureFixtureState";
import { InventoryCVGroupTable } from "./InventoryCVGroupTable";
import type { InventoryItemCategory, InventoryItemCondition, InventoryItemName, InventoryItemModel } from "@/lib/api/asset/inventory.service";
import type { InventoryBatchListResponse } from "@/app/[locale]/assets/municipal-Asset/add-New-Asset/furniture-fixture/actions";
import { useAssetForm } from "../AssetFormContext";
import { toast } from "sonner";
import { calculateMovableCVAction } from "@/app/[locale]/assets/municipal-Asset/add-New-Asset/furniture-fixture/actions";
import { fetchUploadedDocumentsAction, fetchDocumentFileAction } from "@/app/[locale]/assets/municipal-Asset/add-New-Asset/actions";
import { useTranslations } from "next-intl";

interface Props {
  parentAssetId?: number | null;
  categories?: InventoryItemCategory[];
  conditions?: InventoryItemCondition[];
  itemNames?: InventoryItemName[];
  itemModels?: InventoryItemModel[];
  initialBatches?: InventoryBatchListResponse | null;
}



interface RowDocumentThumbnailProps {
  row: any;
  type: 'photo' | 'invoice';
  handlePreview: () => void;
}

function RowDocumentThumbnail({ row, type, handlePreview }: RowDocumentThumbnailProps) {
  const [src, setSrc] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (type === 'photo' && row.photoUrl) {
      setSrc(row.photoUrl);
      return;
    }

    if (row.isRegistered) {
      const batchId = row.batchId;
      const targetName = type === 'photo' ? row.photoName : row.invoice?.invoiceFileName;

      if (!batchId || !targetName) {
        setSrc(null);
        return;
      }

      let active = true;
      const load = async () => {
        try {
          setLoading(true);
          // Import this action dynamically or add it to imports at top
          const { getInventoryBatchDocumentsAction } = await import("@/app/[locale]/assets/municipal-Asset/add-New-Asset/furniture-fixture/actions");
          const docResponse = await getInventoryBatchDocumentsAction(batchId);
          if (!active) return;
          if (docResponse.success && docResponse.data) {
            const documents = docResponse.data;
            let targetDoc;
            if (type === 'photo' && row.photoName) {
              targetDoc = documents.find((d: any) => 
                d.fileName === row.photoName || d.fileName === `photo_${row.photoName}` ||
                d.originalFileName === row.photoName || d.originalFileName === `photo_${row.photoName}`
              );
            } else if (type === 'invoice' && row.invoice?.invoiceFileName) {
              targetDoc = documents.find((d: any) => 
                d.fileName === row.invoice!.invoiceFileName || d.fileName === `invoice_${row.invoice!.invoiceFileName}` ||
                d.originalFileName === row.invoice!.invoiceFileName || d.originalFileName === `invoice_${row.invoice!.invoiceFileName}`
              );
            }
            if (targetDoc) {
              const fileRes = await fetchDocumentFileAction(targetDoc.id);
              if (!active) return;
              if (fileRes.success && fileRes.data) {
                const isImage = fileRes.mimeType?.startsWith('image/') ||
                  targetName.toLowerCase().match(/\.(jpg|jpeg|png|webp|gif|bmp)$/);
                if (isImage) {
                  setSrc(`data:${fileRes.mimeType || 'image/jpeg'};base64,${fileRes.data}`);
                }
              }
            }
          }
        } catch (err) {
          console.error("Failed to load thumbnail:", err);
        } finally {
          if (active) setLoading(false);
        }
      };
      load();
      return () => {
        active = false;
      };
    }
  }, [row.photoUrl, row.photoName, row.invoice?.invoiceFileName, row.isRegistered, type]);

  if (loading) {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-dashed bg-slate-50 text-slate-400">
        <Loader2 className="h-3 w-3 animate-spin text-blue-600" />
      </div>
    );
  }

  if (type === 'photo') {
    if (src) {
      return (
        <img
          src={src}
          alt={row.itemName}
          className="h-8 w-8 rounded-lg border object-cover cursor-pointer hover:opacity-80 transition-opacity"
          onClick={handlePreview}
          title="Click to preview photo"
        />
      );
    }
    if (row.photoName) {
      return (
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-blue-500 cursor-pointer hover:bg-slate-100 transition-colors"
          onClick={handlePreview}
          title={`Click to preview: ${row.photoName}`}
        >
          <ImageIcon className="h-4 w-4" />
        </div>
      );
    }
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-dashed bg-slate-50 text-slate-400" title="No photo uploaded">
        <Package2 className="h-3 w-3" />
      </div>
    );
  } else {
    const invoiceNumber = row.invoice?.invoiceNumber;
    if (invoiceNumber) {
      return (
        <div
          className="flex flex-col h-8 w-8 items-center justify-center rounded-lg border border-amber-200 bg-amber-50 text-amber-600 cursor-pointer hover:bg-amber-100 transition-colors overflow-hidden"
          onClick={handlePreview}
          title={`Click to preview Invoice: ${invoiceNumber}`}
        >
          {src ? (
            <img src={src} alt="Invoice" className="h-full w-full object-cover" />
          ) : (
            <>
              <FileText className="h-3 w-3 mb-0.5" />
              <span className="text-[7px] font-bold leading-none truncate w-7 text-center">{invoiceNumber}</span>
            </>
          )}
        </div>
      );
    }
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-dashed bg-slate-50 text-slate-400" title="No invoice uploaded">
        <FileText className="h-3.5 w-3.5 opacity-50" />
      </div>
    );
  }
}

export default function FurnitureFixtureClient({ parentAssetId, categories = [], conditions = [], itemNames = [], itemModels = [], initialBatches = null }: Props): React.ReactElement {
  const t = useTranslations("addAssetForm");
  const summaryScrollRef = useRef<HTMLDivElement>(null);

  const [showLeftArrow, setShowLeftArrow] = React.useState(false);
  const [showRightArrow, setShowRightArrow] = React.useState(false);

  // Pass parentAssetId to state hook for immediate save operations
  const s = useFurnitureFixtureState(categories, conditions, itemNames, itemModels, initialBatches, parentAssetId);

  const checkScrollState = useCallback(() => {
    const el = summaryScrollRef.current;
    if (el) {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      setShowLeftArrow(scrollLeft > 5);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 5);
    }
  }, []);

  useEffect(() => {
    const el = summaryScrollRef.current;
    if (el) {
      // Small timeout to let DOM render
      const timer = setTimeout(checkScrollState, 150);
      el.addEventListener("scroll", checkScrollState);
      window.addEventListener("resize", checkScrollState);
      return () => {
        clearTimeout(timer);
        el.removeEventListener("scroll", checkScrollState);
        window.removeEventListener("resize", checkScrollState);
      };
    }
  }, [s.summaryCards, checkScrollState]);

  const scroll = (direction: 'left' | 'right') => {
    if (summaryScrollRef.current) {
      const scrollAmount = 300;
      summaryScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      // Re-check scroll state after scroll animation finishes
      setTimeout(checkScrollState, 350);
    }
  };
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
      toast.error(t("inventory.toasts.atLeastOneItemRequired") || 'At least one inventory item is required before proceeding.');
      return false;
    }

    // 2. Optional — allow proceeding with no rows
    if (!isInventoryMandatory && (!s.rows || s.rows.length === 0)) {
      return true;
    }

    // 3. Warn if form has unadded inputs (unchanged)
    const hasUnaddedInputs = s.form.type || s.form.itemName || s.form.modelName;
    if (hasUnaddedInputs) {
      toast.warning(t("inventory.toasts.unaddedInputs") || 'You have configured inventory details that haven\'t been added...');
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
  }, [s.rows, s.form, formData.isInventoryMandatory, formData.isMovableCategory, parentAssetId, t]);

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

  const filterOptions = React.useMemo(() => {
    return [
      { label: t("inventory.all") || "All", value: "all" },
      ...s.dynamicCategoryOptions,
    ];
  }, [s.dynamicCategoryOptions, t]);

  return (
    <div>
      <div className="space-y-2 pb-1.5">
        <div className="sticky top-0 z-30 bg-slate-50/90 backdrop-blur-md -mt-3 pt-3 pb-2 space-y-2">
          <div className="relative group/shelf">
            <div
              ref={summaryScrollRef}
              className="flex flex-row flex-nowrap gap-2 overflow-x-auto scroll-smooth scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-1 pr-12"
            >
              {s.summaryCards.map((card, index) => {
                const normalizedType = card.type.toLowerCase().replace(/\s+/g, "-");
                let textColorClass = "text-slate-700";
                if (normalizedType === "furniture") textColorClass = "text-violet-700";
                else if (normalizedType === "it-equipment") textColorClass = "text-blue-700";
                else if (normalizedType === "electronic-fixtures") textColorClass = "text-emerald-700";
                else if (normalizedType === "vehicle") textColorClass = "text-amber-700";

                return (
                  <Card key={card.type} variant="bordered" padding="none" className={`rounded-xl border border-[#D8E3F1] bg-white shadow-sm w-full sm:w-[calc(50%-8px)] md:w-[calc(33.333%-8px)] lg:w-[calc(20%-8px)] shrink-0 ${card.cardRing}`}>
                    <div className="px-3.5 py-3 min-w-0 w-full">
                      <p className={`text-[10px] font-black uppercase tracking-wider truncate sm:text-xs ${textColorClass}`}>
                        {card.label}
                      </p>
                      <p className="mt-1.5 truncate text-base font-bold leading-none text-[#1D4ED8] sm:text-lg">
                        {formatCurrencyCompact(card.totalAmount)}
                      </p>
                      <p className="mt-1.5 text-[11px] font-bold text-slate-600 leading-none">{t("inventory.totalItems", { count: card.totalItems })}</p>
                    </div>
                  </Card>
                );
              })}
              <div className="w-16 shrink-0" />
            </div>

            {/* Floating Left Arrow */}
            {showLeftArrow && (
              <button
                type="button"
                onClick={() => scroll('left')}
                className="absolute left-1 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full border border-[#1E40AF] bg-[#1E40AF] text-white hover:bg-[#1D4ED8] shadow-lg hover:scale-110 active:scale-95 transition-all cursor-pointer"
                title="Scroll Left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}

            {/* Floating Right Arrow */}
            {showRightArrow && (
              <button
                type="button"
                onClick={() => scroll('right')}
                className="absolute right-1 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full border border-[#1E40AF] bg-[#1E40AF] text-white hover:bg-[#1D4ED8] shadow-lg hover:scale-110 active:scale-95 transition-all cursor-pointer"
                title="Scroll Right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            <div className="absolute top-0 right-0 bottom-1 w-16 bg-gradient-to-l from-slate-50/90 via-slate-50/40 to-transparent pointer-events-none z-10" />
          </div>

          {/* Add Form Card */}
          <Card variant="bordered" padding="sm" className="rounded-xl border border-[#BFD0E6] bg-white shadow-md">
            <CardContent className="space-y-2">
              <div className="mb-1 flex flex-col gap-2 border-b border-[#D7E1EE] pb-1.5 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-sm font-bold text-[#1E40AF] sm:text-base">{t("inventory.title")}</h2>
                <p className="text-sm font-medium text-[#1D4ED8]">{t("inventory.totalItems", { count: s.filteredRows.length })}</p>
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
                addInvoicePreviewLabel={s.draftInvoice?.invoiceNumber || t("inventory.addInvoice")}
                handleAddRow={s.handleAddRow}
                formError={s.formError}
                dynamicCategoryOptions={s.dynamicCategoryOptions}
                dynamicConditionOptions={s.dynamicConditionOptions}
                dynamicItemNameOptions={s.dynamicItemNameOptions}
                dynamicModelOptions={s.dynamicModelOptions}
                departments={s.departments}
                isSaving={s.isSaving}
              />
            </CardContent>
          </Card>
        </div>

        <Card variant="bordered" padding="none" className="overflow-hidden rounded-xl border border-[#BFD0E6] bg-white shadow-md">
          <div className="w-full overflow-x-auto">
            <div className="flex items-center justify-between gap-3 border-b border-[#D7E1EE] bg-[#F7FAFF] px-3 py-2">
              <div className="text-sm font-semibold text-slate-700">{t("inventory.heading")}</div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-600">{t("inventory.type")}</span>
                <div className="w-[160px] [&_input]:!h-8 [&_input]:!text-xs [&_button[role=combobox]]:!h-8 [&_button[role=combobox]]:!text-xs [&_button[role=combobox]_span]:!text-xs">
                  <SearchSelect
                    value={s.filterType}
                    onChange={(_, val) => { s.setFilterType(val); s.setCurrentPage(1); }}
                    options={filterOptions}
                    disableSearch={true}
                  />
                </div>
              </div>
            </div>
            <MasterTable
              data={tableData}
              columns={[
                { key: "srNo", label: t("inventory.columns.no"), align: "center" },
                {
                  key: "type", label: t("inventory.columns.type"), align: "center", render: (_, row) => {
                    const meta = inventoryMeta[row.type];
                    return <Badge variant="outline" size="sm" className={meta?.badgeClassName || "bg-gray-50 text-gray-700 border-gray-200"}>{meta?.label || row.type}</Badge>;
                  }
                },
                { key: "itemName", label: t("inventory.columns.itemName") },
                { key: "modelName", label: t("inventory.columns.modelName"), render: (val) => <span className="font-medium text-blue-700">{String(val ?? "-")}</span> },
                { key: "specifications", label: t("inventory.columns.specs"), render: (val) => <div className="max-w-[200px] truncate" title={String(val ?? "-")}>{String(val ?? "-")}</div> },
                { key: "purchaseDate", label: t("inventory.columns.purchaseDate"), align: "center" },
                { key: "owningDepartment", label: t("inventory.columns.owningDept"), render: (val) => <span className="text-slate-600">{String(val ?? "-")}</span> },
                { key: "condition", label: t("inventory.columns.condition"), align: "center", render: (val) => <Badge variant="default" size="sm" className="border-sky-200 bg-sky-50 text-sky-700">{String(val ?? "-")}</Badge> },
                { key: "quantity", label: t("inventory.columns.quantity"), align: "center" },
                { key: "unitValue", label: t("inventory.columns.unitValue"), align: "center", render: (val) => formatCurrencyCompact(Number(val ?? 0)) },
                { key: "total", label: t("inventory.columns.total"), align: "center", render: (val) => <span className="font-semibold text-blue-700">{formatCurrencyCompact(Number(val ?? 0))}</span> },
                { key: "totalCV", label: t("inventory.columns.cv"), align: "center", render: (val) => <span className="font-bold text-emerald-600">{formatCurrencyCompact(Number(val ?? 0))}</span> },
                {
                  key: "photoUrl", label: t("inventory.columns.photo"), align: "center", render: (_, row) => (
                    <RowDocumentThumbnail
                      row={row}
                      type="photo"
                      handlePreview={() => s.handlePreviewDocument(row, 'photo')}
                    />
                  )
                },
                {
                  key: "invoice", label: t("inventory.columns.invoice"), align: "center", render: (_, row) => (
                    <RowDocumentThumbnail
                      row={row}
                      type="invoice"
                      handlePreview={() => s.handlePreviewDocument(row, 'invoice')}
                    />
                  )
                },
              ]}
              emptyText={t("inventory.emptyText")}
              renderActions={(row) => (
                <>
                  <EditButton onClick={() => s.handleStartEdit(row)} />
                  <DeleteButton onClick={() => s.handleDeleteRow(row.id)} />
                </>
              )}
              actionLabel={t("inventory.columns.actions")} pageNumber={s.currentPage} pageSize={PAGE_SIZE} totalCount={s.filteredRows.length} totalPages={Math.max(1, Math.ceil(s.filteredRows.length / PAGE_SIZE))} onPageChange={s.setCurrentPage} paginationConfig={{ enabled: true }} maxBodyHeightClassName="max-h-none" tableClassName="min-w-[1160px] text-xs [&_th]:text-[11px] [&_td]:text-xs [&_th]:py-1.5 [&_td]:py-0.5" containerClassName="overflow-hidden rounded-xl border border-[#CBD8EA]"
            />
          </div>
        </Card>

        {s.categoryGroups.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800">{t("inventory.categoryWiseCv")}</h3>
              </div>
              <div className="mt-3 sm:mt-0 flex flex-col items-end gap-2">
                {s.isSaving && (
                  <div className="flex items-center gap-2 text-blue-600">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm font-medium">{t("inventory.saving")}</span>
                  </div>
                )}
                {s.saveError && <p className="text-xs text-red-500 max-w-[200px] text-right">{s.saveError}</p>}
                {s.saveSuccess && <p className="text-xs text-emerald-600 font-semibold">{t("inventory.saveSuccess")}</p>}
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
        editInvoicePreviewLabel={s.editDraftInvoice?.invoiceNumber || t("inventory.addInvoice")}
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


