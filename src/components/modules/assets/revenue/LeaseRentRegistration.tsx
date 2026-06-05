'use client';

import { useState, useMemo } from 'react';
import { FileText, Eye, CheckCircle, Search, Calendar as CalendarIcon } from 'lucide-react';
import { LeaseRentStats } from './LeaseRentStats';
import { LeaseRentFilters } from './LeaseRentFilters';
import { LeaseRentTable } from './LeaseRentTable';
import { LeaseRentVerificationTable } from './LeaseRentVerificationTable';
import { LeaseRentApprovalTable } from './LeaseRentApprovalTable';
import { NewLeaseRegistrationModal } from './NewLeaseRegistrationModal';
import { RegistrationHistoryModal } from './RegistrationHistoryModal';
import { VerificationLeaseModal } from './VerificationLeaseModal';
import { ApprovalLeaseModal } from './ApprovalLeaseModal';
import { RejectRegistrationModal } from './RejectRegistrationModal';
import { mockLeaseRecords, LeaseRentRecord } from './mockData';

export function LeaseRentRegistration() {
  const [activeTab, setActiveTab] = useState<'registration' | 'verification' | 'approval'>('registration');
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('Shopping Complex');
  const [zone, setZone] = useState('all');
  const [ward, setWard] = useState('all');
  const [assetSelect, setAssetSelect] = useState('all');
  
  // State for the Modals
  const [selectedRecordForRegistration, setSelectedRecordForRegistration] = useState<LeaseRentRecord | null>(null);
  const [selectedRecordForHistory, setSelectedRecordForHistory] = useState<LeaseRentRecord | null>(null);
  const [selectedRecordForVerification, setSelectedRecordForVerification] = useState<any | null>(null);
  const [selectedRecordForApproval, setSelectedRecordForApproval] = useState<any | null>(null);
  const [selectedRecordForRejection, setSelectedRecordForRejection] = useState<any | null>(null);

  const filteredRecords = useMemo(() => {
    return mockLeaseRecords.filter((r) => {
      const matchesSearch =
        r.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.assetId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesAsset = assetSelect === 'all' || r.assetId === assetSelect;
      return matchesSearch && matchesAsset;
    });
  }, [searchQuery, assetSelect]);

  const handleAction = (record: LeaseRentRecord) => {
    setSelectedRecordForRegistration(record);
  };

  const handleHistory = (record: LeaseRentRecord) => {
    setSelectedRecordForHistory(record);
  };

  const tabs = [
    { id: 'registration' as const, label: 'Registration', icon: FileText, badge: null, badgeColor: '' },
    { id: 'verification' as const, label: 'Verification', icon: Eye, badge: '10', badgeColor: 'bg-blue-100 text-blue-600 border-blue-200' },
    { id: 'approval' as const, label: 'Approval', icon: CheckCircle, badge: '4', badgeColor: 'bg-amber-100 text-amber-600 border-amber-200' },
  ];

  return (
    <>
      <div className="space-y-5 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        {/* ── HEADER ── */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              Lease & Rent Registration
            </h1>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">
              Manage tenant details, lease agreements & rental properties
            </p>
          </div>

          {/* Capsule Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-50 border border-slate-200/60 rounded-xl shadow-inner">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-slate-800 shadow-sm border border-slate-200/50'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                  }`}
                >
                  <tab.icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  {tab.label}
                  {tab.badge && (
                    <span className={`px-1.5 py-0.5 rounded-full border text-[8px] font-black ${tab.badgeColor}`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── TOP KPI STATS ── */}
        <LeaseRentStats />

        {/* ── FILTERS BAR ── */}
        {activeTab === 'registration' ? (
          <LeaseRentFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            category={category}
            setCategory={setCategory}
            zone={zone}
            setZone={setZone}
            ward={ward}
            setWard={setWard}
            assetSelect={assetSelect}
            setAssetSelect={setAssetSelect}
          />
        ) : (
          <div className="flex flex-col md:flex-row items-end gap-4 bg-slate-50 border border-slate-200/60 p-4 rounded-2xl">
            <div className="space-y-1.5 min-w-[150px]">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Asset Category</label>
              <select className="w-full h-9 px-3 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500 transition-colors">
                <option>All Categories</option>
                <option>Shopping Complex</option>
                <option>Plot / Land</option>
              </select>
            </div>
            
            <div className="space-y-1.5 flex-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Smart Search</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-3.5 w-3.5 text-slate-400" />
                </span>
                <input
                  type="text"
                  placeholder="Search across all fields..."
                  className="w-full h-9 pl-9 pr-3 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500 placeholder:font-normal placeholder:text-slate-400 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5 w-[140px]">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">From Date</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="mm/dd/yyyy"
                  className="w-full h-9 px-3 pr-8 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500 placeholder:font-normal placeholder:text-slate-400"
                />
                <CalendarIcon className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5 w-[140px]">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">To Date</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="mm/dd/yyyy"
                  className="w-full h-9 px-3 pr-8 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500 placeholder:font-normal placeholder:text-slate-400"
                />
                <CalendarIcon className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <button className="h-9 px-6 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer whitespace-nowrap">
              <Search className="w-3.5 h-3.5" />
              Search
            </button>
          </div>
        )}

        {/* ── MAIN TABBED VIEWS ── */}
        <div className="pt-2">
          {activeTab === 'registration' && (
            <LeaseRentTable
              records={filteredRecords}
              onActionClick={handleAction}
              onHistoryClick={handleHistory}
            />
          )}

          {activeTab === 'verification' && (
            <LeaseRentVerificationTable 
              onActionClick={(record) => setSelectedRecordForVerification(record)}
            />
          )}

          {activeTab === 'approval' && (
            <LeaseRentApprovalTable 
              onActionClick={(record) => setSelectedRecordForApproval(record)}
              onRejectClick={(record) => setSelectedRecordForRejection(record)}
            />
          )}
        </div>
      </div>

      {/* ── MODALS ── */}
      {selectedRecordForRegistration && (
        <NewLeaseRegistrationModal 
          record={selectedRecordForRegistration} 
          onClose={() => setSelectedRecordForRegistration(null)} 
        />
      )}
      
      {selectedRecordForHistory && (
        <RegistrationHistoryModal 
          record={selectedRecordForHistory} 
          onClose={() => setSelectedRecordForHistory(null)} 
        />
      )}
      
      {selectedRecordForVerification && (
        <VerificationLeaseModal 
          record={selectedRecordForVerification}
          onClose={() => setSelectedRecordForVerification(null)}
        />
      )}

      {selectedRecordForApproval && (
        <ApprovalLeaseModal 
          record={selectedRecordForApproval}
          onClose={() => setSelectedRecordForApproval(null)}
        />
      )}

      {selectedRecordForRejection && (
        <RejectRegistrationModal 
          record={selectedRecordForRejection}
          onClose={() => setSelectedRecordForRejection(null)}
        />
      )}
    </>
  );
}
export default LeaseRentRegistration;
