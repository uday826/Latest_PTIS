"use client";

import { useMemo } from "react";
import { Sparkles, Plus } from "lucide-react";
import { Input, SearchSelect, ValidationMessage } from "@/components/common";
import type { NewFloorFormState, FloorSelectOption } from "@/types/asset/floor-details.types";

const CURRENT_YEAR = new Date().getFullYear();
const DISABLED_CLS = "opacity-40 pointer-events-none select-none";
const BASE_INPUT = "h-10 py-1.5 text-sm px-3";

interface FloorConfigRowProps {
  newFloor: NewFloorFormState;
  errors: Partial<Record<keyof NewFloorFormState, string>>;
  floorLevels: FloorSelectOption[];
  constructionTypes: FloorSelectOption[];
  useTypes: FloorSelectOption[];
  subUseTypes: FloorSelectOption[];
  onFloorChange: (_name: string, val: string) => void;
  onConTypeChange: (_name: string, val: string) => void;
  onConYrChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAsstYrChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUseTypeChange: (_name: string, val: string) => void;
  onSelect: (key: keyof NewFloorFormState) => (_name: string, val: string) => void;
  setField: <K extends keyof NewFloorFormState>(key: K) => (val: NewFloorFormState[K]) => void;
  handleAddFloor: () => void;
}

export function FloorConfigRow({
  newFloor, errors, floorLevels, constructionTypes, useTypes, subUseTypes,
  onFloorChange, onConTypeChange, onConYrChange, onAsstYrChange, onUseTypeChange, onSelect,
  setField, handleAddFloor,
}: FloorConfigRowProps) {
  const conYearNum = Number(newFloor.conYear);
  const conYearValid =
    newFloor.conYear.length === 4 && !isNaN(conYearNum) &&
    conYearNum >= 1800 && conYearNum <= CURRENT_YEAR;

  /* ── Step-lock gates (UI only — numeric range is validated by backend) ─── */
  const floorSelected   = !!newFloor.floor;
  const conTypeEnabled  = true;
  const conTypeSelected = !!newFloor.conType;
  const conYrEnabled    = true;
  const useTypeEnabled  = true;
  const useTypeSelected = !!newFloor.useType;
  const subUseEnabled   = useTypeSelected;
  const subUseSelected  = !!newFloor.subUseType;
  const numericEnabled  = true;

  const builtUpValid = Number(newFloor.builtUpAreaSqFt) > 0;
  const carpetValid = Number(newFloor.carpetAreaSqFt) > 0;

  /* Add is enabled directly; full validation is performed on submit */
  const addEnabled = true;

  const conYrError = useMemo(() => {
    if (!newFloor.conYear) return errors.conYear;
    if (!/^\d{1,4}$/.test(newFloor.conYear)) return "Numbers only";
    if (newFloor.conYear.length === 4) {
      if (conYearNum < 1800) return "Min 1800";
      if (conYearNum > CURRENT_YEAR) return `Max ${CURRENT_YEAR}`;
    }
    return errors.conYear;
  }, [newFloor.conYear, conYearNum, errors.conYear]);

  return (
    <div className="bg-slate-50/70 p-2 rounded-xl border border-slate-200/60 space-y-2">
      <div className="flex items-center gap-1.5">
        <Sparkles className="size-3.5 text-blue-500 animate-pulse" />
        <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Configure New Floor Level</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">

        {/* Floor — always enabled */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Floor <span className="text-red-500">*</span></label>
          <SearchSelect name="floor" options={floorLevels} value={newFloor.floor}
            onChange={onFloorChange} placeholder="Select Floor" className={BASE_INPUT} />
          <ValidationMessage message={errors.floor} />
        </div>

        {/* Con Type — enabled after Floor */}
        <div className={conTypeEnabled ? "" : DISABLED_CLS}>
          <label className="block text-xs font-medium text-slate-700 mb-1">Con Type <span className="text-red-500">*</span></label>
          <SearchSelect name="conType" options={constructionTypes} value={newFloor.conType}
            onChange={onConTypeChange} placeholder="Select Con Type"
            disabled={!conTypeEnabled} className={BASE_INPUT} />
          <ValidationMessage message={errors.conType} />
        </div>

        {/* Con Yr — enabled after Con Type */}
        <div className={conYrEnabled ? "" : DISABLED_CLS}>
          <label className="block text-xs font-medium text-slate-700 mb-1">Con Yr <span className="text-red-500">*</span></label>
          <Input type="text" inputMode="numeric" maxLength={4}
            placeholder={`e.g. ${CURRENT_YEAR}`} value={newFloor.conYear}
            onChange={onConYrChange} disabled={!conYrEnabled}
            className={`${BASE_INPUT} border-slate-300`} />
          <ValidationMessage message={conYrError} />
        </div>

        {/* ASS Yr */}
        <div className={conYrEnabled ? "" : DISABLED_CLS}>
          <label className="block text-xs font-medium text-slate-700 mb-1">ASS Yr <span className="text-red-500">*</span></label>
          <Input type="text" inputMode="numeric" maxLength={4}
            placeholder={`e.g. ${CURRENT_YEAR}`} value={newFloor.asstYear}
            onChange={onAsstYrChange} disabled={!conYrEnabled}
            className={`${BASE_INPUT} border-slate-300`} />
          <ValidationMessage message={errors.asstYear} />
        </div>

        {/* Use Type — enabled after valid Con Yr */}
        <div className={useTypeEnabled ? "" : DISABLED_CLS}>
          <label className="block text-xs font-medium text-slate-700 mb-1">Use Type <span className="text-red-500">*</span></label>
          <SearchSelect name="useType" options={useTypes} value={newFloor.useType}
            onChange={onUseTypeChange} placeholder="Select Use Type"
            disabled={!useTypeEnabled} className={BASE_INPUT} />
          <ValidationMessage message={errors.useType} />
        </div>

        {/* Sub Use — enabled after Use Type */}
        <div className={subUseEnabled ? "" : DISABLED_CLS}>
          <label className="block text-xs font-medium text-slate-700 mb-1">Sub Use <span className="text-red-500">*</span></label>
          <SearchSelect name="subUseType" options={subUseTypes} value={newFloor.subUseType}
            onChange={onSelect("subUseType")} placeholder="Select Sub Use"
            disabled={!subUseEnabled} className={BASE_INPUT} />
          <ValidationMessage message={errors.subUseType} />
        </div>

        {/* Rooms, Built-Up, Carpet, Base Value — enabled after Sub Use */}
        <div className="hidden">
          <label className="block text-xs font-medium text-slate-700 mb-1">Rooms <span className="text-red-500">*</span></label>
          <Input type="number" value={newFloor.rooms}
            onChange={(e) => setField("rooms")(Number(e.target.value))}
            min={1} disabled={!numericEnabled}
            className={`${BASE_INPUT} border-slate-300`} />
          <ValidationMessage message={errors.rooms} />
        </div>
        <div className={numericEnabled ? "" : DISABLED_CLS}>
          <label className="block text-xs font-medium text-slate-700 mb-1">Built-Up (SqFt) <span className="text-red-500">*</span></label>
          <Input type="number" value={newFloor.builtUpAreaSqFt === 0 ? "" : newFloor.builtUpAreaSqFt}
            onChange={(e) => setField("builtUpAreaSqFt")(Number(e.target.value))}
            min={0} disabled={!numericEnabled}
            className={`${BASE_INPUT} border-slate-300`} />
          <ValidationMessage message={errors.builtUpAreaSqFt} />
        </div>
        <div className={numericEnabled ? "" : DISABLED_CLS}>
          <label className="block text-xs font-medium text-slate-700 mb-1">Carpet (SqFt) <span className="text-red-500">*</span></label>
          <Input type="number" value={newFloor.carpetAreaSqFt === 0 ? "" : newFloor.carpetAreaSqFt}
            onChange={(e) => setField("carpetAreaSqFt")(Number(e.target.value))}
            min={0} disabled={!numericEnabled}
            className={`${BASE_INPUT} border-slate-300`} />
          <ValidationMessage message={errors.carpetAreaSqFt} />
        </div>
        <div className="hidden">
          <label className="block text-xs font-medium text-slate-700 mb-1">Base Value (₹) <span className="text-red-500">*</span></label>
          <Input type="number" value={newFloor.baseValue}
            onChange={(e) => setField("baseValue")(Number(e.target.value))}
            min={0} disabled={!numericEnabled}
            className={`${BASE_INPUT} border-slate-300 font-bold`} />
          <ValidationMessage message={errors.baseValue} />
        </div>

        {/* Add button — active only when all step-gates pass */}
        <div className="flex items-end w-full">
          <button type="button" onClick={handleAddFloor} disabled={!addEnabled}
            className={`w-full h-10 text-white rounded-lg flex items-center justify-center gap-1 text-xs font-black uppercase tracking-wider transition-all shadow-sm ${
              addEnabled
                ? "bg-blue-600 hover:bg-blue-700 shadow-blue-100 cursor-pointer"
                : "bg-blue-300 cursor-not-allowed opacity-60"
            }`}>
            <Plus className="size-3.5" strokeWidth={3} /> Add
          </button>
        </div>
      </div>
    </div>
  );
}
