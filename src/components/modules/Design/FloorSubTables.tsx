import React from 'react';

export function CapitalTable() {
  return (
    <table className="w-full text-[10px] text-center border-collapse animate-fadeIn bg-white">
      <thead className="bg-[#1e2b58] text-white font-extrabold border-b border-gray-200 whitespace-nowrap">
        <tr>
          <th className="py-1.5 px-1.5 w-10 text-center font-bold">#</th>
          <th className="py-1.5 px-1.5 text-left font-bold uppercase tracking-wider text-[8.5px]">Use</th>
          <th className="py-1.5 px-1.5 text-right font-bold uppercase tracking-wider text-[8.5px]">RV (₹)</th>
          <th className="py-1.5 px-1.5 text-[#1e2b58] font-bold text-right">RV Tax (₹)</th>
          <th className="py-1.5 px-1.5 text-right font-bold uppercase tracking-wider text-[8.5px]">CV (₹)</th>
          <th className="py-1.5 px-1.5 text-right font-bold uppercase tracking-wider text-[8.5px]">CV Tax (₹)</th>
          <th className="py-1.5 px-1.5 text-right font-bold uppercase tracking-wider text-[8.5px]">Calculated (Higher) (₹)</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-150 font-medium text-gray-700 bg-white whitespace-nowrap">
        <tr className="hover:bg-gray-50">
          <td className="py-1.5 px-1.5 text-center font-bold text-gray-500">1</td>
          <td className="py-1.5 px-1.5 text-blue-900 font-bold text-left">खुला भूखंड</td>
          <td className="py-1.5 px-1.5 text-right">₹6,000</td>
          <td className="py-1.5 px-1.5 font-bold text-right text-green-600">₹900</td>
          <td className="py-1.5 px-1.5 text-right">₹4,50,000</td>
          <td className="py-1.5 px-1.5 text-right">₹1,350</td>
          <td className="py-1.5 px-1.5 font-bold text-green-600 text-right">₹1,350</td>
        </tr>
      </tbody>
    </table>
  );
}

export function DualTable() {
  return (
    <table className="w-full text-[10px] text-center border-collapse animate-fadeIn bg-white">
      <thead className="bg-[#1e2b58] text-white font-extrabold border-b border-gray-200 whitespace-nowrap">
        <tr>
          <th className="py-1.5 px-1.5 w-10 text-center font-bold">#</th>
          <th className="py-1.5 px-1.5 text-left font-bold uppercase tracking-wider text-[8.5px]">Use</th>
          <th className="py-1.5 px-1.5 text-right font-bold uppercase tracking-wider text-[8.5px]">RV (₹)</th>
          <th className="py-1.5 px-1.5 text-right font-bold uppercase tracking-wider text-[8.5px]">RV Tax (₹)</th>
          <th className="py-1.5 px-1.5 text-right font-bold uppercase tracking-wider text-[8.5px]">CV (₹)</th>
          <th className="py-1.5 px-1.5 text-right font-bold uppercase tracking-wider text-[8.5px]">CV Tax (₹)</th>
          <th className="py-1.5 px-1.5 text-right font-bold uppercase tracking-wider text-[8.5px]">Calculated (Higher) (₹)</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-150 font-medium text-gray-700 bg-white whitespace-nowrap">
        <tr className="hover:bg-gray-50">
          <td className="py-1.5 px-1.5 text-center font-bold text-gray-500">1</td>
          <td className="py-1.5 px-1.5 text-blue-900 font-bold text-left">निवासी</td>
          <td className="py-1.5 px-1.5 text-right">₹6,000</td>
          <td className="py-1.5 px-1.5 text-right">₹900</td>
          <td className="py-1.5 px-1.5 text-right">₹4,50,000</td>
          <td className="py-1.5 px-1.5 text-right">₹1,350</td>
          <td className="py-1.5 px-1.5 font-bold text-green-600 text-right">₹1,350</td>
        </tr>
      </tbody>
    </table>
  );
}
