import React, { useState } from 'react';
import { FileText, X, AlertTriangle, Printer, Download, CheckCircle2 } from 'lucide-react';

export default function GenerateNoticeView({ onClose }: { onClose: () => void }) {
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
            <div className="w-9 h-9 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-500 mx-auto"><AlertTriangle size={18} /></div>
            <h3 className="font-extrabold text-[#1e2b58] text-[10.5px] uppercase tracking-wider">Confirm Notice Generation</h3>
            <p className="text-gray-455 font-bold text-[8.5px] leading-relaxed">Are you sure you want to generate this official Notice? This will file a record in the database.</p>
            <div className="flex gap-2 text-[8.5px] font-extrabold mt-1">
              <button onClick={() => setConfirmOpen(false)} className="flex-1 py-1.5 border border-gray-200 hover:bg-gray-50 text-gray-605 bg-white rounded cursor-pointer transition-colors shadow-2xs">Cancel</button>
              <button onClick={handleFinalConfirm} className="flex-1 py-1.5 bg-[#ef4444] hover:bg-[#dc2626] text-white border border-red-600 rounded cursor-pointer transition-colors shadow-xs">Generate Notice</button>
            </div>
          </div>
        </>
      )}

      <div className="flex items-center justify-between border-b border-gray-100 pb-2 shrink-0 select-none">
        <div className="flex items-center gap-1.5">
          <div className="bg-red-50 text-red-655 p-1.5 rounded-lg border border-red-100"><FileText size={14} /></div>
          <div>
            <h2 className="font-extrabold text-[#1e2b58] text-[11px] uppercase tracking-wider leading-none">Generate Compliance Notice</h2>
            <span className="text-slate-600 text-[8.5px] font-extrabold mt-1 block leading-none">Property ID: 1290082181</span>
          </div>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-655 font-extrabold hover:bg-gray-100 w-5 h-5 rounded-full flex items-center justify-center cursor-pointer transition-all"><X size={12} /></button>
      </div>

      <div className="flex-grow flex-1 min-h-0 overflow-hidden flex gap-4">
        <div className="w-[200px] shrink-0 overflow-y-auto pr-1.5 flex flex-col gap-3 text-[10px] font-black text-slate-800 uppercase tracking-wider select-none no-scrollbar">
          <div className="flex flex-col gap-1">
            <label className="text-slate-700 font-extrabold">Notice Type</label>
            <select value={formData.noticeType} onChange={(e) => setFormData(prev => ({ ...prev, noticeType: e.target.value }))} className="p-1.5 bg-white border border-gray-300 rounded font-extrabold text-slate-900 outline-none text-[9.5px]">
              <option value="Tax Demand Notice (Form-G)">Tax Demand Notice (Form-G)</option>
              <option value="Arrears Demarcation Warning">Arrears Demarcation Warning</option>
              <option value="Mutation Registry Clearance">Mutation Registry Clearance</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-slate-700 font-extrabold">Language</label>
            <select value={formData.noticeLang} onChange={(e) => setFormData(prev => ({ ...prev, noticeLang: e.target.value }))} className="p-1.5 bg-white border border-gray-300 rounded font-extrabold text-slate-900 outline-none text-[9.5px]">
              <option value="Marathi">Marathi (मराठी)</option>
              <option value="English">English</option>
              <option value="Hindi">Hindi (हिंदी)</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-slate-700 font-extrabold">Financial Year</label>
            <input type="text" value={formData.financialYear} onChange={(e) => setFormData(prev => ({ ...prev, financialYear: e.target.value }))} className="p-1.5 bg-white border border-gray-300 rounded font-extrabold text-slate-900 outline-none text-[9.5px]" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-slate-700 font-extrabold">Due Date</label>
            <input type="text" value={formData.dueDate} onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))} className="p-1.5 bg-white border border-gray-300 rounded font-extrabold text-slate-900 outline-none text-[9.5px]" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-slate-700 font-extrabold">Demand (₹)</label>
            <input type="text" value={formData.demandAmount} onChange={(e) => setFormData(prev => ({ ...prev, demandAmount: e.target.value }))} className="p-1.5 bg-white border border-gray-300 rounded font-extrabold text-slate-900 outline-none text-[9.5px] tabular-nums" />
          </div>
        </div>

        <div className="flex-grow flex-1 border border-slate-300 rounded-xl bg-slate-200 p-4 overflow-y-auto relative shadow-inner flex justify-center no-scrollbar">
          <div className="bg-white border border-gray-300 shadow p-6 font-sans text-gray-800 flex flex-col gap-4 text-[10px] w-full max-w-[580px] min-h-[380px] select-none">
            <div className="flex justify-between items-start border-b border-gray-200 pb-2">
              <div className="font-extrabold text-[#1e2b58] uppercase text-[9px] leading-tight">NAGPUR MUNICIPAL CORPORATION<p className="text-slate-600 font-extrabold text-[7px] mt-0.5">Assessment Cell</p></div>
              <div className="text-right text-slate-800 text-[8px] leading-normal font-extrabold"><p>DATE: {formData.noticeDate}</p></div>
            </div>
            <div className="text-center font-black uppercase text-[#ef4444] text-[10.5px] py-1 bg-red-50 border border-red-200 rounded">{formData.noticeType}</div>
            <div className="space-y-2.5 font-semibold leading-relaxed text-gray-700 text-[10.5px]">
              <p>To,</p>
              <p className="font-black text-gray-800">Shri Balasaheb Thackeray</p>
              <p>Address: <span className="font-bold text-gray-800">Plot No. 129, Wing B, Flat 101, Nagpur.</span></p>
              <p className="pt-2 border-t border-gray-100">
                {formData.noticeLang === 'Marathi' ? (
                  <span>आपल्याला सूचित करण्यात येते की आपल्या मालमत्ता ID <span className="font-bold text-gray-900">1290082181</span> ची कर थकबाकी वर्ष <span className="font-bold text-gray-900">{formData.financialYear}</span> साठी एकूण <span className="font-black text-[#ef4444]">₹{formData.demandAmount}</span> आहे. कृपया सदर रक्कम दिनांक <span className="font-bold text-gray-900">{formData.dueDate}</span> च्या आत जमा करावी.</span>
                ) : (
                  <span>Property tax arrears for ID <span className="font-bold text-gray-900">1290082181</span> for FY <span className="font-bold text-gray-900">{formData.financialYear}</span> calculations evaluate to a payable demand of <span className="font-black text-[#ef4444]">₹{formData.demandAmount}</span>. Payment is due by <span className="font-bold text-gray-900">{formData.dueDate}</span>.</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-2 shrink-0 flex items-center justify-end gap-2 text-[8.5px] font-extrabold select-none">
        <button onClick={onClose} className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-slate-700 bg-white cursor-pointer shadow-xs transition-all">Cancel</button>
        <button onClick={() => alert('Printing Notice...')} className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-300 hover:border-red-500 hover:bg-red-50 text-red-600 cursor-pointer shadow-xs transition-all"><Printer size={11} /><span>Print Notice</span></button>
        <button onClick={() => alert('Downloading Notice...')} className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-300 hover:border-red-500 hover:bg-red-50 text-red-600 cursor-pointer shadow-xs transition-all"><Download size={11} /><span>Download PDF</span></button>
        <button onClick={() => setConfirmOpen(true)} className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-[#ef4444] hover:bg-[#dc2626] text-white border border-red-600 cursor-pointer shadow-sm transition-all">Generate Notice</button>
      </div>
    </div>
  );
}
