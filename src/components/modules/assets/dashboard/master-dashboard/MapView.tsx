'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useTranslations } from 'next-intl';
import { Layers, MapPin, Satellite, Map as MapIcon } from 'lucide-react';
import type { DashboardMapAssetType } from '@/types/asset-type/asset-dashboard.types';
import 'leaflet/dist/leaflet.css';

// Extended asset type to handle both coordinate formats
interface ExtendedAsset extends DashboardMapAssetType {
  latitude?: number;
  longitude?: number;
}

// Helper to get coordinates from asset (handles both formats)
const getAssetCoords = (asset: ExtendedAsset): { lat: number; lng: number } | null => {
  if (asset.coordinates?.lat && asset.coordinates?.lng) {
    return asset.coordinates;
  }
  if (asset.latitude && asset.longitude && asset.latitude !== 0 && asset.longitude !== 0) {
    return { lat: asset.latitude, lng: asset.longitude };
  }
  return null;
};

// Fix for default marker icons in Leaflet with webpack/next.js
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Dynamic SVG icons for different category types
const CATEGORY_ICONS: Record<string, string> = {
  // Land related
  land: `<svg viewBox="0 0 24 24" fill="white" width="16" height="16"><path d="M14 6l-3.75 5 2.85 3.8-1.6 1.2C9.81 13.75 7 10 7 10l-6 8h22L14 6z"/></svg>`,
  'land & plots': `<svg viewBox="0 0 24 24" fill="white" width="16" height="16"><path d="M14 6l-3.75 5 2.85 3.8-1.6 1.2C9.81 13.75 7 10 7 10l-6 8h22L14 6z"/></svg>`,
  // Building related
  building: `<svg viewBox="0 0 24 24" fill="white" width="16" height="16"><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/></svg>`,
  buildings: `<svg viewBox="0 0 24 24" fill="white" width="16" height="16"><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/></svg>`,
  // Infrastructure related
  infrastructure: `<svg viewBox="0 0 24 24" fill="white" width="16" height="16"><path d="M19 9.3V4h-3v2.6L12 3 2 12h3v8h5v-6h4v6h5v-8h3l-3-2.7zm-9 .7c0-1.1.9-2 2-2s2 .9 2 2h-4z"/></svg>`,
  // Movable/Vehicle related
  movable: `<svg viewBox="0 0 24 24" fill="white" width="16" height="16"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>`,
  vehicles: `<svg viewBox="0 0 24 24" fill="white" width="16" height="16"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>`,
  // Default icon
  default: `<svg viewBox="0 0 24 24" fill="white" width="16" height="16"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`,
};

// Color palette for dynamic category assignment
const COLOR_PALETTE = [
  { bg: '#3b82f6', border: '#2563eb', shadow: 'rgba(59, 130, 246, 0.4)' },   // Blue - Buildings
  { bg: '#14b8a6', border: '#0d9488', shadow: 'rgba(20, 184, 166, 0.4)' },   // Teal - Land
  { bg: '#f97316', border: '#ea580c', shadow: 'rgba(249, 115, 22, 0.4)' },   // Orange - Movable
  { bg: '#8b5cf6', border: '#7c3aed', shadow: 'rgba(139, 92, 246, 0.4)' },   // Purple - Infrastructure
  { bg: '#ec4899', border: '#db2777', shadow: 'rgba(236, 72, 153, 0.4)' },   // Pink
  { bg: '#10b981', border: '#059669', shadow: 'rgba(16, 185, 129, 0.4)' },   // Emerald
  { bg: '#6366f1', border: '#4f46e5', shadow: 'rgba(99, 102, 241, 0.4)' },   // Indigo
  { bg: '#f59e0b', border: '#d97706', shadow: 'rgba(245, 158, 11, 0.4)' },   // Amber
];

// Get category icon based on category name
const getCategoryIcon = (category: string): string => {
  const normalizedCat = category.toLowerCase().trim();
  
  // Check for exact match first
  if (CATEGORY_ICONS[normalizedCat]) {
    return CATEGORY_ICONS[normalizedCat];
  }
  
  // Check for partial matches
  if (normalizedCat.includes('land') || normalizedCat.includes('plot')) {
    return CATEGORY_ICONS.land;
  }
  if (normalizedCat.includes('building') || normalizedCat.includes('structure')) {
    return CATEGORY_ICONS.building;
  }
  if (normalizedCat.includes('vehicle') || normalizedCat.includes('movable') || normalizedCat.includes('transport')) {
    return CATEGORY_ICONS.movable;
  }
  if (normalizedCat.includes('infrastructure') || normalizedCat.includes('utility')) {
    return CATEGORY_ICONS.infrastructure;
  }
  
  return CATEGORY_ICONS.default;
};

// Cache for category colors to ensure consistency
const categoryColorCache: Record<string, typeof COLOR_PALETTE[0]> = {};

// Get category color dynamically
const getCategoryColor = (category: string, categories: string[]): typeof COLOR_PALETTE[0] => {
  const normalizedCat = category.toLowerCase().trim();
  
  // Return cached color if exists
  if (categoryColorCache[normalizedCat]) {
    return categoryColorCache[normalizedCat];
  }
  
  // Assign colors based on category type
  let color: typeof COLOR_PALETTE[0];
  if (normalizedCat.includes('building') || normalizedCat.includes('structure')) {
    color = COLOR_PALETTE[0]; // Blue
  } else if (normalizedCat.includes('land') || normalizedCat.includes('plot')) {
    color = COLOR_PALETTE[1]; // Teal
  } else if (normalizedCat.includes('vehicle') || normalizedCat.includes('movable') || normalizedCat.includes('transport')) {
    color = COLOR_PALETTE[2]; // Orange
  } else if (normalizedCat.includes('infrastructure') || normalizedCat.includes('utility')) {
    color = COLOR_PALETTE[3]; // Purple
  } else {
    // Assign based on index in categories array
    const index = categories.findIndex(c => c.toLowerCase().trim() === normalizedCat);
    color = COLOR_PALETTE[(index >= 0 ? index : categories.length) % COLOR_PALETTE.length];
  }
  
  categoryColorCache[normalizedCat] = color;
  return color;
};

// Create custom marker icon with category logo
const createCategoryIcon = (category: string, categories: string[], isSelected: boolean = false) => {
  const style = getCategoryColor(category, categories);
  const icon = getCategoryIcon(category);
  const size = isSelected ? 44 : 36;
  const iconSize = isSelected ? 20 : 16;
  
  return new L.DivIcon({
    html: `
      <div style="
        position: relative;
        width: ${size}px;
        height: ${size}px;
      ">
        <div style="
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: ${size}px;
          height: ${size}px;
          background: linear-gradient(135deg, ${style.bg} 0%, ${style.border} 100%);
          border-radius: 50% 50% 50% 0;
          transform: translateX(-50%) rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 4px 12px ${style.shadow}, 0 2px 4px rgba(0,0,0,0.2);
          ${isSelected ? 'animation: pulse 1.5s infinite;' : ''}
        "></div>
        <div style="
          position: absolute;
          top: ${(size - iconSize) / 2 - 2}px;
          left: 50%;
          transform: translateX(-50%);
          width: ${iconSize}px;
          height: ${iconSize}px;
          display: flex;
          align-items: center;
          justify-content: center;
        ">${icon}</div>
      </div>
      <style>
        @keyframes pulse {
          0%, 100% { transform: translateX(-50%) rotate(-45deg) scale(1); }
          50% { transform: translateX(-50%) rotate(-45deg) scale(1.1); }
        }
      </style>
    `,
    className: 'custom-category-marker',
    iconSize: [size, size + 10],
    iconAnchor: [size / 2, size + 5],
    popupAnchor: [0, -size],
  });
};

// Tile layer configurations
const TILE_LAYERS = {
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
  },
  street: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  hybrid: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri',
  },
};

// Labels overlay for satellite view
const LABELS_LAYER = {
  url: 'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
  attribution: '',
};

interface MapViewProps {
  assets: ExtendedAsset[];
  selectedAsset?: ExtendedAsset | null;
  onAssetClick: (asset: DashboardMapAssetType | null) => void;
  activeFilters: string[];
  categories?: Array<{ id: string; name: string; count: number }>;
}

// Component to handle map view changes when selectedAsset changes
function MapController({ selectedAsset, assets }: { selectedAsset?: ExtendedAsset | null; assets: ExtendedAsset[] }) {
  const map = useMap();

  useEffect(() => {
    const selectedCoords = selectedAsset ? getAssetCoords(selectedAsset) : null;
    if (selectedCoords) {
      map.flyTo([selectedCoords.lat, selectedCoords.lng], 17, {
        duration: 1.5,
      });
    } else if (assets.length > 0) {
      // Fit bounds to all assets
      const validAssets = assets.filter((a) => getAssetCoords(a) !== null);
      if (validAssets.length > 0) {
        const bounds = L.latLngBounds(
          validAssets.map((a) => {
            const coords = getAssetCoords(a)!;
            return [coords.lat, coords.lng] as [number, number];
          })
        );
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      }
    }
  }, [selectedAsset, assets, map]);

  return null;
}

export function MapView({ assets, selectedAsset, onAssetClick, activeFilters, categories = [] }: MapViewProps) {
  const t = useTranslations('assetmasterdashboard');
  const [mapType, setMapType] = useState<'satellite' | 'street' | 'hybrid'>('satellite');
  const [isClient, setIsClient] = useState(false);

  // Default center: Thane, Maharashtra, India
  const defaultCenter: [number, number] = [19.2183, 72.9781];
  const defaultZoom = 12;

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get unique category names from assets for dynamic coloring
  const categoryNames = useMemo(() => {
    if (categories.length > 0) {
      return categories.map(c => c.id || c.name);
    }
    return [...new Set(assets.map(a => a.category))];
  }, [assets, categories]);

  // Filter assets based on active filters and valid coordinates
  const filteredAssets = useMemo(() => {
    const assetsWithCoords = assets.filter((a) => {
      const coords = getAssetCoords(a);
      return coords !== null && coords.lat !== 0 && coords.lng !== 0;
    });
    if (activeFilters.length === 0) return assetsWithCoords;
    return assetsWithCoords.filter((a) => activeFilters.includes(a.category.toLowerCase()));
  }, [assets, activeFilters]);

  // Get category counts from filtered assets
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredAssets.forEach(asset => {
      const cat = asset.category.toLowerCase();
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [filteredAssets]);

  const handleMarkerClick = useCallback(
    (asset: ExtendedAsset) => {
      onAssetClick(asset);
    },
    [onAssetClick]
  );

  // Calculate center based on assets
  const mapCenter = useMemo(() => {
    const selectedCoords = selectedAsset ? getAssetCoords(selectedAsset) : null;
    if (selectedCoords) {
      return [selectedCoords.lat, selectedCoords.lng] as [number, number];
    }
    if (filteredAssets.length > 0) {
      const validAssets = filteredAssets.filter(a => getAssetCoords(a) !== null);
      if (validAssets.length > 0) {
        const avgLat = validAssets.reduce((sum, a) => sum + getAssetCoords(a)!.lat, 0) / validAssets.length;
        const avgLng = validAssets.reduce((sum, a) => sum + getAssetCoords(a)!.lng, 0) / validAssets.length;
        return [avgLat, avgLng] as [number, number];
      }
    }
    return defaultCenter;
  }, [filteredAssets, selectedAsset]);

  if (!isClient) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <span className="text-sm text-gray-600">Loading map...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      {/* Top Controls Bar */}
      <div className="absolute left-0 right-0 top-0 z-[1000] flex items-center justify-between p-2 pointer-events-none">
        {/* Left: Asset Count with Zoom Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="flex items-center gap-1 rounded-lg bg-white px-2.5 py-1.5 shadow-md border border-gray-100">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100">
              <MapPin className="h-3 w-3 text-blue-600" />
            </div>
            <span className="text-xs font-bold text-gray-800">
              {filteredAssets.length}
            </span>
            <span className="text-[10px] text-gray-500">Assets</span>
          </div>
        </div>

        {/* Right: Map Type Toggle */}
        <div className="flex items-center rounded-lg bg-white p-0.5 shadow-md border border-gray-100 pointer-events-auto">
          <button
            onClick={() => setMapType('satellite')}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-semibold transition-all ${
              mapType === 'satellite'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Satellite className="h-3.5 w-3.5" />
            <span>Satellite</span>
          </button>
          <button
            onClick={() => setMapType('hybrid')}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-semibold transition-all ${
              mapType === 'hybrid'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Hybrid</span>
          </button>
          <button
            onClick={() => setMapType('street')}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-semibold transition-all ${
              mapType === 'street'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <MapIcon className="h-3.5 w-3.5" />
            <span>Street</span>
          </button>
        </div>
      </div>

      {/* Map Container */}
      <MapContainer
        center={mapCenter}
        zoom={selectedAsset ? 17 : defaultZoom}
        className="h-full w-full"
        zoomControl={true}
        scrollWheelZoom={true}
      >
        {/* Base Tile Layer */}
        <TileLayer
          url={TILE_LAYERS[mapType].url}
          attribution={TILE_LAYERS[mapType].attribution}
          maxZoom={19}
        />

        {/* Labels overlay for satellite/hybrid views */}
        {(mapType === 'satellite' || mapType === 'hybrid') && (
          <TileLayer url={LABELS_LAYER.url} attribution={LABELS_LAYER.attribution} maxZoom={19} />
        )}

        {/* Map Controller for view changes */}
        <MapController selectedAsset={selectedAsset} assets={filteredAssets} />

        {/* Asset Markers */}
        {filteredAssets.map((asset) => {
          const coords = getAssetCoords(asset);
          if (!coords) return null;
          
          const isSelected = selectedAsset?.id === asset.id;
          const icon = createCategoryIcon(asset.category, categoryNames, isSelected);
          const categoryColor = getCategoryColor(asset.category, categoryNames);

          return (
            <Marker
              key={asset.id}
              position={[coords.lat, coords.lng]}
              icon={icon}
              eventHandlers={{
                click: () => handleMarkerClick(asset),
              }}
            >
              <Popup>
                <div className="min-w-[220px] p-1">
                  <h3 className="mb-1.5 text-sm font-bold text-gray-900">{asset.name}</h3>
                  <div className="mb-2 flex flex-wrap gap-1">
                    <span 
                      className="rounded-full px-2.5 py-0.5 text-[10px] font-bold capitalize text-white"
                      style={{ backgroundColor: categoryColor.bg }}
                    >
                      {asset.category}
                    </span>
                    {asset.subCategory && (
                      <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-semibold text-purple-700">
                        {asset.subCategory}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1 text-xs text-gray-600">
                    <p className="flex items-start gap-1">
                      <MapPin className="mt-0.5 h-3 w-3 flex-shrink-0 text-gray-400" />
                      <span className="line-clamp-2">{asset.location}</span>
                    </p>
                    <p><strong>Zone:</strong> {asset.zone}</p>
                    {asset.ward && <p><strong>Ward:</strong> {asset.ward}</p>}
                  </div>
                  <div className="mt-2 rounded-md bg-green-50 px-2 py-1.5 text-center">
                    <p className="text-[10px] text-gray-500">Asset Value</p>
                    <p className="text-sm font-bold text-green-600">₹ {asset.valueLakhs.toLocaleString('en-IN')} L</p>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* No Assets Message */}
      {filteredAssets.length === 0 && (
        <div className="absolute inset-0 z-[999] flex items-center justify-center bg-black/20">
          <div className="rounded-xl bg-white px-6 py-4 text-center shadow-xl border border-gray-100">
            <MapPin className="mx-auto mb-2 h-8 w-8 text-gray-400" />
            <p className="text-sm font-medium text-gray-600">
              {t('noAssetsWithCoordinates') || 'No assets with location data'}
            </p>
          </div>
        </div>
      )}

      {/* Bottom Legend - Clean horizontal layout */}
      {Object.keys(categoryCounts).length > 0 && (
        <div className="absolute bottom-2 left-2 right-2 z-[1000] pointer-events-none">
          <div className="inline-flex items-center gap-3 rounded-lg bg-white/95 px-3 py-2 shadow-md border border-gray-100 backdrop-blur-sm pointer-events-auto">
            <div className="flex items-center gap-1.5 border-r border-gray-200 pr-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                Categories
              </span>
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-blue-100 px-1.5 text-[10px] font-bold text-blue-700">
                {filteredAssets.length}
              </span>
            </div>
            <div className="flex items-center gap-4">
              {Object.entries(categoryCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([category, count]) => {
                  const style = getCategoryColor(category, categoryNames);
                  const icon = getCategoryIcon(category);
                  return (
                    <div key={category} className="flex items-center gap-1.5">
                      <div 
                        className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full shadow-sm"
                        style={{ background: `linear-gradient(135deg, ${style.bg} 0%, ${style.border} 100%)` }}
                        dangerouslySetInnerHTML={{ __html: icon.replace('width="16" height="16"', 'width="10" height="10"') }}
                      />
                      <span className="text-[11px] font-semibold capitalize text-gray-700">
                        {category}
                      </span>
                      <span className="text-[10px] font-bold text-gray-500">
                        {count}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
