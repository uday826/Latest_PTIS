import React from 'react';

interface FormProps {
  formData: any;
  onChange: (field: string, value: string) => void;
  errors?: Record<string, string>;
}

export function KycForm({ formData, onChange, errors = {} }: FormProps) {
  return (
    <div className="grid grid-cols-2 gap-4 text-[10px]">
      <div className="flex flex-col gap-1.5">
        <label className="font-extrabold text-slate-700">Aadhaar Number (UID)</label>
        <input 
          type="text" 
          value={formData.aadhaar} 
          onChange={(e) => onChange('aadhaar', e.target.value)}
          className="p-2 bg-white border border-gray-200 rounded font-bold text-gray-800 outline-none focus:border-blue-500 text-[10px]" 
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="font-extrabold text-slate-700">Mobile Number <span className="text-red-500">*</span></label>
        <input 
          type="text" 
          value={formData.mobile} 
          onChange={(e) => onChange('mobile', e.target.value)}
          className={`p-2 bg-white border rounded font-bold text-gray-800 outline-none text-[10px] ${
            errors.mobile ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
          }`} 
        />
        {errors.mobile && <span className="text-red-500 font-extrabold text-[8px] mt-0.5">{errors.mobile}</span>}
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="font-extrabold text-slate-700">Email Address</label>
        <input 
          type="email" 
          value={formData.email} 
          onChange={(e) => onChange('email', e.target.value)}
          className="p-2 bg-white border border-gray-200 rounded font-bold text-gray-800 outline-none focus:border-blue-500 text-[10px]" 
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="font-extrabold text-slate-700">PAN Number</label>
        <input 
          type="text" 
          value={formData.pan} 
          onChange={(e) => onChange('pan', e.target.value)}
          className="p-2 bg-white border border-gray-200 rounded font-bold text-gray-800 outline-none focus:border-blue-500 uppercase text-[10px]" 
        />
      </div>
    </div>
  );
}

export function PropertyForm({ formData, onChange, errors = {} }: FormProps) {
  return (
    <div className="grid grid-cols-2 gap-4 text-[10px]">
      <div className="flex flex-col gap-1.5">
        <label className="font-extrabold text-slate-700">Property ID / UPIC <span className="text-red-500">*</span></label>
        <input 
          type="text" 
          value={formData.upic} 
          onChange={(e) => onChange('upic', e.target.value)}
          className={`p-2 bg-white border rounded font-bold text-gray-800 outline-none text-[10px] ${
            errors.upic ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
          }`} 
        />
        {errors.upic && <span className="text-red-500 font-extrabold text-[8px] mt-0.5">{errors.upic}</span>}
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="font-extrabold text-slate-700">Category</label>
        <select 
          value={formData.category} 
          onChange={(e) => onChange('category', e.target.value)}
          className="p-2 bg-white border border-gray-200 rounded font-bold text-gray-800 outline-none focus:border-blue-500 text-[10px]"
        >
          <option value="Residential">Residential</option>
          <option value="Commercial">Commercial</option>
          <option value="Mixed Use">Mixed Use</option>
          <option value="Industrial">Industrial</option>
        </select>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="font-extrabold text-slate-700">Ward</label>
        <input 
          type="text" 
          value={formData.ward} 
          onChange={(e) => onChange('ward', e.target.value)}
          className="p-2 bg-white border border-gray-200 rounded font-bold text-gray-800 outline-none focus:border-blue-500 text-[10px]" 
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="font-extrabold text-slate-700">Tax Zone</label>
        <input 
          type="text" 
          value={formData.zone} 
          onChange={(e) => onChange('zone', e.target.value)}
          className="p-2 bg-white border border-gray-200 rounded font-bold text-gray-800 outline-none focus:border-blue-500 text-[10px]" 
        />
      </div>
    </div>
  );
}

export function OwnerForm({ formData, onChange, errors = {} }: FormProps) {
  return (
    <div className="grid grid-cols-2 gap-4 text-[10px]">
      <div className="flex flex-col gap-1.5 col-span-2">
        <label className="font-extrabold text-slate-700">Owner Full Name <span className="text-red-500">*</span></label>
        <input 
          type="text" 
          value={formData.ownerName} 
          onChange={(e) => onChange('ownerName', e.target.value)}
          className={`p-2 bg-white border rounded font-bold text-gray-800 outline-none text-[10px] ${
            errors.ownerName ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
          }`} 
        />
        {errors.ownerName && <span className="text-red-500 font-extrabold text-[8px] mt-0.5">{errors.ownerName}</span>}
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="font-extrabold text-slate-700">Owner Holder Relationship</label>
        <input 
          type="text" 
          value={formData.ownerHolder} 
          onChange={(e) => onChange('ownerHolder', e.target.value)}
          className="p-2 bg-white border border-gray-200 rounded font-bold text-gray-800 outline-none text-[10px]" 
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="font-extrabold text-slate-700">Gender</label>
        <select 
          value={formData.gender} 
          onChange={(e) => onChange('gender', e.target.value)}
          className="p-2 bg-white border border-[#3b82f6]/20 rounded font-bold text-gray-800 outline-none text-[10px]"
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>
    </div>
  );
}

export function AddressForm({ formData, onChange }: FormProps) {
  return (
    <div className="grid grid-cols-2 gap-4 text-[10px]">
      <div className="flex flex-col gap-1.5">
        <label className="font-extrabold text-slate-700">Plot No.</label>
        <input 
          type="text" 
          value={formData.plotNo} 
          onChange={(e) => onChange('plotNo', e.target.value)}
          className="p-2 bg-white border border-gray-200 rounded font-bold text-gray-800 outline-none text-[10px]" 
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="font-extrabold text-slate-700">Flat / Shop No.</label>
        <input 
          type="text" 
          value={formData.flatNo} 
          onChange={(e) => onChange('flatNo', e.target.value)}
          className="p-2 bg-white border border-gray-200 rounded font-bold text-gray-800 outline-none text-[10px]" 
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="font-extrabold text-slate-700">Mouja Name</label>
        <input 
          type="text" 
          value={formData.mouja} 
          onChange={(e) => onChange('mouja', e.target.value)}
          className="p-2 bg-white border border-gray-200 rounded font-bold text-gray-800 outline-none text-[10px]" 
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="font-extrabold text-slate-700">Wing / Block</label>
        <input 
          type="text" 
          value={formData.wing} 
          onChange={(e) => onChange('wing', e.target.value)}
          className="p-2 bg-white border border-gray-200 rounded font-bold text-gray-800 outline-none text-[10px]" 
        />
      </div>
    </div>
  );
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
