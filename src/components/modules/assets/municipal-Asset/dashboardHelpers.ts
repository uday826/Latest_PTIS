import { Building, Building2, Landmark, Layers, Truck as TruckIcon } from 'lucide-react';

export const getCategoryMeta = (categoryName: string) => {
  const nameLower = (categoryName || '').toLowerCase();
  if (nameLower.includes('building') || nameLower.includes('property')) {
    return { id: 'building', icon: Building2, description: 'Municipal offices, hospitals, schools, community halls, staff quarters' };
  }
  if (nameLower.includes('land') || nameLower.includes('plot')) {
    return { id: 'land', icon: Landmark, description: 'Municipal lands, plots, markets, parks, gardens, reserved lands' };
  }
  if (nameLower.includes('infrastructure') || nameLower.includes('road')) {
    return { id: 'infrastructure', icon: Building, description: 'Roads, bridges, drains, water systems, street infrastructure' };
  }
  if (nameLower.includes('movable') || nameLower.includes('vehicle') || nameLower.includes('equipment')) {
    return { id: 'movable', icon: TruckIcon, description: 'Vehicles, machinery, equipment, computers, furniture' };
  }
  return { id: 'building', icon: Layers, description: 'Asset category and its associated items' };
};

export const themes: Record<string, any> = {
  building: {
    hero: 'from-[#1e3a8a] via-[#1d4ed8] to-[#3b82f6]',
    heroBorder: 'border-blue-400/30',
    iconRing: 'ring-blue-300/40',
    statBg: 'bg-blue-50', statBorder: 'border-blue-200',
    statText: 'text-blue-900', statLabel: 'text-blue-600',
    chipBg: 'bg-blue-50', chipBorder: 'border-blue-300',
    chipText: 'text-blue-900', chipHover: 'hover:bg-blue-100 hover:border-blue-500',
    dot: 'bg-blue-500', accentBar: 'bg-blue-500',
  },
  land: {
    hero: 'from-[#064e3b] via-[#059669] to-[#34d399]',
    heroBorder: 'border-emerald-400/30',
    iconRing: 'ring-emerald-300/40',
    statBg: 'bg-emerald-50', statBorder: 'border-emerald-200',
    statText: 'text-emerald-900', statLabel: 'text-emerald-700',
    chipBg: 'bg-emerald-50', chipBorder: 'border-emerald-300',
    chipText: 'text-emerald-900', chipHover: 'hover:bg-emerald-100 hover:border-emerald-500',
    dot: 'bg-emerald-500', accentBar: 'bg-emerald-500',
  },
  infrastructure: {
    hero: 'from-[#3b0764] via-[#7c3aed] to-[#a78bfa]',
    heroBorder: 'border-violet-400/30',
    iconRing: 'ring-violet-300/40',
    statBg: 'bg-violet-50', statBorder: 'border-violet-200',
    statText: 'text-violet-900', statLabel: 'text-violet-700',
    chipBg: 'bg-violet-50', chipBorder: 'border-violet-300',
    chipText: 'text-violet-900', chipHover: 'hover:bg-violet-100 hover:border-violet-500',
    dot: 'bg-violet-500', accentBar: 'bg-violet-500',
  },
  movable: {
    hero: 'from-[#7c2d12] via-[#ea580c] to-[#fb923c]',
    heroBorder: 'border-orange-400/30',
    iconRing: 'ring-orange-300/40',
    statBg: 'bg-orange-50', statBorder: 'border-orange-200',
    statText: 'text-orange-900', statLabel: 'text-orange-700',
    chipBg: 'bg-orange-50', chipBorder: 'border-orange-300',
    chipText: 'text-orange-900', chipHover: 'hover:bg-orange-100 hover:border-orange-500',
    dot: 'bg-orange-500', accentBar: 'bg-orange-500',
  },
};
