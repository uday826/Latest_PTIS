'use client';

import { useRouter } from 'next/navigation';
import { Eye, PencilLine, Printer } from 'lucide-react';
import { Badge, type Column } from '@/components/common';
import { IconOnlyActionButton } from '@/components/common/ActionButtons';
import type { AssetRegisterRow } from '@/types/municipal-asset/register.types';
import { formatDate, formatMoney } from './registerMappers';

export function renderTruncatedText(value?: string) {
  const text = value || '-';
  return (
    <span className="block max-w-full whitespace-normal wrap-break-word leading-5" title={text}>
      {text}
    </span>
  );
}

export function renderBadge(value?: string) {
  const text = (value || '-').toLowerCase();
  const variant: 'success' | 'destructive' | 'default' | 'warning' | 'secondary' =
    text === 'active' || text === 'yes' || text === 'true'
      ? 'success'
      : text === 'inactive' || text === 'no' || text === 'false' || text === 'poor'
        ? 'destructive'
        : text === 'good' || text === 'owned'
          ? 'default'
          : text === 'fair' || text === 'leased out'
            ? 'warning'
            : 'secondary';

  return <Badge variant={variant} size="sm">{value || '-'}</Badge>;
}

export function getRegisterColumns(
  pathname: string,
  router: ReturnType<typeof useRouter>,
  t: (key: string) => string
): Column<AssetRegisterRow>[] {
  return [
    { key: 'assetCode', label: t('Asset_ID') || 'Asset No', width: '150px', headerClassName: 'whitespace-nowrap', cellClassName: 'whitespace-nowrap font-semibold text-slate-900', render: (value) => renderTruncatedText(typeof value === 'string' ? value : undefined) },
    {
      key: 'assetName',
      label: t('Asset_Name') || 'Asset Name',
      width: '310px',
      headerClassName: 'whitespace-nowrap text-center',
      cellClassName: 'align-middle text-center',
      render: (_, row) => (
        <div className="flex flex-col items-center text-center">
          <span className="whitespace-normal wrap-break-word font-semibold text-slate-900" title={row.assetName}>{row.assetName}</span>
        </div>
      ),
    },
    { key: 'assetTypeName', label: t('Asset_Type') || 'Asset Type', width: '150px', headerClassName: 'whitespace-nowrap text-center', cellClassName: 'align-middle text-center', render: (value) => renderTruncatedText(typeof value === 'string' ? value : undefined) },
    {
      key: 'ownershipType',
      label: t('Ownership_Type') || 'Ownership Type',
      width: '150px',
      headerClassName: 'whitespace-nowrap text-center',
      cellClassName: 'align-middle text-center',
      render: (value) => renderTruncatedText(typeof value === 'string' ? value : undefined),
    },
    {
      key: 'address',
      label: t('Address') || 'Address',
      width: '200px',
      headerClassName: 'whitespace-nowrap text-center',
      cellClassName: 'align-middle text-center',
      render: (value) => renderTruncatedText(typeof value === 'string' ? value : undefined),
    },
    {
      key: 'wardName',
      label: t('Ward') || 'Ward',
      width: '120px',
      headerClassName: 'whitespace-nowrap text-center',
      cellClassName: 'align-middle text-center',
      render: (value) => renderTruncatedText(typeof value === 'string' ? value : undefined),
    },
    { key: 'purchaseDate', label: t('Acquisition_Date') || 'Acquisition Date', width: '120px', headerClassName: 'whitespace-nowrap text-center', cellClassName: 'align-middle text-center', render: (value) => formatDate(typeof value === 'string' ? value : undefined) },

    { key: 'capitalValue', label: t('Capital_Value') || 'Capital Value', width: '140px', headerClassName: 'whitespace-nowrap text-center', cellClassName: 'align-middle text-center', render: (_, row) => formatMoney(row.capitalValue) },

    { key: 'assetCondition', label: t('Condition') || 'Condition', width: '100px', headerClassName: 'whitespace-nowrap text-center', cellClassName: 'align-middle text-center', render: (value) => renderBadge(typeof value === 'string' ? value : undefined) },
    { key: 'status', label: t('Status') || 'Status', width: '100px', headerClassName: 'whitespace-nowrap text-center', cellClassName: 'align-middle text-center', render: (value) => renderBadge(typeof value === 'string' ? value : undefined) },
    {
      key: 'departmentName',
      label: t('Custodian_Dept') || 'Custodian & Department',
      width: '200px',
      headerClassName: 'whitespace-nowrap text-center',
      cellClassName: 'align-middle text-center',
      render: (_, row) => (
        <div className="flex flex-col items-center text-center">
          <span className="whitespace-normal wrap-break-word font-semibold text-slate-900" title={row.departmentName}>{row.departmentName}</span>
          <span className="whitespace-normal wrap-break-word text-[11px] text-slate-500" title={row.organizationName}>{row.organizationName}</span>
        </div>
      ),
    },


    {
      key: 'id',
      label: t('Action') || 'Action',
      width: '100px',
      headerClassName: 'whitespace-nowrap text-center',
      cellClassName: 'align-middle text-center',
      render: (_, row) => (
        <div className="flex items-center justify-center gap-1.5">
          <IconOnlyActionButton
            icon={Eye}
            aria-label={`View ${row.assetName}`}
            variant="secondary"
            className="text-slate-600 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200"
            disabled={row.id == null}
            onClick={() => {
              if (row.id == null) return;
              const segments = pathname.split('/').filter(Boolean);
              const locale = segments[0] || 'en';
              router.push(`/${locale}/assets/municipal-Asset/asset-detail/${row.id}`);
            }}
          />
          <IconOnlyActionButton
            icon={Printer}
            aria-label={`Print report for ${row.assetName}`}
            title="Open report"
            variant="secondary"
            className="border-amber-200 bg-amber-50 text-amber-700 hover:text-amber-800 hover:bg-amber-100 hover:border-amber-300"
            disabled={row.id == null}
            onClick={() => {
              if (row.id == null) return;
              const segments = pathname.split('/').filter(Boolean);
              const locale = segments[0] || 'en';
              router.push(`/${locale}/assets/municipal-Asset/asset-report/${row.id}`);
            }}
          />
          <IconOnlyActionButton
            icon={PencilLine}
            aria-label={`Edit ${row.assetName}`}
            title="Edit feature coming soon"
            variant="secondary"
            className="border-emerald-200 bg-emerald-50 text-emerald-700 opacity-60 cursor-not-allowed"
            disabled
          />
        </div>
      ),
    },
  ];
}
