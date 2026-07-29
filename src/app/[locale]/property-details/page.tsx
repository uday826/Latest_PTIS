"use client";

import React, { useState } from 'react';
import Sidebar from '@/components/modules/Design/Sidebar';
import Topbar from '@/components/modules/Design/Topbar';
import MainContent from '@/components/modules/Design/MainContent';
import DashboardContent from '@/components/modules/Design/DashboardContent';
import SearchContent from '@/components/modules/Design/SearchContent';
import PlaceholderContent from '@/components/modules/Design/PlaceholderContent';
import FooterActionBar from '@/components/modules/Design/FooterActionBar';

export default function PropertyDetailsPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState('property-details');
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [activeValuationModel, setActiveValuationModel] = useState<'rv' | 'cvm' | 'dual'>('rv');

  return (
    <div className="flex flex-col h-screen bg-[#f0f2f5] overflow-hidden font-sans">
      {/* Topbar at the top, full-width */}
      <Topbar activeValuationModel={activeValuationModel} setActiveValuationModel={setActiveValuationModel} />

      {/* Sidebar + MainContent below */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
        />
        {activeMenu === 'property-details' && (
          <div className="flex-1 min-h-0 flex flex-col p-2.5 gap-2 overflow-hidden">
            <div className="flex-1 min-h-0">
              <MainContent 
                activeAction={activeAction} 
                setActiveAction={setActiveAction} 
                activeValuationModel={activeValuationModel} 
              />
            </div>
            <div className="shrink-0 select-none">
              <FooterActionBar activeAction={activeAction} setActiveAction={setActiveAction} />
            </div>
          </div>
        )}
        {activeMenu === 'dashboard' && <DashboardContent />}
        {activeMenu === 'property-search' && <SearchContent />}
        {!['property-details', 'dashboard', 'property-search'].includes(activeMenu) && (
          <PlaceholderContent title={activeMenu} />
        )}
      </div>
    </div>
  );
}
