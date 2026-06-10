"use client";

import { Card, CardContent, Input, Select } from "@/components/common";
import { Building2, CheckCircle2, Edit2, LayoutGrid, Plus } from "lucide-react";
import { useState } from "react";
import { useAssetForm } from "../AssetFormContext";
import { SubUnitDetailedConfigurator } from "./SubUnitDetailedConfigurator";

export function StandaloneSubUnitStep({ dropdownOptions }: { dropdownOptions?: any }) {
  const { formData, updateFormData } = useAssetForm();

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

  const handleGenerate = () => {
    const newUnits = [];
    const baseId = units.length > 0 ? Math.max(...units.map((u: any) => u.id || 0)) + 1 : 1;
    const typeLabel = formData.assetType?.split(" ")[0] || "Unit"; // "Flats", "Shops"


    const selectedFloor = parentFloors.find((f: any) => f.id === selectedFloorId) || parentFloors[0] || {
      floor: "Ground",
      conYear: "2020",
      conType: "RCC",
      useType: "Commercial",
      sdrr: 100000,
      floorFactor: 1.0,
      ageFactor: 1.0,
      baseValue: 5000
    };

    for (let i = fromNo; i <= toNo; i++) {
      if (!units.find((u: any) => u.unitNumber === i.toString())) {
        newUnits.push({
          id: baseId + i,
          subAssetId: `MC/WD15/2024/${parentBuildingId}-${i.toString().padStart(3, '0')}`,
          unitNumber: i.toString(),
          unitName: `${typeLabel} ${i}`,
          unitType: typeLabel,
          carpetAreaSqFeet: 500,
          baseValue: selectedFloor.baseValue || 5000,
          status: "Active",
          // Floor details inherited from parent floor
          floorId: selectedFloor.id,
          floorName: `${selectedFloor.floor} Floor`,
          conYear: selectedFloor.conYear,
          conType: selectedFloor.conType,
          useType: selectedFloor.useType,
          sdrr: selectedFloor.sdrr,
          floorFactor: selectedFloor.floorFactor,
          ageFactor: selectedFloor.ageFactor,
          // Defaults for detailed form
          rentAmount: 0,
          securityDeposit: 0,
          rooms: []
        });
      }
    }

    const updatedUnits = [...units, ...newUnits];
    setUnits(updatedUnits);
  };

  const handleSaveUnitDetail = (updatedUnit: any) => {
    const updatedUnits = units.map((u: any) => u.id === updatedUnit.id ? updatedUnit : u);
    setUnits(updatedUnits);
    setActiveUnit(null);
  };

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
            <h2 className="text-sm font-bold text-blue-100 uppercase tracking-widest">Generating Sub-Units For</h2>
            <p className="text-xl font-black">{parentBuildingName}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-blue-200 uppercase tracking-widest font-bold">Asset Type</p>
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
                  <span className="bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded font-black">Registered Info</span>
                  <span>View Registered Parent Building details & dynamic fields</span>
                </div>
                <span className="text-xs font-bold text-blue-600 group-open:hidden">Show details ▼</span>
                <span className="text-xs font-bold text-blue-600 hidden group-open:inline">Hide details ▲</span>
              </summary>
              <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs animate-in fade-in duration-300">
                <div>
                  <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">Asset Name / Code</span>
                  <span className="font-bold text-slate-700">{parentBuildingData.assetName} ({parentBuildingData.assetCode})</span>
                </div>
                <div>
                  <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">Property Tax / Survey No</span>
                  <span className="font-bold text-slate-700">{parentBuildingData.propertyNumber || "—"} / {parentBuildingData.surveyNumber || "—"}</span>
                </div>
                <div>
                  <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">Ward / Zone</span>
                  <span className="font-bold text-slate-700">{parentBuildingData.ward || "—"} / {parentBuildingData.zone || "—"}</span>
                </div>
                <div>
                  <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">Address / Pin Code</span>
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
              label="From Unit No"
              type="number"
              value={fromNo}
              onChange={e => setFromNo(Number(e.target.value))}
              className="h-10 text-sm font-bold"
            />
          </div>
          <div className="w-32">
            <Input
              label="To Unit No"
              type="number"
              value={toNo}
              onChange={e => setToNo(Number(e.target.value))}
              className="h-10 text-sm font-bold"
            />
          </div>

          {parentFloors.length > 0 && (
            <div className="w-48">
              <Select
                label="Target Floor"
                name="selectedFloorId"
                value={selectedFloorId.toString()}
                onChange={e => setSelectedFloorId(Number(e.target.value))}
                options={parentFloors.map((f: any) => ({
                  label: `${f.floor} Floor (${f.conType})`,
                  value: f.id.toString()
                }))}
                className="h-10 text-sm font-bold"
              />
            </div>
          )}

          <button
            onClick={handleGenerate}
            className="h-10 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-black uppercase tracking-wider text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Plus className="size-4" /> Add / Generate
          </button>

          {units.length > 0 && (
            <div className="ml-auto h-10 px-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg flex items-center gap-2 font-bold text-xs uppercase">
              <CheckCircle2 className="size-4 text-emerald-500" />
              {units.length} Unit(s) Generated
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Grid */}
      <Card variant="bordered" className="border-blue-200 shadow-sm overflow-hidden flex flex-col h-[400px]">
        <div className="bg-blue-600 px-4 py-2 flex items-center gap-2 shrink-0">
          <LayoutGrid className="size-4 text-blue-200" />
          <h3 className="text-xs font-black text-white uppercase tracking-widest">
            Generated {formData.assetType} - {parentBuildingName} ({units.length})
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 sticky top-0 border-b border-slate-200 z-10 shadow-sm">
              <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-3 py-2.5">Asset No.</th>
                <th className="px-3 py-2.5">Unit No.</th>
                <th className="px-3 py-2.5">Unit Name</th>
                <th className="px-3 py-2.5 text-center">Rooms</th>
                <th className="px-3 py-2.5 text-right">Rent (₹)</th>
                <th className="px-3 py-2.5">Rent Type</th>
                <th className="px-3 py-2.5 text-right">Sec. Deposit (₹)</th>
                <th className="px-3 py-2.5 text-center">Config</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {units.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-3 py-12 text-center text-slate-400 font-bold uppercase tracking-wider">
                    No units generated yet. Use the tool above.
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
                        <Edit2 className="size-3" /> Detail
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

