import { colors, trendColor } from './colors';

/** Spacing scale (4pt grid). */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

/** Corner radii. */
export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

/** Font sizes & weights. Uses the platform system font for a native feel. */
export const typography = {
  display: { fontSize: 30, fontWeight: '700' as const, letterSpacing: -0.5 },
  h1: { fontSize: 24, fontWeight: '700' as const, letterSpacing: -0.3 },
  h2: { fontSize: 19, fontWeight: '700' as const, letterSpacing: -0.2 },
  h3: { fontSize: 16, fontWeight: '600' as const },
  body: { fontSize: 15, fontWeight: '400' as const },
  bodyStrong: { fontSize: 15, fontWeight: '600' as const },
  caption: { fontSize: 13, fontWeight: '400' as const },
  captionStrong: { fontSize: 13, fontWeight: '600' as const },
  micro: { fontSize: 11, fontWeight: '500' as const },
  label: { fontSize: 11, fontWeight: '700' as const, letterSpacing: 1.2 },
  mono: { fontSize: 15, fontWeight: '600' as const, fontVariant: ['tabular-nums'] as const },
} as const;

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  glow: {
    shadowColor: colors.brand,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

export const theme = { colors, spacing, radii, typography, shadow };
export { colors, trendColor };
export type Theme = typeof theme;
