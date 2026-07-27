import React from 'react';
import { 
  Home, 
  Search, 
  FileText, 
  ClipboardList, 
  CreditCard, 
  Building2, 
  FileEdit, 
  AlertTriangle,
  BarChart2,
  BookOpen,
  PieChart,
  Database,
  Settings,
  Shield,
  HelpCircle,
  Percent,
  Users,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
  activeMenu: string;
  setActiveMenu: (val: string) => void;
}

export default function Sidebar({ isCollapsed, setIsCollapsed, activeMenu, setActiveMenu }: SidebarProps) {
  
  // Helper to determine if menu item is active
  const itemClass = (menuSlug: string) => {
    const baseClass = `flex items-center gap-3 py-1.5 text-[11px] transition-colors cursor-pointer select-none mx-2 px-3 rounded`;
    const activeClass = `bg-[#2563eb] text-white font-semibold`;
    const inactiveClass = `hover:bg-white/5 text-gray-300`;
    const collapsedClass = isCollapsed ? 'justify-center px-0 mx-1' : '';
    
    return `${baseClass} ${collapsedClass} ${activeMenu === menuSlug ? activeClass : inactiveClass}`;
  };

  return (
    <aside 
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
      className={`bg-[#111a35] text-white flex flex-col h-full font-sans border-r border-[#1a233a] transition-all duration-300 shrink-0 relative z-30 ${isCollapsed ? 'w-16' : 'w-64'}`}
    >

      {/* Navigation list */}
      <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar text-gray-300 no-scrollbar">
        <ul className="space-y-0.5">
          <li>
            <div 
              onClick={() => setActiveMenu('dashboard')} 
              className={itemClass('dashboard')} 
              title="Dashboard"
            >
              <Home size={16} />
              {!isCollapsed && <span>Dashboard</span>}
            </div>
          </li>

          {!isCollapsed ? (
            <li className="pt-4 pb-2 px-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              PROPERTY MANAGEMENT
            </li>
          ) : (
            <div className="h-px bg-[#1a233a] my-3" />
          )}

          <li>
            <div 
              onClick={() => setActiveMenu('property-search')} 
              className={itemClass('property-search')} 
              title="Property Search"
            >
              <Search size={16} />
              {!isCollapsed && <span>Property Search</span>}
              {!isCollapsed && <span className="ml-auto bg-[#2563eb] text-[10px] font-semibold px-2.5 py-0.5 rounded-full text-white">25</span>}
            </div>
          </li>
          <li>
            <div 
              onClick={() => setActiveMenu('property-details')} 
              className={itemClass('property-details')} 
              title="Property Details"
            >
              <FileText size={16} />
              {!isCollapsed && <span>Property Details</span>}
            </div>
          </li>
          <li>
            <div 
              onClick={() => setActiveMenu('assessment')} 
              className={itemClass('assessment')} 
              title="Assessment"
            >
              <ClipboardList size={16} />
              {!isCollapsed && <span>Assessment</span>}
              {!isCollapsed && <span className="ml-auto bg-[#2563eb] text-[10px] font-semibold px-2.5 py-0.5 rounded-full text-white">6</span>}
            </div>
          </li>
          <li>
            <div 
              onClick={() => setActiveMenu('billing-collection')} 
              className={itemClass('billing-collection')} 
              title="Billing & Collection"
            >
              <CreditCard size={16} />
              {!isCollapsed && <span>Billing & Collection</span>}
              {!isCollapsed && <span className="ml-auto bg-[#2563eb] text-[10px] font-semibold px-2.5 py-0.5 rounded-full text-white">12</span>}
            </div>
          </li>
          <li>
            <div 
              onClick={() => setActiveMenu('apartment-management')} 
              className={itemClass('apartment-management')} 
              title="Apartment Management"
            >
              <Building2 size={16} />
              {!isCollapsed && <span>Apartment Management</span>}
            </div>
          </li>
          <li>
            <div 
              onClick={() => setActiveMenu('mutation')} 
              className={itemClass('mutation')} 
              title="Mutation"
            >
              <FileEdit size={16} />
              {!isCollapsed && <span>Mutation</span>}
              {!isCollapsed && <span className="ml-auto bg-[#2563eb] text-[10px] font-semibold px-2.5 py-0.5 rounded-full text-white">3</span>}
            </div>
          </li>
          <li>
            <div 
              onClick={() => setActiveMenu('defaulter-management')} 
              className={itemClass('defaulter-management')} 
              title="Defaulter Management"
            >
              <AlertTriangle size={16} />
              {!isCollapsed && <span>Defaulter Management</span>}
              {!isCollapsed && <span className="ml-auto bg-[#2563eb] text-[10px] font-semibold px-2.5 py-0.5 rounded-full text-white">18</span>}
            </div>
          </li>

          {!isCollapsed ? (
            <li className="pt-4 pb-2 px-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              REPORTS & MIS
            </li>
          ) : (
            <div className="h-px bg-[#1a233a] my-3" />
          )}

          <li>
            <div 
              onClick={() => setActiveMenu('reports')} 
              className={itemClass('reports')} 
              title="Reports"
            >
              <BarChart2 size={16} />
              {!isCollapsed && <span>Reports</span>}
            </div>
          </li>
          <li>
            <div 
              onClick={() => setActiveMenu('collection-register')} 
              className={itemClass('collection-register')} 
              title="Collection Register"
            >
              <BookOpen size={16} />
              {!isCollapsed && <span>Collection Register</span>}
            </div>
          </li>
          <li>
            <div 
              onClick={() => setActiveMenu('demand-register')} 
              className={itemClass('demand-register')} 
              title="Demand Register"
            >
              <ClipboardList size={16} />
              {!isCollapsed && <span>Demand Register</span>}
              {!isCollapsed && <span className="ml-auto bg-[#2563eb] text-[10px] font-semibold px-2.5 py-0.5 rounded-full text-white">12</span>}
            </div>
          </li>
          <li>
            <div 
              onClick={() => setActiveMenu('mis-dashboard')} 
              className={itemClass('mis-dashboard')} 
              title="MIS Dashboard"
            >
              <PieChart size={16} />
              {!isCollapsed && <span>MIS Dashboard</span>}
            </div>
          </li>

          {!isCollapsed ? (
            <li className="pt-4 pb-2 px-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              MASTER DATA
            </li>
          ) : (
            <div className="h-px bg-[#1a233a] my-3" />
          )}

          <li>
            <div 
              onClick={() => setActiveMenu('master-data')} 
              className={itemClass('master-data')} 
              title="Master Data"
            >
              <Database size={16} />
              {!isCollapsed && <span>Master Data</span>}
            </div>
          </li>
          <li>
            <div 
              onClick={() => setActiveMenu('rate-master')} 
              className={itemClass('rate-master')} 
              title="Rate Master"
            >
              <Percent size={16} />
              {!isCollapsed && <span>Rate Master</span>}
            </div>
          </li>
          <li>
            <div 
              onClick={() => setActiveMenu('tax-heads')} 
              className={itemClass('tax-heads')} 
              title="Tax Heads"
            >
              <Shield size={16} />
              {!isCollapsed && <span>Tax Heads</span>}
            </div>
          </li>
          <li>
            <div 
              onClick={() => setActiveMenu('user-management')} 
              className={itemClass('user-management')} 
              title="User Management"
            >
              <Users size={16} />
              {!isCollapsed && <span>User Management</span>}
            </div>
          </li>

          {!isCollapsed ? (
            <li className="pt-4 pb-2 px-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              SYSTEM
            </li>
          ) : (
            <div className="h-px bg-[#1a233a] my-3" />
          )}

          <li>
            <div 
              onClick={() => setActiveMenu('system-settings')} 
              className={itemClass('system-settings')} 
              title="System Settings"
            >
              <Settings size={16} />
              {!isCollapsed && <span>System Settings</span>}
            </div>
          </li>
          <li>
            <div 
              onClick={() => setActiveMenu('audit-trail')} 
              className={itemClass('audit-trail')} 
              title="Audit Trail"
            >
              <FileText size={16} />
              {!isCollapsed && <span>Audit Trail</span>}
            </div>
          </li>
          <li>
            <div 
              onClick={() => setActiveMenu('help-support')} 
              className={itemClass('help-support')} 
              title="Help & Support"
            >
              <HelpCircle size={16} />
              {!isCollapsed && <span>Help & Support</span>}
            </div>
          </li>
        </ul>
      </nav>

      {/* Version Info */}
      <div className="p-4 border-t border-[#1a233a] shrink-0 bg-[#0c1226]">
        <div className="flex items-center gap-2 text-xs text-gray-400 justify-center">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          {!isCollapsed && <span className="font-semibold text-[11px]">Version 2.5.0</span>}
        </div>
      </div>
    </aside>
  );
}
