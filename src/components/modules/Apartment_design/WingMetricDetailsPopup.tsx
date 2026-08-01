import React from 'react';

interface WingMetricDetailsPopupProps {
  popupData: {
    top: number;
    left: number;
    type: 'discount' | 'exemptions' | 'rvImpact';
    wing: any;
  } | null;
  onClose: () => void;
}

export default function WingMetricDetailsPopup({ popupData, onClose }: WingMetricDetailsPopupProps) {
  if (!popupData) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 z-30 bg-black/10 sm:bg-transparent" 
        onClick={onClose}
      />
      
      <div 
        className="absolute z-40 w-[295px] bg-white border border-blue-200 rounded-xl shadow-xl p-3.5 font-sans animate-scaleIn select-none"
        style={{
          top: `${popupData.top}px`,
          left: `${popupData.left}px`,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-gray-150">
          <span className="font-black text-[#002fbe] text-[10px] uppercase tracking-wider">
            {popupData.type === 'discount' && `DISCOUNT DETAILS – ${popupData.wing.wing.toUpperCase()}`}
            {popupData.type === 'exemptions' && `EXEMPTION DETAILS – ${popupData.wing.wing.toUpperCase()}`}
            {popupData.type === 'rvImpact' && `REV IMPACT DETAILS – ${popupData.wing.wing.toUpperCase()}`}
          </span>
          <button 
            onClick={onClose}
            className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 font-extrabold text-[12px] cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            ×
          </button>
        </div>

        {/* Details Content */}
        <div className="text-[10.5px] leading-relaxed space-y-2 text-gray-700 font-semibold">
          {popupData.type === 'discount' && (
            <>
              <div className="flex justify-between"><span className="text-gray-400 uppercase text-[8.5px]">Amount</span> <span className="text-[#002a8f] font-bold">{popupData.wing.discountDetails.amount}</span></div>
              <div className="flex justify-between"><span className="text-gray-400 uppercase text-[8.5px]">Percentage</span> <span className="text-green-600 font-bold">{popupData.wing.discountDetails.pct}</span></div>
              <div className="flex justify-between"><span className="text-gray-400 uppercase text-[8.5px]">Affected Units</span> <span className="text-gray-800 font-bold">{popupData.wing.discountDetails.units}</span></div>
              <div className="flex justify-between"><span className="text-gray-400 uppercase text-[8.5px]">Category</span> <span className="text-gray-800 font-bold">{popupData.wing.discountDetails.category}</span></div>
              <div className="flex justify-between"><span className="text-gray-400 uppercase text-[8.5px]">Applicable Period</span> <span className="text-gray-800">{popupData.wing.discountDetails.period}</span></div>
              <div className="flex justify-between"><span className="text-gray-400 uppercase text-[8.5px]">Approval Status</span> <span className="text-green-600 font-bold">{popupData.wing.discountDetails.status}</span></div>
              <div className="pt-1.5 border-t border-gray-100 text-gray-500 text-[9.5px] italic leading-tight">{popupData.wing.discountDetails.remarks}</div>
            </>
          )}

          {popupData.type === 'exemptions' && (
            <>
              <div className="flex justify-between"><span className="text-gray-400 uppercase text-[8.5px]">Exempted Units</span> <span className="text-gray-800 font-bold">{popupData.wing.exemptionDetails.units}</span></div>
              <div className="flex justify-between"><span className="text-gray-400 uppercase text-[8.5px]">Category</span> <span className="text-purple-600 font-bold">{popupData.wing.exemptionDetails.category}</span></div>
              <div className="flex justify-between"><span className="text-gray-400 uppercase text-[8.5px]">Eligible Units</span> <span className="text-gray-800">{popupData.wing.exemptionDetails.eligible}</span></div>
              <div className="flex justify-between"><span className="text-gray-400 uppercase text-[8.5px]">Exemption Amount</span> <span className="text-[#002a8f] font-bold">{popupData.wing.exemptionDetails.amount}</span></div>
              <div className="flex justify-between"><span className="text-gray-400 uppercase text-[8.5px]">Certificate No.</span> <span className="text-gray-800 font-bold">{popupData.wing.exemptionDetails.certNo}</span></div>
              <div className="flex justify-between"><span className="text-gray-400 uppercase text-[8.5px]">Validity</span> <span className="text-gray-800">{popupData.wing.exemptionDetails.validity}</span></div>
              <div className="flex justify-between"><span className="text-gray-400 uppercase text-[8.5px]">Status</span> <span className="text-green-600 font-bold">{popupData.wing.exemptionDetails.status}</span></div>
              <div className="pt-1.5 border-t border-gray-100 text-gray-550 text-[9.5px] italic leading-tight">{popupData.wing.exemptionDetails.remarks}</div>
            </>
          )}

          {popupData.type === 'rvImpact' && (
            <>
              <div className="flex justify-between"><span className="text-gray-400 uppercase text-[8.5px]">Previous RV</span> <span className="text-gray-500 font-bold">{popupData.wing.rvImpactDetails.prevRv}</span></div>
              <div className="flex justify-between"><span className="text-gray-400 uppercase text-[8.5px]">Revised RV</span> <span className="text-[#002a8f] font-bold">{popupData.wing.rvImpactDetails.revisedRv}</span></div>
              <div className="flex justify-between"><span className="text-gray-400 uppercase text-[8.5px]">Difference RV</span> <span className="text-green-600 font-bold">{popupData.wing.rvImpactDetails.diff}</span></div>
              <div className="flex justify-between"><span className="text-gray-400 uppercase text-[8.5px]">Percentage Change</span> <span className="text-green-600 font-bold">{popupData.wing.rvImpactDetails.pctChange}</span></div>
              <div className="flex justify-between"><span className="text-gray-400 uppercase text-[8.5px]">Affected Units</span> <span className="text-gray-800 font-bold">{popupData.wing.rvImpactDetails.units}</span></div>
              <div className="flex justify-between"><span className="text-gray-400 uppercase text-[8.5px]">Effective Date</span> <span className="text-gray-800">{popupData.wing.rvImpactDetails.effectiveDate}</span></div>
              <div className="flex justify-between"><span className="text-gray-400 uppercase text-[8.5px]">Assessment Ref.</span> <span className="text-gray-800">{popupData.wing.rvImpactDetails.ref}</span></div>
              <div className="pt-1.5 border-t border-gray-100 text-gray-550 text-[9.5px] italic leading-tight">{popupData.wing.rvImpactDetails.remarks}</div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
