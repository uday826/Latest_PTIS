import React from 'react';
import { Wallet, Users, FileText, TrendingUp } from 'lucide-react';

export default function DashboardContent() {
  return (
    <div className="flex-1 overflow-y-auto no-scrollbar bg-gray-50/50 p-6 font-sans text-gray-800 animate-fadeIn">
      {/* Title */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#1e2b58]">TMC Property Tax Dashboard Overview</h2>
        <p className="text-xs text-gray-500 mt-1">Real-time statistics and administrative summary of Thane Municipal Corporation.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={<FileText className="text-blue-500" size={24} />} title="Total Properties" value="45,230" change="+4.2% from last year" />
        <StatCard icon={<Wallet className="text-green-500" size={24} />} title="Total Collection" value="₹12.45 Cr" change="88% of annual target" />
        <StatCard icon={<Users className="text-purple-500" size={24} />} title="Registered Taxpayers" value="38,910" change="+1.2k new this month" />
        <StatCard icon={<TrendingUp className="text-orange-500" size={24} />} title="Mutation Requests" value="302" change="92 pending review" />
      </div>

      {/* Mock Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Collection Trends Card */}
        <div className="bg-white border border-gray-150 rounded-xl p-5 shadow-sm">
          <h3 className="font-bold text-sm text-[#1e2b58] mb-4">Monthly Collection Trend (FY 2025-2026)</h3>
          <div className="h-64 flex items-end gap-3 pt-6 border-b border-gray-100 px-4 justify-between">
            <Bar height="h-24" month="Apr" val="₹1.2Cr" />
            <Bar height="h-32" month="May" val="₹1.8Cr" />
            <Bar height="h-44" month="Jun" val="₹2.5Cr" />
            <Bar height="h-56" month="Jul" val="₹3.1Cr" active />
            <Bar height="h-40" month="Aug" val="₹2.0Cr" />
            <Bar height="h-28" month="Sep" val="₹1.5Cr" />
          </div>
        </div>

        {/* Division Breakdown Card */}
        <div className="bg-white border border-gray-150 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-[#1e2b58] mb-4">Top Divisions by Property Count</h3>
            <div className="space-y-4">
              <ProgressLine label="घोडबंदर मानपाडा (Ghodbunder Manpada)" percent="82%" count="12,450 properties" color="bg-blue-600" />
              <ProgressLine label="कोपरी (Kopri)" percent="68%" count="9,210 properties" color="bg-green-600" />
              <ProgressLine label="वागळे इस्टेट (Wagle Estate)" percent="55%" count="7,540 properties" color="bg-purple-600" />
              <ProgressLine label="उथळसर (Uthalsar)" percent="40%" count="5,110 properties" color="bg-orange-600" />
            </div>
          </div>
          <div className="text-center pt-4 border-t border-gray-50 mt-4">
            <a href="#" className="text-blue-600 font-semibold text-xs hover:underline">View Detailed Division Report</a>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, change }: any) {
  return (
    <div className="bg-white border border-gray-150 rounded-xl p-5 shadow-sm flex items-start gap-4">
      <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">{icon}</div>
      <div>
        <div className="text-xs text-gray-500 font-semibold">{title}</div>
        <div className="text-2xl font-bold text-[#1e2b58] mt-1">{value}</div>
        <div className="text-[10px] text-gray-400 mt-1 font-medium">{change}</div>
      </div>
    </div>
  );
}

function Bar({ height, month, val, active }: any) {
  return (
    <div className="flex flex-col items-center flex-1 group">
      <div className="text-[9px] font-bold text-gray-500 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">{val}</div>
      <div className={`w-full max-w-[32px] rounded-t ${height} transition-all duration-300 ${active ? 'bg-blue-600' : 'bg-blue-200 group-hover:bg-blue-300'}`} />
      <div className="text-[10px] font-bold text-gray-500 mt-2">{month}</div>
    </div>
  );
}

function ProgressLine({ label, percent, count, color }: any) {
  return (
    <div className="space-y-1 text-xs">
      <div className="flex justify-between font-semibold text-gray-700">
        <span>{label}</span>
        <span className="text-gray-500">{count}</span>
      </div>
      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: percent }} />
      </div>
    </div>
  );
}
