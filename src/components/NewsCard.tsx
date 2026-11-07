import { View, StyleSheet } from 'react-native';
import { Zap, Target, ArrowUpRight, TrendingUp, TrendingDown, Minus } from 'lucide-react-native';
import { Card, Text, Badge } from '@/components/ui';
import { colors, radii, spacing } from '@/theme';
import { timeAgo } from '@/utils/format';
import type { NewsItem, Sentiment } from '@/types';

const sentimentMeta: Record<Sentiment, { color: string; Icon: typeof TrendingUp }> = {
  Bullish: { color: colors.positive, Icon: TrendingUp },
  Bearish: { color: colors.negative, Icon: TrendingDown },
  Neutral: { color: colors.textSecondary, Icon: Minus },
};

function impactTone(impact: number) {
  return impact >= 70 ? colors.negative : impact >= 60 ? colors.warning : colors.textSecondary;
}

export function NewsCard({ item }: { item: NewsItem }) {
  const s = sentimentMeta[item.sentiment];
  return (
    <Card style={styles.card}>
      <View style={styles.metaRow}>
        <View style={[styles.impact, { borderColor: impactTone(item.impact) + '55' }]}>
          <Zap size={11} color={impactTone(item.impact)} fill={impactTone(item.impact)} />
          <Text variant="micro" color={impactTone(item.impact)} style={styles.bold}>
            {item.impact}
          </Text>
        </View>
        <View style={styles.sentiment}>
          <s.Icon size={12} color={s.color} />
          <Text variant="micro" color={s.color}>
            {item.sentiment}
          </Text>
        </View>
        <Badge label={item.assetClass} tone="neutral" small />
        <View style={styles.flex} />
        <Text variant="micro" color={colors.textMuted}>
          {timeAgo(item.minutesAgo)}
        </Text>
      </View>

      <Text variant="h3" style={styles.headline}>
        {item.headline}
      </Text>
      <Text variant="caption" color={colors.textSecondary} numberOfLines={3} style={styles.summary}>
        {item.summary}
      </Text>

      <View style={styles.monitor}>
        <Target size={13} color={colors.brand} />
        <Text variant="micro" color={colors.textSecondary} numberOfLines={1} style={styles.flex}>
          {item.monitor}
        </Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.tickers}>
          <Text variant="micro" color={colors.textMuted} style={styles.aiImpact}>
            AI IMPACT
          </Text>
          {item.tickers.slice(0, 3).map((t) => (
            <Badge key={t} label={t} tone="brand" small />
          ))}
        </View>
        <View style={styles.source}>
          <Text variant="micro" color={colors.textMuted}>
            {item.source}
          </Text>
          <ArrowUpRight size={11} color={colors.textMuted} />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.sm },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  impact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  sentiment: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  bold: { fontWeight: '800' },
  flex: { flex: 1 },
  headline: { lineHeight: 21, marginTop: 2 },
  summary: { lineHeight: 18 },
  monitor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.bgElevated,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
  },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 },
  tickers: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
  aiImpact: { letterSpacing: 0.6, fontWeight: '700' },
  source: { flexDirection: 'row', alignItems: 'center', gap: 2 },
});
