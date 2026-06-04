"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { fetchAssetMasterById } from "@/app/[locale]/assets/actions";
import { fetchCategories } from "@/app/[locale]/assets/municipal-Asset/actions";

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
  const [basicInfoFiles, setBasicInfoFiles] = useState<{ frontPhoto?: File; buildingPlan?: File }>({});

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
      isMovableCategory: undefined,
      hasFloorDetails: undefined,
      hasInventory: undefined,
      isInventoryMandatory: undefined,
      hasLegalCompliance: undefined,
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

  // Draft Recovery: If React Context is wiped (e.g. page refresh) but we have an ID in the URL,
  // fetch the saved draft from the database to refill the context.
  useEffect(() => {
    const recoverDraft = async () => {
      const assetIdStr = searchParams.get("assetId") || searchParams.get("id");
      if (!assetIdStr) return;
      
      const parsedId = Number(assetIdStr);
      // If the Context lost its memory (assetName is blank) but URL has an ID, we recover!
      if (parsedId > 0 && !formData.assetName && !formData.fullAddress) {
        try {
          const dbAsset = await fetchAssetMasterById(parsedId);
          if (dbAsset) {
            setFormData(prev => {
              const dynamicAttrs: Record<string, string | number | boolean> = {};
              if (dbAsset.fieldValues && Array.isArray(dbAsset.fieldValues)) {
                dbAsset.fieldValues.forEach((fv: any) => {
                  const key = fv.fieldName || fv.fieldCode;
                  if (key) {
                    if (fv.textValue !== null && fv.textValue !== undefined) dynamicAttrs[key] = fv.textValue;
                    else if (fv.numberValue !== null && fv.numberValue !== undefined) dynamicAttrs[key] = fv.numberValue;
                    else if (fv.booleanValue !== null && fv.booleanValue !== undefined) dynamicAttrs[key] = fv.booleanValue;
                    else if (fv.dateValue !== null && fv.dateValue !== undefined) dynamicAttrs[key] = fv.dateValue;
                  }
                });
              }

              const updatedData = {
                ...prev,
                assetName: dbAsset.assetName || prev.assetName,
                assetCode: dbAsset.assetNo || dbAsset.assetCode || prev.assetCode,
                fullAddress: dbAsset.address || prev.fullAddress,
                latitude: dbAsset.latitude ? String(dbAsset.latitude) : prev.latitude,
                longitude: dbAsset.longitude ? String(dbAsset.longitude) : prev.longitude,
                surveyNumber: dbAsset.csn || prev.surveyNumber,
                zoneId: dbAsset.zoneId ? String(dbAsset.zoneId) : prev.zoneId,
                wardId: dbAsset.wardId ? String(dbAsset.wardId) : prev.wardId,
                departmentId: dbAsset.departmentId ? String(dbAsset.departmentId) : prev.departmentId,
                status: dbAsset.status || prev.status,
                condition: dbAsset.assetCondition || prev.condition,
                ownershipType: dbAsset.ownershipType || prev.ownershipType,
                subzone: dbAsset.subZoneId ? String(dbAsset.subZoneId) : prev.subzone,
                mouja: dbAsset.moujaId ? String(dbAsset.moujaId) : prev.mouja,
                attributes: { ...prev.attributes, ...dynamicAttrs },
                // Try to map any dynamic attributes back into standard form fields if they match
                propertyNumber: dynamicAttrs.propertyNumber as string || prev.propertyNumber,
                locality: dynamicAttrs.locality as string || prev.locality,
                pinCode: dynamicAttrs.pinCode as string || prev.pinCode,
                inChargeName: dynamicAttrs.inChargeName as string || prev.inChargeName,
                inChargeDesignation: dynamicAttrs.inChargeDesignation as string || prev.inChargeDesignation,
                inChargeMobile: dynamicAttrs.inChargeMobile as string || prev.inChargeMobile,
                inChargeEmail: dynamicAttrs.inChargeEmail as string || prev.inChargeEmail,
              };
              // Set the lastSavedFormData so the "Save & Next" button knows this is the baseline
              setLastSavedFormData(JSON.parse(JSON.stringify(updatedData)));
              return updatedData;
            });
          }
        } catch (error) {
          console.error("Failed to recover draft:", error);
        }
      }
    };

    recoverDraft();
  }, [searchParams]);

  // Sync category and type IDs from URL and securely fetch category flags from backend
  useEffect(() => {
    const categoryIdStr = searchParams.get("categoryId");
    const typeIdStr = searchParams.get("typeId");
    const categoryStr = searchParams.get("category");
    const assetTypeStr = searchParams.get("assetType");

    const syncAndFetchFlags = async () => {
      let changed = false;
      const updates: Partial<AssetFormData> = {};

      const currentCatId = categoryIdStr ? Number(categoryIdStr) : formData.categoryId;

      if (categoryIdStr && Number(categoryIdStr) !== formData.categoryId && Number(categoryIdStr) > 0) {
        updates.categoryId = Number(categoryIdStr);
        changed = true;
      }
      if (typeIdStr && Number(typeIdStr) !== formData.typeId && Number(typeIdStr) > 0) {
        updates.typeId = Number(typeIdStr);
        changed = true;
      }
      if (categoryStr) {
        const config = getAssetConfig(categoryStr, "");
        const categoryKey = config ? config.categoryKey : categoryStr.toUpperCase();
        const isBuildingCategory = categoryKey === "BUILDING";
        const normalizedCategory = isBuildingCategory ? "Building Assets" : categoryKey;
        
        if (normalizedCategory !== formData.category) {
          updates.category = normalizedCategory;
          changed = true;
        }
      }
      if (assetTypeStr && assetTypeStr !== formData.assetType) {
        updates.assetType = assetTypeStr;
        changed = true;
      }

      // If flags are undefined OR category changed, fetch secure config from DB
      if (
        formData.isMovableCategory === undefined || 
        formData.hasFloorDetails === undefined ||
        (updates.categoryId && updates.categoryId !== formData.categoryId)
      ) {
        try {
          const res = await fetchCategories();
          if (res.success && res.data) {
            const cat = res.data.find((c: any) => c.id === currentCatId);
            if (cat) {
              updates.isMovableCategory = cat.isMovable ?? false;
              updates.hasFloorDetails = cat.hasFloorDetails ?? false;
              updates.hasInventory = cat.hasInventory ?? false;
              updates.isInventoryMandatory = cat.isInventoryMandatory ?? false;
              updates.hasLegalCompliance = cat.hasLegalCompliance ?? false;
              changed = true;
            }
          }
        } catch (error) {
          console.error("Failed to fetch secure category flags:", error);
        }
      }

      if (changed) {
        console.log(`[AssetFormContext] Syncing state & flags securely from backend:`, updates);
        setFormData(prev => ({ ...prev, ...updates }) as AssetFormData);
      }
    };

    syncAndFetchFlags();
  }, [searchParams, formData.categoryId, formData.typeId, formData.category, formData.assetType, formData.isMovableCategory, formData.hasFloorDetails]);

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
      setStagedFiles,
      basicInfoFiles,
      setBasicInfoFiles
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
