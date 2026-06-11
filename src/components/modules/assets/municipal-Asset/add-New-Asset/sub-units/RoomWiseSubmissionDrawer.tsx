"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2, Edit2, Layers, Scissors, EyeIcon } from "lucide-react";
import { Input } from "@/components/common";

interface OffsetEntry {
  id: string;
  shape: string;
  length: number;
  width: number;
  height: number;
  base1: number;
  base2: number;
  radius: number;
  areaSqM: number;
  op: "Add" | "Subtract";
}

interface Room {
  id: string;
  roomNo: string;
  roomType: string;
  shape: string;
  // Main dimensions (meters)
  length: number; width: number; height: number;
  base1: number; base2: number; radius: number;
  // Calculated from main dimensions
  areaSqM: number; areaSqFt: number;
  // Offset/cutout within this room (deducted from areaSqM)
  offsetShape: string;
  offsetLength: number; offsetWidth: number; offsetHeight: number;
  offsetBase1: number; offsetBase2: number; offsetRadius: number;
  offsetAreaSqM: number;    // auto-calculated cutout area
  hasOffset: "No" | "Yes"; // whether this room has a cutout
  offsetOp?: "Add" | "Subtract"; // add or subtract offset
  offsets?: OffsetEntry[]; // list of multiple offset cutouts
  // Net area = areaSqM - offsetAreaSqM
  netAreaSqM: number; netAreaSqFt: number;
  count: number;
  // Outer=Yes → counted at 50% towards carpet (e.g. balcony, terrace)
  outer: "No" | "Yes";
  // Minus=Yes → entire room deducted from building carpet total
  minus: "No" | "Yes";
}

const ROOM_TYPES = [
  "Bed Room", "Living Room", "Kitchen", "Toilet", "Bathroom",
  "Balcony", "Passage", "Shop Front", "Storage", "Office Room",
  "Verandah", "Hall", "Dining Room", "Study Room",
];

const SHAPES = [
  { value: "Rectangle", label: "Rectangle" },
  { value: "Square", label: "Square" },
  { value: "Triangle", label: "Triangle" },
  { value: "Trapezoid", label: "Trapezoid" },
  { value: "Circle", label: "Circle" },
  { value: "Semi Circle", label: "Semi Circle" },
  { value: "Quarter", label: "Quarter Circle" },
];

// ── Area formula ──────────────────────────────────────────────────────────────

function calcAreaSqM(shape: string, L = 0, W = 0, H = 0, B1 = 0, B2 = 0, R = 0): number {
  switch (shape) {
    case "Rectangle": return L * W;
    case "Square": return L * L;
    case "Triangle": return 0.5 * L * H;
    case "Trapezoid": return 0.5 * (B1 + B2) * H;
    case "Circle": return Math.PI * R * R;
    case "Semi Circle": return 0.5 * Math.PI * R * R;
    case "Quarter": return 0.25 * Math.PI * R * R;
    default: return L * W;
  }
}
const sqmToSqft = (v: number) => v * 10.7639;

function formulaText(shape: string, L = 0, W = 0, H = 0, B1 = 0, B2 = 0, R = 0): string {
  switch (shape) {
    case "Rectangle": return `L×W = ${L}×${W} = ${(L * W).toFixed(2)} sq.m`;
    case "Square": return `Side² = (${L}m)² = ${(L * L).toFixed(2)} sq.m`;
    case "Triangle": return `½BH = ½×${L}×${H} = ${(0.5 * L * H).toFixed(2)} sq.m`;
    case "Trapezoid": return `½(B1+B2)H = ½×(${B1}+${B2})×${H} = ${(0.5 * (B1 + B2) * H).toFixed(2)} sq.m`;
    case "Circle": return `πr² = π×${R}² = ${(Math.PI * R * R).toFixed(2)} sq.m`;
    case "Semi Circle": return `½πr² = ${(0.5 * Math.PI * R * R).toFixed(2)} sq.m`;
    case "Quarter": return `¼πr² = ${(0.25 * Math.PI * R * R).toFixed(2)} sq.m`;
    default: return "";
  }
}

type DimKey = "length" | "width" | "height" | "base1" | "base2" | "radius";
function getDimFields(shape: string): { key: DimKey; label: string }[] {
  switch (shape) {
    case "Rectangle": return [{ key: "length", label: "Length (m)" }, { key: "width", label: "Width (m)" }];
    case "Square": return [{ key: "length", label: "Side (m)" }];
    case "Triangle": return [{ key: "length", label: "Base (m)" }, { key: "height", label: "Height (m)" }];
    case "Trapezoid": return [{ key: "base1", label: "Base 1 (m)" }, { key: "base2", label: "Base 2 (m)" }, { key: "height", label: "Height (m)" }];
    default: return [{ key: "radius", label: "Radius (m)" }]; // Circle/Semi/Quarter
  }
}

function ShapePreview({ shape, areaSqFt }: { shape: string; areaSqFt: number }) {
  const label = `${areaSqFt > 0 ? areaSqFt.toFixed(2) : "0"} SqFt`;
  const f = "rgba(59,130,246,0.12)", s = "#3b82f6";
  const lbl = <text x="50" y="54" fill="#60a5fa" fontSize="7" fontWeight="bold" textAnchor="middle">{label}</text>;
  switch (shape) {
    case "Square": return <svg viewBox="0 0 100 100" className="w-28 h-28"><rect x="25" y="25" width="50" height="50" fill={f} stroke={s} strokeWidth={2} />{lbl}</svg>;
    case "Triangle": return <svg viewBox="0 0 100 100" className="w-28 h-28"><polygon points="50,20 80,80 20,80" fill={f} stroke={s} strokeWidth={2} />{lbl}</svg>;
    case "Trapezoid": return <svg viewBox="0 0 100 100" className="w-28 h-28"><polygon points="30,25 70,25 85,75 15,75" fill={f} stroke={s} strokeWidth={2} />{lbl}</svg>;
    case "Circle": return <svg viewBox="0 0 100 100" className="w-28 h-28"><circle cx="50" cy="50" r="32" fill={f} stroke={s} strokeWidth={2} />{lbl}</svg>;
    case "Semi Circle": return <svg viewBox="0 0 100 100" className="w-28 h-28"><path d="M 18 55 A 32 32 0 0 1 82 55 Z" fill={f} stroke={s} strokeWidth={2} />{lbl}</svg>;
    case "Quarter": return <svg viewBox="0 0 100 100" className="w-28 h-28"><path d="M 50 50 L 82 50 A 32 32 0 0 0 50 18 Z" fill={f} stroke={s} strokeWidth={2} />{lbl}</svg>;
    default: return <svg viewBox="0 0 100 100" className="w-28 h-28"><rect x="18" y="30" width="64" height="40" fill={f} stroke={s} strokeWidth={2} />{lbl}</svg>;
  }
}

function makeId() {
  return typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID() : `r-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

function blankRoom(no: number): Room {
  return {
    id: makeId(), roomNo: String(no), roomType: "Bed Room", shape: "Rectangle",
    length: 0, width: 0, height: 0, base1: 0, base2: 0, radius: 0,
    areaSqM: 0, areaSqFt: 0,
    offsetShape: "Rectangle", offsetLength: 0, offsetWidth: 0, offsetHeight: 0,
    offsetBase1: 0, offsetBase2: 0, offsetRadius: 0,
    offsetAreaSqM: 0, hasOffset: "No",
    offsetOp: "Subtract",
    offsets: [],
    netAreaSqM: 0, netAreaSqFt: 0,
    count: 1, outer: "No", minus: "No",
  };
}

function computeRoom(r: Room): Room {
  const mainSqM = calcAreaSqM(r.shape, r.length, r.width, r.height, r.base1, r.base2, r.radius);

  let netAdjustmentSqM = 0;
  let totalAddSqM = 0;
  let totalSubtractSqM = 0;

  if (Array.isArray(r.offsets) && r.offsets.length > 0) {
    r.offsets.forEach((off) => {
      const offArea = calcAreaSqM(off.shape, off.length, off.width, off.height, off.base1, off.base2, off.radius);
      if (off.op === "Add") {
        netAdjustmentSqM += offArea;
        totalAddSqM += offArea;
      } else {
        netAdjustmentSqM -= offArea;
        totalSubtractSqM += offArea;
      }
    });
  } else if (r.hasOffset === "Yes") {
    // Fallback to legacy fields
    const offSqM = calcAreaSqM(r.offsetShape, r.offsetLength, r.offsetWidth, r.offsetHeight, r.offsetBase1, r.offsetBase2, r.offsetRadius);
    if (r.offsetOp === "Add") {
      netAdjustmentSqM += offSqM;
      totalAddSqM += offSqM;
    } else {
      netAdjustmentSqM -= offSqM;
      totalSubtractSqM += offSqM;
    }
  }

  const netSqM = Math.max(0, mainSqM + netAdjustmentSqM);
  const firstOffset = r.offsets && r.offsets.length > 0 ? r.offsets[0] : null;

  return {
    ...r,
    areaSqM: mainSqM,
    areaSqFt: sqmToSqft(mainSqM),
    // Map first offset to single fields for compatibility
    offsetShape: firstOffset ? firstOffset.shape : r.offsetShape || "Rectangle",
    offsetLength: firstOffset ? firstOffset.length : r.offsetLength || 0,
    offsetWidth: firstOffset ? firstOffset.width : r.offsetWidth || 0,
    offsetHeight: firstOffset ? firstOffset.height : r.offsetHeight || 0,
    offsetBase1: firstOffset ? firstOffset.base1 : r.offsetBase1 || 0,
    offsetBase2: firstOffset ? firstOffset.base2 : r.offsetBase2 || 0,
    offsetRadius: firstOffset ? firstOffset.radius : r.offsetRadius || 0,
    offsetAreaSqM: Math.abs(netAdjustmentSqM),
    offsetOp: netAdjustmentSqM >= 0 ? "Add" : "Subtract",
    hasOffset: (r.offsets && r.offsets.length > 0) || r.hasOffset === "Yes" ? "Yes" : "No",
    netAreaSqM: netSqM,
    netAreaSqFt: sqmToSqft(netSqM),
  };
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface RoomWiseSubmissionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  unit: any;
  onSaveRooms: (rooms: Room[], calculatedAreaSqFt: number) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function RoomWiseSubmissionDrawer({ isOpen, onClose, unit, onSaveRooms }: RoomWiseSubmissionDrawerProps) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [form, setForm] = useState<Room>(blankRoom(1));
  const [editingId, setEditingId] = useState<string | null>(null);
  // Offset popup state
  const [offsetPopupRoomId, setOffsetPopupRoomId] = useState<string | null>(null); // null = closed
  const [isFormOffsetOpen, setIsFormOffsetOpen] = useState(false);

  // Offset popup room
  const offsetRoom = offsetPopupRoomId
    ? rooms.find((r) => r.id === offsetPopupRoomId)
    : isFormOffsetOpen
      ? form
      : null;

  // Temp offset inputs state (for uncommitted drawer details)
  const [tempOffsetShape, setTempOffsetShape] = useState<string>("Rectangle");
  const [tempOffsetLength, setTempOffsetLength] = useState<number>(0);
  const [tempOffsetWidth, setTempOffsetWidth] = useState<number>(0);
  const [tempOffsetHeight, setTempOffsetHeight] = useState<number>(0);
  const [tempOffsetBase1, setTempOffsetBase1] = useState<number>(0);
  const [tempOffsetBase2, setTempOffsetBase2] = useState<number>(0);
  const [tempOffsetRadius, setTempOffsetRadius] = useState<number>(0);
  const [tempOffsetOp, setTempOffsetOp] = useState<"Add" | "Subtract">("Subtract");

  // List of offsets currently being edited inside the drawer (committed to room on OK)
  const [drawerOffsets, setDrawerOffsets] = useState<OffsetEntry[]>([]);

  // Populate temp state from room when drawer opens or changes
  useEffect(() => {
    if (offsetRoom) {
      setDrawerOffsets(Array.isArray(offsetRoom.offsets) ? offsetRoom.offsets : []);
      setTempOffsetShape("Rectangle");
      setTempOffsetLength(0);
      setTempOffsetWidth(0);
      setTempOffsetHeight(0);
      setTempOffsetBase1(0);
      setTempOffsetBase2(0);
      setTempOffsetRadius(0);
      setTempOffsetOp("Subtract");
    } else {
      setDrawerOffsets([]);
    }
  }, [offsetPopupRoomId, isFormOffsetOpen, offsetRoom?.id, isOpen]);

  useEffect(() => {
    if (!isOpen || !unit) return;
    const existing: Room[] = Array.isArray(unit.rooms)
      ? unit.rooms.map((r: any) => {
        let rOffsets = Array.isArray(r.offsets) ? r.offsets.map((off: any) => ({
          id: off.id || makeId(),
          shape: off.shape || "Rectangle",
          length: Number(off.length || 0),
          width: Number(off.width || 0),
          height: Number(off.height || 0),
          base1: Number(off.base1 || 0),
          base2: Number(off.base2 || 0),
          radius: Number(off.radius || 0),
          areaSqM: Number(off.areaSqM || 0),
          op: off.op || "Subtract",
        })) : [];

        // Migrate legacy single offset to the list if offsets is empty
        if (rOffsets.length === 0 && r.hasOffset === "Yes") {
          const legacyArea = calcAreaSqM(
            r.offsetShape || "Rectangle",
            Number(r.offsetLength || 0),
            Number(r.offsetWidth || 0),
            Number(r.offsetHeight || 0),
            Number(r.offsetBase1 || 0),
            Number(r.offsetBase2 || 0),
            Number(r.offsetRadius || 0)
          );
          if (legacyArea > 0) {
            rOffsets = [{
              id: makeId(),
              shape: r.offsetShape || "Rectangle",
              length: Number(r.offsetLength || 0),
              width: Number(r.offsetWidth || 0),
              height: Number(r.offsetHeight || 0),
              base1: Number(r.offsetBase1 || 0),
              base2: Number(r.offsetBase2 || 0),
              radius: Number(r.offsetRadius || 0),
              areaSqM: legacyArea,
              op: r.offsetOp || "Subtract",
            }];
          }
        }

        return computeRoom({
          ...blankRoom(1),
          id: r.id || makeId(),
          roomNo: String(r.roomNo ?? ""), roomType: String(r.roomType ?? "Bed Room"),
          shape: String(r.shape ?? "Rectangle"),
          length: Number(r.length || 0), width: Number(r.width || 0), height: Number(r.height || 0),
          base1: Number(r.base1 || 0), base2: Number(r.base2 || 0), radius: Number(r.radius || 0),
          count: Number(r.count ?? 1),
          outer: (r.outer === "Yes" || r.outer === true) ? "Yes" : "No",
          minus: (r.minus === "Yes" || r.offset === "Yes") ? "Yes" : "No",
          hasOffset: r.hasOffset === "Yes" ? "Yes" : "No",
          offsetShape: r.offsetShape || "Rectangle",
          offsetLength: Number(r.offsetLength || 0), offsetWidth: Number(r.offsetWidth || 0),
          offsetHeight: Number(r.offsetHeight || 0), offsetBase1: Number(r.offsetBase1 || 0),
          offsetBase2: Number(r.offsetBase2 || 0), offsetRadius: Number(r.offsetRadius || 0),
          offsetOp: r.offsetOp || "Subtract",
          offsets: rOffsets,
        });
      })
      : [];
    setRooms(existing);
    setForm(blankRoom(existing.length + 1));
    setEditingId(null);
    setIsFormOffsetOpen(false);
  }, [isOpen, unit]);

  if (!isOpen) return null;

  // Update a main dimension field on the form
  const setMainDim = (key: DimKey, val: string) => {
    setForm((prev) => {
      const next = { ...prev, [key]: parseFloat(val) || 0 };
      return computeRoom(next);
    });
  };

  // Change shape (resets dimensions)
  const setShape = (shape: string) => {
    setForm((prev) => computeRoom({ ...prev, shape, length: 0, width: 0, height: 0, base1: 0, base2: 0, radius: 0 }));
  };

  // Temp calculated area for offset
  const tempOffsetAreaSqM = calcAreaSqM(
    tempOffsetShape,
    tempOffsetLength,
    tempOffsetWidth,
    tempOffsetHeight,
    tempOffsetBase1,
    tempOffsetBase2,
    tempOffsetRadius
  );

  // Net adjustment sum for all entries in drawer
  const drawerNetAdjustmentSqM = drawerOffsets.reduce((acc, off) => {
    return acc + off.areaSqM * (off.op === "Add" ? 1 : -1);
  }, 0);

  // Append uncommitted offset to the temporary drawerOffsets list
  const handleAddOffsetToHistory = () => {
    if (tempOffsetAreaSqM <= 0) {
      alert("Please enter valid dimensions for the offset.");
      return;
    }
    const newEntry: OffsetEntry = {
      id: makeId(),
      shape: tempOffsetShape,
      length: tempOffsetLength,
      width: tempOffsetWidth,
      height: tempOffsetHeight,
      base1: tempOffsetBase1,
      base2: tempOffsetBase2,
      radius: tempOffsetRadius,
      areaSqM: tempOffsetAreaSqM,
      op: tempOffsetOp,
    };
    setDrawerOffsets((prev) => [...prev, newEntry]);

    // Reset temp inputs
    setTempOffsetLength(0);
    setTempOffsetWidth(0);
    setTempOffsetHeight(0);
    setTempOffsetBase1(0);
    setTempOffsetBase2(0);
    setTempOffsetRadius(0);
  };

  // Remove specific offset entry from temporary list
  const handleRemoveOffsetFromHistory = (entryId: string) => {
    setDrawerOffsets((prev) => prev.filter((off) => off.id !== entryId));
  };

  // Commit drawerOffsets array to room state and close drawer
  const handleOkSave = () => {
    if (isFormOffsetOpen && form.id === offsetRoom?.id) {
      setForm((prev) => computeRoom({
        ...prev,
        hasOffset: drawerOffsets.length > 0 ? "Yes" : "No",
        offsets: drawerOffsets,
      }));
    } else if (offsetPopupRoomId) {
      setRooms((prev) => prev.map((r) => {
        if (r.id !== offsetPopupRoomId) return r;
        return computeRoom({
          ...r,
          hasOffset: drawerOffsets.length > 0 ? "Yes" : "No",
          offsets: drawerOffsets,
        });
      }));
    }
    setOffsetPopupRoomId(null);
    setIsFormOffsetOpen(false);
  };

  // Close drawer without committing changes
  const handleDrawerClose = () => {
    setOffsetPopupRoomId(null);
    setIsFormOffsetOpen(false);
  };

  // Add/update room
  const handleAdd = () => {
    if (form.areaSqM <= 0) { alert("Enter valid dimensions (area must be > 0)."); return; }
    const computed = computeRoom(form);
    if (editingId) {
      setRooms((prev) => prev.map((r) => r.id === editingId ? { ...computed, id: editingId } : r));
      setEditingId(null);
    } else {
      setRooms((prev) => [...prev, { ...computed, id: makeId() }]);
    }
    setForm(blankRoom(rooms.length + (editingId ? 1 : 2)));
    setIsFormOffsetOpen(false);
  };

  const handleEdit = (r: Room) => {
    setEditingId(r.id);
    setForm({ ...r });
    setIsFormOffsetOpen(r.hasOffset === "Yes");
  };
  const handleDelete = (id: string) => {
    setRooms((prev) => prev.filter((r) => r.id !== id));
    if (editingId === id) { setEditingId(null); setForm(blankRoom(rooms.length)); setIsFormOffsetOpen(false); }
    if (offsetPopupRoomId === id) setOffsetPopupRoomId(null);
  };

  // Toggle offset: Yes → open popup immediately; No → clear offset and close popup
  const toggleOffset = (roomId: string, val: "Yes" | "No") => {
    setRooms((prev) => prev.map((r) => {
      if (r.id !== roomId) return r;
      if (val === "No") {
        return computeRoom({
          ...r, hasOffset: "No", offsetAreaSqM: 0,
          offsetLength: 0, offsetWidth: 0, offsetHeight: 0, offsetBase1: 0, offsetBase2: 0, offsetRadius: 0
        });
      }
      return { ...r, hasOffset: "Yes" };
    }));
    if (val === "Yes") setOffsetPopupRoomId(roomId);
    else setOffsetPopupRoomId(null);
  };

  const handleFormOffsetToggle = (val: "Yes" | "No") => {
    if (val === "No") {
      setForm((prev) => computeRoom({
        ...prev,
        hasOffset: "No",
        offsetAreaSqM: 0,
        offsetLength: 0, offsetWidth: 0, offsetHeight: 0,
        offsetBase1: 0, offsetBase2: 0, offsetRadius: 0
      }));
      setIsFormOffsetOpen(false);
    } else {
      setForm((prev) => computeRoom({ ...prev, hasOffset: "Yes" }));
      setIsFormOffsetOpen(true);
    }
  };

  // ── Area totals ──────────────────────────────────────────────────────────────
  // Outer=Yes → 80% counted (20% deduction — e.g. balcony, terrace)
  // Minus=Yes → entire net area DEDUCTED from carpet total
  const carpetSqM = rooms.reduce((acc, r) => {
    const netA = r.netAreaSqM * r.count;
    if (r.minus === "Yes") return acc - netA;           // full deduction
    if (r.outer === "Yes") return acc + netA * 0.8;     // 20% deduction for outer areas
    return acc + netA;                                   // 100% for regular rooms
  }, 0);
  const builtUpSqM = Math.max(0, carpetSqM) * 1.2;
  const carpetSqFt = sqmToSqft(Math.max(0, carpetSqM));
  const builtUpSqFt = sqmToSqft(builtUpSqM);

  const dimFields = getDimFields(form.shape);
  const inp = "h-8 text-xs";



  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-6xl bg-slate-50 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-blue-600 border-b border-blue-700 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-white/20 rounded-lg"><Layers className="size-4 text-white" /></div>
            <div>
              <h2 className="text-sm font-black text-white uppercase tracking-wider">Room-Wise Submission</h2>
              <p className="text-[9px] text-blue-100 font-bold uppercase tracking-widest mt-0.5">
                Enter dimensions → area auto-calculated | Outer=−20% | Offset=Cutout
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-blue-700 rounded-lg text-blue-100 hover:text-white"><X className="size-4" /></button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* Left: Form + Table */}
            <div className="lg:col-span-2 space-y-4">

              {/* Add Room Form */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <Plus className="size-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    {editingId ? "Edit Room" : "Add New Room"}
                  </span>
                </div>

                {/* Row 1 */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-0.5">Room No</label>
                    <Input type="text" value={form.roomNo} onChange={(e) => setForm((p) => ({ ...p, roomNo: e.target.value }))} className={inp} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-0.5">Room Type</label>
                    <select value={form.roomType} onChange={(e) => setForm((p) => ({ ...p, roomType: e.target.value }))}
                      className={`${inp} w-full rounded-lg border border-slate-300 bg-white px-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200`}>
                      {ROOM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-0.5">Shape</label>
                    <select value={form.shape} onChange={(e) => setShape(e.target.value)}
                      className={`${inp} w-full rounded-lg border border-slate-300 bg-white px-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200`}>
                      {SHAPES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </div>
                </div>

                {/* Row 2: Dimensions */}
                <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(dimFields.length + 2, 5)}, 1fr)` }}>
                  {dimFields.map((df) => (
                    <div key={df.key} className="min-w-0">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-0.5">{df.label}</label>
                      <Input type="number" min={0}
                        value={(form[df.key as keyof Room] as number) === 0 ? "" : (form[df.key as keyof Room] as number)}
                        onChange={(e) => setMainDim(df.key as DimKey, e.target.value)}
                        onFocus={(e) => e.target.select()} className={`${inp} w-full`} placeholder="0" />
                    </div>
                  ))}
                  <div className="min-w-0">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-0.5">Area (Sq.M) </label>
                    <Input type="text" readOnly value={form.areaSqM.toFixed(4)} className={`${inp} bg-emerald-50 border-emerald-200 text-emerald-700 font-bold cursor-default w-full`} />
                  </div>
                  <div className="min-w-0">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-0.5">Area (SqFt)</label>
                    <Input type="text" readOnly value={form.areaSqFt.toFixed(2)} className={`${inp} bg-slate-50 text-slate-600 font-mono cursor-default w-full`} />
                  </div>
                </div>

                {/* Row 3: Count, Outer, Offset, Minus, Total */}
                <div className="grid grid-cols-5 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-0.5">Room Count</label>
                    <Input type="number" min={1}
                      value={form.count === 0 ? "" : form.count}
                      onChange={(e) => setForm((p) => computeRoom({ ...p, count: Math.max(1, Number(e.target.value)) }))}
                      onFocus={(e) => e.target.select()} className={inp} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-blue-600 uppercase tracking-wide mb-0.5">Outer (−20%)</label>
                    <select value={form.outer} onChange={(e) => setForm((p) => ({ ...p, outer: e.target.value as "Yes" | "No" }))}
                      className={`${inp} w-full rounded-lg border px-2 focus:outline-none focus:ring-2 focus:ring-blue-200 ${form.outer === "Yes" ? "border-blue-300 bg-blue-50 text-blue-700 font-bold" : "border-slate-300 bg-white text-slate-700"}`}>
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-amber-600 uppercase tracking-wide mb-0.5">Offset (Cutout)</label>
                    <select value={form.hasOffset} onChange={(e) => handleFormOffsetToggle(e.target.value as "Yes" | "No")}
                      className={`${inp} w-full rounded-lg border px-2 focus:outline-none focus:ring-2 focus:ring-amber-200 ${form.hasOffset === "Yes" ? "border-amber-300 bg-amber-50 text-amber-700 font-bold" : "border-slate-300 bg-white text-slate-700"}`}>
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                    {form.hasOffset === "Yes" && (
                      <button
                        type="button"
                        onClick={() => setIsFormOffsetOpen(true)}
                        className="text-[9px] text-amber-600 hover:text-amber-700 font-black uppercase flex items-center gap-0.5 mt-1 transition-colors mx-auto"
                      >
                        <EyeIcon className="size-7.5" /> See Offset
                      </button>
                    )}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-red-500 uppercase tracking-wide mb-0.5">Minus (deduct all)</label>
                    <select value={form.minus} onChange={(e) => setForm((p) => ({ ...p, minus: e.target.value as "Yes" | "No" }))}
                      className={`${inp} w-full rounded-lg border px-2 focus:outline-none focus:ring-2 focus:ring-red-200 ${form.minus === "Yes" ? "border-red-300 bg-red-50 text-red-700 font-bold" : "border-slate-300 bg-white text-slate-700"}`}>
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-0.5">Net Total (Sq.M)</label>
                    <Input type="text" readOnly
                      value={(form.netAreaSqM * form.count).toFixed(4)}
                      className={`${inp} bg-blue-50 border-blue-200 text-blue-700 font-bold cursor-default`} />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1 border-t border-slate-100">
                  {editingId && (
                    <button type="button" onClick={() => { setEditingId(null); setForm(blankRoom(rooms.length + 1)); }}
                      className="h-8 px-4 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-[10px] font-bold uppercase">Cancel</button>
                  )}
                  <button type="button" onClick={handleAdd}
                    className="h-8 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-1.5 text-[10px] font-black uppercase shadow-sm">
                    <Plus className="size-3.5" />{editingId ? "Update Room" : "Add Room"}
                  </button>
                </div>
              </div>

              {/* Room Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Configured Rooms ({rooms.length})</span>
                  <span className="text-[9px] text-slate-400">Outer rooms count at 50% • Minus rooms deducted • Offset = cutout from room</span>
                </div>
                <div className="overflow-x-auto max-h-[260px] overflow-y-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 sticky top-0 border-b border-slate-200">
                      <tr className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                        <th className="px-2 py-2">No</th>
                        <th className="px-2 py-2">Type</th>
                        <th className="px-2 py-2">Shape</th>
                        <th className="px-2 py-2 text-right">Area(m²)</th>
                        <th className="px-2 py-2 text-center">Offset Cutout</th>
                        <th className="px-2 py-2 text-right">Net(m²)</th>
                        <th className="px-2 py-2 text-center">Cnt</th>
                        <th className="px-2 py-2 text-center">Outer</th>
                        <th className="px-2 py-2 text-center">Minus</th>
                        <th className="px-2 py-2 text-right">Total(m²)</th>
                        <th className="px-2 py-2 text-center">Act</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {rooms.length === 0 ? (
                        <tr><td colSpan={11} className="px-3 py-6 text-center text-slate-400">No rooms added yet</td></tr>
                      ) : rooms.map((r) => (
                        <tr key={r.id} className={`hover:bg-slate-50 ${r.minus === "Yes" ? "bg-red-50/30" : r.outer === "Yes" ? "bg-blue-50/20" : ""}`}>
                          <td className="px-2 py-1.5 font-bold text-slate-800">{r.roomNo}</td>
                          <td className="px-2 py-1.5 font-black text-slate-900 text-[10px] uppercase">{r.roomType}</td>
                          <td className="px-2 py-1.5">
                            <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 rounded text-[9px] font-bold uppercase">
                              {r.shape}
                            </span>
                          </td>
                          <td className="px-2 py-1.5 text-right font-mono font-bold text-slate-700 text-[10px]">{r.areaSqM.toFixed(2)}</td>
                          <td className="px-2 py-1.5 text-center">
                            {/* Offset toggle — Yes opens popup */}
                            <button
                              type="button"
                              onClick={() => toggleOffset(r.id, r.hasOffset === "Yes" ? "No" : "Yes")}
                              className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border flex items-center gap-1 mx-auto transition-colors ${r.hasOffset === "Yes"
                                ? "bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100"
                                : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                                }`}
                            >
                              <Scissors className="size-2.5" />
                              {r.hasOffset === "Yes" ? `${r.offsetOp === "Add" ? "+" : "−"}${r.offsetAreaSqM.toFixed(2)}m²` : "No"}
                            </button>
                          </td>
                          <td className={`px-2 py-1.5 text-right font-mono font-bold text-[10px] ${r.hasOffset === "Yes" ? "text-amber-800" : "text-slate-800"}`}>
                            {r.netAreaSqM.toFixed(2)}
                          </td>
                          <td className="px-2 py-1.5 text-center font-bold text-slate-800">{r.count}</td>
                          <td className="px-2 py-1.5 text-center">
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${r.outer === "Yes" ? "bg-blue-50 text-blue-700 border border-blue-200" : "bg-slate-50 text-slate-500"}`}>
                              {r.outer === "Yes" ? "−20%" : "No"}
                            </span>
                          </td>
                          <td className="px-2 py-1.5 text-center">
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${r.minus === "Yes" ? "bg-red-50 text-red-700 border border-red-200" : "bg-slate-50 text-slate-500"}`}>{r.minus}</span>
                          </td>
                          <td className={`px-2 py-1.5 text-right font-mono font-bold text-[10px] ${r.minus === "Yes" ? "text-red-700" : r.outer === "Yes" ? "text-blue-700" : "text-slate-900"}`}>
                            {r.minus === "Yes" ? "-" : r.outer === "Yes" ? "×0.8=" : ""}
                            {r.minus === "Yes"
                              ? (r.netAreaSqM * r.count).toFixed(2)
                              : r.outer === "Yes"
                                ? (r.netAreaSqM * r.count * 0.8).toFixed(2)
                                : (r.netAreaSqM * r.count).toFixed(2)}
                          </td>
                          <td className="px-2 py-1.5 text-center flex gap-1 justify-center">
                            <button onClick={() => handleEdit(r)} className="p-1 hover:bg-blue-50 rounded text-blue-600"><Edit2 className="size-3" /></button>
                            <button onClick={() => handleDelete(r.id)} className="p-1 hover:bg-red-50 rounded text-red-400"><Trash2 className="size-3" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-3 py-2 bg-slate-100 border-t border-slate-200 flex justify-between items-center text-xs font-bold text-slate-700">
                  <span>TOTAL ROOMS: {rooms.reduce((s, r) => s + r.count, 0)}</span>
                  <div className="flex gap-4">
                    <span>CARPET: <span className="text-blue-700">{carpetSqM.toFixed(2)} m² ({carpetSqFt.toFixed(2)} SqFt)</span></span>
                    <span>BUILT-UP: <span className="text-emerald-700">{builtUpSqM.toFixed(2)} m² ({builtUpSqFt.toFixed(2)} SqFt)</span></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Shape preview */}
            <div className="lg:col-span-1">
              <div className="bg-slate-900 text-slate-100 rounded-xl p-4 flex flex-col min-h-80 justify-between border border-slate-800 shadow-lg">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Shape Preview</span>
                  <span className="px-2 py-0.5 bg-blue-900/50 text-blue-400 border border-blue-800/40 rounded text-[9px] font-bold uppercase">
                    {form.roomType} #{form.roomNo}
                  </span>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center py-4">
                  <ShapePreview shape={form.shape} areaSqFt={form.areaSqFt} />
                </div>
                <div className="text-center border-t border-slate-800/60 pt-2 space-y-1">
                  <p className="text-[9px] text-slate-500 font-mono">
                    {formulaText(form.shape, form.length, form.width, form.height, form.base1, form.base2, form.radius)}
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">
                    {form.shape} • {form.areaSqM.toFixed(2)} m² • {form.areaSqFt.toFixed(2)} SqFt
                  </p>
                  {form.outer === "Yes" && (
                    <p className="text-[9px] text-blue-400 font-bold">Outer → 20% deduction → counts 80% = {(form.areaSqM * 0.8).toFixed(2)} m²</p>
                  )}
                  {form.hasOffset === "Yes" && (
                    <p className="text-[9px] text-amber-500 font-bold">
                      Offset ({(form.offsetOp || "Subtract") === "Add" ? "Added" : "Deducted"}) = {(form.offsetOp || "Subtract") === "Add" ? "+" : "−"}{form.offsetAreaSqM.toFixed(2)} m² (Net = {form.netAreaSqM.toFixed(2)} m²)
                    </p>
                  )}
                  {form.minus === "Yes" && (
                    <p className="text-[9px] text-red-400 font-bold">Minus → deducted from carpet total</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-white border-t border-slate-200 shrink-0 flex items-center justify-between">
          <p className="text-[10px] text-slate-500">
            Carpet: <strong className="text-blue-700">{carpetSqFt.toFixed(2)} SqFt ({carpetSqM.toFixed(2)} m²)</strong>
            &nbsp;|&nbsp;Built-up: <strong className="text-emerald-700">{builtUpSqFt.toFixed(2)} SqFt ({builtUpSqM.toFixed(2)} m²)</strong>
            &nbsp;— for <strong className="text-slate-800">{unit?.unitNumber || "this unit"}</strong>
          </p>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-1.5 border border-slate-300 hover:bg-slate-50 rounded-lg text-[10px] font-bold text-slate-700 uppercase">Close</button>
            <button onClick={() => { onSaveRooms(rooms, carpetSqFt); onClose(); }}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-[10px] font-bold text-white uppercase shadow-md">Save Data</button>
          </div>
        </div>
      </div>

      {/* ── Offset Details Drawer ─────────────────────────────────────────────── */}
      {offsetRoom && (
        <div className="fixed inset-0 z-[60] flex justify-start">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={handleDrawerClose} />
          <div className="relative w-full max-w-xl bg-white h-full flex flex-col shadow-2xl border-r border-slate-200 animate-in slide-in-from-left duration-300">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-amber-500 border-b border-amber-600 shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-white/20 rounded-lg"><Scissors className="size-4 text-white" /></div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wide">Offset Details</h3>
                  <p className="text-[9px] text-amber-100 font-bold uppercase tracking-widest mt-0.5">
                    Room No: {offsetRoom.roomNo} — enter cutout shape &amp; dimensions
                  </p>
                </div>
              </div>
              <button onClick={handleDrawerClose} className="p-1.5 hover:bg-amber-600 rounded-lg text-amber-100 hover:text-white transition-colors">
                <X className="size-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Total & Operation Toggles Row */}
              <div className="flex items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 shadow-sm shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">Total:</span>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value={offsetRoom.areaSqM.toFixed(2)}
                      className="h-8 w-20 rounded-lg border border-slate-300 bg-white px-2 text-xs font-bold text-slate-800 text-center cursor-default focus:outline-none"
                    />
                  </div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">sq.m</span>
                </div>

                <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 shadow-sm">
                  {/* Minus button */}
                  <button
                    type="button"
                    onClick={() => setTempOffsetOp("Subtract")}
                    className={`h-7 w-8 rounded-md flex items-center justify-center transition-all duration-200 font-black text-base cursor-pointer ${tempOffsetOp === "Subtract"
                      ? "bg-orange-500 text-white shadow"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-200"
                      }`}
                    title="Subtract Offset"
                  >
                    —
                  </button>
                  {/* Display Box */}
                  <div
                    className={`h-7 px-3 flex items-center justify-center border font-bold text-xs bg-white min-w-16 ${(drawerOffsets.length > 0 ? drawerNetAdjustmentSqM < 0 : tempOffsetOp === "Subtract")
                      ? "border-orange-500 text-orange-600"
                      : "border-emerald-600 text-emerald-600"
                      }`}
                  >
                    {drawerOffsets.length > 0
                      ? Math.abs(drawerNetAdjustmentSqM).toFixed(2)
                      : tempOffsetAreaSqM.toFixed(2)}
                  </div>
                  {/* Plus button */}
                  <button
                    type="button"
                    onClick={() => setTempOffsetOp("Add")}
                    className={`h-7 w-8 rounded-md flex items-center justify-center transition-all duration-200 font-black text-base cursor-pointer ${tempOffsetOp === "Add"
                      ? "bg-emerald-600 text-white shadow"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-200"
                      }`}
                    title="Add Offset"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Form Input fields */}
              <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-200/60 shadow-sm space-y-3">
                <div className="flex flex-wrap items-end gap-3">

                  {/* Select Shape */}
                  <div className="flex-1 min-w-[120px]">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Select Shape</label>
                    <select
                      value={tempOffsetShape}
                      onChange={(e) => {
                        const newShape = e.target.value;
                        setTempOffsetShape(newShape);
                        // reset temp dims
                        setTempOffsetLength(0);
                        setTempOffsetWidth(0);
                        setTempOffsetHeight(0);
                        setTempOffsetBase1(0);
                        setTempOffsetBase2(0);
                        setTempOffsetRadius(0);
                      }}
                      className="h-8 w-full rounded-lg border border-slate-300 bg-white px-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-300"
                    >
                      {SHAPES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </div>

                  {/* Dimensions fields mapped dynamically based on selected shape */}
                  {(() => {
                    const offsetDimFields = getDimFields(tempOffsetShape);
                    return offsetDimFields.map((df) => {
                      let val: string | number = "";
                      if (df.key === "length") val = tempOffsetLength;
                      else if (df.key === "width") val = tempOffsetWidth;
                      else if (df.key === "height") val = tempOffsetHeight;
                      else if (df.key === "base1") val = tempOffsetBase1;
                      else if (df.key === "base2") val = tempOffsetBase2;
                      else if (df.key === "radius") val = tempOffsetRadius;

                      const setVal = (num: number) => {
                        if (df.key === "length") setTempOffsetLength(num);
                        else if (df.key === "width") setTempOffsetWidth(num);
                        else if (df.key === "height") setTempOffsetHeight(num);
                        else if (df.key === "base1") setTempOffsetBase1(num);
                        else if (df.key === "base2") setTempOffsetBase2(num);
                        else if (df.key === "radius") setTempOffsetRadius(num);
                      };

                      return (
                        <div key={df.key} className="w-20">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">{df.label}</label>
                          <Input
                            type="number"
                            min={0}
                            value={val === 0 ? "" : val}
                            onChange={(e) => setVal(parseFloat(e.target.value) || 0)}
                            onFocus={(e) => e.target.select()}
                            className="h-8 text-xs text-slate-700 bg-white"
                            placeholder="0"
                          />
                        </div>
                      );
                    });
                  })()}

                  {/* Calculated Area */}
                  <div className="flex-1 min-w-[120px]">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1 text-center">Calculated Area</label>
                    <div className="h-8 w-full rounded-lg border border-purple-300 bg-purple-50/50 flex items-center justify-center text-xs font-bold text-purple-700">
                      {tempOffsetAreaSqM.toFixed(2)} sq.m
                    </div>
                  </div>

                </div>

                {/* Formula Text */}
                <p className="text-[9px] text-slate-400 font-mono text-center pt-1 border-t border-slate-100">
                  {formulaText(
                    tempOffsetShape,
                    tempOffsetLength,
                    tempOffsetWidth,
                    tempOffsetHeight,
                    tempOffsetBase1,
                    tempOffsetBase2,
                    tempOffsetRadius
                  )}
                </p>
              </div>

              {/* Add Button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleAddOffsetToHistory}
                  className="h-8 px-6 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold uppercase shadow-md transition-all duration-200 active:scale-95 cursor-pointer"
                >
                  Add
                </button>
              </div>

              {/* Operation History Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mt-4">
                <div className="px-3 py-2 bg-teal-600 text-white text-center font-bold text-xs uppercase tracking-wider">
                  Operation History
                </div>
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 border-b border-slate-200">
                    <tr className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                      <th className="px-3 py-2">No</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2">Shape</th>
                      <th className="px-3 py-2">Dim.</th>
                      <th className="px-3 py-2 text-right">Area (sq.m)</th>
                      <th className="px-3 py-2 text-center">Del</th>
                    </tr>
                  </thead>
                  <tbody>
                    {drawerOffsets.length > 0 ? (
                      drawerOffsets.map((off, idx) => (
                        <tr key={off.id} className="hover:bg-slate-50 border-b border-slate-100">
                          <td className="px-3 py-2 font-semibold text-slate-700">{idx + 1}</td>
                          <td className="px-3 py-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${off.op === "Add"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-orange-50 text-orange-700 border border-orange-200"
                              }`}>
                              {off.op === "Add" ? "+ Add" : "- Sub"}
                            </span>
                          </td>
                          <td className="px-3 py-2 font-semibold text-slate-700">{off.shape}</td>
                          <td className="px-3 py-2 text-slate-600 font-medium">
                            {off.shape === "Rectangle" && `${off.length}m × ${off.width}m`}
                            {off.shape === "Square" && `${off.length}m × ${off.length}m`}
                            {off.shape === "Triangle" && `b=${off.length}m, h=${off.height}m`}
                            {off.shape === "Trapezoid" && `b1=${off.base1}m, b2=${off.base2}m, h=${off.height}m`}
                            {(off.shape === "Circle" || off.shape === "Semi Circle" || off.shape === "Quarter") && `r=${off.radius}m`}
                          </td>
                          <td className="px-3 py-2 text-right font-mono font-bold text-slate-800">
                            {off.areaSqM.toFixed(2)}
                          </td>
                          <td className="px-3 py-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveOffsetFromHistory(off.id)}
                              className="p-1 hover:bg-red-50 rounded text-red-500 transition-colors cursor-pointer"
                              title="Delete operation"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-3 py-6 text-center text-slate-400">
                          No operations added yet. Enter details above and click Add.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                {drawerOffsets.length > 0 && (
                  <div className="px-3 py-2 bg-blue-50 border-t border-slate-200 text-xs font-bold text-slate-700 flex justify-between">
                    <span>Net Adjustment:</span>
                    <span className={drawerNetAdjustmentSqM >= 0 ? "text-emerald-700" : "text-orange-700"}>
                      {drawerNetAdjustmentSqM >= 0 ? "+" : "−"}{Math.abs(drawerNetAdjustmentSqM).toFixed(2)} sq.m
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-white border-t border-slate-200 shrink-0 flex items-center justify-center gap-3">
              <button onClick={handleOkSave}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold uppercase shadow-sm transition-all active:scale-95 cursor-pointer">
                OK
              </button>
              <button onClick={handleDrawerClose}
                className="px-6 py-2 border border-slate-300 bg-white hover:bg-slate-50 rounded-lg text-xs font-bold text-slate-700 uppercase transition-all active:scale-95 cursor-pointer">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
