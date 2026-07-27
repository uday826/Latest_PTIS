"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, Bell, User, Settings, LogOut, Shield, ChevronDown, MessageSquare, SlidersHorizontal } from 'lucide-react';

export default function Topbar() {
  const [activeDropdown, setActiveDropdown] = useState<'redBell' | 'greenBell' | 'profile' | null>(null);
  const containerRef = useRef<HTMLElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (type: 'redBell' | 'greenBell' | 'profile') => {
    setActiveDropdown(activeDropdown === type ? null : type);
  };

  return (
    <header ref={containerRef} className="h-16 bg-[#1e2b58] flex items-center justify-between px-6 text-white font-sans shrink-0 z-50 shadow-md relative">
      
      {/* Left: TMC Logo and Brand */}
      <div className="flex items-center gap-3">
        {/* TMC Logo */}
        <div className="w-10 h-10 bg-white rounded-full overflow-hidden flex items-center justify-center shrink-0 shadow-md">
          <img src="/tmc_logo.jpg" alt="TMC Logo" className="w-9 h-9 object-contain" />
        </div>
        <div>
          <h1 className="text-sm md:text-base font-bold leading-none tracking-wide text-white">Thane Municipal Corporation</h1>
          <p className="text-[10px] text-gray-200 mt-1">Property Tax Department | <span className="text-[#e1b942] font-bold">PTIS</span></p>
        </div>
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 max-w-xl ml-auto mr-16 flex items-center gap-2.5">
        <div className="relative flex items-center flex-1 bg-white rounded-md text-gray-800 overflow-hidden shadow-inner border border-gray-200">
          <input 
            type="text" 
            placeholder="Search Property No., Owner, Mobile, UPIC..."
            className="w-full py-2 pl-4 pr-10 text-xs outline-none placeholder-gray-400 font-medium bg-transparent"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <ChevronDown size={14} />
          </div>
        </div>
        <button className="p-2 bg-white text-[#1e2b58] border border-gray-200 rounded-md hover:bg-gray-50 flex items-center justify-center cursor-pointer shrink-0 shadow-sm w-9 h-9">
          <SlidersHorizontal size={15} className="text-gray-500" />
        </button>
      </div>

      {/* Right Side Icons */}
      <div className="flex items-center gap-6 relative">
        
        {/* Red Notification Icon */}
        <div className="relative">
          <div 
            onClick={() => toggleDropdown('redBell')}
            className="relative cursor-pointer text-gray-200 hover:text-white transition-colors p-1"
          >
            <Bell size={18} />
            <span className="absolute -top-0.5 -right-0.5 bg-[#e11d48] text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
              12
            </span>
          </div>
          
          {/* Red Bell Dropdown */}
          {activeDropdown === 'redBell' && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50 text-gray-800 animate-fadeIn">
              <div className="px-4 py-1.5 border-b border-gray-100 font-bold text-xs text-red-600 flex justify-between items-center">
                <span>CRITICAL ALERTS</span>
                <span className="bg-red-50 text-[9px] px-1.5 py-0.5 rounded font-normal">12 New</span>
              </div>
              <div className="max-h-60 overflow-y-auto text-[11px] divide-y divide-gray-55">
                <DropdownItem title="Fire NOC Expired" desc="Survey No. CSNO05A requires immediate renewal." time="10 mins ago" isAlert />
                <DropdownItem title="Tax Penalty Overdue" desc="Interest is accruing on outstanding amount of ₹12,450." time="1 hour ago" isAlert />
                <DropdownItem title="AI Inspector Warning" desc="Area difference found for UPIC-270465-2024." time="3 hours ago" isAlert />
              </div>
              <div className="px-4 pt-2 border-t border-gray-100 text-center">
                <a href="#" className="text-blue-600 font-bold text-[10px] hover:underline">View All Alerts</a>
              </div>
            </div>
          )}
        </div>
        
        {/* Green Notification Icon */}
        <div className="relative">
          <div 
            onClick={() => toggleDropdown('greenBell')}
            className="relative cursor-pointer text-gray-200 hover:text-white transition-colors p-1"
          >
            <MessageSquare size={18} />
            <span className="absolute -top-0.5 -right-0.5 bg-[#10b981] text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
              3
            </span>
          </div>

          {/* Green Bell Dropdown */}
          {activeDropdown === 'greenBell' && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50 text-gray-800 animate-fadeIn">
              <div className="px-4 py-1.5 border-b border-gray-100 font-bold text-xs text-green-700 flex justify-between items-center">
                <span>NOTICES & UPDATES</span>
                <span className="bg-green-50 text-[9px] px-1.5 py-0.5 rounded font-normal">3 New</span>
              </div>
              <div className="max-h-60 overflow-y-auto text-[11px] divide-y divide-gray-55">
                <DropdownItem title="GIS Verification Approved" desc="Property UPIC-270465-2024-000123 has been verified." time="2 hours ago" />
                <DropdownItem title="Early Payment Discount Active" desc="Pay within 10 days to get 5% rebate." time="1 day ago" />
                <DropdownItem title="KYC Verification Complete" desc="Aadhaar and Mobile successfully linked." time="2 days ago" />
              </div>
              <div className="px-4 pt-2 border-t border-gray-100 text-center">
                <a href="#" className="text-blue-600 font-bold text-[10px] hover:underline">View All Notices</a>
              </div>
            </div>
          )}
        </div>

        {/* Profile User Button */}
        <div className="relative">
          <div 
            onClick={() => toggleDropdown('profile')}
            className="flex items-center gap-3 pl-4 border-l border-white/15 cursor-pointer select-none group"
          >
            <div className="text-right">
              <div className="text-xs font-semibold text-white group-hover:text-gray-200 transition-colors">admin scipl</div>
              <div className="text-[9px] text-gray-200 font-medium mt-0.5">ID: TH001-2026</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#ef4444] flex items-center justify-center text-white font-bold text-xs shadow-md border border-white/10 group-hover:brightness-95 transition-all">
              A
            </div>
          </div>

          {/* Profile Dropdown */}
          {activeDropdown === 'profile' && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50 text-gray-800 animate-fadeIn">
              <div className="px-4 py-2 border-b border-gray-100 text-xs">
                <p className="font-bold text-gray-900">admin scipl</p>
                <p className="text-[10px] text-gray-500 font-medium">admin@thane.gov.in</p>
              </div>
              
              <a href="#" className="flex items-center gap-2.5 px-4 py-2 text-xs hover:bg-gray-50 text-gray-700 transition-colors">
                <User size={14} className="text-gray-400" />
                <span>My Profile</span>
              </a>
              <a href="#" className="flex items-center gap-2.5 px-4 py-2 text-xs hover:bg-gray-50 text-gray-700 transition-colors">
                <Settings size={14} className="text-gray-400" />
                <span>Account Settings</span>
              </a>
              <a href="#" className="flex items-center gap-2.5 px-4 py-2 text-xs hover:bg-gray-50 text-gray-700 transition-colors">
                <Shield size={14} className="text-gray-400" />
                <span>Security Settings</span>
              </a>
              
              <div className="border-t border-gray-100 my-1"></div>
              
              <button className="flex items-center gap-2.5 w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors font-semibold cursor-pointer">
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}

// Sub-component for notification item
function DropdownItem({ title, desc, time, isAlert }: { title: string; desc: string; time: string; isAlert?: boolean }) {
  return (
    <div className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors">
      <div className="flex justify-between items-start gap-2 mb-0.5">
        <span className={`font-semibold ${isAlert ? 'text-red-700' : 'text-gray-800'}`}>{title}</span>
        <span className="text-[9px] text-gray-400 whitespace-nowrap">{time}</span>
      </div>
      <p className="text-gray-500 leading-normal">{desc}</p>
    </div>
  );
}
