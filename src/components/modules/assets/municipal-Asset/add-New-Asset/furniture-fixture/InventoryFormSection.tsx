import React from "react";
import { AddButton, Button, Input, SearchSelect, UploadButton } from "@/components/common";
import { Receipt } from "lucide-react";
import { type InventoryForm } from "./FurnitureFixtureTypes";
import { useTranslations } from "next-intl";

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
  departments: { label: string; value: string }[];
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
  departments,
}: InventoryFormSectionProps) {
  const t = useTranslations("addAssetForm");
  const addNameOptions = dynamicItemNameOptions;
  const addModelOptions = dynamicModelOptions;
  const addConditionOptions = dynamicConditionOptions;

  const addLabels = React.useMemo(() => {
    const isItEquipment = form.type === "it-equipment";
    const isElectronicFixtures = form.type === "electronic-fixtures";
    const isVehicle = form.type === "vehicle";
    return {
      itemName: isItEquipment
        ? t("inventory.labels.equipmentName")
        : isElectronicFixtures
          ? t("inventory.labels.fixtureName")
          : isVehicle
            ? t("inventory.labels.vehicleType")
            : t("inventory.labels.itemName"),
      modelName: isItEquipment ? t("inventory.labels.brandModel") : t("inventory.labels.typeModel"),
      condition: isItEquipment || isElectronicFixtures ? t("inventory.labels.status") : t("inventory.labels.condition"),
      date: isElectronicFixtures ? t("inventory.labels.installDate") : t("inventory.labels.purchaseDate"),
      specifications: isVehicle ? t("inventory.labels.regNumber") : t("inventory.labels.specifications"),
    };
  }, [form.type, t]);

  const addSpecsPlaceholder = React.useMemo(() => {
    if (form.type === "vehicle") return "MH-01-AB-1234";
    if (form.type === "it-equipment" || form.type === "electronic-fixtures") {
      return "e.g. i5, 8GB RAM";
    }
    return t("inventory.placeholders.specsPlaceholder");
  }, [form.type, t]);



  return (
    <div className="rounded-xl border border-[#CFD9E6] bg-[#F7FAFF] p-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 items-end text-[11px] [&_label]:text-[11px] [&_label]:mb-1 [&_label]:!font-bold [&_span[id$=-label]]:text-[11px] [&_span[id$=-label]]:!font-bold [&_span.text-gray-700]:!font-bold [&_input]:!px-2 [&_input]:!py-1 [&_input]:!h-7 [&_input]:!text-[11px] [&_input]:!rounded-md [&_button[role=combobox]]:!px-2 [&_button[role=combobox]]:!h-7 [&_button[role=combobox]]:!text-[11px] [&_button[role=combobox]]:!rounded-md [&_button[role=combobox]_span]:!text-[11px] [&_span.text-red-600]:text-[10px] [&_span.text-red-600]:mt-0.5">
        <SearchSelect
          label={t("inventory.columns.type")}
          value={form.type}
          onChange={(_, val) => handleTypeChange(val)}
          options={dynamicCategoryOptions}
          placeholder={t("inventory.placeholders.selectType")}
          required={true}
        />

        <SearchSelect
          label={addLabels.itemName}
          value={form.itemName}
          onChange={(_, val) => handleItemNameChange(val)}
          options={addNameOptions}
          placeholder={form.type ? t("placeholders.selectField", { field: addLabels.itemName.toLowerCase() }) : t("inventory.placeholders.selectTypeFirst")}
          disabled={!form.type}
          required={true}
        />

        <SearchSelect
          label={addLabels.modelName}
          value={form.modelName}
          onChange={(_, val) => updateForm("modelName", val)}
          options={addModelOptions}
          placeholder={form.itemName ? t("placeholders.selectField", { field: addLabels.modelName.toLowerCase() }) : t("inventory.placeholders.selectItemFirst")}
          disabled={!form.itemName}
          required={true}
        />

        <Input
          label={addLabels.specifications}
          placeholder={addSpecsPlaceholder}
          value={form.specifications}
          onChange={(event) => updateForm("specifications", event.target.value)}
          required={true}
          fullWidth={true}
        />

        <Input
          label={addLabels.date}
          type="date"
          value={form.purchaseDate}
          onChange={(event) => updateForm("purchaseDate", event.target.value)}
          required={true}
          fullWidth={true}
        />

        <SearchSelect
          label={addLabels.condition}
          value={form.condition}
          onChange={(_, val) => updateForm("condition", val)}
          options={addConditionOptions}
          placeholder={t("placeholders.selectField", { field: addLabels.condition.toLowerCase() })}
          required={true}
        />

        <SearchSelect
          label={t("inventory.columns.owningDept")}
          value={form.owningDepartment}
          onChange={(_, val) => updateForm("owningDepartment", val)}
          options={departments}
          placeholder={t("inventory.placeholders.selectOwningDept")}
          required={true}
        />

        <Input
          label={t("inventory.columns.quantity")}
          type="number"
          min={1}
          value={form.quantity}
          onChange={(event) => updateForm("quantity", event.target.value)}
          required={true}
          fullWidth={true}
        />

        <Input
          label={t("inventory.columns.unitValue")}
          type="number"
          min={0}
          value={form.unitValue}
          onChange={(event) => updateForm("unitValue", event.target.value)}
          required={true}
          fullWidth={true}
        />

        <div className="flex items-end gap-3 lg:col-span-5 w-full">
          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-[11px] font-bold text-gray-700">{t("inventory.columns.photo")}</span>
            <input
              ref={addPhotoInputRef}
              type="file"
              accept=".bmp,.doc,.docx,.gif,.jpeg,.jpg,.pdf,.png,.ppt,.pptx,.tif,.tiff,.txt,.webp,.xls,.xlsx"
              className="hidden"
              onChange={handleAddPhotoUpload}
            />
            <UploadButton
              label={form.photoName || t("compliance.card.upload")}
              title={form.photoName || t("compliance.card.upload")}
              className="justify-center h-[26px] w-[100px] bg-blue-600 hover:bg-blue-700 text-white border-none text-[9px] font-black uppercase tracking-wider rounded-md overflow-hidden [&>span]:truncate [&>span]:min-w-0"
              onClick={() => addPhotoInputRef.current?.click()}
            />
          </div>

          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-[11px] font-bold text-gray-700">{t("inventory.columns.invoice")}</span>
            <Button
              variant="primary"
              icon={Receipt}
              title={addInvoicePreviewLabel}
              className="justify-center h-[26px] w-[100px] whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white border-none text-[9px] font-black uppercase tracking-wider rounded-md overflow-hidden [&>span]:truncate [&>span]:min-w-0 [&_svg]:size-3"
              onClick={openInvoiceDrawer}
            >
              {addInvoicePreviewLabel}
            </Button>
          </div>

          <AddButton
            label={t("inventory.buttons.addRow")}
            className="h-[26px] w-[100px] whitespace-nowrap text-[9px] font-black uppercase tracking-wider rounded-md bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all"
            onClick={handleAddRow}
          />
        </div>
      </div>

      {formError ? (
        <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-2 py-1.5 text-sm text-red-700">
          {formError}
        </div>
      ) : null}
    </div>
  );
}


