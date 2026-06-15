'use client';

import * as XLSX from 'xlsx';
import { AssetRegisterApiRecord } from '@/types/municipal-asset/register.types';
import { formatDate } from './registerMappers';

export async function exportToExcel(
  items: AssetRegisterApiRecord[],
  categoryId: number,
  t?: (key: string) => string
) {
  const exportRows = items.map((record) => {
    return {
      [t ? t('Asset_ID') : 'Asset No']: record.assetNo || '',
      [t ? t('Asset_Name') : 'Asset Name']: record.assetName || '',
      [t ? t('Asset_Type') : 'Asset Type']: record.assetTypeName || '',
      [t ? t('Ownership_Type') : 'Ownership Type']: record.ownershipType || '',
      [t ? t('Address') : 'Address']: record.address || '',
      [t ? t('Ward') : 'Ward']: record.wardName || '',
      [t ? t('Acquisition_Date') : 'Acquisition Date']: formatDate(record.purchaseDate || undefined),
      [t ? t('Capital_Value') : 'Capital Value']: record.capitalValue == null ? '' : String(record.capitalValue),
      [t ? t('Condition') : 'Condition']: record.assetCondition || '',
      [t ? t('Status') : 'Status']: record.status || (record.isActive ? 'Active' : 'Inactive'),
      [t ? t('Custodian_Dept') : 'Custodian & Department']: [record.departmentName, record.organizationName].filter(Boolean).join(' - ') || '',
    };
  });

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(exportRows);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Asset Register');
  XLSX.writeFile(workbook, `asset-register-${categoryId}.xlsx`);
}
