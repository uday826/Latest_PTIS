import { useEffect, useState, useRef, useMemo } from "react";
import { useConfirm } from "@/components/common";
import { type InventoryType, type InventoryRow, type InventoryForm, type InvoiceForm, type InventoryInvoice } from "./FurnitureFixtureTypes";
import { inventoryMeta, emptyForm, emptyInvoiceForm, PAGE_SIZE } from "./FurnitureFixtureConstants";
import { enrichRows, buildCategoryGroups, calcRowCV } from "./FurnitureFixtureCV";
import { toast } from "sonner";
import type { InventoryItemCategory, InventoryItemCondition, InventoryItemName, InventoryItemModel } from "@/lib/api/asset/inventory.service";
import {
  saveInventoryBatchAction,
  saveSingleInventoryBatchAction,
  updateInventoryBatchAction,
  deleteInventoryBatchAction,
  getInventoryBatchesAction,
  type InventoryBatchDetail,
  type InventoryBatchListResponse
} from "@/app/[locale]/assets/municipal-Asset/add-New-Asset/furniture-fixture/actions";
import { uploadBulkDocumentsAction, getFallbackModuleIdAction } from "@/app/[locale]/assets/municipal-Asset/add-New-Asset/actions";
import { usePermissionsContext } from "@/lib/providers/PermissionsProvider";
import { usePathname } from "next/navigation";

/**
 * Converts server-fetched batches to client-side InventoryRow format.
 * This enables full SSR - data is fetched on server and passed as props.
 */
function convertBatchesToRows(batches: InventoryBatchDetail[]): InventoryRow[] {
  return batches.map((batch) => ({
    id: batch.batchId, // Use batchId as row id
    type: batch.inventoryType.toLowerCase().replace(/\s+/g, "-") as InventoryType,
    itemName: batch.itemName,
    modelName: batch.modelBrand ?? "",
    specifications: batch.specifications ?? "NA",
    purchaseDate: batch.purchaseDate.split("T")[0], // Extract date part
    condition: batch.condition ?? "",
    quantity: batch.quantity,
    unitValue: batch.unitValue,
    total: batch.totalBatchValue,
    owningDepartment: batch.owningDepartment ?? undefined,
    photoName: batch.photoFileName ?? undefined,
    invoice: batch.invoiceNumber
      ? {
        invoiceMode: "direct",
        invoiceNumber: batch.invoiceNumber,
        invoiceDate: batch.invoiceDate?.split("T")[0] ?? "",
        invoiceFileName: batch.invoiceFileName ?? "",
      }
      : undefined,
    unitCV: batch.totalBatchCV / batch.quantity,
    totalCV: batch.totalBatchCV,
    batchId: batch.batchId,
    isRegistered: batch.isRegistered,
    registeredUnits: batch.units?.map((u) => ({
      assetId: u.assetId,
      assetNo: u.assetNo,
      assetName: u.assetName,
      unitNumber: u.unitNumber,
      unitPurchaseValue: u.unitPurchaseValue ?? batch.unitValue,
      unitCapitalValue: u.unitCapitalValue ?? 0,
      ageInYears: 0,
      depreciationRate: u.depreciationRate ?? 0.1,
      conditionFactor: u.conditionFactor ?? 1.0,
      cvFormula: u.cvFormula ?? "",
      condition: u.condition ?? "",
      serialNumber: u.serialNumber,
      assetTag: u.assetTag,
      dynamicAttributes: u.dynamicAttributes,
    })),
  }));
}

export function useFurnitureFixtureState(
  categories: InventoryItemCategory[] = [],
  conditions: InventoryItemCondition[] = [],
  itemNames: InventoryItemName[] = [],
  itemModels: InventoryItemModel[] = [],
  initialBatches: InventoryBatchListResponse | null = null,
  parentAssetId?: number | null
) {
  const { confirm } = useConfirm();
  const { screens } = usePermissionsContext();
  const pathname = usePathname();

  const [fallbackModuleId, setFallbackModuleId] = useState<number>(0);

  useEffect(() => {
    getFallbackModuleIdAction(pathname).then((id) => {
      if (id > 0) setFallbackModuleId(id);
    }).catch(console.error);
  }, [pathname]);

  // Dynamically derive module ID from user screen permissions
  const currentModuleId = useMemo(() => {
    if (!screens || screens.length === 0) return fallbackModuleId;
    if (!pathname) return fallbackModuleId;
    const pathLower = pathname.toLowerCase();

    // 1. Sort by longest routePath first (most specific match)
    const sortedScreens = [...screens].sort((a, b) => (b.routePath?.length || 0) - (a.routePath?.length || 0));

    // 2. Try to find exact inclusive match
    let currentScreen = sortedScreens.find((s) => s.routePath && pathLower.includes(s.routePath.toLowerCase()));

    // 3. Fallback: if no exact match, find any screen related to 'asset' by moduleName
    if (!currentScreen) {
      currentScreen = screens.find((s) => {
        const mName = s.moduleName || (s as any).ModuleName;
        return mName && mName.toLowerCase().includes("asset management");
      });
    }

    if (!currentScreen) {
      currentScreen = screens.find((s) => {
        const mName = s.moduleName || (s as any).ModuleName;
        return mName && mName.toLowerCase().includes("asset");
      });
    }

    // Check multiple possible casing for module ID from C# backend
    let resolvedModuleId = currentScreen
      ? (currentScreen.moduleId || (currentScreen as any).ModuleId || (currentScreen as any).moduleID || fallbackModuleId)
      : fallbackModuleId;

    // The database has an inactive generic "asset" module (1004). 
    // If we resolved 1004, force the dynamic fallback (which dynamically finds Asset Management)
    if (resolvedModuleId === 1004 && fallbackModuleId > 0 && fallbackModuleId !== 1004) {
      resolvedModuleId = fallbackModuleId;
    }

    console.log("Dynamically determined ModuleId:", resolvedModuleId, "Screens available:", screens?.length);

    return resolvedModuleId;
  }, [screens, pathname, fallbackModuleId]);

  const assetModuleId = currentModuleId;
  // Initialize rows from SSR data (initialBatches) or use empty array
  const initialRowsFromServer = useMemo(() => {
    if (initialBatches?.batches && initialBatches.batches.length > 0) {
      return convertBatchesToRows(initialBatches.batches);
    }
    return [];
  }, [initialBatches]);

  const [rows, setRows] = useState<InventoryRow[]>(initialRowsFromServer);
  const [departments, setDepartments] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    const { fetchDepartmentsAction } = require("@/app/[locale]/assets/municipal-Asset/add-New-Asset/floor-details/actions");
    fetchDepartmentsAction().then((res: any) => {
      if (res.success && res.data) {
        setDepartments(res.data.map((d: any) => ({
          label: d.label,
          value: d.label
        })));
      }
    });
  }, []);
  const [filterType, setFilterType] = useState<string>("all");
  const [form, setForm] = useState<InventoryForm>(emptyForm());
  const [editForm, setEditForm] = useState<InventoryForm>(emptyForm());
  const [invoiceForm, setInvoiceForm] = useState<InvoiceForm>(emptyInvoiceForm());
  const [draftInvoice, setDraftInvoice] = useState<InventoryInvoice | null>(initialRowsFromServer[0]?.invoice ?? null);
  const [editDraftInvoice, setEditDraftInvoice] = useState<InventoryInvoice | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formError, setFormError] = useState<string>("");
  const [invoiceError, setInvoiceError] = useState<string>("");
  const [invoiceDrawerOpen, setInvoiceDrawerOpen] = useState<boolean>(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Derive depreciation rates from categories array: { "Furniture": 0.1, "Electronics": 0.1, ... }
  const dynamicRates = useMemo(() => {
    if (categories.length === 0) return {};
    const rates: Record<string, number> = {};
    categories.forEach(c => { rates[c.typeName] = c.depreciationRate; });
    return rates;
  }, [categories]);

  // Derive condition factors from conditions array: { "New": 1.0, "Good": 1.0, ... }
  const dynamicConditions = useMemo(() => {
    if (conditions.length === 0) return {};
    const factors: Record<string, number> = {};
    conditions.forEach(c => { factors[c.conditionName] = c.conditionFactor; });
    return factors;
  }, [conditions]);

  const addPhotoInputRef = useRef<HTMLInputElement | null>(null);
  const editPhotoInputRef = useRef<HTMLInputElement | null>(null);
  const invoiceInputRef = useRef<HTMLInputElement | null>(null);

  const filteredRows = useMemo(() => filterType === "all" ? rows : rows.filter(r => r.type === filterType), [filterType, rows]);
  const paginatedRows = useMemo(() => filteredRows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE), [currentPage, filteredRows]);

  // Build Type dropdown options from actual categories
  const dynamicCategoryOptions = useMemo(() => {
    if (categories.length > 0) {
      return categories.map(c => ({ label: c.typeName, value: c.typeName }));
    }
    return [];
  }, [categories]);

  // Build Item Name dropdown options — filtered by selected category
  const dynamicItemNameOptions = useMemo(() => {
    if (itemNames.length > 0) {
      const selectedCat = categories.find(c => String(c.typeName).toLowerCase() === String(form.type).toLowerCase());
      if (selectedCat) {
        return itemNames
          .filter(n => String(n.inventoryItemCategoryId) === String(selectedCat.id))
          .map(n => ({ label: n.subTypeName, value: n.subTypeName }));
      }
    }
    // Fallback to hardcoded inventoryMeta names
    const meta = form.type ? inventoryMeta[form.type as InventoryType] : undefined;
    return meta?.names || [];
  }, [itemNames, categories, form.type]);

  // Build Model dropdown options — filtered by selected item name
  const dynamicModelOptions = useMemo(() => {
    if (itemModels.length > 0 && itemNames.length > 0) {
      const selectedItem = itemNames.find(n => String(n.subTypeName).toLowerCase() === String(form.itemName).toLowerCase());
      if (selectedItem) {
        return itemModels
          .filter(m => String(m.inventoryItemNameId) === String(selectedItem.id))
          .map(m => ({ label: m.modelName, value: m.modelName }));
      }
    }
    // Fallback to hardcoded inventoryMeta modelMap
    const meta = form.type ? inventoryMeta[form.type as InventoryType] : undefined;
    return meta?.modelMap?.[form.itemName] ?? [];
  }, [itemModels, itemNames, form.type, form.itemName]);

  // Build Condition dropdown options — filtered by selected category
  const dynamicConditionOptions = useMemo(() => {
    if (conditions.length > 0) {
      const selectedCat = categories.find(c => c.typeName === form.type);
      if (selectedCat) {
        return conditions
          .filter(c => c.inventoryItemCategoryId === selectedCat.id)
          .map(c => ({ label: c.conditionName, value: c.conditionName }));
      }
      // Fallback: show all unique conditions
      const unique = new Map<string, string>();
      conditions.forEach(c => unique.set(c.conditionName, c.conditionName));
      return Array.from(unique.values()).map(name => ({ label: name, value: name }));
    }
    return [];
  }, [conditions, categories, form.type]);

  // Build Edit Item Name dropdown options — filtered by selected category
  const dynamicEditItemNameOptions = useMemo(() => {
    if (itemNames.length > 0) {
      const selectedCat = categories.find(c => String(c.typeName).toLowerCase() === String(editForm.type).toLowerCase());
      if (selectedCat) {
        return itemNames
          .filter(n => String(n.inventoryItemCategoryId) === String(selectedCat.id))
          .map(n => ({ label: n.subTypeName, value: n.subTypeName }));
      }
    }
    // Fallback to hardcoded inventoryMeta names
    const meta = editForm.type ? inventoryMeta[editForm.type as InventoryType] : undefined;
    return meta?.names || [];
  }, [itemNames, categories, editForm.type]);

  // Build Edit Model dropdown options — filtered by selected item name
  const dynamicEditModelOptions = useMemo(() => {
    if (itemModels.length > 0 && itemNames.length > 0) {
      const selectedItem = itemNames.find(n => String(n.subTypeName).toLowerCase() === String(editForm.itemName).toLowerCase());
      if (selectedItem) {
        return itemModels
          .filter(m => String(m.inventoryItemNameId) === String(selectedItem.id))
          .map(m => ({ label: m.modelName, value: m.modelName }));
      }
    }
    // Fallback to hardcoded inventoryMeta modelMap
    const meta = editForm.type ? inventoryMeta[editForm.type as InventoryType] : undefined;
    return meta?.modelMap?.[editForm.itemName] ?? [];
  }, [itemModels, itemNames, editForm.type, editForm.itemName]);

  // Build Edit Condition dropdown options — filtered by selected category
  const dynamicEditConditionOptions = useMemo(() => {
    if (conditions.length > 0) {
      const selectedCat = categories.find(c => c.typeName === editForm.type);
      if (selectedCat) {
        return conditions
          .filter(c => c.inventoryItemCategoryId === selectedCat.id)
          .map(c => ({ label: c.conditionName, value: c.conditionName }));
      }
      // Fallback: show all unique conditions
      const unique = new Map<string, string>();
      conditions.forEach(c => unique.set(c.conditionName, c.conditionName));
      return Array.from(unique.values()).map(name => ({ label: name, value: name }));
    }
    return [];
  }, [conditions, categories, editForm.type]);

  const enrichedRows = useMemo(() => enrichRows(rows, dynamicRates, dynamicConditions), [rows, dynamicRates, dynamicConditions]);
  const categoryGroups = useMemo(() => buildCategoryGroups(enrichedRows), [enrichedRows]);

  const grandAssetValue = useMemo(() => rows.reduce((sum, row) => sum + row.total, 0), [rows]);
  const grandCV = useMemo(() => enrichedRows.reduce((sum, r) => sum + (r.totalCV ?? r.total), 0), [enrichedRows]);

  const summaryCards = useMemo(() => {
    if (categories.length > 0) {
      return categories.map((cat) => {
        // Normalize cat.typeName to match row.type format (lowercase with dashes)
        const normalizedCatType = cat.typeName.toLowerCase().replace(/\s+/g, "-");
        const typeRows = rows.filter((r) => r.type === normalizedCatType);
        return {
          type: cat.typeName,
          label: cat.typeName,
          totalAmount: typeRows.reduce((sum, r) => sum + r.total, 0),
          totalItems: typeRows.reduce((sum, r) => sum + r.quantity, 0),
          cardRing: inventoryMeta[cat.typeName as InventoryType]?.cardRing || "border-l-4 border-l-blue-500",
        };
      });
    }
    return (["furniture", "it-equipment", "electronic-fixtures", "vehicle"] as const).map((type) => {
      const typeRows = rows.filter((r) => r.type === type);
      return {
        type,
        label: inventoryMeta[type]?.label || type,
        totalAmount: typeRows.reduce((sum, r) => sum + r.total, 0),
        totalItems: typeRows.reduce((sum, r) => sum + r.quantity, 0),
        cardRing: inventoryMeta[type]?.cardRing || "border-l-4 border-l-gray-500",
      };
    });
  }, [rows, categories]);

  const existingInvoiceOptions = useMemo(() => {
    const unique = new Map<string, InventoryInvoice>();
    rows.forEach(r => r.invoice?.invoiceNumber && unique.set(`${r.invoice.invoiceNumber}__${r.invoice.invoiceDate || ""}`, r.invoice));
    if (unique.size === 0) return [{ label: "No invoice is available", value: "" }];
    return Array.from(unique.entries()).map(([k, inv]) => ({ label: `${inv.invoiceNumber}${inv.invoiceDate ? ` - ${inv.invoiceDate}` : ""}`, value: k }));
  }, [rows]);

  const resetAddForm = () => {
    setForm(emptyForm());
    setDraftInvoice(null);
    setFormError("");
    if (addPhotoInputRef.current) addPhotoInputRef.current.value = "";
  };

  const resetEditForm = () => {
    setEditForm(emptyForm());
    setEditDraftInvoice(null);
    setEditingId(null);
    setFormError("");
    setEditDrawerOpen(false);
    if (editPhotoInputRef.current) editPhotoInputRef.current.value = "";
    if (invoiceInputRef.current) invoiceInputRef.current.value = "";
  };

  const handleAddPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setForm(prev => ({ ...prev, photoName: file.name, photoUrl: URL.createObjectURL(file), photoFile: file }));
  };

  const handleEditPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setEditForm(prev => ({ ...prev, photoName: file.name, photoUrl: URL.createObjectURL(file), photoFile: file }));
  };

  const handleInvoiceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setInvoiceForm(prev => ({ ...prev, invoiceFileName: file.name, invoiceFile: file }));
    }
  };

  const saveInvoiceDetails = () => {
    if (!invoiceForm.invoiceMode) return setInvoiceError("Please select invoice mode.");
    if (invoiceForm.invoiceMode === "reuse" && !invoiceForm.existingInvoiceKey) return setInvoiceError("No invoice is available to reuse.");
    if (invoiceForm.invoiceMode === "upload" && (!invoiceForm.invoiceNumber.trim() || !invoiceForm.invoiceDate)) {
      return setInvoiceError("Please enter invoice number and date.");
    }
    const inv = {
      invoiceMode: invoiceForm.invoiceMode,
      invoiceNumber: invoiceForm.invoiceNumber.trim(),
      invoiceDate: invoiceForm.invoiceDate,
      invoiceFileName: invoiceForm.invoiceFileName,
      invoiceFile: invoiceForm.invoiceFile,
    };
    if (editDrawerOpen) setEditDraftInvoice(inv);
    else setDraftInvoice(inv);
    setInvoiceDrawerOpen(false);
  };

  // Helper function to reload data from server
  const reloadDataFromServer = async () => {
    if (!parentAssetId) return;

    const result = await getInventoryBatchesAction(parentAssetId);

    if (result.success && result.data?.batches) {
      const freshRows = convertBatchesToRows(result.data.batches);
      setRows(freshRows);
    } else {
    }
  };

  const handleAddRow = async () => {
    const isDateValid = !!form.purchaseDate && !isNaN(new Date(form.purchaseDate).getTime()) && new Date(form.purchaseDate) <= new Date();

    const missing: string[] = [];
    if (!form.type) missing.push("Asset Type");
    if (!form.itemName) missing.push("Item Name");
    if (!form.modelName) missing.push("Model");
    if (!isDateValid) {
      if (!form.purchaseDate) missing.push("Purchase Date");
      else missing.push("Purchase Date (must be a valid, non-future date)");
    }
    if (!form.condition) missing.push("Condition");
    if (!form.owningDepartment) missing.push("Owning Department");
    if (!form.specifications) missing.push("Specification");
    if (!form.quantity || Number(form.quantity) <= 0) {
      if (!form.quantity) missing.push("Quantity");
      else missing.push("Quantity (must be greater than 0)");
    }
    if (!form.unitValue || Number(form.unitValue) <= 0) {
      if (!form.unitValue) missing.push("Unit Value");
      else missing.push("Unit Value (must be greater than 0)");
    }

    if (missing.length > 0) {
      return setFormError(`Please fill in the required fields: ${missing.join(", ")}.`);
    }

    if (!parentAssetId) {
      return setFormError("Parent asset ID is missing. Please save basic info first.");
    }

    setIsSaving(true);
    setFormError("");

    try {
      // Build API payload
      const apiPayload = {
        parentAssetId,
        inventoryType: form.type,
        itemName: form.itemName,
        modelBrand: form.modelName,
        specifications: form.specifications.trim() || undefined,
        purchaseDate: form.purchaseDate,
        condition: form.condition,
        quantity: Number(form.quantity),
        unitValue: Number(form.unitValue),
        invoiceNumber: draftInvoice?.invoiceNumber,
        invoiceDate: draftInvoice?.invoiceDate,
        invoiceFileName: draftInvoice?.invoiceFileName,
        owningDepartment: form.owningDepartment || undefined,
        photoFileName: form.photoName || undefined,
        units: Array.from({ length: Number(form.quantity) }, (_, i) => ({
          unitNumber: i + 1,
          dynamicAttributes: form.unitDynamicAttributes?.[i] || null
        }))
      };

      const result = await saveSingleInventoryBatchAction(apiPayload);

      if (!result.success) {
        setFormError(result.error || "Failed to save batch");
        setIsSaving(false);
        return;
      }

      // Upload Documents
      const batchData = result.data;
      if (batchData && batchData.units && batchData.units.length > 0) {
        const photoFile = form.photoFile;
        const invoiceFile = draftInvoice?.invoiceFile;
        if (photoFile || invoiceFile) {
          // Fallback: if Context failed to provide moduleId, fetch it from Master Data API via Server Action
          let finalModuleId = assetModuleId;
          if (finalModuleId === 0) {
            try {
              const id = await getFallbackModuleIdAction();
              if (id > 0) finalModuleId = id;
            } catch (e) { }
          }

          for (const unit of batchData.units) {
            if (!unit.assetId) continue;

            const fd = new FormData();
            fd.append("AssetId", String(unit.assetId));
            fd.append("ModuleId", String(finalModuleId || 1004));
            fd.append("UploadedByUserId", "1");
            fd.append("IsAdHoc", "true");

            const metadata: any[] = [];

            if (photoFile) {
              const uniqueName = `photo_${photoFile.name}`;
              const renamedFile = new File([photoFile], uniqueName, { type: photoFile.type });
              fd.append("Files", renamedFile);
              metadata.push({
                fileName: uniqueName,
                documentType: "photo",
                documentTitle: "Asset Photo",
                documentDefinitionId: 0
              });
            }

            if (invoiceFile) {
              const uniqueName = `invoice_${invoiceFile.name}`;
              const renamedFile = new File([invoiceFile], uniqueName, { type: invoiceFile.type });
              fd.append("Files", renamedFile);
              metadata.push({
                fileName: uniqueName,
                documentType: "invoice",
                documentTitle: "Asset Invoice",
                documentDefinitionId: 0
              });
            }

            fd.append("FileMetadataJson", JSON.stringify(metadata));

            try {
              const uploadResult = await uploadBulkDocumentsAction(fd);
              if (!uploadResult.success || (uploadResult.data && uploadResult.data.failureCount > 0)) {
                const detailedError = uploadResult.data?.failedUploads?.[0]?.errorMessage || uploadResult.error || "Unknown error";

                toast.error(`Document upload failed for Unit ${unit.unitNumber}: ${detailedError}`);
              } else {
                toast.success(`Documents uploaded successfully for Unit ${unit.unitNumber}!`);
              }
            } catch (e: any) {

              toast.error(`Document upload exception for Unit ${unit.unitNumber}: ${e.message}`);
            }
          }
        }
      }


      // Reload fresh data from server
      await reloadDataFromServer();

      // Reset form and show success
      resetAddForm();
      setCurrentPage(1);
      setIsSaving(false);
    } catch (err: any) {
      setFormError(err.message || "Failed to save batch");
      setIsSaving(false);
    }
  };

  const handleUpdateRow = async () => {
    if (editingId === null) return;
    if (!editForm.type || !editForm.itemName || !editForm.modelName || !editForm.purchaseDate || !editForm.condition || Number(editForm.quantity) <= 0 || Number(editForm.unitValue) <= 0) {
      return setFormError("Please fill in all required fields and positive values.");
    }

    // Find the existing row to check if it's registered
    const existingRow = rows.find(r => r.id === editingId);

    const payload: InventoryRow = {
      id: editingId,
      type: editForm.type,
      photoUrl: editForm.photoUrl,
      photoName: editForm.photoName,
      itemName: editForm.itemName,
      modelName: editForm.modelName,
      specifications: editForm.specifications.trim() || "NA",
      purchaseDate: editForm.purchaseDate,
      condition: editForm.condition,
      quantity: Number(editForm.quantity),
      unitValue: Number(editForm.unitValue),
      total: Number(editForm.quantity) * Number(editForm.unitValue),
      owningDepartment: editForm.owningDepartment,
      invoice: editDraftInvoice,
      unitDynamicAttributes: editForm.unitDynamicAttributes,
      batchId: existingRow?.batchId,
      isRegistered: existingRow?.isRegistered,
      registeredUnits: existingRow?.registeredUnits
    };

    calcRowCV(payload, dynamicRates, dynamicConditions);

    // If the row is registered, update via API
    if (existingRow?.batchId && existingRow?.isRegistered) {
      setIsSaving(true);
      try {
        const hasQuantityChanged = payload.quantity !== existingRow.quantity;
        let result;

        if (hasQuantityChanged) {
          // Workaround: The backend's UpdateInventoryBatchDto does not support updating Quantity.
          // To update the quantity, we must delete the existing batch and create a new one.
          await deleteInventoryBatchAction(existingRow.batchId);

          // Use the POST endpoint which supports Quantity creation
          const createPayload = {
            parentAssetId: parentAssetId!,
            inventoryType: payload.type,
            itemName: payload.itemName,
            modelBrand: payload.modelName,
            specifications: payload.specifications !== "NA" ? payload.specifications : undefined,
            purchaseDate: payload.purchaseDate,
            condition: payload.condition,
            quantity: payload.quantity,
            unitValue: payload.unitValue,
            invoiceNumber: payload.invoice?.invoiceNumber,
            invoiceDate: payload.invoice?.invoiceDate,
            invoiceFileName: payload.invoice?.invoiceFileName,
            owningDepartment: payload.owningDepartment,
            photoFileName: payload.photoName,
            units: Array.from({ length: payload.quantity }, (_, i) => ({
              unitNumber: i + 1,
              dynamicAttributes: null
            }))
          };
          result = await saveSingleInventoryBatchAction(createPayload);
        } else {
          // Standard update for other fields
          result = await updateInventoryBatchAction(existingRow.batchId, {
            itemName: payload.itemName,
            modelBrand: payload.modelName,
            specifications: payload.specifications !== "NA" ? payload.specifications : undefined,
            purchaseDate: payload.purchaseDate,
            condition: payload.condition,
            unitValue: payload.unitValue,
            invoiceNumber: payload.invoice?.invoiceNumber,
            invoiceDate: payload.invoice?.invoiceDate,
            invoiceFileName: payload.invoice?.invoiceFileName,
            owningDepartment: payload.owningDepartment,
            photoFileName: payload.photoName
          });
        }

        if (!result.success) {
          setFormError(result.error || "Failed to update batch");
          setIsSaving(false);
          return;
        }

        // Upload new documents if provided
        if (existingRow.registeredUnits && existingRow.registeredUnits.length > 0) {
          const photoFile = editForm.photoFile;
          const invoiceFile = editDraftInvoice?.invoiceFile;
          if (photoFile || invoiceFile) {
            // Fallback: if Context failed to provide moduleId, fetch it from Master Data API via Server Action
            let finalModuleId = assetModuleId;
            if (finalModuleId === 0) {
              try {
                const id = await getFallbackModuleIdAction(pathname);
                if (id > 0) finalModuleId = id;
              } catch (e) { }
            }

            for (const unit of existingRow.registeredUnits) {
              if (!unit.assetId) continue;
              const fd = new FormData();
              fd.append("AssetId", String(unit.assetId));
              fd.append("ModuleId", String(finalModuleId || 1004));
              fd.append("UploadedByUserId", "1");
              fd.append("IsAdHoc", "true");

              const metadata: any[] = [];

              if (photoFile) {
                const uniqueName = `photo_${photoFile.name}`;
                const renamedFile = new File([photoFile], uniqueName, { type: photoFile.type });
                fd.append("Files", renamedFile);
                metadata.push({
                  fileName: uniqueName,
                  documentType: "photo",
                  documentTitle: "Asset Photo",
                  documentDefinitionId: 0
                });
              }
              if (invoiceFile) {
                const uniqueName = `invoice_${invoiceFile.name}`;
                const renamedFile = new File([invoiceFile], uniqueName, { type: invoiceFile.type });
                fd.append("Files", renamedFile);
                metadata.push({
                  fileName: uniqueName,
                  documentType: "invoice",
                  documentTitle: "Asset Invoice",
                  documentDefinitionId: 0
                });
              }
              fd.append("FileMetadataJson", JSON.stringify(metadata));
              try {
                const uploadResult = await uploadBulkDocumentsAction(fd);
                if (!uploadResult.success || (uploadResult.data && uploadResult.data.failureCount > 0)) {
                  const detailedError = uploadResult.data?.failedUploads?.[0]?.errorMessage || uploadResult.error || "Unknown error";

                  toast.error(`Document upload failed for Unit ${unit.unitNumber}: ${detailedError}`);
                } else {
                  toast.success(`Documents updated successfully for Unit ${unit.unitNumber}!`);
                }
              } catch (e: any) {

                toast.error(`Document upload exception for Unit ${unit.unitNumber}: ${e.message}`);
              }
            }
          }
        }

        // Reload fresh data from server to get recalculated CV
        await reloadDataFromServer();

        // Only reset form after successful update
        resetEditForm();
        setCurrentPage(1);
        setIsSaving(false);

      } catch (err: any) {
        setFormError(err.message || "Failed to update batch");
        setIsSaving(false);
        return;
      }
    } else {
      // If not registered, just close the drawer (shouldn't happen in current flow)
      resetEditForm();
      setCurrentPage(1);
    }
  };

  const handleDeleteRow = async (id: number) => {
    const row = rows.find(r => r.id === id);

    confirm({
      variant: "delete",
      title: "Delete Inventory Row",
      description: row?.isRegistered
        ? "This will permanently delete the batch and all associated assets from the database. Are you sure?"
        : "Are you sure?",
      confirmText: "Delete",
      cancelText: "Cancel",
      onConfirm: async () => {
        // If the row is registered, delete via API first
        if (row?.batchId && row?.isRegistered) {
          setIsSaving(true);
          try {
            const result = await deleteInventoryBatchAction(row.batchId);

            if (!result.success) {
              setSaveError(result.error || "Failed to delete batch");
              setIsSaving(false);
              return;
            }

            // Reload fresh data from server
            await reloadDataFromServer();

          } catch (err: any) {
            setSaveError(err.message || "Failed to delete batch");
            setIsSaving(false);
            return;
          }
          setIsSaving(false);
        }

        if (editingId === id) resetEditForm();
      }
    });
  };

  const handleStartEdit = (row: InventoryRow) => {
    setEditingId(row.id);
    setFormError("");
    setInvoiceError("");

    // Convert row.type (lowercase-with-dashes format) to proper category name
    const matchingCategory = categories.find(c => {
      const normalized = c.typeName.toLowerCase().replace(/\s+/g, "-");
      return normalized === row.type;
    });

    // Use category typeName if found, otherwise fallback to row.type
    const properTypeName = matchingCategory?.typeName || row.type;

    setEditForm({
      type: properTypeName as InventoryType,
      itemName: row.itemName,
      modelName: row.modelName,
      specifications: row.specifications === "NA" ? "" : row.specifications,
      purchaseDate: row.purchaseDate,
      condition: row.condition,
      quantity: String(row.quantity),
      unitValue: String(row.unitValue),
      photoName: row.photoName ?? "",
      photoUrl: row.photoUrl ?? "",
      owningDepartment: row.owningDepartment ?? ""
    });
    setEditDraftInvoice(row.invoice ?? null);
    setEditDrawerOpen(true);
  };

  const openInvoiceDrawer = (editMode: boolean) => {
    setInvoiceError("");
    const src = editMode ? editDraftInvoice : draftInvoice;
    setInvoiceForm(src ? {
      invoiceMode: src.invoiceMode,
      existingInvoiceKey: "",
      invoiceNumber: src.invoiceNumber,
      invoiceDate: src.invoiceDate,
      invoiceFileName: src.invoiceFileName
    } : emptyInvoiceForm());
    setInvoiceDrawerOpen(true);
  };

  const handleSaveToBackend = async (parentAssetId: number, authorityId: number = 1, orgId: number = 1, createdBy: number = 1): Promise<{ success: boolean; error?: string }> => {
    // Filter out already registered rows - only save new ones
    const unsavedRows = rows.filter(r => !r.isRegistered && !r.batchId);

    if (!unsavedRows.length) {
      return { success: true };
    }

    setIsSaving(true);
    setSaveError("");
    setSaveSuccess(false);

    try {
      const payload = {
        items: unsavedRows.map(row => ({
          parentAssetId,
          inventoryType: row.type,
          itemName: row.itemName,
          modelBrand: row.modelName,
          specifications: row.specifications !== "NA" ? row.specifications : null,
          purchaseDate: row.purchaseDate,
          condition: row.condition,
          quantity: row.quantity,
          unitValue: row.unitValue,
          invoiceNumber: row.invoice?.invoiceNumber ?? null,
          invoiceDate: row.invoice?.invoiceDate ?? null,
          invoiceFileName: row.invoice?.invoiceFileName ?? null,
          owningDepartment: row.owningDepartment ?? null,
          photoFileName: row.photoName ?? null,
          authorityId,
          organizationId: orgId,
          createdBy,
          departmentId: 1,
          units: Array.from({ length: row.quantity }, (_, i) => ({
            unitNumber: i + 1,
            dynamicAttributes: row.unitDynamicAttributes?.[i] ?? null
          }))
        }))
      };


      const result = await saveInventoryBatchAction(payload);


      if (!result.success) {
        const errorMsg = result.error ?? "Save failed";
        setSaveError(errorMsg);
        setIsSaving(false);
        return { success: false, error: errorMsg };
      }

      const responseData = result.data;

      setRows(prev => prev.map((row) => {
        let matchedBatch = null;
        if (responseData && responseData.categoryGroups) {
          const allBatches = responseData.categoryGroups.flatMap((g: any) => g.batches || []);
          matchedBatch = allBatches.find((b: any) =>
            b.inventoryType === row.type &&
            b.itemName === row.itemName &&
            b.quantity === row.quantity
          );
        }

        return {
          ...row,
          batchId: matchedBatch?.batchId,
          isRegistered: true,
          registeredUnits: matchedBatch?.units ?? []
        };
      }));

      setSaveSuccess(true);
      setIsSaving(false);
      return { success: true };
    } catch (err: any) {
      const errorMsg = err.message ?? "Registration failed";
      setSaveError(errorMsg);
      setIsSaving(false);
      return { success: false, error: errorMsg };
    }
  };

  const handlePreviewDocument = async (row: InventoryRow, type: 'photo' | 'invoice') => {
    // If not registered yet, preview the local ObjectURL/Blob
    if (!row.isRegistered) {
      if (type === 'photo' && row.photoUrl) {
        window.open(row.photoUrl, "_blank");
      } else if (type === 'invoice' && row.invoice?.invoiceFile) {
        window.open(URL.createObjectURL(row.invoice.invoiceFile), "_blank");
      } else {
        toast.error("No file available to preview locally.");
      }
      return;
    }

    // If registered, fetch from API
    const assetId = row.registeredUnits?.[0]?.assetId;
    if (!assetId) {
      return toast.error("Asset ID not found for this row.");
    }

    try {
      // Use Server Actions to securely fetch documents and avoid CORS/Auth issues
      const { fetchUploadedDocumentsAction, fetchDocumentFileAction } = await import("@/app/[locale]/assets/municipal-Asset/add-New-Asset/actions");

      const docResponse = await fetchUploadedDocumentsAction(assetId, true, true);
      if (!docResponse.success || !docResponse.data) {
        return toast.error(docResponse.error || docResponse.message || "Failed to fetch documents");
      }

      const documents = docResponse.data;
      let targetDoc = null;

      if (type === 'photo' && row.photoName) {
        targetDoc = documents.find((d: any) => d.fileName === row.photoName || d.fileName === `photo_${row.photoName}`);
      } else if (type === 'invoice' && row.invoice?.invoiceFileName) {
        targetDoc = documents.find((d: any) => d.fileName === row.invoice!.invoiceFileName || d.fileName === `invoice_${row.invoice!.invoiceFileName}`);
      }

      if (!targetDoc) {
        return toast.error("Document not found on the server.");
      }

      const fileRes = await fetchDocumentFileAction(targetDoc.id);
      if (!fileRes.success || !fileRes.data) {
        return toast.error(fileRes.error || "Failed to download document");
      }

      // Convert base64 to Blob
      const byteCharacters = atob(fileRes.data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: fileRes.mimeType || 'application/octet-stream' });

      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");

    } catch (e: any) {
      toast.error("Error previewing document: " + e.message);
    }
  };

  return {
    rows, setRows,
    filterType, setFilterType,
    form, setForm,
    editForm, setEditForm,
    invoiceForm, setInvoiceForm,
    draftInvoice, setDraftInvoice,
    editDraftInvoice, setEditDraftInvoice,
    editingId, setEditingId,
    formError, setFormError,
    invoiceError, setInvoiceError,
    invoiceDrawerOpen, setInvoiceDrawerOpen,
    editDrawerOpen, setEditDrawerOpen,
    currentPage, setCurrentPage,
    isSaving, saveError, saveSuccess,
    dynamicRates,
    dynamicConditions,
    dynamicCategoryOptions,
    dynamicConditionOptions,
    dynamicItemNameOptions,
    dynamicModelOptions,
    dynamicEditItemNameOptions,
    dynamicEditModelOptions,
    dynamicEditConditionOptions,
    addPhotoInputRef, editPhotoInputRef, invoiceInputRef,
    filteredRows, paginatedRows, enrichedRows, grandAssetValue, grandCV, categoryGroups,
    summaryCards, existingInvoiceOptions,
    resetAddForm, resetEditForm,
    handleAddPhotoUpload, handleEditPhotoUpload, handleInvoiceUpload,
    saveInvoiceDetails, handleAddRow, handleUpdateRow,
    handleDeleteRow, handleStartEdit, openInvoiceDrawer, handleSaveToBackend,
    handlePreviewDocument,
    departments
  };
}


