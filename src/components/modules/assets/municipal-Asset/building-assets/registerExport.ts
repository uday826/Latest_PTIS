'use client';

import * as XLSX from 'xlsx';
import { AssetRegisterApiRecord } from '@/types/municipal-asset/register.types';
import { formatDate, formatBoolean, formatFieldValue } from './registerMappers';

export async function exportToExcel(
  items: AssetRegisterApiRecord[],
  categoryId: number,
  categoryName: string
) {
  const exportRows = items.map((record) => {
    return {
      'Asset ID': record.assetNo || '',
      'Asset Name': record.assetName || '',
      'Category': record.assetCategoryName || categoryName || '',
      'Sub-Category': record.assetTypeName || '',
      'Authority': record.authorityName || '',
      'Organization': record.organizationName || '',
      'Department': record.departmentName || '',
      'Address': record.address || '',
      'Ward': record.wardName || '',
      'Zone': record.zoneName || '',
      'Latitude': record.latitude == null ? '' : String(record.latitude),
      'Longitude': record.longitude == null ? '' : String(record.longitude),
      'CSN': record.csn || '',
      'Purchase Date': formatDate(record.purchaseDate || undefined),
      'Purchase Value': record.purchaseValue == null ? '' : String(record.purchaseValue),
      'Market Value': record.marketValue == null ? '' : String(record.marketValue),
      'Market Value Date': formatDate(record.marketValueDate || undefined),
      'Capital Value': record.capitalValue == null ? '' : String(record.capitalValue),
      'Last CV Date': formatDate(record.lastCVCalculationDate || undefined),
      'Current Book Value': record.currentBookValue == null ? '' : String(record.currentBookValue),
      'Depreciation Rate': record.depreciationRate == null ? '' : String(record.depreciationRate),
      'Revenue Generating': formatBoolean(record.isRevenueGenerating),
      'Operational Control': record.operationalControl || '',
      'Field Values': formatFieldValue(record.fieldValues),
      'Occupancy Status': record.occupancyStatus || '',
      'Ownership Type': record.ownershipType || '',
      'Asset Condition': record.assetCondition || '',
      'Status': record.status || (record.isActive ? 'Active' : 'Inactive'),
      'Built-Up Area (Sq.M)': record.builtUpAreaSqMeter == null ? '' : String(record.builtUpAreaSqMeter),
      'Carpet Area (Sq.M)': record.carpetAreaSqMeter == null ? '' : String(record.carpetAreaSqMeter),
      'Land Area (Sq.M)': record.landAreaSqMeter == null ? '' : String(record.landAreaSqMeter),
      'Created Date': formatDate(record.createdDate || record.updatedDate || undefined),
    };
  });

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(exportRows);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Asset Register');
  XLSX.writeFile(workbook, `asset-register-${categoryId}.xlsx`);
}
