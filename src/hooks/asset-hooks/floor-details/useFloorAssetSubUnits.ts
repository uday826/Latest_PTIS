"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import type { SubUnit, BulkGeneratorState, FloorEntry } from "@/types/asset/floor-details.types";
import { DEFAULT_BULK, invalidateFloorCache } from "./useFloorAssetFlowCache";
import {
  fetchSubUnitsByFloor,
  deleteSubUnit,
  updateSubUnitAction,
  bulkGenerateSubUnitsAction,
  createChildAssetAction,
  getSubUnitsByAssetAction,
} from "@/app/[locale]/asset/municipal-Asset/add-New-Asset/floor-details/actions";
import { useAssetForm } from "../../../components/modules/assets/municipal-Asset/add-New-Asset/AssetFormContext";

export function useFloorAssetSubUnits(
  floors: FloorEntry[],
  updateFormData: (data: Partial<any>) => void
) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedFloorId, setSelectedFloorId] = useState<number | null>(null);
  const [localUnits, setLocalUnits] = useState<SubUnit[]>([]);
  const [dbUnitIds, setDbUnitIds] = useState<Set<number>>(new Set());
  const [bulk, setBulk] = useState<BulkGeneratorState>(DEFAULT_BULK);
  const [activeUnit, setActiveUnit] = useState<SubUnit | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let ignore = false;
    async function loadSubUnits() {
      if (isDrawerOpen && selectedFloorId !== null) {
        if (selectedFloorId > 0) {
          const rawAssetId = Number(formData.id || (typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("id") || new URLSearchParams(window.location.search).get("assetId") : null));
          const parentAssetId = isNaN(rawAssetId) || rawAssetId <= 0 ? 2 : rawAssetId;
          const res = await getSubUnitsByAssetAction(parentAssetId);
          if (!ignore) {
            if (res.success && res.data) {
              const floorUnits = res.data.filter((u: any) => u.floorDetailsId === selectedFloorId);
              const mapped: SubUnit[] = floorUnits.map((u: any) => ({
                id: u.id,
                unitNumber: u.unitNo || u.shopUnitName || "",
                unitType: u.unitType || "Flat",
                carpetAreaSqFt: u.totalAreaSqFt || 0,
                status: "Vacant",
                baseValue: u.calculatedCapitalValue || 0,
                floorId: u.floorDetailsId,
                floorDetailsId: u.floorDetailsId,
              }));
              setLocalUnits(mapped);
              setDbUnitIds(new Set(mapped.map((u) => u.id)));
              // Update floors in parent form context too
              updateFormData({
                floors: floors.map((f) => (f.id === selectedFloorId ? { ...f, units: mapped } : f)),
              });
              return;
            }
          }
        }
        const floor = floors.find((f) => f.id === selectedFloorId);
        const units = floor?.units ?? [];
        setLocalUnits(units);
        setDbUnitIds(new Set(units.map((u) => u.id)));
      }
    }
    loadSubUnits();
    return () => {
      ignore = true;
    };
  }, [isDrawerOpen, selectedFloorId]);

  const { formData } = useAssetForm();

  const handleGenerateBulk = async () => {
    if (isSaving) return;
    if (!selectedFloorId) {
      toast.error("Please select a floor first.");
      return;
    }
    if (!bulk.unitType) {
      toast.error("Please select a Unit Type first.");
      return;
    }
    if (!bulk.count || bulk.count <= 0) {
      toast.error("Please enter a valid count.");
      return;
    }

    setIsSaving(true);
    const loadingToast = toast.loading("Generating units in database...");
    try {
      const rawAssetId = Number(formData.id || (typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("id") || new URLSearchParams(window.location.search).get("assetId") : null));
      const parentAssetId = isNaN(rawAssetId) || rawAssetId <= 0 ? 2 : rawAssetId;

      const res = await bulkGenerateSubUnitsAction({
        parentAssetId,
        floorDetailsId: selectedFloorId,
        type: bulk.unitType,
        prefix: bulk.prefix,
        startNumber: bulk.startNum,
        count: bulk.count,
        areaSqFt: bulk.areaSqFt || 100,
      });

      if (res.success && res.data?.generatedAssets) {
        const generated: SubUnit[] = res.data.generatedAssets.map((ga) => ({
          id: ga.assetId,
          unitNumber: ga.assetNo || ga.assetName,
          unitType: bulk.unitType,
          carpetAreaSqFt: bulk.areaSqFt || 100,
          status: "Vacant",
          baseValue: 0,
          floorId: selectedFloorId,
          floorDetailsId: selectedFloorId,
        }));

        setLocalUnits((prev) => [...prev, ...generated]);
        setDbUnitIds((prev) => {
          const next = new Set(prev);
          generated.forEach((g) => next.add(g.id));
          return next;
        });

        // Update the form context immediately so they are associated with this floor
        const currentFloorEntry = floors.find((f) => f.id === selectedFloorId);
        const currentUnits = currentFloorEntry?.units || [];
        updateFormData({
          floors: floors.map((f) => (f.id === selectedFloorId ? { ...f, units: [...currentUnits, ...generated] } : f)),
        });
        invalidateFloorCache();

        toast.success(`Successfully generated ${res.data.totalGenerated} units in database!`, { id: loadingToast });
      } else {
        toast.error(res.error || "Failed to bulk generate units.", { id: loadingToast });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to bulk generate units.", { id: loadingToast });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSubUnits = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const rawAssetId = Number(formData.id || (typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("id") || new URLSearchParams(window.location.search).get("assetId") : null));
      const parentAssetId = isNaN(rawAssetId) || rawAssetId <= 0 ? 2 : rawAssetId;

      // Group units by whether they are already in the DB or not
      const existingUnits = localUnits.filter((u) => dbUnitIds.has(u.id));
      const newUnits = localUnits.filter((u) => !dbUnitIds.has(u.id));

      // Separate new units into detailed vs simple
      const hasDetails = (unit: any) => {
        const hasRooms = Array.isArray(unit.rooms) && unit.rooms.length > 0;
        const hasRent = unit.rentAmount && Number(unit.rentAmount) > 0;
        const hasKyc = unit.aadhaar || unit.pan || unit.renterName;
        return hasRooms || hasRent || hasKyc;
      };

      const detailedNew = newUnits.filter(hasDetails);
      const simpleNew = newUnits.filter((u) => !hasDetails(u));

      const savedNewUnits: SubUnit[] = [];

      // 1. Save detailed new units using `createChildAssetAction`
      for (const u of detailedNew) {
        // Map rooms to backend RoomDetailDto format
        const roomDetails = Array.isArray((u as any).rooms)
          ? (u as any).rooms.map((r: any) => ({
              roomNo: r.roomNo,
              roomType: r.roomType,
              shape: r.shape,
              areaSqMtr: Number(r.area || 0) * 0.092903,
              noOfRooms: Number(r.count || 1),
              totalAreaSqMtr: Number(r.area || 0) * Number(r.count || 1) * 0.092903,
              outerYesNo: r.outer === "Yes",
              minusYesNo: r.offset === "Yes",
            }))
          : null;

        const rentInfo = (u as any).rentType
          ? {
              leaseRentType: (u as any).rentType,
              leaseStart: (u as any).leaseStart ? new Date((u as any).leaseStart).toISOString() : null,
              leaseEnd: (u as any).leaseEnd ? new Date((u as any).leaseEnd).toISOString() : null,
              duration: (() => {
                const s = (u as any).leaseStart;
                const e = (u as any).leaseEnd;
                if (!s || !e) return 0;
                const start = new Date(s);
                const end = new Date(e);
                if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) return 0;
                let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
                if (end.getDate() < start.getDate()) months -= 1;
                return Math.max(0, months);
              })(),
              rentFrequency: (u as any).rentFreq || "Monthly",
              rentAmount: Number((u as any).rentAmount || 0),
              securityDeposit: Number((u as any).securityDeposit || 0),
              depositType: (u as any).depositType || "Refundable",
            }
          : null;

        const res = await createChildAssetAction({
          parentAssetId,
          assetId: 1, // required dummy
          floorDetailsId: selectedFloorId!,
          shopUnitName: u.unitNumber,
          unitNo: u.unitNumber,
          totalAreaSqFt: u.carpetAreaSqFt,
          renterName: (u as any).renterName || null,
          propertyDescription: (u as any).propertyDescription || null,
          zoneNo: (u as any).zone ? Number(String((u as any).zone).replace(/\D/g, "")) : null,
          wardNo: (u as any).ward ? Number(String((u as any).ward).replace(/\D/g, "")) : null,
          propertyNo: (u as any).propertyNo || null,
          partitionNo: (u as any).partitionNo || null,
          mobileNo: (u as any).mobileNo || null,
          surveyNo: (u as any).surveyNo || null,
          emailId: (u as any).emailId || null,
          gstNo: (u as any).gstNo || null,
          shopActNo: (u as any).shopActNo || null,
          aadhaarCardNo: (u as any).aadhaar || null,
          panCardNo: (u as any).pan || null,
          rentInformation: rentInfo,
          floorConfiguration: {
            unitAreaSqFt: u.carpetAreaSqFt,
            calculatedCapitalValue: (u as any).capitalValue || u.baseValue || 0,
          },
          isRoomWiseValuationActive: roomDetails !== null,
          roomDetails,
        });

        if (res.success && res.data?.assetId) {
          savedNewUnits.push({
            ...u,
            id: res.data.assetId,
            unitNumber: res.data.assetNo || u.unitNumber,
          });
          setDbUnitIds((prev) => {
            const next = new Set(prev);
            next.add(res.data!.assetId!);
            return next;
          });
        } else {
          throw new Error(res.error || `Failed to create sub-unit ${u.unitNumber}`);
        }
      }

      // 2. Save simple new units in bulk using `bulkGenerateSubUnitsAction` if any exist
      if (simpleNew.length > 0) {
        // Group by unitType (usually they are all the same, but let's do it safely)
        const types = Array.from(new Set(simpleNew.map((u) => u.unitType)));
        for (const type of types) {
          const typeUnits = simpleNew.filter((u) => u.unitType === type);
          // Parse start number from the first unit's number
          const firstNumMatch = typeUnits[0].unitNumber.match(/\d+$/);
          const startNumber = firstNumMatch ? Number(firstNumMatch[0]) : 1;
          const prefix = typeUnits[0].unitNumber.replace(/\d+$/, "");

          const res = await bulkGenerateSubUnitsAction({
            parentAssetId,
            floorDetailsId: selectedFloorId!,
            type,
            prefix,
            startNumber,
            count: typeUnits.length,
            areaSqFt: typeUnits[0].carpetAreaSqFt || 100,
          });

          if (res.success && res.data?.generatedAssets) {
            res.data.generatedAssets.forEach((ga, index) => {
              const origUnit = typeUnits[index] || typeUnits[typeUnits.length - 1];
              savedNewUnits.push({
                ...origUnit,
                id: ga.assetId,
                unitNumber: ga.assetNo || origUnit.unitNumber,
              });
              setDbUnitIds((prev) => {
                const next = new Set(prev);
                next.add(ga.assetId);
                return next;
              });
            });
          } else {
            throw new Error(res.error || `Failed to bulk generate simple units of type ${type}`);
          }
        }
      }

      // 3. Update existing units (if any modified)
      const updatedExistingUnits = await Promise.all(
        existingUnits.map(async (u) => {
          // Update basic details using standard update endpoint
          const res = await updateSubUnitAction(u.id, {
            unitNumber: u.unitNumber,
            unitType: u.unitType,
            carpetAreaSqFt: u.carpetAreaSqFt,
            status: u.status,
            baseValue: u.baseValue,
          });
          if (!res.success) {
            throw new Error(res.error || `Failed to update unit ${u.unitNumber}`);
          }
          return u;
        })
      );

      const allSavedUnits = [...updatedExistingUnits, ...savedNewUnits];
      updateFormData({
        floors: floors.map((f) => (f.id === selectedFloorId ? { ...f, units: allSavedUnits } : f)),
      });
      invalidateFloorCache();
      toast.success("Sub-units saved successfully!");
      setIsDrawerOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to save sub-units.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteUnit = async (id: number) => {
    if (dbUnitIds.has(id)) {
      const res = await deleteSubUnit(id);
      if (res.success) {
        invalidateFloorCache();
        toast.success("Sub-unit deleted from database.");
        setDbUnitIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      } else {
        toast.error(res.error || "Failed to delete sub-unit from database.");
        return;
      }
    }
    setLocalUnits((prev) => prev.filter((u) => u.id !== id));
  };

  return {
    isDrawerOpen,
    selectedFloorId,
    localUnits,
    bulk,
    activeUnit,
    isSaving,
    setIsDrawerOpen,
    setSelectedFloorId,
    setLocalUnits,
    setBulk,
    setActiveUnit,
    handleGenerateBulk,
    handleSaveSubUnits,
    handleDeleteUnit,
  };
}
