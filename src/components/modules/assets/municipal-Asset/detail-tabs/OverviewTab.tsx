
import type { AssetDetailRecord } from '@/types/municipal-asset/detail-tabs.types';
import { ClipboardList, FileText, Info, Map, Ruler } from 'lucide-react';
import { getGroupedDisplayFields } from './fieldValueUtils';

function blank(value?: string | number | null) {
  return value === null || value === undefined || value === '' ? '-' : String(value);
}

function boolText(value?: boolean | null) {
  if (value === true) return 'Yes';
  if (value === false) return 'No';
  return '-';
}

function FieldCard({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-white p-3">
      <p className="mb-1 text-[10px] font-bold text-slate-500">{label}</p>
      <p className="break-words text-sm font-bold text-slate-800">{blank(value)}</p>
    </div>
  );
}

export function OverviewTab({ asset }: { asset: AssetDetailRecord }) {
  const groupedFields = getGroupedDisplayFields(asset);
  const groups = Object.entries(groupedFields);

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/70 px-4 py-3">
          <ClipboardList className="h-4 w-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-800">Basic Information</h3>
        </div>
        <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <FieldCard label="Asset Name" value={asset.assetName} />
          <FieldCard label="Asset No" value={asset.assetNo} />
          <FieldCard label="Category" value={asset.assetCategoryName} />
          <FieldCard label="Type" value={asset.assetTypeName} />
          <FieldCard label="Parent Asset" value={asset.parentAssetName} />
          <FieldCard label="Hierarchy Level" value={asset.hierarchyLevel} />
          <FieldCard label="Status" value={asset.isActive === false ? 'Inactive' : asset.status || 'Active'} />
          <FieldCard label="Condition" value={asset.assetCondition} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/70 px-4 py-3">
            <Map className="h-4 w-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-800">Location</h3>
          </div>
          <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2">
            <FieldCard label="Zone" value={asset.zoneName} />
            <FieldCard label="Ward" value={asset.wardName} />
            <FieldCard label="CSN" value={asset.csn} />
            <FieldCard label="Latitude" value={asset.latitude} />
            <FieldCard label="Longitude" value={asset.longitude} />
            <FieldCard label="Address" value={asset.address} />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/70 px-4 py-3">
            <Ruler className="h-4 w-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-800">Area & Use</h3>
          </div>
          <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2">
            <FieldCard label="Land Area" value={asset.landAreaSqMeter} />
            <FieldCard label="Built-up Area" value={asset.builtUpAreaSqMeter} />
            <FieldCard label="Carpet Area" value={asset.carpetAreaSqMeter} />
            <FieldCard label="Has Lift" value={boolText(asset.hasLift)} />
            <FieldCard label="Occupancy" value={asset.occupancyStatus} />
            <FieldCard label="Operational Control" value={asset.operationalControl} />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/70 px-4 py-3">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-800">Category Specific Details</h3>
          </div>
          {asset.fieldDefinitionsError && <span className="text-xs font-semibold text-amber-600">{asset.fieldDefinitionsError}</span>}
        </div>

        {groups.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">No category-specific fields available.</div>
        ) : (
          <div className="space-y-4 p-4">
            {groups.map(([group, fields]) => (
              <div key={group} className="rounded-lg border border-slate-100 bg-slate-50/40 p-3">
                <div className="mb-3 flex items-center gap-2 text-xs font-bold text-slate-700">
                  <Info className="h-3.5 w-3.5 text-blue-500" />
                  {group}
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {fields.map((field) => (
                    <FieldCard key={field.key} label={field.label} value={field.value} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
