import { useMemo, useState } from 'react';
import { View, StyleSheet, Pressable, TextInput } from 'react-native';
import { Landmark, Star, Search } from 'lucide-react-native';
import { ToolScreen } from '@/components/ToolScreen';
import { CoPilotBanner } from '@/components/CoPilotBanner';
import { Text, Card, Badge, SegmentedTabs } from '@/components/ui';
import { colors, radii, spacing } from '@/theme';
import { formatCompact } from '@/utils/format';
import { funds, type Fund } from '@/data/funds';

const tabs = ['Explore', 'Compare', 'Goals'];

export default function MutualFunds() {
  const [tab, setTab] = useState('Explore');
  return (
    <ToolScreen
      title="MF Analyser"
      subtitle="AMFI NAVs · real returns · no guessing"
      icon={<Landmark size={18} color={colors.brand} />}
      pro
    >
      <CoPilotBanner
        title="BROW AI Mutual Fund Co-Pilot"
        subtitle="Evaluate risk-adjusted alpha, drawdown resilience, SIP vs Lumpsum timing"
        actions={['Best Flexi-Cap vs Index', 'Audit My MF Portfolio', 'SIP vs Lumpsum']}
      />
      <SegmentedTabs options={tabs} value={tab} onChange={setTab} scroll={false} />
      {tab === 'Explore' && <Explore />}
      {tab === 'Compare' && <Compare />}
      {tab === 'Goals' && <Goals />}
    </ToolScreen>
  );
}

function RatingStars({ n }: { n: number }) {
  return (
    <View style={styles.stars}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={11} color={colors.warning} fill={i < n ? colors.warning : 'transparent'} />
      ))}
    </View>
  );
}

function FundCard({ fund }: { fund: Fund }) {
  return (
    <Card style={styles.fundCard}>
      <View style={styles.fundHead}>
        <View style={styles.flex}>
          <Text variant="captionStrong">{fund.name}</Text>
          <View style={styles.fundMeta}>
            <Badge label={fund.category} tone="brand" small />
            <Badge label={`${fund.risk} risk`} tone={fund.risk === 'High' ? 'negative' : fund.risk === 'Low' ? 'positive' : 'warning'} small />
          </View>
        </View>
        <RatingStars n={fund.rating} />
      </View>
      <View style={styles.returns}>
        <Ret label="1Y" value={fund.r1y} />
        <Ret label="3Y" value={fund.r3y} />
        <Ret label="5Y" value={fund.r5y} />
        <View style={styles.ret}>
          <Text variant="micro" color={colors.textMuted}>
            AUM
          </Text>
          <Text variant="captionStrong">₹{formatCompact(fund.aum)}Cr</Text>
        </View>
      </View>
    </Card>
  );
}

function Ret({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.ret}>
      <Text variant="micro" color={colors.textMuted}>
        {label}
      </Text>
      <Text variant="captionStrong" color={colors.positive}>
        {value}%
      </Text>
    </View>
  );
}

function Explore() {
  const [query, setQuery] = useState('');
  const rows = useMemo(() => {
    if (!query.trim()) return funds;
    const q = query.toLowerCase();
    return funds.filter((f) => f.name.toLowerCase().includes(q) || f.category.toLowerCase().includes(q));
  }, [query]);
  return (
    <View style={styles.block}>
      <View style={styles.searchBox}>
        <Search size={15} color={colors.textMuted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search funds by name or category…"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />
      </View>
      {rows.map((f) => (
        <FundCard key={f.id} fund={f} />
      ))}
    </View>
  );
}

function Compare() {
  const [a, setA] = useState(funds[0].id);
  const [b, setB] = useState(funds[1].id);
  const fa = funds.find((f) => f.id === a)!;
  const fb = funds.find((f) => f.id === b)!;
  const rowDefs: { label: string; get: (f: Fund) => string; better?: (f: Fund) => number }[] = [
    { label: 'NAV', get: (f) => `₹${f.nav}` },
    { label: '1Y Return', get: (f) => `${f.r1y}%`, better: (f) => f.r1y },
    { label: '3Y Return', get: (f) => `${f.r3y}%`, better: (f) => f.r3y },
    { label: '5Y Return', get: (f) => `${f.r5y}%`, better: (f) => f.r5y },
    { label: 'AUM', get: (f) => `₹${formatCompact(f.aum)}Cr` },
    { label: 'Risk', get: (f) => f.risk },
    { label: 'Rating', get: (f) => `${f.rating}★` },
  ];
  return (
    <View style={styles.block}>
      <View style={styles.pickerRow}>
        <FundPicker label="Fund A" value={a} onChange={setA} />
        <FundPicker label="Fund B" value={b} onChange={setB} />
      </View>
      <Card style={styles.compareCard}>
        {rowDefs.map((r) => {
          const va = r.better ? r.better(fa) : 0;
          const vb = r.better ? r.better(fb) : 0;
          return (
            <View key={r.label} style={styles.compareRow}>
              <Text variant="captionStrong" color={r.better && va >= vb ? colors.positive : colors.text} style={styles.compareVal}>
                {r.get(fa)}
              </Text>
              <Text variant="micro" color={colors.textMuted} style={styles.compareLabel}>
                {r.label}
              </Text>
              <Text variant="captionStrong" color={r.better && vb >= va ? colors.positive : colors.text} style={[styles.compareVal, styles.right]}>
                {r.get(fb)}
              </Text>
            </View>
          );
        })}
      </Card>
    </View>
  );
}

function FundPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const idx = funds.findIndex((f) => f.id === value);
  const f = funds[idx];
  return (
    <Pressable style={styles.picker} onPress={() => onChange(funds[(idx + 1) % funds.length].id)}>
      <Text variant="micro" color={colors.textMuted}>
        {label} · tap to change
      </Text>
      <Text variant="captionStrong" numberOfLines={1}>
        {f.name}
      </Text>
    </Pressable>
  );
}

function Goals() {
  const [monthly, setMonthly] = useState(10000);
  const years = 10;
  const rate = 0.14;
  const months = years * 12;
  const r = rate / 12;
  const fv = monthly * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
  const invested = monthly * months;
  const presets = [5000, 10000, 25000, 50000];
  return (
    <View style={styles.block}>
      <Card style={styles.goalCard}>
        <Text variant="label" color={colors.textSecondary}>
          SIP PROJECTION · {years} YEARS @ 14% p.a.
        </Text>
        <Text variant="micro" color={colors.textMuted} style={{ marginTop: spacing.sm }}>
          Monthly SIP
        </Text>
        <View style={styles.presetRow}>
          {presets.map((p) => (
            <Pressable key={p} onPress={() => setMonthly(p)} style={[styles.preset, monthly === p && styles.presetActive]}>
              <Text variant="micro" color={monthly === p ? colors.brand : colors.textMuted}>
                ₹{formatCompact(p)}
              </Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.goalResult}>
          <View style={styles.goalStat}>
            <Text variant="micro" color={colors.textMuted}>
              Invested
            </Text>
            <Text variant="h3">₹{formatCompact(invested)}</Text>
          </View>
          <View style={styles.goalStat}>
            <Text variant="micro" color={colors.textMuted}>
              Projected Value
            </Text>
            <Text variant="h3" color={colors.positive}>
              ₹{formatCompact(fv)}
            </Text>
          </View>
        </View>
        <Text variant="micro" color={colors.textMuted} style={styles.goalNote}>
          Est. wealth gain of ₹{formatCompact(fv - invested)}. Projections are illustrative, not guaranteed.
        </Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  right: { textAlign: 'right' },
  block: { gap: spacing.md },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.surface, borderRadius: radii.md, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md },
  input: { flex: 1, color: colors.text, paddingVertical: spacing.md, fontSize: 14 },
  fundCard: { gap: spacing.md },
  fundHead: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  fundMeta: { flexDirection: 'row', gap: spacing.xs, marginTop: 4 },
  stars: { flexDirection: 'row', gap: 1 },
  returns: { flexDirection: 'row', gap: spacing.sm },
  ret: { flex: 1, gap: 2, backgroundColor: colors.bgElevated, borderRadius: radii.md, borderWidth: 1, borderColor: colors.border, padding: spacing.sm, alignItems: 'center' },
  pickerRow: { flexDirection: 'row', gap: spacing.sm },
  picker: { flex: 1, gap: 2, backgroundColor: colors.surface, borderRadius: radii.md, borderWidth: 1, borderColor: colors.border, padding: spacing.md },
  compareCard: { gap: spacing.xs },
  compareRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: colors.border },
  compareVal: { flex: 1 },
  compareLabel: { width: 90, textAlign: 'center' },
  goalCard: { gap: spacing.sm },
  presetRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs },
  preset: { flex: 1, alignItems: 'center', paddingVertical: spacing.sm, borderRadius: radii.pill, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  presetActive: { backgroundColor: colors.brandSoft, borderColor: colors.brand },
  goalResult: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
  goalStat: { flex: 1, gap: 2, backgroundColor: colors.bgElevated, borderRadius: radii.md, borderWidth: 1, borderColor: colors.border, padding: spacing.md },
  goalNote: { marginTop: spacing.sm, lineHeight: 15 },
});
