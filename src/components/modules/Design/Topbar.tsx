"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, Bell, User, Settings, LogOut, Shield, ChevronDown, MessageSquare, SlidersHorizontal } from 'lucide-react';

interface TopbarProps {
  activeValuationModel: 'rv' | 'cvm' | 'dual';
  setActiveValuationModel: (model: 'rv' | 'cvm' | 'dual') => void;
}

export default function Topbar({ activeValuationModel, setActiveValuationModel }: TopbarProps) {
  const [activeDropdown, setActiveDropdown] = useState<'redBell' | 'greenBell' | 'profile' | null>(null);
  const [activeTooltip, setActiveTooltip] = useState<'rv' | 'cvm' | 'dual' | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [appliedFiltersCount, setAppliedFiltersCount] = useState(0);

  const [tempFilters, setTempFilters] = useState({
    searchBy: 'Property No.',
    zone: 'All Zones',
    ward: 'All Wards',
    status: 'All Statuses'
  });

  const [appliedFilters, setAppliedFilters] = useState({
    searchBy: 'Property No.',
    zone: 'All Zones',
    ward: 'All Wards',
    status: 'All Statuses'
  });

  const containerRef = useRef<HTMLElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  const tooltips = {
    rv: {
      title: "Rateable Value (RV)",
      desc: "Based on rateable or rental value. Shows current RV assessment values. Used for RV-based tax calculation."
    },
    cvm: {
      title: "Capital Value Method (CVM)",
      desc: "Based on estimated capital value. Shows CV-based assessment values. Used for capital-value tax calculation."
    },
    dual: {
      title: "Dual Method View",
      desc: "Displays RV and CVM together. Allows users to compare both valuation methods. Highlights differences in assessment and tax values."
    }
  };

  // Close dropdowns & popups when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
        setIsFilterOpen(false);
      }
    }
    
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setActiveDropdown(null);
        setIsFilterOpen(false);
        setActiveTooltip(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Keyboard navigation for valuation tabs (Arrow keys)
  const handleTabsKeyDown = (e: React.KeyboardEvent) => {
    const tabList = ['rv', 'cvm', 'dual'] as const;
    const currentIndex = tabList.indexOf(activeValuationModel);
    
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % tabList.length;
      setActiveValuationModel(tabList[nextIndex]);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + tabList.length) % tabList.length;
      setActiveValuationModel(tabList[prevIndex]);
    }
  };

  const toggleDropdown = (type: 'redBell' | 'greenBell' | 'profile') => {
    setActiveDropdown(activeDropdown === type ? null : type);
  };

  const applyFilters = () => {
    setAppliedFilters({ ...tempFilters });
    
    // Count active filters (non-default ones)
    let count = 0;
    if (tempFilters.searchBy !== 'Property No.') count++;
    if (tempFilters.zone !== 'All Zones') count++;
    if (tempFilters.ward !== 'All Wards') count++;
    if (tempFilters.status !== 'All Statuses') count++;
    
    setAppliedFiltersCount(count);
    setIsFilterOpen(false);
  };

  const clearFilters = () => {
    const defaults = {
      searchBy: 'Property No.',
      zone: 'All Zones',
      ward: 'All Wards',
      status: 'All Statuses'
    };
    setTempFilters(defaults);
    setAppliedFilters(defaults);
    setAppliedFiltersCount(0);
    setIsFilterOpen(false);
  };

  return (
    <header ref={containerRef} className="bg-[#1e2b58] text-white font-sans shrink-0 z-50 shadow-md relative transition-all duration-300 px-4 lg:px-6 py-2.5 lg:py-0 h-auto lg:h-16 flex flex-col justify-center">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-6 w-full">
        
        {/* Left: TMC Logo and Brand */}
        <div className="flex items-center justify-between w-full lg:w-auto gap-3 shrink-0">
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
          
          {/* Mobile-only Valuation Dropdown Selector */}
          <div className="block sm:hidden shrink-0">
            <select
              value={activeValuationModel}
              onChange={(e) => setActiveValuationModel(e.target.value as any)}
              className="bg-[#172246] text-[#e1b942] font-bold text-xs rounded-md border border-white/20 px-2 py-1.5 outline-none cursor-pointer"
            >
              <option value="rv">RV Mode</option>
              <option value="cvm">CVM Mode</option>
              <option value="dual">Dual View</option>
            </select>
          </div>
        </div>

        {/* Center: Valuation Selector (Desktop / Tablet view) */}
        <div className="hidden sm:flex items-center gap-2 lg:mx-auto select-none shrink-0 relative">
          <span className="text-[10px] lg:text-[11px] text-gray-300 font-bold uppercase tracking-wider">Valuation Model:</span>
          <div 
            ref={tabsRef}
            role="tablist"
            onKeyDown={handleTabsKeyDown}
            className="flex items-center gap-1 bg-[#172246] p-1 rounded-full border border-white/10"
          >
            <button
              role="tab"
              tabIndex={activeValuationModel === 'rv' ? 0 : -1}
              aria-selected={activeValuationModel === 'rv'}
              onClick={() => setActiveValuationModel('rv')}
              onMouseEnter={() => setActiveTooltip('rv')}
              onMouseLeave={() => setActiveTooltip(null)}
              className={`px-3 py-1 text-[11px] lg:text-xs font-semibold rounded-full transition-all duration-200 outline-none cursor-pointer whitespace-nowrap ${
                activeValuationModel === 'rv'
                  ? 'bg-[#e1b942] text-[#1e2b58] shadow-md font-bold'
                  : 'text-gray-200 hover:bg-white/5 hover:text-white'
              }`}
            >
              Rateable Value (RV)
            </button>
            <button
              role="tab"
              tabIndex={activeValuationModel === 'cvm' ? 0 : -1}
              aria-selected={activeValuationModel === 'cvm'}
              onClick={() => setActiveValuationModel('cvm')}
              onMouseEnter={() => setActiveTooltip('cvm')}
              onMouseLeave={() => setActiveTooltip(null)}
              className={`px-3 py-1 text-[11px] lg:text-xs font-semibold rounded-full transition-all duration-200 outline-none cursor-pointer whitespace-nowrap ${
                activeValuationModel === 'cvm'
                  ? 'bg-[#e1b942] text-[#1e2b58] shadow-md font-bold'
                  : 'text-gray-200 hover:bg-white/5 hover:text-white'
              }`}
            >
              Capital Value Method (CVM)
            </button>
            <button
              role="tab"
              tabIndex={activeValuationModel === 'dual' ? 0 : -1}
              aria-selected={activeValuationModel === 'dual'}
              onClick={() => setActiveValuationModel('dual')}
              onMouseEnter={() => setActiveTooltip('dual')}
              onMouseLeave={() => setActiveTooltip(null)}
              className={`px-3 py-1 text-[11px] lg:text-xs font-semibold rounded-full transition-all duration-200 outline-none cursor-pointer whitespace-nowrap ${
                activeValuationModel === 'dual'
                  ? 'bg-[#e1b942] text-[#1e2b58] shadow-md font-bold'
                  : 'text-gray-200 hover:bg-white/5 hover:text-white'
              }`}
            >
              Dual Method View (RV + CVM)
            </button>
          </div>

          {/* Interactive Information Tooltip */}
          {activeTooltip && (
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-white rounded-lg shadow-xl border border-blue-100 p-2.5 z-55 text-gray-800 animate-fadeIn pointer-events-none">
              <h4 className="font-bold text-xs text-[#002fbe] mb-1">{tooltips[activeTooltip].title}</h4>
              <p className="text-[10px] text-gray-500 font-medium leading-normal">{tooltips[activeTooltip].desc}</p>
            </div>
          )}
        </div>

        {/* Right Side: Search and Actions */}
        <div className="flex items-center justify-between lg:justify-end gap-4 lg:gap-6 w-full lg:w-auto">
          
          {/* Search Bar & Filter */}
          <div className="flex-grow lg:flex-grow-0 max-w-md lg:max-w-[280px] xl:max-w-md flex items-center gap-2 relative">
            <div className="relative flex items-center flex-1 bg-white rounded-md text-gray-800 overflow-hidden shadow-inner border border-gray-200">
              <input
                type="text"
                placeholder="Search Property No., Owner, Mobile, UPIC..."
                className="w-full py-1.5 pl-3 pr-8 text-xs outline-none placeholder-gray-400 font-medium bg-transparent"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <ChevronDown size={14} />
              </div>
            </div>

            {/* Filter Toggle Button */}
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                aria-expanded={isFilterOpen}
                aria-haspopup="true"
                className={`p-1.5 border rounded-md flex items-center justify-center cursor-pointer shrink-0 shadow-sm w-8 h-8 transition-all relative ${
                  isFilterOpen || appliedFiltersCount > 0
                    ? 'bg-[#e1b942] text-[#1e2b58] border-[#e1b942]'
                    : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <SlidersHorizontal size={14} className={`transition-transform duration-200 ${isFilterOpen ? 'rotate-90' : ''}`} />
                {appliedFiltersCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white font-bold text-[8px] w-3.5 h-3.5 flex items-center justify-center rounded-full">
                    {appliedFiltersCount}
                  </span>
                )}
              </button>

              {/* Search Filter Dropdown Panel */}
              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-blue-100 p-3.5 z-55 text-gray-800 animate-fadeIn">
                  <div className="text-[11px] text-[#002fbe] font-bold uppercase tracking-wider mb-2 border-b border-gray-100 pb-1.5">
                    SEARCH FILTERS
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Search By</label>
                      <select 
                        value={tempFilters.searchBy}
                        onChange={(e) => setTempFilters({ ...tempFilters, searchBy: e.target.value })}
                        className="w-full text-xs bg-gray-50 border border-gray-200 rounded px-2 py-1.5 outline-none font-medium text-gray-700"
                      >
                        <option>Property No.</option>
                        <option>UPIC</option>
                        <option>Owner Name</option>
                        <option>Mobile Number</option>
                        <option>Ward</option>
                        <option>Zone</option>
                        <option>Survey No.</option>
                        <option>Plot No.</option>
                        <option>Property Status</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Zone</label>
                        <select 
                          value={tempFilters.zone}
                          onChange={(e) => setTempFilters({ ...tempFilters, zone: e.target.value })}
                          className="w-full text-xs bg-gray-50 border border-gray-200 rounded px-1.5 py-1.5 outline-none font-medium text-gray-700"
                        >
                          <option>All Zones</option>
                          <option>Zone 1</option>
                          <option>Zone 2</option>
                          <option>Zone 3</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Ward</label>
                        <select 
                          value={tempFilters.ward}
                          onChange={(e) => setTempFilters({ ...tempFilters, ward: e.target.value })}
                          className="w-full text-xs bg-gray-50 border border-gray-200 rounded px-1.5 py-1.5 outline-none font-medium text-gray-700"
                        >
                          <option>All Wards</option>
                          <option>Ward 1</option>
                          <option>Ward 2</option>
                          <option>Ward 3</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Status</label>
                      <select 
                        value={tempFilters.status}
                        onChange={(e) => setTempFilters({ ...tempFilters, status: e.target.value })}
                        className="w-full text-xs bg-gray-50 border border-gray-200 rounded px-2 py-1.5 outline-none font-medium text-gray-700"
                      >
                        <option>All Statuses</option>
                        <option>Completed</option>
                        <option>In Progress</option>
                        <option>Pending</option>
                      </select>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-gray-55">
                      <button 
                        onClick={clearFilters}
                        className="text-[10px] text-red-500 font-bold hover:underline cursor-pointer"
                      >
                        Clear
                      </button>
                      <button 
                        onClick={applyFilters}
                        className="bg-[#002fbe] text-white text-[10px] font-bold px-3 py-1 rounded hover:bg-[#00259b] cursor-pointer shadow-xs"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-4 relative shrink-0">
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
