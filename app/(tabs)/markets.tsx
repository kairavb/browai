import { useMemo, useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { router } from 'expo-router';
import {
  Search,
  Target,
  Activity,
  Waves,
  Landmark,
  BarChart3,
  TrendingUp,
  Briefcase,
  Clock,
  LayoutGrid,
  Settings,
} from 'lucide-react-native';
import { TabScreen } from '@/components/TabScreen';
import { InstrumentRow } from '@/components/InstrumentRow';
import { Text, PressableCard, SectionLabel, ProBadge } from '@/components/ui';
import { colors, radii, spacing } from '@/theme';
import { instruments } from '@/data/instruments';

const tools = [
  { label: 'AI Screener', sub: 'Multi-segment market scanner', Icon: Search, href: '/screener', pro: false },
  { label: 'Liquidity Radar', sub: 'Accumulation & breakout signals', Icon: Waves, href: '/radar', pro: true },
  { label: 'Factor Ranking', sub: 'Multi-factor equity rankings', Icon: Target, href: '/factor-ranking', pro: true },
  { label: 'Tracked Setups', sub: 'AI trade setups & outcomes', Icon: TrendingUp, href: '/tracked-setups', pro: false },
  { label: 'Options Intel', sub: 'PCR, Max Pain, OI walls & Greeks', Icon: Activity, href: '/options', pro: true },
  { label: 'MF Analyser', sub: 'Mutual funds — NAVs & real returns', Icon: Landmark, href: '/mutual-funds', pro: true },
  { label: 'Portfolio', sub: 'AI-managed holdings & risk', Icon: Briefcase, href: '/portfolio', pro: true },
  { label: 'Scheduled Tasks', sub: '24/7 market monitors', Icon: Clock, href: '/scheduled-tasks', pro: true },
] as const;

export default function Markets() {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return instruments.filter((i) => i.symbol.toLowerCase().includes(q) || i.name.toLowerCase().includes(q)).slice(0, 8);
  }, [query]);

  return (
    <TabScreen>
      <View style={styles.titleRow}>
        <View style={styles.titleIcon}>
          <LayoutGrid size={18} color={colors.brand} />
        </View>
        <View style={styles.flex}>
          <Text variant="h1">Markets</Text>
          <Text variant="micro" color={colors.textSecondary}>
            Screeners, tools & market intelligence
          </Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchBox}>
        <Search size={16} color={colors.textMuted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search markets or tools…"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          autoCorrect={false}
        />
      </View>

      {results.length > 0 ? (
        <View style={styles.results}>
          <SectionLabel label="INSTRUMENTS" />
          <View style={styles.resultList}>
            {results.map((i) => (
              <InstrumentRow key={i.symbol} item={i} />
            ))}
          </View>
        </View>
      ) : (
        <>
          <View>
            <SectionLabel label="MARKETS & SCREENERS" />
            <View style={styles.grid}>
              {tools.map((t) => (
                <PressableCard key={t.label} onPress={() => router.push(t.href as any)} style={styles.tile}>
                  <View style={styles.tileHead}>
                    <View style={styles.tileIcon}>
                      <t.Icon size={18} color={colors.brand} />
                    </View>
                    {t.pro && <ProBadge />}
                  </View>
                  <Text variant="captionStrong" style={{ marginTop: spacing.sm }}>
                    {t.label}
                  </Text>
                  <Text variant="micro" color={colors.textMuted} style={{ marginTop: 2 }}>
                    {t.sub}
                  </Text>
                </PressableCard>
              ))}
            </View>
          </View>

          <PressableCard onPress={() => router.push('/settings')} style={styles.settingsRow}>
            <View style={styles.tileIcon}>
              <Settings size={18} color={colors.brand} />
            </View>
            <View style={styles.flex}>
              <Text variant="captionStrong">Settings & Preferences</Text>
              <Text variant="micro" color={colors.textMuted}>
                Markets, risk profile & notifications
              </Text>
            </View>
          </PressableCard>
        </>
      )}
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  titleIcon: { width: 40, height: 40, borderRadius: radii.md, backgroundColor: colors.brandSoft, alignItems: 'center', justifyContent: 'center' },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.surface, borderRadius: radii.md, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md },
  input: { flex: 1, color: colors.text, paddingVertical: spacing.md, fontSize: 14 },
  results: {},
  resultList: { gap: spacing.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  tile: { width: '47.5%', flexGrow: 1 },
  tileHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  tileIcon: { width: 38, height: 38, borderRadius: radii.md, backgroundColor: colors.brandSoft, alignItems: 'center', justifyContent: 'center' },
  settingsRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
});
