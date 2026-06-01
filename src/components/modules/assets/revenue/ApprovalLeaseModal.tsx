'use client';

import React from 'react';
import { X, FileText, Users, Image as ImageIcon, MapPin, Grid, ShieldAlert, CheckCircle2, ShieldX } from 'lucide-react';
import { Drawer } from '@/components/common';

interface ModalProps {
  record: any;
  onClose: () => void;
}

export function ApprovalLeaseModal({ record, onClose }: ModalProps) {
  const drawerTitle = (
    <div className="flex items-center gap-2">
      <FileText className="w-5 h-5 text-blue-600" />
      <h2 className="font-bold text-sm tracking-wide text-slate-800">Approval - New Registration</h2>
    </div>
  );

  const drawerFooter = (
    <>
      <button onClick={onClose} className="px-5 py-2 text-xs font-bold text-slate-600 border border-slate-200 rounded hover:bg-slate-50 transition-colors shadow-sm cursor-pointer flex items-center gap-1.5">
        <X className="w-3.5 h-3.5" /> Cancel
      </button>
      <button className="px-5 py-2 text-xs font-bold text-white bg-[#e65c00] rounded hover:bg-orange-700 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer">
        <ShieldX className="w-3.5 h-3.5" /> Revert To Verify
      </button>
      <button className="px-5 py-2 text-xs font-bold text-white bg-green-600 rounded hover:bg-green-700 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer">
        <CheckCircle2 className="w-3.5 h-3.5" /> Approve
      </button>
    </>
  );

  const docs = [
    { title: 'Complex Photo', src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=150&auto=format&fit=crop', uploaded: true },
    { title: 'Asset Image', icon: ImageIcon, uploaded: false },
    { title: 'Aadhaar/PAN', icon: FileText, uploaded: false },
    { title: 'Agreement', icon: FileText, uploaded: false },
    { title: 'Other Document', icon: FileText, uploaded: false },
  ];

  return (
    <Drawer open={true} onClose={onClose} title={drawerTitle} width="xl" footer={drawerFooter}>
      <div className="p-5 bg-slate-50 min-h-full">
        {/* Top Asset Information */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_200px_200px] gap-4 mb-4">
          <div className="bg-white border border-slate-200 rounded-lg p-3 relative mt-3 shadow-sm">
            <span className="absolute -top-3 left-4 bg-[#0a869e] text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm">ASSET INFORMATION</span>
            <div className="grid grid-cols-[120px_1fr] gap-x-2 gap-y-2 mt-1">
              <span className="text-[10px] text-slate-500 font-bold">Complex Name</span>
              <span className="text-xs font-bold text-red-600">N/A</span>
              <span className="text-[10px] text-slate-500 font-bold border-t border-slate-100 pt-2">Address</span>
              <span className="text-xs font-bold text-slate-400 border-t border-slate-100 pt-2">N/A</span>
            </div>
          </div>
          
          {[{ label: 'ASSET ID', value: record.assetId || 'MPMS-AS-142' }, { label: 'APPLICATION ID', value: record.grievanceNo || '1767421651018' }].map((item, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-lg p-3 relative mt-3 shadow-sm flex flex-col items-center justify-center">
              <span className="absolute -top-3 bg-[#0a869e] text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm">{item.label}</span>
              <span className="text-sm font-black text-slate-800 mt-2">{item.value}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4 mb-6">
          <div className="overflow-x-auto bg-white border border-slate-200 rounded-lg shadow-sm">
            <table className="w-full text-left text-[10px] h-full">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 divide-x divide-slate-200">
                  {['Zone - Ward No', 'Property No', 'Partition No', 'Shop Number', 'Shop Establishment Date', 'Survey Number', 'Gat Number', 'Shop Act Registration Date', 'Shop Act Number'].map((h, i) => (
                    <th key={i} className="px-2 py-2 text-center whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-x divide-slate-200 text-center font-medium h-full">
                <tr className="text-slate-500">
                  {Array(9).fill('-').map((v, i) => <td key={i} className="px-2 py-3">{v}</td>)}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-col justify-center">
             <span className="text-[10px] text-slate-500 font-bold">Asset Category</span>
             <span className="text-sm font-bold text-red-600 mb-3">{record.assetCategory || 'Shopping Complex'}</span>
             <span className="text-[10px] text-slate-500 font-bold">Shop Name</span>
             <span className="text-sm font-bold text-red-600">N/A</span>
          </div>
        </div>

        {/* Middle Tenant Information */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm relative pt-4 mb-6 mt-4">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0a869e] text-white text-[9px] font-bold px-4 py-0.5 rounded shadow-sm">All Tenant Information</span>
          <div className="flex divide-x divide-slate-200 min-h-[120px]">
            <div className="flex-1 flex flex-col">
              <div className="bg-slate-50 border-b border-slate-200 text-[#e65c00] text-[10px] font-bold py-1.5 flex items-center justify-center gap-1">
                <Users className="w-3.5 h-3.5" /> Previous Tenants (0)
              </div>
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-2 p-6">
                <Users className="w-10 h-10 opacity-30" />
                <span className="text-xs font-semibold">No previous tenants</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Grid: Images, Plans, Summary Table */}
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr_250px] gap-4 mb-4">
          <div className="space-y-3">
            {[
              { label: 'Building Image', src: 'https://images.unsplash.com/photo-1541885074701-fe118a1a384a?q=80&w=300&auto=format&fit=crop', icon: ImageIcon },
              { label: 'Live GIS Location', src: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=300&auto=format&fit=crop', icon: MapPin },
              { label: 'DP Plan', src: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=300&auto=format&fit=crop', icon: Grid }
            ].map((img, i) => (
              <div key={i} className="relative h-28 rounded border border-slate-200 overflow-hidden bg-slate-100 shadow-sm">
                <span className="absolute top-1 left-1/2 -translate-x-1/2 bg-[#0a869e]/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                  <img.icon className="w-3 h-3" /> {img.label}
                </span>
                <img src={img.src} alt={img.label} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-[#0a869e] rounded-lg shadow-sm relative flex items-center justify-center p-2 min-h-[220px]">
               <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0a869e] text-white text-[10px] font-bold px-4 py-1 rounded shadow-sm flex items-center gap-1 z-10">
                 <Grid className="w-3.5 h-3.5" /> Property Floor Plan
               </span>
               <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=400&auto=format&fit=crop" alt="Floor Plan" className="w-full max-h-52 object-contain filter contrast-125 opacity-70" />
            </div>
            
            <div className="border border-slate-200 rounded-lg relative p-4 bg-white shadow-sm overflow-x-auto">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0a869e] text-white text-[9px] font-bold px-3 py-0.5 rounded shadow-sm flex items-center gap-1 whitespace-nowrap">
                <FileText className="w-3 h-3" /> Uploaded Documents
              </span>
              <div className="flex justify-center gap-4 min-w-max">
                {docs.map((doc, idx) => {
                  const DocIcon = doc.icon || FileText;
                  return (
                    <div key={idx} className="w-[100px] h-[100px] border border-slate-200 rounded bg-slate-50 flex flex-col items-center justify-center gap-1 p-1">
                      <div className="w-full h-[60px] bg-white border border-slate-100 rounded overflow-hidden flex items-center justify-center text-slate-300">
                        {doc.src ? <img src={doc.src} className="w-full h-full object-cover" alt={doc.title} /> : <DocIcon className="w-6 h-6" />}
                      </div>
                      <span className="text-[8px] font-bold text-slate-800">{doc.title}</span>
                      <span className={`text-[7px] font-bold ${doc.uploaded ? 'text-blue-600 hover:underline cursor-pointer' : 'text-slate-400'}`}>
                        {doc.uploaded ? 'View Document' : 'Not uploaded'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white border border-[#0a869e] rounded-lg shadow-sm overflow-hidden">
              <div className="bg-[#0a869e] text-white text-[10px] font-bold py-1.5 text-center">मागे उत्पन्न सारा概 तक्ता</div>
              <table className="w-full text-[9px] font-semibold text-slate-700">
                <thead>
                  <tr className="border-b border-slate-200 text-center bg-slate-50/50">
                    <th className="px-2 py-2 border-r border-slate-200">तपशील</th>
                    <th className="px-2 py-2">रक्कम (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-center">
                  {[
                    { label: 'सद्यस्थितीत मासिक भाडे उत्पन्न', val: '₹ 6,437', bold: true },
                    { label: 'मुदत संपल्यानंतरही वाढीव भाडे', val: '₹ 0' },
                    { label: 'एकूण मासिक भाडे उत्पन्न', val: '₹ 6,437', bold: true, bg: 'bg-slate-50/50' },
                    { label: 'वार्षिक भाडे उत्पन्न (अपेक्षित)', val: '₹ 77,244', bold: true }
                  ].map((row, i) => (
                    <tr key={i} className={row.bg || ''}>
                      <td className="px-2 py-2.5 border-r border-slate-200 text-left">{row.label}</td>
                      <td className={`px-2 py-2.5 ${row.bold ? 'font-bold' : ''}`}>{row.val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer">
              <ShieldAlert className="w-4 h-4" /> View Workflow
            </button>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
