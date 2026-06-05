'use client';

import { useState } from 'react';
import { Info, UploadCloud, FileText, User, Calendar, IndianRupee, Building2, Grid } from 'lucide-react';
import { Drawer } from '@/components/common';

interface ModalProps {
  record: any;
  onClose: () => void;
}

export function NewLeaseRegistrationModal({ record, onClose }: ModalProps) {
  const [activeTab, setActiveTab] = useState<'new' | 'previous'>('new');

  const drawerTitle = (
    <div className="flex items-center gap-2">
      <FileText className="w-5 h-5 text-blue-600" />
      <h2 className="font-bold text-sm tracking-wide text-slate-800">New Lease / Rent Registration</h2>
    </div>
  );

  const drawerFooter = (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
        <Info className="w-4 h-4" />
        <span className="text-xs font-semibold">Complete all required fields</span>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={onClose} className="px-6 py-2 text-xs font-bold text-slate-600 border border-[#e2e8f0] rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
          Cancel
        </button>
        <button className="px-6 py-2 text-xs font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 cursor-pointer">
          <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin hidden" /> Send to Verification
        </button>
      </div>
    </div>
  );

  const formFields = [
    { label: 'Application Type', type: 'select', icon: FileText, options: ['Lease Renewal'], full: true },
    { label: 'Existing Tenant Name', type: 'select', icon: User, options: ['Select Tenant'] },
    { label: 'Old Lease Start', type: 'date', icon: Calendar },
    { label: 'Old Lease End', type: 'date', icon: Calendar },
    { label: 'Renewal Start', type: 'date', icon: Calendar },
    { label: 'Renewal End', type: 'date', icon: Calendar },
    { label: 'Previous Rent', type: 'text', icon: IndianRupee, placeholder: 'Amount' },
    { label: 'Revised Rent', type: 'text', icon: IndianRupee, placeholder: 'Amount' },
    { label: 'Reason for Renewal', type: 'text', icon: FileText, placeholder: 'Enter reason' },
  ];

  return (
    <Drawer open={true} onClose={onClose} title={drawerTitle} width="xl" footer={drawerFooter}>
      <div className="p-5 bg-slate-50 min-h-full">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_200px_200px] gap-4 mb-4">
          <div className="bg-white border border-slate-200 rounded-lg p-3 relative mt-3 shadow-sm">
            <span className="absolute -top-3 left-4 bg-teal-600 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm">ASSET INFORMATION</span>
            <div className="grid grid-cols-[120px_1fr] gap-x-2 gap-y-2 mt-1">
              <span className="text-[10px] text-slate-500 font-bold">Complex Name</span>
              <span className="text-xs font-bold text-red-600">कोंडवाडा मनपा व्यापारी संकुल</span>
              <span className="text-[10px] text-slate-500 font-bold border-t border-slate-100 pt-2">Address</span>
              <span className="text-xs font-bold text-slate-850 border-t border-slate-100 pt-2">N/A</span>
            </div>
          </div>
          {[{ l: 'ASSET ID', v: record.assetId || 'MPMS-AS-10' }, { l: 'GRIEVANCE ID', v: 'REG-2025-293422850' }].map((item, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-lg p-3 relative mt-3 shadow-sm flex flex-col items-center justify-center">
              <span className="absolute -top-3 bg-teal-600 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm">{item.l}</span>
              <span className="text-sm font-black text-slate-800 mt-2">{item.v}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4 mb-6">
          <div className="space-y-4">
            <div className="overflow-x-auto bg-white border border-slate-200 rounded-lg shadow-sm">
              <table className="w-full text-left text-[10px]">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 divide-x divide-slate-200">
                    {['Zone - Ward No', 'Property No', 'Partition No', 'Shop Number', 'Shop Establishment Date', 'Survey Number', 'Gat Number', 'Shop Act Registration Date', 'Shop Act Number'].map((h, i) => (
                      <th key={i} className="px-2 py-2 text-center whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-x divide-slate-200 text-center font-medium">
                  <tr className="text-slate-500">
                    {Array(9).fill('-').map((v, i) => <td key={i} className="px-2 py-3">{v}</td>)}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="overflow-x-auto bg-white border border-slate-200 rounded-lg shadow-sm relative pt-3">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-600 text-white text-[9px] font-bold px-4 py-0.5 rounded shadow-sm">Construction Details</div>
              <table className="w-full text-left text-[10px] mt-2">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-bold border-y border-slate-200 divide-x divide-slate-200">
                    {['Floor', 'Shop No.', 'Shop Area (sq.mt)', 'Renter Name', 'Uses', 'Monthly Rent (₹)', 'Per Sq.Mt. Rate', 'काम कालावधी', 'Status'].map((h, i) => (
                      <th key={i} className="px-2 py-2 text-center whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-x divide-slate-200 text-center font-medium">
                  <tr className="text-slate-700">
                    <td className="px-2 py-3">Ground Floor</td>
                    <td className="px-2 py-3">-</td>
                    <td className="px-2 py-3">-</td>
                    <td className="px-2 py-3">{record.tenantName || 'कानामा प्रिक शाही'}</td>
                    <td className="px-2 py-3">-</td>
                    <td className="px-2 py-3 text-red-500 font-bold">₹ {record.rentAmount || '7986'}</td>
                    <td className="px-2 py-3">-</td>
                    <td className="px-2 py-3">२०२३ ते २०२५</td>
                    <td className="px-2 py-3">Rent</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-col justify-center">
             <span className="text-[10px] text-slate-500 font-bold">Asset Category</span>
             <span className="text-sm font-bold text-red-600 mb-3">{record.category || 'Shopping Complex'}</span>
             <span className="text-[10px] text-slate-500 font-bold">Shop Name</span>
             <span className="text-sm font-bold text-red-600">{record.shopName || 'अक्कर बच्चूम महाजन केंद्र'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_300px] gap-4 mb-4">
          <div className="space-y-2">
            {[
              { label: 'Building Photo', src: 'https://images.unsplash.com/photo-1541885074701-fe118a1a384a?q=80&w=200&auto=format&fit=crop', icon: Building2 },
              { label: 'OP Plan', src: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=200&auto=format&fit=crop', icon: Grid },
              { label: 'DP Plan', src: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=200&auto=format&fit=crop', icon: Grid }
            ].map((img, i) => (
              <div key={i} className="relative h-24 rounded border border-slate-200 overflow-hidden bg-slate-100 flex items-center justify-center shadow-sm">
                <span className="absolute top-1 left-1/2 -translate-x-1/2 bg-teal-600/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm"><img.icon className="w-3 h-3" /> {img.label}</span>
                <img src={img.src} alt={img.label} className="w-full h-full object-cover opacity-80" />
              </div>
            ))}
          </div>

          <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden flex flex-col">
            <div className="flex bg-slate-500 text-white">
              {['new', 'previous'].map(t => (
                <button key={t} onClick={() => setActiveTab(t as any)} className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors ${activeTab === t ? 'bg-slate-600 shadow-inner' : 'hover:bg-slate-500/80 opacity-70'}`}>
                  {t === 'new' ? 'New Tenant Registration' : 'Previous Tenant Information'}
                </button>
              ))}
            </div>
            <div className="p-4 grid grid-cols-2 gap-3 flex-1 overflow-y-auto">
              {formFields.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div key={i} className={`space-y-1 ${f.full ? 'col-span-2' : ''}`}>
                    <label className="text-[10px] font-bold text-slate-600 flex items-center gap-1">
                      <Icon className="w-3 h-3 text-slate-400" /> {f.label} <span className="text-red-500">*</span>
                    </label>
                    {f.type === 'select' ? (
                      <select className="w-full h-8 px-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded outline-none focus:border-blue-500">
                        {f.options?.map((opt, oi) => <option key={oi}>{opt}</option>)}
                      </select>
                    ) : (
                      <input type={f.type} placeholder={f.placeholder} className="w-full h-8 px-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded outline-none focus:border-blue-500" />
                    )}
                  </div>
                );
              })}
              <button className="w-full py-2.5 col-span-2 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold tracking-wider rounded uppercase flex items-center justify-center gap-2 transition-colors cursor-pointer">
                <UploadCloud className="w-3.5 h-3.5" /> RENEWAL REQUEST LETTER
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-white border border-teal-600 rounded-lg shadow-sm overflow-hidden">
              <div className="bg-teal-600 text-white text-[10px] font-bold py-1.5 text-center">मागे उत्पन्न सारांश तक्ता</div>
              <table className="w-full text-[9px] font-semibold text-slate-700">
                <thead>
                  <tr className="border-b border-slate-200 text-center">
                    <th className="px-2 py-1.5 border-r border-slate-200">तपशील</th>
                    <th className="px-2 py-1.5">रक्कम (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-center">
                  {[
                    { l: 'सद्यस्थितीत भाडे उत्पन्न', v: '₹ 7,986' },
                    { l: 'मुदत संपल्यानंतरही वाढीव भाडे', v: '₹ 31,000' },
                    { l: 'एकूण मासिक भाडे उत्पन्न', v: '₹ 1,51,000' },
                    { l: 'वार्षिक भाडे उत्पन्न (अपेक्षित)', v: '₹ 15,54,000' }
                  ].map((row, i) => (
                    <tr key={i}>
                      <td className="px-2 py-1.5 border-r border-slate-200 text-left">{row.l}</td>
                      <td className="px-2 py-1.5">{row.v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-white border border-teal-600 rounded-lg shadow-sm relative h-32 flex items-center justify-center overflow-hidden p-1">
               <span className="absolute top-0 left-1/2 -translate-x-1/2 bg-teal-600 text-white text-[9px] font-bold px-4 py-0.5 rounded-b shadow-sm flex items-center gap-1 z-10"><Building2 className="w-3 h-3" /> Property Floor Plan</span>
               <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=300&auto=format&fit=crop" alt="Floor Plan" className="w-full h-full object-cover filter contrast-125 opacity-70" />
            </div>
          </div>
        </div>

        <div className="text-center relative pt-4 pb-2">
          <span className="bg-teal-600 text-white text-[10px] font-bold px-4 py-1 rounded-full shadow-sm">Uploaded Documents</span>
          <div className="absolute top-1/2 left-0 right-0 h-px bg-slate-200 -z-10"></div>
        </div>
      </div>
    </Drawer>
  );
}
