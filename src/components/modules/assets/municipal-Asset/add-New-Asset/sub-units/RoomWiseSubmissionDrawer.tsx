"use client";

import { Input, Select } from "@/components/common";
import { Edit2, Layers, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

interface Room {
  id: string;
  roomNo: string;
  roomType: string;
  shape: string;
  area: number;
  count: number;
  offset: string;
  outer: string;
}

interface RoomWiseSubmissionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  unit: any;
  onSaveRooms: (rooms: Room[], calculatedArea: number) => void;
}

export function RoomWiseSubmissionDrawer({ isOpen, onClose, unit, onSaveRooms }: RoomWiseSubmissionDrawerProps) {
  const [roomsList, setRoomsList] = useState<Room[]>([]);
  const [newRoom, setNewRoom] = useState<any>({
    roomNo: "1",
    roomType: "Bed Room",
    shape: "Rectangle",
    area: 100,
    count: 1,
    offset: "No",
    outer: "No",
  });
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);

  // Synchronize rooms when drawer opens
  useEffect(() => {
    if (isOpen && unit) {
      setRoomsList(unit.rooms || []);
      setNewRoom({
        roomNo: String((unit.rooms || []).length + 1),
        roomType: "Bed Room",
        shape: "Rectangle",
        area: 100,
        count: 1,
        offset: "No",
        outer: "No",
      });
      setEditingRoomId(null);
    }
  }, [isOpen, unit]);

  if (!isOpen) return null;

  const totalArea = roomsList.reduce((acc, r) => acc + (Number(r.area || 0) * Number(r.count || 1)), 0);

  const handleAddRoom = () => {
    if (editingRoomId !== null) {
      setRoomsList(prev => prev.map(r => r.id === editingRoomId ? { ...newRoom } : r));
      setEditingRoomId(null);
    } else {
      const roomToAdd = {
        ...newRoom,
        id: Math.random().toString(36).substr(2, 9),
      };
      setRoomsList(prev => [...prev, roomToAdd]);
    }
    
    const nextRoomNum = editingRoomId !== null 
      ? String(roomsList.length + 1)
      : String(roomsList.length + 2);
      
    setNewRoom({
      roomNo: nextRoomNum,
      roomType: "Bed Room",
      shape: "Rectangle",
      area: 100,
      count: 1,
      offset: "No",
      outer: "No",
    });
  };

  const handleEditRoom = (room: Room) => {
    setEditingRoomId(room.id);
    setNewRoom({ ...room });
  };

  const handleCancelEditRoom = () => {
    setEditingRoomId(null);
    setNewRoom({
      roomNo: String(roomsList.length + 1),
      roomType: "Bed Room",
      shape: "Rectangle",
      area: 100,
      count: 1,
      offset: "No",
      outer: "No",
    });
  };

  const handleDeleteRoom = (id: string) => {
    setRoomsList(prev => prev.filter(r => r.id !== id));
  };

  const handleSaveData = () => {
    onSaveRooms(roomsList, totalArea);
    onClose();
  };

  const renderShapeSVG = (shape: string, roomArea: number) => {
    const textEl = (
      <text x="50" y="54" fill="#60a5fa" className="text-[8px] font-bold font-mono" textAnchor="middle">
        {roomArea || 0} SqFt
      </text>
    );
    
    switch (shape) {
      case "Square":
        return (
          <svg className="w-28 h-28 text-blue-500 transition-all duration-300" viewBox="0 0 100 100">
            <rect x="25" y="25" width="50" height="50" rx="3" fill="rgba(59, 130, 246, 0.1)" stroke="currentColor" strokeWidth="2" strokeDasharray="1 1" />
            <rect x="25" y="25" width="50" height="50" rx="3" fill="none" stroke="currentColor" strokeWidth="2" className="animate-[dash_2s_linear_infinite]" />
            {textEl}
          </svg>
        );
      case "L-Shape":
        return (
          <svg className="w-28 h-28 text-blue-500 transition-all duration-300" viewBox="0 0 100 100">
            <path d="M 25 25 L 55 25 L 55 55 L 75 55 L 75 75 L 25 75 Z" fill="rgba(59, 130, 246, 0.1)" stroke="currentColor" strokeWidth="2" />
            {textEl}
          </svg>
        );
      case "Circle":
        return (
          <svg className="w-28 h-28 text-blue-500 transition-all duration-300" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="28" fill="rgba(59, 130, 246, 0.1)" stroke="currentColor" strokeWidth="2" />
            {textEl}
          </svg>
        );
      case "Polygon":
        return (
          <svg className="w-28 h-28 text-blue-500 transition-all duration-300" viewBox="0 0 100 100">
            <polygon points="50,20 75,38 75,68 50,85 25,68 25,38" fill="rgba(59, 130, 246, 0.1)" stroke="currentColor" strokeWidth="2" />
            {textEl}
          </svg>
        );
      case "Rectangle":
      default:
        return (
          <svg className="w-28 h-28 text-blue-500 transition-all duration-300" viewBox="0 0 100 100">
            <rect x="20" y="30" width="60" height="40" rx="3" fill="rgba(59, 130, 246, 0.1)" stroke="currentColor" strokeWidth="2" />
            {textEl}
          </svg>
        );
    }
  };

  const inp = "h-8 text-xs";

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer Panel */}
      <div className="relative w-full max-w-6xl bg-slate-50 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Blue Header */}
        <div className="flex items-center justify-between px-4 py-3.5 bg-blue-600 border-b border-blue-700 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-white/20 rounded-lg">
              <Layers className="size-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white uppercase tracking-wider">
                Room Wise Submission (Square Feet)
              </h2>
              <p className="text-[10px] text-blue-100 font-bold uppercase tracking-widest mt-0.5">
                Valuation configuration for Flat / Sub-unit
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-blue-700/60 rounded-lg p-0.5 border border-blue-500/30 text-white font-bold text-[10px] select-none">
              <span className="px-2 py-0.5 rounded bg-blue-500 shadow-sm cursor-pointer">SqFt</span>
              <span className="px-2 py-0.5 rounded text-blue-200 cursor-not-allowed">SqM</span>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 hover:bg-blue-700 rounded-lg text-blue-100 hover:text-white transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          

          {/* Form & Table Row Split */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            
            {/* Left Column: Input Form & Configured List */}
            <div className="lg:col-span-2 space-y-4">
              
              {/* Room Form */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <Plus className="size-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    {editingRoomId !== null ? "Edit Room Details" : "Add New Room"}
                  </span>
                </div>
                
                <div className="grid grid-cols-4 gap-3">
                  <div className="relative min-w-0 flex-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-0.5">Room No</label>
                    <Input 
                      type="text" 
                      value={newRoom.roomNo} 
                      onChange={(e) => setNewRoom((prev: any) => ({ ...prev, roomNo: e.target.value }))}
                      className={inp}
                    />
                  </div>
                  
                  <div className="relative min-w-0 flex-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-0.5">Room Type</label>
                    <Select 
                      value={newRoom.roomType}
                      onChange={(val) => setNewRoom((prev: any) => ({ ...prev, roomType: val }))}
                      options={[
                        { label: "Bed Room", value: "Bed Room" },
                        { label: "Living Room", value: "Living Room" },
                        { label: "Kitchen", value: "Kitchen" },
                        { label: "Toilet", value: "Toilet" },
                        { label: "Bathroom", value: "Bathroom" },
                        { label: "Balcony", value: "Balcony" },
                        { label: "Passage", value: "Passage" },
                        { label: "Shop Front", value: "Shop Front" },
                        { label: "Storage", value: "Storage" },
                      ]}
                      className={inp}
                    />
                  </div>

                  <div className="relative min-w-0 flex-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-0.5">Shape</label>
                    <Select 
                      value={newRoom.shape}
                      onChange={(val) => setNewRoom((prev: any) => ({ ...prev, shape: val }))}
                      options={[
                        { label: "Rectangle", value: "Rectangle" },
                        { label: "Square", value: "Square" },
                        { label: "L-Shape", value: "L-Shape" },
                        { label: "Circle", value: "Circle" },
                        { label: "Polygon", value: "Polygon" },
                      ]}
                      className={inp}
                    />
                  </div>

                  <div className="relative min-w-0 flex-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-0.5">Area (SqFt)</label>
                    <Input 
                      type="number" 
                      value={newRoom.area} 
                      onChange={(e) => setNewRoom((prev: any) => ({ ...prev, area: Number(e.target.value) }))}
                      className={inp}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  <div className="relative min-w-0 flex-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-0.5">Room Count</label>
                    <Input 
                      type="number" 
                      value={newRoom.count} 
                      onChange={(e) => setNewRoom((prev: any) => ({ ...prev, count: Number(e.target.value) }))}
                      className={inp}
                    />
                  </div>

                  <div className="relative min-w-0 flex-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-0.5">Offset</label>
                    <Select 
                      value={newRoom.offset}
                      onChange={(val) => setNewRoom((prev: any) => ({ ...prev, offset: val }))}
                      options={[
                        { label: "No", value: "No" },
                        { label: "Yes", value: "Yes" },
                      ]}
                      className={inp}
                    />
                  </div>

                  <div className="relative min-w-0 flex-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-0.5">Outer</label>
                    <Select 
                      value={newRoom.outer}
                      onChange={(val) => setNewRoom((prev: any) => ({ ...prev, outer: val }))}
                      options={[
                        { label: "No", value: "No" },
                        { label: "Yes", value: "Yes" },
                      ]}
                      className={inp}
                    />
                  </div>

                  <div className="relative min-w-0 flex-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-0.5">Total (SqFt)</label>
                    <Input 
                      type="text" 
                      value={(newRoom.area * newRoom.count).toFixed(2)} 
                      readOnly 
                      className={`${inp} bg-slate-100 font-bold text-slate-700`}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  {editingRoomId !== null && (
                    <button
                      type="button"
                      onClick={handleCancelEditRoom}
                      className="h-8 px-4 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg flex items-center justify-center text-[10px] font-bold uppercase tracking-all cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleAddRoom}
                    className="h-8 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-wider transition-all shadow-md shadow-blue-100 cursor-pointer"
                  >
                    <Plus className="size-3.5" />
                    {editingRoomId !== null ? "Update Room" : "Add Room"}
                  </button>
                </div>
              </div>

              {/* Room Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col max-h-[300px]">
                <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                  <Layers className="size-3.5 text-slate-500" />
                  <h3 className="text-[10px] font-black text-slate-700 uppercase tracking-wider">
                    Configured Rooms ({roomsList.length})
                  </h3>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 sticky top-0 border-b border-slate-200">
                      <tr className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                        <th className="px-3 py-2">Room No</th>
                        <th className="px-3 py-2">Room Type</th>
                        <th className="px-3 py-2">Shape</th>
                        <th className="px-3 py-2 text-right">Area (SqFt)</th>
                        <th className="px-3 py-2 text-center">RoomCount</th>
                        <th className="px-3 py-2 text-center">Offset</th>
                        <th className="px-3 py-2 text-center">Outer</th>
                        <th className="px-3 py-2 text-right">Total (SqFt)</th>
                        <th className="px-3 py-2 text-center w-20">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {roomsList.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="px-3 py-8 text-center text-slate-400 font-bold uppercase tracking-wider">
                            No rooms configured yet. Use the form above to build flat rooms.
                          </td>
                        </tr>
                      ) : (
                        roomsList.map((room, idx) => (
                          <tr key={room.id || idx} className="hover:bg-slate-50 transition-colors">
                            <td className="px-3 py-2 font-semibold text-slate-700">{room.roomNo}</td>
                            <td className="px-3 py-2 font-bold text-slate-800">{room.roomType}</td>
                            <td className="px-3 py-2">
                              <span className="px-2 py-0.5 bg-slate-100 rounded text-[9px] font-bold text-slate-600 uppercase border border-slate-200">
                                {room.shape}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-right font-mono">{Number(room.area).toFixed(2)}</td>
                            <td className="px-3 py-2 text-center font-mono">{room.count}</td>
                            <td className="px-3 py-2 text-center">
                              <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${room.offset === "Yes" ? "bg-amber-50 text-amber-600 border border-amber-100" : "bg-slate-50 text-slate-400"}`}>
                                {room.offset}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-center">
                              <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${room.outer === "Yes" ? "bg-blue-50 text-blue-600 border border-blue-100" : "bg-slate-50 text-slate-400"}`}>
                                {room.outer}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-right font-mono font-bold text-slate-800">
                              {(room.area * room.count).toFixed(2)}
                            </td>
                            <td className="px-3 py-2 text-center flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleEditRoom(room)}
                                className="p-1 hover:bg-blue-50 rounded text-blue-600 transition-colors cursor-pointer"
                              >
                                <Edit2 className="size-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteRoom(room.id)}
                                className="p-1 hover:bg-red-50 rounded text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                              >
                                <Trash2 className="size-3" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                
                {/* Table Footer Summary */}
                <div className="px-3 py-2.5 bg-slate-100 border-t border-slate-200 flex justify-between items-center text-xs font-bold text-slate-700 shrink-0">
                  <span>TOTAL ROOMS: {roomsList.reduce((acc, r) => acc + Number(r.count || 0), 0)}</span>
                  <div className="flex gap-4">
                    <span>TOTAL AREA: {totalArea.toFixed(2)} SqFt</span>
                    <span className="text-blue-700">TOTAL VALUATION AREA: {totalArea.toFixed(2)} SqFt</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Shape Preview */}
            <div className="lg:col-span-1">
              <div className="bg-slate-900 text-slate-100 rounded-xl p-4 flex flex-col h-full min-h-[300px] justify-between relative border border-slate-800 shadow-lg overflow-hidden">
                <div className="absolute top-0 right-0 p-8 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2 z-10">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Shape Preview</span>
                  <span className="px-2 py-0.5 bg-blue-900/50 text-blue-400 border border-blue-800/40 rounded text-[9px] font-bold uppercase tracking-wider">
                    {newRoom.roomType} #{newRoom.roomNo}
                  </span>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center py-6 z-10">
                  {renderShapeSVG(newRoom.shape, newRoom.area)}
                </div>

                <div className="text-center text-[10px] text-slate-500 font-bold uppercase tracking-wider border-t border-slate-800/60 pt-2.5 z-10">
                  Shape: {newRoom.shape} • Size: {newRoom.area} SqFt
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-white border-t border-slate-200 shrink-0 flex items-center justify-between">
          <p className="text-[10px] text-slate-500 font-medium">
            This room configuration will completely decide the total valuation area of <strong className="text-slate-800">{unit?.unitNumber || "this unit"}</strong>.
          </p>
          <div className="flex gap-2">
            <button 
              onClick={onClose}
              className="px-4 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg text-[10px] font-bold text-slate-700 tracking-wider uppercase transition-all"
            >
              Close
            </button>
            <button 
              onClick={handleSaveData}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 border border-blue-700 rounded-lg text-[10px] font-bold text-white tracking-wider uppercase transition-all shadow-md shadow-blue-900/20"
            >
              Save Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
