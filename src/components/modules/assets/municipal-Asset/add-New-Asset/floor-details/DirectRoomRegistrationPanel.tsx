"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Building, Map, Layers, X } from "lucide-react";
import { useAssetForm } from "../AssetFormContext";
import { Input } from "@/components/common";
import { saveFloorDetail, deleteFloorDetail, fetchSubFloorAction, fetchSubUseTypesAction } from "@/app/[locale]/assets/municipal-Asset/add-New-Asset/floor-details/actions";
import { RoomWiseSubmissionDrawer } from "../sub-units/RoomWiseSubmissionDrawer";

interface DirectRoomRegistrationPanelProps {
  dropdownOptions: any;
}

export function DirectRoomRegistrationPanel({ dropdownOptions }: DirectRoomRegistrationPanelProps) {
  const { formData } = useAssetForm();

  // Local state for floors saved to the DB
  const [savedFloors, setSavedFloors] = useState<any[]>([]);

  // Inline form state
  const [isAdding, setIsAdding] = useState(false);
  const [subFloorOptions, setSubFloorOptions] = useState<any[]>([]);
  const [subUseTypeOptions, setSubUseTypeOptions] = useState<any[]>([]);
  const [formState, setFormState] = useState<any>({
    isTaxable: true,
    floor: "",
    subFloor: "",
    conYear: new Date().getFullYear().toString(),
    asstYear: new Date().getFullYear().toString(),
    conType: "",
    useType: "",
    subUseType: "",
    isRenter: false,
    rooms: 0,
    carpetAreaSqFt: 0,
    builtUpAreaSqFt: 0,
  });

  const [isLoading, setIsLoading] = useState(false);

  // RoomWiseSubmissionDrawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [roomData, setRoomData] = useState<any[]>([]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormState((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleAddFloor = async () => {
    if (!formState.floor || !formState.conType || !formState.useType) {
      alert("Please fill in all mandatory fields (Floor, Construction Type, Type of Use).");
      return;
    }

    setIsLoading(true);
    try {
      const payload: any = {
        assetId: formData.id || 0,
        floorId: Number(formState.floor),
        subFloorId: formState.subFloor ? Number(formState.subFloor) : null,
        constructionYear: formState.conYear,
        assessmentYear: formState.asstYear,
        constructionTypeId: Number(formState.conType),
        typeOfUseId: Number(formState.useType),
        subTypeOfUseId: formState.subUseType ? Number(formState.subUseType) : 0,
        carpetAreaSqFeet: formState.carpetAreaSqFt || 0,
        carpetAreaSqMeter: (formState.carpetAreaSqFt || 0) / 10.7639,
        builtUpAreaSqFeet: formState.builtUpAreaSqFt || 0,
        builtUpAreaSqMeter: (formState.builtUpAreaSqFt || 0) / 10.7639,
        noOfRooms: formState.rooms || 0,
        isRented: formState.isRenter,
        isTaxable: formState.isTaxable,
        isActive: true,
      };

      const res = await saveFloorDetail(payload);
      if (res.success && res.data) {
        // Find labels
        const subFloorLabel = subFloorOptions.find(o => o.value === String(payload.subFloorId))?.label;
        const subUseTypeLabel = subUseTypeOptions.find(o => o.value === String(payload.subTypeOfUseId))?.label;

        const enrichedData = {
          ...res.data,
          subFloorName: subFloorLabel,
          subTypeOfUseName: subUseTypeLabel,
        };

        // We added it successfully
        setSavedFloors(prev => [...prev, enrichedData]);
        
        // Reset form
        setFormState({
          isTaxable: true,
          floor: "",
          subFloor: "",
          conYear: new Date().getFullYear().toString(),
          asstYear: new Date().getFullYear().toString(),
          conType: "",
          useType: "",
          subUseType: "",
          isRenter: false,
          rooms: 0,
          carpetAreaSqFt: 0,
          builtUpAreaSqFt: 0,
        });
        setRoomData([]);
        setIsAdding(false);
      } else {
        alert(res.error || "Failed to save floor details.");
      }
    } catch (err: any) {
      alert("An error occurred: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this floor detail?")) return;
    setIsLoading(true);
    try {
      const res = await deleteFloorDetail(id);
      if (res.success) {
        setSavedFloors(prev => prev.filter(f => f.id !== id));
      } else {
        alert(res.error || "Failed to delete.");
      }
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setIsLoading(false);
    }
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
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <Building className="size-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Direct Room Registration</h3>
            <p className="text-[10px] text-slate-500 font-medium">Add floors and their total dimensions directly.</p>
          </div>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="size-3.5" />
            Add Floor
          </button>
        )}
      </div>

      <div className="p-5">
        {/* Table of Saved Floors */}
        <div className="mb-6 border border-slate-200 rounded-xl overflow-hidden">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
              <Layers className="size-3.5" /> All Floors ({savedFloors.length})
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left whitespace-nowrap">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                  <th className="px-4 py-3">Taxable</th>
                  <th className="px-4 py-3">Floor</th>
                  <th className="px-4 py-3">Sub Floor</th>
                  <th className="px-4 py-3">Con Yr</th>
                  <th className="px-4 py-3">Asst Yr</th>
                  <th className="px-4 py-3">Con Type</th>
                  <th className="px-4 py-3">Use</th>
                  <th className="px-4 py-3">Sub Type</th>
                  <th className="px-4 py-3 text-center">Renter</th>
                  <th className="px-4 py-3 text-center">Rooms</th>
                  <th className="px-4 py-3 text-right">Carpet (SqFt)</th>
                  <th className="px-4 py-3 text-right">Builtup (SqFt)</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {savedFloors.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="px-4 py-8 text-center text-slate-400">
                      No floor details added yet.
                    </td>
                  </tr>
                ) : savedFloors.map((f, i) => {
                  // Find names from dropdowns
                  const floorName = dropdownOptions?.floorLevels?.find((o: any) => String(o.value) === String(f.floorId))?.label || f.floorId;
                  const conTypeName = dropdownOptions?.constructionTypes?.find((o: any) => String(o.value) === String(f.constructionTypeId))?.label || f.constructionTypeId;
                  const useTypeName = dropdownOptions?.useTypes?.find((o: any) => String(o.value) === String(f.typeOfUseId))?.label || f.typeOfUseId;
                  
                  return (
                    <tr key={f.id || i} className="hover:bg-slate-50">
                      <td className="px-4 py-2.5">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${f.isTaxable ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                          {f.isTaxable ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 font-bold text-slate-800">{floorName}</td>
                      <td className="px-4 py-2.5 text-slate-600">{f.subFloorName || f.subFloorId || '-'}</td>
                      <td className="px-4 py-2.5 font-bold text-slate-700">{f.constructionYear}</td>
                      <td className="px-4 py-2.5 font-bold text-slate-700">{f.assessmentYear || '-'}</td>
                      <td className="px-4 py-2.5 text-slate-600">{conTypeName}</td>
                      <td className="px-4 py-2.5 text-slate-600">{f.useTypeName || useTypeName}</td>
                      <td className="px-4 py-2.5 text-slate-600">{f.subTypeOfUseName || f.subTypeOfUseId || '-'}</td>
                      <td className="px-4 py-2.5 text-center">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${f.isRented ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                          {f.isRented ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-center font-bold text-slate-800">{f.noOfRooms}</td>
                      <td className="px-4 py-2.5 text-right font-mono font-bold text-blue-700">{f.carpetAreaSqFeet?.toFixed(2)}</td>
                      <td className="px-4 py-2.5 text-right font-mono font-bold text-emerald-700">{f.builtUpAreaSqFeet?.toFixed(2)}</td>
                      <td className="px-4 py-2.5 text-center">
                        <button onClick={() => handleDelete(f.id)} disabled={isLoading} className="p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 rounded transition-colors disabled:opacity-50">
                          <Trash2 className="size-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Floor Details Form */}
        {isAdding && (
          <div className="border border-blue-200 bg-blue-50/30 rounded-xl p-5 relative mt-4">
            <div className="absolute -top-3 left-6 px-2 bg-white flex items-center gap-1.5 text-blue-600 font-bold text-xs uppercase tracking-wide">
              <Edit2 className="size-3.5" /> Add Floor Details
            </div>
            <button onClick={() => setIsAdding(false)} className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
              <X className="size-4" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-4 mt-3">
              
              <div className="col-span-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Taxable</label>
                <select name="isTaxable" value={formState.isTaxable ? 'true' : 'false'} onChange={(e) => setFormState((p: any) => ({...p, isTaxable: e.target.value === 'true'}))} className="h-9 w-full rounded-lg border border-slate-300 px-3 text-xs focus:ring-2 focus:ring-blue-200">
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Floor *</label>
                <select name="floor" value={formState.floor} onChange={handleInputChange} className="h-9 w-full rounded-lg border border-slate-300 px-3 text-xs focus:ring-2 focus:ring-blue-200">
                  <option value="">Select floor</option>
                  {dropdownOptions?.floorLevels?.map((f: any) => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Sub Floor</label>
                <select name="subFloor" value={formState.subFloor} onChange={handleInputChange} className="h-9 w-full rounded-lg border border-slate-300 px-3 text-xs focus:ring-2 focus:ring-blue-200">
                  <option value="">Select sub floor</option>
                  {subFloorOptions.map((s: any) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              <div className="col-span-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Con Yr *</label>
                <Input type="text" name="conYear" value={formState.conYear || ""} onChange={handleInputChange} className="h-9 text-xs font-mono" />
              </div>

              <div className="col-span-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Asst Yr *</label>
                <Input type="text" name="asstYear" value={formState.asstYear || ""} onChange={handleInputChange} className="h-9 text-xs font-mono" />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Con Type *</label>
                <select name="conType" value={formState.conType} onChange={handleInputChange} className="h-9 w-full rounded-lg border border-slate-300 px-3 text-xs focus:ring-2 focus:ring-blue-200">
                  <option value="">Select type</option>
                  {dropdownOptions?.constructionTypes?.map((c: any) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div className="col-span-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Use *</label>
                <select name="useType" value={formState.useType} onChange={handleInputChange} className="h-9 w-full rounded-lg border border-slate-300 px-3 text-xs focus:ring-2 focus:ring-blue-200">
                  <option value="">Select usage</option>
                  {dropdownOptions?.useTypes?.map((u: any) => (
                    <option key={u.value} value={u.value}>{u.label}</option>
                  ))}
                </select>
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Sub Type</label>
                <select name="subUseType" value={formState.subUseType} onChange={handleInputChange} className="h-9 w-full rounded-lg border border-slate-300 px-3 text-xs focus:ring-2 focus:ring-blue-200">
                  <option value="">Select subtype</option>
                  {subUseTypeOptions.map((u: any) => (
                    <option key={u.value} value={u.value}>{u.label}</option>
                  ))}
                </select>
              </div>

              <div className="col-span-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Renter</label>
                <select name="isRenter" value={formState.isRenter ? 'true' : 'false'} onChange={(e) => setFormState((p: any) => ({...p, isRenter: e.target.value === 'true'}))} className="h-9 w-full rounded-lg border border-slate-300 px-3 text-xs focus:ring-2 focus:ring-blue-200">
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>

              <div className="col-span-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Rooms *</label>
                <Input type="number" name="rooms" min={0} value={formState.rooms} onChange={handleInputChange} className="h-9 text-xs" />
              </div>

              <div className="col-span-1 md:col-span-2 relative">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Area (Sq Ft) *</label>
                  <button type="button" onClick={() => setIsDrawerOpen(true)} className="text-[8px] font-bold uppercase tracking-widest text-blue-600 hover:text-blue-700 bg-blue-100 hover:bg-blue-200 px-1.5 py-0.5 rounded flex items-center gap-1 transition-colors">
                    <Map className="size-2.5" /> Auto-Calculated
                  </button>
                </div>
                <Input type="number" name="carpetAreaSqFt" min={0} value={formState.carpetAreaSqFt} onChange={handleInputChange} className="h-9 text-xs font-mono font-bold text-blue-700" />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Builtup Area (Sq Ft)</label>
                <Input type="number" name="builtUpAreaSqFt" min={0} value={formState.builtUpAreaSqFt} onChange={handleInputChange} className="h-9 text-xs font-mono font-bold text-emerald-700" />
              </div>

            </div>

            <div className="flex justify-end mt-6">
              <button onClick={handleAddFloor} disabled={isLoading} className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-blue-700 transition-all shadow-md disabled:opacity-50">
                {isLoading ? "Saving..." : "Add Floor"}
              </button>
            </div>
          </div>
        )}
      </div>

      <RoomWiseSubmissionDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        unit={{ unitNumber: `New Floor`, rooms: roomData }} 
        onSaveRooms={handleSaveRooms} 
      />
    </div>
  );
}
