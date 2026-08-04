"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Bell, ChevronDown, MessageSquare, SlidersHorizontal } from 'lucide-react';
import { RedBellDropdown, GreenBellDropdown, ProfileDropdown, SearchFilterDropdown } from './TopbarDropdowns';

interface TopbarProps {
  activeValuationModel: 'rv' | 'cvm' | 'dual';
  setActiveValuationModel: (model: 'rv' | 'cvm' | 'dual') => void;
  role: 'surveyor' | 'qc' | 'final';
  setRole: (role: 'surveyor' | 'qc' | 'final') => void;
}

export default function Topbar({ activeValuationModel, setActiveValuationModel, role, setRole }: TopbarProps) {
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
              style={{
                backgroundColor: activeValuationModel === 'rv' ? '#e1b942' : 'transparent',
                color: activeValuationModel === 'rv' ? '#1e2b58' : '#e5e7eb',
              }}
              className="px-3.5 py-1 text-[11px] lg:text-xs font-bold rounded-full transition-all duration-250 outline-none cursor-pointer whitespace-nowrap shadow-xs"
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
              style={{
                backgroundColor: activeValuationModel === 'cvm' ? '#e1b942' : 'transparent',
                color: activeValuationModel === 'cvm' ? '#1e2b58' : '#e5e7eb',
              }}
              className="px-3.5 py-1 text-[11px] lg:text-xs font-bold rounded-full transition-all duration-250 outline-none cursor-pointer whitespace-nowrap shadow-xs"
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
              style={{
                backgroundColor: activeValuationModel === 'dual' ? '#e1b942' : 'transparent',
                color: activeValuationModel === 'dual' ? '#1e2b58' : '#e5e7eb',
              }}
              className="px-3.5 py-1 text-[11px] lg:text-xs font-bold rounded-full transition-all duration-250 outline-none cursor-pointer whitespace-nowrap shadow-xs"
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
          
          {/* Search Bar & Filter - Enlarged for better visibility */}
          <div className="flex-grow lg:flex-grow-0 max-w-md lg:max-w-[380px] xl:max-w-[480px] flex items-center gap-2 relative">
            <div className="relative flex items-center flex-1 bg-white rounded-md text-gray-800 overflow-hidden shadow-inner border border-gray-200">
              <input
                type="text"
                placeholder="Search Property No., Owner, Mobile, UPIC..."
                className="w-full py-2 pl-4 pr-8 text-xs outline-none placeholder-gray-400 font-semibold bg-transparent"
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
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
                <SearchFilterDropdown 
                  tempFilters={tempFilters} 
                  setTempFilters={setTempFilters} 
                  clearFilters={clearFilters} 
                  applyFilters={applyFilters} 
                />
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
              {activeDropdown === 'redBell' && <RedBellDropdown />}
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
              {activeDropdown === 'greenBell' && <GreenBellDropdown />}
            </div>

            {/* Role Switcher Selector */}
            <div className="flex items-center gap-2 bg-[#172246] px-3 py-1.5 rounded-lg border border-white/10 select-none shadow-inner shrink-0">
              <span className="text-[9px] font-extrabold text-[#e1b942] uppercase tracking-wider">Access:</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="bg-transparent text-white font-bold text-[10.5px] outline-none cursor-pointer border-none pr-1 focus:ring-0"
              >
                <option value="surveyor" className="bg-[#1e2b58] text-white font-semibold">Surveyor View</option>
                <option value="qc" className="bg-[#1e2b58] text-white font-semibold">QC Auditor View</option>
                <option value="final" className="bg-[#1e2b58] text-white font-semibold">Final Approver</option>
              </select>
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
              {activeDropdown === 'profile' && <ProfileDropdown />}
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
