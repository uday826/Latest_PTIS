"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

import { AssetFormData, AssetFormContextType } from "@/types/asset-types/basic-info/asset-wizard.types";

import { useSearchParams } from "next/navigation";
import { getAssetConfig } from "@/lib/constants/asset/constants";

export const AssetFormContext = createContext<AssetFormContextType | undefined>(undefined);

export function AssetFormProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedOnce, setSubmittedOnce] = useState(false);
  const [onSubmitHook, setOnSubmitHook] = useState<(() => Promise<boolean>) | null>(null);
  const [stagedFiles, setStagedFiles] = useState<Record<number, { file: File; definition: any }>>({});

  const registerSubmitHook = (hook: (() => Promise<boolean>) | null) => {
    setOnSubmitHook(() => hook);
  };

  const [formData, setFormData] = useState<AssetFormData>(() => {
    const category = searchParams.get("category") || searchParams.get("categoryId") || "BUILDING";
    const assetType = searchParams.get("assetType") || searchParams.get("typeId") || "";
    const categoryIdStr = searchParams.get("categoryId") || "1";
    const typeIdStr = searchParams.get("typeId") || "1";
    const assetIdStr = searchParams.get("assetId") || searchParams.get("id") || "0";
    const assetCodeStr = searchParams.get("assetCode") || "";
    const parsedAssetId = assetIdStr ? Number(assetIdStr) : 0;

    const config = getAssetConfig(category || "", "");
    const categoryKey = config ? config.categoryKey : (category ? category.toUpperCase() : "BUILDING");
    const isBuilding = categoryKey === "BUILDING";

    return {
      category: isBuilding ? "Building Assets" : categoryKey,
      assetType: assetType || (isBuilding ? "Municipal Office" : ""),
      categoryId: categoryIdStr ? Number(categoryIdStr) : 1,
      typeId: typeIdStr ? Number(typeIdStr) : 1,
      id: parsedAssetId, // Used by submitAssetForm for update detection
      assetId: parsedAssetId, // Used by document upload
      assetCode: assetCodeStr || "",
      parentBuildingId: null,
      selectedParentFloorId: null,
      attributes: {},
      documents: [],
      assetName: "",
      propertyNumber: "",
      upicId: "",
      surveyNumber: "",
      zone: "",
      zoneId: "",
      ward: "",
      wardId: "",
      department: "",
      departmentId: "",
      status: "Active",
      condition: "Good",
      isRevenueGenerating: "No",
      operationalControl: "",
      inChargeName: "",
      inChargeDesignation: "",
      inChargeMobile: "",
      inChargeEmail: "",
      officeExtension: "",
      fullAddress: "",
      locality: "",
      landmark: "",
      pinCode: "",
      latitude: "",
      longitude: "",
      surveyedBy: "Admin User",
      // Legal
      ownershipType: "",
      acquisitionMethod: "purchase",
      possessionDate: "",
      agreementNumber: "",
      // Furniture (initialize common ones)
      officeTables: 0,
      executiveChairs: 0,
      // Valuation
      landValue: 0,
      buildingValue: 0,
      totalValue: 0,
      // Floors list initialized empty
      floors: []
    };
  });

  const [lastSavedFormData, setLastSavedFormData] = useState<AssetFormData | null>(null);

  const updateFormData = (data: Partial<AssetFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Sanitize: 1. No leading spaces. 2. Numeric only for contact/pin fields.
    let sanitizedValue = value.replace(/^\s+/, "");
    const lowerName = name.toLowerCase();
    if (
      lowerName.includes("mobile") ||
      lowerName.includes("pincode") ||
      lowerName.includes("phone") ||
      lowerName.includes("contact")
    ) {
      sanitizedValue = sanitizedValue.replace(/\D/g, "");
    }

    // 3. Special character restrictions for specific text fields
    if (name === "inChargeName" || name === "surveyedBy") {
      sanitizedValue = sanitizedValue.replace(/[^a-zA-Z\s.]/g, "");
    } else if (name === "inChargeDesignation") {
      sanitizedValue = sanitizedValue.replace(/[^a-zA-Z\s-]/g, "");
    } else if (name === "assetName") {
      sanitizedValue = sanitizedValue.replace(/[^a-zA-Z0-9\s-_]/g, "");
    } else if (name === "locality" || name === "landmark") {
      sanitizedValue = sanitizedValue.replace(/[^a-zA-Z0-9\s,./-]/g, "");
    } else if (name === "fullAddress") {
      sanitizedValue = sanitizedValue.replace(/[^a-zA-Z0-9\s,./#\-()]/g, "");
    }

    // 4. Added new validations requested by the user
    if (name === "assetCode" || name === "assetNo") {
      sanitizedValue = sanitizedValue.replace(/[^a-zA-Z0-9\-_/]/g, "");
    } else if (name === "propertyNumber") {
      sanitizedValue = sanitizedValue.replace(/[^a-zA-Z0-9\-/]/g, "");
    } else if (lowerName.includes("email")) {
      sanitizedValue = sanitizedValue.replace(/\s/g, "");
    } else if (name === "latitude" || name === "longitude") {
      sanitizedValue = sanitizedValue.replace(/[^0-9.\-]/g, "");
      const parts = sanitizedValue.split(".");
      if (parts.length > 2) {
        sanitizedValue = parts[0] + "." + parts.slice(1).join("");
      }
      if (sanitizedValue.includes("-")) {
        sanitizedValue = (sanitizedValue.startsWith("-") ? "-" : "") + sanitizedValue.replace(/-/g, "");
      }
    } else if (
      lowerName.includes("value") ||
      lowerName.includes("rate") ||
      lowerName.includes("cost") ||
      lowerName.includes("price") ||
      lowerName.includes("valuation")
    ) {
      sanitizedValue = sanitizedValue.replace(/[^0-9.]/g, "");
      const parts = sanitizedValue.split(".");
      if (parts.length > 2) {
        sanitizedValue = parts[0] + "." + parts.slice(1).join("");
      }
    }

    setFormData((prev) => {
      const newData = { ...prev, [name]: sanitizedValue };

      // Reset assetType if category changes to keep state consistent
      if (name === "category") {
        newData.assetType = "";
      }

      if (name === "zoneId") {
        newData.wardId = "";
      }

      return newData;
    });
  };

  const handleToggleChange = (name: string, checked: boolean) => {
    setFormData((prev) => {
      const newData = { ...prev, [name]: checked };

      // Inheritance logic
      if (name === "inheritLocation" && checked && prev.parentAssetId) {
        // Simulated parent data retrieval
        newData.fullAddress = "Main Municipal Building, Administrative Block, Zone 4";
        newData.locality = "Civil Lines";
        newData.landmark = "Opposite District Court";
        newData.pinCode = "400001";
        newData.latitude = "19.0760";
        newData.longitude = "72.8777";
      }

      return newData;
    });
  };

  const handleAttributeChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [name]: value,
      },
    }));
  };

  return (
    <AssetFormContext.Provider value={{
      formData,
      updateFormData,
      handleInputChange,
      handleToggleChange,
      handleAttributeChange,
      errors,
      setErrors,
      submittedOnce,
      setSubmittedOnce,
      lastSavedFormData,
      setLastSavedFormData,
      onSubmitHook,
      registerSubmitHook,
      stagedFiles,
      setStagedFiles
    }}>
      {children}
    </AssetFormContext.Provider>
  );
}

export function useAssetForm() {
  const context = useContext(AssetFormContext);
  if (context === undefined) {
    throw new Error("useAssetForm must be used within an AssetFormProvider");
  }
  return context;
}
