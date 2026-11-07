import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { PressableCard, Text, Sparkline, Delta, ScoreBadge } from '@/components/ui';
import { SymbolAvatar } from '@/components/ui/SymbolAvatar';
import { colors, spacing } from '@/theme';
import { formatPrice } from '@/utils/format';
import type { Instrument } from '@/types';

/** Compact instrument row used in screener / search / factor lists. */
export function InstrumentRow({ item, showScore = true }: { item: Instrument; showScore?: boolean }) {
  return (
    <PressableCard
      onPress={() => router.push(`/stock/${encodeURIComponent(item.symbol)}`)}
      style={styles.row}
      padded={false}
    >
      <SymbolAvatar symbol={item.symbol} size={38} />
      <View style={styles.flex}>
        <View style={styles.topRow}>
          <Text variant="bodyStrong">{item.symbol}</Text>
          {showScore && <ScoreBadge verdict={item.aiVerdict} score={item.aiScore} small />}
        </View>
        <Text variant="micro" color={colors.textMuted} numberOfLines={1}>
          {item.name} · {item.sector}
        </Text>
      </View>
      <Sparkline data={item.spark} width={56} height={28} />
      <View style={styles.priceCol}>
        <Text variant="captionStrong">{formatPrice(item.price, item.currency)}</Text>
        <Delta value={item.changePercent} showIcon={false} variant="micro" />
      </View>
    </PressableCard>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
  },
  flex: { flex: 1, gap: 2 },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  priceCol: { alignItems: 'flex-end', gap: 2, minWidth: 74 },
});
