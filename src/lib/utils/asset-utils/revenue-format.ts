/**
 * Presentation helpers for the Revenue Management Dashboard.
 *
 * The API returns money as plain rupee decimals; the dashboard renders them in the
 * compact Indian Lakh / Crore notation seen in the design. Keeping these helpers in
 * one place avoids the per-component re-implementation the mock screens used to carry.
 */

/** Compact Lakh notation, e.g. 930000 -> "₹9.3 L". */
export function formatLakh(
  amount: number,
  options: { decimals?: number; space?: boolean } = {}
): string {
  const { decimals = 1, space = false } = options;
  const value = (Number(amount) || 0) / 100000;
  return `₹${value.toFixed(decimals)}${space ? ' ' : ''}L`;
}

/** Compact Crore notation, e.g. 1120000 -> "₹0.11Cr". */
export function formatCrore(amount: number, decimals = 2): string {
  const value = (Number(amount) || 0) / 10000000;
  return `₹${value.toFixed(decimals)}Cr`;
}

/** Full grouped rupee amount, e.g. 75000 -> "₹75,000". */
export function formatINR(amount: number): string {
  return `₹${(Number(amount) || 0).toLocaleString('en-IN', {
    maximumFractionDigits: 0,
  })}`;
}

/** Percentage with a single decimal, e.g. 78.234 -> "78.2%". */
export function formatPercent(value: number, decimals = 1): string {
  return `${(Number(value) || 0).toFixed(decimals)}%`;
}

/**
 * Visual theme for a category card / zone slice. The API drives counts and money;
 * the palette is purely presentational and cycles deterministically by index so the
 * same category always keeps the same colour within a render.
 */
export interface RevenuePalette {
  border: string;
  bg: string;
  iconBg: string;
  hex: string;
}

const CATEGORY_PALETTE: readonly RevenuePalette[] = [
  { border: 'border-emerald-200', bg: 'bg-emerald-50', iconBg: 'bg-emerald-500', hex: '#10B981' },
  { border: 'border-blue-200', bg: 'bg-blue-50', iconBg: 'bg-blue-500', hex: '#3B82F6' },
  { border: 'border-purple-200', bg: 'bg-purple-50', iconBg: 'bg-fuchsia-500', hex: '#A855F7' },
  { border: 'border-orange-200', bg: 'bg-orange-50', iconBg: 'bg-orange-500', hex: '#F97316' },
  { border: 'border-pink-200', bg: 'bg-pink-50', iconBg: 'bg-pink-500', hex: '#EC4899' },
  { border: 'border-teal-200', bg: 'bg-teal-50', iconBg: 'bg-teal-500', hex: '#14B8A6' },
];

export function paletteForIndex(index: number): RevenuePalette {
  return CATEGORY_PALETTE[((index % CATEGORY_PALETTE.length) + CATEGORY_PALETTE.length) % CATEGORY_PALETTE.length];
}

const ZONE_HEX: readonly string[] = ['#8B5CF6', '#EC4899', '#F97316', '#14B8A6', '#3B82F6', '#10B981'];

export function zoneColorForIndex(index: number): string {
  return ZONE_HEX[((index % ZONE_HEX.length) + ZONE_HEX.length) % ZONE_HEX.length];
}
