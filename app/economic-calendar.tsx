import { useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { CalendarDays, Radar } from 'lucide-react-native';
import { ToolScreen } from '@/components/ToolScreen';
import { Text, Card, Badge, SegmentedTabs, EmptyState } from '@/components/ui';
import { colors, radii, spacing } from '@/theme';
import { econEvents, macroRadar } from '@/data/calendar';
import type { EconEvent, EventImpact } from '@/types';

const regions = ['All', 'India', 'USA', 'Europe', 'Asia'];
const impacts = ['All', 'High', 'Medium', 'Low'];
const cats = ['All', 'Central Bank', 'Inflation', 'Jobs', 'GDP', 'Earnings'];

const impactTone: Record<EventImpact, 'negative' | 'warning' | 'neutral'> = {
  High: 'negative',
  Medium: 'warning',
  Low: 'neutral',
};

export default function EconomicCalendar() {
  const [region, setRegion] = useState('All');
  const [impact, setImpact] = useState('All');
  const [cat, setCat] = useState('All');

  const grouped = useMemo(() => {
    const filtered = econEvents.filter(
      (e) =>
        (region === 'All' || e.region === region) &&
        (impact === 'All' || e.impact === impact) &&
        (cat === 'All' || e.category === cat),
    );
    const map: Record<string, EconEvent[]> = {};
    filtered.forEach((e) => {
      (map[e.date] ??= []).push(e);
    });
    return Object.entries(map);
  }, [region, impact, cat]);

  return (
    <ToolScreen
      title="Economic Calendar"
      subtitle="Global macro catalysts & AI cross-asset impact"
      icon={<CalendarDays size={18} color={colors.brand} />}
    >
      {/* Macro radar */}
      <Card style={styles.radar}>
        <Radar size={16} color={colors.brand} />
        <View style={styles.flex}>
          <Text variant="caption">
            <Text variant="captionStrong" color={colors.brand}>
              BROW Macro Radar:
            </Text>{' '}
            {macroRadar.highImpact} high-impact catalysts · {macroRadar.surprises} data surprises
          </Text>
          <Text variant="micro" color={colors.textMuted} style={{ marginTop: 2 }}>
            Key Watch: {macroRadar.keyWatch}
          </Text>
        </View>
      </Card>

      <SegmentedTabs options={regions} value={region} onChange={setRegion} />
      <SegmentedTabs options={impacts} value={impact} onChange={setImpact} size="sm" />
      <SegmentedTabs options={cats} value={cat} onChange={setCat} size="sm" />

      {grouped.length === 0 ? (
        <Card padded={false}>
          <EmptyState
            title="No events"
            message="No macro events match these filters. Try widening your selection."
            icon={<CalendarDays size={24} color={colors.brand} />}
          />
        </Card>
      ) : (
        grouped.map(([date, events]) => (
          <View key={date} style={styles.group}>
            <Text variant="label" color={colors.textMuted} style={styles.dateLabel}>
              {date}
            </Text>
            <View style={styles.list}>
              {events.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </View>
          </View>
        ))
      )}
    </ToolScreen>
  );
}

function EventCard({ event }: { event: EconEvent }) {
  return (
    <Card style={[styles.card, { borderLeftColor: event.impact === 'High' ? colors.negative : colors.warning }]}>
      <View style={styles.cardTop}>
        <View style={styles.timeCol}>
          <Text variant="captionStrong">{event.flag}</Text>
          <Text variant="micro" color={colors.textMuted}>
            {event.time}
          </Text>
        </View>
        <View style={styles.flex}>
          <Text variant="captionStrong">{event.title}</Text>
          <View style={styles.tagRow}>
            <Badge label={event.impact.toUpperCase()} tone={impactTone[event.impact]} small />
            <Text variant="micro" color={colors.textMuted}>
              {event.category} · {event.currency}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.afp}>
        <AFP label="Actual" value={event.actual} />
        <AFP label="Forecast" value={event.forecast} />
        <AFP label="Previous" value={event.previous} />
      </View>

      <View style={styles.impactRow}>
        <Text variant="micro" color={colors.brand} style={styles.bold}>
          BROW Impact
        </Text>
        {event.browImpact.map((t) => (
          <Badge key={t} label={t} tone="neutral" small />
        ))}
      </View>
    </Card>
  );
}

function AFP({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.afpItem}>
      <Text variant="micro" color={colors.textMuted}>
        {label}
      </Text>
      <Text variant="captionStrong" color={value === 'Unavailable' ? colors.warning : colors.text}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  bold: { fontWeight: '700' },
  radar: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.bgElevated },
  group: { gap: spacing.sm },
  dateLabel: { marginTop: spacing.xs },
  list: { gap: spacing.md },
  card: { gap: spacing.md, borderLeftWidth: 3 },
  cardTop: { flexDirection: 'row', gap: spacing.md },
  timeCol: { alignItems: 'center', gap: 2, minWidth: 54 },
  tagRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: 4 },
  afp: { flexDirection: 'row', gap: spacing.sm },
  afpItem: { flex: 1, gap: 2, backgroundColor: colors.bgElevated, borderRadius: radii.md, borderWidth: 1, borderColor: colors.border, padding: spacing.sm },
  impactRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, flexWrap: 'wrap' },
});
