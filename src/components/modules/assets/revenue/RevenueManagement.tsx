'use client';

import { useState } from 'react';
import { LayoutDashboard, Users, CreditCard, PlusCircle, IndianRupee, ArrowLeft } from 'lucide-react';
import { RevenueDashboardCards } from './RevenueDashboardCards';
import { RenterList } from './RenterList';
import { RenterDetailsForm } from './RenterDetailsForm';
import { PaymentSection } from './payment/PaymentSection';

type ActiveTab = 'dashboard' | 'renters' | 'payment';

export function RevenueManagement() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  const tabs = [
    { id: 'dashboard' as const, label: 'Analytics Dashboard', icon: LayoutDashboard, color: 'text-violet-500 bg-violet-50 border-violet-200' },
    { id: 'renters' as const, label: 'Active Renter Directory', icon: Users, color: 'text-emerald-500 bg-emerald-50 border-emerald-200' },
    { id: 'payment' as const, label: 'Municipal Payment Desk', icon: CreditCard, color: 'text-pink-500 bg-pink-50 border-pink-200' },
  ];

  return (
    <div className="space-y-4">
      {/* ── HEADER NAVIGATION ── */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 blur-[4px] opacity-40 animate-pulse" />
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-700 flex items-center justify-center shadow-lg">
              <IndianRupee className="w-5 h-5 text-white drop-shadow" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-slate-800 leading-tight tracking-tight">Revenue Management</h1>
              <span className="px-1.5 py-0.5 rounded-full bg-violet-100 border border-violet-300 text-[8px] font-bold text-violet-700 tracking-wide uppercase">MC-REVENUE</span>
            </div>
            <p className="text-[10px] mt-0.5 flex items-center gap-1 font-medium text-slate-400">
              <span className="text-violet-600 font-bold">महसूल व्यवस्थापन</span>
              <span className="w-0.5 h-0.5 rounded-full bg-slate-300 inline-block" />
              <span>Real-time Dues Monitoring, Payments Clearing, & Lease Persistence</span>
            </p>
          </div>
        </div>

        {/* Action Button */}
        {activeTab === 'renters' && (
          <button
            onClick={() => setShowRegisterForm(!showRegisterForm)}
            className="w-full md:w-auto px-4 py-2 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {showRegisterForm ? (
              <>
                <ArrowLeft className="w-4 h-4" /> Back to Directory
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" /> Register New Tenant
              </>
            )}
          </button>
        )}
      </div>

      {/* ── TABS BAR ── */}
      <div className="bg-slate-100/60 border border-slate-200/60 rounded-xl p-1 flex items-center gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setShowRegisterForm(false);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-white text-slate-800 shadow-sm border border-slate-200/50'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-violet-600' : 'text-slate-400'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── TAB CONTENT RESOLUTION ── */}
      <div className="transition-all duration-300">
        {activeTab === 'dashboard' && <RevenueDashboardCards />}
        
        {activeTab === 'renters' && (
          showRegisterForm ? (
            <RenterDetailsForm
              onSuccess={() => setShowRegisterForm(false)}
              onCancel={() => setShowRegisterForm(false)}
            />
          ) : (
            <RenterList />
          )
        )}
        
        {activeTab === 'payment' && <PaymentSection />}
      </div>
    </div>
  );
}
