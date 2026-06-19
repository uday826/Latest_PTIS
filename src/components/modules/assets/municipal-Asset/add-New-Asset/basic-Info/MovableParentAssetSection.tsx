"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, Input, Select, SearchSelect } from "@/components/common";
import { Search, Building, Layers, Loader2, MapPin, X } from "lucide-react";
import { fetchAssetsByFilter, fetchAssetMasterById } from "@/app/[locale]/assets/actions";
import { fetchFloorsByAsset, getSubUnitsByAssetAction } from "@/app/[locale]/assets/municipal-Asset/add-New-Asset/floor-details/actions";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface MovableParentAssetSectionProps {
  formData: any;
  updateFormData: (patch: Partial<any>) => void;
}

export function MovableParentAssetSection({
  formData,
  updateFormData,
}: MovableParentAssetSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedParentAsset, setSelectedParentAsset] = useState<any | null>(null);
  const t = useTranslations("addAssetForm");

  const [floors, setFloors] = useState<any[]>([]);
  const [subunits, setSubunits] = useState<any[]>([]);
  const [isLoadingFloors, setIsLoadingFloors] = useState(false);
  const [isLoadingSubunits, setIsLoadingSubunits] = useState(false);

  // Debounced parent asset search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    const delayDebounce = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetchAssetsByFilter({ search: searchTerm });
        if (res.success && res.data) {
          // Filter out other Movable Assets to avoid circular parent-child loops
          const nonMovable = res.data.filter(
            (a: any) =>
              !(a.assetCategoryName || "").toLowerCase().includes("movable") &&
              !(a.categoryName || "").toLowerCase().includes("movable")
          );
          setSearchResults(nonMovable);
        }
      } catch (err) {
        console.error("Failed to search parent assets:", err);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const [isSearching, setIsSearching] = useState(false);

  // Load parent asset details and child floors/subunits on mount or parentBuildingId change (recovery/edit support)
  useEffect(() => {
    const parentId = formData.parentBuildingId;
    if (parentId && (!selectedParentAsset || selectedParentAsset.id !== parentId)) {
      const loadDetails = async () => {
        try {
          const res = await fetchAssetMasterById(parentId);
          if (res) {
            setSelectedParentAsset(res);
            // Load child lists
            loadChildData(parentId);
          }
        } catch (err) {
          console.error("Failed to load parent asset details:", err);
        }
      };
      loadDetails();
    }
  }, [formData.parentBuildingId]);

  const loadChildData = async (assetId: number) => {
    setIsLoadingFloors(true);
    setIsLoadingSubunits(true);
    try {
      const [floorsRes, subunitsRes] = await Promise.all([
        fetchFloorsByAsset(assetId),
        getSubUnitsByAssetAction(assetId)
      ]);
      if (floorsRes.success && floorsRes.data) {
        setFloors(floorsRes.data);
      } else {
        setFloors([]);
      }
      if (subunitsRes.success && subunitsRes.data) {
        setSubunits(subunitsRes.data);
      } else {
        setSubunits([]);
      }
    } catch (e) {
      console.error("Failed to fetch child floors/subunits:", e);
    } finally {
      setIsLoadingFloors(false);
      setIsLoadingSubunits(false);
    }
  };

  const handleSelectAsset = async (asset: any) => {
    try {
      const fullDetails = await fetchAssetMasterById(asset.id);
      const parent = fullDetails || asset;
      setSelectedParentAsset(parent);

      // Extract details
      const zoneId = parent.zoneId ? String(parent.zoneId) : "";
      const wardId = parent.wardId ? String(parent.wardId) : "";
      const subZoneId = parent.subZoneId ? String(parent.subZoneId) : "";
      const moujaId = parent.moujaId ? String(parent.moujaId) : "";
      const address = parent.address || "";
      const locality = parent.locality || "";
      const pinCode = parent.pinCode || "";
      const lat = parent.latitude ? String(parent.latitude) : "";
      const lng = parent.longitude ? String(parent.longitude) : "";
      const deptId = parent.departmentId ? String(parent.departmentId) : "";
      const surveyNo = parent.csn || "";
      const propNo = parent.propertyNo || parent.propertyNumber || parent.assetNo || "";

      // Update Form Context
      updateFormData({
        parentBuildingId: parent.id,
        zone: zoneId,
        zoneId: zoneId,
        ward: wardId,
        wardId: wardId,
        subzone: subZoneId,
        subZoneId: subZoneId,
        mouja: moujaId,
        moujaId: moujaId,
        fullAddress: address,
        locality: locality,
        pinCode: pinCode,
        latitude: lat,
        longitude: lng,
        department: deptId,
        departmentId: deptId,
        surveyNumber: surveyNo,
        propertyNumber: propNo,
        // Reset sub-location attributes
        attributes: {
          ...formData.attributes,
          parentFloorId: "",
          subunitId: "",
          roomNumber: ""
        }
      });

      // Load child floors / subunits
      loadChildData(parent.id);
      toast.success(t("wizard.toasts.selectedParentAsset", { name: parent.assetName }));
    } catch (err) {
      toast.error(t("wizard.toasts.failedParentDetails"));
      console.error(err);
    }
  };

  const handleClearSelected = () => {
    setSelectedParentAsset(null);
    setFloors([]);
    setSubunits([]);
    updateFormData({
      parentBuildingId: null,
      zone: "",
      zoneId: "",
      ward: "",
      wardId: "",
      subzone: "",
      subZoneId: "",
      mouja: "",
      moujaId: "",
      fullAddress: "",
      locality: "",
      pinCode: "",
      latitude: "",
      longitude: "",
      surveyNumber: "",
      propertyNumber: "",
      attributes: {
        ...formData.attributes,
        parentFloorId: "",
        subunitId: "",
        roomNumber: ""
      }
    });
  };

  const floorOptions = floors.map((f: any) => {
    const name = f.floorName || `Floor ${f.floorId || f.id}`;
    const details = f.subFloorName ? ` (${f.subFloorName})` : "";
    return { label: `${name}${details}`, value: String(f.id) };
  });

  const subunitOptions = subunits.map((s: any) => {
    const name = s.assetName || s.name || `Unit ${s.assetNo || s.id}`;
    return { label: name, value: String(s.id || s.assetId) };
  });

  return (
    <Card variant="bordered" className="shadow-sm border-slate-200 bg-white rounded-2xl">
      <CardHeader className="flex items-center gap-2 border-b border-slate-100 pb-1.5 mb-2 bg-[#F8FAFC]">
        <div className="bg-gradient-to-br from-indigo-600 to-violet-500 p-1.5 rounded-lg text-white shadow-sm flex items-center justify-center">
          <Building className="size-3.5 text-white" />
        </div>
        <CardTitle className="text-xs font-black text-slate-800 uppercase tracking-widest">
          {t("basicInfo.parentSelection.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedParentAsset ? (
          <div className="flex flex-col gap-3">
            {/* Selected Parent Card display */}
            <div className="flex items-start justify-between bg-slate-50 border border-slate-200 rounded-xl p-3.5 shadow-inner">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-black tracking-wide font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                    {selectedParentAsset.assetNo || `ID: ${selectedParentAsset.id}`}
                  </span>
                  <span className="inline-block rounded-full bg-slate-200/80 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-slate-600">
                    {selectedParentAsset.assetCategoryName || selectedParentAsset.categoryName || t("basicInfo.parentSelection.parentAsset")}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-800 mt-1.5 truncate">
                  {selectedParentAsset.assetName}
                </h4>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 truncate">
                  <MapPin className="size-3.5 text-slate-400 shrink-0" />
                  {selectedParentAsset.address || t("basicInfo.parentSelection.noAddress")}
                </p>
              </div>
              <button
                type="button"
                onClick={handleClearSelected}
                className="ml-3 p-1 rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition"
                title={t("basicInfo.parentSelection.deselectParent")}
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Room, Floor, Sub-unit selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <SearchSelect
                label={t("basicInfo.parentSelection.floorLevel")}
                name="parentFloorId"
                value={String(formData.attributes?.parentFloorId ?? "")}
                onChange={(name, value) =>
                  updateFormData({
                    attributes: { ...formData.attributes, parentFloorId: value }
                  })
                }
                options={floorOptions}
                placeholder={isLoadingFloors ? "Loading levels..." : floors.length === 0 ? "Not Exist" : "Select floor..."}
                disabled={isLoadingFloors || floors.length === 0}
                className="font-semibold text-sm"
              />

              <SearchSelect
                label={t("basicInfo.parentSelection.subUnitFlatOffice")}
                name="subunitId"
                value={String(formData.attributes?.subunitId ?? "")}
                onChange={(name, value) =>
                  updateFormData({
                    attributes: { ...formData.attributes, subunitId: value }
                  })
                }
                options={subunitOptions}
                placeholder={isLoadingSubunits ? "Loading units..." : subunits.length === 0 ? "Not Exist" : "Select unit..."}
                disabled={isLoadingSubunits || subunits.length === 0}
                className="font-semibold text-sm"
              />

              <Input
                label={t("basicInfo.parentSelection.specificRoom")}
                name="roomNumber"
                value={String(formData.attributes?.roomNumber ?? "")}
                onChange={(e) =>
                  updateFormData({
                    attributes: { ...formData.attributes, roomNumber: e.target.value }
                  })
                }
                placeholder="e.g. Server Room, Room 102"
                className="h-8 text-[13px]"
              />
            </div>
          </div>
        ) : (
          <div className="relative">
            <span className="block text-[11px] font-black uppercase tracking-widest text-slate-500 mb-1.5">
              {t("basicInfo.parentSelection.searchParentTitle")}
            </span>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t("basicInfo.parentSelection.parentSearchPlaceholder")}
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-8 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all font-medium h-9 shadow-inner"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            {/* Loading Indicator */}
            {isSearching && (
              <div className="absolute right-9 top-1/2 -translate-y-1/2">
                <Loader2 className="size-4 animate-spin text-slate-400" />
              </div>
            )}

            {/* Results Overlay */}
            {searchResults.length > 0 && (
              <div className="absolute left-0 right-0 mt-1 z-30 max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-lg divide-y divide-slate-100 custom-scrollbar animate-in fade-in duration-100">
                {searchResults.map((asset) => (
                  <button
                    key={asset.id}
                    type="button"
                    onClick={() => handleSelectAsset(asset)}
                    className="w-full px-3 py-2 flex items-start text-left hover:bg-slate-50 transition"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-black font-mono text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded">
                          {asset.assetNo || `ID: ${asset.id}`}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase">
                          {asset.assetTypeName || asset.typeName}
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-slate-700 mt-1 truncate">
                        {asset.assetName}
                      </h5>
                      {asset.address && (
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">
                          {asset.address}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Empty search prompt */}
            {!searchTerm.trim() && (
              <p className="text-[10px] text-slate-400 mt-1.5 font-medium leading-none">
                {t("basicInfo.parentSelection.movableSearchPrompt")}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
