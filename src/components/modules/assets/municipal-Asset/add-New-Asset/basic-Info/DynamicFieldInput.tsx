"use client";


import { Input, Select, ToggleSwitch } from "@/components/common";
import { ProcessedField } from "@/components/modules/assets/municipal-Asset/add-New-Asset/FieldRenderer";
import { DynamicAttributesFormData } from "@/types/asset-types/basic-info/basicInfo.types";

interface DynamicFieldInputProps {
  field: ProcessedField;
  formData: DynamicAttributesFormData;
  onAttributeChange: (name: string, value: string | number | boolean) => void;
}

/**
 * Isolated dynamic input component to maintain <200 lines file size.
 */
export function DynamicFieldInput({ 
  field, 
  formData, 
  onAttributeChange 
}: DynamicFieldInputProps) {
  const fieldName = field.fieldName;
  const fieldValue = formData.attributes?.[fieldName];

  if (Array.isArray(field.options) && field.options.length > 0) {
    return (
      <Select
        label={field.fieldLabel}
        name={fieldName}
        value={String(fieldValue ?? "")}
        onChange={(e) => onAttributeChange(fieldName, e.target.value)}
        options={field.options.map((opt: string) => ({ label: opt, value: opt }))}
        className="font-medium text-sm h-8"
        selectSize="sm"
        required={field.isRequired}
      />
    );
  }

  const typeLower = field.fieldType?.toLowerCase();
  if (typeLower === "checkbox" || typeLower === "boolean") {
    return (
      <div className="flex items-center gap-2 h-8 pt-6">
        <ToggleSwitch
          checked={Boolean(fieldValue || false)}
          onChange={(val) => onAttributeChange(fieldName, val)}
          label={`${field.fieldLabel}${field.isRequired ? " *" : ""}`}
          showPopup={false}
        />
      </div>
    );
  }

  return (
    <Input
      label={field.fieldLabel}
      name={fieldName}
      type={typeLower === "number" ? "number" : "text"}
      min={typeLower === "number" ? 0 : undefined}
      value={typeof fieldValue === "boolean" ? "" : (fieldValue as string | number ?? "")}
      onChange={(e) => {
        let val = e.target.value;
        
        // Sanitize: 1. No leading spaces. 2. Numeric only for contact/pin fields.
        val = val.replace(/^\s+/, "");
        const lowerName = fieldName.toLowerCase();
        const lowerLabel = field.fieldLabel.toLowerCase();
        if (
          lowerName.includes("mobile") ||
          lowerName.includes("pincode") ||
          lowerName.includes("phone") ||
          lowerName.includes("contact") ||
          lowerLabel.includes("mobile") ||
          lowerLabel.includes("pincode") ||
          lowerLabel.includes("phone") ||
          lowerLabel.includes("contact")
        ) {
          val = val.replace(/\D/g, "");
        }

        // 3. Special character restrictions for dynamic text fields
        const isNameField = lowerName.includes("name") || lowerLabel.includes("name") || lowerName.includes("by") || lowerLabel.includes("by");
        const isDesignationField = lowerName.includes("designation") || lowerLabel.includes("designation");
        const isAddressField = lowerName.includes("address") || lowerLabel.includes("address");
        const isLocalityField = lowerName.includes("locality") || lowerLabel.includes("locality") || lowerName.includes("landmark") || lowerLabel.includes("landmark");

        if (isNameField) {
          val = val.replace(/[^a-zA-Z\s.]/g, "");
        } else if (isDesignationField) {
          val = val.replace(/[^a-zA-Z\s-]/g, "");
        } else if (isAddressField) {
          val = val.replace(/[^a-zA-Z0-9\s,./#\-()]/g, "");
        } else if (isLocalityField) {
          val = val.replace(/[^a-zA-Z0-9\s,./-]/g, "");
        }

        // 4. Added new validations requested by the user
        const isCodeField = lowerName.includes("code") || lowerLabel.includes("code") || lowerName.includes("no") || lowerLabel.includes("no");
        const isTaxField = lowerName.includes("tax") || lowerLabel.includes("tax");
        const isEmailField = lowerName.includes("email") || lowerLabel.includes("email");
        const isCoordinateField = lowerName.includes("latitude") || lowerLabel.includes("latitude") || lowerName.includes("longitude") || lowerLabel.includes("longitude");
        const isValuationField = lowerName.includes("value") || lowerLabel.includes("value") || lowerName.includes("rate") || lowerLabel.includes("rate") || lowerName.includes("cost") || lowerLabel.includes("cost") || lowerName.includes("price") || lowerLabel.includes("price") || lowerName.includes("valuation") || lowerLabel.includes("valuation");

        if (isCodeField) {
          val = val.replace(/[^a-zA-Z0-9\-_/]/g, "");
        } else if (isTaxField) {
          val = val.replace(/[^a-zA-Z0-9\-/]/g, "");
        } else if (isEmailField) {
          val = val.replace(/\s/g, "");
        } else if (isCoordinateField) {
          val = val.replace(/[^0-9.\-]/g, "");
          const parts = val.split(".");
          if (parts.length > 2) {
            val = parts[0] + "." + parts.slice(1).join("");
          }
          if (val.includes("-")) {
            val = (val.startsWith("-") ? "-" : "") + val.replace(/-/g, "");
          }
        } else if (isValuationField) {
          val = val.replace(/[^0-9.]/g, "");
          const parts = val.split(".");
          if (parts.length > 2) {
            val = parts[0] + "." + parts.slice(1).join("");
          }
        }

        if (typeLower === "number") {
          const numVal = Number(val);
          if (numVal < 0) {
            onAttributeChange(fieldName, 0);
            return;
          }
        }
        onAttributeChange(fieldName, val);
      }}
      className="h-8 text-[13px] font-medium text-slate-700"
      placeholder={`Enter ${field.fieldLabel.toLowerCase()}`}
      required={field.isRequired}
    />
  );
}
