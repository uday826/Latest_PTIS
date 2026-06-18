'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent } from '@/components/common/Card';
import { Tabs } from '@/components/common/Tabs';
import { Select, Option } from '@/components/common/select';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';

import { DashboardLayout } from '../DashboardLayout';
import { DashboardFilters } from '../DashboardFilter';

import {
  LayoutDashboard,
  MapPin,
  Building2,
  Home,
  Car,
  ChevronRight,
  ArrowLeft,
  Filter,
  Download,
  MoreVertical,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

// Types
interface Asset {
  srNo: number;
  assetId: string;
  assetName: string;
  zone: string;
  ward: string;
  leaseType: 'Rent' | 'Lease';
  tenant: string;
  status: 'Paid' | 'Unpaid';
  rent: number;
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  count: number;
  assets: Asset[];
}

// Mock Data based on images
const categoriesData: Category[] = [
  {
    id: 'all',
    name: 'All Categories',
    description: '29 assets',
    icon: LayoutDashboard,
    count: 29,
    assets: [
      { srNo: 1, assetId: 'MPMS-DS-25', assetName: 'मोहितोष झेरॉक्स', zone: 'A - पूर्व', ward: 'प्रभाग क्र. 12', leaseType: 'Rent', tenant: 'ज्योती संजय महागावकर', status: 'Unpaid', rent: 13212 },
      { srNo: 2, assetId: 'MPMS-DS-27', assetName: 'वक्रतुंड गावरान चहा', zone: 'A - पूर्व', ward: 'प्रभाग क्र. 12', leaseType: 'Rent', tenant: 'निर्मलकुमार मुरलीधर आयदासवाणी', status: 'Unpaid', rent: 11180 },
      { srNo: 3, assetId: 'MPMS-DS-62', assetName: 'श्री विद्या हरीश व्यवसायालय म संद्राज भूमि प्रतिष्ठाता', zone: 'A - पूर्व', ward: 'प्रभाग क्र. 12', leaseType: 'Rent', tenant: 'सौ रितू दर्शन खंडेलवाल व संदेश सूरज खंडेलवाल', status: 'Unpaid', rent: 8785 },
      { srNo: 4, assetId: 'MPMS-DS-63', assetName: 'वर्षाँ स्वरुप संकीर्णशिक्षा', zone: 'A - पूर्व', ward: 'प्रभाग क्र. 12', leaseType: 'Rent', tenant: 'वर्षाँ स्वरुप खांडेराववाल', status: 'Paid', rent: 8785 },
      { srNo: 5, assetId: 'MPMS-AS-9', assetName: 'युगंधर डिझाईन सेटर', zone: 'B - पश्चिम', ward: 'प्रभाग क्र. 23', leaseType: 'Rent', tenant: 'श्री दतात्रय रोठसे', status: 'Paid', rent: 2500 },
      // ... more assets
    ]
  },
  {
    id: 'plot-land',
    name: 'Plot/Land Revenue',
    description: 'Maidans, grounds, event spaces',
    icon: MapPin,
    count: 12,
    assets: [
      { srNo: 1, assetId: 'MPMS-PL-001', assetName: 'गांधी मैदान - क्रीडा प्रशिक्षण केंद्र', zone: 'A - पूर्व', ward: 'प्रभाग क्र. 5', leaseType: 'Lease', tenant: 'अकोला जिल्हा क्रीडा संघ', status: 'Paid', rent: 75000 },
      { srNo: 2, assetId: 'MPMS-PL-002', assetName: 'गांधी मैदान - सांस्कृतिक कार्यक्रम मैदान', zone: 'A - पूर्व', ward: 'प्रभाग क्र. 5', leaseType: 'Lease', tenant: 'महाराष्ट्र संस्कृती मंडळ', status: 'Paid', rent: 120000 },
      { srNo: 3, assetId: 'MPMS-PL-003', assetName: 'गांधी मैदान - अन्न स्टॉल क्षेत्र', zone: 'A - पूर्व', ward: 'प्रभाग क्र. 5', leaseType: 'Rent', tenant: 'क्लिक बाइट्स फूड सर्विसेस', status: 'Unpaid', rent: 35000 },
      { srNo: 4, assetId: 'MPMS-PL-004', assetName: 'गांधी मैदान - पार्किंग क्षेत्र', zone: 'A - पूर्व', ward: 'प्रभाग क्र. 5', leaseType: 'Rent', tenant: 'सेफ पार्क सोल्यूशन्स प्रा. लि.', status: 'Paid', rent: 45000 },
      { srNo: 5, assetId: 'MPMS-PL-005', assetName: 'शिवाजी मैदान - क्रिकेट सराव मैदान', zone: 'B - पश्चिम', ward: 'प्रभाग क्र. 18', leaseType: 'Lease', tenant: 'अकोला क्रिकेट अकादमी', status: 'Paid', rent: 65000 },
    ]
  },
  {
    id: 'shopping',
    name: 'Shopping Complex',
    description: 'Shops, stores, market stalls',
    icon: Building2,
    count: 13,
    assets: []
  },
  {
    id: 'quarters',
    name: 'Municipal Quarters',
    description: 'Municipal quarters, lodging facilities',
    icon: Home,
    count: 3,
    assets: [
      { srNo: 1, assetId: 'MPMS-QTR-001', assetName: 'म.क.कल्याण मंडळ ब्लॉक A क्वार्टर', zone: 'A - पूर्व', ward: 'प्रभाग क्र. 15', leaseType: 'Rent', tenant: 'श्री. प्रमोद नाईक (प्रादेशिक अधिकारी)', status: 'Paid', rent: 8000 },
      { srNo: 2, assetId: 'MPMS-QTR-002', assetName: 'म.क.कल्याण मंडळ ब्लॉक B क्वार्टर', zone: 'A - पूर्व', ward: 'प्रभाग क्र. 15', leaseType: 'Rent', tenant: 'सौ. मीरा कुलकर्णी (वरिष्ठ लिपिक)', status: 'Paid', rent: 7000 },
      { srNo: 3, assetId: 'MPMS-QTR-003', assetName: 'म.क.कल्याण मंडळ ब्लॉक C क्वार्टर', zone: 'A - पूर्व', ward: 'प्रभाग क्र. 15', leaseType: 'Rent', tenant: 'श्री. संतोष पवार (कर निरीक्षक)', status: 'Paid', rent: 8500 },
    ]
  },
  {
    id: 'parking',
    name: 'Parking Revenue',
    description: 'Parking lots, vehicle facilities',
    icon: Car,
    count: 1,
    assets: [
      { srNo: 1, assetId: 'MPMS-PK-001', assetName: 'शिवajiनगर पार्किंग', zone: 'D - दक्षिण', ward: 'प्रभाग क्र. 29', leaseType: 'Rent', tenant: 'सेफ पार्क सोल्यूशन्स', status: 'Unpaid', rent: 55000 },
    ]
  }
];

// Helper functions
const formatCurrency = (amount: number): string => {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)} L`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
};

const formatCurrencyFull = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

// Components
const SidebarItem: React.FC<{
  category: Category;
  isActive: boolean;
  onClick: () => void;
}> = ({ category, isActive, onClick }) => {
  const Icon = category.icon;

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left',
        isActive
          ? 'bg-blue-600 text-white shadow-md'
          : 'text-gray-700 hover:bg-gray-100'
      )}
    >
      <Icon className={cn('w-5 h-5', isActive ? 'text-white' : 'text-gray-500')} />
      <div className="flex-1 min-w-0">
        <div className={cn('text-sm font-medium truncate', isActive ? 'text-white' : 'text-gray-900')}>
          {category.name}
        </div>
        <div className={cn('text-xs truncate', isActive ? 'text-blue-100' : 'text-gray-500')}>
          {category.description}
        </div>
      </div>
      <span className={cn(
        'text-xs font-semibold px-2 py-1 rounded-full',
        isActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
      )}>
        {category.count}
      </span>
    </button>
  );
};

const SummaryCard: React.FC<{
  title: string;
  value: string | number;
  subtitle?: string;
  variant: 'default' | 'success' | 'purple' | 'warning';
  icon?: React.ElementType;
}> = ({ title, value, subtitle, variant, icon: Icon }) => {
  const variants = {
    default: 'bg-blue-50 border-blue-100',
    success: 'bg-green-50 border-green-100',
    purple: 'bg-purple-50 border-purple-100',
    warning: 'bg-orange-50 border-orange-100',
  };

  const textVariants = {
    default: 'text-blue-900',
    success: 'text-green-900',
    purple: 'text-purple-900',
    warning: 'text-orange-900',
  };

  const labelVariants = {
    default: 'text-blue-700',
    success: 'text-green-700',
    purple: 'text-purple-700',
    warning: 'text-orange-700',
  };

  return (
    <Card variant="default" padding="md" className={cn('border-l-4', variants[variant])}>
      <CardContent className="p-0">
        <div className="flex items-start justify-between">
          <div>
            <p className={cn('text-sm font-medium mb-1', labelVariants[variant])}>{title}</p>
            <p className={cn('text-2xl font-bold', textVariants[variant])}>{value}</p>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          </div>
          {Icon && <Icon className={cn('w-5 h-5', labelVariants[variant])} />}
        </div>
      </CardContent>
    </Card>
  );
};

const StatusBadge: React.FC<{ status: 'Paid' | 'Unpaid' }> = ({ status }) => {
  const isPaid = status === 'Paid';
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      isPaid
        ? 'bg-green-100 text-green-800'
        : 'bg-red-100 text-red-800'
    )}>
      {status}
    </span>
  );
};

const LeaseTypeBadge: React.FC<{ type: 'Rent' | 'Lease' }> = ({ type }) => {
  const isLease = type === 'Lease';
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      isLease
        ? 'bg-purple-100 text-purple-800'
        : 'bg-blue-100 text-blue-800'
    )}>
      {type}
    </span>
  );
};

export default function RevenueAssetRecordsView() {

  const router = useRouter();
  const pathname = usePathname();

  const [selectedZone, setSelectedZone] = useState('all');
  const [selectedWard, setSelectedWard] = useState('all');

  const zonesList = ['all', 'Zone 1', 'Zone 2', 'Zone 3'];
  const wardsList = ['all', 'Ward 1', 'Ward 2', 'Ward 3'];

  const [activeCategory, setActiveCategory] = useState('all');

  const searchParams = useSearchParams();

  useEffect(() => {
    const category = searchParams.get('category');

    if (
      category &&
      categoriesData.some((item) => item.id === category)
    ) {
      setActiveCategory(category);
    } else {
      setActiveCategory('all');
    }
  }, [searchParams]);

  const [filters, setFilters] = useState({
    zone: 'All',
    ward: 'All',
    type: 'All',
    status: 'All',
  });

  const activeCategoryData = useMemo(() =>
    categoriesData.find(c => c.id === activeCategory) || categoriesData[0],
    [activeCategory]);

  // Calculate summary stats
  const stats = useMemo(() => {
    const assets = activeCategoryData.assets;
    const total = assets.length;
    const demand = assets.reduce((sum, asset) => sum + asset.rent, 0);
    const collected = assets
      .filter(asset => asset.status === 'Paid')
      .reduce((sum, asset) => sum + asset.rent, 0);
    const pending = assets.filter(asset => asset.status === 'Unpaid').length;

    return { total, demand, collected, pending };
  }, [activeCategoryData]);

  // Filter options
  const zoneOptions: Option[] = [
    { label: 'All', value: 'All' },
    { label: 'A - पूर्व', value: 'A' },
    { label: 'B - पश्चिम', value: 'B' },
    { label: 'C - उत्तर', value: 'C' },
    { label: 'D - दक्षिण', value: 'D' },
  ];

  const wardOptions: Option[] = [
    { label: 'All', value: 'All' },
    { label: 'प्रभाग क्र. 5', value: '5' },
    { label: 'प्रभाग क्र. 12', value: '12' },
    { label: 'प्रभाग क्र. 15', value: '15' },
    { label: 'प्रभाग क्र. 18', value: '18' },
    { label: 'प्रभाग क्र. 23', value: '23' },
  ];

  const typeOptions: Option[] = [
    { label: 'All', value: 'All' },
    { label: 'Rent', value: 'Rent' },
    { label: 'Lease', value: 'Lease' },
  ];

  const statusOptions: Option[] = [
    { label: 'All', value: 'All' },
    { label: 'Paid', value: 'Paid' },
    { label: 'Unpaid', value: 'Unpaid' },
  ];

  // Filtered assets
  const filteredAssets = useMemo(() => {
    return activeCategoryData.assets.filter(asset => {
      if (filters.zone !== 'All' && !asset.zone.includes(filters.zone)) return false;
      if (filters.ward !== 'All' && !asset.ward.includes(filters.ward)) return false;
      if (filters.type !== 'All' && asset.leaseType !== filters.type) return false;
      if (filters.status !== 'All' && asset.status !== filters.status) return false;
      return true;
    });
  }, [activeCategoryData.assets, filters]);

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);

    router.replace(
      `${pathname}?category=${categoryId}`,
      { scroll: false }
    );
  };

  return (
    <DashboardLayout
      filters={
        <DashboardFilters
          zonesList={zonesList}
          wardsList={wardsList}
          activeZone={selectedZone}
          activeWard={selectedWard}
          onZoneChange={setSelectedZone}
          onWardChange={setSelectedWard}
          allZonesLabel="All Zones"
          allWardsLabel="All Wards"
          filtersLabel="Filters"
        />
      }
    >
      <div className="bg-gray-50 flex rounded-xl overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 bg-white border-r border-gray-200 flex-shrink-0 hidden lg:block">
          <div className="p-6">
            <button
              onClick={() =>
                router.back()
              }
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Total Leased Assets</h2>
              <p className="text-sm text-gray-500">Asset Categories</p>
            </div>

            <nav className="space-y-2">
              {categoriesData.map((category) => (
                <SidebarItem
                  key={category.id}
                  category={category}
                  isActive={activeCategory === category.id}
                  onClick={() => handleCategoryChange(category.id)}
                />
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{activeCategoryData.name}</h1>
                <p className="text-sm text-gray-500 mt-1">
                  View all assets in {activeCategoryData.name}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-500">
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Filters:</span>
              </div>
              <div className="flex-1 grid grid-cols-4 gap-4 max-w-3xl">
                <Select
                  label=""
                  options={zoneOptions}
                  value={filters.zone}
                  onChange={(e) => setFilters({ ...filters, zone: e.target.value })}
                  selectSize="sm"
                />
                <Select
                  label=""
                  options={wardOptions}
                  value={filters.ward}
                  onChange={(e) => setFilters({ ...filters, ward: e.target.value })}
                  selectSize="sm"
                />
                <Select
                  label=""
                  options={typeOptions}
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  selectSize="sm"
                />
                <Select
                  label=""
                  options={statusOptions}
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  selectSize="sm"
                />
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 p-6 overflow-auto">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <SummaryCard
                title="Total"
                value={stats.total}
                variant="default"
              />
              <SummaryCard
                title="Demand"
                value={formatCurrency(stats.demand)}
                variant="success"
              />
              <SummaryCard
                title="Collected"
                value={formatCurrency(stats.collected)}
                variant="purple"
              />
              <SummaryCard
                title="Pending"
                value={stats.pending}
                variant="warning"
              />
            </div>

            {/* Table */}
            <Card variant="default" padding="none">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sr. No
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Asset ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Asset Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Zone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ward
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Lease Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tenant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rent
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAssets.length > 0 ? (
                      filteredAssets.map((asset) => (
                        <tr key={asset.assetId} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {asset.srNo}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                            {asset.assetId}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {asset.assetName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {asset.zone}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {asset.ward}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <LeaseTypeBadge type={asset.leaseType} />
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {asset.tenant}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={asset.status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                            {formatCurrencyFull(asset.rent)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                          <div className="flex flex-col items-center gap-2">
                            <Search className="w-8 h-8 text-gray-400" />
                            <p>No assets found matching your filters</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Pagination */}
            {filteredAssets.length > 0 && (
              <div className="mt-4 flex items-center justify-between px-6 py-3 bg-white border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-500">
                  Showing <span className="font-medium">{filteredAssets.length}</span> of{' '}
                  <span className="font-medium">{activeCategoryData.assets.length}</span> assets
                </p>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50" disabled>
                    Previous
                  </button>
                  <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50" disabled>
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </DashboardLayout >
  );
}