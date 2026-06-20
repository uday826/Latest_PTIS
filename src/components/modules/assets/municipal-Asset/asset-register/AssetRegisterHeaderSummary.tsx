
import { Building2Icon, Coins, CheckCircle2 } from 'lucide-react';
import { CardContent, DashboardCard } from '@/components/common';
import type { AssetRegisterHeaderSummaryProps } from '@/types/municipal-asset-register.types';

export function AssetRegisterHeaderSummary({
  totalCount,
  totalCapitalValue,
  activeAssetsCount,
  translate,
}: AssetRegisterHeaderSummaryProps) {
  return (
    <CardContent className="border-t border-slate-200 p-0 bg-slate-50/50">
      <div className="grid grid-cols-1 gap-4 px-4 py-4 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          label={translate('Total_Assets') || 'Total Assets'}
          value={totalCount}
          icon={<Building2Icon className="h-5 w-5" />}
          iconBg="bg-blue-50 text-blue-600 border-blue-100"
        />
        <DashboardCard
          label={translate('Capital_Value') || 'Capital Value'}
          value={
            totalCapitalValue === 0
              ? '₹0 Cr'
              : `\u20B9${(totalCapitalValue / 10000000).toLocaleString('en-IN', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })} Cr`
          }
          valueColor="text-emerald-600"
          icon={<Coins className="h-5 w-5" />}
          iconBg="bg-emerald-50 text-emerald-600 border-emerald-100"
        />
        <DashboardCard
          label={translate('Active_Assets') || 'Active Assets'}
          value={activeAssetsCount}
          valueColor="text-blue-600"
          icon={<CheckCircle2 className="h-5 w-5" />}
          iconBg="bg-sky-50 text-sky-600 border-sky-100"
        />
      </div>
    </CardContent>
  );
}
