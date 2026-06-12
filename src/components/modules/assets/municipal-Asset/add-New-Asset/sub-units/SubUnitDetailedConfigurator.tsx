"use client";

import React, { useRef, useState, useEffect } from "react";
import { X, Save, Building2, UploadCloud, FileText, IndianRupee, ImagePlus, CheckCircle2, Layers, Loader2 } from "lucide-react";
import { Input, Select } from "@/components/common";
import { fetchSubUseTypesAction, fetchUploadedDocumentsAction, fetchFloorsByAsset, fetchFloorDropdownOptions } from "@/app/[locale]/assets/municipal-Asset/add-New-Asset/floor-details/actions";
import { fetchDocumentFileAction } from "@/app/[locale]/assets/municipal-Asset/add-New-Asset/actions";
import { useAssetForm } from "../AssetFormContext";
import { toast } from "sonner";
import { RoomWiseSubmissionDrawer } from "./RoomWiseSubmissionDrawer";

interface CustomDigitInputProps {
  value: string;
  onChange: (val: string) => void;
  length: number;
  type?: "numeric" | "alphanumeric";
  groupSizes?: number[];
  showPrefix?: string;
}

function CustomBoxedInput({ value = "", onChange, length, type = "numeric", groupSizes, showPrefix }: CustomDigitInputProps) {
  const inputsRef = React.useRef<(HTMLInputElement | null)[]>([]);
  const charArray = value.split("").slice(0, length);
  while (charArray.length < length) {
    charArray.push("");
  }

  const handleCharChange = (index: number, val: string) => {
    let char = val;
    if (type === "numeric") {
      char = val.replace(/\D/g, "");
    } else {
      char = val.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    }

    const newChars = [...charArray];
    newChars[index] = char.slice(-1);
    const newVal = newChars.join("").trim();
    onChange(newVal);

    if (char && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !charArray[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    let sanitized = type === "numeric" ? pastedData.replace(/\D/g, "") : pastedData.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    sanitized = sanitized.slice(0, length);
    onChange(sanitized);
    const focusIndex = Math.min(sanitized.length, length - 1);
    inputsRef.current[focusIndex]?.focus();
  };

  const boxes: React.ReactNode[] = [];
  let currentGroupIndex = 0;
  let currentGroupCount = 0;

  for (let i = 0; i < length; i++) {
    if (groupSizes && currentGroupCount === groupSizes[currentGroupIndex] && i < length) {
      boxes.push(
        <span key={`sep-${i}`} className="text-slate-400 font-bold mx-0.5 select-none flex items-center justify-center">
          -
        </span>
      );
      currentGroupIndex++;
      currentGroupCount = 0;
    }

    boxes.push(
      <input
        key={i}
        ref={(el) => { inputsRef.current[i] = el; }}
        type="text"
        maxLength={1}
        value={charArray[i]}
        onChange={(e) => handleCharChange(i, e.target.value)}
        onKeyDown={(e) => handleKeyDown(i, e)}
        onPaste={handlePaste}
        className="w-[21px] h-7 border border-slate-300 rounded text-center text-xs font-black text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors bg-white shrink-0"
      />
    );
    currentGroupCount++;
  }

  return (
    <div className="flex items-center gap-0.5 border border-slate-200 bg-slate-50/50 rounded-xl p-1 w-fit max-w-full overflow-hidden">
      {showPrefix && (
        <div className="w-7 h-7 bg-slate-100 border border-slate-200 rounded text-center text-[9px] font-black text-slate-500 flex items-center justify-center select-none shrink-0">
          {showPrefix}
        </div>
      )}
      {boxes}
    </div>
  );
}


interface SubUnitDetailedConfiguratorProps {
  unit: any;
  parentBuildingName: string;
  onSave: (updatedUnit: any) => void;
  onCancel: () => void;
  // Floors and dropdown options are now passed from the parent instead of fetched inside
  floors?: any[];
  dropdownOptions?: any;
  departments?: { label: string; value: string }[];
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

export function SubUnitDetailedConfigurator({
  unit,
  parentBuildingName,
  onSave,
  onCancel,
  floors: propFloors = [],
  dropdownOptions: propDropdownOptions = null,
}: SubUnitDetailedConfiguratorProps) {

  const { formData: globalFormData, subunitFiles } = useAssetForm();
  const assetId = unit.id || unit.dbId;
  const staged = subunitFiles?.[assetId];

  const [formData, setFormData] = useState<any>({ ...unit });
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    staged?.photoFile ? URL.createObjectURL(staged.photoFile) : null
  );
  const [planPreview, setPlanPreview] = useState<string | null>(
    staged?.planFile ? URL.createObjectURL(staged.planFile) : null
  );
  const [photoFile, setPhotoFile] = useState<File | null>(staged?.photoFile || unit.photoFile || null);
  const [planFile, setPlanFile] = useState<File | null>(staged?.planFile || unit.planFile || null);
  const photoRef = useRef<HTMLInputElement>(null);
  const planRef = useRef<HTMLInputElement>(null);

  // Room Wise Submission states
  const [roomsList, setRoomsList] = useState<any[]>(unit.rooms || []);
  const [isRoomsDrawerOpen, setIsRoomsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Floors and dropdown options states
  const [parentFloors, setParentFloors] = useState<any[]>(() => {
    if (propFloors && propFloors.length > 0) return propFloors;
    if (globalFormData?.floors && globalFormData.floors.length > 0) return globalFormData.floors;
    return [];
  });
  const [dropdownOptions, setDropdownOptions] = useState<any>(propDropdownOptions || null);

  useEffect(() => {
    if (propFloors && propFloors.length > 0) {
      setParentFloors(propFloors);
    } else if (globalFormData?.floors && globalFormData.floors.length > 0) {
      setParentFloors(globalFormData.floors);
    }
  }, [propFloors, globalFormData?.floors]);

  useEffect(() => {
    if (propDropdownOptions) {
      setDropdownOptions(propDropdownOptions);
    }
  }, [propDropdownOptions]);

  useEffect(() => {
    let ignore = false;
    async function loadMasterData() {
      const parentAssetIdVal = unit.parentAssetId || globalFormData.parentBuildingId || globalFormData.id || globalFormData.assetId;
      const parsedParentId = Number(parentAssetIdVal);

      const needsFloors = parentFloors.length === 0 && parsedParentId && parsedParentId > 0;
      const needsDropdowns = !dropdownOptions;

      if (!needsFloors && !needsDropdowns) return;

      setLoading(true);
      try {
        let floorsData = parentFloors;
        let dropdownsData = dropdownOptions;

        const promises: Promise<any>[] = [];

        if (needsFloors) {
          promises.push(
            fetchFloorsByAsset(parsedParentId).then((res) => {
              if (res.success && Array.isArray(res.data)) {
                floorsData = res.data;
              }
            })
          );
        }

        if (needsDropdowns) {
          promises.push(
            fetchFloorDropdownOptions().then((res) => {
              if (res.success && res.data) {
                const data = res.data as any;
                dropdownsData = data.dropdownOptions || data;
              }
            })
          );
        }

        await Promise.all(promises);

        if (!ignore) {
          if (needsFloors) setParentFloors(floorsData);
          if (needsDropdowns) setDropdownOptions(dropdownsData);
        }
      } catch (err) {
        console.error("Failed to load master data for sub-unit configurator:", err);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadMasterData();
    return () => { ignore = true; };
  }, [unit.parentAssetId, globalFormData.parentBuildingId, globalFormData.id, globalFormData.assetId, parentFloors.length, dropdownOptions]);

  const departments = dropdownOptions?.departments || [];

  // Dynamic sub-use types state & effect
  const [dynamicSubUseTypes, setDynamicSubUseTypes] = useState<any[]>([]);

  useEffect(() => {
    const typeId = Number(formData.useType);
    if (!typeId) {
      setDynamicSubUseTypes([]);
      return;
    }
    let ignore = false;
    async function load() {
      const res = await fetchSubUseTypesAction(typeId);
      if (!ignore && res.success && res.data) {
        setDynamicSubUseTypes(res.data);
      }
    }
    load();
    return () => { ignore = true; };
  }, [formData.useType]);


  const getLabel = (opts: { label: string; value: string }[], val: string | number) => {
    if (!opts) return String(val);
    return opts.find((o) => o.value === String(val))?.label || String(val);
  };

  // When user selects a floor, we don't necessarily have all factors (unless it's in parentFloors).
  // But we allow manual entry anyway.
  const handleFloorSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const floorId = Number(e.target.value);
    const selected = parentFloors.find((f: any) => {
      const fLevelId = f.floorId || f.floor;
      if (!fLevelId) return false;
      // Numeric check
      if (Number(fLevelId) === floorId || Number(f.id) === floorId) return true;
      // String label matching (e.g. "Ground" matches "Ground Floor" which has value = 1)
      const match = (dropdownOptions?.floorLevels || []).find((l: any) => String(l.value) === String(floorId));
      if (match && typeof fLevelId === "string") {
        return match.label.toLowerCase().includes(fLevelId.toLowerCase()) || fLevelId.toLowerCase().includes(match.label.toLowerCase());
      }
      return false;
    });

    const floorLabel = selected
      ? `${getLabel(dropdownOptions?.floorLevels || [], selected.floorId || selected.floor)}`
      : getLabel(dropdownOptions?.floorLevels || [], floorId);

    setFormData((prev: any) => ({
      ...prev,
      floorId,
      floorDetailsId: selected?.id || floorId,
      floorName: floorLabel,
      // Pre-fill construction values from selected floor but user can override
      conYear: prev.conYear || selected?.constructionYear || selected?.conYear || "",
      conType: prev.conType || selected?.constructionTypeId || selected?.conType || "",
      useType: prev.useType || selected?.typeOfUseId || selected?.useType || "",
      subUseType: prev.subUseType || selected?.subTypeOfUseId || selected?.subUseType || "",
      sdrr: selected?.baseValue || prev.sdrr || 100000,
      floorFactor: selected?.cvFloorFactor || selected?.floorFactor || prev.floorFactor || 1.0,
      ageFactor: selected?.cvAgeFactor || selected?.ageFactor || prev.ageFactor || 1.0,
    }));
  };

  // Build floor options for dropdown from master data
  const floorSelectOptions = [
    { label: "— Select Floor —", value: "" },
    ...(dropdownOptions?.floorLevels || []).map((f: any) => ({
      label: f.label,
      value: String(f.value),
    })),
  ];

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
    setFormData({ ...unit });
    setRoomsList(unit.rooms || []);
  }, [unit]);

  useEffect(() => {
    async function loadSubUnitDocuments() {
      const assetId = unit.id || unit.dbId;
      if (!assetId || assetId === 0 || String(assetId).startsWith("temp_")) return;
      setLoading(true);
      try {
        const docsRes = await fetchUploadedDocumentsAction(assetId, true, true);
        if (docsRes.success && Array.isArray(docsRes.data)) {
          const photoDoc = docsRes.data.find((d: any) =>
            (d.documentType || d.documentCode || "").toLowerCase().includes("front_photo") ||
            (d.fileName || "").toLowerCase().includes("front_")
          );
          if (photoDoc && !staged?.photoFile) {
            const fileRes = await fetchDocumentFileAction(photoDoc.id);
            if (fileRes.success && fileRes.data) {
              setPhotoPreview(`data:${fileRes.mimeType};base64,${fileRes.data}`);
            }
          }

          const planDoc = docsRes.data.find((d: any) =>
            (d.documentType || d.documentCode || "").toLowerCase().includes("building_plan") ||
            (d.fileName || "").toLowerCase().includes("plan_")
          );
          if (planDoc && !staged?.planFile) {
            const fileRes = await fetchDocumentFileAction(planDoc.id);
            if (fileRes.success && fileRes.data) {
              setPlanPreview(`data:${fileRes.mimeType};base64,${fileRes.data}`);
            }
          }
        }
      } catch (docErr) {
        console.error("Failed to load subunit documents", docErr);
      } finally {
        setLoading(false);
      }
    }
    loadSubUnitDocuments();
  }, [unit.id, unit.dbId, staged]);

  // Select all text when user focuses a number field — lets them immediately type a replacement value
  const selectOnFocus = (e: React.FocusEvent<HTMLInputElement>) => e.target.select();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev: any) => {
      let val = value;
      if (typeof val === "string") {
        if (val.startsWith(" ")) {
          val = val.trimStart();
        }
        // Allow alphanumeric, space, hyphen, and underscore. Exclude email, date, and number fields.
        if (type !== "email" && type !== "date" && type !== "number" && name !== "emailId") {
          val = val.replace(/[^a-zA-Z0-9\s\-_]/g, "");
        }
      }

      const lowerName = name.toLowerCase();

      if (lowerName.includes("mobileno")) {
        val = val.replace(/\D/g, "").slice(0, 10);
      } else if (lowerName.includes("rentamount") || lowerName.includes("securitydeposit") || lowerName.includes("carpetareasqfeet")) {
        val = val.replace(/-/g, "");
      } else if (lowerName.includes("name") || lowerName.includes("owner") || lowerName.includes("person") || lowerName.includes("contact")) {
        val = val.replace(/[^a-zA-Z\s.]/g, "");
      } else if (lowerName.includes("email")) {
        val = val.replace(/\s/g, "");
      } else if (lowerName.includes("address") || lowerName.includes("location") || lowerName.includes("details")) {
        val = val.replace(/[^a-zA-Z0-9\s,./#\-()]/g, "");
      } else if (lowerName.includes("lat") || lowerName.includes("lng")) {
        val = val.replace(/[^0-9.\-]/g, "");
      } else if (typeof val === "string" && !lowerName.includes("date") && !lowerName.includes("type") && !lowerName.includes("freq")) {
        // Enforce user request: allow no special characters except - and _ (and space)
        val = val.replace(/[^a-zA-Z0-9\s\-_]/g, "");
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
      toast.error("Total Area (SqFt) must be greater than 0. Please configure rooms first to calculate the area.");
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
      if (!formData.mobileNo || !formData.mobileNo.trim()) {
        toast.error("Mobile Number is required when Lease/Rent Type is selected.");
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

    const loadingToast = toast.loading("Saving configuration locally...");
    try {
      // Create local payload and just pass it to onSave. DB saving will be done in batch via pool's Save All.
      onSave({
        ...formData,
        rooms: roomsList,
        carpetAreaSqFeet: area,
        capitalValue: Number(formData.capitalValue || 0),
        departmentId: formData.departmentId ? Number(formData.departmentId) : null,
        departmentName: formData.departmentName || null,
        locationAddress: formData.locationAddress || null,
        locationLat: formData.locationLat || null,
        locationLng: formData.locationLng || null,
        photoFile,
        planFile,
      });
      toast.success("Configuration saved locally. Click 'Save All Units' to commit.", { id: loadingToast });
    } catch (err: any) {
      toast.error(err.message || "Failed to save configuration locally.", { id: loadingToast });
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedExtensions = ['.bmp', '.doc', '.docx', '.gif', '.jpeg', '.jpg', '.pdf', '.png', '.ppt', '.pptx', '.tif', '.tiff', '.txt', '.webp', '.xls', '.xlsx'];
      const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      if (!allowedExtensions.includes(fileExt)) {
        toast.error(`Invalid file type. Allowed extensions: ${allowedExtensions.join(', ')}`);
        e.target.value = "";
        return;
      }
      setPhotoPreview(URL.createObjectURL(file));
      setPhotoFile(file);
    }
  };

  const handlePlanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedExtensions = ['.bmp', '.doc', '.docx', '.gif', '.jpeg', '.jpg', '.pdf', '.png', '.ppt', '.pptx', '.tif', '.tiff', '.txt', '.webp', '.xls', '.xlsx'];
      const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      if (!allowedExtensions.includes(fileExt)) {
        toast.error(`Invalid file type. Allowed extensions: ${allowedExtensions.join(', ')}`);
        e.target.value = "";
        return;
      }
      setPlanPreview(URL.createObjectURL(file));
      setPlanFile(file);
    }
  };



  // Carpet area in SqFt — from new shape-based rooms (netAreaSqFt), minus deductions
  const area = roomsList.length > 0
    ? roomsList.reduce((acc, r) => {
        const netAreaSqFt = r.netAreaSqFt !== undefined
          ? Number(r.netAreaSqFt)
          : (r.netAreaSqM !== undefined
              ? Number(r.netAreaSqM) * 10.7639
              : Number(r.areaSqFt || r.area || 0));
        const roomSqFt = netAreaSqFt * Number(r.count || 1);
        if (r.minus === "Yes" || r.offset === "Yes") return acc - roomSqFt;
        if (r.outer === "Yes") return acc + roomSqFt * 0.8;
        return acc + roomSqFt;
      }, 0)
    : (Number(formData.carpetAreaSqFeet) || 0);


  const inp = "h-8 text-xs";

  const renderDepartmentSelect = () => (
    <select
      name="departmentId"
      value={formData.departmentId || ""}
      onChange={(e) => {
        const selectedName = e.target.options[e.target.selectedIndex].text;
        setFormData((prev: any) => ({
          ...prev,
          departmentId: e.target.value,
          departmentName: e.target.value ? selectedName : "",
        }));
      }}
      className={`${inp} w-full rounded-lg border border-slate-300 bg-white px-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-200`}
    >
      <option value="">— Select Department —</option>
      {departments.map((d: any) => (
        <option key={d.value} value={d.value}>{d.label}</option>
      ))}
    </select>
  );

  // ── Unit type detection — drives which fields are shown ───────────────────
  const rawUnitType = ((unit.unitType || formData.unitType) as string || "Flat").toLowerCase().trim();
  const isShop = rawUnitType.includes("shop") || rawUnitType.includes("commercial");
  const isOffice = rawUnitType.includes("office") || rawUnitType.includes("corporate");
  const isRoom = rawUnitType.includes("room") || rawUnitType.includes("chamber");
  const isDepartment = rawUnitType.includes("department") || rawUnitType.includes("dept") || rawUnitType.includes("wing");
  // Flat is the default (residential)
  const sectionColor = "bg-cyan-600";
  const sectionTitle = isShop ? "Shop & Occupant Details" : isOffice ? "Office / Tenant Details" : isRoom ? "Room Details" : isDepartment ? "Department Information" : "Resident / Owner Details";
  // Departments are internal allocations — no rent section needed
  const showRentSection = !isDepartment;


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
      <div className="flex-1 overflow-y-auto p-3 custom-scrollbar relative">
        {loading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] z-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="size-8 text-blue-500 animate-spin" />
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Loading details...</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
          {/* Left Column (Forms) */}
          <div className="lg:col-span-3 space-y-3">

            {/* ════════════════════════════════════════════
            TYPE-AWARE BASIC INFORMATION
            Fields change based on unit type:
            Flat → KYC fields  |  Shop → GST/ShopAct
            Office → Company   |  Department → Staff
        ════════════════════════════════════════════ */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
              <SectionBar icon={<FileText className="size-3.5 text-white" />} title={sectionTitle} color={sectionColor} />
              <div className="p-3 space-y-2">

                {/* Row 0 — always visible: unit number + type badge */}
                <Row z={60}>
                  <Field label="Asset No.">
                    <Input name="unitNumber" value={formData.unitNumber || formData.subAssetId || ""} readOnly
                      className={`${inp} font-bold text-slate-500 bg-slate-100 cursor-not-allowed`} />
                  </Field>
                  <Field label="Type">
                    <Input name="unitType" value={formData.unitType || ""} readOnly
                      className={`${inp} bg-slate-100 text-slate-500 cursor-not-allowed`} />
                  </Field>
                  <Field label="Building">
                    <Input value={parentBuildingName} readOnly
                      className={`${inp} bg-slate-100 text-slate-500 cursor-not-allowed`} />
                  </Field>
                  <Field label="Department *">
                    {renderDepartmentSelect()}
                  </Field>
                </Row>

                {/* ── FLAT fields ─────────────────────────────────────── */}
                {!isShop && !isOffice && !isRoom && !isDepartment && (<>
                  <Row z={50}>
                    <Field label="Property No">
                      <Input name="propertyNo" value={formData.propertyNo || ""} onChange={handleChange} className={inp} />
                    </Field>
                    <Field label="Survey No">
                      <Input name="surveyNo" value={formData.surveyNo || ""} onChange={handleChange} className={inp} />
                    </Field>
                    <Field label={`Owner / Resident Name${formData.rentType ? " *" : ""}`}>
                      <Input name="renterName" value={formData.renterName || ""} onChange={handleChange} className={inp} placeholder="Full name" />
                    </Field>
                    <Field label="Mobile No">
                      <CustomBoxedInput
                        value={formData.mobileNo || ""}
                        onChange={(val) => setFormData((prev: any) => ({ ...prev, mobileNo: val }))}
                        length={10}
                        type="numeric"
                        showPrefix="+91"
                      />
                    </Field>
                  </Row>
                  <Row z={40}>
                    <Field label="Email ID">
                      <Input name="emailId" value={formData.emailId || ""} onChange={handleChange} className={inp} placeholder="Optional" />
                    </Field>
                    <Field label="Aadhaar Card No">
                      <CustomBoxedInput
                        value={formData.aadhaar || ""}
                        onChange={(val) => setFormData((prev: any) => ({ ...prev, aadhaar: val }))}
                        length={12}
                        type="numeric"
                        groupSizes={[4, 4, 4]}
                      />
                    </Field>
                    <Field label="PAN Card No">
                      <CustomBoxedInput
                        value={formData.pan || ""}
                        onChange={(val) => setFormData((prev: any) => ({ ...prev, pan: val }))}
                        length={10}
                        type="alphanumeric"
                      />
                    </Field>
                    <div className="flex-1 min-w-0" />
                  </Row>
                </>)}

                {/* ── SHOP fields ─────────────────────────────────────── */}
                {isShop && (<>
                  <Row z={50}>
                    <Field label="Property No">
                      <Input name="propertyNo" value={formData.propertyNo || ""} onChange={handleChange} className={inp} />
                    </Field>
                    <Field label="Survey No">
                      <Input name="surveyNo" value={formData.surveyNo || ""} onChange={handleChange} className={inp} />
                    </Field>
                    <Field label="Shop Name">
                      <Input name="unitName" value={formData.unitName || ""} onChange={handleChange} className={inp} placeholder="e.g. Sharma Grocery" />
                    </Field>
                    <Field label={`Shopkeeper / Renter Name${formData.rentType ? " *" : ""}`}>
                      <Input name="renterName" value={formData.renterName || ""} onChange={handleChange} className={inp} />
                    </Field>
                  </Row>
                  <Row z={40}>
                    <Field label="Mobile No">
                      <CustomBoxedInput
                        value={formData.mobileNo || ""}
                        onChange={(val) => setFormData((prev: any) => ({ ...prev, mobileNo: val }))}
                        length={10}
                        type="numeric"
                        showPrefix="+91"
                      />
                    </Field>
                    <Field label="Email ID">
                      <Input name="emailId" value={formData.emailId || ""} onChange={handleChange} className={inp} />
                    </Field>
                    <Field label="GST No">
                      <Input name="gstNo" value={formData.gstNo || ""} onChange={handleChange} className={inp} placeholder="15-char GSTIN" />
                    </Field>
                    <Field label="Shop Act No">
                      <Input name="shopActNo" value={formData.shopActNo || ""} onChange={handleChange} className={inp} />
                    </Field>
                  </Row>
                  <Row z={30}>
                    <Field label="Aadhaar Card No">
                      <CustomBoxedInput
                        value={formData.aadhaar || ""}
                        onChange={(val) => setFormData((prev: any) => ({ ...prev, aadhaar: val }))}
                        length={12}
                        type="numeric"
                        groupSizes={[4, 4, 4]}
                      />
                    </Field>
                    <Field label="PAN Card No">
                      <CustomBoxedInput
                        value={formData.pan || ""}
                        onChange={(val) => setFormData((prev: any) => ({ ...prev, pan: val }))}
                        length={10}
                        type="alphanumeric"
                      />
                    </Field>
                    <div className="flex-1 min-w-0" />
                    <div className="flex-1 min-w-0" />
                  </Row>
                </>)}

                {/* ── OFFICE fields ────────────────────────────────────── */}
                {isOffice && (<>
                  <Row z={50}>
                    <Field label="Property No">
                      <Input name="propertyNo" value={formData.propertyNo || ""} onChange={handleChange} className={inp} />
                    </Field>
                    <Field label="Survey No">
                      <Input name="surveyNo" value={formData.surveyNo || ""} onChange={handleChange} className={inp} />
                    </Field>
                    <Field label="Office / Unit Name">
                      <Input name="unitName" value={formData.unitName || ""} onChange={handleChange} className={inp} placeholder="e.g. North Wing Office" />
                    </Field>
                    <Field label={`Company / Tenant Name${formData.rentType ? " *" : ""}`}>
                      <Input name="renterName" value={formData.renterName || ""} onChange={handleChange} className={inp} placeholder="Company name" />
                    </Field>
                  </Row>
                  <Row z={40}>
                    <Field label="Mobile No">
                      <CustomBoxedInput
                        value={formData.mobileNo || ""}
                        onChange={(val) => setFormData((prev: any) => ({ ...prev, mobileNo: val }))}
                        length={10}
                        type="numeric"
                        showPrefix="+91"
                      />
                    </Field>
                    <Field label="Email ID">
                      <Input name="emailId" value={formData.emailId || ""} onChange={handleChange} className={inp} />
                    </Field>
                    <Field label="GST No">
                      <Input name="gstNo" value={formData.gstNo || ""} onChange={handleChange} className={inp} placeholder="15-char GSTIN" />
                    </Field>
                    <Field label="Shop Act No">
                      <Input name="shopActNo" value={formData.shopActNo || ""} onChange={handleChange} className={inp} />
                    </Field>
                  </Row>
                  <Row z={30}>
                    <Field label="Aadhaar Card No">
                      <CustomBoxedInput
                        value={formData.aadhaar || ""}
                        onChange={(val) => setFormData((prev: any) => ({ ...prev, aadhaar: val }))}
                        length={12}
                        type="numeric"
                        groupSizes={[4, 4, 4]}
                      />
                    </Field>
                    <Field label="PAN Card No">
                      <CustomBoxedInput
                        value={formData.pan || ""}
                        onChange={(val) => setFormData((prev: any) => ({ ...prev, pan: val }))}
                        length={10}
                        type="alphanumeric"
                      />
                    </Field>
                    <div className="flex-1 min-w-0" />
                    <div className="flex-1 min-w-0" />
                  </Row>
                </>)}

                {/* ── ROOM fields ──────────────────────────────────────── */}
                {isRoom && (<>
                  <Row z={50}>
                    <Field label="Property No">
                      <Input name="propertyNo" value={formData.propertyNo || ""} onChange={handleChange} className={inp} />
                    </Field>
                    <Field label="Survey No">
                      <Input name="surveyNo" value={formData.surveyNo || ""} onChange={handleChange} className={inp} />
                    </Field>
                    <Field label="Room Type">
                      <Input name="roomTypeDesc" value={formData.roomTypeDesc || ""} onChange={handleChange} className={inp} placeholder="e.g. Conference Room" />
                    </Field>
                    <Field label={`Occupant Name${formData.rentType ? " *" : ""}`}>
                      <Input name="renterName" value={formData.renterName || ""} onChange={handleChange} className={inp} placeholder="Who uses this room" />
                    </Field>
                  </Row>
                  <Row z={40}>
                    <Field label="Mobile No">
                      <CustomBoxedInput
                        value={formData.mobileNo || ""}
                        onChange={(val) => setFormData((prev: any) => ({ ...prev, mobileNo: val }))}
                        length={10}
                        type="numeric"
                        showPrefix="+91"
                      />
                    </Field>
                    <Field label="Email ID">
                      <Input name="emailId" value={formData.emailId || ""} onChange={handleChange} className={inp} />
                    </Field>
                    <Field label="Usage / Purpose">
                      <Input name="propertyDescription" value={formData.propertyDescription || ""} onChange={handleChange} className={inp} placeholder="e.g. Storage, Meeting" />
                    </Field>
                    <div className="flex-1 min-w-0" />
                  </Row>
                  <Row z={30}>
                    <Field label="Aadhaar Card No">
                      <CustomBoxedInput
                        value={formData.aadhaar || ""}
                        onChange={(val) => setFormData((prev: any) => ({ ...prev, aadhaar: val }))}
                        length={12}
                        type="numeric"
                        groupSizes={[4, 4, 4]}
                      />
                    </Field>
                    <Field label="PAN Card No">
                      <CustomBoxedInput
                        value={formData.pan || ""}
                        onChange={(val) => setFormData((prev: any) => ({ ...prev, pan: val }))}
                        length={10}
                        type="alphanumeric"
                      />
                    </Field>
                    <Field label="GST No">
                      <Input name="gstNo" value={formData.gstNo || ""} onChange={handleChange} className={inp} placeholder="15-char GSTIN" />
                    </Field>
                    <Field label="Shop Act No">
                      <Input name="shopActNo" value={formData.shopActNo || ""} onChange={handleChange} className={inp} />
                    </Field>
                  </Row>
                </>)}

                {/* ── DEPARTMENT fields ────────────────────────────────── */}
                {isDepartment && (<>
                  <Row z={50}>
                    <Field label="Property No">
                      <Input name="propertyNo" value={formData.propertyNo || ""} onChange={handleChange} className={inp} />
                    </Field>
                    <Field label="Survey No">
                      <Input name="surveyNo" value={formData.surveyNo || ""} onChange={handleChange} className={inp} />
                    </Field>
                    <Field label="Department Name">
                      <Input name="unitName" value={formData.unitName || ""} onChange={handleChange} className={inp} placeholder="e.g. Finance Department" />
                    </Field>
                    <Field label="Department Head / In-Charge">
                      <Input name="renterName" value={formData.renterName || ""} onChange={handleChange} className={inp} placeholder="Officer name" />
                    </Field>
                  </Row>
                  <Row z={40}>
                    <Field label="Mobile No">
                      <CustomBoxedInput
                        value={formData.mobileNo || ""}
                        onChange={(val) => setFormData((prev: any) => ({ ...prev, mobileNo: val }))}
                        length={10}
                        type="numeric"
                        showPrefix="+91"
                      />
                    </Field>
                    <Field label="Email ID">
                      <Input name="emailId" value={formData.emailId || ""} onChange={handleChange} className={inp} />
                    </Field>
                    <Field label="No. of Staff">
                      <Input name="noOfStaff" type="number" onFocus={selectOnFocus} min={0} value={formData.noOfStaff || ""} onChange={handleChange} className={inp} placeholder="Head count" />
                    </Field>
                    <Field label="Remarks">
                      <Input name="propertyDescription" value={formData.propertyDescription || ""} onChange={handleChange} className={inp} placeholder="Optional notes" />
                    </Field>
                  </Row>
                  <Row z={30}>
                    <Field label="Aadhaar Card No">
                      <CustomBoxedInput
                        value={formData.aadhaar || ""}
                        onChange={(val) => setFormData((prev: any) => ({ ...prev, aadhaar: val }))}
                        length={12}
                        type="numeric"
                        groupSizes={[4, 4, 4]}
                      />
                    </Field>
                    <Field label="PAN Card No">
                      <CustomBoxedInput
                        value={formData.pan || ""}
                        onChange={(val) => setFormData((prev: any) => ({ ...prev, pan: val }))}
                        length={10}
                        type="alphanumeric"
                      />
                    </Field>
                    <Field label="GST No">
                      <Input name="gstNo" value={formData.gstNo || ""} onChange={handleChange} className={inp} placeholder="15-char GSTIN" />
                    </Field>
                    <Field label="Shop Act No">
                      <Input name="shopActNo" value={formData.shopActNo || ""} onChange={handleChange} className={inp} />
                    </Field>
                  </Row>
                </>)}

              </div>
            </div>





            {/* Departments are internal allocations — they don't pay rent */}
            {showRentSection && <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
              <SectionBar icon={<IndianRupee className="size-3.5 text-white" />} title="Rent Information" color="bg-cyan-600" />
              <div className="p-3 space-y-2">

                <Row z={20}>
                  <Field label="Lease / Rent Type">
                    <Select selectSize="sm" name="rentType" value={formData.rentType || ""} onChange={handleChange}
                      options={[{ label: "Commercial Lease", value: "Commercial Lease" }, { label: "Residential Rent", value: "Residential Rent" }]} className={inp} />
                  </Field>
                  <Field label={`Lease Start${formData.rentType ? " *" : ""}`}>
                    <Input type="date" name="leaseStart" value={formData.leaseStart || ""} onChange={handleChange} className={inp} />
                  </Field>
                  <Field label={`Lease End${formData.rentType ? " *" : ""}`}>
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
                  <Field label={`Rent Amount (₹)${formData.rentType ? " *" : ""}`}>
                    <Input name="rentAmount" type="number" onFocus={selectOnFocus} min={0} value={formData.rentAmount || ""} onChange={handleChange} className={`${inp} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`} />
                  </Field>
                  <Field label="Security Deposit (₹)">
                    <Input name="securityDeposit" type="number" onFocus={selectOnFocus} min={0} value={formData.securityDeposit || ""} onChange={handleChange} className={`${inp} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`} />
                  </Field>
                  <Field label="Deposit Type">
                    <Select selectSize="sm" name="depositType" value={formData.depositType || ""} onChange={handleChange}
                      options={[{ label: "Refundable", value: "Refundable" }, { label: "Non-Refundable", value: "Non-Refundable" }]} className={inp} />
                  </Field>
                </Row>
              </div>
            </div>}

            {/* ════════════════════════════════════════════
            FLOOR & CONSTRUCTION DETAILS
            User selects floor and enters construction
            details for this specific sub-unit.
            Capital Value is auto-calculated from area.
        ════════════════════════════════════════════ */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
              <SectionBar icon={<Building2 className="size-3.5 text-white" />} title="Floor & Construction Details" color="bg-cyan-600" />
              <div className="p-3 space-y-2">

                {/* Row 1: Floor selection + Con Year + Con Type */}
                <Row z={30}>
                  <Field label="Assign to Floor *">
                    {floorSelectOptions.length > 1 ? (
                      <select
                        value={formData.floorId ? String(formData.floorId) : ""}
                        onChange={handleFloorSelect}
                        className={`${inp} w-full rounded-lg border border-slate-300 bg-white px-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200`}
                      >
                        {floorSelectOptions.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    ) : (
                      <div className={`${inp} flex items-center px-2 rounded-lg border border-amber-200 bg-amber-50 text-amber-700 text-[10px] font-semibold`}>
                        No floors available in master data.
                      </div>
                    )}
                  </Field>
                  <Field label="Construction Year *">
                    <Input
                      name="conYear"
                      value={formData.conYear || ""}
                      onChange={handleChange}
                      placeholder={`e.g. ${new Date().getFullYear()}`}
                      maxLength={4}
                      className={inp}
                    />
                  </Field>
                  <Field label="Construction Type *">
                    <select
                      name="conType"
                      value={formData.conType || ""}
                      onChange={(e) => setFormData((p: any) => ({ ...p, conType: e.target.value }))}
                      className={`${inp} w-full rounded-lg border border-slate-300 bg-white px-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200`}
                    >
                      <option value="">Select Con Type…</option>
                      {(dropdownOptions?.constructionTypes || []).map((o: any) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Type of Use *">
                    <select
                      name="useType"
                      value={formData.useType || ""}
                      onChange={(e) => setFormData((p: any) => ({ ...p, useType: e.target.value, subUseType: "" }))}
                      className={`${inp} w-full rounded-lg border border-slate-300 bg-white px-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200`}
                    >
                      <option value="">Select Use Type…</option>
                      {(dropdownOptions?.useTypes || []).map((o: any) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </Field>
                </Row>

                {/* Row 2: Sub-Type + Area */}
                <Row z={20}>
                  <Field label="Sub-Type of Use">
                    <select
                      name="subUseType"
                      value={formData.subUseType || ""}
                      onChange={(e) => setFormData((p: any) => ({ ...p, subUseType: e.target.value }))}
                      className={`${inp} w-full rounded-lg border border-slate-300 bg-white px-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200`}
                    >
                      <option value="">Select Sub-Type…</option>
                      {(dynamicSubUseTypes.length > 0 ? dynamicSubUseTypes : (dropdownOptions?.subUseTypes || []).filter((o: any) => String(o.typeOfUseId) === String(formData.useType)))
                        .map((o: any) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                    </select>
                  </Field>
                  <Field label="Unit Area (SqFt) — from rooms *">
                    <Input
                      value={area}
                      readOnly
                      className={`${inp} bg-slate-50 text-slate-600 font-mono font-semibold cursor-default`}
                    />
                  </Field>
                </Row>
              </div>
            </div>

            {/* ════════════════════════════════════════════
            ROOM CONFIGURATION & VALUATION SUMMARY
        ════════════════════════════════════════════ */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <SectionBar icon={<Layers className="size-3.5 text-white" />} title="Room-Wise Configuration & Valuation" color="bg-cyan-600" />
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
                    Add Rooms
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

          </div> {/* end Left Column */}

          {/* Right Column (Media) */}
          <div className="lg:col-span-1 space-y-3">
            {/* Front Photo */}
            <div className="bg-blue-50/50 rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
              <div className="py-2 px-3 border-b border-blue-100/60 bg-blue-50 flex flex-row items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <ImagePlus className="size-3.5 text-blue-600" />
                  <span className="text-[10px] font-black text-blue-900 uppercase tracking-wider">Asset Image</span>
                </div>
              </div>
              <div className="p-2.5 flex flex-col items-center gap-2">
                <div
                  onClick={() => photoRef.current?.click()}
                  className="w-full h-24 rounded-xl border border-dashed border-blue-200 bg-white hover:bg-blue-50 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-colors"
                >
                  {photoPreview ? (
                    <img src={photoPreview} alt="Front Photo" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center text-slate-400 select-none">
                      <UploadCloud className="size-5 text-blue-300 mb-0.5 mx-auto" />
                      <span className="text-[9px] font-bold text-blue-600">Click to upload</span>
                    </div>
                  )}
                </div>
                <input ref={photoRef} type="file" accept=".bmp,.doc,.docx,.gif,.jpeg,.jpg,.pdf,.png,.ppt,.pptx,.tif,.tiff,.txt,.webp,.xls,.xlsx" className="hidden" onChange={handlePhotoChange} />
                <button
                  type="button"
                  onClick={() => photoRef.current?.click()}
                  className="mt-1.5 w-full h-6 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center justify-center gap-1 text-[9px] font-bold transition-colors"
                >
                  <UploadCloud className="size-3" />
                  {photoPreview ? "Change Photo" : "Add Photo"}
                </button>
              </div>
            </div>

            {/* Asset Photo Plan */}
            <div className="bg-amber-50/50 rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
              <div className="py-2 px-3 border-b border-amber-100/60 bg-amber-50 flex flex-row items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <FileText className="size-3.5 text-amber-600" />
                  <span className="text-[10px] font-black text-amber-900 uppercase tracking-wider">Asset Photo Plan</span>
                </div>
              </div>
              <div className="p-2.5 flex flex-col items-center gap-2">
                <div
                  onClick={() => planRef.current?.click()}
                  className="w-full h-24 rounded-xl border border-dashed border-amber-200 bg-white hover:bg-amber-50 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-colors"
                >
                  {planPreview ? (
                    <img src={planPreview} alt="Approved Plan" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center text-slate-400 select-none">
                      <UploadCloud className="size-5 text-amber-300 mb-0.5 mx-auto" />
                      <span className="text-[9px] font-bold text-amber-600">Click to upload</span>
                    </div>
                  )}
                </div>
                <input ref={planRef} type="file" accept=".bmp,.doc,.docx,.gif,.jpeg,.jpg,.pdf,.png,.ppt,.pptx,.tif,.tiff,.txt,.webp,.xls,.xlsx" className="hidden" onChange={handlePlanChange} />
                <button
                  type="button"
                  onClick={() => planRef.current?.click()}
                  className="mt-2 w-full py-1.5 px-3 bg-white border border-amber-200 text-[10px] font-bold text-amber-700 rounded-lg hover:bg-amber-50 transition-colors flex items-center justify-center gap-1"
                >
                  <UploadCloud className="size-3" />
                  {planPreview ? "Change Plan" : "Upload Plan"}
                </button>
              </div>
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
          <Save className="size-3.5" /> Save Unit
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
