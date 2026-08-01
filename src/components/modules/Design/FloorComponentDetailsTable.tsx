import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface FloorComponentDetailsTableProps {
  activeSubTab: 'rateable' | 'capital' | 'dual' | 'reassessment';
}

export default function FloorComponentDetailsTable({ activeSubTab }: FloorComponentDetailsTableProps) {
  const tableRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [showScrollControls, setShowScrollControls] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = tableRef.current;
    if (el) {
      const hasOverflow = el.scrollWidth > el.clientWidth;
      setShowScrollControls(hasOverflow);
      setCanScrollLeft(el.scrollLeft > 2);
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
    }
  }, []);

  useEffect(() => {
    const el = tableRef.current;
    if (el) {
      updateScrollState();
      el.addEventListener('scroll', updateScrollState);
      window.addEventListener('resize', updateScrollState);

      const observer = new MutationObserver(updateScrollState);
      observer.observe(el, { childList: true, subtree: true });

      return () => {
        el.removeEventListener('scroll', updateScrollState);
        window.removeEventListener('resize', updateScrollState);
        observer.disconnect();
      };
    }
  }, [activeSubTab, updateScrollState]);

  const scrollLeft = () => {
    const el = tableRef.current;
    if (el) {
      el.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const el = tableRef.current;
    if (el) {
      el.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative flex items-stretch gap-1.5 w-full shrink-0">
      <div 
        ref={tableRef} 
        className="overflow-x-auto overflow-y-auto max-h-[168px] border border-gray-200 rounded-lg relative table-scroll-container flex-grow no-scrollbar"
      >
        {activeSubTab === 'rateable' && (
          <table className="w-full text-[10px] text-center border-collapse animate-fadeIn bg-white table-auto">
            <thead className="bg-[#002fbe] text-white font-extrabold whitespace-nowrap sticky top-0 z-20">
              <tr>
                <th className="py-2.5 px-1.5 font-extrabold text-white w-7 border-r border-white/10 text-[8.5px] uppercase sticky left-0 bg-[#002fbe] z-30">#</th>
                <th className="py-2.5 px-1.5 w-14 border-r border-white/10 font-bold uppercase tracking-wider text-[8.5px]">Taxable</th>
                <th className="py-2.5 px-1.5 w-24 border-r border-white/10 font-bold uppercase tracking-wider text-[8.5px]">Floor</th>
                <th className="py-2.5 px-1.5 w-20 border-r border-white/10 font-bold uppercase tracking-wider text-[8.5px]">Use</th>
                <th className="py-2.5 px-1.5 w-28 border-r border-white/10 font-bold uppercase tracking-wider text-[8.5px]">Sub Type</th>
                <th className="py-2.5 px-1.5 w-16 border-r border-white/10 font-bold uppercase tracking-wider text-[8.5px]">Rooms / Units</th>
                <th className="py-2.5 px-1.5 w-32 border-r border-white/10 font-bold uppercase tracking-wider text-[8.5px]">Carpet Area (ft/mtr)</th>
                <th className="py-2.5 px-1.5 w-32 border-r border-white/10 font-bold uppercase tracking-wider text-[8.5px]">Built-up Area (ft/mtr)</th>
                <th className="py-2.5 px-1.5 w-32 border-r border-white/10 font-bold uppercase tracking-wider text-[8.5px]">Rateable Value (₹)</th>
                <th className="py-2.5 px-1.5 w-32 border-r border-white/10 font-bold uppercase tracking-wider text-[8.5px]">Tax (Current) (₹)</th>
                <th className="py-2.5 px-1.5 w-20 border-r border-white/10 font-bold uppercase tracking-wider text-[8.5px]">Actions</th>
                <th className="py-2.5 px-1.5 w-14 border-r border-white/10 font-bold uppercase tracking-wider text-[8.5px]">Taxable</th>
                <th className="py-2.5 px-1.5 w-24 border-r border-white/10 font-bold uppercase tracking-wider text-[8.5px]">Floor</th>
                <th className="py-2.5 px-1.5 w-20 border-r border-white/10 font-bold uppercase tracking-wider text-[8.5px]">Use</th>
                <th className="py-2.5 px-1.5 w-28 border-r border-white/10 font-bold uppercase tracking-wider text-[8.5px]">Sub Type</th>
                <th className="py-2.5 px-1.5 w-16 border-r border-white/10 font-bold uppercase tracking-wider text-[8.5px]">Rooms / Units</th>
                <th className="py-2.5 px-1.5 w-32 border-r border-white/10 font-bold uppercase tracking-wider text-[8.5px]">Carpet Area (ft/mtr)</th>
                <th className="py-2.5 px-1.5 w-32 border-r border-white/10 font-bold uppercase tracking-wider text-[8.5px]">Built-up Area (ft/mtr)</th>
                <th className="py-2.5 px-1.5 w-32 border-r border-white/10 font-bold uppercase tracking-wider text-[8.5px]">Rateable Value (₹)</th>
                <th className="py-2.5 px-1.5 w-32 border-r border-white/10 font-bold uppercase tracking-wider text-[8.5px]">Tax (Current) (₹)</th>
                <th className="py-2.5 px-1.5 w-20 font-bold uppercase tracking-wider text-[8.5px]">Actions</th>
              </tr>
            </thead>
            <tbody className="font-medium text-gray-700 whitespace-nowrap bg-white text-center">
              <tr className="hover:bg-gray-50/50 border-b border-gray-200">
                <td className="py-2 px-2 text-gray-400 font-bold border-r border-gray-200 sticky left-0 bg-white z-10">1</td>
                <td className="py-2 px-2 text-red-500 font-extrabold border-r border-gray-200 text-[9.5px]">No</td>
                <td className="py-2 px-2 text-[#1e2b58] font-extrabold border-r border-gray-200 text-[9.5px]">Open Plot</td>
                <td className="py-2 px-2 text-gray-400 font-extrabold border-r border-gray-200 text-[9.5px]">-</td>
                <td className="py-2 px-2 text-gray-400 font-extrabold border-r border-gray-200 text-[9.5px]">-</td>
                <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">0</td>
                <td className="py-2 px-2 font-extrabold text-gray-600 border-r border-gray-200 text-[9.5px]">0.00 / 0.00</td>
                <td className="py-2 px-2 font-extrabold text-gray-600 border-r border-gray-200 text-[9.5px]">0.00 / 0.00</td>
                <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">0</td>
                <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">0</td>
                <td className="py-2 px-2 border-r border-gray-200 text-center"><span className="bg-gray-100 text-gray-400 rounded px-2.5 py-0.5 text-[8.5px] font-extrabold border border-gray-200">NA</span></td>
                <td className="py-2 px-2 text-red-500 font-extrabold border-r border-gray-200 text-[9.5px]">No</td>
                <td className="py-2 px-2 text-[#1e2b58] font-extrabold border-r border-gray-200 text-[9.5px]">Open Plot</td>
                <td className="py-2 px-2 text-gray-400 font-extrabold border-r border-gray-200 text-[9.5px]">-</td>
                <td className="py-2 px-2 text-gray-400 font-extrabold border-r border-gray-200 text-[9.5px]">-</td>
                <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">0</td>
                <td className="py-2 px-2 font-extrabold text-gray-600 border-r border-gray-200 text-[9.5px]">0.00 / 0.00</td>
                <td className="py-2 px-2 font-extrabold text-gray-600 border-r border-gray-200 text-[9.5px]">0.00 / 0.00</td>
                <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">0</td>
                <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">0</td>
                <td className="py-2 px-2 border-r border-gray-200 text-center"><span className="bg-gray-100 text-gray-400 rounded px-2.5 py-0.5 text-[8.5px] font-extrabold border border-gray-200">NA</span></td>
              </tr>
              <tr className="hover:bg-gray-50/50 border-b border-gray-200">
                <td className="py-2 px-2 text-gray-400 font-bold border-r border-gray-200 sticky left-0 bg-white z-10">2</td>
                <td className="py-2 px-2 text-green-600 font-extrabold border-r border-gray-200 text-[9.5px]">Yes</td>
                <td className="py-2 px-2 text-[#1e2b58] font-extrabold border-r border-gray-200 text-[9.5px]">Ground Floor</td>
                <td className="py-2 px-2 text-[#1e2b58] font-extrabold font-sans border-r border-gray-200 text-[9.5px]">व्यवसायिक</td>
                <td className="py-2 px-2 text-[#1e2b58] font-extrabold border-r border-gray-200 text-[9.5px]">Shop</td>
                <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">2</td>
                <td className="py-2 px-2 font-extrabold text-gray-600 border-r border-gray-200 text-[9.5px]">120.50 / 11.20</td>
                <td className="py-2 px-2 font-extrabold text-gray-600 border-r border-gray-200 text-[9.5px]">135.75 / 12.62</td>
                <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">₹ 1,20,500</td>
                <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">₹ 18,752</td>
                <td className="py-2 px-2 border-r border-gray-200 text-center"><span className="bg-[#ecfdf5] text-[#10b981] rounded px-2.5 py-0.5 text-[8.5px] font-extrabold border border-[#10b981]/20">Verified</span></td>
                <td className="py-2 px-2 text-green-600 font-extrabold border-r border-gray-200 text-[9.5px]">Yes</td>
                <td className="py-2 px-2 text-[#1e2b58] font-extrabold border-r border-gray-200 text-[9.5px]">Ground Floor</td>
                <td className="py-2 px-2 text-[#1e2b58] font-extrabold font-sans border-r border-gray-200 text-[9.5px]">व्यवसायिक</td>
                <td className="py-2 px-2 text-[#1e2b58] font-extrabold border-r border-gray-200 text-[9.5px]">Shop</td>
                <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">2</td>
                <td className="py-2 px-2 font-extrabold text-gray-600 border-r border-gray-200 text-[9.5px]">120.50 / 11.20</td>
                <td className="py-2 px-2 font-extrabold text-gray-600 border-r border-gray-200 text-[9.5px]">135.75 / 12.62</td>
                <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">₹ 1,20,500</td>
                <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">₹ 18,752</td>
                <td className="py-2 px-2 border-r border-gray-200 text-center"><span className="bg-[#ecfdf5] text-[#10b981] rounded px-2.5 py-0.5 text-[8.5px] font-extrabold border border-[#10b981]/20">Verified</span></td>
              </tr>
              <tr className="hover:bg-gray-50/50 border-b border-gray-200">
                <td className="py-2 px-2 text-gray-400 font-bold border-r border-gray-200 sticky left-0 bg-white z-10">3</td>
                <td className="py-2 px-2 text-green-600 font-extrabold border-r border-gray-200 text-[9.5px]">Yes</td>
                <td className="py-2 px-2 text-[#1e2b58] font-extrabold border-r border-gray-200 text-[9.5px]">First Floor</td>
                <td className="py-2 px-2 text-[#1e2b58] font-extrabold font-sans border-r border-gray-200 text-[9.5px]">निवासी</td>
                <td className="py-2 px-2 text-[#1e2b58] font-extrabold border-r border-gray-200 text-[9.5px]">Residential</td>
                <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">5</td>
                <td className="py-2 px-2 font-extrabold text-gray-600 border-r border-gray-200 text-[9.5px]">138.75 / 12.89</td>
                <td className="py-2 px-2 font-extrabold text-gray-600 border-r border-gray-200 text-[9.5px]">155.40 / 14.43</td>
                <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">₹ 1,38,750</td>
                <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">₹ 21,456</td>
                <td className="py-2 px-2 border-r border-gray-200 text-center"><span className="bg-[#ecfdf5] text-[#10b981] rounded px-2.5 py-0.5 text-[8.5px] font-extrabold border border-[#10b981]/20">Verified</span></td>
                <td className="py-2 px-2 text-green-600 font-extrabold border-r border-gray-200 text-[9.5px]">Yes</td>
                <td className="py-2 px-2 text-[#1e2b58] font-extrabold border-r border-gray-200 text-[9.5px]">First Floor</td>
                <td className="py-2 px-2 text-[#1e2b58] font-extrabold font-sans border-r border-gray-200 text-[9.5px]">निवासी</td>
                <td className="py-2 px-2 text-[#1e2b58] font-extrabold border-r border-gray-200 text-[9.5px]">Residential</td>
                <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">5</td>
                <td className="py-2 px-2 font-extrabold text-gray-600 border-r border-gray-200 text-[9.5px]">138.75 / 12.89</td>
                <td className="py-2 px-2 font-extrabold text-gray-600 border-r border-gray-200 text-[9.5px]">155.40 / 14.43</td>
                <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">₹ 1,38,750</td>
                <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">₹ 21,456</td>
                <td className="py-2 px-2 border-r border-gray-200 text-center"><span className="bg-[#ecfdf5] text-[#10b981] rounded px-2.5 py-0.5 text-[8.5px] font-extrabold border border-[#10b981]/20">Verified</span></td>
              </tr>
              <tr className="hover:bg-gray-50/50 border-b border-gray-200">
                <td className="py-2 px-2 text-gray-400 font-bold border-r border-gray-200 sticky left-0 bg-white z-10">4</td>
                <td className="py-2 px-2 text-green-600 font-extrabold border-r border-gray-200 text-[9.5px]">Yes</td>
                <td className="py-2 px-2 text-[#1e2b58] font-extrabold border-r border-gray-200 text-[9.5px]">Second Floor</td>
                <td className="py-2 px-2 text-[#1e2b58] font-extrabold font-sans border-r border-gray-200 text-[9.5px]">निवासी</td>
                <td className="py-2 px-2 text-[#1e2b58] font-extrabold border-r border-gray-200 text-[9.5px]">Residential</td>
                <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">5</td>
                <td className="py-2 px-2 font-extrabold text-gray-600 border-r border-gray-200 text-[9.5px]">138.75 / 12.89</td>
                <td className="py-2 px-2 font-extrabold text-gray-600 border-r border-gray-200 text-[9.5px]">155.40 / 14.43</td>
                <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">₹ 1,38,750</td>
                <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">₹ 21,456</td>
                <td className="py-2 px-2 border-r border-gray-200 text-center"><span className="bg-[#ecfdf5] text-[#10b981] rounded px-2.5 py-0.5 text-[8.5px] font-extrabold border border-[#10b981]/20">Verified</span></td>
                <td className="py-2 px-2 text-green-600 font-extrabold border-r border-gray-200 text-[9.5px]">Yes</td>
                <td className="py-2 px-2 text-[#1e2b58] font-extrabold border-r border-gray-200 text-[9.5px]">Second Floor</td>
                <td className="py-2 px-2 text-[#1e2b58] font-extrabold font-sans border-r border-gray-200 text-[9.5px]">निवासी</td>
                <td className="py-2 px-2 text-[#1e2b58] font-extrabold border-r border-gray-200 text-[9.5px]">Residential</td>
                <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">5</td>
                <td className="py-2 px-2 font-extrabold text-gray-600 border-r border-gray-200 text-[9.5px]">138.75 / 12.89</td>
                <td className="py-2 px-2 font-extrabold text-gray-600 border-r border-gray-200 text-[9.5px]">155.40 / 14.43</td>
                <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">₹ 1,38,750</td>
                <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">₹ 21,456</td>
                <td className="py-2 px-2 border-r border-gray-200 text-center"><span className="bg-[#ecfdf5] text-[#10b981] rounded px-2.5 py-0.5 text-[8.5px] font-extrabold border border-[#10b981]/20">Verified</span></td>
              </tr>
              <tr className="hover:bg-gray-50/50 border-b border-gray-200">
                <td className="py-2 px-2 text-gray-400 font-bold border-r border-gray-200 sticky left-0 bg-white z-10">5</td>
                <td className="py-2 px-2 text-green-600 font-extrabold border-r border-gray-200 text-[9.5px]">Yes</td>
                <td className="py-2 px-2 text-[#1e2b58] font-extrabold border-r border-gray-200 text-[9.5px]">Third Floor</td>
                <td className="py-2 px-2 text-[#1e2b58] font-extrabold font-sans border-r border-gray-200 text-[9.5px]">निवासी</td>
                <td className="py-2 px-2 text-[#1e2b58] font-extrabold border-r border-gray-200 text-[9.5px]">Residential</td>
                <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">5</td>
                <td className="py-2 px-2 font-extrabold text-gray-600 border-r border-gray-200 text-[9.5px]">138.75 / 12.89</td>
                <td className="py-2 px-2 font-extrabold text-gray-600 border-r border-gray-200 text-[9.5px]">155.40 / 14.43</td>
                <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">₹ 1,38,750</td>
                <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">₹ 21,456</td>
                <td className="py-2 px-2 border-r border-gray-200 text-center"><span className="bg-[#ecfdf5] text-[#10b981] rounded px-2.5 py-0.5 text-[8.5px] font-extrabold border border-[#10b981]/20">Verified</span></td>
                <td className="py-2 px-2 text-green-600 font-extrabold border-r border-gray-200 text-[9.5px]">Yes</td>
                <td className="py-2 px-2 text-[#1e2b58] font-extrabold border-r border-gray-200 text-[9.5px]">Third Floor</td>
                <td className="py-2 px-2 text-[#1e2b58] font-extrabold font-sans border-r border-gray-200 text-[9.5px]">निवासी</td>
                <td className="py-2 px-2 text-[#1e2b58] font-extrabold border-r border-gray-200 text-[9.5px]">Residential</td>
                <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">5</td>
                <td className="py-2 px-2 font-extrabold text-gray-600 border-r border-gray-200 text-[9.5px]">138.75 / 12.89</td>
                <td className="py-2 px-2 font-extrabold text-gray-600 border-r border-gray-200 text-[9.5px]">155.40 / 14.43</td>
                <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">₹ 1,38,750</td>
                <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">₹ 21,456</td>
                <td className="py-2 px-2 border-r border-gray-200 text-center"><span className="bg-[#ecfdf5] text-[#10b981] rounded px-2.5 py-0.5 text-[8.5px] font-extrabold border border-[#10b981]/20">Verified</span></td>
              </tr>
              <tr className="hover:bg-gray-50/50">
                <td className="py-2 px-2 text-gray-400 font-bold border-r border-gray-200 sticky left-0 bg-white z-10">6</td>
                <td className="py-2 px-2 text-green-600 font-extrabold border-r border-gray-200 text-[9.5px]">Yes</td>
                <td className="py-2 px-2 text-[#1e2b58] font-extrabold border-r border-gray-200 text-[9.5px]">Terrace Floor</td>
                <td className="py-2 px-2 text-[#1e2b58] font-extrabold font-sans border-r border-gray-200 text-[9.5px]">छत</td>
                <td className="py-2 px-2 text-[#1e2b58] font-extrabold border-r border-gray-200 text-[9.5px]">Terrace</td>
                <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">0</td>
                <td className="py-2 px-2 font-extrabold text-gray-600 border-r border-gray-200 text-[9.5px]">0.00 / 0.00</td>
                <td className="py-2 px-2 font-extrabold text-gray-600 border-r border-gray-200 text-[9.5px]">21.25 / 1.97</td>
                <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">₹ 21,250</td>
                <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">₹ 1,620</td>
                <td className="py-2 px-2 border-r border-gray-200 text-center"><span className="bg-[#ecfdf5] text-[#10b981] rounded px-2.5 py-0.5 text-[8.5px] font-extrabold border border-[#10b981]/20">Verified</span></td>
                <td className="py-2 px-2 text-green-600 font-extrabold border-r border-gray-200 text-[9.5px]">Yes</td>
                <td className="py-2 px-2 text-[#1e2b58] font-extrabold border-r border-gray-200 text-[9.5px]">Terrace Floor</td>
                <td className="py-2 px-2 text-[#1e2b58] font-extrabold font-sans border-r border-gray-200 text-[9.5px]">छत</td>
                <td className="py-2 px-2 text-[#1e2b58] font-extrabold border-r border-gray-200 text-[9.5px]">Terrace</td>
                <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">0</td>
                <td className="py-2 px-2 font-extrabold text-gray-600 border-r border-gray-200 text-[9.5px]">0.00 / 0.00</td>
                <td className="py-2 px-2 font-extrabold text-gray-600 border-r border-gray-200 text-[9.5px]">21.25 / 1.97</td>
                <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">₹ 21,250</td>
                <td className="py-2 px-2 font-extrabold text-[#1e2b58] border-r border-gray-200 text-[9.5px]">₹ 1,620</td>
                <td className="py-2 px-2 border-r border-gray-200 text-center"><span className="bg-[#ecfdf5] text-[#10b981] rounded px-2.5 py-0.5 text-[8.5px] font-extrabold border border-[#10b981]/20">Verified</span></td>
              </tr>
            </tbody>
          </table>
        )}
        {activeSubTab === 'capital' && (
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
        )}
        {activeSubTab === 'dual' && (
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
        )}
      </div>

      {showScrollControls && (
        <div className="flex flex-col gap-1 justify-center items-center shrink-0 w-8 border border-gray-200 rounded-lg bg-gray-50/50 p-1">
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={`w-6 h-6 flex items-center justify-center rounded-md border text-center transition-all cursor-pointer ${
              canScrollLeft
                ? 'bg-white text-[#002fbe] border-blue-200 hover:bg-blue-50 active:scale-95 shadow-sm'
                : 'bg-gray-100/50 text-gray-300 border-gray-200 cursor-not-allowed'
            }`}
            title="Scroll Left"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={`w-6 h-6 flex items-center justify-center rounded-md border text-center transition-all cursor-pointer ${
              canScrollRight
                ? 'bg-white text-[#002fbe] border-blue-200 hover:bg-blue-50 active:scale-95 shadow-sm'
                : 'bg-gray-100/50 text-gray-300 border-gray-200 cursor-not-allowed'
            }`}
            title="Scroll Right"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
