import React, { useState, useEffect } from "react";
import { X, Building2, Plus, Sparkles, Trash2, Home, Edit2 } from "lucide-react";
import { Input, SearchSelect, Button } from "@/components/common";
import { useAssetForm } from "../AssetFormContext";
import { SubUnitDetailedConfigurator } from "../sub-units/SubUnitDetailedConfigurator";

interface ChildAssetDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  floorId: number | null;
}

export function ChildAssetDrawer({ isOpen, onClose, floorId }: ChildAssetDrawerProps) {
  const { formData, updateFormData } = useAssetForm();
  
  // Local state for the units in this drawer before saving
  const [localUnits, setLocalUnits] = useState<any[]>([]);
  
  // Bulk generator state
  const [bulkType, setBulkType] = useState("Flat");
  const [bulkPrefix, setBulkPrefix] = useState("FLAT-");
  const [bulkStartNum, setBulkStartNum] = useState(101);
  const [bulkCount, setBulkCount] = useState(5);

  const [activeUnit, setActiveUnit] = useState<any | null>(null);

  // Sync with context when opened
  useEffect(() => {
    if (isOpen && floorId !== null) {
      const floor = (formData.floors || []).find((f: any) => f.id === floorId);
      if (floor) {
        setLocalUnits(floor.units || []);
      }
    }
  }, [isOpen, floorId, formData.floors]);

  if (!isOpen || floorId === null) return null;

  const currentFloor = (formData.floors || []).find((f: any) => f.id === floorId);

  const handleGenerateBulk = () => {
    const newUnits = [];
    let nextId = localUnits.length > 0 ? Math.max(...localUnits.map(u => u.id)) + 1 : 1;
    
    for (let i = 0; i < bulkCount; i++) {
      newUnits.push({
        id: nextId++,
        unitNumber: `${bulkPrefix}${bulkStartNum + i}`,
        unitType: bulkType,
        carpetAreaSqFt: 0,
        status: "Vacant",
        baseValue: 0,
        floorId: floorId,
        floorDetailsId: floorId,
      });
    }
    
    setLocalUnits([...localUnits, ...newUnits]);
  };

  const handleDeleteUnit = (id: number) => {
    setLocalUnits(localUnits.filter(u => u.id !== id));
  };

  const handleSave = () => {
    const updatedFloors = (formData.floors || []).map((f: any) => {
      if (f.id === floorId) {
        return { ...f, units: localUnits };
      }
      return f;
    });
    
    updateFormData({ floors: updatedFloors });
    onClose();
  };

  const handleSaveUnitDetail = (updatedUnit: any) => {
    setLocalUnits(localUnits.map(u => u.id === updatedUnit.id ? updatedUnit : u));
    setActiveUnit(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="relative w-full max-w-6xl bg-slate-50 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        
        {activeUnit ? (
          <div className="h-full flex flex-col">
            <SubUnitDetailedConfigurator
              unit={activeUnit}
              parentBuildingName="Current Building"
              onSave={handleSaveUnitDetail}
              onCancel={() => setActiveUnit(null)}
            />
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#0f172a] border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-500/20 rounded-lg">
              <Building2 className="size-4 text-blue-400" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white uppercase tracking-wider">
                Manage Sub-Units
              </h2>
              <p className="text-[10px] text-blue-400 font-bold tracking-widest uppercase">
                {currentFloor?.floor} Floor • {currentFloor?.useType}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          
          {/* Bulk Generator */}
          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <Sparkles className="size-3.5 text-amber-500" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Bulk Generate Units</h3>
            </div>
                         <div className="grid grid-cols-4 gap-2">
              <SearchSelect
                name="bulkType"
                label="Type"
                options={[
                  { label: "Flat", value: "Flat" },
                  { label: "Shop", value: "Shop" },
                  { label: "Room", value: "Room" },
                  { label: "Office", value: "Office" },
                ]}
                value={bulkType}
                onChange={(_n, v) => {
                  setBulkType(v);
                  setBulkPrefix(v.toUpperCase() + "-");
                }}
                placeholder="Select Type"
                className="h-8 text-xs"
              />
              <Input
                label="Prefix"
                value={bulkPrefix}
                onChange={(e) => setBulkPrefix(e.target.value)}
                className="h-8 text-xs px-2"
              />
              <Input
                label="Start #"
                type="number"
                min={1}
                value={bulkStartNum === 0 ? "" : bulkStartNum}
                onChange={(e) => setBulkStartNum(Math.max(1, Number(e.target.value)))}
                className="h-8 text-xs px-2"
              />
              <Input
                label="Count"
                type="number"
                min={1}
                value={bulkCount === 0 ? "" : bulkCount}
                onChange={(e) => setBulkCount(Math.max(1, Number(e.target.value)))}
                className="h-8 text-xs px-2 font-bold text-blue-600"
              />
            </div>
            
            <div className="flex justify-end pt-1">
              <Button onClick={handleGenerateBulk} size="sm" icon={Plus}
                className="text-[10px] font-black uppercase tracking-wider">
                Generate {bulkCount} Units
              </Button>
            </div>
          </div>

          {/* Unit List */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-280px)]">
            <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
              <Home className="size-3.5 text-slate-500" />
              <h3 className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                Configured Units ({localUnits.length})
              </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 sticky top-0 border-b border-slate-200">
                  <tr className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                    <th className="px-3 py-2">Unit Number</th>
                    <th className="px-3 py-2">Type</th>
                    <th className="px-3 py-2 text-center">Rooms</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2 text-right">Area (SqFt)</th>
                    <th className="px-3 py-2 text-right">Value (₹)</th>
                    <th className="px-3 py-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {localUnits.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-3 py-8 text-center text-slate-400 font-medium">
                        No sub-units configured yet. Use the bulk generator above.
                      </td>
                    </tr>
                  ) : (
                    localUnits.map((unit) => (
                      <tr key={unit.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-3 py-1.5 font-bold text-slate-800">{unit.unitNumber}</td>
                        <td className="px-3 py-1.5">
                          <span className="px-2 py-0.5 bg-slate-100 rounded text-[9px] font-bold text-slate-600 uppercase">
                            {unit.unitType}
                          </span>
                        </td>
                        <td className="px-3 py-1.5 text-center font-mono text-[10px] font-bold text-slate-700">
                          {unit.rooms?.length || 0} Rooms
                        </td>
                        <td className="px-3 py-1.5">
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[9px] font-bold uppercase border border-emerald-100">
                            {unit.status}
                          </span>
                        </td>
                        <td className="px-3 py-1.5 text-right font-mono font-medium">{unit.carpetAreaSqFt}</td>
                        <td className="px-3 py-1.5 text-right font-mono font-bold text-slate-700">{unit.baseValue.toLocaleString()}</td>
                        <td className="px-3 py-1.5 text-center flex items-center justify-center gap-1">
                          <Button variant="edit" size="xs" onClick={() => setActiveUnit(unit)}
                            icon={Edit2} title="Configure Details" />
                          <Button variant="ghost" size="xs" onClick={() => handleDeleteUnit(unit.id)}
                            icon={Trash2} className="text-slate-400 hover:text-red-500 transition-colors" />
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
        <div className="px-4 py-3 bg-white border-t border-slate-200 shrink-0 flex items-center justify-between">
          <p className="text-[10px] text-slate-500 font-medium">
            These units will be attached to the <strong className="text-slate-800">{currentFloor?.floor}</strong> floor.
          </p>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose}
              className="text-[10px] font-black uppercase tracking-widest text-slate-700">
              Cancel
            </Button>
            <Button onClick={handleSave}
              className="text-[10px] font-black uppercase tracking-widest">
              Save Units Configuration
            </Button>
          </div>
        </div>
        </>
        )}
      </div>
    </div>
  );
}
