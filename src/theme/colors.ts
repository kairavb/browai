/**
 * BROW AI color system — dark fintech identity.
 * Deep navy-black surfaces, cyan→blue brand accent, semantic bull/bear/impact.
 */
export const colors = {
  // Surfaces
  bg: '#070B12',
  bgElevated: '#0B111B',
  surface: '#121A26',
  surfaceAlt: '#16202E',
  surfaceHover: '#1B2736',
  border: '#1E2A3A',
  borderStrong: '#2A3A4F',

  // Brand accent (cyan → blue)
  brand: '#22D3EE',
  brandDim: '#0E7490',
  blue: '#3B82F6',
  gradientFrom: '#0EA5E9',
  gradientTo: '#22D3EE',

  // Semantic
  positive: '#22C55E',
  positiveSoft: 'rgba(34,197,94,0.14)',
  negative: '#EF4444',
  negativeSoft: 'rgba(239,68,68,0.14)',
  warning: '#F59E0B',
  warningSoft: 'rgba(245,158,11,0.15)',
  purple: '#8B5CF6',

  // Text
  text: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  textFaint: '#475569',

  // Accent soft fills
  brandSoft: 'rgba(34,211,238,0.12)',
  blueSoft: 'rgba(59,130,246,0.14)',
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(3,6,12,0.72)',
} as const;

export type ColorKey = keyof typeof colors;

/** Return green for positive values, red for negative. */
export const trendColor = (value: number) =>
  value > 0 ? colors.positive : value < 0 ? colors.negative : colors.textSecondary;
