import { useMemo, useState } from 'react';
import { View, StyleSheet, TextInput, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Search, Sparkles, ArrowRight } from 'lucide-react-native';
import { ToolScreen } from '@/components/ToolScreen';
import { CoPilotBanner } from '@/components/CoPilotBanner';
import { InstrumentRow } from '@/components/InstrumentRow';
import { Text, Card, SegmentedTabs, ErrorState } from '@/components/ui';
import { colors, radii, spacing } from '@/theme';
import { instruments } from '@/data/instruments';
import type { Instrument, Segment } from '@/types';

const segments: Segment[] = ['India Equity', 'India F&O', 'Crypto', 'Global'];
const quickFilters = ['Top Gainers', 'Top Losers', 'High Volume', 'Breakouts', 'Oversold', 'Momentum'];

function applyQuick(list: Instrument[], filter: string): Instrument[] {
  switch (filter) {
    case 'Top Gainers':
      return [...list].sort((a, b) => b.changePercent - a.changePercent).filter((i) => i.changePercent > 0);
    case 'Top Losers':
      return [...list].sort((a, b) => a.changePercent - b.changePercent).filter((i) => i.changePercent < 0);
    case 'High Volume':
      return [...list].sort((a, b) => b.volume - a.volume);
    case 'Breakouts':
      return list.filter((i) => i.aiVerdict === 'BULLISH' && i.price >= i.ema20);
    case 'Oversold':
      return list.filter((i) => i.rsi <= 40);
    case 'Momentum':
      return [...list].sort((a, b) => b.aiScore - a.aiScore).filter((i) => i.aiScore >= 70);
    default:
      return list;
  }
}

export default function Screener() {
  const [segment, setSegment] = useState<Segment>('India Equity');
  const [quick, setQuick] = useState('Top Gainers');
  const [query, setQuery] = useState('');
  const [nonce, setNonce] = useState(0);

  const results = useMemo(() => {
    let list = instruments.filter((i) => i.segment === segment);
    list = applyQuick(list, quick);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (i) =>
          i.symbol.toLowerCase().includes(q) ||
          i.name.toLowerCase().includes(q) ||
          (i.sector ?? '').toLowerCase().includes(q) ||
          (q.includes('bank') && i.sector === 'Banking') ||
          (q.includes('oversold') && i.rsi <= 40),
      );
    }
    return list.slice(0, 12);
  }, [segment, quick, query, nonce]);

  return (
    <ToolScreen
      title="AI Screener"
      subtitle="Live multi-segment market scanner & natural-language filter"
      icon={<Search size={18} color={colors.brand} />}
    >
      <CoPilotBanner
        title="BROW AI Screener Co-Pilot"
        subtitle="Run deep multi-timeframe synthesis or cross-asset comparison on scanned names"
        actions={['Top Momentum Breakouts', 'Compare Top 2 Leaders', 'Oversold Reversals']}
      />

      <SegmentedTabs options={segments} value={segment} onChange={(v) => setSegment(v as Segment)} />

      <View style={styles.searchBox}>
        <Search size={15} color={colors.textMuted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder='Try "large cap banking gainers" or "oversold"'
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />
      </View>

      <SegmentedTabs options={quickFilters} value={quick} onChange={setQuick} size="sm" />

      <View style={styles.resultHead}>
        <Text variant="label" color={colors.textSecondary}>
          {results.length} MATCHES · {segment.toUpperCase()}
        </Text>
      </View>

      {results.length === 0 ? (
        <Card padded={false} style={styles.emptyCard}>
          <ErrorState
            message="Scanner data unavailable for this segment. Try a different segment or refresh."
            onRetry={() => setNonce((n) => n + 1)}
          />
        </Card>
      ) : (
        <View style={styles.list}>
          {results.map((i) => (
            <InstrumentRow key={i.symbol} item={i} />
          ))}
        </View>
      )}

      {/* Refine with BROW */}
      <Card style={styles.refine}>
        <View style={styles.refineHead}>
          <Sparkles size={14} color={colors.brand} />
          <Text variant="label" color={colors.textSecondary}>
            REFINE WITH BROW
          </Text>
        </View>
        <Text variant="micro" color={colors.textMuted}>
          Ask BROW to narrow these results conversationally.
        </Text>
        <Pressable style={styles.refineBtn} onPress={() => router.push('/ask')}>
          <Text variant="captionStrong" color={colors.white}>
            Ask BROW
          </Text>
          <ArrowRight size={15} color={colors.white} />
        </Pressable>
      </Card>
    </ToolScreen>
  );
}

const styles = StyleSheet.create({
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.surface, borderRadius: radii.md, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md },
  input: { flex: 1, color: colors.text, paddingVertical: spacing.md, fontSize: 14 },
  resultHead: { marginTop: spacing.xs },
  emptyCard: { paddingVertical: spacing.md },
  list: { gap: spacing.sm },
  refine: { gap: spacing.sm, backgroundColor: colors.bgElevated },
  refineHead: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  refineBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: colors.brandDim, borderRadius: radii.pill, paddingVertical: spacing.md, marginTop: spacing.xs },
});
