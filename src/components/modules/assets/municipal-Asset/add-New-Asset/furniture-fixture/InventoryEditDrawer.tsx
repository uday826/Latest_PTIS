import React from "react";
import { Drawer, Button, AddButton, SearchSelect, UploadButton, Input } from "@/components/common";
import { Package2, Receipt, X } from "lucide-react";
import { type InventoryForm } from "./FurnitureFixtureTypes";

interface InventoryEditDrawerProps {
  open: boolean;
  onClose: () => void;
  editForm: InventoryForm;
  updateEditForm: (key: keyof InventoryForm, value: string) => void;
  handleEditTypeChange: (value: string) => void;
  handleEditItemNameChange: (value: string) => void;
  editPhotoInputRef: React.RefObject<HTMLInputElement | null>;
  handleEditPhotoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  openInvoiceDrawer: () => void;
  editInvoicePreviewLabel: string;
  handleUpdateRow: () => void;
  formError: string;
  dynamicCategoryOptions: { label: string; value: string }[];
  dynamicConditionOptions: { label: string; value: string }[];
  dynamicItemNameOptions: { label: string; value: string }[];
  dynamicModelOptions: { label: string; value: string }[];
  departments: { label: string; value: string }[];
}

export function InventoryEditDrawer({
  open,
  onClose,
  editForm,
  updateEditForm,
  handleEditTypeChange,
  handleEditItemNameChange,
  editPhotoInputRef,
  handleEditPhotoUpload,
  openInvoiceDrawer,
  editInvoicePreviewLabel,
  handleUpdateRow,
  formError,
  dynamicCategoryOptions,
  dynamicConditionOptions,
  dynamicItemNameOptions,
  dynamicModelOptions,
  departments,
}: InventoryEditDrawerProps) {
  const editNameOptions = dynamicItemNameOptions;
  const editModelOptions = dynamicModelOptions;
  const editConditionOptions = dynamicConditionOptions;

  const editLabels = React.useMemo(() => ({
    itemName: editForm.type === "it-equipment" ? "Equipment Name" : editForm.type === "electronic-fixtures" ? "Fixture Name" : editForm.type === "vehicle" ? "Vehicle Type" : "Item Name",
    modelName: editForm.type === "it-equipment" ? "Brand / Model" : "Type / Model",
    condition: editForm.type === "it-equipment" || editForm.type === "electronic-fixtures" ? "Status" : "Condition",
    date: editForm.type === "electronic-fixtures" ? "Install Date" : "Purchase Date",
    specifications: editForm.type === "vehicle" ? "Reg. Number" : "Specifications",
  }), [editForm.type]);

  const editSpecsPlaceholder = React.useMemo(() => {
    if (editForm.type === "vehicle") return "MH-01-AB-1234";
    if (editForm.type === "it-equipment" || editForm.type === "electronic-fixtures") return "e.g. i5, 8GB RAM";
    return "Specs / Reg No.";
  }, [editForm.type]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width="lg"
      title={
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
            <Package2 className="h-5 w-5" />
          </div>
          <div>
            <h3 id="drawer-title" className="text-lg font-semibold text-slate-900">
              Edit Inventory Item
            </h3>
            <p className="text-sm text-slate-500">
              Update inventory details from the right-side drawer.
            </p>
          </div>
        </div>
      }
      footer={
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          <Button variant="secondary" icon={X} onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" icon={Receipt} onClick={openInvoiceDrawer}>
            {editInvoicePreviewLabel}
          </Button>
          <AddButton label="Update Row" onClick={handleUpdateRow} />
        </div>
      }
    >
      <div className="px-2 py-5 sm:px-6 sm:py-6">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          <SearchSelect
            label="Type"
            value={editForm.type}
            onChange={(_, val) => handleEditTypeChange(val)}
            options={dynamicCategoryOptions}
            placeholder="Select type"
          />

          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-700">Photo</span>
            <input
              ref={editPhotoInputRef}
              type="file"
              accept=".bmp,.doc,.docx,.gif,.jpeg,.jpg,.pdf,.png,.ppt,.pptx,.tif,.tiff,.txt,.webp,.xls,.xlsx"
              className="hidden"
              onChange={handleEditPhotoUpload}
            />
            <UploadButton
              label={editForm.photoName || "Upload"}
              className="justify-start"
              onClick={() => editPhotoInputRef.current?.click()}
            />
          </div>

          <SearchSelect
            label={editLabels.itemName}
            value={editForm.itemName}
            onChange={(_, val) => handleEditItemNameChange(val)}
            options={editNameOptions}
            placeholder={editForm.type ? `Select ${editLabels.itemName.toLowerCase()}` : "Select type first"}
            disabled={!editForm.type}
          />

          <SearchSelect
            label={editLabels.modelName}
            value={editForm.modelName}
            onChange={(_, val) => updateEditForm("modelName", val)}
            options={editModelOptions}
            placeholder={editForm.itemName ? `Select ${editLabels.modelName.toLowerCase()}` : "Select item name first"}
            disabled={!editForm.itemName}
          />

          {editForm.type === "furniture" ? null : (
            <Input
              label={editLabels.specifications}
              placeholder={editSpecsPlaceholder}
              value={editForm.specifications}
              onChange={(event) => updateEditForm("specifications", event.target.value)}
            />
          )}

          <Input
            label={editLabels.date}
            type="date"
            value={editForm.purchaseDate}
            onChange={(event) => updateEditForm("purchaseDate", event.target.value)}
          />

          <SearchSelect
            label={editLabels.condition}
            value={editForm.condition}
            onChange={(_, val) => updateEditForm("condition", val)}
            options={editConditionOptions}
            placeholder={`Select ${editLabels.condition.toLowerCase()}`}
          />

          <SearchSelect
            label="Owning Department"
            value={editForm.owningDepartment}
            onChange={(_, val) => updateEditForm("owningDepartment", val)}
            options={departments}
            placeholder="Select owning department"
          />

          <Input
            label="Quantity"
            type="number"
            min={1}
            value={editForm.quantity}
            onChange={(event) => updateEditForm("quantity", event.target.value)}
          />

          <Input
            label="Unit Value (₹)"
            type="number"
            min={0}
            value={editForm.unitValue}
            onChange={(event) => updateEditForm("unitValue", event.target.value)}
          />
        </div>

        {formError ? (
          <div className="mt-2 rounded-xl border border-red-200 bg-red-50 px-2 py-1.5 text-sm text-red-700">
            {formError}
          </div>
        ) : null}
      </div>
    </Drawer>
  );
}


