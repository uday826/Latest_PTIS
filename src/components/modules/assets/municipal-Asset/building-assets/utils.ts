import type { AssetTypeOption, BuildingAsset } from './types';

export const ASSET_TYPE_ORDER = [
  'Municipal Commercial Complex',
  'Municipal Office',
  'School/Educational Institute',
  'Hospital',
  'Municipal Crematorium',
  'Municipal Monument / Statue',
  'Public Toilet Building',
  'Zonal Office',
  'Auditorium',
  'Community Hall',
  'Gymnasium / Vyayam Shala',
  'Sports Complex',
  'Other Municipal Building',
  'Ward Office',
  'Dispensary',
  'Maternity Home',
  'Library',
  'Staff Quarters',
  'Guest House',
  'Fire Station',
] as const;

export const ZONE_OPTIONS = [
  'All Zones',
  'Central Zone - Akola',
  'East Zone',
  'K/E Ward - Eastern Suburbs',
  'L Ward - North East',
  'North Zone',
  'P/N Ward - Western Suburbs',
  'R/N Ward - Western Suburbs',
  'South Zone',
  'West Zone',
  'Zone 1 - Akola',
  'Zone 1 - Akola Central',
  'Zone 2 - Akola',
  'Zone 2 - Akola East',
  'Zone 3 - Akola West',
  'Zone 4 - Malakapur Area',
  'Zone A',
  'Zone A2',
  'Zone B',
  'Zone C',
  'Zone D',
  'Zone D7',
  'Zone D8',
  'Zone Z',
];

export const WARD_OPTIONS = [
  'All Wards',
  'Ward 10',
  'Ward 11',
  'Ward 12',
  'Ward 147',
  'Ward 148',
  'Ward 150',
  'Ward 2',
  'Ward 2-A2',
  'Ward 2-A7',
  'Ward 2-D11',
  'Ward 26',
  'Ward 4',
  'Ward 44',
  'Ward 51',
  'Ward 56',
  'Ward A',
  'Ward B',
  'Ward C',
  'Ward D',
  'Ward A1-9',
  'Ward A4-251',
  'Ward A4-91',
  'Ward B8-323',
  'Ward C1',
  'Ward B8',
];

export function formatINR(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function getAssetTypeOptions(assets: BuildingAsset[]): AssetTypeOption[] {
  const countByType = assets.reduce<Record<string, number>>((acc, asset) => {
    acc[asset.assetType] = (acc[asset.assetType] ?? 0) + 1;
    return acc;
  }, {});

  return [
    {
      label: 'All Assets',
      value: 'All Assets',
      count: assets.length,
    },
    ...ASSET_TYPE_ORDER.map((label) => {
      const count = countByType[label] ?? 0;
      return {
        label,
        value: label,
        count,
        disabled: count === 0,
      };
    }),
  ];
}

export function exportAssetsAsCsv(assets: BuildingAsset[]) {
  const headers: Array<keyof BuildingAsset> = [
    'assetId',
    'assetName',
    'subCategory',
    'location',
    'ward',
    'zone',
    'acquisitionDate',
    'acquisitionValue',
    'currentValue',
    'depreciation',
    'netBookValue',
    'lifeYears',
    'remainingLife',
    'condition',
    'status',
    'custodian',
    'department',
    'insuranceStatus',
    'insurancePolicy',
    'insuranceExpiry',
    'lastMaintenanceDate',
    'nextMaintenanceStatus',
    'propertyNo',
    'partitionNo',
    'remarks',
  ];

  const escapeCsv = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;
  const csvRows = [
    headers.map(escapeCsv).join(','),
    ...assets.map((asset) => headers.map((header) => escapeCsv(asset[header])).join(',')),
  ];

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'building-assets.csv';
  link.click();
  URL.revokeObjectURL(url);
}
