'use client';

import { CalendarClock, ShieldCheck } from 'lucide-react';

import type { Column } from '@/components/common';
import { Badge } from '@/components/common';

import type { AssetCondition, BuildingAsset } from './types';
import { formatINR } from './utils';

function getConditionVariant(condition: AssetCondition): 'default' | 'warning' | 'destructive' {
  if (condition === 'good') return 'default';
  if (condition === 'fair') return 'warning';
  return 'destructive';
}

function MoneyText({ value, className = '' }: { value: number; className?: string }) {
  return <span className={`font-extrabold ${className}`}>{formatINR(value)}</span>;
}

export function createBuildingAssetColumns(): Column<BuildingAsset>[] {
  return [
    {
      key: 'assetId',
      label: 'Asset ID',
      headerClassName: 'min-w-[160px]',
      cellClassName: '!text-left align-top',
      render: (_, row) => <span className="text-[11px] font-bold text-slate-800">{row.assetId}</span>,
    },
    {
      key: 'assetName',
      label: 'Asset Name & Description',
      headerClassName: 'min-w-[250px]',
      cellClassName: '!text-left align-top',
      render: (_, row) => (
        <div className="max-w-[245px] whitespace-normal text-left">
          <p className="text-xs font-bold text-slate-900">{row.assetName}</p>
          <p className="mt-0.5 text-[10px] leading-4 text-slate-500">{row.description}</p>
        </div>
      ),
    },
    {
      key: 'subCategory',
      label: 'Sub-Category',
      headerClassName: 'min-w-[170px]',
      cellClassName: '!text-left align-top',
      render: (_, row) => <span className="text-xs font-bold text-[#063b6f]">{row.subCategory}</span>,
    },
    {
      key: 'location',
      label: 'Location & Ward',
      headerClassName: 'min-w-[210px]',
      cellClassName: '!text-left align-top',
      render: (_, row) => (
        <div className="max-w-[205px] whitespace-normal text-left text-xs">
          <p className="font-bold text-slate-800">{row.location}</p>
          <p className="text-[11px] text-slate-500">Ward: {row.ward}</p>
        </div>
      ),
    },
    {
      key: 'acquisitionDate',
      label: 'Acquisition Date',
      headerClassName: 'min-w-[120px]',
      render: (_, row) => <span className="text-xs font-bold text-slate-900">{row.acquisitionDate}</span>,
    },
    {
      key: 'acquisitionValue',
      label: 'Acquisition Value',
      headerClassName: 'min-w-[145px]',
      cellClassName: '!text-right',
      render: (_, row) => <MoneyText value={row.acquisitionValue} className="text-slate-800" />,
    },
    {
      key: 'currentValue',
      label: 'Current Value',
      headerClassName: 'min-w-[140px]',
      cellClassName: '!text-right',
      render: (_, row) => <MoneyText value={row.currentValue} className="text-emerald-600" />,
    },
    {
      key: 'depreciation',
      label: 'Depreciation',
      headerClassName: 'min-w-[140px]',
      cellClassName: '!text-right',
      render: (_, row) => <MoneyText value={row.depreciation} className="text-red-600" />,
    },
    {
      key: 'netBookValue',
      label: 'Net Book Value',
      headerClassName: 'min-w-[145px]',
      cellClassName: '!text-right',
      render: (_, row) => <MoneyText value={row.netBookValue} className="text-slate-900" />,
    },
    {
      key: 'lifeYears',
      label: 'Life (Yrs)',
      headerClassName: 'min-w-[95px]',
      render: (_, row) => (
        <div className="text-center">
          <p className="text-xs font-extrabold text-slate-900">{row.lifeYears}</p>
          <p className="text-[10px] text-slate-500">Rem: {row.remainingLife}</p>
        </div>
      ),
    },
    {
      key: 'condition',
      label: 'Condition',
      headerClassName: 'min-w-[95px]',
      render: (_, row) => (
        <Badge variant={getConditionVariant(row.condition)} size="sm" className="capitalize">
          {row.condition}
        </Badge>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      headerClassName: 'min-w-[95px]',
      render: (_, row) => (
        <Badge variant="success" size="sm" className="capitalize">
          {row.status}
        </Badge>
      ),
    },
    {
      key: 'custodian',
      label: 'Custodian & Department',
      headerClassName: 'min-w-[185px]',
      cellClassName: '!text-left align-top',
      render: (_, row) => (
        <div className="text-left">
          <p className="text-xs font-extrabold text-slate-900">{row.custodian}</p>
          <p className="text-[10px] text-slate-500">{row.department}</p>
        </div>
      ),
    },
    {
      key: 'insuranceStatus',
      label: 'Insurance Details',
      headerClassName: 'min-w-[180px]',
      cellClassName: '!text-left align-top',
      render: (_, row) => (
        <div className="text-left text-[10px] leading-4">
          <p className={row.insuranceStatus === 'Insured' ? 'font-bold text-emerald-600' : 'font-bold text-red-500'}>
            {row.insuranceStatus === 'Insured' && <ShieldCheck className="mr-1 inline h-3 w-3" />}
            {row.insuranceStatus}
          </p>
          <p className="text-slate-600">Policy:</p>
          <p className="font-semibold text-slate-700">{row.insurancePolicy}</p>
          <p className="text-slate-600">Exp: {row.insuranceExpiry}</p>
        </div>
      ),
    },
    {
      key: 'lastMaintenanceDate',
      label: 'Maintenance Schedule',
      headerClassName: 'min-w-[185px]',
      cellClassName: '!text-left align-top',
      render: (_, row) => (
        <div className="text-left text-[11px] leading-4">
          <p className="font-extrabold text-slate-900">
            <CalendarClock className="mr-1 inline h-3 w-3 text-blue-500" />
            Last: {row.lastMaintenanceDate}
          </p>
          <p className="text-slate-500">Next: {row.nextMaintenanceStatus}</p>
        </div>
      ),
    },
    {
      key: 'remarks',
      label: 'Remarks',
      headerClassName: 'min-w-[135px]',
      cellClassName: '!text-left align-top',
      render: (_, row) => <span className="text-xs font-medium text-slate-700">{row.remarks}</span>,
    },
  ];
}
