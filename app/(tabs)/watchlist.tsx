import { useMemo, useState, useCallback } from 'react';
import { View, StyleSheet, TextInput, Pressable, Modal, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Eye, Plus, RefreshCw, Search, X, Gauge, TrendingUp, Crosshair } from 'lucide-react-native';
import { TabScreen } from '@/components/TabScreen';
import { CoPilotBanner } from '@/components/CoPilotBanner';
import { InstrumentCard } from '@/components/InstrumentCard';
import { Text, Card, Button, Badge, SegmentedTabs } from '@/components/ui';
import { SymbolAvatar } from '@/components/ui/SymbolAvatar';
import { colors, radii, spacing } from '@/theme';
import { formatPercent } from '@/utils/format';
import { instruments, instrumentMap } from '@/data/instruments';
import { useWatchlist } from '@/store/watchlist';
import type { Instrument } from '@/types';

type Sort = 'Recent' | '% Change' | 'A–Z';

export default function Watchlist() {
  const insets = useSafeAreaInsets();
  const { symbols, add, remove } = useWatchlist();
  const [query, setQuery] = useState('');
  const [market, setMarket] = useState('All');
  const [sort, setSort] = useState<Sort>('Recent');
  const [refreshing, setRefreshing] = useState(false);
  const [adding, setAdding] = useState(false);

  const items = useMemo(() => symbols.map((s) => instrumentMap[s]).filter(Boolean), [symbols]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: items.length, India: 0, USA: 0, Crypto: 0, Commodities: 0 };
    items.forEach((i) => (c[i.market] = (c[i.market] ?? 0) + 1));
    return c;
  }, [items]);

  const filtered = useMemo(() => {
    let list = items.filter(
      (i) =>
        (market === 'All' || i.market === market) &&
        (i.symbol.toLowerCase().includes(query.toLowerCase()) ||
          i.name.toLowerCase().includes(query.toLowerCase())),
    );
    if (sort === '% Change') list = [...list].sort((a, b) => b.changePercent - a.changePercent);
    if (sort === 'A–Z') list = [...list].sort((a, b) => a.symbol.localeCompare(b.symbol));
    return list;
  }, [items, market, query, sort]);

  const stats = useMemo(() => {
    const up = items.filter((i) => i.changePercent > 0).length;
    const down = items.filter((i) => i.changePercent < 0).length;
    const avg = items.length ? items.reduce((s, i) => s + i.changePercent, 0) / items.length : 0;
    const bullish = items.filter((i) => i.aiVerdict === 'BULLISH').length;
    const bearish = items.filter((i) => i.aiVerdict === 'BEARISH').length;
    return { up, down, avg, bullish, bearish };
  }, [items]);

  const radar = useMemo(() => buildRadar(items), [items]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  const available = instruments.filter((i) => !symbols.includes(i.symbol));

  return (
    <TabScreen refreshing={refreshing} onRefresh={onRefresh}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.titleIcon}>
            <Eye size={18} color={colors.brand} />
          </View>
          <View style={styles.flex}>
            <Text variant="h1">Watchlist</Text>
            <Text variant="micro" color={colors.textSecondary}>
              {items.length} tracked · <Text variant="micro" color={colors.positive}>Cloud Synced</Text>
            </Text>
          </View>
          <Pressable style={styles.iconBtn} onPress={onRefresh}>
            <RefreshCw size={16} color={colors.textSecondary} />
          </Pressable>
        </View>
      </View>

      <CoPilotBanner
        title="BROW AI Watchlist Co-Pilot"
        subtitle="Audit your tracked instruments for multi-timeframe breakouts, news & correlation"
        actions={['Audit My Watchlist', 'Deep Dive NIFTY 50', 'Correlation Check']}
      />

      {/* Intelligence radar */}
      <Card style={styles.radarCard}>
        <View style={styles.radarHead}>
          <Text variant="label" color={colors.textSecondary}>
            WATCHLIST INTELLIGENCE RADAR
          </Text>
          <View style={styles.trendBadges}>
            <Badge label={`${stats.bullish} Bullish`} tone="positive" small />
            <Badge label={`${stats.bearish} Bearish`} tone="negative" small />
          </View>
        </View>
        <View style={styles.radarGrid}>
          <RadarTile
            icon={<Gauge size={13} color={colors.brand} />}
            label="STRONGEST SIGNAL"
            value={radar.strongest}
            sub={radar.strongestSub}
          />
          <RadarTile
            icon={<TrendingUp size={13} color={colors.warning} />}
            label="MOMENTUM / RSI"
            value={radar.rsi}
            sub={radar.rsiSub}
          />
          <RadarTile
            icon={<Crosshair size={13} color={colors.purple} />}
            label="KEY LEVEL"
            value={radar.level}
            sub={radar.levelSub}
          />
        </View>
      </Card>

      {/* Filters */}
      <View style={styles.filterBlock}>
        <View style={styles.marketRow}>
          <SegmentedTabs
            options={['All', 'India', 'USA', 'Crypto', 'Commodities'].map((m) => ({
              label: `${m}${counts[m] ? ` ${counts[m]}` : ''}`,
              value: m,
            }))}
            value={market}
            onChange={setMarket}
          />
        </View>
        <View style={styles.statRow}>
          <Text variant="micro" color={colors.textSecondary}>
            Up <Text variant="micro" color={colors.positive}>{stats.up}</Text> · Down{' '}
            <Text variant="micro" color={colors.negative}>{stats.down}</Text>
          </Text>
          <Text variant="micro" color={colors.textSecondary}>
            Avg{' '}
            <Text variant="micro" color={stats.avg >= 0 ? colors.positive : colors.negative}>
              {formatPercent(stats.avg)}
            </Text>
          </Text>
        </View>
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Search size={15} color={colors.textMuted} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Filter by symbol or name…"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
            />
          </View>
        </View>
        <View style={styles.sortRow}>
          {(['Recent', '% Change', 'A–Z'] as Sort[]).map((s) => (
            <Pressable key={s} onPress={() => setSort(s)} style={[styles.sortPill, sort === s && styles.sortActive]}>
              <Text variant="micro" color={sort === s ? colors.brand : colors.textMuted}>
                {s}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Cards */}
      {filtered.length === 0 ? (
        <Card>
          <Text variant="caption" color={colors.textSecondary} center>
            No instruments match your filter.
          </Text>
        </Card>
      ) : (
        <View style={styles.list}>
          {filtered.map((i) => (
            <View key={i.symbol}>
              <InstrumentCard item={i} />
              <Pressable style={styles.removeBtn} onPress={() => remove(i.symbol)}>
                <X size={13} color={colors.textMuted} />
              </Pressable>
            </View>
          ))}
        </View>
      )}

      <Button
        label="Add Instrument"
        icon={<Plus size={18} color={colors.white} />}
        onPress={() => setAdding(true)}
        fullWidth
      />

      {/* Add modal */}
      <Modal visible={adding} animationType="slide" transparent onRequestClose={() => setAdding(false)}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.lg }]}>
            <View style={styles.sheetHead}>
              <Text variant="h2">Add Instrument</Text>
              <Pressable onPress={() => setAdding(false)} style={styles.iconBtn}>
                <X size={18} color={colors.textSecondary} />
              </Pressable>
            </View>
            <FlatList
              data={available}
              keyExtractor={(i) => i.symbol}
              style={styles.sheetList}
              ItemSeparatorComponent={() => <View style={styles.sep} />}
              ListEmptyComponent={
                <Text variant="caption" color={colors.textSecondary} center style={{ paddingVertical: spacing.xl }}>
                  Everything is already on your watchlist.
                </Text>
              }
              renderItem={({ item }) => (
                <Pressable
                  style={styles.addRow}
                  onPress={() => {
                    add(item.symbol);
                    setAdding(false);
                  }}
                >
                  <SymbolAvatar symbol={item.symbol} size={34} />
                  <View style={styles.flex}>
                    <Text variant="captionStrong">{item.symbol}</Text>
                    <Text variant="micro" color={colors.textMuted} numberOfLines={1}>
                      {item.name}
                    </Text>
                  </View>
                  <Badge label={item.market} tone="brand" small />
                  <Plus size={16} color={colors.brand} />
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>
    </TabScreen>
  );
}

function RadarTile({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub: string }) {
  return (
    <View style={styles.radarTile}>
      <View style={styles.radarTileHead}>
        {icon}
        <Text variant="micro" color={colors.textMuted} style={styles.radarLabel}>
          {label}
        </Text>
      </View>
      <Text variant="captionStrong" numberOfLines={1}>
        {value}
      </Text>
      <Text variant="micro" color={colors.textMuted} numberOfLines={1}>
        {sub}
      </Text>
    </View>
  );
}

function buildRadar(items: Instrument[]) {
  if (items.length === 0) {
    return { strongest: '—', strongestSub: 'No instruments', rsi: '—', rsiSub: '', level: '—', levelSub: '' };
  }
  const strongest = [...items].sort((a, b) => b.aiScore - a.aiScore)[0];
  const rsiHot = [...items].sort((a, b) => Math.abs(b.rsi - 50) - Math.abs(a.rsi - 50))[0];
  const level = [...items].sort(
    (a, b) => Math.abs(a.price - a.resistance) / a.price - Math.abs(b.price - b.resistance) / b.price,
  )[0];
  return {
    strongest: `${strongest.symbol} ${strongest.aiScore} · ${strongest.aiVerdict}`,
    strongestSub: `1D ${strongest.aiVerdict === 'BULLISH' ? 'bullish' : 'bearish'} bias`,
    rsi: `${rsiHot.symbol} RSI ${rsiHot.rsi}`,
    rsiSub: rsiHot.rsi >= 70 ? 'Overbought watch' : rsiHot.rsi <= 30 ? 'Oversold watch' : 'Momentum neutral',
    level: `${level.symbol} testing level`,
    levelSub: `Sup ${level.support} · Res ${level.resistance}`,
  };
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {},
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  titleIcon: { width: 40, height: 40, borderRadius: radii.md, backgroundColor: colors.brandSoft, alignItems: 'center', justifyContent: 'center' },
  iconBtn: { width: 36, height: 36, borderRadius: radii.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  radarCard: { gap: spacing.md },
  radarHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  trendBadges: { flexDirection: 'row', gap: spacing.xs },
  radarGrid: { flexDirection: 'row', gap: spacing.sm },
  radarTile: { flex: 1, gap: 3, backgroundColor: colors.bgElevated, borderRadius: radii.md, borderWidth: 1, borderColor: colors.border, padding: spacing.sm },
  radarTileHead: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  radarLabel: { letterSpacing: 0.3, fontSize: 8.5 },
  filterBlock: { gap: spacing.md },
  marketRow: {},
  statRow: { flexDirection: 'row', justifyContent: 'space-between' },
  searchRow: {},
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.surface, borderRadius: radii.md, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md },
  input: { flex: 1, color: colors.text, paddingVertical: spacing.md, fontSize: 14 },
  sortRow: { flexDirection: 'row', gap: spacing.sm },
  sortPill: { paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radii.pill, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  sortActive: { backgroundColor: colors.brandSoft, borderColor: colors.brand },
  list: { gap: spacing.md },
  removeBtn: { position: 'absolute', top: spacing.md, right: spacing.md, width: 26, height: 26, borderRadius: 13, backgroundColor: colors.bgElevated, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  modalBackdrop: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.bgElevated, borderTopLeftRadius: radii.xl, borderTopRightRadius: radii.xl, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, maxHeight: '75%' },
  sheetHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  sheetList: { flexGrow: 0 },
  sep: { height: spacing.sm },
  addRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md, backgroundColor: colors.surface, borderRadius: radii.md, borderWidth: 1, borderColor: colors.border },
});
