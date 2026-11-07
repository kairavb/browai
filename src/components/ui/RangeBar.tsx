import { View, StyleSheet } from 'react-native';
import { Text } from './Text';
import { colors, radii } from '@/theme';
import { rangePosition } from '@/utils/format';

interface Props {
  value: number;
  low: number;
  high: number;
  lowLabel?: string;
  highLabel?: string;
}

/** Low–High position indicator used on instrument cards. */
export function RangeBar({ value, low, high, lowLabel = 'L', highLabel = 'H' }: Props) {
  const pos = rangePosition(value, low, high);
  return (
    <View style={styles.wrap}>
      <Text variant="micro" color={colors.textMuted}>
        {lowLabel}
      </Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pos * 100}%` }]} />
        <View style={[styles.dot, { left: `${pos * 100}%` }]} />
      </View>
      <Text variant="micro" color={colors.textMuted}>
        {highLabel}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  track: {
    flex: 1,
    height: 4,
    borderRadius: radii.pill,
    backgroundColor: colors.border,
    justifyContent: 'center',
  },
  fill: {
    height: 4,
    borderRadius: radii.pill,
    backgroundColor: colors.brandDim,
  },
  dot: {
    position: 'absolute',
    width: 9,
    height: 9,
    borderRadius: 5,
    marginLeft: -4,
    backgroundColor: colors.brand,
  },
});
