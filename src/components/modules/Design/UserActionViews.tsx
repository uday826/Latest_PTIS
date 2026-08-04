"use client";

import React, { useState } from 'react';
import { 
  Plus, Edit, Image as ImageIcon, MapPin, Send, CheckCircle, 
  XCircle, AlertTriangle, RefreshCw, FileText, Lock, Eye, ArrowRight 
} from 'lucide-react';
import { Toaster, toast } from 'sonner';

// ==========================================
// 1. SURVEYOR WORKSPACE COMPONENT
// ==========================================
export function SurveyorActionView() {
  const [activeSubTab, setActiveSubTab] = useState<'create' | 'edit' | 'photos' | 'gis'>('create');
  const [formData, setFormData] = useState({
    ownerName: 'Matoshree Builders Pvt Ltd',
    mobile: '+91 98765 43210',
    useType: 'Residential',
    carpetArea: '538.20',
    bua: '538.20',
    floors: 'G + 4',
    lat: '19.2144',
    lng: '72.9864',
    photoUploaded: false
  });
  const [status, setStatus] = useState<'Draft' | 'Submitted'>('Draft');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Submitted');
    toast.success("Survey details submitted for QC Audit successfully!", {
      description: "Case status: Pending QC Review",
    });
  };

  const handleUploadPhoto = () => {
    setFormData(prev => ({ ...prev, photoUploaded: true }));
    toast.success("Photo uploaded successfully!");
  };

  const handleGetLocation = () => {
    setFormData(prev => ({ ...prev, lat: '19.214469', lng: '72.966363' }));
    toast.success("GIS Location pinned from device GPS!");
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50/50 p-5 font-sans text-gray-800 animate-fadeIn overflow-y-auto no-scrollbar">
      <Toaster position="top-right" richColors />
      {/* Title Header */}
      <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-3">
        <div>
          <h2 className="text-lg font-black text-[#1e2b58] uppercase tracking-wider flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-pulse" />
            Surveyor Field Collection Workspace
          </h2>
          <p className="text-[10px] text-gray-500 mt-0.5">Collect the truth from the ground and submit revised property details.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-extrabold uppercase text-gray-400">Status:</span>
          <span className={`text-[9px] font-black px-2 py-0.5 rounded border uppercase ${
            status === 'Draft' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-green-50 text-green-700 border-green-200'
          }`}>
            {status}
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-stretch flex-1 min-h-0">
        {/* Left menu column */}
        <div className="w-full lg:w-48 bg-white border border-gray-200 rounded-xl p-2.5 shrink-0 flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible no-scrollbar">
          <button 
            onClick={() => setActiveSubTab('create')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] font-bold w-full transition cursor-pointer select-none whitespace-nowrap ${
              activeSubTab === 'create' ? 'bg-blue-600 text-white shadow-xs' : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <Plus size={14} />
            Create Survey
          </button>
          <button 
            onClick={() => setActiveSubTab('edit')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] font-bold w-full transition cursor-pointer select-none whitespace-nowrap ${
              activeSubTab === 'edit' ? 'bg-blue-600 text-white shadow-xs' : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <Edit size={14} />
            Edit Draft
          </button>
          <button 
            onClick={() => setActiveSubTab('photos')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] font-bold w-full transition cursor-pointer select-none whitespace-nowrap ${
              activeSubTab === 'photos' ? 'bg-blue-600 text-white shadow-xs' : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <ImageIcon size={14} />
            Upload Photos
          </button>
          <button 
            onClick={() => setActiveSubTab('gis')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] font-bold w-full transition cursor-pointer select-none whitespace-nowrap ${
              activeSubTab === 'gis' ? 'bg-blue-600 text-white shadow-xs' : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <MapPin size={14} />
            Add GIS Location
          </button>
        </div>

        {/* Right content column */}
        <div className="flex-1 bg-white border border-gray-200 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex-grow">
            {activeSubTab === 'create' && (
              <form onSubmit={handleSubmit} className="space-y-3.5 max-w-xl text-[11px]">
                <h3 className="font-extrabold text-[#1e2b58] text-[12px] uppercase border-b pb-1.5 mb-3 flex items-center gap-2">
                  <FileText size={13} className="text-blue-600" />
                  Property Survey Details Form
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-gray-600">Owner Name</label>
                    <input 
                      type="text" 
                      className="border border-gray-300 rounded px-2.5 py-1.5 font-semibold text-gray-800 outline-none focus:border-blue-500" 
                      value={formData.ownerName}
                      onChange={e => setFormData({ ...formData, ownerName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-gray-600">Mobile Number</label>
                    <input 
                      type="text" 
                      className="border border-gray-300 rounded px-2.5 py-1.5 font-semibold text-gray-800 outline-none focus:border-blue-500" 
                      value={formData.mobile}
                      onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-gray-600">Use Category</label>
                    <select 
                      className="border border-gray-300 rounded px-2.5 py-1.5 font-semibold text-gray-800 outline-none focus:border-blue-500 bg-white"
                      value={formData.useType}
                      onChange={e => setFormData({ ...formData, useType: e.target.value })}
                    >
                      <option>Residential</option>
                      <option>Commercial</option>
                      <option>Mixed Use</option>
                      <option>Industrial</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-gray-600">Number of Floors</label>
                    <input 
                      type="text" 
                      className="border border-gray-300 rounded px-2.5 py-1.5 font-semibold text-gray-800 outline-none focus:border-blue-500" 
                      value={formData.floors}
                      onChange={e => setFormData({ ...formData, floors: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-gray-600">Carpet Area (sqft)</label>
                    <input 
                      type="number" 
                      className="border border-gray-300 rounded px-2.5 py-1.5 font-semibold text-gray-800 outline-none focus:border-blue-500" 
                      value={formData.carpetArea}
                      onChange={e => setFormData({ ...formData, carpetArea: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-gray-600">Built-Up Area (sqft)</label>
                    <input 
                      type="number" 
                      className="border border-gray-300 rounded px-2.5 py-1.5 font-semibold text-gray-800 outline-none focus:border-blue-500" 
                      value={formData.bua}
                      onChange={e => setFormData({ ...formData, bua: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="pt-4">
                  <button 
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-4 py-2 rounded-lg uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-sm ml-auto"
                  >
                    <Send size={13} />
                    Submit for QC Audit
                  </button>
                </div>
              </form>
            )}

            {activeSubTab === 'edit' && (
              <div className="space-y-3.5 max-w-xl text-[11px]">
                <h3 className="font-extrabold text-[#1e2b58] text-[12px] uppercase border-b pb-1.5 mb-3 flex items-center gap-2">
                  <Edit size={13} className="text-blue-600" />
                  Edit Draft Survey
                </h3>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-amber-800 mb-4 flex items-start gap-2.5 leading-normal">
                  <AlertTriangle size={15} className="shrink-0 mt-0.5" />
                  <div>
                    <strong>Draft Found:</strong> Matoshree Builders survey draft was auto-saved on 04-Aug-2026. You can edit, adjust, or discard the draft fields below.
                  </div>
                </div>
                <div className="space-y-2">
                  <p><strong>Owner Name:</strong> {formData.ownerName}</p>
                  <p><strong>Mobile:</strong> {formData.mobile}</p>
                  <p><strong>Current Area:</strong> {formData.carpetArea} sqft (Carpet) / {formData.bua} sqft (BUA)</p>
                  <p><strong>GIS Status:</strong> {formData.lat}, {formData.lng}</p>
                </div>
                <button 
                  onClick={() => setActiveSubTab('create')}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-extrabold px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer mt-3"
                >
                  Edit in form view <ArrowRight size={12} />
                </button>
              </div>
            )}

            {activeSubTab === 'photos' && (
              <div className="space-y-4 max-w-lg text-[11px] leading-normal">
                <h3 className="font-extrabold text-[#1e2b58] text-[12px] uppercase border-b pb-1.5 mb-3 flex items-center gap-2">
                  <ImageIcon size={13} className="text-blue-600" />
                  Property Photo Upload
                </h3>
                <p className="text-gray-500">Upload physical photos of the property building facade, entrance, and any extensions for verification.</p>
                
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors bg-gray-50/50 flex flex-col items-center justify-center gap-2.5">
                  {formData.photoUploaded ? (
                    <>
                      <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=300&auto=format&fit=crop" className="w-40 h-28 object-cover rounded-lg border shadow-xs" alt="Property Preview" />
                      <span className="text-green-600 font-bold flex items-center gap-1"><CheckCircle size={13} /> facade_survey_img.jpg uploaded</span>
                      <button onClick={() => setFormData(prev => ({ ...prev, photoUploaded: false }))} className="text-red-500 hover:underline font-bold">Remove and re-upload</button>
                    </>
                  ) : (
                    <>
                      <ImageIcon size={30} className="text-gray-400" />
                      <div>
                        <button type="button" onClick={handleUploadPhoto} className="text-blue-600 font-black hover:underline">Click to upload photo</button>
                        <span className="text-gray-400"> or drag and drop</span>
                      </div>
                      <span className="text-gray-400 text-[10px]">PNG, JPG up to 10MB</span>
                    </>
                  )}
                </div>
              </div>
            )}

            {activeSubTab === 'gis' && (
              <div className="space-y-4 max-w-lg text-[11px] leading-normal">
                <h3 className="font-extrabold text-[#1e2b58] text-[12px] uppercase border-b pb-1.5 mb-3 flex items-center gap-2">
                  <MapPin size={13} className="text-blue-600" />
                  GIS Mapping & Coordinates
                </h3>
                <p className="text-gray-500">Pin GPS coordinates directly from site to ensure location accuracy.</p>
                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="font-bold text-gray-500 block mb-1">Latitude</label>
                    <input type="text" readOnly className="border border-gray-300 bg-gray-50 rounded px-2.5 py-1.5 font-semibold text-gray-700 w-full" value={formData.lat} />
                  </div>
                  <div>
                    <label className="font-bold text-gray-500 block mb-1">Longitude</label>
                    <input type="text" readOnly className="border border-gray-300 bg-gray-50 rounded px-2.5 py-1.5 font-semibold text-gray-700 w-full" value={formData.lng} />
                  </div>
                </div>
                <div className="pt-2 flex gap-3">
                  <button 
                    type="button"
                    onClick={handleGetLocation}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-3.5 py-2 rounded-lg uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <MapPin size={13} />
                    Pin GPS Location
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      toast.info("GIS Boundary Map opened in separate panel.");
                    }}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 font-extrabold px-3.5 py-2 rounded-lg uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye size={13} />
                    View Boundary Map
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


// ==========================================
// 2. QC AUDITOR WORKSPACE COMPONENT
// ==========================================
export function QcActionView() {
  const [status, setStatus] = useState<'Pending' | 'Approved' | 'Returned'>('Pending');
  const [observations, setObservations] = useState('');

  const handleAuditAction = (actionType: 'approve' | 'return') => {
    if (actionType === 'approve') {
      setStatus('Approved');
      toast.success("Survey approved and forwarded for final approval sign-off!");
    } else {
      if (!observations.trim()) {
        toast.error("Please enter observation details before returning the survey!");
        return;
      }
      setStatus('Returned');
      toast.warning("Survey returned to field surveyor for correction!");
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50/50 p-5 font-sans text-gray-800 animate-fadeIn overflow-y-auto no-scrollbar">
      <Toaster position="top-right" richColors />
      {/* Title Header */}
      <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-3">
        <div>
          <h2 className="text-lg font-black text-[#8a6d1c] uppercase tracking-wider flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-amber-500 rounded-full" />
            QC Auditor Verification Panel
          </h2>
          <p className="text-[10px] text-gray-500 mt-0.5">Audit field reports, compare layouts, check images/GIS, and approve or request re-surveys.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-extrabold uppercase text-gray-400">Audit Status:</span>
          <span className={`text-[9px] font-black px-2 py-0.5 rounded border uppercase ${
            status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
            status === 'Approved' ? 'bg-green-50 text-green-700 border-green-200' : 
            'bg-red-50 text-red-700 border-red-200'
          }`}>
            {status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch flex-1 min-h-0 text-[11px]">
        {/* Left 2 Columns: Data Audit & comparison */}
        <div className="lg:col-span-2 space-y-4">
          {/* Comparison table card */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
            <h3 className="font-extrabold text-[#1e2b58] text-[12px] uppercase border-b pb-1.5 mb-3">Compare Old vs Surveyor Survey Data</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-extrabold uppercase">
                    <th className="py-2 px-3">Field</th>
                    <th className="py-2 px-3">Prior Value (Registered)</th>
                    <th className="py-2 px-3">Surveyor Value (Proposed)</th>
                    <th className="py-2 px-3">Variance / Analysis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150 font-semibold text-gray-700">
                  <tr>
                    <td className="py-2.5 px-3">Owner Name</td>
                    <td className="py-2.5 px-3">Matoshree Builders Pvt Ltd</td>
                    <td className="py-2.5 px-3 text-blue-600">Matoshree Builders Pvt Ltd</td>
                    <td className="py-2.5 px-3 text-green-600">Matched</td>
                  </tr>
                  <tr className="bg-amber-50/20">
                    <td className="py-2.5 px-3">Carpet Area</td>
                    <td className="py-2.5 px-3">538.20 sqft</td>
                    <td className="py-2.5 px-3 text-blue-600 font-bold">784.00 sqft</td>
                    <td className="py-2.5 px-3 text-red-500 font-bold">+245.80 sqft (+45.6%)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3">Use Category</td>
                    <td className="py-2.5 px-3">Residential</td>
                    <td className="py-2.5 px-3 text-blue-600">Residential</td>
                    <td className="py-2.5 px-3 text-green-600">Matched</td>
                  </tr>
                  <tr className="bg-amber-50/20">
                    <td className="py-2.5 px-3">GIS Verification</td>
                    <td className="py-2.5 px-3">No coordinates</td>
                    <td className="py-2.5 px-3 text-[#3b82f6]">19.2144, 72.9864</td>
                    <td className="py-2.5 px-3 text-green-600 font-bold">GIS Coordinates Added</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Image and Map Comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-3 flex flex-col justify-between">
              <span className="font-extrabold text-[#1e2b58] uppercase text-[10px] tracking-wide block border-b pb-1 mb-2">Facade Photo Preview</span>
              <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=400&auto=format&fit=crop" className="w-full h-32 object-cover rounded-lg border shadow-2xs" alt="Property Facade" />
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-3 flex flex-col justify-between">
              <span className="font-extrabold text-[#1e2b58] uppercase text-[10px] tracking-wide block border-b pb-1 mb-2">GIS Location Plot</span>
              <div className="w-full h-32 rounded-lg bg-blue-50 border border-blue-100 flex flex-col items-center justify-center text-center gap-1.5 p-3">
                <MapPin className="text-[#3b82f6] animate-bounce" size={24} />
                <div>
                  <div className="font-bold text-gray-700">Kopri Division Plot #55</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">Matched with Satellite Overlay boundary lines</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Decision & Observations */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs flex flex-col justify-between gap-4">
          <div className="space-y-4">
            <h3 className="font-extrabold text-[#8a6d1c] text-[12px] uppercase border-b pb-1.5">Observations & Audit Notes</h3>
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-gray-600">Enter Discrepancy details / Audit remarks</label>
              <textarea 
                className="border border-gray-300 rounded p-2 text-[11px] font-semibold text-gray-700 outline-none focus:border-amber-500 w-full h-36 resize-none" 
                placeholder="Examples: 'Carpet area increased by 45.6% due to terrace enclosure verification.' or 'Returned: photos are unclear, re-upload facade photo.'"
                value={observations}
                onChange={e => setObservations(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <button 
              onClick={() => handleAuditAction('return')}
              disabled={status !== 'Pending'}
              className={`w-full py-2.5 rounded-lg font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 border cursor-pointer transition ${
                status === 'Pending' 
                  ? 'border-red-300 bg-red-50 text-red-700 hover:bg-red-100' 
                  : 'bg-gray-150 border-gray-200 text-gray-450 cursor-not-allowed'
              }`}
            >
              <RefreshCw size={13} />
              Return for Correction
            </button>
            
            <button 
              onClick={() => handleAuditAction('approve')}
              disabled={status !== 'Pending'}
              className={`w-full py-2.5 rounded-lg font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition shadow-xs ${
                status === 'Pending' 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-gray-150 text-gray-450 cursor-not-allowed'
              }`}
            >
              <CheckCircle size={13} />
              QC Approve & Forward
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


// ==========================================
// 3. FINAL APPROVER WORKSPACE COMPONENT
// ==========================================
export function FinalActionView() {
  const [status, setStatus] = useState<'Pending' | 'Approved' | 'Rejected' | 'NoticeGenerated' | 'RecordLocked'>('Pending');
  const [approverRemarks, setApproverRemarks] = useState('');

  const handleFinalAction = (actionType: 'approve' | 'reject' | 'notice' | 'lock') => {
    if (actionType === 'approve') {
      setStatus('Approved');
      toast.success("Property Assessment and Tax Demand Approved!");
    } else if (actionType === 'reject') {
      setStatus('Rejected');
      toast.error("Assessment proposal Rejected!");
    } else if (actionType === 'notice') {
      setStatus('NoticeGenerated');
      toast.success("Section 129 Revised Notice generated successfully!");
    } else if (actionType === 'lock') {
      setStatus('RecordLocked');
      toast.success("Municipal Ledger Lock Applied!", {
        description: "Official Gazette Sync complete. Record locked.",
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50/50 p-5 font-sans text-gray-800 animate-fadeIn overflow-y-auto no-scrollbar">
      <Toaster position="top-right" richColors />
      {/* Title Header */}
      <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-3">
        <div>
          <h2 className="text-lg font-black text-[#006a4e] uppercase tracking-wider flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-green-600 rounded-full" />
            Final Approver Decision Board
          </h2>
          <p className="text-[10px] text-gray-500 mt-0.5">Officially accept field data, sign-off assessed tax demands, issue notices, and lock municipal registers.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-extrabold uppercase text-gray-400">Lock Status:</span>
          <span className={`text-[9px] font-black px-2 py-0.5 rounded border uppercase ${
            status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
            status === 'Approved' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
            status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' : 
            status === 'NoticeGenerated' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 
            'bg-green-50 text-green-700 border-green-200'
          }`}>
            {status === 'NoticeGenerated' ? 'Notice Sent' : status === 'RecordLocked' ? 'Locked' : status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch flex-1 min-h-0 text-[11px]">
        {/* Left 2 Columns: Audit Records & Tax Demand Overview */}
        <div className="lg:col-span-2 space-y-4">
          {/* Audit trail summary */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs space-y-3">
            <h3 className="font-extrabold text-[#006a4e] text-[12px] uppercase border-b pb-1.5">Review Field Survey & QC Auditor Notes</h3>
            <div className="space-y-3.5">
              <div className="flex items-start gap-3">
                <span className="text-[9px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded font-black uppercase shrink-0 mt-0.5">Surveyor</span>
                <div>
                  <div className="font-bold text-gray-700">Ravi Kumar (Field ID: SV-992)</div>
                  <p className="text-gray-500 font-medium leading-normal mt-0.5">Physical property audit complete. Enclosure of terrace and ground floor garage measured. Pinned coordinates and uploaded facade snaps.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-[9px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded font-black uppercase shrink-0 mt-0.5">QC Auditor</span>
                <div>
                  <div className="font-bold text-gray-700">Prakash Deshmukh (Auditor ID: QC-201)</div>
                  <p className="text-gray-500 font-medium leading-normal mt-0.5">Verified coordinates. GIS conflict resolved. Carpet area modification (+245.80 sqft) is validated. Forwarded for final sign-off.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tax demand breakdown */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
            <h3 className="font-extrabold text-[#006a4e] text-[12px] uppercase border-b pb-1.5 mb-3">Proposed Tax Demand Calculations</h3>
            <div className="grid grid-cols-3 gap-3 p-3 bg-gray-50 rounded-lg border mb-3">
              <div>
                <span className="text-gray-400 font-bold text-[9px] uppercase tracking-wide">Prior Tax Obligation</span>
                <div className="text-gray-600 font-black text-sm mt-0.5">₹10,811 / yr</div>
              </div>
              <div>
                <span className="text-blue-500 font-bold text-[9px] uppercase tracking-wide">Proposed Tax Demand</span>
                <div className="text-blue-700 font-black text-sm mt-0.5">₹15,604 / yr</div>
              </div>
              <div>
                <span className="text-red-500 font-bold text-[9px] uppercase tracking-wide">Annual Net Variance</span>
                <div className="text-red-600 font-black text-sm mt-0.5">+₹4,793 / yr (+44%)</div>
              </div>
            </div>
            <p className="text-gray-400 text-[10px]">Calculated based on Municipal Act rules applying Rateable Value Mode on revised carpet area (784.00 sqft).</p>
          </div>
        </div>

        {/* Right 1 Column: Action decisions */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs flex flex-col justify-between gap-4">
          <div className="space-y-4">
            <h3 className="font-extrabold text-[#006a4e] text-[12px] uppercase border-b pb-1.5">Executive Sign-off & Remarks</h3>
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-gray-600">Enter Sign-off remarks</label>
              <textarea 
                className="border border-gray-300 rounded p-2 text-[11px] font-semibold text-gray-700 outline-none focus:border-green-500 w-full h-32 resize-none" 
                placeholder="Examples: 'Ledger verified and approved. Sync with municipal records.' or 'Rejected: Re-verify GIS boundary overlapping claims.'"
                value={approverRemarks}
                onChange={e => setApproverRemarks(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => handleFinalAction('reject')}
                disabled={status !== 'Pending'}
                className={`py-2 rounded-lg font-bold uppercase border cursor-pointer text-center text-[10px] transition ${
                  status === 'Pending' 
                    ? 'border-red-300 bg-red-50 text-red-700 hover:bg-red-100' 
                    : 'bg-gray-150 border-gray-250 text-gray-400 cursor-not-allowed'
                }`}
              >
                Reject Case
              </button>
              <button 
                onClick={() => handleFinalAction('approve')}
                disabled={status !== 'Pending'}
                className={`py-2 rounded-lg font-bold uppercase cursor-pointer text-center text-[10px] transition shadow-2xs ${
                  status === 'Pending' 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-150 text-gray-450 cursor-not-allowed'
                }`}
              >
                Approve Demand
              </button>
            </div>

            <button 
              onClick={() => handleFinalAction('notice')}
              disabled={status !== 'Approved'}
              className={`w-full py-2.5 rounded-lg font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 border cursor-pointer text-[10.5px] transition ${
                status === 'Approved' 
                  ? 'border-indigo-300 bg-indigo-50 text-indigo-700 hover:bg-indigo-100' 
                  : 'bg-gray-150 border-gray-250 text-gray-400 cursor-not-allowed'
              }`}
            >
              <FileText size={13} />
              Generate Section 129 Notice
            </button>

            <button 
              onClick={() => handleFinalAction('lock')}
              disabled={status !== 'NoticeGenerated'}
              className={`w-full py-2.5 rounded-lg font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer text-[10.5px] transition shadow-xs ${
                status === 'NoticeGenerated' 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-gray-150 text-gray-450 cursor-not-allowed'
              }`}
            >
              <Lock size={13} />
              Lock Record & Sync
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
