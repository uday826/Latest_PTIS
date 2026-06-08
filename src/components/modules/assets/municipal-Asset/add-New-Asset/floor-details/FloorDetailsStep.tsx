"use client";

import { Button, Card, CardContent, CardHeader, CardTitle, Checkbox, useConfirm } from "@/components/common";
import { useFloorAssetFlow } from "@/hooks/asset-hooks/floor-details/useFloorAssetFlow";
import type { NewFloorFormState } from "@/types/asset/floor-details.types";
import { Building2, Layers, Trash2 } from "lucide-react";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useAssetForm } from "../AssetFormContext";
import { MapPicker } from "../basic-Info/MapPicker";
import { FloorConfigRow } from "./FloorConfigRow";
import { RoomWiseSubmissionStep } from "./RoomWiseSubmissionStep";

export default function FloorDetailsPage() {
  const {
    dropdownOptions, floors, newFloor, errors, setErrors, allChecked,
    setNewFloor, handleAddFloor, handleDeleteFloor, handleToggleFloor, handleToggleAllFloors,
    isDrawerOpen, selectedFloorId, localUnits, bulk, activeUnit, currentFloor,
    setIsDrawerOpen, setSelectedFloorId, setLocalUnits, setBulk, setActiveUnit,
    handleGenerateBulk, handleSaveSubUnits, handleDeleteUnit,
    formData, setIsMapOpen,
    isMapOpen, handleMapSelect,
  } = useFloorAssetFlow();
  const { confirm } = useConfirm();
  const { registerSubmitHook } = useAssetForm();

  const handleStepSubmit = useCallback(async (): Promise<boolean> => {
    // 1. Mandatory validation: At least one floor level must be configured
    if (!floors || floors.length === 0) {
      toast.error("Please configure and add at least one floor level before proceeding to the next step.");
      return false;
    }

    return true; // proceed
  }, [floors]);

  useEffect(() => {
    if (registerSubmitHook) {
      registerSubmitHook(handleStepSubmit);
    }
    return () => {
      if (registerSubmitHook) {
        registerSubmitHook(null);
      }
    };
  }, [registerSubmitHook, handleStepSubmit]);

  const allFloorLevels = dropdownOptions?.floorLevels ?? [];
  const availableFloorLevels = allFloorLevels.map((option) => ({
    ...option,
    label: floors.some((f) => f.floor === option.value) 
      ? `${option.label} (Already Added)` 
      : option.label,
  }));
  const constructionTypes = dropdownOptions?.constructionTypes ?? [];
  const useTypes = dropdownOptions?.useTypes ?? [];
  const subUseTypes = dropdownOptions?.subUseTypes ?? [];

  /* ── Field helpers ─────────────────────────────────────────────────────── */
  const clearErrors = (key: keyof NewFloorFormState) => {
    if (errors[key]) setErrors((prev) => { const c = { ...prev }; delete c[key]; return c; });
  };

  const setField = <K extends keyof NewFloorFormState>(key: K) => (val: NewFloorFormState[K]) => {
    setNewFloor((prev) => ({ ...prev, [key]: val }));
    clearErrors(key);
  };

  const onSelect = (key: keyof NewFloorFormState) => (_name: string, val: string) =>
    setField(key)(val as NewFloorFormState[typeof key]);

  /* ── Dependent-clear handlers ──────────────────────────────────────────── */
  const onFloorChange = (_name: string, val: string) => {
    setNewFloor((prev) => ({ ...prev, floor: val }));
    if (floors.some((f) => f.floor === val)) {
      setErrors((prev) => ({ ...prev, floor: "This floor has already been added." }));
    } else {
      clearErrors("floor");
    }
  };

  const onConTypeChange = (_name: string, val: string) => {
    setNewFloor((prev) => ({ ...prev, conType: val }));
    clearErrors("conType");
  };

  const onUseTypeChange = (_name: string, val: string) => {
    setNewFloor((prev) => ({ ...prev, useType: val, subUseType: "" }));
    setErrors((prev) => { const c = { ...prev }; delete c.useType; delete c.subUseType; return c; });
  };

  // Con Yr: strip non-numeric, max 4 chars
  const onConYrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    setNewFloor((prev) => ({ ...prev, conYear: raw }));
    setErrors((prev) => { const c = { ...prev }; delete c.conYear; return c; });
  };


  /* ── Label resolver for table ──────────────────────────────────────────── */
  const getLabel = (opts: { label: string; value: string }[], val: string) =>
    opts.find((x) => x.value === val)?.label ?? val;

  return (
    <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">

      <Card variant="bordered" padding="sm" className="shadow-sm border-slate-200/80 bg-white rounded-2xl">
        <CardHeader className="flex items-center gap-2.5 border-b border-slate-100 pb-1.5 mb-2">
          <div className="bg-[#0f172a] p-1.5 rounded-lg shadow-sm"><Layers className="size-4 text-white" /></div>
          <div className="flex-1">
            <CardTitle className="text-sm font-black text-slate-800 uppercase tracking-wide">Construction &amp; Floor Details</CardTitle>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Dynamic Floor Configurator Form &amp; Valuation Table</p>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          <FloorConfigRow
            newFloor={newFloor} errors={errors}
            floorLevels={availableFloorLevels} constructionTypes={constructionTypes}
            useTypes={useTypes} subUseTypes={subUseTypes}
            onFloorChange={onFloorChange} onConTypeChange={onConTypeChange}
            onConYrChange={onConYrChange} onUseTypeChange={onUseTypeChange}
            onSelect={onSelect} setField={setField} handleAddFloor={handleAddFloor}
          />

          {/* Floor Table */}
          <div className="overflow-hidden border border-slate-200 rounded-xl shadow-inner bg-slate-50/20">
            <table className="w-full table-fixed border-collapse text-left text-xs">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-2.5 px-4 w-[5%] text-center">
                    <div className="flex justify-center"><Checkbox checked={allChecked} onCheckedChange={handleToggleAllFloors} /></div>
                  </th>
                  <th className="py-2.5 px-4 w-[20%] text-left truncate">Floor Level</th>
                  <th className="py-2.5 px-4 w-[25%] text-left truncate">Con. Type</th>
                  <th className="py-2.5 px-4 w-[10%] text-center truncate">Con Yr</th>
                  <th className="py-2.5 px-4 w-[15%] text-center truncate">Use Category</th>
                  <th className="py-2.5 px-4 w-[12%] text-right truncate">Carpet Area</th>
                  <th className="py-2.5 px-4 w-[8%] text-center truncate">Sub-Units</th>
                  <th className="py-2.5 px-4 w-[5%] text-center truncate">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {floors.map((f, idx) => (
                  <tr
                    key={f.id ? `floor-row-${f.id}-${f.floor}` : `floor-row-idx-${idx}`}
                    className={`hover:bg-slate-50/60 transition-colors ${!f.checked ? "opacity-50 line-through text-slate-400 bg-slate-50/20" : ""}`}
                  >
                    <td className="py-2 px-4 text-center">
                      <div className="flex justify-center"><Checkbox checked={!!f.checked} onCheckedChange={() => handleToggleFloor(f.id)} /></div>
                    </td>
                    <td className="py-2 px-4 font-semibold text-slate-800 truncate">{getLabel(allFloorLevels, f.floor)}</td>
                    <td className="py-2 px-4 truncate">{getLabel(constructionTypes, f.conType)}</td>
                    <td className="py-2 px-4 text-center font-mono truncate">{f.conYear || "—"}</td>
                    <td className="py-2 px-4 text-center truncate">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[9px] font-bold uppercase tracking-wide">
                        {getLabel(useTypes, f.useType)}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-right font-mono text-[10px] text-slate-600 truncate">{Number(f.carpetAreaSqM).toLocaleString()} Sq.M</td>
                    <td className="py-1 px-4 text-center">
                      <Button variant="secondary" size="xs"
                        onClick={() => { setSelectedFloorId(f.id); setIsDrawerOpen(true); }}
                        icon={Building2} className="w-full text-[9px] font-bold uppercase tracking-wider">
                        {f.units?.length ?? 0} Units
                      </Button>
                    </td>
                    <td className="py-1 px-4 text-center">
                      <Button variant="ghost" size="xs" onClick={() => {
                        confirm({
                          variant: "delete",
                          title: "Delete Floor Level",
                          description: "Are you sure you want to delete this floor level detail? This action cannot be undone.",
                          onConfirm: () => handleDeleteFloor(f.id),
                        });
                      }}
                        icon={Trash2} className="text-slate-400 hover:text-red-500 transition-all cursor-pointer" />
                    </td>
                  </tr>
                ))}
                {floors.length === 0 && (
                  <tr><td colSpan={8} className="py-8 text-center text-slate-400 font-bold uppercase tracking-wider">
                    No floors configured yet. Use the setup tool above to add levels.
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>


        </CardContent>
      </Card>

      {/* Map Picker Modal */}
      <MapPicker
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        onSelect={handleMapSelect}
        initialLat={formData.latitude}
        initialLng={formData.longitude}
      />



      <RoomWiseSubmissionStep
        isOpen={isDrawerOpen}
        onClose={() => { setIsDrawerOpen(false); setSelectedFloorId(null); }}
        floorId={selectedFloorId} currentFloor={currentFloor}
        localUnits={localUnits} bulk={bulk} activeUnit={activeUnit}
        dropdownOptions={dropdownOptions}
        onBulkChange={(upd) => setBulk((prev) => ({ ...prev, ...upd }))}
        onGenerateBulk={handleGenerateBulk} onDeleteUnit={handleDeleteUnit}
        onSaveSubUnits={handleSaveSubUnits} setActiveUnit={setActiveUnit}
        onSaveUnitDetail={(upd) => { setLocalUnits((prev) => prev.map((u) => u.id === upd.id ? upd : u)); setActiveUnit(null); }}
        setLocalUnits={setLocalUnits}
      />
    </div>
  );
}
