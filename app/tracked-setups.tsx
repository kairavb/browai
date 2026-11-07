import { useMemo, useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { TrendingUp, Target, ArrowUpRight, ArrowDownRight } from 'lucide-react-native';
import { ToolScreen } from '@/components/ToolScreen';
import { Text, Card, Badge, SegmentedTabs, EmptyState } from '@/components/ui';
import { SymbolAvatar } from '@/components/ui/SymbolAvatar';
import { colors, radii, spacing } from '@/theme';
import { formatNumber } from '@/utils/format';
import { setups } from '@/data/setups';
import type { SetupStatus, TradeSetup } from '@/types';

const tabs: SetupStatus[] = ['Live Picks', 'Active', 'Booked'];
const segments = ['All', 'India Equity', 'India F&O', 'Crypto', 'Global'];

export default function TrackedSetups() {
  const [tab, setTab] = useState<SetupStatus>('Live Picks');
  const [segment, setSegment] = useState('All');

  const rows = useMemo(
    () => setups.filter((s) => s.status === tab && (segment === 'All' || s.segment === segment)),
    [tab, segment],
  );

  return (
    <ToolScreen
      title="Tracked Setups"
      subtitle="AI-analyzed trade setups with entry, SL, targets & thesis"
      icon={<Target size={18} color={colors.brand} />}
    >
      <SegmentedTabs options={tabs} value={tab} onChange={(v) => setTab(v as SetupStatus)} />
      <SegmentedTabs options={segments} value={segment} onChange={setSegment} size="sm" />

      {rows.length === 0 ? (
        <Card padded={false}>
          <EmptyState
            title="No setups here"
            message="BROW has no setups for this segment right now. Try another segment or ask BROW directly."
            icon={<TrendingUp size={24} color={colors.brand} />}
            actionLabel="Ask BROW"
            onAction={() => router.push('/ask')}
          />
        </Card>
      ) : (
        <View style={styles.list}>
          {rows.map((s) => (
            <SetupCard key={s.id} setup={s} />
          ))}
        </View>
      )}
    </ToolScreen>
  );
}

function SetupCard({ setup }: { setup: TradeSetup }) {
  const long = setup.direction === 'LONG';
  const DirIcon = long ? ArrowUpRight : ArrowDownRight;
  return (
    <Pressable onPress={() => router.push(`/stock/${encodeURIComponent(setup.symbol)}`)}>
      <Card style={styles.card}>
        <View style={styles.head}>
          <SymbolAvatar symbol={setup.symbol} size={38} />
          <View style={styles.flex}>
            <View style={styles.titleRow}>
              <Text variant="bodyStrong">{setup.symbol}</Text>
              <View style={[styles.dirBadge, { backgroundColor: long ? colors.positiveSoft : colors.negativeSoft }]}>
                <DirIcon size={11} color={long ? colors.positive : colors.negative} />
                <Text variant="micro" color={long ? colors.positive : colors.negative} style={styles.bold}>
                  {setup.direction}
                </Text>
              </View>
            </View>
            <Text variant="micro" color={colors.textMuted}>
              {setup.name} · {setup.segment}
            </Text>
          </View>
          {setup.outcome && setup.outcome !== 'OPEN' && (
            <Badge label={setup.outcome} tone={setup.outcome === 'WIN' ? 'positive' : 'negative'} small />
          )}
        </View>

        {/* Levels */}
        <View style={styles.levels}>
          <Level label="Entry" value={setup.entry} color={colors.brand} />
          <Level label="Stop" value={setup.stopLoss} color={colors.negative} />
          <Level label="Target 1" value={setup.target1} color={colors.positive} />
          <Level label="Target 2" value={setup.target2} color={colors.positive} />
        </View>

        <Text variant="micro" color={colors.textSecondary} style={styles.thesis}>
          {setup.thesis}
        </Text>

        <View style={styles.foot}>
          <View style={styles.metric}>
            <Text variant="micro" color={colors.textMuted}>
              Confidence
            </Text>
            <Text variant="captionStrong" color={colors.brand}>
              {setup.confidence}%
            </Text>
          </View>
          <View style={styles.metric}>
            <Text variant="micro" color={colors.textMuted}>
              R:R
            </Text>
            <Text variant="captionStrong">1:{setup.rr}</Text>
          </View>
          {setup.pnlPercent !== undefined && (
            <View style={styles.metric}>
              <Text variant="micro" color={colors.textMuted}>
                P&L
              </Text>
              <Text variant="captionStrong" color={setup.pnlPercent >= 0 ? colors.positive : colors.negative}>
                {setup.pnlPercent >= 0 ? '+' : ''}
                {setup.pnlPercent}%
              </Text>
            </View>
          )}
        </View>
      </Card>
    </Pressable>
  );
}

function Level({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={styles.level}>
      <Text variant="micro" color={colors.textMuted}>
        {label}
      </Text>
      <Text variant="captionStrong" color={color}>
        {formatNumber(value)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  bold: { fontWeight: '800' },
  list: { gap: spacing.md },
  card: { gap: spacing.md },
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  dirBadge: { flexDirection: 'row', alignItems: 'center', gap: 2, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  levels: { flexDirection: 'row', gap: spacing.sm },
  level: { flex: 1, gap: 2, backgroundColor: colors.bgElevated, borderRadius: radii.md, borderWidth: 1, borderColor: colors.border, padding: spacing.sm, alignItems: 'center' },
  thesis: { lineHeight: 18 },
  foot: { flexDirection: 'row', gap: spacing.xxl },
  metric: { gap: 2 },
});
