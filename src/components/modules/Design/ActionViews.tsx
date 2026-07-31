"use client";

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Printer, 
  Download, 
  AlertTriangle, 
  History, 
  Calendar, 
  User, 
  MapPin, 
  RotateCcw, 
  FileEdit, 
  Plus, 
  X,
  Camera,
  Map,
  UserCheck,
  ShieldCheck,
  Link2,
  Wallet,
  Check,
  Eye,
  Info,
  Layers,
  Sparkles,
  ChevronLeft,
  Settings,
  Lock,
  Archive,
  Split,
  Merge,
  FileSpreadsheet
} from 'lucide-react';

interface ActionViewsProps {
  activeAction: string | null;
  setActiveAction: (action: string | null) => void;
}

export default function ActionViews({ activeAction, setActiveAction }: ActionViewsProps) {
  switch (activeAction) {
    case 'edit-property':
      return <EditPropertyView onClose={() => setActiveAction(null)} />;
    case 'print-card':
      return <PrintCardView onClose={() => setActiveAction(null)} />;
    case 'view-demand':
      return <ViewDemandView onClose={() => setActiveAction(null)} />;
    case 'view-collection':
      return <ViewCollectionView onClose={() => setActiveAction(null)} />;
    case 'generate-notice':
      return <GenerateNoticeView onClose={() => setActiveAction(null)} />;
    case 'property-history':
      return <PropertyHistoryView onClose={() => setActiveAction(null)} />;
    case 'download-gis':
      return <DownloadGisView onClose={() => setActiveAction(null)} />;
    case 'more-actions':
      return <MoreActionsView onClose={() => setActiveAction(null)} />;
    default:
      return null;
  }
}

/* ==========================================================================
   1. EDIT PROPERTY VIEW
   ========================================================================== */
function EditPropertyView({ onClose }: { onClose: () => void }) {
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
          <div className="bg-blue-50 text-blue-600 p-1.5 rounded-lg border border-blue-100">
            <FileEdit size={14} />
          </div>
          <div>
            <h2 className="font-extrabold text-[#1e2b58] text-[11px] uppercase tracking-wider leading-none">Edit Property Record</h2>
            <span className="text-gray-400 text-[8.5px] font-bold mt-1 block leading-none">Property ID / UPIC: {formData.upic}</span>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-650 font-extrabold hover:bg-gray-100 w-5 h-5 rounded-full flex items-center justify-center cursor-pointer transition-all"
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
                : 'bg-gray-50 text-gray-500 border-transparent hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Expanded Forms Content Wrapper */}
      <div className="flex-1 min-h-0 overflow-y-auto border border-gray-200/60 rounded-xl p-4 bg-gray-50/50 flex flex-col gap-4">
        {activeSubTab === 'kyc' && (
          <div className="grid grid-cols-2 gap-4 text-[10px]">
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-gray-500">Aadhaar Number (UID)</label>
              <input 
                type="text" 
                value={formData.aadhaar} 
                onChange={(e) => handleInputChange('aadhaar', e.target.value)}
                className="p-2 bg-white border border-gray-200 rounded font-bold text-gray-800 outline-none focus:border-blue-500 text-[10px]" 
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-gray-500">Mobile Number <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={formData.mobile} 
                onChange={(e) => handleInputChange('mobile', e.target.value)}
                className={`p-2 bg-white border rounded font-bold text-gray-800 outline-none text-[10px] ${
                  errors.mobile ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
                }`} 
              />
              {errors.mobile && <span className="text-red-500 font-extrabold text-[8px] mt-0.5">{errors.mobile}</span>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-gray-500">Email Address</label>
              <input 
                type="email" 
                value={formData.email} 
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="p-2 bg-white border border-gray-200 rounded font-bold text-gray-800 outline-none focus:border-blue-500 text-[10px]" 
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-gray-500">PAN Number</label>
              <input 
                type="text" 
                value={formData.pan} 
                onChange={(e) => handleInputChange('pan', e.target.value)}
                className="p-2 bg-white border border-gray-200 rounded font-bold text-gray-800 outline-none focus:border-blue-500 uppercase text-[10px]" 
              />
            </div>
          </div>
        )}

        {activeSubTab === 'property' && (
          <div className="grid grid-cols-2 gap-4 text-[10px]">
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-gray-500">Property ID / UPIC <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={formData.upic} 
                onChange={(e) => handleInputChange('upic', e.target.value)}
                className={`p-2 bg-white border rounded font-bold text-gray-800 outline-none text-[10px] ${
                  errors.upic ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
                }`} 
              />
              {errors.upic && <span className="text-red-500 font-extrabold text-[8px] mt-0.5">{errors.upic}</span>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-gray-500">Category</label>
              <select 
                value={formData.category} 
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="p-2 bg-white border border-gray-200 rounded font-bold text-gray-800 outline-none focus:border-blue-500 text-[10px]"
              >
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Mixed Use">Mixed Use</option>
                <option value="Industrial">Industrial</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-gray-500">Ward</label>
              <input 
                type="text" 
                value={formData.ward} 
                onChange={(e) => handleInputChange('ward', e.target.value)}
                className="p-2 bg-white border border-gray-200 rounded font-bold text-gray-800 outline-none focus:border-blue-500 text-[10px]" 
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-gray-500">Tax Zone</label>
              <input 
                type="text" 
                value={formData.zone} 
                onChange={(e) => handleInputChange('zone', e.target.value)}
                className="p-2 bg-white border border-gray-200 rounded font-bold text-gray-800 outline-none focus:border-blue-500 text-[10px]" 
              />
            </div>
          </div>
        )}

        {activeSubTab === 'owner' && (
          <div className="grid grid-cols-2 gap-4 text-[10px]">
            <div className="flex flex-col gap-1.5 col-span-2">
              <label className="font-bold text-gray-500">Owner Full Name <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={formData.ownerName} 
                onChange={(e) => handleInputChange('ownerName', e.target.value)}
                className={`p-2 bg-white border rounded font-bold text-gray-800 outline-none text-[10px] ${
                  errors.ownerName ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
                }`} 
              />
              {errors.ownerName && <span className="text-red-500 font-extrabold text-[8px] mt-0.5">{errors.ownerName}</span>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-gray-500">Owner Holder Relationship</label>
              <input 
                type="text" 
                value={formData.ownerHolder} 
                onChange={(e) => handleInputChange('ownerHolder', e.target.value)}
                className="p-2 bg-white border border-gray-200 rounded font-bold text-gray-800 outline-none text-[10px]" 
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-gray-500">Gender</label>
              <select 
                value={formData.gender} 
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="p-2 bg-white border border-[#3b82f6]/20 rounded font-bold text-gray-800 outline-none text-[10px]"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        )}

        {activeSubTab === 'address' && (
          <div className="grid grid-cols-2 gap-4 text-[10px]">
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-gray-500">Plot No.</label>
              <input 
                type="text" 
                value={formData.plotNo} 
                onChange={(e) => handleInputChange('plotNo', e.target.value)}
                className="p-2 bg-white border border-gray-200 rounded font-bold text-gray-800 outline-none text-[10px]" 
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-gray-500">Flat / Shop No.</label>
              <input 
                type="text" 
                value={formData.flatNo} 
                onChange={(e) => handleInputChange('flatNo', e.target.value)}
                className="p-2 bg-white border border-gray-200 rounded font-bold text-gray-800 outline-none text-[10px]" 
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-gray-500">Mouja Name</label>
              <input 
                type="text" 
                value={formData.mouja} 
                onChange={(e) => handleInputChange('mouja', e.target.value)}
                className="p-2 bg-white border border-gray-200 rounded font-bold text-gray-800 outline-none text-[10px]" 
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-gray-500">Wing / Block</label>
              <input 
                type="text" 
                value={formData.wing} 
                onChange={(e) => handleInputChange('wing', e.target.value)}
                className="p-2 bg-white border border-gray-200 rounded font-bold text-gray-800 outline-none text-[10px]" 
              />
            </div>
          </div>
        )}

        {activeSubTab === 'building' && (
          <div className="grid grid-cols-2 gap-4 text-[10px]">
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-gray-500">Total Floors</label>
              <input 
                type="number" 
                value={formData.floors} 
                onChange={(e) => handleInputChange('floors', e.target.value)}
                className="p-2 bg-white border border-gray-200 rounded font-bold text-gray-800 outline-none text-[10px]" 
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-gray-500">Construction Type</label>
              <input 
                type="text" 
                value={formData.constructionType} 
                onChange={(e) => handleInputChange('constructionType', e.target.value)}
                className="p-2 bg-white border border-gray-200 rounded font-bold text-gray-855 outline-none text-[10px]" 
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-gray-500">Built-Up Area (sq. ft.)</label>
              <input 
                type="text" 
                value={formData.builtUpArea} 
                onChange={(e) => handleInputChange('builtUpArea', e.target.value)}
                className="p-2 bg-white border border-gray-200 rounded font-bold text-gray-855 outline-none text-[10px]" 
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-gray-500">Carpet Area (sq. ft.)</label>
              <input 
                type="text" 
                value={formData.carpetArea} 
                onChange={(e) => handleInputChange('carpetArea', e.target.value)}
                className="p-2 bg-white border border-gray-200 rounded font-bold text-gray-855 outline-none text-[10px]" 
              />
            </div>
          </div>
        )}

        {activeSubTab === 'old' && (
          <div className="grid grid-cols-2 gap-4 text-[10px]">
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-gray-500">Old Property ID</label>
              <input 
                type="text" 
                value={formData.oldPropId} 
                onChange={(e) => handleInputChange('oldPropId', e.target.value)}
                className="p-2 bg-white border border-gray-200 rounded font-bold text-gray-800 outline-none text-[10px]" 
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-gray-500">Old Rateable Value (₹)</label>
              <input 
                type="text" 
                value={formData.oldRateableValue} 
                onChange={(e) => handleInputChange('oldRateableValue', e.target.value)}
                className="p-2 bg-white border border-gray-200 rounded font-bold text-gray-855 outline-none text-[10px]" 
              />
            </div>
          </div>
        )}

        {activeSubTab === 'society' && (
          <div className="grid grid-cols-2 gap-4 text-[10px]">
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-gray-500">Society Name</label>
              <input 
                type="text" 
                value={formData.societyName} 
                onChange={(e) => handleInputChange('societyName', e.target.value)}
                className="p-2 bg-white border border-gray-200 rounded font-bold text-gray-800 outline-none text-[10px]" 
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-gray-500">Society Registration Number</label>
              <input 
                type="text" 
                value={formData.registrationNo} 
                onChange={(e) => handleInputChange('registrationNo', e.target.value)}
                className="p-2 bg-white border border-gray-200 rounded font-bold text-gray-800 outline-none text-[10px]" 
              />
            </div>
          </div>
        )}

        {activeSubTab === 'discount' && (
          <div className="grid grid-cols-2 gap-4 text-[10px]">
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-gray-500">Exemption Category</label>
              <input 
                type="text" 
                value={formData.exemptionType} 
                onChange={(e) => handleInputChange('exemptionType', e.target.value)}
                className="p-2 bg-white border border-gray-200 rounded font-bold text-gray-800 outline-none text-[10px]" 
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-gray-500">Exemption Value (%)</label>
              <input 
                type="text" 
                value={formData.exemptionPercent} 
                onChange={(e) => handleInputChange('exemptionPercent', e.target.value)}
                className="p-2 bg-white border border-gray-205 rounded font-bold text-gray-855 outline-none text-[10px]" 
              />
            </div>
          </div>
        )}
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
          className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-[#002fbe] hover:bg-[#002598] text-white border border-blue-600 cursor-pointer shadow-sm transition-colors"
        >
          <Check size={11} />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );
}

/* ==========================================================================
   2. PRINT PROPERTY CARD VIEW (EXPANDED TO FULL WIDTH AND HEIGH VIEWPORT)
   ========================================================================== */
function PrintCardView({ onClose }: { onClose: () => void }) {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    setDownloading(true);
    setDownloadSuccess(false);
    setTimeout(() => {
      setDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2000);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full gap-2 font-sans animate-fadeIn p-1">
      <div className="flex items-center justify-between border-b border-gray-150 pb-1.5 shrink-0 select-none">
        <div className="flex items-center gap-1.5">
          <div className="bg-green-50 text-green-600 p-1 rounded border border-green-100">
            <Printer size={13} />
          </div>
          <h2 className="font-extrabold text-[#1e2b58] text-[10px] uppercase tracking-wider">Property Card Print Preview</h2>
        </div>
        <div className="flex items-center gap-1.5">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-1 px-2.5 py-1 bg-[#ecfdf5] hover:bg-[#d1fae5] text-[#10b981] border border-[#10b981]/25 text-[8.5px] font-black rounded cursor-pointer transition-all shadow-xs"
          >
            <Printer size={11} />
            <span>Print</span>
          </button>
          <button 
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-1 px-2.5 py-1 bg-[#eff6ff] hover:bg-[#dbeafe] text-[#3b82f6] border border-[#3b82f6]/25 text-[8.5px] font-black rounded cursor-pointer transition-all shadow-xs disabled:opacity-50"
          >
            <Download size={11} />
            <span>{downloading ? 'Downloading...' : 'Download PDF'}</span>
          </button>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 font-extrabold hover:bg-gray-100 w-5 h-5 rounded-full flex items-center justify-center cursor-pointer transition-all"
          >
            <X size={11} />
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[100] bg-green-600 text-white font-extrabold px-6 py-2 rounded-xl shadow-2xl flex items-center gap-2 border border-green-500 animate-slideDown text-[9px]">
          <CheckCircle2 size={13} />
          <span>PDF Download started successfully!</span>
        </div>
      )}

      {/* Expanded full width & height scroll area */}
      <div className="flex-1 min-h-0 overflow-y-auto border border-gray-250 bg-gray-100 p-6 rounded-xl relative select-none flex justify-center">
        <div 
          className="w-full bg-white border border-gray-300 shadow-md p-8 font-sans text-gray-850 flex flex-col gap-5 relative max-w-[820px] transition-all"
          id="print-sheet-content"
          style={{ minHeight: '520px' }}
        >
          <div className="absolute inset-0 bg-transparent flex items-center justify-center pointer-events-none opacity-[0.03]">
            <img src="/ulb_logo.png" alt="ULB Logo Watermark" className="w-48 h-48 object-contain" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
          </div>          <div className="flex justify-between items-start border-b border-gray-300 pb-2.5">
            <div className="flex gap-2.5 items-center">
              <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center font-black text-[#002fbe] text-[18px]">
                N
              </div>
              <div>
                <h1 className="font-extrabold text-[#1e2b58] text-[13px] uppercase tracking-wider leading-tight">Nagpur Municipal Corporation</h1>
                <p className="text-[#002fbe] font-extrabold text-[9px] mt-0.5 uppercase tracking-wider">Property Tax Assessment Department</p>
              </div>
            </div>
            <div className="text-right text-[8.5px] font-black text-slate-700 leading-tight">
              <p>DATE: {new Date().toLocaleDateString('en-GB')}</p>
              <p>REF NO: NMC-PT-2026-908A</p>
            </div>
          </div>

          <div className="bg-[#eff6ff] border border-blue-200/50 text-[#002fbe] p-1.5 text-center font-black uppercase text-[10px] rounded tracking-wider shadow-2xs">
            Official Property Register Card
          </div>

          <div className="grid grid-cols-3 gap-x-5 gap-y-3 border-b border-gray-150 pb-4">
            <div>
              <span className="text-slate-700 font-extrabold block mb-0.5 uppercase text-[8.5px]">Property ID / UPIC</span>
              <span className="font-black text-[#002fbe] text-[11.5px]">1290082181</span>
            </div>
            <div>
              <span className="text-slate-700 font-extrabold block mb-0.5 uppercase text-[8.5px]">Tax Zone</span>
              <span className="font-black text-gray-900 text-[10px]">Zone-A (Nishigandha)</span>
            </div>
            <div>
              <span className="text-slate-700 font-extrabold block mb-0.5 uppercase text-[8.5px]">Ward & Mouja</span>
              <span className="font-black text-gray-900 text-[10px]">Ward-04, Mouja A</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5 border-b border-gray-150 pb-4">
            <div>
              <h3 className="font-black text-[#1e2b58] mb-2 uppercase text-[9px] tracking-wider">Owner Details</h3>
              <div className="space-y-1.5 font-bold text-slate-800 text-[10px]">
                <p>NAME: <span className="font-black text-slate-900">Shri Balasaheb Thackeray</span></p>
                <p>RELATION: <span className="font-extrabold text-slate-800">Self (Holder)</span></p>
                <p>AADHAAR: <span className="font-extrabold text-slate-800">**** **** 9081</span></p>
              </div>
            </div>
            <div>
              <h3 className="font-black text-[#1e2b58] mb-2 uppercase text-[9px] tracking-wider">Property Location</h3>
              <div className="space-y-1.5 font-bold text-slate-800 text-[10px]">
                <p>PLOT NO: <span className="font-extrabold text-slate-800">Plot No. 129</span></p>
                <p>BUILDING: <span className="font-extrabold text-slate-800">Wing B, Flat 101</span></p>
                <p>SOCIETY: <span className="font-extrabold text-slate-800">Gokuldham Co-op Society</span></p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-x-5 gap-y-3 border-b border-gray-150 pb-4">
            <div>
              <span className="text-slate-700 font-extrabold block mb-0.5 uppercase text-[8.5px]">Property Usage</span>
              <span className="font-black text-gray-900 text-[10.5px]">निवासी (Residential)</span>
            </div>
            <div>
              <span className="text-slate-700 font-extrabold block mb-0.5 uppercase text-[8.5px]">Built-up Area</span>
              <span className="font-black text-gray-900 text-[10.5px]">440.00 m²</span>
            </div>
            <div>
              <span className="text-slate-700 font-extrabold block mb-0.5 uppercase text-[8.5px]">Carpet Area</span>
              <span className="font-black text-gray-900 text-[10.5px]">400.00 m²</span>
            </div>
            <div>
              <span className="text-slate-700 font-extrabold block mb-0.5 uppercase text-[8.5px]">Rateable Value (RV)</span>
              <span className="font-black text-[#002fbe] text-[11.5px]">₹18,45,000</span>
            </div>
            <div>
              <span className="text-slate-700 font-extrabold block mb-0.5 uppercase text-[8.5px]">Capital Value (CV)</span>
              <span className="font-black text-[#002fbe] text-[11.5px]">₹36,90,000</span>
            </div>
            <div>
              <span className="text-slate-700 font-extrabold block mb-0.5 uppercase text-[8.5px]">Annual Tax (Current)</span>
              <span className="font-black text-green-700 text-[11.5px]">₹18,752</span>
            </div>
          </div>

          <div className="flex justify-between items-end mt-auto pt-4 border-t border-dashed border-gray-300">
            <div className="space-y-1 font-semibold text-gray-500 text-[8.5px] leading-relaxed">
              <p>GIS COORDINATES: 19.0760° N, 72.8777° E</p>
              <p className="text-gray-400 font-bold">Scan QR Code at the right to verify registration authenticity.</p>
              <p className="font-bold text-[#002fbe] uppercase text-[7.5px]">Nagpur Municipal Digital Assessment Registry</p>
            </div>
            <div className="flex flex-col items-center gap-1 shrink-0 bg-white border border-gray-200 p-1.5 rounded shadow-2xs">
              <div className="w-18 h-18 bg-gray-100 flex items-center justify-center font-bold text-gray-450 border border-gray-250 rounded text-[7.5px] text-center select-none relative">
                <span className="block absolute text-[8.5px] font-black text-gray-300">QR SCAN</span>
                <div className="w-12 h-12 border border-gray-400/30 flex flex-wrap gap-0.5 justify-center items-center opacity-65">
                  <div className="w-3.5 h-3.5 bg-gray-800 rounded-2xs" />
                  <div className="w-3.5 h-3.5 bg-gray-800 rounded-2xs" />
                  <div className="w-3.5 h-3.5 bg-gray-800 rounded-2xs" />
                  <div className="w-3.5 h-3.5 bg-gray-800 rounded-2xs" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   3. VIEW DEMAND VIEW
   ========================================================================== */
function ViewDemandView({ onClose }: { onClose: () => void }) {
  const [selectedYear, setSelectedYear] = useState('2026-27');

  const demandDataMap: Record<string, any> = {
    '2026-27': {
      status: 'Paid',
      statusColor: 'bg-green-50 text-green-700 border-green-200',
      dueDate: '31-Dec-2026',
      values: {
        current: '18,752', arrears: '0', general: '10,800', water: '2,160',
        education: '1,080', fire: '3,240', other: '1,472', penalty: '0',
        discount: '1,875', total: '16,877'
      }
    },
    '2025-26': {
      status: 'Paid',
      statusColor: 'bg-green-50 text-green-700 border-green-200',
      dueDate: '31-Dec-2025',
      values: {
        current: '17,250', arrears: '0', general: '9,900', water: '1,980',
        education: '990', fire: '2,980', other: '1,400', penalty: '0',
        discount: '1,725', total: '15,525'
      }
    },
    '2024-25': {
      status: 'Partially Paid',
      statusColor: 'bg-orange-50 text-orange-700 border-orange-200',
      dueDate: '31-Dec-2024',
      values: {
        current: '16,200', arrears: '6,480', general: '9,300', water: '1,860',
        education: '930', fire: '2,810', other: '1,300', penalty: '1,080',
        discount: '0', total: '23,760'
      }
    },
    '2023-24': {
      status: 'Outstanding',
      statusColor: 'bg-red-50 text-red-700 border-red-200',
      dueDate: '31-Dec-2023',
      values: {
        current: '15,000', arrears: '15,000', general: '8,600', water: '1,725',
        education: '860', fire: '2,580', other: '1,235', penalty: '3,000',
        discount: '0', total: '33,000'
      }
    }
  };

  const activeDemand = demandDataMap[selectedYear] || demandDataMap['2026-27'];

  return (
    <div className="flex flex-col h-full gap-3 font-sans animate-fadeIn p-1">
      <div className="flex items-center justify-between border-b border-gray-100 pb-2 shrink-0 select-none">
        <div className="flex items-center gap-1.5">
          <div className="bg-purple-50 text-purple-600 p-1.5 rounded-lg border border-purple-100">
            <FileText size={14} />
          </div>
          <div>
            <h2 className="font-extrabold text-[#1e2b58] text-[11px] uppercase tracking-wider leading-none">Property Assessment Demand Details</h2>
            <span className="text-gray-400 text-[8.5px] font-bold mt-1 block leading-none">Property ID: 1290082181</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="font-bold text-gray-500 text-[9px] uppercase tracking-wider">Financial Year:</label>
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(e.target.value)}
            className="p-1 bg-white border border-[#8b5cf6]/20 rounded font-bold text-gray-800 text-[9px] outline-none"
          >
            <option value="2026-27">2026-27 (Current)</option>
            <option value="2025-26">2025-26</option>
            <option value="2024-25">2024-25</option>
            <option value="2023-24">2023-24</option>
          </select>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 font-extrabold hover:bg-gray-100 w-5 h-5 rounded-full flex items-center justify-center cursor-pointer transition-all"
          >
            <X size={12} />
          </button>
        </div>
      </div>

      {/* Expanded Scroll Wrapper */}
      <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-4">
        <div className="grid grid-cols-4 gap-2.5 shrink-0 select-none">
          <div className="bg-white border border-[#8b5cf6]/25 rounded-lg p-3.5 flex flex-col gap-0.5 shadow-sm text-center">
            <span className="text-slate-700 font-black text-[8px] uppercase tracking-wider">Current Demand</span>
            <span className="font-black text-[#1e2b58] text-[15px] tabular-nums mt-0.5">₹{activeDemand.values.current}</span>
          </div>
          <div className="bg-white border border-[#8b5cf6]/25 rounded-lg p-3.5 flex flex-col gap-0.5 shadow-sm text-center">
            <span className="text-slate-700 font-black text-[8px] uppercase tracking-wider">Arrears Pending</span>
            <span className={`font-black text-[15px] tabular-nums mt-0.5 ${
              activeDemand.values.arrears !== '0' ? 'text-red-650' : 'text-slate-900'
            }`}>₹{activeDemand.values.arrears}</span>
          </div>
          <div className="bg-[#8b5cf6]/5 border border-[#8b5cf6]/20 rounded-lg p-3.5 flex flex-col gap-0.5 shadow-sm text-center">
            <span className="text-[#8b5cf6] font-black text-[8px] uppercase tracking-wider">Total Payable</span>
            <span className="font-black text-[#8b5cf6] text-[16px] tabular-nums mt-0.5">₹{activeDemand.values.total}</span>
          </div>
          <div className="bg-white border border-[#8b5cf6]/25 rounded-lg p-3.5 flex flex-col justify-center items-center gap-1.5 shadow-sm">
            <span className="text-slate-700 font-black text-[8px] uppercase tracking-wider leading-none">Demand Status</span>
            <span className={`px-3 py-1 rounded-full border text-[8.5px] font-extrabold leading-none ${activeDemand.statusColor}`}>
              {activeDemand.status}
            </span>
          </div>
        </div>

        <div className="bg-white border border-[#8b5cf6]/20 rounded-xl overflow-hidden shadow-sm flex flex-col flex-1 min-h-[180px]">
          <div className="bg-gray-50 border-b border-gray-150 px-3.5 py-2 font-extrabold text-[#1e2b58] text-[9.5px] uppercase tracking-wider select-none flex justify-between">
            <span>Tax Component Breakdown</span>
            <span>Due Date: {activeDemand.dueDate}</span>
          </div>
          <div className="p-4 text-[9.5px] leading-relaxed space-y-2 flex-grow flex flex-col justify-between font-bold text-gray-700">
            <div className="flex justify-between border-b border-gray-100 pb-1.5">
              <span className="text-[#1e2b58] font-black">General Tax (सामान्य कर)</span>
              <span className="text-gray-900 font-black tabular-nums">₹{activeDemand.values.general}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-1.5">
              <span className="text-blue-700 font-black">Water Tax (जल पट्टी)</span>
              <span className="text-gray-900 font-black tabular-nums">₹{activeDemand.values.water}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-1.5">
              <span className="text-purple-700 font-black">Education Tax (शिक्षण कर)</span>
              <span className="text-gray-900 font-black tabular-nums">₹{activeDemand.values.education}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-1.5">
              <span className="text-red-700 font-black">Fire Tax (अग्निशमन कर)</span>
              <span className="text-gray-900 font-black tabular-nums">₹{activeDemand.values.fire}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-1.5">
              <span className="text-orange-700 font-black">Other Tax Components</span>
              <span className="text-gray-900 font-black tabular-nums">₹{activeDemand.values.other}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-1.5">
              <span className="text-amber-700 font-black">Penalty & Interest</span>
              <span className="text-red-600 font-black tabular-nums">+ ₹{activeDemand.values.penalty}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-1.5">
              <span className="text-green-700 font-black">Early Bird Discount / Exemption</span>
              <span className="text-green-600 font-black tabular-nums">- ₹{activeDemand.values.discount}</span>
            </div>
            <div className="flex justify-between text-[11px] font-black text-gray-955 pt-1.5 uppercase tracking-wider">
              <span>Total Calculated Demand</span>
              <span className="text-[#8b5cf6]">₹{activeDemand.values.total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   4. VIEW COLLECTION VIEW
   ========================================================================== */
function ViewCollectionView({ onClose }: { onClose: () => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const paymentRecords = [
    { receipt: 'REC-2026-908A', date: '05-May-2024', year: '2026-27', mode: 'Net Banking', txn: 'TXN-8817281', amount: '12,456', status: 'Completed', collector: 'Manoj Shinde' },
    { receipt: 'REC-2025-102C', date: '10-Jun-2023', year: '2025-26', mode: 'UPI (GPay)', txn: 'TXN-902811A', amount: '15,525', status: 'Completed', collector: 'R. K. Patil' },
    { receipt: 'REC-2024-889B', date: '18-Aug-2022', year: '2024-25', mode: 'Credit Card', txn: 'TXN-110298B', amount: '23,760', status: 'Completed', collector: 'Self Portal' },
    { receipt: 'REC-2023-401X', date: '20-Nov-2021', year: '2023-24', mode: 'Cheque', txn: 'TXN-99827C', amount: '15,000', status: 'Pending', collector: 'A. R. Sharma' }
  ];

  const filteredRecords = paymentRecords.filter(rec => {
    const matchesSearch = rec.receipt.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          rec.txn.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = selectedYear === 'All' || rec.year === selectedYear;
    const matchesStatus = selectedStatus === 'All' || rec.status === selectedStatus;
    return matchesSearch && matchesYear && matchesStatus;
  });

  return (
    <div className="flex flex-col h-full gap-3 font-sans animate-fadeIn p-1">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 shrink-0 select-none">
        <div className="flex items-center gap-2">
          <div className="bg-[#eff6ff] text-[#002fbe] p-2 rounded-xl border border-blue-100 shadow-xs">
            <Wallet size={16} />
          </div>
          <div>
            <h2 className="font-extrabold text-[#1e2b58] text-xs uppercase tracking-wider leading-none">Property Collection & Payment History</h2>
            <span className="text-gray-400 text-[9px] font-semibold mt-1 block leading-none">Property ID: 1290082181</span>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 font-extrabold hover:bg-gray-150 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-all active:scale-95"
        >
          <X size={14} />
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap lg:flex-nowrap gap-3 shrink-0 select-none text-[9.5px] font-bold text-gray-550 bg-white border border-gray-200/80 p-3.5 rounded-xl items-center shadow-xs">
        <div className="flex-1 min-w-[200px] flex flex-col gap-1.5">
          <span className="text-gray-450 uppercase tracking-wider text-[8px] font-extrabold">Search Receipt/Txn</span>
          <input 
            type="text" 
            placeholder="Search by Receipt or Transaction ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-1.5 px-3 bg-gray-50/50 border border-gray-200 focus:border-[#002fbe]/40 rounded-lg text-[10px] font-semibold text-gray-800 outline-none transition-colors" 
          />
        </div>
        <div className="flex flex-col gap-1.5 w-full sm:w-32">
          <span className="text-gray-455 uppercase tracking-wider text-[8px] font-extrabold">Filter Year</span>
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full py-1.5 px-2 bg-gray-50/50 border border-gray-200 focus:border-[#002fbe]/40 rounded-lg text-[10px] font-semibold text-gray-800 outline-none transition-colors cursor-pointer"
          >
            <option value="All">All Years</option>
            <option value="2026-27">2026-27</option>
            <option value="2025-26">2025-26</option>
            <option value="2024-25">2024-25</option>
            <option value="2023-24">2023-24</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5 w-full sm:w-36">
          <span className="text-gray-455 uppercase tracking-wider text-[8px] font-extrabold">Filter Payment Status</span>
          <select 
            value={selectedStatus} 
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full py-1.5 px-2 bg-gray-50/50 border border-gray-200 focus:border-[#002fbe]/40 rounded-lg text-[10px] font-semibold text-gray-800 outline-none transition-colors cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Modern Table Container */}
      <div className="flex-grow flex-1 min-h-[220px] overflow-x-auto overflow-y-auto border border-gray-200 rounded-xl relative shadow-xs bg-white table-scroll-container">
        <table className="w-full text-[9px] text-center border-collapse table-auto">
          <thead>
            <tr className="bg-[#1e2b58] text-white font-extrabold uppercase text-[8px] tracking-wider sticky top-0 z-20 whitespace-nowrap">
              <th className="py-3 px-3 text-left font-black border-r border-white/10">Receipt No</th>
              <th className="py-3 px-3 font-black border-r border-white/10">Date</th>
              <th className="py-3 px-3 font-black border-r border-white/10">FY</th>
              <th className="py-3 px-3 font-black border-r border-white/10">Mode</th>
              <th className="py-3 px-3 font-black border-r border-white/10">Txn ID</th>
              <th className="py-3 px-3 font-black border-r border-white/10">Paid Amount (₹)</th>
              <th className="py-3 px-3 font-black border-r border-white/10">Status</th>
              <th className="py-3 px-3 font-black border-r border-white/10">Collector</th>
              <th className="py-3 px-3 font-black">Actions</th>
            </tr>
          </thead>
          <tbody className="font-extrabold text-slate-800 whitespace-nowrap text-[9.5px]">
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-500 font-extrabold">
                  No payment collection records found.
                </td>
              </tr>
            ) : (
              filteredRecords.map((rec, i) => (
                <tr key={i} className="hover:bg-slate-50/50 border-b border-gray-150 transition-colors">
                  <td className="py-3 px-3 text-left text-blue-700 font-black border-r border-gray-150/40">{rec.receipt}</td>
                  <td className="py-3 px-3 border-r border-gray-150/40 text-slate-700 font-extrabold">{rec.date}</td>
                  <td className="py-3 px-3 border-r border-gray-150/40 font-black text-slate-900">{rec.year}</td>
                  <td className="py-3 px-3 border-r border-gray-150/40 text-slate-700 font-extrabold">{rec.mode}</td>
                  <td className="py-3 px-3 border-r border-gray-150/40 text-slate-800 font-mono font-bold text-[9.5px]">{rec.txn}</td>
                  <td className="py-3 px-3 border-r border-gray-150/40 font-black text-slate-900 tabular-nums text-[10.5px]">₹{rec.amount}</td>
                  <td className="py-3 px-3 border-r border-gray-150/40">
                    <span className={`px-2.5 py-0.5 border rounded-full text-[9.5px] font-black shadow-xs ${
                      rec.status === 'Completed'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200/50'
                        : 'bg-amber-50 text-amber-800 border-amber-200/50'
                    }`}>
                      {rec.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 border-r border-gray-150/40 text-slate-700 font-extrabold">{rec.collector}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center justify-center gap-1.5">
                      <button 
                        onClick={() => alert(`Viewing receipt: ${rec.receipt}`)}
                        className="w-6 h-6 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-xs cursor-pointer active:scale-95"
                        title="View Receipt"
                      >
                        <Eye size={12} />
                      </button>
                      <button 
                        onClick={() => alert(`Printing receipt: ${rec.receipt}`)}
                        className="w-6 h-6 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-xs cursor-pointer active:scale-95"
                        title="Print Receipt"
                      >
                        <Printer size={12} />
                      </button>
                      <button 
                        onClick={() => alert(`Downloading receipt PDF: ${rec.receipt}`)}
                        className="w-6 h-6 flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-xs cursor-pointer active:scale-95"
                        title="Download Receipt"
                      >
                        <Download size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ==========================================================================
   5. GENERATE NOTICE VIEW
   ========================================================================== */
function GenerateNoticeView({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    noticeType: 'Tax Demand Notice (Form-G)',
    financialYear: '2026-27',
    noticeLang: 'Marathi',
    noticeDate: new Date().toLocaleDateString('en-GB'),
    dueDate: '31-Aug-2026',
    demandAmount: '16,877',
    remarks: 'Immediate tax payment notice regarding residential assessment ID 1290082181.'
  });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleGenerateClick = () => {
    setConfirmOpen(true);
  };

  const handleFinalConfirm = () => {
    setConfirmOpen(false);
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full gap-3 font-sans animate-fadeIn p-1">
      {showSuccessToast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[100] bg-green-600 text-white font-extrabold px-6 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-green-500 animate-slideDown text-[9px]">
          <CheckCircle2 size={14} />
          <span>Notice has been generated and queued successfully!</span>
        </div>
      )}

      {confirmOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[990]" onClick={() => setConfirmOpen(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[999] bg-white border border-gray-200 rounded-xl shadow-2xl p-4 w-[340px] flex flex-col gap-3 font-sans text-center">
            <div className="w-9 h-9 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-500 mx-auto">
              <AlertTriangle size={18} />
            </div>
            <h3 className="font-extrabold text-[#1e2b58] text-[10.5px] uppercase tracking-wider">Confirm Notice Generation</h3>
            <p className="text-gray-455 font-bold text-[8.5px] leading-relaxed">
              Are you sure you want to generate this official Notice for Property ID 1290082181? This action will file a record in the municipal database.
            </p>
            <div className="flex gap-2 text-[8.5px] font-extrabold mt-1">
              <button 
                onClick={() => setConfirmOpen(false)}
                className="flex-1 py-1.5 border border-gray-200 hover:bg-gray-50 text-gray-600 bg-white rounded cursor-pointer transition-colors shadow-2xs"
              >
                Cancel
              </button>
              <button 
                onClick={handleFinalConfirm}
                className="flex-1 py-1.5 bg-[#ef4444] hover:bg-[#dc2626] text-white border border-red-600 rounded cursor-pointer transition-colors shadow-xs"
              >
                Generate Notice
              </button>
            </div>
          </div>
        </>
      )}

      <div className="flex items-center justify-between border-b border-gray-100 pb-2 shrink-0 select-none">
        <div className="flex items-center gap-1.5">
          <div className="bg-red-50 text-red-655 p-1.5 rounded-lg border border-red-100">
            <FileText size={14} />
          </div>
          <div>
            <h2 className="font-extrabold text-[#1e2b58] text-[11px] uppercase tracking-wider leading-none">Generate Compliance Notice</h2>
            <span className="text-gray-400 text-[8.5px] font-bold mt-1 block leading-none">Property ID: 1290082181</span>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-650 font-extrabold hover:bg-gray-100 w-5 h-5 rounded-full flex items-center justify-center cursor-pointer transition-all"
        >
          <X size={12} />
        </button>
      </div>

      {/* Expanded Split Viewport Panel */}
      <div className="flex-1 min-h-0 overflow-hidden flex gap-4">
        {/* Parameters Form */}
        <div className="w-[200px] shrink-0 overflow-y-auto pr-1.5 flex flex-col gap-3 text-[10px] font-black text-slate-800 uppercase tracking-wider select-none">
          <div className="flex flex-col gap-1">
            <label className="text-blue-900 font-extrabold">Notice Type</label>
            <select 
              value={formData.noticeType} 
              onChange={(e) => setFormData(prev => ({ ...prev, noticeType: e.target.value }))}
              className="p-1.5 bg-white border border-gray-300 rounded font-extrabold text-slate-900 outline-none text-[9.5px]"
            >
              <option value="Tax Demand Notice (Form-G)">Tax Demand Notice (Form-G)</option>
              <option value="Arrears Demarcation Warning">Arrears Demarcation Warning</option>
              <option value="Mutation Registry Clearance">Mutation Registry Clearance</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-blue-900 font-extrabold">Language</label>
            <select 
              value={formData.noticeLang} 
              onChange={(e) => setFormData(prev => ({ ...prev, noticeLang: e.target.value }))}
              className="p-1.5 bg-white border border-gray-300 rounded font-extrabold text-slate-900 outline-none text-[9.5px]"
            >
              <option value="Marathi">Marathi (मराठी)</option>
              <option value="English">English</option>
              <option value="Hindi">Hindi (हिंदी)</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-blue-900 font-extrabold">Financial Year</label>
            <input 
              type="text" 
              value={formData.financialYear} 
              onChange={(e) => setFormData(prev => ({ ...prev, financialYear: e.target.value }))}
              className="p-1.5 bg-white border border-gray-300 rounded font-extrabold text-slate-900 outline-none text-[9.5px]" 
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-blue-900 font-extrabold">Due Date</label>
            <input 
              type="text" 
              value={formData.dueDate} 
              onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              className="p-1.5 bg-white border border-gray-300 rounded font-extrabold text-slate-900 outline-none text-[9.5px]" 
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-blue-900 font-extrabold">Demand Amount (₹)</label>
            <input 
              type="text" 
              value={formData.demandAmount} 
              onChange={(e) => setFormData(prev => ({ ...prev, demandAmount: e.target.value }))}
              className="p-1.5 bg-white border border-gray-300 rounded font-extrabold text-slate-900 outline-none text-[9.5px] tabular-nums" 
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-blue-900 font-extrabold">Remarks</label>
            <textarea 
              rows={3} 
              value={formData.remarks} 
              onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
              className="p-1.5 bg-white border border-gray-300 rounded font-extrabold text-slate-900 outline-none text-[9.5px] resize-none" 
            />
          </div>
        </div>

        {/* Live Preview Paper Card - Expanded width and zoom text */}
        <div className="flex-1 border border-slate-300 rounded-xl bg-slate-200 p-4 overflow-y-auto relative shadow-inner flex justify-center">
          <div className="bg-white border border-gray-300 shadow p-6 font-sans text-gray-800 flex flex-col gap-4 text-[10px] w-full max-w-[580px] min-h-[380px] select-none">
            <div className="flex justify-between items-start border-b border-gray-200 pb-2">
              <div className="font-extrabold text-[#1e2b58] uppercase text-[9px] leading-tight">
                NAGPUR MUNICIPAL CORPORATION
                <p className="text-slate-600 font-bold text-[7px] mt-0.5">Assessment & Collection Cell</p>
              </div>
              <div className="text-right text-slate-700 text-[8px] leading-normal font-bold">
                <p>DATE: {formData.noticeDate}</p>
                <p>FORM-G REGISTRY</p>
              </div>
            </div>
            
            <div className="text-center font-black uppercase text-[#ef4444] text-[10.5px] py-1 bg-red-50 border border-red-200 rounded tracking-wider">
              {formData.noticeType}
            </div>

            <div className="space-y-2.5 font-semibold leading-relaxed text-gray-700 text-[10.5px]">
              <p>To,</p>
              <p className="font-black text-gray-800">Shri Balasaheb Thackeray</p>
              <p>Address: <span className="font-bold text-gray-800">Plot No. 129, Wing B, Flat 101, Nagpur.</span></p>
              
              <p className="pt-2 border-t border-gray-100">
                {formData.noticeLang === 'Marathi' ? (
                  <span>आपल्याला सूचित करण्यात येते की आपल्या मालमत्ता ID <span className="font-bold text-gray-900">1290082181</span> ची कर थकबाकी वर्ष <span className="font-bold text-gray-900">{formData.financialYear}</span> साठी एकूण <span className="font-black text-[#ef4444]">₹{formData.demandAmount}</span> आहे. कृपया सदर रक्कम दिनांक <span className="font-bold text-gray-900">{formData.dueDate}</span> च्या आत जमा करावी.</span>
                ) : (
                  <span>This is to officially notify you that property tax arrears for Property UPIC ID <span className="font-bold text-gray-900">1290082181</span> for Financial Year <span className="font-bold text-gray-900">{formData.financialYear}</span> calculations evaluate to a payable demand of <span className="font-black text-[#ef4444]">₹{formData.demandAmount}</span>. Payment is due by <span className="font-bold text-gray-900">{formData.dueDate}</span>.</span>
                )}
              </p>
              
              <p className="text-slate-700 border-t border-gray-150 pt-2 italic font-black">
                REMARKS: {formData.remarks}
              </p>
            </div>

            <div className="mt-auto pt-2.5 border-t border-dashed border-gray-200 flex justify-between items-center text-[7.5px] text-gray-400 font-bold uppercase">
              <span>NMC Registry Authority</span>
              <span>Scan QR to pay online</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-2 shrink-0 flex items-center justify-end gap-2 text-[8.5px] font-extrabold select-none">
        <button 
          onClick={onClose}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 bg-white cursor-pointer shadow-xs transition-all"
        >
          <span>Cancel</span>
        </button>
        <button 
          onClick={() => alert('Printing Notice preview document...')}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#ef4444]/25 hover:bg-red-50 text-red-655 bg-white cursor-pointer shadow-xs transition-all"
        >
          <Printer size={11} />
          <span>Print Notice</span>
        </button>
        <button 
          onClick={() => alert('Downloading Notice PDF document...')}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#ef4444]/25 hover:bg-red-50 text-red-655 bg-white cursor-pointer shadow-xs transition-all"
        >
          <Download size={11} />
          <span>Download PDF</span>
        </button>
        <button 
          onClick={handleGenerateClick}
          className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-[#ef4444] hover:bg-[#dc2626] text-white border border-red-600 cursor-pointer shadow-sm transition-all animate-pulse"
        >
          <span>Generate Notice</span>
        </button>
      </div>
    </div>
  );
}

/* ==========================================================================
   6. PROPERTY HISTORY TIMELINE VIEW (EXPANDED TO FULL HEIGHT)
   ========================================================================== */
function PropertyHistoryView({ onClose }: { onClose: () => void }) {
  const [selectedAudit, setSelectedAudit] = useState<string | null>(null);

  const historyEvents = [
    { id: 'created', title: 'Property Registry Created', date: '10-Jan-2024 10:00', icon: <Plus size={11} />, desc: 'Property added to Nagpur municipal data registry.' },
    { id: 'geo', title: 'Geo-Sequencing Verified', date: '15-Jan-2024 16:30', icon: <Map size={11} />, desc: 'GIS Coordinates matched successfully.' },
    { id: 'survey', title: 'Property Survey Audit Completed', date: '10-Feb-2024 14:15', icon: <Eye size={11} />, desc: 'Physical inspector completed measurements check.' },
    { id: 'verified', title: 'Tax Record Verified', date: '20-Feb-2024 11:20', icon: <UserCheck size={11} />, desc: 'Registry documents and ownership deeds audited.' },
    { id: 'assessed', title: 'Tax Assessment Processed', date: '01-Apr-2024 18:00', icon: <FileText size={11} />, desc: 'Rateable value assessment calculated.' },
    { id: 'approved', title: 'Assessment Board Approved', date: '20-Apr-2024 10:45', icon: <CheckCircle2 size={11} />, desc: 'Board commission signed final approval log.' },
    { id: 'collected', title: 'Payment Collection Logged', date: '05-May-2024 15:30', icon: <Wallet size={11} />, desc: 'HDFC NetBanking payment received.' },
    { id: 'edited', title: 'Property Registry Edited', date: '29-Jul-2026 12:00', icon: <FileEdit size={11} />, desc: 'Primary mobile and owner information updated.' }
  ];

  const auditDetailsMap: Record<string, any> = {
    created: {
      title: 'Property Registry Created',
      date: '10-Jan-2024 10:00',
      user: 'SuperAdmin Operator',
      role: 'IT Administrator',
      prevVal: 'N/A (New Record)',
      newVal: 'Property ID: 1290082181, Status: Pending Assessment',
      remarks: 'Primary data entry completed successfully from physical file applications.',
      docs: 'Registry_Application_Form.pdf'
    },
    geo: {
      title: 'Geo-Sequencing Verified',
      date: '15-Jan-2024 16:30',
      user: 'Inspector A. R. Sharma',
      role: 'GIS Verification Officer',
      prevVal: 'Coordinates: Empty',
      newVal: 'Coordinates: 19.0760° N, 72.8777° E, Zone A',
      remarks: 'Validated physical location with satellite maps and overlay grid vectors.',
      docs: 'GIS_Coordinate_Report.geojson'
    },
    survey: {
      title: 'Property Survey Audit Completed',
      date: '10-Feb-2024 14:15',
      user: 'Surveyor Rahul Verma',
      role: 'Field Inspector',
      prevVal: 'Reported Area: 400 m²',
      newVal: 'Builtup Footprint: 440 m² (Survey verified)',
      remarks: 'Physical measurements verify 10% carpet extensions built on back courtyard.',
      docs: 'Survey_Measurements_Log.pdf, Ground_Photo_1.jpg'
    },
    verified: {
      title: 'Tax Record Verified',
      date: '20-Feb-2024 11:20',
      user: 'Officer Deepali Patil',
      role: 'Auditor Level 2',
      prevVal: 'Verification: Pending',
      newVal: 'Verification: Verified & Signed',
      remarks: 'Registry deeds, family records, and tax exemptions validated.',
      docs: 'Exemption_Certificates.zip'
    },
    assessed: {
      title: 'Tax Assessment Processed',
      date: '01-Apr-2024 18:00',
      user: 'Assessor K. G. Joshi',
      role: 'Property Tax Assessor',
      prevVal: 'Annual Tax: ₹0',
      newVal: 'Rateable: ₹18,45,000, Tax: ₹18,752',
      remarks: 'Assessment processed using senior citizen standard discount matrices.',
      docs: 'Calculated_Tax_Worksheet.pdf'
    },
    approved: {
      title: 'Assessment Board Approved',
      date: '20-Apr-2024 10:45',
      user: 'Commissioner S. K. Mehta',
      role: 'Chief Approving Commissioner',
      prevVal: 'Approval: Pending Board Sign-off',
      newVal: 'Approval: Commissioner Approved (Level 3)',
      remarks: 'Final review completed. Allowed for municipal collection.',
      docs: 'Commissioner_Board_Resolution.pdf'
    },
    collected: {
      title: 'Payment Collection Logged',
      date: '05-May-2024 15:30',
      user: 'Collector Manoj Shinde',
      role: 'Collection Desk Desk Officer',
      prevVal: 'Outstanding balance: ₹18,752',
      newVal: 'Paid: ₹12,456, Outstanding: ₹6,296',
      remarks: 'Payment received via Net Banking HDFC. Receipt REC-2026-908A generated.',
      docs: 'Tax_Payment_Receipt_REC-2026-908A.pdf'
    },
    edited: {
      title: 'Property Registry Edited',
      date: '29-Jul-2026 12:00',
      user: 'Shri Balasaheb Thackeray',
      role: 'Primary Taxpayer (Self Portal)',
      prevVal: 'Mobile: 9876543200, Email: empty',
      newVal: 'Mobile: 9876543210, Email: owner@property.com',
      remarks: 'Self portal updates completed using Aadhaar verification.',
      docs: 'Aadhaar_OTP_Log.txt'
    }
  };

  const activeAudit = selectedAudit ? auditDetailsMap[selectedAudit] : null;

  return (
    <div className="flex flex-col h-full gap-3 font-sans animate-fadeIn p-1">
      {selectedAudit && activeAudit && (
        <>
          <div className="fixed inset-0 bg-black/45 z-[990]" onClick={() => setSelectedAudit(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[999] bg-white border border-[#2563eb]/25 rounded-xl shadow-2xl p-4 w-[360px] flex flex-col gap-3 font-sans">
            <div className="flex items-center justify-between border-b border-gray-100 pb-1.5 shrink-0">
              <span className="font-extrabold text-[#2563eb] text-[10.5px] uppercase tracking-wider flex items-center gap-1">
                <Info size={12} />
                Audit Log Details
              </span>
              <button 
                onClick={() => setSelectedAudit(null)}
                className="text-gray-400 hover:text-gray-655 font-black hover:bg-gray-50 w-5 h-5 rounded-full flex items-center justify-center cursor-pointer transition-all"
              >
                <X size={12} />
              </button>
            </div>
            
            <div className="text-[9px] leading-relaxed space-y-2 font-semibold text-gray-700">
              <div className="flex flex-col gap-0.5">
                <span className="text-gray-400 font-extrabold uppercase text-[7.5px]">Audit Event Name</span>
                <span className="font-black text-gray-950 text-[10px]">{activeAudit.title}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-0.5">
                  <span className="text-gray-400 font-extrabold uppercase text-[7.5px]">Updated Date/Time</span>
                  <span className="font-bold text-gray-900">{activeAudit.date}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-gray-400 font-extrabold uppercase text-[7.5px]">Operator Role</span>
                  <span className="font-bold text-gray-900">{activeAudit.role}</span>
                </div>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-gray-400 font-extrabold uppercase text-[7.5px]">Operator Operator Name</span>
                <span className="font-black text-[#2563eb]">{activeAudit.user}</span>
              </div>
              <div className="flex flex-col gap-0.5 bg-gray-50 p-2 rounded border border-gray-200/50">
                <div className="flex flex-col gap-0.5 pb-1.5 border-b border-gray-200/30">
                  <span className="text-red-500 font-bold text-[7px] uppercase">Previous Value</span>
                  <span className="font-mono text-gray-500 text-[8px]">{activeAudit.prevVal}</span>
                </div>
                <div className="flex flex-col gap-0.5 pt-1.5">
                  <span className="text-green-600 font-bold text-[7px] uppercase">Updated Value</span>
                  <span className="font-mono text-gray-900 text-[8.5px] font-black">{activeAudit.newVal}</span>
                </div>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-gray-400 font-extrabold uppercase text-[7.5px]">Remarks</span>
                <p className="text-gray-750 font-medium italic">"{activeAudit.remarks}"</p>
              </div>
              {activeAudit.docs && (
                <div className="flex flex-col gap-0.5">
                  <span className="text-gray-400 font-extrabold uppercase text-[7.5px]">Supporting Files</span>
                  <span className="text-[#2563eb] hover:underline cursor-pointer flex items-center gap-0.5 font-black text-[8px]">
                    <Download size={9} />
                    {activeAudit.docs}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-gray-155 flex justify-end shrink-0">
              <button 
                onClick={() => setSelectedAudit(null)}
                className="w-full text-center py-1.5 bg-[#eff6ff] hover:bg-[#dbeafe] text-[#2563eb] text-[9px] font-black rounded cursor-pointer transition-colors shadow-2xs border border-[#2563eb]/25"
              >
                Close Audit Details
              </button>
            </div>
          </div>
        </>
      )}

      <div className="flex items-center justify-between border-b border-gray-100 pb-2 shrink-0 select-none">
        <div className="flex items-center gap-1.5">
          <div className="bg-blue-50 text-blue-600 p-1.5 rounded-lg border border-blue-100">
            <History size={14} />
          </div>
          <div>
            <h2 className="font-extrabold text-[#1e2b58] text-[11px] uppercase tracking-wider leading-none">Property Transaction & Audit History</h2>
            <span className="text-gray-400 text-[8.5px] font-bold mt-1 block leading-none">Property ID: 1290082181</span>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-650 font-extrabold hover:bg-gray-100 w-5 h-5 rounded-full flex items-center justify-center cursor-pointer transition-all"
        >
          <X size={12} />
        </button>
      </div>

      {/* Expanded Timeline Scroll wrapper */}
      <div className="flex-grow flex-1 min-h-0 overflow-y-auto pr-1.5 relative py-3 pl-4">
        <div className="absolute top-2 bottom-2 left-7 w-[2px] bg-blue-100 z-0"></div>

        <div className="space-y-4">
          {historyEvents.map((evt) => (
            <button
              key={evt.id}
              onClick={() => setSelectedAudit(evt.id)}
              className="flex items-start gap-3.5 w-full text-left relative z-10 group outline-none focus:outline-none transition-transform hover:translate-x-0.5 cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-white border-2 border-[#2563eb] hover:bg-[#2563eb] hover:text-white text-[#2563eb] flex items-center justify-center font-extrabold shadow-sm shrink-0 transition-all group-hover:scale-110">
                {evt.icon}
              </div>
              
              <div className="flex-grow bg-white border border-gray-200 hover:border-[#2563eb]/40 rounded-xl p-3 shadow-xs transition-colors flex flex-col gap-1">
                <div className="flex justify-between items-baseline select-none">
                  <span className="font-extrabold text-[#1e2b58] text-[10px] group-hover:text-[#2563eb] transition-colors">{evt.title}</span>
                  <span className="text-gray-400 font-bold text-[8px]">{evt.date}</span>
                </div>
                <p className="text-gray-455 font-medium text-[9px] leading-tight pr-4">{evt.desc}</p>
                <span className="text-[#2563eb] font-extrabold text-[8px] tracking-wider uppercase mt-1 inline-flex items-center gap-0.5 group-hover:underline">
                  View Audit Details →
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   7. DOWNLOAD GIS VIEW (INTERACTIVE EXPANDED VIEW)
   ========================================================================== */
function DownloadGisView({ onClose }: { onClose: () => void }) {
  const [downloadStates, setDownloadStates] = useState<Record<string, { progress: number; status: string; success: boolean }>>({});

  const gisAssets = [
    { id: 'report', title: 'GIS Summary Report', format: 'PDF', size: '2.4 MB', desc: 'Comprehensive tax parcel report containing area overlays, plot maps, and spatial assessments.', color: 'border-l-4 border-l-emerald-500 bg-gradient-to-r from-emerald-500/5 to-transparent' },
    { id: 'map', title: 'High-Res Satellite Map', format: 'PNG Image', size: '4.8 MB', desc: 'Pre-rendered high resolution image containing spatial polygon boundary lines matching the municipal register.', color: 'border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-500/5 to-transparent' },
    { id: 'geojson', title: 'Boundary GeoJSON', format: 'GEOJSON', size: '150 KB', desc: 'Geospatial database vector nodes coordinates for property GIS borders mapping.', color: 'border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-500/5 to-transparent' },
    { id: 'kml', title: 'Google Earth KML', format: 'KML Vector', size: '180 KB', desc: 'Keyhole Markup Language vector parameters containing coordinate polygons for standard viewer imports.', color: 'border-l-4 border-l-amber-500 bg-gradient-to-r from-amber-500/5 to-transparent' },
    { id: 'coordinates', title: 'Boundary Node Index', format: 'TXT Log', size: '12 KB', desc: 'Tab-delimited text list specifying physical corner coordinates (Latitude, Longitude, Altitude).', color: 'border-l-4 border-l-rose-500 bg-gradient-to-r from-rose-500/5 to-transparent' },
    { id: 'survey', title: 'Survey Inspector Report', format: 'PDF Report', size: '1.2 MB', desc: 'Verified field survey measurements sheet complete with audit parameters.', color: 'border-l-4 border-l-teal-500 bg-gradient-to-r from-teal-500/5 to-transparent' }
  ];

  const handleDownload = (id: string, title: string, ext: string) => {
    if (downloadStates[id]?.progress > 0 && !downloadStates[id]?.success) return;

    setDownloadStates(prev => ({
      ...prev,
      [id]: { progress: 0, status: 'Connecting to GIS servers...', success: false }
    }));

    const statusSteps = [
      { p: 20, s: 'Querying spatial databases...' },
      { p: 50, s: 'Resolving parcel coordinate nodes...' },
      { p: 80, s: 'Packaging geospatial data...' },
      { p: 100, s: 'Preparing local download...' }
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < statusSteps.length) {
        const step = statusSteps[stepIndex];
        setDownloadStates(prev => ({
          ...prev,
          [id]: { progress: step.p, status: step.s, success: step.p === 100 }
        }));
        stepIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setDownloadStates(prev => ({
            ...prev,
            [id]: { ...prev[id], success: false, progress: 0 }
          }));
        }, 3000);
      }
    }, 400);
  };

  return (
    <div className="flex flex-col h-full gap-3 font-sans animate-fadeIn p-1 select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-[#f0fdf4] text-emerald-600 p-2 rounded-xl border border-green-150 shadow-xs animate-pulse">
            <Download size={16} />
          </div>
          <div>
            <h2 className="font-extrabold text-[#1e2b58] text-xs uppercase tracking-wider leading-none">Download GIS Assets & Spatial Data</h2>
            <span className="text-gray-400 text-[9px] font-semibold mt-1 block leading-none">Interactive Export Center • Property ID: 1290082181</span>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 font-extrabold hover:bg-gray-150 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-all active:scale-95"
        >
          <X size={14} />
        </button>
      </div>

      {/* Expanded Grid Scrollwrapper */}
      <div className="flex-grow flex-1 min-h-[220px] overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-3.5 p-0.5">
        {gisAssets.map((asset) => {
          const state = downloadStates[asset.id] || { progress: 0, status: '', success: false };
          const isDownloading = state.progress > 0 && state.progress < 100;

          return (
            <div 
              key={asset.id} 
              className={`bg-white border border-gray-200/80 rounded-2xl p-4 flex flex-col justify-between gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden ${asset.color}`}
            >
              <div className="flex flex-col gap-2 text-[9px] leading-tight">
                <div className="flex justify-between items-baseline gap-2">
                  <span className="font-extrabold text-[#1e2b58] text-[10.5px] uppercase tracking-wider">{asset.title}</span>
                  <span className="text-[#002fbe] font-extrabold text-[8px] bg-blue-50 border border-blue-200/50 px-2 py-0.5 rounded-lg uppercase whitespace-nowrap shrink-0">{asset.format} ({asset.size})</span>
                </div>
                <p className="text-gray-500 font-medium leading-normal">{asset.desc}</p>
              </div>

              {state.progress > 0 && (
                <div className="flex flex-col gap-1 mt-1 text-[8.5px] font-bold">
                  <div className="flex justify-between text-gray-500 font-extrabold leading-none">
                    <span className="text-blue-600 animate-pulse">{state.status}</span>
                    <span className="tabular-nums font-black text-gray-900">{state.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden border border-gray-200/50 mt-1">
                    <div 
                      className={`h-full transition-all duration-300 ${state.success ? 'bg-green-500' : 'bg-[#002fbe]'}`}
                      style={{ width: `${state.progress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-1">
                {state.success ? (
                  <div className="flex items-center gap-1.5 text-emerald-700 font-extrabold text-[8.5px] uppercase tracking-wider bg-emerald-50 border border-emerald-200/60 px-3 py-1 rounded-lg animate-scaleUp shadow-2xs">
                    <CheckCircle2 size={11} className="text-emerald-600" />
                    <span>Download Ready</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleDownload(asset.id, asset.title, asset.format.toLowerCase())}
                    disabled={isDownloading}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 text-[9px] font-bold rounded-lg cursor-pointer border transition-all active:scale-[0.97] ${
                      isDownloading
                        ? 'bg-gray-100 text-gray-400 border-gray-200/80 cursor-not-allowed'
                        : 'bg-[#002fbe] hover:bg-[#002598] text-white border-blue-650 shadow-xs'
                    }`}
                  >
                    <Download size={11} />
                    <span>{isDownloading ? 'Processing...' : 'Export Asset'}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ==========================================================================
   8. MORE ACTIONS VIEW (INTERACTIVE GRID & EXPANDED SUB-WORKFLOWS)
   ========================================================================== */
function MoreActionsView({ onClose }: { onClose: () => void }) {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const [reasonText, setReasonText] = useState('');
  const [secondaryField, setSecondaryField] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const adminActions = [
    { id: 'transfer', title: 'Ownership Transfer', icon: <UserCheck size={14} />, desc: 'Process official property registry title transfer to a new buyer or beneficiary.', color: 'hover:border-blue-500/50 hover:bg-blue-50/10' },
    { id: 'split', title: 'Registry Subdivision (Split)', icon: <Split size={14} />, desc: 'Subdivide this land parcel UPIC registration into multiple sub-plots.', color: 'hover:border-purple-500/50 hover:bg-purple-50/10' },
    { id: 'merge', title: 'Registry Merging', icon: <Merge size={14} />, desc: 'Combine this property record with adjacent registers to construct a unified UPIC.', color: 'hover:border-indigo-500/50 hover:bg-indigo-50/10' },
    { id: 'disputed', title: 'Disputed Registry Flag', icon: <AlertTriangle size={14} />, desc: 'Flag this property registry record under active legal case or tax dispute.', color: 'hover:border-amber-500/50 hover:bg-amber-50/10' },
    { id: 'exempted', title: 'Exemption Assessment Class', icon: <ShieldCheck size={14} />, desc: 'Apply statutory property tax exemption classes (religious, public, charitable).', color: 'hover:border-teal-500/50 hover:bg-teal-50/10' },
    { id: 'deactivate', title: 'Deactivate Property Record', icon: <Lock size={14} />, desc: 'Permanently deactivate property ID registration to halt tax cycles.', color: 'hover:border-red-500/50 hover:bg-red-50/10' },
    { id: 'archive', title: 'Archive Property Record', icon: <Archive size={14} />, desc: 'Archive registry data file records from the active search databases.', color: 'hover:border-rose-500/50 hover:bg-rose-50/10' },
    { id: 'audit-log', title: 'Database Audit Trails', icon: <FileSpreadsheet size={14} />, desc: 'Retrieve system query audit lists detailing data updates and history logs.', color: 'hover:border-gray-500/50 hover:bg-gray-50/10' }
  ];

  const handleWorkflowSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reasonText.trim()) return;

    let msg = '';
    switch (selectedWorkflow) {
      case 'transfer': msg = `Ownership transfer request submitted for target: "${secondaryField}"!`; break;
      case 'split': msg = `Property registry split request filed for ${secondaryField} plots!`; break;
      case 'merge': msg = `Merging request submitted for adjacent UPIC: ${secondaryField}!`; break;
      case 'disputed': msg = `Disputed status registered under reference Case: ${secondaryField}!`; break;
      case 'exempted': msg = `Exemption classification applied successfully! Type: ${secondaryField}`; break;
      case 'deactivate': msg = 'Property registration deactivated successfully!'; break;
      case 'archive': msg = 'Property registry record moved to historical archives!'; break;
    }

    setSuccessMessage(msg);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedWorkflow(null);
      setReasonText('');
      setSecondaryField('');
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full gap-3 font-sans animate-fadeIn p-1 relative select-none">
      {showSuccess && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[100] bg-green-600 text-white font-extrabold px-6 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-green-500 animate-slideDown text-[9px] uppercase tracking-wider">
          <CheckCircle2 size={14} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 shrink-0">
        <div className="flex items-center gap-2">
          {selectedWorkflow ? (
            <button 
              onClick={() => { setSelectedWorkflow(null); setReasonText(''); setSecondaryField(''); }}
              className="p-1 px-2.5 rounded-lg text-slate-600 hover:text-[#002fbe] hover:bg-blue-50 cursor-pointer flex items-center gap-1 text-[8.5px] font-black uppercase tracking-wider border border-gray-200 bg-white transition-all shadow-2xs"
            >
              <ChevronLeft size={12} />
              <span>Back</span>
            </button>
          ) : (
            <div className="bg-[#1e2b58] text-white p-2 rounded-xl shadow-xs">
              <Settings size={16} />
            </div>
          )}
          <div>
            <h2 className="font-extrabold text-[#1e2b58] text-xs uppercase tracking-wider leading-none">
              {selectedWorkflow ? `Workflow: ${adminActions.find(a => a.id === selectedWorkflow)?.title}` : 'Administrative Registry Operations'}
            </h2>
            <span className="text-slate-600 text-[9px] font-bold mt-1 block leading-none">Nagpur Municipal Corporation • Property ID: 1290082181</span>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="text-slate-500 hover:text-slate-800 font-extrabold hover:bg-gray-100 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-all active:scale-95"
        >
          <X size={14} />
        </button>
      </div>

      {/* Main Switch Area - Expanded */}
      <div className="flex-grow flex-1 min-h-0 overflow-y-auto pr-0.5">
        {!selectedWorkflow ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-0.5">
            {adminActions.map((action) => (
              <button
                key={action.id}
                onClick={() => setSelectedWorkflow(action.id)}
                className={`bg-white border border-gray-250 rounded-2xl p-4 text-left flex items-start gap-3.5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer ${action.color}`}
              >
                <div className={`p-2.5 rounded-xl border mt-0.5 transition-colors shrink-0 ${
                  action.id === 'transfer' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                  action.id === 'split' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                  action.id === 'merge' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                  action.id === 'disputed' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                  action.id === 'exempted' ? 'bg-teal-50 text-teal-700 border-teal-100' :
                  action.id === 'deactivate' ? 'bg-red-50 text-red-600 border-red-100' :
                  action.id === 'archive' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                  'bg-gray-50 text-slate-600 border-gray-200'
                }`}>
                  {action.icon}
                </div>
                <div className="flex flex-col gap-1 text-[9.5px] leading-snug flex-1">
                  <span className="font-black text-[#1e2b58] uppercase tracking-wider text-[10px]">{action.title}</span>
                  <p className="text-slate-700 font-extrabold leading-normal">{action.desc}</p>
                </div>
              </button>
            ))}
          </div>
        ) : selectedWorkflow === 'audit-log' ? (
          <div className="flex flex-col gap-3">
            <div className="bg-gray-55 border border-gray-200 rounded-xl overflow-hidden shadow-sm flex-1 min-h-[160px]">
              <table className="w-full text-[9px] text-center border-collapse bg-white">
                <thead className="bg-[#1e2b58] text-white font-extrabold uppercase text-[8px] tracking-wider sticky top-0">
                  <tr>
                    <th className="py-2.5 px-1 border-r border-white/10">Log ID</th>
                    <th className="py-2.5 px-1 border-r border-white/10">Operator</th>
                    <th className="py-2.5 px-1 border-r border-white/10">Action Logged</th>
                    <th className="py-2.5 px-1 border-r border-white/10">Timestamp</th>
                    <th className="py-2.5 px-1">Source IP</th>
                  </tr>
                </thead>
                <tbody className="font-extrabold text-slate-800">
                  <tr className="border-b border-gray-150 hover:bg-gray-50/20">
                    <td className="py-2.5 px-1 text-blue-700 font-black font-mono">#AUD-9921</td>
                    <td className="py-2.5 px-1 font-black">Manoj Shinde</td>
                    <td className="py-2.5 px-1 text-slate-700 font-extrabold">Updated mobile contact</td>
                    <td className="py-2.5 px-1 text-slate-700 font-extrabold">29-Jul-2026 12:00</td>
                    <td className="py-2.5 px-1 font-mono text-slate-800 font-black">192.168.1.104</td>
                  </tr>
                  <tr className="border-b border-gray-150 hover:bg-gray-50/20">
                    <td className="py-2.5 px-1 text-blue-700 font-black font-mono">#AUD-9854</td>
                    <td className="py-2.5 px-1 font-black">Officer Joshi</td>
                    <td className="py-2.5 px-1 text-slate-700 font-extrabold">Reassessment verification completed</td>
                    <td className="py-2.5 px-1 text-slate-700 font-extrabold">20-Apr-2024 10:45</td>
                    <td className="py-2.5 px-1 font-mono text-slate-800 font-black">10.0.12.89</td>
                  </tr>
                  <tr className="border-b border-gray-150 hover:bg-gray-50/20">
                    <td className="py-2.5 px-1 text-blue-700 font-black font-mono">#AUD-9721</td>
                    <td className="py-2.5 px-1 font-black">Surveyor Verma</td>
                    <td className="py-2.5 px-1 text-slate-700 font-extrabold">Field measurements check saved</td>
                    <td className="py-2.5 px-1 text-slate-700 font-extrabold">10-Feb-2024 14:15</td>
                    <td className="py-2.5 px-1 font-mono text-slate-800 font-black">10.0.15.11</td>
                  </tr>
                  <tr className="hover:bg-gray-50/20">
                    <td className="py-2.5 px-1 text-blue-700 font-black font-mono">#AUD-9510</td>
                    <td className="py-2.5 px-1 font-black">System Daemon</td>
                    <td className="py-2.5 px-1 text-slate-700 font-extrabold">GIS polygon verified</td>
                    <td className="py-2.5 px-1 text-slate-700 font-extrabold">15-Jan-2024 16:30</td>
                    <td className="py-2.5 px-1 font-mono text-slate-800 font-black">localhost</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <button 
              onClick={() => setSelectedWorkflow(null)}
              className="mt-1 w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-black rounded-lg cursor-pointer transition-colors text-[9.5px] uppercase tracking-wider border"
            >
              Close Logs List
            </button>
          </div>
        ) : (
          <form onSubmit={handleWorkflowSubmit} className="flex flex-col gap-4 font-semibold text-gray-700 text-[9px] p-0.5">
            {['deactivate', 'archive'].includes(selectedWorkflow) && (
              <div className="bg-red-50 border border-red-200 text-red-655 p-3 rounded-lg flex items-start gap-1.5 shadow-2xs leading-normal">
                <AlertTriangle size={13} className="shrink-0 mt-0.5" />
                <p className="text-[9px]">
                  Warning: Deactivating or Archiving this property is a major destructive audit action. 
                  This will freeze current assessment cycles, prevent collections, and revoke all billing privileges.
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-gray-400 font-extrabold">Property UPIC ID</label>
                <input 
                  type="text" 
                  value="1290082181" 
                  disabled 
                  className="p-2 bg-gray-100 border border-gray-200 rounded font-bold text-gray-450 select-none cursor-not-allowed text-[9px]" 
                />
              </div>

              <div className="flex flex-col gap-1.5">
                {selectedWorkflow === 'transfer' && (
                  <>
                    <label className="font-extrabold text-gray-500">Proposed New Owner Name <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      placeholder="e.g. Manoj Balasaheb Thackeray" 
                      value={secondaryField} 
                      onChange={(e) => setSecondaryField(e.target.value)}
                      className="p-2 bg-white border border-gray-200 rounded text-gray-800 outline-none focus:border-blue-500 text-[9px]" 
                    />
                  </>
                )}
                {selectedWorkflow === 'split' && (
                  <>
                    <label className="font-extrabold text-gray-500">Number of subdivisions <span className="text-red-500">*</span></label>
                    <select 
                      value={secondaryField} 
                      onChange={(e) => setSecondaryField(e.target.value)}
                      className="p-2 bg-white border border-gray-200 rounded text-gray-800 outline-none focus:border-blue-500 text-[9px] font-bold"
                    >
                      <option value="">Choose subdivisions...</option>
                      <option value="2 Plots">2 Plots</option>
                      <option value="3 Plots">3 Plots</option>
                      <option value="4+ Plots">4+ Plots</option>
                    </select>
                  </>
                )}
                {selectedWorkflow === 'merge' && (
                  <>
                    <label className="font-extrabold text-gray-500">Adjacent Target Property ID <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      placeholder="e.g. 1290082190" 
                      value={secondaryField} 
                      onChange={(e) => setSecondaryField(e.target.value)}
                      className="p-2 bg-white border border-gray-200 rounded text-gray-800 outline-none focus:border-blue-500 text-[9px]" 
                    />
                  </>
                )}
                {selectedWorkflow === 'disputed' && (
                  <>
                    <label className="font-extrabold text-gray-500">Dispute Reference / Case ID <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      placeholder="e.g. Court-Case-908B-Nagpur" 
                      value={secondaryField} 
                      onChange={(e) => setSecondaryField(e.target.value)}
                      className="p-2 bg-white border border-gray-200 rounded text-gray-800 outline-none focus:border-blue-500 text-[9px]" 
                    />
                  </>
                )}
                {selectedWorkflow === 'exempted' && (
                  <>
                    <label className="font-extrabold text-gray-500">Exemption Category Class <span className="text-red-500">*</span></label>
                    <select 
                      value={secondaryField} 
                      onChange={(e) => setSecondaryField(e.target.value)}
                      className="p-2 bg-white border border-gray-200 rounded text-gray-800 outline-none focus:border-blue-500 text-[9px] font-bold"
                    >
                      <option value="">Choose Exemption...</option>
                      <option value="Religious Trust Exemption (100%)">Religious Trust Exemption (100%)</option>
                      <option value="Government Educational Class (100%)">Government Educational Class (100%)</option>
                      <option value="Charitable Institution (50%)">Charitable Institution (50%)</option>
                    </select>
                  </>
                )}
                {['deactivate', 'archive'].includes(selectedWorkflow) && (
                  <>
                    <label className="font-extrabold text-gray-500 text-red-550">Registry Freeze Status</label>
                    <input 
                      type="text" 
                      value="FREEZE ASSESSMENT TIMELINES" 
                      disabled 
                      className="p-2 bg-red-50 border border-red-100 rounded text-red-655 outline-none font-black select-none text-[9px]" 
                    />
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-gray-500 font-extrabold">Workflow Authorization Reason / Comments <span className="text-red-500">*</span></label>
              <textarea 
                rows={3}
                value={reasonText}
                onChange={(e) => setReasonText(e.target.value)}
                placeholder="Enter formal municipal resolution details or authorization reasons..."
                className="p-2 bg-white border border-gray-200 rounded font-bold text-gray-800 outline-none focus:border-blue-500 resize-none text-[9px]"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 border-t border-gray-100 pt-2.5 text-[9px] font-extrabold select-none mt-2">
              <button 
                type="button"
                onClick={() => { setSelectedWorkflow(null); setReasonText(''); setSecondaryField(''); }}
                className="px-3.5 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 bg-white cursor-pointer transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={!reasonText.trim() || (!['deactivate', 'archive'].includes(selectedWorkflow) && !secondaryField.trim())}
                className={`px-4 py-2 text-white border rounded-lg cursor-pointer transition-all ${
                  ['deactivate', 'archive'].includes(selectedWorkflow)
                    ? 'bg-red-600 hover:bg-red-700 border-red-700'
                    : 'bg-[#002fbe] hover:bg-[#002598] border-blue-650'
                } disabled:opacity-50`}
              >
                Confirm Action
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
