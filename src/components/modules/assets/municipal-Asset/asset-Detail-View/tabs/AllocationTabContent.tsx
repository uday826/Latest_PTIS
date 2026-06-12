"use client";

import { useEffect, useState, useCallback } from "react";
import { Building2, ArrowRightLeft, DoorOpen, Plus, History, Clock, CheckCircle2, XCircle, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import type { DepartmentRoomAllocation, CreateAllocationPayload, TransferDepartmentPayload } from "@/lib/api/asset/department-allocation.service";
import {
  getAllocationsAction,
  getDepartmentsListAction,
  getFloorsListAction,
  allocateDepartmentAction,
  transferDepartmentAction,
  vacateDepartmentAction,
  getRoomHistoryAction,
} from "./allocation-actions";

interface Props {
  buildingAssetId: number | string;
}

type ViewMode = "current" | "history";

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Active: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Transferred: "bg-blue-100 text-blue-700 border-blue-200",
    Vacated: "bg-slate-100 text-slate-500 border-slate-200",
  };
  const cls = map[status] ?? "bg-slate-100 text-slate-500 border-slate-200";
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${cls}`}>
      {status === "Active" && <CheckCircle2 className="size-3" />}
      {status === "Transferred" && <ArrowRightLeft className="size-3" />}
      {status === "Vacated" && <XCircle className="size-3" />}
      {status}
    </span>
  );
}

// ─── Allocation row ───────────────────────────────────────────────────────────

function AllocationRow({
  row,
  onVacate,
  onTransfer,
  showHistory,
}: {
  row: DepartmentRoomAllocation;
  onVacate: (ids: number[]) => void;
  onTransfer: (row: DepartmentRoomAllocation) => void;
  showHistory: (row: DepartmentRoomAllocation) => void;
}) {
  const occupant = row.allocationType === "Department" ? row.departmentName : row.tenantName;
  const room = row.roomAssetName ?? row.roomDescription ?? "—";
  const floor = row.floorName ?? "—";
  const fromDate = row.allocationFrom ? new Date(row.allocationFrom).toLocaleDateString("en-IN") : "—";
  const toDate = row.allocationTo ? new Date(row.allocationTo).toLocaleDateString("en-IN") : "Present";

  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-3 py-2.5 text-xs font-semibold text-slate-700">{floor}</td>
      <td className="px-3 py-2.5 text-xs text-slate-600">{room}</td>
      <td className="px-3 py-2.5">
        <div className="text-xs font-bold text-slate-800">{occupant ?? "—"}</div>
        <div className="text-[10px] text-slate-400 uppercase tracking-wide">{row.allocationType}</div>
      </td>
      <td className="px-3 py-2.5 text-xs text-slate-500 whitespace-nowrap">
        <Clock className="size-3 inline mr-1 text-slate-400" />
        {fromDate} → {toDate}
      </td>
      <td className="px-3 py-2.5"><StatusBadge status={row.status} /></td>
      <td className="px-3 py-2.5">
        <div className="flex items-center gap-1.5">
          {row.status === "Active" && (
            <>
              <button
                onClick={() => onTransfer(row)}
                title="Transfer department to new floor/room"
                className="px-2 py-1 rounded-lg text-[10px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors flex items-center gap-1"
              >
                <ArrowRightLeft className="size-3" /> Transfer
              </button>
              <button
                onClick={() => onVacate([row.id])}
                title="Mark this room as vacant"
                className="px-2 py-1 rounded-lg text-[10px] font-bold text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors flex items-center gap-1"
              >
                <DoorOpen className="size-3" /> Vacate
              </button>
            </>
          )}
          <button
            onClick={() => showHistory(row)}
            title="View full room occupancy history"
            className="px-2 py-1 rounded-lg text-[10px] font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-1"
          >
            <History className="size-3" /> History
          </button>
        </div>
      </td>
    </tr>
  );
}

// ─── Allocate drawer (simple inline form) ─────────────────────────────────────

function AllocateForm({
  buildingAssetId,
  departments,
  floors,
  onSave,
  onCancel,
}: {
  buildingAssetId: number;
  departments: { id: number; departmentName: string }[];
  floors: { id: number; floorName: string }[];
  onSave: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<CreateAllocationPayload>({
    buildingAssetId,
    floorDetailId: 0,
    allocationType: "Department",
    allocationFrom: new Date().toISOString().slice(0, 10),
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!form.floorDetailId) { toast.error("Select a floor."); return; }
    if (form.allocationType === "Department" && !form.departmentId) { toast.error("Select a department."); return; }
    if (form.allocationType === "Tenant" && !form.tenantName) { toast.error("Enter tenant name."); return; }
    setSaving(true);
    const res = await allocateDepartmentAction(form);
    setSaving(false);
    if (res.success) { toast.success("Allocated successfully."); onSave(); }
    else toast.error(res.message ?? "Failed to allocate.");
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-sm">
      <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
        <Plus className="size-4 text-blue-600" /> New Allocation
      </h4>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Type</label>
          <select
            value={form.allocationType}
            onChange={e => setForm(p => ({ ...p, allocationType: e.target.value as "Department" | "Tenant" }))}
            className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="Department">Department</option>
            <option value="Tenant">Tenant / Company</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Floor</label>
          <select
            value={form.floorDetailId}
            onChange={e => setForm(p => ({ ...p, floorDetailId: Number(e.target.value) }))}
            className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value={0}>Select floor…</option>
            {floors.map(f => <option key={f.id} value={f.id}>{f.floorName}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">
            {form.allocationType === "Department" ? "Department" : "Tenant Name"}
          </label>
          {form.allocationType === "Department" ? (
            <select
              value={form.departmentId ?? ""}
              onChange={e => setForm(p => ({ ...p, departmentId: Number(e.target.value) || undefined }))}
              className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="">Select dept…</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.departmentName}</option>)}
            </select>
          ) : (
            <input
              type="text"
              value={form.tenantName ?? ""}
              onChange={e => setForm(p => ({ ...p, tenantName: e.target.value }))}
              placeholder="Company / tenant name"
              className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          )}
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Room / Space</label>
          <input
            type="text"
            value={form.roomDescription ?? ""}
            onChange={e => setForm(p => ({ ...p, roomDescription: e.target.value }))}
            placeholder="e.g. Room 101 or Office Wing A"
            className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">From Date</label>
          <input
            type="date"
            value={form.allocationFrom}
            onChange={e => setForm(p => ({ ...p, allocationFrom: e.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Remarks</label>
          <input
            type="text"
            value={form.remarks ?? ""}
            onChange={e => setForm(p => ({ ...p, remarks: e.target.value }))}
            placeholder="Optional"
            className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </div>
      <div className="flex items-center gap-2 justify-end">
        <button onClick={onCancel} className="px-4 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors">Cancel</button>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="px-5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-60"
        >
          {saving && <Loader2 className="size-3 animate-spin" />}
          Save Allocation
        </button>
      </div>
    </div>
  );
}

// ─── Transfer modal ───────────────────────────────────────────────────────────

function TransferModal({
  row,
  floors,
  onSave,
  onCancel,
}: {
  row: DepartmentRoomAllocation;
  floors: { id: number; floorName: string }[];
  onSave: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<TransferDepartmentPayload>({
    departmentId: row.departmentId,
    tenantName: row.tenantName,
    newBuildingAssetId: row.buildingAssetId,
    newFloorDetailId: 0,
    transferDate: new Date().toISOString().slice(0, 10),
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!form.newFloorDetailId) { toast.error("Select the new floor."); return; }
    setSaving(true);
    const res = await transferDepartmentAction(form);
    setSaving(false);
    if (res.success) { toast.success("Department transferred successfully."); onSave(); }
    else toast.error(res.message ?? "Transfer failed.");
  };

  const occupant = row.allocationType === "Department" ? row.departmentName : row.tenantName;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <ArrowRightLeft className="size-4 text-blue-600" />
          Transfer: <span className="text-blue-700">{occupant}</span>
        </h3>
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-700 font-medium">
          Current: {row.floorName} — {row.roomAssetName ?? row.roomDescription ?? "all rooms"}
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">New Floor</label>
            <select
              value={form.newFloorDetailId}
              onChange={e => setForm(p => ({ ...p, newFloorDetailId: Number(e.target.value) }))}
              className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value={0}>Select new floor…</option>
              {floors.map(f => <option key={f.id} value={f.id}>{f.floorName}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">New Room / Space</label>
            <input
              type="text"
              value={form.newRoomDescription ?? ""}
              onChange={e => setForm(p => ({ ...p, newRoomDescription: e.target.value }))}
              placeholder="e.g. Room 301 or East Wing"
              className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Transfer Date</label>
            <input
              type="date"
              value={form.transferDate}
              onChange={e => setForm(p => ({ ...p, transferDate: e.target.value }))}
              className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Reason / Remarks</label>
            <input
              type="text"
              value={form.remarks ?? ""}
              onChange={e => setForm(p => ({ ...p, remarks: e.target.value }))}
              placeholder="e.g. Dept expansion"
              className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 justify-end pt-1">
          <button onClick={onCancel} className="px-4 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors">Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-60"
          >
            {saving && <Loader2 className="size-3 animate-spin" />}
            Confirm Transfer
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main AllocationTabContent ────────────────────────────────────────────────

export function AllocationTabContent({ buildingAssetId }: Props) {
  const assetId = Number(buildingAssetId);
  const [allocations, setAllocations] = useState<DepartmentRoomAllocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("current");
  const [showAllocateForm, setShowAllocateForm] = useState(false);
  const [transferRow, setTransferRow] = useState<DepartmentRoomAllocation | null>(null);
  const [historyRow, setHistoryRow] = useState<DepartmentRoomAllocation | null>(null);
  const [roomHistory, setRoomHistory] = useState<DepartmentRoomAllocation[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [departments, setDepartments] = useState<{ id: number; departmentName: string }[]>([]);
  const [floors, setFloors] = useState<{ id: number; floorName: string }[]>([]);

  const loadAllocations = useCallback(async () => {
    setLoading(true);
    const statusFilter = viewMode === "current" ? "Active" : undefined;
    const res = await getAllocationsAction(assetId, statusFilter);
    if (res.success && res.data) setAllocations(res.data);
    else setAllocations([]);
    setLoading(false);
  }, [assetId, viewMode]);

  useEffect(() => { loadAllocations(); }, [loadAllocations]);

  useEffect(() => {
    // Load departments using Server Action
    getDepartmentsListAction().then((res) => {
      if (res.success && res.data) {
        setDepartments(res.data);
      }
    });

    // Load floors using Server Action
    getFloorsListAction(assetId).then((res) => {
      if (res.success && res.data) {
        setFloors(res.data);
      }
    });
  }, [assetId]);

  const handleVacate = async (ids: number[]) => {
    const res = await vacateDepartmentAction(ids);
    if (res.success) { toast.success("Room vacated."); loadAllocations(); }
    else toast.error(res.message ?? "Failed.");
  };

  const handleShowHistory = async (row: DepartmentRoomAllocation) => {
    setHistoryRow(row);
    setHistoryLoading(true);
    const res = await getRoomHistoryAction(
      row.floorDetailId,
      row.roomAssetId,
      row.roomDescription
    );
    setRoomHistory(res.data ?? []);
    setHistoryLoading(false);
  };

  const currentCount = allocations.filter(a => a.status === "Active").length;
  const vacantFloors = floors.length > 0
    ? floors.filter(f => !allocations.some(a => a.floorDetailId === f.id && a.status === "Active")).length
    : null;

  return (
    <div className="space-y-3">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Building2 className="size-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Department / Tenant Allocations</h3>
            <p className="text-[10px] text-slate-500">Track who occupies which floor and room — with full shift history.</p>
          </div>
        </div>
        <button
          onClick={() => setShowAllocateForm(v => !v)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm"
        >
          <Plus className="size-3.5" /> Allocate Room
        </button>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Active Allocations", value: currentCount, color: "emerald" },
          { label: "Floors Configured", value: floors.length, color: "blue" },
          { label: "Vacant Floors", value: vacantFloors ?? "—", color: "amber" },
        ].map(s => (
          <div key={s.label} className={`bg-${s.color}-50 border border-${s.color}-100 rounded-xl p-3`}>
            <p className={`text-lg font-black text-${s.color}-700`}>{s.value}</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Allocate form */}
      {showAllocateForm && (
        <AllocateForm
          buildingAssetId={assetId}
          departments={departments}
          floors={floors}
          onSave={() => { setShowAllocateForm(false); loadAllocations(); }}
          onCancel={() => setShowAllocateForm(false)}
        />
      )}

      {/* View toggle */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {(["current", "history"] as ViewMode[]).map(m => (
          <button
            key={m}
            onClick={() => setViewMode(m)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors capitalize ${viewMode === m ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            {m === "current" ? "Current Occupancy" : "All History"}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="size-6 animate-spin text-blue-500" />
        </div>
      ) : allocations.length === 0 ? (
        <div className="py-12 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
          <AlertCircle className="size-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-500">No allocations found</p>
          <p className="text-xs text-slate-400 mt-1">Click "Allocate Room" to assign a department or tenant.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-800 text-slate-200">
                {["Floor", "Room / Space", "Occupant", "Period", "Status", "Actions"].map(h => (
                  <th key={h} className="px-3 py-2.5 text-[10px] font-black uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allocations.map(row => (
                <AllocationRow
                  key={row.id}
                  row={row}
                  onVacate={handleVacate}
                  onTransfer={r => setTransferRow(r)}
                  showHistory={handleShowHistory}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Transfer modal */}
      {transferRow && (
        <TransferModal
          row={transferRow}
          floors={floors}
          onSave={() => { setTransferRow(null); loadAllocations(); }}
          onCancel={() => setTransferRow(null)}
        />
      )}

      {/* Room history panel */}
      {historyRow && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg p-5 space-y-3 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <History className="size-4 text-blue-600" />
                Occupancy History — {historyRow.roomAssetName ?? historyRow.roomDescription ?? "Room"}
              </h3>
              <button onClick={() => setHistoryRow(null)} className="text-slate-400 hover:text-slate-600 text-xs font-semibold">Close</button>
            </div>
            <p className="text-[10px] text-slate-500">{historyRow.floorName}</p>
            <div className="overflow-y-auto flex-1">
              {historyLoading ? (
                <div className="flex justify-center py-8"><Loader2 className="size-5 animate-spin text-blue-500" /></div>
              ) : roomHistory.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">No history found.</p>
              ) : (
                <div className="space-y-2">
                  {roomHistory.map((h) => (
                    <div key={h.id} className={`p-3 rounded-xl border ${h.status === "Active" ? "border-emerald-200 bg-emerald-50" : "border-slate-100 bg-slate-50"}`}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">
                          {h.allocationType === "Department" ? h.departmentName : h.tenantName}
                        </span>
                        <StatusBadge status={h.status} />
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1">
                        {new Date(h.allocationFrom).toLocaleDateString("en-IN")} →{" "}
                        {h.allocationTo ? new Date(h.allocationTo).toLocaleDateString("en-IN") : "Present"}
                      </p>
                      {h.remarks && <p className="text-[10px] text-slate-400 mt-0.5 italic">{h.remarks}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
