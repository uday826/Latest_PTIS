"use client";

import React, { useState } from 'react';
import Sidebar from '@/components/modules/Design/Sidebar';
import Topbar from '@/components/modules/Design/Topbar';
import MainContent from '@/components/modules/Design/MainContent';
import DashboardContent from '@/components/modules/Design/DashboardContent';
import SearchContent from '@/components/modules/Design/SearchContent';
import PlaceholderContent from '@/components/modules/Design/PlaceholderContent';
import FooterActionBar from '@/components/modules/Design/FooterActionBar';
import ApartmentContent from '@/components/modules/Apartment_design/ApartmentContent';
import ActionViews from '@/components/modules/Design/ActionViews';

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
        {activeAction ? (
          <div className="flex-1 min-h-0 flex flex-col p-2.5 gap-2 overflow-hidden bg-[#f0f2f5]">
            <div className="flex-grow flex-1 min-h-0 bg-white border border-gray-200 rounded-xl p-3.5 shadow-md overflow-hidden relative select-none">
              <ActionViews activeAction={activeAction} setActiveAction={setActiveAction} />
            </div>
            <div className="shrink-0 select-none">
              <FooterActionBar activeAction={activeAction} setActiveAction={setActiveAction} />
            </div>
          </div>
        ) : (
          <div className="flex-1 min-h-0 flex flex-col p-2.5 gap-2 overflow-hidden">
            <div className="flex-1 min-h-0">
              {activeMenu === 'property-details' && (
                <MainContent 
                  activeAction={activeAction} 
                  setActiveAction={setActiveAction} 
                  activeValuationModel={activeValuationModel} 
                />
              )}
              {activeMenu === 'apartment-management' && (
                <ApartmentContent 
                  activeAction={activeAction} 
                  setActiveAction={setActiveAction} 
                />
              )}
              {activeMenu === 'dashboard' && (
                <DashboardContent 
                  activeAction={activeAction} 
                  setActiveAction={setActiveAction} 
                />
              )}
              {activeMenu === 'property-search' && (
                <SearchContent 
                  activeAction={activeAction} 
                  setActiveAction={setActiveAction} 
                />
              )}
              {!['property-details', 'dashboard', 'property-search', 'apartment-management'].includes(activeMenu) && (
                <PlaceholderContent 
                  title={activeMenu} 
                  activeAction={activeAction} 
                  setActiveAction={setActiveAction} 
                />
              )}
            </div>
            <div className="shrink-0 select-none">
              <FooterActionBar activeAction={activeAction} setActiveAction={setActiveAction} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
