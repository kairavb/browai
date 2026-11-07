import { View, StyleSheet } from 'react-native';
import { TrendingUp, TrendingDown } from 'lucide-react-native';
import { Text } from './Text';
import { trendColor } from '@/theme';
import { formatPercent } from '@/utils/format';

interface Props {
  value: number;
  showIcon?: boolean;
  variant?: 'caption' | 'captionStrong' | 'micro' | 'bodyStrong';
  suffix?: string;
}

/** Colored percentage change with an optional trend arrow. */
export function Delta({ value, showIcon = true, variant = 'captionStrong', suffix }: Props) {
  const c = trendColor(value);
  const Icon = value >= 0 ? TrendingUp : TrendingDown;
  return (
    <View style={styles.row}>
      {showIcon && <Icon size={13} color={c} strokeWidth={2.5} />}
      <Text variant={variant} color={c}>
        {formatPercent(value)}
        {suffix}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 3 },
});
