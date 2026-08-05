import React, { useState } from 'react';
import { Building2, Check, X } from 'lucide-react';

export default function ApplyOcView({ onClose }: { onClose: () => void }) {
  const [activeMode, setActiveMode] = useState<'building' | 'wing' | 'flat'>('building');
  const [submitted, setSubmitted] = useState(false);
  const [docketNum, setDocketNum] = useState('OC-TMC-2026-904');
  const [issueDate, setIssueDate] = useState('2026-08-03');
  const [selectedWing, setSelectedWing] = useState('B Wing');
  const [flatNum, setFlatNum] = useState('103');
  const [fireCompliant, setFireCompliant] = useState(true);
  const [waterAttached, setWaterAttached] = useState(true);
  const [drainageCert, setDrainageCert] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    alert(`Successfully applied Occupancy Certificate ${docketNum} for the ${activeMode === 'building' ? 'entire building' : activeMode === 'wing' ? selectedWing : selectedWing + ' Flat ' + flatNum}!`);
  };

  return (
    <div className="flex flex-col h-full gap-3 font-sans animate-fadeIn p-1 select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-[#eff6ff] text-blue-600 p-2 rounded-xl border border-blue-150 shadow-xs">
            <Building2 size={16} />
          </div>
          <div>
            <h2 className="font-extrabold text-[#1e2b58] text-xs uppercase tracking-wider leading-none">Apply Occupancy Certificate (OC)</h2>
            <span className="text-slate-600 text-[9px] font-extrabold mt-1 block leading-none">OC Audit Portal • Shivam Residency</span>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-655 font-extrabold hover:bg-gray-150 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-all active:scale-95"
        >
          <X size={14} />
        </button>
      </div>

      {/* Content Body */}
      <div className="flex-grow flex-1 min-h-[220px] overflow-y-auto no-scrollbar">
        {submitted ? (
          <div className="flex flex-col items-center justify-center py-8 max-w-lg mx-auto text-center gap-3">
            <div className="w-14 h-14 rounded-full bg-green-50 text-green-600 flex items-center justify-center border border-green-200 shadow-xs animate-scaleIn">
              <Check size={28} className="stroke-[3]" />
            </div>
            <span className="font-black text-sm text-[#006a4e] uppercase mt-2">OC Applied Successfully!</span>
            <p className="text-[10.5px] text-gray-550 font-semibold leading-relaxed max-w-md">
              Occupancy Certificate has been registered and locked under docket **{docketNum}** for {
                activeMode === 'building' ? 'the entire Shivam Residency Building' : 
                activeMode === 'wing' ? `all units in ${selectedWing}` : 
                `Unit ${flatNum} in ${selectedWing}`
              }.
            </p>
            <div className="bg-slate-50 border border-gray-200 rounded-lg p-3 w-full text-left text-[9.5px] space-y-1 mt-2">
              <div><span className="text-gray-400 font-bold">Docket Number:</span> <span className="font-black text-gray-700">{docketNum}</span></div>
              <div><span className="text-gray-400 font-bold">Issue Date:</span> <span className="font-black text-gray-700">{issueDate}</span></div>
              <div><span className="text-gray-400 font-bold">Compliance Status:</span> <span className="font-black text-green-600">VERIFIED</span></div>
            </div>
            <button 
              type="button"
              onClick={() => setSubmitted(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[10px] px-6 py-2 rounded-lg mt-4 uppercase cursor-pointer tracking-wide transition shadow-3xs"
            >
              Apply Another OC
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 text-gray-800 p-1">
            {/* Form options & parameters (7 cols) */}
            <form onSubmit={handleSubmit} className="md:col-span-7 flex flex-col gap-4">
              
              {/* Mode selection strip */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[9.5px] text-slate-505 font-extrabold uppercase tracking-wide">Select OC Target Mode</span>
                <div className="grid grid-cols-3 gap-2 bg-gray-50 p-1 rounded-xl border border-gray-200">
                  <button
                    type="button"
                    onClick={() => setActiveMode('building')}
                    className={`py-2 px-3 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                      activeMode === 'building' 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'text-gray-500 hover:bg-gray-150/70 hover:text-gray-700'
                    }`}
                  >
                    Building-wise
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveMode('wing')}
                    className={`py-2 px-3 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                      activeMode === 'wing' 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'text-gray-500 hover:bg-gray-150/70 hover:text-gray-700'
                    }`}
                  >
                    Wing-wise
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveMode('flat')}
                    className={`py-2 px-3 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                      activeMode === 'flat' 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'text-gray-500 hover:bg-gray-150/70 hover:text-gray-700'
                    }`}
                  >
                    Flat-wise
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-1">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wide">OC Docket / Cert Number *</span>
                  <input 
                    type="text" 
                    required
                    value={docketNum}
                    onChange={(e) => setDocketNum(e.target.value)}
                    className="bg-white border border-gray-250 rounded-lg px-3 py-1.5 text-[10.5px] font-bold text-gray-700 outline-none focus:border-blue-500 shadow-3xs"
                    placeholder="e.g. OC-TMC-2026-904"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wide">Date of Certificate Issuance *</span>
                  <input 
                    type="date" 
                    required
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="bg-white border border-gray-250 rounded-lg px-3 py-1.5 text-[10.5px] font-bold text-gray-700 outline-none focus:border-blue-500 shadow-3xs"
                  />
                </div>

                {activeMode === 'wing' && (
                  <div className="flex flex-col gap-1 sm:col-span-2">
                    <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wide">Select Target Wing *</span>
                    <select 
                      value={selectedWing}
                      onChange={(e) => setSelectedWing(e.target.value)}
                      className="bg-white border border-gray-250 rounded-lg px-3 py-1.5 text-[10.5px] font-bold text-gray-700 outline-none focus:border-blue-500 cursor-pointer shadow-3xs"
                    >
                      <option>A Wing</option>
                      <option>B Wing</option>
                      <option>C Wing</option>
                      <option>D Wing</option>
                    </select>
                  </div>
                )}

                {activeMode === 'flat' && (
                  <>
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wide">Select Target Wing *</span>
                      <select 
                        value={selectedWing}
                        onChange={(e) => setSelectedWing(e.target.value)}
                        className="bg-white border border-gray-250 rounded-lg px-3 py-1.5 text-[10.5px] font-bold text-gray-700 outline-none focus:border-blue-500 cursor-pointer shadow-3xs"
                      >
                        <option>A Wing</option>
                        <option>B Wing</option>
                        <option>C Wing</option>
                        <option>D Wing</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wide">Flat / Shop Number *</span>
                      <input 
                        type="text" 
                        required
                        value={flatNum}
                        onChange={(e) => setFlatNum(e.target.value)}
                        className="bg-white border border-gray-250 rounded-lg px-3 py-1.5 text-[10.5px] font-bold text-gray-700 outline-none focus:border-blue-500 shadow-3xs"
                        placeholder="e.g. 103"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Checkbox checks */}
              <div className="flex flex-col gap-2 mt-2 bg-slate-50/50 p-3 rounded-xl border border-gray-150 text-[10px] font-semibold text-slate-700">
                <span className="text-[8.5px] text-slate-400 font-black uppercase tracking-wider mb-1 block">Compliance Checklist</span>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={fireCompliant}
                    onChange={(e) => setFireCompliant(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Fire safety compliance audit signed-off by chief fire officer</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={waterAttached}
                    onChange={(e) => setWaterAttached(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Municipal water and sewerage blueprint links verified</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={drainageCert}
                    onChange={(e) => setDrainageCert(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Environmental clearance certificate & structural stability certificate attached</span>
                </label>
              </div>

              <button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[10.5px] py-2 px-4 rounded-lg cursor-pointer transition uppercase text-center tracking-wider shadow-3xs mt-3.5 animate-pulse"
              >
                Submit & Apply Occupancy Certificate
              </button>
            </form>

            {/* Info Panel / Preview Area (5 cols) */}
            <div className="md:col-span-5 bg-slate-50 rounded-2xl p-4 border border-gray-200 flex flex-col justify-between gap-4 h-fit">
              <div className="space-y-3">
                <span className="text-[9.5px] text-slate-500 font-black uppercase tracking-wide block">Auditing Scope Preview</span>
                <p className="text-[10px] text-gray-500 font-semibold leading-relaxed">
                  Applying an Occupancy Certificate locks the assessment records and certifies that the designated area is legally habitable and compliant with municipality laws.
                </p>
                <div className="space-y-2 text-[10px] font-bold text-gray-700">
                  <div className="flex justify-between py-1 border-b border-gray-200/70">
                    <span className="text-gray-400">Target Area:</span>
                    <span>{
                      activeMode === 'building' ? 'All Wings (A, B, C, D)' : 
                      activeMode === 'wing' ? `${selectedWing} Total` : 
                      `${selectedWing} - Unit ${flatNum}`
                    }</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-200/70">
                    <span className="text-gray-400">Affected Properties:</span>
                    <span className="text-blue-700">{
                      activeMode === 'building' ? '67 Units' : 
                      activeMode === 'wing' ? (selectedWing === 'A Wing' || selectedWing === 'B Wing' ? '19 Units' : selectedWing === 'C Wing' ? '15 Units' : '14 Units') : 
                      '1 Unit'
                    }</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-400">Audit Status:</span>
                    <span className="text-orange-500 uppercase">Awaiting Submission</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-[9.5px] text-blue-800 leading-normal font-semibold">
                <strong>Notice:</strong> Once applied, tax computation rates will automatically transition to occupied status multiplier variables where applicable.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
