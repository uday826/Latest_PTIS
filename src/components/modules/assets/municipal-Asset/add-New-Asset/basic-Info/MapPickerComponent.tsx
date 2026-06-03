"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { X, MapPin, Navigation, Satellite, Layers, Map as MapIcon, Crosshair, Search, Check } from "lucide-react";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Custom draggable marker icon
const createDraggableMarkerIcon = () =>
  new L.DivIcon({
    html: `
      <div style="position: relative; width: 48px; height: 48px;">
        <div style="
          position: absolute;
          top: 0;
          left: 50%;
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          border-radius: 50% 50% 50% 0;
          transform: translateX(-50%) rotate(-45deg);
          border: 4px solid white;
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5), 0 3px 8px rgba(0,0,0,0.3);
          animation: bounce 0.5s ease-out;
        "></div>
        <div style="
          position: absolute;
          top: 12px;
          left: 50%;
          transform: translateX(-50%);
          width: 14px;
          height: 14px;
          background: white;
          border-radius: 50%;
        "></div>
        <div style="
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 12px;
          height: 6px;
          background: rgba(0,0,0,0.2);
          border-radius: 50%;
          filter: blur(2px);
        "></div>
      </div>
      <style>
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      </style>
    `,
    className: "custom-draggable-marker",
    iconSize: [48, 48],
    iconAnchor: [24, 48],
  });

// Tile layer configurations
const TILE_LAYERS = {
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    name: "Satellite",
  },
  hybrid: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    name: "Hybrid",
  },
  street: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    name: "Street",
  },
};

const LABELS_LAYER = "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}";

interface MapPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (lat: string, lng: string) => void;
  initialLat?: string;
  initialLng?: string;
}

// Component to handle map clicks and marker dragging
function LocationPicker({
  position,
  setPosition,
}: {
  position: [number, number];
  setPosition: (pos: [number, number]) => void;
}) {
  const markerRef = useRef<L.Marker>(null);

  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  const eventHandlers = {
    dragend() {
      const marker = markerRef.current;
      if (marker) {
        const latlng = marker.getLatLng();
        setPosition([latlng.lat, latlng.lng]);
      }
    },
  };

  return (
    <Marker
      ref={markerRef}
      position={position}
      icon={createDraggableMarkerIcon()}
      draggable={true}
      eventHandlers={eventHandlers}
    />
  );
}

// Component to handle centering map
function MapController({ center, shouldRecenter }: { center: [number, number]; shouldRecenter: boolean }) {
  const map = useMap();

  useEffect(() => {
    if (shouldRecenter) {
      map.flyTo(center, 17, { duration: 1 });
    }
  }, [center, shouldRecenter, map]);

  return null;
}

export function MapPickerComponent({ isOpen, onClose, onSelect, initialLat, initialLng }: MapPickerProps) {
  const defaultLat = 19.2183;
  const defaultLng = 72.9781;

  const parseCoord = (val: string | undefined, fallback: number) => {
    if (!val || val.trim() === "") return fallback;
    const parsed = parseFloat(val);
    return isNaN(parsed) ? fallback : parsed;
  };

  const [position, setPosition] = useState<[number, number]>([
    parseCoord(initialLat, defaultLat),
    parseCoord(initialLng, defaultLng),
  ]);
  const [mapType, setMapType] = useState<"satellite" | "hybrid" | "street">("satellite");
  const [isClient, setIsClient] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [shouldRecenter, setShouldRecenter] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setPosition([
        parseCoord(initialLat, defaultLat),
        parseCoord(initialLng, defaultLng),
      ]);
    }
  }, [isOpen, initialLat, initialLng]);

  const handleGetCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPos: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          setPosition(newPos);
          setShouldRecenter(true);
          setTimeout(() => setShouldRecenter(false), 100);
        },
        (err) => {
          console.error("Geolocation error:", err);
          alert("Unable to get your location. Please enable location services.");
        },
        { enableHighAccuracy: true }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  }, []);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const newPos: [number, number] = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        setPosition(newPos);
        setShouldRecenter(true);
        setTimeout(() => setShouldRecenter(false), 100);
      } else {
        alert("Location not found. Try a different search term.");
      }
    } catch (error) {
      console.error("Search error:", error);
      alert("Search failed. Please try again.");
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery]);

  const handleConfirm = useCallback(() => {
    onSelect(position[0].toFixed(6), position[1].toFixed(6));
    onClose();
  }, [position, onSelect, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-[95vw] max-w-5xl h-[90vh] max-h-[700px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <MapPin className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Pick Location on Map</h2>
              <p className="text-[10px] text-blue-100 font-medium">Click on map or drag the marker to select location</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search location (e.g., Thane Railway Station)"
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            {isSearching ? (
              <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Search className="size-4" />
            )}
            Search
          </button>
          <button
            onClick={handleGetCurrentLocation}
            className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 flex items-center gap-1.5"
          >
            <Crosshair className="size-4" />
            My Location
          </button>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
          {isClient ? (
            <MapContainer
              center={position}
              zoom={15}
              className="h-full w-full"
              zoomControl={false}
            >
              <TileLayer url={TILE_LAYERS[mapType].url} maxZoom={19} />
              {(mapType === "satellite" || mapType === "hybrid") && (
                <TileLayer url={LABELS_LAYER} maxZoom={19} />
              )}
              <LocationPicker position={position} setPosition={setPosition} />
              <MapController center={position} shouldRecenter={shouldRecenter} />
            </MapContainer>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            </div>
          )}

          {/* Map Type Toggle */}
          <div className="absolute top-3 right-3 z-[1000] flex rounded-lg overflow-hidden shadow-lg border border-white/20">
            {(["satellite", "hybrid", "street"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setMapType(type)}
                className={`px-3 py-2 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                  mapType === type
                    ? "bg-blue-600 text-white"
                    : "bg-white/95 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {type === "satellite" && <Satellite className="size-3.5" />}
                {type === "hybrid" && <Layers className="size-3.5" />}
                {type === "street" && <MapIcon className="size-3.5" />}
                {type}
              </button>
            ))}
          </div>

          {/* Coordinates Display */}
          <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur rounded-xl px-4 py-2.5 shadow-lg border border-slate-200">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Navigation className="size-4 text-blue-600" />
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Selected Coordinates</span>
                  <span className="font-mono text-sm font-bold text-slate-800">
                    {position[0].toFixed(6)}, {position[1].toFixed(6)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Zoom Controls */}
          <div className="absolute top-3 left-3 z-[1000] flex flex-col rounded-lg overflow-hidden shadow-lg">
            <button
              onClick={() => {
                const mapEl = document.querySelector(".leaflet-container") as HTMLElement & { _leaflet_map?: L.Map };
                mapEl?._leaflet_map?.zoomIn();
              }}
              className="px-3 py-2 bg-white text-slate-700 hover:bg-slate-50 border-b border-slate-200 font-bold"
            >
              +
            </button>
            <button
              onClick={() => {
                const mapEl = document.querySelector(".leaflet-container") as HTMLElement & { _leaflet_map?: L.Map };
                mapEl?._leaflet_map?.zoomOut();
              }}
              className="px-3 py-2 bg-white text-slate-700 hover:bg-slate-50 font-bold"
            >
              −
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-[10px] text-slate-500 font-medium">
            <span className="font-bold text-slate-700">Tip:</span> Click anywhere on the map or drag the marker to set precise location
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-5 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Check className="size-4" />
              Confirm Location
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
