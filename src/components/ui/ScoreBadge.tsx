import { View, StyleSheet } from 'react-native';
import { Text } from './Text';
import { colors, radii } from '@/theme';
import type { AiVerdict } from '@/types';

const map: Record<AiVerdict, { fg: string; bg: string }> = {
  BULLISH: { fg: colors.positive, bg: colors.positiveSoft },
  BEARISH: { fg: colors.negative, bg: colors.negativeSoft },
  NEUTRAL: { fg: colors.textSecondary, bg: 'rgba(148,163,184,0.12)' },
};

interface Props {
  verdict: AiVerdict;
  score: number;
  small?: boolean;
}

/** AI verdict pill, e.g. "AI BEARISH · 70". */
export function ScoreBadge({ verdict, score, small }: Props) {
  const c = map[verdict];
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }, small && styles.small]}>
      <Text variant="micro" color={c.fg} style={styles.text}>
        AI {verdict} · {score}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: radii.sm,
    alignSelf: 'flex-start',
  },
  small: { paddingHorizontal: 6, paddingVertical: 2 },
  text: { letterSpacing: 0.3, fontWeight: '700' },
});
