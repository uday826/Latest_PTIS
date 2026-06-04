"use client";

import React, { useRef, useState, useEffect } from "react";
import { X, Save, Building2, UploadCloud, FileText, IndianRupee, ImagePlus, CheckCircle2, Trash2, Edit2, Plus, Sparkles, Layers, Loader2 } from "lucide-react";
import { Input, Select } from "@/components/common";
import { RoomWiseSubmissionDrawer } from "./RoomWiseSubmissionDrawer";
import { useAssetForm } from "../AssetFormContext";
import { createChildAssetAction, getChildAssetByIdAction, fetchFloorStepData } from "@/app/[locale]/assets/municipal-Asset/add-New-Asset/floor-details/actions";
import { mapFloorsFromApi } from "@/hooks/asset-hooks/floor-details/useFloorAssetFlowCache";
import { toast } from "sonner";

interface SubUnitDetailedConfiguratorProps {
  unit: any;
  parentBuildingName: string;
  onSave: (updatedUnit: any) => void;
  onCancel: () => void;
}

/** Labelled field wrapper — each Field is relative so Select dropdowns position correctly */
function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative min-w-0 flex-1 ${className}`}>
      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-0.5 truncate">
        {label}
      </label>
      {children}
    </div>
  );
}

/** Row wrapper — each row has an explicit z-index so dropdowns appear above rows below */
function Row({ children, z = 10, className = "" }: { children: React.ReactNode; z?: number; className?: string }) {
  return (
    <div className={`flex gap-3 relative ${className}`} style={{ zIndex: z }}>
      {children}
    </div>
  );
}

/** Section header bar */
function SectionBar({ icon, title, color = "bg-blue-600" }: { icon: React.ReactNode; title: string; color?: string }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 ${color} rounded-t-xl shrink-0`}>
      {icon}
      <span className="text-xs font-bold text-white uppercase tracking-widest">{title}</span>
    </div>
  );
}

/** Read-only info badge */
function InfoBadge({ label, value, accent = false }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className={`rounded-lg px-3 py-1 border flex flex-col justify-center h-[52px] ${accent ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-200"}`}>
      <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
      <p className={`text-sm font-bold -mt-0.5 ${accent ? "text-emerald-700" : "text-slate-800"} truncate`}>{value || "—"}</p>
    </div>
  );
}

/** Helper to calculate duration between start and end dates */
function calculateDuration(startStr: string, endStr: string): string {
  if (!startStr || !endStr) return "";
  const start = new Date(startStr);
  const end = new Date(endStr);
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) return "";

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const parts = [];
  if (years > 0) parts.push(`${years} Yr${years > 1 ? "s" : ""}`);
  if (months > 0) parts.push(`${months} Month${months > 1 ? "s" : ""}`);
  if (days > 0) parts.push(`${days} Day${days > 1 ? "s" : ""}`);

  return parts.join(", ") || "0 Days";
}

/** Helper to calculate duration in total months as an integer */
function calculateDurationMonths(startStr: string, endStr: string): number {
  if (!startStr || !endStr) return 0;
  const start = new Date(startStr);
  const end = new Date(endStr);
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) return 0;

  let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  if (end.getDate() < start.getDate()) {
    months -= 1;
  }
  return Math.max(0, months);
}

export function SubUnitDetailedConfigurator({ unit, parentBuildingName, onSave, onCancel }: SubUnitDetailedConfiguratorProps) {
  const { formData: globalFormData } = useAssetForm();
  const [parentFloors, setParentFloors] = useState<any[]>([]);
  const [dropdownOptions, setDropdownOptions] = useState<any>(null);

  const [formData, setFormData] = useState<any>({ ...unit });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [planPreview, setPlanPreview] = useState<string | null>(null);
  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);
  const [panFile, setPanFile] = useState<File | null>(null);
  const photoRef = useRef<HTMLInputElement>(null);
  const planRef = useRef<HTMLInputElement>(null);
  const aadhaarDocRef = useRef<HTMLInputElement>(null);
  const panDocRef = useRef<HTMLInputElement>(null);

  // Room Wise Submission states
  const [roomsList, setRoomsList] = useState<any[]>(unit.rooms || []);
  const [isRoomsDrawerOpen, setIsRoomsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadFloorData() {
      try {
        const rawAssetId = Number(globalFormData?.id || (typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("id") || new URLSearchParams(window.location.search).get("assetId") : null));
        const assetId = isNaN(rawAssetId) || rawAssetId <= 0 ? 2 : rawAssetId;

        const res = await fetchFloorStepData(assetId);
        if (res.success && res.data) {
          setDropdownOptions(res.data.dropdownOptions);
          const mapped = mapFloorsFromApi(res.data.floors);
          setParentFloors(mapped);
        }
      } catch (err) {
        console.error("Failed to load floor dropdown options and floors:", err);
      }
    }
    loadFloorData();
  }, [globalFormData?.id]);

  useEffect(() => {
    if (parentFloors.length > 0) {
      const fId = Number(formData.floorId || formData.floorDetailsId || unit.floorId || unit.floorDetailsId);
      const selectedFloor = parentFloors.find((f: any) => f.id === fId);
      if (selectedFloor) {
        setFormData((prev: any) => {
          const resolvedFloorName = `${getLabel(dropdownOptions?.floorLevels || [], selectedFloor.floor)} Floor`;
          if (
            prev.conYear === selectedFloor.conYear &&
            prev.conType === selectedFloor.conType &&
            prev.useType === selectedFloor.useType &&
            prev.sdrr === selectedFloor.baseValue &&
            prev.floorName === resolvedFloorName
          ) {
            return prev;
          }
          return {
            ...prev,
            floorId: selectedFloor.id,
            floorName: resolvedFloorName,
            conYear: selectedFloor.conYear,
            conType: selectedFloor.conType,
            useType: selectedFloor.useType,
            sdrr: selectedFloor.baseValue, // baseValue contains SDRR Rate!
            floorFactor: selectedFloor.floorFactor || 1.0,
            ageFactor: selectedFloor.ageFactor || 1.0,
            baseValue: selectedFloor.baseValue,
          };
        });
      }
    }
  }, [parentFloors, dropdownOptions, formData.floorId, unit.floorId, unit.floorDetailsId]);

  const getLabel = (opts: { label: string; value: string }[], val: string | number) => {
    if (!opts) return String(val);
    return opts.find((o) => o.value === String(val))?.label || String(val);
  };

  useEffect(() => {
    if (formData.leaseStart && formData.leaseEnd) {
      const computed = calculateDuration(formData.leaseStart, formData.leaseEnd);
      if (computed && formData.duration !== computed) {
        setFormData((prev: any) => ({ ...prev, duration: computed }));
      }
    } else {
      if (formData.duration) {
        setFormData((prev: any) => ({ ...prev, duration: "" }));
      }
    }
  }, [formData.leaseStart, formData.leaseEnd, formData.duration]);

  useEffect(() => {
    async function loadDetails() {
      if (!unit.id || unit.id === 0) return;
      setLoading(true);
      try {
        const res = await getChildAssetByIdAction(unit.id);
        if (res.success && res.data) {
          const detail = res.data;

          // Map rooms list
          if (Array.isArray(detail.roomWiseDetails)) {
            const mappedRooms = detail.roomWiseDetails.map((r: any) => ({
              id: r.id,
              roomNo: r.roomNo,
              roomType: r.roomType,
              shape: r.shape,
              area: r.totalAreaSqMtr ? Math.round(r.totalAreaSqMtr / 0.092903) : (r.areaSqMtr ? Math.round(r.areaSqMtr / 0.092903) : 0),
              count: r.noOfRooms || 1,
              outer: r.outerYesNo ? "Yes" : "No",
              offset: r.minusYesNo ? "Yes" : "No",
            }));
            setRoomsList(mappedRooms);
          }

          // Map renter and basic details to formData
          const r = detail.renterDetails;
          if (r) {
            setFormData((prev: any) => ({
              ...prev,
              renterName: r.renterName || prev.renterName || "",
              gstNo: r.gstNo || prev.gstNo || "",
              aadhaar: r.aadhaarCardNo || prev.aadhaar || "",
              pan: r.panCardNo || prev.pan || "",
              mobileNo: r.mobileNo || prev.mobileNo || "",
              emailId: r.emailId || prev.emailId || "",
              rentType: r.leaseRentType || prev.rentType || "",
              leaseStart: r.fromDate ? r.fromDate.split("T")[0] : prev.leaseStart || "",
              leaseEnd: r.toDate ? r.toDate.split("T")[0] : prev.leaseEnd || "",
              duration: r.duration || prev.duration || "",
              rentFreq: r.rentFrequency || prev.rentFreq || "Monthly",
              rentAmount: r.rentAmount || prev.rentAmount || "",
              securityDeposit: r.securityDeposit || prev.securityDeposit || "",
              depositType: r.depositType || prev.depositType || "Refundable",
            }));
          }
        }
      } catch (err) {
        console.error("Failed to load sub-unit details:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDetails();
  }, [unit.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => {
      let val = value;
      if (typeof val === "string" && val.startsWith(" ")) {
        val = val.trimStart();
      }
      if (name === "mobileNo") {
        val = val.replace(/\D/g, "").slice(0, 10);
      }
      if (name === "rentAmount" || name === "securityDeposit" || name === "carpetAreaSqFeet") {
        val = val.replace(/-/g, "");
      }
      const next = { ...prev, [name]: val };
      if (name === "unitNumber") {
        next.subAssetId = val;
        next.unitNo = val;
      } else if (name === "unitNo") {
        next.unitNumber = val;
        next.subAssetId = val;
      }
      return next;
    });
  };

  const handleSaveClick = async () => {
    // 1. Validation Checks
    if (!area || Number(area) <= 0) {
      toast.error("Total Area (SqFt) must be greater than 0.");
      return;
    }

    if (formData.mobileNo && formData.mobileNo.length !== 10) {
      toast.error("Mobile number must be exactly 10 digits.");
      return;
    }

    if (formData.emailId) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.emailId)) {
        toast.error("Please enter a valid Email ID.");
        return;
      }
    }

    if (formData.renterName) {
      if (formData.renterName.startsWith(" ")) {
        toast.error("Renter Name cannot start with a space.");
        return;
      }
      if (!/^[A-Za-z][A-Za-z\s]*$/.test(formData.renterName)) {
        toast.error("Renter Name must only contain letters and spaces (no numbers or special characters allowed).");
        return;
      }
    }

    if (formData.aadhaar) {
      if (!/^[0-9]{12}$/.test(formData.aadhaar)) {
        toast.error("Aadhaar Card number must be exactly 12 digits.");
        return;
      }
    }

    if (formData.pan) {
      const panUpper = formData.pan.toUpperCase();
      if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panUpper)) {
        toast.error("PAN must be a valid 10-character Indian PAN format.");
        return;
      }
    }

    if (formData.gstNo) {
      const gstUpper = formData.gstNo.toUpperCase();
      if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gstUpper)) {
        toast.error("GST number must be a valid 15-character Indian GSTIN.");
        return;
      }
    }

    const alphaNumRegex = /^[A-Za-z0-9\s/-]+$/;
    if (formData.propertyNo && !alphaNumRegex.test(formData.propertyNo)) {
      toast.error("Please enter a valid Property No without special characters.");
      return;
    }
    if (formData.partitionNo && !alphaNumRegex.test(formData.partitionNo)) {
      toast.error("Please enter a valid Partition No without special characters.");
      return;
    }
    if (formData.surveyNo && !alphaNumRegex.test(formData.surveyNo)) {
      toast.error("Please enter a valid Survey No without special characters.");
      return;
    }
    if (formData.shopActNo && !alphaNumRegex.test(formData.shopActNo)) {
      toast.error("Please enter a valid Shop Act No without special characters.");
      return;
    }

    if (formData.rentType) {
      if (!formData.renterName || !formData.renterName.trim()) {
        toast.error("Renter Name is required when Lease/Rent Type is selected.");
        return;
      }
      if (!formData.leaseStart) {
        toast.error("Lease Start date is required.");
        return;
      }
      if (!formData.leaseEnd) {
        toast.error("Lease End date is required.");
        return;
      }
      const start = new Date(formData.leaseStart);
      const end = new Date(formData.leaseEnd);
      if (start >= end) {
        toast.error("Lease End date must be after Lease Start date.");
        return;
      }
      if (!formData.rentAmount || Number(formData.rentAmount) <= 0) {
        toast.error("Rent Amount (₹) must be greater than 0.");
        return;
      }
    }

    const loadingToast = toast.loading("Saving configuration to database...");
    try {
      const rawAssetId = Number(globalFormData.id || (typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("id") || new URLSearchParams(window.location.search).get("assetId") : null));
      const parentAssetId = isNaN(rawAssetId) || rawAssetId <= 0 ? 2 : rawAssetId;

      const roomDetails = roomsList.length > 0
        ? roomsList.map((r: any) => ({
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

      const rentInfo = formData.rentType
        ? {
          leaseRentType: formData.rentType,
          leaseStart: formData.leaseStart ? new Date(formData.leaseStart).toISOString() : null,
          leaseEnd: formData.leaseEnd ? new Date(formData.leaseEnd).toISOString() : null,
          duration: formData.leaseStart && formData.leaseEnd ? calculateDurationMonths(formData.leaseStart, formData.leaseEnd) : 0,
          rentFrequency: formData.rentFreq || "Monthly",
          rentAmount: Number(formData.rentAmount || 0),
          securityDeposit: Number(formData.securityDeposit || 0),
          depositType: formData.depositType || "Refundable",
        }
        : null;

      const res = await createChildAssetAction({
        parentAssetId,
        assetId: Number(formData.id) && Number(formData.id) > 0 ? Number(formData.id) : 0,
        floorDetailsId: Number(formData.floorId || formData.floorDetailsId || unit.floorId || unit.floorDetailsId || 1),
        shopUnitName: formData.unitNumber,
        unitNo: formData.unitNumber,
        totalAreaSqFt: area,
        renterName: formData.renterName || null,
        propertyDescription: formData.propertyDescription || null,
        zoneNo: formData.zone ? Number(String(formData.zone).replace(/\D/g, "")) : null,
        wardNo: formData.ward ? Number(String(formData.ward).replace(/\D/g, "")) : null,
        propertyNo: formData.propertyNo || null,
        partitionNo: formData.partitionNo || null,
        mobileNo: formData.mobileNo || null,
        surveyNo: formData.surveyNo || null,
        emailId: formData.emailId || null,
        gstNo: formData.gstNo || null,
        shopActNo: formData.shopActNo || null,
        aadhaarCardNo: formData.aadhaar || null,
        panCardNo: formData.pan || null,
        rentInformation: rentInfo,
        floorConfiguration: {
          unitAreaSqFt: area,
          calculatedCapitalValue: Number(capitalValue) || 0,
        },
        isRoomWiseValuationActive: roomDetails !== null,
        roomDetails,
      });

      if (res.success && res.data) {
        toast.success(res.data.message || "Configuration saved successfully!", { id: loadingToast });
        onSave({
          ...formData,
          rooms: roomsList,
          carpetAreaSqFeet: area,
          capitalValue: Number(capitalValue)
        });
      } else {
        toast.error(res.error || "Failed to save configuration.", { id: loadingToast });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save configuration.", { id: loadingToast });
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPhotoPreview(URL.createObjectURL(file));
  };

  const handlePlanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPlanPreview(URL.createObjectURL(file));
  };

  const handleAadhaarDoc = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAadhaarFile(file);
      setFormData((prev: any) => ({ ...prev, aadhaarDocName: file.name }));
    }
  };

  const handlePanDoc = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPanFile(file);
      setFormData((prev: any) => ({ ...prev, panDocName: file.name }));
    }
  };

  // Mock calculated CV from existing floor factors
  const area = roomsList.length > 0
    ? roomsList.reduce((acc, r) => acc + (Number(r.area || 0) * Number(r.count || 1)), 0)
    : (Number(formData.carpetAreaSqFeet) || 500);
  const sdrr = Number(formData.sdrr) || 100000;         // from parent floor
  const floorFactor = Number(formData.floorFactor) || 1.0;     // from parent floor
  const ageFactor = Number(formData.ageFactor) || 1.0;       // from parent floor
  const capitalValue = ((area / 10.764) * sdrr * floorFactor * ageFactor).toFixed(0);
  const formattedCV = Number(capitalValue).toLocaleString("en-IN");

  const inp = "h-8 text-xs";


  return (
    <div className="flex flex-col h-full overflow-hidden bg-slate-50">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0f172a] border-b border-slate-700 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-blue-500/20 rounded-lg border border-blue-500/30">
            <Building2 className="size-4 text-blue-400" />
          </div>
          <div>
            <h2 className="text-sm font-black text-white tracking-wide">Add Unit Details - {formData.unitNumber || "New Unit"}</h2>
            <p className="text-[10px] text-blue-400 font-semibold tracking-widest uppercase">{parentBuildingName}</p>
          </div>
        </div>
        <button onClick={onCancel} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
          <X className="size-4" />
        </button>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar relative">
        {loading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] z-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="size-8 text-blue-500 animate-spin" />
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Loading details...</p>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════
            BASIC INFORMATION
            Rows with decreasing z-index so dropdowns
            in higher rows always appear over lower rows
        ════════════════════════════════════════════ */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <SectionBar icon={<FileText className="size-3.5 text-white" />} title="Basic Information" />
          <div className="p-3 space-y-2">

            {/* Row 1  z:50 */}
            <Row z={50}>
              <Field label="Asset No.">
                <Input name="unitNumber" value={formData.unitNumber || formData.subAssetId || ""} readOnly className={`${inp} font-bold text-slate-500 bg-slate-100 cursor-not-allowed`} />
              </Field>
              <Field label="Type">
                <Input name="unitType" value={formData.unitType || ""} readOnly className={`${inp} bg-slate-100 text-slate-500 cursor-not-allowed`} />
              </Field>
              <Field label="Complex Name">
                <Input name="complexName" value={parentBuildingName} onChange={() => { }} readOnly className={`${inp} bg-slate-100 text-slate-500 cursor-not-allowed`} />
              </Field>
              <Field label="Renter Name">
                <Input name="renterName" value={formData.renterName || ""} onChange={handleChange} className={inp} />
              </Field>
            </Row>

            {/* Row 2  z:40 */}
            <Row z={40}>
              <Field label="Shop / Unit Name">
                <Input name="unitName" value={formData.unitName || ""} onChange={handleChange} className={inp} />
              </Field>
              <Field label="Property Description">
                <Input name="propertyDescription" value={formData.propertyDescription || ""} onChange={handleChange} className={inp} />
              </Field>
            </Row>

            {/* Row 3  z:30 */}
            <Row z={30}>
              <Field label="Property No">
                <Input name="propertyNo" value={formData.propertyNo || ""} onChange={handleChange} className={inp} />
              </Field>
              <Field label="Partition No">
                <Input name="partitionNo" value={formData.partitionNo || ""} onChange={handleChange} className={inp} />
              </Field>
              <Field label="Mobile No">
                <Input name="mobileNo" value={formData.mobileNo || ""} onChange={handleChange} maxLength={10} className={inp} />
              </Field>
            </Row>

            {/* Row 4  z:20 */}
            <Row z={20}>
              <Field label="Email ID">
                <Input name="emailId" value={formData.emailId || ""} onChange={handleChange} className={inp} />
              </Field>
              <Field label="Survey No">
                <Input name="surveyNo" value={formData.surveyNo || ""} onChange={handleChange} className={inp} />
              </Field>
              <Field label="GST No">
                <Input name="gstNo" value={formData.gstNo || ""} onChange={handleChange} className={inp} />
              </Field>
              <Field label="Shop Act No">
                <Input name="shopActNo" value={formData.shopActNo || ""} onChange={handleChange} className={inp} />
              </Field>
            </Row>

            {/* Row 5 – KYC & Area  z:10 */}
            <Row z={10}>
              <Field label="Total Area (SqFt)">
                <Input
                  name="carpetAreaSqFeet"
                  type="number"
                  min={0}
                  value={formData.carpetAreaSqFeet === 0 ? "" : formData.carpetAreaSqFeet}
                  onChange={handleChange}
                  className={`${inp} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${roomsList.length > 0 ? "bg-slate-100 text-slate-500 font-mono" : "bg-emerald-50 font-semibold text-slate-800"}`}
                />
              </Field>
              {/* Aadhaar */}
              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <div className="flex items-end gap-2">
                  <Field label="Aadhaar Card No" className="flex-1">
                    <Input name="aadhaar" value={formData.aadhaar || ""} onChange={handleChange} className={inp} />
                  </Field>
                  <button
                    type="button"
                    onClick={() => aadhaarDocRef.current?.click()}
                    className={`h-8 px-3 rounded-lg text-[10px] font-bold uppercase flex items-center gap-1 shrink-0 transition-colors ${aadhaarFile ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                  >
                    <UploadCloud className="size-3" />
                    {aadhaarFile ? "Change" : "Upload"}
                  </button>
                  <input ref={aadhaarDocRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleAadhaarDoc} />
                </div>
                {aadhaarFile && (
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 border border-emerald-200 rounded text-[9px] text-emerald-700 font-medium truncate">
                    <CheckCircle2 className="size-3 text-emerald-500 shrink-0" />
                    <span className="truncate">{aadhaarFile.name}</span>
                  </div>
                )}
              </div>

              {/* PAN */}
              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <div className="flex items-end gap-2">
                  <Field label="PAN Card No" className="flex-1">
                    <Input name="pan" value={formData.pan || ""} onChange={handleChange} className={inp} />
                  </Field>
                  <button
                    type="button"
                    onClick={() => panDocRef.current?.click()}
                    className={`h-8 px-3 rounded-lg text-[10px] font-bold uppercase flex items-center gap-1 shrink-0 transition-colors ${panFile ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                  >
                    <UploadCloud className="size-3" />
                    {panFile ? "Change" : "Upload"}
                  </button>
                  <input ref={panDocRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handlePanDoc} />
                </div>
                {panFile && (
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 border border-emerald-200 rounded text-[9px] text-emerald-700 font-medium truncate">
                    <CheckCircle2 className="size-3 text-emerald-500 shrink-0" />
                    <span className="truncate">{panFile.name}</span>
                  </div>
                )}
              </div>

              {/* 1 empty spacer to maintain 4-col feel */}
              <div className="flex-1 min-w-0" />
            </Row>

          </div>
        </div>

        {/* ════════════════════════════════════════════
            RENT INFORMATION
        ════════════════════════════════════════════ */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <SectionBar icon={<IndianRupee className="size-3.5 text-white" />} title="Rent Information" />
          <div className="p-3 space-y-2">

            <Row z={20}>
              <Field label="Lease / Rent Type">
                <Select selectSize="sm" name="rentType" value={formData.rentType || ""} onChange={handleChange}
                  options={[{ label: "Commercial Lease", value: "Commercial Lease" }, { label: "Residential Rent", value: "Residential Rent" }]} className={inp} />
              </Field>
              <Field label="Lease Start">
                <Input type="date" name="leaseStart" value={formData.leaseStart || ""} onChange={handleChange} className={inp} />
              </Field>
              <Field label="Lease End">
                <Input type="date" name="leaseEnd" value={formData.leaseEnd || ""} onChange={handleChange} className={inp} />
              </Field>
              <Field label="Duration">
                <Input name="duration" value={formData.duration || "Auto-calculated"} onChange={() => { }} readOnly className={`${inp} bg-slate-100 text-slate-500 italic`} />
              </Field>
            </Row>

            <Row z={10}>
              <Field label="Rent Frequency">
                <Select selectSize="sm" name="rentFreq" value={formData.rentFreq || ""} onChange={handleChange}
                  options={[{ label: "Monthly", value: "Monthly" }, { label: "Yearly", value: "Yearly" }]} className={inp} />
              </Field>
              <Field label="Rent Amount (₹)">
                <Input name="rentAmount" type="number" min={0} value={formData.rentAmount || ""} onChange={handleChange} className={`${inp} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`} />
              </Field>
              <Field label="Security Deposit (₹)">
                <Input name="securityDeposit" type="number" min={0} value={formData.securityDeposit || ""} onChange={handleChange} className={`${inp} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`} />
              </Field>
              <Field label="Deposit Type">
                <Select selectSize="sm" name="depositType" value={formData.depositType || ""} onChange={handleChange}
                  options={[{ label: "Refundable", value: "Refundable" }, { label: "Non-Refundable", value: "Non-Refundable" }]} className={inp} />
              </Field>
            </Row>
          </div>
        </div>

        {/* ════════════════════════════════════════════
            FLOOR QC — Read-only display of existing floor 
            configuration + calculated CV for this unit.
            (The floor is already registered; we only show 
            its config and the computed Capital Value.)
        ════════════════════════════════════════════ */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <SectionBar icon={<Building2 className="size-3.5 text-white" />} title="Floor QC — Existing Floor Configuration" />
          <div className="p-3 space-y-2">
            {/* Floor config badges — read-only from parent floor */}
            <Row z={20}>
              <Field label="Floor Name">
                <Input value={formData.floorName || "Ground Floor"} readOnly className={`${inp} bg-slate-100 text-slate-500 font-semibold cursor-not-allowed`} />
              </Field>
              <Field label="Con Year">
                <Input value={formData.conYear || "2020"} readOnly className={`${inp} bg-slate-100 text-slate-500 cursor-not-allowed`} />
              </Field>
              <Field label="Con Type">
                <Input value={getLabel(dropdownOptions?.constructionTypes || [], formData.conType) || "RCC"} readOnly className={`${inp} bg-slate-100 text-slate-500 cursor-not-allowed`} />
              </Field>
              <Field label="Type of Use">
                <Input value={getLabel(dropdownOptions?.useTypes || [], formData.useType) || "Commercial"} readOnly className={`${inp} bg-slate-100 text-slate-500 cursor-not-allowed`} />
              </Field>
            </Row>

            {/* Calculated CV highlight */}
            <Row z={10}>
              <Field label="Unit Area (SqFt)">
                <Input value={area} readOnly className={`${inp} bg-slate-100 text-slate-500 font-semibold cursor-not-allowed`} />
              </Field>
              <Field label="SDRR Rate (₹/SqM)">
                <Input value={sdrr.toLocaleString("en-IN")} readOnly className={`${inp} bg-slate-100 text-slate-500 font-semibold cursor-not-allowed`} />
              </Field>
              <Field label="Calculated Capital Value (₹)">
                <Input value={`₹ ${formattedCV}`} readOnly className={`${inp} bg-emerald-50 border-emerald-200 text-emerald-700 font-bold cursor-not-allowed`} />
              </Field>
              <div className="flex-1 min-w-0" />
            </Row>
          </div>
        </div>

        {/* ════════════════════════════════════════════
            ROOM CONFIGURATION & VALUATION SUMMARY
        ════════════════════════════════════════════ */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <SectionBar icon={<Layers className="size-3.5 text-white" />} title="Room-Wise Configuration & Valuation" />
          <div className="p-3">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div className="space-y-1">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-emerald-500" />
                  Room-Wise Valuation Active
                </h4>
                <p className="text-[10px] text-slate-500 font-medium">
                  {roomsList.length > 0
                    ? `This unit contains ${roomsList.length} configured rooms totaling ${area} SqFt. The valuation is completely determined by this layout.`
                    : "No rooms configured yet. You can build rooms for this subunit to calculate its total area and valuation dynamically."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsRoomsDrawerOpen(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-md shadow-blue-100 flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Layers className="size-3.5" />
                {roomsList.length > 0 ? "Add Room Details" : "Configure Rooms"}
              </button>
            </div>

            {roomsList.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
                <div>
                  <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">Total Rooms</span>
                  <span className="font-mono text-xs font-black text-slate-700">{roomsList.reduce((acc, r) => acc + Number(r.count || 0), 0)} Rooms</span>
                </div>
                <div>
                  <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">Carpet Area</span>
                  <span className="font-mono text-xs font-black text-emerald-700">{area} SqFt</span>
                </div>
                <div className="col-span-2 md:col-span-2">
                  <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">Room Types Added</span>
                  <span className="text-[10px] font-bold text-slate-600 truncate block">
                    {Array.from(new Set(roomsList.map(r => r.roomType))).join(", ")}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ════════════════════════════════════════════
            PHOTOS & PLANS — side by side row
        ════════════════════════════════════════════ */}
        <div className="grid grid-cols-2 gap-3">

          {/* Front Photo */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <SectionBar icon={<ImagePlus className="size-3.5 text-white" />} title="Asset Image" color="bg-slate-700" />
            <div className="p-3 flex flex-col items-center gap-2">
              <div
                onClick={() => photoRef.current?.click()}
                className="w-full h-28 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all group"
              >
                {photoPreview
                  ? <img src={photoPreview} alt="Front Photo" className="w-full h-full object-cover" />
                  : <div className="text-center text-slate-400 group-hover:text-blue-500 transition-colors select-none">
                    <UploadCloud className="size-6 mx-auto mb-1" />
                    <span className="text-[10px] font-bold uppercase">Click to upload</span>
                  </div>
                }
              </div>
              <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
              <button onClick={() => photoRef.current?.click()}
                className="w-full py-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-[10px] font-bold uppercase hover:bg-blue-100 transition-colors flex items-center justify-center gap-1.5" >
                <UploadCloud className="size-3" />
                {photoPreview ? "Change Photo" : "Add Photo"}
              </button>
            </div>
          </div>

          {/* Asset Photo Plan */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <SectionBar icon={<FileText className="size-3.5 text-white" />} title="Asset Photo Plan" color="bg-emerald-700" />
            <div className="p-3 flex flex-col items-center gap-2">
              <div
                onClick={() => planRef.current?.click()}
                className="w-full h-28 rounded-lg border-2 border-dashed border-emerald-200 bg-emerald-50 flex items-center justify-center overflow-hidden cursor-pointer hover:border-emerald-400 hover:bg-emerald-100 transition-all group"
              >
                {planPreview
                  ? <img src={planPreview} alt="Approved Plan" className="w-full h-full object-cover" />
                  : <div className="text-center text-emerald-400 group-hover:text-emerald-600 transition-colors select-none">
                    <FileText className="size-6 mx-auto mb-1" />
                    <span className="text-[10px] font-bold uppercase">Click to upload</span>
                  </div>
                }
              </div>
              <input ref={planRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handlePlanChange} />
              <button onClick={() => planRef.current?.click()}
                className="w-full py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-[10px] font-bold uppercase hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1.5">
                <UploadCloud className="size-3" />
                {planPreview ? "Change Plan" : "Add Plan"}
              </button>
            </div>
          </div>
        </div>

      </div>{/* end body */}

      {/* ── Footer ── */}
      <div className="px-4 py-2.5 bg-white border-t border-slate-200 flex justify-end gap-2.5 shrink-0">
        <button onClick={onCancel}
          className="px-5 py-1.5 border border-slate-300 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 uppercase tracking-widest transition-colors">
          Cancel
        </button>
        <button onClick={handleSaveClick}
          className="px-5 py-1.5 bg-emerald-600 rounded-lg text-xs font-bold text-white hover:bg-emerald-700 uppercase tracking-widest flex items-center gap-2 shadow-md transition-colors">
          <Save className="size-3.5" /> Save Configuration
        </button>
      </div>
      <RoomWiseSubmissionDrawer
        isOpen={isRoomsDrawerOpen}
        onClose={() => setIsRoomsDrawerOpen(false)}
        unit={{ ...formData, rooms: roomsList }}
        onSaveRooms={(updatedRooms, calculatedArea) => {
          setRoomsList(updatedRooms);
          setFormData((prev: any) => ({ ...prev, carpetAreaSqFeet: calculatedArea }));
        }}
      />
    </div>
  );
}
