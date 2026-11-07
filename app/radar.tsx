import { useMemo, useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import {
  Waves,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  TrendingDown,
  Zap,
  RefreshCw,
} from 'lucide-react-native';
import { ToolScreen } from '@/components/ToolScreen';
import { CoPilotBanner } from '@/components/CoPilotBanner';
import { Text, Card, Badge, SegmentedTabs, Delta, EmptyState } from '@/components/ui';
import { SymbolAvatar } from '@/components/ui/SymbolAvatar';
import { colors, radii, spacing } from '@/theme';
import { radarRows } from '@/data/radar';
import type { RadarRow, RadarSignal, Segment } from '@/types';

const segments = ['All Segments', 'India Equity', 'India F&O', 'Crypto', 'Global'];
const signals: (RadarSignal | 'All Signals')[] = [
  'All Signals',
  'Breakout',
  'Breakdown',
  'Accumulation',
  'Distribution',
  'Volume Spike',
];
const thresholds = [20, 40, 60, 80];

const signalMeta: Record<RadarSignal, { tone: 'positive' | 'negative' | 'warning' | 'brand'; Icon: typeof Waves }> = {
  Breakout: { tone: 'positive', Icon: ArrowUpRight },
  Breakdown: { tone: 'negative', Icon: ArrowDownRight },
  Accumulation: { tone: 'brand', Icon: TrendingUp },
  Distribution: { tone: 'warning', Icon: TrendingDown },
  'Volume Spike': { tone: 'warning', Icon: Zap },
};

export default function Radar() {
  const [segment, setSegment] = useState('All Segments');
  const [signal, setSignal] = useState('All Signals');
  const [minScore, setMinScore] = useState(20);
  const [refreshing, setRefreshing] = useState(false);

  const rows = useMemo(
    () =>
      radarRows
        .filter(
          (r) =>
            (segment === 'All Segments' || r.segment === (segment as Segment)) &&
            (signal === 'All Signals' || r.signal === signal) &&
            r.score >= minScore,
        )
        .sort((a, b) => b.score - a.score),
    [segment, signal, minScore],
  );

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 700);
  };

  return (
    <ToolScreen
      title="Liquidity Radar"
      subtitle="Real-time accumulation, volume spikes & breakout detection"
      icon={<Waves size={18} color={colors.brand} />}
      pro
      right={
        <Pressable style={styles.autoBtn} onPress={refresh}>
          <RefreshCw size={13} color={colors.positive} />
          <Text variant="micro" color={colors.positive}>
            Auto
          </Text>
        </Pressable>
      }
    >
      <CoPilotBanner
        title="BROW AI Flow Co-Pilot"
        subtitle="Decode unusual volume spikes, institutional accumulation & distribution footprints"
        actions={['Decode Top Volume Spike', 'Institutional Accumulation Scan', 'FII Flow Check']}
      />

      <SegmentedTabs options={segments} value={segment} onChange={setSegment} />
      <SegmentedTabs options={signals} value={signal} onChange={setSignal} size="sm" />

      <View style={styles.scoreRow}>
        <Text variant="micro" color={colors.textMuted}>
          MIN SCORE
        </Text>
        <View style={styles.thresholds}>
          {thresholds.map((t) => (
            <Pressable key={t} onPress={() => setMinScore(t)} style={[styles.scorePill, minScore === t && styles.scoreActive]}>
              <Text variant="micro" color={minScore === t ? colors.brand : colors.textMuted}>
                {t}+
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {rows.length === 0 ? (
        <Card padded={false}>
          <EmptyState
            title="No signals"
            message="No instruments match these filters right now. Lower the min score or change segment."
            icon={<Waves size={24} color={colors.brand} />}
          />
        </Card>
      ) : (
        <View style={styles.list}>
          {rows.map((r) => (
            <RadarCard key={r.id} row={r} />
          ))}
        </View>
      )}

      <Text variant="micro" color={colors.textFaint} center style={styles.footer}>
        Auto-refreshes every 30s · Scores normalized across momentum, intraday range, volume spike & OI delta.
      </Text>
    </ToolScreen>
  );
}

function RadarCard({ row }: { row: RadarRow }) {
  const meta = signalMeta[row.signal];
  return (
    <Pressable onPress={() => router.push(`/stock/${encodeURIComponent(row.symbol)}`)}>
      <Card style={styles.card}>
        <SymbolAvatar symbol={row.symbol} size={40} />
        <View style={styles.flex}>
          <View style={styles.cardTop}>
            <Text variant="bodyStrong">{row.symbol}</Text>
            <View style={styles.signalBadge}>
              <meta.Icon size={11} color={colors[meta.tone === 'brand' ? 'brand' : meta.tone]} />
              <Badge label={row.signal} tone={meta.tone} small />
            </View>
          </View>
          <Text variant="micro" color={colors.textMuted} numberOfLines={2} style={{ marginTop: 2 }}>
            {row.note}
          </Text>
          <View style={styles.cardFoot}>
            <View style={styles.scoreChip}>
              <Text variant="micro" color={colors.brand} style={styles.bold}>
                {row.score}
              </Text>
            </View>
            <Delta value={row.changePercent} variant="micro" />
            <Text variant="micro" color={colors.textSecondary}>
              {row.volumeX.toFixed(1)}× vol
            </Text>
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  bold: { fontWeight: '800' },
  autoBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radii.pill, backgroundColor: colors.positiveSoft, borderWidth: 1, borderColor: 'rgba(34,197,94,0.3)' },
  scoreRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  thresholds: { flexDirection: 'row', gap: spacing.sm },
  scorePill: { paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radii.pill, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  scoreActive: { backgroundColor: colors.brandSoft, borderColor: colors.brand },
  list: { gap: spacing.md },
  card: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  signalBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardFoot: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.sm },
  scoreChip: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6, backgroundColor: colors.brandSoft },
  footer: { marginTop: spacing.sm, lineHeight: 15 },
});
