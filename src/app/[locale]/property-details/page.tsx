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
import { SurveyorActionView, QcActionView, FinalActionView } from '@/components/modules/Design/UserActionViews';

export default function PropertyDetailsPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState('property-details');
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [activeValuationModel, setActiveValuationModel] = useState<'rv' | 'cvm' | 'dual'>('rv');
  const [role, setRole] = useState<'surveyor' | 'qc' | 'final'>('surveyor');

  return (
    <div className="flex flex-col h-screen bg-[#f0f2f5] overflow-hidden font-sans">
      {/* Topbar at the top, full-width */}
      <Topbar 
        activeValuationModel={activeValuationModel} 
        setActiveValuationModel={setActiveValuationModel} 
        role={role} 
        setRole={(newRole) => {
          setRole(newRole);
          setActiveMenu('user-action-view');
        }} 
      />

      {/* Sidebar + MainContent below */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
        />
        {activeAction ? (
          <div className="flex-1 min-h-0 flex flex-col p-1 gap-1 overflow-hidden bg-[#f0f2f5]">
            <div className="flex-grow flex-1 min-h-0 bg-white border border-gray-200 rounded-xl p-3.5 shadow-md overflow-hidden relative select-none">
              <ActionViews activeAction={activeAction} setActiveAction={setActiveAction} />
            </div>
            <div className="shrink-0 select-none">
              <FooterActionBar activeAction={activeAction} setActiveAction={setActiveAction} />
            </div>
          </div>
        ) : (
          <div className="flex-1 min-h-0 flex flex-col p-1 gap-1 overflow-hidden">
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
                  role={role}
                />
              )}
              {activeMenu === 'dashboard' && (
                <DashboardContent 
                  activeAction={activeAction} 
                  setActiveAction={setActiveAction} 
                  role={role}
                />
              )}
              {activeMenu === 'property-search' && (
                <SearchContent />
              )}
              {activeMenu === 'user-action-view' && (
                <div className="flex-1 min-h-0 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md flex flex-col h-full">
                  {role === 'surveyor' && <SurveyorActionView />}
                  {role === 'qc' && <QcActionView />}
                  {role === 'final' && <FinalActionView />}
                </div>
              )}
              {!['property-details', 'dashboard', 'property-search', 'apartment-management', 'user-action-view'].includes(activeMenu) && (
                <PlaceholderContent 
                  title={activeMenu} 
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
