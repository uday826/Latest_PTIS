"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAssetForm } from "../AssetFormContext";
import { Plus, Building2, CheckCircle2, LayoutGrid, Edit2, Loader2 } from "lucide-react";
import { Input, Select, Card, CardContent } from "@/components/common";
import { SubUnitDetailedConfigurator } from "./SubUnitDetailedConfigurator";
import {
  bulkGenerateSubUnitsAction,
  createChildAssetAction,
  saveFloorDetail,
  fetchFloorsByAsset,
} from "@/app/[locale]/assets/municipal-Asset/add-New-Asset/floor-details/actions";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export function StandaloneSubUnitStep({
  dropdownOptions,
  initialSubUnits = []
}: {
  dropdownOptions?: any;
  initialSubUnits?: any[];
}) {
  const t = useTranslations("addAssetForm");
  const { formData, updateFormData, setSubunitFiles, registerSubmitHook } = useAssetForm();
  const [isGenerating, setIsGenerating] = useState(false);
  const initializedRef = useRef<string | null>(null);

  const parentBuildingId = formData.parentBuildingId;
  const parentBuildingData = formData.parentBuildingData;
  const parentBuildingName = parentBuildingData?.assetName || (parentBuildingId === 1001 ? "Municipal Office Complex" :
    parentBuildingId === 1002 ? "Sunshine Residential" :
      parentBuildingId === 1003 ? "Central Market Hub" : "Parent Building");

  const parentFloors = parentBuildingData?.floors || [];

  const [fromNo, setFromNo] = useState(1);
  const [toNo, setToNo] = useState(5);
  const [selectedFloorId, setSelectedFloorId] = useState<number>(parentFloors[0]?.id || 1);

  const units = formData.unitDetails || [];
  const setUnits = (newUnits: any[]) => {
    updateFormData({ unitDetails: newUnits });
  };

  const [activeUnit, setActiveUnit] = useState<any | null>(null);

  // Load and map initial sub-units from props
  useEffect(() => {
    const signature = `${initialSubUnits?.length ?? 0}|${(initialSubUnits?.[0] as any)?.assetId ?? (initialSubUnits?.[0] as any)?.id ?? ""}|${parentFloors?.length ?? 0}`;
    if (initializedRef.current === signature) return;
    initializedRef.current = signature;

    if (!initialSubUnits || initialSubUnits.length === 0) {
      // Only clear if there are no existing units in formData either (prevent clearing on back-nav)
      const existingUnits = formData.unitDetails || [];
      if (existingUnits.length === 0) {
        updateFormData({ unitDetails: [] });
      }
      return;
    }

    const mapped = initialSubUnits.map((u: any) => {
      // Map rooms list — use new dimension-based Room shape
      let mappedRooms: any[] = [];
      if (Array.isArray(u.roomWiseDetails)) {
        mappedRooms = u.roomWiseDetails.map((r: any) => {
          const areaSqM = Number(r.areaSqMtr || r.areaSqM || 0);
          const areaSqFt = areaSqM * 10.7639;
          const rOffsets = Array.isArray(r.offsets) ? r.offsets.map((off: any) => ({
            id: off.id,
            shape: off.shape || "Rectangle",
            length: Number(off.length !== undefined ? off.length : (off.radius || 0)),
            width: Number(off.width || 0),
            height: Number(off.height || 0),
            base1: Number(off.base1 || 0),
            base2: Number(off.base2 || 0),
            radius: Number(off.length !== undefined ? off.length : (off.radius || 0)),
            areaSqM: Number(off.areaSqM || 0),
            op: off.op || "Subtract"
          })) : [];

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
            length: Number(r.lengthMtr || 0),
            width: Number(r.widthMtr || 0),
            height: Number(r.heightMtr || 0),
            base1: Number(r.base1Mtr || 0),
            base2: Number(r.base2Mtr || 0),
            radius: Number(r.radiusMtr || r.widthMtr || 0),
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

      // Resolve floorDetailsId and floor level ID from any of the standard names
      let floorDetailsId = u.floorDetailsId ?? u.FloorDetailsId ?? null;
      let resolvedFloorLevelId = u.floorId ?? u.FloorId ?? u.selectedFloorId ?? null;

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

      return {
        id: u.assetId || u.id,
        subAssetId: u.unitNo || u.shopUnitName || u.assetNo || u.assetCode || `Unit-${u.id}`,
        unitNumber: u.unitNo || u.assetNo || u.assetCode || "",
        unitName: u.shopUnitName || u.assetName || u.name || `${unitType} ${u.unitNo || u.assetNo || u.assetCode || ""}`,
        unitType,
        carpetAreaSqFeet: u.totalAreaSqFt || 0,
        baseValue: u.calculatedCapitalValue || 0,
        status: "Active",
        floorId: resolvedFloorLevelId || floorDetailsId,
        floorDetailsId: floorDetailsId,
        rooms: mappedRooms,
        // Lease/rent fields for display
        rentAmount: renterData?.rentAmount || 0,
        rentType: renterData?.rentType || "None",
        securityDeposit: renterData?.securityDeposit || 0,
        conYear: u.conYear || conYear,
        conType: u.conType || conType,
        useType: u.useType || useType,
        subUseType: u.subUseType || subUseType,
        // Mark as persisted in DB so handleSaveAll won't re-send them on next navigation
        isSaved: true,
        isModified: false,
        // Add all remaining properties to avoid data loss
        ...renterData,
      };
    });

    updateFormData({ unitDetails: mapped });
    initializedRef.current = signature;
  }, [initialSubUnits, parentFloors]);

  const handleGenerate = async () => {
    const pId = Number(parentBuildingId || formData.id || formData.assetId || 0);
    if (!pId) {
      toast.error(t("standaloneSubUnit.toasts.parentNotSaved"));
      return;
    }

    const count = toNo - fromNo + 1;
    if (count < 1) {
      toast.error(t("standaloneSubUnit.toasts.countMin"));
      return;
    }

    const typeLabel = formData.assetType?.split(" ")[0] || "Unit";

    setIsGenerating(true);
    const loadingToast = toast.loading(t("standaloneSubUnit.toasts.generating", { count, typeLabel }));

    try {
      const res = await bulkGenerateSubUnitsAction({
        parentAssetId: pId,
        type: typeLabel,
        count: count,
      });

      if (res.success && res.data?.generatedAssets?.length) {
        const newUnits = res.data.generatedAssets.map((ga) => ({
          id: ga.assetId,
          subAssetId: ga.assetNo,
          unitNumber: ga.assetNo,
          unitName: ga.assetName || `${typeLabel} ${ga.assetNo}`,
          unitType: typeLabel,
          carpetAreaSqFeet: 0,
          baseValue: 0,
          status: "Active",
          floorId: null,
          floorDetailsId: null,
          rooms: [],
          rentAmount: 0,
          securityDeposit: 0,
          isSaved: true,
          isModified: false,
        }));

        setUnits([...units, ...newUnits]);
        const count = res.data.generatedAssets.length;
        const unitText = count === 1 ? `unit` : `units`;
        toast.success(
          t("standaloneSubUnit.toasts.generatedSuccess", { count, unitText }),
          { id: loadingToast }
        );
      } else {
        toast.error(res.error || t("standaloneSubUnit.toasts.generationFailed"), { id: loadingToast });
      }
    } catch (err: any) {
      toast.error(err.message || t("standaloneSubUnit.toasts.generationFailed"), { id: loadingToast });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveUnitDetail = (updatedUnit: any) => {
    const updatedUnits = units.map((u: any) =>
      u.id === updatedUnit.id
        ? {
          ...u,
          ...updatedUnit,
          isModified: true, // mark it modified so it gets saved to the database!
        }
        : u
    );
    setUnits(updatedUnits);

    if (setSubunitFiles && updatedUnit.id) {
      setSubunitFiles((prev) => ({
        ...prev,
        [updatedUnit.id]: {
          photoFile: updatedUnit.photoFile,
          planFile: updatedUnit.planFile,
        },
      }));
    }

    setActiveUnit(null);
  };

  const handleSaveAll = useCallback(async (): Promise<boolean> => {
    if (units.length === 0) return true;

    const loadingToast = toast.loading(t("standaloneSubUnit.toasts.savingUnits"));

    const pId = Number(parentBuildingId || formData.id || formData.assetId || 0);
    if (!pId) {
      toast.error(t("standaloneSubUnit.toasts.parentIdNotResolved"), { id: loadingToast });
      return false;
    }

    try {
      const saved: any[] = [];
      const errors: string[] = [];
      // Only save units that are truly new (not yet persisted) OR have been modified since last save.
      // This prevents re-creating already-saved units when navigating Previous → Next.
      const unsaved = units.filter((u: any) => !u.isSaved || u.isModified);

      // Resolve floor details map
      const floorDetailsMap = new Map<number, number>();
      try {
        const existRes = await fetchFloorsByAsset(pId);
        if (existRes.success && Array.isArray(existRes.data)) {
          existRes.data.forEach((f: any) => {
            if (f.floorId && f.id) floorDetailsMap.set(Number(f.floorId), Number(f.id));
          });
        }
      } catch { }

      const uniqueFloorLevels = new Set<number>(
        unsaved.map((u: any) => u.floorId as number).filter((id: any): id is number => !!id)
      );
      for (const floorLevelId of uniqueFloorLevels) {
        if (!floorDetailsMap.has(floorLevelId)) {
          const sample = unsaved.find((u: any) => u.floorId === floorLevelId);
          const createRes = await saveFloorDetail({
            isActive: true,
            assetId: pId,
            floorId: floorLevelId,
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
          if (createRes.success && (createRes.data as any)?.id) {
            floorDetailsMap.set(floorLevelId, Number((createRes.data as any).id));
          }
        }
      }

      for (const unit of unsaved) {
        const roomDetails = unit.rooms && unit.rooms.length > 0
          ? unit.rooms.map((r: any) => {
            const areaSqM = r.areaSqM != null
              ? Number(r.areaSqM)
              : Number(r.area || 0) * 0.092903;
            return {
              roomNo: r.roomNo,
              roomType: r.roomType,
              shape: r.shape || "Rectangle",
              lengthMtr: r.length ? Number(r.length) : null,
              widthMtr: r.width ? Number(r.width) : null,
              heightMtr: r.height ? Number(r.height) : null,
              base1Mtr: r.base1 ? Number(r.base1) : null,
              base2Mtr: r.base2 ? Number(r.base2) : null,
              areaSqMtr: areaSqM,
              noOfRooms: Number(r.count || 1),
              totalAreaSqMtr: areaSqM * Number(r.count || 1),
              outerYesNo: r.outer === "Yes",
              minusYesNo: r.minus === "Yes" || r.offset === "Yes",
            };
          })
          : null;

        const calcDurationMonths = (s: string, e: string): number => {
          if (!s || !e) return 0;
          const start = new Date(s); const end = new Date(e);
          if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) return 0;
          let m = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
          if (end.getDate() < start.getDate()) m -= 1;
          return Math.max(0, m);
        };

        const rentInfo = unit.rentType && unit.rentType !== "None" ? {
          leaseRentType: unit.rentType,
          leaseStart: unit.leaseStart ? new Date(unit.leaseStart).toISOString() : null,
          leaseEnd: unit.leaseEnd ? new Date(unit.leaseEnd).toISOString() : null,
          duration: calcDurationMonths(unit.leaseStart || "", unit.leaseEnd || ""),
          rentFrequency: unit.rentFreq || "Monthly",
          rentAmount: Number(unit.rentAmount || 0),
          securityDeposit: Number(unit.securityDeposit || 0),
          depositType: unit.depositType || "Refundable",
        } : null;

        const resolvedFloorDetailsId = unit.floorId
          ? (floorDetailsMap.get(unit.floorId) ?? unit.floorId)
          : undefined;

        const res = await createChildAssetAction({
          parentAssetId: pId,
          assetId: unit.id || 0,
          floorDetailsId: resolvedFloorDetailsId,
          floorId: unit.floorId,
          unitNo: unit.unitNumber,
          shopUnitName: unit.unitName || null,
          totalAreaSqFt: unit.carpetAreaSqFeet,
          departmentId: unit.departmentId ? Number(unit.departmentId) : null,
          renterName: unit.renterName || null,
          mobileNo: unit.mobileNo || null,
          emailId: unit.emailId || null,
          gstNo: unit.gstNo || null,
          aadhaarCardNo: unit.aadhaar || null,
          panCardNo: unit.pan || null,
          propertyDescription: unit.propertyDescription || null,
          rentInformation: rentInfo,
          isRoomWiseValuationActive: roomDetails !== null,
          roomDetails,
          rooms: unit.rooms,
          locationAddress: unit.locationAddress || formData.fullAddress || formData.address || null,
          locationLat: unit.locationLat || (formData.latitude ? String(formData.latitude) : null),
          locationLng: unit.locationLng || (formData.longitude ? String(formData.longitude) : null),
          floorConfiguration: {
            unitAreaSqFt: unit.carpetAreaSqFeet,
            calculatedCapitalValue: unit.baseValue || 0,
          }
        });

        if (res.success && res.data) {
          saved.push({
            ...unit,
            id: res.data.assetId || unit.id,
            unitNumber: res.data.assetNo || unit.unitNumber,
            isSaved: true,   // mark as persisted so future Save & Next skips it
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

      // Merge saved back into units
      const updatedUnits = units.map((u: any) => {
        const s = saved.find((sv: any) => sv.id === u.id);
        return s ?? u;
      });
      setUnits(updatedUnits);

      if (errors.length > 0) {
        toast.warning(t("standaloneSubUnit.toasts.partialSave", { saved: saved.length, failed: errors.length, errors: errors.join(", ") }), { id: loadingToast });
        return false;
      }
      toast.success(t("standaloneSubUnit.toasts.allSaved", { count: saved.length }), { id: loadingToast });
      return true;
    } catch (err: any) {
      toast.error(err.message || t("standaloneSubUnit.toasts.saveFailed"), { id: loadingToast });
      return false;
    }
  }, [units, parentBuildingId, formData.id]);

  useEffect(() => {
    if (registerSubmitHook) registerSubmitHook(handleSaveAll);
    return () => { if (registerSubmitHook) registerSubmitHook(null); };
  }, [registerSubmitHook, handleSaveAll]);

  if (activeUnit) {
    return (
      <div className="absolute inset-0 z-50 flex flex-col overflow-hidden bg-slate-50">
        <SubUnitDetailedConfigurator
          unit={activeUnit}
          parentBuildingName={parentBuildingName}
          onSave={handleSaveUnitDetail}
          onCancel={() => setActiveUnit(null)}
          floors={parentFloors}
          dropdownOptions={dropdownOptions}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-6xl mx-auto py-4">
      {/* Top Banner indicating Parent */}
      <div className="bg-blue-900 text-white p-4 rounded-xl flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-800 rounded-lg">
            <Building2 className="size-6 text-blue-200" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-blue-100 uppercase tracking-widest">{t("standaloneSubUnit.generatingFor")}</h2>
            <p className="text-xl font-black">{parentBuildingName}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-blue-200 uppercase tracking-widest font-bold">{t("standaloneSubUnit.assetType")}</p>
          <p className="text-lg font-black text-amber-400">{formData.assetType}</p>
        </div>
      </div>

      {/* Parent Building Registered Details Collapsible Panel */}
      {parentBuildingData && (
        <Card variant="bordered" className="border-blue-100 bg-white/70 shadow-sm">
          <CardContent className="p-3">
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <div className="flex items-center gap-2 text-xs font-black text-slate-700 uppercase tracking-wider">
                  <span className="bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded font-black">{t("standaloneSubUnit.registeredInfo")}</span>
                  <span>{t("standaloneSubUnit.viewDetails")}</span>
                </div>
                <span className="text-xs font-bold text-blue-600 group-open:hidden">{t("standaloneSubUnit.showDetails")}</span>
                <span className="text-xs font-bold text-blue-600 hidden group-open:inline">{t("standaloneSubUnit.hideDetails")}</span>
              </summary>
              <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs animate-in fade-in duration-300">
                <div>
                  <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">{t("standaloneSubUnit.assetNameCode")}</span>
                  <span className="font-bold text-slate-700">{parentBuildingData.assetName} ({parentBuildingData.assetCode})</span>
                </div>
                <div>
                  <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">{t("standaloneSubUnit.propertyTaxSurveyNo")}</span>
                  <span className="font-bold text-slate-700">{parentBuildingData.propertyNumber || "—"} / {parentBuildingData.surveyNumber || "—"}</span>
                </div>
                <div>
                  <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">{t("standaloneSubUnit.wardZone")}</span>
                  <span className="font-bold text-slate-700">{parentBuildingData.ward || "—"} / {parentBuildingData.zone || "—"}</span>
                </div>
                <div>
                  <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">{t("standaloneSubUnit.addressPinCode")}</span>
                  <span className="font-bold text-slate-700">{parentBuildingData.fullAddress || "—"} - {parentBuildingData.pinCode || "—"}</span>
                </div>

                {/* Render Parent Dynamic Attributes */}
                {parentBuildingData.attributes && Object.keys(parentBuildingData.attributes).length > 0 && (
                  <div className="col-span-2 md:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 pt-2 border-t border-slate-100">
                    {Object.entries(parentBuildingData.attributes).map(([key, val]) => (
                      <div key={key}>
                        <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="font-bold text-slate-700">
                          {typeof val === 'boolean' ? (val ? "Yes" : "No") : String(val)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </details>
          </CardContent>
        </Card>
      )}

      {/* Generator Tool */}
      <Card variant="bordered" className="border-blue-200 shadow-sm">
        <CardContent className="p-4 flex flex-wrap items-end gap-4">
          <div className="w-32">
            <Input
              label={t("standaloneSubUnit.fromUnitNo")}
              type="number"
              value={fromNo}
              onChange={e => setFromNo(Number(e.target.value))}
              className="h-10 text-sm font-bold"
            />
          </div>
          <div className="w-32">
            <Input
              label={t("standaloneSubUnit.toUnitNo")}
              type="number"
              value={toNo}
              onChange={e => setToNo(Number(e.target.value))}
              className="h-10 text-sm font-bold"
            />
          </div>

          {parentFloors.length > 0 && (
            <div className="w-48">
              <Select
                label={t("standaloneSubUnit.targetFloor")}
                name="selectedFloorId"
                value={selectedFloorId.toString()}
                onChange={e => setSelectedFloorId(Number(e.target.value))}
                options={parentFloors.map((f: any) => ({
                  label: `${f.floor} (${f.conType})`,
                  value: f.id.toString()
                }))}
                className="h-10 text-sm font-bold"
              />
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="h-10 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-black uppercase tracking-wider text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Plus className="size-4" />
            )}
            {t("standaloneSubUnit.addGenerate")}
          </button>

          {units.length > 0 && (
            <div className="ml-auto h-10 px-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg flex items-center gap-2 font-bold text-xs uppercase">
              <CheckCircle2 className="size-4 text-emerald-500" />
              {t("standaloneSubUnit.unitsGenerated", { count: units.length })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Grid */}
      <Card variant="bordered" className="border-blue-200 shadow-sm overflow-hidden flex flex-col h-[400px]">
        <div className="bg-blue-600 px-4 py-2 flex items-center gap-2 shrink-0">
          <LayoutGrid className="size-4 text-blue-200" />
          <h3 className="text-xs font-black text-white uppercase tracking-widest">
            {t("standaloneSubUnit.generatedHeader", { assetType: formData.assetType, buildingName: parentBuildingName, count: units.length })}
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 sticky top-0 border-b border-slate-200 z-10 shadow-sm">
              <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-3 py-2.5">{t("standaloneSubUnit.assetNo")}</th>
                <th className="px-3 py-2.5">{t("standaloneSubUnit.unitNo")}</th>
                <th className="px-3 py-2.5">{t("standaloneSubUnit.unitName")}</th>
                <th className="px-3 py-2.5 text-center">{t("standaloneSubUnit.rooms")}</th>
                <th className="px-3 py-2.5 text-right">{t("standaloneSubUnit.rent")}</th>
                <th className="px-3 py-2.5">{t("standaloneSubUnit.rentType")}</th>
                <th className="px-3 py-2.5 text-right">{t("standaloneSubUnit.secDeposit")}</th>
                <th className="px-3 py-2.5 text-center">{t("standaloneSubUnit.config")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {units.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-3 py-12 text-center text-slate-400 font-bold uppercase tracking-wider">
                    {t("standaloneSubUnit.noUnitsYet")}
                  </td>
                </tr>
              ) : (
                units.map((u: any) => (
                  <tr key={u.id} className="hover:bg-blue-50/50 transition-colors group">
                    <td className="px-3 py-2 font-mono text-slate-600">{u.subAssetId}</td>
                    <td className="px-3 py-2 font-bold text-slate-800">{u.unitNumber}</td>
                    <td className="px-3 py-2 font-medium">{u.unitName}</td>
                    <td className="px-3 py-2 text-center font-mono font-bold text-slate-700">{u.rooms?.length || 0}</td>
                    <td className="px-3 py-2 text-right font-mono font-bold text-slate-700">{Number(u.rentAmount || 0).toLocaleString()}</td>
                    <td className="px-3 py-2"><span className="px-2 py-0.5 bg-slate-100 rounded text-[9px] font-bold uppercase text-slate-600">{u.rentType || "None"}</span></td>
                    <td className="px-3 py-2 text-right font-mono font-bold text-slate-700">{Number(u.securityDeposit || 0).toLocaleString()}</td>
                    <td className="px-3 py-2 text-center">
                      <button
                        onClick={() => setActiveUnit(u)}
                        className="px-3 py-1 bg-white border border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 rounded shadow-sm text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all mx-auto opacity-80 group-hover:opacity-100 cursor-pointer"
                      >
                        <Edit2 className="size-3" /> {t("standaloneSubUnit.detail")}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}


