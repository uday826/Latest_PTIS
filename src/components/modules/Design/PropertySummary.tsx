"use client";

import React, { useState } from 'react';
import { Copy, MapPin, Camera, Star, Info, Ruler, BarChart2, User, Phone, Mail, Briefcase, CreditCard, Eye, EyeOff } from 'lucide-react';

export default function PropertySummary({
  activeTab = 'property',
  onHoverImg,
  onClickImg
}: {
  activeTab?: string;
  onHoverImg?: (url: string | null) => void;
  onClickImg?: (url: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [description, setDescription] = useState('निवासी');
  const [isEditingDesc, setIsEditingDesc] = useState(false);

  // Discount & Social Data States
  const [activeSubTab, setActiveSubTab] = useState<'discount' | 'social'>('discount');
  const [sewageEnabled, setSewageEnabled] = useState(true);
  const [sewagePercentage, setSewagePercentage] = useState('10');
  const [sewageAmount, setSewageAmount] = useState('1,20,500');
  const [showSewageDetails, setShowSewageDetails] = useState(false);

  // Old Details active panel state
  const [activeOldPanel, setActiveOldPanel] = useState<'map' | 'floor' | 'tax' | null>(null);

  const kycData = {
    ownerType: "Self",
    title: "Mr",
    propertyHolderNameMarathi: "रमेश पटेल, रिन्की शिरसाट",
    propertyHolderName: "Mahendra Singh Dhoni",
    occupierNameMarathi: "Ashwin Kadam",
    occupierName: "Dhoni",
    shopNameMarathi: "Swasth Sankalpan",
    shopName: "Swasth Sankalpan",
    aadharCardNo: "996885834865",
    mobileNumber: "8082028615",
    alternateMobileNumber: "",
    email: "ashwin@gmail.com",
    addressMarathi: "Rai KRUPA CHAWL VARCHA GAON, KOLSOHET, THANE-400607",
    address: "Rai KRUPA CHAWL VARCHA GAON, KOLSOHET, THANE-400607",
    pincode: ""
  };

  const societyData = {
    landOwner: "Kingfisher Real Estate",
    builderName: "Vijay Mallya",
    societyName: "Royal Challange Towers",
    societyEmail: "viju@kingf.com",
    secretaryManagerName: "Virat Kohli, Dinesh Kartik",
    secretaryManagerMobile: "9658473625, 9685746352",
    secretaryManagerEmail: "chiku@rcb.com, dinu@rcb.com",
    societyAddress: "Chinnaswami Stadium Bengaluru"
  };

  const oldDetailsData = {
    oldZoneName: "Kopri Zone",
    oldWardNo: "Ward 12",
    oldPropertyNo: "PR-99882",
    oldPartitionNo: "Part-1",
    oldEGovernanceNo: "EG-887722",
    oldPlotNo: "Plot-45A",
    oldPlotArea: "400.00 Sq. Mtr",
    oldConstructionArea: "250.50 Sq. Mtr",
    oldAlv: "₹ 1,20,500",
    oldRv: "₹ 1,08,450",
    oldPropertyTax: "₹ 15,200",
  };

  const renderKycField = (label: string, value: string | null | undefined, gridClass: string = "") => {
    const displayVal = value && value.trim() !== "" ? value : "–";
    return (
      <div className={`${gridClass} leading-tight min-w-0`}>
        <div className="text-[#002fbe] font-bold uppercase tracking-wider text-[8px] leading-none mb-0.5">
          {label}
        </div>
        <div className="font-extrabold text-[#002fbe] text-[10px] whitespace-normal break-words leading-tight mt-0">
          {displayVal}
        </div>
      </div>
    );
  };

  const handleCopy = () => {
    navigator.clipboard.writeText('UPIC-270465-2024-000123');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-wrap xl:flex-nowrap items-stretch gap-3 w-full font-sans">

      {/* Card 1: Main Property Info & Details */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3.5 flex flex-1 flex-wrap xl:flex-nowrap items-center gap-5 relative overflow-visible z-20">
        {/* Background visual accent */}
        <div className="absolute top-0 left-0 w-1.5 h-full bg-[#002fbe] rounded-l-xl pointer-events-none" />

        {/* 1. Image Section */}
        <div
          onMouseEnter={() => onHoverImg && onHoverImg("https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop")}
          onMouseLeave={() => onHoverImg && onHoverImg(null)}
          onClick={() => onClickImg && onClickImg("https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop")}
          className="relative w-36 h-24 shrink-0 rounded-lg overflow-hidden border border-gray-200 group cursor-pointer hover:border-blue-300 transition-colors bg-gray-50"
        >
          <img
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=300&auto=format&fit=crop"
            alt="Property"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-125 cursor-zoom-in"
          />
          <button className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#002fbe] shadow-sm hover:bg-gray-50 transition-colors cursor-pointer" title="Update photo">
            <Camera size={12} />
          </button>
        </div>

        {/* 2. Property ID / UPIC & Holder Block */}
        <div className="min-w-[210px] space-y-2 shrink-0">
          <div>
            <div className="text-[10px] text-[#002fbe] uppercase tracking-wider font-extrabold">Property ID / UPIC</div>
            <div className="flex items-center gap-1.5 mt-0.5 relative">
              <span className="font-extrabold text-[#002fbe] text-sm tracking-wide select-all">UPIC-270465-2024-000123</span>
              <button
                onClick={handleCopy}
                className="p-1 hover:bg-gray-100 rounded text-[#002fbe] transition-colors cursor-pointer"
                title="Copy UPIC"
              >
                <Copy size={13} />
              </button>

              {/* Copied tooltip */}
              {copied && (
                <span className="absolute left-full ml-2 bg-green-600 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow z-50">
                  Copied!
                </span>
              )}
            </div>
            <div className="mt-1 flex items-center">
              <span className="bg-green-50 text-green-700 border border-green-200 text-[9px] px-2 py-0.5 rounded font-extrabold uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Active Property
              </span>
            </div>
          </div>

          <div className="space-y-1 text-[11px] leading-tight">
            <div className="flex items-center">
              <span className="font-bold text-[#002fbe] w-[110px]">Owner</span>
              <span className="font-bold text-[#002fbe] mr-2">:</span>
              <span className="font-extrabold text-[#002fbe] uppercase">MATOSHREE BUILDERS PVT LTD</span>
            </div>
            <div className="flex items-center">
              <span className="font-bold text-[#002fbe] w-[110px]">Property Description</span>
              <span className="font-bold text-[#002fbe] mr-2">:</span>
              {isEditingDesc ? (
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onBlur={() => setIsEditingDesc(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditingDesc(false)}
                  className="border border-blue-200 rounded px-1 text-xs font-bold text-red-650 outline-none w-20"
                  autoFocus
                />
              ) : (
                <span
                  onClick={() => setIsEditingDesc(true)}
                  className="font-extrabold text-red-650 cursor-pointer hover:bg-red-50 px-1 rounded transition-colors"
                  title="Click to edit"
                >
                  {description}
                </span>
              )}
            </div>
            <div className="flex items-center">
              <span className="font-bold text-[#002fbe] w-[110px]">Property Holder</span>
              <span className="font-bold text-[#002fbe] mr-2">:</span>
              <span className="font-extrabold text-[#002fbe] uppercase">MATOSHREE BUILDERS</span>
            </div>
          </div>
        </div>

        {activeTab === 'kyc' ? (
          /* KYC Details View */
          <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-2 min-w-[320px] transition-all duration-300 animate-fadeIn text-[10px] leading-tight self-start pt-1">
            {renderKycField("Owner Category", kycData.ownerType)}
            {renderKycField("Title", kycData.title)}
            {renderKycField("Property Holder Name(Regional)", kycData.propertyHolderNameMarathi)}
            {renderKycField("Property Holder Name", kycData.propertyHolderName)}

            {renderKycField("Occupier Name(Regional)", kycData.occupierNameMarathi)}
            {renderKycField("Occupier Name", kycData.occupierName)}
            {renderKycField("Shop Name(Regional)", kycData.shopNameMarathi)}
            {renderKycField("Shop Name", kycData.shopName)}

            {renderKycField("Aadhar No", kycData.aadharCardNo)}
            {renderKycField("Mobile No", kycData.mobileNumber)}
            {renderKycField("Alt. Mobile No", kycData.alternateMobileNumber)}
            {renderKycField("Email ID", kycData.email)}

            {renderKycField("Address(Regional)", kycData.addressMarathi, "xl:col-span-2")}
            {renderKycField("Address", kycData.address, "xl:col-span-2")}
            {renderKycField("Pincode", kycData.pincode)}
          </div>
        ) : activeTab === 'discount' ? (
          /* Discount & Social Data View */
          <div className="flex-grow flex flex-col xl:flex-row gap-4 min-w-[320px] transition-all duration-300 animate-fadeIn text-[10px] leading-tight self-start w-full">
            {/* Left Area (Sewage Treatment Plant & Active Sub-tab) */}
            <div className="flex-1 flex flex-col gap-3 min-w-0">
              
              {/* Sewage Treatment Plant controls box */}
              <div className="bg-[#eff6ff]/35 border border-blue-100 rounded-lg p-2 flex flex-col gap-2 relative">
                {/* Header row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[#002fbe] font-extrabold uppercase text-[9px]">Sewage Treatment Plant</span>
                    
                    {/* Sliding Switch */}
                    <button
                      role="switch"
                      aria-checked={sewageEnabled}
                      onClick={() => setSewageEnabled(!sewageEnabled)}
                      className={`w-8 h-4 rounded-full transition-colors relative cursor-pointer outline-none focus:ring-1 focus:ring-blue-400 ${sewageEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white transition-transform ${sewageEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>

                    {/* Eye details toggler */}
                    <button
                      onClick={() => setShowSewageDetails(!showSewageDetails)}
                      className="text-[#002fbe] hover:bg-blue-50 p-0.5 rounded cursor-pointer transition-colors"
                      title={showSewageDetails ? "Hide Plant Details" : "Show Plant Details"}
                    >
                      {showSewageDetails ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                  </div>
                </div>

                {/* Percentage & Amount fields */}
                <div className="flex flex-wrap items-center gap-4 text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-500 font-bold">Percentage:</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={sewagePercentage}
                      disabled={!sewageEnabled}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '' || (Number(val) >= 0 && Number(val) <= 100)) {
                          setSewagePercentage(val);
                          if (val !== '') {
                            const numericVal = Number(val);
                            const amountCalc = Math.round(120500 * (numericVal / 100));
                            setSewageAmount(amountCalc.toLocaleString('en-IN'));
                          }
                        }
                      }}
                      className={`w-14 border rounded px-1 text-center font-extrabold outline-none text-[#1e2b58] h-5 ${sewageEnabled ? 'border-blue-200 bg-white' : 'border-gray-250 bg-gray-100/50 text-gray-405 cursor-not-allowed'}`}
                    />
                    <span className="text-[#002fbe] font-extrabold">%</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-500 font-bold">Amount:</span>
                    <span className="text-[#002fbe] font-extrabold">₹</span>
                    <input
                      type="text"
                      value={sewageAmount}
                      disabled={!sewageEnabled}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        if (val !== '') {
                          const num = Number(val);
                          setSewageAmount(num.toLocaleString('en-IN'));
                          const percentCalc = Math.round((num / 120500) * 100);
                          setSewagePercentage(Math.min(100, Math.max(0, percentCalc)).toString());
                        } else {
                          setSewageAmount('');
                        }
                      }}
                      className={`w-24 border rounded px-1 font-extrabold outline-none text-[#1e2b58] h-5 ${sewageEnabled ? 'border-blue-200 bg-white' : 'border-gray-250 bg-gray-100/50 text-gray-405 cursor-not-allowed'}`}
                    />
                  </div>
                </div>

                {/* Compact expanded plant details */}
                {showSewageDetails && (
                  <div className="border-t border-blue-100/50 pt-1.5 mt-1.5 grid grid-cols-2 sm:grid-cols-3 gap-2 text-[8.5px] leading-tight text-gray-600 animate-fadeIn bg-white/50 p-1.5 rounded">
                    <div><span className="font-bold text-[#002fbe] block">Plant availability:</span> Yes</div>
                    <div><span className="font-bold text-[#002fbe] block">Plant capacity:</span> 500 kLD</div>
                    <div><span className="font-bold text-[#002fbe] block">Current status:</span> Operational</div>
                    <div><span className="font-bold text-[#002fbe] block">Verification status:</span> Verified</div>
                    <div><span className="font-bold text-[#002fbe] block">Last inspection:</span> 12-Jun-2026</div>
                    <div><span className="font-bold text-[#002fbe] block">Remarks:</span> Compliant with norms</div>
                  </div>
                )}
              </div>

              {/* Sub-tab content area */}
              <div className="flex-grow pt-1">
                {activeSubTab === 'discount' ? (
                  /* Discount Data content */
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-2 w-full animate-fadeIn">
                    {renderKycField("Discount Type", "Environmental Rebate")}
                    {renderKycField("Discount Category", "Green Property Concession")}
                    {renderKycField("Discount Percentage", "10%")}
                    {renderKycField("Discount Amount", "₹ 12,050")}
                    {renderKycField("Applicable From", "01-Apr-2024")}
                    {renderKycField("Applicable To", "31-Mar-2028")}
                    {renderKycField("Approval Status", "Approved")}
                    {renderKycField("Approval Reference", "MC/PT/2024/782")}
                    {renderKycField("STP Eligibility", "Eligible")}
                    {renderKycField("Remarks", "STP rebate verified via site survey")}
                  </div>
                ) : (
                  /* Social Data content */
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-2 w-full animate-fadeIn">
                    {renderKycField("Social Category", "General")}
                    {renderKycField("Concession Category", "Senior Citizen & Ex-Serviceman Concessions")}
                    
                    <div>
                      <div className="text-[#002fbe] font-bold uppercase tracking-wider text-[8px] leading-none mb-1">Senior Citizen</div>
                      <span className="bg-green-50 text-green-700 border border-green-200 text-[8px] px-1.5 py-0.5 rounded font-extrabold uppercase">Yes</span>
                    </div>

                    <div>
                      <div className="text-[#002fbe] font-bold uppercase tracking-wider text-[8px] leading-none mb-1">Person with Disability</div>
                      <span className="bg-gray-100 text-gray-600 border border-gray-200 text-[8px] px-1.5 py-0.5 rounded font-extrabold uppercase">No</span>
                    </div>

                    <div>
                      <div className="text-[#002fbe] font-bold uppercase tracking-wider text-[8px] leading-none mb-1">Ex-Serviceman</div>
                      <span className="bg-green-50 text-green-700 border border-green-200 text-[8px] px-1.5 py-0.5 rounded font-extrabold uppercase">Yes</span>
                    </div>

                    <div>
                      <div className="text-[#002fbe] font-bold uppercase tracking-wider text-[8px] leading-none mb-1">Freedom Fighter</div>
                      <span className="bg-gray-100 text-gray-600 border border-gray-200 text-[8px] px-1.5 py-0.5 rounded font-extrabold uppercase">No</span>
                    </div>

                    <div>
                      <div className="text-[#002fbe] font-bold uppercase tracking-wider text-[8px] leading-none mb-1">Women-Owned Property</div>
                      <span className="bg-gray-100 text-gray-600 border border-gray-200 text-[8px] px-1.5 py-0.5 rounded font-extrabold uppercase">No</span>
                    </div>

                    <div>
                      <div className="text-[#002fbe] font-bold uppercase tracking-wider text-[8px] leading-none mb-1">Economically Weaker Section</div>
                      <span className="bg-gray-100 text-gray-600 border border-gray-200 text-[8px] px-1.5 py-0.5 rounded font-extrabold uppercase">No</span>
                    </div>

                    {renderKycField("Certificate Number", "SC/2021/9820")}
                    {renderKycField("Certificate Validity", "Lifetime")}
                    
                    <div>
                      <div className="text-[#002fbe] font-bold uppercase tracking-wider text-[8px] leading-none mb-1">Verification Status</div>
                      <span className="bg-green-50 text-green-700 border border-green-200 text-[8px] px-1.5 py-0.5 rounded font-extrabold uppercase">Verified</span>
                    </div>

                    {renderKycField("Remarks", "Senior citizen verification matching Aadhaar birth date")}
                  </div>
                )}
              </div>
            </div>

            {/* Right Area (Sub-tab Buttons Stack) */}
            <div className="flex flex-row xl:flex-col gap-2 shrink-0 justify-start pt-1 xl:border-l xl:border-blue-100/50 xl:pl-4">
              <button
                onClick={() => setActiveSubTab('discount')}
                className={`px-3 py-1.5 text-[9.5px] font-extrabold rounded-lg border text-center transition-all cursor-pointer w-full md:w-32 xl:w-28 ${activeSubTab === 'discount' ? 'bg-[#002fbe] text-white border-[#002fbe] shadow-sm' : 'bg-white text-[#002fbe] border-gray-250 hover:bg-gray-50'}`}
              >
                Discount Data
              </button>
              <button
                onClick={() => setActiveSubTab('social')}
                className={`px-3 py-1.5 text-[9.5px] font-extrabold rounded-lg border text-center transition-all cursor-pointer w-full md:w-32 xl:w-28 ${activeSubTab === 'social' ? 'bg-[#002fbe] text-white border-[#002fbe] shadow-sm' : 'bg-white text-[#002fbe] border-gray-250 hover:bg-gray-50'}`}
              >
                Social Data
              </button>
            </div>
          </div>
        ) : activeTab === 'old' ? (
          /* Old Details View */
          <div className="flex-grow flex flex-col gap-3 min-w-[320px] transition-all duration-300 animate-fadeIn text-[10px] leading-tight self-start pt-1 w-full">
            {/* Old Details Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-[28px] gap-y-[14px]">
              {renderKycField("Old Zone Name", oldDetailsData.oldZoneName)}
              {renderKycField("Old Ward No.", oldDetailsData.oldWardNo)}
              {renderKycField("Old Property No.", oldDetailsData.oldPropertyNo)}
              {renderKycField("Old Partition No.", oldDetailsData.oldPartitionNo)}

              {renderKycField("Old E-Governance No.", oldDetailsData.oldEGovernanceNo)}
              {renderKycField("Old Plot No.", oldDetailsData.oldPlotNo)}
              {renderKycField("Old Plot Area (Sq. Mtr)", oldDetailsData.oldPlotArea)}
              {renderKycField("Old Construction Area (Sq. Mtr)", oldDetailsData.oldConstructionArea)}

              {renderKycField("Old ALV", oldDetailsData.oldAlv)}
              {renderKycField("Old RV", oldDetailsData.oldRv)}
              {renderKycField("Old Property Tax", oldDetailsData.oldPropertyTax)}
              {renderKycField("Old Total Tax", oldDetailsData.oldTotalTax)}
            </div>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center gap-2 mt-2 pt-1 border-t border-gray-100">
              <button
                onClick={() => setActiveOldPanel(activeOldPanel === 'map' ? null : 'map')}
                className={`px-3 py-1.5 text-[9px] font-extrabold rounded-md border text-center transition-all cursor-pointer shadow-xs ${activeOldPanel === 'map' ? 'bg-[#0d9488] text-white border-[#0d9488]' : 'bg-white text-[#0d9488] border-[#0d9488]/40 hover:bg-[#0d9488]/5'}`}
              >
                Show Map Details
              </button>
              <button
                onClick={() => setActiveOldPanel(activeOldPanel === 'floor' ? null : 'floor')}
                className={`px-3 py-1.5 text-[9px] font-extrabold rounded-md border text-center transition-all cursor-pointer shadow-xs ${activeOldPanel === 'floor' ? 'bg-[#4f46e5] text-white border-[#4f46e5]' : 'bg-white text-[#4f46e5] border-[#4f46e5]/40 hover:bg-[#4f46e5]/5'}`}
              >
                Show Floor Details
              </button>
              <button
                onClick={() => setActiveOldPanel(activeOldPanel === 'tax' ? null : 'tax')}
                className={`px-3 py-1.5 text-[9px] font-extrabold rounded-md border text-center transition-all cursor-pointer shadow-xs ${activeOldPanel === 'tax' ? 'bg-[#ea580c] text-white border-[#ea580c]' : 'bg-white text-[#ea580c] border-[#ea580c]/40 hover:bg-[#ea580c]/5'}`}
              >
                Show Old Tax
              </button>
            </div>

            {/* Expandable panel container */}
            {activeOldPanel && (
              <div className="border border-blue-100 rounded-lg p-2.5 bg-[#eff6ff]/20 mt-1 animate-fadeIn w-full">
                {activeOldPanel === 'map' && (
                  <div className="space-y-1">
                    <h4 className="text-[#0d9488] font-bold text-[9px] uppercase tracking-wider mb-1">Old Map Details</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1.5 text-[8.5px]">
                      <div><span className="font-bold text-gray-500">Old Location reference:</span> Kopri Old Sector 4</div>
                      <div><span className="font-bold text-gray-500">Map grid index:</span> Sector-B/Row-2</div>
                      <div><span className="font-bold text-gray-500">Old Survey ID:</span> OS-2001-992</div>
                      <div><span className="font-bold text-gray-500">Verification Status:</span> Verified historical record</div>
                    </div>
                  </div>
                )}

                {activeOldPanel === 'floor' && (
                  <div className="space-y-1.5 overflow-x-auto">
                    <h4 className="text-[#4f46e5] font-bold text-[9px] uppercase tracking-wider mb-1">Old Floor Details</h4>
                    <table className="w-full text-left border-collapse text-[8.5px]">
                      <thead>
                        <tr className="border-b border-gray-200 text-[#4f46e5] font-extrabold uppercase">
                          <th className="py-1 pr-2">Floor No</th>
                          <th className="py-1 px-2">Use Type</th>
                          <th className="py-1 px-2">Construction Type</th>
                          <th className="py-1 px-2">Carpet Area (Sq.Mtr)</th>
                          <th className="py-1 pl-2">Builtup Area (Sq.Mtr)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                        <tr>
                          <td className="py-1 pr-2">Ground Floor</td>
                          <td className="py-1 px-2">Commercial (Shop)</td>
                          <td className="py-1 px-2">RCC Structure</td>
                          <td className="py-1 px-2">120.00</td>
                          <td className="py-1 pl-2 font-bold text-[#4f46e5]">135.00</td>
                        </tr>
                        <tr>
                          <td className="py-1 pr-2">First Floor</td>
                          <td className="py-1 px-2">Residential</td>
                          <td className="py-1 px-2">RCC Structure</td>
                          <td className="py-1 px-2">110.00</td>
                          <td className="py-1 pl-2 font-bold text-[#4f46e5]">125.50</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {activeOldPanel === 'tax' && (
                  <div className="space-y-1.5">
                    <h4 className="text-[#ea580c] font-bold text-[9px] uppercase tracking-wider mb-1">Old Tax Breakdown</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[8.5px] mb-2 border-b border-gray-100 pb-2">
                      <div><span className="font-bold text-gray-500">Assessment Year:</span> 2021-2022</div>
                      <div><span className="font-bold text-gray-500">Historical ALV:</span> ₹ 1,20,500</div>
                      <div><span className="font-bold text-gray-500">Historical RV:</span> ₹ 1,08,450</div>
                      <div>
                        <span className="font-bold text-gray-500 block">Payment status:</span>
                        <span className="inline-block bg-green-50 text-green-700 border border-green-200 text-[8px] px-1.5 py-0.5 rounded font-extrabold uppercase mt-0.5">Paid</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1 text-[8.5px]">
                      <div><span className="font-bold text-gray-500">Old Property Tax:</span> ₹ 15,200</div>
                      <div><span className="font-bold text-gray-500">Old Water Tax:</span> ₹ 1,500</div>
                      <div><span className="font-bold text-gray-500">Old Education Tax:</span> ₹ 900</div>
                      <div><span className="font-bold text-gray-500">Old Conservancy Tax:</span> ₹ 700</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : activeTab === 'society' ? (
          /* Society Details View */
          <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-2 min-w-[320px] transition-all duration-300 animate-fadeIn text-[10px] leading-tight self-start pt-1">
            {renderKycField("Land Owner", societyData.landOwner)}
            {renderKycField("Builder Name", societyData.builderName)}
            {renderKycField("Society Name", societyData.societyName)}
            {renderKycField("Society Email", societyData.societyEmail)}

            {renderKycField("Secretary / Manager Name", societyData.secretaryManagerName, "xl:col-span-2")}
            {renderKycField("Secretary / Manager Mobile", societyData.secretaryManagerMobile)}
            {renderKycField("Secretary / Manager Email", societyData.secretaryManagerEmail, "xl:col-span-2")}

            {renderKycField("Society Address", societyData.societyAddress, "xl:col-span-4")}
          </div>
        ) : (
          <>
            {/* 3. Specifications Middle Columns */}
            <div className="flex-[2.5] grid grid-cols-3 gap-x-4 gap-y-2 min-w-[320px] text-[10px] shrink-0 leading-tight">
              {/* Column 1 */}
              <div className="space-y-2.5">
                <div>
                  <div className="text-[#002fbe] font-bold uppercase tracking-wider text-[8.5px]">Division</div>
                  <div className="font-extrabold text-[#002fbe] text-[11px] mt-0.5">कोपरी</div>
                </div>
                <div>
                  <div className="text-[#002fbe] font-bold uppercase tracking-wider text-[8.5px]">Mouja Name</div>
                  <div className="font-extrabold text-[#002fbe] text-[11px] mt-0.5">Kopri</div>
                </div>
                <div>
                  <div className="text-[#002fbe] font-bold uppercase tracking-wider text-[8.5px]">Category</div>
                  <div className="font-extrabold text-[#002fbe] text-[11px] mt-0.5">Individual</div>
                </div>
              </div>

              {/* Column 2 */}
              <div className="space-y-2.5">
                <div>
                  <div className="text-[#002fbe] font-bold uppercase tracking-wider text-[8.5px]">Survey No.</div>
                  <div className="font-extrabold text-[#002fbe] text-[11px] mt-0.5">CSN005A</div>
                </div>
                <div>
                  <div className="text-[#002fbe] font-bold uppercase tracking-wider text-[8.5px]">SubZone No.</div>
                  <div className="font-extrabold text-[#002fbe] text-[11px] mt-0.5">-</div>
                </div>
                <div>
                  <div className="text-[#002fbe] font-bold uppercase tracking-wider text-[8.5px]">Flat / Shop No.</div>
                  <div className="font-extrabold text-[#002fbe] text-[11px] mt-0.5">-</div>
                </div>
              </div>

              {/* Column 3 */}
              <div className="space-y-2.5">
                <div>
                  <div className="text-[#002fbe] font-bold uppercase tracking-wider text-[8.5px]">Plot No.</div>
                  <div className="font-extrabold text-[#002fbe] text-[11px] mt-0.5">55</div>
                </div>
                <div>
                  <div className="text-[#002fbe] font-bold uppercase tracking-wider text-[8.5px]">Wing</div>
                  <div className="font-extrabold text-[#002fbe] text-[11px] mt-0.5">-</div>
                </div>
                <div>
                  <div className="text-[#002fbe] font-bold uppercase tracking-wider text-[8.5px]">Tax Zone</div>
                  <div className="font-extrabold text-[#002fbe] text-[11px] mt-0.5">1 - KOLSHEET</div>
                </div>
              </div>
            </div>

            {/* 4. Areas Column Layout */}
            <div className="min-w-[175px] shrink-0 space-y-2">
              {/* Plot Area */}
              <div className="flex items-center gap-2 group relative">
                <div className="bg-blue-50 p-1.5 rounded-md mt-0.5 shrink-0 border border-blue-100/55">
                  <BarChart2 size={13} className="text-[#002fbe]" />
                </div>
                <div>
                  <div className="text-[8.5px] text-[#002fbe] font-bold uppercase tracking-wider">Plot Area (ft/mtr)</div>
                  <div className="font-extrabold text-[11.5px] text-[#002fbe] mt-0.5">4305.60 / 400.00</div>
                </div>
              </div>

              {/* Carpet Area */}
              <div className="flex items-center gap-2 group relative">
                <div className="bg-blue-50 p-1.5 rounded-md mt-0.5 shrink-0 border border-blue-100/55">
                  <Ruler size={13} className="text-[#002fbe]" />
                </div>
                <div>
                  <div className="text-[8.5px] text-[#002fbe] font-bold uppercase tracking-wider">Carpet Area (ft/mtr)</div>
                  <div className="font-extrabold text-[11.5px] text-[#002fbe] mt-0.5">538.20 / 50.00</div>
                </div>
              </div>

              {/* Built-up Area */}
              <div className="flex items-center gap-2 group relative">
                <div className="bg-blue-50 p-1.5 rounded-md mt-0.5 shrink-0 border border-blue-100/55">
                  <Camera size={13} className="text-[#002fbe]" />
                </div>
                <div>
                  <div className="text-[8.5px] text-[#002fbe] font-bold uppercase tracking-wider">Built-up Area (ft/mtr)</div>
                  <div className="font-extrabold text-[11.5px] text-[#002fbe] mt-0.5">538.20 / 50.00</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Card 2: Property Grade & Index */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col justify-between w-[220px] shrink-0 relative group">
        <div className="text-[11px] text-[#002fbe] font-extrabold uppercase tracking-wider select-none">
          Property Grade & Index
        </div>
        <div className="flex text-orange-500 gap-1 mt-2.5">
          <Star size={20} fill="currentColor" className="stroke-orange-500" />
          <Star size={20} fill="currentColor" className="stroke-orange-500" />
          <Star size={20} fill="currentColor" className="stroke-orange-500" />
          <Star size={20} fill="currentColor" className="stroke-orange-500" />
          <Star size={20} className="text-gray-300" />
        </div>
        <div className="text-[#002fbe] font-extrabold text-[24px] flex items-baseline leading-none mt-2.5">
          <span>6.2</span>
          <span className="text-[12px] text-gray-400 font-bold ml-1">/ 7</span>
        </div>
        <div className="text-green-600 text-[9.5px] font-extrabold uppercase tracking-wider mt-2.5">
          A+ Grade • Excellent Property
        </div>
      </div>

      {/* Card 3: Health Score */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col justify-between w-[250px] shrink-0 relative group">
        <div className="text-[11px] text-[#002fbe] font-extrabold uppercase tracking-wider select-none">
          Health Score
        </div>
        <div className="flex items-center gap-4 mt-2.5">
          {/* Circle progress */}
          <div className="relative w-18 h-18 flex items-center justify-center shrink-0">
            <svg className="w-18 h-18 transform -rotate-90">
              <circle cx="36" cy="36" r="28" stroke="#e5e7eb" strokeWidth="5" fill="transparent" />
              <circle cx="36" cy="36" r="28" stroke="#047857" strokeWidth="5" fill="transparent" strokeDasharray="175.9" strokeDashoffset="14.1" strokeLinecap="round" />
            </svg>
            <div className="absolute font-extrabold text-[14px] text-[#002fbe]">92%</div>
          </div>

          {/* Stats right */}
          <div className="flex-1 flex flex-col justify-center leading-none">
            <div className="font-extrabold text-[22px] text-green-700">92%</div>
            <div className="text-green-600 text-[11px] font-bold mt-1.5">Excellent</div>
            <button className="text-[#002fbe] text-[9.5px] font-bold mt-2.5 hover:underline text-left cursor-pointer border border-[#002fbe]/20 rounded px-2.5 py-0.5 bg-blue-50/30 w-fit">
              View Details
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
