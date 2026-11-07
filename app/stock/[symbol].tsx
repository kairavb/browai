import { useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, useWindowDimensions } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Star, Sparkles, Target, TrendingUp, TrendingDown, Minus } from 'lucide-react-native';
import {
  Text,
  Card,
  Badge,
  Button,
  Delta,
  ScoreBadge,
  RangeBar,
  CandleChart,
  SegmentedTabs,
} from '@/components/ui';
import { SymbolAvatar } from '@/components/ui/SymbolAvatar';
import { NewsCard } from '@/components/NewsCard';
import { colors, radii, spacing } from '@/theme';
import { formatPrice, formatSignedPrice, formatCompact } from '@/utils/format';
import { getInstrument } from '@/data/instruments';
import { makeCandles } from '@/utils/series';
import { news } from '@/data/news';
import { useWatchlist } from '@/store/watchlist';

const timeframes = ['15m', '1H', '1D', '1W'];
const tfSeed: Record<string, number> = { '15m': 3, '1H': 7, '1D': 13, '1W': 21 };

export default function StockDetail() {
  const insets = useSafeAreaInsets();
  const { symbol } = useLocalSearchParams<{ symbol: string }>();
  const { width } = useWindowDimensions();
  const [tf, setTf] = useState('1D');
  const inst = getInstrument(symbol);
  const { has, toggle } = useWatchlist();

  const candles = useMemo(() => {
    if (!inst) return [];
    const trend = inst.aiVerdict === 'BULLISH' ? 1 : inst.aiVerdict === 'BEARISH' ? -1 : 0.2;
    return makeCandles(inst.seed * tfSeed[tf], inst.price, 44, trend);
  }, [inst, tf]);

  const related = useMemo(
    () => (inst ? news.filter((n) => n.tickers.includes(inst.symbol)).slice(0, 2) : []),
    [inst],
  );

  if (!inst) {
    return (
      <View style={[styles.root, styles.center]}>
        <Text variant="h3">Instrument not found</Text>
        <Button label="Go back" variant="outline" small onPress={() => router.back()} style={{ marginTop: spacing.lg }} />
      </View>
    );
  }

  const chartW = width - spacing.lg * 2 - spacing.lg * 2;
  const saved = has(inst.symbol);
  const verdictColor =
    inst.aiVerdict === 'BULLISH' ? colors.positive : inst.aiVerdict === 'BEARISH' ? colors.negative : colors.textSecondary;

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable style={styles.iconBtn} onPress={() => router.back()}>
          <ChevronLeft size={22} color={colors.text} />
        </Pressable>
        <View style={styles.headerCenter}>
          <SymbolAvatar symbol={inst.symbol} size={28} />
          <Text variant="h3">{inst.symbol}</Text>
        </View>
        <Pressable style={styles.iconBtn} onPress={() => toggle(inst.symbol)}>
          <Star size={20} color={saved ? colors.warning : colors.textSecondary} fill={saved ? colors.warning : 'transparent'} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.xxxl }]} showsVerticalScrollIndicator={false}>
        {/* Price block */}
        <View style={styles.priceBlock}>
          <View style={styles.flexRow}>
            <Text variant="caption" color={colors.textMuted}>
              {inst.name}
            </Text>
            <Badge label={inst.market} tone="brand" small />
            <Badge label={inst.sector ?? inst.segment} tone="neutral" small />
          </View>
          <Text variant="display" style={{ marginTop: spacing.xs }}>
            {formatPrice(inst.price, inst.currency)}
          </Text>
          <View style={styles.changeRow}>
            <Delta value={inst.changePercent} variant="bodyStrong" />
            <Text variant="caption" color={colors.textMuted}>
              {formatSignedPrice(inst.change, inst.currency)} today
            </Text>
          </View>
        </View>

        {/* Chart */}
        <Card style={styles.chartCard}>
          <View style={styles.chartHead}>
            <SegmentedTabs options={timeframes} value={tf} onChange={setTf} size="sm" />
            <Badge label={inst.macd} tone={inst.aiVerdict === 'BULLISH' ? 'positive' : inst.aiVerdict === 'BEARISH' ? 'negative' : 'neutral'} small />
          </View>
          <CandleChart candles={candles} width={chartW} />
          <View style={styles.levelLegend}>
            <LegendDot color={colors.negative} label={`Res ${inst.resistance}`} />
            <LegendDot color={colors.brand} label={`LTP ${inst.price}`} />
            <LegendDot color={colors.positive} label={`Sup ${inst.support}`} />
          </View>
        </Card>

        {/* AI Verdict */}
        <Card style={styles.verdictCard}>
          <View style={styles.verdictHead}>
            <View style={styles.verdictIcon}>
              <Sparkles size={16} color={colors.brand} />
            </View>
            <Text variant="label" color={colors.textSecondary}>
              BROW AI VERDICT
            </Text>
            <View style={styles.flex} />
            <ScoreBadge verdict={inst.aiVerdict} score={inst.aiScore} />
          </View>

          <View style={styles.convictionRow}>
            <Text variant="micro" color={colors.textMuted}>
              Conviction
            </Text>
            <View style={styles.convictionTrack}>
              <View style={[styles.convictionFill, { width: `${inst.aiScore}%`, backgroundColor: verdictColor }]} />
            </View>
            <Text variant="captionStrong" color={verdictColor}>
              {inst.aiScore}/100
            </Text>
          </View>

          <Text variant="caption" color={colors.textSecondary} style={styles.thesis}>
            {inst.thesis}
          </Text>

          <Button
            label={`Ask BROW about ${inst.symbol}`}
            icon={<Sparkles size={16} color={colors.white} />}
            onPress={() => router.push('/ask')}
            fullWidth
            small
          />
        </Card>

        {/* Technicals */}
        <Card style={styles.block}>
          <Text variant="label" color={colors.textSecondary}>
            TECHNICAL SIGNALS
          </Text>
          <View style={styles.signalGrid}>
            {inst.signals.map((s) => {
              const Icon = s.tone === 'positive' ? TrendingUp : s.tone === 'negative' ? TrendingDown : Minus;
              const c = s.tone === 'positive' ? colors.positive : s.tone === 'negative' ? colors.negative : colors.textSecondary;
              return (
                <View key={s.label} style={styles.signalTile}>
                  <Text variant="micro" color={colors.textMuted}>
                    {s.label}
                  </Text>
                  <View style={styles.signalVal}>
                    <Icon size={13} color={c} />
                    <Text variant="captionStrong" color={c} numberOfLines={1} style={styles.flex}>
                      {s.value}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </Card>

        {/* Key levels */}
        <Card style={styles.block}>
          <Text variant="label" color={colors.textSecondary}>
            KEY LEVELS
          </Text>
          <View style={styles.levelRow}>
            <LevelPill label="Support" value={formatPrice(inst.support, inst.currency)} color={colors.positive} />
            <LevelPill label="Resistance" value={formatPrice(inst.resistance, inst.currency)} color={colors.negative} />
          </View>
          <View style={styles.rangeWrap}>
            <View style={styles.rangeHead}>
              <Text variant="micro" color={colors.textMuted}>
                Day Range
              </Text>
              <Text variant="micro" color={colors.textSecondary}>
                {formatPrice(inst.dayLow, inst.currency)} – {formatPrice(inst.dayHigh, inst.currency)}
              </Text>
            </View>
            <RangeBar value={inst.price} low={inst.dayLow} high={inst.dayHigh} />
          </View>
          <View style={styles.rangeWrap}>
            <View style={styles.rangeHead}>
              <Text variant="micro" color={colors.textMuted}>
                52-Week Range
              </Text>
              <Text variant="micro" color={colors.textSecondary}>
                {formatPrice(inst.yearLow, inst.currency)} – {formatPrice(inst.yearHigh, inst.currency)}
              </Text>
            </View>
            <RangeBar value={inst.price} low={inst.yearLow} high={inst.yearHigh} />
          </View>
        </Card>

        {/* Stats */}
        <Card style={styles.block}>
          <Text variant="label" color={colors.textSecondary}>
            STATISTICS
          </Text>
          <View style={styles.statGrid}>
            <Stat label="RSI (14)" value={`${inst.rsi}`} />
            <Stat label="EMA 20" value={formatPrice(inst.ema20, inst.currency)} />
            <Stat label="EMA 50" value={formatPrice(inst.ema50, inst.currency)} />
            <Stat label="Volume" value={formatCompact(inst.volume)} />
            {inst.marketCap ? <Stat label="Mkt Cap" value={formatCompact(inst.marketCap)} /> : null}
            {inst.pe ? <Stat label="P/E" value={inst.pe.toFixed(1)} /> : null}
          </View>
        </Card>

        {/* Related news */}
        {related.length > 0 && (
          <View style={styles.block}>
            <View style={styles.newsHead}>
              <Target size={13} color={colors.brand} />
              <Text variant="label" color={colors.textSecondary}>
                RELATED NEWS
              </Text>
            </View>
            <View style={{ gap: spacing.md }}>
              {related.map((n) => (
                <NewsCard key={n.id} item={n} />
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendDotRow}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text variant="micro" color={colors.textMuted}>
        {label}
      </Text>
    </View>
  );
}

function LevelPill({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={[styles.levelPill, { borderColor: color + '44' }]}>
      <Text variant="micro" color={colors.textMuted}>
        {label}
      </Text>
      <Text variant="captionStrong" color={color}>
        {value}
      </Text>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text variant="micro" color={colors.textMuted}>
        {label}
      </Text>
      <Text variant="captionStrong" style={{ marginTop: 2 }}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  center: { alignItems: 'center', justifyContent: 'center' },
  flex: { flex: 1 },
  flexRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.bgElevated,
  },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  iconBtn: { width: 38, height: 38, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center' },
  scroll: { padding: spacing.lg, gap: spacing.lg },
  priceBlock: { gap: 2 },
  changeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: 2 },
  chartCard: { gap: spacing.md },
  chartHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  levelLegend: { flexDirection: 'row', justifyContent: 'space-between' },
  legendDotRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  verdictCard: { gap: spacing.md },
  verdictHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  verdictIcon: { width: 30, height: 30, borderRadius: radii.sm, backgroundColor: colors.brandSoft, alignItems: 'center', justifyContent: 'center' },
  convictionRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  convictionTrack: { flex: 1, height: 6, borderRadius: radii.pill, backgroundColor: colors.border },
  convictionFill: { height: 6, borderRadius: radii.pill },
  thesis: { lineHeight: 20 },
  block: { gap: spacing.md },
  signalGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  signalTile: { width: '47.5%', flexGrow: 1, gap: 4, backgroundColor: colors.bgElevated, borderRadius: radii.md, borderWidth: 1, borderColor: colors.border, padding: spacing.sm },
  signalVal: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  levelRow: { flexDirection: 'row', gap: spacing.sm },
  levelPill: { flex: 1, gap: 2, padding: spacing.md, borderRadius: radii.md, borderWidth: 1, backgroundColor: colors.bgElevated },
  rangeWrap: { gap: 6 },
  rangeHead: { flexDirection: 'row', justifyContent: 'space-between' },
  statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  stat: { width: '30%', flexGrow: 1, backgroundColor: colors.bgElevated, borderRadius: radii.md, borderWidth: 1, borderColor: colors.border, padding: spacing.sm },
  newsHead: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});
