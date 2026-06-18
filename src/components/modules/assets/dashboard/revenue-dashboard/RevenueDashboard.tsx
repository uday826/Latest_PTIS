'use client';

import {
  Building2,
  IndianRupee,
  TrendingUp,
  MapPin,
  ShoppingBag,
  Home,
  Car,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/common/Card';
import { DashboardLayout } from '../DashboardLayout';
import { DashboardFilters } from '../DashboardFilter';
import { useState } from 'react';
import ZoneWiseDemandCollection from './ZoneWiseDemandCollection';
import MonthlyRevenueTrendScreen from './MonthlyRevenueTrend';
import { useRouter } from 'next/navigation';

/* -------------------------------------------------------------------------- */
/* Mock Data                                                                   */
/* -------------------------------------------------------------------------- */

const summaryData = {
  leasedAssets: 29,
  totalDemand: '₹11.20 L',
  totalCollection: '₹8.76 L',
  collectionRate: '78.2%',
};

const categoryData = [
  {
    id: 'plot-land',
    title: 'Plot/Land Revenue',
    icon: MapPin,
    count: 12,
    demand: '₹9.3L',
    collected: '₹7.8L',
    lease: 7,
    rent: 5,
    paid: 9,
    unpaid: 3,
    border: 'border-emerald-200',
    bg: 'bg-emerald-50',
    iconBg: 'bg-emerald-500',
  },
  {
    id: 'shopping',
    title: 'Shopping Complex',
    icon: ShoppingBag,
    count: 3,
    demand: '₹0.7L',
    collected: '₹0.3L',
    lease: 0,
    rent: 13,
    paid: 8,
    unpaid: 5,
    border: 'border-blue-200',
    bg: 'bg-blue-50',
    iconBg: 'bg-blue-500',
  },
  {
    id: 'quarters',
    title: 'Municipal Quarters',
    icon: Home,
    count: 3,
    demand: '₹0.2L',
    collected: '₹0.2L',
    lease: 0,
    rent: 3,
    paid: 3,
    unpaid: 0,
    border: 'border-purple-200',
    bg: 'bg-purple-50',
    iconBg: 'bg-fuchsia-500',
  },
  {
    id: 'parking',
    title: 'Parking Revenue',
    icon: Car,
    count: 1,
    demand: '₹0.6L',
    collected: '₹0.0L',
    lease: 0,
    rent: 1,
    paid: 0,
    unpaid: 1,
    border: 'border-orange-200',
    bg: 'bg-orange-50',
    iconBg: 'bg-orange-500',
  },
];


function SummaryCard({
  icon: Icon,
  value,
  title,
  subtitle,
  className,
}: {
  icon: React.ElementType;
  value: string | number;
  title: string;
  subtitle: string;
  className?: string;
}) {
  return (
    <Card
      padding="sm"
      className={`h-full ${className}`}
    >
      <CardContent className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon className="w-7 h-7" />
          <span className="text-2xl font-bold">{value}</span>
        </div>

        <div className="text-right">
          <p className="font-semibold text-xs text-slate-700">{title}</p>
          <p className="text-[11px] text-slate-500">{subtitle}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function RevenueCategoryCard({
  item,
  onClick,
}: {
  item: (typeof categoryData)[0];
  onClick?: () => void;
}) {
  const Icon = item.icon;

  return (
    <Card
      padding="sm"
      onClick={onClick}
      className={`${item.border} ${item.bg} cursor-pointer hover:shadow-md hover:scale-[1.01] transition-all duration-200`}
    >
      <CardContent>
        <div className="flex justify-between">
          <div className="flex gap-3">
            <div
              className={`w-9 h-9 rounded-xl ${item.iconBg} flex items-center justify-center`}
            >
              <Icon className="w-5 h-5 text-white" />
            </div>

            <div>
              <p className="font-medium text-sm text-slate-800">
                {item.title}
              </p>

              <p className="text-2xl font-bold mt-1 text-slate-900">
                {item.count}
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs font-medium text-slate-600">
              Demand
            </p>

            <p className="text-sm font-semibold text-slate-900">
              {item.demand}
            </p>

            <p className="text-sm font-semibold mt-1 text-slate-900">
              Collected
            </p>

            <p className="text-sm font-semibold text-green-700">
              {item.collected}
            </p>
          </div>
        </div>

        <div className="mt-4 border-t border-slate-200 pt-3 flex flex-wrap gap-4 text-xs font-medium text-slate-700">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            Lease {item.lease}
          </span>

          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            Rent {item.rent}
          </span>

          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            Paid {item.paid}
          </span>

          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            Unpaid {item.unpaid}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export function RevenueAssetDashboard() {

  const router = useRouter();

  const [selectedZone, setSelectedZone] = useState('all');
  const [selectedWard, setSelectedWard] = useState('all');

  const zonesList = ['all', 'Zone 1', 'Zone 2', 'Zone 3'];
  const wardsList = ['all', 'Ward 1', 'Ward 2', 'Ward 3'];

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
      <div className="space-y-4">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Revenue Management Dashboard
          </h1>

          <p className="text-sm text-blue-600 mt-1">
            Asset Distribution & Revenue Overview - 2025
          </p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <SummaryCard
            icon={Building2}
            value={summaryData.leasedAssets}
            title="Total Leased Assets"
            subtitle="Properties under lease/rent"
            className="bg-blue-50 border-blue-200 text-blue-700"
          />

          <SummaryCard
            icon={IndianRupee}
            value={summaryData.totalDemand}
            title="Total Demand"
            subtitle="Monthly revenue target"
            className="bg-emerald-50 border-emerald-200 text-emerald-700"
          />

          <SummaryCard
            icon={TrendingUp}
            value={summaryData.totalCollection}
            title="Total Collection"
            subtitle={`${summaryData.collectionRate} collection rate`}
            className="bg-purple-50 border-purple-200 text-purple-700"
          />
        </div>

        {/* Distribution */}
        <Card className="border-emerald-200">
          <CardHeader>
            <CardTitle className="text-xl">
              Asset Distribution by Category
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-4 gap-4">
              {categoryData.map((item) => (
                <RevenueCategoryCard
                  key={item.id}
                  item={item}
                  onClick={() =>
                    router.push(
                      `/assets/dashboard/revenue-dashboard/revenue-records?category=${item.id}`
                    )
                  }
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Charts Section - Monthly Trend and Zone-wise */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Monthly Revenue Collection Trend */}
          <Card>
            <CardContent className="p-0">
              <MonthlyRevenueTrendScreen />
            </CardContent>
          </Card>

          {/* Zone-wise Demand & Collection */}
          <Card>
            <CardContent className="p-0">
              <ZoneWiseDemandCollection />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}