"use client";

import React, { useRef, useState, useEffect } from "react";
import { X, Save, Building2, UploadCloud, FileText, IndianRupee, ImagePlus, CheckCircle2, Layers, Loader2 } from "lucide-react";
import { Input, Select, SearchSelect, Card, CardContent, CardHeader, CardTitle } from "@/components/common";
import { fetchSubUseTypesAction, fetchUploadedDocumentsAction, fetchFloorsByAsset, fetchFloorDropdownOptions, fetchSubFloorAction } from "@/app/[locale]/assets/municipal-Asset/add-New-Asset/floor-details/actions";
import { fetchDocumentFileAction } from "@/app/[locale]/assets/municipal-Asset/add-New-Asset/actions";
import { useAssetForm } from "../AssetFormContext";
import { toast } from "sonner";
import { RoomWiseSubmissionDrawer } from "./RoomWiseSubmissionDrawer";
import { useConfirm } from "@/components/common/ConfirmProvider";

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
        <span key={`sep-${i}`} className="text-slate-400 font-bold mx-0.5 select-none flex items-center justify-center text-[10px]">
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
        className="boxed-digit-input flex-1 min-w-[12px] max-w-[16px] !h-[22px] !px-0 border border-slate-300 rounded text-center text-[10px] font-black text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors bg-white"
      />
    );
    currentGroupCount++;
  }

  return (
    <div className="flex items-center gap-0.5 border border-slate-200 bg-slate-50/50 rounded-md py-0.5 px-1 w-full max-w-fit overflow-hidden">
      {showPrefix && (
        <div className="w-6 h-[22px] bg-slate-100 border border-slate-200 rounded text-center text-[8px] font-black text-slate-500 flex items-center justify-center select-none shrink-0">
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
  const { confirm } = useConfirm();
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

  // Dynamic sub floor state & effect
  const [subFloorOptions, setSubFloorOptions] = useState<any[]>([]);

  useEffect(() => {
    const floorId = Number(formData.floorId);
    if (!floorId) {
      setSubFloorOptions([]);
      return;
    }
    let ignore = false;
    async function loadSubFloors() {
      const res = await fetchSubFloorAction(floorId);
      if (!ignore && res.success && res.data) {
        setSubFloorOptions(res.data);
      }
    }
    loadSubFloors();
    return () => { ignore = true; };
  }, [formData.floorId]);


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
      subFloorId: "",
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

  // Sync local state when the unit IDENTITY changes (i.e. user opens a different unit)
  // Using unit.dbId || unit.id as the stable identity key to avoid resetting on
  // every render caused by new object literals being created in UnitPoolPanel.
  const unitId = unit?.dbId || unit?.id || unit?.unitNumber;
  const unitIdRef = React.useRef<any>(null);
  useEffect(() => {
    if (unitIdRef.current === unitId) return; // same unit — keep user's in-progress edits
    unitIdRef.current = unitId;
    setFormData({ ...unit });
    setRoomsList(Array.isArray(unit?.rooms) ? unit.rooms : []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unitId]);

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
      toast.error("Please enter a valid CSN No. without special characters.");
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

    const loadingToast = toast.loading("Saving configuration...");
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
      toast.success("Unit details updated. Remember to save the form to save all changes.", { id: loadingToast });
    } catch (err: any) {
      toast.error(err.message || "Failed to update unit details.", { id: loadingToast });
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


  const inp = "h-7 text-[11px] !px-2 !py-0.5 !rounded-md";

  const renderDepartmentSelect = () => (
    <SearchSelect
      label="Department *"
      name="departmentId"
      value={formData.departmentId || ""}
      onChange={(name, val) => {
        const matched = departments.find((d: any) => String(d.value) === String(val));
        setFormData((prev: any) => ({
          ...prev,
          departmentId: val,
          departmentName: matched ? matched.label : "",
        }));
      }}
      options={departments}
      placeholder="— Select Department —"
    />
  );

  // ── Unit type detection — drives which fields are shown ───────────────────
  const rawUnitType = ((unit.unitType || formData.unitType) as string || "Flat").toLowerCase().trim();
  const isShop = rawUnitType.includes("shop") || rawUnitType.includes("commercial");
  const isOffice = rawUnitType.includes("office") || rawUnitType.includes("corporate");
  const isRoom = rawUnitType.includes("room") || rawUnitType.includes("chamber");
  const isDepartment = rawUnitType.includes("department") || rawUnitType.includes("dept") || rawUnitType.includes("wing");
  // Flat is the default (residential)
  const sectionTitle = isShop ? "Shop & Occupant Details" : isOffice ? "Office / Tenant Details" : isRoom ? "Room Details" : isDepartment ? "Department Information" : "Resident / Owner Details";
  // Departments are internal allocations — no rent section needed
  const showRentSection = !isDepartment;


  return (
    <div className="flex flex-col h-full overflow-hidden bg-slate-50">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#1e293b] border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-blue-500/20 rounded-lg border border-blue-500/30">
            <Building2 className="size-4 text-blue-400" />
          </div>
          <div>
            <h2 className="text-sm font-black text-white tracking-wide">Add Unit Details - {formData.unitNumber || "New Unit"}</h2>
            <p className="text-[10px] text-blue-400 font-semibold tracking-widest uppercase">{parentBuildingName}</p>
          </div>
        </div>
        <button onClick={onCancel} className="px-3 py-1.5 border border-slate-500 hover:border-slate-300 hover:bg-slate-800 rounded-lg text-[10px] font-bold text-slate-300 uppercase transition-colors">
          Close
        </button>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 overflow-y-auto p-3 custom-scrollbar relative [&_input:not(.boxed-digit-input)]:!h-7 [&_input:not(.boxed-digit-input)]:!text-[11px] [&_input:not(.boxed-digit-input)]:!rounded-md [&_input:not(.boxed-digit-input)]:!px-2 [&_label]:text-[11px] [&_label]:mb-1 [&_label]:!font-bold [&_span[id$=-label]]:text-[11px] [&_span[id$=-label]]:!font-bold [&_span.text-gray-700]:!font-bold [&_button[role=combobox]]:!px-2 [&_button[role=combobox]]:!h-7 [&_button[role=combobox]]:!text-[11px] [&_button[role=combobox]]:!rounded-md [&_button[role=combobox]_span]:!text-[11px]">
        {loading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] z-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="size-8 text-blue-500 animate-spin" />
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Loading details...</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-start">
          {/* Left Column (Forms) */}
          <div className="lg:col-span-4 space-y-3">

            {/* ════════════════════════════════════════════
            TYPE-AWARE BASIC INFORMATION
            Fields change based on unit type:
            Flat → KYC fields  |  Shop → GST/ShopAct
            Office → Company   |  Department → Staff
        ════════════════════════════════════════════ */}
            <Card variant="bordered" padding="sm" className="shadow-sm border-slate-200/80 bg-white rounded-2xl">
              <CardHeader className="flex items-center gap-2 bg-gradient-to-r from-[#C8E1FC] via-[#DBEAFF] to-[#EDF5FF] border border-[#A3CBFA] rounded-xl py-1 px-2.5 mb-2.5 shadow-sm">
                <div className="bg-[#1d4ed8] p-1 rounded-lg text-white shadow-sm flex items-center justify-center shrink-0">
                  <FileText className="size-3.5 text-white" />
                </div>
                <CardTitle className="text-xs font-bold text-[#1d4ed8] uppercase tracking-widest">{sectionTitle}</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-2 items-start">
                {/* Always visible: type badge */}
                <Input label="Type" name="unitType" value={formData.unitType || ""} readOnly
                  className={`${inp} bg-slate-100 text-slate-500 cursor-not-allowed`} />
                <Input label="Building" value={parentBuildingName} readOnly
                  className={`${inp} bg-slate-100 text-slate-500 cursor-not-allowed`} />
                {renderDepartmentSelect()}
                <Input label="Property No" name="propertyNo" value={formData.propertyNo || ""} onChange={handleChange} className={inp} />
                <Input label="CSN No." name="surveyNo" value={formData.surveyNo || ""} onChange={handleChange} className={inp} />

                {/* 6th input depending on type */}
                {!isShop && !isOffice && !isRoom && !isDepartment && (
                  <Input label={`Owner / Resident Name${formData.rentType ? " *" : ""}`} name="renterName" value={formData.renterName || ""} onChange={handleChange} className={inp} placeholder="Full name" />
                )}
                {isShop && (
                  <Input label="Shop Name" name="unitName" value={formData.unitName || ""} onChange={handleChange} className={inp} placeholder="e.g. Sharma Grocery" />
                )}
                {isOffice && (
                  <Input label="Office / Unit Name" name="unitName" value={formData.unitName || ""} onChange={handleChange} className={inp} placeholder="e.g. North Wing Office" />
                )}
                {isRoom && (
                  <Input label="Room Type" name="roomTypeDesc" value={formData.roomTypeDesc || ""} onChange={handleChange} className={inp} placeholder="e.g. Conference Room" />
                )}
                {isDepartment && (
                  <Input label="Department Name" name="unitName" value={formData.unitName || ""} onChange={handleChange} className={inp} placeholder="e.g. Finance Department" />
                )}

                {/* ── FLAT fields ─────────────────────────────────────── */}
                {!isShop && !isOffice && !isRoom && !isDepartment && (<>
                  <Input label="Email ID" name="emailId" value={formData.emailId || ""} onChange={handleChange} className={inp} placeholder="Optional" />
                  <div className="flex flex-col">
                    <span className="block text-[11px] font-medium text-gray-700 mb-1 truncate">Mobile No</span>
                    <CustomBoxedInput
                      value={formData.mobileNo || ""}
                      onChange={(val) => setFormData((prev: any) => ({ ...prev, mobileNo: val }))}
                      length={10}
                      type="numeric"
                      showPrefix="+91"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="block text-[11px] font-medium text-gray-700 mb-1 truncate">Aadhaar Card No</span>
                    <CustomBoxedInput
                      value={formData.aadhaar || ""}
                      onChange={(val) => setFormData((prev: any) => ({ ...prev, aadhaar: val }))}
                      length={12}
                      type="numeric"
                      groupSizes={[4, 4, 4]}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="block text-[11px] font-medium text-gray-700 mb-1 truncate">PAN Card No</span>
                    <CustomBoxedInput
                      value={formData.pan || ""}
                      onChange={(val) => setFormData((prev: any) => ({ ...prev, pan: val }))}
                      length={10}
                      type="alphanumeric"
                    />
                  </div>
                </>)}

                {/* ── SHOP fields ─────────────────────────────────────── */}
                {isShop && (<>
                  <Input label={`Shopkeeper / Renter Name${formData.rentType ? " *" : ""}`} name="renterName" value={formData.renterName || ""} onChange={handleChange} className={inp} />
                  <Input label="Email ID" name="emailId" value={formData.emailId || ""} onChange={handleChange} className={inp} placeholder="Optional" />
                  <Input label="GST No" name="gstNo" value={formData.gstNo || ""} onChange={handleChange} className={inp} placeholder="15-char GSTIN" />
                  <Input label="Shop Act No" name="shopActNo" value={formData.shopActNo || ""} onChange={handleChange} className={inp} />
                  <div className="flex flex-col">
                    <span className="block text-[11px] font-medium text-gray-700 mb-1 truncate">Mobile No</span>
                    <CustomBoxedInput
                      value={formData.mobileNo || ""}
                      onChange={(val) => setFormData((prev: any) => ({ ...prev, mobileNo: val }))}
                      length={10}
                      type="numeric"
                      showPrefix="+91"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="block text-[11px] font-medium text-gray-700 mb-1 truncate">Aadhaar Card No</span>
                    <CustomBoxedInput
                      value={formData.aadhaar || ""}
                      onChange={(val) => setFormData((prev: any) => ({ ...prev, aadhaar: val }))}
                      length={12}
                      type="numeric"
                      groupSizes={[4, 4, 4]}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="block text-[11px] font-medium text-gray-700 mb-1 truncate">PAN Card No</span>
                    <CustomBoxedInput
                      value={formData.pan || ""}
                      onChange={(val) => setFormData((prev: any) => ({ ...prev, pan: val }))}
                      length={10}
                      type="alphanumeric"
                    />
                  </div>
                </>)}

                {/* ── OFFICE fields ────────────────────────────────────── */}
                {isOffice && (<>
                  <Input label={`Company / Tenant Name${formData.rentType ? " *" : ""}`} name="renterName" value={formData.renterName || ""} onChange={handleChange} className={inp} placeholder="Company name" />
                  <Input label="Email ID" name="emailId" value={formData.emailId || ""} onChange={handleChange} className={inp} placeholder="Optional" />
                  <Input label="GST No" name="gstNo" value={formData.gstNo || ""} onChange={handleChange} className={inp} placeholder="15-char GSTIN" />
                  <Input label="Shop Act No" name="shopActNo" value={formData.shopActNo || ""} onChange={handleChange} className={inp} />
                  <div className="flex flex-col">
                    <span className="block text-[11px] font-medium text-gray-700 mb-1 truncate">Mobile No</span>
                    <CustomBoxedInput
                      value={formData.mobileNo || ""}
                      onChange={(val) => setFormData((prev: any) => ({ ...prev, mobileNo: val }))}
                      length={10}
                      type="numeric"
                      showPrefix="+91"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="block text-[11px] font-medium text-gray-700 mb-1 truncate">Aadhaar Card No</span>
                    <CustomBoxedInput
                      value={formData.aadhaar || ""}
                      onChange={(val) => setFormData((prev: any) => ({ ...prev, aadhaar: val }))}
                      length={12}
                      type="numeric"
                      groupSizes={[4, 4, 4]}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="block text-[11px] font-medium text-gray-700 mb-1 truncate">PAN Card No</span>
                    <CustomBoxedInput
                      value={formData.pan || ""}
                      onChange={(val) => setFormData((prev: any) => ({ ...prev, pan: val }))}
                      length={10}
                      type="alphanumeric"
                    />
                  </div>
                </>)}

                {/* ── ROOM fields ──────────────────────────────────────── */}
                {isRoom && (<>
                  <Input label={`Occupant Name${formData.rentType ? " *" : ""}`} name="renterName" value={formData.renterName || ""} onChange={handleChange} className={inp} placeholder="Who uses this room" />
                  <Input label="Email ID" name="emailId" value={formData.emailId || ""} onChange={handleChange} className={inp} placeholder="Optional" />
                  <Input label="Usage / Purpose" name="propertyDescription" value={formData.propertyDescription || ""} onChange={handleChange} className={inp} placeholder="e.g. Storage, Meeting" />
                  <Input label="GST No" name="gstNo" value={formData.gstNo || ""} onChange={handleChange} className={inp} placeholder="15-char GSTIN" />
                  <Input label="Shop Act No" name="shopActNo" value={formData.shopActNo || ""} onChange={handleChange} className={inp} />
                  <div className="flex flex-col">
                    <span className="block text-[11px] font-medium text-gray-700 mb-1 truncate">Mobile No</span>
                    <CustomBoxedInput
                      value={formData.mobileNo || ""}
                      onChange={(val) => setFormData((prev: any) => ({ ...prev, mobileNo: val }))}
                      length={10}
                      type="numeric"
                      showPrefix="+91"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="block text-[11px] font-medium text-gray-700 mb-1 truncate">Aadhaar Card No</span>
                    <CustomBoxedInput
                      value={formData.aadhaar || ""}
                      onChange={(val) => setFormData((prev: any) => ({ ...prev, aadhaar: val }))}
                      length={12}
                      type="numeric"
                      groupSizes={[4, 4, 4]}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="block text-[11px] font-medium text-gray-700 mb-1 truncate">PAN Card No</span>
                    <CustomBoxedInput
                      value={formData.pan || ""}
                      onChange={(val) => setFormData((prev: any) => ({ ...prev, pan: val }))}
                      length={10}
                      type="alphanumeric"
                    />
                  </div>
                </>)}

                {/* ── DEPARTMENT fields ────────────────────────────────── */}
                {isDepartment && (<>
                  <Input label="Department Head / In-Charge" name="renterName" value={formData.renterName || ""} onChange={handleChange} className={inp} placeholder="Officer name" />
                  <Input label="Email ID" name="emailId" value={formData.emailId || ""} onChange={handleChange} className={inp} placeholder="Optional" />
                  <Input label="No. of Staff" name="noOfStaff" type="number" onFocus={selectOnFocus} min={0} value={formData.noOfStaff || ""} onChange={handleChange} className={inp} placeholder="Head count" />
                  <Input label="Remarks" name="propertyDescription" value={formData.propertyDescription || ""} onChange={handleChange} className={inp} placeholder="Optional notes" />
                  <Input label="GST No" name="gstNo" value={formData.gstNo || ""} onChange={handleChange} className={inp} placeholder="15-char GSTIN" />
                  <Input label="Shop Act No" name="shopActNo" value={formData.shopActNo || ""} onChange={handleChange} className={inp} />
                  <div className="flex flex-col">
                    <span className="block text-[11px] font-medium text-gray-700 mb-1 truncate">Mobile No</span>
                    <CustomBoxedInput
                      value={formData.mobileNo || ""}
                      onChange={(val) => setFormData((prev: any) => ({ ...prev, mobileNo: val }))}
                      length={10}
                      type="numeric"
                      showPrefix="+91"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="block text-[11px] font-medium text-gray-700 mb-1 truncate">Aadhaar Card No</span>
                    <CustomBoxedInput
                      value={formData.aadhaar || ""}
                      onChange={(val) => setFormData((prev: any) => ({ ...prev, aadhaar: val }))}
                      length={12}
                      type="numeric"
                      groupSizes={[4, 4, 4]}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="block text-[11px] font-medium text-gray-700 mb-1 truncate">PAN Card No</span>
                    <CustomBoxedInput
                      value={formData.pan || ""}
                      onChange={(val) => setFormData((prev: any) => ({ ...prev, pan: val }))}
                      length={10}
                      type="alphanumeric"
                    />
                  </div>
                </>)}

              </CardContent>
            </Card>





            {/* Departments are internal allocations — they don't pay rent */}
            {showRentSection && (
              <Card variant="bordered" padding="sm" className="shadow-sm border-slate-200/80 bg-white rounded-2xl">
                <CardHeader className="flex items-center gap-2 bg-gradient-to-r from-[#C8E1FC] via-[#DBEAFF] to-[#EDF5FF] border border-[#A3CBFA] rounded-xl py-1 px-2.5 mb-2.5 shadow-sm">
                  <div className="bg-[#1d4ed8] p-1 rounded-lg text-white shadow-sm flex items-center justify-center shrink-0">
                    <IndianRupee className="size-3.5 text-white" />
                  </div>
                  <CardTitle className="text-xs font-bold text-[#1d4ed8] uppercase tracking-widest">Rent Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-2 items-start">
                  <SearchSelect
                    label="Lease / Rent Type"
                    name="rentType"
                    value={formData.rentType || ""}
                    onChange={(name, val) => setFormData((prev: any) => ({ ...prev, rentType: val }))}
                    options={[
                      { label: "Commercial Lease", value: "Commercial Lease" },
                      { label: "Residential Rent", value: "Residential Rent" }
                    ]}
                    placeholder="Select..."
                  />
                  <Input
                    label={`Lease Start${formData.rentType ? " *" : ""}`}
                    type="date"
                    name="leaseStart"
                    value={formData.leaseStart || ""}
                    onChange={handleChange}
                    className={inp}
                  />
                  <Input
                    label={`Lease End${formData.rentType ? " *" : ""}`}
                    type="date"
                    name="leaseEnd"
                    value={formData.leaseEnd || ""}
                    onChange={handleChange}
                    className={inp}
                  />
                  <Input
                    label="Duration"
                    name="duration"
                    value={formData.duration || "Auto-calculated"}
                    readOnly
                    className={`${inp} bg-slate-100 text-slate-500 italic`}
                  />
                  <SearchSelect
                    label="Rent Frequency"
                    name="rentFreq"
                    value={formData.rentFreq || ""}
                    onChange={(name, val) => setFormData((prev: any) => ({ ...prev, rentFreq: val }))}
                    options={[
                      { label: "Monthly", value: "Monthly" },
                      { label: "Yearly", value: "Yearly" }
                    ]}
                    placeholder="Select..."
                  />
                  <Input
                    label={`Rent Amount (₹)${formData.rentType ? " *" : ""}`}
                    name="rentAmount"
                    type="number"
                    onFocus={selectOnFocus}
                    min={0}
                    value={formData.rentAmount || ""}
                    onChange={handleChange}
                    className={`${inp} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                  />
                  <Input
                    label="Security Deposit (₹)"
                    name="securityDeposit"
                    type="number"
                    onFocus={selectOnFocus}
                    min={0}
                    value={formData.securityDeposit || ""}
                    onChange={handleChange}
                    className={`${inp} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                  />
                  <SearchSelect
                    label="Deposit Type"
                    name="depositType"
                    value={formData.depositType || ""}
                    onChange={(name, val) => setFormData((prev: any) => ({ ...prev, depositType: val }))}
                    options={[
                      { label: "Refundable", value: "Refundable" },
                      { label: "Non-Refundable", value: "Non-Refundable" }
                    ]}
                    placeholder="Select..."
                  />
                </CardContent>
              </Card>
            )}

            {/* ════════════════════════════════════════════
            FLOOR & CONSTRUCTION DETAILS
            User selects floor and enters construction
            details for this specific sub-unit.
            Capital Value is auto-calculated from area.
        ════════════════════════════════════════════ */}
            <Card variant="bordered" padding="sm" className="shadow-sm border-slate-200/80 bg-white rounded-2xl">
              <CardHeader className="flex items-center gap-2 bg-gradient-to-r from-[#C8E1FC] via-[#DBEAFF] to-[#EDF5FF] border border-[#A3CBFA] rounded-xl py-1 px-2.5 mb-2.5 shadow-sm">
                <div className="bg-[#1d4ed8] p-1 rounded-lg text-white shadow-sm flex items-center justify-center shrink-0">
                  <Building2 className="size-3.5 text-white" />
                </div>
                <CardTitle className="text-xs font-bold text-[#1d4ed8] uppercase tracking-widest">Floor & Construction Details</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-2 items-start">
                {floorSelectOptions.length > 1 ? (
                  <SearchSelect
                    label="Assign to Floor *"
                    value={formData.floorId ? String(formData.floorId) : ""}
                    onChange={(name, val) => {
                      const event = {
                        target: { value: val }
                      } as React.ChangeEvent<HTMLSelectElement>;
                      handleFloorSelect(event);
                    }}
                    options={floorSelectOptions.slice(1)}
                    placeholder="— Select Floor —"
                  />
                ) : (
                  <div className="flex flex-col">
                    <span className="block text-[11px] font-medium text-gray-700 mb-1 truncate">Assign to Floor *</span>
                    <div className={`${inp} flex items-center px-2 rounded-lg border border-amber-200 bg-amber-50 text-amber-700 text-[10px] font-semibold`}>
                      No floors available in master data.
                    </div>
                  </div>
                )}
                 <SearchSelect
                  label="Sub Floor"
                  name="subFloorId"
                  value={formData.subFloorId ? String(formData.subFloorId) : ""}
                  onChange={(name, val) => setFormData((p: any) => ({ ...p, subFloorId: val }))}
                  options={(subFloorOptions || []).map((o: any) => ({ label: o.label, value: String(o.value) }))}
                  placeholder="— Select Sub Floor —"
                />
                <Input
                  label="Construction Year *"
                  name="conYear"
                  value={formData.conYear || ""}
                  onChange={handleChange}
                  placeholder={`e.g. ${new Date().getFullYear()}`}
                  maxLength={4}
                  className={inp}
                />
                <SearchSelect
                  label="Construction Type *"
                  name="conType"
                  value={formData.conType || ""}
                  onChange={(name, val) => setFormData((p: any) => ({ ...p, conType: val }))}
                  options={(dropdownOptions?.constructionTypes || []).map((o: any) => ({ label: o.label, value: String(o.value) }))}
                  placeholder="Select Con Type…"
                />
                <SearchSelect
                  label="Type of Use *"
                  name="useType"
                  value={formData.useType || ""}
                  onChange={(name, val) => setFormData((p: any) => ({ ...p, useType: val, subUseType: "" }))}
                  options={(dropdownOptions?.useTypes || []).map((o: any) => ({ label: o.label, value: String(o.value) }))}
                  placeholder="Select Use Type…"
                />
                <SearchSelect
                  label="Sub-Type of Use"
                  name="subUseType"
                  value={formData.subUseType || ""}
                  onChange={(name, val) => setFormData((p: any) => ({ ...p, subUseType: val }))}
                  options={(dynamicSubUseTypes.length > 0 ? dynamicSubUseTypes : (dropdownOptions?.subUseTypes || []).filter((o: any) => String(o.typeOfUseId) === String(formData.useType))).map((o: any) => ({ label: o.label, value: String(o.value) }))}
                  placeholder="Select Sub-Type…"
                />
                <Input
                  label="Unit Area (SqFt) — from rooms *"
                  value={area}
                  readOnly
                  className={`${inp} bg-slate-50 text-slate-600 font-mono font-semibold cursor-default`}
                />
              </CardContent>
            </Card>

            {/* ════════════════════════════════════════════
            ROOM CONFIGURATION & VALUATION SUMMARY
        ════════════════════════════════════════════ */}
            <Card variant="bordered" padding="sm" className="shadow-sm border-slate-200/80 bg-white rounded-2xl">
              <CardHeader className="flex items-center gap-2 bg-gradient-to-r from-[#C8E1FC] via-[#DBEAFF] to-[#EDF5FF] border border-[#A3CBFA] rounded-xl py-1 px-2.5 mb-2.5 shadow-sm">
                <div className="bg-[#1d4ed8] p-1 rounded-lg text-white shadow-sm flex items-center justify-center shrink-0">
                  <Layers className="size-3.5 text-white" />
                </div>
                <CardTitle className="text-xs font-bold text-[#1d4ed8] uppercase tracking-widest">Room-Wise Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-end">
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
                  <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
                    <div>
                      <span className="block text-[10px] font-black text-slate-700 uppercase tracking-wider mb-1">Total Rooms</span>
                      <span className="font-mono text-xs font-black text-slate-700">{roomsList.reduce((acc, r) => acc + Number(r.count || 0), 0)} Rooms</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-black text-slate-700 uppercase tracking-wider mb-1">Carpet Area</span>
                      <span className="font-mono text-xs font-black text-emerald-700">
                        {Number(area).toFixed(2)} SqFt ({(Number(area) / 10.7639).toFixed(2)} m²)
                      </span>
                    </div>
                    <div className="col-span-2 md:col-span-2">
                      <span className="block text-[10px] font-black text-slate-700 uppercase tracking-wider mb-1">Room Types Added</span>
                      <span className="text-[10px] font-bold text-slate-600 truncate block">
                        {Array.from(new Set(roomsList.map(r => r.roomType))).join(", ")}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

          </div> {/* end Left Column */}

          {/* Right Column (Media) */}
          <div className="lg:col-span-1 space-y-3">
            <Card variant="bordered" className="bg-white border-slate-200/80 rounded-2xl shadow-sm p-3 space-y-3.5" padding="none">
              {/* Asset Image */}
              <div className="space-y-2">
                <span className="inline-block text-[10px] font-black text-blue-700 bg-blue-50 border border-blue-100 px-2 py-1 rounded-md uppercase tracking-widest shadow-sm">Asset Image</span>
                <div
                  onClick={() => !photoPreview && photoRef.current?.click()}
                  className={`relative h-64 rounded-xl border flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all group ${photoPreview ? 'border-slate-200' : 'border-slate-200 bg-[#e2ebf5]/30 hover:bg-[#e2ebf5]/60 hover:border-slate-300 shadow-sm'}`}
                >
                  {photoPreview ? (
                    <>
                      <img src={photoPreview} alt="Asset Image" className="w-full h-full object-cover" />
                      {/* Top right action buttons (always visible when image exists) */}
                      <div className="absolute top-2 right-2 flex items-center gap-1.5 z-20">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            photoRef.current?.click();
                          }}
                          className="px-2.5 py-1 bg-white hover:bg-slate-50 text-blue-600 rounded-full shadow-md transition-colors flex items-center justify-center text-[9px] font-black uppercase tracking-wider"
                          title="Replace Image"
                        >
                          Replace
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            confirm({
                              variant: "delete",
                              title: "Delete Image",
                              description: "Are you sure you want to delete this image?",
                              onConfirm: () => {
                                setPhotoPreview(null);
                                setPhotoFile(null);
                                if (photoRef.current) photoRef.current.value = "";
                              }
                            });
                          }}
                          className="px-2.5 py-1 bg-white hover:bg-red-50 text-red-600 rounded-full shadow-md transition-colors flex items-center justify-center text-[9px] font-black uppercase tracking-wider"
                          title="Delete Image"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400 select-none p-4">
                      <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-full text-blue-500 mb-2 group-hover:scale-110 transition-transform">
                        <UploadCloud className="size-5" />
                      </div>
                      <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Upload Asset Image</span>
                      <span className="text-[8px] text-slate-400 font-bold uppercase tracking-tight mt-1 text-center">Click to browse file</span>
                    </div>
                  )}

                  {/* Badge */}
                  {photoPreview && (
                    <div className="absolute top-2.5 left-2.5 bg-[#4c8bf5] text-white text-[9px] font-black px-2 py-0.5 rounded-full tracking-wider shadow-sm select-none z-10">
                      +1 More
                    </div>
                  )}
                </div>
              </div>
              <input ref={photoRef} type="file" accept=".bmp,.doc,.docx,.gif,.jpeg,.jpg,.pdf,.png,.ppt,.pptx,.tif,.tiff,.txt,.webp,.xls,.xlsx" className="hidden" onChange={handlePhotoChange} />

              {/* Photo Plan */}
              <div className="space-y-2">
                <span className="inline-block text-[10px] font-black text-blue-700 bg-blue-50 border border-blue-100 px-2 py-1 rounded-md uppercase tracking-widest shadow-sm">Asset Photo Plan</span>
                <div
                  onClick={() => !planPreview && planRef.current?.click()}
                  className={`relative h-64 rounded-xl border flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all group ${planPreview ? 'border-slate-200' : 'border-slate-200 bg-[#e2ebf5]/30 hover:bg-[#e2ebf5]/60 hover:border-slate-300 shadow-sm'}`}
                >
                  {planPreview ? (
                    <>
                      <img src={planPreview} alt="Photo Plan" className="w-full h-full object-cover" />
                      {/* Top right action buttons (always visible when image exists) */}
                      <div className="absolute top-2 right-2 flex items-center gap-1.5 z-20">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            planRef.current?.click();
                          }}
                          className="px-2.5 py-1 bg-white hover:bg-slate-50 text-blue-600 rounded-full shadow-md transition-colors flex items-center justify-center text-[9px] font-black uppercase tracking-wider"
                          title="Replace Image"
                        >
                          Replace
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            confirm({
                              variant: "delete",
                              title: "Delete Photo Plan",
                              description: "Are you sure you want to delete this photo plan?",
                              onConfirm: () => {
                                setPlanPreview(null);
                                setPlanFile(null);
                                if (planRef.current) planRef.current.value = "";
                              }
                            });
                          }}
                          className="px-2.5 py-1 bg-white hover:bg-red-50 text-red-600 rounded-full shadow-md transition-colors flex items-center justify-center text-[9px] font-black uppercase tracking-wider"
                          title="Delete Image"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400 select-none p-4">
                      <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-full text-blue-500 mb-2 group-hover:scale-110 transition-transform">
                        <UploadCloud className="size-5" />
                      </div>
                      <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Upload Asset Photo Plan</span>
                      <span className="text-[8px] text-slate-400 font-bold uppercase tracking-tight mt-1 text-center">Click to browse file</span>
                    </div>
                  )}
                </div>
              </div>
              <input ref={planRef} type="file" accept=".bmp,.doc,.docx,.gif,.jpeg,.jpg,.pdf,.png,.ppt,.pptx,.tif,.tiff,.txt,.webp,.xls,.xlsx" className="hidden" onChange={handlePlanChange} />
            </Card>
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





