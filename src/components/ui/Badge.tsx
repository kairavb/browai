import { View, StyleSheet } from 'react-native';
import { Text } from './Text';
import { colors, radii, spacing } from '@/theme';

type Tone = 'brand' | 'positive' | 'negative' | 'warning' | 'neutral' | 'purple';

const toneColor: Record<Tone, { fg: string; bg: string }> = {
  brand: { fg: colors.brand, bg: colors.brandSoft },
  positive: { fg: colors.positive, bg: colors.positiveSoft },
  negative: { fg: colors.negative, bg: colors.negativeSoft },
  warning: { fg: colors.warning, bg: colors.warningSoft },
  neutral: { fg: colors.textSecondary, bg: 'rgba(148,163,184,0.12)' },
  purple: { fg: colors.purple, bg: 'rgba(139,92,246,0.14)' },
};

interface Props {
  label: string;
  tone?: Tone;
  solid?: boolean;
  small?: boolean;
}

export function Badge({ label, tone = 'neutral', solid, small }: Props) {
  const c = toneColor[tone];
  return (
    <View
      style={[
        styles.badge,
        small && styles.small,
        { backgroundColor: solid ? c.fg : c.bg },
      ]}
    >
      <Text
        variant={small ? 'micro' : 'captionStrong'}
        style={styles.text}
        color={solid ? colors.black : c.fg}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radii.sm,
    alignSelf: 'flex-start',
  },
  small: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  text: {
    letterSpacing: 0.3,
  },
});
