"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Layers } from "lucide-react";
import { useAssetForm } from "../AssetFormContext";
import { Input, Select, Button, SearchSelect } from "@/components/common";
import { saveFloorDetail, updateFloorDetail, deleteFloorDetail, fetchSubFloorAction, fetchSubUseTypesAction } from "@/app/[locale]/assets/municipal-Asset/add-New-Asset/floor-details/actions";
import { RoomWiseSubmissionDrawer } from "../sub-units/RoomWiseSubmissionDrawer";
import { RenterDetailsDrawer } from "./RenterDetailsDrawer";
import { toast } from "sonner";
import { useConfirm } from "@/components/common/ConfirmProvider";
import { useTranslations } from "next-intl";

interface DirectRoomRegistrationPanelProps {
  dropdownOptions: any;
  initialFloors?: any[];
}

export function DirectRoomRegistrationPanel({ dropdownOptions, initialFloors = [] }: DirectRoomRegistrationPanelProps) {
  const { formData } = useAssetForm();
  const { confirm } = useConfirm();
  const t = useTranslations("addAssetForm");

  const getLocalizedError = (err?: string) => {
    if (!err) return "";
    if (err === "A record with the same details already exists.") {
      try {
        return t("floorDetails.floorAlreadyExistsMsg") || "Floor details already exist.";
      } catch (e) {
        return "Floor details already exist.";
      }
    }
    if (err === "SubTypeOfUseId must be greater than 0") {
      try {
        return t("floorDetails.subTypeOfUseRequiredMsg") || "Sub Type of Use must be selected";
      } catch (e) {
        return "Sub Type of Use must be selected";
      }
    }
    return err;
  };

  // Local state for floors saved to the DB
  const [savedFloors, setSavedFloors] = useState<any[]>(initialFloors);

  useEffect(() => {
    if (initialFloors && initialFloors.length > 0) {
      setSavedFloors(initialFloors);
    }
  }, [initialFloors]);

  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [selectedFloorForView, setSelectedFloorForView] = useState<any>(null);

  // Inline form state
  const [subFloorOptions, setSubFloorOptions] = useState<any[]>([]);
  const [subUseTypeOptions, setSubUseTypeOptions] = useState<any[]>([]);
  const [formState, setFormState] = useState<any>({
    isTaxable: true,
    floor: "",
    subFloor: "",
    conYear: "",
    conType: "",
    useType: "",
    subUseType: "",
    isRenter: false,
    rooms: 0,
    carpetAreaSqFt: 0,
    builtUpAreaSqFt: 0,
    renterNameEnglish: "",
    renterNameLocal: "",
    agreementDate: "",
    agreementFromDate: "",
    agreementToDate: "",
    rentMonthly: "",
    rentYearly: "",
    taxLiability: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // RoomWiseSubmissionDrawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [roomData, setRoomData] = useState<any[]>([]);

  // RenterDetailsDrawer state
  const [isRenterDrawerOpen, setIsRenterDrawerOpen] = useState(false);

  // Refresh saved floors when mounted
  useEffect(() => {
    // Ideally, we fetch from a load endpoint, but we'll assume it's loaded in formData or we rely on parent
    if (formData.id) {
      // For now, we keep it simple since we only build the UI
      // A fetch function could be called here to populate savedFloors from DB
    }
  }, [formData.id]);

  useEffect(() => {
    if (formState.floor) {
      fetchSubFloorAction(Number(formState.floor)).then(res => {
        if (res.success) setSubFloorOptions(res.data || []);
      });
    } else {
      setSubFloorOptions([]);
    }
  }, [formState.floor]);

  useEffect(() => {
    if (formState.useType) {
      fetchSubUseTypesAction(Number(formState.useType)).then(res => {
        if (res.success) setSubUseTypeOptions(res.data || []);
      });
    } else {
      setSubUseTypeOptions([]);
    }
  }, [formState.useType]);



  const handleAddFloor = async () => {
    if (!roomData || roomData.length === 0) {
      toast.error(t("floorDetails.roomRequiredMsg") || "Please add at least one room before adding the floor");
      return;
    }
    if (!formState.floor) {
      toast.error(t("floorDetails.floorRequiredMsg") || "Please select Floor");
      return;
    }
    if (!formState.conYear) {
      toast.error(t("floorDetails.conYrRequiredMsg") || "Please enter Construction Year");
      return;
    }
    if (!formState.conType) {
      toast.error(t("floorDetails.conTypeRequiredMsg") || "Please select Construction Type");
      return;
    }
    if (!formState.useType) {
      toast.error(t("floorDetails.useTypeRequiredMsg") || "Please select Type of Use");
      return;
    }
    if (!formState.subUseType) {
      toast.error(t("floorDetails.subTypeOfUseRequiredMsg") || "Please select Sub Type of Use");
      return;
    }

    setIsLoading(true);
    try {
      const roomDetails = roomData.length > 0
        ? roomData.map((r: any) => {
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
            offsets: Array.isArray(r.offsets)
              ? r.offsets.map((off: any) => ({
                shape: off.shape || "Rectangle",
                length: off.length ? Number(off.length) : null,
                width: off.width ? Number(off.width) : null,
                height: off.height ? Number(off.height) : null,
                base1: off.base1 ? Number(off.base1) : null,
                base2: off.base2 ? Number(off.base2) : null,
                areaSqM: off.areaSqM ? Number(off.areaSqM) : null,
                op: off.op || "Subtract",
              }))
              : []
          };
        })
        : null;

      const payload: any = {
        assetId: formData.id || 0,
        floorId: Number(formState.floor),
        subFloorId: formState.subFloor ? Number(formState.subFloor) : null,
        constructionYear: formState.conYear,
        assessmentYear: "2026",
        constructionTypeId: Number(formState.conType),
        typeOfUseId: Number(formState.useType),
        subTypeOfUseId: formState.subUseType ? Number(formState.subUseType) : 0,
        carpetAreaSqFeet: formState.carpetAreaSqFt || 0,
        carpetAreaSqMeter: (formState.carpetAreaSqFt || 0) / 10.7639,
        builtUpAreaSqFeet: formState.builtUpAreaSqFt || 0,
        builtUpAreaSqMeter: (formState.builtUpAreaSqFt || 0) / 10.7639,
        noOfRooms: formState.rooms || 0,
        isRented: formState.isRenter,
        isActive: true,
        roomDetails,
        renterNameEnglish: formState.isRenter ? (formState.renterNameEnglish || null) : null,
        renterNameLocal: formState.isRenter ? (formState.renterNameLocal || null) : null,
        agreementDate: formState.isRenter ? (formState.agreementDate || null) : null,
        agreementFromDate: formState.isRenter ? (formState.agreementFromDate || null) : null,
        agreementToDate: formState.isRenter ? (formState.agreementToDate || null) : null,
        rentMonthly: formState.isRenter ? (formState.rentMonthly ? Number(formState.rentMonthly) : null) : null,
        rentYearly: formState.isRenter ? (formState.rentYearly ? Number(formState.rentYearly) : null) : null,
        taxLiability: formState.isRenter ? (formState.taxLiability || null) : null,
      };

      if (editingId) {
        const res = await updateFloorDetail(editingId, payload);
        if (res.success && res.data) {
          const subFloorLabel = subFloorOptions.find(o => o.value === String(payload.subFloorId))?.label;
          const subUseTypeLabel = subUseTypeOptions.find(o => o.value === String(payload.subTypeOfUseId))?.label;

          const enrichedData = {
            ...res.data,
            floorId: res.data.floorId || payload.floorId,
            constructionTypeId: res.data.constructionTypeId || payload.constructionTypeId,
            typeOfUseId: res.data.typeOfUseId || payload.typeOfUseId,
            subFloorId: res.data.subFloorId || payload.subFloorId,
            subTypeOfUseId: res.data.subTypeOfUseId || payload.subTypeOfUseId,
            constructionYear: res.data.constructionYear || payload.constructionYear,
            noOfRooms: res.data.noOfRooms || payload.noOfRooms,
            carpetAreaSqFeet: res.data.carpetAreaSqFeet || payload.carpetAreaSqFeet,
            builtUpAreaSqFeet: res.data.builtUpAreaSqFeet || payload.builtUpAreaSqFeet,
            isRented: res.data.isRented !== undefined ? res.data.isRented : payload.isRented,
            subFloorName: subFloorLabel || (res.data as any).subFloorName,
            subTypeOfUseName: subUseTypeLabel || (res.data as any).subTypeOfUseName,
            roomDetails: (res.data as any).roomDetails || roomDetails || [],
            renterNameEnglish: res.data.renterNameEnglish !== undefined ? res.data.renterNameEnglish : payload.renterNameEnglish,
            renterNameLocal: res.data.renterNameLocal !== undefined ? res.data.renterNameLocal : payload.renterNameLocal,
            agreementDate: res.data.agreementDate !== undefined ? res.data.agreementDate : payload.agreementDate,
            agreementFromDate: res.data.agreementFromDate !== undefined ? res.data.agreementFromDate : payload.agreementFromDate,
            agreementToDate: res.data.agreementToDate !== undefined ? res.data.agreementToDate : payload.agreementToDate,
            rentMonthly: res.data.rentMonthly !== undefined ? res.data.rentMonthly : payload.rentMonthly,
            rentYearly: res.data.rentYearly !== undefined ? res.data.rentYearly : payload.rentYearly,
            taxLiability: res.data.taxLiability !== undefined ? res.data.taxLiability : payload.taxLiability,
          };

          setSavedFloors(prev => prev.map(f => f.id === editingId ? enrichedData : f));
          toast.success(t("floorDetails.updateSuccessMsg") || "Floor details updated successfully.");

          // Reset form and editing state
          setEditingId(null);
          setFormState({
            isTaxable: true,
            floor: "",
            subFloor: "",
            conYear: "",
            conType: "",
            useType: "",
            subUseType: "",
            isRenter: false,
            rooms: 0,
            carpetAreaSqFt: 0,
            builtUpAreaSqFt: 0,
            renterNameEnglish: "",
            renterNameLocal: "",
            agreementDate: "",
            agreementFromDate: "",
            agreementToDate: "",
            rentMonthly: "",
            rentYearly: "",
            taxLiability: "",
          });
          setRoomData([]);
        } else {
          toast.error(getLocalizedError(res.error) || t("floorDetails.failedToUpdateMsg") || "Failed to update floor details.");
        }
      } else {
        const res = await saveFloorDetail(payload);
        if (res.success && res.data) {
          // Find labels
          const subFloorLabel = subFloorOptions.find(o => o.value === String(payload.subFloorId))?.label;
          const subUseTypeLabel = subUseTypeOptions.find(o => o.value === String(payload.subTypeOfUseId))?.label;

          const enrichedData = {
            ...res.data,
            floorId: res.data.floorId || payload.floorId,
            constructionTypeId: res.data.constructionTypeId || payload.constructionTypeId,
            typeOfUseId: res.data.typeOfUseId || payload.typeOfUseId,
            subFloorId: res.data.subFloorId || payload.subFloorId,
            subTypeOfUseId: res.data.subTypeOfUseId || payload.subTypeOfUseId,
            constructionYear: res.data.constructionYear || payload.constructionYear,
            noOfRooms: res.data.noOfRooms || payload.noOfRooms,
            carpetAreaSqFeet: res.data.carpetAreaSqFeet || payload.carpetAreaSqFeet,
            builtUpAreaSqFeet: res.data.builtUpAreaSqFeet || payload.builtUpAreaSqFeet,
            isRented: res.data.isRented !== undefined ? res.data.isRented : payload.isRented,
            subFloorName: subFloorLabel || (res.data as any).subFloorName,
            subTypeOfUseName: subUseTypeLabel || (res.data as any).subTypeOfUseName,
            roomDetails: (res.data as any).roomDetails || roomDetails || [],
            renterNameEnglish: res.data.renterNameEnglish !== undefined ? res.data.renterNameEnglish : payload.renterNameEnglish,
            renterNameLocal: res.data.renterNameLocal !== undefined ? res.data.renterNameLocal : payload.renterNameLocal,
            agreementDate: res.data.agreementDate !== undefined ? res.data.agreementDate : payload.agreementDate,
            agreementFromDate: res.data.agreementFromDate !== undefined ? res.data.agreementFromDate : payload.agreementFromDate,
            agreementToDate: res.data.agreementToDate !== undefined ? res.data.agreementToDate : payload.agreementToDate,
            rentMonthly: res.data.rentMonthly !== undefined ? res.data.rentMonthly : payload.rentMonthly,
            rentYearly: res.data.rentYearly !== undefined ? res.data.rentYearly : payload.rentYearly,
            taxLiability: res.data.taxLiability !== undefined ? res.data.taxLiability : payload.taxLiability,
          };

          // We added it successfully
          setSavedFloors(prev => [...prev, enrichedData]);
          toast.success(t("floorDetails.saveSuccessMsg") || "Floor details saved successfully.");

          // Reset form
          setFormState({
            isTaxable: true,
            floor: "",
            subFloor: "",
            conYear: "",
            conType: "",
            useType: "",
            subUseType: "",
            isRenter: false,
            rooms: 0,
            carpetAreaSqFt: 0,
            builtUpAreaSqFt: 0,
            renterNameEnglish: "",
            renterNameLocal: "",
            agreementDate: "",
            agreementFromDate: "",
            agreementToDate: "",
            rentMonthly: "",
            rentYearly: "",
            taxLiability: "",
          });
          setRoomData([]);
        } else {
          toast.error(getLocalizedError(res.error) || t("floorDetails.failedToSaveMsg") || "Failed to save floor details.");
        }
      }
    } catch (err: any) {
      toast.error(t("floorDetails.genericErrorMsg", { message: err.message }) || "An error occurred: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (f: any) => {
    const formElement = document.querySelector(".DirectRoomRegistrationPanel-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }

    const mappedRooms = Array.isArray(f.roomDetails)
      ? f.roomDetails.map((r: any) => {
        const rOffsets = Array.isArray(r.offsets)
          ? r.offsets.map((off: any) => ({
            id: String(off.id || ""),
            shape: off.shape || "Rectangle",
            length: (() => {
              const val = Number(off.length ?? off.lengthMtr ?? 0);
              if (val === 0 && off.shape === "Square" && Number(off.areaSqM || 0) > 0) {
                return Math.round(Math.sqrt(Number(off.areaSqM)) * 100) / 100;
              }
              return val;
            })(),
            width: Number(off.width ?? off.widthMtr ?? 0),
            height: Number(off.height ?? off.heightMtr ?? 0),
            base1: Number(off.base1 ?? off.base1Mtr ?? 0),
            base2: Number(off.base2 ?? off.base2Mtr ?? 0),
            radius: (() => {
              const val = Number(off.radius ?? off.length ?? off.lengthMtr ?? off.widthMtr ?? 0);
              const areaSqM = Number(off.areaSqM || 0);
              if (val === 0 && areaSqM > 0) {
                if (off.shape === "Circle") return Math.round(Math.sqrt(areaSqM / Math.PI) * 100) / 100;
                if (off.shape === "Semi Circle") return Math.round(Math.sqrt((areaSqM * 2) / Math.PI) * 100) / 100;
                if (off.shape === "Quarter") return Math.round(Math.sqrt((areaSqM * 4) / Math.PI) * 100) / 100;
              }
              return val;
            })(),
            areaSqM: Number(off.areaSqM || 0),
            op: off.op || "Subtract",
          }))
          : [];

        const areaSqM = Number(r.areaSqMtr || r.areaSqM || 0);
        const resolvedLength = (() => {
          const val = Number(r.lengthMtr || 0);
          if (val === 0 && r.shape === "Square" && areaSqM > 0) {
            return Math.round(Math.sqrt(areaSqM) * 100) / 100;
          }
          return val;
        })();
        const resolvedRadius = (() => {
          const val = Number(r.radiusMtr || r.lengthMtr || r.widthMtr || 0);
          if (val === 0 && areaSqM > 0) {
            if (r.shape === "Circle") return Math.round(Math.sqrt(areaSqM / Math.PI) * 100) / 100;
            if (r.shape === "Semi Circle") return Math.round(Math.sqrt((areaSqM * 2) / Math.PI) * 100) / 100;
            if (r.shape === "Quarter") return Math.round(Math.sqrt((areaSqM * 4) / Math.PI) * 100) / 100;
          }
          return val;
        })();

        return {
          id: r.id ? String(r.id) : String(Math.random()),
          roomNo: String(r.roomNo || "1"),
          roomType: String(r.roomType || "Bed Room"),
          shape: String(r.shape || "Rectangle"),
          length: resolvedLength,
          width: Number(r.widthMtr || 0),
          height: Number(r.heightMtr || 0),
          areaSqM: areaSqM,
          areaSqFt: areaSqM * 10.7639,
          base1: Number(r.base1Mtr || 0),
          base2: Number(r.base2Mtr || 0),
          radius: resolvedRadius,
          hasOffset: rOffsets.length > 0 ? "Yes" : "No",
          offsets: rOffsets,
          offsetShape: rOffsets.length > 0 ? rOffsets[0].shape : "Rectangle",
          offsetLength: rOffsets.length > 0 ? rOffsets[0].length : 0,
          offsetWidth: rOffsets.length > 0 ? rOffsets[0].width : 0,
          offsetHeight: rOffsets.length > 0 ? rOffsets[0].height : 0,
          offsetBase1: rOffsets.length > 0 ? rOffsets[0].base1 : 0,
          offsetBase2: rOffsets.length > 0 ? rOffsets[0].base2 : 0,
          offsetRadius: rOffsets.length > 0 ? rOffsets[0].radius : 0,
          offsetAreaSqM: rOffsets.length > 0 ? rOffsets[0].areaSqM : 0,
          offsetOp: rOffsets.length > 0 ? rOffsets[0].op : "Subtract",
          netAreaSqM: Number(r.totalAreaSqMtr || r.areaSqMtr || 0) / Number(r.noOfRooms || 1),
          netAreaSqFt: (Number(r.totalAreaSqMtr || r.areaSqMtr || 0) / Number(r.noOfRooms || 1)) * 10.7639,
          count: Number(r.noOfRooms || 1),
          outer: r.outerYesNo ? "Yes" : "No",
          minus: r.minusYesNo ? "Yes" : "No",
        };
      })
      : [];

    setRoomData(mappedRooms);
    setEditingId(f.id);
    setFormState({
      isTaxable: true,
      floor: String(f.floorId || ""),
      subFloor: String(f.subFloorId || ""),
      conYear: String(f.constructionYear || ""),
      conType: String(f.constructionTypeId || ""),
      useType: String(f.typeOfUseId || ""),
      subUseType: String(f.subTypeOfUseId || ""),
      isRenter: !!f.isRented,
      rooms: Number(f.noOfRooms || 0),
      carpetAreaSqFt: Number(f.carpetAreaSqFeet || 0),
      builtUpAreaSqFt: Number(f.builtUpAreaSqFeet || 0),
      renterNameEnglish: f.renterNameEnglish || "",
      renterNameLocal: f.renterNameLocal || "",
      agreementDate: f.agreementDate || "",
      agreementFromDate: f.agreementFromDate || "",
      agreementToDate: f.agreementToDate || "",
      rentMonthly: f.rentMonthly !== undefined && f.rentMonthly !== null ? String(f.rentMonthly) : "",
      rentYearly: f.rentYearly !== undefined && f.rentYearly !== null ? String(f.rentYearly) : "",
      taxLiability: f.taxLiability || "",
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormState({
      isTaxable: true,
      floor: "",
      subFloor: "",
      conYear: "",
      conType: "",
      useType: "",
      subUseType: "",
      isRenter: false,
      rooms: 0,
      carpetAreaSqFt: 0,
      builtUpAreaSqFt: 0,
      renterNameEnglish: "",
      renterNameLocal: "",
      agreementDate: "",
      agreementFromDate: "",
      agreementToDate: "",
      rentMonthly: "",
      rentYearly: "",
      taxLiability: "",
    });
    setRoomData([]);
  };

  const handleDelete = async (id: number) => {
    confirm({
      variant: "delete",
      title: t("floorDetails.deleteFloorDetailTitle") || "Delete Floor Detail",
      description: t("floorDetails.deleteFloorDetailDesc") || "Are you sure you want to delete this floor detail?",
      onConfirm: async () => {
        setIsLoading(true);
        try {
          const res = await deleteFloorDetail(id);
          if (res.success) {
            setSavedFloors(prev => prev.filter(f => f.id !== id));
            toast.success(t("floorDetails.deleteSuccessMsg") || "Floor detail deleted successfully.");
          } else {
            toast.error(getLocalizedError(res.error) || t("floorDetails.deleteFailedMsg") || "Failed to delete.");
          }
        } catch (e: any) {
          toast.error(t("floorDetails.genericErrorMsg", { message: e.message }) || "Error: " + e.message);
        } finally {
          setIsLoading(false);
        }
      }
    });
  };

  const handleSaveRooms = (rooms: any[], calculatedAreaSqFt: number) => {
    setRoomData(rooms);
    const builtUpAreaSqFt = calculatedAreaSqFt * 1.2; // roughly 20% more for builtup

    setFormState((prev: any) => ({
      ...prev,
      rooms: rooms.reduce((acc, r) => acc + (r.count || 1), 0),
      carpetAreaSqFt: parseFloat(calculatedAreaSqFt.toFixed(2)),
      builtUpAreaSqFt: parseFloat(builtUpAreaSqFt.toFixed(2)),
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="p-5 space-y-6">
        {/* Add Floor Details Form */}
        <div className="border border-slate-200 bg-slate-50/40 rounded-xl p-5 relative DirectRoomRegistrationPanel-form">
          {editingId && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between text-amber-800 text-xs font-semibold">
              <span className="flex items-center gap-2">
                <Edit2 className="size-4 text-amber-600 animate-pulse" />
                {t("floorDetails.editFloor", { id: editingId })}
              </span>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="text-amber-500 hover:text-amber-700 transition-all font-bold uppercase tracking-wider text-[10px]"
              >
                {t("floorDetails.cancelEdit")}
              </button>
            </div>
          )}


          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 mt-3 items-start text-[11px] [&_label]:text-[11px] [&_label]:mb-1 [&_label]:!font-bold [&_span[id$=-label]]:text-[11px] [&_span[id$=-label]]:!font-bold [&_span.text-gray-700]:!font-bold [&_input]:!px-2 [&_input]:!py-1 [&_input]:!h-7 [&_input]:!text-[11px] [&_input]:!rounded-md [&_button[role=combobox]]:!px-2 [&_button[role=combobox]]:!h-7 [&_button[role=combobox]]:!text-[11px] [&_button[role=combobox]]:!rounded-md [&_button[role=combobox]_span]:!text-[11px] [&_span.text-red-600]:text-[10px] [&_span.text-red-600]:mt-0.5">



            <div className="flex flex-col">
              <label className="mb-1 text-[11px] font-bold text-gray-700">
                {t("floorDetails.floor")}<span className="text-red-500"> *</span>
              </label>
              <SearchSelect
                name="floor"
                options={(dropdownOptions?.floorLevels || []).map((o: any) => ({ label: o.label, value: String(o.value) }))}
                value={formState.floor}
                onChange={(name, val) => setFormState((p: any) => ({ ...p, floor: val }))}
                placeholder={t("floorDetails.floorSelectPlaceholder") || "Select floor"}
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1 text-[11px] font-bold text-gray-700">
                {t("floorDetails.subFloor")}
              </label>
              <SearchSelect
                name="subFloor"
                options={(subFloorOptions || []).map((o: any) => ({ label: o.label, value: String(o.value) }))}
                value={formState.subFloor}
                onChange={(name, val) => setFormState((p: any) => ({ ...p, subFloor: val }))}
                placeholder={t("floorDetails.subFloorPlaceholder") || "Select sub floor"}
              />
            </div>

            <Input
              label={t("floorDetails.conYr") || "Con Yr"}
              required
              type="text"
              name="conYear"
              value={formState.conYear || ""}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                setFormState((p: any) => ({ ...p, conYear: val }));
              }}
              maxLength={4}
              className="font-mono"
            />

            <div className="flex flex-col">
              <label className="mb-1 text-[11px] font-bold text-gray-700">
                {t("floorDetails.conType")}<span className="text-red-500"> *</span>
              </label>
              <SearchSelect
                name="conType"
                options={(dropdownOptions?.constructionTypes || []).map((o: any) => ({ label: o.label, value: String(o.value) }))}
                value={formState.conType}
                onChange={(name, val) => setFormState((p: any) => ({ ...p, conType: val }))}
                placeholder={t("floorDetails.constructionTypePlaceholder") || "Select type"}
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1 text-[11px] font-bold text-gray-700">
                {t("floorDetails.typeOfUse")}<span className="text-red-500"> *</span>
              </label>
              <SearchSelect
                name="useType"
                options={(dropdownOptions?.useTypes || []).map((o: any) => ({ label: o.label, value: String(o.value) }))}
                value={formState.useType}
                onChange={(name, val) => setFormState((p: any) => ({ ...p, useType: val }))}
                placeholder={t("floorDetails.typeOfUsePlaceholder") || "Select usage"}
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1 text-[11px] font-bold text-gray-700">
                {t("floorDetails.subTypeOfUse")}<span className="text-red-500"> *</span>
              </label>
              <SearchSelect
                name="subUseType"
                options={(subUseTypeOptions || []).map((o: any) => ({ label: o.label, value: String(o.value) }))}
                value={formState.subUseType}
                onChange={(name, val) => setFormState((p: any) => ({ ...p, subUseType: val }))}
                placeholder={t("floorDetails.subTypeOfUsePlaceholder") || "Select subtype"}
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1 text-[11px] font-bold text-gray-700">
                {t("floorDetails.renter")}
              </label>
              <div className="flex items-center gap-1">
                <div className="flex-1">
                  <SearchSelect
                    name="isRenter"
                    options={[
                      { label: t("floorDetails.no") || "No", value: "false" },
                      { label: t("floorDetails.yes") || "Yes", value: "true" }
                    ]}
                    value={formState.isRenter ? 'true' : 'false'}
                    onChange={(name, val) => {
                      const isTrue = val === 'true';
                      setFormState((p: any) => ({ ...p, isRenter: isTrue }));
                      if (isTrue) {
                        setIsRenterDrawerOpen(true);
                      }
                    }}
                    placeholder={t("placeholders.selectField", { field: t("floorDetails.renter") }) || "Select renter"}
                  />
                </div>
                {formState.isRenter && (
                  <button
                    type="button"
                    onClick={() => setIsRenterDrawerOpen(true)}
                    className="h-7 px-1.5 bg-amber-50 hover:bg-amber-100 text-amber-600 border border-amber-200 rounded-md text-[9px] font-black uppercase tracking-wider flex items-center justify-center gap-0.5 shadow-sm transition-all shrink-0"
                    title="Add/Edit Renter Details"
                  >
                    <Plus className="size-3" strokeWidth={3} /> {t("floorDetails.addDetails") || "Details"}
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col">
              <label className="mb-1 text-[11px] font-bold text-gray-700">
                {t("floorDetails.rooms")}<span className="text-red-500"> *</span>
              </label>
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  name="rooms"
                  min={0}
                  value={formState.rooms}
                  readOnly
                  className="bg-slate-100 border-slate-200 cursor-not-allowed font-bold text-slate-800 !w-full"
                />
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(true)}
                  className="h-7 px-2 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 rounded-md text-[9px] font-black uppercase tracking-wider flex items-center justify-center gap-1 shadow-sm transition-all shrink-0"
                  title="Add Room Details"
                >
                  <Plus className="size-3" strokeWidth={3} /> {t("floorDetails.add")}
                </button>
              </div>
            </div>

            <Input
              label={t("floorDetails.areaSqFt") || "Area (Sq Ft)"}
              required
              type="number"
              name="carpetAreaSqFt"
              min={0}
              value={formState.carpetAreaSqFt}
              readOnly
              className="bg-slate-100 border-slate-200 cursor-not-allowed font-mono font-bold text-blue-700"
            />

            <Input
              label={t("floorDetails.builtupAreaSqFt") || "Builtup Area (Sq Ft)"}
              type="number"
              name="builtUpAreaSqFt"
              min={0}
              value={formState.builtUpAreaSqFt}
              readOnly
              className="bg-slate-100 border-slate-200 cursor-not-allowed font-mono font-bold text-emerald-700"
            />

          </div>

          <div className="flex justify-end gap-3 pt-2">
            {editingId ? (
              <>
                <Button
                  onClick={handleCancelEdit}
                  variant="secondary"
                  size="sm"
                  className="px-6 py-2 text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
                >
                  {t("floorDetails.cancel")}
                </Button>
                <Button
                  onClick={handleAddFloor}
                  isLoading={isLoading}
                  variant="primary"
                  size="sm"
                  icon={Edit2}
                  className="px-6 py-2 text-xs font-bold uppercase tracking-wider hover:bg-blue-700 transition-all shadow-md"
                >
                  {t("floorDetails.updateFloor")}
                </Button>
              </>
            ) : (
              <Button
                onClick={handleAddFloor}
                isLoading={isLoading}
                variant="primary"
                size="sm"
                icon={Plus}
                className="px-6 py-2 text-xs font-bold uppercase tracking-wider hover:bg-blue-700 transition-all shadow-md"
              >
                {t("floorDetails.addFloor")}
              </Button>
            )}
          </div>
        </div>

        {/* Table of Saved Floors */}
        <div className="overflow-hidden border border-slate-200 rounded-xl shadow-inner bg-slate-50/20">
          <div className="bg-slate-50/70 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Layers className="size-4" /> {t("floorDetails.allFloors", { count: savedFloors.length })}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs whitespace-nowrap bg-white">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr className="text-[10px] font-black text-slate-700 uppercase tracking-wider">

                  <th className="py-2.5 px-4">{t("floorDetails.floor")}</th>
                  <th className="py-2.5 px-4">{t("floorDetails.subFloor")}</th>
                  <th className="py-2.5 px-4">{t("floorDetails.conYr")}</th>
                  <th className="py-2.5 px-4">{t("floorDetails.conType")}</th>
                  <th className="py-2.5 px-4">{t("floorDetails.typeOfUse")}</th>
                  <th className="py-2.5 px-4">{t("floorDetails.subTypeOfUse")}</th>
                  <th className="py-2.5 px-4 text-center">{t("floorDetails.renter")}</th>
                  <th className="py-2.5 px-4 text-center">{t("floorDetails.rooms")}</th>
                  <th className="py-2.5 px-4 text-center">{t("floorDetails.carpetAreaSqFtSqM")}</th>
                  <th className="py-2.5 px-4 text-center">{t("floorDetails.builtupSqFtSqM")}</th>
                  <th className="py-2.5 px-4 text-center">{t("floorDetails.action")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {savedFloors.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-8 text-center text-slate-400 font-bold uppercase tracking-wider bg-white text-[11px]">
                      {t("floorDetails.noFloorDetailsAdded")}
                    </td>
                  </tr>
                ) : savedFloors.map((f, i) => {
                  // Find names from dropdowns
                  const floorName = dropdownOptions?.floorLevels?.find((o: any) => String(o.value) === String(f.floorId))?.label || f.floorId;
                  const conTypeName = dropdownOptions?.constructionTypes?.find((o: any) => String(o.value) === String(f.constructionTypeId))?.label || f.constructionTypeId;
                  const useTypeName = dropdownOptions?.useTypes?.find((o: any) => String(o.value) === String(f.typeOfUseId))?.label || f.typeOfUseId;

                  return (
                    <tr key={f.id || i} className="hover:bg-slate-50/60 transition-colors bg-white text-slate-800">

                      <td className="py-2.5 px-4 font-bold text-slate-900">{floorName}</td>
                      <td className="py-2.5 px-4 font-semibold text-slate-800">{f.subFloorName || f.subFloorId || '-'}</td>
                      <td className="py-2.5 px-4 font-mono font-bold text-slate-800">{f.constructionYear}</td>
                      <td className="py-2.5 px-4 font-semibold text-slate-800">{conTypeName}</td>
                      <td className="py-2.5 px-4 font-semibold text-slate-800">{f.useTypeName || useTypeName}</td>
                      <td className="py-2.5 px-4 font-semibold text-slate-800">{f.subTypeOfUseName || f.subTypeOfUseId || '-'}</td>
                      <td className="py-2.5 px-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${f.isRented ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                            {f.isRented ? t("floorDetails.yes") : t("floorDetails.no")}
                          </span>
                          {f.isRented && f.renterNameEnglish && (
                            <span className="text-[9px] text-slate-500 font-bold mt-0.5 uppercase tracking-tight max-w-[120px] truncate" title={f.renterNameEnglish}>
                              {f.renterNameEnglish}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-2.5 px-4 text-center font-bold text-slate-800">{f.noOfRooms}</td>
                      <td className="py-2.5 px-4 text-center font-mono font-bold text-blue-700">{f.carpetAreaSqFeet?.toFixed(2)} / {((f.carpetAreaSqFeet || 0) / 10.7639).toFixed(2)}</td>
                      <td className="py-2.5 px-4 text-center font-mono font-bold text-emerald-700">{f.builtUpAreaSqFeet?.toFixed(2)} / {((f.builtUpAreaSqFeet || 0) / 10.7639).toFixed(2)}</td>
                      <td className="py-1.5 px-3 text-center flex items-center justify-center gap-2">
                        <button
                          type="button"
                          title="Edit Floor Details"
                          onClick={() => handleEdit(f)}
                          className="p-1.5 bg-amber-50 hover:bg-amber-100 rounded-lg text-amber-600 transition-all border border-amber-100/50"
                        >
                          <Edit2 className="size-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(f.id)}
                          disabled={isLoading}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 rounded-lg text-rose-600 transition-all disabled:opacity-50 border border-rose-100/50"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <RoomWiseSubmissionDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        unit={{ unitNumber: `New Floor`, rooms: roomData }}
        onSaveRooms={handleSaveRooms}
      />

      <RenterDetailsDrawer
        isOpen={isRenterDrawerOpen}
        onClose={() => setIsRenterDrawerOpen(false)}
        renterData={{
          renterNameEnglish: formState.renterNameEnglish,
          renterNameLocal: formState.renterNameLocal,
          agreementDate: formState.agreementDate,
          agreementFromDate: formState.agreementFromDate,
          agreementToDate: formState.agreementToDate,
          rentMonthly: formState.rentMonthly,
          rentYearly: formState.rentYearly,
          taxLiability: formState.taxLiability,
        }}
        onSave={(data) => {
          setFormState((prev: any) => ({
            ...prev,
            ...data,
          }));
        }}
      />

      {selectedFloorForView && (
        <RoomWiseSubmissionDrawer
          isOpen={isViewDrawerOpen}
          onClose={() => {
            setIsViewDrawerOpen(false);
            setSelectedFloorForView(null);
          }}
          unit={selectedFloorForView}
          onSaveRooms={() => { }}
        />
      )}
    </div>
  );
}


