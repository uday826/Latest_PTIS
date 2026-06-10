import { AddAssetDrawerClient } from "@/components/modules/assets/municipal-Asset/add-New-Asset/AddAssetDrawerClient";
import { getCachedCategories, getCachedZones, getCachedWards } from "@/lib/api/asset/cached-master-data";

export default async function AddNewAssetPage() {
  const [categoriesRes, zonesRes, wardsRes] = await Promise.all([
    getCachedCategories(),
    getCachedZones(),
    getCachedWards(),
  ]);

  const initialCategories = categoriesRes.success && Array.isArray(categoriesRes.data) ? categoriesRes.data : [];
  const initialZones = zonesRes.success && Array.isArray(zonesRes.data) ? zonesRes.data : [];
  const initialWards = wardsRes.success && Array.isArray(wardsRes.data) ? wardsRes.data : [];

  return (
    <div className="flex h-[calc(100vh-120px)] items-center justify-center bg-slate-50/50 rounded-3xl border border-slate-100">
      <div className="text-center space-y-3 opacity-60">
        <div className="size-10 mx-auto rounded-full border-4 border-slate-200 border-t-violet-400 animate-spin" />
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Opening Registration</p>
      </div>
      <AddAssetDrawerClient 
        initialCategories={initialCategories}
        initialZones={initialZones}
        initialWards={initialWards}
      />
    </div>
  );
}