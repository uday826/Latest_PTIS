import React from 'react';
import { ShieldCheck, FileText, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

const mockKycDocs = [
  { id: 'sale-deed', name: 'Official Sale Deed Document.pdf', size: '2.4 MB', date: '12-Jan-2024', status: 'Verified' },
  { id: 'possession-cert', name: 'Possession Certificate.pdf', size: '1.1 MB', date: '15-Jan-2024', status: 'Verified' },
  { id: 'aadhaar-doc', name: 'Aadhaar Card Copy.pdf', size: '450 KB', date: '20-Feb-2024', status: 'Verified' },
  { id: 'tax-receipt', name: 'Previous Tax Payment Receipt.pdf', size: '890 KB', date: '01-Apr-2024', status: 'Pending Review' }
];

const mockKycLogs = [
  { id: 1, date: '20-Feb-2024 14:32', user: 'System Auto-Verify', action: 'Aadhaar Verification', status: 'Success (OTP matched)' },
  { id: 2, date: '20-Feb-2024 14:35', user: 'Officer Rajesh Kumar', action: 'Manual PAN Card Match', status: 'Verified (matched with NSDL)' },
  { id: 3, date: '01-Apr-2024 10:15', user: 'Officer Sneha Patil', action: 'Sale Deed Review', status: 'Verified (signature matched)' },
  { id: 4, date: '01-Apr-2024 10:18', user: 'Officer Sneha Patil', action: 'Tax Receipt Review', status: 'Pending clarification' }
];

export default function KycDetailsTab() {
  return (
    <div className="flex flex-col gap-3 font-sans text-gray-800 animate-fadeIn">
      {/* Top Banner and Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Verification Summary */}
        <div className="bg-[#eff6ff]/35 border border-[#002fbe]/15 rounded-xl p-3 flex flex-col justify-between shadow-xs">
          <div>
            <div className="text-[10px] text-[#002fbe] uppercase tracking-wider font-extrabold flex items-center gap-1.5 mb-2">
              <ShieldCheck size={13} />
              <span>Owner KYC Credentials</span>
            </div>
            <div className="space-y-1.5 text-[11px] leading-tight font-medium text-gray-650">
              <div className="flex justify-between border-b border-gray-100/50 pb-1">
                <span>Aadhaar Number</span>
                <span className="font-extrabold text-[#002fbe]">XXXX-XXXX-8902</span>
              </div>
              <div className="flex justify-between border-b border-gray-100/50 pb-1">
                <span>PAN Number</span>
                <span className="font-extrabold text-[#002fbe]">XXXXX6789A</span>
              </div>
              <div className="flex justify-between border-b border-gray-100/50 pb-1">
                <span>Validation Type</span>
                <span className="font-extrabold text-[#002fbe]">Aadhaar OTP + Manual PAN</span>
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[9px] text-gray-400 font-bold uppercase">KYC Status</span>
            <span className="bg-green-50 text-green-700 border border-green-200 text-[8.5px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Verified
            </span>
          </div>
        </div>

        {/* Co-Owner Credentials */}
        <div className="bg-white border border-gray-200 rounded-xl p-3 flex flex-col justify-between shadow-xs">
          <div>
            <div className="text-[10px] text-[#002fbe] uppercase tracking-wider font-extrabold flex items-center gap-1.5 mb-2">
              <ShieldCheck size={13} className="text-gray-400" />
              <span>Co-Owner KYC Credentials</span>
            </div>
            <div className="space-y-1.5 text-[11px] leading-tight font-medium text-gray-650">
              <div className="flex justify-between border-b border-gray-100/50 pb-1">
                <span>Name</span>
                <span className="font-extrabold text-[#002fbe] uppercase">REKHA BUILDERS</span>
              </div>
              <div className="flex justify-between border-b border-gray-100/50 pb-1">
                <span>Aadhaar Number</span>
                <span className="font-extrabold text-[#002fbe]">XXXX-XXXX-1234</span>
              </div>
              <div className="flex justify-between border-b border-gray-100/50 pb-1">
                <span>PAN Number</span>
                <span className="font-extrabold text-[#002fbe]">XXXXX4321B</span>
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[9px] text-gray-400 font-bold uppercase">KYC Status</span>
            <span className="bg-green-50 text-green-700 border border-green-200 text-[8.5px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Verified
            </span>
          </div>
        </div>

        {/* Contact Links */}
        <div className="bg-white border border-gray-200 rounded-xl p-3 flex flex-col justify-between shadow-xs">
          <div>
            <div className="text-[10px] text-[#002fbe] uppercase tracking-wider font-extrabold flex items-center gap-1.5 mb-2">
              <CheckCircle2 size={13} className="text-green-600" />
              <span>Verification Summary</span>
            </div>
            <div className="space-y-1.5 text-[11px] leading-tight font-medium text-gray-650">
              <div className="flex justify-between border-b border-gray-100/50 pb-1">
                <span>Mobile Linked</span>
                <span className="text-green-600 font-extrabold">Yes (Aadhaar Verified)</span>
              </div>
              <div className="flex justify-between border-b border-gray-100/50 pb-1">
                <span>Email Linked</span>
                <span className="text-green-600 font-extrabold">Yes (OTP Verified)</span>
              </div>
              <div className="flex justify-between border-b border-gray-100/50 pb-1">
                <span>Verified Date</span>
                <span className="font-extrabold text-[#002fbe]">20-Feb-2024</span>
              </div>
            </div>
          </div>
          <button className="mt-3 w-full py-1 text-center bg-[#edf2ff] hover:bg-[#dbeafe] border border-blue-200 text-[#002fbe] text-[8.5px] font-black rounded-lg transition cursor-pointer" type="button">
            Re-Trigger Verification Flow
          </button>
        </div>
      </div>

      {/* Grid of Documents and Audit Logs */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mt-1 items-stretch">
        {/* Uploaded Documents List */}
        <div className="md:col-span-3 bg-white border border-gray-200 rounded-xl p-3 flex flex-col shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 pb-1.5 mb-2.5">
            <span className="font-extrabold text-[#002fbe] text-[10px] uppercase tracking-wider flex items-center gap-1">
              <FileText size={12} />
              <span>KYC Supporting Documents</span>
            </span>
            <span className="text-gray-400 text-[8.5px] font-bold">({mockKycDocs.length} Uploads)</span>
          </div>

          <div className="divide-y divide-gray-100 text-[10px] font-medium">
            {mockKycDocs.map((doc) => (
              <div key={doc.id} className="py-2 flex items-center justify-between gap-3 hover:bg-slate-50/50 px-1 rounded transition">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="p-1.5 bg-blue-50 text-[#002fbe] rounded shrink-0">
                    <FileText size={14} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-black text-[#1e2b58] truncate">{doc.name}</div>
                    <div className="text-gray-400 text-[8.5px] font-bold mt-0.5">{doc.size} | Uploaded: {doc.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full border leading-none ${
                    doc.status === 'Verified' 
                      ? 'bg-green-50 text-green-700 border-green-250' 
                      : 'bg-orange-50 text-orange-600 border-orange-200'
                  }`}>
                    {doc.status}
                  </span>
                  <button className="text-[#002fbe] hover:underline text-[9px] font-extrabold cursor-pointer" type="button">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verification Logs */}
        <div className="md:col-span-2 bg-white border border-gray-200 rounded-xl p-3 flex flex-col shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 pb-1.5 mb-2.5">
            <span className="font-extrabold text-[#002fbe] text-[10px] uppercase tracking-wider flex items-center gap-1">
              <Clock size={12} />
              <span>KYC Verification Audit Trail</span>
            </span>
          </div>

          <div className="space-y-2 max-h-[175px] overflow-y-auto pr-0.5 scrollbar-thin font-bold text-[8.5px]">
            {mockKycLogs.map((log) => (
              <div key={log.id} className="border-l-2 border-[#002fbe]/30 pl-2.5 py-0.5 relative">
                <div className="absolute w-1.5 h-1.5 rounded-full bg-[#002fbe] -left-[4px] top-1.5" />
                <div className="text-gray-400 text-[7.5px] font-bold">{log.date} | {log.user}</div>
                <div className="text-[#1e2b58] font-black mt-0.5">{log.action}</div>
                <div className="text-gray-500 font-semibold mt-0.25 leading-tight">{log.status}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
