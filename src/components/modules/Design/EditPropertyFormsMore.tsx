import React from 'react';

interface FormProps {
  formData: any;
  onChange: (field: string, value: string) => void;
  errors?: Record<string, string>;
}

export function BuildingForm({ formData, onChange }: FormProps) {
  return (
    <div className="grid grid-cols-2 gap-4 text-[10px]">
      <div className="flex flex-col gap-1.5">
        <label className="font-extrabold text-slate-700">Total Floors</label>
        <input 
          type="number" 
          value={formData.floors} 
          onChange={(e) => onChange('floors', e.target.value)}
          className="p-2 bg-white border border-gray-200 rounded font-bold text-gray-800 outline-none text-[10px]" 
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="font-extrabold text-slate-700">Construction Type</label>
        <input 
          type="text" 
          value={formData.constructionType} 
          onChange={(e) => onChange('constructionType', e.target.value)}
          className="p-2 bg-white border border-gray-200 rounded font-bold text-gray-855 outline-none text-[10px]" 
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="font-extrabold text-slate-700">Built-Up Area (sq. ft.)</label>
        <input 
          type="text" 
          value={formData.builtUpArea} 
          onChange={(e) => onChange('builtUpArea', e.target.value)}
          className="p-2 bg-white border border-gray-200 rounded font-bold text-gray-855 outline-none text-[10px]" 
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="font-extrabold text-slate-700">Carpet Area (sq. ft.)</label>
        <input 
          type="text" 
          value={formData.carpetArea} 
          onChange={(e) => onChange('carpetArea', e.target.value)}
          className="p-2 bg-white border border-gray-200 rounded font-bold text-gray-855 outline-none text-[10px]" 
        />
      </div>
    </div>
  );
}

export function OldForm({ formData, onChange }: FormProps) {
  return (
    <div className="grid grid-cols-2 gap-4 text-[10px]">
      <div className="flex flex-col gap-1.5">
        <label className="font-extrabold text-slate-700">Old Property ID</label>
        <input 
          type="text" 
          value={formData.oldPropId} 
          onChange={(e) => onChange('oldPropId', e.target.value)}
          className="p-2 bg-white border border-gray-200 rounded font-bold text-gray-800 outline-none text-[10px]" 
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="font-extrabold text-slate-700">Old Rateable Value (₹)</label>
        <input 
          type="text" 
          value={formData.oldRateableValue} 
          onChange={(e) => onChange('oldRateableValue', e.target.value)}
          className="p-2 bg-white border border-gray-200 rounded font-bold text-gray-855 outline-none text-[10px]" 
        />
      </div>
    </div>
  );
}

export function SocietyForm({ formData, onChange }: FormProps) {
  return (
    <div className="grid grid-cols-2 gap-4 text-[10px]">
      <div className="flex flex-col gap-1.5">
        <label className="font-extrabold text-slate-700">Society Name</label>
        <input 
          type="text" 
          value={formData.societyName} 
          onChange={(e) => onChange('societyName', e.target.value)}
          className="p-2 bg-white border border-gray-200 rounded font-bold text-gray-800 outline-none text-[10px]" 
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="font-extrabold text-slate-700">Society Registration Number</label>
        <input 
          type="text" 
          value={formData.registrationNo} 
          onChange={(e) => onChange('registrationNo', e.target.value)}
          className="p-2 bg-white border border-gray-200 rounded font-bold text-gray-800 outline-none text-[10px]" 
        />
      </div>
    </div>
  );
}

export function DiscountForm({ formData, onChange }: FormProps) {
  return (
    <div className="grid grid-cols-2 gap-4 text-[10px]">
      <div className="flex flex-col gap-1.5">
        <label className="font-extrabold text-slate-700">Exemption Category</label>
        <input 
          type="text" 
          value={formData.exemptionType} 
          onChange={(e) => onChange('exemptionType', e.target.value)}
          className="p-2 bg-white border border-gray-200 rounded font-bold text-gray-800 outline-none text-[10px]" 
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="font-extrabold text-slate-700">Exemption Value (%)</label>
        <input 
          type="text" 
          value={formData.exemptionPercent} 
          onChange={(e) => onChange('exemptionPercent', e.target.value)}
          className="p-2 bg-white border border-gray-205 rounded font-bold text-gray-855 outline-none text-[10px]" 
        />
      </div>
    </div>
  );
}
