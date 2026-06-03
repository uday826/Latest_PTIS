"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Plus, ChevronRight, ClipboardList, Search, CheckCircle2, Loader2, X, MapPin, AlertCircle } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { Drawer } from "@/components/common/Drawer";
import { Select } from "@/components/common";
import {
  fetchCategories,
  fetchTypesByCategory,
  fetchZones,
  fetchWards,
  fetchAssetsByFilter,
} from "@/app/[locale]/asset/municipal-Asset/actions";
import { AssetCategory, AssetType } from "@/lib/api/asset/category-type.service";
import { Zone } from "@/lib/api/asset/zone.service";
import { Ward } from "@/lib/api/asset/ward.service";

// ─── Types ───────────────────────────────────────────────────────────────────

type DrawerMode = "new" | "existing";

interface ExistingAssetEntry {
  id: number;
  assetNo: string;
  assetName: string;
  categoryName: string;
  typeName: string;
  address: string;
  zoneName: string | null;
  wardName: string | null;
  assetCategoryId: number | null;
  assetTypeId: number | null;
}

interface AddAssetDrawerProps {
  open: boolean;
  onClose: () => void;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function AddAssetDrawer({ open, onClose }: AddAssetDrawerProps) {
  const router = useRouter();
  const pathname = usePathname();

  // ── Mode selection
  const [mode, setMode] = useState<DrawerMode>("new");

  // ── "New Register" state
  const [categories, setCategories] = useState<AssetCategory[]>([]);
  const [types, setTypes] = useState<AssetType[]>([]);
  const [newData, setNewData] = useState({
    category: "",
    assetType: "",
    categoryId: null as number | null,
    typeId: null as number | null,
  });
  const [isCatLoading, setIsCatLoading] = useState(false);

  // ── "Use Existing" state
  const [zones, setZones] = useState<Zone[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedZoneId, setSelectedZoneId] = useState<number | null>(null);
  const [selectedWardId, setSelectedWardId] = useState<number | null>(null);
  const [assetSearch, setAssetSearch] = useState("");
  const [assetResults, setAssetResults] = useState<ExistingAssetEntry[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [selectedAsset, setSelectedAsset] = useState<ExistingAssetEntry | null>(null);
  const [isAssetLoading, setIsAssetLoading] = useState(false);

  // Gate: asset code search is only active when both zone + ward are selected
  const canSearch = !!(selectedZoneId && selectedWardId);

  // ── Locale helper
  const getLocale = () => {
    const segments = pathname.split("/").filter(Boolean);
    return segments[0] || "en";
  };

  // ──────────────────────────────────────────────────────
  // Load categories on mount (New Register)
  // ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    setIsCatLoading(true);
    fetchCategories().then((res) => {
      if (res.success && res.data) {
        setCategories(Array.isArray(res.data) ? res.data : []);
      }
      setIsCatLoading(false);
    });
  }, [open]);

  // Load types when category changes
  useEffect(() => {
    if (!newData.category) { setTypes([]); return; }
    const cat = categories.find(
      (c) => c.categoryName === newData.category || c.id.toString() === newData.category
    );
    if (!cat) return;
    fetchTypesByCategory(cat.id).then((res) => {
      if (res.success && res.data) setTypes(res.data);
    });
  }, [newData.category, categories]);

  // ──────────────────────────────────────────────────────
  // Load zones + wards on open
  // ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    fetchZones().then((res) => {
      if (res.success && res.data) setZones(Array.isArray(res.data) ? res.data : []);
    });
    fetchWards().then((res) => {
      if (res.success && res.data) setWards(Array.isArray(res.data) ? res.data : []);
    });
  }, [open]);

  // ──────────────────────────────────────────────────────
  // Fetch assets — only when zone + ward are both selected
  // ──────────────────────────────────────────────────────
  const loadAssets = useCallback(async () => {
    // Gate: require zone, ward, AND a non-empty search term
    if (!selectedZoneId || !selectedWardId || !assetSearch.trim()) {
      setAssetResults([]);
      setTotalCount(0);
      return;
    }
    setIsAssetLoading(true);
    try {
      const res = await fetchAssetsByFilter({
        zoneId: selectedZoneId,
        wardId: selectedWardId,
        search: assetSearch.trim(),
        pageSize: 50,
      });
      if (res.success && res.data) {
        const term = assetSearch.trim().toLowerCase();

        // Client-side filter: backend may return loosely matched results,
        // so we keep only records where assetNo or assetName contains the typed term.
        const filtered = (res.data as any[]).filter((a: any) => {
          const code = (a.assetNo || "").toLowerCase();
          const name = (a.assetName || "").toLowerCase();
          return code.includes(term) || name.includes(term);
        });

        const mapped: ExistingAssetEntry[] = filtered.map((a: any) => ({
          id: a.id,
          assetNo: a.assetNo || `ASSET-${a.id}`,
          assetName: a.assetName || "Unnamed Asset",
          categoryName: a.assetCategoryName || "",
          typeName: a.assetTypeName || "",
          address: a.address || "",
          zoneName: a.zoneName || null,
          wardName: a.wardName || null,
          assetCategoryId: a.assetCategoryId ?? null,
          assetTypeId: a.assetTypeId ?? null,
        }));

        setAssetResults(mapped);
        setTotalCount(mapped.length);
      } else {
        setAssetResults([]);
        setTotalCount(0);
      }
    } finally {
      setIsAssetLoading(false);
    }

  }, [selectedZoneId, selectedWardId, assetSearch]);

  // Debounced trigger: fires only when zone + ward + search are all set
  useEffect(() => {
    if (mode !== "existing") return;
    if (!selectedZoneId || !selectedWardId || !assetSearch.trim()) {
      setAssetResults([]);
      setTotalCount(0);
      return;
    }
    const timeout = setTimeout(loadAssets, 350);
    return () => clearTimeout(timeout);
  }, [selectedZoneId, selectedWardId, assetSearch, mode, loadAssets]);

  // ──────────────────────────────────────────────────────
  // Reset on close / mode switch
  // ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!open) {
      setMode("new");
      setNewData({ category: "", assetType: "", categoryId: null, typeId: null });
      resetExisting();
    }
  }, [open]);

  useEffect(() => {
    resetExisting();
  }, [mode]);

  const resetExisting = () => {
    setSelectedZoneId(null);
    setSelectedWardId(null);
    setAssetSearch("");
    setAssetResults([]);
    setTotalCount(0);
    setSelectedAsset(null);
  };

  // ──────────────────────────────────────────────────────
  // Navigation
  // ──────────────────────────────────────────────────────
  const handleNewRegisterSubmit = () => {
    if (!newData.category || !newData.assetType) return;
    const cat = categories.find((c) => c.categoryName === newData.category);
    const typ = types.find((t) => {
      const label = t.assetTypeName || (t as any).typeName || "";
      return label === newData.assetType;
    });
    const params = new URLSearchParams({
      category: newData.category,
      assetType: newData.assetType,
      categoryId: (cat?.id ?? newData.categoryId ?? "").toString(),
      typeId: (typ?.id ?? newData.typeId ?? "").toString(),
    });
    router.push(`/${getLocale()}/asset/municipal-Asset/add-New-Asset/basic-Info?${params}`);
    onClose();
  };

  const handleExistingAssetSubmit = () => {
    if (!selectedAsset) return;
    const params = new URLSearchParams({
      category: selectedAsset.categoryName,
      assetType: selectedAsset.typeName,
      categoryId: (selectedAsset.assetCategoryId ?? "").toString(),
      typeId: (selectedAsset.assetTypeId ?? "").toString(),
      existingAssetId: selectedAsset.id.toString(),
      existingAssetNo: selectedAsset.assetNo,
    });
    router.push(`/${getLocale()}/asset/municipal-Asset/add-New-Asset/basic-Info?${params}`);
    onClose();
  };

  // ──────────────────────────────────────────────────────
  // Derived options
  // ──────────────────────────────────────────────────────
  const categoryOptions = categories.map((c) => ({ label: c.categoryName, value: c.categoryName }));
  const typeOptions = types.map((t) => {
    const label = t.assetTypeName || (t as any).typeName || "Unknown Type";
    return { label, value: label };
  });
  const zoneOptions = zones.map((z) => ({
    label: z.zoneName || z.ZoneName || `Zone ${z.zoneNo || z.ZoneNo}`,
    value: z.id.toString(),
  }));
  const wardOptions = wards
    .filter((w) => !selectedZoneId || w.zoneId == null || String(w.zoneId) === String(selectedZoneId))
    .map((w) => ({
      label: w.wardName || w.WardName || `Ward ${w.wardNo || w.WardNo}`,
      value: w.id.toString(),
    }));

  const canSubmitNew = !!(newData.category && newData.assetType);
  const canSubmitExisting = !!selectedAsset;

  // ──────────────────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────────────────
  return (
    <Drawer
      open={open}
      onClose={onClose}
      width="md"
      title={
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 p-1.5 shadow">
            <Plus className="size-4 text-white" />
          </div>
          <div>
            <span className="block text-sm font-bold tracking-wide text-slate-800">Add New Asset</span>
            <span className="block text-[10px] font-medium text-slate-400 leading-none mt-0.5">Choose registration method</span>
          </div>
        </div>
      }
      footer={
        <div className="flex items-center gap-3 w-full">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-500 transition-colors hover:text-slate-700 rounded-lg hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            onClick={mode === "new" ? handleNewRegisterSubmit : handleExistingAssetSubmit}
            disabled={mode === "new" ? !canSubmitNew : !canSubmitExisting}
            className={`flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-bold transition-all shadow-md ml-auto ${(mode === "new" ? canSubmitNew : canSubmitExisting)
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-95 shadow-blue-200"
                : "cursor-not-allowed bg-slate-100 text-slate-400 shadow-none"
              }`}
          >
            {mode === "new" ? "Start Registration" : "Continue"}
            <ChevronRight className="size-4" />
          </button>
        </div>
      }
    >
      <div className="p-5 space-y-5">
        {/* ── Mode Tabs ── */}
        <div className="flex gap-3">
          <ModeTab
            active={mode === "new"}
            icon={<ClipboardList className="size-4" />}
            title="New Register"
            subtitle="Register a brand-new asset"
            onClick={() => setMode("new")}
            color="blue"
          />
          {false && (
            <ModeTab
              active={mode === "existing"}
              icon={<Search className="size-4" />}
              title="Use Existing Asset"
              subtitle="Find asset by zone, ward & code"
              onClick={() => setMode("existing")}
              color="violet"
            />
          )}
        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

        {/* ── NEW REGISTER ── */}
        {mode === "new" && (
          <div className="space-y-5 animate-in fade-in slide-in-from-left-4 duration-300">
            <SectionLabel>Select Asset Category & Type</SectionLabel>

            {isCatLoading ? (
              <div className="flex items-center justify-center py-10 text-slate-400">
                <Loader2 className="size-5 animate-spin mr-2" />
                <span className="text-sm font-medium">Loading categories…</span>
              </div>
            ) : (
              <div className="space-y-4">
                <Select
                  label="Asset Category"
                  name="category"
                  value={newData.category}
                  onChange={(e) => {
                    const cat = categories.find((c) => c.categoryName === e.target.value);
                    setNewData({ category: e.target.value, assetType: "", categoryId: cat?.id ?? null, typeId: null });
                    setTypes([]);
                  }}
                  required
                  options={categoryOptions}
                  placeholder="Select category…"
                />
                <Select
                  label="Asset Type"
                  name="assetType"
                  value={newData.assetType}
                  onChange={(e) => {
                    const typ = types.find((t) => {
                      const label = t.assetTypeName || (t as any).typeName || "";
                      return label === e.target.value;
                    });
                    setNewData((prev) => ({ ...prev, assetType: e.target.value, typeId: typ?.id ?? null }));
                  }}
                  required
                  options={typeOptions}
                  placeholder={typeOptions.length ? "Select type…" : "Select category first"}
                  disabled={!typeOptions.length}
                />
              </div>
            )}

            {canSubmitNew && (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 animate-in fade-in duration-300">
                <CheckCircle2 className="size-4 flex-shrink-0 text-emerald-500" />
                Ready to register: <span className="font-bold ml-1">{newData.category} → {newData.assetType}</span>
              </div>
            )}
          </div>
        )}

        {/* ── USE EXISTING ASSET ── */}
        {mode === "existing" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">

            {/* Step 1: Zone */}
            <div className="space-y-1">
              <StepBadge step={1} done={!!selectedZoneId} />
              <Select
                label="Zone"
                name="zone"
                value={selectedZoneId?.toString() ?? ""}
                onChange={(e) => {
                  setSelectedZoneId(e.target.value ? Number(e.target.value) : null);
                  // Reset downstream
                  setSelectedWardId(null);
                  setAssetSearch("");
                  setAssetResults([]);
                  setTotalCount(0);
                  setSelectedAsset(null);
                }}
                options={zoneOptions}
                placeholder="Select zone…"
                required
              />
            </div>

            {/* Step 2: Ward — unlocks after zone */}
            <div className={`space-y-1 transition-opacity duration-200 ${selectedZoneId ? "opacity-100" : "opacity-40 pointer-events-none"}`}>
              <StepBadge step={2} done={!!selectedWardId} locked={!selectedZoneId} />
              <Select
                label="Ward"
                name="ward"
                value={selectedWardId?.toString() ?? ""}
                onChange={(e) => {
                  setSelectedWardId(e.target.value ? Number(e.target.value) : null);
                  setAssetSearch("");
                  setAssetResults([]);
                  setTotalCount(0);
                  setSelectedAsset(null);
                }}
                options={wardOptions}
                placeholder={selectedZoneId ? "Select ward…" : "Select zone first"}
                disabled={!selectedZoneId}
                required
              />
            </div>

            {/* Step 3: Asset Code Search — unlocks after zone + ward */}
            <div className={`space-y-1 transition-opacity duration-200 ${canSearch ? "opacity-100" : "opacity-40 pointer-events-none"}`}>
              <StepBadge step={3} done={!!selectedAsset} locked={!canSearch} />
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-600">
                  Search Asset Code / Name
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input
                    type="text"
                    value={assetSearch}
                    disabled={!canSearch}
                    onChange={(e) => {
                      setAssetSearch(e.target.value);
                      setSelectedAsset(null);
                    }}
                    placeholder={canSearch ? "Type asset code or name…" : "Select zone & ward first"}
                    className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-9 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition disabled:bg-slate-50 disabled:text-slate-400"
                  />
                  {assetSearch && (
                    <button
                      onClick={() => { setAssetSearch(""); setSelectedAsset(null); }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="size-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Prompt: select zone + ward first */}
            {!canSearch && (
              <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                <AlertCircle className="size-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs font-medium text-amber-700 leading-snug">
                  Select both <span className="font-bold">Zone</span> and <span className="font-bold">Ward</span> to enable asset search.
                </p>
              </div>
            )}

            {/* Idle prompt — zone + ward set, but no search text yet */}
            {canSearch && !assetSearch.trim() && !isAssetLoading && (
              <div className="flex items-start gap-2.5 rounded-xl border border-violet-100 bg-violet-50/60 px-4 py-3">
                <Search className="size-4 text-violet-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs font-medium text-violet-600 leading-snug">
                  Type an <span className="font-bold">asset code or name</span> to search within the selected zone and ward.
                </p>
              </div>
            )}

            {/* Loading */}
            {canSearch && !!assetSearch.trim() && isAssetLoading && (
              <div className="flex items-center justify-center py-6 text-slate-400">
                <Loader2 className="size-4 animate-spin mr-2" />
                <span className="text-sm">Searching assets…</span>
              </div>
            )}

            {/* Results list — only shown when user has typed a search term */}
            {canSearch && !!assetSearch.trim() && !isAssetLoading && assetResults.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between px-0.5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    {assetResults.length} of {totalCount} result{totalCount !== 1 ? "s" : ""} for &ldquo;{assetSearch}&rdquo;
                  </p>
                  {totalCount > assetResults.length && (
                    <span className="text-[10px] text-violet-500 font-semibold">Refine search to see more</span>
                  )}
                </div>
                <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                  {assetResults.map((asset) => (
                    <AssetResultRow
                      key={asset.id}
                      asset={asset}
                      selected={selectedAsset?.id === asset.id}
                      onSelect={() => setSelectedAsset((prev) => prev?.id === asset.id ? null : asset)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* No results — only shown when user has typed a search term */}
            {canSearch && !!assetSearch.trim() && !isAssetLoading && assetResults.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 py-8 text-center">
                <MapPin className="size-5 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-500">No assets found</p>
                <p className="mt-1 text-xs text-slate-400">No match for &ldquo;{assetSearch}&rdquo; in this zone &amp; ward</p>
              </div>
            )}

            {/* Selected asset confirmation */}
            {selectedAsset && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 flex items-start gap-3 animate-in fade-in duration-200">
                <CheckCircle2 className="size-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-emerald-800">Asset selected</p>
                  <p className="text-[11px] font-mono font-semibold text-emerald-700 mt-0.5">{selectedAsset.assetNo}</p>
                  <p className="text-[10px] text-emerald-600 truncate">{selectedAsset.assetName}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Drawer>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepBadge({ step, done, locked }: { step: number; done: boolean; locked?: boolean }) {
  return (
    <div className="flex items-center gap-2 mb-1">
      <span className={`inline-flex size-5 items-center justify-center rounded-full text-[10px] font-black transition-colors ${done
          ? "bg-emerald-500 text-white"
          : locked
            ? "bg-slate-200 text-slate-400"
            : "bg-blue-600 text-white"
        }`}>
        {done ? "✓" : step}
      </span>
      <span className={`text-[10px] font-bold uppercase tracking-widest ${done ? "text-emerald-600" : locked ? "text-slate-400" : "text-slate-500"
        }`}>
        {step === 1 ? "Select Zone" : step === 2 ? "Select Ward" : "Search Asset Code"}
      </span>
    </div>
  );
}

function ModeTab({
  active, icon, title, subtitle, onClick, color,
}: {
  active: boolean; icon: React.ReactNode; title: string; subtitle: string;
  onClick: () => void; color: "blue" | "violet";
}) {
  const activeClasses = color === "blue"
    ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm shadow-blue-100"
    : "border-violet-500 bg-violet-50 text-violet-700 shadow-sm shadow-violet-100";
  const iconActive = color === "blue" ? "bg-blue-600 text-white" : "bg-violet-600 text-white";

  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-start gap-3 rounded-xl border-2 p-3.5 text-left transition-all ${active ? activeClasses : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50"
        }`}
    >
      <div className={`mt-0.5 flex-shrink-0 rounded-lg p-1.5 transition-colors ${active ? iconActive : "bg-slate-100 text-slate-400"}`}>
        {icon}
      </div>
      <div>
        <p className={`text-sm font-bold leading-tight ${active ? "" : "text-slate-600"}`}>{title}</p>
        <p className={`text-[11px] mt-0.5 leading-tight ${active ? "opacity-80" : "text-slate-400"}`}>{subtitle}</p>
      </div>
    </button>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">{children}</p>
  );
}

function AssetResultRow({
  asset, selected, onSelect,
}: {
  asset: ExistingAssetEntry; selected: boolean; onSelect: () => void;
}) {
  const badgeColor = (() => {
    const cat = asset.categoryName.toLowerCase();
    if (cat.includes("build")) return "bg-blue-100 text-blue-700";
    if (cat.includes("land") || cat.includes("plot")) return "bg-emerald-100 text-emerald-700";
    if (cat.includes("vehicle")) return "bg-amber-100 text-amber-700";
    return "bg-slate-100 text-slate-600";
  })();

  return (
    <button
      onClick={onSelect}
      className={`w-full flex items-start justify-between rounded-xl border px-3.5 py-3 text-left transition-all group ${selected
          ? "border-violet-400 bg-violet-50 shadow-sm"
          : "border-slate-200 bg-white hover:border-violet-300 hover:bg-violet-50/40"
        }`}
    >
      <div className="min-w-0 flex-1">
        {/* Asset Code + Category badge */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-black tracking-wide font-mono ${selected ? "text-violet-700" : "text-slate-800"}`}>
            {asset.assetNo}
          </span>
          {asset.categoryName && (
            <span className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${badgeColor}`}>
              {asset.categoryName}
            </span>
          )}
        </div>
        {/* Asset Name */}
        <p className={`text-[11px] font-semibold mt-0.5 truncate ${selected ? "text-violet-600" : "text-slate-600"}`}>
          {asset.assetName}
        </p>
        {/* Type + Ward/Zone */}
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {asset.typeName && (
            <span className="text-[10px] text-slate-400 font-medium">{asset.typeName}</span>
          )}
          {(asset.wardName || asset.zoneName) && (
            <>
              <span className="text-slate-300">·</span>
              <span className="text-[10px] text-slate-400">
                {[asset.wardName, asset.zoneName].filter(Boolean).join(", ")}
              </span>
            </>
          )}
        </div>
        {/* Address */}
        {asset.address && (
          <p className="text-[10px] text-slate-400 mt-0.5 truncate">{asset.address}</p>
        )}
      </div>
      <div className="ml-2 flex-shrink-0 mt-1">
        {selected
          ? <CheckCircle2 className="size-4 text-violet-500" />
          : <ChevronRight className="size-4 text-slate-300 group-hover:text-violet-400 transition-colors" />
        }
      </div>
    </button>
  );
}
