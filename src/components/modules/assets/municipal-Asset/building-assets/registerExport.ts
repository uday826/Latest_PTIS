import * as XLSX from 'xlsx';
import { AssetRegisterApiRecord } from '@/types/municipal-asset/register.types';
import { mapAssetToRow, formatMoney } from './registerMappers';
import { getRegisterColumns } from './registerTableColumns';

export async function exportToExcel(
  items: AssetRegisterApiRecord[],
  categoryId: number,
  t?: (key: string) => string
) {
  const translate = t || ((key: string) => key);

  // 1. Map API records to table row model
  const mappedRows = items.map((item) => mapAssetToRow(item, ''));

  // 2. Resolve the exact list of columns that are currently active in the UI
  // Note: pathname and router are not needed for Excel metadata, we bypass them safely
  const columns = getRegisterColumns('', {} as any, translate);

  // 3. Filter out Action columns as they contain buttons/interactive components
  const dataColumns = columns.filter((col) => col.key !== 'id');

  // 4. Construct rows with header names matching the columns exactly
  const exportRows = mappedRows.map((row) => {
    const rowObj: Record<string, string> = {};

    dataColumns.forEach((col) => {
      let cellValue = '-';

      if (col.key === 'status') {
        // Condition & Status combined
        const condition = row.assetCondition || '-';
        const statusVal = row.status || '-';
        cellValue = `${condition} | ${statusVal}`;
      } else if (col.key === 'capitalValue') {
        cellValue = row.capitalValue !== '-' ? formatMoney(row.capitalValue) : '-';
      } else {
        const rawValue = row[col.key as keyof typeof row];
        cellValue = rawValue != null ? String(rawValue) : '-';
      }

      rowObj[String(col.label)] = cellValue;
    });

    return rowObj;
  });

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(exportRows);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Asset Register');
  XLSX.writeFile(workbook, `asset-register-${categoryId}.xlsx`);
}
