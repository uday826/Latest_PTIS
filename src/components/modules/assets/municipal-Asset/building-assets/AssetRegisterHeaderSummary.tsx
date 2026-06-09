import { Building2Icon } from 'lucide-react';
import { CardContent, DashboardCard } from '@/components/common';
import type { AssetRegisterHeaderSummaryProps } from '@/types/asset-types/asset-register.types';

export function AssetRegisterHeaderSummary({
  registerSubtitle,
  updatedDate,
  totalCount,
  totalPurchaseValue,
  totalMarketValue,
  totalDepreciation,
  netBookValue,
  activeAssetsCount,
  translate,
}: AssetRegisterHeaderSummaryProps) {
  return (
    <CardContent className="border border-slate-200 p-0">
      <div className="border-b border-slate-200 px-4 py-3 text-center">
        <div className="inline-flex items-center gap-2 text-slate-900">
          <Building2Icon className="h-4 w-4" />
          <h2 className="text-[15px] font-extrabold uppercase tracking-tight">
            {translate('MUNICIPAL_CORPORATION_ASSET_REGISTER')}
          </h2>
        </div>
        <p className="mt-1 text-[11px] text-slate-600">
          {registerSubtitle} | {translate('Generated_On') || 'Generated On'}: {updatedDate}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2 px-4 py-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
        <DashboardCard
          label={translate('Total_Assets') || 'Total Assets'}
          value={totalCount}
          className="min-h-19.5"
        />
        <DashboardCard
          label={translate('Purchase_Value') || 'Purchase Value'}
          value={`\u20B9${totalPurchaseValue.toLocaleString('en-IN')}`}
          className="min-h-19.5"
        />
        <DashboardCard
          label={translate('Current_Value') || 'Current Value'}
          value={`\u20B9${totalMarketValue.toLocaleString('en-IN')}`}
          className="min-h-19.5"
        />
        <DashboardCard
          label={translate('Depreciation') || 'Depreciation'}
          value={`\u20B9${totalDepreciation.toLocaleString('en-IN')}`}
          valueColor="text-red-600"
          className="min-h-19.5"
        />
        <DashboardCard
          label={translate('Net_Book_Value') || 'Net Book Value'}
          value={`\u20B9${netBookValue.toLocaleString('en-IN')}`}
          valueColor="text-emerald-600"
          className="min-h-19.5"
        />
        <DashboardCard
          label={translate('Active_Assets') || 'Active Assets'}
          value={activeAssetsCount}
          valueColor="text-blue-600"
          className="min-h-19.5"
        />
      </div>
    </CardContent>
  );
}
