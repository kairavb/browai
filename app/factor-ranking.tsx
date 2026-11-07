import { useMemo, useState } from 'react';
import { View, StyleSheet, TextInput, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Target, Search, Rocket, Gem, Coins, Zap, Waves, Brain, ShieldCheck } from 'lucide-react-native';
import { ToolScreen } from '@/components/ToolScreen';
import { CoPilotBanner } from '@/components/CoPilotBanner';
import { Text, Card, Badge } from '@/components/ui';
import { SymbolAvatar } from '@/components/ui/SymbolAvatar';
import { colors, radii, spacing } from '@/theme';
import { factorStocks, factorWeights } from '@/data/factors';
import type { FactorStock } from '@/types';

const weightIcon: Record<string, typeof Rocket> = {
  rocket: Rocket,
  gem: Gem,
  coins: Coins,
  zap: Zap,
  waves: Waves,
  brain: Brain,
};

const pillars: { key: keyof FactorStock; label: string }[] = [
  { key: 'momentum', label: 'MOM' },
  { key: 'quality', label: 'QUA' },
  { key: 'value', label: 'VAL' },
  { key: 'volatility', label: 'VOL' },
  { key: 'liquidity', label: 'LIQ' },
  { key: 'sentiment', label: 'SEN' },
];

export default function FactorRanking() {
  const [query, setQuery] = useState('');

  const rows = useMemo(() => {
    if (!query.trim()) return factorStocks;
    const q = query.toLowerCase();
    return factorStocks.filter(
      (s) => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q) || s.sector.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <ToolScreen
      title="Factor Ranking"
      subtitle="Quantitative multi-factor equity rankings & model audit"
      icon={<Target size={18} color={colors.brand} />}
      pro
    >
      <CoPilotBanner
        title="BROW AI Factor Co-Pilot"
        subtitle="Synthesize Quality, Momentum, Growth & Valuation pillars with live technical timing"
        actions={['Compare Top Ranked Picks', 'High-Quality Momentum Scan']}
      />

      {/* Factor weights */}
      <Card style={styles.weights}>
        <Text variant="label" color={colors.textSecondary}>
          FACTOR WEIGHTS
        </Text>
        {factorWeights.map((f) => {
          const Icon = weightIcon[f.icon] ?? Rocket;
          return (
            <View key={f.label} style={styles.weightRow}>
              <Icon size={14} color={colors.brand} />
              <Text variant="caption" style={styles.weightLabel}>
                {f.label}
              </Text>
              <View style={styles.weightTrack}>
                <View style={[styles.weightFill, { width: `${f.weight * 3.2}%` }]} />
              </View>
              <Text variant="captionStrong" color={colors.textSecondary}>
                {f.weight}%
              </Text>
            </View>
          );
        })}
      </Card>

      {/* Model integrity */}
      <Card style={styles.integrity}>
        <ShieldCheck size={16} color={colors.positive} />
        <View style={styles.flex}>
          <Text variant="captionStrong">Model Integrity & Audit</Text>
          <Text variant="micro" color={colors.textMuted}>
            Immutable outcome ledger · losers preserved
          </Text>
        </View>
        <Badge label="Grade B" tone="warning" />
      </Card>

      {/* Filter */}
      <View style={styles.searchBox}>
        <Search size={15} color={colors.textMuted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Filter ranked stocks by symbol, name or sector…"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />
      </View>

      <View style={styles.rankHead}>
        <Text variant="label" color={colors.textSecondary}>
          RANKED UNIVERSE
        </Text>
        <Badge label="Weekly Cycle" tone="brand" small />
      </View>

      <View style={styles.list}>
        {rows.map((s) => (
          <Pressable key={s.symbol} onPress={() => router.push(`/stock/${encodeURIComponent(s.symbol)}`)}>
            <Card style={styles.row}>
              <View style={styles.rankBadge}>
                <Text variant="captionStrong" color={s.rank <= 3 ? colors.brand : colors.textSecondary}>
                  {s.rank}
                </Text>
              </View>
              <SymbolAvatar symbol={s.symbol} size={34} />
              <View style={styles.flex}>
                <Text variant="captionStrong">{s.symbol}</Text>
                <Text variant="micro" color={colors.textMuted} numberOfLines={1}>
                  {s.sector}
                </Text>
              </View>
              <View style={styles.composite}>
                <Text variant="h3" color={colors.brand}>
                  {s.composite.toFixed(1)}
                </Text>
                <Text variant="micro" color={colors.textMuted}>
                  composite
                </Text>
              </View>
            </Card>
            <View style={styles.pillarRow}>
              {pillars.map((p) => (
                <View key={p.key} style={styles.pillar}>
                  <View style={styles.pillarTrack}>
                    <View style={[styles.pillarFill, { height: `${s[p.key] as number}%` }]} />
                  </View>
                  <Text variant="micro" color={colors.textFaint} style={styles.pillarLabel}>
                    {p.label}
                  </Text>
                </View>
              ))}
            </View>
          </Pressable>
        ))}
      </View>
    </ToolScreen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  weights: { gap: spacing.sm },
  weightRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  weightLabel: { width: 76 },
  weightTrack: { flex: 1, height: 6, borderRadius: radii.pill, backgroundColor: colors.border },
  weightFill: { height: 6, borderRadius: radii.pill, backgroundColor: colors.brand, maxWidth: '100%' },
  integrity: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.surface, borderRadius: radii.md, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md },
  input: { flex: 1, color: colors.text, paddingVertical: spacing.md, fontSize: 14 },
  rankHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  list: { gap: spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  rankBadge: { width: 30, height: 30, borderRadius: radii.sm, backgroundColor: colors.bgElevated, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  composite: { alignItems: 'flex-end' },
  pillarRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: spacing.sm, paddingHorizontal: spacing.sm },
  pillar: { alignItems: 'center', gap: 4 },
  pillarTrack: { width: 22, height: 40, borderRadius: 4, backgroundColor: colors.border, justifyContent: 'flex-end', overflow: 'hidden' },
  pillarFill: { width: '100%', backgroundColor: colors.brandDim, borderRadius: 4 },
  pillarLabel: { fontSize: 8 },
});
