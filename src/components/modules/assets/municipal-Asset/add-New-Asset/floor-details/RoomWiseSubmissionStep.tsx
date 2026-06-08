"use client";

import { Button, Input, SearchSelect } from "@/components/common";
import type { RoomWiseSubmissionStepProps } from "@/types/asset/floor-details.types";
import { Building2, Edit2, Home, Plus, Sparkles, Trash2, X } from "lucide-react";
import { SubUnitDetailedConfigurator } from "../sub-units/SubUnitDetailedConfigurator";

export function RoomWiseSubmissionStep({
  isOpen,
  onClose,
  floorId,
  currentFloor,
  localUnits,
  bulk,
  activeUnit,
  dropdownOptions,
  onBulkChange,
  onGenerateBulk,
  onDeleteUnit,
  onSaveSubUnits,
  setActiveUnit,
  onSaveUnitDetail,
}: RoomWiseSubmissionStepProps) {
  if (!isOpen || floorId === null) return null;
  const unitTypes = dropdownOptions?.unitTypes ?? [];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity duration-300" onClick={onClose} />
      <div className="relative w-full max-w-5xl h-full bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300 border-l border-slate-200">
        
        {/* Header */}
        <div className="px-4 py-3 bg-[#0f172a] text-white flex justify-between items-center shadow-md">
          <div className="flex items-center gap-2">
            <Building2 className="size-4 text-blue-400" />
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider">Sub-Units / Room-Wise Submission</h2>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Floor: {currentFloor?.floor ?? "N/A"}</p>
            </div>
          </div>
          <Button variant="ghost" size="xs" onClick={onClose} icon={X} className="text-slate-400 hover:text-white hover:bg-slate-800 transition-all" />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 bg-slate-50/50">
          {/* Bulk Generator */}
          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <Sparkles className="size-3.5 text-amber-500" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Bulk Generate Units</h3>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <SearchSelect name="unitType" label="Type" options={unitTypes} value={bulk.unitType}
                onChange={(_n, v) => onBulkChange({ unitType: v, prefix: `${v.toUpperCase()}-` })}
                placeholder="Select Type" className="h-8 text-xs" />
              <Input label="Prefix" value={bulk.prefix} onChange={(e) => onBulkChange({ prefix: e.target.value })} className="h-8 text-xs px-2" />
              <Input label="Start #" type="number" min={1} value={bulk.startNum === 0 ? "" : bulk.startNum} onChange={(e) => onBulkChange({ startNum: Math.max(1, Number(e.target.value)) })} className="h-8 text-xs px-2" />
              <Input label="Count" type="number" min={1} value={bulk.count === 0 ? "" : bulk.count} onChange={(e) => onBulkChange({ count: Math.max(1, Number(e.target.value)) })} className="h-8 text-xs px-2 font-bold text-blue-600" />
            </div>
            <div className="flex justify-end pt-1">
              <Button onClick={onGenerateBulk} size="sm" icon={Plus} className="text-[10px] font-black uppercase tracking-wider">Generate {bulk.count} Units</Button>
            </div>
          </div>

          {/* Configured Units Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-280px)]">
            <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
              <Home className="size-3.5 text-slate-500" />
              <h3 className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Configured Units ({localUnits.length})</h3>
            </div>
            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 sticky top-0 border-b border-slate-200">
                  <tr className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                    <th className="px-3 py-2">Unit Number</th>
                    <th className="px-3 py-2">Type</th>
                    <th className="px-3 py-2 text-center">Status</th>
                    <th className="px-3 py-2 text-right">Area (SqFt)</th>
                    <th className="px-3 py-2 text-center w-20">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {localUnits.length === 0 ? (
                    <tr><td colSpan={5} className="py-8 text-center text-slate-400 font-bold uppercase tracking-wider">No sub-units registered yet.</td></tr>
                  ) : (
                    localUnits.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-3 py-2 font-bold text-slate-800">{u.unitNumber}</td>
                        <td className="px-3 py-2 font-semibold text-slate-600">{u.unitType}</td>
                        <td className="px-3 py-2 text-center"><span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[9px] font-black uppercase tracking-wide">{u.status}</span></td>
                        <td className="px-3 py-2 text-right font-mono font-bold text-slate-700">{u.carpetAreaSqFt} SqFt</td>
                        <td className="px-3 py-2 text-center flex items-center justify-center gap-1.5">
                          <Button variant="edit" size="xs" onClick={() => setActiveUnit(u)} icon={Edit2} />
                          <Button variant="ghost" size="xs" onClick={() => onDeleteUnit(u.id)} icon={Trash2} className="text-slate-400 hover:text-red-500 transition-colors" />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose} className="text-[10px] font-black uppercase tracking-widest text-slate-700">Cancel</Button>
          <Button onClick={() => { onSaveSubUnits(); onClose(); }} className="text-[10px] font-black uppercase tracking-widest">Save Config</Button>
        </div>

        {/* SubUnit Details Configurator modal (rendered only when activeUnit exists) */}
        {activeUnit && (
          <div className="absolute inset-0 bg-slate-50 z-[60] flex flex-col animate-in fade-in duration-200">
            <SubUnitDetailedConfigurator
              unit={activeUnit}
              parentBuildingName={`${currentFloor?.floor ?? "Ground"} Floor`}
              onSave={onSaveUnitDetail}
              onCancel={() => setActiveUnit(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
