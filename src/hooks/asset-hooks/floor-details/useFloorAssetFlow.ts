"use client";

import { useState, useEffect } from "react";
import { useAssetForm } from "../../../components/modules/assets/municipal-Asset/add-New-Asset/AssetFormContext";
import { fetchFloorStepData } from "@/app/[locale]/assets/municipal-Asset/add-New-Asset/floor-details/actions";
import type { FloorDropdownOptions } from "@/types/asset/floor-details.types";
import { cacheLock, mapFloorsFromApi } from "./useFloorAssetFlowCache";
import { useFloorAssetMedia } from "./useFloorAssetMedia";
import { useFloorAssetSubUnits } from "./useFloorAssetSubUnits";
import { useFloorAssetCRUD } from "./useFloorAssetCRUD";

export function useFloorAssetFlow() {
  const { formData, updateFormData } = useAssetForm();

  // Dynamic dropdown options
  const [dropdownOptions, setDropdownOptions] = useState<FloorDropdownOptions | null>(null);

  // Delegate Media and GIS Map Upload handling to useFloorAssetMedia hook
  const mediaFlow = useFloorAssetMedia(updateFormData);

  // Delegate Floor CRUD and configuration state to useFloorAssetCRUD hook
  const crudFlow = useFloorAssetCRUD(formData, updateFormData);

  // Delegate Sub-Units drawer and bulk generator handling to useFloorAssetSubUnits hook
  const subunitsFlow = useFloorAssetSubUnits(crudFlow.floors, updateFormData);

  useEffect(() => {
    let ignore = false;
    async function init() {
      const queryAssetId = typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("id") || new URLSearchParams(window.location.search).get("assetId")
        : null;
      const resolvedAssetId = Number(formData.id || formData.assetId || queryAssetId) || null;
      if (!resolvedAssetId) return;

      let res;
      if (cacheLock.cachedResult && cacheLock.cachedAssetId === resolvedAssetId) {
        res = cacheLock.cachedResult;
      } else if (cacheLock.activeInitPromise) {
        res = await cacheLock.activeInitPromise;
      } else {
        cacheLock.activeInitPromise = fetchFloorStepData(resolvedAssetId);
        res = await cacheLock.activeInitPromise;
        cacheLock.cachedResult = res;
        cacheLock.cachedAssetId = resolvedAssetId;
        cacheLock.activeInitPromise = null;
      }

      if (ignore) return;

      if (res && res.success && res.data) {
        const data = res.data;
        // Set dropdown options; do NOT auto-select first item so placeholders show
        setDropdownOptions(data.dropdownOptions);

        subunitsFlow.setBulk((prev) => ({
          ...prev,
          unitType: prev.unitType || data.dropdownOptions.unitTypes?.[0]?.value || "",
          prefix: prev.prefix || `${data.dropdownOptions.unitTypes?.[0]?.value?.toUpperCase() || "UNIT"}-`,
        }));

        const mappedFloors = mapFloorsFromApi(data.floors);
        if (mappedFloors.length > 0) {
          updateFormData({ floors: mappedFloors });
        }
      }
    }
    init();
    return () => {
      ignore = true;
    };
  }, []);

  return {
    dropdownOptions,
    handleToggleAllFloors: () => updateFormData({ floors: crudFlow.floors.map((f) => ({ ...f, checked: !crudFlow.allChecked })) }),
    currentFloor: crudFlow.floors.find((f) => f.id === subunitsFlow.selectedFloorId),
    formData,
    ...mediaFlow,
    ...crudFlow,
    ...subunitsFlow,
  };
}
