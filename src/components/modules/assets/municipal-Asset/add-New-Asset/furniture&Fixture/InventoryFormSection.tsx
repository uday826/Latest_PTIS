import React from "react";
import { AddButton, Button, Input, Select, UploadButton } from "@/components/common";
import { Receipt } from "lucide-react";
import { type InventoryType, type InventoryRow, type InventoryForm, type InvoiceForm } from "./FurnitureFixtureTypes";
import { typeOptions, conditionMap, invoiceModeOptions, inventoryMeta, initialRows, emptyForm, emptyInvoiceForm, PAGE_SIZE, formatCurrency } from "./FurnitureFixtureConstants";

interface InventoryFormSectionProps {
  form: InventoryForm;
  updateForm: (key: keyof InventoryForm, value: string) => void;
  handleTypeChange: (value: string) => void;
  handleItemNameChange: (value: string) => void;
  addPhotoInputRef: React.RefObject<HTMLInputElement | null>;
  handleAddPhotoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  openInvoiceDrawer: () => void;
  addInvoicePreviewLabel: string;
  handleAddRow: () => void;
  formError: string;
  dynamicCategoryOptions: { label: string; value: string }[];
  dynamicConditionOptions: { label: string; value: string }[];
  dynamicItemNameOptions: { label: string; value: string }[];
  dynamicModelOptions: { label: string; value: string }[];
}

export function InventoryFormSection({
  form,
  updateForm,
  handleTypeChange,
  handleItemNameChange,
  addPhotoInputRef,
  handleAddPhotoUpload,
  openInvoiceDrawer,
  addInvoicePreviewLabel,
  handleAddRow,
  formError,
  dynamicCategoryOptions,
  dynamicConditionOptions,
  dynamicItemNameOptions,
  dynamicModelOptions,
}: InventoryFormSectionProps) {
  const addNameOptions = dynamicItemNameOptions;
  const addModelOptions = dynamicModelOptions;
  const addConditionOptions = dynamicConditionOptions;

  const addLabels = React.useMemo(() => {
    const isItEquipment = form.type === "it-equipment";
    const isElectronicFixtures = form.type === "electronic-fixtures";
    const isVehicle = form.type === "vehicle";
    return {
      itemName: isItEquipment
        ? "Equipment Name"
        : isElectronicFixtures
          ? "Fixture Name"
          : isVehicle
            ? "Vehicle Type"
            : "Item Name",
      modelName: isItEquipment ? "Brand / Model" : "Type / Model",
      condition: isItEquipment || isElectronicFixtures ? "Status" : "Condition",
      date: isElectronicFixtures ? "Install Date" : "Purchase Date",
      specifications: isVehicle ? "Reg. Number" : "Specifications",
    };
  }, [form.type]);

  const addSpecsPlaceholder = React.useMemo(() => {
    if (form.type === "vehicle") return "MH-01-AB-1234";
    if (form.type === "it-equipment" || form.type === "electronic-fixtures") {
      return "e.g. i5, 8GB RAM";
    }
    return "Specs / Reg No.";
  }, [form.type]);

  const isFormValid = React.useMemo(() => {
    const isDateValid = !!form.purchaseDate && !isNaN(new Date(form.purchaseDate).getTime()) && new Date(form.purchaseDate) <= new Date();

    return (
      !!form.type &&
      !!form.itemName &&
      !!form.modelName &&
      isDateValid &&
      !!form.condition &&
      !!form.owningDepartment &&
      !!form.specifications &&
      !!form.quantity &&
      Number(form.quantity) > 0 &&
      !!form.unitValue &&
      Number(form.unitValue) > 0
    );
  }, [form]);

  return (
    <div className="rounded-xl border border-[#CFD9E6] bg-[#F7FAFF] p-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 2xl:items-end">
        <Select
          label="Type"
          value={form.type}
          onChange={handleTypeChange}
          options={dynamicCategoryOptions}
          placeholder="Select type"
          required={true}
        />

        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-700">Photo</span>
          <input
            ref={addPhotoInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAddPhotoUpload}
          />
          <UploadButton
            label={form.photoName || "Upload"}
            className="justify-start"
            onClick={() => addPhotoInputRef.current?.click()}
          />
        </div>

        {addNameOptions.length > 0 ? (
          <Select
            label={addLabels.itemName}
            value={form.itemName}
            onChange={handleItemNameChange}
            options={addNameOptions}
            placeholder="-- Select --"
            disabled={!form.type}
            required={true}
          />
        ) : (
          <Input
            label={addLabels.itemName}
            value={form.itemName}
            onChange={(event) => handleItemNameChange(event.target.value)}
            placeholder="Item Name"
            disabled={!form.type}
            required={true}
          />
        )}

        {addNameOptions.length > 0 ? (
          <Select
            label={addLabels.modelName}
            value={form.modelName}
            onChange={(value) => updateForm("modelName", value)}
            options={addModelOptions}
            placeholder="-- Select --"
            disabled={!form.itemName}
            required={true}
          />
        ) : (
          <Input
            label={addLabels.modelName}
            value={form.modelName}
            onChange={(event) => updateForm("modelName", event.target.value)}
            placeholder="Brand / Model"
            disabled={!form.itemName}
            required={true}
          />
        )}

        <Input
          label={addLabels.specifications}
          placeholder={addSpecsPlaceholder}
          value={form.specifications}
          onChange={(event) => updateForm("specifications", event.target.value)}
          required={true}
        />

        <Input
          label={addLabels.date}
          type="date"
          value={form.purchaseDate}
          onChange={(event) => updateForm("purchaseDate", event.target.value)}
          required={true}
        />

        <Select
          label={addLabels.condition}
          value={form.condition}
          onChange={(value) => updateForm("condition", value)}
          options={addConditionOptions}
          placeholder="Select condition"
          required={true}
        />

        <Select
          label="Owning Department"
          value={form.owningDepartment}
          onChange={(value) => updateForm("owningDepartment", value)}
          options={[
            { label: "Estate Management", value: "Estate Management" },
            { label: "Public Works (PWD)", value: "Public Works (PWD)" },
            { label: "Health & Sanitation", value: "Health & Sanitation" },
            { label: "Water Supply", value: "Water Supply" },
            { label: "Education", value: "Education" },
            { label: "General Administration", value: "General Administration" },
          ]}
          placeholder="-- Select --"
          required={true}
        />

        <Input
          label="Quantity"
          type="number"
          min={1}
          value={form.quantity}
          onChange={(event) => updateForm("quantity", event.target.value)}
          required={true}
        />

        <Input
          label="Unit Value (₹)"
          type="number"
          min={0}
          value={form.unitValue}
          onChange={(event) => updateForm("unitValue", event.target.value)}
          required={true}
        />

        <Button
          variant="primary"
          icon={Receipt}
          className="h-8 w-full whitespace-nowrap bg-[#F59E0B] text-white hover:bg-[#D97706] sm:col-span-2 sm:w-auto lg:col-span-1"
          onClick={openInvoiceDrawer}
        >
          {addInvoicePreviewLabel}
        </Button>

        <AddButton
          label="Add Row"
          className="h-8 w-full whitespace-nowrap sm:col-span-2 sm:w-auto lg:col-span-1"
          onClick={handleAddRow}
        />
      </div>

      {formError ? (
        <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-2 py-1.5 text-sm text-red-700">
          {formError}
        </div>
      ) : null}
    </div>
  );
}


