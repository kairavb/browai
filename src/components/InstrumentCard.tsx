import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { PressableCard, Text, Badge, ScoreBadge, RangeBar, Sparkline, Delta } from '@/components/ui';
import { SymbolAvatar } from '@/components/ui/SymbolAvatar';
import { colors, spacing } from '@/theme';
import { formatPrice, formatSignedPrice } from '@/utils/format';
import type { Instrument } from '@/types';

/** Full watchlist instrument card mirroring the reference layout. */
export function InstrumentCard({ item }: { item: Instrument }) {
  return (
    <PressableCard onPress={() => router.push(`/stock/${encodeURIComponent(item.symbol)}`)} style={styles.card}>
      <View style={styles.header}>
        <SymbolAvatar symbol={item.symbol} size={40} />
        <View style={styles.flex}>
          <View style={styles.titleRow}>
            <Text variant="bodyStrong">{item.symbol}</Text>
            <Badge label={item.market} tone="brand" small />
          </View>
          <Text variant="micro" color={colors.textMuted} numberOfLines={1}>
            {item.name}
          </Text>
        </View>
      </View>

      <View style={styles.badges}>
        <ScoreBadge verdict={item.aiVerdict} score={item.aiScore} small />
        <Badge label={`RSI ${item.rsi}`} tone={item.rsi >= 70 ? 'negative' : item.rsi <= 30 ? 'positive' : 'neutral'} small />
      </View>

      <View style={styles.mid}>
        <Sparkline data={item.spark} width={110} height={40} />
        <View style={styles.priceCol}>
          <Text variant="h3">{formatPrice(item.price, item.currency)}</Text>
          <View style={styles.changeRow}>
            <Delta value={item.changePercent} />
            <Text variant="micro" color={colors.textMuted}>
              {formatSignedPrice(item.change, item.currency)}
            </Text>
          </View>
        </View>
      </View>

      <RangeBar value={item.price} low={item.dayLow} high={item.dayHigh} />
    </PressableCard>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  badges: { flexDirection: 'row', gap: spacing.sm },
  mid: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  priceCol: { alignItems: 'flex-end' },
  changeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: 2 },
});
