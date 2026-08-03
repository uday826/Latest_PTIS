import React, { useState } from 'react';
import { ChevronUp, Plus, Layers } from 'lucide-react';
import { comparisonRows } from './mockData';
import TaxRulesModal from './TaxRulesModal';
import { PreviousAssessmentTable, CurrentSurveyTable } from './ComparisonSubTables';

interface ComparisonTableProps {
  selectedWing?: string;
}

function getStatusBgClass(status: string) {
  switch (status) {
    case 'Matched':
      return 'bg-green-50/70';
    case 'Modified':
      return 'bg-amber-50/70';
    case 'New':
      return 'bg-blue-50/75';
    case 'Missing':
      return 'bg-red-50/75';
    default:
      return '';
  }
}

function getStatusBadgeClass(status: string) {
  switch (status) {
    case 'Matched':
      return 'bg-green-50 text-green-600 border border-green-200/50';
    case 'Modified':
      return 'bg-amber-50 text-amber-600 border border-amber-200/50';
    case 'New':
      return 'bg-blue-50 text-blue-600 border border-blue-200/50';
    case 'Missing':
      return 'bg-red-50 text-red-600 border border-red-200/50';
    default:
      return 'bg-gray-50 text-gray-500 border border-gray-200/50';
  }
}

function getOwnerName(prop: string) {
  const names: { [key: string]: string } = {
    "102": "Rahul Sharma",
    "103": "Amit Patel",
    "201": "Sneha Reddy",
    "S-01": "Karan Gupta",
    "S-02": "Vikram Singh",
    "S-03": "Sunita Rao",
    "104": "Rajesh Kumar",
    "105": "Priya Nair",
    "106": "Anil Deshmukh"
  };
  return names[prop] || "Owner " + prop;
}

export default function ComparisonTable({ selectedWing }: ComparisonTableProps) {
  const wingLetter = selectedWing ? selectedWing.charAt(0) : 'B';
  const [selectedRowForRules, setSelectedRowForRules] = useState<any | null>(null);

  const rows = comparisonRows.map((row) => {
    const prevWingMapped = row.prevWing.startsWith('B/') ? row.prevWing.replace('B/', `${wingLetter}/`) : row.prevWing;
    const currWingMapped = row.currWing.startsWith('B/') ? row.currWing.replace('B/', `${wingLetter}/`) : row.currWing;
    const ownerName = row.currProp !== "-" ? getOwnerName(row.currProp) : "-";
    const prevCVVal = row.prevCarpet && row.prevCarpet !== 0 ? row.prevCarpet * 60 : 0;
    const currCVVal = row.currCarpet && row.currCarpet !== 0 ? row.currCarpet * 60 : 0;

    return {
      ...row,
      prevWing: prevWingMapped,
      currWing: currWingMapped,
      prevCV: prevCVVal !== 0 ? `₹${prevCVVal.toLocaleString()} L` : "-",
      currCV: currCVVal !== 0 ? `₹${currCVVal.toLocaleString()} L` : "-",
      owner: ownerName,
      ocpr: row.currProp !== "-" ? (row.currRent !== "-" ? "Tenant" : "Self") : "-",
      rntr: row.currProp !== "-" && row.currRent !== "-" ? "Ravi Kumar" : "-",
      shop: row.currType === "Shop" ? `Shop ${row.currProp}` : "-",
      mob: row.currProp !== "-" ? "+91 98765 43210" : "-",
      email: row.currProp !== "-" ? `${ownerName.toLowerCase().replace(' ', '')}@PTIS.gov.in` : "-",
      occDt: row.currProp !== "-" ? "10-Apr-2016" : "-",
      exmp: row.currProp !== "-" ? "None" : "-",
      disc: row.currProp !== "-" ? "10%" : "-",
      rvCvm: "Matched"
    };
  });

  return (
    <div className="w-full flex flex-col border border-gray-200 rounded-xl shadow-xs overflow-hidden bg-white shrink-0">
      {selectedRowForRules && (
        <TaxRulesModal 
          onClose={() => setSelectedRowForRules(null)}
          wing={selectedRowForRules.prevWing !== "-" ? selectedRowForRules.prevWing.split('/')[0] + " Wing" : selectedRowForRules.currWing.split('/')[0] + " Wing"}
          unit={selectedRowForRules.currProp !== "-" ? selectedRowForRules.currProp : selectedRowForRules.prevWing.split('/')[1]}
          use={selectedRowForRules.currUse !== "-" ? selectedRowForRules.currUse : selectedRowForRules.prevUse}
          owner={selectedRowForRules.owner}
          tax={selectedRowForRules.currTax !== "-" ? selectedRowForRules.currTax : selectedRowForRules.prevTax}
        />
      )}

      <div className="w-full flex divide-x divide-gray-200">
      
        {/* LEFT TABLE: Existing Assessment (Previous) */}
        <div className="w-[41%] shrink-0 flex flex-col bg-white">
          <div className="bg-[#edf7f4] border-b border-gray-200 px-3 py-1.5 flex items-center justify-between h-[34px] shrink-0">
            <div className="flex items-center gap-1 select-none">
              <span className="text-[10px] font-black text-[#006a4e] uppercase tracking-tight">Existing Assessment</span>
              <span className="text-[9.5px] text-[#006a4e]/75 font-semibold">(Previous)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button className="text-[8.5px] font-bold text-blue-600 bg-white border border-gray-200 hover:bg-gray-50 rounded px-1.5 py-0.5 shadow-2xs leading-none">
                View Grouped
              </button>
              <button className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <ChevronUp size={11} />
              </button>
              <button className="text-gray-400 hover:text-gray-655 cursor-pointer">
                <Plus size={11} className="rotate-45" />
              </button>
            </div>
          </div>
          
          <PreviousAssessmentTable 
            rows={rows} 
            onOpenRules={setSelectedRowForRules} 
            getStatusBgClass={getStatusBgClass} 
            getStatusBadgeClass={getStatusBadgeClass} 
          />
        </div>

        {/* MIDDLE COLUMN: Difference Engine */}
        <div className="w-[18%] shrink-0 flex flex-col bg-[#fffdf5] border-l border-r border-gray-200">
          <div className="bg-[#fdf8e2] border-b border-amber-250/60 px-3 py-1.5 flex items-center justify-between h-[34px] shrink-0">
            <span className="text-[10px] font-black text-[#8a6d1c] uppercase tracking-tight">Difference Engine</span>
            <button className="text-[8.5px] font-bold text-blue-600 bg-white border border-gray-200 hover:bg-gray-50 rounded px-1.5 py-0.5 shadow-2xs leading-none">
              AI Status
            </button>
          </div>
          
          <div className="w-full overflow-x-auto scrollbar-thin">
            <table className="min-w-[420px] text-left border-collapse text-[10px] w-full">
              <thead>
                <tr className="bg-[#fdf8e2]/60 border-b border-amber-200 text-[#8a6d1c] font-black uppercase h-[32px]">
                  <th className="py-2 px-1.5 text-right whitespace-nowrap">Carpet Δ</th>
                  <th className="py-2 px-1.5 text-right whitespace-nowrap">BUA Δ</th>
                  <th className="py-2 px-1.5 text-right whitespace-nowrap">RV Δ (₹)</th>
                  <th className="py-2 px-1.5 text-right whitespace-nowrap">Tax Δ (₹)</th>
                  <th className="py-2 px-1.5 text-right whitespace-nowrap">Rt Tax Δ</th>
                  <th className="py-2 px-1.5 text-right whitespace-nowrap">Pen Δ</th>
                  <th className="py-2 px-1.5 text-center whitespace-nowrap">Suggestion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150">
                {rows.map((row, index) => {
                  return (
                    <tr key={index} className={`h-[36px] font-bold hover:bg-gray-50/50 ${getStatusBgClass(row.diffStatus)}`}>
                      <td className={`py-1 px-1.5 text-right whitespace-nowrap ${row.diffCarpet > 0 ? 'text-red-500 font-extrabold' : 'text-gray-400 font-normal'}`}>
                        {row.diffCarpet > 0 ? `+${row.diffCarpet}` : '0'}
                      </td>
                      <td className={`py-1 px-1.5 text-right whitespace-nowrap ${row.diffBua > 0 ? 'text-red-500 font-extrabold' : 'text-gray-400 font-normal'}`}>
                        {row.diffBua > 0 ? `+${row.diffBua}` : '0'}
                      </td>
                      <td className={`py-1 px-1.5 text-right whitespace-nowrap ${row.diffRv > 0 ? 'text-red-500 font-extrabold' : 'text-gray-400 font-normal'}`}>
                        {row.diffRv > 0 ? `+${row.diffRv.toLocaleString()}` : '0'}
                      </td>
                      <td className={`py-1 px-1.5 text-right whitespace-nowrap ${row.diffTax > 0 ? 'text-red-500 font-extrabold' : 'text-gray-400 font-normal'}`}>
                        {row.diffTax > 0 ? `+${row.diffTax.toLocaleString()}` : '0'}
                      </td>
                      <td className="py-1 px-1.5 text-right text-gray-450 font-normal whitespace-nowrap">0</td>
                      <td className="py-1 px-1.5 text-right text-gray-455 font-normal whitespace-nowrap">0</td>
                      <td className="py-1 px-1 text-center whitespace-nowrap select-none">
                        {row.diffSuggestion !== "-" ? (
                          <span className={`text-[8.5px] font-black px-1.5 py-0.5 rounded border leading-none ${
                            row.diffSuggestion === 'Verify Area' ? 'bg-green-50 text-green-600 border-green-200' :
                            row.diffSuggestion === 'Create New' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                            'bg-amber-50 text-amber-600 border-amber-200'
                          }`}>
                            {row.diffSuggestion}
                          </span>
                        ) : "-"}
                      </td>
                    </tr>
                  );
                })}
                
                <tr className="h-[32px] bg-[#fdf8e2]/60 font-black border-t border-amber-200 text-[#8a6d1c]">
                  <td className="py-2 px-1.5 text-right whitespace-nowrap text-red-500 font-black">+124</td>
                  <td className="py-2 px-1.5 text-right whitespace-nowrap text-red-500 font-black">+200</td>
                  <td className="py-2 px-1.5 text-right whitespace-nowrap text-red-500 font-black">+2,917</td>
                  <td className="py-2 px-1.5 text-right whitespace-nowrap text-red-500 font-black">+11,680</td>
                  <td className="py-2 px-1.5 text-right text-gray-400 font-black whitespace-nowrap">0</td>
                  <td className="py-2 px-1.5 text-right text-gray-400 font-black whitespace-nowrap">0</td>
                  <td className="whitespace-nowrap"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT TABLE: New Survey (Current) */}
        <div className="w-[41%] shrink-0 flex flex-col bg-white">
          <div className="bg-[#edf2ff] border-b border-gray-200 px-3 py-1.5 flex items-center justify-between h-[34px] shrink-0">
            <div className="flex items-center gap-1 select-none">
              <span className="text-[10px] font-black text-[#1e40af] uppercase tracking-tight">New Survey</span>
              <span className="text-[9.5px] text-[#1e40af]/75 font-semibold">(Current)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button className="text-[8.5px] font-bold text-blue-600 bg-white border border-gray-200 hover:bg-gray-50 rounded px-1.5 py-0.5 shadow-2xs leading-none">
                View Grouped
              </button>
              <button className="text-gray-400 hover:text-gray-655 cursor-pointer">
                <ChevronUp size={11} />
              </button>
              <button className="text-gray-400 hover:text-gray-655 cursor-pointer">
                <Plus size={11} className="rotate-45" />
              </button>
            </div>
          </div>
          
          <CurrentSurveyTable 
            rows={rows} 
            onOpenRules={setSelectedRowForRules} 
            getStatusBgClass={getStatusBgClass} 
            getStatusBadgeClass={getStatusBadgeClass} 
          />
        </div>
      
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between p-3 bg-gray-50/50 border-t border-gray-100 text-[10px] font-bold text-gray-400 rounded-b-xl">
        <div>* Note: Click on any row to view detailed comparison, photos, documents and history.</div>
        <div>Click on <Layers size={11} className="inline mr-1 text-[#3b82f6]" /> to view complete Tax Rules & Discounts policy for the record.</div>
      </div>
    </div>
  );
}
