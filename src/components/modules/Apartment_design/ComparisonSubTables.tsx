import React from 'react';
import { Eye, Image as ImageIcon } from 'lucide-react';

interface SubTableProps {
  rows: any[];
  onOpenRules: (row: any) => void;
  getStatusBgClass: (status: string) => string;
  getStatusBadgeClass: (status: string) => string;
}

export function PreviousAssessmentTable({ rows, onOpenRules, getStatusBgClass, getStatusBadgeClass }: SubTableProps) {
  return (
    <div className="overflow-x-auto w-full scrollbar-thin">
      <table className="w-max text-left border-collapse text-[10px]">
        <thead>
          <tr className="bg-[#edf7f4]/45 border-b border-gray-250 text-[#006a4e] font-black uppercase h-[32px]">
            <th className="py-2 px-3 text-center whitespace-nowrap">#</th>
            <th className="py-2 px-3 whitespace-nowrap">Prop</th>
            <th className="py-2 px-3 whitespace-nowrap">Wg/Fl</th>
            <th className="py-2 px-3 whitespace-nowrap">Type</th>
            <th className="py-2 px-3 text-center whitespace-nowrap">Flr</th>
            <th className="py-2 px-3 text-center whitespace-nowrap">CYr</th>
            <th className="py-2 px-3 whitespace-nowrap">CTy</th>
            <th className="py-2 px-3 whitespace-nowrap">Use</th>
            <th className="py-2 px-3 text-right whitespace-nowrap">Rent</th>
            <th className="py-2 px-3 text-right whitespace-nowrap">Cpt</th>
            <th className="py-2 px-3 text-right whitespace-nowrap">BUA</th>
            <th className="py-2 px-3 text-center whitespace-nowrap">AYr</th>
            <th className="py-2 px-3 text-center whitespace-nowrap">OccDt</th>
            <th className="py-2 px-3 text-center whitespace-nowrap">RtPd</th>
            <th className="py-2 px-3 text-right whitespace-nowrap">Rate</th>
            <th className="py-2 px-3 text-right whitespace-nowrap">RV</th>
            <th className="py-2 px-3 text-right whitespace-nowrap">CV</th>
            <th className="py-2 px-3 text-right whitespace-nowrap">Tax</th>
            <th className="py-2 px-3 text-center whitespace-nowrap">RV vs CVM</th>
            <th className="py-2 px-3 text-right whitespace-nowrap">RtTx</th>
            <th className="py-2 px-3 text-right whitespace-nowrap">Pen</th>
            <th className="py-2 px-3 whitespace-nowrap">Exmp</th>
            <th className="py-2 px-3 whitespace-nowrap">Disc</th>
            <th className="py-2 px-3 whitespace-nowrap">Owner</th>
            <th className="py-2 px-3 whitespace-nowrap">Ocpr</th>
            <th className="py-2 px-3 whitespace-nowrap">Rntr</th>
            <th className="py-2 px-3 whitespace-nowrap">Shop</th>
            <th className="py-2 px-3 whitespace-nowrap">Mob</th>
            <th className="py-2 px-3 whitespace-nowrap">Email</th>
            <th className="py-2 px-3 text-center whitespace-nowrap">Img</th>
            <th className="py-2 px-3 text-center whitespace-nowrap border-l border-gray-200/50">Plan</th>
            <th className="py-2 px-3 text-center whitespace-nowrap border-l border-gray-200/50">Rules</th>
            <th className="py-2 px-3 text-center whitespace-nowrap border-l border-gray-200/50">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-150">
          {rows.map((row, index) => {
            const bgClass = getStatusBgClass(row.diffStatus);
            return (
              <tr key={index} className={`h-[36px] text-gray-700 hover:bg-gray-50/50 ${bgClass}`}>
                <td className="py-1 px-3 text-center font-extrabold text-gray-400 whitespace-nowrap">{row.prevNo}</td>
                <td className="py-1 px-3 font-bold whitespace-nowrap">{row.prevNo !== "-" ? row.currProp : "-"}</td>
                <td className="py-1 px-3 font-bold text-[#002fbe] whitespace-nowrap">{row.prevWing}</td>
                <td className="py-1 px-3 font-bold whitespace-nowrap">{row.prevType}</td>
                <td className="py-1 px-3 text-center whitespace-nowrap">{row.prevFlr}</td>
                <td className="py-1 px-3 text-center whitespace-nowrap">{row.prevYr}</td>
                <td className="py-1 px-3 whitespace-nowrap">{row.prevCon}</td>
                <td className="py-1 px-3 font-semibold text-gray-550 whitespace-nowrap">{row.prevUse}</td>
                <td className="py-1 px-3 text-right whitespace-nowrap">{row.prevRent}</td>
                <td className="py-1 px-3 text-right font-extrabold whitespace-nowrap">{row.prevCarpet || "-"}</td>
                <td className="py-1 px-3 text-right font-extrabold whitespace-nowrap">{row.prevBua || "-"}</td>
                <td className="py-1 px-3 text-center whitespace-nowrap">{row.prevAyr}</td>
                <td className="py-1 px-3 text-center whitespace-nowrap">{row.occDt}</td>
                <td className="py-1 px-3 text-center whitespace-nowrap">{row.prevRtPd}</td>
                <td className="py-1 px-3 text-right whitespace-nowrap">{row.prevRate}</td>
                <td className="py-1 px-3 text-right font-extrabold whitespace-nowrap">{row.prevRv}</td>
                <td className="py-1 px-3 text-right font-extrabold whitespace-nowrap">{row.prevCV}</td>
                <td className="py-1 px-3 text-right font-extrabold text-[#006a4e] whitespace-nowrap">{row.prevTax}</td>
                <td className="py-1 px-3 text-center font-bold text-gray-550 whitespace-nowrap">{row.rvCvm}</td>
                <td className="py-1 px-3 text-right font-extrabold text-[#006a4e]/85 whitespace-nowrap">{row.prevRtTax}</td>
                <td className="py-1 px-3 text-right text-red-500 font-extrabold whitespace-nowrap">{row.prevPen}</td>
                <td className="py-1 px-3 text-gray-500 whitespace-nowrap">{row.exmp}</td>
                <td className="py-1 px-3 text-gray-500 whitespace-nowrap">{row.disc}</td>
                <td className="py-1 px-3 font-bold whitespace-nowrap text-gray-600">{row.owner}</td>
                <td className="py-1 px-3 text-gray-550 whitespace-nowrap">{row.ocpr}</td>
                <td className="py-1 px-3 text-gray-555 whitespace-nowrap">{row.rntr}</td>
                <td className="py-1 px-3 text-gray-555 whitespace-nowrap">{row.shop}</td>
                <td className="py-1 px-3 text-gray-500 whitespace-nowrap">{row.mob}</td>
                <td className="py-1 px-3 text-gray-500 whitespace-nowrap truncate">{row.email}</td>
                <td className="py-1 px-3 text-center whitespace-nowrap">
                  {row.currProp !== "-" ? (
                    <img src="/apartment_image.jpg" alt="Property" className="w-7 h-7 rounded object-cover border border-gray-250 mx-auto" />
                  ) : "-"}
                </td>
                <td className="py-1 px-3 text-center whitespace-nowrap border-l border-gray-200/50">
                  {row.currProp !== "-" ? (
                    <img src="/blueprint_plan.png" alt="Plan" className="w-7 h-7 rounded object-cover border border-gray-250 mx-auto" />
                  ) : "-"}
                </td>
                <td className="py-1 px-3 text-center whitespace-nowrap border-l border-gray-200/50">
                  {row.currProp !== "-" ? (
                    <button 
                      onClick={() => onOpenRules(row)}
                      className="text-[#002fbe] hover:text-[#001f80] transition p-1 hover:bg-slate-100 rounded cursor-pointer inline-flex items-center justify-center"
                      title="View Tax Rules"
                      type="button"
                    >
                      <Eye size={12} />
                    </button>
                  ) : "-"}
                </td>
                <td className="py-1 px-3 text-center whitespace-nowrap border-l border-gray-200/50">
                  <span className={`text-[8.5px] px-1.5 py-0.5 rounded border leading-none font-bold ${getStatusBadgeClass(row.diffStatus)}`}>
                    {row.diffStatus}
                  </span>
                </td>
              </tr>
            );
          })}
          
          <tr className="h-[32px] bg-gray-50 font-black border-t border-gray-250 text-slate-800">
            <td colSpan={9} className="py-2 px-3 uppercase text-[9px] tracking-wider select-none">Total (10 Units)</td>
            <td className="py-2 px-3 text-right whitespace-nowrap">4,456</td>
            <td className="py-2 px-3 text-right whitespace-nowrap">5,570</td>
            <td colSpan={7} className="whitespace-nowrap"></td>
            <td className="py-2 px-3 text-right text-[#006a4e] whitespace-nowrap">83,479</td>
            <td className="py-2 px-3 text-right text-[#006a4e] whitespace-nowrap">2,10,039</td>
            <td className="py-2 px-3 text-right text-[#006a4e]/85 whitespace-nowrap">2,10,039</td>
            <td className="py-2 px-3 text-right text-red-500 whitespace-nowrap">3,360</td>
            <td colSpan={8} className="whitespace-nowrap"></td>
            <td colSpan={4} className="bg-gray-50 border-l border-gray-200/50"></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function CurrentSurveyTable({ rows, onOpenRules, getStatusBgClass, getStatusBadgeClass }: SubTableProps) {
  return (
    <div className="overflow-x-auto w-full scrollbar-thin">
      <table className="w-max text-left border-collapse text-[10px]">
        <thead>
          <tr className="bg-[#edf2ff]/45 border-b border-gray-250 text-[#1e40af] font-black uppercase h-[32px]">
            <th className="py-2 px-3 text-center whitespace-nowrap">#</th>
            <th className="py-2 px-3 whitespace-nowrap">Prop</th>
            <th className="py-2 px-3 whitespace-nowrap">Wg/Fl</th>
            <th className="py-2 px-3 whitespace-nowrap">Type</th>
            <th className="py-2 px-3 text-center whitespace-nowrap">Flr</th>
            <th className="py-2 px-3 text-center whitespace-nowrap">CYr</th>
            <th className="py-2 px-3 whitespace-nowrap">CTy</th>
            <th className="py-2 px-3 whitespace-nowrap">Use</th>
            <th className="py-2 px-3 text-right whitespace-nowrap">Rent</th>
            <th className="py-2 px-3 text-right whitespace-nowrap">Cpt</th>
            <th className="py-2 px-3 text-right whitespace-nowrap">BUA</th>
            <th className="py-2 px-3 text-center whitespace-nowrap">AYr</th>
            <th className="py-2 px-3 text-center whitespace-nowrap">OccDt</th>
            <th className="py-2 px-3 text-center whitespace-nowrap">RtPd</th>
            <th className="py-2 px-3 text-right whitespace-nowrap">Rate</th>
            <th className="py-2 px-3 text-right whitespace-nowrap">RV</th>
            <th className="py-2 px-3 text-right whitespace-nowrap">CV</th>
            <th className="py-2 px-3 text-right whitespace-nowrap">Tax</th>
            <th className="py-2 px-3 text-center whitespace-nowrap">RV vs CVM</th>
            <th className="py-2 px-3 text-right whitespace-nowrap">RtTx</th>
            <th className="py-2 px-3 text-right whitespace-nowrap">Pen</th>
            <th className="py-2 px-3 whitespace-nowrap">Exmp</th>
            <th className="py-2 px-3 whitespace-nowrap">Disc</th>
            <th className="py-2 px-3 whitespace-nowrap">Owner</th>
            <th className="py-2 px-3 whitespace-nowrap">Ocpr</th>
            <th className="py-2 px-3 whitespace-nowrap">Rntr</th>
            <th className="py-2 px-3 whitespace-nowrap">Shop</th>
            <th className="py-2 px-3 whitespace-nowrap">Mob</th>
            <th className="py-2 px-3 whitespace-nowrap">Email</th>
            <th className="py-2 px-3 text-center whitespace-nowrap">Img</th>
            <th className="py-2 px-3 text-center whitespace-nowrap border-l border-gray-200/50">Plan</th>
            <th className="py-2 px-3 text-center whitespace-nowrap border-l border-gray-200/50">Rules</th>
            <th className="py-2 px-3 text-center whitespace-nowrap border-l border-gray-200/50">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-150">
          {rows.map((row, index) => {
            const bgClass = getStatusBgClass(row.diffStatus);
            return (
              <tr key={index} className={`h-[36px] text-gray-700 hover:bg-gray-50/50 ${bgClass}`}>
                <td className="py-1 px-3 text-center font-extrabold text-gray-400 whitespace-nowrap">{row.prevNo}</td>
                <td className="py-1 px-3 font-bold whitespace-nowrap">{row.currProp}</td>
                <td className="py-1 px-3 font-bold text-gray-700 whitespace-nowrap">{row.currWing}</td>
                <td className="py-1 px-3 font-bold whitespace-nowrap">{row.currType}</td>
                <td className="py-1 px-3 text-center whitespace-nowrap">{row.currFlr}</td>
                <td className="py-1 px-3 text-center whitespace-nowrap">{row.currYr}</td>
                <td className="py-1 px-3 whitespace-nowrap">{row.currCon}</td>
                <td className="py-1 px-3 font-semibold text-gray-550 whitespace-nowrap">{row.currUse}</td>
                <td className="py-1 px-3 text-right whitespace-nowrap">{row.currRent}</td>
                <td className="py-1 px-3 text-right font-extrabold whitespace-nowrap">{row.currCarpet || "-"}</td>
                <td className="py-1 px-3 text-right font-extrabold whitespace-nowrap">{row.currBua || "-"}</td>
                <td className="py-1 px-3 text-center whitespace-nowrap">{row.currAyr}</td>
                <td className="py-1 px-3 text-center whitespace-nowrap">{row.occDt}</td>
                <td className="py-1 px-3 text-center whitespace-nowrap">{row.currRtPd}</td>
                <td className="py-1 px-3 text-right whitespace-nowrap">{row.currRate}</td>
                <td className="py-1 px-3 text-right font-extrabold whitespace-nowrap">{row.currRv}</td>
                <td className="py-1 px-3 text-right font-extrabold whitespace-nowrap">{row.currCV}</td>
                <td className="py-1 px-3 text-right font-extrabold text-[#1e40af] whitespace-nowrap">{row.currTax}</td>
                <td className="py-1 px-3 text-center font-bold text-gray-550 whitespace-nowrap">{row.rvCvm}</td>
                <td className="py-1 px-3 text-right font-extrabold text-[#1e40af]/85 whitespace-nowrap">{row.currRtTax}</td>
                <td className="py-1 px-3 text-right text-red-500 font-extrabold whitespace-nowrap">{row.currPen}</td>
                <td className="py-1 px-3 text-gray-500 whitespace-nowrap">{row.exmp}</td>
                <td className="py-1 px-3 text-gray-500 whitespace-nowrap">{row.disc}</td>
                <td className="py-1 px-3 font-bold whitespace-nowrap text-gray-600">{row.owner}</td>
                <td className="py-1 px-3 text-gray-555 whitespace-nowrap">{row.ocpr}</td>
                <td className="py-1 px-3 text-gray-555 whitespace-nowrap">{row.rntr}</td>
                <td className="py-1 px-3 text-gray-555 whitespace-nowrap">{row.shop}</td>
                <td className="py-1 px-3 text-gray-500 whitespace-nowrap">{row.mob}</td>
                <td className="py-1 px-3 text-gray-500 whitespace-nowrap truncate">{row.email}</td>
                <td className="py-1 px-3 text-center whitespace-nowrap">
                  {row.currProp !== "-" ? (
                    <img src="/apartment_image.jpg" alt="Property" className="w-7 h-7 rounded object-cover border border-gray-250 mx-auto" />
                  ) : "-"}
                </td>
                <td className="py-1 px-3 text-center whitespace-nowrap border-l border-gray-200/50">
                  {row.currProp !== "-" ? (
                    <img src="/blueprint_plan.png" alt="Plan" className="w-7 h-7 rounded object-cover border border-gray-250 mx-auto" />
                  ) : "-"}
                </td>
                <td className="py-1 px-3 text-center whitespace-nowrap border-l border-gray-200/50">
                  {row.currProp !== "-" ? (
                    <button 
                      onClick={() => onOpenRules(row)}
                      className="text-[#002fbe] hover:text-[#001f80] transition p-1 hover:bg-slate-100 rounded cursor-pointer inline-flex items-center justify-center"
                      title="View Tax Rules"
                      type="button"
                    >
                      <Eye size={12} />
                    </button>
                  ) : "-"}
                </td>
                <td className="py-1 px-3 text-center whitespace-nowrap border-l border-gray-200/50">
                  <span className={`text-[8.5px] px-1.5 py-0.5 rounded border leading-none font-bold ${getStatusBadgeClass(row.diffStatus)}`}>
                    {row.diffStatus}
                  </span>
                </td>
              </tr>
            );
          })}
          
          <tr className="h-[32px] bg-gray-50 font-black border-t border-gray-250 text-slate-800">
            <td colSpan={8} className="py-2 px-3 uppercase text-[9px] tracking-wider select-none">Total</td>
            <td className="py-2 px-3 text-right whitespace-nowrap">4,580</td>
            <td className="py-2 px-3 text-right whitespace-nowrap">5,770</td>
            <td colSpan={7} className="whitespace-nowrap"></td>
            <td className="py-2 px-3 text-right text-[#1e40af] whitespace-nowrap">86,396</td>
            <td className="py-2 px-3 text-right text-[#1e40af] whitespace-nowrap">2,21,719</td>
            <td colSpan={9} className="whitespace-nowrap"></td>
            <td colSpan={4} className="bg-gray-50 border-l border-gray-200/50"></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
