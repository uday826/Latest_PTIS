"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { FloorEntry, NewFloorFormState, FloorDetailApiRequest } from "@/types/asset/floor-details.types";
import { saveFloorDetail, deleteFloorDetail, updateFloorDetail } from "@/app/[locale]/assets/municipal-Asset/add-New-Asset/floor-details/actions";
import { validateFloorConfig } from "@/lib/api/asset/floor-details-validation";
import { DEFAULT_NEW_FLOOR, invalidateFloorCache } from "./useFloorAssetFlowCache";
import { convertSqMToSqFt } from "@/lib/utils/RoomSubmission/conversions";

export function useFloorAssetCRUD(
  formData: any,
  updateFormData: (data: Partial<any>) => void
) {
  const [newFloor, setNewFloor] = useState<NewFloorFormState>(DEFAULT_NEW_FLOOR);
  const [errors, setErrors] = useState<Partial<Record<keyof NewFloorFormState, string>>>({});
  const [isSaving, setIsSaving] = useState(false);

  const floors: FloorEntry[] = formData.floors ?? [];
  const allChecked = floors.length > 0 && floors.every((f) => f.checked);
  const totalCV = floors.reduce((acc, f) => acc + (f.checked ? Number(f.baseValue ?? 0) : 0), 0);

  const handleAddFloor = async () => {
    if (isSaving) return;

    const newErrors = validateFloorConfig(newFloor);
    if (floors.some((f) => f.floor === newFloor.floor)) {
      newErrors.floor = "This floor has already been added.";
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fill all fields correctly. Negative/zero values are not allowed.");
      return;
    }

    const queryAssetId = typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("id") || new URLSearchParams(window.location.search).get("assetId")
      : null;
    const resolvedAssetId = Number(formData.id || formData.assetId || queryAssetId) || null;

    if (!resolvedAssetId) {
      toast.error("Asset ID not found. Please save Basic Info (Step 1) before adding floor details.");
      return;
    }

    setIsSaving(true);
    const carpetAreaSqM = Number(newFloor.carpetAreaSqM);
    const builtUpAreaSqM = Number(newFloor.builtUpAreaSqM);
    const carpetAreaSqFt = parseFloat(convertSqMToSqFt(carpetAreaSqM).toFixed(2));
    const builtUpAreaSqFt = parseFloat(convertSqMToSqFt(builtUpAreaSqM).toFixed(2));

    try {
      const payload: FloorDetailApiRequest = {
        isActive: true,
        createdBy: 1,
        assetId: resolvedAssetId,
        floorId: Number(newFloor.floor),
        subFloorId: 1,
        constructionYear: newFloor.conYear,
        assessmentYear: newFloor.asstYear,
        constructionTypeId: Number(newFloor.conType),
        typeOfUseId: Number(newFloor.useType),
        subTypeOfUseId: Number(newFloor.subUseType),
        carpetAreaSqMeter: carpetAreaSqM,
        carpetAreaSqFeet: carpetAreaSqFt,
        builtUpAreaSqMeter: builtUpAreaSqM,
        builtUpAreaSqFeet: builtUpAreaSqFt,
        noOfRooms: Number(newFloor.rooms) || 1,
        isRented: false,
        isTaxable: true
        // CV calculation and factors are delegated entirely to the backend.
      };

      const res = await saveFloorDetail(payload);

      if (res.success && res.data) {
        invalidateFloorCache();
        const addedFloor: FloorEntry = {
          id: res.data.id,
          checked: true,
          floor: newFloor.floor,
          conYear: newFloor.conYear,
          asstYear: newFloor.asstYear,
          conType: newFloor.conType,
          useType: newFloor.useType,
          subUseType: newFloor.subUseType,
          rooms: Number(newFloor.rooms) || 1,
          carpetAreaSqFt: carpetAreaSqFt,
          carpetAreaSqM: carpetAreaSqM,
          builtUpAreaSqFt: builtUpAreaSqFt,
          builtUpAreaSqM: builtUpAreaSqM,
          baseValue: res.data.baseValue ?? 0,
          floorFactor: res.data.cvFloorFactor ? res.data.cvFloorFactor.toString() : "-",
          ageFactor: res.data.cvAgeFactor ?? 1.0,
          units: [],
        };
        updateFormData({ floors: [...floors, addedFloor] });
        toast.success("Floor Level configured and saved to database successfully!");
        setNewFloor(DEFAULT_NEW_FLOOR);
      } else {
        let msg = res.error || "A record with the same details already exists.";
        if (msg.toLowerCase().includes("creating the record") || msg.toLowerCase().includes("occurred while")) {
          msg = `Unable to configure floor level. Please ensure the parent Asset (ID: ${resolvedAssetId}) has been successfully saved in Step 1 (Basic Info) before configuring details.`;
        }
        toast.error(msg);
      }
    } catch {
      toast.error("An error occurred while saving the floor level.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteFloor = async (id: number) => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const numId = Number(id);
      if (numId && !isNaN(numId) && numId > 0) {
        const res = await deleteFloorDetail(numId);
        if (res.success) {
          invalidateFloorCache();
          toast.success("Floor Level deleted from database successfully!");
          updateFormData({ floors: floors.filter((f) => Number(f.id) !== numId) });
        } else {
          toast.error(res.error || "Failed to delete floor from database.");
        }
      } else {
        updateFormData({ floors: floors.filter((f) => f.id !== id) });
        toast.success("Floor Level removed.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleFloor = async (id: number) => {
    if (isSaving) return;
    const floor = floors.find((f) => f.id === id);
    if (!floor) return;

    const newChecked = !floor.checked;

    setIsSaving(true);
    try {
      const numId = Number(id);
      if (numId && !isNaN(numId) && numId > 0) {
        const res = await updateFloorDetail(numId, { isActive: newChecked });
        if (res.success) {
          invalidateFloorCache();
          toast.success(`Floor status updated successfully!`);
          updateFormData({
            floors: floors.map((f) => (f.id === id ? { ...f, checked: newChecked } : f)),
          });
        } else {
          toast.error(res.error || "Failed to update floor status in database.");
        }
      } else {
        updateFormData({
          floors: floors.map((f) => (f.id === id ? { ...f, checked: newChecked } : f)),
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  return {
    newFloor,
    errors,
    floors,
    allChecked,
    totalCV,
    isSaving,
    setNewFloor,
    setErrors,
    handleAddFloor,
    handleDeleteFloor,
    handleToggleFloor,
  };
}
