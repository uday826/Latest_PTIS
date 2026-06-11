"use client";

import { useState, useEffect } from "react";
import { useAssetForm } from "../../../components/modules/assets/municipal-Asset/add-New-Asset/AssetFormContext";
import { fetchFloorDropdownOptions } from "@/app/[locale]/assets/municipal-Asset/add-New-Asset/floor-details/actions";
import type { FloorDropdownOptions } from "@/types/asset/floor-details.types";
import { cacheLock } from "./useFloorAssetFlowCache";
import { useFloorAssetMedia } from "./useFloorAssetMedia";

export function useFloorAssetFlow(initialDropdownOptions?: any) {
  const { formData, updateFormData } = useAssetForm();

  // Dynamic dropdown options (use SSR props if available)
  const [dropdownOptions, setDropdownOptions] = useState<FloorDropdownOptions | null>(
    initialDropdownOptions && Object.keys(initialDropdownOptions).length > 0 ? initialDropdownOptions : null
  );

  // Delegate Media and GIS Map Upload handling to useFloorAssetMedia hook
  const mediaFlow = useFloorAssetMedia(updateFormData);

  useEffect(() => {
    // If SSR props successfully hydrated the dropdowns, don't fetch again!
    if (initialDropdownOptions && Object.keys(initialDropdownOptions).length > 0) {
      return;
    }

    let ignore = false;
    async function init() {
      const queryAssetId = typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("id") || new URLSearchParams(window.location.search).get("assetId")
        : null;
      const resolvedAssetId = Number(formData.id || formData.assetId || queryAssetId) || null;
      
      // Even without a saved asset, we need dropdownOptions
      let res;
      if (cacheLock.cachedResult && cacheLock.cachedAssetId === resolvedAssetId) {
        res = cacheLock.cachedResult;
      } else if (cacheLock.activeInitPromise) {
        res = await cacheLock.activeInitPromise;
      } else {
        // fetchFloorDropdownOptions to just get master data
        cacheLock.activeInitPromise = fetchFloorDropdownOptions();
        res = await cacheLock.activeInitPromise;
        cacheLock.cachedResult = res;
        cacheLock.cachedAssetId = resolvedAssetId;
        cacheLock.activeInitPromise = null;
      }

      if (ignore) return;

      if (res && res.success && res.data) {
        // Handle both old cached structure (from fetchFloorStepData) and new structure (from fetchFloorDropdownOptions)
        const opts = res.data.dropdownOptions || res.data;
        setDropdownOptions(opts);
      }
    }
    init();
    return () => {
      ignore = true;
    };
  }, [formData.id, formData.assetId]);

  return {
    dropdownOptions,
    formData,
    ...mediaFlow,
  };
}
