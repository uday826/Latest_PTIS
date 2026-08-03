import React from 'react';
import { Home, Users, CheckCircle, ShieldAlert, Award, FileText } from 'lucide-react';

const committeeMembers = [
  { role: 'Chairman', name: 'SHRI ARVIND G. MEHTA', contact: '+91 98200 12345', email: 'chairman.matoshree@gmail.com' },
  { role: 'Secretary', name: 'SHRI VIPUL SHAH', contact: '+91 98210 54321', email: 'secretary.matoshree@gmail.com' },
  { role: 'Treasurer', name: 'SMT. REKHA PATEL', contact: '+91 98330 98765', email: 'treasurer.matoshree@gmail.com' }
];

const societyCompliances = [
  { title: 'Conveyance Deed Completed', status: 'Compliant', date: '12-May-2022', color: 'bg-green-50 text-green-700 border-green-200' },
  { title: 'Rainwater Harvesting Implemented', status: 'Verified Compliant', date: '09-Jul-2023', color: 'bg-green-50 text-green-700 border-green-200' },
  { title: 'Elevator Safety Certificate', status: 'Expired (Renewal Pending)', date: '15-Dec-2023', color: 'bg-red-50 text-red-600 border-red-200' },
  { title: 'Solid Waste Segregation System', status: 'Compliant', date: '18-Feb-2024', color: 'bg-green-50 text-green-700 border-green-200' }
];

export default function SocietyDetailsTab() {
  return (
    <div className="flex flex-col gap-3 font-sans text-gray-800 animate-fadeIn">
      {/* Registration Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Registration Card */}
        <div className="bg-[#eff6ff]/35 border border-[#002fbe]/15 rounded-xl p-3 flex flex-col justify-between shadow-xs">
          <div>
            <div className="text-[10px] text-[#002fbe] uppercase tracking-wider font-extrabold flex items-center gap-1.5 mb-2">
              <Home size={13} />
              <span>Society Registry</span>
            </div>
            <div className="space-y-1.5 text-[11px] leading-tight font-medium text-gray-655">
              <div className="flex justify-between border-b border-gray-100/50 pb-1">
                <span>Registered Name</span>
                <span className="font-extrabold text-[#002fbe] uppercase text-right max-w-[150px] truncate">Matoshree CHS Ltd</span>
              </div>
              <div className="flex justify-between border-b border-gray-100/50 pb-1">
                <span>Reg. Certificate No</span>
                <span className="font-extrabold text-[#002fbe]">TMC/REG/45920-2021</span>
              </div>
              <div className="flex justify-between border-b border-gray-100/50 pb-1">
                <span>Total Units</span>
                <span className="font-extrabold text-[#002fbe]">102 Apartments</span>
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[9px] text-gray-400 font-bold uppercase">Registration Status</span>
            <span className="bg-green-50 text-green-700 border border-green-200 text-[8.5px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Active
            </span>
          </div>
        </div>

        {/* General Overview */}
        <div className="bg-white border border-gray-200 rounded-xl p-3 flex flex-col justify-between shadow-xs">
          <div>
            <div className="text-[10px] text-[#002fbe] uppercase tracking-wider font-extrabold flex items-center gap-1.5 mb-2">
              <Award size={13} className="text-gray-400" />
              <span>Property Affiliation</span>
            </div>
            <div className="space-y-1.5 text-[11px] leading-tight font-medium text-gray-655">
              <div className="flex justify-between border-b border-gray-100/50 pb-1">
                <span>Ward Number</span>
                <span className="font-extrabold text-[#002fbe]">Ward No. 12 (Kopri)</span>
              </div>
              <div className="flex justify-between border-b border-gray-100/50 pb-1">
                <span>Built-Up Area Total</span>
                <span className="font-extrabold text-[#002fbe]">1,45,690 sq ft</span>
              </div>
              <div className="flex justify-between border-b border-gray-100/50 pb-1">
                <span>Completion Certificate</span>
                <span className="text-green-600 font-extrabold">Issued (2022)</span>
              </div>
            </div>
          </div>
          <button className="mt-3 w-full py-1 text-center bg-white hover:bg-gray-50 border border-gray-255 text-gray-600 text-[8.5px] font-black rounded-lg transition cursor-pointer" type="button">
            View Certificate of Incorporation
          </button>
        </div>

        {/* Financial Overview */}
        <div className="bg-white border border-gray-200 rounded-xl p-3 flex flex-col justify-between shadow-xs">
          <div>
            <div className="text-[10px] text-[#002fbe] uppercase tracking-wider font-extrabold flex items-center gap-1.5 mb-2">
              <FileText size={13} className="text-green-600" />
              <span>Tax Collection Status</span>
            </div>
            <div className="space-y-1.5 text-[11px] leading-tight font-medium text-gray-655">
              <div className="flex justify-between border-b border-gray-100/50 pb-1">
                <span>Total Tax Assessed</span>
                <span className="font-extrabold text-[#002fbe]">₹2,10,039 / Yr</span>
              </div>
              <div className="flex justify-between border-b border-gray-100/50 pb-1">
                <span>Total Paid (Current)</span>
                <span className="text-green-600 font-extrabold">₹1,85,456 (88.3%)</span>
              </div>
              <div className="flex justify-between border-b border-gray-100/50 pb-1">
                <span>Outstanding Dues</span>
                <span className="text-red-500 font-extrabold">₹24,583 (11.7%)</span>
              </div>
            </div>
          </div>
          <button className="mt-3 w-full py-1 text-center bg-[#edf2ff] hover:bg-[#dbeafe] border border-blue-200 text-[#002fbe] text-[8.5px] font-black rounded-lg transition cursor-pointer" type="button">
            View Consolidated Ledger
          </button>
        </div>
      </div>

      {/* Grid: Executive Members & Compliance Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mt-1 items-stretch">
        {/* Executive Committee Card */}
        <div className="md:col-span-2 bg-white border border-gray-200 rounded-xl p-3 flex flex-col shadow-sm">
          <div className="flex items-center gap-1.5 border-b border-gray-100 pb-1.5 mb-2.5">
            <Users size={13} className="text-[#002fbe]" />
            <span className="font-extrabold text-[#002fbe] text-[10px] uppercase tracking-wider">Executive Committee</span>
          </div>

          <div className="space-y-2.5">
            {committeeMembers.map((member) => (
              <div key={member.role} className="flex flex-col gap-0.5 border-b border-gray-100/40 pb-2 last:border-0 last:pb-0">
                <div className="flex justify-between items-center text-[9px] font-extrabold">
                  <span className="text-gray-400 uppercase tracking-wider">{member.role}</span>
                  <span className="text-[#002fbe] uppercase">{member.name}</span>
                </div>
                <div className="flex justify-between text-[8px] font-bold text-gray-500 mt-0.5">
                  <span>{member.contact}</span>
                  <span>{member.email}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance Checklist */}
        <div className="md:col-span-3 bg-white border border-gray-200 rounded-xl p-3 flex flex-col shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 pb-1.5 mb-2.5">
            <span className="font-extrabold text-[#002fbe] text-[10px] uppercase tracking-wider flex items-center gap-1">
              <CheckCircle size={12} className="text-green-600" />
              <span>Society Compliance Checklist</span>
            </span>
          </div>

          <div className="space-y-2 text-[9px] font-medium text-gray-700">
            {societyCompliances.map((comp, idx) => (
              <div key={idx} className="flex items-center justify-between border border-gray-100/50 hover:bg-slate-50/50 p-1.5 rounded-lg transition">
                <div className="flex flex-col gap-0.5">
                  <div className="font-black text-[#1e2b58]">{comp.title}</div>
                  <div className="text-gray-400 text-[8px] font-bold mt-0.5">Audit verified: {comp.date}</div>
                </div>
                <span className={`text-[7.5px] border font-black px-1.5 py-0.5 rounded-full leading-none shrink-0 ${comp.color}`}>
                  {comp.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
