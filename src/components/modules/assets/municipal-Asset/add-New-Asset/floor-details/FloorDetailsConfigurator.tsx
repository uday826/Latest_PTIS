"use client";

import { useState } from "react";
import { Layers, Sparkles, Plus, Trash2, FileSpreadsheet } from "lucide-react";
import { Input, Select, Card, CardHeader, CardTitle, CardContent } from "@/components/common";
import { useAssetForm } from "../AssetFormContext";
import { ChildAssetDrawer } from "./ChildAssetDrawer";
import { Building2 } from "lucide-react";

export function FloorDetailsConfigurator() {
  const { formData, updateFormData } = useAssetForm();

  const [isChildDrawerOpen, setIsChildDrawerOpen] = useState(false);
  const [selectedFloorId, setSelectedFloorId] = useState<number | null>(null);

  const [newFloor, setNewFloor] = useState({
    floor: "Ground",
    conYear: "2024",
    asstYear: "2024",
    conType: "RCC",
    useType: "Residential",
    subUseType: "Bungalow",
    rooms: 1,
    carpetAreaSqFt: 500,
    builtUpAreaSqFt: 600,
    baseValue: 2000
  });

  const handleAddFloor = () => {
    const nextId = (formData.floors || []).length > 0
      ? Math.max(...(formData.floors || []).map((f: any) => f.id)) + 1
      : 1;

    const carpetAreaSqM = parseFloat((Number(newFloor.carpetAreaSqFt) * 0.092903).toFixed(2));
    const builtUpAreaSqM = parseFloat((Number(newFloor.builtUpAreaSqFt) * 0.092903).toFixed(2));

    const addedFloor = {
      id: nextId,
      checked: true,
      floor: newFloor.floor,
      conYear: newFloor.conYear,
      asstYear: newFloor.asstYear,
      conType: newFloor.conType,
      useType: newFloor.useType,
      subUseType: newFloor.subUseType,
      rooms: Number(newFloor.rooms),
      carpetAreaSqFt: Number(newFloor.carpetAreaSqFt),
      carpetAreaSqM,
      builtUpAreaSqFt: Number(newFloor.builtUpAreaSqFt),
      builtUpAreaSqM,
      baseValue: Number(newFloor.baseValue),
      floorFactor: `1.00 / ${Number(newFloor.baseValue).toLocaleString()}`,
      ageFactor: 1.0
    };

    updateFormData({
      floors: [...(formData.floors || []), addedFloor]
    });

    setNewFloor(prev => ({
      ...prev,
      rooms: 1,
      carpetAreaSqFt: 500,
      builtUpAreaSqFt: 600,
      baseValue: 2000
    }));
  };

  const handleDeleteFloor = (id: number) => {
    updateFormData({
      floors: (formData.floors || []).filter((f: any) => f.id !== id)
    });
  };

  const handleToggleFloor = (id: number) => {
    updateFormData({
      floors: (formData.floors || []).map((f: any) =>
        f.id === id ? { ...f, checked: !f.checked } : f
      )
    });
  };

  const allChecked = (formData.floors || []).length > 0 && (formData.floors || []).every((f: any) => f.checked);
  const handleToggleAllFloors = () => {
    const targetState = !allChecked;
    updateFormData({
      floors: (formData.floors || []).map((f: any) => ({ ...f, checked: targetState }))
    });
  };

  const totalCV = (formData.floors || []).reduce((acc: number, f: any) =>
    acc + (f.checked ? Number(f.baseValue || 0) : 0), 0
  );

  return (
    <Card variant="bordered" padding="sm" className="shadow-sm border-slate-200/80 bg-white rounded-2xl">
      <CardHeader className="flex items-center gap-2.5 border-b border-slate-100 pb-1.5 mb-2">
        <div className="bg-[#0f172a] p-1.5 rounded-lg shadow-sm">
          <Layers className="size-4 text-white" />
        </div>
        <div className="flex-1">
          <CardTitle className="text-sm font-black text-slate-800 uppercase tracking-wide">
            C) Construction & Floor Details
          </CardTitle>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
            Dynamic Floor Configurator Form & Valuation Table
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="bg-slate-50/70 p-2 rounded-xl border border-slate-200/60 space-y-2">
          <div className="flex items-center gap-1.5">
            <Sparkles className="size-3.5 text-blue-500 animate-pulse" />
            <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Configure New Floor Level</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <Select
              label="Floor"
              options={[
                { label: "Ground", value: "Ground" },
                { label: "1st", value: "1st" },
                { label: "2nd", value: "2nd" },
                { label: "3rd", value: "3rd" },
                { label: "4th", value: "4th" },
                { label: "5th", value: "5th" },
                { label: "6th", value: "6th" },
              ]}
              value={newFloor.floor}
              onChange={(e) => setNewFloor(prev => ({ ...prev, floor: e.target.value }))}
              selectSize="sm"
              className="text-xs"
            />

            <Select
              label="Con Type"
              options={[
                { label: "RCC", value: "RCC" },
                { label: "Load Bearing", value: "Load Bearing" },
                { label: "Steel Frame", value: "Steel Frame" },
                { label: "Wooden", value: "Wooden" },
              ]}
              value={newFloor.conType}
              onChange={(e) => setNewFloor(prev => ({ ...prev, conType: e.target.value }))}
              selectSize="sm"
              className="text-xs"
            />

            <Input
              label="Con Yr"
              type="text"
              placeholder="e.g. 2024"
              value={newFloor.conYear}
              onChange={(e) => setNewFloor(prev => ({ ...prev, conYear: e.target.value }))}
              className="h-8 py-1 text-xs px-2.5 border-slate-300"
            />

            <Input
              label="ASS Yr"
              type="text"
              placeholder="e.g. 2024"
              value={newFloor.asstYear}
              onChange={(e) => setNewFloor(prev => ({ ...prev, asstYear: e.target.value }))}
              className="h-8 py-1 text-xs px-2.5 border-slate-300"
            />

            <Select
              label="Use Type"
              options={[
                { label: "Residential", value: "Residential" },
                { label: "Commercial", value: "Commercial" },
                { label: "Industrial", value: "Industrial" },
                { label: "Mixed Use", value: "Mixed Use" },
              ]}
              value={newFloor.useType}
              onChange={(e) => setNewFloor(prev => ({ ...prev, useType: e.target.value }))}
              selectSize="sm"
              className="text-xs"
            />

            <Select
              label="Sub Use"
              options={[
                { label: "Bungalow", value: "Bungalow" },
                { label: "Duplex", value: "Duplex" },
                { label: "Shop", value: "Shop" },
                { label: "Office", value: "Office" },
                { label: "Storage", value: "Storage" },
              ]}
              value={newFloor.subUseType}
              onChange={(e) => setNewFloor(prev => ({ ...prev, subUseType: e.target.value }))}
              selectSize="sm"
              className="text-xs"
            />

            <Input
              label="Rooms"
              type="number"
              value={newFloor.rooms}
              onChange={(e) => setNewFloor(prev => ({ ...prev, rooms: Number(e.target.value) }))}
              className="h-8 py-1 text-xs px-2.5 border-slate-300"
            />

            <Input
              label="Built-Up Area (Sq.Ft)"
              type="number"
              value={newFloor.builtUpAreaSqFt}
              onChange={(e) => setNewFloor(prev => ({ ...prev, builtUpAreaSqFt: Number(e.target.value) }))}
              className="h-8 py-1 text-xs px-2.5 border-slate-300"
            />

            <Input
              label="Carpet Area (Sq.Ft)"
              type="number"
              value={newFloor.carpetAreaSqFt}
              onChange={(e) => setNewFloor(prev => ({ ...prev, carpetAreaSqFt: Number(e.target.value) }))}
              className="h-8 py-1 text-xs px-2.5 border-slate-300"
            />

            <Input
              label="Base Value (₹)"
              type="number"
              value={newFloor.baseValue}
              onChange={(e) => setNewFloor(prev => ({ ...prev, baseValue: Number(e.target.value) }))}
              className="h-8 py-1 text-xs px-2.5 border-slate-300 font-bold text-slate-800"
            />

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleAddFloor}
                className="w-full h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-1 text-[10px] font-black uppercase tracking-wider transition-all shadow-sm shadow-blue-100 cursor-pointer"
              >
                <Plus className="size-3.5" strokeWidth={3} /> Add
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-hidden border border-slate-200 rounded-xl shadow-inner bg-slate-50/20">
          <table className="w-full border-collapse text-left text-xs">
            <thead className="bg-slate-100 border-b border-slate-200">
              <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    onChange={handleToggleAllFloors}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th className="py-2.5 px-3">Floor Level</th>
                <th className="py-2.5 px-3">Con. Type</th>
                <th className="py-2.5 px-3">ASS Yr</th>
                <th className="py-2.5 px-3">Use Category</th>
                <th className="py-2 px-2 text-right">Carpet Area</th>
                <th className="py-2 px-2 text-right">Base Value (₹)</th>
                <th className="py-2 px-2 text-center w-24">Sub-Units</th>
                <th className="py-2 px-2 w-10 text-center">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {(formData.floors || []).map((floor: any) => (
                <tr
                  key={floor.id}
                  className={`hover:bg-slate-50/60 transition-colors ${!floor.checked ? "opacity-50 line-through text-slate-400 bg-slate-50/20" : ""}`}
                >
                  <td className="py-2 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={!!floor.checked}
                      onChange={() => handleToggleFloor(floor.id)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </td>
                  <td className="py-2 px-3 font-semibold text-slate-800">{floor.floor}</td>
                  <td className="py-2 px-3">{floor.conType}</td>
                  <td className="py-2 px-3 font-mono">{floor.conYear || "—"} / {floor.asstYear || "—"}</td>
                  <td className="py-2 px-3">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[9px] font-bold uppercase tracking-wide">
                      {floor.useType}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right font-mono text-[10px] text-slate-600">
                    {Number(floor.carpetAreaSqFt).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Sq.Ft
                  </td>
                  <td className="py-1 px-2 text-right font-mono font-bold text-slate-800">
                    ₹ {Number(floor.baseValue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="py-1 px-2 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFloorId(floor.id);
                        setIsChildDrawerOpen(true);
                      }}
                      className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded flex items-center justify-center gap-1 text-[9px] font-bold uppercase tracking-wider w-full border border-blue-200 transition-colors"
                    >
                      <Building2 className="size-3" />
                      {floor.units?.length || 0} Units
                    </button>
                  </td>
                  <td className="py-1 px-2 text-center">
                    <button
                      type="button"
                      onClick={() => handleDeleteFloor(floor.id)}
                      className="p-1 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-all cursor-pointer"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {(!formData.floors || formData.floors.length === 0) && (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400 font-bold uppercase tracking-wider">
                    No floors configured yet. Use the setup tool above to add levels.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>


      </CardContent>

      <ChildAssetDrawer
        isOpen={isChildDrawerOpen}
        onClose={() => {
          setIsChildDrawerOpen(false);
          setSelectedFloorId(null);
        }}
        floorId={selectedFloorId}
      />
    </Card>
  );
}
