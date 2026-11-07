import { useMemo } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Briefcase } from 'lucide-react-native';
import { ToolScreen } from '@/components/ToolScreen';
import { CoPilotBanner } from '@/components/CoPilotBanner';
import { Text, Card, Delta } from '@/components/ui';
import { SymbolAvatar } from '@/components/ui/SymbolAvatar';
import { colors, radii, spacing } from '@/theme';
import { formatPrice, formatPercent, formatCompact } from '@/utils/format';
import { holdings } from '@/data/portfolio';

// Convert USD holdings to INR for a single blended total (approx).
const USD_INR = 88.5;

export default function Portfolio() {
  const metrics = useMemo(() => {
    let invested = 0;
    let current = 0;
    const rows = holdings.map((h) => {
      const fx = h.currency === 'USD' ? USD_INR : 1;
      const inv = h.qty * h.avg * fx;
      const cur = h.qty * h.ltp * fx;
      invested += inv;
      current += cur;
      const pnl = cur - inv;
      const pnlPct = (pnl / inv) * 100;
      return { ...h, inv, cur, pnl, pnlPct };
    });
    const pnl = current - invested;
    const pnlPct = (pnl / invested) * 100;
    const withWeight = rows
      .map((r) => ({ ...r, weight: (r.cur / current) * 100 }))
      .sort((a, b) => b.cur - a.cur);
    return { invested, current, pnl, pnlPct, rows: withWeight };
  }, []);

  return (
    <ToolScreen
      title="Portfolio"
      subtitle="AI-managed holdings & performance"
      icon={<Briefcase size={18} color={colors.brand} />}
      pro
    >
      <CoPilotBanner
        title="BROW AI Portfolio Co-Pilot"
        subtitle="Run institutional risk, concentration, correlation & multi-timeframe health checks"
        actions={['Audit My Portfolio Risk', 'Hedge & Correlation Check']}
      />

      {/* Summary */}
      <Card style={styles.summary}>
        <Text variant="micro" color={colors.textMuted}>
          CURRENT VALUE
        </Text>
        <Text variant="display">{formatPrice(metrics.current, 'INR')}</Text>
        <View style={styles.summaryRow}>
          <Delta value={metrics.pnlPct} variant="bodyStrong" />
          <Text variant="caption" color={metrics.pnl >= 0 ? colors.positive : colors.negative}>
            {metrics.pnl >= 0 ? '+' : ''}
            {formatPrice(Math.abs(metrics.pnl), 'INR')} overall
          </Text>
        </View>
        <View style={styles.summaryStats}>
          <View style={styles.summaryStat}>
            <Text variant="micro" color={colors.textMuted}>
              Invested
            </Text>
            <Text variant="captionStrong">{formatPrice(metrics.invested, 'INR')}</Text>
          </View>
          <View style={styles.summaryStat}>
            <Text variant="micro" color={colors.textMuted}>
              Holdings
            </Text>
            <Text variant="captionStrong">{holdings.length}</Text>
          </View>
          <View style={styles.summaryStat}>
            <Text variant="micro" color={colors.textMuted}>
              Day P&L
            </Text>
            <Text variant="captionStrong" color={colors.positive}>
              +1.24%
            </Text>
          </View>
        </View>
      </Card>

      {/* Allocation bar */}
      <Card style={styles.alloc}>
        <Text variant="label" color={colors.textSecondary}>
          ALLOCATION
        </Text>
        <View style={styles.allocBar}>
          {metrics.rows.map((r, i) => (
            <View
              key={r.symbol}
              style={{ width: `${r.weight}%`, height: 10, backgroundColor: allocColor(i) }}
            />
          ))}
        </View>
        <View style={styles.allocLegend}>
          {metrics.rows.slice(0, 4).map((r, i) => (
            <View key={r.symbol} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: allocColor(i) }]} />
              <Text variant="micro" color={colors.textSecondary}>
                {r.symbol} {r.weight.toFixed(0)}%
              </Text>
            </View>
          ))}
        </View>
      </Card>

      {/* Holdings */}
      <Text variant="label" color={colors.textSecondary}>
        HOLDINGS
      </Text>
      <View style={styles.list}>
        {metrics.rows.map((h) => (
          <Pressable key={h.symbol} onPress={() => router.push(`/stock/${encodeURIComponent(h.symbol)}`)}>
            <Card style={styles.row}>
              <SymbolAvatar symbol={h.symbol} size={38} />
              <View style={styles.flex}>
                <Text variant="captionStrong">{h.symbol}</Text>
                <Text variant="micro" color={colors.textMuted}>
                  {h.qty} @ {formatPrice(h.avg, h.currency)}
                </Text>
              </View>
              <View style={styles.rowRight}>
                <Text variant="captionStrong">{formatPrice(h.cur, 'INR')}</Text>
                <Delta value={h.pnlPct} showIcon={false} variant="micro" />
              </View>
            </Card>
          </Pressable>
        ))}
      </View>
    </ToolScreen>
  );
}

function allocColor(i: number): string {
  const palette = [colors.brand, colors.blue, colors.purple, colors.positive, colors.warning, '#EC4899'];
  return palette[i % palette.length];
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  summary: { gap: spacing.xs },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: 2 },
  summaryStats: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
  summaryStat: { flex: 1, gap: 2, backgroundColor: colors.bgElevated, borderRadius: radii.md, borderWidth: 1, borderColor: colors.border, padding: spacing.sm },
  alloc: { gap: spacing.md },
  allocBar: { flexDirection: 'row', height: 10, borderRadius: radii.pill, overflow: 'hidden' },
  allocLegend: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  list: { gap: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  rowRight: { alignItems: 'flex-end', gap: 2 },
});
