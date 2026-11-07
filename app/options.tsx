import { useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Activity } from 'lucide-react-native';
import { ToolScreen } from '@/components/ToolScreen';
import { CoPilotBanner } from '@/components/CoPilotBanner';
import { Text, Card, Badge, SegmentedTabs } from '@/components/ui';
import { colors, radii, spacing } from '@/theme';
import { formatCompact } from '@/utils/format';
import { seededRandom } from '@/utils/series';

const underlyings = [
  { symbol: 'NIFTY', spot: 23810, step: 50 },
  { symbol: 'BANKNIFTY', spot: 51240, step: 100 },
];

interface ChainRow {
  strike: number;
  callOI: number;
  putOI: number;
  callChg: number;
  putChg: number;
}

function buildChain(spot: number, step: number, seed: number): ChainRow[] {
  const rand = seededRandom(seed);
  const atm = Math.round(spot / step) * step;
  const rows: ChainRow[] = [];
  for (let i = -4; i <= 4; i++) {
    const strike = atm + i * step;
    const callOI = Math.round((60 - Math.abs(i) * 8 + rand() * 20) * 1000);
    const putOI = Math.round((60 - Math.abs(i) * 7 + rand() * 20) * 1000);
    rows.push({
      strike,
      callOI,
      putOI,
      callChg: Math.round((rand() - 0.5) * 20000),
      putChg: Math.round((rand() - 0.5) * 20000),
    });
  }
  return rows;
}

export default function Options() {
  const [sym, setSym] = useState('NIFTY');
  const u = underlyings.find((x) => x.symbol === sym)!;
  const chain = useMemo(() => buildChain(u.spot, u.step, sym === 'NIFTY' ? 7 : 11), [sym, u]);

  const metrics = useMemo(() => {
    const totalCall = chain.reduce((s, r) => s + r.callOI, 0);
    const totalPut = chain.reduce((s, r) => s + r.putOI, 0);
    const pcr = totalPut / totalCall;
    const maxPain = chain.reduce((best, r) => (r.callOI + r.putOI > best.oi ? { strike: r.strike, oi: r.callOI + r.putOI } : best), { strike: 0, oi: 0 }).strike;
    return { pcr, maxPain, totalCall, totalPut };
  }, [chain]);

  const maxOI = Math.max(...chain.flatMap((r) => [r.callOI, r.putOI]));
  const atm = Math.round(u.spot / u.step) * u.step;

  return (
    <ToolScreen
      title="Options Intelligence"
      subtitle="PCR, Max Pain, OI walls & ATM expected move"
      icon={<Activity size={18} color={colors.brand} />}
      pro
    >
      <CoPilotBanner
        title="BROW AI Options Co-Pilot"
        subtitle="Decode OI walls, PCR regime, IV rank & ATM straddle expected move"
        actions={['Max Pain Analysis', 'OI Wall Breakdown', 'Expected Move']}
      />

      <SegmentedTabs options={underlyings.map((x) => x.symbol)} value={sym} onChange={setSym} scroll={false} />

      {/* Metrics */}
      <View style={styles.metrics}>
        <Metric label="PCR" value={metrics.pcr.toFixed(2)} tone={metrics.pcr > 1 ? colors.positive : colors.negative} />
        <Metric label="Max Pain" value={`${metrics.maxPain}`} tone={colors.brand} />
        <Metric label="ATM" value={`${atm}`} tone={colors.text} />
        <Metric label="IV Rank" value="48%" tone={colors.warning} />
      </View>

      <Card style={styles.straddle}>
        <Text variant="micro" color={colors.textMuted}>
          ATM STRADDLE · EXPECTED MOVE (1D)
        </Text>
        <Text variant="h3" style={{ marginTop: 2 }}>
          ±{Math.round(u.spot * 0.0068)} pts{' '}
          <Text variant="caption" color={colors.textSecondary}>
            (~0.68%)
          </Text>
        </Text>
      </Card>

      {/* Option chain */}
      <Card style={styles.chainCard}>
        <View style={styles.chainHeadRow}>
          <Text variant="micro" color={colors.positive} style={[styles.col, styles.bold]}>
            CALL OI
          </Text>
          <Text variant="micro" color={colors.textSecondary} style={[styles.strikeCol, styles.bold, styles.center]}>
            STRIKE
          </Text>
          <Text variant="micro" color={colors.negative} style={[styles.col, styles.bold, styles.right]}>
            PUT OI
          </Text>
        </View>
        {chain.map((r) => {
          const isAtm = r.strike === atm;
          return (
            <View key={r.strike} style={[styles.chainRow, isAtm && styles.atmRow]}>
              <View style={styles.col}>
                <View style={styles.oiBarWrap}>
                  <View style={[styles.oiBar, { width: `${(r.callOI / maxOI) * 100}%`, backgroundColor: colors.positiveSoft }]} />
                  <Text variant="micro" color={colors.text} style={styles.oiText}>
                    {formatCompact(r.callOI)}
                  </Text>
                </View>
              </View>
              <Text variant="captionStrong" color={isAtm ? colors.brand : colors.text} style={[styles.strikeCol, styles.center]}>
                {r.strike}
              </Text>
              <View style={styles.col}>
                <View style={[styles.oiBarWrap, styles.oiBarRight]}>
                  <View style={[styles.oiBar, styles.oiBarRightFill, { width: `${(r.putOI / maxOI) * 100}%`, backgroundColor: colors.negativeSoft }]} />
                  <Text variant="micro" color={colors.text} style={[styles.oiText, styles.right]}>
                    {formatCompact(r.putOI)}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </Card>

      <Text variant="micro" color={colors.textFaint} center>
        OI walls highlight support (put) & resistance (call) zones. Paper-trading gated — not an order ticket.
      </Text>
    </ToolScreen>
  );
}

function Metric({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <Card style={styles.metric} padded={false}>
      <Text variant="micro" color={colors.textMuted}>
        {label}
      </Text>
      <Text variant="h3" color={tone} style={{ marginTop: 2 }}>
        {value}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  bold: { fontWeight: '800' },
  center: { textAlign: 'center' },
  right: { textAlign: 'right' },
  metrics: { flexDirection: 'row', gap: spacing.sm },
  metric: { flex: 1, padding: spacing.md, gap: 0 },
  straddle: { backgroundColor: colors.bgElevated },
  chainCard: { gap: spacing.xs, padding: spacing.sm },
  chainHeadRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.xs, paddingHorizontal: spacing.xs },
  col: { flex: 1 },
  strikeCol: { width: 64 },
  chainRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 5, paddingHorizontal: spacing.xs, borderRadius: radii.sm },
  atmRow: { backgroundColor: colors.brandSoft },
  oiBarWrap: { height: 20, justifyContent: 'center' },
  oiBar: { position: 'absolute', left: 0, height: 20, borderRadius: 4 },
  oiBarRight: { alignItems: 'flex-end' },
  oiBarRightFill: { left: undefined, right: 0 },
  oiText: { paddingHorizontal: 6, zIndex: 1 },
});
