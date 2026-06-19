"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Plus, Layers, Edit2, Trash2, CheckCircle2, Loader2, Home } from "lucide-react";
import { Input, SearchSelect } from "@/components/common";
import { useConfirm } from "@/components/common/ConfirmProvider";
import { SubUnitDetailedConfigurator } from "../sub-units/SubUnitDetailedConfigurator";
import type { PoolUnit } from "@/types/asset/floor-details.types";
import {
  bulkGenerateSubUnitsAction,
  createChildAssetAction,
  saveFloorDetail,
  fetchFloorsByAsset,
  calculateBuildingCVAction,
} from "@/app/[locale]/assets/municipal-Asset/add-New-Asset/floor-details/actions";
import { useAssetForm } from "../AssetFormContext";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface UnitPoolPanelProps {
  dropdownOptions: any | null;
  initialSubUnits?: any[];
  initialFloors?: any[];
}

// ── helpers ──────────────────────────────────────────────────────────────────

const typeBadge: Record<string, string> = {
  Flat: "bg-blue-100 text-blue-700",
  Shop: "bg-amber-100 text-amber-700",
  Office: "bg-indigo-100 text-indigo-700",
  Room: "bg-violet-100 text-violet-700",
  Department: "bg-teal-100 text-teal-700",
};

function calculateArea(
  shape: string,
  length: number,
  width: number,
  radius: number,
  base1: number,
  base2: number,
  height: number
): number {
  const s = (shape || "Rectangle").toLowerCase();
  if (s === "rectangle" || s === "rect") {
    return length * width;
  }
  if (s === "square") {
    const side = length || width;
    return side * side;
  }
  if (s === "triangle") {
    return 0.5 * (length || base1 || 0) * (width || height || 0);
  }
  if (s === "trapezoid") {
    return 0.5 * (base1 + base2) * (height || width || length || 0);
  }
  if (s === "circle") {
    const r = radius || length || width || 0;
    return Math.PI * r * r;
  }
  if (s === "semi circle" || s === "semicircle") {
    const r = radius || length || width || 0;
    return 0.5 * Math.PI * r * r;
  }
  if (s === "quarter circle" || s === "quartercircle" || s === "quarter") {
    const r = radius || length || width || 0;
    return 0.25 * Math.PI * r * r;
  }
  return 0;
}

// ─────────────────────────────────────────────────────────────────────────────

export function UnitPoolPanel({ dropdownOptions, initialSubUnits = [], initialFloors = [] }: UnitPoolPanelProps) {
  const { formData, registerSubmitHook, setSubunitFiles } = useAssetForm();
  const { confirm } = useConfirm();
  const t = useTranslations("addAssetForm");

  const TYPE_OPTIONS = [
    { label: t("floorDetails.flat") || "Flat", value: "Flat" },
    { label: t("floorDetails.shop") || "Shop", value: "Shop" },
    { label: t("floorDetails.office") || "Office", value: "Office" },
  ];

  // ── Pool state ────────────────────────────────────────────────────────────
  const [pool, setPool] = useState<PoolUnit[]>([]);
  const [activeUnit, setActiveUnit] = useState<PoolUnit | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [parentFloors, setParentFloors] = useState<any[]>(initialFloors);

  // ── Bulk generator form (Type + Floor Range + Units Per Floor) ──
  const [genType, setGenType] = useState("");
  const [genFromFloor, setGenFromFloor] = useState("");
  const [genToFloor, setGenToFloor] = useState("");
  const [genCountPerFloor, setGenCountPerFloor] = useState<number | "">(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const initializedRef = useRef<string | null>(null); // tracks last initialSubUnits signature

  const departments = dropdownOptions?.departments || [];

  const enhancedDropdownOptions = dropdownOptions ? {
    ...dropdownOptions,
    departments,
  } : { departments };

  // Set parent floors from props if updated
  useEffect(() => {
    if (initialFloors && initialFloors.length > 0) {
      setParentFloors(initialFloors);
    }
  }, [initialFloors]);

  // ── Load and map initial sub-units from props ─────────────────────────────
  useEffect(() => {
    // Build a lightweight signature for the incoming dataset.
    // Re-initialize only when the data identity actually changes (e.g. after Prev/Next
    // brings fresh server data) — not on every re-render.
    const signature = `${initialSubUnits?.length ?? 0}|${(initialSubUnits?.[0] as any)?.assetId ?? (initialSubUnits?.[0] as any)?.id ?? ""}|${parentFloors?.length ?? 0}|${dropdownOptions ? 1 : 0}`;
    if (initializedRef.current === signature) return;
    initializedRef.current = signature;

    if (!initialSubUnits || initialSubUnits.length === 0) {
      setPool([]);
      return;
    }

    const existing: PoolUnit[] = initialSubUnits.map((u: any) => {
      // Resolve floorDetailsId and floor level ID from any of the standard names
      let floorDetailsId = u.floorDetailsId ?? u.FloorDetailsId ?? null;
      let resolvedFloorLevelId = u.floorId ?? u.FloorId ?? u.selectedFloorId ?? null;
      let subFloorId = u.subFloorId ?? u.SubFloorId ?? null;

      // If we have floorDetailsId but not resolvedFloorLevelId, try to find it in parentFloors
      if (floorDetailsId && !resolvedFloorLevelId) {
        const floorDetail = parentFloors.find((f: any) => Number(f.id ?? f.Id) === Number(floorDetailsId));
        if (floorDetail) {
          resolvedFloorLevelId = (floorDetail.floorId ?? floorDetail.FloorId) ? Number(floorDetail.floorId ?? floorDetail.FloorId) : null;
        }
      }

      // If we have resolvedFloorLevelId but not floorDetailsId, try to find the matching floorDetail from parentFloors
      if (resolvedFloorLevelId && !floorDetailsId) {
        const floorDetail = parentFloors.find((f: any) => Number(f.floorId ?? f.FloorId) === Number(resolvedFloorLevelId));
        if (floorDetail) {
          floorDetailsId = Number(floorDetail.id ?? floorDetail.Id);
        }
      }

      let conYear = u.conYear || "";
      let conType = u.conType || "";
      let useType = u.useType || "";
      let subUseType = u.subUseType || "";

      if (floorDetailsId) {
        const floorDetail = parentFloors.find((f: any) => Number(f.id ?? f.Id) === Number(floorDetailsId));
        if (floorDetail) {
          if (!conYear) conYear = floorDetail.constructionYear || floorDetail.conYear || "";
          if (!conType) conType = floorDetail.constructionTypeId ? String(floorDetail.constructionTypeId) : (floorDetail.conType ? String(floorDetail.conType) : "");
          if (!useType) useType = floorDetail.typeOfUseId ? String(floorDetail.typeOfUseId) : (floorDetail.useType ? String(floorDetail.useType) : "");
          if (!subUseType) subUseType = floorDetail.subTypeOfUseId ? String(floorDetail.subTypeOfUseId) : (floorDetail.subUseType ? String(floorDetail.subUseType) : "");
        }
      }

      let floorLabel = "";
      if (resolvedFloorLevelId && dropdownOptions?.floorLevels) {
        const match = dropdownOptions.floorLevels.find(
          (f: any) => String(f.value) === String(resolvedFloorLevelId)
        );
        floorLabel = match ? `${match.label}` : "Selected";
      } else if (floorDetailsId && dropdownOptions?.floorLevels) {
        const match = dropdownOptions.floorLevels.find(
          (f: any) => String(f.value) === String(floorDetailsId)
        );
        floorLabel = match ? `${match.label}` : "Selected";
      }

      // Resolve department name from departments list
      const deptId = u.departmentId ? Number(u.departmentId) : null;
      const deptName = deptId
        ? (departments.find((d: any) => String(d.value) === String(deptId))?.label || u.departmentName || "")
        : (u.departmentName || "");

      // Unit type: derive from AssetName or unit number code segment (FLAT, SHOP, OFFICE, ROOM, DEPT)
      let unitType = "";
      const numUpper = String(u.unitType || u.unitNo || u.shopUnitName || u.assetNo || u.assetCode || u.assetTypeName || u.assetName || u.name || "").toUpperCase();
      if (numUpper.includes("FLAT")) unitType = "Flat";
      else if (numUpper.includes("SHOP")) unitType = "Shop";
      else if (numUpper.includes("OFFICE")) unitType = "Office";
      else if (numUpper.includes("ROOM")) unitType = "Room";
      else if (numUpper.includes("DEPARTMENT") || numUpper.includes("DEPT")) unitType = "Department";

      if (!unitType) {
        unitType = (u.unitType || "").trim();
      }
      if (!unitType && u.shopUnitName) {
        unitType = (u.shopUnitName as string).split(" ")[0] || "Flat";
      }
      if (!unitType) unitType = "Flat";

      // Map rooms list — use new dimension-based Room shape
      // Try all known field names, then fall back to scanning all array fields
      // to find any that looks like room data (has roomNo or roomType).
      let mappedRooms: any[] = [];
      const ROOM_FIELD_CANDIDATES = ['roomWiseDetails', 'roomDetails', 'roomWiseSubmissions', 'rooms'];
      let roomSource: any[] = [];
      for (const field of ROOM_FIELD_CANDIDATES) {
        if (Array.isArray(u[field]) && u[field].length > 0) {
          roomSource = u[field];
          break;
        }
      }
      // Fallback: scan all array fields for one whose first item has roomNo or roomType
      if (roomSource.length === 0) {
        for (const key of Object.keys(u)) {
          const val = u[key];
          if (Array.isArray(val) && val.length > 0 && val[0] && (val[0].roomNo !== undefined || val[0].roomType !== undefined)) {
            roomSource = val;
            break;
          }
        }
      }

      if (roomSource.length > 0) {
        mappedRooms = roomSource.map((r: any) => {
          let areaSqM = Number(r.areaSqMtr || r.areaSqM || 0);
          if (areaSqM <= 0) {
            areaSqM = calculateArea(
              r.shape || "Rectangle",
              Number(r.lengthMtr || 0),
              Number(r.widthMtr || 0),
              Number(r.radiusMtr || r.lengthMtr || r.widthMtr || 0),
              Number(r.base1Mtr || 0),
              Number(r.base2Mtr || 0),
              Number(r.heightMtr || 0)
            );
          }
          const areaSqFt = areaSqM * 10.7639;
          const rOffsets = Array.isArray(r.offsets) ? r.offsets.map((off: any) => {
            const sh = off.shape || "Rectangle";
            const len = Number(off.length !== undefined ? off.length : (off.radius || 0));
            const wid = Number(off.width || 0);
            const h = Number(off.height || 0);
            const b1 = Number(off.base1 || 0);
            const b2 = Number(off.base2 || 0);
            const rad = Number(off.radius !== undefined ? off.radius : len);
            let oArea = Number(off.areaSqM || 0);
            if (oArea <= 0) {
              oArea = calculateArea(sh, len, wid, rad, b1, b2, h);
            }
            return {
              id: off.id,
              shape: sh,
              length: len,
              width: wid,
              height: h,
              base1: b1,
              base2: b2,
              radius: rad,
              areaSqM: oArea,
              op: off.op || "Subtract"
            };
          }) : [];

          let netAdjustmentSqM = 0;
          rOffsets.forEach((off: any) => {
            const offArea = Number(off.areaSqM || 0);
            if (off.op === "Add") {
              netAdjustmentSqM += offArea;
            } else {
              netAdjustmentSqM -= offArea;
            }
          });

          const netSqM = Math.max(0, areaSqM + netAdjustmentSqM);
          const netSqFt = netSqM * 10.7639;

          return {
            id: r.id,
            roomNo: r.roomNo,
            roomType: r.roomType,
            shape: r.shape || "Rectangle",
            // Dimensions in meters (stored in DB)
            length: (() => {
              const val = Number(r.lengthMtr || 0);
              if (val === 0 && r.shape === "Square" && areaSqM > 0) {
                return Math.round(Math.sqrt(areaSqM) * 100) / 100;
              }
              return val;
            })(),
            width: Number(r.widthMtr || 0),
            height: Number(r.heightMtr || 0),
            base1: Number(r.base1Mtr || 0),
            base2: Number(r.base2Mtr || 0),
            radius: (() => {
              const val = Number(r.radiusMtr || r.lengthMtr || r.widthMtr || 0);
              if (val === 0 && areaSqM > 0) {
                if (r.shape === "Circle") return Math.round(Math.sqrt(areaSqM / Math.PI) * 100) / 100;
                if (r.shape === "Semi Circle") return Math.round(Math.sqrt((areaSqM * 2) / Math.PI) * 100) / 100;
                if (r.shape === "Quarter") return Math.round(Math.sqrt((areaSqM * 4) / Math.PI) * 100) / 100;
              }
              return val;
            })(),
            // Calculated area
            areaSqM,
            areaSqFt,
            offsets: rOffsets,
            hasOffset: rOffsets.length > 0 ? "Yes" : "No",
            netAreaSqM: netSqM,
            netAreaSqFt: netSqFt,
            count: Number(r.noOfRooms || 1),
            outer: r.outerYesNo ? "Yes" : "No",
            minus: r.minusYesNo ? "Yes" : "No",
            subFloorId: u.subFloorId || u.SubFloorId || null,
          };
        });
      }

      // Map renter details
      const rent = Array.isArray(u.renterDetails)
        ? u.renterDetails[0]
        : (u.renterDetailsList && u.renterDetailsList[0]) || u.renterDetails;

      const renterData = rent ? {
        renterName: rent.renterName || rent.tenantName || "",
        gstNo: rent.gstNo || "",
        aadhaar: rent.aadhaarCardNo || rent.tenantAadhaarNo || "",
        pan: rent.panCardNo || rent.tenantPanCardNo || "",
        mobileNo: rent.mobileNo || rent.tenantMobile || "",
        emailId: rent.emailId || rent.tenantEmail || "",
        rentType: rent.leaseRentType || "",
        leaseStart: rent.fromDate ? rent.fromDate.split("T")[0] : (rent.leaseStartDate ? rent.leaseStartDate.split("T")[0] : ""),
        leaseEnd: rent.toDate ? rent.toDate.split("T")[0] : (rent.leaseEndDate ? rent.leaseEndDate.split("T")[0] : ""),
        duration: rent.duration || "",
        rentFreq: rent.rentFrequency || rent.paymentFrequency || "Monthly",
        rentAmount: rent.rentAmount || rent.monthlyRent || "",
        securityDeposit: rent.securityDeposit || "",
        depositType: rent.depositType || "Refundable",
      } : null;

      return {
        tempId: `db_${u.assetId || u.id}`,
        dbId: (u.assetId || u.id) as number,
        unitNumber: (u.unitNo || u.shopUnitName || u.assetNo || u.assetCode || `Unit-${u.id}`) as string,
        unitType,
        selectedFloorId: resolvedFloorLevelId || floorDetailsId,
        selectedFloorLabel: floorLabel,
        floorDetailsId: floorDetailsId,
        subFloorId: subFloorId,
        carpetAreaSqFt: (() => {
          const rawArea = Number(u.totalAreaSqFt || u.carpetAreaSqFt || u.carpetAreaSqFeet || 0);
          if (rawArea > 0) return Math.round(rawArea * 100) / 100;
          if (mappedRooms.length > 0) {
            const calculated = mappedRooms.reduce((acc, r) => {
              const netAreaSqFt = r.netAreaSqFt !== undefined
                ? Number(r.netAreaSqFt)
                : (r.netAreaSqM !== undefined
                  ? Number(r.netAreaSqM) * 10.7639
                  : Number(r.areaSqFt || r.area || 0));
              const roomSqFt = netAreaSqFt * Number(r.count || 1);
              if (r.minus === "Yes" || r.offset === "Yes") return acc - roomSqFt;
              if (r.outer === "Yes") return acc + roomSqFt * 0.8;
              return acc + roomSqFt;
            }, 0);
            return Math.round(calculated * 100) / 100;
          }
          return 0;
        })(),
        rooms: mappedRooms,
        renterDetails: renterData,
        isSaved: true,
        isModified: false,
        departmentId: deptId,
        departmentName: deptName,
        conYear: u.conYear || conYear,
        conType: u.conType || conType,
        useType: u.useType || useType,
        subUseType: u.subUseType || subUseType,
        // ── Top-level renter identity fields (for display and re-save) ──
        renterName: (u.renterName || u.tenantName || rent?.renterName || rent?.tenantName || null) as string | null,
        mobileNo: (u.mobileNo || u.tenantMobile || rent?.mobileNo || rent?.tenantMobile || null) as string | null,
        emailId: (u.emailId || u.tenantEmail || rent?.emailId || rent?.tenantEmail || null) as string | null,
        gstNo: (u.gstNo || rent?.gstNo || null) as string | null,
        aadhaarCardNo: (u.aadhaarCardNo || u.tenantAadhaarNo || rent?.aadhaarCardNo || rent?.tenantAadhaarNo || null) as string | null,
        panCardNo: (u.panCardNo || u.tenantPanCardNo || rent?.panCardNo || rent?.tenantPanCardNo || null) as string | null,
        // ── Property registration numbers ──
        propertyNo: (u.propertyNo || u.PropertyNo || null) as string | null,
        surveyNo: (u.surveyNo || u.SurveyNo || null) as string | null,
        shopActNo: (u.shopActNo || u.ShopActNo || null) as string | null,
        partitionNo: (u.partitionNo || u.PartitionNo || null) as string | null,
        propertyDescription: (u.propertyDescription || u.PropertyDescription || null) as string | null,
        unitName: (u.shopUnitName || u.unitName || null) as string | null,
        // ── Rent information (for re-save) ──
        rentInformation: renterData?.rentType ? {
          leaseRentType: renterData.rentType,
          leaseStart: renterData.leaseStart || null,
          leaseEnd: renterData.leaseEnd || null,
          rentFrequency: renterData.rentFreq || "Monthly",
          rentAmount: Number(renterData.rentAmount || 0),
          securityDeposit: Number(renterData.securityDeposit || 0),
          depositType: renterData.depositType || "Refundable",
        } : null,
      } as PoolUnit;
    });

    setPool(existing);
  }, [initialSubUnits, parentFloors, dropdownOptions]);

  // ── Generate units — immediately saves to DB, returns real asset IDs ─────────
  const handleGenerate = useCallback(async () => {
    if (!genType) {
      toast.error(t("floorDetails.selectUnitTypeMsg") || "Select a unit type first.");
      return;
    }
    if (!genFromFloor || !genToFloor) {
      toast.error(t("floorDetails.invalidFloorRangeMsg") || "Please select both From and To floors.");
      return;
    }
    const unitsPerFloor = Number(genCountPerFloor);
    if (isNaN(unitsPerFloor) || unitsPerFloor < 1) {
      toast.error(t("floorDetails.countMinMsg") || "Count must be at least 1.");
      return;
    }

    const floorLevels = dropdownOptions?.floorLevels || [];
    const fromIdx = floorLevels.findIndex((f: any) => String(f.value) === String(genFromFloor));
    const toIdx = floorLevels.findIndex((f: any) => String(f.value) === String(genToFloor));

    if (fromIdx === -1 || toIdx === -1) {
      toast.error(t("floorDetails.invalidFloorRangeMsg") || "Invalid floor range selected.");
      return;
    }

    const startIdx = Math.min(fromIdx, toIdx);
    const endIdx = Math.max(fromIdx, toIdx);
    const floorsInRange = floorLevels.slice(startIdx, endIdx + 1);
    const totalCount = floorsInRange.length * unitsPerFloor;

    const urlParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
    const rawId = Number(formData.id || urlParams.get("id") || urlParams.get("assetId"));
    const parentAssetId = isNaN(rawId) || rawId <= 0 ? 0 : rawId;

    if (!parentAssetId) {
      toast.error(t("floorDetails.buildingNotSavedMsg") || "Building not saved yet. Complete Basic Info step first.");
      return;
    }

    setIsGenerating(true);
    const loadingToast = toast.loading(
      t("floorDetails.generatingUnitsMsg", { count: totalCount, genType }) ||
      `Generating ${totalCount} ${genType} unit(s) in database…`
    );

    try {
      const res = await bulkGenerateSubUnitsAction({
        parentAssetId,
        type: genType,
        count: totalCount,
      });

      if (res.success && res.data?.generatedAssets?.length) {
        const newUnits: PoolUnit[] = res.data.generatedAssets.map((ga, idx) => {
          const floorIndex = Math.floor(idx / unitsPerFloor);
          const assignedFloor = floorsInRange[floorIndex] || floorsInRange[floorsInRange.length - 1];

          return {
            tempId: `db_${ga.assetId}`,
            dbId: ga.assetId,
            unitNumber: ga.assetNo,
            unitType: genType,
            selectedFloorId: Number(assignedFloor.value),
            selectedFloorLabel: assignedFloor.label,
            carpetAreaSqFt: 0,
            rooms: [],
            renterDetails: null,
            isSaved: true,
            isModified: true,
          };
        });

        setPool((prev) => [...prev, ...newUnits]);
        const count = res.data.generatedAssets.length;
        const unitText = count === 1 ? `${genType} unit` : `${genType} units`;
        toast.success(
          t("floorDetails.generateSuccessMsg", { count, unitText }) ||
          `${count} ${unitText} generated successfully. Click Details to configure.`,
          { id: loadingToast }
        );

        // Reset generator fields
        setGenType("");
        setGenFromFloor("");
        setGenToFloor("");
        setGenCountPerFloor(1);
      } else {
        const errMsg = res.data?.errors?.join(", ") || res.error || "Generation failed";
        toast.error(errMsg, { id: loadingToast });
      }
    } catch (err: any) {
      toast.error(err.message || "Generation failed.", { id: loadingToast });
    } finally {
      setIsGenerating(false);
    }
  }, [genType, genFromFloor, genToFloor, genCountPerFloor, dropdownOptions, formData.id, t]);

  // ── Remove from pool ──────────────────────────────────────────────────────
  const handleRemove = useCallback((tempId: string) => {
    setPool((prev) => prev.filter((u) => u.tempId !== tempId));
  }, []);

  // ── Save unit detail from configurator back to pool ───────────────────────
  const handleSaveUnitDetail = useCallback((updated: any) => {
    setPool((prev) =>
      prev.map((u) => {
        if (u.tempId !== activeUnit?.tempId) return u;

        // Preserve selectedFloorId: use updated.floorId if present, otherwise keep existing
        const newFloorId = updated.floorId ? Number(updated.floorId) : u.selectedFloorId;

        return {
          ...u,
          // ── Area ─────────────────────────────────────────────────────
          carpetAreaSqFt: Number(updated.carpetAreaSqFeet) || u.carpetAreaSqFt,

          // ── Rooms (authoritative from configurator) ───────────────────
          rooms: Array.isArray(updated.rooms) ? updated.rooms : u.rooms,

          // ── Floor assignment ──────────────────────────────────────────
          selectedFloorId: newFloorId,
          selectedFloorLabel: updated.floorName || u.selectedFloorLabel || "",
          floorDetailsId: updated.floorDetailsId ? Number(updated.floorDetailsId) : u.floorDetailsId,
          subFloorId: updated.subFloorId ? Number(updated.subFloorId) : u.subFloorId ?? null,

          // ── Department ────────────────────────────────────────────────
          departmentId: updated.departmentId ?? u.departmentId ?? null,
          departmentName: updated.departmentName || u.departmentName || "",

          // ── Location ──────────────────────────────────────────────────
          locationAddress: updated.locationAddress || u.locationAddress || null,
          locationLat: updated.locationLat || u.locationLat || null,
          locationLng: updated.locationLng || u.locationLng || null,

          // ── Construction details ───────────────────────────────────────
          conYear: updated.conYear || u.conYear,
          conType: updated.conType || u.conType,
          useType: updated.useType || u.useType,
          subUseType: updated.subUseType || u.subUseType,

          // ── Files ─────────────────────────────────────────────────────
          photoFile: updated.photoFile || u.photoFile,
          planFile: updated.planFile || u.planFile,

          // ── All renter / identity fields — stored at TOP LEVEL for easy
          //    access in handleSaveAll without nesting into renterDetails ──
          renterName: updated.renterName || null,
          mobileNo: updated.mobileNo || null,
          emailId: updated.emailId || null,
          gstNo: updated.gstNo || null,
          aadhaarCardNo: updated.aadhaar || updated.aadhaarCardNo || null,
          panCardNo: updated.pan || updated.panCardNo || null,
          propertyNo: updated.propertyNo || null,
          surveyNo: updated.surveyNo || null,
          shopActNo: updated.shopActNo || null,
          partitionNo: updated.partitionNo || null,
          propertyDescription: updated.propertyDescription || null,
          unitName: updated.unitName || null,
          capitalValue: updated.capitalValue || u.capitalValue || 0,

          // ── Rent information ──────────────────────────────────────────
          // Stored both in renterDetails (for backward compat) AND as rentInformation
          rentInformation: (updated.rentType || updated.leaseRentType) ? {
            leaseRentType: updated.rentType || updated.leaseRentType || null,
            leaseStart: updated.leaseStart || null,
            leaseEnd: updated.leaseEnd || null,
            rentFrequency: updated.rentFreq || updated.rentFrequency || "Monthly",
            rentAmount: Number(updated.rentAmount || 0),
            securityDeposit: Number(updated.securityDeposit || 0),
            depositType: updated.depositType || "Refundable",
          } : (u.rentInformation || null),

          // ── renterDetails snapshot (for display / backward compat) ────
          renterDetails: {
            renterName: updated.renterName || null,
            mobileNo: updated.mobileNo || null,
            emailId: updated.emailId || null,
            gstNo: updated.gstNo || null,
            aadhaar: updated.aadhaar || updated.aadhaarCardNo || null,
            pan: updated.pan || updated.panCardNo || null,
            propertyNo: updated.propertyNo || null,
            surveyNo: updated.surveyNo || null,
            shopActNo: updated.shopActNo || null,
            partitionNo: updated.partitionNo || null,
            propertyDescription: updated.propertyDescription || null,
            unitName: updated.unitName || null,
            capitalValue: updated.capitalValue || 0,
            rentType: updated.rentType || updated.leaseRentType || null,
            leaseStart: updated.leaseStart || null,
            leaseEnd: updated.leaseEnd || null,
            duration: updated.duration || null,
            rentFreq: updated.rentFreq || updated.rentFrequency || "Monthly",
            rentAmount: updated.rentAmount || null,
            securityDeposit: updated.securityDeposit || null,
            depositType: updated.depositType || "Refundable",
          },

          isModified: u.isSaved,
        };
      })
    );
    setActiveUnit(null);
  }, [activeUnit]);

  // ── Save all units to DB (also used as wizard submit hook for SAVE & NEXT) ──
  const handleSaveAll = useCallback(async (): Promise<boolean> => {
    if (pool.length === 0) return true; // nothing to save — proceed to next step

    setIsSaving(true);
    const loadingToast = toast.loading(t("floorDetails.savingUnitsMsg") || "Saving all units to database...");

    // Resolve parent asset ID from context or URL (inline — avoids hoisting issue)
    const urlParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
    const rawAssetId = Number(formData.id || urlParams.get("id") || urlParams.get("assetId"));
    const parentAssetId = isNaN(rawAssetId) || rawAssetId <= 0 ? 0 : rawAssetId;

    if (!parentAssetId) {
      toast.error(t("floorDetails.buildingNotSavedMsg") || "Building not saved yet. Complete Basic Info first.", { id: loadingToast });
      setIsSaving(false);
      return false;
    }

    try {
      const saved: PoolUnit[] = [];
      const errors: string[] = [];
      const unsaved = pool.filter((u) => !u.isSaved || u.isModified);

      // ── Step 0: Auto-create AssetFloorDetails for each unique floor level ──
      // In the new flow there's no pre-configured floor table; floors are created
      // on-the-fly when saving units. We map: FloorMaster.Id → AssetFloorDetails.Id
      const floorDetailsMap = new Map<number, number>(); // floorLevelId → floorDetailsId

      // Load existing floor details for this building first (avoid duplicates)
      try {
        const existRes = await fetchFloorsByAsset(parentAssetId);
        if (existRes.success && Array.isArray(existRes.data)) {
          (existRes.data as any[]).forEach((f: any) => {
            if (f.floorId && f.id) floorDetailsMap.set(Number(f.floorId), Number(f.id));
          });
        }
      } catch { /* ignore — will create new ones */ }

      // Create missing floor details (one per unique floor level in this save batch)
      const uniqueFloorLevels = new Set(
        unsaved.map((u) => u.selectedFloorId).filter((id): id is number => !!id)
      );
      for (const floorLevelId of uniqueFloorLevels) {
        if (!floorDetailsMap.has(floorLevelId)) {
          // Use construction details from the first unit on this floor
          const sample = unsaved.find((u) => u.selectedFloorId === floorLevelId);
          const createRes = await saveFloorDetail({
            isActive: true,
            assetId: parentAssetId,
            floorId: floorLevelId,
            subFloorId: sample?.subFloorId ? Number(sample.subFloorId) : undefined,
            constructionYear: sample?.conYear || String(new Date().getFullYear()),
            assessmentYear: null,
            constructionTypeId: Number(sample?.conType) || 1,
            typeOfUseId: Number(sample?.useType) || 1,
            subTypeOfUseId: Number(sample?.subUseType) || 0,
            carpetAreaSqMeter: 0,
            carpetAreaSqFeet: 0,
            builtUpAreaSqMeter: 0,
            builtUpAreaSqFeet: 0,
            noOfRooms: 0,
            createdBy: 1,
          });
          if (createRes.success && createRes.data) {
            const returnedId = typeof createRes.data === "object"
              ? Number((createRes.data as any).id || (createRes.data as any).items?.id)
              : Number(createRes.data);
            if (returnedId) {
              floorDetailsMap.set(floorLevelId, returnedId);
            }
          }
        }
      }

      // Save each modified/new unit
      for (const unit of unsaved) {
        const roomDetails = unit.rooms.length > 0
          ? unit.rooms.map((r: any) => {
            // r.areaSqM is already in sq.m from new shape-based Room
            // r.area (old) is in SqFt — handle both for backward compat
            const areaSqM = r.areaSqM != null
              ? Number(r.areaSqM)
              : Number(r.area || 0) * 0.092903;
            return {
              roomNo: r.roomNo,
              roomType: r.roomType,
              shape: r.shape || "Rectangle",
              // Dimension fields (in meters) — sent to DB
              lengthMtr: r.length ? Number(r.length) : null,
              widthMtr: r.width ? Number(r.width) : null,
              heightMtr: r.height ? Number(r.height) : null,
              base1Mtr: r.base1 ? Number(r.base1) : null,
              base2Mtr: r.base2 ? Number(r.base2) : null,
              // Area
              areaSqMtr: areaSqM,
              noOfRooms: Number(r.count || 1),
              totalAreaSqMtr: areaSqM * Number(r.count || 1),
              outerYesNo: r.outer === "Yes",
              minusYesNo: r.minus === "Yes" || r.offset === "Yes",
              offsets: Array.isArray(r.offsets)
                ? r.offsets.map((off: any) => ({
                    shape: off.shape || "Rectangle",
                    length: Number(off.length ?? off.radius ?? 0),
                    width: Number(off.width ?? 0),
                    height: Number(off.height ?? 0),
                    base1: Number(off.base1 ?? 0),
                    base2: Number(off.base2 ?? 0),
                    radius: Number(off.radius ?? off.length ?? 0),
                    areaSqM: Number(off.areaSqM ?? 0),
                    op: off.op || "Subtract",
                  }))
                : [],
            };
          })
          : null;

        // Duration must be int (months) — not the display string "1 Month, 5 Days"
        const calcDurationMonths = (s: string, e: string): number => {
          if (!s || !e) return 0;
          const start = new Date(s); const end = new Date(e);
          if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) return 0;
          let m = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
          if (end.getDate() < start.getDate()) m -= 1;
          return Math.max(0, m);
        };

        const rDetails = unit.renterDetails;
        const rInfo = unit.rentInformation;
        const rentType = rDetails?.rentType || rInfo?.leaseRentType;

        const rentInfo = rentType ? {
          leaseRentType: rentType,
          leaseStart: rDetails?.leaseStart || rInfo?.leaseStart ? new Date(rDetails?.leaseStart || rInfo?.leaseStart).toISOString() : null,
          leaseEnd: rDetails?.leaseEnd || rInfo?.leaseEnd ? new Date(rDetails?.leaseEnd || rInfo?.leaseEnd).toISOString() : null,
          duration: calcDurationMonths(rDetails?.leaseStart || rInfo?.leaseStart || "", rDetails?.leaseEnd || rInfo?.leaseEnd || ""),
          rentFrequency: rDetails?.rentFreq || rInfo?.rentFrequency || "Monthly",
          rentAmount: Number(rDetails?.rentAmount || rInfo?.rentAmount || 0),
          securityDeposit: Number(rDetails?.securityDeposit || rInfo?.securityDeposit || 0),
          depositType: rDetails?.depositType || rInfo?.depositType || "Refundable",
        } : null;

        // Resolve AssetFloorDetails.Id from the map (auto-created above)
        const resolvedFloorDetailsId = unit.selectedFloorId
          ? (floorDetailsMap.get(unit.selectedFloorId) ?? unit.selectedFloorId)
          : undefined;

        const res = await createChildAssetAction({
          parentAssetId,
          assetId: unit.dbId || 0,
          floorDetailsId: resolvedFloorDetailsId,
          floorId: unit.selectedFloorId,
          subFloorId: unit.subFloorId || null,
          unitNo: unit.unitNumber,
          // shopUnitName / unit name — try top-level unitName first, then renterDetails
          shopUnitName: (unit as any).unitName || rDetails?.unitName || null,
          totalAreaSqFt: unit.carpetAreaSqFt,
          departmentId: unit.departmentId ? Number(unit.departmentId) : null,
          // Renter identity — now stored at top level by handleSaveUnitDetail
          renterName: unit.renterName || rDetails?.renterName || null,
          mobileNo: unit.mobileNo || rDetails?.mobileNo || null,
          emailId: unit.emailId || rDetails?.emailId || null,
          gstNo: unit.gstNo || rDetails?.gstNo || null,
          aadhaarCardNo: unit.aadhaarCardNo || rDetails?.aadhaar || null,
          panCardNo: unit.panCardNo || rDetails?.pan || null,
          propertyDescription: unit.propertyDescription || rDetails?.propertyDescription || null,
          // Property registration numbers — now properly stored at top level
          propertyNo: (unit as any).propertyNo || rDetails?.propertyNo || null,
          surveyNo: (unit as any).surveyNo || rDetails?.surveyNo || null,
          shopActNo: (unit as any).shopActNo || rDetails?.shopActNo || null,
          partitionNo: (unit as any).partitionNo || rDetails?.partitionNo || null,
          rentInformation: rentInfo,
          isRoomWiseValuationActive: roomDetails !== null,
          roomDetails,
          rooms: unit.rooms,
          locationAddress: unit.locationAddress || formData.fullAddress || formData.address || null,
          locationLat: unit.locationLat || (formData.latitude ? String(formData.latitude) : null),
          locationLng: unit.locationLng || (formData.longitude ? String(formData.longitude) : null),
          floorConfiguration: {
            unitAreaSqFt: unit.carpetAreaSqFt,
            calculatedCapitalValue: unit.capitalValue || rDetails?.capitalValue || 0,
          }
        });

        if (res.success && res.data) {
          const savedUnitId = res.data.assetId || unit.dbId;
          if (savedUnitId && (unit.photoFile || unit.planFile)) {
            if (setSubunitFiles) {
              setSubunitFiles((prev) => ({
                ...prev,
                [savedUnitId]: {
                  photoFile: unit.photoFile,
                  planFile: unit.planFile,
                },
              }));
            }
          }

          saved.push({
            ...unit,
            dbId: res.data.assetId || unit.dbId,
            unitNumber: res.data.assetNo || unit.unitNumber,
            isSaved: true,
            isModified: false,
          });
        } else {
          const rawErr = res.error || "failed";
          const friendlyErr = rawErr.includes("LeaseRent_Asset_NotFound")
            ? "Failed to register renter: Asset unit not found in registry"
            : rawErr;
          errors.push(`${unit.unitNumber}: ${friendlyErr}`);
        }
      }

      // Merge saved back into pool
      setPool((prev) =>
        prev.map((u) => {
          const s = saved.find((sv) => sv.tempId === u.tempId);
          return s ?? u;
        })
      );

      // ── Trigger building-level CV calculation ─────────────────────────────────
      // POST /api/AssetCapitalValue/building/calculate-cv
      // Calculates: floor CVs → sub-unit CVs → building total CV in AssetMaster
      if (parentAssetId > 0) {
        toast.loading(t("floorDetails.calculatingCvMsg") || "Calculating Capital Values…", { id: loadingToast });
        try {
          await calculateBuildingCVAction(parentAssetId, true);
        } catch { /* non-fatal — CV visible on next step */ }
      }

      if (errors.length > 0) {
        toast.warning(t("floorDetails.partialSaveMsg", { saved: saved.length, failed: errors.length, errors: errors.join(", ") }) || `Saved ${saved.length} units. ${errors.length} failed: ${errors.join(", ")}`, { id: loadingToast });
        return false;   // partial failure — stay on page so user can retry
      }
      toast.success(t("floorDetails.allUnitsSavedMsg", { count: saved.length }) || `All ${saved.length} unit(s) saved. Proceeding…`, { id: loadingToast });
      return true;      // all saved — footer will navigate to next step
    } catch (err: any) {
      toast.error(err.message || t("floorDetails.saveFailedMsg") || "Save failed.", { id: loadingToast });
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [pool, formData.id, t]);

  // ── Register handleSaveAll as the SAVE & NEXT submit hook ─────────────────
  useEffect(() => {
    if (registerSubmitHook) registerSubmitHook(handleSaveAll);
    return () => { if (registerSubmitHook) registerSubmitHook(null); };
  }, [registerSubmitHook, handleSaveAll]);

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  const savedCount = pool.filter((u) => u.isSaved).length;
  const unsavedCount = pool.filter((u) => !u.isSaved || u.isModified).length;

  const sortedPool = [...pool].sort((a, b) => {
    const floorLevels = dropdownOptions?.floorLevels || [];
    const idxA = floorLevels.findIndex((f: any) => String(f.value) === String(a.selectedFloorId));
    const idxB = floorLevels.findIndex((f: any) => String(f.value) === String(b.selectedFloorId));

    const sortIdxA = idxA !== -1 ? idxA : 9999;
    const sortIdxB = idxB !== -1 ? idxB : 9999;

    if (sortIdxA !== sortIdxB) {
      return sortIdxA - sortIdxB;
    }

    return (a.unitNumber || "").localeCompare(b.unitNumber || "", undefined, {
      numeric: true,
      sensitivity: "base",
    });
  });

  if (activeUnit) {
    return (
      <div className="fixed inset-0 z-[60] bg-slate-50 flex flex-col">
        <SubUnitDetailedConfigurator
          unit={(() => {
            // Destructure 'rooms' out of renterDetails so it cannot override activeUnit.rooms
            const { rooms: _rdRooms, ...renterRest } = activeUnit.renterDetails || {};
            void _rdRooms; // intentionally unused — we always use activeUnit.rooms
            return {
              ...activeUnit,
              ...renterRest,
              // These always win — set explicitly after the renterDetails spread
              unitNumber: activeUnit.unitNumber,
              unitType: activeUnit.unitType,
              carpetAreaSqFeet: activeUnit.carpetAreaSqFt,
              rooms: activeUnit.rooms,       // ← authoritative room list from pool
              floorId: activeUnit.selectedFloorId,
              floorDetailsId: activeUnit.floorDetailsId,
              subFloorId: activeUnit.subFloorId,
              departmentId: activeUnit.departmentId,
              locationAddress: activeUnit.locationAddress,
              locationLat: activeUnit.locationLat,
              locationLng: activeUnit.locationLng,
              conYear: activeUnit.conYear,
              conType: activeUnit.conType,
              useType: activeUnit.useType,
              subUseType: activeUnit.subUseType,
              photoFile: activeUnit.photoFile,
              planFile: activeUnit.planFile,
              // ── Top-level renter identity fields ──────────────────────
              renterName: activeUnit.renterName || renterRest.renterName || null,
              mobileNo: activeUnit.mobileNo || renterRest.mobileNo || null,
              emailId: activeUnit.emailId || renterRest.emailId || null,
              gstNo: activeUnit.gstNo || renterRest.gstNo || null,
              // Aadhaar/PAN: top-level uses aadhaarCardNo/panCardNo, configurator uses aadhaar/pan
              aadhaar: activeUnit.aadhaarCardNo || renterRest.aadhaar || null,
              pan: activeUnit.panCardNo || renterRest.pan || null,
              // ── Property registration numbers ─────────────────────────
              propertyNo: (activeUnit as any).propertyNo || renterRest.propertyNo || null,
              surveyNo: (activeUnit as any).surveyNo || renterRest.surveyNo || null,
              shopActNo: (activeUnit as any).shopActNo || renterRest.shopActNo || null,
              partitionNo: (activeUnit as any).partitionNo || renterRest.partitionNo || null,
              propertyDescription: activeUnit.propertyDescription || renterRest.propertyDescription || null,
              unitName: (activeUnit as any).unitName || renterRest.unitName || null,
              capitalValue: activeUnit.capitalValue || renterRest.capitalValue || 0,
              // ── Rent information from normalized rentInformation ──────
              rentType: (activeUnit as any).rentInformation?.leaseRentType || renterRest.rentType || null,
              leaseStart: (activeUnit as any).rentInformation?.leaseStart || renterRest.leaseStart || null,
              leaseEnd: (activeUnit as any).rentInformation?.leaseEnd || renterRest.leaseEnd || null,
              rentFreq: (activeUnit as any).rentInformation?.rentFrequency || renterRest.rentFreq || "Monthly",
              rentAmount: (activeUnit as any).rentInformation?.rentAmount || renterRest.rentAmount || null,
              securityDeposit: (activeUnit as any).rentInformation?.securityDeposit || renterRest.securityDeposit || null,
              depositType: (activeUnit as any).rentInformation?.depositType || renterRest.depositType || "Refundable",
            };
          })()}
          floors={parentFloors}
          parentBuildingName={formData.assetName || "Unit Configuration"}
          onSave={handleSaveUnitDetail}
          onCancel={() => setActiveUnit(null)}
          dropdownOptions={enhancedDropdownOptions}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-[#C8E1FC] via-[#DBEAFF] to-[#EDF5FF] border-b border-[#A3CBFA] text-[#1d4ed8]">
        <div className="flex items-center gap-2">
          <div className="bg-[#1d4ed8] p-1 rounded-lg text-white shadow-sm flex items-center justify-center shrink-0">
            <Home className="size-3.5 text-white" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#1d4ed8]">{t("floorDetails.unitManagementPool")}</h3>
            <p className="text-[9px] text-[#000000]/75 font-semibold uppercase tracking-widest mt-0.5">
              {t("floorDetails.generateUnitsSubtitle")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest">
          <span className="px-2 py-0.5 bg-blue-100/80 text-blue-700 border border-blue-200/50 rounded">{t("floorDetails.totalCount", { count: pool.length })}</span>
          {savedCount > 0 && <span className="px-2 py-0.5 bg-emerald-100/80 text-emerald-700 border border-emerald-200/50 rounded">{t("floorDetails.savedCount", { count: savedCount })}</span>}
        </div>
      </div>

      <div className="p-3 space-y-3">
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-3 space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider">{t("floorDetails.generateUnits")}</span>
          </div>
          {/* Only Type + Count — asset numbers generated same way as main asset (Akola01-BLDG-MUNI-FLAT-0001) */}
          <div className="flex flex-wrap items-end gap-3">
            {(() => {
              const fromIdx = (dropdownOptions?.floorLevels || []).findIndex((f: any) => String(f.value) === String(genFromFloor));
              const toIdx = (dropdownOptions?.floorLevels || []).findIndex((f: any) => String(f.value) === String(genToFloor));
              const numFloors = fromIdx !== -1 && toIdx !== -1 ? Math.abs(toIdx - fromIdx) + 1 : 0;
              const totalCount = numFloors * (Number(genCountPerFloor) || 0);

              return (
                <>
                  <div className="w-44">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">{t("floorDetails.type")}</label>
                    <SearchSelect
                      value={genType}
                      onChange={(name, value) => setGenType(value)}
                      options={TYPE_OPTIONS}
                      placeholder={t("floorDetails.selectType") || "Select Type"}
                    />
                  </div>
                  <div className="w-44">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">{t("floorDetails.fromFloor") || "From Floor"}</label>
                    <SearchSelect
                      value={genFromFloor}
                      onChange={(name, value) => setGenFromFloor(value)}
                      options={(dropdownOptions?.floorLevels || []).map((o: any) => ({ label: o.label, value: String(o.value) }))}
                      placeholder={t("floorDetails.floorSelectPlaceholder") || "Select Floor"}
                    />
                  </div>
                  <div className="w-44">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">{t("floorDetails.toFloor") || "To Floor"}</label>
                    <SearchSelect
                      value={genToFloor}
                      onChange={(name, value) => setGenToFloor(value)}
                      options={(dropdownOptions?.floorLevels || []).map((o: any) => ({ label: o.label, value: String(o.value) }))}
                      placeholder={t("floorDetails.floorSelectPlaceholder") || "Select Floor"}
                    />
                  </div>
                  <div className="w-28">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">{t("floorDetails.unitsPerFloor") || "Units / Floor"}</label>
                    <Input
                      type="number"
                      min={1}
                      value={genCountPerFloor}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "") {
                          setGenCountPerFloor("");
                        } else {
                          setGenCountPerFloor(Math.max(1, Number(val)));
                        }
                      }}
                      className="h-8 text-xs px-2 font-bold text-blue-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                  <div className="w-28">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">{t("floorDetails.totalUnits") || "Total Units"}</label>
                    <Input
                      type="number"
                      disabled
                      value={totalCount || ""}
                      className="h-8 text-xs px-2 font-bold text-slate-500 bg-slate-100 border-slate-200 cursor-not-allowed"
                    />
                  </div>
                  <div className="w-44">
                    <button
                      type="button"
                      onClick={handleGenerate}
                      disabled={isGenerating || !genType || !genFromFloor || !genToFloor || !genCountPerFloor || Number(genCountPerFloor) < 1}
                      className={`w-full h-8 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1 transition-colors shadow-sm ${isGenerating || !genType || !genFromFloor || !genToFloor || !genCountPerFloor || Number(genCountPerFloor) < 1
                        ? "bg-blue-300 cursor-not-allowed text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}>
                      {isGenerating
                        ? <><Loader2 className="size-3.5 animate-spin" /> {t("floorDetails.generating")}</>
                        : <><Plus className="size-3.5" strokeWidth={3} /> {t("floorDetails.generateUnitsCount", { count: totalCount || "" })}</>
                      }
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider">{t("floorDetails.configureUnitDetails")}</span>
          </div>

          {pool.length === 0 ? (
            <div className="py-8 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
              <Layers className="size-6 text-slate-300 mx-auto mb-1.5" />
              <p className="text-xs font-bold text-slate-400">{t("floorDetails.noUnitsYet")}</p>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-gradient-to-r from-[#C8E1FC] via-[#DBEAFF] to-[#EDF5FF] border-b border-[#A3CBFA] text-[#1d4ed8] text-xs font-black uppercase tracking-widest">
                    <th className="px-3 py-2">{t("floorDetails.unitNumber")}</th>
                    <th className="px-3 py-2">{t("floorDetails.type")}</th>
                    <th className="px-3 py-2">{t("floorDetails.floor")}</th>
                    <th className="px-3 py-2">{t("floorDetails.departmentName") || "Department"}</th>
                    <th className="px-3 py-2 text-center">{t("floorDetails.areaSqFt")}</th>
                    <th className="px-3 py-2 text-center">{t("floorDetails.status")}</th>
                    <th className="px-3 py-2 text-center">{t("floorDetails.actions")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sortedPool.map((unit) => (
                    <tr key={unit.tempId} className={`hover:bg-slate-50/60 transition-colors ${unit.isSaved && !unit.isModified ? "bg-emerald-50/30" : ""}`}>
                      <td className="px-3 py-2 font-bold text-slate-800">{unit.unitNumber}</td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wide ${typeBadge[unit.unitType] || "bg-slate-100 text-slate-600"}`}>
                          {unit.unitType}
                        </span>
                      </td>
                      <td className="px-3 py-2 font-semibold text-slate-600">
                        {unit.selectedFloorLabel || "—"}
                      </td>
                      <td className="px-3 py-2 font-semibold text-slate-600 truncate max-w-[120px]" title={(unit.departmentId ? departments.find((d: any) => String(d.value) === String(unit.departmentId))?.label : "") || unit.departmentName || ""}>
                        {(unit.departmentId ? departments.find((d: any) => String(d.value) === String(unit.departmentId))?.label : "") || unit.departmentName || "—"}
                      </td>
                      <td className="px-3 py-2 text-center font-mono text-xs">
                        {unit.carpetAreaSqFt > 0
                          ? <span className="font-bold text-slate-700">{unit.carpetAreaSqFt.toFixed(2)}</span>
                          : <span className="text-slate-400 italic text-[9px]">{t("floorDetails.pending") || "pending"}</span>
                        }
                      </td>
                      <td className="px-3 py-2 text-center">
                        {unit.isSaved && !unit.isModified
                          ? <span title="Saved to database"><CheckCircle2 className="size-4 text-emerald-500 mx-auto" /></span>
                          : unit.isModified
                            ? <span className="text-xs font-bold text-amber-600 uppercase">{t("floorDetails.modified")}</span>
                            : <span className="text-xs font-bold text-slate-400 uppercase">{t("floorDetails.pending")}</span>
                        }
                      </td>
                      <td className="px-3 py-1.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setActiveUnit(unit)}
                            className="px-2.5 py-1 rounded-lg text-[10px] font-black text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center gap-1 shadow-sm"
                            title={t("floorDetails.addDetails") || "Configure Unit Details"}>
                            <Plus className="size-3.5" strokeWidth={3} /> {t("floorDetails.addDetails")}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              confirm({
                                variant: "delete",
                                title: t("floorDetails.deleteUnit") || "Delete Unit",
                                description: t("floorDetails.deleteUnitConfirm", { unitNumber: unit.unitNumber }) || `Are you sure you want to delete unit ${unit.unitNumber}?`,
                                onConfirm: () => {
                                  handleRemove(unit.tempId);
                                }
                              });
                            }}
                            className="p-1 rounded-lg text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors"
                            title={t("floorDetails.deleteUnit") || "Delete Unit"}>
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Status hint — saving is triggered by the SAVE & NEXT button in the footer */}
        {pool.length > 0 && (
          <div className="flex items-center gap-2 pt-1 border-t border-slate-100 text-[10px]">
            {isSaving && <><Loader2 className="size-3.5 animate-spin text-blue-500" /><span className="text-blue-600 font-bold">{t("floorDetails.savingProgress")}</span></>}
            {!isSaving && unsavedCount > 0 && <span className="text-amber-600 font-semibold">{t("floorDetails.willBeSaved", { count: unsavedCount })}</span>}
            {!isSaving && unsavedCount === 0 && <><CheckCircle2 className="size-3.5 text-emerald-500" /><span className="text-emerald-600 font-bold">{t("floorDetails.allUnitsSaved")}</span></>}
          </div>
        )}
      </div>
    </div>
  );
}
