"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";

// Fix for default marker icons in Leaflet with webpack/next.js
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Custom marker icon
const customIcon = new L.DivIcon({
  html: `
    <div style="position: relative;">
      <div style="
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4), 0 2px 4px rgba(0,0,0,0.2);
        position: absolute;
        top: -40px;
        left: -20px;
      "></div>
      <div style="
        position: absolute;
        top: -32px;
        left: -8px;
        width: 16px;
        height: 16px;
      ">
        <svg viewBox="0 0 24 24" fill="white" width="16" height="16">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      </div>
    </div>
  `,
  className: "custom-picker-marker",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

// Tile layer configurations
const TILE_LAYERS = {
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "&copy; Esri",
  },
  street: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
  hybrid: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "&copy; Esri",
  },
};

const LABELS_LAYER = {
  url: "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
};

interface LeafletMapContentProps {
  mapType: "street" | "satellite" | "hybrid";
  markerPos: { lat: number; lng: number };
  mapCenter: [number, number];
  onMarkerChange: (lat: number, lng: number) => void;
  onMapRef: (map: any) => void;
}

// Map click handler component
function MapClickHandler({ onMarkerChange }: { onMarkerChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onMarkerChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Map reference handler
function MapRefHandler({ onMapRef }: { onMapRef: (map: any) => void }) {
  const map = useMap();
  
  useEffect(() => {
    onMapRef(map);
  }, [map, onMapRef]);
  
  return null;
}

export default function LeafletMapContent({ 
  mapType, 
  markerPos, 
  mapCenter, 
  onMarkerChange, 
  onMapRef 
}: LeafletMapContentProps) {
  return (
    <MapContainer
      center={mapCenter}
      zoom={16}
      className="h-full w-full"
      zoomControl={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url={TILE_LAYERS[mapType].url}
        attribution={TILE_LAYERS[mapType].attribution}
        maxZoom={20}
      />
      
      {mapType === "hybrid" && (
        <TileLayer url={LABELS_LAYER.url} maxZoom={20} />
      )}
      
      <MapClickHandler onMarkerChange={onMarkerChange} />
      <MapRefHandler onMapRef={onMapRef} />
      
      <Marker 
        position={[markerPos.lat, markerPos.lng]}
        icon={customIcon}
        draggable={true}
        eventHandlers={{
          dragend: (e) => {
            const marker = e.target;
            const position = marker.getLatLng();
            onMarkerChange(position.lat, position.lng);
          },
        }}
      />
    </MapContainer>
  );
}
