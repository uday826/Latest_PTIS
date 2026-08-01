import React, { useState } from 'react';
import { FileEdit, X, RotateCcw, Check, CheckCircle2 } from 'lucide-react';
import { 
  KycForm, 
  PropertyForm, 
  OwnerForm, 
  AddressForm, 
  BuildingForm, 
  OldForm, 
  SocietyForm, 
  DiscountForm 
} from './EditPropertyForms';

export default function EditPropertyView({ onClose }: { onClose: () => void }) {
  const [activeSubTab, setActiveSubTab] = useState('kyc');
  const [formData, setFormData] = useState({
    aadhaar: '**** **** 9081',
    mobile: '9876543210',
    email: 'owner@property.com',
    pan: 'ABCDE1234F',
    upic: '1290082181',
    category: 'Residential',
    ward: 'Ward-04',
    zone: 'Zone-A',
    ownerName: 'Shri Balasaheb Thackeray',
    ownerHolder: 'Self',
    gender: 'Male',
    plotNo: '129',
    flatNo: 'Flat 101',
    mouja: 'Mouja A',
    wing: 'Wing B',
    floors: '3',
    constructionType: 'RCC',
    builtUpArea: '440.00',
    carpetArea: '400.00',
    oldPropId: 'OLD-PT-9012',
    oldRateableValue: '1620000',
    societyName: 'Gokuldham Co-op Society',
    registrationNo: 'REG-109281-B',
    exemptionType: 'Senior Citizen Exemption',
    exemptionPercent: '10'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handleReset = () => {
    setFormData({
      aadhaar: '**** **** 9081',
      mobile: '9876543210',
      email: 'owner@property.com',
      pan: 'ABCDE1234F',
      upic: '1290082181',
      category: 'Residential',
      ward: 'Ward-04',
      zone: 'Zone-A',
      ownerName: 'Shri Balasaheb Thackeray',
      ownerHolder: 'Self',
      gender: 'Male',
      plotNo: '129',
      flatNo: 'Flat 101',
      mouja: 'Mouja A',
      wing: 'Wing B',
      floors: '3',
      constructionType: 'RCC',
      builtUpArea: '440.00',
      carpetArea: '400.00',
      oldPropId: 'OLD-PT-9012',
      oldRateableValue: '1620000',
      societyName: 'Gokuldham Co-op Society',
      registrationNo: 'REG-109281-B',
      exemptionType: 'Senior Citizen Exemption',
      exemptionPercent: '10'
    });
    setErrors({});
  };

  const handleSave = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.ownerName.trim()) {
      newErrors.ownerName = 'Owner Name is required';
    }
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Mobile number must be a 10 digit number';
    }
    if (!formData.upic.trim()) {
      newErrors.upic = 'Property UPIC is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (newErrors.ownerName) setActiveSubTab('owner');
      else if (newErrors.mobile) setActiveSubTab('kyc');
      else if (newErrors.upic) setActiveSubTab('property');
      return;
    }

    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
      onClose();
    }, 2000);
  };

  const editTabs = [
    { id: 'kyc', label: 'KYC Details' },
    { id: 'property', label: 'Property Details' },
    { id: 'owner', label: 'Owner Details' },
    { id: 'address', label: 'Address Details' },
    { id: 'building', label: 'Building Details' },
    { id: 'old', label: 'Old Details' },
    { id: 'society', label: 'Society Details' },
    { id: 'discount', label: 'Discount Details' }
  ];

  return (
    <div className="flex flex-col h-full gap-3 font-sans animate-fadeIn select-none p-1">
      {showSuccessToast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[100] bg-green-600 text-white font-extrabold px-6 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-green-500 animate-slideDown">
          <CheckCircle2 size={16} />
          <span>Property changes saved successfully!</span>
        </div>
      )}

      <div className="flex items-center justify-between border-b border-gray-100 pb-2 shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-blue-50 text-blue-650 p-1.5 rounded-lg border border-blue-100">
            <FileEdit size={14} />
          </div>
          <div>
            <h2 className="font-extrabold text-[#1e2b58] text-[11px] uppercase tracking-wider leading-none">Edit Property Record</h2>
            <span className="text-slate-600 text-[8.5px] font-extrabold mt-1 block leading-none">Property ID / UPIC: {formData.upic}</span>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-655 font-extrabold hover:bg-gray-100 w-5 h-5 rounded-full flex items-center justify-center cursor-pointer transition-all"
        >
          <X size={12} />
        </button>
      </div>

      <div className="flex border-b border-gray-250 shrink-0 gap-1 overflow-x-auto no-scrollbar py-0.5">
        {editTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`px-3 py-1.5 rounded-t-lg font-extrabold text-[9px] uppercase tracking-wider transition-all cursor-pointer border-t border-l border-r -mb-[1px] ${
              activeSubTab === tab.id
                ? 'bg-[#002fbe] text-white border-[#002fbe] z-10'
                : 'bg-gray-50 text-slate-700 border-transparent hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-grow flex-1 min-h-0 overflow-y-auto border border-gray-200/60 rounded-xl p-4 bg-gray-50/50 flex flex-col gap-4">
        {activeSubTab === 'kyc' && <KycForm formData={formData} onChange={handleInputChange} errors={errors} />}
        {activeSubTab === 'property' && <PropertyForm formData={formData} onChange={handleInputChange} errors={errors} />}
        {activeSubTab === 'owner' && <OwnerForm formData={formData} onChange={handleInputChange} errors={errors} />}
        {activeSubTab === 'address' && <AddressForm formData={formData} onChange={handleInputChange} />}
        {activeSubTab === 'building' && <BuildingForm formData={formData} onChange={handleInputChange} />}
        {activeSubTab === 'old' && <OldForm formData={formData} onChange={handleInputChange} />}
        {activeSubTab === 'society' && <SocietyForm formData={formData} onChange={handleInputChange} />}
        {activeSubTab === 'discount' && <DiscountForm formData={formData} onChange={handleInputChange} />}
      </div>

      <div className="border-t border-gray-100 pt-2 shrink-0 flex items-center justify-end gap-2 text-[9px] font-extrabold select-none">
        <button 
          onClick={handleReset}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 bg-white cursor-pointer shadow-xs transition-colors"
        >
          <RotateCcw size={11} />
          <span>Reset</span>
        </button>
        <button 
          onClick={onClose}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-600 bg-white cursor-pointer shadow-xs transition-colors"
        >
          <span>Cancel</span>
        </button>
        <button 
          onClick={handleSave}
          className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-[#002fbe] hover:bg-[#002598] text-white border border-blue-650 cursor-pointer shadow-sm transition-colors"
        >
          <Check size={11} />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );
}
