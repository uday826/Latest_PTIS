"use client";

import React, { useState } from 'react';
import PropertySummary from './PropertySummary';
import { 
  CheckCircle2, 
  Map, 
  Wallet, 
  UserCheck, 
  Droplet, 
  ShieldCheck, 
  Briefcase, 
  Link2,
  FileText,
  Users,
  Building,
  Home,
  Percent,
  History,
  MoreVertical,
  Plus,
  ArrowUp,
  RefreshCcw,
  AlertTriangle,
  FileEdit,
  Camera,
  MapPin,
  Maximize2,
  Printer,
  Download,
  ChevronDown,
  Clock,
  FolderOpen,
  SlidersHorizontal
} from 'lucide-react';

export default function MainContent() {
  const [activeTab, setActiveTab] = useState<'property' | 'kyc' | 'society' | 'building' | 'discount' | 'old'>('property');
  const [activeSubTab, setActiveSubTab] = useState<'rateable' | 'capital' | 'dual' | 'reassessment'>('rateable');
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [hoveredImg, setHoveredImg] = useState<string | null>(null);
  const [hoverPosition, setHoverPosition] = useState<'left' | 'right'>('right');

  const handleHoverImage = (url: string | null, position: 'left' | 'right' = 'right') => {
    setHoveredImg(url);
    if (url) {
      setHoverPosition(position);
    }
  };

  const openPreview = (url: string) => {
    setSelectedImg(url);
  };

  return (
    <div className="flex-1 h-full overflow-hidden bg-transparent p-2.5 font-sans text-gray-800 relative z-10 flex flex-col gap-2">
      
      <PropertySummary onHoverImg={(url) => handleHoverImage(url, 'left')} onClickImg={openPreview} />

      {/* Unified Two-Column Layout (Zero scrolling, tight dimensions for perfect vertical fit) */}
      <div className="flex-1 min-h-0 flex gap-2.5 overflow-hidden">
        
        {/* Left Column: Badges, Tabs, and Tab Content Card */}
        <div className="flex-1 min-h-0 flex flex-col gap-2 overflow-hidden">
          
          {/* Status Badges Row (Tighter padding for zero scrolling) */}
          <div className="bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm text-xs flex flex-wrap items-center justify-between gap-y-1.5 shrink-0 select-none">
            <StatusBadge icon={<Map size={13} />} title="GIS Verified" status="Verified" statusColor="text-green-600" />
            <StatusBadge icon={<FileText size={13} />} title="Assessment" status="Approved" statusColor="text-green-600" />
            <StatusBadge icon={<Wallet size={13} />} title="Collection Status" status="Paid" statusColor="text-green-600" />
            <StatusBadge icon={<UserCheck size={13} />} title="KYC Status" status="Verified" statusColor="text-green-600" />
            <StatusBadge icon={<Droplet size={13} />} title="Water Connection" status="Active" statusColor="text-blue-600" isBlue />
            <StatusBadge icon={<ShieldCheck size={13} />} title="Fire NOC" status="Valid" statusColor="text-green-600" />
            <StatusBadge icon={<Briefcase size={13} />} title="Trade License" status="Active" statusColor="text-green-600" />
            <StatusBadge icon={<Link2 size={13} />} title="BPMS Linked" status="Yes" statusColor="text-green-600" />
          </div>

          {/* Tabs Navigation Bar (Tighter padding) */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden flex font-semibold text-xs text-gray-600 shadow-sm shrink-0">
            <Tab active={activeTab === 'property'} onClick={() => setActiveTab('property')} icon={<FolderOpen size={14} />} label="Property Details" />
            <Tab active={activeTab === 'kyc'} onClick={() => setActiveTab('kyc')} icon={<UserCheck size={14} />} label="KYC Details" />
            <Tab active={activeTab === 'society'} onClick={() => setActiveTab('society')} icon={<Users size={14} />} label="Society Details" />
            <Tab active={activeTab === 'building'} onClick={() => setActiveTab('building')} icon={<Building size={14} />} label="Building Permission" />
            <Tab active={activeTab === 'discount'} onClick={() => setActiveTab('discount')} icon={<Percent size={14} />} label="% Discount & Social Data" />
            <Tab active={activeTab === 'old'} onClick={() => setActiveTab('old')} icon={<History size={14} />} label="Old Details" />
          </div>

          {/* Tab Content Panel (100% Zero scrolling, tightly spaced contents) */}
          <div className="flex-1 min-h-0 bg-white border border-gray-200 rounded-lg p-2.5 shadow-sm flex flex-col overflow-hidden gap-2">
            
            {/* PANEL 1: Property Details */}
            {activeTab === 'property' && (
              <div className="flex-1 flex flex-col justify-between overflow-hidden gap-2 transition-all duration-300 animate-fadeIn">
                
                {/* Sub-tabs as rounded pills */}
                <div className="flex gap-2 text-[10px] pb-1 shrink-0 select-none">
                  <button 
                    onClick={() => setActiveSubTab('rateable')} 
                    className={`font-bold cursor-pointer px-3.5 py-1 rounded-full transition-all border ${activeSubTab === 'rateable' ? 'bg-[#7c3aed] text-white border-transparent' : 'bg-white text-gray-500 hover:text-gray-800 border-gray-200'}`}
                  >
                    Rateable
                  </button>
                  <button 
                    onClick={() => setActiveSubTab('capital')} 
                    className={`font-bold cursor-pointer px-3.5 py-1 rounded-full transition-all border ${activeSubTab === 'capital' ? 'bg-[#7c3aed] text-white border-transparent' : 'bg-white text-gray-500 hover:text-gray-800 border-gray-200'}`}
                  >
                    Capital
                  </button>
                  <button 
                    onClick={() => setActiveSubTab('dual')} 
                    className={`font-bold cursor-pointer px-3.5 py-1 rounded-full transition-all border ${activeSubTab === 'dual' ? 'bg-[#7c3aed] text-white border-transparent' : 'bg-white text-gray-500 hover:text-gray-800 border-gray-200'}`}
                  >
                    Dual Method
                  </button>
                  <button 
                    onClick={() => setActiveSubTab('reassessment')} 
                    className={`font-bold cursor-pointer px-3.5 py-1 rounded-full transition-all border ${activeSubTab === 'reassessment' ? 'bg-[#7c3aed] text-white border-transparent' : 'bg-white text-gray-500 hover:text-gray-800 border-gray-200'}`}
                  >
                    Reassessment
                  </button>
                </div>

                {/* Sub Tab Table (Extremely compact py-0.5) */}
                <div className="overflow-x-auto border border-gray-200 rounded-md shrink-0">
                  {activeSubTab === 'rateable' && (
                    <table className="w-full text-[11px] text-left animate-fadeIn">
                      <thead className="bg-[#1e2b58] text-white">
                        <tr>
                          <th className="py-1 px-1.5 w-16 text-center"><SlidersHorizontal size={12} className="inline text-white" /></th>
                          <th className="py-1 px-1.5 uppercase tracking-wider text-[9px] font-bold">Taxable</th>
                          <th className="py-1 px-1.5 uppercase tracking-wider text-[9px] font-bold">Floor</th>
                          <th className="py-1 px-1.5 uppercase tracking-wider text-[9px] font-bold">Son Year</th>
                          <th className="py-1 px-1.5 uppercase tracking-wider text-[9px] font-bold">Asst Year</th>
                          <th className="py-1 px-1.5 uppercase tracking-wider text-[9px] font-bold">Con Type</th>
                          <th className="py-1 px-1.5 uppercase tracking-wider text-[9px] font-bold">Use</th>
                          <th className="py-1 px-1.5 uppercase tracking-wider text-[9px] font-bold">Sub Type of Use</th>
                          <th className="py-1 px-1.5 uppercase tracking-wider text-[9px] font-bold text-center">No of Rooms</th>
                          <th className="py-1 px-1.5 uppercase tracking-wider text-[9px] font-bold">Carpet Area (ft/mtr)</th>
                          <th className="py-1 px-1.5 uppercase tracking-wider text-[9px] font-bold">Builtup Area (ft/mtr)</th>
                          <th className="py-1 px-1.5 uppercase tracking-wider text-[9px] font-bold text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 bg-white">
                        <tr className="hover:bg-gray-50">
                          <td className="py-1 px-1.5 flex items-center justify-center gap-1.5 text-gray-400">
                            <FileEdit size={11} className="text-blue-500 cursor-pointer" />
                            <Camera size={11} className="text-gray-400 cursor-pointer" />
                            <MapPin size={11} className="text-blue-500 cursor-pointer" />
                            <AlertTriangle size={11} className="text-red-500 cursor-pointer" />
                          </td>
                          <td className="py-1 px-1.5 text-red-500 font-bold">No</td>
                          <td className="py-1 px-1.5 font-medium text-gray-750">Open Plot</td>
                          <td className="py-1 px-1.5 text-gray-600">-</td>
                          <td className="py-1 px-1.5 text-gray-600">2026</td>
                          <td className="py-1 px-1.5 text-gray-600">2026</td>
                          <td className="py-1 px-1.5 text-gray-600">op</td>
                          <td className="py-1 px-1.5 text-blue-900 font-bold">खुला भूखंड</td>
                          <td className="py-1 px-1.5 text-gray-600 text-center">-</td>
                          <td className="py-1 px-1.5 text-gray-600 text-center">0</td>
                          <td className="py-1 px-1.5 font-bold text-gray-800">4305.60 / 400.00</td>
                          <td className="py-1 px-1.5 text-center text-gray-400 cursor-pointer"><MoreVertical size={12} className="mx-auto" /></td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="py-1 px-1.5 flex items-center justify-center gap-1.5 text-gray-400">
                            <FileEdit size={11} className="text-blue-500 cursor-pointer" />
                            <Camera size={11} className="text-gray-400 cursor-pointer" />
                            <MapPin size={11} className="text-blue-500 cursor-pointer" />
                            <CheckCircle2 size={11} className="text-green-500 cursor-pointer" />
                          </td>
                          <td className="py-1 px-1.5 text-green-600 font-bold">Yes</td>
                          <td className="py-1 px-1.5 font-medium text-gray-750">-</td>
                          <td className="py-1 px-1.5 text-gray-600">-</td>
                          <td className="py-1 px-1.5 text-gray-600">2026</td>
                          <td className="py-1 px-1.5 text-gray-600">2026</td>
                          <td className="py-1 px-1.5 text-gray-600">op</td>
                          <td className="py-1 px-1.5 text-blue-900 font-bold">निवासी</td>
                          <td className="py-1 px-1.5 text-gray-600 text-center">-</td>
                          <td className="py-1 px-1.5 text-gray-600 text-center">0</td>
                          <td className="py-1 px-1.5 font-bold text-gray-800">538.20 / 50.00</td>
                          <td className="py-1 px-1.5 text-center text-gray-400 cursor-pointer"><MoreVertical size={12} className="mx-auto" /></td>
                        </tr>
                      </tbody>
                    </table>
                  )}
                  {activeSubTab === 'capital' && (
                    <table className="w-full text-[11px] text-left animate-fadeIn">
                      <thead className="bg-[#1e2b58] text-white">
                        <tr>
                          <th className="py-1 px-1.5 w-10 text-center"><Home size={12} className="inline" /></th>
                          <th className="py-1 px-1.5 uppercase text-[9px] font-bold">Taxable</th>
                          <th className="py-1 px-1.5 uppercase text-[9px] font-bold">Use</th>
                          <th className="py-1 px-1.5 uppercase text-[9px] font-bold">Carpet</th>
                          <th className="py-1 px-1.5 uppercase text-[9px] font-bold">Builtup</th>
                          <th className="py-1 px-1.5 uppercase text-[9px] font-bold">Cap Value</th>
                          <th className="py-1 px-1.5 uppercase text-[9px] font-bold">Rate</th>
                          <th className="py-1 px-1.5 uppercase text-[9px] font-bold">Amount</th>
                          <th className="py-1 px-1.5 uppercase text-[9px] font-bold text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        <tr className="hover:bg-gray-50">
                          <td className="py-1 px-1.5 text-center text-gray-400"><FileEdit size={11} className="text-blue-500 cursor-pointer inline" /></td>
                          <td className="py-1 px-1.5 text-red-500 font-semibold">No</td>
                          <td className="py-1 px-1.5 text-red-600 font-semibold">खुला भूखंड</td>
                          <td className="py-1 px-1.5">4305.60 m²</td>
                          <td className="py-1 px-1.5">4305.60 m²</td>
                          <td className="py-1 px-1.5">₹12,50,000</td>
                          <td className="py-1 px-1.5">0.5%</td>
                          <td className="py-1 px-1.5 font-bold text-green-600">₹6,250</td>
                          <td className="py-1 px-1.5 text-center"><MoreVertical size={12} className="mx-auto" /></td>
                        </tr>
                      </tbody>
                    </table>
                  )}
                  {activeSubTab === 'dual' && (
                    <table className="w-full text-[11px] text-left animate-fadeIn">
                      <thead className="bg-[#1e2b58] text-white">
                        <tr>
                          <th className="py-1 px-1.5 w-10 text-center"><FileEdit size={11} className="inline text-white" /></th>
                          <th className="py-1 px-1.5 uppercase text-[9px] font-bold">Use</th>
                          <th className="py-1 px-1.5 uppercase text-[9px] font-bold">RV</th>
                          <th className="py-1 px-1.5 uppercase text-[9px] font-bold">RV Tax</th>
                          <th className="py-1 px-1.5 uppercase text-[9px] font-bold">CV</th>
                          <th className="py-1 px-1.5 uppercase text-[9px] font-bold">CV Tax</th>
                          <th className="py-1 px-1.5 uppercase text-[9px] font-bold">Calculated (Higher)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="hover:bg-gray-50">
                          <td className="py-1 px-1.5 text-center"><FileEdit size={11} className="text-blue-500 inline" /></td>
                          <td className="py-1 px-1.5 text-red-600 font-semibold">निवासी</td>
                          <td className="py-1 px-1.5">₹6,000</td>
                          <td className="py-1 px-1.5">₹900</td>
                          <td className="py-1 px-1.5">₹4,50,000</td>
                          <td className="py-1 px-1.5">₹1,350</td>
                          <td className="py-1 px-1.5 font-bold text-green-600">₹1,350</td>
                        </tr>
                      </tbody>
                    </table>
                  )}
                </div>

                {/* Add Component Button Row */}
                <div className="shrink-0 flex justify-start -mt-0.5">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 border border-dashed border-blue-200 bg-blue-50/10 hover:bg-blue-50/50 text-[#2563eb] text-[10px] font-bold rounded cursor-pointer transition-colors shadow-xs">
                    <Plus size={12} />
                    <span>Add New Component</span>
                  </button>
                </div>

                {/* 6 Cards (Tax, Collection, Penalty separated side-by-side as original layout) */}
                <div className="grid grid-cols-6 gap-2 shrink-0 select-none">
                  <ComparisonCard 
                    icon={<Map size={14} className="text-blue-500" />} 
                    title="Area Comparison" 
                    oldVal="400.00 m²" 
                    newVal="400.00 m²" 
                    change={<span className="text-green-500 flex items-center font-extrabold text-[10.5px]"><ArrowUp size={11} className="mr-0.5" /> 0 m²</span>}
                  />
                  <ComparisonCard 
                    icon={<RefreshCcw className="text-purple-500" size={14} />} 
                    title="Change of Use" 
                    oldVal="N/A" 
                    newVal={<span className="text-purple-600 font-bold">Mix</span>} 
                  />
                  <ComparisonCard 
                    icon={<ShieldCheck className="text-amber-500" size={14} />} 
                    title="Rateable Value (RV)" 
                    oldVal="₹0" 
                    newVal="₹0" 
                  />
                  <ComparisonCard 
                    icon={<FileText className="text-green-500" size={14} />} 
                    title="Tax" 
                    oldVal="₹0" 
                    newVal="₹0" 
                  />
                  <div className="border border-gray-200 rounded-lg py-1.5 px-2.5 bg-white shadow-sm flex items-start gap-2 flex-1">
                    <div className="bg-blue-50 p-1 rounded-full shadow-xs border border-blue-100/50 mt-0.5 shrink-0">
                      <Wallet className="text-blue-500" size={13} />
                    </div>
                    <div className="flex-1 text-[10px] leading-tight min-w-0">
                      <div className="font-extrabold text-gray-700 mb-0.5 truncate">Collection</div>
                      <div className="space-y-0.5 text-[9px]">
                        <div className="text-gray-400 font-semibold">Paid: <span className="font-bold text-gray-800">₹0</span></div>
                        <div className="text-red-500 font-semibold">Outstanding: <span className="font-bold">₹0</span></div>
                      </div>
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-lg py-1.5 px-2.5 bg-white shadow-sm flex items-start gap-2 flex-1">
                    <div className="bg-red-50 p-1 rounded-full shadow-xs border border-red-100/50 mt-0.5 shrink-0">
                      <AlertTriangle className="text-red-500" size={13} />
                    </div>
                    <div className="flex-1 text-[10px] leading-tight min-w-0">
                      <div className="font-extrabold text-gray-700 mb-0.5 truncate">Penalty</div>
                      <div className="space-y-0.5 text-[9px]">
                        <div className="text-gray-400 font-semibold">Penalty: <span className="font-bold text-gray-800">₹0</span></div>
                        <div className="text-gray-450 font-semibold">Interest: <span className="font-bold text-gray-800">₹0</span></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* TAX DETAILS Section (Compact height) */}
                <div className="shrink-0">
                  <h3 className="font-bold text-[#1e2b58] text-[10px] mb-1.5 uppercase tracking-wider">TAX DETAILS</h3>
                  <div className="overflow-x-auto border border-gray-200 rounded-md">
                    <table className="w-full text-[10px] text-center">
                      <thead className="bg-[#1e2b58] text-white font-semibold">
                        <tr>
                          <th className="py-1 px-1.5 uppercase text-[9px]">Taxes</th>
                          <th className="py-1 px-1.5 uppercase text-[9px]">General Tax</th>
                          <th className="py-1 px-1.5 uppercase text-[9px]">Tree Cess</th>
                          <th className="py-1 px-1.5 uppercase text-[9px]">Special Water Cess</th>
                          <th className="py-1 px-1.5 uppercase text-[9px]">Road Cess</th>
                          <th className="py-1 px-1.5 uppercase text-[9px]">Fire Cess</th>
                          <th className="py-1 px-1.5 uppercase text-[9px]">Light Cess</th>
                          <th className="py-1 px-1.5 uppercase text-[9px]">Water Benefit Cess</th>
                          <th className="py-1 px-1.5 uppercase text-[9px]">Sewage Disposal Cess</th>
                          <th className="py-1 px-1.5 uppercase text-[9px]">Special Education Tax</th>
                          <th className="py-1 px-1.5 uppercase text-[9px] bg-[#1e2b58]">Total Tax</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="bg-white">
                          <td className="py-1.5 px-1.5 font-bold text-gray-700 bg-gray-50 border-r border-gray-200">NET TAX</td>
                          
                          <td className="py-1 px-1.5 text-center">
                            <div className="font-extrabold text-[10px] text-gray-800">0</div>
                            <div className="flex flex-col items-center mt-0.5">
                              <div className="w-10 h-0.5 bg-gray-200 rounded-full overflow-hidden">
                                <div className="w-0 h-full bg-blue-500 rounded-full" />
                              </div>
                              <span className="text-[7.5px] text-gray-400 font-semibold mt-0.5">0%</span>
                            </div>
                          </td>

                          <td className="py-1 px-1.5 text-center">
                            <div className="font-extrabold text-[10px] text-gray-800">0</div>
                            <div className="flex flex-col items-center mt-0.5">
                              <div className="w-10 h-0.5 bg-gray-200 rounded-full overflow-hidden">
                                <div className="w-0 h-full bg-blue-500 rounded-full" />
                              </div>
                              <span className="text-[7.5px] text-gray-400 font-semibold mt-0.5">0%</span>
                            </div>
                          </td>

                          <td className="py-1 px-1.5 text-center">
                            <div className="font-extrabold text-[10px] text-gray-800">0</div>
                            <div className="flex flex-col items-center mt-0.5">
                              <div className="w-10 h-0.5 bg-gray-200 rounded-full overflow-hidden">
                                <div className="w-0 h-full bg-blue-500 rounded-full" />
                              </div>
                              <span className="text-[7.5px] text-gray-400 font-semibold mt-0.5">0%</span>
                            </div>
                          </td>

                          <td className="py-1 px-1.5 text-center">
                            <div className="font-extrabold text-[10px] text-gray-800">0</div>
                            <div className="flex flex-col items-center mt-0.5">
                              <div className="w-10 h-0.5 bg-gray-200 rounded-full overflow-hidden">
                                <div className="w-0 h-full bg-blue-500 rounded-full" />
                              </div>
                              <span className="text-[7.5px] text-gray-400 font-semibold mt-0.5">0%</span>
                            </div>
                          </td>

                          <td className="py-1 px-1.5 text-center">
                            <div className="font-extrabold text-[10px] text-gray-800">0</div>
                            <div className="flex flex-col items-center mt-0.5">
                              <div className="w-10 h-0.5 bg-gray-200 rounded-full overflow-hidden">
                                <div className="w-0 h-full bg-blue-500 rounded-full" />
                              </div>
                              <span className="text-[7.5px] text-gray-400 font-semibold mt-0.5">0%</span>
                            </div>
                          </td>

                          <td className="py-1 px-1.5 text-center">
                            <div className="font-extrabold text-[10px] text-gray-800">0</div>
                            <div className="flex flex-col items-center mt-0.5">
                              <div className="w-10 h-0.5 bg-gray-200 rounded-full overflow-hidden">
                                <div className="w-0 h-full bg-blue-500 rounded-full" />
                              </div>
                              <span className="text-[7.5px] text-gray-400 font-semibold mt-0.5">0%</span>
                            </div>
                          </td>

                          <td className="py-1 px-1.5 text-center">
                            <div className="font-extrabold text-[10px] text-gray-800">0</div>
                            <div className="flex flex-col items-center mt-0.5">
                              <div className="w-10 h-0.5 bg-gray-200 rounded-full overflow-hidden">
                                <div className="w-0 h-full bg-blue-500 rounded-full" />
                              </div>
                              <span className="text-[7.5px] text-gray-400 font-semibold mt-0.5">0%</span>
                            </div>
                          </td>

                          <td className="py-1 px-1.5 text-center">
                            <div className="font-extrabold text-[10px] text-gray-800">0</div>
                            <div className="flex flex-col items-center mt-0.5">
                              <div className="w-10 h-0.5 bg-gray-200 rounded-full overflow-hidden">
                                <div className="w-0 h-full bg-blue-500 rounded-full" />
                              </div>
                              <span className="text-[7.5px] text-gray-400 font-semibold mt-0.5">0%</span>
                            </div>
                          </td>

                          <td className="py-1 px-1.5 text-center">
                            <div className="font-extrabold text-[10px] text-gray-800">0</div>
                            <div className="flex flex-col items-center mt-0.5">
                              <div className="w-10 h-0.5 bg-gray-200 rounded-full overflow-hidden">
                                <div className="w-0 h-full bg-blue-500 rounded-full" />
                              </div>
                              <span className="text-[7.5px] text-gray-400 font-semibold mt-0.5">0%</span>
                            </div>
                          </td>

                          <td className="py-1 px-1.5 text-center bg-gray-50 border-l border-gray-200">
                            <div className="font-extrabold text-[10px] text-blue-600">0</div>
                            <div className="flex flex-col items-center mt-0.5">
                              <div className="w-10 h-0.5 bg-gray-200 rounded-full overflow-hidden">
                                <div className="w-0 h-full bg-blue-500 rounded-full" />
                              </div>
                              <span className="text-[7.5px] text-gray-400 font-semibold mt-0.5">0%</span>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Bottom Row Grid (Spans Info Blocks on Left + Timeline & Actions on Right) */}
                <div className="flex-1 min-h-0 grid grid-cols-5 gap-3 overflow-hidden">
                  
                  {/* Left Column (3/5 width): Info Blocks + Validation Status */}
                  <div className="col-span-3 flex flex-col justify-between gap-2.5 overflow-hidden">
                    {/* 5 Info Blocks (Tight list spacing) */}
                    <div className="grid grid-cols-5 gap-2 text-[9.5px] leading-tight">
                      <InfoList title="Construction Information" items={[
                        { label: 'Construction Year', value: '2026' },
                        { label: 'Assessment Year', value: '2028' },
                        { label: 'Construction Type', value: 'op' },
                        { label: 'Quality of Construction', value: 'Good' },
                        { label: 'Building Structure', value: 'RCC' },
                      ]} />
                      <InfoList title="Usage Details" items={[
                        { label: 'Use', value: 'निवासी' },
                        { label: 'Sub Type of Use', value: '-' },
                        { label: 'No. of Rooms', value: '0' },
                        { label: 'Wall Thickness', value: '9 Inch' },
                        { label: 'Floor Height', value: '10.0 Ft.' },
                      ]} />
                      <InfoList title="Occupancy Status" items={[
                        { label: 'Occupancy', value: 'Self Occupied' },
                        { label: 'Occupancy Type', value: 'Residential' },
                        { label: 'Usage Status', value: 'Active' },
                        { label: 'Present Since', value: '01-Apr-2024' },
                      ]} />
                      <InfoList title="Status Information" items={[
                        { label: 'Property Status', value: <span className="bg-green-100 text-green-700 font-bold px-1 rounded text-[8.5px] uppercase">Active</span> },
                        { label: 'Last Survey Date', value: '10 Jun 2024' },
                        { label: 'Last Updated On', value: '10 Jun 2024' },
                        { label: 'Updated By', value: 'Surveyor 01' },
                      ]} />
                      <div className="border border-amber-200 rounded bg-amber-50/20 p-2 text-[9px] flex flex-col justify-between shadow-xs">
                        <div>
                          <div className="font-bold text-[#1e2b58] mb-1.5 uppercase tracking-wider">AI Property Inspector</div>
                          <ul className="space-y-1 font-semibold text-[8px]">
                            <li className="flex items-center gap-0.5 text-amber-600 truncate">
                              <AlertTriangle size={9} className="text-amber-500" /> Poss Comm Use
                            </li>
                            <li className="flex items-center gap-0.5 text-amber-600 truncate">
                              <AlertTriangle size={9} className="text-amber-500" /> Area Diff Found
                            </li>
                            <li className="flex items-center gap-0.5 text-amber-600 truncate">
                              <AlertTriangle size={9} className="text-amber-500" /> Parking Missing
                            </li>
                            <li className="flex items-center gap-0.5 text-red-600 truncate">
                              <AlertTriangle size={9} className="text-red-500" /> Fire NOC Expired
                            </li>
                            <li className="flex items-center gap-0.5 text-amber-600 truncate">
                              <AlertTriangle size={9} className="text-amber-500" /> Dupl Water Conn
                            </li>
                          </ul>
                        </div>
                        <button className="text-[#2563eb] text-[8px] font-bold mt-1.5 hover:underline text-center w-full pt-1 border-t border-gray-100 cursor-pointer">
                          View AI Report
                        </button>
                      </div>
                    </div>

                    {/* Validation Status Block */}
                    <div className="border-t border-gray-150 pt-2 shrink-0">
                      <div className="text-[10px] font-bold text-gray-800 mb-1.5 uppercase tracking-wider">Validation Status</div>
                      <div className="flex justify-between gap-1.5 text-[9px] font-semibold text-gray-600">
                         <ValStatus icon={<Camera size={11} />} label="Photo" status="Valid" />
                         <ValStatus icon={<Map size={11} />} label="GIS" status="Verified" />
                         <ValStatus icon={<UserCheck size={11} />} label="Aadhaar" status="Verified" />
                         <ValStatus icon={<UserCheck size={11} />} label="Mobile" status="Verified" />
                         <ValStatus icon={<FileText size={11} />} label="Docs" status="Complete" />
                         <ValStatus icon={<Droplet size={11} />} label="Water" status="Not Linked" warn />
                         <ValStatus icon={<ShieldCheck size={11} />} label="Fire" status="Expired" danger />
                         <ValStatus icon={<FileEdit size={11} />} label="Mutation" status="Pending" warn />
                         <ValStatus icon={<Link2 size={11} />} label="BPMS" status="Linked" />
                      </div>
                    </div>
                  </div>

                  {/* Right Column (2/5 width): Timeline + Quick Actions */}
                  <div className="col-span-2 flex flex-col justify-between gap-2 overflow-hidden border-l border-gray-150 pl-3">
                    
                    {/* Property Timeline */}
                    <div className="bg-white rounded-lg border border-gray-200 p-2 shadow-xs shrink-0">
                      <div className="flex items-center justify-between text-[10px] font-bold text-[#1e2b58] mb-1.5 uppercase tracking-wider">
                        <span>Property Timeline</span>
                        <Clock size={11} className="text-gray-400" />
                      </div>
                      <div className="relative flex items-center justify-between px-1 pt-1.5 pb-1 text-[7.5px] select-none">
                        {/* Timeline background lines */}
                        <div className="absolute top-[12px] left-4 right-4 h-[1.5px] bg-green-500 -z-10"></div>
                        <div className="absolute top-[12px] right-4 w-[12%] h-[1.5px] border-t border-dashed border-gray-300 -z-10"></div>
                        
                        <TimelineStep label="Geo Sequencing" date="15-Jan-2024" active />
                        <TimelineStep label="Survey" date="18-Jan-2024" active />
                        <TimelineStep label="Verification" date="20-Feb-2024" active />
                        <TimelineStep label="Assessment" date="01-Apr-2024" active />
                        <TimelineStep label="Approval" date="18-Apr-2024" active />
                        <TimelineStep label="Bill Gen." date="20-Apr-2024" active />
                        <TimelineStep label="Collection" date="08-May-2024" active />
                        <TimelineStep label="Mutation" date="Pending" isPending />
                      </div>
                    </div>

                    {/* Quick Actions (Mockup exact styling) */}
                    <div className="flex-1 flex flex-col justify-end gap-1.5 shrink-0 mt-1">
                       <div className="text-[10px] font-bold text-gray-800 uppercase tracking-wider">Quick Actions</div>
                       <div className="grid grid-cols-2 gap-1.5 text-[9px] select-none">
                         <ActionButton icon={<FileEdit size={11} className="text-blue-500" />} label="Edit Property" bg="bg-blue-50/50" text="text-blue-700" borderClass="border border-blue-100" />
                         <ActionButton icon={<Printer size={11} className="text-green-500" />} label="Print Property Card" bg="bg-green-50/50" text="text-green-700" borderClass="border border-green-100" />
                         <ActionButton icon={<FileText size={11} className="text-purple-500" />} label="View Demand" bg="bg-purple-50/50" text="text-purple-700" borderClass="border border-purple-100" />
                         <ActionButton icon={<Wallet size={11} className="text-orange-500" />} label="View Collection" bg="bg-orange-50/50" text="text-orange-700" borderClass="border border-orange-100" />
                         <ActionButton icon={<AlertTriangle size={11} className="text-red-500" />} label="Generate Notice" bg="bg-red-50/50" text="text-red-700" borderClass="border border-red-100" />
                         <ActionButton icon={<History size={11} className="text-blue-500" />} label="Property History" bg="bg-blue-50/50" text="text-blue-700" borderClass="border border-blue-100" />
                         <ActionButton icon={<Download size={11} className="text-green-500" />} label="Download GIS" bg="bg-green-50/50" text="text-green-700" borderClass="border border-green-100" />
                         
                         <button className="flex items-center justify-between px-2.5 py-1.5 rounded text-[9.5px] font-bold border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 cursor-pointer shadow-xs">
                           <span>More Actions</span> <ChevronDown size={11} />
                         </button>
                       </div>
                    </div>

                  </div>
                </div>

              </div>
            )}

            {/* Panel 2-6 definitions kept intact but overflow controlled */}
            {activeTab === 'kyc' && (
              <div className="flex-1 overflow-hidden transition-all duration-300 animate-fadeIn text-xs">
                <div className="flex items-center justify-between border-b border-gray-150 pb-2 mb-3">
                  <h3 className="font-bold text-[#1e2b58]">KYC Verification</h3>
                  <span className="bg-green-150 text-green-800 text-[10px] px-2 py-0.5 rounded-full font-bold">COMPLETED</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-gray-50/50 p-3 border border-gray-150 rounded">
                    <div className="font-bold text-gray-800 mb-1">Aadhaar</div>
                    <div className="text-[10px] text-gray-500">Status: <span className="text-green-600 font-bold">LINKED</span></div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'society' && <div className="p-3 text-xs text-gray-500">Society Details loaded.</div>}
            {activeTab === 'building' && <div className="p-3 text-xs text-gray-500">Building Permission loaded.</div>}
            {activeTab === 'discount' && <div className="p-3 text-xs text-gray-500">Discounts & Social concessions.</div>}
            {activeTab === 'old' && <div className="p-3 text-xs text-gray-500">Historical records loaded.</div>}

          </div>

        </div>

        {/* Right Column: Photos Card + Map Stack (Scrolls internally if height is constrained) */}
        <div className="w-64 shrink-0 flex flex-col gap-2.5 overflow-y-auto no-scrollbar h-full pb-1">
          
          {/* Photos Row (Side-by-side) */}
          <div className="flex gap-2.5 shrink-0 select-none">
            {/* Property Photo Box */}
            <div 
              onMouseEnter={() => handleHoverImage("https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop")}
              onMouseLeave={() => handleHoverImage(null)}
              className="flex-1 bg-white border border-gray-200 rounded-lg p-2 flex flex-col justify-between shadow-sm group hover:border-blue-300 transition-colors cursor-pointer"
            >
              <div className="text-[10px] font-bold text-[#1e2b58] mb-1 uppercase tracking-wider">Property Photo</div>
              <div className="overflow-hidden rounded h-16 w-full relative">
                <img 
                  src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=200&auto=format&fit=crop" 
                  className="w-full h-full object-cover rounded transition-transform duration-500 group-hover:scale-150" 
                  alt="Property" 
                  onClick={() => openPreview("https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop")}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 flex items-center justify-center transition-all duration-300">
                  <Maximize2 size={14} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>

            {/* Photo Plan */}
            <div 
              onMouseEnter={() => handleHoverImage("/blueprint_plan.png")}
              onMouseLeave={() => handleHoverImage(null)}
              className="flex-1 bg-white border border-gray-200 rounded-lg p-2 flex flex-col justify-between shadow-sm group hover:border-blue-300 transition-colors cursor-pointer"
            >
              <div className="text-[10px] font-bold text-[#1e2b58] mb-1 uppercase tracking-wider">Photo Plan</div>
              <div className="overflow-hidden rounded h-16 w-full relative bg-gray-50 flex items-center justify-center border border-dashed border-gray-200">
                <img 
                  src="/blueprint_plan.png" 
                  className="w-full h-full object-contain rounded transition-transform duration-500 group-hover:scale-150" 
                  alt="Blueprint Plan" 
                  onClick={() => openPreview("/blueprint_plan.png")}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 flex items-center justify-center transition-all duration-300">
                  <Maximize2 size={14} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>
          </div>

          {/* GIS Map Card */}
          <div 
            onMouseEnter={() => handleHoverImage("https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop")}
            onMouseLeave={() => handleHoverImage(null)}
          >
            <MapBox 
              title="GIS / Satellite View" 
              height="h-24" 
              imgUrl="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=400&auto=format&fit=crop" 
              onZoom={() => openPreview("https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop")}
            />
          </div>
          
          {/* Interactive Before/After Change Detection Slider Card */}
          <div 
            onMouseEnter={() => handleHoverImage("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop")}
            onMouseLeave={() => handleHoverImage(null)}
          >
            <ChangeDetectionBox 
              title="Change Detection" 
              height="h-24"
              beforeImg="https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=400&auto=format&fit=crop" 
              afterImg="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400&auto=format&fit=crop" 
              onZoom={() => openPreview("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop")}
            />
          </div>

          {/* Actual Street View Road Image */}
          <div 
            onMouseEnter={() => handleHoverImage("https://images.unsplash.com/photo-1566837945700-30057527ade0?q=80&w=800&auto=format&fit=crop")}
            onMouseLeave={() => handleHoverImage(null)}
          >
            <MapBox 
              title="Street View" 
              height="h-24" 
              imgUrl="https://images.unsplash.com/photo-1566837945700-30057527ade0?q=80&w=400&auto=format&fit=crop" 
              onZoom={() => openPreview("https://images.unsplash.com/photo-1566837945700-30057527ade0?q=80&w=800&auto=format&fit=crop")}
            />
          </div>

        </div>

      </div>

      {/* Floating Hover Zoom Portal */}
      {hoveredImg && (
        <div className={`fixed z-50 w-96 bg-white border border-gray-300 rounded-xl shadow-2xl p-2.5 pointer-events-none animate-fadeIn flex flex-col gap-2 ${hoverPosition === 'left' ? 'left-72 top-[180px]' : 'right-72 top-24'}`}>
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex justify-between">
            <span>Complete Zoom View</span>
            <span className="text-[#1e2b58] font-semibold text-[8px] bg-blue-50 px-1 py-0.25 rounded">Live Preview</span>
          </div>
          <div className="overflow-hidden rounded-lg border border-gray-100 bg-gray-50 h-72 w-full flex items-center justify-center">
            <img src={hoveredImg} className="w-full h-full object-contain" alt="Complete Zoom" />
          </div>
        </div>
      )}

      {/* Cool Hover Zoom Backdrop / Modal overlay */}
      {selectedImg && (
        <div 
          onClick={() => setSelectedImg(null)}
          className="fixed inset-0 bg-black/75 flex items-center justify-center z-[999] cursor-zoom-out animate-fadeIn font-sans"
        >
          <div className="relative max-w-4xl max-h-[85vh] p-2 bg-white rounded-xl shadow-2xl">
            <img src={selectedImg} alt="Large Preview" className="max-w-full max-h-[80vh] rounded-lg object-contain" />
            <div className="text-center text-xs text-gray-500 mt-2 font-medium">Click anywhere to close preview</div>
          </div>
        </div>
      )}

    </div>
  );
}

/* Helper Components */

function StatusBadge({ icon, title, status, statusColor, isBlue }: any) {
  const bgClass = isBlue ? 'bg-blue-50 text-blue-500' : 'bg-green-50 text-green-500';
  return (
    <div className="flex items-center gap-2 pr-4 border-r border-gray-150 last:border-0 last:pr-0 shrink-0 flex-1 justify-center">
      <div className={`p-1.5 rounded-full flex items-center justify-center ${bgClass}`}>
        {icon}
      </div>
      <div>
        <div className="text-[8.5px] text-gray-400 font-bold uppercase leading-none">{title}</div>
        <div className={`text-[10px] font-extrabold mt-1 leading-none ${statusColor}`}>{status}</div>
      </div>
    </div>
  );
}

function Tab({ icon, label, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-1.5 px-4 py-2.5 border-r border-gray-200 transition-all cursor-pointer text-[10.5px] font-bold ${active ? 'bg-[#1e2b58] text-white' : 'hover:bg-gray-50 bg-white text-gray-600'}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function ComparisonCard({ icon, title, oldVal, newVal, change }: any) {
  return (
    <div className="border border-gray-200 rounded-lg py-1.5 px-2.5 bg-white shadow-sm flex items-start gap-2 flex-1">
      <div className="bg-gray-50 p-1 rounded-full border border-gray-100 mt-0.5">
        {icon}
      </div>
      <div className="flex-1 text-[10px] leading-tight">
        <div className="font-extrabold text-gray-700 mb-0.5">{title}</div>
        <div className="flex justify-between items-end">
          <div className="space-y-0.5">
            <div className="text-gray-450 font-semibold">OLD: <span className="font-bold text-gray-800">{oldVal}</span></div>
            <div className="text-gray-450 font-semibold">NEW: <span className="font-bold text-gray-805">{newVal}</span></div>
          </div>
          {change && <div>{change}</div>}
        </div>
      </div>
    </div>
  );
}

function InfoList({ title, items }: any) {
  return (
    <div className="flex-1 min-w-0 bg-white border border-gray-200 rounded-lg p-2 shadow-xs">
      <div className="font-bold text-[#1e2b58] mb-1.5 uppercase tracking-wider truncate border-b border-gray-100 pb-1">{title}</div>
      <ul className="space-y-1">
        {items.map((it: any, idx: number) => (
          <div key={idx} className="flex flex-col text-[8.5px] leading-none mb-1">
            <span className="text-gray-400 font-bold truncate mb-0.5">{it.label}</span>
            <span className={`font-extrabold truncate ${it.valueColor || 'text-gray-800'}`}>{it.value}</span>
          </div>
        ))}
      </ul>
    </div>
  );
}

function TimelineStep({ label, date, active, isPending }: any) {
  return (
    <div className="flex flex-col items-center gap-1 z-10 flex-1 min-w-0">
      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center bg-white ${active ? 'border-green-500 text-green-500 bg-green-50' : 'border-gray-300 text-gray-400 bg-gray-50'}`}>
        {active ? (
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
        ) : isPending ? (
          <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
        ) : null}
      </div>
      <div className="text-center font-bold text-[8px] text-gray-700 truncate w-full leading-none">{label}</div>
      <div className="text-center text-[7px] text-gray-450 truncate w-full mt-0.5">{date}</div>
    </div>
  );
}

function ValStatus({ icon, label, status, warn, danger }: any) {
  let statusColor = 'text-green-600';
  let statusIcon = <CheckCircle2 size={10} className="text-green-500 shrink-0" />;
  
  if (warn) {
    statusColor = 'text-amber-600';
    statusIcon = <AlertTriangle size={10} className="text-amber-500 shrink-0" />;
  }
  if (danger) {
    statusColor = 'text-red-600';
    statusIcon = <AlertTriangle size={10} className="text-red-500 shrink-0" />;
  }

  return (
    <div className="flex flex-col items-center flex-1 min-w-[62px] bg-white rounded border border-gray-200 p-1 text-center shadow-xs">
      <div className="flex items-center gap-0.5 text-[8.5px] text-gray-500 font-bold truncate leading-none mb-1">
        {icon}
        <span>{label}</span>
      </div>
      <div className={`flex items-center gap-0.5 font-bold text-[8.5px] ${statusColor} leading-none mt-0.5`}>
        {statusIcon}
        <span>{status}</span>
      </div>
    </div>
  );
}

function ActionButton({ icon, label, bg, text, borderClass }: any) {
  return (
    <button className={`flex items-center justify-center gap-1 px-2 py-1.5 rounded text-[9px] font-bold ${bg} ${text} ${borderClass || 'border border-transparent'} hover:brightness-95 transition-all cursor-pointer shadow-xs truncate`}>
      {icon} <span className="truncate">{label}</span>
    </button>
  );
}

function MapBox({ title, height, imgUrl, onZoom }: any) {
  return (
    <div className="bg-white border border-gray-200 rounded overflow-hidden flex flex-col group shadow-sm hover:border-blue-300 transition-colors">
      <div className="px-2 py-1 font-bold text-[#1e2b58] text-[9px] bg-gray-50 border-b border-gray-100 uppercase tracking-wider">{title}</div>
      <div className={`w-full ${height} bg-gray-200 relative overflow-hidden`}>
        <img 
          src={imgUrl} 
          className="w-full h-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-150 cursor-pointer" 
          alt={title} 
          onClick={onZoom}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 flex items-center justify-center transition-all duration-300">
          <Maximize2 size={16} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="absolute top-1.5 right-1.5 bg-white/80 p-0.5 rounded shadow-sm group-hover:bg-white transition-colors pointer-events-none">
          <MapPin size={11} className="text-red-600" />
        </div>
      </div>
    </div>
  );
}

// Custom interactive Before/After comparison slider box for Change Detection
function ChangeDetectionBox({ title, height, beforeImg, afterImg, onZoom }: any) {
  const [sliderPos, setSliderPos] = useState(50);
  
  return (
    <div className="bg-white border border-gray-200 rounded overflow-hidden flex flex-col group shadow-sm hover:border-blue-300 transition-colors relative">
      <div className="px-2 py-1 font-bold text-[#1e2b58] text-[9px] bg-gray-50 border-b border-gray-100 uppercase tracking-wider flex justify-between items-center">
        <span>{title}</span>
        <span className="text-[7.5px] bg-blue-50 text-blue-600 px-1 py-0.25 rounded font-normal">Drag to compare</span>
      </div>
      
      <div className={`w-full ${height} bg-gray-200 relative overflow-hidden select-none`}>
        {/* Before Image (Forest field) */}
        <img 
          src={beforeImg} 
          className="absolute inset-0 w-full h-full object-cover pointer-events-none" 
          alt="Before" 
        />
        <div className="absolute bottom-1.5 left-1.5 bg-black/60 text-[7.5px] font-bold text-white px-1 py-0.5 rounded z-20 pointer-events-none uppercase tracking-wider">
          Before
        </div>

        {/* After Image Overlay (Clipped by slider position width) */}
        <div className="absolute inset-0 overflow-hidden z-10 pointer-events-none" style={{ width: `${sliderPos}%` }}>
          {/* Keep fixed width matching the map card width (256px / 16rem) to prevent distortion */}
          <img 
            src={afterImg} 
            className="absolute inset-0 w-[256px] h-[96px] object-cover max-w-none pointer-events-none" 
            style={{ width: '256px', height: '96px' }}
            alt="After" 
          />
          <div className="absolute bottom-1.5 right-1.5 bg-blue-600/80 text-[7.5px] font-bold text-white px-1 py-0.5 rounded z-20 pointer-events-none uppercase tracking-wider whitespace-nowrap" style={{ right: `${100 - sliderPos}%` }}>
            After
          </div>
        </div>

        {/* Vertical divider line */}
        <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-md z-20 pointer-events-none" style={{ left: `${sliderPos}%` }}>
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white border border-gray-300 shadow flex items-center justify-center text-[7.5px] font-bold text-gray-500 pointer-events-none">
            ↔
          </div>
        </div>

        {/* Transparent Range slider overlaid to capture mouse drag events */}
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={sliderPos} 
          onChange={(e) => setSliderPos(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30" 
        />
      </div>
    </div>
  );
}
