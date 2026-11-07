import { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Pressable, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import {
  Sparkles,
  Calendar,
  ArrowRight,
  Target,
  Search,
  TrendingUp,
  Activity,
  Briefcase,
  Landmark,
  Waves,
  Clock,
  Radio,
} from 'lucide-react-native';
import { TabScreen } from '@/components/TabScreen';
import {
  Text,
  Card,
  PressableCard,
  Badge,
  Delta,
  Sparkline,
  MultiLineChart,
  SectionLabel,
} from '@/components/ui';
import { SymbolAvatar } from '@/components/ui/SymbolAvatar';
import { colors, radii, spacing, trendColor } from '@/theme';
import { formatPrice, formatPercent } from '@/utils/format';
import { heroTickers, intradayIndices, topGainers, topDecliners, worldMarkets } from '@/data/home';
import { econEvents } from '@/data/calendar';
import { news } from '@/data/news';
import { usePrefs } from '@/store/prefs';
import { getInstrument } from '@/data/instruments';

const exploreTiles = [
  { label: 'Factor Ranking', sub: 'Quantitative ranking', Icon: Target, href: '/factor-ranking' },
  { label: 'Screener', sub: 'Find securities', Icon: Search, href: '/screener' },
  { label: 'Tracked Setups', sub: 'AI trade outcomes', Icon: TrendingUp, href: '/tracked-setups' },
  { label: 'Options Intel', sub: 'Greeks, PCR, flows', Icon: Activity, href: '/options' },
  { label: 'Portfolio', sub: 'Track performance', Icon: Briefcase, href: '/portfolio' },
  { label: 'Mutual Funds', sub: 'Invest smarter', Icon: Landmark, href: '/mutual-funds' },
  { label: 'Liquidity Radar', sub: 'Unusual activity', Icon: Waves, href: '/radar' },
  { label: 'Scheduled Tasks', sub: 'Stay on top', Icon: Clock, href: '/scheduled-tasks' },
] as const;

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function Home() {
  const name = usePrefs((s) => s.name);
  const { width } = useWindowDimensions();
  const [chartTab, setChartTab] = useState('Indices');
  const [refreshing, setRefreshing] = useState(false);
  const chartWidth = width - spacing.lg * 2 - spacing.lg * 2;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  return (
    <TabScreen refreshing={refreshing} onRefresh={onRefresh}>
      {/* Greeting */}
      <View style={styles.greetRow}>
        <View style={styles.flex}>
          <Text variant="display">
            {greeting()}, {name}
          </Text>
          <Text variant="caption" color={colors.textSecondary} style={{ marginTop: 2 }}>
            Your global markets, decoded by BROW AI.
          </Text>
        </View>
      </View>
      <View style={styles.liveRow}>
        <Pressable style={styles.askPill} onPress={() => router.push('/ask')}>
          <Sparkles size={13} color={colors.brand} />
          <Text variant="micro" color={colors.brand} style={styles.bold}>
            Ask BROW AI
          </Text>
        </Pressable>
        <View style={styles.livePill}>
          <Radio size={11} color={colors.positive} />
          <Text variant="micro" color={colors.textSecondary}>
            Live · 5 open
          </Text>
        </View>
      </View>

      {/* Hero tickers */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.heroRow}>
        {heroTickers.map((t) => (
          <PressableCard
            key={t.symbol}
            onPress={() => router.push(`/stock/${encodeURIComponent(t.symbol)}`)}
            style={styles.heroCard}
          >
            <Text variant="micro" color={colors.textMuted} style={styles.heroLabel}>
              {t.label}
            </Text>
            <Text variant="h3" style={{ marginTop: 4 }}>
              {formatPrice(t.price, t.currency)}
            </Text>
            <View style={styles.heroBottom}>
              <Delta value={t.changePercent} variant="micro" />
              <Sparkline data={heroSpark(t.seed)} width={56} height={24} />
            </View>
          </PressableCard>
        ))}
      </ScrollView>

      {/* Intraday chart */}
      <Card style={styles.gap}>
        <View style={styles.cardHeader}>
          <View>
            <SectionLabel label="INTRADAY MARKET TRENDS" style={styles.noMargin} />
            <Text variant="micro" color={colors.textMuted}>
              Normalized % performance from session open
            </Text>
          </View>
        </View>
        <View style={styles.chartTabs}>
          {['Indices', 'Crypto', 'Commodities'].map((t) => (
            <Pressable
              key={t}
              onPress={() => setChartTab(t)}
              style={[styles.chartTab, chartTab === t && styles.chartTabActive]}
            >
              <Text variant="micro" color={chartTab === t ? colors.brand : colors.textSecondary}>
                {t}
              </Text>
            </Pressable>
          ))}
        </View>
        <MultiLineChart data={intradayIndices} width={chartWidth} />
        <View style={styles.legend}>
          {intradayIndices.map((s) => (
            <View key={s.label} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: s.color }]} />
              <Text variant="micro" color={colors.textSecondary}>
                {s.label}
              </Text>
              <Text variant="micro" color={trendColor(s.changePercent)} style={styles.bold}>
                {formatPercent(s.changePercent)}
              </Text>
            </View>
          ))}
        </View>
      </Card>

      {/* Session movers */}
      <Card style={styles.gap}>
        <View style={styles.cardHeader}>
          <SectionLabel label="SESSION TOP MOVERS" style={styles.noMargin} />
          <Pressable onPress={() => router.push('/screener')}>
            <Text variant="micro" color={colors.brand}>
              Full screener →
            </Text>
          </Pressable>
        </View>
        <Text variant="micro" color={colors.positive} style={styles.moverHead}>
          ↗ TOP GAINERS
        </Text>
        {topGainers.map((m) => (
          <MoverRow key={m.symbol} symbol={m.symbol} price={m.price} change={m.changePercent} />
        ))}
        <View style={styles.moverDivider} />
        <Text variant="micro" color={colors.negative} style={styles.moverHead}>
          ↘ TOP DECLINERS
        </Text>
        {topDecliners.map((m) => (
          <MoverRow key={m.symbol} symbol={m.symbol} price={m.price} change={m.changePercent} />
        ))}
      </Card>

      {/* Macro releases */}
      <View>
        <SectionLabel
          label="UPCOMING HIGH-IMPACT MACRO"
          icon={<Calendar size={12} color={colors.textSecondary} />}
          right={
            <Pressable onPress={() => router.push('/economic-calendar')}>
              <Text variant="micro" color={colors.brand}>
                Calendar →
              </Text>
            </Pressable>
          }
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.macroRow}>
          {econEvents.slice(0, 4).map((e) => (
            <Card key={e.id} style={styles.macroCard}>
              <View style={styles.macroTop}>
                <Text variant="micro">{e.flag}</Text>
                <Badge label={e.impact.toUpperCase()} tone="negative" small />
              </View>
              <Text variant="captionStrong" numberOfLines={2} style={{ marginTop: spacing.sm }}>
                {e.title}
              </Text>
              <Text variant="micro" color={colors.textMuted} style={{ marginTop: 4 }}>
                {e.region} · {e.time}
              </Text>
            </Card>
          ))}
        </ScrollView>
      </View>

      {/* Explore grid */}
      <View>
        <SectionLabel label="EXPLORE BROW AI" />
        <View style={styles.exploreGrid}>
          {exploreTiles.map((t) => (
            <PressableCard key={t.label} onPress={() => router.push(t.href as any)} style={styles.exploreTile}>
              <View style={styles.exploreIcon}>
                <t.Icon size={18} color={colors.brand} />
              </View>
              <View style={styles.flex}>
                <Text variant="captionStrong">{t.label}</Text>
                <Text variant="micro" color={colors.textMuted}>
                  {t.sub}
                </Text>
              </View>
            </PressableCard>
          ))}
        </View>
      </View>

      {/* Top news */}
      <View>
        <SectionLabel
          label="TOP NEWS & INSIGHTS"
          right={
            <Pressable onPress={() => router.push('/news')}>
              <Text variant="micro" color={colors.brand}>
                All news →
              </Text>
            </Pressable>
          }
        />
        <View style={styles.newsList}>
          {news.slice(0, 3).map((n) => (
            <PressableCard key={n.id} onPress={() => router.push('/news')} style={styles.newsRow}>
              <View style={styles.newsIcon}>
                <Target size={14} color={colors.brand} />
              </View>
              <Text variant="caption" numberOfLines={2} style={styles.flex}>
                {n.headline}
              </Text>
            </PressableCard>
          ))}
        </View>
      </View>

      {/* World markets */}
      <View>
        <SectionLabel label="WORLD MARKETS" />
        <View style={styles.worldGrid}>
          {worldMarkets.map((w) => (
            <Card key={w.label} style={styles.worldCard}>
              <Text style={styles.worldIcon}>{w.icon}</Text>
              <Text variant="captionStrong" style={{ marginTop: 4 }}>
                {w.label}
              </Text>
              <Text variant="micro" color={colors.textMuted}>
                {w.sub}
              </Text>
              <Delta value={w.changePercent} variant="micro" />
            </Card>
          ))}
        </View>
      </View>
    </TabScreen>
  );
}

function MoverRow({ symbol, price, change }: { symbol: string; price: number; change: number }) {
  const inst = getInstrument(symbol);
  return (
    <Pressable
      style={styles.moverRow}
      onPress={() => router.push(`/stock/${encodeURIComponent(symbol)}`)}
    >
      <SymbolAvatar symbol={symbol} size={30} />
      <Text variant="captionStrong" style={styles.flex}>
        {symbol}
      </Text>
      <Text variant="caption" color={colors.textSecondary}>
        {formatPrice(price, inst?.currency ?? 'INR')}
      </Text>
      <Badge label={formatPercent(change)} tone={change >= 0 ? 'positive' : 'negative'} small />
    </Pressable>
  );
}

// Local lightweight spark for hero cards (kept deterministic by seed).
function heroSpark(seed: number): number[] {
  const out: number[] = [];
  let v = 50;
  let s = seed;
  for (let i = 0; i < 20; i++) {
    s = (s * 16807) % 2147483647;
    v += ((s % 100) / 100 - 0.45) * 8;
    v = Math.max(10, Math.min(90, v));
    out.push(v);
  }
  return out;
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  bold: { fontWeight: '700' },
  gap: { gap: spacing.md },
  noMargin: { marginBottom: 0 },
  greetRow: { flexDirection: 'row', alignItems: 'center' },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: -spacing.md },
  askPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radii.pill,
    backgroundColor: colors.brandSoft,
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.3)',
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  heroRow: { gap: spacing.md, paddingRight: spacing.lg },
  heroCard: { width: 150, gap: 2 },
  heroLabel: { letterSpacing: 0.5, fontWeight: '700' },
  heroBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.sm },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  chartTabs: { flexDirection: 'row', gap: spacing.xs, backgroundColor: colors.bgElevated, borderRadius: radii.pill, padding: 3, alignSelf: 'flex-start' },
  chartTab: { paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radii.pill },
  chartTabActive: { backgroundColor: colors.brandSoft },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  moverHead: { letterSpacing: 0.5, fontWeight: '700', marginBottom: spacing.xs },
  moverRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: 7 },
  moverDivider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.sm },
  macroRow: { gap: spacing.md, paddingRight: spacing.lg },
  macroCard: { width: 180 },
  macroTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  exploreGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  exploreTile: { width: '47.5%', flexGrow: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md },
  exploreIcon: { width: 36, height: 36, borderRadius: radii.md, backgroundColor: colors.brandSoft, alignItems: 'center', justifyContent: 'center' },
  newsList: { gap: spacing.sm },
  newsRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md },
  newsIcon: { width: 30, height: 30, borderRadius: radii.sm, backgroundColor: colors.brandSoft, alignItems: 'center', justifyContent: 'center' },
  worldGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  worldCard: { width: '31%', flexGrow: 1, padding: spacing.md },
  worldIcon: { fontSize: 18 },
});
