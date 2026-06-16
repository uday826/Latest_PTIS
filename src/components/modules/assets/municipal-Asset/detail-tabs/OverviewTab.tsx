
import type { AssetDetailRecord } from '@/types/municipal-asset/detail-tabs.types';
import { ClipboardList, Map } from 'lucide-react';

function blank(value?: string | number | null) {
  return value === null || value === undefined || value === '' ? '-' : String(value);
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
          <FieldCard label="Ownership Type" value={asset.ownershipType} />
          <FieldCard label="Status" value={asset.isActive === false ? 'Inactive' : asset.status || 'Active'} />
          <FieldCard label="Condition" value={asset.assetCondition} />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/70 px-4 py-3">
          <Map className="h-4 w-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-800">Location</h3>
        </div>
        <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <FieldCard label="Zone" value={asset.zoneName} />
          <FieldCard label="Ward" value={asset.wardName} />
          <FieldCard label="CSN" value={asset.csn} />
          <FieldCard label="Latitude" value={asset.latitude} />
          <FieldCard label="Longitude" value={asset.longitude} />
          <FieldCard label="Address" value={asset.address} />
        </div>
      </div>
    </div>
  );
}
